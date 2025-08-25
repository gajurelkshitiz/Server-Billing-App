import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardTitle } from "@/components/ui/card";
import { Info, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/utils/auth";

const defaultItem = {
  itemCode: "",
  description: "",
  group: "",
  hsCode: "",
  unit: "",
  salesPrice: "",
  purchasePrice: "",
  companyID: ""
};

const ItemDetailsTab: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState({ ...defaultItem });
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const companyID = localStorage.getItem('companyID');

  // Fetch items from backend on mount
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/item-configuration?companyID=${companyID || ""}`,
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
      setItems(data.itemsConfig || []);
    } catch (err) {
      toast({
        title: "Failed to fetch items",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.itemCode || !form.description) {
      toast({
        title: "Item code and description are required",
        variant: "destructive",
      });
      return;
    }
    
    if (!companyID) {
      toast({
        title: "Company ID not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const body = { 
        ...form, 
        companyID: companyID 
      };
      
      const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/item-configuration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create item");
      }
      
      setForm({ ...defaultItem });
      toast({
        title: "Item added successfully!",
        variant: "default",
      });
      fetchItems();
    } catch (err) {
      toast({
        title: "Failed to create item",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!form.itemCode || !form.description) {
      toast({
        title: "Item code and description are required",
        variant: "destructive",
      });
      return;
    }

    if (editingIndex === null || !items[editingIndex]?._id) {
      toast({
        title: "No item selected for update",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/item-configuration/${items[editingIndex]._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(form),
        }
      );
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update item");
      }
      
      setForm({ ...defaultItem });
      setEditingIndex(null);
      toast({
        title: "Item updated successfully!",
        variant: "default",
      });
      fetchItems();
    } catch (err) {
      toast({
        title: "Failed to update item",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (idx: number) => {
    setForm({ ...items[idx] });
    setEditingIndex(idx);
  };

  const handleDelete = async (idx: number) => {
    if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;
    try {
      const item = items[idx];
      const res = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/item-configuration/${item._id}`,
        {
          method: "DELETE",
          headers: {
            ...getAuthHeaders(),
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete item");
      if (editingIndex === idx) {
        setForm({ ...defaultItem });
        setEditingIndex(null);
      }
      toast({
        title: "Item deleted!",
        variant: "default",
      });
      fetchItems();
    } catch (err) {
      toast({
        title: "Failed to delete item",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Card className="p-8 mb-10 shadow border border-gray-200 bg-white rounded-xl">
        <CardTitle className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-400" />
          Item Templates
        </CardTitle>
        <form
          onSubmit={e => { 
            e.preventDefault(); 
            if (editingIndex !== null) {
              handleUpdate();
            } else {
              handleSave();
            }
          }}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
        >
          <div>
            <Label className="font-medium text-gray-700 flex items-center gap-1">
              Item Code
              <span className="ml-1 px-2 py-0.5 rounded bg-red-100 text-red-600 text-xs font-semibold">Required</span>
            </Label>
            <Input
              value={form.itemCode}
              onChange={(e) => handleChange("itemCode", e.target.value)}
              placeholder="Code"
              className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <Label className="font-medium text-gray-700">Description</Label>
            <Input
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Description"
              className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <Label className="font-medium text-gray-700">Group</Label>
            <Input
              value={form.group}
              onChange={(e) => handleChange("group", e.target.value)}
              placeholder="Group"
              className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <Label className="font-medium text-gray-700">HS Code</Label>
            <Input
              value={form.hsCode}
              onChange={(e) => handleChange("hsCode", e.target.value)}
              placeholder="HS Code"
              className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <Label className="font-medium text-gray-700">Unit</Label>
            <Input
              value={form.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
              placeholder="Unit"
              className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <Label className="font-medium text-gray-700">Purchase Price</Label>
            <Input
              type="number"
              value={form.purchasePrice}
              onChange={(e) => handleChange("purchasePrice", e.target.value)}
              placeholder="Purchase Price"
              className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <Label className="font-medium text-gray-700">Sales Price</Label>
            <Input
              type="number"
              value={form.salesPrice}
              onChange={(e) => handleChange("salesPrice", e.target.value)}
              placeholder="Sales Price"
              className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="md:col-span-5 flex gap-2 mt-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow">
              {editingIndex !== null ? "Update" : "Add"}
            </Button>
            {editingIndex !== null && (
              <Button
                variant="outline"
                onClick={() => {
                  setForm({ ...defaultItem });
                  setEditingIndex(null);
                }}
                className="border-gray-300 px-6 py-2 rounded-lg"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
        <hr className="my-8 border-gray-200" />
        <Card className="p-8 shadow border border-gray-200 bg-white rounded-xl">
          <CardTitle className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            Configured Items
          </CardTitle>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full text-sm bg-white rounded-xl overflow-hidden">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="py-3 px-4 font-semibold text-left">Code</th>
                  <th className="py-3 px-4 font-semibold text-left">Description</th>
                  <th className="py-3 px-4 font-semibold text-center">HS Code</th>
                  <th className="py-3 px-4 font-semibold text-center">Unit</th>
                  <th className="py-3 px-4 font-semibold text-right">Price</th>
                  <th className="py-3 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-6">
                      Loading...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-6">
                      No items configured.
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr
                      key={item._id || item.itemCode}
                      className={`transition border-b last:border-b-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                    >
                      <td className="py-3 px-4 font-mono text-blue-900 align-middle">{item.itemCode}</td>
                      <td className="py-3 px-4 align-middle">{item.description}</td>
                      <td className="py-3 px-4 text-center align-middle">{item.hsCode}</td>
                      <td className="py-3 px-4 text-center align-middle">{item.unit}</td>
                      <td className="py-3 px-4 text-right align-middle">{item.salesPrice ? `Rs. ${Number(item.salesPrice).toLocaleString('en-NP', { minimumFractionDigits: 2 })}` : ''}</td>
                      <td className="py-3 px-4 text-center align-middle">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(idx)}
                            className="border-blue-300 px-4"
                            title="Edit item"
                          >
                            <Edit2 className="w-4 h-4 mr-1 text-blue-500" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(idx)}
                            className="px-4"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default ItemDetailsTab;
