// Sidebar.jsx
import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import {
  FaHome,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaUsers,
  FaPencilAlt,
} from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import useRole from "../hooks/useRole";
import Loader from "./Loader";
import { CgProfile } from "react-icons/cg";
import { ArrowLeft } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { role, loading } = useRole();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const adminMenu = [
    // Changed path from "" to "/dashboard" to make exact matching work
    { name: "Dashboard", path: "/dashboard", icon: <FaHome />, end: true },
    { name: "Profile", path: "/dashboard/profile", icon: <CgProfile /> },
    { name: "All Users", path: "/dashboard/all-users", icon: <FaUsers /> },
    {
      name: "All Donation Request",
      path: "/dashboard/all-blood-donation-request",
      icon: <FaClipboardList />,
    },
    {
      name: "Content Management",
      path: "/dashboard/content-management",
      icon: <FaPencilAlt />,
    },
  ];

  const donorMenu = [
    // Changed path from "" to "/dashboard" to make exact matching work
    { name: "Dashboard", path: "/dashboard", icon: <FaHome />, end: true },
    { name: "Profile", path: "/dashboard/profile", icon: <CgProfile /> },
    {
      name: "My Donation Request",
      path: "/dashboard/my-donation-requests",
      icon: <FaClipboardList />,
    },
    {
      name: "Create Donation Request",
      path: "/dashboard/create-donation-request",
      icon: <MdCreate />,
    },
  ];

  const receiverMenu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome />, end: true },
    { name: "Profile", path: "/dashboard/profile", icon: <CgProfile /> },
    {
      name: "My Requests",
      path: "/dashboard/my-donation-requests",
      icon: <FaClipboardList />,
    },
    {
      name: "Create Request",
      path: "/dashboard/create-donation-request",
      icon: <MdCreate />,
    },
  ];

  const defaultMenu = [
    // Changed path from "" to "/dashboard" to make exact matching work
    { name: "Dashboard", path: "/dashboard", icon: <FaHome />, end: true },
    { name: "Profile", path: "/dashboard/profile", icon: <CgProfile /> },
    {
      name: "All Donation Request",
      path: "/dashboard/all-blood-donation-request",
      icon: <FaClipboardList />,
    },
    {
      name: "Content Management",
      path: "/dashboard/content-management",
      icon: <FaPencilAlt />,
    },
  ];

  let menuItems = defaultMenu;

  if (role === "admin") menuItems = adminMenu;
  else if (role === "donor") menuItems = donorMenu;
  else if (role === "receiver") menuItems = receiverMenu;

  // Loading is now handled at DashboardLayout level to avoid double loaders
  // if (loading) return <Loader label="Loading sidebar..." />;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-nav border-b border-border shadow-nav z-40 flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">
            BloodBridge
          </span>
          <span className="text-2xl">🩸</span>
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-700 hover:text-red-700 hover:bg-rose-50 transition-all duration-200"
        >
          <FaBars />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebarOnMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen glass border-r border-rose-200 shadow-2xl z-50 transform transition-all duration-300 flex flex-col backdrop-blur-xl ${
          isMobile
            ? isOpen
              ? "w-72 translate-x-0"
              : "w-72 -translate-x-full"
            : isOpen
            ? "w-72"
            : "w-20"
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Desktop Logo & Toggle */}
          <div className="hidden lg:flex items-center justify-between h-16 px-4 border-b border-border">
            <Link to="/dashboard" className="flex items-center space-x-2 group">
              <span
                className={`font-black text-xl tracking-tight bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent transition-opacity duration-300 ${
                  !isOpen && "opacity-0 hidden"
                }`}
              >
                BloodBridge
              </span>
              <span className="text-2xl">🩸</span>
            </Link>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-border">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2"
              onClick={closeSidebarOnMobile}
            >
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">
                BloodBridge
              </span>
              <span className="text-2xl">🩸</span>
            </Link>
            <button
              onClick={closeSidebarOnMobile}
              className="p-2 rounded-lg text-gray-700 hover:text-red-700 hover:bg-rose-50 transition-all duration-200"
            >
              <FaTimes />
            </button>
          </div>

          {/* Section Label */}
          <div className="px-4 mt-6 mb-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-rose-100 to-red-100 rounded-full ${
                !isMobile && !isOpen ? "opacity-0 hidden" : ""
              }`}
            >
              <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></span>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                {role === "admin"
                  ? "Admin Panel"
                  : role === "donor"
                  ? "Donor Dashboard"
                  : role === "receiver"
                  ? "Recipient Dashboard"
                  : "Volunteer Panel"}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col mt-4 space-y-1 px-2">
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                end={item.end || false} // Use the end prop to ensure exact matching
                onClick={closeSidebarOnMobile}
                title={item.name}
                aria-label={item.name}
                className={({ isActive }) =>
                  `group relative flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-500/50 scale-105"
                      : "text-gray-700 hover:text-rose-600 hover:bg-white/50 hover:scale-105"
                  }`
                }
              >
                <span className="text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>
                <span
                  className={`transition-opacity duration-300 ${
                    !isMobile && !isOpen && "opacity-0 hidden"
                  }`}
                >
                  {item.name}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <footer className="mt-auto pb-6 px-4 border-t border-rose-200 pt-4 space-y-3">
          {role === "donor" && (
            <Link
              to="/dashboard/create-donation-request"
              onClick={() => isMobile && setIsOpen(false)}
              className={`group flex items-center justify-center gap-2 w-full px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105 ${
                !isMobile && !isOpen ? "truncate" : ""
              }`}
            >
              <MdCreate className="text-lg" />
              {(!isMobile || isOpen) && <span>New Request</span>}
            </Link>
          )}
          <Link
            to="/"
            onClick={() => isMobile && setIsOpen(false)}
            className={`group flex items-center gap-2 w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
              !isMobile && !isOpen ? "justify-center" : "justify-start"
            } text-gray-700 hover:text-rose-600 hover:bg-white/50 hover:scale-105`}
          >
            <ArrowLeft className="text-lg flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
            {(!isMobile || isOpen) && (
              <span className="transition-opacity duration-300">
                Back to Home
              </span>
            )}
          </Link>
        </footer>
      </aside>

      {/* Mobile spacer to push content below mobile header */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default Sidebar;
