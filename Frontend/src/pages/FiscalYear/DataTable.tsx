import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TableH from "./TableH";
import TableB from "./TableB";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  handleEdit: (row: any) => void;
  loading?: boolean;
}

const DataTable = ({
  data,
  columns,
  handleEdit,
  loading,
}: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0]; // Gets "2025-05-29" from "2025-05-29T00:00:00.000Z"
  };

  // Process data to format dates
  const processedData = data.map(row => ({
    ...row,
    startDate: row.startDate ? formatDate(row.startDate) : row.startDate,
    endDate: row.endDate ? formatDate(row.endDate) : row.endDate,
  }));

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = processedData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = sortField
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (sortDirection === "asc") {
          return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
      })
    : filteredData;

  return (
    <Card>
      <CardHeader>
        <div className="relative max-w-sm">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            placeholder="Search..."
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
              <TableH
                columns={columns}
                setSortField={setSortField}
                setSortDirection={setSortDirection}
                sortDirection={sortDirection}
                sortField={sortField}
              />
              <TableB
                sortedData={sortedData}
                columns={columns}
                handleEdit={handleEdit}
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
