import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  MessageSquare, 
  Settings, 
  Users,       // Icon for Students
  BedDouble,   // Icon for Rooms
  Building,    // Icon for Hostels
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth(); // Get user to check role if needed
  const navigate = useNavigate();
  const location = useLocation();

  // Define all menu items
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    
    // Admin Only Links
    { icon: Users, label: 'Students', path: '/students' },
    { icon: BedDouble, label: 'Room Allocation', path: '/rooms' },
    { icon: Building, label: 'Hostel Management', path: '/hostels' },
    
    // Common Links
    { icon: CalendarCheck, label: 'Attendance', path: '/attendance' },
    { icon: MessageSquare, label: 'Complaints', path: '/complaints' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

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
        {menuItems.map((item) => {
          const Icon = item.icon;
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