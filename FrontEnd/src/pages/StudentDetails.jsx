import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { FaBell, FaChevronRight, FaExpand, FaHome, FaTimes, FaEnvelope, FaPhone, FaGraduationCap, FaIdCard, FaDownload, FaUser } from "react-icons/fa";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const StudentDetails = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await api.getStudentDetails(id);
                setStudent(response.student);
            } catch (err) {
                setError("Failed to fetch student details");
                toast.error("Failed to fetch student details");
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

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

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Certificate downloaded successfully!");
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Failed to download certificate");
        }
    };

    console.log(student, "student")
    if (loading) return <Spinner />;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!student) return <p>No student found.</p>;

    return (
        <div className="flex flex-col md:flex-row fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-0 md:ml-64">
                <TopNav />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-24">
                    {/* Breadcrumb */}
                    <div className="flex items-center text-gray-600 space-x-2 text-sm md:text-base font-medium mb-4 md:mb-6 overflow-x-auto">
                        <FaHome className="text-blue-500 flex-shrink-0" />
                        <FaChevronRight className="text-gray-400 flex-shrink-0" />
                        <span 
                            onClick={() => navigate("/students/all")}
                            className="cursor-pointer hover:text-blue-500 transition-colors duration-200 whitespace-nowrap"
                        >
                            Students
                        </span>
                        <FaChevronRight className="text-gray-400 flex-shrink-0" />
                        <span className="text-blue-500 truncate">{student.name}</span>
                    </div>

                    {/* Main Content */}
                    <div className="w-full max-w-6xl mx-auto">
                        <Card variant="elevated" hoverable className="mb-4 md:mb-6">
                            <CardHeader
                                title="Student Profile"
                                subtitle="View and manage student information"
                            />
                            <CardContent>
                                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                                    {/* Profile Image */}
                                    <div className="relative group w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
                                        <img
                                            src={student.profileImage?.url || "/default-profile.png"}
                                            alt="Profile"
                                            onClick={() => setSelectedImage(student.profileImage?.url)}
                                            className="w-full h-full object-cover cursor-pointer rounded-xl border-4 border-blue-500 shadow-lg transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Student Details */}
                                    <div className="flex-1 w-full space-y-4 md:space-y-6">
                                        <div className="text-center md:text-left">
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{student.name}</h2>
                                            <p className="text-gray-600 mt-1">Student ID: {student.enrollmentNo}</p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                                                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                                    <FaEnvelope className="text-blue-500 text-xl" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-medium truncate">{student.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                                                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                                    <FaPhone className="text-blue-500 text-xl" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-gray-500">Mobile</p>
                                                    <p className="font-medium truncate">{student.mobile}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                                                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                                    <FaGraduationCap className="text-blue-500 text-xl" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-gray-500">Batch</p>
                                                    <p className="font-medium truncate">{student.batch?.batchName || "N/A"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                                                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                                    <FaIdCard className="text-blue-500 text-xl" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm text-gray-500">Admission No</p>
                                                    <p className="font-medium truncate">{student.admissionNo}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                                            <Button
                                                variant="primary"
                                                onClick={() => navigate(`/editStudent/${id}`)}
                                                className="w-full sm:w-auto"
                                            >
                                                Edit Profile
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() => navigate("/students/all")}
                                                className="w-full sm:w-auto"
                                            >
                                                Back to Students
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Certificates Section */}
                        <Card variant="elevated" hoverable>
                            <CardHeader
                                title="Certificates"
                                subtitle="View and download student certificates"
                            />
                            <CardContent>
                                {student.certificates.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {student.certificates.map((cert, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 space-y-3 sm:space-y-0"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                                        <FaDownload className="text-blue-500" />
                                                    </div>
                                                    <span className="font-medium truncate">{cert.type}</span>
                                                </div>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => downloadCertificate(cert.url, cert.type)}
                                                    className="w-full sm:w-auto"
                                                >
                                                    Download
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="flex justify-center mb-4">
                                            <FaGraduationCap className="text-4xl text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-700 mb-2">No Certificates</h3>
                                        <p className="text-gray-500">This student has no certificates uploaded yet.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="relative">
                        <button
                            className="absolute -top-4 -right-4 cursor-pointer text-white bg-gray-700 rounded-full p-2 hover:bg-gray-600 transition-colors duration-200"
                            onClick={() => setSelectedImage(null)}
                        >
                            <FaTimes className="text-xl" />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDetails;
