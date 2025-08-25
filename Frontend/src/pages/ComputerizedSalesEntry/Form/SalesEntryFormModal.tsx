import React, { useState, useEffect } from "react";
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
import { useCustomers } from "@/pages/Customer/useCustomers";
import { Customer } from "../../Customer/types";
import NepaliDate from "../../../components/common/DatePicker";
import ImagePreview from "../../../components/common/ImagePreview";
import { getAuthHeaders } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";

// Extend the Window interface to include the '$' property for jQuery
declare global {
  interface Window {
    $: any;
  }
}

// --- Props interface for the modal component ---
interface SalesEntryFormModalProps {
  isModalOpen: boolean; // Controls modal visibility
  setIsModalOpen: (open: boolean) => void; // Function to open/close modal
  formData: Record<string, any>; // Holds current form values
  handleInputChange: (name: string, value: any) => void; // Updates form values
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // Handles form submission
  editingSalesEntry: boolean; // True if editing, false if creating
  title: string; // Modal title
  // loading?: boolean; // Loading state for submit button
}

// --- Main component definition ---
const SalesEntryFormModal: React.FC<SalesEntryFormModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  handleInputChange,
  handleSubmit,
  editingSalesEntry,
  title,
  // loading = false,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [sameAsCustomer, setSameAsCustomer] = useState(false);

  const companyID = localStorage.getItem('companyID');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Item dropdown states
  const [itemCodeDropdowns, setItemCodeDropdowns] = useState<{[key: number]: boolean}>({});
  const [descriptionDropdowns, setDescriptionDropdowns] = useState<{[key: number]: boolean}>({});
  const [groupDropdowns, setGroupDropdowns] = useState<{[key: number]: boolean}>({});
  const [selectedGroups, setSelectedGroups] = useState<{[key: number]: string}>({});
  const [itemCodeSearch, setItemCodeSearch] = useState<{[key: number]: string}>({});
  const [descriptionSearch, setDescriptionSearch] = useState<{[key: number]: string}>({});


  // Use the hook to get fetchCustomers
  const { fetchCustomers } = useCustomers();

  // Load item templates from localStorage (Sales Configuration)
  const [itemTemplates, setItemTemplates] = useState<any[]>([]);

  // Get unique groups from item templates
  const uniqueGroups = [...new Set(itemTemplates.map(item => item.group).filter(Boolean))];

  // Filter items based on search and group selection
  const getFilteredItemsByCode = (searchTerm: string) => {
    return itemTemplates.filter(item => 
      item.itemCode && item.itemCode.toString().includes(searchTerm)
    );
  };

  const getFilteredItemsByDescription = (searchTerm: string, selectedGroup?: string) => {
    let filtered = itemTemplates;
    
    if (selectedGroup) {
      filtered = filtered.filter(item => item.group === selectedGroup);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };
  useEffect(() => {
    // const saved = localStorage.getItem("sales_item_templates");
    // if (saved) setItemTemplates(JSON.parse(saved));

    const fetchItems = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `${import.meta.env.REACT_APP_API_URL}/item-configuration?companyID=${companyID}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders(),
              },
            }
          );
          if (!res.ok) throw new Error("Failed to fetch items");
          const data = await res.json();
          setItemTemplates(data.itemsConfig || []);
        } catch (err) {
          toast({
            title: "Failed to fetch items",
            description: err instanceof Error ? err.message : "",
            variant: "destructive",
          });
        }
        setLoading(false);
  };
  
  fetchItems();

  // for debugging purpose:
  console.log('itemTemplates after fetching is: ', itemTemplates);
  }, [companyID]);

  useEffect(() => {
    if (isModalOpen) {
      loadCustomers();
      // Set image preview for existing sales entry when editing
      if (editingSalesEntry && formData.billAttachment) {
        setImagePreview(formData.billAttachment);
      } else {
        setImagePreview(null);
      }
    }
  }, [isModalOpen, editingSalesEntry, formData.billAttachment]);

  useEffect(() => {
    if (sameAsCustomer) {
      const selectedCustomer = customers.find(
        (c) => c._id === formData.customerID
      );
      handleInputChange(
        "shipperName",
        selectedCustomer ? selectedCustomer.name : ""
      );
      handleInputChange(
        "shipperAddress",
        selectedCustomer ? selectedCustomer.address || "" : ""
      );
    } else {
      // Clear fields when unchecked
      handleInputChange("shipperName", "");
      handleInputChange("shipperAddress", "");
    }
  }, [formData.customerID, sameAsCustomer, customers]);

  useEffect(() => {
    if (isModalOpen && (!formData.items || formData.items.length === 0)) {
      handleInputChange("items", [
        {
          itemCode: "",
          description: "",
          hsCode: "",
          quantity: "",
          unit: "",
          price: "",
          amount: "",
          discount: 0,
          discountType: "percentage",
          netAmount: 0,
        },
      ]);
    }
  }, [isModalOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setItemCodeDropdowns({});
        setDescriptionDropdowns({});
        setGroupDropdowns({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const customersData = await fetchCustomers();
      setCustomers(customersData);
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) setImagePreview(null);
  };

  const handleImageFileChange = (name: string, file: File | null) => {
    if (!file) {
      setImagePreview(null);
      handleInputChange(name, null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    handleInputChange(name, file);
  };

  // Helper function to select an item and autofill data
  const selectItem = (idx: number, selectedItem: any) => {
    const newItems = [...(formData.items || [])];
    newItems[idx] = {
      ...newItems[idx],
      itemCode: selectedItem.itemCode || "",
      description: selectedItem.description || "",
      hsCode: selectedItem.hsCode || "",
      unit: selectedItem.unit || "",
      price: selectedItem.salesPrice || "",
      // Recalculate amount if quantity exists
      amount: newItems[idx].quantity && selectedItem.salesPrice
        ? (parseFloat(newItems[idx].quantity) * parseFloat(selectedItem.salesPrice)).toFixed(2)
        : ""
    };
    
    // Calculate net amount
    newItems[idx].netAmount = calculateItemNetAmount(newItems[idx]);
    
    handleInputChange("items", newItems);
    
    // Update search states to reflect selected values
    setItemCodeSearch(prev => ({ ...prev, [idx]: selectedItem.itemCode || "" }));
    setDescriptionSearch(prev => ({ ...prev, [idx]: selectedItem.description || "" }));
    
    // Close dropdowns
    setItemCodeDropdowns(prev => ({ ...prev, [idx]: false }));
    setDescriptionDropdowns(prev => ({ ...prev, [idx]: false }));
  };
  const calculateItemNetAmount = (item: any) => {
    const baseAmount = parseFloat(item.amount) || 0;
    const discount = parseFloat(item.discount) || 0;
    const discountType = item.discountType || "percentage";

    let discountAmount = 0;
    if (discountType === "percentage") {
      discountAmount = (baseAmount * discount) / 100;
    } else {
      discountAmount = discount;
    }

    const netAmount = Math.max(0, baseAmount - discountAmount);
    return netAmount;
  };

  // --- Handles form submission, resets image preview after submit ---
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      await handleSubmit(e);
      setImagePreview(null);
    } finally {
      setLocalLoading(false);
    }
  };

  // Calculate total from items base amounts
  const total = (formData.items || []).reduce(
    (sum: number, item: any) => sum + (parseFloat(item.amount) || 0),
    0
  );

  // Calculate taxable amount (sum of net amounts after item-level discounts)
  const taxableAmount = (formData.items || []).reduce(
    (sum: number, item: any) => sum + (parseFloat(item.netAmount) || 0),
    0
  );

  // VAT
  const vatPercent = parseFloat(formData.vat) || 0;
  const vatAmount = (taxableAmount * vatPercent) / 100;

  // Grand Total
  const grandTotal = taxableAmount + vatAmount;

  // Update form data whenever calculations change
  useEffect(() => {
    handleInputChange("total", total);
    handleInputChange("taxableAmount", taxableAmount);
    handleInputChange("vatAmount", vatAmount);
    handleInputChange("grandTotal", grandTotal);
  }, [total, taxableAmount, vatAmount, grandTotal]);

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-6xl h-[700px] flex flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleFormSubmit}
            className="space-y-4 flex-1 overflow-y-auto p-2"
            style={{ minHeight: 0 }}
          >
            {/* Customer Name (Select) */}
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-2">
                <Label htmlFor="customerID">
                  Customer Name
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  value={formData["customerID"] || ""}
                  onValueChange={(value) =>
                    handleInputChange("customerID", value)
                  }
                  disabled={loadingCustomers}
                >
                  <SelectTrigger id="customerID">
                    <SelectValue
                      placeholder={
                        loadingCustomers ? "Loading..." : "Select customer"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingCustomers ? (
                      <SelectItem value="__loading__" disabled>
                        Loading...
                      </SelectItem>
                    ) : customers.length === 0 ? (
                      <SelectItem value="__none__" disabled>
                        No customers found
                      </SelectItem>
                    ) : (
                      customers.map((customer) => (
                        <SelectItem key={customer._id} value={customer._id}>
                          {customer.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Transaction Date (Nepali) */}
              <div className="md:w-1/2 p-2">
                <Label htmlFor="nepaliDate">
                  Date of Invoice (BS)
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <NepaliDate
                  handleInputChange={handleInputChange}
                  formData={formData}
                  fieldName="date"
                />
              </div>
            </div>

            {/* For shipping Details  */}
            <div className="w-full flex flex-col mb-4 p-2">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-semibold text-lg">Shipment Details</span>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={sameAsCustomer}
                    onChange={(e) => {
                      setSameAsCustomer(e.target.checked);
                    }}
                  />
                  <span>Same as customer</span>
                </label>
              </div>
              <div className="flex flex-col md:flex-row gap-2 w-full">
                <div className="w-full md:w-1/2">
                  <Label htmlFor="shipperName">
                    Shipper Name
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="shipperName"
                    type="text"
                    value={formData["shipperName"] || ""}
                    onChange={(e) =>
                      handleInputChange("shipperName", e.target.value)
                    }
                    placeholder="Enter Shipper Name"
                    required
                    disabled={sameAsCustomer}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Label htmlFor="shipperAddress">
                    Shipper Address
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="shipperAddress"
                    type="text"
                    value={formData["shipperAddress"] || ""}
                    onChange={(e) =>
                      handleInputChange("shipperAddress", e.target.value)
                    }
                    placeholder="Enter Shipper Address"
                    required
                    disabled={sameAsCustomer}
                  />
                </div>
              </div>
            </div>

            {/* Item Details Section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Item Details :-</h2>
              {/* Table Headers */}
              <div className="flex items-center bg-gray-100 px-2 py-2 rounded-t text-sm font-medium text-gray-700">
                <div className="w-20 px-1">Code</div>
                <div className="flex-1 px-1">Description</div>
                <div className="w-20 px-1">HS Code</div>
                <div className="w-16 px-1">Qty</div>
                <div className="w-16 px-1">Unit</div>
                <div className="w-20 px-1">Price</div>
                <div className="w-20 px-1">Amount</div>
                <div className="w-16 px-1">Disc.</div>
                <div className="w-12 px-1">Type</div>
                <div className="w-20 px-1">Net Amt</div>
                <div className="w-12"></div>
              </div>

              {/* Item Rows */}
              {(formData.items || []).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center border-b px-2 py-2 gap-1"
                >
                  {/* Item Code */}
                  <div className="w-20 relative">
                    <Input
                      className="w-full text-xs"
                      type="text"
                      value={itemCodeSearch[idx] !== undefined ? itemCodeSearch[idx] : (item.itemCode || "")}
                      onChange={(e) => {
                        const value = e.target.value;
                        setItemCodeSearch(prev => ({ ...prev, [idx]: value }));
                        setItemCodeDropdowns(prev => ({ ...prev, [idx]: true }));
                        
                        // Update the actual form data as well
                        const newItems = [...(formData.items || [])];
                        newItems[idx] = {
                          ...newItems[idx],
                          itemCode: value,
                        };
                        handleInputChange("items", newItems);
                      }}
                      onFocus={() => setItemCodeDropdowns(prev => ({ ...prev, [idx]: true }))}
                      placeholder="Code"
                    />
                    
                    {/* Item Code Dropdown */}
                    {itemCodeDropdowns[idx] && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                        {getFilteredItemsByCode(itemCodeSearch[idx] || "").length === 0 ? (
                          <div className="p-2 text-gray-500 text-xs">No items found</div>
                        ) : (
                          getFilteredItemsByCode(itemCodeSearch[idx] || "").map((template, templateIdx) => (
                            <div
                              key={templateIdx}
                              className="p-2 hover:bg-blue-50 cursor-pointer text-xs border-b border-gray-100"
                              onClick={() => selectItem(idx, template)}
                            >
                              <div className="font-medium">{template.itemCode}</div>
                              <div className="text-gray-600 truncate">{template.description}</div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="flex-1 relative flex">
                    <Input
                      className="flex-1 text-xs rounded-r-none"
                      type="text"
                      value={descriptionSearch[idx] !== undefined ? descriptionSearch[idx] : (item.description || "")}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDescriptionSearch(prev => ({ ...prev, [idx]: value }));
                        setDescriptionDropdowns(prev => ({ ...prev, [idx]: true }));
                        
                        // Update the actual form data as well
                        const newItems = [...(formData.items || [])];
                        newItems[idx] = {
                          ...newItems[idx],
                          description: value,
                        };
                        handleInputChange("items", newItems);
                      }}
                      onFocus={() => setDescriptionDropdowns(prev => ({ ...prev, [idx]: true }))}
                      placeholder="Description"
                    />
                    
                    {/* Group Filter Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 rounded-l-none border-l-0 text-xs"
                      onClick={() => setGroupDropdowns(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    >
                      {selectedGroups[idx] ? selectedGroups[idx].slice(0, 3) + "..." : "Grp"}
                    </Button>
                    
                    {/* Group Dropdown */}
                    {groupDropdowns[idx] && (
                      <div className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-32">
                        <div
                          className="p-2 hover:bg-blue-50 cursor-pointer text-xs border-b"
                          onClick={() => {
                            setSelectedGroups(prev => ({ ...prev, [idx]: "" }));
                            setGroupDropdowns(prev => ({ ...prev, [idx]: false }));
                          }}
                        >
                          All Groups
                        </div>
                        {uniqueGroups.map((group, groupIdx) => (
                          <div
                            key={groupIdx}
                            className="p-2 hover:bg-blue-50 cursor-pointer text-xs border-b border-gray-100"
                            onClick={() => {
                              setSelectedGroups(prev => ({ ...prev, [idx]: group }));
                              setGroupDropdowns(prev => ({ ...prev, [idx]: false }));
                            }}
                          >
                            {group}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Description Dropdown */}
                    {descriptionDropdowns[idx] && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-40 max-h-48 overflow-y-auto">
                        {getFilteredItemsByDescription(descriptionSearch[idx] || "", selectedGroups[idx]).length === 0 ? (
                          <div className="p-2 text-gray-500 text-xs">No items found</div>
                        ) : (
                          getFilteredItemsByDescription(descriptionSearch[idx] || "", selectedGroups[idx]).map((template, templateIdx) => (
                            <div
                              key={templateIdx}
                              className="p-2 hover:bg-blue-50 cursor-pointer text-xs border-b border-gray-100"
                              onClick={() => selectItem(idx, template)}
                            >
                              <div className="font-medium">{template.description}</div>
                              <div className="text-gray-600">Code: {template.itemCode} | Group: {template.group || 'None'}</div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* HS Code */}
                  <Input
                    className="w-20 text-xs"
                    type="number"
                    min={0}
                    maxLength={5}
                    value={item.hsCode || ""}
                    onChange={(e) => {
                      const newItems = [...(formData.items || [])];
                      newItems[idx] = {
                        ...newItems[idx],
                        hsCode: e.target.value.replace(/\D/, "").slice(0, 5),
                      };
                      handleInputChange("items", newItems);
                    }}
                    placeholder="HS"
                  />

                  {/* Quantity */}
                  <Input
                    className="w-16 text-xs"
                    type="number"
                    min={0}
                    value={item.quantity || ""}
                    onChange={(e) => {
                      const newItems = [...(formData.items || [])];
                      const quantity = e.target.value.replace(/[^0-9.]/g, "");
                      const calculatedAmount =
                        quantity && item.price
                          ? (
                              parseFloat(quantity) *
                              parseFloat(item.price || 0)
                            ).toFixed(2)
                          : "";

                      // Update item and calculate net amount
                      const updatedItem = {
                        ...newItems[idx],
                        quantity,
                        amount: calculatedAmount,
                      };

                      updatedItem.netAmount = calculateItemNetAmount(updatedItem);
                      newItems[idx] = updatedItem;
                      handleInputChange("items", newItems);
                    }}
                    placeholder="Qty"
                  />

                  {/* Unit */}
                  <Input
                    className="w-16 text-xs"
                    type="text"
                    value={item.unit || ""}
                    onChange={(e) => {
                      const newItems = [...(formData.items || [])];
                      newItems[idx] = {
                        ...newItems[idx],
                        unit: e.target.value,
                      };
                      handleInputChange("items", newItems);
                    }}
                    placeholder="Unit"
                  />

                  {/* Price */}
                  <Input
                    className="w-20 text-xs"
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.price || ""}
                    onChange={(e) => {
                      const newItems = [...(formData.items || [])];
                      const price = e.target.value.replace(/[^0-9.]/g, "");
                      const calculatedAmount =
                        item.quantity && price
                          ? (
                              parseFloat(item.quantity) * parseFloat(price)
                            ).toFixed(2)
                          : "";

                      // Update item and calculate net amount
                      const updatedItem = {
                        ...newItems[idx],
                        price,
                        amount: calculatedAmount,
                      };

                      updatedItem.netAmount = calculateItemNetAmount(updatedItem);
                      newItems[idx] = updatedItem;
                      handleInputChange("items", newItems);
                    }}
                    placeholder="Price"
                  />

                  {/* Amount (auto-calculated) */}
                  <Input
                    className="w-20 bg-gray-50 text-xs"
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.amount || ""}
                    onChange={(e) => {
                      const newItems = [...(formData.items || [])];
                      const updatedItem = {
                        ...newItems[idx],
                        amount: e.target.value,
                      };

                      updatedItem.netAmount = calculateItemNetAmount(updatedItem);
                      newItems[idx] = updatedItem;
                      handleInputChange("items", newItems);
                    }}
                    placeholder="Amount"
                  />

                  {/* Discount */}
                  <Input
                    className="w-16 text-xs"
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.discount || ""}
                    onChange={(e) => {
                      const newItems = [...(formData.items || [])];
                      const updatedItem = {
                        ...newItems[idx],
                        discount: e.target.value,
                      };

                      updatedItem.netAmount = calculateItemNetAmount(updatedItem);
                      newItems[idx] = updatedItem;
                      handleInputChange("items", newItems);
                    }}
                    placeholder="Disc"
                  />

                  {/* Discount Type */}
                  <Select
                    value={item.discountType || "percentage"}
                    onValueChange={(value) => {
                      const newItems = [...(formData.items || [])];
                      const updatedItem = {
                        ...newItems[idx],
                        discountType: value,
                      };

                      updatedItem.netAmount = calculateItemNetAmount(updatedItem);
                      newItems[idx] = updatedItem;
                      handleInputChange("items", newItems);
                    }}
                  >
                    <SelectTrigger className="w-12 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">%</SelectItem>
                      <SelectItem value="amount">₹</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Net Amount (calculated) */}
                  <Input
                    className="w-20 bg-blue-50 text-xs font-medium"
                    type="number"
                    value={(item.netAmount || 0).toFixed(2)}
                    readOnly
                    placeholder="Net"
                  />

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="ml-2 h-6 w-6"
                    onClick={() => {
                      const newItems = [...(formData.items || [])];
                      newItems.splice(idx, 1);
                      handleInputChange("items", newItems);
                      
                      // Clear dropdown states for removed item
                      setItemCodeDropdowns(prev => {
                        const newState = { ...prev };
                        delete newState[idx];
                        return newState;
                      });
                      setDescriptionDropdowns(prev => {
                        const newState = { ...prev };
                        delete newState[idx];
                        return newState;
                      });
                      setGroupDropdowns(prev => {
                        const newState = { ...prev };
                        delete newState[idx];
                        return newState;
                      });
                      setSelectedGroups(prev => {
                        const newState = { ...prev };
                        delete newState[idx];
                        return newState;
                      });
                      setItemCodeSearch(prev => {
                        const newState = { ...prev };
                        delete newState[idx];
                        return newState;
                      });
                      setDescriptionSearch(prev => {
                        const newState = { ...prev };
                        delete newState[idx];
                        return newState;
                      });
                    }}
                    aria-label="Remove item"
                  >
                    ×
                  </Button>
                </div>
              ))}

              {/* Add More Button */}
              <div className="flex justify-end mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newItems = [...(formData.items || [])];
                    newItems.push({
                      itemCode: "",
                      description: "",
                      hsCode: "",
                      quantity: "",
                      unit: "",
                      price: "",
                      amount: "",
                      discount: 0,
                      discountType: "percentage",
                      netAmount: 0,
                    });
                    handleInputChange("items", newItems);
                  }}
                >
                  + Add More
                </Button>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="w-full bg-gray-50 rounded-lg p-4 border mt-6">
              <h3 className="font-semibold mb-4 text-lg">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total */}
                <div>
                  <Label>Total (Before Discount)</Label>
                  <Input
                    value={total.toFixed(2)}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                {/* Taxable Amount */}
                <div>
                  <Label>Taxable Amount (After Discount)</Label>
                  <Input
                    value={taxableAmount.toFixed(2)}
                    readOnly
                    className="bg-blue-50 font-medium text-blue-600"
                  />
                </div>

                {/* VAT Percentage */}
                <div>
                  <Label>VAT (%)</Label>
                  <Input
                    type="number"
                    value={formData.vat || ""}
                    onChange={(e) => handleInputChange("vat", e.target.value)}
                    placeholder="VAT %"
                  />
                </div>

                {/* VAT Amount */}
                <div>
                  <Label>VAT Amount</Label>
                  <Input
                    value={vatAmount.toFixed(2)}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                {/* Grand Total */}
                <div className="md:col-span-4">
                  <Label>Grand Total</Label>
                  <Input
                    value={grandTotal.toFixed(2)}
                    readOnly
                    className="bg-green-50 font-bold text-green-600 text-lg"
                  />
                </div>
              </div>
            </div>

            {/* create or cancel button on footer  */}
            <div className="flex space-x-3 pt-4">
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                disabled={loading || localLoading}
              >
                {loading || localLoading ? (
                  <>
                    <span className="loader mr-2"></span> Processing...
                  </>
                ) : editingSalesEntry ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SalesEntryFormModal;
