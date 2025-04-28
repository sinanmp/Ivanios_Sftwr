import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaUserGraduate } from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import api from "../services/api";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.fetchStudents(currentPage, searchTerm);
      if (response && !response.error) {
        setStudents(response.students || []);
        setTotalPages(response.totalPages || 1);
      } else {
        throw new Error("Failed to fetch students");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error(error.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStudents();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/students/${id}`);
        toast.success("Student deleted successfully");
        fetchStudents();
      } catch (error) {
        toast.error("Failed to delete student");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-[250px]">
        <TopNav />
        <main className="flex-1 overflow-y-auto pt-16">
          <div className="p-4 md:p-6 w-full md:max-w-[calc(100vw-250px)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">All Students</h1>
              <Button
                variant="primary"
                onClick={() => navigate("/students/add")}
                className="w-full md:w-auto"
              >
                <FaPlus className="mr-2" />
                Add New Student
              </Button>
            </div>

            <Card variant="elevated" hoverable className="mb-6">
              <CardHeader
                title="Search Students"
                subtitle="Find students by name, roll number, or email"
              />
              <CardContent>
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                  <Input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="primary" className="w-full md:w-auto">
                    <FaSearch className="mr-2" />
                    Search
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card variant="elevated" hoverable>
              <CardHeader
                title="Student List"
                subtitle={`Showing ${students.length} students`}
              />
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Spinner />
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Enrollment No.
                            </th>
                            <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Admission No.
                            </th>
                            <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Pending Fees
                            </th>
                            <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mobile
                            </th>
                            <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Batch
                            </th>
                            <th scope="col" className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {students.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="px-3 md:px-6 py-4">
                                <div className="text-center py-8">
                                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <FaUserGraduate className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
                                  <p className="text-gray-500 mb-4">There are currently no students in the system.</p>
                                  <Button
                                    variant="primary"
                                    onClick={() => navigate("/students/add")}
                                    className="inline-flex items-center"
                                  >
                                    <FaPlus className="mr-2" />
                                    Add New Student
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            students.map((student) => (
                              <tr key={student._id} className="hover:bg-gray-50">
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10">
                                      <img
                                        className="h-8 w-8 md:h-10 md:w-10 rounded-full"
                                        src={student.profileImage?.url || "https://via.placeholder.com/40"}
                                        alt=""
                                      />
                                    </div>
                                    <div className="ml-3 md:ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {student.name}
                                      </div>
                                      <div className="text-xs text-gray-500 md:hidden">
                                        {student.enrollmentNo}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{student.enrollmentNo}</div>
                                </td>
                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{student.admissionNo}</div>
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm flex gap-1.5 text-red-500">
                                    {student.totalFees - student.feesPaid}
                                    <button className="text-blue-600 hover:text-blue-900 transition-colors duration-150">
                                      <FaEdit className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{student.mobile}</div>
                                </td>
                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{student.batch?.batchName || "N/A"}</div>
                                </td>
                                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                  <div className="flex justify-center space-x-2 md:space-x-3">
                                    <button
                                      onClick={() => navigate(`/studentDetails/${student._id}`)}
                                      className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                                      title="View Details"
                                    >
                                      <FaEye className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => navigate(`/editStudent/${student._id}`)}
                                      className="text-yellow-600 hover:text-yellow-900 transition-colors duration-150"
                                      title="Edit Student"
                                    >
                                      <FaEdit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(student._id)}
                                      className="text-red-600 hover:text-red-900 transition-colors duration-150"
                                      title="Delete Student"
                                    >
                                      <FaTrash className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 px-4">
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllStudents;