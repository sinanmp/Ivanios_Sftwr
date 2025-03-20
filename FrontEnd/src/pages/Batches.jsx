// pages/BatchesPage.js
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
import api from "../services/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { NavLink, useNavigate } from "react-router-dom";
import { format } from "date-fns";

const BatchesPage = () => {
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await api.getAllBatches();
      console.log(response); // Check the structure of the response data
      if (Array.isArray(response.batches)) {
        setBatches(response.batches);
      } else {
        setBatches([]); // Set to an empty array if the response is not an array
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Failed to fetch batches", { position: "top-center" });
      setBatches([]); // Set to an empty array in case of an error
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
          <div className="flex items-center justify-between text-gray-600 space-x-2 text-lg font-medium">
            <div className="flex justify-center items-center">
              <FaHome className="text-blue-500" />
              <FaChevronRight />
              <span>Batches</span>
            </div>
            <NavLink to="/batches/add">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                onClick={() => navigate("/batches/add")}
              >
                Add Batch
              </button>
            </NavLink>
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
                  <tr key={batch?._id} className="text-center">
                    <td className="border p-3">{batch?.batchName}</td>
                    <td className="border p-3">{batch?.course}</td>
                    <td className="border p-3">
                      {batch?.startDate
                        ? format(new Date(batch.startDate), "dd-MM-yyyy")
                        : ""}
                    </td>
                    <td className="border p-3">
                      {batch?.endDate
                        ? format(new Date(batch.endDate), "dd-MM-yyyy")
                        : ""}
                    </td>
                    <td className="border p-3">{batch?.instructor}</td>
                    <td className="border p-3">
                      <button
                        className="text-blue-500 cursor-pointer hover:text-red-700"
                        onClick={() => navigate(`/batches/${batch._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {loading && <Spinner />}
    </div>
  );
};

export default BatchesPage;
