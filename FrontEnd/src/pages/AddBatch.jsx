import { useState } from "react";
import { FaHome, FaChevronRight, FaBell, FaExpand, FaTimes } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const courseOptions = [
  "Web Development",
  "Data Science",
  "Machine Learning",
  "Cyber Security",
  "Digital Marketing",
  "Cloud Computing",
  "Blockchain",
  "AI & Robotics",
  "Game Development"
];

const AddBatchPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    batchName: "",
    courses: [],
    startDate: "",
    endDate: "",
    instructor: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(""); // For dropdown selection

  const validateForm = () => {
    let newErrors = {};
    if (!formData.batchName.trim()) newErrors.batchName = "Batch name is required";
    if (formData.courses.length === 0) newErrors.courses = "At least one course is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.instructor.trim()) newErrors.instructor = "Instructor is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCourse = () => {
    if (selectedCourse && !formData.courses.includes(selectedCourse)) {
      setFormData((prev) => ({
        ...prev,
        courses: [...prev.courses, selectedCourse],
      }));
      setSelectedCourse("");
    }
  };

  const handleRemoveCourse = (course) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c !== course),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('this is formdata : ',formData)
      const response = await api.createBatch(formData);
      toast.success("Batch added successfully!", { position: "top-center" });
      setFormData({ batchName: "", courses: [], startDate: "", endDate: "", instructor: "" });
      navigate("/batches/all");
    } catch (error) {
      console.error("Error adding batch:", error);
      toast.error("Failed to add batch", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex fixed top-0 left-0 w-full h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end items-center bg-white px-6 py-4 shadow-md w-full">
          <div className="flex items-center gap-4">
            <FaExpand className="text-xl cursor-pointer text-gray-600" />
            <FaBell className="text-xl cursor-pointer text-gray-600" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center text-gray-600 space-x-2 text-lg font-medium">
            <FaHome className="text-blue-500" />
            <FaChevronRight />
            <span>Batches</span>
            <FaChevronRight />
            <span className="text-blue-500">Add Batch</span>
          </div>
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add Batch</h2>
            <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Batch Name*"
                  className="p-3 border rounded-md w-full"
                  value={formData.batchName}
                  onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                />
                {errors.batchName && <p className="text-red-500 text-sm">{errors.batchName}</p>}
              </div>

              {/* Course Selection Dropdown */}
              <div className="flex gap-3">
                <div className="flex w-full flex-col">
                <select
                  className="p-3 border mb-3 rounded-md w-full"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">Select a Course</option>
                  {courseOptions.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                   {/* Selected Courses List */}
              <div className="col-span-2 flex flex-wrap gap-2">
                {formData.courses.map((course) => (
                  <span key={course} className="bg-gray-200 px-3 py-1 rounded-md flex items-center">
                    {course}
                    <FaTimes
                      className="ml-2 text-red-500 cursor-pointer"
                      onClick={() => handleRemoveCourse(course)}
                    />
                  </span>
                ))}
              </div>
                </div>

                <button
                  type="button"
                  className="bg-blue-500 max-h-[49.4px] cursor-pointer text-white px-3 py-1 rounded-md"
                  onClick={handleAddCourse}
                >
                  Add
                </button>
                {errors.courses && <p className="text-red-500 text-sm">{errors.courses}</p>}
              </div>

           

              <div>
                <input
                  type="date"
                  className="p-3 border rounded-md w-full"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
                {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
              </div>

              <div>
                <input
                  type="date"
                  className="p-3 border rounded-md w-full"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
                {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Instructor*"
                  className="p-3 border rounded-md w-full"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                />
                {errors.instructor && <p className="text-red-500 text-sm">{errors.instructor}</p>}
              </div>

              <button className="col-span-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      {loading && <Spinner />}
    </div>
  );
};

export default AddBatchPage;
