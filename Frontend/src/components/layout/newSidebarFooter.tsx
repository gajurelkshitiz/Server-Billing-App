import React, { useEffect, useState } from "react";
import { useCompanyStateGlobal, CompanyContextType } from "../../provider/companyState";
// shadcn/ui imports
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useCompanyContext } from "@/context/CompanyContext";
import { useToast } from "@/hooks/use-toast"; // import toast
import { getAuthHeaders } from "@/utils/auth";

// Company type
interface Company {
  _id: string;
  name: string;
  logo?: string;
}

// Props
interface SidebarFooterProps {
  role: string;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ role }) => {
  const { state, dispatch }: CompanyContextType = useCompanyStateGlobal();
  const { company, setCompany } = useCompanyContext(); // from context
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();


  if (role !== "superadmin") {
    useEffect(() => {
      const fetchCompanies = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${import.meta.env.REACT_APP_API_URL}/company/`,
            {
              headers: getAuthHeaders(),
            }
          );
          if (response.ok) {
            const data = await response.json();
            setCompany(data.companies || []);
            console.log('company after fetching: ', data.companies);
            
            // For users, automatically set the first company as selected
            if (role === "user" && data.companies && data.companies.length > 0) {
              const userCompany = data.companies[0];
              dispatch({ 
                type: "SET_COMPANY", 
                payload: {
                  companyID: userCompany._id,
                  companyName: userCompany.name
                } });
              // localStorage.setItem("companyID", userCompany._id);    --> I don't need this becasue i have already saved on local Storage.
            }
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch companies",
              variant: "destructive",
            });
          }
        } catch {
          toast({
            title: "Error",
            description: "Failed to connect to server",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchCompanies();
    }, []);
  }


  // Handle dropdown change (admin only)
  const handleChange = (value: string) => {
    const selectedCompany = company.find((c: Company) => c._id === value);
    const companyName = value === "all" ? "All Companies" : selectedCompany?.name || "";
    
    dispatch({ 
      type: "SET_COMPANY", 
      payload: { 
        companyID: value, 
        companyName: companyName 
      } 
    });
    localStorage.setItem("companyID", value);
    localStorage.setItem("companyName", companyName);
  };

  // On mount: optionally sync from localStorage if missing in state
  useEffect(() => {
    const storedCompanyID = localStorage.getItem("companyID");
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyID && !state?.companyID && role !== "superadmin") {
      dispatch({ 
        type: "SET_COMPANY", 
        payload: { 
          companyID: storedCompanyID, 
          companyName: storedCompanyName || "" 
        } 
      });
    }
  }, []);

  // If company data is not loaded yet
  if (loading) {
    return (
      <div className="p-4 text-xs text-gray-400">Loading companies...</div>
    );
  }

  if (!company || !Array.isArray(company) || company.length === 0) {
    return (
      <div className="flex flex-col gap-2 p-4 border-t border-gray-200 mt-auto">
        <Select disabled>
          <SelectTrigger>
        <SelectValue placeholder="No Company Found" />
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  // User: just show their company (first in list)
  if (role === "user" && company.length) {
    const userCompany = company[0];
    console.log('user company detail: ', userCompany);
    return (
      <div className="flex items-center gap-2 p-4 border-t border-gray-200 mt-auto">
        {userCompany.logo ? (
          <img
            src={userCompany.logo}
            alt="logo"
            className="h-8 w-8 rounded bg-gray-100 object-cover"
          />
        ) : (
          <span className="h-8 w-8 flex items-center justify-center rounded bg-gray-200 text-xs text-gray-500 font-semibold uppercase">
            {userCompany.name.charAt(0)}
          </span>
        )}
        <span className="font-medium">{userCompany.name}</span>
      </div>
    );
  }

  // Admin: show select
  if (role === "admin") {
    return (
      <div className="flex flex-col gap-2 p-4 border-t border-gray-200 mt-auto">
        <Select value={state.companyID} onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Company" />
          </SelectTrigger>
          <SelectContent>
                <SelectItem
                  value="all"
                  className="truncate font-semibold text-blue-600"
                >
                  All Companies
                </SelectItem>
                {company.map((c: Company) => (
                  <SelectItem key={c._id} value={c._id}>
                    <span className="flex items-center gap-2">
                      {c.logo ? (
                        <img
                          src={c.logo}
                          alt="logo"
                          className="h-5 w-5 rounded bg-gray-100 object-cover"
                        />
                      ) : (
                        <span className="h-5 w-5 flex items-center justify-center rounded bg-gray-200 text-xs text-gray-500 font-semibold uppercase">
                          {c.name.charAt(0)}
                        </span>
                      )}
                      <span className="truncate font-semibold text-blue-600">
                        {c.name}
                      </span>
                    </span>
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return null;
};

export default SidebarFooter;
