import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserGraduate,
  FaUsers,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
  FaChalkboardTeacher,
  FaBook,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({
    students: false,
    batches: false,
  });
  const location = useLocation();

  // Keep dropdowns open if their sub-items are active
  useEffect(() => {
    const path = location.pathname;
    setOpenDropdowns({
      students: path.startsWith('/students/'),
      batches: path.startsWith('/batches/'),
    });
  }, [location.pathname]);

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const menuItems = [
    {
      path: "/dashboard",
      icon: <FaHome className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      type: "dropdown",
      icon: <FaUserGraduate className="w-5 h-5" />,
      label: "Students",
      key: "students",
      items: [
        { path: "/students/all", label: "All Students" },
        { path: "/students/add", label: "Add Student" },
      ],
    },
    {
      type: "dropdown",
      icon: <FaUsers className="w-5 h-5" />,
      label: "Batches",
      key: "batches",
      items: [
        { path: "/batches/all", label: "All Batches" },
        { path: "/batches/add", label: "Add Batch" },
      ],
    },
    {
      type: "dropdown",
      icon: <FaBook className="w-5 h-5" />,
      label: "Courses",
      key: "courses",
      items: [
        { path: "/courses", label: "All Courses" },
        { path: "/courses/add", label: "Add Course" },
      ],
    },
  ];

  const isSubItemActive = (items) => {
    return items.some(item => location.pathname === item.path);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        style={{ '--sidebar-width': '16rem' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white">Student Portal</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => (
              <div key={item.path || item.key}>
                {item.type === "dropdown" ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.key)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        openDropdowns[item.key] || isSubItemActive(item.items)
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {openDropdowns[item.key] || isSubItemActive(item.items) ? (
                        <FaChevronDown className="w-4 h-4" />
                      ) : (
                        <FaChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {(openDropdowns[item.key] || isSubItemActive(item.items)) && (
                      <div className="pl-12 py-2 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                              location.pathname === subItem.path
                                ? "bg-blue-600 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-gray-400">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
