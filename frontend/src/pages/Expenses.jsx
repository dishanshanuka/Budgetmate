import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { AlertCircle, Lightbulb, Utensils, Home, Car, ShoppingBag, Clapperboard, Plus, MoreVertical, X } from 'lucide-react';

const Expenses = () => {
  //  State Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgets, setBudgets] = useState([
    { name: "Housing", spent: 2400, limit: 2400, icon: Home, color: "bg-blue-600" },
    { name: "Dining Out", spent: 624, limit: 500, icon: Utensils, color: "bg-red-500" },
    { name: "Entertainment", spent: 142, limit: 300, icon: Clapperboard, color: "bg-purple-500" },
    { name: "Transport", spent: 380, limit: 450, icon: Car, color: "bg-indigo-500" },
    { name: "Shopping", spent: 215, limit: 600, icon: ShoppingBag, color: "bg-emerald-500" },
  ]);

  //  Budget Calculation Logic
  const totalLimit = budgets.reduce((acc, curr) => acc + curr.limit, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const totalPercentage = Math.round((totalSpent / totalLimit) * 100);

  const overspentCategory = budgets.find(b => b.spent > b.limit);

  return (
    <DashboardLayout title="Budget Management">
      
      {/*  Dynamic Alerts based on Logic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {overspentCategory ? (
          <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex gap-4 items-start animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="p-3 bg-red-100 text-red-600 rounded-2xl"><AlertCircle size={24} /></div>
            <div>
              <h4 className="font-black text-red-900 text-sm mb-1">Overspending Alert</h4>
              <p className="text-xs text-red-700 leading-relaxed font-medium">
                Your <span className="font-black">{overspentCategory.name}</span> budget has exceeded the limit by <span className="font-black">${(overspentCategory.spent - overspentCategory.limit).toFixed(2)}</span>.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex gap-4 items-start animate-in fade-in duration-500">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><AlertCircle size={24} /></div>
            <div>
              <h4 className="font-black text-emerald-900 text-sm mb-1">Budget on Track</h4>
              <p className="text-xs text-emerald-700 leading-relaxed font-medium">Great job! All your spending categories are currently within the set limits.</p>
            </div>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex gap-4 items-start">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Lightbulb size={24} /></div>
          <div>
            <h4 className="font-black text-blue-900 text-sm mb-1">Smart Tip</h4>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">
              You could save an extra <span className="font-black">$200</span> this month by reducing 10% from your Entertainment budget.
            </p>
          </div>
        </div>
      </div>

      {/*  Overall Budget Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-[#0A1128] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl group transition-all">
           <div className="relative z-10">
              <p className="text-blue-300 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Total Monthly Budget</p>
              <h2 className="text-5xl font-black mb-10 tracking-tighter">${totalLimit.toLocaleString()}</h2>
              <div className="space-y-4">
                 <div className="flex justify-between text-xs font-bold">
                    <span>Overall Spent: ${totalSpent.toLocaleString()}</span>
                    <span className="text-blue-300">{totalPercentage}%</span>
                 </div>
                 <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
                      style={{ width: `${totalPercentage}%` }}
                    ></div>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition-all group">
           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Plus size={28} />
           </div>
           <h4 className="font-black text-slate-900 mb-2">Auto-Budget</h4>
           <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6 px-4">Let BudgetMate AI optimize your limits based on last month's data.</p>
           <button className="w-full py-4 bg-[#0A1128] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all">Optimize Now</button>
        </div>
      </div>

      {/*  Category Grid with Dynamic Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((item, i) => {
          const percentage = Math.min(Math.round((item.spent / item.limit) * 100), 125);
          const isOver = item.spent > item.limit;

          return (
            <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group hover:border-blue-200 transition-all relative overflow-hidden">
              {isOver && <span className="absolute top-6 right-6 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase animate-bounce">Critical</span>}
              
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl transition-colors ${isOver ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                  <item.icon size={20} />
                </div>
                <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={20}/></button>
              </div>
              
              <h5 className="font-black text-slate-900 mb-1">{item.name}</h5>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">Category Limit</p>
              
              <div className="flex justify-between text-xs font-black mb-3">
                <span className="text-slate-900">${item.spent} <span className="text-slate-300 font-medium">/ ${item.limit}</span></span>
                <span className={isOver ? 'text-red-500 font-black' : 'text-slate-400'}>{percentage}%</span>
              </div>
              
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                 <div 
                   className={`${isOver ? 'bg-red-500' : 'bg-blue-600'} h-full transition-all duration-700`} 
                   style={{ width: `${Math.min(percentage, 100)}%` }}
                 ></div>
              </div>
            </div>
          );
        })}

        {/* Add New Category Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-slate-300 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/10 transition-all cursor-pointer group"
        >
           <Plus size={40} className="mb-3 group-hover:rotate-90 transition-transform duration-300" />
           <p className="text-xs font-black uppercase tracking-[0.2em]">Add Category</p>
        </button>
      </div>

      {/*  Simple Add Category Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0A1128]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X size={24}/></button>
            <h3 className="text-2xl font-black text-slate-900 mb-2">New Category</h3>
            <p className="text-sm text-slate-400 font-medium mb-8">Set a monthly limit for your new expense category.</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
                <input type="text" placeholder="e.g. Health & Fitness" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Limit ($)</label>
                <input type="number" placeholder="500" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 transition-all" />
              </div>
              <button className="w-full py-5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all">Create Category</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default Expenses;