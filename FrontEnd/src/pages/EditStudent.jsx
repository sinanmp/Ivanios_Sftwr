import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHome, FaChevronRight, FaUser, FaEnvelope, FaPhone, FaIdCard, FaMoneyBillWave, FaTrash, FaFileAlt, FaTimes } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../services/api";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { uploadFile } from "../services/FileUpload";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    enrollmentNo: "",
    admissionNo: "",
    certificates: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch student details
        const studentResponse = await api.getStudentDetails(id);
        if (studentResponse && studentResponse.student) {
          const studentData = studentResponse.student;
          setStudent(studentData);
          setFormData({
            name: studentData.name || "",
            email: studentData.email || "",
            mobile: studentData.mobile || "",
            enrollmentNo: studentData.enrollmentNo || "",
            admissionNo: studentData.admissionNo || "",
            certificates: []
          });
        } else {
          throw new Error("Failed to fetch student details");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const addNewCertificate = () => {
    setFormData(prev => ({
      ...prev,
      certificates: [...prev.certificates, {
        type: "",
        otherType: "",
        file: null
      }]
    }));
  };

  const handleCertificateUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        certificates: prev.certificates.map((cert, i) => 
          i === index ? { ...cert, file } : cert
        )
      }));
    }
  };

  const updateCertificateType = (index, type) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.map((cert, i) => 
        i === index ? { ...cert, type, otherType: type === "other" ? cert.otherType : "" } : cert
      )
    }));
  };

  const updateOtherType = (index, otherType) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.map((cert, i) => 
        i === index ? { ...cert, otherType } : cert
      )
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for fees paid
    if (name === 'feesPaid') {
      const totalFees = parseFloat(formData.totalFees) || 0;
      const feesPaid = parseFloat(value) || 0;
      
      if (feesPaid > totalFees) {
        toast.error("Fees paid cannot exceed total fees");
        return;
      }
    }

    // Special handling for mobile number
    if (name === 'mobile') {
      // Remove any non-digit characters
      const cleanedValue = value.replace(/\D/g, '');
      
      // Check if the length is more than 10 digits
      if (cleanedValue.length > 10) {
        toast.error("Mobile number must be exactly 10 digits");
        return;
      }
      
      // Update the value with only digits
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.updateStudent(id, {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        enrollmentNo: formData.enrollmentNo,
        admissionNo: formData.admissionNo,
        certificates: formData.certificates
      });
      if (response && !response.error) {
        toast.success("Student updated successfully");
        navigate(`/studentDetails/${id}`);
      } else {
        throw new Error(response?.message || "Failed to update student");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error(error.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await api.deleteStudent(id);
      if (response && !response.error) {
        toast.success("Student deleted successfully");
        navigate("/students/all");
      } else {
        throw new Error(response.message || "Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(error.response?.data?.message || "Failed to delete student");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <Spinner />;

    return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-24">
          {/* Header with Logo */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {student?.profileImage?.url ? (
                <img 
                  src={student.profileImage.url} 
                  alt="Student Profile" 
                  className="h-10 md:h-12 w-10 md:w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 md:h-12 w-10 md:w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUser className="text-gray-400 text-lg" />
                </div>
              )}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Edit Student</h1>
                <p className="text-sm md:text-base text-gray-600">Update student information</p>
              </div>
            </div>
            <Button
              type="button"
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm"
            >
              <FaTrash className="w-4 h-4" />
              <span>Delete Student</span>
            </Button>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center text-gray-600 space-x-2 text-sm md:text-lg font-medium mb-4 md:mb-6 overflow-x-auto">
            <FaHome className="text-blue-500" />
            <FaChevronRight className="text-gray-400" />
            <span 
              onClick={() => navigate("/students/all")}
              className="cursor-pointer hover:text-blue-500 transition-colors duration-200 whitespace-nowrap"
            >
              Students
            </span>
            <FaChevronRight className="text-gray-400" />
            <span className="text-blue-500 whitespace-nowrap">Edit Student</span>
          </div>

          {/* Main Content */}
          <Card variant="elevated" hoverable className="w-full mx-auto">
            <CardHeader
              title="Edit Student"
              subtitle="Update student information"
            />
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter student name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enrollment Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.enrollmentNo}
                      onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
                      placeholder="Enter enrollment number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admission Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.admissionNo}
                      onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                      placeholder="Enter admission number"
                      required
                    />
                  </div>
                </div>

                {/* Certificates Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Add New Certificate
                  </label>
                  <div className="space-y-4">
                    {formData.certificates.map((cert, index) => (
                      <div key={index} className="flex flex-col space-y-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <FaFileAlt className="text-gray-400" />
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Certificate Type <span className="text-red-500">*</span></label>
                            <select
                              value={cert.type}
                              onChange={(e) => updateCertificateType(index, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="">Select Type</option>
                              <option value="academic">Academic</option>
                              <option value="professional">Professional</option>
                              <option value="achievement">Achievement</option>
                              <option value="identity">Identity Proof</option>
                              <option value="other">Other</option>
                            </select>
                            {cert.type === "other" && (
                              <div className="mt-2">
                                <label className="block text-xs text-gray-500 mb-1">Specify Type <span className="text-red-500">*</span></label>
                                <input
                                  type="text"
                                  value={cert.otherType}
                                  onChange={(e) => updateOtherType(index, e.target.value)}
                                  placeholder="Enter certificate type"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Certificate File <span className="text-red-500">*</span></label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleCertificateUpload(index, e)}
                                className="hidden"
                                id={`certificate-${index}`}
                              />
                              <label
                                htmlFor={`certificate-${index}`}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                              >
                                <FaFileAlt className="mr-2" />
                                {cert.file ? "Change File" : "Upload File"}
                              </label>
                              {cert.file && (
                                <span className="text-xs text-gray-500">
                                  {cert.file.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCertificate(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addNewCertificate}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaFileAlt className="mr-2" />
                      Add New Certificate
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate(`/studentDetails/${id}`)}
                    className="w-full md:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full md:w-auto"
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "Update Student"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Student</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this student? This action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleDelete}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
    );
  };
  
  export default EditStudent;
  