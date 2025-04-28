import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import api from "../services/api";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    fees: "",
    description: ""
  });

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await api.getCourseDetails(id);
      if (response && !response.error) {
        setFormData({
          name: response.data.name || "",
          duration: response.data.duration || "",
          fees: response.data.fees || "",
          description: response.data.description || ""
        });
      } else {
        throw new Error("Failed to fetch course ");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error(error.response?.data?.message || "Failed to fetch course");
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatFees = (value) => {
    // Remove any non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.updateCourse(id, formData);
      if (response && !response.error) {
        toast.success("Course updated successfully");
        navigate("/courses");
      } else {
        throw new Error("Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(error.response?.data?.message || "Failed to update course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6 pt-24">
          <div className="max-w-2xl mx-auto">
            <Card variant="elevated" hoverable>
              <CardHeader
                title="Edit Course"
                subtitle="Update course information"
              />
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Spinner />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Course Name
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter course name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <Input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g., 3 months, 6 months"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="fees" className="block text-sm font-medium text-gray-700 mb-1">
                        Fees (₹)
                      </label>
                      <Input
                        type="text"
                        id="fees"
                        name="fees"
                        value={formData.fees}
                        onChange={(e) => {
                          const formattedValue = formatFees(e.target.value);
                          handleChange({ target: { name: "fees", value: formattedValue } });
                        }}
                        placeholder="Enter course fees"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter course description"
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/courses")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Course"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditCourse; 