import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllStudents } from '../services/studentServices'; // Import service
import { User as UserIcon, MapPin, BedDouble, LogOut, Mail, Hash, Phone, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);

  // Fetch real data from DB
  useEffect(() => {
    const fetchRealData = async () => {
      if (user?.role === 'student') {
        try {
          const students = await getAllStudents();
          // Match by Roll No (checking both formats)
          const myProfile = students.find(s => 
            (s.rollNo === user.username) || (s.roll_no === user.username)
          );
          setStudentData(myProfile);
        } catch (error) {
          console.error("Failed to fetch dashboard data", error);
        }
      }
    };
    fetchRealData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <div>Loading...</div>;

  // Use DB data if available, otherwise fall back to login info
  const displayName = studentData?.name || user.name;
  const displayRoom = studentData?.current_room_id 
    ? `Room ${studentData.current_room_id}` 
    : 'Not Allocated Yet';

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white max-w-3xl w-full rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-center relative">
            <div className="absolute top-4 right-4 bg-blue-500 px-3 py-1 rounded-full text-xs text-white font-mono">
                {studentData?.rollNo || user.username}
            </div>
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold text-blue-600 shadow-lg">
                {displayName.charAt(0)}
            </div>
            <h1 className="text-3xl font-bold text-white">{displayName}</h1>
            <p className="text-blue-100 font-medium mt-1 uppercase tracking-widest text-sm">Student Portal</p>
        </div>

        {/* Details Grid */}
        <div className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">My Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Department */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border hover:border-blue-300 transition-colors">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><Building size={20}/></div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Department</p>
                        <p className="text-gray-800 font-medium">{studentData?.department || 'N/A'}</p>
                    </div>
                </div>

                {/* Role */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border hover:border-purple-300 transition-colors">
                    <div className="bg-purple-100 p-3 rounded-lg text-purple-600"><UserIcon size={20}/></div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Role</p>
                        <p className="text-gray-800 font-medium capitalize">{user.role}</p>
                    </div>
                </div>

                {/* Contact */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border hover:border-orange-300 transition-colors">
                    <div className="bg-orange-100 p-3 rounded-lg text-orange-600"><Phone size={20}/></div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Phone</p>
                        <p className="text-gray-800 font-medium">{studentData?.contact || 'N/A'}</p>
                    </div>
                </div>

                {/* Room Status (REAL DATA) */}
                <div className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${studentData?.current_room_id ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className={`p-3 rounded-lg ${studentData?.current_room_id ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        <BedDouble size={20}/>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Room Status</p>
                        <p className="text-gray-800 font-bold">{displayRoom}</p>
                    </div>
                </div>
            </div>

            {/* Logout Button */}
            <button 
                onClick={handleLogout} 
                className="w-full mt-8 bg-red-50 text-red-600 font-bold py-4 rounded-xl hover:bg-red-100 hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
                <LogOut size={20} /> Sign Out
            </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;