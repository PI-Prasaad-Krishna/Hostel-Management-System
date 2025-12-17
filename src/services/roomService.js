import api from '../api/axios';

// Get all rooms (or filter by hostel)
export const getRoomsByHostel = async (hostelId) => {
  const response = await api.get(`/rooms/hostel/${hostelId}`);
  return response.data;
};

// Assign a student to a room
export const assignRoom = async (studentId, roomId) => {
  const payload = {
    student: { id: studentId },
    room: { id: roomId }
  };
  const response = await api.post('/room-assignments', payload);
  return response.data;
};

// Release a student from a room (Optional for later)
export const releaseRoom = async (assignmentId) => {
  const response = await api.put(`/room-assignments/${assignmentId}/release`);
  return response.data;
};