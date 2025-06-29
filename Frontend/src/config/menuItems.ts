import {
  FaHome,
  FaUserShield,
  FaBoxOpen,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaUsers,
  FaTruck,
  FaUser,
  FaBuilding,
  FaAddressBook,
  FaAddressCard,
  FaUserTie,
  FaClipboardList,
  FaClipboardCheck,
  FaRegCalendarCheck,
  FaCalendarAlt,
  FaUserCog,
  FaCog,
  FaMoneyCheckAlt,
  FaMoneyBillWave,
  FaShoppingBag, // For Sales Module
  FaBox, // For Purchase Module
} from "react-icons/fa";

export const allMenuItems = [
  {
    section: "MAIN",
    title: "Dashboard",
    path: "/dashboard",
    icon: FaHome,
    color: "bg-blue-500",
  },
  {
    section: "OPERATIONS",
    title: "Admin",
    path: "/admin",
    icon: FaUserShield,
    color: "bg-blue-500",
    countKey: "admins"
  },
  {
    section: "OPERATIONS",
    title: "Subscription",
    path: "/subscription",
    icon: FaBoxOpen,
    color: "bg-green-500",
    countKey: "subscriptions",
  },
  // Purchase Module with nested items
  {
    section: "OPERATIONS",
    title: "Purchase Module",
    path: "/purchaseEntry", // Default path when clicked
    icon: FaBox,
    color: "bg-orange-500",
    isParent: true,
    children: [
      {
        title: "Purchase Entry",
        path: "/purchaseEntry",
        icon: FaShoppingCart,
        color: "bg-orange-500",
        countKey: "purchaseEntries",
      },
      {
        title: "Supplier",
        path: "/supplier",
        icon: FaAddressCard,
        color: "bg-purple-500",
        countKey: "suppliers",
      },
      {
        title: "Purchase Due List",
        path: "/purchasedueList",
        icon: FaClipboardList,
        color: "bg-red-500",
        countKey: "purchasedueList",
      },
      {
        title: "Purchase Payment List",
        path: "/purchasepaymentList",
        icon: FaMoneyBillWave,
        color: "bg-red-500",
        countKey: "purchasepaymentList",
      },
    ]
  },
  // Sales Module with nested items
  {
    section: "OPERATIONS",
    title: "Sales Module",
    path: "/salesEntry", // Default path when clicked
    icon: FaShoppingBag,
    color: "bg-green-500",
    isParent: true,
    children: [
      {
        title: "Sales Entry",
        path: "/salesEntry",
        icon: FaFileInvoiceDollar,
        color: "bg-green-500",
        countKey: "salesEntries",
      },
      {
        title: "Customer",
        path: "/customer",
        icon: FaAddressBook,
        color: "bg-blue-500",
        countKey: "customers",
      },
      {
        title: "Sales Due List",
        path: "/salesdueList",
        icon: FaClipboardCheck,
        color: "bg-red-500",
        countKey: "salesdueList",
      },
      {
        title: "Sales Payment List",
        path: "/salespaymentList",
        icon: FaMoneyCheckAlt,
        color: "bg-red-500",
        countKey: "salespaymentList",
      },
    ]
  },
  {
    section: "OPERATIONS",
    title: "User",
    path: "/user",
    icon: FaUserTie,
    color: "bg-blue-500",
    countKey: "users",
  },
  {
    section: "OPERATIONS",
    title: "Company",
    path: "/company",
    icon: FaBuilding,
    color: "bg-purple-500",
    countKey: "companies",
  },
  {
    section: "OPERATIONS",
    title: "Fiscal Year",
    path: "/fiscalyear",
    icon: FaCalendarAlt,
    color: "bg-purple-500",
  },
  {
    section: "SYSTEM",
    title: "Permission",
    path: "/permission",
    icon: FaUserCog,
    color: "bg-yellow-500",
  },
  {
    section: "SYSTEM",
    title: "Settings",
    path: "/settings",
    icon: FaCog,
    color: "bg-gray-500"
  },
];
