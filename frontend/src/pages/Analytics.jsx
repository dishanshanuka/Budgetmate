// frontend/src/pages/Analytics.jsx
// REPLACES existing Analytics.jsx — wires all charts to real backend data
import { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line,
} from 'recharts';
import { Filter, Download, ArrowUpRight, Sparkles, ChevronDown, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { fetchAnalyticsSummary, exportAnalyticsPDF } from '../services/analyticsService';

const PERIOD_MAP = { '30': 'daily', '90': 'weekly', 'year': 'monthly' };

// ── Small helpers ──────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const SummaryCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-black text-slate-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const Analytics = () => {
  const { darkMode } = useTheme();
  const [timeRange, setTimeRange]         = useState('year');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen]   = useState(false);

  // Data
  const [chartData, setChartData]   = useState([]);
  const [pieData, setPieData]       = useState([]);
  const [summary, setSummary]       = useState({ total_income: 0, total_expense: 0, net_savings: 0 });
  const [categories, setCategories] = useState(['All']);

  // UI
  const [isLoading, setIsLoading]     = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError]             = useState(null);

  // ── Fetch on mount and whenever period changes ───────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const period = PERIOD_MAP[timeRange];
        const result = await fetchAnalyticsSummary(period);

        setChartData(result.chart_data  || []);
        setPieData(result.pie_data      || []);
        setSummary(result.summary       || { total_income: 0, total_expense: 0, net_savings: 0 });

        // Build category list from pie data
        const cats = ['All', ...(result.pie_data || []).map((d) => d.name)];
        setCategories(cats);
        setSelectedCategory('All'); // reset filter on period change
      } catch (err) {
        console.error('[Analytics] Fetch failed:', err);
        setError('Could not load analytics data. Please check you are logged in.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [timeRange]);

  // ── PDF Export ────────────────────────────────────────────────────────────
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAnalyticsPDF();
    } catch (err) {
      console.error('[Analytics] Export failed:', err);
      alert('PDF export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // ── Savings trend label ──────────────────────────────────────────────────
  const savingsPositive = summary.net_savings >= 0;

  return (
    <DashboardLayout title="Detailed Analytics">

      {/* ── Top Controls ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 mb-8">

        {/* Time Range */}
        <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none">
          {['30', '90', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 dark:shadow-none'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {range === 'year' ? 'Yearly' : `${range} Days`}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          {/* Category filter */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-605 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Filter size={16} />
              {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
              <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-2xl z-50 py-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setIsFilterOpen(false); }}
                    className={`w-full text-left px-5 py-3 text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export PDF */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0A1128] dark:bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-blue-750 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          >
            <Download size={16} />
            {isExporting ? 'Generating PDF…' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* ── Error Banner ────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-6 px-5 py-4 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-2xl text-xs font-bold text-red-600 dark:text-red-400 animate-in fade-in">
          ⚠️ {error}
        </div>
      )}

      {/* ── Summary Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <SummaryCard label="Total Income"   value={fmt(summary.total_income)}  icon={TrendingUp}   color="bg-green-500" />
        <SummaryCard label="Total Expenses" value={fmt(summary.total_expense)} icon={TrendingDown}  color="bg-red-500" />
        <SummaryCard label="Net Savings"    value={fmt(summary.net_savings)}   icon={Wallet}        color={savingsPositive ? 'bg-blue-600' : 'bg-orange-500'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Bar Chart: Income vs Expense ──────────────────────────────── */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
            <h4 className="text-xl font-black text-slate-900 dark:text-white">Financial Overview</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#0A1128] dark:bg-blue-300 rounded-full" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-[250px] sm:h-[350px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold text-slate-400">Loading your data…</span>
                </div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-300 dark:text-slate-700 text-sm font-bold">
                No transactions found for this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#f1f5f9'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: darkMode ? '#64748b' : '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: darkMode ? '#64748b' : '#94a3b8' }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    cursor={{ fill: darkMode ? '#1e293b' : '#f8faff' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    formatter={(value, name) => [fmt(value), name === 'income' ? 'Income' : 'Expense']}
                  />
                  <Bar dataKey="income"  fill={darkMode ? '#60a5fa' : '#0A1128'} radius={[6,6,0,0]} barSize={18}
                       hide={selectedCategory !== 'All'} />
                  <Bar dataKey="expense" fill="#3b82f6" radius={[6,6,0,0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Pie Chart: Spending by Category ──────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none">
          <h4 className="text-xl font-black text-slate-900 dark:text-white mb-8">Spending by Category</h4>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : pieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-300 dark:text-slate-700 text-xs font-bold">No expense data.</div>
          ) : (
            <>
              <div className="h-64 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={entry.color}
                          opacity={selectedCategory === 'All' || selectedCategory === entry.name ? 1 : 0.15}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000' }}
                      formatter={(value) => [fmt(value)]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {pieData.map((item, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center p-3 rounded-2xl transition-all ${
                      selectedCategory === item.name 
                        ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate max-w-[100px]">{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white">{fmt(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Line Chart: Savings Trajectory ───────────────────────────── */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-black text-slate-900 dark:text-white">Income Trend</h4>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              savingsPositive ? 'bg-green-50 dark:bg-green-950/20 text-green-600' : 'bg-red-50 dark:bg-red-950/20 text-red-500'
            }`}>
              {savingsPositive ? '▲' : '▼'} Net: {fmt(summary.net_savings)}
            </span>
          </div>

          <div className="h-[250px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-300 dark:text-slate-700 text-xs font-bold">No data.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#f1f5f9'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: darkMode ? '#64748b' : '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: darkMode ? '#64748b' : '#94a3b8' }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value, name) => [fmt(value), name === 'income' ? 'Income' : 'Expense']}
                  />
                  <Line type="monotone" dataKey="income"  stroke="#2563eb" strokeWidth={3}
                    dot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={3}
                    dot={{ r: 5, fill: '#f87171', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── AI Insight Card ───────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-[#0A1128] to-blue-900 dark:from-slate-900 dark:to-blue-950 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-xl flex flex-col justify-between group overflow-hidden relative border border-transparent dark:border-slate-800">
          <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:scale-150 transition-transform duration-700">
            <Sparkles size={150} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
              <ArrowUpRight size={24} className="text-blue-300" />
            </div>
            <h4 className="text-xl font-bold mb-4 tracking-tight">Smart Savings Insight</h4>
            <p className="text-blue-100/70 text-sm leading-relaxed font-medium">
              {summary.total_expense > 0
                ? `Your biggest spending category this month is `
                : 'Add some transactions to unlock AI insights about your spending habits.'}
              {pieData[0] && summary.total_expense > 0 && (
                <>
                  <span className="text-white font-bold">{pieData[0].name}</span>
                  {` at `}
                  <span className="text-white font-bold">{fmt(pieData[0].value)}</span>.
                  {` Review it to find savings opportunities.`}
                </>
              )}
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all mt-8 relative z-10 active:scale-95 shadow-lg shadow-blue-900/50 disabled:opacity-60 cursor-pointer"
          >
            {isExporting ? 'Generating PDF…' : 'Download PDF Report'}
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Analytics;