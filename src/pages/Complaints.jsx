import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Filter, Search } from 'lucide-react';

import NewComplaintModal from '../components/NewComplaintModal';
import {
  getComplaints,
  createComplaint,
  resolveComplaint
} from '../services/complaintService';

const Complaints = () => {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load complaints on page load
  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await getComplaints();
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to load complaints', err);
    } finally {
      setLoading(false);
    }
  };

  // Helpers for UI
  const getPriorityColor = (p) => {
    switch (p) {
      case 'High':
        return 'bg-red-100 text-red-600';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'RESOLVED':
        return 'bg-green-100 text-green-600';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Complaints</h2>
          <p className="text-sm text-gray-500">
            Track and resolve hostel issues
          </p>
        </div>

        {user?.role === 'student' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={18} /> New Complaint
          </button>
        )}
      </div>

      {/* Filter Bar (UI only for now) */}
      <div className="flex gap-4 bg-white p-4 rounded border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search complaints..."
            className="w-full pl-9 pr-3 py-2 border rounded"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-sm">ID</th>
              <th className="p-3 text-sm">Title</th>
              <th className="p-3 text-sm">Priority</th>
              <th className="p-3 text-sm">Status</th>
              <th className="p-3 text-sm">Created</th>
              {user?.role === 'admin' && (
                <th className="p-3 text-sm">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && complaints.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No complaints found
                </td>
              </tr>
            )}

            {complaints.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3 text-sm">{item.id}</td>
                <td className="p-3 text-sm">{item.title}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getPriorityColor(
                      item.priority || 'Low'
                    )}`}
                  >
                    {item.priority || 'Low'}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : '-'}
                </td>

                {user?.role === 'admin' && (
                  <td className="p-3">
                    {item.status !== 'RESOLVED' && (
                      <button
                        onClick={async () => {
                          await resolveComplaint(item.id);
                          loadComplaints();
                        }}
                        className="text-blue-600 text-sm"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <NewComplaintModal
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={async (data) => {
    try {
      const payload = {
        title: data.issue,
        description: data.issue,
        priority: data.priority,
        student: {
          rollNo: user.username   // <-- THIS WAS MISSING
        }
      };

      console.log("FINAL PAYLOAD SENT TO BACKEND:", payload);

      await createComplaint(payload);

      setIsModalOpen(false);
      loadComplaints();
    } catch (err) {
      console.error("API ERROR:", err);
      alert("Complaint submission failed");
    }
  }}
/>

    </div>
  );
};

export default Complaints;
