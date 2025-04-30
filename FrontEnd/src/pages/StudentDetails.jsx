import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { FaBell, FaChevronRight, FaExpand, FaHome, FaTimes, FaEnvelope, FaPhone, FaGraduationCap, FaIdCard, FaDownload, FaUser, FaMoneyBillWave, FaCalendarAlt, FaFilePdf } from "react-icons/fa";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import Input from "../components/ui/Input";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/logo.png.png';

const StudentDetails = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showFeeModal, setShowFeeModal] = useState(false);
    const [feeForm, setFeeForm] = useState({
        amount: "",
        date: new Date().toISOString().split('T')[0],
        mode: "cash",
        remarks: ""
    });
    const [errors, setErrors] = useState({});

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

    const handleFeeChange = (e) => {
        const { name, value } = e.target;
        const pendingFees = student.totalFees - (student.feeTransactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0);
        
        if (name === 'amount') {
            const amount = parseFloat(value) || 0;
            if (amount < 0) {
                setErrors(prev => ({ ...prev, amount: "Amount cannot be less than 0" }));
            } else if (amount > pendingFees) {
                setErrors(prev => ({ ...prev, amount: `Amount cannot be greater than pending fees (₹${pendingFees})` }));
            } else {
                setErrors(prev => ({ ...prev, amount: "" }));
            }
        }
        
        setFeeForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFeeSubmit = async (e) => {
        e.preventDefault();
        const pendingFees = student.totalFees - (student.feeTransactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0);
        const amount = parseFloat(feeForm.amount) || 0;

        if (amount <= 0) {
            toast.error("Amount must be greater than 0");
            return;
        }
        if (amount > pendingFees) {
            toast.error(`Amount cannot be greater than pending fees (₹${pendingFees})`);
            return;
        }

        try {
            setLoading(true);
            const response = await api.addFeePayment(id, {
                amount: amount,
                date: feeForm.date,
                mode: feeForm.mode,
                remarks: feeForm.remarks
            });
            if (response && !response.error) {
                setStudent(response.student);
                setShowFeeModal(false);
                setFeeForm({
                    amount: "",
                    date: new Date().toISOString().split('T')[0],
                    mode: "cash",
                    remarks: ""
                });
                toast.success("Fee payment added successfully");
            } else {
                toast.error(response.message || "Failed to add fee payment");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add fee payment");
        } finally {
            setLoading(false);
        }
    };

    const downloadFeeHistoryPDF = () => {
        try {
            const doc = new jsPDF();
            
            // Convert base64 image
            const img = new Image();
            img.src = logo;
            
            // Add logo once image is loaded
            img.onload = () => {
                try {
                    // Create canvas to convert image
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const imgData = canvas.toDataURL('image/png');
                    
                    // Add logo at top left
                    const logoWidth = 25;
                    const logoHeight = 25;
                    const logoX = 15;
                    const logoY = 15;
                    doc.addImage(imgData, 'PNG', logoX, logoY, logoWidth, logoHeight);
                    
                    
                    // Add title
                    doc.setFontSize(18);
                    doc.setFont('Helvetica', 'bold');
                    doc.text('Fee Transaction History', doc.internal.pageSize.width / 2, logoY + 12, { align: 'center' });
                    
                    // Add main horizontal line
                    doc.setLineWidth(0.5);
                    doc.line(15, logoY + logoHeight + 8, doc.internal.pageSize.width - 15, logoY + logoHeight + 8);
                    
                    // Add student details
                    doc.setFontSize(12);
                    doc.setFont('Helvetica', 'bold');
                    doc.text('Student Details', 15, logoY + logoHeight + 15);
                    
                    doc.setFontSize(10);
                    doc.setFont('Helvetica', 'normal');
                    const detailsY = logoY + logoHeight + 25;
                    doc.text(`Name: ${student.name}`, 15, detailsY);
                    doc.text(`Enrollment No: ${student.enrollmentNo}`, 15, detailsY + 7);
                    
                    // Add fee summary in a box
                    const boxY = detailsY + 15;
                    doc.setFillColor(247, 250, 252); // Light blue background
                    doc.rect(15, boxY, doc.internal.pageSize.width - 30, 30, 'F');
                    
                    // Custom amount formatting function with monospace font for numbers
                    const formatAmount = (value) => {
                        // Convert to string and remove any existing commas
                        let numStr = value.toString().replace(/,/g, '');
                        
                        // Format number according to Indian number system
                        numStr = numStr.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                        return numStr;
                    };
                    
                    // Calculate amounts
                    const totalFees = student.totalFees;
                    const feesPaid = student.feeTransactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;
                    const pendingFees = totalFees - feesPaid;
                    
                    // Add labels with bold font
                    doc.setFont('times', 'bold');
                    doc.text('Total Fees:', 20, boxY + 10);
                    doc.text('Fees Paid:', 20, boxY + 22);
                    doc.text('Pending Fees:', doc.internal.pageSize.width - 85, boxY + 10);
                    
                    // Add amounts with monospace font
                    doc.setFont('times', 'bold'); // Using courier for monospace numbers
                    const amountX = 65;
                    doc.text(`${formatAmount(totalFees)}`, amountX, boxY + 10);
                    doc.text(`${formatAmount(feesPaid)}`, amountX, boxY + 22);
                    doc.text(`${formatAmount(pendingFees)}`, doc.internal.pageSize.width - 50, boxY + 10);
                    
                    // Add transaction table
                    const tableData = student.feeTransactions?.map(transaction => [
                        new Date(transaction.date).toLocaleDateString('en-IN'),
                        `${formatAmount(transaction.amount)}`,
                        transaction.mode.charAt(0).toUpperCase() + transaction.mode.slice(1),
                        transaction.remarks || '-'
                    ]) || [];
                    
                    autoTable(doc, {
                        startY: boxY + 40,
                        head: [['Date', 'Amount', 'Mode', 'Remarks']],
                        body: tableData,
                        theme: 'grid',
                        headStyles: {
                            fillColor: [41, 128, 185],
                            textColor: 255,
                            fontStyle: 'bold',
                            halign: 'center',
                            fontSize: 10,
                            font: 'times'
                        },
                        styles: {
                            fontSize: 10,
                            cellPadding: 6,
                            lineColor: [200, 200, 200],
                            lineWidth: 0.1,
                            font: 'times',
                            fontStyle: 'normal'
                        },
                        columnStyles: {
                            0: { cellWidth: 35, halign: 'center' },
                            1: { cellWidth: 30, halign: 'center', fontStyle: 'bold', font: 'times' },
                            2: { cellWidth: 35, halign: 'center' },
                            3: { cellWidth: 'auto', halign: 'left' }
                        },
                        alternateRowStyles: {
                            fillColor: [247, 250, 252]
                        },
                        margin: { left: 15, right: 15 },
                        didDrawPage: function (data) {
                            // Add total row after the table
                            if (data.cursor.y > 0) { // Only add on pages with table content
                                const totalY = data.cursor.y + 10;
                                doc.setFont('times', 'bold');
                                doc.setFillColor(240, 240, 240);
                                doc.rect(15, totalY - 6, doc.internal.pageSize.width - 30, 12, 'F');
                                doc.text('Total :', 50, totalY);
                                doc.text(`${formatAmount(feesPaid)}`, 63, totalY);
                            }
                        }
                    });
                    
                    // Add footer with page numbers and timestamp
                    const pageCount = doc.internal.getNumberOfPages();
                    for(let i = 1; i <= pageCount; i++) {
                        doc.setPage(i);
                        doc.setFontSize(8);
                        doc.setFont('times', 'normal');
                        doc.text(
                            `Generated on: ${new Date().toLocaleString('en-IN')}`,
                            15,
                            doc.internal.pageSize.height - 10
                        );
                        doc.text(
                            `Page ${i} of ${pageCount}`,
                            doc.internal.pageSize.width - 25,
                            doc.internal.pageSize.height - 10
                        );
                    }
                    
                    // Save the PDF
                    doc.save(`Fee_History_${student.name.replace(/\s+/g, '_')}_${student.enrollmentNo}.pdf`);
                } catch (error) {
                    console.error('Error processing logo:', error);
                    toast.error('Failed to generate PDF. Please try again.');
                }
            };
            
            // Handle image loading error
            img.onerror = () => {
                console.error('Error loading logo');
                toast.error('Failed to generate PDF. Please try again.');
            };
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF. Please try again.');
        }
    };

    console.log(student, "student")
    if (loading) return <Spinner />;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!student) return <p>No student found.</p>;

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen ml-0 md:ml-64">
                <TopNav />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-24">
                    {/* Breadcrumb */}
                    <div className="flex items-center text-gray-600 space-x-2 text-sm md:text-base font-medium mb-4 md:mb-6 overflow-x-auto whitespace-nowrap">
                        <FaHome className="text-blue-500 flex-shrink-0" />
                        <FaChevronRight className="text-gray-400 flex-shrink-0" />
                        <span 
                            onClick={() => navigate("/students/all")}
                            className="cursor-pointer hover:text-blue-500 transition-colors duration-200"
                        >
                            Students
                        </span>
                        <FaChevronRight className="text-gray-400 flex-shrink-0" />
                        <span className="text-blue-500 truncate">{student.name}</span>
                    </div>

                    {/* Main Content */}
                    <div className="w-full max-w-5xl mx-auto space-y-6">
                        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
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

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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

                        {/* Fees Information Section */}
                        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                            <CardHeader
                                title="Fees Information"
                                subtitle="View student's fee details"
                            />
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                                            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                                                <FaMoneyBillWave className="text-green-500 text-xl" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm text-gray-500">Total Fees</p>
                                                <p className="font-medium text-gray-900">₹{student.totalFees}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                                            <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                                                <FaMoneyBillWave className="text-red-500 text-xl" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm text-gray-500">Pending Fees</p>
                                                {student.totalFees - (student.feeTransactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0) > 0 ? (
                                                    <p className="font-medium text-gray-900">₹{student.totalFees - (student.feeTransactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0)}</p>
                                                ) : (
                                                    <p className="font-medium text-green-600">No Pending</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                                            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                                <FaMoneyBillWave className="text-blue-500 text-xl" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-gray-500">Fees Paid</p>
                                                <p className="font-medium text-gray-900">₹{student.feeTransactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0}</p>
                                            </div>
                                            {student.totalFees - (student.feeTransactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0) > 0 && (
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => setShowFeeModal(true)}
                                                    className="whitespace-nowrap"
                                                >
                                                    Add Paid Fees
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Fee Transaction History */}
                                    <div className="mt-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-medium text-gray-900">Fee Transaction History</h3>
                                            {student?.feeTransactions?.length > 0 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => downloadFeeHistoryPDF()}
                                                    className="flex items-center gap-2"
                                                >
                                                    <FaFilePdf />
                                                    Download PDF
                                                </Button>
                                            )}
                                        </div>
                                        <div className="bg-white shadow rounded-lg overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Date
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Amount
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Mode
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Remarks
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {student?.feeTransactions?.map((transaction, index) => (
                                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {new Date(transaction.date).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    ₹{transaction.amount.toLocaleString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                        transaction.mode === 'cash' ? 'bg-green-100 text-green-800' :
                                                                        transaction.mode === 'online' ? 'bg-blue-100 text-blue-800' :
                                                                        transaction.mode === 'cheque' ? 'bg-purple-100 text-purple-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {transaction.mode.charAt(0).toUpperCase() + transaction.mode.slice(1)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                                    {transaction.remarks || '-'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {(!student?.feeTransactions || student.feeTransactions.length === 0) && (
                                                            <tr>
                                                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                                    No transaction history available
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Certificates Section */}
                        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
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
                                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 space-y-3 sm:space-y-0 sm:space-x-4"
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

            {/* Fee Payment Modal */}
            {showFeeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Add Fee Payment</h3>
                            <button
                                onClick={() => setShowFeeModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                Pending Fees: ₹{student.totalFees - (student.feeTransactions?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0)}
                            </p>
                        </div>
                        <form onSubmit={handleFeeSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="number"
                                    value={feeForm.amount}
                                    onChange={handleFeeChange}
                                    name="amount"
                                    placeholder="Enter amount"
                                    required
                                    error={errors.amount}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Date <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="date"
                                    value={feeForm.date}
                                    onChange={(e) => setFeeForm({ ...feeForm, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Mode <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={feeForm.mode}
                                    onChange={(e) => setFeeForm({ ...feeForm, mode: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="cash">Cash</option>
                                    <option value="online">Online</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Remarks
                                </label>
                                <textarea
                                    value={feeForm.remarks}
                                    onChange={(e) => setFeeForm({ ...feeForm, remarks: e.target.value })}
                                    placeholder="Enter any remarks or notes"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowFeeModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                >
                                    Add Payment
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80">
                    <div className="relative max-w-4xl w-full">
                        <button
                            className="absolute -top-4 -right-4 z-10 p-2 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors duration-200"
                            onClick={() => setSelectedImage(null)}
                        >
                            <FaTimes className="text-xl" />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="w-full h-auto rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDetails;
