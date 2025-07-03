import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthHeaders } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  _id: string;
  name: string;
}

interface Props {
  onSubmit: (customer: Customer) => void;
  onCancel: () => void;
  loading: boolean;
}

const CustomerSearch: React.FC<Props> = ({ onSubmit, onCancel, loading }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [fetching, setFetching] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      setSelected(null);
      return;
    }
    //getting companyId from the localStorage.
    const companyID = localStorage.getItem('companyID');
    const fetchCustomers = async () => {
      setFetching(true);
      // fetch(`/api/v1/customer?search=${encodeURIComponent(query)}`)
      try {
        fetch(
          // `${import.meta.env.REACT_APP_API_URL}/customer`,
          `${import.meta.env.REACT_APP_API_URL}/customer/getbysearch?companyID=${companyID}&search=${encodeURIComponent(query)}`,
          {
            headers: getAuthHeaders(),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(data || []);
            setFetching(false);
            console.log('for demo of fetchCustomers', data);
          });

      }
      catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch customers",
          variant: "destructive",
        });
      }

    }
    fetchCustomers();
  }, [query]);

  const handleSelect = (customer: Customer) => {
    console.log('inside handle Select', customer);
    setSelected(customer);
    setQuery(customer.name);
    setSuggestions([]);
  };

  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-2">
        <label htmlFor="customer-search" className="font-medium">Customer Name</label>
        <Input
          id="customer-search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          placeholder="Type customer name..."
          autoComplete="off"
        />
        {fetching && <div className="text-xs text-gray-500">Loading...</div>}
        {suggestions.length > 0 && (
          <div className="border rounded bg-white shadow z-10 max-h-40 overflow-y-auto">
            {suggestions.map((s) => (
              <div
                key={s._id}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleSelect(s)}
              >
                {s.name}
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 mt-2">
          <Button
            onClick={() => selected && onSubmit(selected)}
            disabled={!selected || loading}
            className="bg-blue-600 hover:bg-blue-700 flex-1"
          >
            Submit
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSearch;