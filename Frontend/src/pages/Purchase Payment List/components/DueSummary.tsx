import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Customer {
  _id: string;
  name: string;
  // Add other fields as needed
}

interface SalesSummary {
  supplierID: string;
  companyID: string;
  totalAmount: number;
  totalPaid: number;
  totalDueAmount: number;
  totalDueLeft: number;
}

interface Props {
  summary: SalesSummary;
  selectedSupplier: Customer | null;
  showPayForm: boolean;
  setShowPayForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const DueSummary: React.FC<Props> = ({ summary, selectedSupplier, showPayForm, setShowPayForm }) => (
  <Card className="my-4">
    <CardContent className="flex gap-8 p-4">
      <div className="flex-1 flex gap-8">
        <div>
          <div className="text-gray-600 text-sm">Total Due Left</div>
          <div className="font-bold text-lg text-green-600">{summary.totalDueLeft}</div>
        </div>
        <div>
          <div className="text-gray-600 text-sm">Total Paid Amount</div>
          <div className="font-bold text-lg">{summary.totalPaid}</div>
        </div>
      </div>
      
      {/* #TODO: yaha euta last paid date, vanne value dekhauchhu */}

      <div className="flex items-center ml-auto">
        {selectedSupplier && !showPayForm && (
          <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        onClick={() => setShowPayForm(true)}
          >
        Pay Now
          </button>
        )}
      </div>
    </CardContent>
  </Card>
);

export default DueSummary;