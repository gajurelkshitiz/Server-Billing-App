import React, { useCallback, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { LuPrinter } from "react-icons/lu";
import { FaCheckCircle } from "react-icons/fa";
import { BsXCircleFill } from "react-icons/bs";

const BillPreviewModal = ({ isOpen, onClose, salesEntryId, title }) => {
  const [showPrintConfirmation, setShowPrintConfirmation] = useState(false);

  const pdfUrl = `http://localhost:8000/api/preview-invoice?computerizedSalesEntryID=${salesEntryId}`;

  // Handler for incrementing print count
  const handleIncrementPrintCount = useCallback(async () => {
    try {
      await fetch(
        `${import.meta.env.REACT_APP_API_URL}/computerizedSalesEntry/increment-print-count`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Role": localStorage.getItem("role") || "",
          },
          body: JSON.stringify({ computerizedSalesEntryID: salesEntryId }),
        }
      );
    } catch (e) {
      // Optionally handle error
    }
  }, [salesEntryId]);

  // Handler for closing the modal
  const handleClose = useCallback(() => {
    setShowPrintConfirmation(true);
  }, []);

  // Handler for print confirmation - Yes
  const handlePrintSuccess = useCallback(async () => {
    await handleIncrementPrintCount();
    setShowPrintConfirmation(false);
    onClose();
  }, [handleIncrementPrintCount, onClose]);

  // Handler for print confirmation - No
  const handlePrintCancel = useCallback(() => {
    setShowPrintConfirmation(false);
    onClose();
  }, [onClose]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{title || "Bill Preview"}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto border rounded bg-gray-50 flex flex-col items-center justify-center">
            {/* PDF Preview */}
            <iframe
              src={pdfUrl}
              title="Bill Preview"
              width="100%"
              height="600px"
              style={{ border: "none" }}
            />
          </div>
          {/* Footer with instruction and Cancel button */}
          <div className="flex flex-col items-center mt-4">
            <div className="mb-2 text-gray-700 text-sm flex items-center">
              Use Ctrl+P or{" "}
              <span className="mx-1 inline-flex items-center p-1 rounded bg-gray-100">
                <LuPrinter size={20} />
              </span>{" "}
              to print this document.
            </div>
            <Button variant="outline" onClick={handleClose}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Confirmation Dialog */}
      <Dialog open={showPrintConfirmation} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LuPrinter className="text-blue-600" size={24} />
              Print Confirmation
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 mb-6 text-center">
              Was your print completed successfully?
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handlePrintSuccess}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6"
              >
                <FaCheckCircle size={18} />
                Yes, print successful
              </Button>
              <Button
                onClick={handlePrintCancel}
                variant="outline"
                className="flex items-center gap-2 px-6"
              >
                <BsXCircleFill size={18} />
                No, cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BillPreviewModal;
