import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { FaUsers, FaGraduationCap, FaCalendarAlt, FaArrowUp } from "react-icons/fa";
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
      <div className="flex fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col md:ml-64" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
          <TopNav />
          <div className="flex-1 overflow-y-auto p-6 mt-16">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, Admin!</p>
            </div>

            {/* Quick Stats */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card variant="elevated" hoverable>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Students</p>
                        <p className="text-2xl font-bold text-green-600">{stats.totalStudents}</p>
                        <div className="flex items-center mt-2">
                          <FaArrowUp className="text-green-500 mr-1" />
                          <span className="text-sm text-green-500">+15 this month</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <FaUsers className="text-green-500 text-xl" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="elevated" hoverable>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Batches</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalBatches}</p>
                        <div className="flex items-center mt-2">
                          <FaArrowUp className="text-green-500 mr-1" />
                          <span className="text-sm text-green-500">+2 this month</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaGraduationCap className="text-blue-500 text-xl" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Batch Overview */}
            <Card variant="elevated" hoverable className="mb-8">
              <CardHeader
                title="Batch Overview"
                subtitle="Current batch statistics and information"
              />
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-200">
                        <th className="pb-3 font-semibold text-gray-600">Batch Name</th>
                        <th className="pb-3 font-semibold text-gray-600">Students Enrolled</th>
                        <th className="pb-3 font-semibold text-gray-600">Start Date</th>
                        <th className="pb-3 font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-4 text-gray-800 font-medium">BCA-2025</td>
                        <td className="py-4 text-gray-600">30</td>
                        <td className="py-4 text-gray-600 flex items-center">
                          <FaCalendarAlt className="text-blue-500 mr-2" /> 01-Apr-2025
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            Active
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-4 text-gray-800 font-medium">BBA-2025</td>
                        <td className="py-4 text-gray-600">25</td>
                        <td className="py-4 text-gray-600 flex items-center">
                          <FaCalendarAlt className="text-blue-500 mr-2" /> 05-Apr-2025
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            Upcoming
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-4 text-gray-800 font-medium">MCA-2024</td>
                        <td className="py-4 text-gray-600">40</td>
                        <td className="py-4 text-gray-600 flex items-center">
                          <FaCalendarAlt className="text-blue-500 mr-2" /> 15-Jan-2024
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            Completed
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
