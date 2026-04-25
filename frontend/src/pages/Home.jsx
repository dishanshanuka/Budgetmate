import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wallet, Sparkles, MoveRight, TrendingUp, ShieldCheck, Globe } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-900 font-sans overflow-x-hidden selection:bg-blue-100">
      
      {/*  Background Decorative Orbs (Fixed Classes) */}
      <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-blue-200/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-indigo-100/30 rounded-full blur-[100px] -z-10"></div>

      {/*  Floating Pill Navbar */}
      <header className="fixed top-6 left-0 w-full z-50 px-6">
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-lg border border-white/40 px-8 py-3 rounded-full flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          <div className="flex items-center">
            <span className="text-xl font-black tracking-tighter text-slate-900">
              Budget<span className="text-blue-600">Mate</span>
            </span>
          </div>
          
          <nav className="hidden md:flex gap-8 font-semibold text-slate-500 text-[13px]">
            <a href="#features" className="hover:text-blue-600 transition-all">Features</a>
            <a href="#" className="hover:text-blue-600 transition-all">Knowledge Hub</a>
            <a href="#" className="hover:text-blue-600 transition-all">Pricing</a>
            <a href="#" className="hover:text-blue-600 transition-all">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors">Log in</Link>
            <Link to="/dashboard" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100">
              Try Now <MoveRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/*  Hero Section */}
      <section className="pt-52 pb-20 px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
            <Sparkles size={14} className="text-blue-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Intelligence Finance Idea</span>
          </div>
          
          {/* Main Heading (Fixed Leading) */}
          <h1 className="text-6xl md:text-[5.5rem] font-bold tracking-tight text-slate-900 leading-none mb-6">
            Track. Save. Grow. <br />
            All in One <span className="text-blue-600">AI Platform.</span>
          </h1>

          {/* Subtext */}
          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed">
            Unlock the full potential of your wealth with a single platform designed to power your 
            savings, investments, and expenses. From tracking to generating high-quality reports.
          </p>

          {/* Main Action Button */}
          <div className="flex justify-center pt-4">
             <Link to="/dashboard" className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-3 group">
               Try Budget<span className="text-blue-200">Mate</span> <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>

          {/*  AI Prompt Bar (Fixed Linear Gradient) */}
          <div className="mt-16 max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-400 to-indigo-300 rounded-full blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-white border border-slate-200/60 rounded-full px-8 py-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4 text-slate-400">
                <Sparkles size={20} className="text-blue-400" />
                <span className="text-sm font-medium text-left">How much did I spend on food this month?</span>
              </div>
              <button className="bg-blue-600 p-2.5 rounded-full text-white hover:scale-110 transition-transform cursor-pointer">
                <ArrowRight size={18} className="-rotate-45" />
              </button>
            </div>
          </div>

          {/*  Logo Partners Section */}
          <div className="pt-32 pb-12">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-12">
              Trusted by forward-thinking finance teams
            </p>
            
            <div className="opacity-30 grayscale flex flex-wrap justify-center gap-16 items-center px-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-900 rounded-sm"></div>
                <span className="text-xl font-black tracking-tighter uppercase text-slate-900 leading-none">Finance.io</span>
              </div>

              <div className="flex items-center gap-1">
                <div className="w-2 h-8 bg-slate-900"></div>
                <span className="text-2xl font-bold tracking-widest uppercase text-slate-900 leading-none">Vault</span>
              </div>

              <span className="text-2xl font-black tracking-tighter underline decoration-2 underline-offset-4 text-slate-900 leading-none uppercase">Merrill</span>

              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 border-2 border-slate-900 rounded-full"></div>
                 <span className="text-xl font-bold tracking-tight text-slate-900 leading-none uppercase">Kraken</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Simple Features Section --- */}
      <section id="features" className="py-24 bg-white/50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-3 gap-12 text-left">
          <div className="space-y-4">
            <TrendingUp className="text-blue-600" size={28} />
            <h3 className="text-xl font-bold">Predictive Analytics</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Forecast your future savings based on current spending habits with 98% accuracy.</p>
          </div>
          <div className="space-y-4">
            <ShieldCheck className="text-blue-600" size={28} />
            <h3 className="text-xl font-bold">Bank-Grade Security</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Your data is encrypted using AES-256 protocols. We never store your credentials.</p>
          </div>
          <div className="space-y-4">
            <Globe className="text-blue-600" size={28} />
            <h3 className="text-xl font-bold">Global Sync</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Connect accounts from 15,000+ financial institutions across the globe seamlessly.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-slate-50">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.5em]">
          Budget<span className="text-blue-400">Mate</span> Ecosystem • 2026
        </p>
      </footer>
    </div>
  );
};

export default Home;