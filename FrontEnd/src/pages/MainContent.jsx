import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AddStudent from "../components/AddStudent";
import AllStudents from "../components/AllStudents";
import EditStudent from "../components/EditStudent";
import AboutStudent from "../components/AboutStudent";
import StudentAttendance from "../components/StudentAttendance";

const MainContent = () => {
  return (
    <div className="flex h-screen">

      {/* Main Content (Takes Available Space) */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Routes>
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/all" element={<AllStudents />} />
          <Route path="/students/about" element={<AboutStudent />} />
          <Route path="/students/attendance" element={<StudentAttendance />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainContent;
