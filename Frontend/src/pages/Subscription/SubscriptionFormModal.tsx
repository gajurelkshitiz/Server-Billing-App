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

interface SubscriptionFormModalProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  formData: Record<string, any>;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: (e: any) => void;
  editingSubscription: boolean;
  title: string;
  loading?: boolean;
}

const SubscriptionFormModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  handleInputChange,
  handleSubmit,
  editingSubscription,
  title,
  loading = false,
}: SubscriptionFormModalProps) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className="max-w-md h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex-1 overflow-y-auto p-2"
          style={{ minHeight: 0 }}
        >
          {/* Subscription Name */}
          <div>
            <Label htmlFor="name">
              Subscription Name<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData["name"] || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Subscription Name"
              required
              className="mt-1"
              disabled={editingSubscription}
            />
          </div>

          {/* No of Companies */}
          <div>
            <Label htmlFor="maxCompanies">
              No of Companies<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="maxCompanies"
              type="number"
              value={formData["maxCompanies"] || ""}
              onChange={(e) => handleInputChange("maxCompanies", e.target.value)}
              placeholder="Num of Companies Allowed"
              required
              className="mt-1"
              disabled={editingSubscription}
            />
          </div>

          {/* Period */}
          <div>
            <Label htmlFor="period">
              Period<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="period"
              type="number"
              value={formData["period"] || ""}
              onChange={(e) => handleInputChange("period", e.target.value)}
              placeholder="Period (in days)"
              required
              className="mt-1"
              disabled={editingSubscription}
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">
              Price<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              value={formData["price"] || ""}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="Price"
              required
              className="mt-1"
              disabled={editingSubscription}
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">
              Status<span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={
                formData.status === true
                  ? "true"
                  : formData.status === false
                  ? "false"
                  : formData.status || ""
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
          </div>

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
                : editingSubscription
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionFormModal;
