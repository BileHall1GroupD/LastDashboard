import React, { useState } from "react";
import {
  BarChart2,
  DollarSign,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  FileText,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: BarChart2,
    color: "#6366f1",
    href: "/dashboard",
  },
  { name: "Property", icon: ShoppingBag, color: "#8B5CF6", href: "/property" },
  { name: "Tenants", icon: DollarSign, color: "#10B981", href: "/Tenants" },
  { name: "Contactors", icon: ShoppingCart, color: "#F59E0B", href: "/Contactors" },
  { name: "Maintenance", icon: TrendingUp, color: "#3B82F6", href: "/maintenance" },
  { name: "Users", icon: Users, color: "#EC4899", href: "/users" },
  { name: "Invoices", icon: FileText, color: "#3B82F6", href: "/invoices" },

  {
    name: "Report",
    icon: FileText,
    color: "#6EE7B7",
    href: "/Report",
    submenu: [
      { name: "Tenant History", href: "/TenantsHistory" },
      { name: "Maintenance Report", href: "/Report" },
    ],
  },


  { name: "Report", icon: Settings, color: "#6EE7B7", href: "/Report" },


];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (item) => {
    if (activeMenu === item.name) {
      setActiveMenu(null);
    } else {
      setActiveMenu(item.name);
    }
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <div key={item.name}>
              <Link to={item.href} onClick={() => handleMenuClick(item)}>
                <div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 cursor-pointer">
                  <item.icon
                    size={20}
                    style={{ color: item.color, minWidth: "20px" }}
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>

              {/* Submenu for Report */}
              {item.submenu && activeMenu === item.name && isSidebarOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-8"
                >
                  {item.submenu.map((subItem) => (
                    <Link key={subItem.href} to={subItem.href}>
                      <motion.div
                        className="p-2 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {subItem.name}
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
