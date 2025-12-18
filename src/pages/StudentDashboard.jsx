import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllStudents } from '../services/studentServices';
import { getAllRooms } from '../services/roomService'; // Ensure this matches your file name
import { User, BedDouble, Building, Phone } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.role === 'student') {
        try {
          // 1. Fetch Student
          const students = await getAllStudents();
          const myProfile = students.find(s => 
            (s.rollNo === user.username) || (s.roll_no === user.username)
          );
          setStudentData(myProfile);

          // 2. Fetch Room Details if allocated
          const roomId = myProfile?.currentRoomId || myProfile?.current_room_id;
          
          if (roomId) {
             const allRooms = await getAllRooms(); 
             const myRoom = allRooms.find(r => r.id === roomId);
             setRoomDetails(myRoom);
          }

        } catch (error) {
          console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  // Safe checks
  const dept = studentData?.department || 'General';
  
  // --- ROBUST ROOM & HOSTEL NAME EXTRACTION ---
  let displayRoom = 'Not Allocated';
  let displayHostel = ''; // Default empty

  if (roomDetails) {
      displayRoom = `Room ${roomDetails.roomNumber || roomDetails.room_number}`;
      
      // Check 3 places: Nested Object (Spring Boot default), camelCase, or snake_case
      displayHostel = 
          roomDetails.hostel?.name ||       // room.hostel.name
          roomDetails.hostelName ||         // room.hostelName
          roomDetails.hostel_name ||        // room.hostel_name
          'Mens Block A';                   // Fallback if data is missing
  }
  // ---------------------------------------------

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
            {/* Show Hostel Name in smaller gray text below the room number */}
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

        {/* ✅ Updated Room Card with Hostel Name */}
        <StatCard 
            title="Current Allocation" 
            value={displayRoom} 
            subValue={displayHostel} 
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