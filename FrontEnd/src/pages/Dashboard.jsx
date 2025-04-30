import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { FaUsers, FaGraduationCap, FaCalendarAlt, FaArrowUp, FaBook } from "react-icons/fa";
import Button from "../components/ui/Button";
import api from "../services/api";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalBatches: 0,
    totalCourses: 0,
    activeBatches: 0,
    newStudents: 0,
    newBatches: 0,
    newCourses: 0
  });
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch students
        const studentsResponse = await api.fetchStudents(1, '');
        console.log('Students Response:', studentsResponse);
        const totalStudents = studentsResponse.students?.length || studentsResponse.totalStudents || 0;
        const newStudents = studentsResponse.newStudents || 0;

        // Fetch batches
        const batchesResponse = await api.getAllBatches();
        console.log('Batches Response:', batchesResponse);
        const totalBatches = batchesResponse.batches?.length || 0;
        const activeBatches = batchesResponse.batches?.filter(batch => 
          new Date(batch.endDate) >= new Date()
        ).length || 0;
        setBatches(batchesResponse.batches || []);

        // Fetch courses
        const coursesResponse = await api.getAllCourses();
        console.log('Courses Response:', coursesResponse);
        const totalCourses = coursesResponse?.length || 0;

        setStats({
          totalStudents,
          totalBatches,
          totalCourses,
          activeBatches,
          newStudents,
          newBatches: totalBatches - activeBatches,
          newCourses: totalCourses
        });

        console.log('Final Stats:', {
          totalStudents,
          totalBatches,
          totalCourses,
          activeBatches,
          newStudents,
          newBatches: totalBatches - activeBatches,
          newCourses: totalCourses
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64">
        <TopNav />
        <main className="flex-1 p-4 md:p-6 pt-16 md:pt-24 flex items-center justify-center">
          <Spinner />
        </main>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64">
        <TopNav />
        <main className="flex-1 p-4 md:p-6 pt-16 md:pt-24 overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Students */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Students</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalStudents}</h3>
                    <p className="text-xs text-green-500 mt-1">
                      <FaArrowUp className="inline mr-1" />
                      <span>{stats.newStudents} new students</span>
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FaUsers className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Batches */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Batches</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalBatches}</h3>
                    <p className="text-xs text-green-500 mt-1">
                      <FaArrowUp className="inline mr-1" />
                      <span>{stats.newBatches} this month</span>
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <FaCalendarAlt className="w-6 h-6 text-indigo-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Courses */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Courses</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalCourses}</h3>
                    <p className="text-xs text-green-500 mt-1">
                      <FaArrowUp className="inline mr-1" />
                      <span>{stats.newCourses} new courses</span>
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <FaBook className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Batches */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Batches</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.activeBatches}</h3>
                    <p className="text-xs text-green-500 mt-1">
                      <FaArrowUp className="inline mr-1" />
                      <span>{stats.activeBatches} this week</span>
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <FaGraduationCap className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Batch Overview */}
          <Card className="bg-white shadow-sm">
            <CardHeader
              title="Batch Overview"
              subtitle="Current batch schedule and information"
            />
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batch Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students Enrolled
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {batches.length > 0 ? (
                      batches.map((batch, index) => (
                        <tr key={batch._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{batch.batchName}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{batch.students?.length || 0}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(batch.startDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              new Date(batch.endDate) >= new Date()
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {new Date(batch.endDate) >= new Date() ? 'Active' : 'Completed'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                          No batches available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
