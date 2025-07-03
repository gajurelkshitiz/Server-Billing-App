import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { DataTableProps } from "./types";

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  loading = false,
  onEdit,
  onDelete,
  searchPlaceholder = "Search...",
  title,
  showActions = true,
  showEditAction = true,
  showDeleteAction = true,
  customActions
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  // Process data to format dates
  const processedData = data.map(row => {
    const processedRow = { ...row };
    Object.keys(processedRow).forEach(key => {
      if (key.toLowerCase().includes('date') && processedRow[key]) {
        processedRow[key] = formatDate(processedRow[key]);
      }
    });
    return processedRow;
  });

  // Filter data
  const filteredData = processedData.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Card>
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600">
              Loading...
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHeader
                columns={columns}
                sortField={sortField}
                sortDirection={sortDirection}
                setSortField={setSortField}
                setSortDirection={setSortDirection}
                showActions={showActions}
              />
              <TableBody
                data={sortedData}
                columns={columns}
                onEdit={onEdit}
                onDelete={onDelete}
                showActions={showActions}
                showEditAction={showEditAction}
                showDeleteAction={showDeleteAction}
                customActions={customActions}
              />
            </table>

            {sortedData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No data found
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;