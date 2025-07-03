import React, { createContext, useContext, useState } from "react";

type FiscalYear = {
  name?: string;
  [key: string]: any;
};

type FiscalYearContextType = {
  fiscalYear:  FiscalYear | null;
  setFiscalYear: React.Dispatch<React.SetStateAction<FiscalYear | null>>;
};

const FiscalYearContext = createContext<FiscalYearContextType | undefined>(undefined);

export const useFiscalYear = () => {
  const ctx = useContext(FiscalYearContext);
  if (!ctx) throw new Error("useFiscalYearContext must be used within FiscalYearProvider");
  return ctx;
};

export const FiscalYearProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fiscalYear, setFiscalYear] = useState<FiscalYear | null>(null);
  // const [formData, setFormData] = useState<FiscalYear | null>(null);
  return (
    <FiscalYearContext.Provider value={{ fiscalYear, setFiscalYear}}>
      {children}
    </FiscalYearContext.Provider>
  );
};