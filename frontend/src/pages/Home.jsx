import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  MoveRight, 
  User, 
  LogOut, 
  Wallet, 
  TrendingUp, 
  Bell, 
  Calendar, 
  ChevronDown, 
  Check, 
  Star, 
  Shield, 
  HelpCircle, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Layers,
  Search,
  DollarSign
} from 'lucide-react';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import VerifyOTP from './VerifyOTP';
import API from '../services/api';

/* ─────────────────────────────────────────────
   ANIMATION HOOK: triggers when element enters viewport
───────────────────────────────────────────── */
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.15, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
const AnimatedCounter = ({ target, suffix = '', duration = 1800 }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();

  useEffect(() => {
    if (!inView) return;
    const isFloat = target.toString().includes('.');
    const numericTarget = parseFloat(target);
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericTarget * eased;
      setCount(isFloat ? current.toFixed(1) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ─────────────────────────────────────────────
   FADE-IN WRAPPER (scroll-triggered)
───────────────────────────────────────────── */
const FadeIn = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const [ref, inView] = useInView();
  const dirMap = { up: 'translateY(28px)', down: 'translateY(-28px)', left: 'translateX(28px)', right: 'translateX(-28px)', none: 'none' };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : dirMap[direction] || dirMap.up,
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────
   STAGGERED CHILDREN WRAPPER
───────────────────────────────────────────── */
const StaggerParent = ({ children, className = '', baseDelay = 0, stagger = 100 }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(24px)',
                transition: `opacity 0.55s ease ${baseDelay + i * stagger}ms, transform 0.55s ease ${baseDelay + i * stagger}ms`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
};

/* ─────────────────────────────────────────────
   HOME COMPONENT
───────────────────────────────────────────── */
const Home = () => {
  // --- States ---
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('token')));
  const [userName] = useState(() => localStorage.getItem('userName') || "User");
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem('profilePhoto') || '');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [activeTab, setActiveTab] = useState('wallet');
  const [activeFaq, setActiveFaq] = useState(null);

  // Navbar scroll shrink
  const [scrolled, setScrolled] = useState(false);
  // Hero mount animation
  const [heroVisible, setHeroVisible] = useState(false);
  // Tab change animation key
  const [tabKey, setTabKey] = useState(0);

  useEffect(() => {
    // Trigger hero animation on mount
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!localStorage.getItem('token')) return;
      try {
        const { data } = await API.get('/settings/profile');
        if (data?.full_name) localStorage.setItem('userName', data.full_name);
        if (data?.profile_photo) {
          localStorage.setItem('profilePhoto', data.profile_photo);
          setProfilePhoto(data.profile_photo);
        }
      } catch {
        setProfilePhoto(localStorage.getItem('profilePhoto') || '');
      }
    };
    void loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('profilePhoto');
    setIsLoggedIn(false);
    setProfilePhoto('');
    window.location.reload();
  };

  // --- Modal Switchers ---
  const switchToRegister = () => { setIsLoginOpen(false); setIsForgotOpen(false); setIsVerifyOpen(false); setIsRegisterOpen(true); };
  const switchToLogin    = () => { setIsRegisterOpen(false); setIsForgotOpen(false); setIsVerifyOpen(false); setIsLoginOpen(true); };
  const switchToForgot   = () => { setIsLoginOpen(false); setIsForgotOpen(true); };
  const switchToVerify   = (email) => { setResetEmail(email); setIsForgotOpen(false); setIsVerifyOpen(true); };

  const toggleFaq = (index) => setActiveFaq(activeFaq === index ? null : index);

  const handleTabChange = (tab) => {
    setTabKey(k => k + 1);
    setActiveTab(tab);
  };

  // ── Hero text stagger delays ──
  const heroTransition = (delay) => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'none' : 'translateY(22px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-900 font-sans overflow-x-hidden selection:bg-blue-100">

      {/* ── Global animation keyframes ── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes floatAlt {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-7px) rotate(1deg); }
        }
        @keyframes orbPulse {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          50%       { opacity: 0.28; transform: scale(1.08); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes barGrow {
          from { width: 0 !important; }
        }
        @keyframes slideTabIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes countBounce {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.07); }
          100% { transform: scale(1); }
        }
        .animate-float        { animation: float 5s ease-in-out infinite; }
        .animate-float-alt    { animation: floatAlt 6s ease-in-out infinite; }
        .tab-content-enter    { animation: slideTabIn 0.32s ease both; }
        .feature-card:hover   { box-shadow: 0 20px 60px -10px rgba(37,99,235,0.15); }
        .hero-bar             { animation: barGrow 1.2s ease 0.8s both; }
        .balance-shimmer {
          background: linear-gradient(90deg, #fff 0%, #93c5fd 40%, #fff 60%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .stat-card-enter { animation: fadeScaleIn 0.5s ease both; }
      `}</style>

      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-blue-200/20 rounded-full blur-3xl -z-10" style={{ animation: 'orbPulse 8s ease-in-out infinite' }}></div>
      <div className="absolute top-[25%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-100/30 rounded-full blur-3xl -z-10" style={{ animation: 'orbPulse 12s ease-in-out infinite 2s' }}></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[32rem] h-[32rem] bg-blue-150/10 rounded-full blur-3xl -z-10"></div>

      {/* ── NAVBAR ── */}
      <header
        className="fixed top-6 left-0 w-full z-50 px-6"
        style={{ transition: 'top 0.35s ease' }}
      >
        <div
          className={`max-w-6xl mx-auto backdrop-blur-lg border px-8 flex justify-between items-center shadow-lg shadow-blue-500/5 rounded-full transition-all duration-300 ${
            scrolled
              ? 'bg-white/90 border-white/60 py-2 shadow-xl shadow-blue-500/10'
              : 'bg-white/70 border-white/40 py-3'
          }`}
        >
          <div className="flex items-center">
            <span className="text-xl font-black tracking-tighter text-slate-900 flex items-center gap-1.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/35">B</span>
              Budget<span className="text-blue-600">Mate</span>
            </span>
          </div>

          <nav className="hidden md:flex gap-8 font-semibold text-slate-500 text-[13px] items-center">
            {['#features', '#how-it-works', '#showcase', '#faqs'].map((href, i) => (
              <a
                key={href}
                href={href}
                className="hover:text-blue-600 transition-all relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all hover:after:w-full"
              >
                {['Features', 'How It Works', 'Showcase', 'FAQ'][i]}
              </a>
            ))}
            {isLoggedIn && (
              <a href="/dashboard" className="text-blue-600 font-bold flex items-center gap-1.5 transition-all">
                Dashboard <span className="w-2 h-2 bg-blue-600 rounded-full" style={{ animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }}></span>
              </a>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4 border-l pl-4 border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1 text-nowrap">Welcome back</p>
                  <p className="text-xs font-bold text-slate-900 capitalize">{userName}</p>
                </div>
                <button title="Dashboard" onClick={() => window.location.href='/dashboard'}
                  className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all shadow-md active:scale-95 cursor-pointer overflow-hidden">
                  {profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : <User size={18} />}
                </button>
                <button onClick={handleLogout} title="Logout" className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => setIsLoginOpen(true)} className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer">Log in</button>
                <button onClick={() => setIsRegisterOpen(true)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all active:scale-95 shadow-md cursor-pointer">
                  Try Now <MoveRight size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="pt-44 pb-20 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8 text-left">

          {/* Badge */}
          <div style={heroTransition(0)}>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100/50 px-4 py-2 rounded-full shadow-sm">
              <Sparkles size={14} className="text-blue-600" />
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Intelligent Finance Manager</span>
            </div>
          </div>

          {/* Headline */}
          <div style={heroTransition(120)}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">
              Take Control of Your Money.<br />
              Track. Save. Grow.<br />
              <span className="text-blue-600">All in One Place.</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div style={heroTransition(240)}>
            <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
              Unlock the full potential of your wealth with a single, AI-powered platform designed to optimize your savings, investments, and expenses without stress.
            </p>
          </div>

          {/* CTA Buttons */}
          <div style={heroTransition(360)}>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={isLoggedIn ? () => window.location.href='/dashboard' : () => setIsRegisterOpen(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-3 group cursor-pointer active:scale-95"
              >
                {isLoggedIn ? `Go to Dashboard` : "Get Started Free"}
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </button>
              <a href="#showcase"
                className="bg-white border border-slate-200/80 text-slate-700 px-8 py-4 rounded-2xl font-bold text-base hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                Explore Features
              </a>
            </div>
          </div>

          {/* Social proof */}
          <div style={heroTransition(480)}>
            <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
              <div className="flex -space-x-3">
                {[['JD','blue'], ['EM','indigo'], ['SK','slate']].map(([init, c], i) => (
                  <span key={i} style={{ transitionDelay: `${500 + i * 80}ms`, opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'scale(0.7)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}
                    className={`w-9 h-9 rounded-full bg-${c}-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-${c}-600`}>
                    {init}
                  </span>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Rated 4.9/5 by 15,000+ users</p>
                <p className="text-[10px] font-semibold text-slate-400">Trusted by modern wealth builders worldwide</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Mock Dashboard */}
        <div
          className="lg:col-span-5 relative w-full flex justify-center"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateX(32px) scale(0.96)', transition: 'opacity 0.85s ease 200ms, transform 0.85s ease 200ms' }}
        >
          <div className="relative w-full max-w-md bg-[#0A1128] rounded-[2.5rem] p-8 text-white shadow-2xl overflow-visible border border-white/10 group hover:shadow-blue-900/30 transition-shadow duration-500">
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-[10px] font-semibold tracking-widest text-blue-300 uppercase">Interactive Demo</span>
            </div>

            {/* Balance with shimmer */}
            <div className="space-y-2 mb-6">
              <p className="text-blue-300 text-[10px] uppercase font-bold tracking-widest">Total Net Worth</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight balance-shimmer">$48,250.00</span>
                <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <ArrowUpRight size={10} /> 12.4%
                </span>
              </div>
            </div>

            {/* Animated bars */}
            <div className="h-24 flex items-end justify-between gap-2.5 mb-8 px-2">
              {[35, 48, 40, 65, 52, 85].map((h, i) => (
                <div
                  key={i}
                  className={`w-full rounded-t-lg transition-all hover:brightness-125 ${i === 5 ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-blue-500/30'} hero-bar`}
                  style={{ height: `${h}%`, animationDelay: `${0.8 + i * 0.1}s` }}
                />
              ))}
            </div>

            {/* Floating widget: Monthly Spend — float animation */}
            <div className="absolute right-[-1.5rem] bottom-16 bg-white text-slate-900 p-4 rounded-2xl shadow-xl shadow-blue-950/20 border border-slate-100 max-w-[170px] animate-float-alt hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Wallet size={14} /></div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Monthly Limit</span>
              </div>
              <p className="text-sm font-black text-slate-900">$2,450.00</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '72%', animation: 'barGrow 1.4s ease 1.2s both' }}></div>
              </div>
            </div>

            {/* Floating widget: Transaction — opposite float */}
            <div className="absolute left-[-1.5rem] top-28 bg-white text-slate-900 py-3 px-4 rounded-2xl shadow-xl shadow-blue-950/20 border border-slate-100 flex items-center gap-3 max-w-[190px] animate-float hover:scale-105 transition-transform duration-300">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center font-bold text-xs"><Activity size={14} /></div>
              <div>
                <p className="text-xs font-bold text-slate-800">Starbucks Coffee</p>
                <p className="text-[9px] text-slate-400 font-semibold">Just now - Expense</p>
              </div>
              <p className="text-xs font-black text-slate-900">-$4.50</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATISTICS ── */}
      <section className="bg-white border-y border-slate-100 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '4.2', suffix: 'B+', label: 'Transactions Tracked' },
            { value: '150', suffix: 'K+', label: 'Active Users' },
            { value: '22', suffix: '%', label: 'Avg. Savings Increase' },
            { value: '99.4', suffix: '%', label: 'Customer Satisfaction' },
          ].map(({ value, suffix, label }, i) => (
            <FadeIn key={i} delay={i * 80} direction="up">
              <div className="space-y-1 stat-card-enter">
                <p className="text-3xl sm:text-4xl font-black text-blue-600">
                  <AnimatedCounter target={value} suffix={suffix} />
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto text-center space-y-16">
        <FadeIn direction="up">
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Features</div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Intelligent tools tailored to manage your assets</h2>
            <p className="text-slate-500 font-medium">Everything you need to analyze expenses, schedule bill alerts, and build investment portfolios in a single unified cockpit.</p>
          </div>
        </FadeIn>

        <StaggerParent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" stagger={120}>
          {[
            { icon: <Wallet size={22} />, title: 'Wallet Management', desc: 'Organize cash, credit cards, and bank assets side-by-side with localized currencies.' },
            { icon: <TrendingUp size={22} />, title: 'Investment Tracker', desc: 'Keep real-time records of stocks, index funds, and crypto portfolios all aligned with goals.' },
            { icon: <Bell size={22} />, title: 'Smart Bill Alerts', desc: 'Get gentle notifications for upcoming subscriptions and utility bills to avoid late fees.' },
            { icon: <Sparkles size={22} />, title: 'AI Spending Analysis', desc: 'Receive personalized recommendations and automated patterns alerts from the budget bot.' },
          ].map(({ icon, title, desc }, i) => (
            <div key={i} className="feature-card bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:-translate-y-2 transition-all duration-300 text-left space-y-5 flex flex-col justify-between group cursor-default">
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-lg text-slate-900">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5 cursor-pointer pt-4 group-hover:gap-2.5 transition-all">
                Learn more <MoveRight size={12} />
              </span>
            </div>
          ))}
        </StaggerParent>
      </section>

      {/* ── INTERACTIVE SHOWCASE ── */}
      <section id="showcase" className="py-24 px-6 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <FadeIn className="lg:col-span-5" direction="right">
            <div className="space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Live App Preview</div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-none">Interactive Dashboard</h2>
                <p className="text-slate-500 font-medium">Click the tabs below to preview the intuitive interfaces that power BudgetMate.</p>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { key: 'wallet',      icon: <Wallet size={18} />,     label: 'Asset Wallets' },
                  { key: 'analytics',   icon: <Activity size={18} />,   label: 'Expense Analytics' },
                  { key: 'investments', icon: <TrendingUp size={18} />, label: 'Investment Performance' },
                  { key: 'bills',       icon: <Bell size={18} />,       label: 'Bills & Schedules' },
                ].map(({ key, icon, label }) => (
                  <button
                    key={key}
                    onClick={() => handleTabChange(key)}
                    className={`w-full py-4 px-6 rounded-2xl text-left font-black text-sm transition-all duration-200 cursor-pointer flex items-center justify-between border ${
                      activeTab === key
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/25 border-transparent scale-[1.02]'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200/50 hover:translate-x-1'
                    }`}
                  >
                    <span className="flex items-center gap-3">{icon} {label}</span>
                    <ChevronDown size={16} className={activeTab === key ? '-rotate-90 transition-transform' : 'transition-transform'} />
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Tab Content Panel */}
          <FadeIn className="lg:col-span-7" direction="left" delay={120}>
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden min-h-[360px] p-8 flex flex-col justify-between relative transition-all duration-300">
              <div key={tabKey} className="tab-content-enter space-y-6">

                {activeTab === 'wallet' && (
                  <>
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-xl text-slate-900">Your Wallets</h4>
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">3 Accounts Connected</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { grad: 'from-blue-600 to-indigo-700', shadow: 'shadow-blue-500/10', label: 'Cash Account', amount: '$12,450.00', meta1: 'Checking ****8901', meta2: 'Active' },
                        { grad: 'from-emerald-600 to-teal-700', shadow: 'shadow-emerald-500/10', label: 'Savings Vault', amount: '$25,000.00', meta1: 'Yield 4.5% APY', meta2: 'Goal 80%' },
                      ].map(({ grad, shadow, label, amount, meta1, meta2 }, i) => (
                        <div key={i} style={{ animationDelay: `${i * 80}ms` }}
                          className={`tab-content-enter bg-gradient-to-br ${grad} p-6 rounded-2xl text-white space-y-4 hover:scale-[1.03] hover:-rotate-1 transition-transform shadow-lg ${shadow}`}>
                          <p className="text-[9px] uppercase tracking-widest font-semibold opacity-75">{label}</p>
                          <h5 className="text-2xl font-black">{amount}</h5>
                          <div className="flex justify-between text-[10px] font-semibold pt-4 opacity-90 border-t border-white/10">
                            <span>{meta1}</span><span>{meta2}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === 'analytics' && (
                  <>
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-xl text-slate-900">Monthly Spending Analytics</h4>
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1"><Activity size={10} /> Live</span>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Dining & Groceries', spent: '$642.50', limit: '$1,000', pct: 64, color: 'bg-blue-600' },
                        { label: 'Rent & Housing',     spent: '$1,500.00', limit: '$1,500', pct: 100, color: 'bg-red-500' },
                        { label: 'Entertainment',      spent: '$140.00', limit: '$450', pct: 31, color: 'bg-amber-500' },
                      ].map(({ label, spent, limit, pct, color }, i) => (
                        <div key={i} style={{ animationDelay: `${i * 100}ms` }} className="tab-content-enter">
                          <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                            <span>{label}</span>
                            <span>{spent} / {limit} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className={`${color} h-full rounded-full hero-bar`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === 'investments' && (
                  <>
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-xl text-slate-900">Portfolio Performance</h4>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+18.4% Return</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {[
                        { name: 'S&P 500 Index Fund (VOO)', shares: '42.5 shares', value: '$18,062.50', pct: '+11.2%' },
                        { name: 'Bitcoin Core (BTC)', shares: '0.15 BTC', value: '$10,050.00', pct: '+42.1%' },
                      ].map(({ name, shares, value, pct }, i) => (
                        <div key={i} style={{ animationDelay: `${i * 100}ms` }}
                          className="tab-content-enter flex justify-between items-center py-3 hover:bg-slate-50/50 -mx-2 px-2 rounded-xl transition-colors">
                          <div>
                            <p className="text-sm font-bold text-slate-900">{name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{shares}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-slate-900">{value}</p>
                            <p className="text-[10px] text-green-500 font-bold flex items-center justify-end gap-0.5"><ArrowUpRight size={10} /> {pct}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === 'bills' && (
                  <>
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-xl text-slate-900">Upcoming Bills</h4>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Calendar Integration</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { urgent: true, name: 'Netflix Premium', sub: 'Due in 2 days - Subscription', amount: '$15.49' },
                        { urgent: false, name: 'Electric Grid Utility', sub: 'Due June 24 - Bill', amount: '$142.00' },
                      ].map(({ urgent, name, sub, amount }, i) => (
                        <div key={i} style={{ animationDelay: `${i * 100}ms` }}
                          className={`tab-content-enter flex justify-between items-center p-3 rounded-xl border transition-all hover:scale-[1.01] ${urgent ? 'border-red-100 bg-red-50/50' : 'border-slate-100 bg-slate-50/30'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${urgent ? 'bg-red-100 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                              <Calendar size={14} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{name}</p>
                              <p className={`text-[9px] font-semibold ${urgent ? 'text-red-400' : 'text-slate-400'}`}>{sub}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-black ${urgent ? 'text-red-600' : 'text-slate-900'}`}>{amount}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Secure Server Session</span>
                <span className="flex items-center gap-1 text-green-500"><Shield size={12} /> SSL Encrypted</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto text-center space-y-16">
        <FadeIn direction="up">
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Getting Started</div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Set up your dashboard in three simple steps</h2>
            <p className="text-slate-500 font-medium">BudgetMate links with your habits immediately, automating your entries and optimizing allocations.</p>
          </div>
        </FadeIn>

        <StaggerParent className="grid grid-cols-1 md:grid-cols-3 gap-12 relative" stagger={160}>
          <div className="hidden md:block absolute top-[25%] left-[20%] right-[20%] h-0.5 border-t border-dashed border-slate-200 -z-10"></div>
          {[
            { n: 1, title: 'Create Account', desc: 'Register securely in seconds using your email address. No credit card required.' },
            { n: 2, title: 'Set Up Wallets', desc: 'Create digital wallets for your bank, cash, or credit accounts to group your assets together.' },
            { n: 3, title: 'Track & Grow', desc: 'Enter transactions, monitor bill calendars, and see automatic savings statistics build up.' },
          ].map(({ n, title, desc }) => (
            <div key={n} className="space-y-4 text-center group">
              <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-600/10 text-blue-600 mx-auto flex items-center justify-center font-black text-xl shadow-md group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                {n}
              </div>
              <h3 className="font-black text-lg text-slate-900">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto font-medium">{desc}</p>
            </div>
          ))}
        </StaggerParent>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto text-center space-y-16">
          <FadeIn direction="up">
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Reviews</div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Approved by wealth builders</h2>
              <p className="text-slate-500 font-medium">Here is how BudgetMate is helping people eliminate subscription leakages and accumulate wealth.</p>
            </div>
          </FadeIn>

          <StaggerParent className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger={130}>
            {[
              { init: 'AH', color: 'blue', name: 'Alexander Hayes', role: 'Independent Developer', quote: '"BudgetMate completely reformed how I plan my monthly expenses. The recurring bill notifications are incredibly reliable, preventing me from getting surprised by late fees."' },
              { init: 'SR', color: 'indigo', name: 'Sarah Reynolds', role: 'Marketing Analyst', quote: '"I was skeptical about AI budgeting, but this tool identified two subscription services I hadn\'t used in 6 months. Saved $40/month on my first day!"' },
              { init: 'MK', color: 'slate', name: 'Marcus Kaelen', role: 'Small Business Owner', quote: '"Being able to track checking, physical cash, and stock portfolios in a single currency overview has saved me hours of calculation every week."' },
            ].map(({ init, color, name, role, quote }, i) => (
              <div key={i} className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 text-left space-y-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">{quote}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center font-bold text-xs text-${color}-600`}>{init}</div>
                  <div>
                    <p className="text-xs font-black text-slate-900">{name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerParent>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faqs" className="py-24 px-6 max-w-4xl mx-auto space-y-16">
        <FadeIn direction="up">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">FAQ</div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">Got questions about BudgetMate? We have responses to help you understand safety, setup, and features.</p>
          </div>
        </FadeIn>

        <StaggerParent className="space-y-4" stagger={80}>
          {[
            { q: "Is BudgetMate free to use?", a: "Yes! BudgetMate offers a robust free tier that allows you to manage multiple wallets, log custom expenses, track income categories, and check upcoming bills without any recurring cost." },
            { q: "How does the AI assistant help me save?", a: "Our background algorithms evaluate your recurring expense timelines to pinpoint forgotten subscriptions and compare your current income-to-spend ratios to target savings milestones." },
            { q: "Is my financial data secure with BudgetMate?", a: "Absolutely. We secure all communication streams using industry-standard SSL encryption protocols. BudgetMate operates strictly on local token authorization and never exposes your information." },
            { q: "Can I manage multiple accounts in different categories?", a: "Yes. In the dashboard, you can define unique wallets representing checking accounts, savings vaults, physical cash, or investment portfolios, and filter recent activities by specific accounts." },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-blue-100 transition-colors duration-200">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full py-5 px-6 font-bold text-left text-slate-800 flex justify-between items-center hover:bg-slate-50/50 cursor-pointer transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-blue-600' : ''}`} />
              </button>
              <div
                style={{
                  maxHeight: activeFaq === idx ? '200px' : '0',
                  opacity: activeFaq === idx ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.35s ease, opacity 0.25s ease',
                }}
              >
                <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed font-medium border-t border-slate-50 pt-4">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </StaggerParent>
      </section>

      {/* ── DARK CTA BANNER ── */}
      <FadeIn direction="up">
        <section className="mx-6 my-12 max-w-6xl lg:mx-auto">
          <div className="bg-[#0A1128] text-white rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl border border-white/5 group hover:shadow-blue-950/40 transition-shadow duration-500">
            <div className="absolute top-0 right-0 w-[24rem] h-[24rem] bg-blue-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/15 transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 w-[24rem] h-[24rem] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Ready to master your financial destiny?</h2>
              <p className="text-blue-200 font-medium text-base leading-relaxed">Join thousands of smart builders tracking, optimizing, and multiplying their money with BudgetMate.</p>
              <div className="flex justify-center pt-2">
                <button
                  onClick={isLoggedIn ? () => window.location.href='/dashboard' : () => setIsRegisterOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-2xl text-base shadow-xl shadow-blue-500/20 hover:-translate-y-1 hover:shadow-2xl transition-all flex items-center gap-3 cursor-pointer active:scale-95 group/btn"
                >
                  {isLoggedIn ? "Access Dashboard" : "Register Free Now"}
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-white pt-16 pb-12 px-6 mt-20 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-800">
          <div className="md:col-span-5 space-y-6">
            <span className="text-2xl font-black tracking-tighter flex items-center gap-1.5">
              <span className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-base">B</span>
              Budget<span className="text-blue-500">Mate</span>
            </span>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">We empower modern wealth builders to clean up daily spending category logs, monitor due bills, and coordinate long term investment metrics securely.</p>
            <div className="flex gap-4 text-slate-400">
              <span className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center cursor-pointer transition-all hover:scale-110"><Shield size={16} /></span>
              <span className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center cursor-pointer transition-all hover:scale-110"><HelpCircle size={16} /></span>
            </div>
          </div>
          <div className="md:col-span-2 space-y-4 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Product</p>
            <ul className="space-y-2.5 text-sm font-semibold text-slate-300">
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#showcase" className="hover:text-blue-400 transition-colors">Showcase</a></li>
              <li><span className="text-slate-500 cursor-not-allowed">Premium Pro</span></li>
            </ul>
          </div>
          <div className="md:col-span-2 space-y-4 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Resources</p>
            <ul className="space-y-2.5 text-sm font-semibold text-slate-300">
              <li><a href="#faqs" className="hover:text-blue-400 transition-colors">FAQ</a></li>
              <li><span className="hover:text-blue-400 cursor-pointer transition-colors">Safety Standard</span></li>
              <li><span className="hover:text-blue-400 cursor-pointer transition-colors">Knowledge Center</span></li>
            </ul>
          </div>
          <div className="md:col-span-3 space-y-4 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Newsletter</p>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">Receive smart savings ideas directly in your inbox monthly. No spam.</p>
            <div className="flex bg-slate-800 border border-slate-700/80 rounded-xl p-1 items-center">
              <input type="email" placeholder="Enter email" className="bg-transparent text-xs text-white pl-3 outline-none border-none flex-1 font-medium placeholder-slate-500 w-full" />
              <button className="bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all hover:scale-105 cursor-pointer">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-bold text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BudgetMate. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* ── MODALS ── */}
      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} openRegister={switchToRegister} openForgot={switchToForgot} />
      <Register isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} openLogin={switchToLogin} />
      <ForgotPassword isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} openLogin={switchToLogin} openVerify={switchToVerify} />
      <VerifyOTP isOpen={isVerifyOpen} onClose={() => setIsVerifyOpen(false)} email={resetEmail} openLogin={switchToLogin} />
    </div>
  );
};

export default Home;