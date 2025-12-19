import React, { useEffect, useState } from 'react';
import { Users, BedDouble, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import { getDashboardStats } from '../services/dashboardService';
import { getComplaints } from '../services/complaintService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRooms: 0,
    occupiedBeds: 0,
    vacantBeds: 0,
    occupancyRate: 0,
    pendingComplaints: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1️⃣ Load existing dashboard stats
        const data = await getDashboardStats();

        // 2️⃣ Load complaints
        const complaintsRes = await getComplaints();

        // 3️⃣ Count unresolved complaints
        const pending = complaintsRes.data.filter(
          c => c.status !== 'RESOLVED'
        ).length;

        // 4️⃣ Merge data
        setStats({
          ...data,
          pendingComplaints: pending
        });

      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
        <p className="text-gray-500 text-sm">
          Welcome back, Admin. Here is what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Students */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold bg-green-50 text-green-600 px-2 py-1 rounded-full">
              Live
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalStudents}</h3>
          <p className="text-gray-500 text-sm font-medium mt-1">Total Students</p>
        </div>

        {/* Occupancy */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <TrendingUp size={24} />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase font-semibold">Occupancy</p>
              <p className="text-2xl font-bold text-gray-800">{stats.occupancyRate}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${stats.occupancyRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {stats.occupiedBeds} occupied / {stats.vacantBeds} vacant
          </p>
        </div>

        {/* Rooms */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
              <BedDouble size={24} />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase font-semibold">Rooms</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalRooms}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            <span className="font-bold text-green-600">{stats.vacantBeds}</span> beds available
          </p>
        </div>

        {/* Complaints */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-lg bg-red-100 text-red-600">
              <AlertCircle size={24} />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase font-semibold">Issues</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.pendingComplaints}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Pending resolution</p>
        </div>

      </div>

      {/* System Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div>
          <h3 className="text-xl font-bold mb-1">Hostel Management System</h3>
          <p className="text-blue-100 text-sm">
            System is running smoothly. Last database backup was today.
          </p>
        </div>
        <div className="mt-4 md:mt-0 p-3 bg-white/10 rounded-lg border border-white/20">
          <div className="flex items-center gap-3">
            <Activity size={20} className="text-green-300 animate-pulse" />
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
