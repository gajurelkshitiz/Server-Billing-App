import React, { useEffect, useReducer, useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useLocation } from "react-router-dom";
import { useCompanyStateGlobal } from "@/provider/companyState";

type Company = {
  _id: string;
  name: string;
  logo?: string;
};

interface CompanyContext {
    state?: {
        companyID: string,
    };
    dispatch?: (value: { type: "SET_COMPANYID", payload: any }) =>  void;

}

type SidebarFooterProps = {
  role: string;
  selectedCompany: string;
  setSelectedCompany: React.Dispatch<React.SetStateAction<string>>;
};



const SidebarFooter: React.FC<SidebarFooterProps> = ({ role, selectedCompany, setSelectedCompany }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const {state, dispatch}:CompanyContext = useCompanyStateGlobal()

  useEffect(() => {
    if (role === "admin" || role === "user") {
      setLoading(true);
      fetch(`${import.meta.env.REACT_APP_API_URL}/company/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          "X-Role": localStorage.getItem("role") || "",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCompanies(data.companies || []);
          // if (role === "user" && data.companies?.length) {
          //   setSelectedCompany(data.companies[0]._id);
          // }
        })
        .finally(() => setLoading(false));
    }
  }, [role]);

  // Store selected company ID in localStorage when a specific company is selected
  useEffect(() => {
    if (role === "admin" && selectedCompany !== "all") {
      localStorage.setItem("selectedCompanyID", selectedCompany);
    }

    // for default and retained value 

    const savedCompanyId = localStorage.getItem("selectedCompanyID");
    if (savedCompanyId){
      const foundCompany = companies.find(
        (company) => company._id === savedCompanyId
      )
    }
   

  }, [role, selectedCompany]);

  if (role === "superadmin") return null;

  if (loading) return <div className="p-4 text-xs text-gray-400">Loading company...</div>;

  // for testing of company:
  console.log("to check what company fetches", companies);

  if (role === "user" && companies.length) {
    const company = companies[0];
    return (
      <div className="flex items-center gap-2 p-4 border-t border-gray-200">
        {company.logo && <img src={company.logo} alt="logo" className="h-8 w-8 rounded" />}
        <span className="font-medium">{company.name}</span>
      </div>
    );
  }

  if (role === "admin") {
    const handleCompanyChange = (value: string) => {
      setSelectedCompany(value);
      console.log(value);
      dispatch({type: "SET_COMPANYID", payload: value})
      if (value === "all") {
        localStorage.removeItem("selectedCompanyID");
      } else {
        localStorage.setItem("selectedCompanyID", value);
      }
      // Notify Sidebar to update
      window.dispatchEvent(new Event("selectedCompanyIDChanged"));
    };

    console.log('after company select STATE value will be: ', state);

    
    return (
      <div className="flex flex-col gap-2 p-4 border-t border-gray-200">
        <Select value={selectedCompany} onValueChange={handleCompanyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="truncate font-semibold text-blue-600">All Companies</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company._id} value={company._id}>
                <span className="flex items-center gap-2">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt="logo"
                      className="h-5 w-5 rounded bg-gray-100 object-cover"
                    />
                  ) : (
                    <span className="h-5 w-5 flex items-center justify-center rounded bg-gray-200 text-xs text-gray-500 font-semibold uppercase">
                      {company.name.charAt(0)}
                    </span>
                  )}
                  <span className="truncate font-semibold text-blue-600">{company.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCompany !== "all" && (
          (() => {
            const company = companies.find((c) => c._id === selectedCompany);
            return company ? (
              <div className="flex items-center gap-2 mt-2">
                {company.logo && <img src={company.logo} alt="logo" className="h-8 w-8 rounded" />}
                <span className="font-medium">{company.name}</span>
              </div>
            ) : null;
          })()
        )}
      </div>
    );
  }
  

  return null;
};

export default SidebarFooter;