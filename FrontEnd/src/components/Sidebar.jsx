import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaAngleLeft,
  FaAngleRight,
  FaUser,
  FaChalkboardTeacher,
  FaHome,
  FaUsers,
  FaAngleDown,
} from "react-icons/fa";
import { MdOutlineSchool } from "react-icons/md";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [teachersOpen, setTeachersOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/teachers")) {
      setTeachersOpen(true);
    }
    if (location.pathname.startsWith("/students")) {
      setStudentsOpen(true);
    }
  }, [location.pathname]);

  function toggleIsOpen() {
    setIsOpen(!isOpen);
    if (!isOpen) {
      if (location.pathname.startsWith("/teachers")) {
        setTeachersOpen(true);
      }
      if (location.pathname.startsWith("/students")) {
        setStudentsOpen(true);
      }
    }
  }

  function handleParentClick(type) {
    if (!isOpen) {
      setIsOpen(true);
    }
    if (type === "teachers") {
      setTeachersOpen(!teachersOpen);
      setStudentsOpen(false);
    } else {
      setStudentsOpen(!studentsOpen);
      setTeachersOpen(false);
    }
  }

  return (
    <div className="flex h-screen">
      <div className={`bg-white h-screen p-4 shadow-lg relative ${isOpen ? "w-64" : "w-16"} transition-all duration-300`}>
        <button
          onClick={toggleIsOpen}
          className="cursor-pointer absolute top-4 -right-6 bg-blue-500 text-white p-2 rounded-full shadow-md transition-all"
        >
          {isOpen ? <FaAngleLeft size={20} /> : <FaAngleRight size={20} />}
        </button>

        <div className="flex items-center space-x-2 mb-6">
          <MdOutlineSchool size={30} className="text-blue-600" />
          {isOpen && <h2 className="text-xl font-semibold text-gray-700">Smart</h2>}
        </div>

        <nav className="space-y-2">
          <NavLink to="/" className={({ isActive }) => `flex items-center p-2 space-x-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}>
            <FaHome size={20} />
            {isOpen && <span>Dashboard</span>}
          </NavLink>

          <div>
            <button
              onClick={() => handleParentClick("teachers")}
              className={`flex cursor-pointer justify-between items-center w-full p-2 rounded-md ${location.pathname.startsWith("/teachers") ? "text-blue-600" : "text-black"} hover:bg-gray-200`}
            >
              <div className="flex items-center space-x-2">
                <FaChalkboardTeacher size={20} className={({isActive})=> `${isActive ? "bg-blue-100" : "hover:bg-grey-200"}`} />
                {isOpen && <span>Teachers</span>}
              </div>
              {isOpen && (teachersOpen ? <FaAngleDown /> : <FaAngleRight />)}
            </button>
            {teachersOpen && isOpen && (
              <div className="ml-6 space-y-1">
                <NavLink to="/teachers/all" className={({ isActive }) => `block p-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}>All Teachers</NavLink>
                <NavLink to="/teachers/add" className={({ isActive }) => `block p-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}>Add Teacher</NavLink>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => handleParentClick("students")}
              className={`flex cursor-pointer justify-between items-center w-full p-2 rounded-md ${location.pathname.startsWith("/students") ? "text-blue-600" : "text-black"} hover:bg-gray-200`}
            >
              <div className="flex items-center space-x-2">
                <FaUsers size={20} />
                {isOpen && <span>Students</span>}
              </div>
              {isOpen && (studentsOpen ? <FaAngleDown /> : <FaAngleRight />)}
            </button>
            {studentsOpen && isOpen && (
              <div className="ml-6 space-y-1">
                <NavLink to="/students/all" className={({ isActive }) => `block p-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}>All Students</NavLink>
                <NavLink to="/students/add" className={({ isActive }) => `block p-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}>Add Student</NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;