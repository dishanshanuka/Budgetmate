import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line 
} from 'recharts';
import { Filter, Download, ArrowUpRight, Sparkles, ChevronDown } from 'lucide-react';

const Analytics = () => {
  //  States for Logic
  const [timeRange, setTimeRange] = useState('30');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  //  Mock Data Store
  const dataStore = {
    '30': [
      { name: 'Mon', income: 4000, expense: 2400 },
      { name: 'Tue', income: 3000, expense: 1398 },
      { name: 'Wed', income: 2000, expense: 9800 },
      { name: 'Thu', income: 2780, expense: 3908 },
      { name: 'Fri', income: 1890, expense: 4800 },
      { name: 'Sat', income: 2390, expense: 3800 },
      { name: 'Sun', income: 3490, expense: 4300 },
    ],
    '90': [
      { name: 'Week 1', income: 12000, expense: 8500 },
      { name: 'Week 2', income: 15000, expense: 11000 },
      { name: 'Week 3', income: 9000, expense: 14000 },
      { name: 'Week 4', income: 18000, expense: 9500 },
    ],
    'year': [
      { name: 'Jan', income: 45000, expense: 32000 },
      { name: 'Feb', income: 52000, expense: 28000 },
      { name: 'Mar', income: 48000, expense: 41000 },
      { name: 'Apr', income: 61000, expense: 35000 },
    ]
  };

  const pieData = [
    { name: 'Housing', value: 2100, color: '#0A1128' },
    { name: 'Food & Dining', value: 850, color: '#2563eb' },
    { name: 'Utilities', value: 420, color: '#60a5fa' },
    { name: 'Entertainment', value: 300, color: '#bfdbfe' },
  ];

  const currentData = dataStore[timeRange];

  return (
    <DashboardLayout title="Detailed Analytics">
      
      {/*  Top Filters Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        {/* Time Range Selector */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
           {['30', '90', 'year'].map((range) => (
             <button 
               key={range}
               onClick={() => setTimeRange(range)}
               className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                 timeRange === range ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
               }`}
             >
               {range === 'year' ? 'Yearly' : `${range} Days`}
             </button>
           ))}
        </div>
        
        <div className="flex gap-3">
           {/*  Category Filter Dropdown */}
           <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:border-blue-300 transition-all shadow-sm active:scale-95"
              >
                <Filter size={16} /> 
                {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
                <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterOpen && (
                <div className="absolute top-full mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                  {['All', 'Housing', 'Food & Dining', 'Utilities', 'Entertainment'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 text-xs font-bold transition-all ${
                        selectedCategory === cat ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
           </div>

           <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0A1128] text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all">
             <Download size={16} /> Export Data
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/*  Income vs Expenses Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-center mb-10">
              <h4 className="text-xl font-black text-slate-900">Financial Overview</h4>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#0A1128] rounded-full"></div><span className="text-[10px] font-bold text-slate-400">Income</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-[10px] font-bold text-slate-400">Expenses</span></div>
              </div>
           </div>
           <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip 
                    cursor={{fill: '#f8faff'}} 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Bar dataKey="income" fill="#0A1128" radius={[6, 6, 0, 0]} barSize={20} hide={selectedCategory !== 'All'} />
                  <Bar dataKey="expense" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/*  Spending by Category */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
           <h4 className="text-xl font-black text-slate-900 mb-8">Spending by Category</h4>
           <div className="h-64 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={pieData} 
                    innerRadius={70} 
                    outerRadius={90} 
                    paddingAngle={8} 
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        opacity={selectedCategory === 'All' || selectedCategory === entry.name ? 1 : 0.2}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-3">
              {pieData.map((item, i) => (
                <div 
                  key={i} 
                  className={`flex justify-between items-center p-3 rounded-2xl transition-all ${
                    selectedCategory === item.name ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50'
                  }`}
                >
                   <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}}></div>
                      <span className="text-xs font-bold text-slate-600">{item.name}</span>
                   </div>
                   <span className="text-xs font-black text-slate-900">${item.value}</span>
                </div>
              ))}
           </div>
        </div>

        {/*  Savings Trajectory Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-black text-slate-900">Savings Trajectory</h4>
              <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">+12.4% vs prev. period</span>
           </div>
           <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData}>
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#2563eb" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} 
                    activeDot={{ r: 10, strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/*  AI Insight Card */}
        <div className="bg-gradient-to-br from-[#0A1128] to-blue-900 rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col justify-between group overflow-hidden relative">
           <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:scale-150 transition-transform duration-700">
              <Sparkles size={150} />
           </div>
           <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                 <ArrowUpRight size={24} className="text-blue-300" />
              </div>
              <h4 className="text-xl font-bold mb-4 tracking-tight">Smart Savings Opportunity</h4>
              <p className="text-blue-100/70 text-sm leading-relaxed font-medium">
                Based on your <span className="text-white font-bold">{selectedCategory}</span> patterns, switching to home cooking could save you <span className="text-white font-bold">$140/month</span>.
              </p>
           </div>
           <button className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mt-8 relative z-10 active:scale-95 shadow-lg shadow-blue-900/50">
             Enable Auto-Invest
           </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Analytics;