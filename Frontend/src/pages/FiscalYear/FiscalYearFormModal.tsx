import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NepaliDate from "@/components/common/DatePicker";

interface FiscalYearFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  formData: Record<string, any>;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: (e: any) => void;
  editingFiscalYear: boolean;
  title: string;
  loading?: boolean;
}

const FiscalYearFormModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  handleInputChange,
  handleSubmit,
  editingFiscalYear,
  title,
  loading = false,
}: FiscalYearFormModalProps) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="max-w-md h-[480px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex-1 overflow-y-auto p-2"
          style={{ minHeight: 0 }}
        >

          {/* Start Fiscal Date (Nepali) */}
          <Label htmlFor="nepaliDate" className="mt-4">
            Start Date (BS)<span className="text-red-500 ml-1">*</span>
          </Label>
          <NepaliDate
            handleInputChange={handleInputChange}
            formData={formData}
            fieldName="startDate"
            position="after"
          />

          {/* End Fiscal Date (Nepali) */}
          <Label htmlFor="nepaliDate" className="mt-4">
            End Date (BS)<span className="text-red-500 ml-1">*</span>
          </Label>
          <NepaliDate
            handleInputChange={handleInputChange}
            formData={formData}
            fieldName="endDate"
          />

          {/* FiscalYear Name */}
          <Label htmlFor="name">
            FiscalYear Name<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            value={formData["name"] || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="FiscalYear Name (e.g. 2082/83)"
            required
            className="mt-1"
            disabled={editingFiscalYear}
          />
          
          {/* Status */}
          <Label htmlFor="status">
            Status<span className="text-red-500 ml-1">*</span>
          </Label>
          <Select
            value={
              formData.status === true
                ? "true"
                : formData.status === false
                ? "false"
                : 
                formData.status || ""
            }
            onValueChange={(value) => handleInputChange("status", value)}
            required
          >
            <SelectTrigger id="status" className="mt-1">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : editingFiscalYear
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FiscalYearFormModal;
