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
import TableB from "./TableB"
import { addSerialNumbers, filterData, sortData } from "@/utils/tableUtils";
import { processDataDates } from "@/utils/dateUtils";

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
  loadingTitle: string;
  previewTitle: string;
  previewAltText: string;
}

const DataTable = ({
  data,
  columns,
  handleEdit,
  handleDelete,
  loading,
  loadingTitle,
  previewTitle,
  previewAltText
}: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");


  // Process data through utility functions
  const processedData = processDataDates(data);
  const filteredData = filterData(processedData, searchTerm);
  const sortedData = sortData(filteredData, sortField, sortDirection);
  const dataWithSerialNumbers = addSerialNumbers(sortedData);

  console.log('Inside of Common DataTable: ', data);
  console.log('Data With Serial Numbers are: ', dataWithSerialNumbers);


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
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Loading {loadingTitle}...</p>
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
                handleDelete={handleDelete}
                previewTitle={previewTitle}
                previewAltText={previewAltText}
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
