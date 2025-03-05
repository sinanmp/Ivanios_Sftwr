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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    rollNo: "",
    gender: "",
    email: "",
    mobile: "",
    department: "",
    parentsName: "",
    parentsMobile: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.rollNo.trim()) newErrors.rollNo = "Roll No is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      newErrors.email = "Valid email is required";
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Valid 10-digit mobile number is required";
    if (!formData.department)
      newErrors.department = "Department selection is required";
    if (!formData.parentsName.trim())
      newErrors.parentsName = "Parent's name is required";
    if (
      !formData.parentsMobile.trim() ||
      !/^\d{10}$/.test(formData.parentsMobile)
    )
      newErrors.parentsMobile =
        "Valid 10-digit parent's mobile number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (photo === null) newErrors.photo = "Please upload a photo";
    if (certificates.length === 0)
      newErrors.certificates = "Please add at least one certificate";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted Successfully", formData);
    }
  };

  const addCertificate = () => {
    setCertificates([
      ...certificates,
      { type: "", file: null, preview: null, fileName: "No file chosen" },
    ]);
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
      updatedCertificates[index].preview = file
        ? URL.createObjectURL(file)
        : null;
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

  const handleNumberInput = (e, field) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, [field]: value });
    if (value.length > 10) {
      setFormData({ ...formData, [field]: value.slice(0, 10) });
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
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add Student</h2>
            <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="First name*"
                  className="p-3 border rounded-md w-full"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last name"
                  className="p-3 border rounded-md w-full"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Roll No*"
                  className="p-3 border rounded-md w-full"
                  value={formData.rollNo}
                  onChange={(e) =>
                    setFormData({ ...formData, rollNo: e.target.value })
                  }
                />
                {errors.rollNo && (
                  <p className="text-red-500 text-sm">{errors.rollNo}</p>
                )}
              </div>
              <div>
                <select
                  className="p-3 border rounded-md w-full"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="">Gender*</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">{errors.gender}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email*"
                  className="p-3 border rounded-md w-full"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Mobile*"
                  className="p-3 border rounded-md w-full"
                  value={formData.mobile}
                  onChange={(e) => handleNumberInput(e, "mobile")}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm">{errors.mobile}</p>
                )}
              </div>
              <div>
                <input
                  type="date"
                  className="cursor-pointer p-3 border rounded-md text-gray-700 w-full"
                  value={registrationDate}
                  onChange={(e) => setRegistrationDate(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="p-3 border rounded-md w-full"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                >
                  <option value="">Select Department*</option>
                  <option>Computer Science</option>
                  <option>Engineering</option>
                  <option>Mathematics</option>
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm">{errors.department}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Parents name*"
                  className="p-3 border rounded-md w-full"
                  value={formData.parentsName}
                  onChange={(e) =>
                    setFormData({ ...formData, parentsName: e.target.value })
                  }
                />
                {errors.parentsName && (
                  <p className="text-red-500 text-sm">{errors.parentsName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Parents Mobile Number"
                  className="p-3 border rounded-md w-full"
                  value={formData.parentsMobile}
                  onChange={(e) => handleNumberInput(e, "parentsMobile")}
                />
                {errors.parentsMobile && (
                  <p className="text-red-500 text-sm">{errors.parentsMobile}</p>
                )}
              </div>
              <div className="w-full flex">
                <div className="w-full">
                  <textarea
                    placeholder="Address*"
                    className="w-full p-2 border rounded-md"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  ></textarea>
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address}</p>
                  )}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Upload Photo*
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="border p-3 w-full rounded-md pr-24"
                        value={photoName}
                        readOnly
                      />
                      <label className="absolute right-1 top-1/2 transform -translate-y-1/2 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                        Choose File
                        <input
                          type="file"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {errors.photo && (
                <p className="text-red-500 text-sm">{errors.photo}</p>
              )}
              {photoName !== "No file chosen" && (
                <div className="">
                    <p className="text-gray-600 text-sm">Preview:</p>
                  <img
                    src={photo}
                    alt="Student Preview"
                    className="w-32 h-32 object-cover border rounded-md mt-1" 
                  />
                </div>
              )}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold mb-2">Certificates</h3>
                {certificates.map((certificate, index) => (
                  <div key={index} className="flex items-center gap-4 mb-3">
                    <select
                      className="p-3 border rounded-md flex-1"
                      value={certificate.type}
                      onChange={(e) =>
                        updateCertificate(index, "type", e.target.value)
                      }
                    >
                      <option value="">Select Certificate</option>
                      <option value="Birth Certificate">
                        Birth Certificate
                      </option>
                      <option value="ID Proof">ID Proof</option>
                      <option value="Previous Marksheets">
                        Previous Marksheets
                      </option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        className="border p-3 w-full rounded-md pr-24"
                        value={certificate.fileName}
                        readOnly
                      />
                      <label className="absolute right-1 top-1/2 transform -translate-y-1/2 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                        Choose File
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            updateCertificate(index, "file", e.target.files[0])
                          }
                        />
                      </label>
                    </div>
                    {certificate.preview && (
                      <img
                        src={certificate.preview}
                        alt="Preview"
                        className="w-16 h-16 object-cover border rounded-md"
                      />
                    )}
                    <button
                      type="button"
                      className="cursor-pointer text-red-500 hover:text-red-700"
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
                {errors.certificates && (
                  <p className="text-red-500 text-sm">{errors.certificates}</p>
                )}
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