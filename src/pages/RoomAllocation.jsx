import React, { useState, useEffect } from 'react';
import { BedDouble, UserPlus, Users, XCircle, User } from 'lucide-react';
import { getAllHostels } from '../services/hostelService';
import { getRoomsByHostel, assignRoom, vacateRoom } from '../services/roomService';
import { getAllStudents } from '../services/studentServices';
import Modal from '../components/Modal';

const RoomAllocation = () => {
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]); 
  
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Initial Load
  useEffect(() => {
    loadData();
  }, []);

  // Reload rooms when hostel changes
  useEffect(() => {
    if (selectedHostel) loadRooms(selectedHostel);
  }, [selectedHostel]);

  const loadData = async () => {
    await loadHostels();
    await loadStudents();
  };

  const loadHostels = async () => {
    try {
      const data = await getAllHostels();
      setHostels(data);
      if (data.length > 0) setSelectedHostel(data[0].id);
    } catch (err) { console.error(err); }
  };

  const loadRooms = async (hostelId) => {
    try {
      const data = await getRoomsByHostel(hostelId);
      // Sort: 101, 102...
      const sorted = data.sort((a, b) => 
        a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })
      );
      setRooms(sorted);
    } catch (err) { console.error(err); }
  };

  const loadStudents = async () => {
    try {
        const data = await getAllStudents();
        setStudents(data);
    } catch (err) { console.error(err); }
  }

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) return alert("Please select a student");
    try {
      await assignRoom(selectedRoom.id, selectedStudentId);
      alert("Assigned!");
      setAssignModalOpen(false);
      // Refresh BOTH rooms and students to update the UI instantly
      loadRooms(selectedHostel); 
      loadStudents(); 
    } catch (error) {
      alert("Failed to assign. Check console.");
    }
  };

  const handleVacate = async (studentId) => {
    if(!window.confirm("Remove this student from the room?")) return;
    try {
        await vacateRoom(studentId);
        loadRooms(selectedHostel);
        loadStudents();
    } catch (error) {
        alert("Failed to vacate.");
    }
  };

  // 🛡️ SAFETY CHECK: Handle both variable names (CamelCase vs SnakeCase)
  const getRoomId = (student) => student.currentRoomId || student.current_room_id;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BedDouble className="text-blue-600"/> Room Allocation
        </h2>
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Select Hostel:</span>
            <select 
                className="bg-gray-50 border rounded-lg px-4 py-2 text-sm outline-none"
                value={selectedHostel || ''}
                onChange={(e) => setSelectedHostel(e.target.value)}
            >
                {hostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="p-5 rounded-xl border bg-white hover:shadow-md flex flex-col h-full">
            
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Room {room.roomNumber}</h3>
                    <p className="text-xs text-gray-500">Floor {room.floor}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${
                    room.currentOccupancy >= room.capacity ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                    {room.currentOccupancy}/{room.capacity}
                </div>
            </div>

            {/* 👇 THIS SECTION SHOWS THE STUDENTS INSIDE THE BOX 👇 */}
            <div className="flex-1 space-y-2 mb-4">
                {students
                    .filter(s => getRoomId(s) === room.id) // Use the Safety Check here
                    .map(student => (
                    <div key={student.id} className="flex justify-between items-center bg-blue-50 p-2 rounded border border-blue-100">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <User size={14} className="text-blue-500 shrink-0"/>
                            <span className="text-sm font-medium text-gray-700 truncate">{student.name}</span>
                        </div>
                        <button 
                            onClick={() => handleVacate(student.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove Student"
                        >
                            <XCircle size={16} />
                        </button>
                    </div>
                ))}
                
                {room.currentOccupancy === 0 && (
                    <div className="text-center py-4">
                        <p className="text-xs text-gray-400 italic">Empty Room</p>
                    </div>
                )}
            </div>

            <button 
                onClick={() => { setSelectedRoom(room); setAssignModalOpen(true); }}
                disabled={room.currentOccupancy >= room.capacity}
                className="w-full py-2 text-sm font-medium border border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 transition-all mt-auto"
            >
                + Add Student
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={isAssignModalOpen} onClose={() => setAssignModalOpen(false)} title={`Assign to Room ${selectedRoom?.roomNumber}`}>
        <form onSubmit={handleAssign} className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 mb-4">
                Assigning student to <strong>{selectedRoom?.roomNumber}</strong>.
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                <select 
                    required
                    className="w-full p-2 bg-gray-50 border rounded-lg"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                    <option value="">-- Choose --</option>
                    {/* Only show students with NO ROOM ID (checking both var names) */}
                    {students.filter(s => !getRoomId(s)).map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                    ))}
                </select>
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg">Confirm</button>
        </form>
      </Modal>
    </div>
  );
};

export default RoomAllocation;