import React, { useState, useEffect } from 'react';
import { Plus, Building, Trash2, Home, User } from 'lucide-react';
import Modal from '../components/Modal';
import { getAllHostels, addHostel, deleteHostel } from '../services/hostelService';

const HostelManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hostels, setHostels] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Mens',
    address: '',
    wardenName: '',
    totalFloors: 3,
    roomsPerFloor: 10
  });

  // 1. Fetch Hostels on Load
  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const data = await getAllHostels();
      setHostels(data);
    } catch (error) {
      console.error("Failed to load hostels", error);
    }
  };

  // 2. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addHostel(formData);
      alert("Hostel Added Successfully!");
      setIsModalOpen(false);
      fetchHostels(); // Refresh List
      // Reset Form
      setFormData({ name: '', type: 'Mens', address: '', wardenName: '', totalFloors: 3, roomsPerFloor: 10 });
    } catch (error) {
      alert("Failed to add hostel.");
      console.error(error);
    }
  };

  // 3. Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hostel?")) {
      try {
        await deleteHostel(id);
        fetchHostels();
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hostel Configuration</h2>
          <p className="text-gray-500 text-sm">Manage buildings, capacity, and wardens</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> Add Hostel
        </button>
      </div>

      {/* HOSTEL GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostels.map((hostel) => (
          <div key={hostel.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <Building size={24} />
              </div>
              <button onClick={() => handleDelete(hostel.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-1">{hostel.name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${hostel.type === 'Mens' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
            <span className={`text-xs px-2 py-1 rounded-full ${hostel.type === 'Mens' ? 'bg-blue-100 text-blue-700' :hostel.type === 'Ladies' ? 'bg-pink-100 text-pink-700' :'bg-purple-100 text-purple-700' // Purple for Mixed/Other
            }`}></span>
              {hostel.type} Hostel
            </span>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Home size={16} />
                <span>Capacity: <strong>{hostel.capacity} Beds</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>Warden: {hostel.wardenName || 'Not Assigned'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD HOSTEL MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Hostel">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Block A" className="w-full px-4 py-2 bg-gray-50 border rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border rounded-lg">
                        <option>Mens</option>
                        <option>Ladies</option>
                        <option>Mixed</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warden Name</label>
                    <input required type="text" value={formData.wardenName} onChange={e => setFormData({...formData, wardenName: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border rounded-lg" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
                <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Floors</label>
                    <input 
                        required 
                        type="number" 
                        min="1" 
                        value={formData.totalFloors} 
                        onChange={e => {
                            const val = parseInt(e.target.value);
                            setFormData({...formData, totalFloors: isNaN(val) ? '' : val});
                        }} 
                        className="w-full px-4 py-2 bg-white border rounded-lg" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">Rooms per Floor</label>
                    <input 
                        required 
                        type="number" 
                        min="1" 
                        value={formData.roomsPerFloor} 
                        onChange={e => {
                            const val = parseInt(e.target.value);
                            setFormData({...formData, roomsPerFloor: isNaN(val) ? '' : val});
                        }} 
                        className="w-full px-4 py-2 bg-white border rounded-lg" 
                    />
                </div>
                <div className="col-span-2 text-xs text-blue-600 text-center font-medium">
                    {/* SAFETY CHECK: Use || 0 to prevent NaN from showing up here */}
                    Total Estimated Capacity: {(formData.totalFloors || 0) * (formData.roomsPerFloor || 0) * 2} Beds
                </div>
            </div>

            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Create Hostel</button>
        </form>
      </Modal>
    </div>
  );
};

export default HostelManagement;