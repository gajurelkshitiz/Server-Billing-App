import React from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { Admin } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/ui/verified-badge";

const columns = [
  { key: 'sn', label: "S.N.", sortable: true},
  { key: "name", label: "Full Name", sortable: true },
  { key: "profileImage", label: "Profile"},
  { key: "email", label: "Email", sortable: true },
  { key: "phoneNo", label: "Phone", sortable: true },
  { key: "subsName", label: "Subscription", sortable: true },
  { key: "mode", 
    label: "Accounting Mode", 
    sortable: true,
    render: (value: string) => (
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <label>
          <input
            type="checkbox"
            checked={value === "computerized"}
            readOnly
          />{" "}
          Computerized
        </label>
        <label>
          <input
            type="checkbox"
            checked={value === "manual"}
            readOnly
          />{" "}
          Manual
        </label>
      </div>
    )
  },
  { 
    key: "isVerified", 
    label: "Verified", 
    sortable: true,
    render: (value: boolean) => <VerifiedBadge isVerified={value} />
  },
];

type AdminTableProps = {
  data: Admin[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (admin: Admin) => void;
  handleDelete: (admin: Admin) => void;
  handleSendVerification?: (admin: Admin) => Promise<void>;
  verificationLoading?: Set<string | number>; // Add this
};

export default function AdminTable({
  data,
  loading,
  handleAdd,
  handleEdit,
  handleDelete,
  handleSendVerification,
  verificationLoading = new Set() // Add this
}: AdminTableProps) {

  const handleSendVerificationLink = async (admin: Admin) => {
    console.log("Sending verification link to:", admin.email);
    if (handleSendVerification) {
      await handleSendVerification(admin);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 border-2">
        <CardTitle className="text-lg sm:text-xl">Admins</CardTitle>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Plus size={16} className="mr-2" />
          Add New
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        loading={loading}
        loadingTitle='Customers'
        previewTitle='Profile Preview'
        previewAltText='Full Size Profile'
        showVerificationAction={true}
        handleSendVerification={handleSendVerificationLink}
        verificationLoading={verificationLoading} // Pass this
      />
    </>
  );
}
