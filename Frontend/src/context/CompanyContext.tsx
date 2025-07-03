import React, { createContext, useContext, useState } from "react";

type Company = {
  name?: string;
  logo?: string;
  [key: string]: any;
};

type CompanyContextType = {
  company:  Company | null;
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompanyContext = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompanyContext must be used within CompanyProvider");
  return ctx;
};

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<Company | null>(null);
  // const [formData, setFormData] = useState<Company | null>(null);
  return (
    <CompanyContext.Provider value={{ company, setCompany}}>
      {children}
    </CompanyContext.Provider>
  );
};