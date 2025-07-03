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
import { processDataDates } from "@/utils/dateUtils";
import { filterData, sortData, addSerialNumbers, handleSortLogic } from "@/utils/tableUtils";

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

  const handleSort = (field: string) => {
    handleSortLogic(sortField, field, sortDirection, setSortField, setSortDirection);
  };

  // Process data through utility functions
  const processedData = processDataDates(data);
  const filteredData = filterData(processedData, searchTerm);
  const sortedData = sortData(filteredData, sortField, sortDirection);
  const dataWithSerialNumbers = addSerialNumbers(sortedData);

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
                sortedData={dataWithSerialNumbers}
                columns={columns}
                handleEdit={handleEdit}
              />
            </table>

            {dataWithSerialNumbers.length === 0 && (
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
