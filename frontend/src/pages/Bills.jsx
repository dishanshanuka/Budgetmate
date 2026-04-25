import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { CalendarDays, Bell, Sparkles, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const Bills = () => {
  const subscriptions = [
    { 
      name: "Google One", 
      date: "June 10", 
      amount: 99.99, 
      type: "Annual", 
      icon: "https://img.icons8.com/color/48/google-logo.png",
      bgColor: "bg-slate-50"
    },
    { 
      name: "Spotify Premium", 
      date: "June 22", 
      amount: 16.99, 
      type: "Monthly", 
      icon: "https://img.icons8.com/color/48/spotify--v1.png",
      bgColor: "bg-[#1ED760]/10"
    },
    { 
      name: "Netflix 4K", 
      date: "June 05", 
      amount: 18.00, 
      type: "Monthly", 
      icon: "https://img.icons8.com/color/48/netflix.png",
      bgColor: "bg-red-50"
    },
    { 
      name: "Insurance Premium", 
      date: "June 05", 
      amount: 425.00, 
      type: "Annual", 
      icon: "https://img.icons8.com/fluency/48/shield.png",
      bgColor: "bg-blue-50"
    },
  ];

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <DashboardLayout title="Bills & Subscriptions">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/*  Left Column: Custom Calendar View */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-black text-slate-900">June 2024</h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"><ChevronLeft size={20}/></button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"><ChevronRight size={20}/></button>
                </div>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                 <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-bold text-blue-600">Month View</button>
                 <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">List View</button>
              </div>
            </div>

            {/*  Grid Calendar */}
            <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-[2rem] overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-slate-50 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{day}</div>
              ))}
              {calendarDays.map(day => {
                const isBillDay = [5, 10, 22].includes(day);
                const isToday = day === 12;

                return (
                  <div key={day} className="bg-white h-24 p-3 relative hover:bg-blue-50/30 transition-all cursor-pointer group border-[0.5px] border-slate-50">
                    <span className={`text-xs font-bold ${isToday ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-lg shadow-blue-100' : 'text-slate-400'}`}>
                      {day}
                    </span>
                    {isBillDay && (
                      <div className="mt-3 space-y-1.5">
                        <div className={`h-1.5 w-full rounded-full ${day === 5 ? 'bg-red-500' : 'bg-blue-500'} shadow-sm`}></div>
                        <p className="text-[9px] font-black text-slate-600 truncate uppercase">Bill Due</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/*  AI Smart Cancellation Card */}
          <div className="bg-gradient-to-br from-[#0A1128] to-blue-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Sparkles size={150} />
             </div>
             <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner">
                   <Sparkles size={36} className="text-blue-300 animate-pulse" />
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h4 className="text-2xl font-black mb-3 tracking-tight">Smart Cancellation Engine</h4>
                   <p className="text-blue-200/80 text-sm leading-relaxed font-medium">
                     Our AI analyzed your activity and detected <span className="text-white font-black underline decoration-blue-400">2 subscriptions</span> you haven't used in the last 30 days.
                   </p>
                </div>
                <button className="px-8 py-5 bg-blue-500 hover:bg-blue-400 text-white rounded-[1.5rem] text-xs font-black shadow-xl shadow-blue-900/50 transition-all hover:-translate-y-1 active:scale-95 whitespace-nowrap tracking-widest uppercase">
                   Optimize Subscriptions
                </button>
             </div>
          </div>
        </div>

        {/*  Right Column: Detailed List */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-10">
                <h4 className="text-xl font-black text-slate-900 tracking-tight">Subscriptions</h4>
                <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                  <Plus size={20}/>
                </button>
             </div>
             
             <div className="space-y-7">
                {subscriptions.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className={`w-14 h-14 ${sub.bgColor} rounded-2xl flex items-center justify-center border border-slate-50 shadow-sm group-hover:scale-105 transition-transform`}>
                          <img src={sub.icon} alt={sub.name} className="w-8 h-8 object-contain" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900 text-[15px] group-hover:text-blue-600 transition-colors">{sub.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Next: {sub.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-slate-900">${sub.amount}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{sub.type}</p>
                    </div>
                  </div>
                ))}
             </div>
             
             <button className="w-full mt-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-slate-100 transition-all">
                Manage All (24)
             </button>
          </div>

          {/*  Total Summary Card */}
          <div className="bg-[#0A1128] rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">Monthly Commitments</p>
                <h4 className="text-4xl font-black mb-8 tracking-tighter">$2,482.50</h4>
                <div className="flex items-center gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                   <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                   <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">2 bills overdue</span>
                </div>
             </div>
             <CalendarDays size={120} className="absolute bottom-[-30px] right-[-30px] text-white/5 rotate-12" />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Bills;