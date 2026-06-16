import { useTheme } from '../context/ThemeContext';
import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { User, Lock, Bell, Globe, ShieldCheck, CreditCard, ChevronRight, Camera, Loader2, Eye, EyeOff, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProfile, updateProfile, changePassword } from '../services/settingsService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { darkMode, toggleDarkMode } = useTheme();
  const [profile, setProfile] = useState(() => ({
    full_name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    profile_photo: localStorage.getItem('profilePhoto') || '',
  }));
  const [loadingProfile, setLoadingProfile] = useState(() => {
    return !localStorage.getItem('userName');
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const fileInputRef = useRef(null);

  const sections = [
    { id: 'profile', label: 'Profile Details', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError('');
        setLoadingProfile(true);
        const data = await getProfile();
        setProfile({
          full_name: data.full_name || '',
          email: data.email || '',
          profile_photo: data.profile_photo || '',
        });
        localStorage.setItem('userName', data.full_name || '');
        localStorage.setItem('userEmail', data.email || '');
        localStorage.setItem('profilePhoto', data.profile_photo || '');
      } catch (err) {
        if (!profile.full_name) {
          setError(err.response?.data?.detail || 'Failed to load profile details.');
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    void loadProfile();
  }, []);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({
        ...prev,
        profile_photo: typeof reader.result === 'string' ? reader.result : '',
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSavingProfile(true);
      setError('');
      const updated = await updateProfile({
        full_name: profile.full_name,
        profile_photo: profile.profile_photo || null,
      });

      setProfile((prev) => ({
        ...prev,
        full_name: updated.full_name || prev.full_name,
        email: updated.email || prev.email,
        profile_photo: updated.profile_photo || prev.profile_photo,
      }));

      localStorage.setItem('userName', updated.full_name || profile.full_name);
      localStorage.setItem('profilePhoto', updated.profile_photo || profile.profile_photo || '');
      toast.success('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const openChangePassword = () => {
    setPasswordError('');
    setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setIsPasswordModalOpen(true);
  };

  const closeChangePassword = () => {
    setIsPasswordModalOpen(false);
    setPasswordError('');
    setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (passwordForm.new_password.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setSavingPassword(true);
      setPasswordError('');
      await changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });

      toast.success('Password updated successfully');
      closeChangePassword();
    } catch (err) {
      setPasswordError(err.response?.data?.detail || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <DashboardLayout title="Account Settings">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        
        {/*  Left Side: Navigation Tabs */}
        <div className="lg:w-1/4 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)} 
              className={`flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-[1.5rem] text-xs lg:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === section.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 dark:shadow-none' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-100 dark:hover:border-slate-800'
              }`}
            >
              <section.icon size={18} />
              {section.label}
            </button>
          ))}
        </div>

        {/*  Right Side: Settings Content (Logic) */}
        <div className="flex-1 space-y-8">
          
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Profile Header */}
              <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-32 h-32 bg-slate-100 dark:bg-slate-850 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                      {profile.profile_photo ? (
                        <img src={profile.profile_photo} alt="Profile preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-400">
                          <User size={48} />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handlePhotoClick}
                      className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-all border-4 border-white dark:border-slate-800"
                    >
                      <Camera size={18} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      {profile.full_name || 'Your Name'}
                    </h3>
                    <p className="text-slate-400 font-bold text-sm">Update your personal details below</p>
                  </div>
                </div>
              </div>

              {/* Personal Info Form */}
              <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-8">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">Personal Information</h4>
                  {loadingProfile && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-bold">
                      <Loader2 size={12} className="animate-spin text-blue-600" /> Syncing...
                    </span>
                  )}
                </div>

                {error && (
                  <div className="mb-6 rounded-2xl border border-red-100 dark:border-red-900/35 bg-red-50 dark:bg-red-950/10 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400">
                    {error}
                  </div>
                )}

                {loadingProfile && !profile.full_name ? (
                  <div className="flex items-center gap-3 py-6 text-slate-400 font-medium">
                    <Loader2 size={18} className="animate-spin" />
                    Loading profile...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(event) => setProfile((prev) => ({ ...prev, full_name: event.target.value }))}
                        placeholder="Enter your full name"
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        readOnly
                        className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-805 rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingProfile || loadingProfile}
                  className="mt-10 px-10 py-4 bg-[#0A1128] dark:bg-blue-600 text-white rounded-2xl text-xs font-black tracking-widest uppercase hover:opacity-90 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {savingProfile ? 'Saving...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-8">Security & Privacy</h4>
              <div className="space-y-4">
                <SecurityItem icon={ShieldCheck} label="Two-Factor Authentication" status="Configure Security" />
                <SecurityItem icon={Lock} label="Change Password" status="Set a strong password" onClick={openChangePassword} />
                <SecurityItem icon={CreditCard} label="Payment Methods" status="Add or remove cards" />
              </div>
            </div>
          )}

          {/*  Notifications Content */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none animate-in fade-in duration-300">
               <h4 className="text-lg font-black text-slate-900 dark:text-white mb-4">Notifications</h4>
               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage how and when you receive alerts from BudgetMate.</p>
            </div>
          )}
  
          {activeTab === 'preferences' && (
            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none animate-in fade-in duration-300">
              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Preferences</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">Customize your BudgetMate experience.</p>

              <div className="flex items-center justify-between p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm text-2xl">
                    {darkMode ? '🌙' : '☀️'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Dark Mode</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 text-slate-400 dark:text-slate-500">
                      {darkMode ? 'Dark theme is ON' : 'Light theme is ON'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleDarkMode}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${
                    darkMode ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                      darkMode ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm px-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg rounded-[1.5rem] sm:rounded-[2rem] bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 mx-2 sm:mx-0">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">Change Password</h4>
                <p className="text-sm font-medium text-slate-505 dark:text-slate-400">Update your login password for this account.</p>
              </div>
              <button type="button" onClick={closeChangePassword} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {passwordError && (
              <div className="mb-5 rounded-2xl border border-red-100 dark:border-red-900/35 bg-red-50 dark:bg-red-950/10 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.current_password}
                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, current_password: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 py-4 pr-14 text-sm font-bold text-slate-900 dark:text-white focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  />
                  <button type="button" onClick={() => setShowCurrentPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer">
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.new_password}
                    onChange={(event) => setPasswordForm((prev) => ({ ...prev, new_password: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 py-4 pr-14 text-sm font-bold text-slate-900 dark:text-white focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  />
                  <button type="button" onClick={() => setShowNewPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer">
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirm_password: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 py-4 text-sm font-bold text-slate-900 dark:text-white focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={closeChangePassword} className="rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="rounded-2xl bg-[#0A1128] dark:bg-blue-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  {savingPassword ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// Security Row Component
const SecurityItem = ({ icon: Icon, label, status, onClick }) => (
  <button type="button" onClick={onClick} className="flex w-full items-center justify-between rounded-3xl border border-slate-50 dark:border-slate-800 p-6 text-left transition-all hover:bg-slate-50 dark:hover:bg-slate-850/50 group cursor-pointer bg-white dark:bg-slate-900">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <p className="font-bold text-slate-900 dark:text-white">{label}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 text-slate-400 dark:text-slate-500">{status}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-600" />
  </button>
);

export default Settings;