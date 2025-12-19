import api from '../api/axios';

export const getComplaints = () =>
  api.get('/complaints');

export const createComplaint = (data) =>
  api.post('/complaints', data);

export const resolveComplaint = (id) =>
  api.put(`/complaints/${id}/resolve`);
