import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api"; // Assuming api.js handles API requests
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import { format } from "date-fns";
import { FaHome, FaChevronRight, FaExpand, FaBell, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import TopNav from "../components/TopNav";
import { constructFromSymbol } from "date-fns/constants";

const BatchDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const response = await api.getBatchDetails(id);
        console.log(response);
        setBatch(response.batch);
      } catch (err) {
        setError("Failed to fetch batch details");
      } finally {
        setLoading(false);
      }
    };

    fetchBatchDetails();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!batch) return <p>No batch details found.</p>;
  if(!loading) console.log(batch.students)
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end items-center bg-white px-6 py-4 shadow-md w-full">
          <TopNav />
        </div>
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center text-gray-600 space-x-2 text-lg font-medium mb-5">
            <FaHome className="text-blue-500" />
            <FaChevronRight />
            <span>Batches</span>
            <FaChevronRight />
            <span >Batch Details</span>
            <FaChevronRight />
            <span className="text-blue-500">{batch.batchName}</span>
          </div>

          <div className="w-full flex flex-col justify-center items-center mx-auto p-6 bg-white  shadow-lg  rounded-lg">
            <h2 className="text-3xl flex  font-bold text-blue-600 mb-4">
              {batch.batchName}
            </h2>

            {/* Details Section */}
            <div className="flex flex-wrap w-full">
              {/* Courses List */}
              <div className="flex-1 min-w-[250px]">
                <h3 className="text-xl font-semibold mb-2">Courses</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {batch.courses.length > 0 ? (
                    batch.courses.map((course, index) => (
                      <li key={index} className="mb-1">
                        {course}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No courses available</li>
                  )}
                </ul>
              </div>
              {/* Instructor & Date Info */}
              <div className="flex-1 min-w-[250px] flex flex-col justify-between">
                <p>
                  <strong>Instructor:</strong> {batch.instructor}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {format(new Date(batch.startDate), "dd-MM-yyyy")}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {format(new Date(batch.endDate), "dd-MM-yyyy")}
                </p>
              </div>
            </div>

            {/* Students Section */}
            <h3 className="mt-6 text-xl font-semibold">Students</h3>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Profile</th>
                  <th className="border p-2">Enrollment No</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Course</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody >
                {batch.students.length > 0 ? (
                  batch.students.map((student) => (
                    <tr key={student._id}>
                      <td className="border p-2 flex justify-center">
                        <img
                          src={
                            student.profileImage?.url || "/default-profile.png"
                          }
                          alt="Profile"
                          className="w-15 h-15 object-center"
                        />
                      </td>
                      <td className="border p-2 text-center">{student.enrollmentNo}</td>
                      <td className="border p-2 text-center">{student.name}</td>
                      <td className="border p-2 text-center">{student.course}</td>
                      <td className="border p-2 text-center">{student.email}</td>
                      <td className="border p-3 flex h-20 gap-4 justify-center">
                        <button
                          onClick={() =>
                            navigate(`/studentDetails/${student._id}`)
                          }
                          className="text-blue-500 cursor-pointer hover:text-blue-700"
                        >
                          <FaEye />
                        </button>
                        <button className="text-green-500 cursor-pointer hover:text-green-700">
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-500 cursor-pointer hover:text-red-700"
                          onClick={() => handleDelete(student._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="border p-3 text-center text-gray-500"
                      colSpan="6"
                    >
                      No students enrolled
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailsPage;
