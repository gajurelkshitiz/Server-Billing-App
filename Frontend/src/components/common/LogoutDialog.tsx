import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LogoutDialogProps {
  isLogoutDialogOpen: boolean;
  setIsLogoutDialogOpen: (isLogoutDialogOpen: boolean) => void;
  afterLogout?: () => void; // Optional callback after logout
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({ isLogoutDialogOpen, setIsLogoutDialogOpen, afterLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('adminID');
    localStorage.removeItem('companyID');
    localStorage.removeItem('selectedCompanyID');
    setIsLogoutDialogOpen(false);
    if (afterLogout) afterLogout();
    navigate('/login');
  };

  return (
    <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to logout?</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
            No
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;