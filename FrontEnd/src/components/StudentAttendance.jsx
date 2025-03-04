const StudentAttendance = () => {
    const students = [
      { id: 1, name: "John Doe", rollNo: "101" },
      { id: 2, name: "Jane Smith", rollNo: "102" },
    ];
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Student Attendance</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Roll No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border p-2">{student.rollNo}</td>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">
                  <input type="checkbox" className="mr-2" />
                  Present
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md">Save Attendance</button>
      </div>
    );
  };
  
  export default StudentAttendance;
  