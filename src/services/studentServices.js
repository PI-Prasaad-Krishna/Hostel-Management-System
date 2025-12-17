import api from '../api/axios';

export const getAllStudents = async () => {
  try {
    const response = await api.get('/students');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const addStudent = async (student) => {
  const response = await api.post('/students', student);
  return response.data;
};

export const updateStudent = async (id, updatedData) => {
  const response = await api.put(`/students/${id}`, updatedData);
  return response.data;
};

// 👇 THIS WAS LIKELY MISSING AND CAUSING THE CRASH
export const deleteStudent = async (id) => {
  const response = await api.delete(`/students/${id}`);
  return response.data;
};