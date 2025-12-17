import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllStudents, updateStudent } from '../services/studentServices'; 
import { User, Mail, Phone, Home, Building, Save, Loader2 } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // New State to hold the FULL object from DB
  const [rawStudent, setRawStudent] = useState(null);

  const [profileData, setProfileData] = useState({
    id: null,
    name: '',
    email: '', 
    phone: '',
    room: '',
    department: ''
  });

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!user) return;
      if (user.role === 'student') {
        try {
          const students = await getAllStudents();
          
          const myProfile = students.find(s => 
            (s.rollNo === user.username) || (s.roll_no === user.username)
          );

          if (myProfile) {
            // 1. SAVE THE FULL ORIGINAL OBJECT
            setRawStudent(myProfile);

            // 2. Set the display data
            setProfileData({
              id: myProfile.id,
              name: myProfile.name,
              email: myProfile.rollNo || myProfile.roll_no, 
              phone: myProfile.contact, 
              room: myProfile.current_room_id ? `Room ID: ${myProfile.current_room_id}` : 'Not Allocated Yet',
              department: myProfile.department
            });
          }
        } catch (error) {
          console.error("Could not load profile", error);
        }
      }
    };
    
    fetchStudentDetails();
  }, [user]);

  const handleSave = async () => {
    if (!profileData.id || !rawStudent) return;

    setLoading(true);
    try {
        // 3. MERGE OLD DATA WITH NEW PHONE NUMBER
        // We take the 'rawStudent' (full object) and overwrite only the 'contact'
        const updatedPayload = {
            ...rawStudent, 
            contact: profileData.phone 
        };

        console.log("Sending Payload to Backend:", updatedPayload); // Debug check

        await updateStudent(profileData.id, updatedPayload);
        alert("Phone number updated successfully!");
    } catch (error) {
        console.error("Update failed", error);
        alert("Update Failed! Check the Java Console for the exact error.");
    } finally {
        setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Profile Settings</h2>
        <p className="text-gray-500 text-sm mb-6">Update your contact details</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" readOnly className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" value={profileData.name} />
            </div>
          </div>

          {/* Roll No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Roll No</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" readOnly className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" value={profileData.email} />
            </div>
          </div>

          {/* Phone Number (Editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-blue-600 text-xs ml-2">(Editable)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-blue-600" size={18} />
              <input 
                type="tel" 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              />
            </div>
          </div>

          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Room</label>
            <div className="relative">
              <Home className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" readOnly className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500" value={profileData.room} />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
            <button 
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-70"
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;