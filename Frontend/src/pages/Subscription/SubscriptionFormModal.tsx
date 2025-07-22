import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/mobile-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { X, Plus } from "lucide-react";

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
  const isMobile = useIsMobile();
  // --- Add local loading state for submit button ---
  const [localLoading, setLocalLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>(formData.features || []);
  const [newFeature, setNewFeature] = useState("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalLoading(true);

    try {
      // Update formData with features before submitting
      handleInputChange("features", JSON.stringify(features));
      await handleSubmit(e);
    } finally {
      setLocalLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      const updatedFeatures = [...features, newFeature.trim()];
      setFeatures(updatedFeatures);
      handleInputChange("features", JSON.stringify(updatedFeatures));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
    handleInputChange("features", JSON.stringify(updatedFeatures));
  };

  // Update features when formData changes
  React.useEffect(() => {
    if (formData.features) {
      const parsedFeatures = typeof formData.features === 'string' 
        ? JSON.parse(formData.features) 
        : formData.features;
      setFeatures(parsedFeatures || []);
    }
  }, [formData.features]);

  return (
    <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
      <DialogContent className={`${isMobile ? 'max-w-sm h-[90vh]' : 'max-w-md h-[500px]'} flex flex-col`}>
        <DialogHeader>
          <DialogTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>
            {formData._id ? "Edit Subscription" : "Add Subscription"}
          </DialogTitle>
          <DialogDescription className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600`}>
            {formData._id 
              ? "Update the subscription plan details below." 
              : "Create a new subscription plan with features and pricing."
            }
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleFormSubmit}
          className={`space-y-4 flex-1 overflow-y-auto ${isMobile ? 'px-2' : 'p-2'}`}
          style={{ minHeight: 0 }}
        >
          {/* Subscription Name */}
          <div>
            <Label htmlFor="name" className={isMobile ? 'text-sm' : ''}>
              Subscription Name<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData["name"] || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Subscription Name"
              required
              className={`mt-1 ${isMobile ? 'text-sm' : ''}`}
              disabled={editingSubscription}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className={isMobile ? 'text-sm' : ''}>
              Description
            </Label>
            <Textarea
              id="description"
              value={formData["description"] || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the subscription plan..."
              className={`${isMobile ? 'text-sm min-h-[80px]' : 'min-h-[100px]'} resize-none mt-1`}
            />
          </div>

          {/* Pricing Section */}
          <div className="space-y-3">
            <Label className={`${isMobile ? 'text-sm' : ''} font-medium`}>Pricing</Label>
            
            {/* Original Price */}
            <div>
              <Label htmlFor="originalPrice" className={isMobile ? 'text-xs' : 'text-sm'}>
                Original Price (Rs.)<span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData["originalPrice"] || ""}
                onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                required
                placeholder="0"
                className={`mt-1 ${isMobile ? 'text-sm' : ''}`}
              />
            </div>

            {/* Discount Percentage */}
            <div>
              <Label htmlFor="discountPercentage" className={isMobile ? 'text-xs' : 'text-sm'}>
                Discount Percentage (%)
              </Label>
              <Input
                id="discountPercentage"
                type="number"
                min="0"
                max="100"
                value={formData["discountPercentage"] || ""}
                onChange={(e) => handleInputChange("discountPercentage", e.target.value)}
                placeholder="0"
                className={`mt-1 ${isMobile ? 'text-sm' : ''}`}
              />
            </div>

            {/* Final Price (calculated display) */}
            {formData.originalPrice && (
              <div className="p-2 bg-gray-50 rounded border">
                <Label className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                  Final Price: Rs. {
                    formData.discountPercentage 
                      ? (parseFloat(formData.originalPrice) * (1 - parseFloat(formData.discountPercentage) / 100)).toFixed(2)
                      : formData.originalPrice
                  }
                </Label>
              </div>
            )}
          </div>

          {/* No of Companies */}
          <div>
            <Label htmlFor="maxCompanies" className={isMobile ? 'text-sm' : ''}>
              No of Companies<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="maxCompanies"
              type="number"
              value={formData["maxCompanies"] || ""}
              onChange={(e) => handleInputChange("maxCompanies", e.target.value)}
              placeholder="Num of Companies Allowed"
              required
              className={`mt-1 ${isMobile ? 'text-sm' : ''}`}
              disabled={editingSubscription}
            />
          </div>

          {/* Period
          <div>
            <Label htmlFor="period" className={isMobile ? 'text-sm' : ''}>
              Period<span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={formData["period"] || ""}
              onValueChange={(value) => handleInputChange("period", value)}
            >
              <SelectTrigger className={`mt-1 ${isMobile ? 'text-sm' : ''}`}>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Period In Days */}
          <div>
            <Label htmlFor="periodInDays" className={isMobile ? 'text-sm' : ''}>
              Period (in days)<span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="periodInDays"
              type="number"
              min={1}
              value={formData["periodInDays"] || ""}
              onChange={(e) => handleInputChange("periodInDays", e.target.value)}
              placeholder="Enter number of days"
              required
              className={`mt-1 ${isMobile ? 'text-sm' : ''}`}
              disabled={editingSubscription}
            />
          </div>

          {/* Features Section */}
          <div className="space-y-3">
            <Label className={`${isMobile ? 'text-sm' : ''} font-medium`}>Features</Label>
            
            {/* Features List */}
            {features.length > 0 && (
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className={`${isMobile ? 'text-xs' : 'text-sm'} flex-1`}>{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Feature Input */}
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature..."
                className={`flex-1 ${isMobile ? 'text-sm' : ''}`}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
                disabled={!newFeature.trim()}
                className="px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Promotional Flags */}
          <div className="space-y-3">
            <Label className={`${isMobile ? 'text-sm' : ''} font-medium`}>Promotional Settings</Label>
            
            <div className="space-y-2">
              {/* Popular Flag */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPopular"
                  checked={formData["isPopular"] === "true" || formData["isPopular"] === true}
                  onCheckedChange={(checked) => handleInputChange("isPopular", checked.toString())}
                />
                <Label htmlFor="isPopular" className={`${isMobile ? 'text-sm' : ''} cursor-pointer`}>
                  Mark as Popular
                </Label>
              </div>

              {/* Best Offer Flag */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isBestOffer"
                  checked={formData["isBestOffer"] === "true" || formData["isBestOffer"] === true}
                  onCheckedChange={(checked) => handleInputChange("isBestOffer", checked.toString())}
                />
                <Label htmlFor="isBestOffer" className={`${isMobile ? 'text-sm' : ''} cursor-pointer`}>
                  Mark as Best Offer
                </Label>
              </div>

              {/* Flash Sale Flag */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFlashSale"
                  checked={formData["isFlashSale"] === "true" || formData["isFlashSale"] === true}
                  onCheckedChange={(checked) => handleInputChange("isFlashSale", checked.toString())}
                />
                <Label htmlFor="isFlashSale" className={`${isMobile ? 'text-sm' : ''} cursor-pointer`}>
                  Flash Sale
                </Label>
              </div>

              {/* Flash Sale End Date */}
              {(formData.isFlashSale === "true" || formData.isFlashSale === true) && (
                <div>
                  <Label htmlFor="flashSaleEndDate" className={isMobile ? 'text-xs' : 'text-sm'}>
                    Flash Sale End Date
                  </Label>
                  <Input
                    id="flashSaleEndDate"
                    type="datetime-local"
                    value={formData["flashSaleEndDate"] || ""}
                    onChange={(e) => handleInputChange("flashSaleEndDate", e.target.value)}
                    className={`mt-1 ${isMobile ? 'text-sm' : ''}`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status" className={isMobile ? 'text-sm' : ''}>
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
              <SelectTrigger id="status" className={`mt-1 ${isMobile ? 'text-sm' : ''}`}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-3'} pt-4`}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
              disabled={loading || localLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 bg-blue-600 hover:bg-blue-700 ${isMobile ? 'text-sm' : ''}`}
              disabled={loading || localLoading}
            >
              {(loading || localLoading)
                ? (
                  <>
                    <span className="loader mr-2"></span> Processing...
                  </>
                )
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
