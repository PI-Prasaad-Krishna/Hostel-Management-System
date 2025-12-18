import React, { useState, useEffect } from 'react';
import { getAllStudents, updateStudent } from '../services/studentServices';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

const Attendance = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // For Admin: Track which specific button is loading
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch attendance data", error);
    } finally {
      setLoading(false);
    }
  };

  // --- ADMIN ACTION: Toggle Status ---
  const toggleStatus = async (student) => {
    setUpdatingId(student.id);
    try {
      // Flip the status: If 'In' -> 'Out', If 'Out' -> 'In'
      const newStatus = student.status === 'Out' ? 'In' : 'Out';
      
      // Update Backend
      await updateStudent(student.id, { ...student, status: newStatus });
      
      // Update Local State (Instant UI feedback)
      setStudents(students.map(s => 
        s.id === student.id ? { ...s, status: newStatus } : s
      ));
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // --- VIEW 1: STUDENT VIEW ---
  if (user?.role === 'student') {
    const myProfile = students.find(s => 
      (s.rollNo === user.username) || (s.roll_no === user.username)
    );

    if (loading) return <div className="p-8 text-center">Loading status...</div>;
    
    // Default to 'In' if status is missing
    const isOut = myProfile?.status === 'Out';

    return (
      <div className="max-w-md mx-auto mt-10">
        <div className={`p-8 rounded-2xl shadow-lg text-center border-2 transition-all ${
            isOut ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
        }`}>
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                isOut ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
            }`}>
                {isOut ? <MapPin size={48} /> : <CheckCircle size={48} />}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                You are currently
            </h2>
            <h1 className={`text-5xl font-black mb-6 uppercase tracking-wider ${
                isOut ? 'text-orange-600' : 'text-green-600'
            }`}>
                {isOut ? 'OUT' : 'IN'}
            </h1>
            
            <p className="text-gray-500 font-medium flex items-center justify-center gap-2">
                <Clock size={18} />
                Status last updated by Admin
            </p>
        </div>
      </div>
    );
  }

  // --- VIEW 2: ADMIN VIEW ---
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Live Attendance</h1>
            <p className="text-gray-500 text-sm">Track student movement In/Out of hostel</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search student..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* ✅ FIX 1: Add 'table-fixed' to stop columns from breathing */}
        <table className="w-full text-left table-fixed">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {/* ✅ FIX 2: Assign specific widths to EVERY column */}
              <th className="p-4 text-gray-600 font-semibold text-sm w-1/4">Student</th>
              <th className="p-4 text-gray-600 font-semibold text-sm w-1/5">Roll No</th>
              <th className="p-4 text-gray-600 font-semibold text-sm w-1/6">Room</th>
              <th className="p-4 text-gray-600 font-semibold text-sm w-1/6">Status</th>
              <th className="p-4 text-gray-600 font-semibold text-sm text-center w-40">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.map(student => {
               const isOut = student.status === 'Out';
               const isUpdating = updatingId === student.id;

               return (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800 truncate">{student.name}</td>
                  <td className="p-4 text-gray-600 text-sm">{student.rollNo}</td>
                  <td className="p-4 text-gray-600 text-sm">
                    {student.currentRoomId ? `Room ${student.currentRoomId}` : '--'}
                  </td>
                  
                  {/* Status Badge */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        isOut ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                        {isOut ? <XCircle size={12} /> : <CheckCircle size={12} />}
                        {isOut ? 'Out' : 'In'}
                    </span>
                  </td>

                  {/* Toggle Button */}
                  <td className="p-4 text-center">
                    <div className="flex justify-center"> {/* Container to lock center */}
                        <button 
                            onClick={() => toggleStatus(student)}
                            disabled={isUpdating}
                            // ✅ FIX 3: Fixed width (w-32) so button itself doesn't reshape
                            className={`w-32 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                                isUpdating 
                                    ? 'bg-gray-100 text-gray-400 cursor-wait'
                                    : isOut 
                                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm shadow-green-200' 
                                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-200'
                            }`}
                        >
                            {isUpdating ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <span>{isOut ? 'Mark IN' : 'Mark OUT'}</span>
                            )}
                        </button>
                    </div>
                  </td>
                </tr>
               );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;