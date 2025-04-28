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
  const [batches, setBatches] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    enrollmentNo: "",
    admissionNo: "",
    mobile: "",
    batch: "",
    totalFees: 0,
    feesPaid: 0,
    certificates: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch batches
        const batchesResponse = await api.getAllBatches();
        if (batchesResponse && !batchesResponse.error) {
          setBatches(batchesResponse.batches || []);
        }

        // Fetch student details
        const studentResponse = await api.getStudentDetails(id);
        if (studentResponse && studentResponse.student) {
          const studentData = studentResponse.student;
          setFormData({
            name: studentData.name || "",
            email: studentData.email || "",
            enrollmentNo: studentData.enrollmentNo || "",
            admissionNo: studentData.admissionNo || "",
            mobile: studentData.mobile || "",
            batch: studentData.batch?._id || "",
            totalFees: studentData.totalFees || 0,
            feesPaid: studentData.feesPaid || 0,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Handle certificates
      const certificateUrls = [];
      for (const cert of formData.certificates) {
        if (cert.file instanceof File) {
          try {
            // Upload new certificate using the new FileUpload service
            const certData = await uploadFile(cert.file);
            certificateUrls.push({
              type: cert.type,
              url: certData.url,  
              publicId: certData.public_id
            });
          } catch (error) {
            toast.error(`Failed to upload certificate: ${cert.type || 'Unknown type'}`);
            return;
          }
        } else if (cert.url) {
          // Keep existing certificate
          certificateUrls.push(cert);
        }
      }

      const studentData = {
        ...formData,
        certificates: certificateUrls
      };

      const response = await api.updateStudent(id, studentData);
      if (response && response.error==false) {
        toast.success("Student updated successfully");
        navigate("/students/all");
      } else {
        throw new Error(response?.message || "Failed to update student");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error(error.response?.data?.message || "Failed to update student");
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
    <div className="flex flex-col md:flex-row fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-24">
          {/* Header with Logo */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img 
                src="/college-logo.png" 
                alt="College Logo" 
                className="h-10 md:h-12 w-auto"
              />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                        placeholder="Full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        placeholder="Email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Enrollment Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaIdCard className="text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        value={formData.enrollmentNo}
                        onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
                        className="pl-10"
                        placeholder="Enrollment number"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Admission Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaIdCard className="text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        value={formData.admissionNo}
                        onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                        className="pl-10"
                        placeholder="Admission number"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <Input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="pl-10"
                        placeholder="Mobile number"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Batch</label>
                    <select
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Batch</option>
                      {batches.map((batch) => (
                        <option key={batch._id} value={batch._id}>
                          {batch.batchName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Total Fees</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMoneyBillWave className="text-gray-400" />
                      </div>
                      <Input
                        type="number"
                        value={formData.totalFees}
                        onChange={(e) => setFormData({ ...formData, totalFees: parseFloat(e.target.value) })}
                        className="pl-10"
                        placeholder="Total fees"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Fees Paid</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMoneyBillWave className="text-gray-400" />
                      </div>
                      <Input
                        type="number"
                        value={formData.feesPaid}
                        onChange={(e) => setFormData({ ...formData, feesPaid: parseFloat(e.target.value) })}
                        className="pl-10"
                        placeholder="Fees paid"
                        required
                      />
                    </div>
                  </div>

                  {/* Certificates Upload */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Certificates
                    </label>
                    <div className="space-y-4">
                      {formData.certificates.map((cert, index) => (
                        <div key={index} className="flex flex-col space-y-2 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <FaFileAlt className="text-gray-400" />
                            <div className="flex-1">
                              <label className="block text-xs text-gray-500 mb-1">Certificate Type</label>
                              <select
                                value={cert.type}
                                onChange={(e) => updateCertificateType(index, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                  <label className="block text-xs text-gray-500 mb-1">Specify Type</label>
                                  <input
                                    type="text"
                                    value={cert.otherType}
                                    onChange={(e) => updateOtherType(index, e.target.value)}
                                    placeholder="Enter certificate type"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs text-gray-500 mb-1">Certificate File</label>
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
                                {cert.url && (
                                  <span className="text-xs text-gray-500">
                                    Current file: {cert.url.split('/').pop()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addNewCertificate}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaFileAlt className="mr-2" />
                        Add Certificate
                      </button>
                    </div>
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
  