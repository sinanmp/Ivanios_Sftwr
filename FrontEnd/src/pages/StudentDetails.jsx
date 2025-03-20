import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaBell, FaChevronRight, FaExpand, FaHome, FaTimes } from "react-icons/fa";
import Spinner from "../components/Spinner";

const StudentDetails = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // State for modal imag

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await api.getStudentDetails(id);
                console.log(response)
                setStudent(response.student);
            } catch (err) {
                setError("Failed to fetch student details");
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!student) return <p>No student found.</p>;

    const downloadCertificate = async (fileUrl, fileName) => {
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };


    return (
        <>
        {loading && <Spinner/>}
            <div className="flex">
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
                        <div className="flex items-center text-gray-600 space-x-2 text-lg mb-4 font-medium">
                            <FaHome className="text-blue-500" />
                            <FaChevronRight />
                            <span onClick={()=> navigate("/students/all")}>Students</span>
                            <FaChevronRight />
                            <span className="text-blue-500">Add Student</span>
                        </div>
                        <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
                            {/* Profile Section */}
                            <div className="flex items-center space-x-6 mb-6">
                                <img
                                    src={student.profileImage?.url || "/default-profile.png"}
                                    alt="Profile"
                                    onClick={() => setSelectedImage(student.profileImage?.url)}
                                    className="w-24 h-24 object-cover cursor-pointer border-2 border-blue-500 rounded-lg"
                                />
                                <h2 className="text-3xl font-bold text-blue-600">{student.name}</h2>
                            </div>

                            {/* Details in Grid Layout */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <p><strong>Email:</strong> {student.email}</p>
                                <p><strong>Enrollment No:</strong> {student.enrollmentNo}</p>
                                <p><strong>Admission No:</strong> {student.admissionNo}</p>
                                <p><strong>Mobile:</strong> {student.mobile}</p>
                                <p><strong>Batch:</strong> {student.batch?.batchName || "N/A"}</p>
                            </div>

                            {/* Certificates Section */}
                            <h3 className="mt-6 text-xl font-semibold">Certificates</h3>
                            <ul className="mt-2">
                                {student.certificates.length > 0 ? (
                                    student.certificates.map((cert, index) => (
                                        <li key={index} className="flex items-center justify-between border-b py-2">
                                            <span>{cert.fileName}</span>
                                            <button
                                                onClick={() => downloadCertificate(cert.file.url, cert.fileName)}
                                                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
                                            >
                                                Download
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <p>No certificates available</p>
                                )}
                            </ul>
                        </div>

                    </div>
                </div>

            </div>


            {/* Image Preview Modal */}
            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="relative">
                        <button
                            className="absolute top-2 right-2 cursor-pointer text-white bg-gray-700 rounded-full p-2"
                            onClick={() => setSelectedImage(null)}
                        >
                            <FaTimes className="text-xl" />
                        </button>
                        <img src={selectedImage} alt="Preview" className="max-w-full max-h-[90vh] rounded-lg shadow-lg" />
                    </div>
                </div>
            )}

        </>
    );
};

export default StudentDetails;
