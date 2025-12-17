import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllStudents } from '../services/studentServices';
import { User, Mail, Phone, Home, Building } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth(); // Get the currently logged-in user
  const [profileData, setProfileData] = useState({
    name: '',
    email: '', // We'll use Roll No as username/email identifier
    phone: '',
    room: '',
    department: ''
  });

  useEffect(() => {
    // If the logged-in user is a student, find their specific details
    const fetchStudentDetails = async () => {
      if (user && user.role === 'student') {
        try {
          // Ideally, you'd have a specific API like `getStudentByRollNo(user.username)`
          // For now, we can fetch all and filter (simple workaround for your current setup)
          const students = await getAllStudents();
          const myProfile = students.find(s => s.rollNo === user.username);

          if (myProfile) {
            setProfileData({
              name: myProfile.name,
              email: myProfile.rollNo, // Displaying Roll No in the "Email/ID" field
              phone: myProfile.contact,
              // Check if room is assigned, otherwise show "Not Allocated"
              room: myProfile.current_room_id ? `Room ID: ${myProfile.current_room_id}` : 'Not Allocated Yet',
              department: myProfile.department
            });
          }
        } catch (error) {
          console.error("Could not load profile", error);
        }
      } else {
        // Fallback for Admin or other users
        setProfileData({
          name: 'Admin User',
          email: 'admin@hostel.com',
          phone: '+91 98765 43210',
          room: 'N/A (Admin Office)',
          department: 'Administration'
        });
      }
    };

    fetchStudentDetails();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Profile Settings</h2>
        <p className="text-gray-500 text-sm mb-6">View your personal information</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Full Name - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                readOnly
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none"
                value={profileData.name}
              />
            </div>
          </div>

          {/* Roll No / Username - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Roll No / Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                readOnly
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none"
                value={profileData.email}
              />
            </div>
          </div>

          {/* Phone Number - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                readOnly
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none"
                value={profileData.phone}
              />
            </div>
          </div>

          {/* Room Number - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Room</label>
            <div className="relative">
              <Home className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                readOnly
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg cursor-not-allowed focus:outline-none font-medium ${
                  profileData.room.includes('Not') 
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-700' 
                    : 'bg-green-50 border-green-200 text-green-700'
                }`}
                value={profileData.room}
              />
            </div>
          </div>

           {/* Department - Read Only */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <div className="relative">
              <Building className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                readOnly
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none"
                value={profileData.department}
              />
            </div>
          </div>

        </div>

        {/* Info Note */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700">
          <strong>Note:</strong> These details are managed by the Hostel Administration. 
          If you notice any errors or need to request a room change, please contact the warden or submit a complaint.
        </div>
      </div>
    </div>
  );
};

export default Settings;