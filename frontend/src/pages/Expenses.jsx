import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { AlertCircle, Lightbulb, Utensils, Home, Car, ShoppingBag, Clapperboard, Plus, MoreVertical } from 'lucide-react';

const Expenses = () => {
  const budgets = [
    { name: "Housing", spent: 2400, limit: 2400, icon: Home, color: "bg-blue-600", status: "100%" },
    { name: "Dining Out", spent: 624, limit: 500, icon: Utensils, color: "bg-red-500", status: "125%", over: true },
    { name: "Entertainment", spent: 142, limit: 300, icon: Clapperboard, color: "bg-purple-500", status: "47%" },
    { name: "Transport", spent: 380, limit: 450, icon: Car, color: "bg-indigo-500", status: "84%" },
    { name: "Shopping", spent: 215, limit: 600, icon: ShoppingBag, color: "bg-emerald-500", status: "35%" },
  ];

  return (
    <DashboardLayout title="Budget Management">
      
      {/*  High Priority Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex gap-4 items-start">
          <div className="p-3 bg-red-100 text-red-600 rounded-2xl"><AlertCircle size={24} /></div>
          <div>
            <h4 className="font-black text-red-900 text-sm mb-1">Overspending Alert</h4>
            <p className="text-xs text-red-700 leading-relaxed font-medium">
              Your <span className="font-black">Dining Out</span> budget has exceeded the limit by $124.50. Consider reallocating funds.
            </p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex gap-4 items-start">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Lightbulb size={24} /></div>
          <div>
            <h4 className="font-black text-blue-900 text-sm mb-1">Budget Insight</h4>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              You've saved 15% more on <span className="font-black">Groceries</span> this month compared to July. Keep it up!
            </p>
          </div>
        </div>
      </div>

      {/*  Total Budget Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-[#0A1128] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10">
              <p className="text-blue-300 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Total Monthly Budget</p>
              <h2 className="text-5xl font-black mb-10">$8,450.00</h2>
              <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold mb-2">
                    <span>Overall Spent: $5,240.50</span>
                    <span className="text-blue-300">62%</span>
                 </div>
                 <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-400 h-full w-[62%] rounded-full shadow-[0_0_15px_rgba(96,165,250,0.5)]"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Smart Allocation Mini Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col items-center justify-center text-center shadow-sm">
           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Plus size={28} />
           </div>
           <h4 className="font-black text-slate-900 mb-2 tracking-tight">Smart Allocation</h4>
           <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">Let our AI analyze your spending and suggest an optimized budget.</p>
           <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl text-xs font-black transition-all uppercase tracking-widest">Generate Plan</button>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((item, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-slate-100 transition-all relative overflow-hidden">
            {item.over && <span className="absolute top-4 right-4 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase">Overspent</span>}
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 ${item.over ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'} rounded-2xl transition-colors`}>
                <item.icon size={20} />
              </div>
              <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={20}/></button>
            </div>
            <h5 className="font-black text-slate-900 mb-1">{item.name}</h5>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Fixed Monthly</p>
            
            <div className="flex justify-between text-xs font-black mb-2">
              <span className="text-slate-900">${item.spent} / ${item.limit}</span>
              <span className={item.over ? 'text-red-500' : 'text-slate-400'}>{item.status}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
               <div className={`${item.over ? 'bg-red-500' : 'bg-blue-600'} h-full`} style={{width: item.status}}></div>
            </div>
          </div>
        ))}

        {/* Add New Category Card */}
        <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-slate-300 hover:border-blue-200 hover:text-blue-400 transition-all cursor-pointer">
           <Plus size={32} className="mb-2" />
           <p className="text-xs font-black uppercase tracking-widest">Add Category</p>
        </div>
      </div>

    </DashboardLayout>
  );
};

export default Expenses;