import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BedDouble, Users, CalendarCheck, AlertCircle, Settings, LogOut, Bell, Search, Building } from 'lucide-react';

const SidebarItem = ({ icon: Icon, text, to, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}>
    <Icon size={20} />
    <span className="font-medium">{text}</span>
  </Link>
);

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return <Outlet />; // Render Login page if not authenticated

  // SAFETY CHECK: Normalize role to lowercase to handle "ADMIN", "Admin", or "admin"
  const isAdmin = user.role && user.role.toLowerCase() === 'admin';

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar - Dark Blue */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-wide">Hostel Management</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={LayoutDashboard} text="Dashboard" to="/" active={location.pathname === '/'} />
          
          {/* Admin Only Links - Now using safe 'isAdmin' check */}
          {isAdmin && (
            <>
              <SidebarItem icon={Users} text="Students" to="/students" active={location.pathname === '/students'} />
              <SidebarItem icon={BedDouble} text="Room Allocation" to="/rooms" active={location.pathname === '/rooms'} />
              <SidebarItem icon={Building} text="Hostel Config" to="/hostels" active={location.pathname === '/hostels'} />
            </>
          )}

          {/* Common Links */}
          <SidebarItem icon={CalendarCheck} text="Attendance" to="/attendance" active={location.pathname === '/attendance'} />
          <SidebarItem icon={AlertCircle} text="Complaints" to="/complaints" active={location.pathname === '/complaints'} />
          <SidebarItem icon={Settings} text="Settings" to="/settings" active={location.pathname === '/settings'} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full px-4 py-2">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 shadow-sm">
            <div className="relative w-96">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input type="text" placeholder="Search students, rooms..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="flex items-center gap-6">
                <button className="relative text-gray-500 hover:text-gray-700">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">{user.name}</span>
                        <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                    </div>
                </div>
            </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;