import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllStudents } from '../services/studentServices';
import { getAllRooms } from '../services/roomService';
import { getAllHostels } from '../services/hostelService'; 
import { User, BedDouble, Building, Phone } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [hostelName, setHostelName] = useState(''); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.role === 'student') {
        try {
          // 1. Fetch ALL Data in parallel
          const [students, rooms, hostels] = await Promise.all([
             getAllStudents(),
             getAllRooms(),
             getAllHostels()
          ]);

          // 2. Find Current Student
          const myProfile = students.find(s => 
            (s.rollNo === user.username) || (s.roll_no === user.username)
          );
          setStudentData(myProfile);

          // 3. Find Room & Match Hostel
          const roomId = myProfile?.currentRoomId || myProfile?.current_room_id;
          
          if (roomId) {
             const myRoom = rooms.find(r => r.id === roomId);
             setRoomDetails(myRoom);

             if (myRoom) {
                 // Try getting ID (supports camelCase, snake_case, or nested)
                 const hId = myRoom.hostelId || myRoom.hostel_id || myRoom.hostel?.id;
                 
                 // Look up the real name from the hostels list
                 // Using '==' to safely match string IDs with number IDs
                 const foundHostel = hostels.find(h => h.id == hId);
                 
                 if (foundHostel) {
                     setHostelName(foundHostel.name); 
                 } else {
                     setHostelName(myRoom.hostel?.name || 'Unknown Hostel');
                 }
             }
          }

        } catch (error) {
          console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  // Safe checks
  const dept = studentData?.department || 'General';
  const displayRoom = roomDetails 
    ? `Room ${roomDetails.roomNumber || roomDetails.room_number}` 
    : 'Not Allocated';

  // Card Component
  const StatCard = ({ title, value, subValue, icon: Icon, color, isLoading }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
          <Icon size={24} />
        </div>
      </div>
      
      {isLoading ? (
          <div className="space-y-2">
            <div className="h-6 w-24 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-50 rounded animate-pulse"></div>
          </div>
      ) : (
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{value || '--'}</h3>
            {subValue && <p className="text-sm text-gray-500 font-medium mt-1">{subValue}</p>}
          </div>
      )}
      
      <p className="text-gray-400 text-sm font-medium mt-3">{title}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Overview</h1>
        <p className="text-gray-500 text-sm">Welcome back, {user.name || 'Student'}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <StatCard 
            title="Department" 
            value={dept} 
            icon={Building} 
            color="blue" 
            isLoading={loading}
        />

        <StatCard 
            title="Current Allocation" 
            value={displayRoom} 
            subValue={hostelName} 
            icon={BedDouble} 
            color={roomDetails ? "green" : "yellow"} 
            isLoading={loading}
        />

        <StatCard 
            title="My Role" 
            value="Student" 
            icon={User} 
            color="purple" 
            isLoading={loading}
        />

        <StatCard 
            title="Phone" 
            value={studentData?.contact} 
            icon={Phone} 
            color="orange" 
            isLoading={loading}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;