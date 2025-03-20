// pages/BatchDetailsPage.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { format } from "date-fns";
import Spinner from "../components/Spinner";

const BatchDetailsPage = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const dummyBatch = {
        batchName: "Web Development Bootcamp",
        course: "Full-Stack Development",
        instructor: "John Doe",
        startDate: "2024-01-15",
        endDate: "2024-06-15",
        students: [
          { _id: "1", name: "Alice Johnson", email: "alice@example.com" },
          { _id: "2", name: "Bob Smith", email: "bob@example.com" }
        ]
      };
      setBatch(dummyBatch);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex fixed top-0 left-0 w-full h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6">
        <h2 className="text-xl font-semibold mb-4">Batch Details</h2>
        {loading ? (
          <Spinner />
        ) : batch ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p><strong>Batch Name:</strong> {batch.batchName}</p>
            <p><strong>Course:</strong> {batch.course}</p>
            <p><strong>Instructor:</strong> {batch.instructor}</p>
            <p><strong>Start Date:</strong> {format(new Date(batch.startDate), "dd-MM-yyyy")}</p>
            <p><strong>End Date:</strong> {format(new Date(batch.endDate), "dd-MM-yyyy")}</p>
            
            <h3 className="text-lg font-semibold mt-4">Students</h3>
            <table className="w-full border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3">Student Name</th>
                  <th className="border p-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {batch.students.length > 0 ? (
                  batch.students.map((student) => (
                    <tr key={student._id} className="text-center">
                      <td className="border p-3">{student.name}</td>
                      <td className="border p-3">{student.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border p-3" colSpan="2">No students enrolled</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No batch details available</p>
        )}
      </div>
    </div>
  );
};

export default BatchDetailsPage;