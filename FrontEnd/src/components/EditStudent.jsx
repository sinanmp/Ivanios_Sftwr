const EditStudent = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Edit Student</h2>
        <form className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="First name*" className="p-2 border rounded-md" />
          <input type="text" placeholder="Last name" className="p-2 border rounded-md" />
          <input type="text" placeholder="Roll No*" className="p-2 border rounded-md" />
          <select className="p-2 border rounded-md">
            <option>Gender*</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input type="email" placeholder="Email*" className="p-2 border rounded-md" />
          <input type="tel" placeholder="Mobile*" className="p-2 border rounded-md" />
          <button className="col-span-2 bg-green-500 text-white py-2 rounded-md">Update</button>
        </form>
      </div>
    );
  };
  
  export default EditStudent;
  