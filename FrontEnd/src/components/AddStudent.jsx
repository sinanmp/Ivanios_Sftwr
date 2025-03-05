import { useState } from "react";
import {
  FaHome,
  FaChevronRight,
  FaBell,
  FaExpand,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import Sidebar from "./Sidebar";

const AddStudent = () => {
  const [certificates, setCertificates] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState("No file chosen");
  const [registrationDate, setRegistrationDate] = useState("");

  const addCertificate = () => {
    setCertificates([...certificates, { type: "", file: null, preview: null, fileName: "No file chosen" }]);
  };

  const removeCertificate = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  const updateCertificate = (index, field, value) => {
    const updatedCertificates = [...certificates];

    if (field === "file") {
      const file = value;
      updatedCertificates[index].file = file;
      updatedCertificates[index].fileName = file ? file.name : "No file chosen";
      updatedCertificates[index].preview = file ? URL.createObjectURL(file) : null;
    } else {
      updatedCertificates[index][field] = value;
    }

    setCertificates(updatedCertificates);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setPhotoName(file.name);
    }
  };

  return (
    <div className="flex fixed top-0 left-0 w-full h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="flex justify-end items-center bg-white px-6 py-4 shadow-md w-full">
          <div className="flex items-center gap-4">
            <img src="/us-flag.png" alt="Country" className="w-6 h-4" />
            <FaExpand className="text-xl cursor-pointer text-gray-600" />
            <FaBell className="text-xl cursor-pointer text-gray-600" />
            <div className="flex items-center gap-2">
              <img src="/profile.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
              <span className="font-medium">IVANIOS</span>
            </div>
          </div>
        </div>

        {/* Scrollable Form Container */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center text-gray-600 space-x-2 text-lg font-medium">
            <FaHome className="text-blue-500" />
            <FaChevronRight />
            <span>Student</span>
            <FaChevronRight />
            <span className="text-blue-500">Add Student</span>
          </div>
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add Student</h2>
            <form className="grid grid-cols-2 gap-6">
              <input type="text" placeholder="First name*" className="p-2 border rounded-md" />
              <input type="text" placeholder="Last name" className="p-2 border rounded-md" />
              <input type="text" placeholder="Roll No*" className="p-2 border rounded-md" />
              <select className="p-2 border rounded-md">
                <option>Gender*</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              <input type="email" placeholder="Email*" className="p-2 border rounded-md" />
              <input type="tel" placeholder="Mobile*" className="p-2 border rounded-md" />

              {/* Date Field */}
              <input
                type="date"
                className="p-2 border rounded-md text-gray-700"
                value={registrationDate}
                onChange={(e) => setRegistrationDate(e.target.value)}
                onFocus={(e) => e.target.type = "date"}
                onBlur={(e) => e.target.type = registrationDate ? "date" : "text"}
                placeholder="YYYY-MM-DD"
              />

              <select className="p-2 border rounded-md">
                <option>Select Department*</option>
                <option>Computer Science</option>
                <option>Engineering</option>
                <option>Mathematics</option>
              </select>
              <input type="text" placeholder="Parents name*" className="p-2 border rounded-md" />
              <input type="tel" placeholder="Parents Mobile Number" className="p-2 border rounded-md" />
              
              {/* Address Field */}
              <textarea placeholder="Address*" className="col-span-2 p-2 border rounded-md"></textarea>

              {/* Upload Student Photo */}
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-1">Upload Photo*</label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    className="border p-2 w-1/2 rounded-md"
                    value={photoName}
                    readOnly
                  />
                  <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                    Choose File
                    <input type="file" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
                {photo && (
                  <div className="mt-2">
                    <p className="text-gray-600 text-sm">Preview:</p>
                    <img src={photo} alt="Student Preview" className="w-32 h-32 object-cover border rounded-md mt-1" />
                  </div>
                )}
              </div>

              {/* Dynamic Certificates Section */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold mb-2">Certificates</h3>
                {certificates.map((certificate, index) => (
                  <div key={index} className="flex items-center gap-4 mb-3">
                    <select
                      className="p-2 border rounded-md flex-1"
                      value={certificate.type}
                      onChange={(e) => updateCertificate(index, "type", e.target.value)}
                    >
                      <option value="">Select Certificate</option>
                      <option value="Birth Certificate">Birth Certificate</option>
                      <option value="ID Proof">ID Proof</option>
                      <option value="Previous Marksheets">Previous Marksheets</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="border p-2 rounded-md"
                        value={certificate.fileName}
                        readOnly
                      />
                      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                        Choose File
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => updateCertificate(index, "file", e.target.files[0])}
                        />
                      </label>
                    </div>
                    {certificate.preview && (
                      <img src={certificate.preview} alt="Preview" className="w-16 h-16 object-cover border rounded-md" />
                    )}
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeCertificate(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                  onClick={addCertificate}
                >
                  <FaPlus className="mr-2" /> Add Certificate
                </button>
              </div>

              <button className="col-span-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
