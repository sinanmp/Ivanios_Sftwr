import { Routes, Route } from "react-router-dom";
import AddStudent from "../pages/AddStudent";
import AllStudents from "../pages/AllStudents";
import AboutStudent from "../components/AboutStudent";
import LoginPage from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import BatchesPage from "../pages/Batches";
import AddBatchPage from "../pages/AddBatch";
import StudentDetails from "../pages/StudentDetails";
const LayoutRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/all" element={<AllStudents />} />
          <Route path="/students/about" element={<AboutStudent />} />
          <Route path="/batches/all" element={<BatchesPage />} />
          <Route path="/batches/add" element={<AddBatchPage />} />
          <Route path="/studentDetails/:id" element={<StudentDetails />} />
        </Route>
      </Routes>
    </div>
  );
};

export default LayoutRoutes;
