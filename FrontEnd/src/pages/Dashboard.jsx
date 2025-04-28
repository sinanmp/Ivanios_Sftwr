import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { FaUsers, FaGraduationCap, FaCalendarAlt, FaArrowUp, FaBook } from "react-icons/fa";
import Button from "../components/ui/Button";
import api from "../services/api";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Sidebar />
          <div className="flex-1 flex flex-col md:ml-64" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
            <TopNav />
            <div className="flex-1 overflow-y-auto p-6 mt-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h2 className="text-red-600 font-bold">Something went wrong</h2>
                <p className="text-red-600 mt-2">{this.state.error?.message || "An unexpected error occurred"}</p>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalBatches: 0,
    activeBatches: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all students
      const studentsResponse = await api.fetchStudents(1, '');
      console.log(studentsResponse, "this is student response");
      const totalStudents = studentsResponse?.data?.total || 0;

      // Fetch all courses
      const coursesResponse = await api.fetchCourses();
      const totalCourses = coursesResponse?.data?.data?.length || 0;

      // Fetch all batches
      const batchesResponse = await api.getAllBatches();
      const totalBatches = batchesResponse?.data?.batches?.length || 0;

      // Calculate active batches (batches that haven't ended)
      const activeBatches = batchesResponse?.data?.batches?.filter(batch => {
        if (!batch.endDate) return false;
        const endDate = new Date(batch.endDate);
        return endDate > new Date();
      }).length || 0;

      setStats({
        totalStudents,
        totalCourses,
        totalBatches,
        activeBatches
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message || "Failed to load dashboard data");
      toast.error(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-64" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
          <TopNav />
          <div className="flex-1 overflow-y-auto p-6 mt-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={fetchDashboardData}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-[250px]">
          <TopNav />
          <div className="flex-1 overflow-y-auto pt-16">
            <div className="p-4 md:p-6 w-full md:max-w-[calc(100vw-250px)]">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
                  <p className="text-gray-600 mt-1">Welcome back, Admin!</p>
                </div>
              </div>

              {/* Quick Stats */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card variant="elevated" hoverable className="bg-white shadow-sm h-full">
                    <CardContent className="h-full">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600">Total Students</p>
                          <h3 className="text-2xl font-bold text-green-600 mt-2">{stats.totalStudents}</h3>
                          <div className="flex items-center mt-2">
                            <FaArrowUp className="text-green-500 mr-1 h-3 w-3" />
                            <span className="text-sm text-green-500">+15 this month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                          <FaUsers className="text-green-500 text-xl" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="elevated" hoverable className="bg-white shadow-sm h-full">
                    <CardContent className="h-full">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600">Total Batches</p>
                          <h3 className="text-2xl font-bold text-blue-600 mt-2">{stats.totalBatches}</h3>
                          <div className="flex items-center mt-2">
                            <FaArrowUp className="text-green-500 mr-1 h-3 w-3" />
                            <span className="text-sm text-green-500">+2 this month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                          <FaGraduationCap className="text-blue-500 text-xl" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="elevated" hoverable className="bg-white shadow-sm h-full">
                    <CardContent className="h-full">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600">Total Courses</p>
                          <h3 className="text-2xl font-bold text-purple-600 mt-2">{stats.totalCourses}</h3>
                          <div className="flex items-center mt-2">
                            <FaArrowUp className="text-green-500 mr-1 h-3 w-3" />
                            <span className="text-sm text-green-500">+5 this month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                          <FaBook className="text-purple-500 text-xl" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="elevated" hoverable className="bg-white shadow-sm h-full">
                    <CardContent className="h-full">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600">Active Batches</p>
                          <h3 className="text-2xl font-bold text-orange-600 mt-2">{stats.activeBatches}</h3>
                          <div className="flex items-center mt-2">
                            <FaArrowUp className="text-green-500 mr-1 h-3 w-3" />
                            <span className="text-sm text-green-500">+3 this month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 ml-4">
                          <FaCalendarAlt className="text-orange-500 text-xl" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Batch Overview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Batch Overview</h3>
                  <p className="text-sm text-gray-500 mt-1">Current batch statistics and information</p>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Batch Name
                          </th>
                          <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Students Enrolled
                          </th>
                          <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Start Date
                          </th>
                          <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">BCA-2025</td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">30</td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                            <FaCalendarAlt className="text-blue-500 mr-2" /> 01-Apr-2025
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Active
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">BBA-2025</td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">25</td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                            <FaCalendarAlt className="text-blue-500 mr-2" /> 05-Apr-2025
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                              Upcoming
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors duration-200">
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">MCA-2024</td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">40</td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                            <FaCalendarAlt className="text-blue-500 mr-2" /> 15-Jan-2024
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              Completed
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
