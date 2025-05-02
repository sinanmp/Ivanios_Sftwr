import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import { format } from "date-fns";
import { FaHome, FaChevronRight, FaEye, FaEdit, FaTrash, FaCalendarAlt, FaUserTie, FaBook } from "react-icons/fa";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";

const BatchDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        setLoading(true);
        const response = await api.getBatchDetails(id);
        console.log("Batch details response:", response);
        if (response && !response.error) {
          console.log("Batch students:", response.data.students);
          setBatch(response.data);
        } else {
          throw new Error(response?.message || "Failed to fetch batch details");
        }
      } catch (err) {
        console.error("Error fetching batch details:", err);
        setError(err.response?.data?.message || "Failed to fetch batch details");
        toast.error(err.response?.data?.message || "Failed to fetch batch details");
      } finally {
        setLoading(false);
      }
    };

    fetchBatchDetails();
  }, [id]);

  const handleDelete = async (studentId) => {
    try {
      await api.deleteStudent(studentId);
      setBatch(prev => ({
        ...prev,
        students: prev.students.filter(student => student._id !== studentId)
      }));
      toast.success("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(error.response?.data?.message || "Failed to delete student");
    }
  };

  if (loading) {
    return (
      <div className="flex fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-64" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
          <TopNav />
          <main className="flex-1 overflow-y-auto p-6 pt-24">
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-64" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
          <TopNav />
          <main className="flex-1 overflow-y-auto p-6 pt-24">
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => navigate("/batches/all")}
                className="flex items-center gap-2"
              >
                <FaArrowLeft />
                Back to Batches
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="flex fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-64" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
          <TopNav />
          <main className="flex-1 overflow-y-auto p-6 pt-24">
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-500 text-lg mb-4">No batch details found</p>
              <Button
                variant="outline"
                onClick={() => navigate("/batches/all")}
                className="flex items-center gap-2"
              >
                <FaArrowLeft />
                Back to Batches
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-gray-600 space-x-2 text-lg font-medium mb-6">
            <FaHome className="text-blue-500" />
            <FaChevronRight className="text-gray-400" />
            <span 
              onClick={() => navigate("/batches/all")}
              className="cursor-pointer hover:text-blue-500 transition-colors duration-200"
            >
              Batches
            </span>
            <FaChevronRight className="text-gray-400" />
            <span className="text-blue-500">{batch.batchName}</span>
          </div>

          {/* Main Content */}
          <Card variant="elevated" hoverable className="max-w-7xl mx-auto">
            <CardHeader
              title={batch.batchName}
              subtitle="Batch Details and Student Information"
            />
            <CardContent>
              {/* Batch Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Courses Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <FaBook className="text-blue-500 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-800">Courses</h3>
                  </div>
                  <ul className="space-y-2">
                    {batch.courses && batch.courses.length > 0 ? (
                      batch.courses.map((course, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {course.name}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No courses available</li>
                    )}
                  </ul>
                </div>

                {/* Batch Details */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaUserTie className="text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Instructor</p>
                        <p className="font-medium text-gray-800">{batch.instructor || "Not assigned"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="font-medium text-gray-800">
                          {format(new Date(batch.startDate), "dd MMMM yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="font-medium text-gray-800">
                          {format(new Date(batch.endDate), "dd MMMM yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Students Table */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Enrolled Students</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrollment No
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {batch.students && batch.students.length > 0 ? (
                        batch.students.map((student) => (
                          <tr key={student._id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                                    src={student.profileImage?.url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(student.name) + "&background=random"}
                                    alt={student.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(student.name) + "&background=random";
                                    }}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {student.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {student.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{student.enrollmentNo}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{batch.courses?.map(course => course.name).join(", ") || "N/A"}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                              <div className="flex justify-center space-x-3">
                                <button
                                  onClick={() => navigate(`/studentDetails/${student._id}`)}
                                  className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150 cursor-pointer"
                                  title="View Details"
                                >
                                  <FaEye className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => navigate(`/editStudent/${student._id}`)}
                                  className="text-green-600 hover:text-green-900 transition-colors duration-150 cursor-pointer"
                                  title="Edit Student"
                                >
                                  <FaEdit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(student._id)}
                                  className="text-red-600 hover:text-red-900 transition-colors duration-150 cursor-pointer"
                                  title="Delete Student"
                                >
                                  <FaTrash className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-12">
                            <div className="flex flex-col items-center justify-center space-y-4">
                              <div className="bg-gray-100 p-4 rounded-full">
                                <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </div>
                              <div className="text-center space-y-2">
                                <p className="text-gray-600 text-base font-medium">No students enrolled</p>
                                <p className="text-gray-500 text-sm">Add students to this batch to get started</p>
                              </div>
                              <Button
                                variant="primary"
                                size="md"
                                onClick={() => navigate("/students/add")}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                <span>Add Student</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default BatchDetailsPage;
