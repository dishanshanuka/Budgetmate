import React, { useState, useMemo } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { CalendarDays, Bell, Sparkles, Plus, ChevronLeft, ChevronRight, List } from 'lucide-react';

const Bills = () => {
  const [selectedDate, setSelectedDate] = useState(12);
  const [viewMode, setViewMode] = useState('month');
  
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [currentMonthIndex, setCurrentMonthIndex] = useState(5);
  const [currentYear, setCurrentYear] = useState(2024);

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonthIndex(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonthIndex(prev => prev + 1);
    }
  };

  const subscriptions = [
    { name: "Google One", day: 10, amount: 99.99, type: "Annual", icon: "https://img.icons8.com/color/48/google-logo.png", bgColor: "bg-slate-50" },
    { name: "Spotify Premium", day: 22, amount: 16.99, type: "Monthly", icon: "https://img.icons8.com/color/48/spotify--v1.png", bgColor: "bg-[#1ED760]/10" },
    { name: "Netflix 4K", day: 5, amount: 18.00, type: "Monthly", icon: "https://img.icons8.com/color/48/netflix.png", bgColor: "bg-red-50" },
    { name: "Insurance Premium", day: 5, amount: 425.00, type: "Annual", icon: "https://img.icons8.com/fluency/48/shield.png", bgColor: "bg-blue-50" },
  ];

  const totalMonthly = useMemo(() => {
    return subscriptions
      .filter(sub => sub.type === "Monthly")
      .reduce((acc, curr) => acc + curr.amount, 0)
      .toFixed(2);
  }, [subscriptions]);

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <DashboardLayout title="Bills & Subscriptions">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/*  Left Side: Calendar / List View Container */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            
            {/*  Header with Navigation & Switcher */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-black text-slate-900 min-w-[180px]">
                  {months[currentMonthIndex]} {currentYear}
                </h3>
                <div className="flex gap-2">
                  <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 active:scale-90 transition-all">
                    <ChevronLeft size={20}/>
                  </button>
                  <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 active:scale-90 transition-all">
                    <ChevronRight size={20}/>
                  </button>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                 <button 
                   onClick={() => setViewMode('month')}
                   className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'month' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                 >Month</button>
                 <button 
                   onClick={() => setViewMode('list')}
                   className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                 >List</button>
              </div>
            </div>

            {viewMode === 'month' ? (
              <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-[2rem] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-slate-50 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                ))}
                {calendarDays.map(day => {
                  const hasBill = subscriptions.some(s => s.day === day);
                  return (
                    <div 
                      key={day} 
                      onClick={() => setSelectedDate(day)}
                      className={`bg-white h-24 p-3 relative hover:bg-blue-50/30 transition-all cursor-pointer ${selectedDate === day ? 'bg-blue-50/40' : ''}`}
                    >
                      <span className={`text-xs font-bold ${selectedDate === day ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-lg' : 'text-slate-400'}`}>
                        {day}
                      </span>
                      {hasBill && (
                        <div className="mt-3 h-1.5 w-full bg-blue-500 rounded-full shadow-sm animate-pulse"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                {subscriptions.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${sub.bgColor} rounded-2xl flex items-center justify-center`}>
                        <img src={sub.icon} className="w-7 h-7 object-contain" alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{sub.name}</p>
                        <p className="text-xs text-slate-400 font-medium tracking-tight">Due on {months[currentMonthIndex]} {sub.day}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg text-slate-900">${sub.amount}</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase">{sub.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Card */}
          <div className="bg-[#0A1128] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000"><Sparkles size={150} /></div>
             <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-xl border border-white/20"><Sparkles size={36} className="text-blue-300 animate-bounce" /></div>
                <div className="flex-1 text-center md:text-left">
                   <h4 className="text-2xl font-black mb-2">Smart Cancellation</h4>
                   <p className="text-blue-200/80 text-sm">Save more in <b>{months[currentMonthIndex]}</b> by removing unused subscriptions.</p>
                </div>
                <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black shadow-lg active:scale-95 transition-all uppercase tracking-widest">Optimize</button>
             </div>
          </div>
        </div>

        {/*  Right Side: Summary & Details */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-10">
                <h4 className="text-xl font-black text-slate-900">Active Subs</h4>
                <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Plus size={20}/></button>
             </div>
             
             <div className="space-y-7">
                {subscriptions.map((sub, i) => (
                  <div key={i} className={`flex items-center justify-between group cursor-pointer p-1 rounded-2xl transition-all ${selectedDate === sub.day ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex items-center gap-4">
                       <div className={`w-14 h-14 ${sub.bgColor} rounded-2xl flex items-center justify-center border border-slate-50 shadow-sm transition-transform group-hover:scale-110`}>
                          <img src={sub.icon} alt={sub.name} className="w-8 h-8 object-contain" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900 text-[15px]">{sub.name}</p>
                          <p className={`text-[10px] font-black uppercase mt-0.5 ${selectedDate === sub.day ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`}>
                             {selectedDate === sub.day ? "Due Today" : `Day ${sub.day}`}
                          </p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-slate-900">${sub.amount}</p>
                    </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all">Manage Billing</button>
          </div>

          {/*  Summary Total Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-blue-100 font-bold text-[10px] uppercase tracking-widest mb-3">Monthly Commitments</p>
                <h4 className="text-4xl font-black mb-8">${totalMonthly}</h4>
                <div className="flex items-center gap-3 px-5 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                   <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                   <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider italic">Payments Active</span>
                </div>
             </div>
             <CalendarDays size={120} className="absolute bottom-[-30px] right-[-30px] text-white/10 rotate-12" />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Bills;