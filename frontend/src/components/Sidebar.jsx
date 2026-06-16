import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
import { 
  Home,
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  Settings, 
  LogOut, 
  PieChart, 
  CalendarDays,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation(); 
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  }; 

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
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between">
          <Link to="/dashboard" className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
            Budget<span className="text-blue-600">Mate</span>
          </Link>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                onClick={onClose}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions (Settings & Logout) */}
        <div className="p-6 border-t border-slate-50 dark:border-slate-800 space-y-2">
          {/* Settings Link with Active State */}
          <Link 
            to="/settings" 
            onClick={onClose}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              location.pathname === '/settings' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Settings size={18} /> Settings
          </Link>

          {/* Log Out Button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
          >
            <LogOut size={18} /> Log out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;