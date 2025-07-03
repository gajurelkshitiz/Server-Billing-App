import React, { createContext, useContext, useReducer } from 'react';
import reducer from './reducer';

interface InitialState {
    companyID: string;
    companyName: string;
}

// Export the CompanyContext interface for reuse
export interface CompanyContextType {
  state?: {
    companyID: string;
    companyName: string;
  };
  dispatch?: (value: { type: "SET_COMPANY"; payload: { companyID: string; companyName: string } }) => void;
}

const CompanyContext = createContext<CompanyContextType>({});

const initialState : InitialState  = {
    companyID: '',
    companyName: ''
}

const CompanyStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <CompanyContext.Provider value={{ state, dispatch }}>
      {children}
    </CompanyContext.Provider>
  );
};

const useCompanyStateGlobal = (): CompanyContextType => {
  return useContext(CompanyContext);
};

export { useCompanyStateGlobal, CompanyStateProvider };