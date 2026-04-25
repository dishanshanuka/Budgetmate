import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Briefcase, Globe, PieChart as PieIcon, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const Investments = () => {
  const [timeframe, setTimeframe] = useState('1M');

  const performanceData = {
    '1W': [
      { name: 'Mon', value: 920000 }, { name: 'Tue', value: 935000 }, 
      { name: 'Wed', value: 930000 }, { name: 'Thu', value: 950000 }, 
      { name: 'Fri', value: 965000 }, { name: 'Sat', value: 982092 }
    ],
    '1M': [
      { name: 'Jan', value: 850000 }, { name: 'Feb', value: 880000 }, 
      { name: 'Mar', value: 910000 }, { name: 'Apr', value: 890000 }, 
      { name: 'May', value: 940000 }, { name: 'Jun', value: 982092 }
    ],
    '1Y': [
      { name: '2020', value: 400000 }, { name: '2021', value: 550000 }, 
      { name: '2022', value: 720000 }, { name: '2023', value: 810000 }, 
      { name: '2024', value: 982092 }
    ]
  };

  const pieData = [
    { name: 'Stocks', value: 60, color: '#2563eb' },
    { name: 'Crypto', value: 25, color: '#8b5cf6' },
    { name: 'Real Estate', value: 15, color: '#10b981' },
  ];

  const assets = [
    { name: "S&P 500 Index Fund", type: "ETF", amount: "$12,450.00", growth: "+8.4%", up: true },
    { name: "Bitcoin", type: "Crypto", amount: "$4,200.50", growth: "+12.1%", up: true },
    { name: "Tesla, Inc.", type: "Stock", amount: "$2,100.00", growth: "-2.4%", up: false },
    { name: "Ethereum", type: "Crypto", amount: "$3,150.20", growth: "+5.2%", up: true },
  ];

  return (
    <DashboardLayout title="Investments">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/*  Performance Overview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Portfolio Performance</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">$982,092.00</h3>
                <div className="flex items-center gap-2 mt-2">
                   <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
                      <ArrowUpRight size={14} className="text-green-500" />
                      <span className="text-xs font-bold text-green-600">+12.5%</span>
                   </div>
                   <span className="text-xs font-bold text-slate-400 italic">vs last year</span>
                </div>
              </div>

              {/* Timeline Switcher Logic */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                 {['1W', '1M', '1Y'].map((t) => (
                   <button 
                     key={t}
                     onClick={() => setTimeframe(t)}
                     className={`px-5 py-2 rounded-lg text-xs font-black transition-all ${
                       timeframe === t ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                     }`}
                   >
                     {t}
                   </button>
                 ))}
              </div>
            </div>

            <div className="h-[300px] w-full animate-in fade-in duration-700">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData[timeframe]}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/*  Active Assets with Logic Icons */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-8">
                <h4 className="text-xl font-black text-slate-900 tracking-tight">Active Assets</h4>
                <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all group">
                   <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                </button>
             </div>
             <div className="space-y-4">
                {assets.map((asset, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all border border-transparent hover:border-slate-100 group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center ${asset.up ? 'text-blue-500' : 'text-red-500'} shadow-sm group-hover:scale-110 transition-transform`}>
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{asset.name}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{asset.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-slate-900">{asset.amount}</p>
                       <div className={`flex items-center justify-end gap-1 text-xs font-bold ${asset.up ? 'text-green-500' : 'text-red-500'}`}>
                          {asset.up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                          {asset.growth}
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/*  Right Column: Allocation */}
        <div className="space-y-8">
           <div className="bg-[#0A1128] rounded-[2.5rem] p-10 text-white overflow-hidden relative shadow-2xl group">
              <h4 className="text-lg font-black mb-8">Asset Allocation</h4>
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={10} 
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', color: '#000'}} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest text-center leading-tight">Current<br/>Strategy</p>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                 {pieData.map((item, i) => (
                   <div key={i} className="flex justify-between items-center text-[11px] font-bold">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                         <span className="text-slate-400">{item.name}</span>
                      </div>
                      <span className="font-black italic">{item.value}%</span>
                   </div>
                 ))}
              </div>
              <Globe size={150} className="absolute bottom-[-50px] right-[-50px] opacity-5 group-hover:rotate-45 transition-transform duration-1000" />
           </div>

           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-xl group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform">
                 <TrendingUp size={80} />
              </div>
              <h4 className="text-xl font-black mb-4 relative z-10">Market Insight</h4>
              <p className="text-blue-100 text-sm leading-relaxed mb-8 relative z-10 font-medium">Tech stocks are showing <span className="text-white font-bold">high momentum</span> this quarter. Consider rebalancing your ETF weight.</p>
              <button className="text-white font-black text-xs flex items-center gap-2 hover:gap-4 transition-all relative z-10 uppercase tracking-widest">
                Full Report <ChevronRight size={18} />
              </button>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Investments;