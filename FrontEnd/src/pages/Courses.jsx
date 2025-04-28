import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { FaPlus, FaSearch, FaEye, FaEdit, FaTrash, FaBook } from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import api from "../services/api";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, [currentPage]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.fetchCourses();
      if (response && !response.error) {
        setCourses(response.data || []);
        setTotalPages(Math.ceil((response.data || []).length / 10));
      } else {
        throw new Error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error(error.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        setLoading(true);
        const response = await api.deleteCourse(id);
        if (response && !response.error) {
          toast.success("Course deleted successfully");
          fetchCourses();
        } else {
          throw new Error("Failed to delete course");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error(error.response?.data?.message || "Failed to delete course");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6 pt-24">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
            <p className="text-gray-600 mt-2">Manage your courses</p>
          </div>

          {/* Search and Add Course */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
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

          {/* Courses Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : (
            <Card variant="elevated" hoverable>
              <CardHeader
                title="All Courses"
                subtitle="List of all available courses"
              />
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fees
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCourses.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-12">
                            <div className="flex flex-col items-center justify-center">
                              <FaBook className="text-4xl text-gray-400 mb-4" />
                              <h3 className="text-xl font-medium text-gray-700 mb-2">No Courses Found</h3>
                              <p className="text-gray-500 mb-4">There are no courses available at the moment.</p>
                              <Button
                                variant="primary"
                                onClick={() => navigate("/courses/add")}
                                className="flex items-center gap-2"
                              >
                                <FaPlus />
                                Add Your First Course
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredCourses.map((course) => (
                          <tr key={course._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{course.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{course.duration || '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">₹{course.fees}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="icon"
                                  onClick={() => navigate(`/courses/${course._id}`)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <FaEye />
                                </Button>
                                <Button
                                  variant="icon"
                                  onClick={() => navigate(`/editCourse/${course._id}`)}
                                  className="text-yellow-600 hover:text-yellow-800"
                                >
                                  <FaEdit />
                                </Button>
                                <Button
                                  variant="icon"
                                  onClick={() => handleDelete(course._id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {filteredCourses.length > 0 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Courses; 