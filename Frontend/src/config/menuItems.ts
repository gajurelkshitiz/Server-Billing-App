import { BiSolidBellRing } from "react-icons/bi";
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
  FaGift,
  FaMoneyBillWave,
  FaShoppingBag,
  FaBox,
  // Add these new icons for better matching
  FaCreditCard,
  FaChartLine,
  FaFileContract,
  FaUserFriends,
  FaInfoCircle,
  FaReceipt,
  FaHandHoldingUsd,
  FaCalendarCheck,
  FaShieldAlt,
  FaSlidersH,
} from "react-icons/fa";

export const allMenuItems = [
  {
    section: "MAIN",
    title: "Home",
    path: "/home/dashboard",
    icon: FaChartLine, // Changed from FaHome to FaChartLine for better dashboard representation
    color: "bg-indigo-600", // Changed to more professional indigo
  },
  {
    section: "OPERATIONS",
    title: "Admin",
    path: "/admin",
    icon: FaUserShield,
    color: "bg-red-600", // Changed to red for admin/security
    countKey: "admins"
  },
  {
    section: "OPERATIONS",
    title: "Subscription",
    path: "/subscription",
    icon: FaCreditCard, // Changed from FaBoxOpen to FaCreditCard for subscription
    color: "bg-emerald-600", // Changed to emerald for subscription/recurring payments
    countKey: "subscriptions",
  },

  // Purchase Module with nested items
  {
    section: "OPERATIONS",
    title: "Purchase Module",
    path: "/purchaseEntry",
    icon: FaBox,
    color: "bg-orange-600", // Darkened orange
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
        icon: FaTruck, // Changed from FaAddressCard to FaTruck for supplier
        color: "bg-blue-600", // Changed to blue for suppliers
        countKey: "suppliers",
      },
      {
        title: "Purchase Due List",
        path: "/purchasedueList",
        icon: FaClipboardList,
        color: "bg-amber-600", // Changed to amber for due items
        countKey: "purchasedueList",
      },
      // {
      //   title: "Purchase Payment List",
      //   path: "/purchasepaymentList",
      //   icon: FaHandHoldingUsd, // Changed to more specific payment icon
      //   color: "bg-green-600", // Changed to green for payments
      //   countKey: "purchasepaymentList",
      // },
    ]
  },
  // Sales Module with nested items
  {
    section: "OPERATIONS",
    title: "Sales Module",
    path: "/salesEntry",
    icon: FaShoppingBag,
    color: "bg-green-600", // Darkened green
    isParent: true,
    children: [
      {
        title: "Sales Entry",
        path: "/salesEntry",
        icon: FaReceipt, // Changed from FaFileInvoiceDollar to FaReceipt for sales entry
        color: "bg-green-500",
        countKey: "salesEntries",
      },
      {
        title: "Customer",
        path: "/customer",
        icon: FaUserFriends, // Changed from FaAddressBook to FaUserFriends for customers
        color: "bg-blue-600", // Changed to blue for customers
        countKey: "customers",
      },
      {
        title: "Sales Due List",
        path: "/salesdueList",
        icon: FaClipboardCheck,
        color: "bg-amber-600", // Changed to amber for due items
        countKey: "salesdueList",
      },
      // {
      //   title: "Sales Payment List",
      //   path: "/salespaymentList",
      //   icon: FaMoneyBillWave,
      //   color: "bg-green-600", // Changed to green for payments
      //   countKey: "salespaymentList",
      // },
      // {
      //   title: "Customer INFO",
      //   path: "/customerInfo",
      //   icon: FaInfoCircle, // Changed from FaMoneyCheckAlt to FaInfoCircle for info
      //   color: "bg-cyan-600", // Changed to cyan for information
      //   countKey: "customerInfo",
      // },
    ]
  },
  {
    section: "OPERATIONS",
    title: "User",
    path: "/user",
    icon: FaUsers, // Changed from FaUserTie to FaUsers for multiple users
    color: "bg-purple-600", // Changed to purple for users
    countKey: "users",
  },
  {
    section: "OPERATIONS",
    title: "Company",
    path: "/company",
    icon: FaBuilding,
    color: "bg-slate-600", // Changed to slate for company/organization
    countKey: "companies",
  },
  {
    section: "OPERATIONS",
    title: "Attachments",
    path: "/attachments",
    icon: FaFileContract, // Using document icon for attachments
    color: "bg-blue-700", // Blue for document management
    countKey: "attachments",
  },
  {
    section: "OPERATIONS",
    title: "Item Configuration",
    path: "/configuration",
    icon: FaSlidersH, // Using document icon for attachments
    color: "bg-blue-700", // Blue for document management
  },
  {
    section: "OPERATIONS",
    title: "Fiscal Year",
    path: "/fiscalyear",
    icon: FaCalendarCheck, // Changed from FaCalendarAlt to FaCalendarCheck for fiscal year
    color: "bg-teal-600", // Changed to teal for fiscal/time-based operations
  },
  {
    section: "RESOURCES",
    title: "Excel Templates",
    path: "/download-templates",
    icon: FaFileContract, // Changed to document icon for templates
    color: "bg-blue-600", // Blue for resources/documents
    countKey: "templates",
  },
  {
    section: "OTHERS",
    title: "Subcription Plans",
    path: "/subscription-available",
    icon: FaGift, // Using gift icon for available subscription plans
    color: "bg-purple-600", // Purple for promotional/available plans
    countKey: "availablePlans",
  },

  {
    section: "SYSTEM",
    title: "Permission",
    path: "/permission",
    icon: FaShieldAlt, // Changed from FaUserCog to FaShield for permissions/security
    color: "bg-rose-600", // Changed to rose for security/permissions
  },
  {
    section: "SYSTEM",
    title: "Notifications",
    path: "/notifications",
    icon: BiSolidBellRing,
     // Darkened gray
  },
  {
    section: "SYSTEM",
    title: "Settings",
    path: "/settings",
    icon: FaCog,
     // Darkened gray
  },
];
