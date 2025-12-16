import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
  const { user } = useAuth();
  // If student, they only see their status. If Admin, they see table.
  
  // Mock Admin View Data
  const students = [
    { id: 'STU001', name: 'Rahul Sharma', room: 'A-101', status: 'Present', time: '09:15 AM' },
    { id: 'STU002', name: 'Priya Patel', room: 'A-102', status: 'Present', time: '09:20 AM' },
    { id: 'STU003', name: 'Amit Kumar', room: 'B-201', status: 'Absent', time: '-' },
  ];

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Attendance Tracking</h2>
            <p className="text-gray-500">Monitor in/out status</p>
        </div>
        {user.role === 'admin' && (
             <div className="flex gap-2">
                 <button className="border border-gray-300 bg-white px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">Select Date</button>
                 <button className="border border-gray-300 bg-white px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50">Export Report</button>
             </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
            <p className="text-gray-500">Present Today</p>
            <p className="text-4xl font-bold text-emerald-500 mt-2">400</p>
         </div>
         <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
            <p className="text-gray-500">Absent Today</p>
            <p className="text-4xl font-bold text-red-500 mt-2">25</p>
         </div>
         <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
            <p className="text-gray-500">Rate</p>
            <p className="text-4xl font-bold text-blue-500 mt-2">94%</p>
         </div>
      </div>

      {/* Admin Table View */}
      {user.role === 'admin' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
                <tr>
                <th className="p-4 text-sm text-gray-600">Student ID</th>
                <th className="p-4 text-sm text-gray-600">Name</th>
                <th className="p-4 text-sm text-gray-600">Room</th>
                <th className="p-4 text-sm text-gray-600">Status</th>
                <th className="p-4 text-sm text-gray-600">Check-in Time</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {students.map((s) => (
                <tr key={s.id}>
                    <td className="p-4 text-gray-500">{s.id}</td>
                    <td className="p-4 font-medium text-gray-800">{s.name}</td>
                    <td className="p-4 text-gray-500">{s.room}</td>
                    <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${s.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {s.status}
                        </span>
                    </td>
                    <td className="p-4 text-gray-500">{s.time}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      ) : (
        // Student View
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-xl font-bold mb-4">Your Status</h3>
            <div className="inline-block p-6 rounded-full bg-green-100 mb-4">
                <span className="text-4xl">👋</span>
            </div>
            <p className="text-lg text-gray-700">You are currently marked as <span className="font-bold text-green-600">INSIDE</span> the hostel.</p>
            <p className="text-gray-400 mt-2">Last Check-in: 09:15 AM</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;