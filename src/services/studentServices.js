// 1. Restore your original import
import api from '../api/axios';

// Get all students (Restored to original)
export const getAllStudents = async () => {
  const response = await api.get('/students');
  return response.data;
};

// Add a new student (Restored to original)
export const addStudent = async (studentData) => {
  const response = await api.post('/students', studentData);
  return response.data;
};

// 👇 ONLY Add this new function at the bottom
// Update student details
export const updateStudent = async (id, updatedData) => {
  // Uses the same 'api' instance so headers/auth work correctly
  const response = await api.put(`/students/${id}`, updatedData);
  return response.data;
};