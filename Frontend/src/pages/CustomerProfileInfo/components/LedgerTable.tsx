import React, { useEffect, useRef } from "react";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface LedgerTransaction {
  date: string;
  particulars: string;
  debit: number;
  credit: number;
  runningBalance: number;
  type: string;
}

interface LedgerData {
  customer: string;
  openingBalance: number;
  openingBalanceType: string;
  transactions: LedgerTransaction[];
  closingBalance: number;
}

interface LedgerTableProps {
  ledger: LedgerData | null;
  onClose?: () => void;
}

const LedgerTable: React.FC<LedgerTableProps> = ({ ledger, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ledger || !containerRef.current) return;

    // Prepare data for Handsontable
    const hotData = ledger.transactions.map((item) => [
      item.date,
      item.particulars,
      item.debit,
      item.credit,
      `${item.runningBalance} ${item.type === "credit" ? "Cr." : "Dr."}`,
    ]);

    const hot = new Handsontable(containerRef.current, {
      data: hotData,
      colHeaders: ["Date", "Particulars", "Debit", "Credit", "Running Balance"],
      columns: [
        { data: 0, type: "text" },
        { data: 1, type: "text" },
        { data: 2, type: "numeric", numericFormat: { pattern: "0,0.00" } },
        { data: 3, type: "numeric", numericFormat: { pattern: "0,0.00" } },
        { data: 4, type: "text" },
      ],
      width: 800,
      height: 380,
      rowHeaders: true,
      licenseKey: "non-commercial-and-evaluation",
      stretchH: "none",
      className: "htCenter",
      colWidths: [100, 220, 90, 90, 130],
      autoWrapRow: true,
      autoWrapCol: true,
      cells: function (row, col) {
        const cellProperties: any = {};
        if (col === 2 && this.instance.getDataAtCell(row, 2) > 0) {
          cellProperties.className = "debit-cell";
        }
        if (col === 3 && this.instance.getDataAtCell(row, 3) > 0) {
          cellProperties.className = "credit-cell";
        }
        if (col === 4) {
          const val = this.instance.getDataAtCell(row, 4);
          if (typeof val === "string" && val.endsWith("Cr.")) {
            cellProperties.className = (cellProperties.className || "") + " credit-cell";
          } else if (typeof val === "string" && val.endsWith("Dr.")) {
            cellProperties.className = (cellProperties.className || "") + " debit-cell";
          }
        }
        return cellProperties;
      },
    });

    // Cleanup on unmount
    return () => {
      hot.destroy();
    };
  }, [ledger]);

  if (!ledger) return null;

  // for fetching other details from localStorage in ledger footer:
  const adminName = localStorage.getItem('name');
  const companyName = localStorage.getItem('companyName');

  // Use React Portal for popup/modal
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-5xl w-full p-6">
        {/* Close Button */}
        {onClose && (
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Header */}
        <div className="mb-4">
            <div className="mb-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
              Ledger for <span className="text-primary">{ledger.customer}</span>
            </h2>
            <div className="flex flex-wrap gap-6 justify-center text-base text-muted-foreground">
              <div className="flex items-center gap-1">
              <span className="font-semibold">PAN No:</span>
              <span>{ledger.panNo?.toLocaleString?.() ?? "-"}</span>
              </div>
              <div className="flex items-center gap-1">
              <span className="font-semibold">Address:</span>
              <span>{ledger.address ?? "-"}</span>
              </div>
              <div className="flex items-center gap-1">
              <span className="font-semibold">Phone No:</span>
              <span>{ledger.phoneNo ?? "-"}</span>
              </div>
            </div>
            </div>
          <div className="flex gap-6 text-sm text-muted-foreground justify-center ledger-balances">
            <span>
              <strong>Opening Balance:</strong> {ledger.openingBalance.toLocaleString("en-NP", { minimumFractionDigits: 2 })} ({ledger.openingBalanceType})
            </span>
            <span>
              <strong>Closing Balance:</strong> {ledger.closingBalance.toLocaleString("en-NP", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Handsontable Container */}
        <div ref={containerRef} />

        {/* Custom styles for cells */}
        <style>{`
          .debit-cell {
            background: #ffe0e0 !important;
            color: #c62828 !important;
            font-weight: 500;
          }
          .credit-cell {
            background: #e0ffe0 !important;
            color: #388e3c !important;
            font-weight: 500;
          }
          .ledger-balances span {
            margin-right: 2rem;
          }
        `}</style>

        {/* Footer  */}
        <div className="mb-4 flex flex-col items-end">
          <h4 className="text-base text-foreground mb-1 text-right">
            {/* yaha admin name  */}
            Generated By: {adminName}
          </h4>
            <div className="flex gap-6 text-sm text-muted-foreground ledger-balances justify-end">
            <span>
              <strong>Company Name:</strong> {companyName}
            </span>
            </div>
            <div style={{ height: "2rem" }} />
            <div className="text-right text-sm mt-2">
            <span>Signature: ____________________</span>
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LedgerTable;