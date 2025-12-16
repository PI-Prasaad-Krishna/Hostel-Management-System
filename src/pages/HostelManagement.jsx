import React, { useState } from 'react';
import { Building, Plus, Home, Trash2, MapPin, Users } from 'lucide-react';
import Modal from '../components/Modal';

const HostelManagement = () => {
  const [activeTab, setActiveTab] = useState('hostels'); // 'hostels' or 'rooms'
  const [isHostelModalOpen, setIsHostelModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  // --- MOCK DATA ---
  const [hostels, setHostels] = useState([
    { id: 1, name: 'Main Boys Hostel', code: 'BH-01', type: 'Male', capacity: 200, address: 'North Campus, Block A' },
    { id: 2, name: 'Main Girls Hostel', code: 'GH-01', type: 'Female', capacity: 150, address: 'South Campus, Block B' },
  ]);

  const [rooms, setRooms] = useState([
    { id: 101, hostelId: 1, number: '101', floor: '1st', type: 'Double', capacity: 2 },
    { id: 102, hostelId: 1, number: '102', floor: '1st', type: 'Triple', capacity: 3 },
  ]);

  // --- FORM STATES ---
  const [newHostel, setNewHostel] = useState({ name: '', code: '', type: 'Male', capacity: '', address: '' });
  const [newRoom, setNewRoom] = useState({ hostelId: '', number: '', floor: '', type: 'Single' });

  // --- HANDLERS ---
  const handleAddHostel = (e) => {
    e.preventDefault();
    const hostel = { ...newHostel, id: Date.now() };
    setHostels([...hostels, hostel]);
    setIsHostelModalOpen(false);
    // Reset form
    setNewHostel({ name: '', code: '', type: 'Male', capacity: '', address: '' });
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    const room = { ...newRoom, id: Date.now() };
    setRooms([...rooms, room]);
    setIsRoomModalOpen(false);
    setNewRoom({ hostelId: '', number: '', floor: '', type: 'Single' });
  };

  // Helper to get hostel name by ID
  const getHostelName = (id) => hostels.find(h => h.id === parseInt(id))?.name || 'Unknown';
  
  // Helper to get hostel gender by ID (for display logic)
  const getHostelType = (id) => hostels.find(h => h.id === parseInt(id))?.type || '-';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hostel Configuration</h2>
          <p className="text-gray-500 text-sm">Manage hostel buildings and room inventory</p>
        </div>
        <div className="flex gap-2">
            {activeTab === 'hostels' ? (
                <button onClick={() => setIsHostelModalOpen(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition">
                    <Building size={18} /> Add Hostel
                </button>
            ) : (
                <button onClick={() => setIsRoomModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                    <Home size={18} /> Add Room
                </button>
            )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
            <button 
                onClick={() => setActiveTab('hostels')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'hostels' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                Hostels List
            </button>
            <button 
                onClick={() => setActiveTab('rooms')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'rooms' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                Rooms Registry
            </button>
        </nav>
      </div>

      {/* --- CONTENT AREA --- */}
      {activeTab === 'hostels' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map(hostel => (
                <div key={hostel.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg ${hostel.type === 'Male' ? 'bg-blue-50 text-blue-600' : hostel.type === 'Female' ? 'bg-pink-50 text-pink-600' : 'bg-purple-50 text-purple-600'}`}>
                            <Building size={24} />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">{hostel.code}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">{hostel.name}</h3>
                    <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={16} /> {hostel.address}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Users size={16} /> Capacity: {hostel.capacity}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                             <span className={`w-2 h-2 rounded-full ${hostel.type === 'Male' ? 'bg-blue-500' : hostel.type === 'Female' ? 'bg-pink-500' : 'bg-purple-500'}`}></span>
                             {hostel.type} Only
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-gray-600">Room No</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Hostel Name</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Floor</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Type</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Allowed Gender</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {rooms.map(room => (
                        <tr key={room.id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-800">{room.number}</td>
                            <td className="p-4 text-gray-600">{getHostelName(room.hostelId)}</td>
                            <td className="p-4 text-gray-600">{room.floor}</td>
                            <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{room.type}</span></td>
                            <td className="p-4 text-sm text-gray-500">{getHostelType(room.hostelId)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {/* --- MODAL: ADD HOSTEL --- */}
      <Modal isOpen={isHostelModalOpen} onClose={() => setIsHostelModalOpen(false)} title="Add New Hostel">
        <form onSubmit={handleAddHostel} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
                <input required type="text" value={newHostel.name} onChange={e => setNewHostel({...newHostel, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Kaveri Hostel" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Code</label>
                    <input required type="text" value={newHostel.code} onChange={e => setNewHostel({...newHostel, code: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. KH-01" />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Total Capacity</label>
                    <input required type="number" value={newHostel.capacity} onChange={e => setNewHostel({...newHostel, capacity: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. 500" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={newHostel.type} onChange={e => setNewHostel({...newHostel, type: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                        <option value="Male">Male Only</option>
                        <option value="Female">Female Only</option>
                        <option value="Mixed">Mixed Gender</option>
                    </select>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address / Location</label>
                <textarea rows="2" value={newHostel.address} onChange={e => setNewHostel({...newHostel, address: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Near North Gate..." />
            </div>
            <button type="submit" className="w-full py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 mt-4">Save Hostel</button>
        </form>
      </Modal>

      {/* --- MODAL: ADD ROOM --- */}
      <Modal isOpen={isRoomModalOpen} onClose={() => setIsRoomModalOpen(false)} title="Add New Room">
        <form onSubmit={handleAddRoom} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Hostel</label>
                <select required value={newRoom.hostelId} onChange={e => setNewRoom({...newRoom, hostelId: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                    <option value="">-- Select Hostel --</option>
                    {hostels.map(h => (
                        <option key={h.id} value={h.id}>{h.name} ({h.type})</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                    <input required type="text" value={newRoom.number} onChange={e => setNewRoom({...newRoom, number: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. 101" />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number</label>
                    <input required type="text" value={newRoom.floor} onChange={e => setNewRoom({...newRoom, floor: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. 1st Floor" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                    <option value="Single">Single Bed</option>
                    <option value="Double">Double Bed</option>
                    <option value="Triple">Triple Bed</option>
                    <option value="Dormitory">Dormitory</option>
                </select>
            </div>
            
            {/* Read Only Gender Display */}
            {newRoom.hostelId && (
                <div className="p-3 bg-gray-50 rounded border text-sm text-gray-600">
                    This room will be assigned to <strong>{getHostelType(newRoom.hostelId)}</strong> students based on the selected hostel.
                </div>
            )}

            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4">Save Room</button>
        </form>
      </Modal>

    </div>
  );
};

export default HostelManagement;