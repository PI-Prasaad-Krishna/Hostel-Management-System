import api from '../api/axios';

// Get all students
export const getAllStudents = async () => {
  const response = await api.get('/students');
  return response.data;
};

// Add a new student
export const addStudent = async (studentData) => {
  const response = await api.post('/students', studentData);
  return response.data;
};