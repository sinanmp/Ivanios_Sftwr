import React from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

const Dashboard = () => {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="w-full">
          <div className="min-h-screen bg-gray-100">
            <div className="flex justify-end items-center bg-white px-6 py-4 shadow-md w-full">
              <TopNav />
            </div>
            {/* Header */}
            <div className="p-6">
              <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back, Admin!</p>
              </header>

              {/* Quick Stats */}
              <section className=" grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-gray-600 text-sm">Total Batches</h2>
                  <p className="text-2xl font-bold text-blue-600">5</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-gray-600 text-sm">Total Students</h2>
                  <p className="text-2xl font-bold text-green-600">120</p>
                </div>
              </section>

              {/* Batch Overview Table */}
              <section className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Batch Overview
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                        <th className="py-3 px-4 border-b">Batch Name</th>
                        <th className="py-3 px-4 border-b">
                          Students Enrolled
                        </th>
                        <th className="py-3 px-4 border-b">Start Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">BCA-2025</td>
                        <td className="py-3 px-4">30</td>
                        <td className="py-3 px-4">01-Apr-2025</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">BBA-2025</td>
                        <td className="py-3 px-4">25</td>
                        <td className="py-3 px-4">05-Apr-2025</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4">MCA-2024</td>
                        <td className="py-3 px-4">40</td>
                        <td className="py-3 px-4">15-Jan-2024</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
              {/* Recent Activities */}
              <section className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Recent Activities
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    🎓 Student <strong>Ayesha Khan</strong> added to Batch{" "}
                    <strong>BCA-2025</strong> (20 March 2025)
                  </li>
                  <li>
                    📚 New Batch <strong>BBA-2025</strong> created (19 March
                    2025)
                  </li>
                  <li>
                    🎓 Student <strong>Rahul Verma</strong> updated profile (18
                    March 2025)
                  </li>
                </ul>
              </section>
              {/* Announcements */}
              <section className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Announcements
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>
                    🛠️ Teacher Management Module is under development and will
                    be live soon!
                  </li>
                  <li>
                    📊 Attendance Tracking System is coming in April 2025.
                  </li>
                  <li>
                    ⚠️ Reminder: Verify student records for Batch MCA-2024 by
                    25th March 2025.
                  </li>
                </ul>
              </section>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
