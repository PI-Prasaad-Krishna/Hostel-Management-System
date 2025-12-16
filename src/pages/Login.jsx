import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { UserCircle, Lock, Mail, Building2, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // 2. Initialize navigation hook
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ id: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(role);
    navigate('/'); // 3. Redirect to Dashboard immediately after login
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-center">
          <div className="mx-auto bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-lg rotate-3 hover:rotate-6 transition-transform">
            <Building2 className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Welcome Back</h2>
          <p className="text-blue-200 text-sm mt-2">Sign in to manage your hostel account</p>
        </div>

        {/* Role Toggle Switch */}
        <div className="p-8 pb-0">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                role === 'student' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserCircle size={18} />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                role === 'admin' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Lock size={18} />
              Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {role === 'student' ? 'Student ID' : 'Email Address'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                {role === 'student' ? <UserCircle size={20} /> : <Mail size={20} />}
              </div>
              <input
                type={role === 'student' ? "text" : "email"}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder={role === 'student' ? "e.g., STU001" : "admin@hostel.com"}
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-4"
          >
            Sign In as {role === 'student' ? 'Student' : 'Admin'}
            <ArrowRight size={18} />
          </button>
          
          <div className="text-center mt-4">
             <a href="#" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;