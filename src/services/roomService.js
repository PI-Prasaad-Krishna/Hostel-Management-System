import api from '../api/axios';

// Get all rooms
export const getAllRooms = async () => {
  const response = await api.get('/rooms');
  return response.data;
};

// Get rooms by hostel
export const getRoomsByHostel = async (hostelId) => {
  const response = await api.get(`/rooms/hostel/${hostelId}`);
  return response.data;
};

// Assign a student to a room
export const assignRoom = async (roomId, studentId) => {
  // Matches Backend: @PostMapping("/{roomId}/assign/{studentId}")
  const response = await api.post(`/rooms/${roomId}/assign/${studentId}`);
  return response.data;
};

// 👇 THIS WAS LIKELY MISSING AND CAUSING THE CRASH
export const vacateRoom = async (studentId) => {
  // Matches Backend: @PostMapping("/vacate/{studentId}")
  const response = await api.post(`/rooms/vacate/${studentId}`);
  return response.data;
};