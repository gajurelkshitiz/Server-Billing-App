import React from "react";
import DataTable from "@/components/shared/Table/DataTable";
import { MobileTable } from "@/components/ui/mobile-table";
import { useIsMobile } from "@/hooks/use-mobile";
import { Subscription } from "./types";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/statusBatch";

const columns = [
  { key: "name", label: "Subscription Name", sortable: true, primary: true },
  { key: "maxCompanies", label: "Allowed Companies", sortable: true, hideOnMobile: true },
  // { 
  //   key: "period", 
  //   label: "Period", 
  //   sortable: true,
  //   render: (value: string) => (
  //     <span className="capitalize">
  //       {value === "monthly" ? "Monthly" : value === "quarterly" ? "Quarterly" : "Yearly"}
  //     </span>
  //   )
  // },
  { 
    key: "periodInDays", 
    label: "Period", 
    sortable: true,
    render: (value: number) => {
      if (value === 30) return "Monthly";
      if (value === 90) return "Quarterly";
      if (value === 365) return "Yearly";
      return `${value} days`;
    }
  },
  { 
    key: "price", 
    label: "Price", 
    sortable: true,
    render: (value: number, row: Subscription) => {
      const originalPrice = row.originalPrice || value;
      const discountPercentage = row.discountPercentage || 0;
      const finalPrice = discountPercentage > 0 
        ? originalPrice * (1 - discountPercentage / 100) 
        : originalPrice;
      
      return (
        <div className="flex flex-col">
          {discountPercentage > 0 ? (
            <>
              <span className="text-sm line-through text-gray-500">Rs. {originalPrice}</span>
              <span className="text-green-600 font-medium">Rs. {finalPrice.toFixed(2)}</span>
              <span className="text-xs text-blue-600">({discountPercentage}% off)</span>
            </>
          ) : (
            <span className="font-medium">Rs. {finalPrice}</span>
          )}
        </div>
      );
    }
  },
  {
    key: "features",
    label: "Features",
    sortable: false,
    hideOnMobile: true,
    render: (value: string[]) => (
      <div className="max-w-xs">
        {value && value.length > 0 ? (
          <span className="text-sm text-gray-600">
            {value.length} feature{value.length > 1 ? 's' : ''}
          </span>
        ) : (
          <span className="text-xs text-gray-400">No features</span>
        )}
      </div>
    )
  },
  // Active/ inactive ko lagi pachi status dekhaune yesma
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (value: any) => <StatusBadge value={value} />,
  },
];

type SubscriptionPageProps = {
  data: Subscription[];
  loading: boolean;
  handleAdd: () => void;
  handleEdit: (subscription: Subscription) => void;
  handleDelete: (subscription: Subscription) => void;
};

export default function SubscriptionTable({
  data,
  loading,
  handleAdd,
  handleEdit,
  handleDelete,
}: 
SubscriptionPageProps) {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Header with responsive layout */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4 p-4 bg-white border rounded-lg shadow-sm">
        <CardTitle className="text-lg sm:text-xl text-gray-800">Subscriptions</CardTitle>
        <Button 
          onClick={handleAdd} 
          className="bg-blue-600 hover:bg-blue-700 w-full xs:w-auto h-10 xs:h-9"
        >
          <Plus size={16} className="mr-2" />
          Add New Subscription
        </Button>
      </div>

      {/* Table with mobile optimization */}
      {isMobile ? (
        <MobileTable
          data={data}
          columns={columns}
          loading={loading}
          loadingTitle="subscriptions"
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No subscriptions found"
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
            loadingTitle='Subscriptions'
            previewTitle=''
            previewAltText=""
          />
        </div>
      )}
    </>
  );
}
