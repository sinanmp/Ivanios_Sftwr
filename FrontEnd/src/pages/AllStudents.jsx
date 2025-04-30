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
        setLoading(true);
         const res = await api.deleteStudent(id);
         console.log(res,"this is res");
         if(res && !res.error){
          toast.success("Student deleted successfully");
          fetchStudents();
         }else{
          toast.error("Failed to delete student");
         }
      } catch (error) {
        console.log(error,"this is error");
        toast.error("Failed to delete student");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-24">
          <div className="max-w-[2000px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">All Students</h1>
                <p className="text-sm md:text-base text-gray-600">Manage and view all student records</p>
              </div>
              <Button
                variant="primary"
                onClick={() => navigate("/students/add")}
                className="w-full md:w-auto flex items-center justify-center gap-2 py-2.5"
              >
                <FaPlus className="text-lg" />
                <span>Add New Student</span>
              </Button>
            </div>

            {/* Search Section */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 mb-6">
              <CardHeader
                title="Search Students"
                subtitle="Find students by name, roll number, or email"
              />
              <CardContent className="p-4 md:p-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full md:w-auto flex items-center justify-center gap-2 py-2.5"
                  >
                    <FaSearch className="text-lg" />
                    <span>Search</span>
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Students List */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader
                title="Student List"
                subtitle={`Showing ${students.length} students`}
              />
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Spinner />
                  </div>
                ) : (
                  <>
                    {/* Mobile View */}
                    <div className="md:hidden">
                      {students.length === 0 ? (
                        <EmptyState />
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {students.map((student) => (
                            <div key={student._id} className="p-4 hover:bg-gray-50">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={student.profileImage?.url || "https://via.placeholder.com/40"}
                                  alt=""
                                  className="h-12 w-12 rounded-full object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                                  <p className="text-xs text-gray-500">{student.enrollmentNo}</p>
                                  <p className="text-xs text-gray-500">{student.batch?.batchName || "No Batch"}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => navigate(`/studentDetails/${student._id}`)}
                                    className="p-2 text-indigo-600 hover:text-indigo-900"
                                  >
                                    <FaEye className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => navigate(`/editStudent/${student._id}`)}
                                    className="p-2 text-yellow-600 hover:text-yellow-900"
                                  >
                                    <FaEdit className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                              <div className="mt-2 flex justify-between items-center">
                                <div className="text-sm text-red-500">
                                  Pending: ₹{student.totalFees - student.feesPaid}
                                </div>
                                <button
                                  onClick={() => handleDelete(student._id)}
                                  className="text-red-600 hover:text-red-900 p-2"
                                >
                                  <FaTrash className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Enrollment No.
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Admission No.
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Pending Fees
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mobile
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Batch
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {students.length === 0 ? (
                            <tr>
                              <td colSpan="7">
                                <EmptyState />
                              </td>
                            </tr>
                          ) : (
                            students.map((student) => (
                              <tr key={student._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <img
                                      className="h-10 w-10 rounded-full object-cover"
                                      src={student.profileImage?.url || "https://via.placeholder.com/40"}
                                      alt=""
                                    />
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                      <div className="text-sm text-gray-500">{student.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {student.enrollmentNo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {student.admissionNo}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {student.totalFees - student.feesPaid > 0 ? (
                                      `₹${student.totalFees - student.feesPaid}`
                                    ) : (
                                      <span className="text-green-600 font-medium">No Pending</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {student.mobile}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {student.batch?.batchName || "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <div className="flex items-center justify-center space-x-3">
                                    <button
                                      onClick={() => navigate(`/studentDetails/${student._id}`)}
                                      className="text-indigo-600 hover:text-indigo-900 p-1.5"
                                      title="View Details"
                                    >
                                      <FaEye className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => navigate(`/editStudent/${student._id}`)}
                                      className="text-yellow-600 hover:text-yellow-900 p-1.5"
                                      title="Edit Student"
                                    >
                                      <FaEdit className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(student._id)}
                                      className="text-red-600 hover:text-red-900 p-1.5"
                                      title="Delete Student"
                                    >
                                      <FaTrash className="h-5 w-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="py-2"
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="py-2"
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

// Empty State Component
const EmptyState = () => (
  <div className="text-center py-12">
    <div className="flex justify-center mb-4">
      <div className="p-3 bg-gray-100 rounded-full">
        <FaUserGraduate className="w-8 h-8 text-gray-400" />
      </div>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
    <p className="text-gray-500 mb-6">There are currently no students in the system.</p>
    <Button
      variant="primary"
      onClick={() => navigate("/students/add")}
      className="inline-flex items-center justify-center gap-2"
    >
      <FaPlus />
      Add New Student
    </Button>
  </div>
);

export default AllStudents;