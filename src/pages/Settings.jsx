import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Shield, Save, Building } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-500">Manage your profile and preferences</p>
      </div>

      {/* Profile Settings Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User size={20} />
            </div>
            <h3 className="font-semibold text-gray-800">Profile Information</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input type="text" defaultValue={user.name} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" defaultValue={user.email} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input type="text" defaultValue="+91 98765 43210" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                <input type="text" defaultValue="A-101" disabled className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
            </div>
        </div>
        <div className="p-4 bg-gray-50 text-right">
            <button className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">Save Changes</button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Bell size={20} />
            </div>
            <h3 className="font-semibold text-gray-800">Notifications</h3>
        </div>
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-700">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive emails about room allocation and complaints.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
            <hr className="border-gray-100" />
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-gray-700">SMS Alerts</p>
                    <p className="text-sm text-gray-500">Get text messages for emergency alerts.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
        </div>
      </div>

      {/* Admin Only: Hostel Configuration */}
      {user.role === 'admin' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <Building size={20} />
                </div>
                <h3 className="font-semibold text-gray-800">Hostel Configuration (Admin)</h3>
            </div>
            <div className="p-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Name</label>
                    <input type="text" defaultValue="University Boys Hostel" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg" />
                </div>
                <button className="text-blue-600 font-medium text-sm hover:underline">Manage Blocks & Wings</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Settings;