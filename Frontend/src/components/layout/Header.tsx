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
import { Search, Calendar, Settings, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoutDialog from "@/components/common/LogoutDialog";
import DateTimeDisplay from '../common/DateTimeDisplay';
import WeatherInfo from '../common/Location';
import { useProfile } from "@/context/ProfileContext";

const editableFields = []; // Add your editable fields here

const Header = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { profile, setProfile, formData, setFormData } = useProfile();
  const [loading, setLoading] = useState(true);
  // const [formData, setFormData] = useState<any>({});
  const username = localStorage.getItem('name') || 'User';
  const role = localStorage.getItem('role') || 'user';
  const navigate = useNavigate();

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

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Date and Time, WeatherInfo in a row */}
          <div className="relative max-w-md flex flex-col items-start">
            <DateTimeDisplay />
            {/* <WeatherInfo className="ml-2 text-sm font-medium text-blue-700" /> */}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Calendar size={18} />
          </Button>

          <Button variant="ghost" size="sm" className="relative">
            <div className="relative">
              <div className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                2
              </div>
              <Badge variant="destructive" className="absolute -top-1 -right-1 w-2 h-2 p-0" />
            </div>
          </Button>

          <Button variant="ghost" size="sm">
            <Settings size={18} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-3">
                <Avatar>
                  {profile?.profileImage ? (
                    <AvatarImage src={profile.profileImage} alt={username} />
                  ) : (
                    <AvatarFallback className="bg-blue-600 text-white">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-medium">{username}</div>
                  <div className="text-xs text-gray-500 capitalize">{role}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
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
