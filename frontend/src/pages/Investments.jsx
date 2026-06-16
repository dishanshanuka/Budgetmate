import API from '../services/api';
import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { ArrowUpRight, Plus, X, Loader2, Pencil, Trash2, TrendingUp, TrendingDown, Briefcase, DollarSign, Percent } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

const assetTypes = ["Stock", "Crypto", "ETF", "Mutual Fund", "Real Estate", "Other"];

const emptyForm = {
  asset_name: "",
  asset_type: "Stock",
  current_value: "",
  growth_percentage: "",
};

const Investments = () => {
  const [timeframe, setTimeframe] = useState('1W');
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  // Asset States
  const [assets, setAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal States
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // FETCH PERFORMANCE HISTORY
  const fetchHistory = async (selectedTimeframe) => {
    setChartLoading(true);
    try {
      const res = await API.get(
        `/investments/history?timeframe=${selectedTimeframe}`
      );
      const formatted = res.data.map(item => ({
        name: item.record_date.split(' ')[0], // show only date part
        value: item.portfolio_value
      }));
      setChartData(formatted);
      setTimeframe(selectedTimeframe);
    } catch (error) {
      console.error("API Error history:", error);
    } finally {
      setChartLoading(false);
    }
  };

  // FETCH ACTIVE ASSETS
  const fetchAssets = async () => {
    setAssetsLoading(true);
    setError(null);
    try {
      const res = await API.get('/investments/assets');
      setAssets(res.data);
    } catch (err) {
      setError("Failed to load investment assets.");
      console.error("API Error assets:", err);
    } finally {
      setAssetsLoading(false);
    }
  };

  // LOAD DEFAULT DATA
  useEffect(() => {
    fetchHistory("1W");
    fetchAssets();
  }, []);

  // CALCULATE TOTALS
  const totalPortfolioValue = assets.reduce((sum, a) => sum + parseFloat(a.current_value || 0), 0);
  const avgGrowth = assets.length 
    ? (assets.reduce((sum, a) => sum + parseFloat(a.growth_percentage || 0), 0) / assets.length)
    : 0;

  // MODAL ACTIONS
  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormError(null);
    setModalMode("add");
  };

  const openEdit = (asset) => {
    setForm({
      asset_name: asset.asset_name,
      asset_type: asset.asset_type,
      current_value: asset.current_value,
      growth_percentage: asset.growth_percentage,
    });
    setEditingId(asset.id);
    setFormError(null);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
    setFormError(null);
  };

  // SUBMIT ASSET FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.asset_name.trim()) {
      setFormError("Asset name is required.");
      return;
    }
    setSubmitting(true);
    setFormError(null);

    const payload = {
      asset_name: form.asset_name.trim(),
      asset_type: form.asset_type,
      current_value: parseFloat(form.current_value) || 0,
      growth_percentage: parseFloat(form.growth_percentage) || 0,
    };

    try {
      const isEdit = modalMode === "edit";
      const url = isEdit ? `/investments/assets/${editingId}` : '/investments/assets';
      const method = isEdit ? 'put' : 'post';

      await API[method](url, payload);
      
      closeModal();
      await fetchAssets();
      await fetchHistory(timeframe); // update graph
    } catch (err) {
      setFormError(err.response?.data?.detail || "Request failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE ASSET
  const handleDelete = async (assetId) => {
    if (!window.confirm("Are you sure you want to remove this asset?")) return;
    try {
      await API.delete(`/investments/assets/${assetId}`);
      await fetchAssets();
      await fetchHistory(timeframe); // update graph
    } catch (err) {
      alert("Could not delete asset.");
    }
  };

  return (
    <DashboardLayout title="Investments">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

        {/* ── Left Side: Chart and Asset List ────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-10">

          {/* Chart Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Portfolio Performance</h2>
                <p className="text-xs text-slate-400 dark:text-slate-505 font-bold mt-0.5 uppercase tracking-wider">Historical net asset growth</p>
              </div>

              {/* TIMEFRAME BUTTONS */}
              <div className="flex gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700">
                {['1W', '1M', '1Y'].map((t) => (
                  <button
                    key={t}
                    onClick={() => fetchHistory(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      timeframe === t
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* LINE CHART */}
            <div className="h-56 sm:h-80 relative flex items-center justify-center">
              {chartLoading ? (
                <Loader2 className="animate-spin text-slate-300" size={32} />
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ background: '#0A1128', border: 'none', borderRadius: '1.5rem', color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                      formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, "Portfolio Value"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      strokeWidth={4}
                      dot={{ r: 4, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
                      activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm font-medium text-slate-400">No history data available.</p>
              )}
            </div>
          </div>

          {/* Active Assets Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Portfolio Assets</h3>
                <p className="text-xs text-slate-400 dark:text-slate-505 font-bold mt-0.5 uppercase tracking-wider">All linked active allocations</p>
              </div>
              <button 
                onClick={openAdd} 
                className="text-blue-600 dark:text-blue-405 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 px-4 py-2.5 rounded-xl border border-blue-100/50 dark:border-blue-900/30"
              >
                <Plus size={16} /> Add Asset
              </button>
            </div>

            {assetsLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-slate-300 dark:text-slate-650" size={28} />
              </div>
            )}

            {!assetsLoading && error && (
              <div className="text-center py-10">
                <p className="text-red-400 text-sm font-medium mb-4">{error}</p>
                <button onClick={fetchAssets} className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest hover:underline">Retry</button>
              </div>
            )}

            {!assetsLoading && !error && assets.length === 0 && (
              <div className="text-center py-12 text-slate-400 dark:text-slate-550">
                <Briefcase size={40} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm font-medium">No assets in your portfolio yet.</p>
                <button onClick={openAdd} className="mt-4 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest hover:underline">
                  Add your first asset
                </button>
              </div>
            )}

            {!assetsLoading && !error && assets.length > 0 && (
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-50 dark:border-slate-850 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-lg hover:shadow-slate-100/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-md shadow-blue-100/10 dark:shadow-none group-hover:rotate-6 transition-transform">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{asset.asset_name}</p>
                        <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-lg">
                          {asset.asset_type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-black text-slate-900 dark:text-white">
                          ${parseFloat(asset.current_value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          {asset.growth_percentage >= 0 ? (
                            <TrendingUp size={12} className="text-emerald-500" />
                          ) : (
                            <TrendingDown size={12} className="text-rose-500" />
                          )}
                          <span className={`text-[10px] font-black tracking-wider uppercase ${asset.growth_percentage >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {asset.growth_percentage >= 0 ? '+' : ''}{asset.growth_percentage.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 border-l pl-3 border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => openEdit(asset)}
                          className="p-2 rounded-xl text-slate-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Side: Portfolio Summary Cards ────────────────────────────── */}
        <div className="space-y-8">
          
          {/* Net Worth Summary */}
          <div className="bg-[#0A1128] rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
            <p className="text-blue-300 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Total Investments</p>
            <h4 className="text-2xl sm:text-4xl font-black mb-6 sm:mb-8 tracking-tighter">
              ${totalPortfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h4>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center bg-white/5 p-5 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Total Assets</span>
                <span className="text-sm font-black text-white">{assets.length}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-5 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Avg Growth Rate</span>
                <span className={`text-sm font-black ${avgGrowth >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {avgGrowth >= 0 ? '+' : ''}{avgGrowth.toFixed(2)}%
                </span>
              </div>
            </div>
            <Briefcase size={120} className="absolute bottom-[-30px] right-[-30px] text-white/5 rotate-12" />
          </div>

          {/* Allocation Tip Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm text-center relative overflow-hidden group">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/30 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
              <ArrowUpRight className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <h4 className="font-black text-slate-900 dark:text-white mb-3 tracking-tight">Portfolio Optimization</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Based on modern portfolio theory, holding multiple asset classes (Stocks, Crypto, ETFs) can help hedge against volatility.
            </p>
            <button 
              onClick={openAdd}
              className="mt-8 w-full py-4 bg-slate-50 dark:bg-slate-800 hover:bg-[#0A1128] dark:hover:bg-[#0A1128] hover:text-white dark:hover:text-white text-slate-600 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Link New Asset
            </button>
          </div>
        </div>
      </div>

      {/* -- Add / Edit Modal -------------------------------------------------- */}
      {modalMode && (
        <div className="fixed inset-0 bg-[#0A1128]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-[1.5rem] sm:rounded-[3rem] p-5 sm:p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 relative max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
            <button onClick={closeModal} className="absolute top-8 right-8 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <X size={24} />
            </button>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {modalMode === 'edit' ? "Edit Asset" : "Add New Asset"}
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-505 font-medium mb-8">
              {modalMode === 'edit' ? "Update asset holdings and performance." : "Add a stock, crypto token, or fund to tracker."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Asset Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Asset Name</label>
                <div className="relative">
                  <input
                    type="text" required placeholder="e.g. Apple Stock, Bitcoin"
                    value={form.asset_name}
                    onChange={e => setForm({ ...form, asset_name: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* Asset Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Asset Type</label>
                <select
                  value={form.asset_type}
                  onChange={e => setForm({ ...form, asset_type: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 transition-all"
                >
                  {assetTypes.map(t => <option key={t} value={t} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t}</option>)}
                </select>
              </div>

              {/* Current Value */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Value ($)</label>
                <div className="relative">
                  <input
                    type="number" step="0.01" min="0" required placeholder="0.00"
                    value={form.current_value}
                    onChange={e => setForm({ ...form, current_value: e.target.value })}
                    className="w-full px-6 py-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 transition-all"
                  />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550 font-bold text-sm">
                    <DollarSign size={16} />
                  </div>
                </div>
              </div>

              {/* Growth Percentage */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Growth rate (%)</label>
                <div className="relative">
                  <input
                    type="number" step="0.01" required placeholder="0.00"
                    value={form.growth_percentage}
                    onChange={e => setForm({ ...form, growth_percentage: e.target.value })}
                    className="w-full px-6 py-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 transition-all"
                  />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-550 font-bold text-sm">
                    <Percent size={16} />
                  </div>
                </div>
              </div>

              {formError && (
                <p className="text-red-500 text-xs font-bold text-center">{formError}</p>
              )}

              <button
                type="submit" disabled={submitting}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting
                  ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
                  : modalMode === 'edit' ? "Save Changes" : "Link Asset Now"
                }
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Investments;