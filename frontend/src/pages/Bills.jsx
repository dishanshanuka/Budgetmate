import React, { useState, useMemo, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { CalendarDays, Bell, Sparkles, Plus, ChevronLeft, ChevronRight, List, Info } from 'lucide-react';
import API from '../services/api';

const DEFAULT_ICON = "https://img.icons8.com/fluency/48/subscription.png";

const iconPresets = {
  Netflix: { icon_url: "https://img.icons8.com/color/48/netflix.png", bg_color: "bg-red-50" },
  Spotify: { icon_url: "https://img.icons8.com/color/48/spotify--v1.png", bg_color: "bg-green-50" },
  Google:  { icon_url: "https://img.icons8.com/color/48/google-logo.png", bg_color: "bg-blue-50" },
  YouTube: { icon_url: "https://img.icons8.com/color/48/youtube-play.png", bg_color: "bg-red-50" },
  Amazon:  {icon_url: "https://img.icons8.com/color/48/amazon.png",bg_color: "bg-yellow-50"}
};

const optimizationTooltipLines = [
  'Most expensive monthly service — highest monthly subscription amount.',
  'Large annual payment — highest annual subscription amount.',
  'Multiple due days — when more than one subscription shares the same due day.',
  'High monthly commitment — total monthly cost over $100 or 4+ monthly subscriptions.'
];

const Bills = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [viewMode, setViewMode] = useState('month');

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [currentMonthIndex, setCurrentMonthIndex] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [subscriptions, setSubscriptions] = useState([]);

  const loadSubscriptions = async () => {
    try {
      const response = await API.get('/subscriptions/');
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    }
  };

useEffect(() => {
  loadSubscriptions();
}, []);  

  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    billing_type: 'Monthly',
    due_day: '',
    due_month: today.getMonth(),
    icon_url: DEFAULT_ICON,
    bg_color: 'bg-slate-50'
  });
  const [manageForm, setManageForm] = useState({
    name: '',
    amount: '',
    billing_type: 'Monthly',
    due_day: '',
    due_month: today.getMonth(),
    icon_url: DEFAULT_ICON,
    bg_color: 'bg-slate-50'
  });
  const [manageError, setManageError] = useState('');
  const [addError, setAddError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const isValidIconUrl = (url) => {
    const trimmed = (url || '').trim();
    return trimmed === '' || trimmed.startsWith('https://');
  };

  const openManageBilling = () => {
    setSelectedSub(null);
    setManageError('');
    setShowManageModal(true);
  };

  const handleSelectSubscription = (sub) => {
    setSelectedSub(sub);
    setManageForm({
      name: sub.name,
      amount: sub.amount,
      billing_type: sub.billing_type,
      due_day: sub.due_day,
      due_month: sub.due_month ?? currentMonthIndex,
      icon_url: sub.icon_url || DEFAULT_ICON,
      bg_color: sub.bg_color || 'bg-slate-50'
    });
  };

  const handleUpdateSubscription = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    if (!isValidIconUrl(manageForm.icon_url)) {
      setManageError('Please enter a valid icon URL that starts with https:// or leave it blank.');
      return;
    }

    setManageError('');
    setIsUpdating(true);
    try {
      await API.put(`/subscriptions/${selectedSub.id}`, {
        name: manageForm.name,
        amount: Number(manageForm.amount),
        billing_type: manageForm.billing_type,
        due_day: Number(manageForm.due_day),
        due_month: manageForm.billing_type === 'Annual' ? Number(manageForm.due_month) : null,
        icon_url: manageForm.icon_url?.trim() || DEFAULT_ICON,
        bg_color: manageForm.bg_color || 'bg-slate-50'
      });

      setShowManageModal(false);
      setSelectedSub(null);
      loadSubscriptions();
    } catch (error) {
      console.error('Failed to update subscription:', error);
      const message = error.response?.data?.detail || 'Unable to save changes. Please try again.';
      setManageError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    const confirmed = window.confirm('Are you sure you want to cancel this subscription? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await API.delete(`/subscriptions/${subscriptionId}`);
      if (selectedSub?.id === subscriptionId) {
        setSelectedSub(null);
      }
      loadSubscriptions();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      setManageError('Unable to cancel the subscription. Please try again.');
    }
  };

  const handlePrevMonth = () => {
    setSelectedDate(null);
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonthIndex(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedDate(null);
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonthIndex(prev => prev + 1);
    }
  };

  // Helper: should this sub appear in the currently viewed month?
  const isVisibleInCurrentMonth = (sub) => {
    if (sub.billing_type === 'Monthly') return true;
    if (sub.billing_type === 'Annual') return Number(sub.due_month) === currentMonthIndex;
    return true;
  };

  // Subs that are actually due this month (used for calendar dots + list view)
  const visibleSubs = useMemo(
    () => subscriptions.filter(isVisibleInCurrentMonth),
    [subscriptions, currentMonthIndex]
  );

  const annualSubs = useMemo(
    () => subscriptions.filter(sub => sub.billing_type === 'Annual'),
    [subscriptions]
  );

  const monthlySubs = useMemo(
    () => subscriptions.filter(sub => sub.billing_type === 'Monthly'),
    [subscriptions]
  );

  const totalAnnual = useMemo(
    () => annualSubs.reduce((acc, curr) => acc + Number(curr.amount || 0), 0),
    [annualSubs]
  );

  const totalMonthlyCommitmentOnly = useMemo(
    () => monthlySubs.reduce((acc, curr) => acc + Number(curr.amount || 0), 0),
    [monthlySubs]
  );

  const topMonthlyService = useMemo(() => {
    return [...monthlySubs]
      .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))[0];
  }, [monthlySubs]);

  const largestAnnualService = useMemo(() => {
    return [...annualSubs]
      .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))[0];
  }, [annualSubs]);

  const duplicateDueGroups = useMemo(() => {
    const groups = {};
    subscriptions.forEach((sub) => {
      const day = Number(sub.due_day);
      if (!day) return;
      groups[day] = groups[day] || [];
      groups[day].push(sub);
    });
    return Object.values(groups).filter(group => group.length > 1);
  }, [subscriptions]);

  const optimizeRecommendations = useMemo(() => {
    const suggestions = [];

    if (topMonthlyService) {
      suggestions.push({
        id: 'top-monthly',
        title: 'Most expensive monthly service',
        description: `Your most expensive monthly service is ${topMonthlyService.name} ($${Number(topMonthlyService.amount || 0).toFixed(2)}).`, 
        detail: `Review this service to reduce your monthly spend.`
      });
    }

    if (largestAnnualService) {
      suggestions.push({
        id: 'large-annual',
        title: 'Large annual payment',
        description: `${largestAnnualService.name || 'Insurance'} has a large annual payment of $${Number(largestAnnualService.amount || 0).toFixed(2)}.`, 
        detail: `That is about $${(Number(largestAnnualService.amount || 0) / 12).toFixed(2)} per month.`
      });
    }

    if (duplicateDueGroups.length > 0) {
      suggestions.push({
        id: 'same-day',
        title: 'Multiple due days',
        description: `You have ${duplicateDueGroups.length} days with more than one subscription due.`, 
        detail: 'Spreading payments across different dates can reduce pressure on the same billing day.'
      });
    }

    if (totalMonthlyCommitmentOnly > 100 || monthlySubs.length >= 4) {
      suggestions.push({
        id: 'high-commitment',
        title: 'High monthly commitment',
        description: `Your monthly commitment is $${totalMonthlyCommitmentOnly.toFixed(2)}.`, 
        detail: 'Canceling one or two of your highest monthly plans could create meaningful savings.'
      });
    }

    return suggestions;
  }, [topMonthlyService, largestAnnualService, duplicateDueGroups, totalMonthlyCommitmentOnly, monthlySubs.length]);

  const totalMonthly = useMemo(() => {
    return visibleSubs
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
      .toFixed(2);
  }, [visibleSubs]);

  const daysInMonth = useMemo(() => {
      return new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    }, [currentMonthIndex, currentYear]);
  
  // weekday offset so day 1 lands on the right column
  const startDayOffset = useMemo(() => {
        return new Date(currentYear, currentMonthIndex, 1).getDay();
      }, [currentMonthIndex, currentYear]);
    
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const handleAddSubscription = async (e) => {
    e.preventDefault();

    if (!isValidIconUrl(formData.icon_url)) {
      setAddError('Please enter a valid icon URL that starts with https:// or leave it blank.');
      return;
    }
    setAddError('');

    try {
      await API.post('/subscriptions/', {
        ...formData,
        amount: Number(formData.amount),
        due_day: Number(formData.due_day),
        due_month: formData.due_month,
        icon_url: formData.icon_url?.trim() || DEFAULT_ICON,
        bg_color: formData.bg_color || 'bg-slate-50'
      });

      setShowAddModal(false);

      setFormData({
        name: '',
        amount: '',
        billing_type: 'Monthly',
        due_day: '',
        due_month: today.getMonth(),
        icon_url: '',
        bg_color: 'bg-slate-50'
      });

      loadSubscriptions();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout title="Bills & Subscriptions">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/*  Left Side: Calendar / List View Container */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            
            {/*  Header with Navigation & Switcher */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-black text-slate-900 min-w-[180px]">
                  {months[currentMonthIndex]} {currentYear}
                </h3>
                <div className="flex gap-2">
                  <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 active:scale-90 transition-all">
                    <ChevronLeft size={20}/>
                  </button>
                  <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 active:scale-90 transition-all">
                    <ChevronRight size={20}/>
                  </button>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                 <button 
                   onClick={() => setViewMode('month')}
                   className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'month' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                 >Month</button>
                 <button 
                   onClick={() => setViewMode('list')}
                   className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                 >List</button>
              </div>
            </div>

            {viewMode === 'month' ? (
              <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-[2rem] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-slate-50 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
                ))}

                {/*: Leading empty cells to align day 1 to the correct weekday */}
                {Array.from({ length: startDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-white h-24" />
                ))}

                {calendarDays.map(day => {
                  const hasBill = visibleSubs.some(s => Number(s.due_day) === day);
                  return (
                    <div 
                      key={day} 
                      onClick={() => setSelectedDate(day)}
                      className={`bg-white h-24 p-3 relative hover:bg-blue-50/30 transition-all cursor-pointer ${selectedDate === day ? 'bg-blue-50/40' : ''}`}
                    >
                      <span className={`text-xs font-bold ${selectedDate === day ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-lg' : 'text-slate-400'}`}>
                        {day}
                      </span>
                      {hasBill && (
                        <div className="mt-3 h-1.5 w-full bg-blue-500 rounded-full shadow-sm animate-pulse"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                {visibleSubs.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-10">No bills due in {months[currentMonthIndex]}.</p>
                )}
                {visibleSubs.map((sub, i) => {
                  const isdue = selectedDate === Number(sub.due_day);
                  return (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${sub.bg_color} rounded-2xl flex items-center justify-center`}>
                        <img src={sub.icon_url || DEFAULT_ICON} className="w-7 h-7 object-contain" alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{sub.name}</p>
                        <p className="text-xs text-slate-400 font-medium tracking-tight">Due on {months[currentMonthIndex]} {sub.due_day}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg text-slate-900">${sub.amount}</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase">{sub.billing_type}</p>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Card */}
          <div className="bg-[#0A1128] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000"><Sparkles size={150} /></div>
             <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-xl border border-white/20"><Sparkles size={36} className="text-blue-300 animate-bounce" /></div>
                <div className="flex-1 text-center md:text-left">
                   <h4 className="text-2xl font-black mb-2">Smart Cancellation</h4>
                   <p className="text-blue-200/80 text-sm">Save more in <b>{months[currentMonthIndex]}</b> by removing unused subscriptions.</p>
                </div>
                <button
                  className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black shadow-lg active:scale-95 transition-all uppercase tracking-widest"
                  onClick={() => setShowOptimizeModal(true)}
                >
                  Optimize
                </button>
             </div>
          </div>
        </div>

        {/*  Right Side: Summary & Details */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-10">
                <h4 className="text-xl font-black text-slate-900">Active Subs</h4>
                <button
                  onClick={() => {
                    setAddError('');
                    setShowAddModal(true);
                  }}
                  className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Plus size={20}/>
                </button>
             </div>
             
             <div className="space-y-7">
                {subscriptions.map((sub, i) => (
                  <div key={i} className={`flex items-center justify-between group cursor-pointer p-1 rounded-2xl transition-all ${selectedDate === Number(sub.due_day) ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex items-center gap-4">
                       <div className={`w-14 h-14 ${sub.bg_color} rounded-2xl flex items-center justify-center border border-slate-50 shadow-sm transition-transform group-hover:scale-110`}>
                          <img src={sub.icon_url || DEFAULT_ICON} alt={sub.name} className="w-8 h-8 object-contain" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900 text-[15px]">{sub.name}</p>
                          <p className={`text-[10px] font-black uppercase mt-0.5 ${selectedDate === Number(sub.due_day) ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`}>
                             {selectedDate === Number(sub.due_day) ? "Due Today" : `Day ${sub.due_day}`}
                          </p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-slate-900">${sub.amount}</p>
                    </div>
                  </div>
                ))}
             </div>
             <button onClick={openManageBilling} className="w-full mt-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all">Manage Billing</button>
          </div>

          {/*  Summary Total Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-blue-100 font-bold text-[10px] uppercase tracking-widest mb-3">Monthly Commitments</p>
                <h4 className="text-4xl font-black mb-8">${totalMonthly}</h4>
                <div className="flex items-center gap-3 px-5 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                   <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                   <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider italic">Payments Active</span>
                </div>
             </div>
             <CalendarDays size={120} className="absolute bottom-[-30px] right-[-30px] text-white/10 rotate-12" />
          </div>
        </div>

      </div>
          {showAddModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-3xl w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Add Subscription</h3>

          <form onSubmit={handleAddSubscription} className="space-y-4">
              {addError && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {addError}
                </div>
              )}

            <input
              type="text"
              placeholder="Subscription Name"
              className="w-full border rounded-xl p-3"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <input
              type="number"
              placeholder="Amount"
              className="w-full border rounded-xl p-3"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />

            <select
                className="w-full border rounded-xl p-3"
                value={formData.billing_type}
                onChange={e => setFormData({ ...formData, billing_type: e.target.value })}
              >
                <option value="Monthly">Monthly</option>
                <option value="Annual">Annual</option>
              </select>

              {/* ✅ Show due month picker only for Annual */}
              {formData.billing_type === 'Annual' && (
                <select
                  className="w-full border rounded-xl p-3"
                  value={formData.due_month}
                  onChange={e => setFormData({ ...formData, due_month: Number(e.target.value) })}
                >
                  {months.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
              )}

              <input
                type="number"
                placeholder="Due Day (1-31)"
                className="w-full border rounded-xl p-3"
                value={formData.due_day}
                onChange={e => setFormData({ ...formData, due_day: e.target.value })}
                required
              />

            <p className="text-xs text-slate-500 mb-2">
              Choose an icon, enter a custom icon URL, or leave blank to use the default icon.
            </p>
            
            <select
              className="w-full border rounded-xl p-3"
              onChange={(e) => {
                const preset = iconPresets[e.target.value];

                if (preset) {
                  setFormData({
                    ...formData,
                    icon_url: preset.icon_url,
                    bg_color: preset.bg_color
                  });
                }
              }}
            >
              <option value="">Choose a Service (Optional)</option>
              <option value="Netflix">Netflix</option>
              <option value="Spotify">Spotify</option>
              <option value="Google">Google One</option>
              <option value="YouTube">YouTube Premium</option>
              <option value="Amazon">Amazon Prime</option>
            </select>
            <input
              type="text"
              placeholder="Custom Icon URL (optional)"
              className="w-full border rounded-xl p-3"
              value={formData.icon_url}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  icon_url: e.target.value
                })
              }
            />
            <div className="flex justify-center">
              <img
                src={formData.icon_url || DEFAULT_ICON}
                alt="Preview"
                className="w-12 h-12"
              />
            </div>

            

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setAddError('');
                }}
                className="flex-1 py-3 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl"
              >
                Add
              </button>
            </div>

          </form>
        </div>
      </div>
    )}
    {showManageModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-8">
        <div className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-bold">Manage Billing</h3>
              <p className="text-sm text-slate-500">Select a subscription to update details or cancel it.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowManageModal(false)}
              className="px-4 py-2 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 p-6">
            <div className="space-y-3">
              {subscriptions.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-6 text-center text-slate-500">
                  No active subscriptions to manage.
                </div>
              ) : (
                subscriptions.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSelectSubscription(sub)}
                    className={`w-full text-left rounded-3xl p-4 border transition-all ${selectedSub?.id === sub.id ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${sub.bg_color} rounded-2xl flex items-center justify-center`}>
                        <img src={sub.icon_url || DEFAULT_ICON} alt={sub.name} className="w-7 h-7 object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{sub.name}</p>
                        <p className="text-xs text-slate-500">{sub.billing_type} • ${sub.amount}</p>
                        <p className="text-xs text-slate-400">Due {sub.billing_type === 'Annual' ? `${months[sub.due_month]} ${sub.due_day}` : `Day ${sub.due_day}`}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="rounded-3xl bg-slate-50 p-6">
              {selectedSub ? (
                <form onSubmit={handleUpdateSubscription} className="space-y-4">
                  {manageError && (
                    <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                      {manageError}
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">Subscription</label>
                    <input
                      type="text"
                      className="w-full mt-2 rounded-2xl border border-slate-200 p-3"
                      value={manageForm.name}
                      onChange={(e) => setManageForm({ ...manageForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">Amount</label>
                    <input
                      type="number"
                      className="w-full mt-2 rounded-2xl border border-slate-200 p-3"
                      value={manageForm.amount}
                      onChange={(e) => setManageForm({ ...manageForm, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">Billing Type</label>
                    <select
                      className="w-full mt-2 rounded-2xl border border-slate-200 p-3"
                      value={manageForm.billing_type}
                      onChange={(e) => setManageForm({ ...manageForm, billing_type: e.target.value })}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Annual">Annual</option>
                    </select>
                  </div>
                  {manageForm.billing_type === 'Annual' && (
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-500">Due Month</label>
                      <select
                        className="w-full mt-2 rounded-2xl border border-slate-200 p-3"
                        value={manageForm.due_month}
                        onChange={(e) => setManageForm({ ...manageForm, due_month: Number(e.target.value) })}
                      >
                        {months.map((m, i) => (
                          <option key={i} value={i}>{m}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-500">Due Day</label>
                    <input
                      type="number"
                      className="w-full mt-2 rounded-2xl border border-slate-200 p-3"
                      value={manageForm.due_day}
                      onChange={(e) => setManageForm({ ...manageForm, due_day: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleCancelSubscription(selectedSub.id)}
                      className="flex-1 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-400"
                    >
                      Cancel Subscription
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className={`flex-1 py-3 rounded-2xl text-white transition-all ${isUpdating ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
                  <p className="font-bold text-slate-900">Select a subscription</p>
                  <p className="text-sm text-slate-500 mt-2">Choose one from the left to update or cancel it.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    {showOptimizeModal && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-8">
        <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-bold">Smart Cancellation</h3>
              <p className="text-sm text-slate-500">Recommendations to reduce your subscription spend.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowOptimizeModal(false)}
              className="px-4 py-2 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200"
            >
              Close
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Active Subs</p>
                <p className="mt-3 text-3xl font-black text-slate-900">{subscriptions.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Annual Subs</p>
                <p className="mt-3 text-3xl font-black text-slate-900">{annualSubs.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total cost of monthly subs</p>
                <p className="mt-3 text-3xl font-black text-slate-900">${totalMonthlyCommitmentOnly.toFixed(2)}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total cost of annual subs</p>
                <p className="mt-3 text-3xl font-black text-slate-900">${totalAnnual.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold">Recommendations</h4>
                <div className="relative group">
                  <Info size={16} className="text-slate-400 hover:text-slate-700" />
                  <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <p className="font-semibold text-slate-900 mb-2">How recommendations are calculated</p>
                    <ul className="list-disc space-y-1 pl-4">
                      {optimizationTooltipLines.map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="grid gap-4">
                {optimizeRecommendations.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                    No optimization recommendations found right now.
                  </div>
                ) : optimizeRecommendations.map((rec) => (
                  <div key={rec.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{rec.title}</p>
                        <p className="mt-3 text-sm font-semibold text-slate-900">{rec.description}</p>
                      </div>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-700 uppercase tracking-[0.2em]">Review</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{rec.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowOptimizeModal(false);
                  openManageBilling();
                }}
                className="w-full md:w-auto rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-500"
              >
                Review Subscriptions
              </button>
              <button
                type="button"
                onClick={() => setShowOptimizeModal(false)}
                className="w-full md:w-auto rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </DashboardLayout>
  );
};

export default Bills;