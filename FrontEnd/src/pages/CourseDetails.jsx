import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { FaBook, FaClock, FaMoneyBillWave, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import Button from "../components/ui/Button";
import api from "../services/api";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await api.getCourseDetails(id);
      if (response && !response.error) {
        setCourse(response.data);
      } else {
        throw new Error(response?.message || "Failed to fetch course details");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error(error.response?.data?.message || "Failed to fetch course details");
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        setLoading(true);
        const response = await api.deleteCourse(id);
        if (response && !response.error) {
          toast.success("Course deleted successfully");
          navigate("/courses");
        } else {
          throw new Error(response?.message || "Failed to delete course");
        }
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error(error.response?.data?.message || "Failed to delete course");
      } finally {
        setLoading(false);
      }
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

  if (!course) {
    return null;
  }

  return (
    <div className="flex fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6 pt-24">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/courses")}
                  className="flex items-center gap-2"
                >
                  <FaArrowLeft />
                  Back to Courses
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{course.name}</h1>
                  <p className="text-gray-600 mt-2">Course Details</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/editCourse/${id}`)}
                  className="flex items-center gap-2"
                >
                  <FaEdit />
                  Edit Course
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <FaTrash />
                  Delete Course
                </Button>
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="elevated" hoverable>
              <CardHeader
                title="Course Information"
                subtitle="Basic details about the course"
              />
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaBook className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Course Name</p>
                      <p className="font-medium">{course.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaClock className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{course.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaMoneyBillWave className="text-gray-400 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Fees</p>
                      <p className="font-medium">₹{course.fees}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" hoverable>
              <CardHeader
                title="Description"
                subtitle="Detailed information about the course"
              />
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetails; 