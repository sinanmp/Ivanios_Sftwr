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
        <div className="flex fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
                <TopNav />
                <main className="flex-1 overflow-y-auto p-6 pt-24">
                    {/* Breadcrumb */}
                    <div className="flex items-center text-gray-600 space-x-2 text-lg font-medium mb-6">
                        <FaHome className="text-blue-500" />
                        <FaChevronRight className="text-gray-400" />
                        <span 
                            onClick={() => navigate("/students/all")}
                            className="cursor-pointer hover:text-blue-500 transition-colors duration-200"
                        >
                            Students
                        </span>
                        <FaChevronRight className="text-gray-400" />
                        <span className="text-blue-500">{student.name}</span>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-6xl mx-auto">
                        <Card variant="elevated" hoverable className="mb-6">
                            <CardHeader
                                title="Student Profile"
                                subtitle="View and manage student information"
                            />
                            <CardContent>
                                <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                                    {/* Profile Image */}
                                    <div className="relative group">
                                        <img
                                            src={student.profileImage?.url || "/default-profile.png"}
                                            alt="Profile"
                                            onClick={() => setSelectedImage(student.profileImage?.url)}
                                            className="w-48 h-48 object-cover cursor-pointer rounded-xl border-4 border-blue-500 shadow-lg transition-transform duration-300 group-hover:scale-105"
                                        />
                                           
                                    </div>

                                    {/* Student Details */}
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-800">{student.name}</h2>
                                            <p className="text-gray-600 mt-1">Student ID: {student.enrollmentNo}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <FaEnvelope className="text-blue-500 text-xl" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-medium">{student.email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <FaPhone className="text-blue-500 text-xl" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Mobile</p>
                                                    <p className="font-medium">{student.mobile}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <FaGraduationCap className="text-blue-500 text-xl" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Batch</p>
                                                    <p className="font-medium">{student.batch?.batchName || "N/A"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <FaIdCard className="text-blue-500 text-xl" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Admission No</p>
                                                    <p className="font-medium">{student.admissionNo}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex space-x-4">
                                            <Button
                                                variant="primary"
                                                onClick={() => navigate(`/editStudent/${id}`)}
                                            >
                                                Edit Profile
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() => navigate("/students/all")}
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {student.certificates.map((cert, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <FaDownload className="text-blue-500" />
                                                    </div>
                                                    <span className="font-medium">{cert.type}</span>
                                                </div>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => downloadCertificate(cert.url, cert.type)}
                                                >
                                                    Download
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                                            <FaDownload className="text-gray-400 text-2xl" />
                                        </div>
                                        <p className="text-gray-500">No certificates available</p>
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
