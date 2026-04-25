import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Calendar as CalendarIcon, CreditCard, Bell, Sparkles, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const Bills = () => {
  const subscriptions = [
    { name: "Google One Storage", date: "June 10", amount: 99.99, type: "Annual", icon: "https://api.dicebear.com/7.x/initials/svg?seed=G1" },
    { name: "Spotify Premium", date: "June 22", amount: 16.99, type: "Monthly", icon: "https://api.dicebear.com/7.x/initials/svg?seed=SP" },
    { name: "Netflix 4K", date: "June 05", amount: 18.00, type: "Monthly", icon: "https://api.dicebear.com/7.x/initials/svg?seed=NX" },
    { name: "Insurance Premium", date: "June 05", amount: 425.00, type: "Annual", icon: "https://api.dicebear.com/7.x/initials/svg?seed=IP" },
  ];

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <DashboardLayout title="Bills & Subscriptions">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🗓️ Left Column: Calendar View */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-black text-slate-900">June 2024</h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ChevronLeft size={20}/></button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ChevronRight size={20}/></button>
                </div>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-xl">
                 <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold text-blue-600">Month</button>
                 <button className="px-4 py-1.5 text-xs font-bold text-slate-400">List</button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-3xl overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-slate-50 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
              ))}
              {calendarDays.map(day => {
                const isBillDay = [5, 10, 22].includes(day);
                return (
                  <div key={day} className="bg-white h-24 p-3 relative hover:bg-blue-50/30 transition-colors cursor-pointer group">
                    <span className={`text-xs font-bold ${day === 12 ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
                      {day}
                    </span>
                    {isBillDay && (
                      <div className="mt-2 space-y-1">
                        <div className={`h-1.5 w-full rounded-full ${day === 5 ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                        <p className="text-[8px] font-black text-slate-500 truncate">Bill Due</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights & Dummy Actions */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col md:flex-row items-center gap-8">
             <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center backdrop-blur-md">
                <Sparkles size={40} className="text-blue-100" />
             </div>
             <div className="flex-1 text-center md:text-left">
                <h4 className="text-xl font-bold mb-2">Smart Cancellation Engine</h4>
                <p className="text-blue-100 text-sm leading-relaxed font-medium">
                  BudgetMate AI detected <span className="text-white font-black underline">2 subscriptions</span> you haven't used in 30 days.
                </p>
             </div>
             <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl text-xs font-black shadow-lg hover:scale-105 transition-all whitespace-nowrap">
                CANCEL UNUSED NOW
             </button>
          </div>
        </div>

        {/* 📋 Right Column: Subscription List */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h4 className="text-xl font-black text-slate-900">All Subscriptions</h4>
                <button className="text-blue-600 font-bold text-sm"><Plus size={20}/></button>
             </div>
             <div className="space-y-6">
                {subscriptions.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <img src={sub.icon} alt={sub.name} className="w-12 h-12 rounded-2xl shadow-sm border border-slate-50" />
                       <div>
                          <p className="font-bold text-slate-900 text-sm">{sub.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next: {sub.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-slate-900 text-sm">${sub.amount}</p>
                       <p className="text-[9px] font-bold text-slate-400">{sub.type}</p>
                    </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-10 py-4 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">
                View All 24 Subscriptions
             </button>
          </div>

          <div className="bg-[#0A1128] rounded-[2.5rem] p-10 text-white">
             <p className="text-blue-300 font-bold text-[10px] uppercase tracking-widest mb-2">Total Commitments</p>
             <h4 className="text-4xl font-black mb-6">$2,482.50</h4>
             <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                <Bell size={14} /> 2 bills overdue
             </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Bills;