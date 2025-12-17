import api from '../api/axios';

// Get all hostels
export const getAllHostels = async () => {
  const response = await api.get('/hostels');
  return response.data;
};

// Add a new hostel
export const addHostel = async (hostelData) => {
  const response = await api.post('/hostels', hostelData);
  return response.data;
};

// Delete a hostel
export const deleteHostel = async (id) => {
  const response = await api.delete(`/hostels/${id}`);
  return response.data;
};