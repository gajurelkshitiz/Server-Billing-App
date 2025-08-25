import React, { useEffect, useState } from "react";
import ItemDetailsTab from "./ItemDetailsTab";
import GroupCreationTab from "./GroupCreationTab";
import { Card } from "@/components/ui/card";
import { FaSlidersH } from "react-icons/fa"; // <-- Import the slider icon
import { useCompanyStateGlobal, CompanyContextType } from "@/provider/companyState";
import { useNavigate } from "react-router-dom";


const TABS = [
  { key: "item", label: "Item Details" },
  { key: "group", label: "Group Creation" },
];

const TAB_COMPONENTS: Record<string, React.ReactNode> = {
  item: <ItemDetailsTab />,
  group: <GroupCreationTab />,
};

const SalesConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("item");

  const { state, dispatch }: CompanyContextType = useCompanyStateGlobal();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (state.companyID == 'all' && state.companyID) {
      navigate('/dashboard');
    }
  }, [state.companyID]);

  return (
    <div className="min-h-[90vh] bg-gray-50 pb-16">
      <div className="max-w-6xl mx-auto pt-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-white shadow p-3 rounded-lg flex items-center justify-center">
            <FaSlidersH className="text-blue-700" size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Item Configuration</h1>
            <div className="text-gray-500 text-sm mt-1">Setup item templates and groups for sales and purchase Module</div>
          </div>
        </div>
        <Card className="p-0 shadow border border-gray-200 bg-white">
          <div className="flex gap-0 border-b border-gray-200 bg-gray-50 rounded-t-lg overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`px-6 py-3 font-semibold text-base transition border-b-2 focus:outline-none
                  ${activeTab === tab.key
                    ? 'text-blue-700 border-blue-600 bg-white'
                    : 'text-gray-500 border-transparent hover:text-blue-700 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-6">
            {TAB_COMPONENTS[activeTab]}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SalesConfiguration;
