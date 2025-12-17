import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, BedDouble, LogOut } from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  // In a real app, you would fetch specific student details here using user.studentId
  // For now, we will just show the logged-in user's info

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                {user.name?.charAt(0)}
            </div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-blue-100 uppercase tracking-wider text-xs font-semibold mt-1">Student Portal</p>
        </div>

        {/* Info Cards */}
        <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><User size={20}/></div>
                <div>
                    <p className="text-xs text-gray-500">Roll Number</p>
                    <p className="font-semibold text-gray-800">{user.username}</p>
                </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="bg-green-100 p-2 rounded-lg text-green-600"><BedDouble size={20}/></div>
                <div>
                    <p className="text-xs text-gray-500">Room Allocation</p>
                    {/* Placeholder until we fetch real data */}
                    <p className="font-semibold text-gray-800">Check Notice Board</p> 
                </div>
            </div>

            <button onClick={logout} className="w-full mt-4 flex items-center justify-center gap-2 text-red-500 font-medium hover:bg-red-50 py-3 rounded-xl transition-colors">
                <LogOut size={18} /> Logout
            </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;