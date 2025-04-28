import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { FaUser, FaIdCard, FaEnvelope, FaPhone, FaGraduationCap, FaMoneyBillWave, FaImage, FaFileAlt, FaTimes } from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import api from "../services/api";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../services/FileUpload";

const AddStudent = () => {
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNo: "",
    admissionNo: "",
    email: "",
    mobile: "",
    batch: "",
    course: "",
    totalFees: "",
    feesPaid: "",
    profileImage: null,
    certificates: []
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [certificateNames, setCertificateNames] = useState([]);



  useEffect(() => {
    fetchBatches();
  }, []);

    const fetchBatches = async () => {
      try {
      const response = await api.getAllBatches();
      if (response && !response.error) {
        setBatches(response.batches || []);
      } else {
        throw new Error("Failed to fetch batches");
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error(error.response?.data?.message || "Failed to fetch batches");
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

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const selectedBatchData = batches.find(b => b._id === selectedBatch);
    const selectedCourse = selectedBatchData?.courses.find(c => c._id === courseId);

    setFormData(prev => ({
      ...prev,
      course: courseId,
      totalFees: selectedCourse?.fees || ""
    }));
  };

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setSelectedBatch(batchId);
    setFormData(prev => ({
      ...prev,
      batch: batchId,
      course: "", // Reset course when batch changes
      totalFees: "" // Reset total fees when batch changes
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const removeCertificate = (index) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.enrollmentNo) newErrors.enrollmentNo = "Enrollment number is required";
    if (!formData.admissionNo) newErrors.admissionNo = "Admission number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.batch) newErrors.batch = "Batch is required";
    if (!formData.course) newErrors.course = "Course is required";
    if (!formData.totalFees) newErrors.totalFees = "Total fees is required";
    if (!formData.feesPaid) newErrors.feesPaid = "Fees paid is required";

    // Validate certificates
    if (formData.certificates.length > 0) {
      formData.certificates.forEach((cert, index) => {
        if (!cert.type) {
          newErrors[`certificateType-${index}`] = "Certificate type is required";
        }
        if (cert.type === "other" && !cert.otherType) {
          newErrors[`certificateOtherType-${index}`] = "Please specify certificate type";
        }
        if (!cert.file) {
          newErrors[`certificateFile-${index}`] = "Certificate file is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      setLoading(true);
      
      // Ensure totalFees is set from the selected course
      const selectedBatchData = batches.find(b => b._id === selectedBatch);
      const selectedCourse = selectedBatchData?.courses.find(c => c._id === formData.course);
      
      if (!selectedCourse) {
        toast.error("Please select a valid course");
        return;
      }

      // Upload profile image if exists
      let profileImage = {};
      if (formData.profileImage) {
        try {
          const imageData = await uploadFile(formData.profileImage);
          profileImage = {
            url: imageData.url,
            publicId: imageData.public_id
          };
        } catch (error) {
          toast.error("Failed to upload profile image");
          return;
        }
      }

      // Upload certificates if they exist
      const certificateUrls = [];
      if (formData.certificates && formData.certificates.length > 0) {
        for (const cert of formData.certificates) {
          if (cert.file) {
            try {
              const certData = await uploadFile(cert.file);
              certificateUrls.push({
                type: cert.type,
                otherType: cert.otherType || '',
                url: certData.url,
                publicId: certData.public_id
              });
            } catch (error) {
              toast.error(`Failed to upload certificate: ${cert.type || 'Unknown type'}`);
              return;
            }
          }
        }
      }

      const studentData = {
        ...formData,
        totalFees: selectedCourse.fees,
        feesPaid: parseInt(formData.feesPaid) || 0,
        profileImage: profileImage,
        certificates: certificateUrls
      };

      const response = await api.addStudent(studentData);
      if (response && !response.error) {
        toast.success("Student added successfully");
        navigate("/students/all");
      } else {
        throw new Error(response?.message || "Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error(error.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 md:ml-64">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Add New Student</h1>
              <Button
                variant="secondary"
                onClick={() => navigate("/students/all")}
                className="w-full md:w-auto"
              >
                Back to Students
              </Button>
            </div>

            <Card variant="elevated" hoverable>
              <CardHeader
                title="Student Information"
                subtitle="Enter the student's details below"
              />
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter student's name"
                        icon={<FaUser className="text-gray-400" />}
                        error={errors.name}
                      />
            </div>

                    {/* Enrollment Number */}
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enrollment Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                    type="text"
                        name="enrollmentNo"
                        value={formData.enrollmentNo}
                        onChange={handleChange}
                        placeholder="Enter enrollment number"
                        icon={<FaIdCard className="text-gray-400" />}
                        error={errors.enrollmentNo}
                      />
                </div>

                    {/* Admission Number */}
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admission Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                    type="text"
                        name="admissionNo"
                        value={formData.admissionNo}
                        onChange={handleChange}
                        placeholder="Enter admission number"
                        icon={<FaIdCard className="text-gray-400" />}
                        error={errors.admissionNo}
                      />
                </div>

                    {/* Email */}
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        icon={<FaEnvelope className="text-gray-400" />}
                        error={errors.email}
                      />
                </div>

                    {/* Mobile */}
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                        icon={<FaPhone className="text-gray-400" />}
                        error={errors.mobile}
                      />
                </div>

                    {/* Batch */}
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch <span className="text-red-500">*</span>
                      </label>
                  <select
                        name="batch"
                        value={formData.batch}
                        onChange={handleBatchChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.batch ? "border-red-500" : "border-gray-200"
                        }`}
                      >
                        <option value="">Select Batch</option>
                        {batches.map((batch) => (
                          <option key={batch._id} value={batch._id}>
                        {batch.batchName}
                      </option>
                    ))}
                  </select>
                  {errors.batch && (
                        <p className="mt-1 text-sm text-red-500">{errors.batch}</p>
                  )}
                </div>

                    {/* Course */}
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course <span className="text-red-500">*</span>
                      </label>
                  <select
                        name="course"
                        value={formData.course}
                        onChange={handleCourseChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.course ? "border-red-500" : "border-gray-200"
                        }`}
                        disabled={!selectedBatch}
                      >
                        <option value="">Select Course</option>
                        {selectedBatch && batches.find(b => b._id === selectedBatch)?.courses.map((course) => (
                          <option key={course._id} value={course._id}>
                            {course.name} - ₹{course.fees}
                      </option>
                    ))}
                  </select>
                  {errors.course && (
                        <p className="mt-1 text-sm text-red-500">{errors.course}</p>
                  )}
                </div>

                    {/* Total Fees */}
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Fees <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        name="totalFees"
                        value={formData.totalFees}
                        onChange={handleChange}
                        placeholder="Total fees will be set automatically"
                        icon={<FaMoneyBillWave className="text-gray-400" />}
                        error={errors.totalFees}
                        readOnly
                      />
                      {formData.totalFees && (
                        <p className="mt-1 text-sm text-gray-500">
                          Total Fees: ₹{formData.totalFees}
                        </p>
                  )}
                </div>

                    {/* Fees Paid */}
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fees Paid <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        name="feesPaid"
                        value={formData.feesPaid}
                        onChange={handleChange}
                        placeholder="Enter fees paid"
                        icon={<FaMoneyBillWave className="text-gray-400" />}
                        error={errors.feesPaid}
                  />
                </div>

                    {/* Profile Image Upload */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Profile Image
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          {previewImage ? (
                            <div className="relative">
                              <img
                                src={previewImage}
                                alt="Profile preview"
                                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewImage(null);
                                  setFormData(prev => ({ ...prev, profileImage: null }));
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                              <FaImage className="text-gray-400 text-2xl" />
                            </div>
                  )}
                </div>
                <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="profileImage"
                          />
                          <label
                            htmlFor="profileImage"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                          >
                            <FaImage className="mr-2" />
                            Upload Image
                        </label>
                        </div>
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
                                className="text-red-500 hover:text-red-700 mt-6"
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
                          Add Certificate
                  </button>
                      </div>
                    </div>
                  </div>

                  {/* Error Summary */}
                  {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                      <ul className="mt-2 text-sm text-red-700">
                        {Object.entries(errors).map(([field, message]) => (
                          <li key={field}>{message}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      {loading ? <Spinner size="sm" /> : <FaUser />}
                      {loading ? "Adding Student..." : "Add Student"}
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

export default AddStudent;
