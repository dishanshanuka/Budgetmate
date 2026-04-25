import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import { 
  Home,
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  Settings, 
  LogOut, 
  PieChart, 
  CalendarDays
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation(); 

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Wallet, label: 'My Wallet', path: '/my-wallet' }, 
    { icon: TrendingUp, label: 'Investments', path: '/investments' },
    { icon: CreditCard, label: 'Expenses', path: '/expenses' },
    { icon: PieChart, label: 'Analytics', path: '/analytics' },
    { icon: CalendarDays, label: 'Bills', path: '/bills' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-50">
      {/* Logo Section */}
      <div className="p-8">
        <Link to="/dashboard" className="text-xl font-black tracking-tighter text-slate-900">
          Budget<span className="text-blue-600">Mate</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions (Settings & Logout) */}
      <div className="p-6 border-t border-slate-50 space-y-2">
        {/* Settings Link with Active State */}
        <Link 
          to="/settings" 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            location.pathname === '/settings' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Settings size={18} /> Settings
        </Link>

        {/* Log Out Button */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all cursor-pointer">
          <LogOut size={18} /> Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;