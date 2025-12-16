import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Filter, Search, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const Complaints = () => {
  const { user } = useAuth();

  // Mock Data
  const [complaints, setComplaints] = useState([
    { id: 'CMP001', student: 'Rahul Sharma', room: 'A-101', issue: 'AC not working', priority: 'High', status: 'Open', date: '2025-12-16' },
    { id: 'CMP002', student: 'Priya Patel', room: 'A-102', issue: 'Water leakage', priority: 'High', status: 'In Progress', date: '2025-12-16' },
    { id: 'CMP003', student: 'Amit Kumar', room: 'B-201', issue: 'Broken chair', priority: 'Low', status: 'Resolved', date: '2025-12-15' },
    { id: 'CMP004', student: 'Sneha Reddy', room: 'B-203', issue: 'WiFi connectivity', priority: 'Medium', status: 'Open', date: '2025-12-15' },
  ]);

  // Helper to get badge colors
  const getPriorityColor = (p) => {
    switch(p) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  const getStatusColor = (s) => {
    switch(s) {
      case 'Resolved': return 'bg-green-100 text-green-600';
      case 'In Progress': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Complaints & Issues</h2>
          <p className="text-gray-500 text-sm">Track and resolve hostel maintenance issues</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={20} /> New Complaint
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Open Complaints</p>
            <h3 className="text-2xl font-bold text-gray-800">12</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">In Progress</p>
            <h3 className="text-2xl font-bold text-gray-800">5</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-500 rounded-lg">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Resolved (This Month)</p>
            <h3 className="text-2xl font-bold text-gray-800">45</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search complaints..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Student</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Issue</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Priority</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                {user.role === 'admin' && <th className="p-4 text-sm font-semibold text-gray-600">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-500 text-sm">{item.id}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{item.student}</div>
                    <div className="text-xs text-gray-500">{item.room}</div>
                  </td>
                  <td className="p-4 text-gray-700">{item.issue}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{item.date}</td>
                  {user.role === 'admin' && (
                    <td className="p-4">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Resolve</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Complaints;