import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { getComplaints, resolveComplaint } from '../services/complaintService';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getComplaints();
      setComplaints(res.data);
      setFilteredComplaints(res.data);
    } catch (err) {
      console.error('Failed to load complaints', err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- FILTER FUNCTIONS ----------

  const filterByPriority = (priority) => {
    const result = complaints.filter(c => c.priority === priority);
    setFilteredComplaints(result);
    setShowFilter(false);
  };

  const sortLatest = () => {
    const result = [...complaints].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setFilteredComplaints(result);
    setShowFilter(false);
  };

  const sortOldest = () => {
    const result = [...complaints].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    setFilteredComplaints(result);
    setShowFilter(false);
  };

  const resetFilter = () => {
    setFilteredComplaints(complaints);
    setShowFilter(false);
  };

  // ---------- RESOLVE ----------

  const handleResolve = async (id) => {
    try {
      await resolveComplaint(id);
      fetchComplaints();
    } catch (err) {
      console.error('Failed to resolve complaint', err);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading complaints...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Complaints</h2>
        <p className="text-sm text-gray-500">Track and resolve hostel issues</p>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-4 relative">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            placeholder="Search complaints..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilter(prev => !prev)}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50"
        >
          <Filter size={18} />
          Filter
        </button>

        {/* Filter Dropdown */}
        {showFilter && (
          <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg w-48 z-50">
            <button
              onClick={() => filterByPriority('High')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Priority: High
            </button>
            <button
              onClick={() => filterByPriority('Medium')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Priority: Medium
            </button>
            <button
              onClick={() => filterByPriority('Low')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Priority: Low
            </button>

            <hr />

            <button
              onClick={sortLatest}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Latest First
            </button>
            <button
              onClick={sortOldest}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Oldest First
            </button>

            <hr />

            <button
              onClick={resetFilter}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-4">{c.id}</td>
                <td className="p-4">{c.title}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
                      ${c.priority === 'High' && 'bg-red-100 text-red-600'}
                      ${c.priority === 'Medium' && 'bg-yellow-100 text-yellow-600'}
                      ${c.priority === 'Low' && 'bg-green-100 text-green-600'}
                    `}
                  >
                    {c.priority}
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-600">
                    {c.status}
                  </span>
                </td>
                <td className="p-4">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {c.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleResolve(c.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Complaints;
