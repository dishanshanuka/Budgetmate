import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { User, Lock, Bell, Globe, ShieldCheck, CreditCard, ChevronRight, Camera } from 'lucide-react';

const Settings = () => {
  const sections = [
    { id: 'profile', label: 'Profile Details', icon: User, active: true },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  return (
    <DashboardLayout title="Account Settings">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/*  Left Side: Navigation Tabs */}
        <div className="lg:w-1/4 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-sm font-bold transition-all ${
                section.active 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                : 'text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-100'
              }`}
            >
              <section.icon size={18} />
              {section.label}
            </button>
          ))}
        </div>

        {/*  Right Side: Settings Content */}
        <div className="flex-1 space-y-8">
          
          {/* Profile Header (Dynamic) */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl">
                  {/* Placeholder Profile Image */}
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                    <User size={48} />
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-all border-4 border-white">
                  <Camera size={18} />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black text-slate-900">Your Name</h3>
                <p className="text-slate-400 font-bold text-sm">Update your personal details below</p>
                <div className="mt-4 flex gap-2">
                  <span className="px-4 py-1.5 bg-slate-100 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest italic">Membership Tier</span>
                </div>
              </div>
            </div>
          </div>

          {/* General Information Form (Clean) */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <h4 className="text-lg font-black text-slate-900 mb-8">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" placeholder="Enter your full name" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" placeholder="example@mail.com" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input type="text" placeholder="+94 7X XXX XXXX" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all appearance-none">
                  <option value="" disabled selected>Select your country</option>
                  <option>Sri Lanka</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </div>
            </div>
            <button className="mt-10 px-10 py-4 bg-[#0A1128] text-white rounded-2xl text-xs font-black tracking-widest uppercase hover:opacity-90 transition-all shadow-lg">
              Update Profile
            </button>
          </div>

          {/* Security Quick Access */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <h4 className="text-lg font-black text-slate-900 mb-8">Security & Privacy</h4>
            <div className="space-y-4">
              <SecurityItem icon={ShieldCheck} label="Two-Factor Authentication" status="Configure Security" />
              <SecurityItem icon={Lock} label="Change Password" status="Set a strong password" />
              <SecurityItem icon={CreditCard} label="Payment Methods" status="Add or remove cards" />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

// Security Row Component
const SecurityItem = ({ icon: Icon, label, status }) => (
  <div className="flex items-center justify-between p-6 rounded-3xl border border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <p className="font-bold text-slate-900">{label}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 text-slate-400">{status}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-600" />
  </div>
);

export default Settings;