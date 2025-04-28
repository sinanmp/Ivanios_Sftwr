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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch batch details
        const batchResponse = await api.getBatchDetails(id);
        if (batchResponse && batchResponse.batch) {
          setBatch(batchResponse.batch);
          setFormData({
            batchName: batchResponse.batch.batchName,
            startDate: format(new Date(batchResponse.batch.startDate), "yyyy-MM-dd"),
            endDate: format(new Date(batchResponse.batch.endDate), "yyyy-MM-dd"),
            courses: batchResponse.batch.courses || [],
          });
        }

        // Fetch all courses
        const coursesResponse = await api.getCourses();
        if (coursesResponse && coursesResponse.data) {
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
      const response = await api.updateBatch(id, formData);
      if (response && !response.error) {
        toast.success("Batch updated successfully");
        navigate("/batches/all");
      } else {
        throw new Error(response.message || "Failed to update batch");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update batch");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseChange = (courseId) => {
    setFormData((prev) => {
      const newCourses = prev.courses.includes(courseId)
        ? prev.courses.filter(id => id !== courseId)
        : [...prev.courses, courseId];
      return {
        ...prev,
        courses: newCourses,
      };
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Edit Batch</h1>
              <Button
                variant="secondary"
                onClick={() => navigate("/batches/all")}
              >
                Back to Batches
              </Button>
            </div>
            <Card variant="elevated" hoverable>
              <CardHeader
                title="Batch Information"
                subtitle="Update the batch details below"
              />
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="batchName" className="block text-sm font-medium text-gray-700">
                      Batch Name
                    </label>
                    <Input
                      type="text"
                      id="batchName"
                      name="batchName"
                      value={formData.batchName}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <Input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Courses
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.map((course) => (
                        <div key={course._id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`course-${course._id}`}
                            checked={formData.courses.includes(course._id)}
                            onChange={() => handleCourseChange(course._id)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`course-${course._id}`}
                            className="ml-2 block text-sm text-gray-900"
                          >
                            {course.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      variant="secondary"
                      onClick={() => navigate("/batches/all")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                    >
                      Update Batch
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