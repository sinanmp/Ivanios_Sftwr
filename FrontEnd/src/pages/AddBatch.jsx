import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { FaPlus, FaCalendarAlt, FaGraduationCap, FaTimes } from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import api from "../services/api";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddBatch = () => {
  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [formData, setFormData] = useState({
    batchName: "",
    courses: [],
    startDate: "",
    endDate: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.fetchCourses();
      if (response && !response.error) {
        setCourseOptions(response.data || []);
      } else {
        throw new Error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error(error.response?.data?.message || "Failed to fetch courses");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleAddCourse = () => {
    if (!selectedCourse) return;
    
    // Check if course is already added
    if (formData.courses.includes(selectedCourse)) {
      toast.error("This course is already added");
      return;
    }

    setFormData(prev => ({
      ...prev,
      courses: [...prev.courses, selectedCourse]
    }));
    setSelectedCourse(""); // Reset selection
    // Clear courses error if it exists
    if (errors.courses) {
      setErrors(prev => ({
        ...prev,
        courses: ""
      }));
    }
  };

  const handleRemoveCourse = (courseId) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter(id => id !== courseId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.batchName) newErrors.batchName = "Batch name is required";
    if (!formData.courses.length) newErrors.courses = "At least one course is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";

    // Validate end date is after start date
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await api.createBatch(formData);
      if (response && !response.error) {
        toast.success("Batch created successfully");
        navigate("/batches/all");
      } else {
        throw new Error(response.message || "Failed to create batch");
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      toast.error(error.response?.data?.message || "Failed to create batch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 md:ml-64 pt-16">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Add New Batch</h1>
              <p className="text-gray-600 mt-2">Fill in the details to create a new batch</p>
            </div>

            {/* Error Message if no courses */}
            {courseOptions.length === 0 && (
              <Card variant="elevated" hoverable className="mb-6 bg-white shadow-lg">
                <CardContent>
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="bg-red-100 p-4 rounded-full mb-4">
                      <FaGraduationCap className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Courses Available</h3>
                    <p className="text-gray-600 mb-6">
                      You need to create courses first before you can create a batch.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => navigate("/courses/add", { state: { from: "/batches/add" } })}
                      className="flex items-center gap-2"
                    >
                      <FaPlus />
                      Add Course
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form */}
            <Card variant="elevated" hoverable>
              <CardHeader
                title="Batch Information"
                subtitle="Enter the batch details below"
              />
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Batch Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="batchName"
                        value={formData.batchName}
                        onChange={handleChange}
                        placeholder="Enter batch name"
                        icon={<FaGraduationCap className="text-gray-400" />}
                        error={errors.batchName}
                        disabled={courseOptions.length === 0}
                      />
                    </div>

                    {/* Course Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Add Courses <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={selectedCourse}
                          onChange={(e) => setSelectedCourse(e.target.value)}
                          className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.courses ? "border-red-500" : "border-gray-200"
                          } ${courseOptions.length === 0 ? "bg-gray-100 cursor-not-allowed" : ""}`}
                          disabled={courseOptions.length === 0}
                        >
                          <option value="">Select Course</option>
                          {courseOptions.map((course) => (
                            <option key={course._id} value={course._id}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="button"
                          onClick={handleAddCourse}
                          disabled={!selectedCourse || courseOptions.length === 0}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                        >
                          <FaPlus />
                        </Button>
                      </div>
                      {errors.courses && (
                        <p className="mt-1 text-sm text-red-500">{errors.courses}</p>
                      )}
                      
                      {/* Selected Courses List */}
                      {formData.courses.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Selected Courses:
                          </label>
                          <div className="space-y-2">
                            {formData.courses.map(courseId => {
                              const course = courseOptions.find(c => c._id === courseId);
                              return (
                                <div key={courseId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                  <span className="text-sm text-gray-700">{course?.name || 'Loading...'}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCourse(courseId)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        icon={<FaCalendarAlt className="text-gray-400" />}
                        error={errors.startDate}
                        disabled={courseOptions.length === 0}
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        icon={<FaCalendarAlt className="text-gray-400" />}
                        error={errors.endDate}
                        disabled={courseOptions.length === 0}
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="4"
                        placeholder="Enter batch description (optional)"
                        disabled={courseOptions.length === 0}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate("/batches/all")}
                      className="w-full md:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading || courseOptions.length === 0}
                      className="w-full md:w-auto flex items-center gap-2"
                    >
                      {loading ? <Spinner size="sm" /> : <FaPlus />}
                      {loading ? "Creating Batch..." : "Create Batch"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBatch;
