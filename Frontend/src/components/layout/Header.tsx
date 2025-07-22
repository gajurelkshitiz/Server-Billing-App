import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Search, Calendar, Settings, User, LogOut, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutDialog from "@/components/common/LogoutDialog";
import DateTimeDisplay from '../common/DateTimeDisplay';
import WeatherInfo from '../common/Location';
import { useProfile } from "@/context/ProfileContext";
import { useFiscalYear } from "@/context/FiscalYearContext";
import { useNotifications } from "@/context/NotificationContext";
import { getAuthHeaders } from "@/utils/auth";
import NotificationDropdown from "@/components/common/NotificationDropdown";

interface HeaderProps {
  isMobile?: boolean;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

const Header = ({ isMobile = false, isMobileMenuOpen = false, setIsMobileMenuOpen }: HeaderProps) => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isSettingsRotated, setIsSettingsRotated] = useState(false);
  const { profile, setProfile, formData, setFormData } = useProfile();
  const { fiscalYear, setFiscalYear } = useFiscalYear();
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('name') || 'User';
  const role = localStorage.getItem('role') || 'user';
  const navigate = useNavigate();
  const location = useLocation();
  const [fiscalYearRefetch, setFiscalYearRefetch] = useState(0);

  const { addNotification } = useNotifications();
  

  // Fetch profile data on mount or when role changes
  useEffect(() => {
    setProfile(null); // Always reset before fetching
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/${role}/me/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data[role] || null); // Set context
        setFormData(data[role] || {});
      } catch (err) {
        setProfile(null);
        // setFormData({});
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [role, setProfile]);


    
  useEffect(() => {
    const fetchFiscalYears = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/fiscalYear/`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch Fiscal Years");
        const data = await response.json();
        setFiscalYear(data.fiscalYears || []);
      
      } catch {
        setFiscalYear(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFiscalYears();
  }, [fiscalYearRefetch]);

  // Listen for custom events to trigger refetch
  useEffect(() => {
    const handleFiscalYearUpdate = () => {
      setFiscalYearRefetch(prev => prev + 1);
    };

    window.addEventListener('fiscalYearUpdated', handleFiscalYearUpdate);
    return () => {
      window.removeEventListener('fiscalYearUpdated', handleFiscalYearUpdate);
    };
  }, []);

  const handleSettingsClick = () => {
    if (isSettingsRotated) {
      // If already rotated, go back to previous page
      navigate(-1);
      setIsSettingsRotated(false);
    } else {
      // First click: rotate icon and navigate to settings
      setIsSettingsRotated(true);
      navigate('/settings');
    }
  };

  // Reset rotation when navigating away from settings
  useEffect(() => {
    if (location.pathname !== '/settings') {
      setIsSettingsRotated(false);
    }
  }, [location.pathname]);



  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen?.(!isMobileMenuOpen)}
            className="p-2 mr-2"
          >
            <Menu size={20} />
          </Button>
        )}

        <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
          {/* Date and Time - Hidden on mobile or shown in compact form */}
          {!isMobile && (
            <div className="relative max-w-md flex flex-col items-start">
              <DateTimeDisplay />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
          {/* Fiscal Year Dropdown - Compact on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={`relative flex items-center gap-1 sm:gap-2 ${
                  isMobile ? 'px-2 py-1' : 'px-3 py-2'
                } border-gray-200 hover:bg-gray-50 transition-colors`}
              >
                <Calendar size={16} className="text-blue-600" />
                {!isMobile && (
                  <span className="text-sm font-semibold text-gray-700">
                    {fiscalYear?.find((fy: any) => fy.status)?.name || 'Select FY'}
                  </span>
                )}
                <div className="w-1 h-1 bg-green-800 rounded-full animate-pulse"></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 bg-white border border-gray-200 shadow-lg rounded-lg">
              
              <div className="max-h-48 overflow-y-auto">
                {Array.isArray(fiscalYear) && fiscalYear.length > 0 ? (
                  fiscalYear.map((fy: any) => (
                    <DropdownMenuItem 
                      key={fy._id}
                      className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-blue-800 cursor-pointer transition-colors group"
                      onClick={() => {
                        // Handle fiscal year selection logic here
                        console.log('Selected FY:', fy.name);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{fy.name}</div>
                          <div className="text-xs text-gray-500">
                            {fy.startDate ? `${new Date(fy.startDate).getFullYear()}` : 'Active'}
                          </div>
                        </div>
                      </div>
                      
                      {fy.status && (
                        <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Current
                        </Badge>
                      )}
                      
                      {fy.status === false && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gray-50 text-blue-800 text-xs px-2 py-1 border-gray-300 hover:bg-gray-100"
                          onClick={() => {
                          // Handle fiscal year selection logic here
                          // For example, set as active or update context
                          setFiscalYear((prev: any) =>
                            prev.map((item: any) =>
                            item._id === fy._id
                              ? { ...item, status: true }
                              : { ...item, status: false }
                            )
                          );

                          // Add notification for fiscal year switch
                          addNotification({
                            title: 'Fiscal Year Changed',
                            message: `Successfully switched to fiscal year: ${fy.name}`,
                            type: 'info'
                          });
                          }}
                        >
                          Select
                        </Button>
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Calendar size={38} className="text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">No Fiscal Years</p>
                    <p className="text-xs text-gray-400">Contact admin to set up fiscal years</p>
                  </div>
                )}
              </div>
              
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notification Dropdown */}
          <NotificationDropdown
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onDeleteNotification={deleteNotification}
            onClearAll={clearAll}
          />

          {/* Settings Button - Compact on mobile */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSettingsClick}
            title={isSettingsRotated ? "Go Back" : "Settings"}
            className={`transition-all duration-200 hover:bg-gray-100 ${
              isMobile ? 'p-2' : ''
            }`}
          >
            <Settings 
              size={18} 
              className={`transition-transform duration-300 ${
                isSettingsRotated ? 'rotate-180' : 'rotate-0'
              }`} 
            />
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`flex items-center ${
                  isMobile ? 'space-x-1 px-2' : 'space-x-2 px-3'
                }`}
              >
                <Avatar className={isMobile ? 'h-8 w-8' : ''}>
                  {profile?.profileImage ? (
                    <AvatarImage src={`${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}${profile.profileImage}`} alt={username} />
                  ) : (
                    <AvatarFallback className="bg-blue-600 text-white">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                {!isMobile && (
                  <div className="text-left">
                    <div className="text-sm font-medium">{username}</div>
                    <div className="text-xs text-gray-500 capitalize">{role}</div>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                  onClick={() => {
                    const role = localStorage.getItem('role');
                    const path = role === 'admin'? '/admin-profile' : '/user-profile';
                    navigate(path)
                  }}>
                <User size={16} className="mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings size={16} className="mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsLogoutDialogOpen(true)} className="text-red-600">
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <LogoutDialog isLogoutDialogOpen={isLogoutDialogOpen} setIsLogoutDialogOpen={setIsLogoutDialogOpen} />
    </header>
  );
};

export default Header;




// Search tab In Header 

{/* <div className="relative max-w-md">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
  <Input
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pl-10 w-80"
  />
</div> */}
