import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { FaBook, FaClock, FaMoneyBillWave, FaArrowLeft, FaPlus } from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import api from "../services/api";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    durationUnit: "months",
    fees: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent negative values for fees
    if (name === 'fees' && value.startsWith('-')) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    // Remove non-numeric characters and prevent negative values
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const formatDuration = (value, unit) => {
    if (!value) return '';
    const months = unit === 'years' ? parseInt(value) * 12 : parseInt(value);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    let duration = '';
    if (years > 0) {
      duration += `${years} year${years > 1 ? 's' : ''}`;
    }
    if (remainingMonths > 0) {
      if (duration) duration += ' ';
      duration += `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
    return duration;
  };

  const formatFees = (value) => {
    if (!value) return '';
    const num = parseInt(value);
    if (isNaN(num)) return '';

    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const convertLessThanHundred = (num) => {
      if (num === 0) return '';
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    };

    const convertLessThanThousand = (num) => {
      if (num === 0) return '';
      if (num < 100) return convertLessThanHundred(num);
      return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' ' + convertLessThanHundred(num % 100) : '');
    };

    if (num === 0) return 'zero rupees';

    let result = '';
    let remaining = num;

    // Handle crores
    if (remaining >= 10000000) {
      const crore = Math.floor(remaining / 10000000);
      result += convertLessThanThousand(crore) + ' crore ';
      remaining %= 10000000;
    }

    // Handle lakhs
    if (remaining >= 100000) {
      const lakh = Math.floor(remaining / 100000);
      result += convertLessThanThousand(lakh) + ' lakh ';
      remaining %= 100000;
    }

    // Handle thousands
    if (remaining >= 1000) {
      const thousand = Math.floor(remaining / 1000);
      result += convertLessThanThousand(thousand) + ' thousand ';
      remaining %= 1000;
    }

    // Handle remaining amount
    if (remaining > 0) {
      result += convertLessThanThousand(remaining);
    }

    return result.trim() + ' rupees';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.fees) newErrors.fees = "Fees is required";
    if (!formData.description) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData,"form Submited");
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await api.addCourse({
        name: formData.name,
        duration: formatDuration(formData.duration, formData.durationUnit),
        fees: parseInt(formData.fees),
        description: formData.description
      });

      if (response && !response.error) {
        console.log(response,"response");
        toast.success("Course added successfully");
        
        // Check if we came from the add batch page
        const fromAddBatch = window.location.state?.from === "/batches/add";
        if (fromAddBatch) {
          toast.success("You can now create a batch with this course");
          navigate("/batches/add");
        } else {
          navigate("/courses");
        }
      } else {
        throw new Error(response?.message || "Failed to add course");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error(error.message || "Failed to add course");
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/courses")}
                className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <FaArrowLeft />
                Back to Courses
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Add New Course</h1>
                <p className="text-gray-600 mt-2">Fill in the required details to add a new course</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card variant="elevated" hoverable className="max-w-2xl mx-auto bg-white shadow-lg">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  {/* Course Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Course Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaBook className="text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter course name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaClock className="text-gray-400" />
                        </div>
                        <Input
                          type="text"
                          id="duration"
                          name="duration"
                          value={formData.duration}
                          onChange={handleDurationChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Enter duration"
                        />
                      </div>
                      <div className="w-32">
                        <select
                          name="durationUnit"
                          value={formData.durationUnit}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        >
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                    </div>
                    {formData.duration && (
                      <p className="mt-2 text-sm text-gray-500">
                        {formatDuration(formData.duration, formData.durationUnit)}
                      </p>
                    )}
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
                    )}
                  </div>

                  {/* Fees */}
                  <div>
                    <label htmlFor="fees" className="block text-sm font-medium text-gray-700 mb-2">
                      Course Fees <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMoneyBillWave className="text-gray-400" />
                      </div>
                      <Input
                        type="text"
                        id="fees"
                        name="fees"
                        value={formData.fees}
                        onChange={handleDurationChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter course fees in INR"
                      />
                    </div>
                    {formData.fees && (
                      <p className="mt-2 text-sm text-gray-500">
                        {formatFees(formData.fees)}
                      </p>
                    )}
                    {errors.fees && (
                      <p className="mt-1 text-sm text-red-500">{errors.fees}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      rows="4"
                      placeholder="Enter course description (optional)"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex items-center gap-2 px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm transition-colors"
                    disabled={loading}
                  >
                    {loading ? <Spinner /> : <FaPlus />}
                    Add Course
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AddCourse; 