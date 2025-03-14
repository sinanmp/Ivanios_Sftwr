import { useEffect, useState } from "react";
import logo from "../assets/logo.png.png";
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
  const [batchesOpen, setBatchesOpen] = useState(false); // State for batches dropdown
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/teachers")) {
      setTeachersOpen(true);
    }
    if (location.pathname.startsWith("/students")) {
      setStudentsOpen(true);
    }
    if (location.pathname.startsWith("/batches")) {
      setBatchesOpen(true);
    }
  }, [location.pathname]);

  function toggleIsOpen() {
    setIsOpen(!isOpen);
  }

  function handleParentClick(type) {
    if (!isOpen) {
      setIsOpen(true);
    }
    if (type === "teachers") {
      setTeachersOpen(!teachersOpen);
      setStudentsOpen(false);
      setBatchesOpen(false);
    } else if (type === "students") {
      setStudentsOpen(!studentsOpen);
      setTeachersOpen(false);
      setBatchesOpen(false);
    } else if (type === "batches") {
      setBatchesOpen(!batchesOpen);
      setTeachersOpen(false);
      setStudentsOpen(false);
    }
  }

  return (
    <div className="flex h-screen">
      <div
        className={`bg-white h-screen p-4 shadow-lg relative ${
          isOpen ? "w-64" : "w-16"
        } transition-all duration-300`}
      >
        <button
          onClick={toggleIsOpen}
          className="cursor-pointer absolute top-2 -right-12 bg-blue-500 text-white p-2 rounded-full shadow-md transition-all"
        >
          {isOpen ? <FaAngleLeft size={20} /> : <FaAngleRight size={20} />}
        </button>

        <div className="flex items-center justify-center space-x-2">
          {isOpen && <img src={logo} className="h-48" alt="" />}
        </div>

        <nav className="space-y-2">
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
          {/* Teachers Option will be available in the FUTURE */}
          {/* <div>
            <button
              onClick={() => handleParentClick("teachers")}
              className={`flex cursor-pointer justify-between items-center w-full p-2 rounded-md ${
                location.pathname.startsWith("/teachers")
                  ? "text-blue-600"
                  : "text-black"
              } hover:bg-gray-200`}
            >
              <div className="flex items-center space-x-2">
                <FaChalkboardTeacher size={20} />
                {isOpen && <span>Teachers</span>}
              </div>
              {isOpen && (teachersOpen ? <FaAngleDown /> : <FaAngleRight />)}
            </button>
            {teachersOpen && isOpen && (
              <div className="ml-6 space-y-1">
                <NavLink to="/teachers/all" className="block p-2 rounded-md hover:bg-gray-200">All Teachers</NavLink>
                <NavLink to="/teachers/add" className="block p-2 rounded-md hover:bg-gray-200">Add Teacher</NavLink>
              </div>
            )}
          </div> */}

          <div>
            <button
              onClick={() => handleParentClick("students")}
              className={`flex cursor-pointer justify-between items-center w-full p-2 rounded-md ${
                location.pathname.startsWith("/students")
                  ? "text-blue-600"
                  : "text-black"
              } hover:bg-gray-200`}
            >
              <div className="flex items-center space-x-2">
                <FaUsers size={20} />
                {isOpen && <span>Students</span>}
              </div>
              {isOpen && (studentsOpen ? <FaAngleDown /> : <FaAngleRight />)}
            </button>
            {studentsOpen && isOpen && (
              <div className="ml-6 space-y-1">
                <NavLink
                  to="/students/all"
                  className={`block p-2 rounded-md hover:bg-gray-200 ${
                    location.pathname.startsWith("/students/all")
                      ? "text-blue-600"
                      : "text-black"
                  }`}
                >
                  All Students
                </NavLink>
                <NavLink
                  to="/students/add"
                  className={`block p-2 rounded-md hover:bg-gray-200 ${
                    location.pathname.startsWith("/students/add")
                      ? "text-blue-600"
                      : "text-black"
                  }`}
                >
                  Add Student
                </NavLink>
                <NavLink
                  to="/students/attendance"
                  className="block p-2 rounded-md hover:bg-gray-200"
                >
                  Attendance
                </NavLink>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => handleParentClick("batches")}
              className={`flex cursor-pointer justify-between items-center w-full p-2 rounded-md ${
                location.pathname.startsWith("/batches")
                  ? "text-blue-600"
                  : "text-black"
              } hover:bg-gray-200`}
            >
              <div className="flex items-center space-x-2">
                <MdOutlineSchool size={20} />
                {isOpen && <span>Batches</span>}
              </div>
              {isOpen && (batchesOpen ? <FaAngleDown /> : <FaAngleRight />)}
            </button>
            {batchesOpen && isOpen && (
              <div className="ml-6 space-y-1">
                <NavLink
                  to="/batches/all"
                  className={`block p-2 rounded-md hover:bg-gray-200 ${
                    location.pathname.startsWith("/batches/all")
                      ? "text-blue-600"
                      : "text-black"
                  }`}
                >
                  All Batches
                </NavLink>
                <NavLink
                  to="/batches/add"
                  className={`block p-2 rounded-md hover:bg-gray-200 ${
                    location.pathname.startsWith("/batches/add")
                      ? "text-blue-600"
                      : "text-black"
                  }`}
                >
                  Add Batch
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
