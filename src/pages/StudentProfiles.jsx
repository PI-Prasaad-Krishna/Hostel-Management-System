import React, { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, MapPin, Phone } from 'lucide-react';
import Modal from '../components/Modal'; // Import the new Modal

const StudentProfiles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Data
  const [students] = useState([
    { id: 'STU001', name: 'Rahul Sharma', email: 'rahul.s@example.com', room: 'A-101', block: 'Block A', phone: '+91 98765 43210', status: 'Active' },
    { id: 'STU002', name: 'Priya Patel', email: 'priya.p@example.com', room: 'A-102', block: 'Block A', phone: '+91 98765 43211', status: 'Active' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your API call logic here
    console.log("Form Submitted");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Profiles</h2>
          <p className="text-gray-500 text-sm">View and manage student information</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)} // Open Modal
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> Add Student
        </button>
      </div>

      {/* --- ADD STUDENT MODAL --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Student">
        <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Personal Details</h4>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input required type="text" placeholder="e.g. Rahul Sharma" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Register / Roll No</label>
                        <input required type="text" placeholder="e.g. 2024CSE001" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                            <input required type="tel" placeholder="+91" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>
                    </div>
                </div>

                {/* Academic & Guardian Info */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Academic & Guardian</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100">
                                <option>CSE</option>
                                <option>ECE</option>
                                <option>MECH</option>
                                <option>CIVIL</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100">
                                <option>1st Year</option>
                                <option>2nd Year</option>
                                <option>3rd Year</option>
                                <option>4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                        <input required type="text" placeholder="Parent/Guardian Name" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone</label>
                        <input required type="tel" placeholder="+91" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Save Student</button>
            </div>
        </form>
      </Modal>

      {/* Existing Table Code (Kept Short for Brevity - Use your previous table code here) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         {/* ... (Your previous Table Code goes here) ... */}
         <div className="p-8 text-center text-gray-500">Student Table (Same as before)</div>
      </div>
    </div>
  );
};

export default StudentProfiles;