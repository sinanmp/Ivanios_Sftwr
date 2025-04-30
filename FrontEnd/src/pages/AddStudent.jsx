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
    email: "",
    mobile: "",
    enrollmentNo: "",
    admissionNo: "",
    address: "",
    profileImage: null,
    certificates: [],
    batch: "",
    course: "",
    totalFees: 0,
    feesPaid: 0,
    feeTransactions: [{
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      mode: "cash",
      remarks: ""
    }]
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
    
    // Special handling for fees paid
    if (name === 'feesPaid') {
      const totalFees = parseFloat(formData.totalFees) || 0;
      const feesPaid = parseFloat(value) || 0;
      
      if (feesPaid > totalFees) {
        setErrors(prev => ({
          ...prev,
          feesPaid: "Fees paid cannot exceed total fees"
        }));
        return;
      }
    }

    // Special handling for mobile number
    if (name === 'mobile') {
      // Remove any non-digit characters
      const cleanedValue = value.replace(/\D/g, '');
      
      // Check if the length is more than 10 digits
      if (cleanedValue.length > 10) {
        setErrors(prev => ({
          ...prev,
          mobile: "Mobile number must be exactly 10 digits"
        }));
        return;
      }
      
      // Update the value with only digits
      setFormData(prev => ({
        ...prev,
        [name]: cleanedValue
      }));
      
      // Clear error if the length is exactly 10 digits
      if (cleanedValue.length === 10) {
        setErrors(prev => ({
          ...prev,
          mobile: ""
        }));
      } else if (cleanedValue.length > 0) {
        setErrors(prev => ({
          ...prev,
          mobile: "Mobile number must be exactly 10 digits"
        }));
      }
      return;
    }

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

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setFormData(prev => ({
      ...prev,
      batch: batchId,
      course: "", // Reset course when batch changes
      totalFees: 0 // Reset total fees when batch changes
    }));
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    const selectedBatchData = batches.find(b => b._id === formData.batch);
    const selectedCourse = selectedBatchData?.courses.find(c => c._id === courseId);
    
    setFormData(prev => ({
      ...prev,
      course: courseId,
      totalFees: selectedCourse?.fees || 0
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

  const validateForm = async() => {
    const newErrors = {};
    
    // Personal Information Validation
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.enrollmentNo) newErrors.enrollmentNo = "Enrollment number is required";
    if (!formData.admissionNo) newErrors.admissionNo = "Admission number is required";

    // Fee Information Validation
    if (!formData.batch) newErrors.batch = "Batch is required";
    if (!formData.course) newErrors.course = "Course is required";
    if (!formData.totalFees) newErrors.totalFees = "Total fees is required";
    if (!formData.feesPaid) newErrors.feesPaid = "Fees paid is required";
    
    // Validate fees paid is not greater than total fees
    if (parseFloat(formData.feesPaid) > parseFloat(formData.totalFees)) {
        newErrors.feesPaid = "Fees paid cannot exceed total fees";
    }

    // Validate fee transaction details
    if (!formData.feeTransactions[0].date) {
        newErrors.paymentDate = "Payment date is required";
    }
    if (!formData.feeTransactions[0].mode) {
        newErrors.paymentMode = "Payment mode is required";
    }

    // Certificate Validation
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



    const response = await api.checkExistingStudent(formData);
    if(response && !response.error){
      if(response.result.admissionNoExists){
        newErrors.admissionNo = "Student with this admission number already exists";
      }
      if(response.result.enrollmentNoExists){
        newErrors.enrollmentNo = "Student with this enrollment number already exists";
      }
      if(response.result.emailExists){
        newErrors.email = "Student with this email already exists";
      }
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
      const selectedBatchData = batches.find(b => b._id === formData.batch);
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
    <>
    {loading && <Spinner />}
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
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                    
                    {/* Profile Image Section - Moved to top */}
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

                    {/* Personal Details Form Fields */}
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

                      {/* Address */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <textarea
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            address: e.target.value
                          }))}
                          placeholder="Enter student's address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                        />
                      </div>
                    </div>

                    {/* Certificates Section - Moved to bottom of personal information */}
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

                  {/* Fee Information Section */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Fee Information</h3>
                    <div className="space-y-6">
                      {/* Batch and Course Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Batch Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Batch <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.batch}
                            onChange={handleBatchChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select Batch</option>
                            {batches.map((batch) => (
                              <option key={batch._id} value={batch._id}>
                                {batch.batchName}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Course Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.course}
                            onChange={handleCourseChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={!formData.batch}
                          >
                            <option value="">Select Course</option>
                            {formData.batch && batches.find(b => b._id === formData.batch)?.courses.map((course) => (
                              <option key={course._id} value={course._id}>
                                {course.name} - ₹{course.fees}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Fee Payment Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Total Fees */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Fees <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="number"
                            value={formData.totalFees}
                            readOnly
                            className="bg-gray-100"
                            placeholder="Total fees will be set automatically based on course"
                          />
                        </div>

                        {/* Fees Paid */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fees Paid <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="number"
                            value={formData.feesPaid}
                            onChange={handleChange}
                            name="feesPaid"
                            placeholder="Enter fees paid"
                            required
                          />
                        </div>

                        {/* Payment Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Date <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="date"
                            value={formData.feeTransactions[0].date}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              feeTransactions: [{
                                ...prev.feeTransactions[0],
                                date: e.target.value
                              }]
                            }))}
                            required
                          />
                        </div>

                        {/* Payment Mode */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Mode <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.feeTransactions[0].mode}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              feeTransactions: [{
                                ...prev.feeTransactions[0],
                                mode: e.target.value
                              }]
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="cash">Cash</option>
                            <option value="online">Online</option>
                            <option value="cheque">Cheque</option>
                            <option value="bank_transfer">Bank Transfer</option>
                          </select>
                        </div>

                        {/* Remarks */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Remarks
                          </label>
                          <textarea
                            value={formData.feeTransactions[0].remarks}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              feeTransactions: [{
                                ...prev.feeTransactions[0],
                                remarks: e.target.value
                              }]
                            }))}
                            placeholder="Enter any remarks or notes about the payment"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                          />
                        </div>
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
                      {loading ? '' : <FaUser />}
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
    </>
  );
};

export default AddStudent;
