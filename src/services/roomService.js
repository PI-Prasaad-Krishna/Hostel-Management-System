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

export const vacateRoom = async (studentId) => {
  // Matches Backend: @PostMapping("/vacate/{studentId}")
  const response = await api.post(`/rooms/vacate/${studentId}`);
  return response.data;
};

export const getRoomDetails = async (roomId) => {
  try {
    // Assuming you have an endpoint like /api/rooms/{id}
    // If not, we might need to fetch all rooms and find it, or update the student API to return full room info.
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch room details", error);
    return null;
  }
};