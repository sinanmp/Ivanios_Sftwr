import React from "react";
import { FaCheck, FaTimes, FaCalendarAlt } from "react-icons/fa";

const StudentAttendance = ({ attendance }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      case "Late":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return <FaCheck className="w-4 h-4" />;
      case "Absent":
        return <FaTimes className="w-4 h-4" />;
      case "Late":
        return <FaCalendarAlt className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
        <h2 className="text-2xl font-bold text-white">Attendance Record</h2>
        <p className="text-blue-100">Total Classes: {attendance.length}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 font-semibold text-gray-600">Date</th>
                <th className="pb-3 font-semibold text-gray-600">Status</th>
                <th className="pb-3 font-semibold text-gray-600">Time</th>
                <th className="pb-3 font-semibold text-gray-600">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendance.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-800">{record.date}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      <span className="ml-2">{record.status}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-800">{record.time}</td>
                  <td className="py-4 text-gray-600">{record.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Present</h3>
            <p className="text-2xl font-bold text-green-600">
              {attendance.filter((record) => record.status === "Present").length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800">Absent</h3>
            <p className="text-2xl font-bold text-red-600">
              {attendance.filter((record) => record.status === "Absent").length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800">Late</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {attendance.filter((record) => record.status === "Late").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
  