import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  ChevronRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MobileTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  hideOnMobile?: boolean;
  primary?: boolean; // Shows on mobile card header
}

interface MobileTableProps {
  data: any[];
  columns: MobileTableColumn[];
  loading?: boolean;
  loadingTitle?: string;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  customActions?: (row: any) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export const MobileTable: React.FC<MobileTableProps> = ({
  data,
  columns,
  loading,
  loadingTitle = 'items',
  onEdit,
  onDelete,
  onView,
  customActions,
  emptyMessage = 'No data found',
  className
}) => {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">Loading {loadingTitle}...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center min-h-[200px]">
          <p className="text-gray-500">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  if (isMobile) {
    // Mobile Card Layout
    return (
      <div className={cn("space-y-3", className)}>
        {data.map((row, index) => (
          <MobileTableCard
            key={row.id || index}
            row={row}
            columns={columns}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            customActions={customActions}
          />
        ))}
      </div>
    );
  }

  // Desktop Table Layout
  return (
    <Card className={cn("w-full", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-3 px-4 font-semibold text-sm text-gray-700"
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete || onView || customActions) && (
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id || index} className="border-b hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="py-3 px-4 text-sm">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete || onView || customActions) && (
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(row)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye size={16} />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(row)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Edit size={16} />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(row)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                      {customActions && customActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

interface MobileTableCardProps {
  row: any;
  columns: MobileTableColumn[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  customActions?: (row: any) => React.ReactNode;
}

const MobileTableCard: React.FC<MobileTableCardProps> = ({
  row,
  columns,
  onEdit,
  onDelete,
  onView,
  customActions
}) => {
  const primaryColumn = columns.find(col => col.primary);
  const visibleColumns = columns.filter(col => !col.hideOnMobile);
  const hasActions = onEdit || onDelete || onView || customActions;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* Primary field (header) */}
            {primaryColumn && (
              <div className="font-semibold text-gray-900">
                {primaryColumn.render 
                  ? primaryColumn.render(row[primaryColumn.key], row)
                  : row[primaryColumn.key]
                }
              </div>
            )}
            
            {/* Other fields */}
            <div className="space-y-1">
              {visibleColumns
                .filter(col => !col.primary)
                .slice(0, 3) // Show max 3 additional fields
                .map((column) => (
                  <div key={column.key} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 min-w-0 flex-1">
                      {column.label}:
                    </span>
                    <span className="text-gray-900 ml-2 flex-shrink-0">
                      {column.render 
                        ? column.render(row[column.key], row)
                        : (row[column.key] || '-')
                      }
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Actions */}
          {hasActions && (
            <div className="ml-3 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onView && (
                    <DropdownMenuItem onClick={() => onView(row)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(row)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(row)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Status badge component for mobile
interface MobileStatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const MobileStatusBadge: React.FC<MobileStatusBadgeProps> = ({
  status,
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  return (
    <Badge className={cn('text-xs', variants[variant])}>
      {status}
    </Badge>
  );
};
