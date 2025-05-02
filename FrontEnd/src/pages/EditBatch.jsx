import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import api from "../services/api";
import { format } from "date-fns";
import { FaTimes, FaPlus } from "react-icons/fa";

const EditBatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState(null);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    batchName: "",
    startDate: "",
    endDate: "",
    courses: [],
  });
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch batch details
        const batchResponse = await api.getBatchDetails(id);
        if (batchResponse && !batchResponse.error) {
          setBatch(batchResponse.batch);
          setFormData({
            batchName: batchResponse.batch.batchName,
            startDate: format(new Date(batchResponse.batch.startDate), "yyyy-MM-dd"),
            endDate: format(new Date(batchResponse.batch.endDate), "yyyy-MM-dd"),
            courses: batchResponse.batch.courses || [],
          });
          // Set selected courses from batch data
          setSelectedCourses(batchResponse.batch.courses || []);
        }

        // Fetch all courses
        const coursesResponse = await api.getAllCourses();
        if (coursesResponse && !coursesResponse.error) {
          setCourses(coursesResponse.data);
        }
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.updateBatch(id, {
        ...formData,
        courses: selectedCourses.map(course => course._id)
      });
      
      if (response && !response.error) {
        toast.success("Batch updated successfully");
        navigate("/batches/all");
      } else {
        throw new Error(response?.message || "Failed to update batch");
      }
    } catch (error) {
      console.error("Error updating batch:", error);
      toast.error(error.response?.data?.message || "Failed to update batch");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (e) => {
    const courseId = e.target.value;
    if (!courseId) return;

    const selectedCourse = courses.find(course => course._id === courseId);
    if (selectedCourse && !selectedCourses.some(course => course._id === courseId)) {
      setSelectedCourses([...selectedCourses, selectedCourse]);
    }
  };

  const removeCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter(course => course._id !== courseId));
  };

  // Get available courses (courses that are not already selected)
  const availableCourses = courses.filter(
    course => !selectedCourses.some(selected => selected._id === course._id)
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Edit Batch</h1>
              <Button
                variant="secondary"
                onClick={() => navigate("/batches/all")}
              >
                Back to Batches
              </Button>
            </div>

            <Card>
              <CardHeader
                title="Batch Information"
                subtitle="Update batch details"
              />
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.batchName}
                        onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                        placeholder="Enter batch name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Courses Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">
                        Courses <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <select
                          onChange={handleCourseSelect}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value=""
                        >
                          <option value="">Add a course</option>
                          {availableCourses.map(course => (
                            <option key={course._id} value={course._id}>
                              {course.name} - ₹{course.fees}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => navigate("/courses/add")}
                          className="flex items-center gap-2"
                        >
                          <FaPlus />
                          New Course
                        </Button>
                      </div>
                    </div>

                    {/* Selected Courses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCourses.map(course => (
                        <div
                          key={course._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div>
                            <h4 className="font-medium text-gray-800">{course.name}</h4>
                            <p className="text-sm text-gray-600">₹{course.fees}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCourse(course._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate("/batches/all")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Batch"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditBatch; 