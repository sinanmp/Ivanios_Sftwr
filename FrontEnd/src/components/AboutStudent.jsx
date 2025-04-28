import React from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaCalendarAlt } from "react-icons/fa";

const AboutStudent = ({ student }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
            {student.profileImage ? (
              <img
                src={student.profileImage}
                alt={student.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FaUser className="w-10 h-10 text-blue-600" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{student.name}</h2>
            <p className="text-blue-100">{student.enrollmentNo}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800">{student.mobile}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-800">{student.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="text-gray-800">{student.dob}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FaGraduationCap className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Course</p>
                <p className="text-gray-800">{student.course}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Batch</p>
                <p className="text-gray-800">{student.batch}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fees Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Fees Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Fees</p>
              <p className="text-gray-800">₹{student.totalFees}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fees Paid</p>
              <p className="text-gray-800">₹{student.feesPaid}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Balance</p>
              <p className="text-gray-800">₹{student.totalFees - student.feesPaid}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutStudent;
  