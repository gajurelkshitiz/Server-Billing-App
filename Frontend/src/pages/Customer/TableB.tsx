import { Button } from "@/components/ui/button";
import { METHODS } from "http";
import { AppleIcon, Edit, Trash2 } from "lucide-react";
import React from "react";

type Props = {
  sortedData: any;
  columns: any;
  handleEdit: any;
  handleDelete: any;
};

const TableB = (props: Props) => {
  const { handleEdit, sortedData, columns, handleDelete } = props;
  return (
    <tbody>
      {sortedData.map((row, index) => (
        <tr key={index} className="border-b hover:bg-gray-50">
          {columns.map((column) => (
            <td key={column.key} className="py-3 px-4">
              {column.render
                ? column.render(row[column.key], row)
                : row[column.key]}
            </td>
          ))}
          <td className="py-3 px-4">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log("Edit row:", row);
                  handleEdit(row);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log("Delete row:", row);
                  handleDelete(row);
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default TableB;