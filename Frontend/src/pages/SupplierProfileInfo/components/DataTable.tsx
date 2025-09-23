import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
  width?: string;
}

interface DataTableProps {
  title: string;
  data: any[];
  columns: Column[];
  icon?: React.ReactNode;
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({ 
  title, 
  data, 
  columns, 
  icon, 
  emptyMessage 
}) => {
  if (!data.length) {
    return (
      <Card className="border border-border/40 shadow-sm bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
            {icon && <div className="text-primary">{icon}</div>}
            {title}
            <Badge variant="secondary" className="ml-auto">
              {data.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              {icon && <div className="text-muted-foreground opacity-50">{icon}</div>}
            </div>
            <p className="text-muted-foreground font-medium">
              {emptyMessage || `No ${title.toLowerCase()} found`}
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Data will appear here when available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/40 shadow-sm bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
          {icon && <div className="text-primary">{icon}</div>}
          {title}
          <Badge variant="secondary" className="ml-auto">
            {data.length} {data.length === 1 ? 'record' : 'records'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
        <thead className="bg-muted/30">
          <tr className="border-b border-border/40">
            {columns.map((column) => (
          <th 
            key={column.key} 
            className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground uppercase tracking-wide"
            style={{ width: column.width }}
          >
            {column.header}
          </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {data.map((row, index) => (
            <tr 
              key={row._id ? String(row._id) : String(index)} 
              className="hover:bg-muted/20 transition-colors duration-150"
            >
              {columns.map((column) => {
                const cellValue = row[column.key];
                return (
                  <td 
                    key={column.key} 
                    className={`py-4 px-6 text-sm ${column.className || ''}`}
                  >
                    {column.render ? column.render(cellValue, row) : (
                      <span className="text-foreground">
                        {cellValue || '-'}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;