import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  User,
  Settings,
  Calendar,
  Eye,
  LogOut,
  Menu,
  Users,
  Building2,
  ShoppingCart,
  Package,
  Receipt,
  DollarSign,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { roleRoutes } from "@/routes/permissions";
import { allMenuItems } from "@/config/menuItems";
import LogoutDialog from "@/components/common/LogoutDialog";
import { useCompanyStateGlobal } from "@/provider/companyState";
import NewSidebarFooter from "./newSidebarFooter";
import { useProfile } from "@/context/ProfileContext";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobile?: boolean;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobile = false, isMobileMenuOpen = false, setIsMobileMenuOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [fiscalYear, setFiscalYear] = useState<string>("");
  const [groupMenu, setGroupMenu] = useState<object>();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [fiscalYearRefetch, setFiscalYearRefetch] = useState(0);

  const { state } = useCompanyStateGlobal();
  const { profile, isLoading } = useProfile();

  let selectedCompany;
  if (role === "admin") {
    selectedCompany = state?.companyID || "all";
  } else {
    selectedCompany = "";
  }

  const getMenuItems = () => {
    const role = localStorage.getItem("role");
    let allowedRoutes = roleRoutes[role as keyof typeof roleRoutes] || [];

    let filteredMenuItems = allMenuItems.filter((item) => {
      // Only filter if NOT loading AND profile exists
      if (
        item.title === "Item Configuration" &&
        !isLoading && // ← Wait for loading to complete
        profile?.mode !== "computerized"
      ) {
        return false;
      }
      if (item.isParent && item.children) {
        // For parent items, check if any child is allowed
        const hasAllowedChild = item.children.some((child: any) =>
          allowedRoutes.includes(child.path)
        );
        return hasAllowedChild;
      }
      return allowedRoutes.includes(item.path);
    });

    // Additional filtering for admin when selectedCompany is 'all'
    if (selectedCompany && selectedCompany === "all" && role === "admin") {
      filteredMenuItems = filteredMenuItems.filter(
        (item) =>
          item.title !== "Purchase Module" &&
          item.title !== "Sales Module" &&
          item.title !== "Attachments" && 
          item.title !== "Item Configuration"
      );
    }

    return filteredMenuItems;
  };

  const toggleExpand = (itemTitle: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemTitle)
        ? prev.filter((item) => item !== itemTitle)
        : [...prev, itemTitle]
    );
  };

  const handleParentClick = (item: any) => {
    if (isMobile) {
      // On mobile, always navigate to the path and close menu
      navigate(item.path);
      setIsMobileMenuOpen?.(false);
    } else if (isCollapsed) {
      // If collapsed, navigate to default path
      navigate(item.path);
    } else {
      // If expanded, toggle the dropdown
      toggleExpand(item.title);
    }
  };

  // Auto-expand if current path is within a parent's children
  useEffect(() => {
    const menuItems = getMenuItems();
    menuItems.forEach((item) => {
      if (item.isParent && item.children) {
        const hasActiveChild = item.children.some(
          (child: any) => child.path === location.pathname
        );
        if (hasActiveChild && !expandedItems.includes(item.title)) {
          setExpandedItems((prev) => [...prev, item.title]);
        }
      }
    });
  }, [location.pathname]);

  useEffect(() => {
    const menuItems = getMenuItems();
    const groupedMenuItems = menuItems.reduce(
      (acc, item) => {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
      },
      {} as Record<string, typeof menuItems>
    );

    setGroupMenu(groupedMenuItems);
  }, [selectedCompany, profile, isLoading]); // ← Add isLoading dependency

  useEffect(() => {
    const fetchFiscalYear = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/fiscalYear/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        const activeFY = Array.isArray(data.fiscalYears)
          ? data.fiscalYears.find((fy: any) => fy.status === true)
          : null;
        if (activeFY) {
          setFiscalYear(activeFY.name);
          localStorage.setItem("fiscalYear", activeFY.name);
        }
      } catch (err) {
        setFiscalYear("");
      }
    };
    fetchFiscalYear();
  }, [fiscalYearRefetch]);

  // Listen for custom events to trigger refetch
  useEffect(() => {
    const handleFiscalYearUpdate = () => {
      setFiscalYearRefetch((prev) => prev + 1);
    };

    window.addEventListener("fiscalYearUpdated", handleFiscalYearUpdate);
    return () => {
      window.removeEventListener("fiscalYearUpdated", handleFiscalYearUpdate);
    };
  }, []);

  const renderMenuItem = (item: any) => {
    const Icon = item.icon;
    const isExpanded = expandedItems.includes(item.title);
    const hasActiveChild = item.children?.some(
      (child: any) => child.path === location.pathname
    );
    const isActive = location.pathname === item.path;

    if (item.isParent && item.children) {
      // Add conditional child for Sales Module
      let children = item.children;
      // if (item.title === 'Sales Module' && profile?.mode === 'computerized') {
      //   children = [
      //     ...children,
      //     {
      //       title: "Sales Configuration",
      //       path: "/sales-configuration",
      //       icon: Settings,
      //       color: "bg-blue-500",
      //     }
      //   ]
      // }
      return (
        <div key={item.title}>
          <Button
            variant={hasActiveChild ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              (isCollapsed && !isMobile) ? "px-2" : "px-3"
            } ${
              hasActiveChild
                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                : "text-gray-700"
            }`}
            onClick={() => handleParentClick(item)}
          >
            <Icon size={18} />
            {(!isCollapsed || isMobile) && (
              <>
                <span className="ml-3 flex-1 text-left">{item.title}</span>
                {!isMobile && (isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
              </>
            )}
          </Button>

          {(!isCollapsed || isMobile) && (isMobile || isExpanded) && (
            <div className="ml-6 space-y-1 mt-1">
              {children.map((child: any) => { // <-- use 'children' here!
                const ChildIcon = child.icon;
                const isChildActive = location.pathname === child.path;

                return (
                  <Link key={child.path} to={child.path}>
                    <Button
                      variant={isChildActive ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-full justify-start px-3 ${
                        isChildActive
                          ? "bg-blue-100 text-blue-800"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => {
                        if (isMobile) setIsMobileMenuOpen?.(false);
                      }}
                    >
                      <ChildIcon size={16} />
                      <span className="ml-3">{child.title}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Regular menu item
    return (
      <Link key={item.path} to={item.path}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`w-full justify-start ${
            (isCollapsed && !isMobile) ? "px-2" : "px-3"
          } ${
            isActive
              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
              : "text-gray-700"
          }`}
          onClick={() => {
            if (isMobile) setIsMobileMenuOpen?.(false);
          }}
        >
          <Icon size={18} />
          {(!isCollapsed || isMobile) && <span className="ml-3">{item.title}</span>}
        </Button>
      </Link>
    );
  };

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isMobile ? 'w-64' : isCollapsed ? "w-16" : "w-64"
      } h-screen flex flex-col ${isMobile ? 'shadow-lg' : ''}`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col ml-3">
              <h2
                className="text-xl font-extrabold cursor-pointer"
                style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}
                onClick={() => {
                  navigate("/home/dashboard");
                  if (isMobile) setIsMobileMenuOpen?.(false);
                }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 bg-clip-text text-transparent animate-pulse">
                  Billing
                </span>{" "}
                <span className="text-gray-900">System</span>
              </h2>
              {fiscalYear && (
                <span className="text-sm mt-1">
                  CURRENT FY:{" "}
                  <span className="font-semibold">{fiscalYear}</span>
                </span>
              )}
            </div>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2"
            >
              <Menu size={18} />
            </Button>
          )}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen?.(false)}
              className="p-2"
            >
              <Menu size={18} />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {groupMenu &&
            Object.entries(groupMenu)?.map(([section, items]) => (
              <div key={section} className="mb-4">
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {(!isCollapsed || isMobile) && section}
                </div>
                {items?.map((item) => renderMenuItem(item))}
              </div>
            ))}
        </nav>
      </ScrollArea>

      <div className="p-3 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={() => setIsLogoutDialogOpen(true)}
          className={`w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 ${
            (isCollapsed && !isMobile) ? "px-2" : "px-3"
          }`}
        >
          <LogOut size={18} />
          {(!isCollapsed || isMobile) && <span className="ml-3">Logout</span>}
        </Button>
      </div>

      <LogoutDialog
        isLogoutDialogOpen={isLogoutDialogOpen}
        setIsLogoutDialogOpen={setIsLogoutDialogOpen}
      />

      {role !== "superadmin" && <NewSidebarFooter role={role} />}
    </div>
  );
};

export default Sidebar;
