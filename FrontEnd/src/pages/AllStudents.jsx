import { FaBell, FaChevronRight, FaExpand, FaHome, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate()
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await api.fetchStudents(page, search);
        setStudents(result.students);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [page, search]);

  const handleDelete = async (id) => {
    try {
      await api.deleteStudent(id);
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };



  return (
    <div className="flex fixed top-0 left-0 w-full h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end items-center bg-white px-6 py-4 shadow-md w-full">
          <div className="flex items-center gap-4">
            <img src="/us-flag.png" alt="Country" className="w-6 h-4" />
            <FaExpand className="text-xl cursor-pointer text-gray-600" />
            <FaBell className="text-xl cursor-pointer text-gray-600" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center text-gray-600 space-x-2 text-lg font-medium">
            <FaHome className="text-blue-500" />
            <FaChevronRight />
            <span>Students</span>
            <FaChevronRight />
            <span className="text-blue-500">All Students</span>
          </div>

          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">All Students</h2>

            {/* Search Input */}
            <div className="flex mb-3 justify-between">


              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 border rounded"
              />

              <button onClick={()=> navigate('/students/add')} className="bg-blue-600 p-2 text-white cursor-pointer  rounded-sm">
                <p>Add Student</p>
              </button>
            </div>


            {/* Students Table */}
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Roll No</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Department</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>  
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="border p-2">{student.rollNo}</td>
                    <td className="border p-2">{student.name}</td>
                    <td className="border p-2">{student.department}</td>
                    <td className="border p-2">{student.email}</td>
                    <td className="border p-3 flex gap-4 justify-center">
                      <button className="text-blue-500 hover:text-blue-700">
                        <FaEye />
                      </button>
                      <button className="text-green-500 hover:text-green-700">
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(student.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStudents;