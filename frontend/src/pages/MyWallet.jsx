import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { CreditCard, Landmark, Wallet, Plus, MoreVertical, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';

const MyWallet = () => {
  //  State Management
  const [selectedAcc, setSelectedAcc] = useState(0); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const accounts = [
    { name: "Chase Bank", type: "Checking", balance: "24,500.00", color: "bg-blue-600", cardNumber: "**** 4582", exp: "08/26" },
    { name: "Amex Platinum", type: "Credit Card", balance: "8,120.40", color: "bg-slate-900", cardNumber: "**** 1002", exp: "12/28" },
    { name: "Robinhood", type: "Investment", balance: "12,450.00", color: "bg-emerald-600", cardNumber: "**** 9931", exp: "05/27" },
  ];

  const totalBalance = accounts.reduce((acc, curr) => acc + parseFloat(curr.balance.replace(',', '')), 0).toLocaleString();

  return (
    <DashboardLayout title="My Wallet">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/*  Left Column: Digital Cards & Accounts */}
        <div className="lg:col-span-2 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-700">
            <VisualCard 
              name="Dishan Shanuka" 
              number={accounts[selectedAcc].cardNumber} 
              exp={accounts[selectedAcc].exp} 
              type={accounts[selectedAcc].type === "Credit Card" ? "AMEX" : "VISA"}
              balance={accounts[selectedAcc].balance}
              color={accounts[selectedAcc].color}
            />
            
            <div 
              onClick={() => setIsModalOpen(true)}
              className="border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer group bg-slate-50/30"
            >
               <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform mb-4">
                  <Plus size={32} />
               </div>
               <p className="font-black text-[10px] uppercase tracking-[0.2em]">Add New Card</p>
            </div>
          </div>

          {/*  Linked Accounts List */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900">Linked Accounts</h3>
              <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                <Plus size={16} /> Add Account
              </button>
            </div>
            <div className="space-y-4">
              {accounts.map((acc, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedAcc(i)} 
                  className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all cursor-pointer group ${
                    selectedAcc === i 
                    ? 'border-blue-600 bg-blue-50/30 shadow-lg shadow-blue-50' 
                    : 'border-slate-50 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${acc.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100/20 group-hover:rotate-6 transition-transform`}>
                      <Landmark size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{acc.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{acc.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">${acc.balance}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedAcc === i ? 'text-blue-600' : 'text-green-500'}`}>
                      {selectedAcc === i ? 'Selected' : 'Active'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*  Right Column: Summary */}
        <div className="space-y-8">
          <div className="bg-[#0A1128] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <p className="text-blue-300 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Net Worth</p>
            <h4 className="text-4xl font-black mb-8 tracking-tighter">${totalBalance}</h4>
            <div className="space-y-4 relative z-10">
              <SummaryItem label="Monthly Income" amount="+$4,200" up />
              <SummaryItem label="Monthly Expenses" amount="-$1,850" />
            </div>
            <Wallet size={120} className="absolute bottom-[-30px] right-[-30px] text-white/5 rotate-12" />
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center relative overflow-hidden group">
             <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
                <Wallet className="text-blue-600" size={32} />
             </div>
             <h4 className="font-black text-slate-900 mb-3 tracking-tight">Savings Optimization</h4>
             <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Switching your <span className="text-blue-600 font-bold">Chase Bank</span> funds to a High-Yield account could earn you <span className="font-bold text-slate-900">$45/mo</span> extra.
             </p>
             <button className="mt-8 w-full py-4 bg-slate-50 hover:bg-[#0A1128] hover:text-white text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Explore Options</button>
          </div>
        </div>

      </div>

      {/*  Add Card Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0A1128]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><X size={24}/></button>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Add New Card</h3>
            <p className="text-sm text-slate-400 font-medium mb-8">Link your credit or debit card securely.</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 transition-all" />
              </div>
              <div className="flex gap-4">
                 <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none" />
                 </div>
                 <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                    <input type="password" placeholder="***" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none" />
                 </div>
              </div>
              <button className="w-full py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 active:scale-95 transition-all">Link Card Now</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

//  Visual Card Component with Dynamic Props
const VisualCard = ({ name, number, exp, type, balance, color }) => (
  <div className={`h-64 ${color} rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group transition-all duration-500`}>
    <div className="absolute top-0 right-0 p-10 opacity-20">
      <div className="w-32 h-32 bg-white rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
    </div>
    <div className="flex justify-between items-start relative z-10">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Current Balance</p>
        <p className="text-3xl font-black tracking-tighter">${balance}</p>
      </div>
      <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl">
        <span className="font-black italic text-sm tracking-tighter">{type}</span>
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-xl font-medium tracking-[0.3em] mb-6">{number}</p>
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">Card Holder</p>
          <p className="text-xs font-black uppercase tracking-tight">{name}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">Expires</p>
          <p className="text-xs font-black tracking-tight">{exp}</p>
        </div>
      </div>
    </div>
  </div>
);

const SummaryItem = ({ label, amount, up }) => (
  <div className="flex justify-between items-center bg-white/5 p-5 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors">
    <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">{label}</span>
    <span className={`text-sm font-black ${up ? 'text-emerald-400' : 'text-red-400'}`}>{amount}</span>
  </div>
);

export default MyWallet;