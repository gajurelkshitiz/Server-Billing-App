import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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
  // onAdd: () => void;
  handleEdit: (row: any) => void;
  handleDelete: (row: any) => void;
  loading?: boolean;
}

const DataTable = ({
  data,
  columns,
  handleEdit,
  handleDelete,
  loading,
}: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredData = data.filter((row) =>
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
              Loding...
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
                handleDelete={handleDelete}
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
