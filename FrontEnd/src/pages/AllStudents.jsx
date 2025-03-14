import { FaBell, FaChevronRight, FaExpand, FaHome } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

const AllStudents = () => {
  const students = [
    { id: 1, name: "John Doe", rollNo: "101", department: "CS", email: "john@example.com" },
    { id: 2, name: "Jane Smith", rollNo: "102", department: "Math", email: "jane@example.com" },
  ];

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
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Roll No</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Department</th>
                  <th className="border p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="border p-2">{student.rollNo}</td>
                    <td className="border p-2">{student.name}</td>
                    <td className="border p-2">{student.department}</td>
                    <td className="border p-2">{student.email}</td>
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

export default AllStudents;