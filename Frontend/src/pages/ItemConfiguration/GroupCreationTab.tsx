import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { FolderPlus } from "lucide-react";

const GroupCreationTab: React.FC = () => {
  return (
    <Card className="p-8 shadow border border-gray-200 bg-white rounded-xl">
      <CardTitle className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FolderPlus className="w-6 h-6 text-blue-400" />
        Group Creation
      </CardTitle>
      <div className="text-gray-500">Coming soon: Manage item groups here.</div>
    </Card>
  );
};

export default GroupCreationTab;
