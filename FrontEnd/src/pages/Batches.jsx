// pages/BatchesPage.js
import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaChevronRight,
  FaPlus,
  FaEye,
  FaCalendarAlt,
  FaUserTie,
  FaBook,
  FaEdit,
  FaTrash,
  FaGraduationCap,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import TopNav from "../components/TopNav";

const BatchesPage = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await api.getAllBatches();
      console.log('Batches response:', response); // Debug log
      if (response && !response.error) {
        setBatches(response.batches || []);
      } else {
        throw new Error(response.message || "Failed to fetch batches");
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error(error.message || "Failed to fetch batches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-24">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Batches</h1>
              <p className="text-gray-600 mt-2">Manage and view all batches</p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate("/batches/add")}
              className="flex items-center gap-2"
            >
              <FaPlus />
              Add Batch
            </Button>
          </div>

          {/* Batches Table */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">All Batches</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {batches.length > 0 ? (
                    batches.map((batch) => (
                      <tr key={batch._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{batch.batchName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {format(new Date(batch.startDate), "dd MMMM yyyy")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {format(new Date(batch.endDate), "dd MMMM yyyy")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{batch.students?.length || 0} students</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center space-x-3">
                            <button
                              onClick={() => navigate(`/batchDetails/${batch._id}`)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                              title="View Details"
                            >
                              <FaEye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => navigate(`/edit-batch/${batch._id}`)}
                              className="text-green-600 hover:text-green-900 transition-colors duration-150"
                              title="Edit Batch"
                            >
                              <FaEdit className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No batches available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BatchesPage;

