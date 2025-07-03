import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Column } from "./types";

interface TableHeaderProps {
  columns: Column[];
  sortField: string;
  sortDirection: "asc" | "desc";
  setSortField: (field: string) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  showActions?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
  showActions = true
}) => {
  const handleSort = (columnKey: string) => {
    if (sortField === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(columnKey);
      setSortDirection("asc");
    }
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`text-left py-3 px-4 font-semibold ${
              column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
            }`}
            onClick={() => column.sortable && handleSort(column.key)}
          >
            <div className="flex items-center space-x-1">
              <span>{column.label}</span>
              {column.sortable && (
                <div className="flex flex-col">
                  <ChevronUp
                    size={12}
                    className={`${
                      sortField === column.key && sortDirection === "asc"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                  <ChevronDown
                    size={12}
                    className={`${
                      sortField === column.key && sortDirection === "desc"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                </div>
              )}
            </div>
          </th>
        ))}
        {showActions && (
          <th className="text-left py-3 px-4 font-semibold">Actions</th>
        )}
      </tr>
    </thead>
  );
};

export default TableHeader;