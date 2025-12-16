import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';

const RoomAllocation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock Data
  const rooms = [
    { id: 'A-101', type: 'Double', capacity: 2, occupied: 1, status: 'Available' },
    { id: 'A-102', type: 'Triple', capacity: 3, occupied: 3, status: 'Full' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Room Allocation</h2>
            <p className="text-gray-500">Manage room assignments</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Allocate Room
        </button>
      </div>

      {/* --- ALLOCATE ROOM MODAL --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Allocate Room">
         <form className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100">
                    <option value="">-- Search or Select Student --</option>
                    <option value="STU005">Vikram Singh (STU005)</option>
                    <option value="STU006">New Student (STU006)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Only students without rooms are listed here.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                    <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100">
                        <option>Block A</option>
                        <option>Block B</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Room</label>
                    <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100">
                        <option>A-101 (1 Bed Available)</option>
                        <option>A-103 (2 Beds Available)</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Confirm Allocation</button>
            </div>
         </form>
      </Modal>

      {/* Room Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">Room No.</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Type</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="p-4 text-gray-800 font-medium">{room.id}</td>
                <td className="p-4 text-gray-600">{room.type}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium 
                    ${room.status === 'Full' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {room.status}
                  </span>
                </td>
                <td className="p-4 text-blue-600 text-sm cursor-pointer hover:underline">Manage</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomAllocation;