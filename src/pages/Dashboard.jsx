import React from 'react';
import { Users, AlertCircle, BedDouble, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="text-3xl font-bold text-gray-800 mt-2">{value}</div>
      <p className="text-sm text-gray-400 mt-1">{subtext}</p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="text-white" size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="425" subtext="Boys: 245 | Girls: 180" icon={Users} color="bg-blue-500" />
        <StatCard title="Room Occupancy" value="85%" subtext="150 Occupied / 50 Vacant" icon={BedDouble} color="bg-indigo-500" />
        <StatCard title="Today's Attendance" value="94%" subtext="25 Absent Today" icon={CheckCircle} color="bg-emerald-500" />
        <StatCard title="Pending Complaints" value="12" subtext="3 High Priority" icon={AlertCircle} color="bg-red-500" />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Hostel Activity</h3>
        <div className="space-y-4">
             {/* Mock List */}
            {[1,2,3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                             <img src={`https://i.pravatar.cc/150?img=${i+10}`} alt="Student" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">Student Room Request</p>
                            <p className="text-xs text-gray-500">Rahul Sharma requested a room change.</p>
                        </div>
                    </div>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;