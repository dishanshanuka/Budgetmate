import React from 'react';
import Sidebar from '../components/Sidebar';
import { Bell, Search, CircleHelp } from 'lucide-react';

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFF] font-sans">
      {/*  Left Sidebar */}
      <Sidebar />

      {/*  Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Navbar */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions, bills, or reports..." 
              className="w-full bg-slate-100/50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex items-center gap-6 text-slate-500">
            <button className="hover:text-blue-600 transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="hover:text-blue-600 transition-colors"><CircleHelp size={20} /></button>
            <div className="h-10 w-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dishan" alt="User" />
            </div>
          </div>
        </header>

        {/*  Page Content */}
        <main className="p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;