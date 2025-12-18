import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  MessageSquare, 
  Settings, 
  Users, 
  BedDouble, 
  Building, 
  LogOut,
  Home // Added Home icon just in case
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Define ALL possible links
  const allMenuItems = [
    // Everyone sees Dashboard (Points to "/" which is now smart)
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['admin', 'student'] },
    
    // Admin Only
    { icon: Users, label: 'Students', path: '/students', roles: ['admin'] },
    { icon: BedDouble, label: 'Room Allocation', path: '/rooms', roles: ['admin'] },
    { icon: Building, label: 'Hostel Mgmt', path: '/hostels', roles: ['admin'] },
    
    // Common
    { icon: CalendarCheck, label: 'Attendance', path: '/attendance', roles: ['admin', 'student'] },
    { icon: MessageSquare, label: 'Complaints', path: '/complaints', roles: ['admin', 'student'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['admin', 'student'] },
  ];

  // 2. Filter links based on the current user's role
  // We check if the item.roles array includes the current user's role
  const visibleMenuItems = allMenuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col fixed left-0 top-0">
      {/* Logo Area */}
      <div className="flex items-center gap-2 px-2 mb-8 mt-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">H</span>
        </div>
        <span className="text-xl font-bold text-gray-800">HostelAdmin</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          
          // ✅ Standard Matching: Since Dashboard is "/", it matches perfectly
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-100 pt-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;