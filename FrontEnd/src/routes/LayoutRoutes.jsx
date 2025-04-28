import { Routes, Route } from "react-router-dom";
import AddStudent from "../pages/AddStudent";
import AllStudents from "../pages/AllStudents";
import AboutStudent from "../components/AboutStudent";
import LoginPage from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import BatchesPage from "../pages/Batches";
import AddBatchPage from "../pages/AddBatch";
import StudentDetails from "../pages/StudentDetails";
import BatchDetailsPage from "../pages/BatchDetailsPage";
import Dashboard from "../pages/Dashboard";
import EditStudent from "../pages/EditStudent";
import EditBatch from "../pages/EditBatch";
import Courses from "../pages/Courses";
import AddCourse from "../pages/AddCourse";
import EditCourse from "../pages/EditCourse";
import CourseDetails from "../pages/CourseDetails";
import ErrorBoundary from "../components/ErrorBoundary";

const LayoutRoutes = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students/all" element={<AllStudents />} />
          <Route path="/students/about" element={<AboutStudent />} />
          <Route path="/studentDetails/:id" element={<StudentDetails />} />
          <Route path="/editStudent/:id" element={<EditStudent />} />
          <Route path="/batches/all" element={<BatchesPage />} />
          <Route path="/batches/add" element={<AddBatchPage />} />
          <Route path="/batchDetails/:id" element={<BatchDetailsPage/>}/>
          <Route path="/edit-batch/:id" element={<EditBatch/>}/>
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/add" element={<AddCourse />} />
          <Route path="/editCourse/:id" element={<EditCourse />} />
          <Route path="/courseDetails/:id" element={<CourseDetails />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};

export default LayoutRoutes;
