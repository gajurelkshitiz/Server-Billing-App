import React from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { MobileTable } from "@/components/ui/mobile-table";
import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const columns = [
  { key: "sn", label: "S.N.", sortable: true, hideOnMobile: true },
  { key: "name", label: "Full Name", sortable: true, primary: true },
  { key: "profileImage", label: "Profile", hideOnMobile: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phoneNo", label: "Phone", sortable: true },
  { key: "companyName", label: "Company", sortable: true, hideOnMobile: true },
  { key: "departmentNo", label: "Department", sortable: true },
];

type UserTableProps = {
  data: User[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (user: User) => void;
  handleDelete: (user: User) => void;
};

export default function UserTable({
  data,
  loading,
  handleAdd,
  handleEdit,
  handleDelete,
}: UserTableProps) {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Header with responsive layout */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4 p-4 bg-white border rounded-lg shadow-sm">
        <CardTitle className="text-lg sm:text-xl text-gray-800">Users</CardTitle>
        <Button 
          onClick={handleAdd} 
          className="bg-blue-600 hover:bg-blue-700 w-full xs:w-auto h-10 xs:h-9"
        >
          <Plus size={16} className="mr-2" />
          Add New User
        </Button>
      </div>

      {/* Table with mobile optimization */}
      {isMobile ? (
        <MobileTable
          data={data}
          columns={columns}
          loading={loading}
          loadingTitle="users"
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No users found"
          className="mt-4"
        />
      ) : (
        <div className="mt-4">
          <DataTable
            data={data}
            columns={columns}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            loading={loading}
            loadingTitle='Users'
            previewTitle="Profile Preview"
            previewAltText="Full Size User Profile"
          />
        </div>
      )}
    </>
  );
}
