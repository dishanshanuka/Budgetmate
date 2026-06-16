import { useState } from "react";
import { Mail, ArrowLeft, X } from "lucide-react";
import API from '../services/api';
import toast from 'react-hot-toast';
import logoImg from "../assets/logo.svg";

const ForgotPassword = ({ isOpen, onClose, openLogin, openVerify }) => {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading('Sending OTP...');

    try {
      // 1. Request an OTP from the backend by sending the user's email
      const response = await API.post('/auth/forgot-password', { email });

      if (response.status === 200) {
        toast.success('OTP sent to your email!', { id: loadToast });
        
        setTimeout(() => {
          openVerify(email); 
        }, 1000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Email not found';
      toast.error(errorMsg, { id: loadToast });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-300 border border-white/20">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <img src={logoImg} alt="BudgetMate Logo" className="h-14 w-auto object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reset Password</h2>
          <p className="text-sm text-slate-500">
            Enter your email to receive a 6-digit verification code.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="flex items-center border-2 border-slate-50 rounded-2xl px-4 py-3 mt-1.5 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
              <Mail size={18} className="text-slate-400 mr-3" />
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full outline-none text-sm font-medium bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-200 active:scale-95 cursor-pointer"
          >
            Send OTP →
          </button>
        </form>

        {/* Back to Login Button */}
        <button 
          onClick={openLogin}
          className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;