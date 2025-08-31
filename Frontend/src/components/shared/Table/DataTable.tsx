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
import { FaFilter } from "react-icons/fa";

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
  handleDelete: (row: any) => void;
  loading?: boolean;
  loadingTitle: string;
  previewTitle: string;
  previewAltText: string;
  showVerificationAction?: boolean;
  handleSendVerification?: (row: any) => Promise<void>;
  verificationLoading?: Set<string | number>;
  filterForm?: React.ReactNode;
  // Add pagination props
  currentPage?: number;
  pageSize?: number;
  rowActions?: (row: any) => React.ReactNode;
}

const DataTable = ({
  data,
  columns,
  handleEdit,
  handleDelete,
  loading,
  loadingTitle,
  previewTitle,
  previewAltText,
  showVerificationAction = false,
  handleSendVerification,
  verificationLoading = new Set(),
  filterForm,
  currentPage = 1,
  pageSize = 10,
  rowActions,
}: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilter, setShowFilter] = useState(false);

  // Process data through utility functions
  const processedData = processDataDates(data);
  const filteredData = filterData(processedData, searchTerm);
  const sortedData = sortData(filteredData, sortField, sortDirection);
  // Pass pagination parameters to addSerialNumbers
  const dataWithSerialNumbers = addSerialNumbers(sortedData, currentPage, pageSize);

  console.log('Inside of Common DataTable: ', data);
  console.log('Data With Serial Numbers are: ', dataWithSerialNumbers);


  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-sm flex items-center">
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
            {filterForm && (
              <Button
                type="button"
                variant="outline"
                className="ml-2 flex items-center bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold border-gray-300 shadow-sm"
                onClick={() => setShowFilter((prev) => !prev)}
                title="Apply Filters"
              >
                <FaFilter />
                Apply Filters
              </Button>
            )}
          </div>
        </div>
        {showFilter && filterForm && (
          <div className="mt-4 bg-gray-50 p-4 rounded shadow flex flex-wrap gap-4">
            {filterForm}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Loading {loadingTitle}...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
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
                showVerificationAction={showVerificationAction}
                handleSendVerification={handleSendVerification}
                verificationLoading={verificationLoading}
                rowActions={rowActions}
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

