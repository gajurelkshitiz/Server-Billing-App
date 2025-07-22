import React from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { MobileTable } from "@/components/ui/mobile-table";
import { useIsMobile } from "@/hooks/use-mobile";
import { Company } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBatch";

const columns = [
  { key: "sn", label: "S.N.", sortable: true, hideOnMobile: true },
  { key: "name", label: "Company Name", sortable: true, primary: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phoneNo", label: "Phone Number", sortable: true },
  { key: "address", label: "Address", sortable: true, hideOnMobile: true },
  { key: "logo", label: 'Company Logo', hideOnMobile: true },
  { key: "vat", label: "Vat", sortable: true, hideOnMobile: true },
  // Active/ inactive ko lagi pachi status dekhaune yesma
  {
    key: "industrytype",
    label: "Industry",
    sortable: true,
  },
];

type CompanyPageProps = {
  data: Company[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (company: Company) => void;
  handleDelete: (company: Company) => void;
};

export default function CompanyTable({
  data,
  loading,
  handleAdd,
  handleEdit,
  handleDelete,
}: 
CompanyPageProps) {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Header with responsive layout */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4 p-4 bg-white border rounded-lg shadow-sm">
        <CardTitle className="text-lg sm:text-xl text-gray-800">Companies</CardTitle>
        <Button 
          onClick={handleAdd} 
          className="bg-blue-600 hover:bg-blue-700 w-full xs:w-auto h-10 xs:h-9"
        >
          <Plus size={16} className="mr-2" />
          Add New Company
        </Button>
      </div>

      {/* Table with mobile optimization */}
      {isMobile ? (
        <MobileTable
          data={data}
          columns={columns}
          loading={loading}
          loadingTitle="companies"
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No companies found"
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
            loadingTitle='Companies'
            previewTitle='Company Logo'
            previewAltText='Full Size Company Logo'
          />
        </div>
      )}
    </>
  );
}
