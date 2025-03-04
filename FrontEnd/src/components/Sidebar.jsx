import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaAngleLeft,
  FaAngleRight,
  FaUser,
  FaChalkboardTeacher,
  FaHome,
  FaUsers,
  FaPlus,
  FaAngleDown,
} from "react-icons/fa";
import { MdOutlineSchool } from "react-icons/md";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [teachersOpen, setTeachersOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-white h-screen p-4 shadow-lg relative ${
          isOpen ? "w-64" : "w-16"
        } transition-all duration-300`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer absolute top-4 -right-6 bg-blue-500 text-white p-2 rounded-full shadow-md transition-all"
        >
          {isOpen ? <FaAngleLeft size={20} /> : <FaAngleRight size={20} />}
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2 mb-6">
          <MdOutlineSchool size={30} className="text-blue-600" />
          {isOpen && <h2 className="text-xl font-semibold text-gray-700">Smart</h2>}
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {/* Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center p-2 space-x-2 rounded-md ${
                isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
              }`
            }
          >
            <FaHome size={20} />
            {isOpen && <span>Dashboard</span>}
          </NavLink>

          {/* Teachers Section */}
          <div>
            <button
              onClick={() => setTeachersOpen(!teachersOpen)}
              className={`cursor-pointer  ${teachersOpen ? "text-blue-600": "text-black"} flex justify-between items-center w-full p-2 rounded-md hover:bg-gray-200`}
            >
              <div className="flex items-center space-x-2">
                <FaChalkboardTeacher size={20} />
                {isOpen && <span>Teachers</span>}
              </div>
              {isOpen && (teachersOpen ? <FaAngleDown /> : <FaAngleRight />)}
            </button>

            {/* Teachers Submenu */}
            {teachersOpen && (
              <div className="ml-6 space-y-1">
                <NavLink
                  to="/teachers/all"
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                    }`
                  }
                >
                  All Teachers
                </NavLink>
                <NavLink
                  to="/teachers/add"
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                    }`
                  }
                >
                  Add Teacher
                </NavLink>
                <NavLink
                  to="/teachers/edit"
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                    }`
                  }
                >
                  Edit Teacher
                </NavLink>
                <NavLink
                  to="/teachers/about"
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                    }`
                  }
                >
                  About Teacher
                </NavLink>
                <NavLink
                  to="/teachers/timetable"
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                    }`
                  }
                >
                  Teacher Timetable
                </NavLink>
                <NavLink
                  to="/teachers/assign"
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                    }`
                  }
                >
                  Assign Class Teacher
                </NavLink>
              </div>
            )}
          </div>

          {/* Students Section */}
          <div>
            <button
              onClick={() => setStudentsOpen(!studentsOpen)}
              className="flex justify-between items-center w-full p-2 rounded-md hover:bg-gray-200"
            >
              <div className="flex items-center space-x-2">
                <FaUsers size={20} />
                {isOpen && <span>Students</span>}
              </div>
              {isOpen && (studentsOpen ? <FaAngleDown /> : <FaAngleRight />)}
            </button>

            {/* Students Submenu */}
            {studentsOpen && (
              <div className="ml-6 space-y-1">
                <NavLink
                  to="/students/all"
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                    }`
                  }
                >
                  All Students
                </NavLink>
                <NavLink
                  to="/students/add"
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                    }`
                  }
                >
                  Add Student
                </NavLink>
                <NavLink
                  to="/students/edit"
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                    }`
                  }
                >
                  Edit Student
                </NavLink>
                <NavLink
                  to="/students/about"
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                    }`
                  }
                >
                  About Student
                </NavLink>
                <NavLink
                  to="/students/timetable"
                  className={({ isActive }) =>
                    `block p-2 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
                    }`
                  }
                >
                  Student Attendance
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
