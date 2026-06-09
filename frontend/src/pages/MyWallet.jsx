import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Landmark, Wallet, Plus, X, Loader2, Trash2, Pencil, CreditCard } from 'lucide-react';

const API = "http://localhost:8000";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const colorOptions = [
  { label: "Blue",   value: "bg-blue-600"    },
  { label: "Dark",   value: "bg-slate-900"   },
  { label: "Green",  value: "bg-emerald-600" },
  { label: "Purple", value: "bg-purple-600"  },
  { label: "Rose",   value: "bg-rose-600"    },
  { label: "Amber",  value: "bg-amber-600"   },
];

const accountTypes = ["Checking", "Savings", "Credit Card", "Investment", "Cash"];
const networkTypes = ["Visa", "Mastercard", "Amex"];
const cardTypes    = ["Debit", "Credit"];

const emptyForm = {
  account_name: "",
  account_type: "Checking",
  balance: "",
  card_number: "",
  expiry_date: "",
  cvv: "",
  card_network: "Visa",
  card_type: "Debit",
  color_theme: "bg-blue-600",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCardNumber = (raw, network) => {
  const digits = raw.replace(/\D/g, "");
  if (network === "Amex") {
    const d = digits.slice(0, 15);
    return d.replace(/^(\d{0,4})(\d{0,6})(\d{0,5})$/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(" ")
    );
  }
  return digits.slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
};

const formatExpiry = (raw) => {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 2) {
    let mm = parseInt(digits, 10);
    if (digits.length === 2) {
      if (mm < 1) mm = 1;
      if (mm > 12) mm = 12;
      return String(mm).padStart(2, "0");
    }
    return digits;
  }
  let mm = parseInt(digits.slice(0, 2), 10);
  if (mm < 1) mm = 1;
  if (mm > 12) mm = 12;
  return String(mm).padStart(2, "0") + "/" + digits.slice(2, 4);
};

const isExpiryValid = (val) => {
  if (val.length !== 5) return true; // only validate when complete
  const [m, y] = val.split("/").map(Number);
  const now = new Date();
  const cy = now.getFullYear() % 100;
  const cm = now.getMonth() + 1;
  return m >= 1 && m <= 12 && (y > cy || (y === cy && m >= cm));
};

const cvvLength = (network) => (network === "Amex" ? 4 : 3);

// ─── Network Logo ─────────────────────────────────────────────────────────────
const NetworkLogo = ({ network, size = "sm" }) => {
  const base = size === "lg" ? "text-sm px-3 py-1" : "text-[10px] px-2 py-0.5";
  if (network === "Visa") {
    return (
      <span className={`font-black italic tracking-tighter text-white/90 ${size === "lg" ? "text-xl" : "text-sm"}`}>
        VISA
      </span>
    );
  }
  if (network === "Mastercard") {
    return (
      <svg width={size === "lg" ? 44 : 32} height={size === "lg" ? 28 : 20} viewBox="0 0 44 28">
        <circle cx="16" cy="14" r="13" fill="#eb001b" opacity="0.9" />
        <circle cx="28" cy="14" r="13" fill="#f79e1b" opacity="0.9" />
        <path d="M22 5.3a13 13 0 0 1 0 17.4A13 13 0 0 1 22 5.3z" fill="#ff5f00" opacity="0.85" />
      </svg>
    );
  }
  return (
    <span className={`font-black tracking-widest text-white/90 ${size === "lg" ? "text-sm" : "text-[10px]"}`}>
      AMEX
    </span>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const MyWallet = () => {
  const [accounts, setAccounts]       = useState([]);
  const [selectedAcc, setSelectedAcc] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const [modalMode, setModalMode]   = useState(null);
  const [editingId, setEditingId]   = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState(null);
  const [expiryError, setExpiryError] = useState(false);

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchAccounts = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/accounts/`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to load accounts");
      const data = await res.json();
      setAccounts(data);
      setSelectedAcc(0);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const netWorth = accounts
    .reduce((sum, a) => sum + parseFloat(a.balance || 0), 0)
    .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ── modals ─────────────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm); setEditingId(null);
    setFormError(null); setExpiryError(false); setModalMode("add");
  };

  const openEdit = (e, acc) => {
    e.stopPropagation();
    setForm({
      account_name: acc.account_name,
      account_type: acc.account_type,
      balance:      acc.balance,
      card_number:  acc.card_number  || "",
      expiry_date:  acc.expiry_date  || "",
      cvv:          "",
      card_network: acc.card_network || "Visa",
      card_type:    acc.card_type    || "Debit",
      color_theme:  acc.color_theme  || "bg-blue-600",
    });
    setEditingId(acc.id);
    setFormError(null); setExpiryError(false);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null); setEditingId(null);
    setFormError(null); setExpiryError(false);
  };

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (expiryError) { setFormError("Please enter a valid expiry date."); return; }
    setSubmitting(true); setFormError(null);
    try {
      const isEdit = modalMode === "edit";
      const url    = isEdit ? `${API}/accounts/${editingId}` : `${API}/accounts/`;
      const method = isEdit ? "PUT" : "POST";

      // strip spaces from card number before sending
      const payload = {
        ...form,
        balance:     parseFloat(form.balance) || 0,
        card_number: form.card_number.replace(/\s/g, ""),
      };
      // don't send cvv to backend (or send if your API accepts it)
      delete payload.cvv;

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Request failed");
      }
      closeModal();
      await fetchAccounts();
    } catch (e) { setFormError(e.message); }
    finally { setSubmitting(false); }
  };

  // ── delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (e, accountId) => {
    e.stopPropagation();
    if (!window.confirm("Remove this account?")) return;
    try {
      await fetch(`${API}/accounts/${accountId}`, { method: "DELETE", headers: authHeaders() });
      setAccounts(prev => prev.filter(a => a.id !== accountId));
      setSelectedAcc(0);
    } catch { alert("Could not delete account."); }
  };

  // ── form field helpers ─────────────────────────────────────────────────────
  const handleCardNumberChange = (e) => {
    const fmt = formatCardNumber(e.target.value, form.card_network);
    setForm({ ...form, card_number: fmt });
  };

  const handleExpiryChange = (e) => {
    const fmt = formatExpiry(e.target.value);
    setForm({ ...form, expiry_date: fmt });
    setExpiryError(fmt.length === 5 && !isExpiryValid(fmt));
  };

  const handleCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, cvvLength(form.card_network));
    setForm({ ...form, cvv: val });
  };

  const handleNetworkChange = (network) => {
    // re-format existing number for new network
    const rawDigits = form.card_number.replace(/\s/g, "");
    setForm({
      ...form,
      card_network: network,
      card_number: formatCardNumber(rawDigits, network),
      cvv: form.cvv.slice(0, cvvLength(network)),
    });
  };

  const selected = accounts[selectedAcc] || null;
  const isEdit   = modalMode === "edit";

  return (
    <DashboardLayout title="My Wallet">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Left ──────────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-10">

          {/* visual card row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-700">
            {loading ? (
              <div className="h-64 bg-slate-100 rounded-[3rem] flex items-center justify-center">
                <Loader2 className="animate-spin text-slate-400" size={32} />
              </div>
            ) : selected ? (
              <div className="relative group/card">
                <VisualCard
                  name="Dishan Shanuka"
                  number={selected.card_number || ""}
                  exp={selected.expiry_date || "--/--"}
                  network={selected.card_network || "Visa"}
                  cardType={selected.card_type || "Debit"}
                  balance={parseFloat(selected.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  color={selected.color_theme || "bg-blue-600"}
                />
                <button
                  onClick={(e) => openEdit(e, selected)}
                  className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2.5 rounded-2xl"
                >
                  <Pencil size={16} />
                </button>
              </div>
            ) : (
              <div className="h-64 bg-slate-100 rounded-[3rem] flex items-center justify-center text-slate-400 text-sm font-medium">
                No accounts yet
              </div>
            )}

            <div
              onClick={openAdd}
              className="border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-slate-400 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer group bg-slate-50/30"
            >
              <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform mb-4">
                <Plus size={32} />
              </div>
              <p className="font-black text-[10px] uppercase tracking-[0.2em]">Add New Card</p>
            </div>
          </div>

          {/* linked accounts list */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900">Linked Accounts</h3>
              <button onClick={openAdd} className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                <Plus size={16} /> Add Account
              </button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-slate-300" size={28} />
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-10">
                <p className="text-red-400 text-sm font-medium mb-4">{error}</p>
                <button onClick={fetchAccounts} className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">Retry</button>
              </div>
            )}

            {!loading && !error && accounts.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Wallet size={40} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm font-medium">No accounts linked yet.</p>
                <button onClick={openAdd} className="mt-4 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                  Add your first account
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-4">
                {accounts.map((acc, i) => (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAcc(i)}
                    className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all cursor-pointer group ${
                      selectedAcc === i
                        ? "border-blue-600 bg-blue-50/30 shadow-lg shadow-blue-50"
                        : "border-slate-50 hover:border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${acc.color_theme || "bg-blue-600"} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100/20 group-hover:rotate-6 transition-transform`}>
                        <Landmark size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{acc.account_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{acc.account_type}</p>
                          {acc.card_network && (
                            <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">
                              {acc.card_network} · {acc.card_type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-black text-slate-900">
                          ${parseFloat(acc.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedAcc === i ? "text-blue-600" : "text-green-500"}`}>
                          {selectedAcc === i ? "Selected" : "Active"}
                        </p>
                      </div>
                      <button
                        onClick={(e) => openEdit(e, acc)}
                        className="p-2 rounded-xl text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, acc.id)}
                        className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right ─────────────────────────────────────────────────────────── */}
        <div className="space-y-8">
          <div className="bg-[#0A1128] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <p className="text-blue-300 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">Net Worth</p>
            <h4 className="text-4xl font-black mb-8 tracking-tighter">${netWorth}</h4>
            <div className="space-y-4 relative z-10">
              <SummaryItem label="Total Accounts" amount={accounts.length.toString()} up />
              <SummaryItem
                label="Avg Balance"
                amount={accounts.length
                  ? `$${(accounts.reduce((s, a) => s + parseFloat(a.balance), 0) / accounts.length).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                  : "$0"}
              />
            </div>
            <Wallet size={120} className="absolute bottom-[-30px] right-[-30px] text-white/5 rotate-12" />
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center relative overflow-hidden group">
            <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform">
              <Wallet className="text-blue-600" size={32} />
            </div>
            <h4 className="font-black text-slate-900 mb-3 tracking-tight">Savings Optimization</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Switching your <span className="text-blue-600 font-bold">{selected?.account_name || "primary"}</span> funds to a High-Yield account could earn you <span className="font-bold text-slate-900">$45/mo</span> extra.
            </p>
            <button className="mt-8 w-full py-4 bg-slate-50 hover:bg-[#0A1128] hover:text-white text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              Explore Options
            </button>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ──────────────────────────────────────────────────── */}
      {modalMode && (
        <div className="fixed inset-0 bg-[#0A1128]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300 relative max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
              <X size={24} />
            </button>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {isEdit ? "Edit Account" : "Add New Card"}
            </h3>
            <p className="text-sm text-slate-400 font-medium mb-8">
              {isEdit ? "Update your account details below." : "Link your account to BudgetMate."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Account Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Name</label>
                <input
                  type="text" required placeholder="e.g. Chase Bank"
                  value={form.account_name}
                  onChange={e => setForm({ ...form, account_name: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Type</label>
                <select
                  value={form.account_type}
                  onChange={e => setForm({ ...form, account_type: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 transition-all"
                >
                  {accountTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Balance */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Balance ($)</label>
                <input
                  type="number" step="0.01" min="0" placeholder="0.00"
                  value={form.balance}
                  onChange={e => setForm({ ...form, balance: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>

              {/* Card Network */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Network</label>
                <div className="flex gap-3">
                  {networkTypes.map(n => (
                    <button
                      key={n} type="button"
                      onClick={() => handleNetworkChange(n)}
                      className={`flex-1 py-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${
                        form.card_network === n
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                          : "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Type</label>
                <div className="flex gap-3">
                  {cardTypes.map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => setForm({ ...form, card_type: t })}
                      className={`flex-1 py-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all ${
                        form.card_type === t
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                          : "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Number */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={form.card_network === "Amex" ? "3782 800000 12345" : "1234 5678 9012 3456"}
                    value={form.card_number}
                    maxLength={form.card_network === "Amex" ? 17 : 19}
                    onChange={handleCardNumberChange}
                    className="w-full px-6 py-4 pr-14 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 tracking-widest focus:outline-none focus:border-blue-600 transition-all"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <CreditCard size={18} className="text-slate-300" />
                  </div>
                </div>
              </div>

              {/* Expiry + CVV */}
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={form.expiry_date}
                    onChange={handleExpiryChange}
                    className={`w-full px-6 py-4 bg-slate-50 border rounded-2xl text-sm font-bold text-slate-900 focus:outline-none transition-all ${
                      expiryError ? "border-red-400 focus:border-red-500" : "border-slate-100 focus:border-blue-600"
                    }`}
                  />
                  {expiryError && (
                    <p className="text-red-400 text-[10px] font-bold ml-1">Card has expired</p>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {form.card_network === "Amex" ? "CID (4 digits)" : "CVV (3 digits)"}
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    placeholder={form.card_network === "Amex" ? "••••" : "•••"}
                    maxLength={cvvLength(form.card_network)}
                    value={form.cvv}
                    onChange={handleCvvChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* Card Color */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Color</label>
                <div className="flex gap-3">
                  {colorOptions.map(c => (
                    <button
                      key={c.value} type="button"
                      onClick={() => setForm({ ...form, color_theme: c.value })}
                      className={`w-10 h-10 rounded-2xl ${c.value} transition-all ${
                        form.color_theme === c.value
                          ? "ring-2 ring-offset-2 ring-blue-600 scale-110"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div className="pt-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3">Preview</p>
                <VisualCard
                  name="Dishan Shanuka"
                  number={form.card_number}
                  exp={form.expiry_date || "MM/YY"}
                  network={form.card_network}
                  cardType={form.card_type}
                  balance={parseFloat(form.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  color={form.color_theme}
                  compact
                />
              </div>

              {formError && <p className="text-red-500 text-xs font-bold text-center">{formError}</p>}

              <button
                type="submit" disabled={submitting}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting
                  ? <><Loader2 size={16} className="animate-spin" /> Saving...</>
                  : isEdit ? "Save Changes" : "Link Card Now"
                }
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// ─── Visual Card ──────────────────────────────────────────────────────────────
const VisualCard = ({ name, number, exp, network = "Visa", cardType = "Debit", balance, color, compact = false }) => {
  const displayNumber = number
    ? number
    : network === "Amex"
      ? "•••• •••••• •••••"
      : "•••• •••• •••• ••••";

  return (
    <div className={`${color} ${compact ? "h-36 rounded-[2rem] p-7" : "h-64 rounded-[3rem] p-10"} text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group transition-all duration-500`}>
      {/* decorative circle */}
      <div className={`absolute top-0 right-0 ${compact ? "p-8" : "p-10"} opacity-20`}>
        <div className={`${compact ? "w-24 h-24 -mr-12 -mt-12" : "w-32 h-32 -mr-16 -mt-16"} bg-white rounded-full group-hover:scale-110 transition-transform duration-700`} />
      </div>

      {/* top row */}
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <p className={`font-bold text-white/60 uppercase tracking-[0.2em] ${compact ? "text-[8px]" : "text-[10px]"}`}>Balance</p>
          <p className={`font-black tracking-tighter ${compact ? "text-xl" : "text-3xl"}`}>${balance}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-xl">
            <span className={`font-black uppercase tracking-widest ${compact ? "text-[9px]" : "text-[10px]"}`}>{cardType}</span>
          </div>
        </div>
      </div>

      {/* bottom */}
      <div className="relative z-10">
        <p className={`font-medium tracking-[0.25em] ${compact ? "text-sm mb-3" : "text-xl mb-6"}`}>{displayNumber}</p>
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className={`font-black text-white/50 uppercase tracking-widest ${compact ? "text-[7px]" : "text-[8px]"}`}>Card Holder</p>
            <p className={`font-black uppercase tracking-tight ${compact ? "text-[10px]" : "text-xs"}`}>{name}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className={`font-black text-white/50 uppercase tracking-widest ${compact ? "text-[7px]" : "text-[8px]"}`}>Expires</p>
            <p className={`font-black tracking-tight ${compact ? "text-[10px]" : "text-xs"}`}>{exp}</p>
          </div>
        </div>
      </div>

      {/* network logo */}
      <div className="absolute bottom-5 right-6 z-10">
        {network === "Visa" && (
          <span className={`font-black italic tracking-tighter text-white/80 ${compact ? "text-base" : "text-xl"}`}>VISA</span>
        )}
        {network === "Mastercard" && (
          <svg width={compact ? 32 : 44} height={compact ? 20 : 28} viewBox="0 0 44 28">
            <circle cx="16" cy="14" r="13" fill="#eb001b" opacity="0.9" />
            <circle cx="28" cy="14" r="13" fill="#f79e1b" opacity="0.9" />
            <path d="M22 5.3a13 13 0 0 1 0 17.4A13 13 0 0 1 22 5.3z" fill="#ff5f00" opacity="0.85" />
          </svg>
        )}
        {network === "Amex" && (
          <span className={`font-black tracking-widest text-white/80 ${compact ? "text-[10px]" : "text-sm"}`}>AMEX</span>
        )}
      </div>
    </div>
  );
};

// ─── Summary Item ─────────────────────────────────────────────────────────────
const SummaryItem = ({ label, amount, up }) => (
  <div className="flex justify-between items-center bg-white/5 p-5 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors">
    <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">{label}</span>
    <span className={`text-sm font-black ${up ? "text-emerald-400" : "text-red-400"}`}>{amount}</span>
  </div>
);

export default MyWallet;