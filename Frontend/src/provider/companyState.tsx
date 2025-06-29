import React, { createContext, useContext, useReducer } from 'react';
import reducer from './reducer';
const CompanyContext = createContext({});

interface InitialState {
    companyId: string
}

const initialState : InitialState  = {
    companyId: ''
}

const CompanyStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <CompanyContext.Provider value={{ state, dispatch }}>
      {children}
    </CompanyContext.Provider>
  );
};


const useCompanyStateGlobal = () => {
  return useContext(CompanyContext);
};

export {useCompanyStateGlobal, CompanyStateProvider};