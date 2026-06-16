import { useState } from "react";
import { Lock, Hash, X, ArrowLeft, Eye, EyeOff } from "lucide-react";
import API from '../services/api';
import toast from 'react-hot-toast';
import logoImg from "../assets/logo.svg";

const VerifyOTP = ({ isOpen, onClose, email, openLogin }) => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleReset = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading('Verifying and resetting password...');

    try {
      const payload = {
        email: email,
        otp: String(otp), 
        new_password: newPassword
      };

      const response = await API.post('/auth/reset-password', payload);

      if (response.status === 200) {
        toast.success('Password reset successfully!', { id: loadToast });
        
        
        setTimeout(() => {
          if (onClose) onClose();      
          if (openLogin) openLogin();   
        }, 1500);
      }
    } catch (error) {
      // error.response?.data?.detail can be either a string or an array of errors, so we check both cases
      const errorMsg = error.response?.data?.detail?.[0]?.msg || error.response?.data?.detail || 'Invalid OTP or expired';
      toast.error(errorMsg, { id: loadToast });
      console.error("Reset Error Details:", error.response?.data);
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
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
        >
          <X size={20} />
        </button>

        {/* Logo & Text */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <img src={logoImg} alt="BudgetMate Logo" className="h-14 w-auto object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verify Identity</h2>
          <p className="text-sm text-slate-500">
            Enter the 6-digit code sent to <br />
            <span className="font-bold text-blue-600 underline decoration-blue-200 underline-offset-4">{email}</span>
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          {/* OTP Field */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Verification Code
            </label>
            <div className="flex items-center border-2 border-slate-100 rounded-2xl px-4 py-3 mt-1.5 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
              <Hash size={18} className="text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="000000"
                maxLength="6"
                className="w-full outline-none text-sm font-bold tracking-[0.5em] bg-transparent"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
          </div>

          {/* New Password Field */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Set New Password
            </label>
            <div className="flex items-center border-2 border-slate-100 rounded-2xl px-4 py-3 mt-1.5 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
              <Lock size={18} className="text-slate-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full outline-none text-sm font-medium bg-transparent pr-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-100 active:scale-95 cursor-pointer"
          >
            Update Password
          </button>
        </form>

        {/* Back to Sign In */}
        <button 
          type="button"
          onClick={openLogin} 
          className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;