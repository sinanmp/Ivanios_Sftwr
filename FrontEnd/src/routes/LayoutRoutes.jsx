import { Routes, Route } from "react-router-dom";
import AddStudent from "../pages/AddStudent";
import AllStudents from "../pages/AllStudents";
import AboutStudent from "../components/AboutStudent";

const LayoutRoutes = () => {
  return (
    <div>
        <Routes>
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/all" element={<AllStudents />} />
          <Route path="/students/about" element={<AboutStudent />} />
        </Routes>
    </div>
  );
};

export default LayoutRoutes;
