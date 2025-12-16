import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, MapPin, Phone } from 'lucide-react';
import Modal from '../components/Modal';
import { getAllStudents, addStudent } from '../services/studentServices'; // Import the service

const StudentProfiles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]); // Store REAL data here

  // State to hold form data (Matches Java StudentRequest fields)
  const [formData, setFormData] = useState({
      name: '', 
      rollNo: '', 
      department: 'CSE', 
      year: '1st Year', 
      gender: 'Male', 
      contact: '', 
      guardianName: '', 
      guardianPhone: ''
  });

  // 1. Fetch Students when page loads
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  // 2. Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addStudent(formData); // Send data to Backend
      alert("Student Added Successfully!");
      
      setIsModalOpen(false); // Close Modal
      fetchStudents();       // Refresh Table
      
      // Reset Form
      setFormData({
        name: '', rollNo: '', department: 'CSE', year: '1st Year', 
        gender: 'Male', contact: '', guardianName: '', guardianPhone: ''
      });
    } catch (error) {
      alert("Failed to add student. Check console.");
      console.error(error);
    }
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
            onClick={() => setIsModalOpen(true)} 
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
                        <input 
                            required 
                            type="text" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                            placeholder="e.g. Rahul Sharma" 
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Register / Roll No</label>
                        <input 
                            required 
                            type="text" 
                            value={formData.rollNo} 
                            onChange={e => setFormData({...formData, rollNo: e.target.value})} 
                            placeholder="e.g. 2024CSE001" 
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select 
                                value={formData.gender} 
                                onChange={e => setFormData({...formData, gender: e.target.value})} 
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                            <input 
                                required 
                                type="tel" 
                                value={formData.contact} 
                                onChange={e => setFormData({...formData, contact: e.target.value})} 
                                placeholder="+91" 
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" 
                            />
                        </div>
                    </div>
                </div>

                {/* Academic & Guardian Info */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">Academic & Guardian</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select 
                                value={formData.department} 
                                onChange={e => setFormData({...formData, department: e.target.value})} 
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                <option>CSE</option>
                                <option>ECE</option>
                                <option>MECH</option>
                                <option>CIVIL</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <select 
                                value={formData.year} 
                                onChange={e => setFormData({...formData, year: e.target.value})} 
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                <option>1st Year</option>
                                <option>2nd Year</option>
                                <option>3rd Year</option>
                                <option>4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                        <input 
                            required 
                            type="text" 
                            value={formData.guardianName} 
                            onChange={e => setFormData({...formData, guardianName: e.target.value})} 
                            placeholder="Parent/Guardian Name" 
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone</label>
                        <input 
                            required 
                            type="tel" 
                            value={formData.guardianPhone} 
                            onChange={e => setFormData({...formData, guardianPhone: e.target.value})} 
                            placeholder="+91" 
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" 
                        />
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

      {/* STUDENT TABLE - Showing Real Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Roll No</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Dept</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Contact</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Guardian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.length > 0 ? (
                students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{student.name}</td>
                    <td className="p-4 text-gray-600">{student.rollNo}</td>
                    <td className="p-4 text-gray-600">{student.department}</td>
                    <td className="p-4 text-gray-600">
                        <div className="flex items-center gap-2">
                            <Phone size={14} />
                            {student.contact}
                        </div>
                    </td>
                    <td className="p-4 text-gray-600">{student.guardianName}</td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                        No students found. Click "Add Student" to create one.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentProfiles;