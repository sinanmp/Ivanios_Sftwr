import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaChevronRight,
  FaPlus,
  FaEye,
  FaCalendarAlt,
  FaUserTie,
  FaBook,
  FaEdit,
  FaTrash,
  FaGraduationCap,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import TopNav from "../components/TopNav";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.fetchCourses();
      console.log('Courses response:', response); // Debug log
      if (response && !response.error) {
        setCourses(response.data || []);
      } else {
        throw new Error(response.message || "Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error(error.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-24">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
              <p className="text-gray-600 mt-2">Manage and view all courses</p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate("/courses/add")}
              className="flex items-center gap-2"
            >
              <FaPlus />
              Add Course
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : (
            /* Courses Table */
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">All Courses</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fees
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <tr key={course._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{course.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{course.duration}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">₹{course.fees}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex justify-center space-x-3">
                              <button
                                onClick={() => navigate(`/courseDetails/${course._id}`)}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                                title="View Details"
                              >
                                <FaEye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => navigate(`/editCourse/${course._id}`)}
                                className="text-green-600 hover:text-green-900 transition-colors duration-150"
                                title="Edit Course"
                              >
                                <FaEdit className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No courses available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CoursesPage; 