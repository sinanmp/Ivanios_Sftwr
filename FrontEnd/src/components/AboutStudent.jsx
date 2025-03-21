const AboutStudent = () => {
    const student = {
      name: "John Doe",
      enrollmentNo: "101",
      email: "john@example.com",
      department: "Computer Science",
      mobile: "9876543210",
      parentName: "Mr. Doe",
      parentMobile: "9123456789",
    };
  
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Student Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Roll No:</strong> {student.enrollmentNo}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Department:</strong> {student.department}</p>
          <p><strong>Mobile:</strong> {student.mobile}</p>
          <p><strong>Parent Name:</strong> {student.parentName}</p>
          <p><strong>Parent Mobile:</strong> {student.parentMobile}</p>
        </div>
      </div>
    );
  };
  
  export default AboutStudent;
  