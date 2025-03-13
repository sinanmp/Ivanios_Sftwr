import { useState, useEffect } from "react";
import {
  FaHome,
  FaChevronRight,
  FaBell,
  FaExpand,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const BatchesPage = () => {
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({ batchName: "", course: "", startDate: "", endDate: "", instructor: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get("/api/batches").then((response) => setBatches(response.data));
  }, []);

  const validateForm = () => {
    let newErrors = {};
    if (!formData.batchName.trim()) newErrors.batchName = "Batch name is required";
    if (!formData.course.trim()) newErrors.course = "Course is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.instructor.trim()) newErrors.instructor = "Instructor is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("/api/batches", formData);
        setBatches([...batches, response.data]);
        setFormData({ batchName: "", course: "", startDate: "", endDate: "", instructor: "" });
      } catch (error) {
        console.error("Error adding batch:", error);
      }
    }
  };

  const removeBatch = async (id) => {
    try {
      await axios.delete(`/api/batches/${id}`);
      setBatches(batches.filter((batch) => batch._id !== id));
    } catch (error) {
      console.error("Error deleting batch:", error);
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
              <div>
                <input
                  type="text"
                  placeholder="Course*"
                  className="p-3 border rounded-md w-full"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                />
                {errors.course && <p className="text-red-500 text-sm">{errors.course}</p>}
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
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Batch List</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3">Batch Name</th>
                  <th className="border p-3">Course</th>
                  <th className="border p-3">Start Date</th>
                  <th className="border p-3">End Date</th>
                  <th className="border p-3">Instructor</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch._id} className="text-center">
                    <td className="border p-3">{batch.batchName}</td>
                    <td className="border p-3">{batch.course}</td>
                    <td className="border p-3">{batch.startDate}</td>
                    <td className="border p-3">{batch.endDate}</td>
                    <td className="border p-3">{batch.instructor}</td>
                    <td className="border p-3">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeBatch(batch._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchesPage;
