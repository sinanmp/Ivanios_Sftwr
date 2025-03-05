import Sidebar from "../components/Sidebar";

const AllStudents = () => {
    const students = [
      { id: 1, name: "John Doe", rollNo: "101", department: "CS", email: "john@example.com" },
      { id: 2, name: "Jane Smith", rollNo: "102", department: "Math", email: "jane@example.com" },
    ];
  
    return (
      <>
      <div className="flex">
        
        <Sidebar/>
      <div className="bg-white w-full p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">All Students</h2>
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
            </>
    );
  };
  
  export default AllStudents;
  