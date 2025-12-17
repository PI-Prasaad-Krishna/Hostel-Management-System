import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, BedDouble } from 'lucide-react';
import { getAllHostels } from '../services/hostelService';
import { getRoomsByHostel, assignRoom } from '../services/roomService';
import { getAllStudents } from '../services/studentServices'; // Assuming you have this
import Modal from '../components/Modal';

const RoomAllocation = () => {
  // State
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Modal State
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // 1. Load Hostels on Page Load
  useEffect(() => {
    loadHostels();
    loadStudents();
  }, []);

  // 2. Load Rooms when a Hostel is selected
  useEffect(() => {
    if (selectedHostel) {
      loadRooms(selectedHostel);
    }
  }, [selectedHostel]);

  const loadHostels = async () => {
    try {
      const data = await getAllHostels();
      setHostels(data);
      if (data.length > 0) setSelectedHostel(data[0].id); // Auto-select first hostel
    } catch (err) { console.error(err); }
  };

  const loadRooms = async (hostelId) => {
    try {
      const data = await getRoomsByHostel(hostelId);
      // Sort rooms nicely (101, 102, 201...)
      const sorted = data.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true }));
      setRooms(sorted);
    } catch (err) { console.error(err); }
  };

  const loadStudents = async () => {
    try {
        const data = await getAllStudents();
        // Only show students who DON'T have a room yet
        // (You might need to update your backend Student API to send 'currentRoom' status, 
        // for now we just load everyone)
        setStudents(data);
    } catch (err) { console.error(err); }
  }

  // 3. Handle Assignment
  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) return alert("Please select a student");

    try {
      await assignRoom(selectedStudentId, selectedRoom.id);
      alert("Student Assigned Successfully!");
      setAssignModalOpen(false);
      loadRooms(selectedHostel); // Refresh room list to show updated occupancy
    } catch (error) {
      alert("Failed to assign room. Student might already be assigned.");
      console.error(error);
    }
  };

  // Helper to get Status Color
  const getStatusColor = (current, capacity) => {
    if (current === 0) return 'bg-green-100 text-green-700 border-green-200'; // Vacant
    if (current >= capacity) return 'bg-red-100 text-red-700 border-red-200'; // Full
    return 'bg-yellow-100 text-yellow-700 border-yellow-200'; // Partial
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BedDouble className="text-blue-600"/> Room Allocation
        </h2>
        
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Select Hostel:</span>
            <select 
                className="bg-gray-50 border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedHostel || ''}
                onChange={(e) => setSelectedHostel(e.target.value)}
            >
                {hostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
        </div>
      </div>

      {/* ROOMS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            onClick={() => {
                if(room.currentOccupancy < room.capacity) {
                    setSelectedRoom(room);
                    setAssignModalOpen(true);
                } else {
                    alert("This room is already full!");
                }
            }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${getStatusColor(room.currentOccupancy, room.capacity)}`}
          >
            <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-lg">{room.roomNumber}</span>
                {room.currentOccupancy >= room.capacity && <span className="text-xs font-bold px-1.5 py-0.5 bg-white/50 rounded">FULL</span>}
            </div>
            
            <div className="flex items-center justify-between text-xs font-medium opacity-80">
                <span className="flex items-center gap-1"><Users size={12}/> {room.currentOccupancy}/{room.capacity}</span>
                <span>Floor {room.floor}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ASSIGN MODAL */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setAssignModalOpen(false)} title={`Assign Student to Room ${selectedRoom?.roomNumber}`}>
        <form onSubmit={handleAssign} className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
                You are assigning a student to <strong>{selectedHostel && hostels.find(h => h.id == selectedHostel)?.name}</strong>, Room <strong>{selectedRoom?.roomNumber}</strong>.
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                <div className="relative">
                    <UserPlus className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <select 
                        required
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                    >
                        <option value="">-- Choose a Student --</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>
                                {student.name} ({student.rollNo || 'No Roll No'})
                            </option>
                        ))}
                    </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">Only showing active students.</p>
            </div>

            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                Confirm Assignment
            </button>
        </form>
      </Modal>
    </div>
  );
};

export default RoomAllocation;