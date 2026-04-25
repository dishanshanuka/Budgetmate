import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { CreditCard, Landmark, Wallet, Plus, MoreVertical, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MyWallet = () => {
  const accounts = [
    { name: "Chase Bank", type: "Checking", balance: "24,500.00", color: "bg-blue-600" },
    { name: "Amex Platinum", type: "Credit Card", balance: "8,120.40", color: "bg-slate-900" },
    { name: "Robinhood", type: "Investment", balance: "12,450.00", color: "bg-green-600" },
  ];

  return (
    <DashboardLayout title="My Wallet">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/*  Left Column: Digital Cards & Quick Actions */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Card Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VisualCard name="Dishan Shanuka" number="**** 4582" exp="08/26" type="VISA" />
            <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all cursor-pointer group">
               <div className="p-4 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors mb-4">
                  <Plus size={32} />
               </div>
               <p className="font-bold text-sm uppercase tracking-widest">Add New Card</p>
            </div>
          </div>

          {/* Accounts List */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900">Linked Accounts</h3>
              <button className="text-blue-600 font-bold text-sm flex items-center gap-1">
                <Plus size={16} /> Add Account
              </button>
            </div>
            <div className="space-y-6">
              {accounts.map((acc, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-3xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/20 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${acc.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100`}>
                      <Landmark size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{acc.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{acc.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">${acc.balance}</p>
                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1">Active</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*  Right Column: Summary & Activity */}
        <div className="space-y-8">
          <div className="bg-[#0A1128] rounded-[2.5rem] p-10 text-white">
            <p className="text-blue-300 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Wallet Summary</p>
            <h4 className="text-3xl font-black mb-8">$45,070.40</h4>
            <div className="space-y-4">
              <SummaryItem label="Monthly Income" amount="+$4,200" up />
              <SummaryItem label="Monthly Expenses" amount="-$1,850" />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center">
             <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="text-blue-600" size={32} />
             </div>
             <h4 className="font-black text-slate-900 mb-2">Smart Saving Tip</h4>
             <p className="text-sm text-slate-500 leading-relaxed">
               You could save an extra <span className="text-blue-600 font-bold">$120/mo</span> by cancelling unused subscriptions.
             </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

//  Visual Credit Card Component
const VisualCard = ({ name, number, exp, type }) => (
  <div className="h-56 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-blue-100 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-8 opacity-20">
      <div className="w-24 h-24 bg-white rounded-full -mr-12 -mt-12"></div>
    </div>
    <div className="flex justify-between items-start relative z-10">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Active Balance</p>
        <p className="text-2xl font-black">$12,450.00</p>
      </div>
      <span className="font-black italic text-xl italic">{type}</span>
    </div>
    <div className="relative z-10">
      <p className="text-lg font-medium tracking-[0.2em] mb-4">{number}</p>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[8px] font-bold text-blue-200 uppercase mb-1">Card Holder</p>
          <p className="text-sm font-bold uppercase">{name}</p>
        </div>
        <div>
          <p className="text-[8px] font-bold text-blue-200 uppercase mb-1">Expires</p>
          <p className="text-sm font-bold">{exp}</p>
        </div>
      </div>
    </div>
  </div>
);

const SummaryItem = ({ label, amount, up }) => (
  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
    <span className="text-xs font-medium text-blue-100">{label}</span>
    <span className={`text-sm font-black ${up ? 'text-green-400' : 'text-red-400'}`}>{amount}</span>
  </div>
);

export default MyWallet;