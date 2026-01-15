
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserLevel, AppView, Resource } from './types';
import { INITIAL_PARTNERS, INITIAL_RESOURCES, DAYS, HOURS } from './constants';
import { Avatar } from './components/Avatar';
import { getSmartMatch } from './services/geminiService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [toast, setToast] = useState<{ message: string; sub: string } | null>(null);
  const [partners] = useState<User[]>(INITIAL_PARTNERS);
  const [resources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [smartMatches, setSmartMatches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('caseconnect_user');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
      setCurrentView(AppView.DASHBOARD);
    }
  }, []);

  const handleLogin = (email: string) => {
    if (!email) return;
    // Simple mock logic: if user exists in local storage or partners, "log in"
    const existing = partners.find(p => p.email === email);
    if (existing) {
      setCurrentUser(existing);
      setCurrentView(AppView.DASHBOARD);
      localStorage.setItem('caseconnect_user', JSON.stringify(existing));
    } else {
      setCurrentView(AppView.REGISTER);
    }
  };

  const handleRegister = (name: string, email: string, level: UserLevel) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: name,
      email,
      level,
      rolePreference: 'flexible',
      caseFocus: 'Market Entry',
      availability: [],
      casesCompleted: 0,
      rating: 5.0,
      tags: []
    };
    setCurrentUser(newUser);
    setCurrentView(AppView.DASHBOARD);
    localStorage.setItem('caseconnect_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    localStorage.removeItem('caseconnect_user');
    setCurrentUser(null);
    setCurrentView(AppView.LOGIN);
  };

  const showToast = (message: string, sub: string) => {
    setToast({ message, sub });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleAvailability = (day: string, hour: string) => {
    if (!currentUser) return;
    const key = `${day.toLowerCase()}-${hour.substring(0, 2)}`;
    const newAvail = currentUser.availability.includes(key)
      ? currentUser.availability.filter(k => k !== key)
      : [...currentUser.availability, key];
    
    const updated = { ...currentUser, availability: newAvail };
    setCurrentUser(updated);
    localStorage.setItem('caseconnect_user', JSON.stringify(updated));
  };

  const handleSmartMatch = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    const matches = await getSmartMatch(currentUser, partners);
    setSmartMatches(matches);
    setIsLoading(false);
  };

  const simulateEmailSent = (partnerName: string) => {
    showToast("Meeting Request Sent!", `A calendar invite has been emailed to you and ${partnerName}.`);
  };

  // Views
  if (currentView === AppView.LOGIN) {
    return <LoginView onLogin={handleLogin} />;
  }

  if (currentView === AppView.REGISTER) {
    return <RegisterView onRegister={handleRegister} onBack={() => setCurrentView(AppView.LOGIN)} />;
  }

  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[100] bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined">check_circle</span>
          <div>
            <p className="font-bold text-sm">{toast.message}</p>
            <p className="text-xs opacity-90">{toast.sub}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header class="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div class="flex items-center gap-8">
            <div class="flex items-center gap-2.5">
              <div class="bg-primary p-1.5 rounded-lg text-white">
                <span class="material-symbols-outlined text-xl block">account_balance_wallet</span>
              </div>
              <h1 class="text-slate-900 text-lg font-black tracking-tight uppercase">CaseConnect</h1>
            </div>
            <nav class="hidden md:flex items-center gap-8">
              <button 
                onClick={() => setCurrentView(AppView.DASHBOARD)}
                className={`text-sm font-semibold transition-colors ${currentView === AppView.DASHBOARD ? 'text-primary border-b-2 border-primary pt-0.5' : 'text-slate-500 hover:text-primary'}`}>
                Your Time
              </button>
              <button 
                onClick={() => setCurrentView(AppView.FIND_PARTNER)}
                className={`text-sm font-semibold transition-colors ${currentView === AppView.FIND_PARTNER ? 'text-primary border-b-2 border-primary pt-0.5' : 'text-slate-500 hover:text-primary'}`}>
                Find Partner
              </button>
              <button 
                onClick={() => setCurrentView(AppView.RESOURCES)}
                className={`text-sm font-semibold transition-colors ${currentView === AppView.RESOURCES ? 'text-primary border-b-2 border-primary pt-0.5' : 'text-slate-500 hover:text-primary'}`}>
                Resources
              </button>
            </nav>
          </div>
          <div class="flex items-center gap-4">
            <div className="flex items-center gap-2 border border-primary/20 bg-primary/5 px-3 py-1 rounded-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{currentUser?.level.toUpperCase()}</span>
              <div className="size-2 rounded-full bg-primary animate-pulse"></div>
            </div>
            <div class="h-8 w-[1px] bg-slate-200 mx-1"></div>
            <div class="flex items-center gap-3">
              <div class="text-right hidden sm:block">
                <p class="text-xs font-bold text-slate-900">{currentUser?.fullName}</p>
                <button onClick={handleLogout} className="text-[10px] text-red-500 font-bold uppercase hover:underline">Log Out</button>
              </div>
              <Avatar name={currentUser?.fullName || ''} size="md" />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {currentView === AppView.DASHBOARD && (
          <DashboardView 
            user={currentUser!} 
            onToggle={toggleAvailability} 
            onSave={() => showToast("Schedule Confirmed", "Your availability has been synced with CaseConnect.")}
          />
        )}
        {currentView === AppView.FIND_PARTNER && (
          <FindPartnerView 
            partners={partners} 
            smartMatches={smartMatches}
            onSmartMatch={handleSmartMatch}
            isLoading={isLoading}
            onRequest={simulateEmailSent}
          />
        )}
        {currentView === AppView.RESOURCES && (
          <ResourcesView resources={resources} />
        )}
      </main>

      <footer class="mt-20 border-t border-slate-200 py-12 bg-white">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-2 grayscale opacity-60">
            <span class="material-symbols-outlined text-2xl">verified</span>
            <span class="font-bold tracking-tight">CaseConnect</span>
          </div>
          <div class="flex gap-8 text-sm text-slate-500">
            <a class="hover:text-primary" href="#">Support</a>
            <a class="hover:text-primary" href="#">Privacy Policy</a>
            <a class="hover:text-primary" href="#">Terms of Service</a>
          </div>
          <p class="text-xs text-slate-400">© 2024 CaseConnect Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// --- Sub-Views ---

const LoginView: React.FC<{ onLogin: (email: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  return (
    <div className="min-h-screen flex flex-col consulting-grid-bg">
      <header className="w-full h-16 border-b border-slate-200 flex items-center px-8 bg-white/80">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <span className="material-symbols-outlined text-xl block">account_balance</span>
          </div>
          <h2 className="text-slate-900 text-lg font-bold">CaseConnect</h2>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-slate-100">
          <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
          <p className="text-slate-500 mb-8 text-center">Log in to continue your case prep journey.</p>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Email Address</label>
              <input 
                className="w-full bg-slate-50 border-transparent focus:border-primary focus:ring-0 rounded-xl h-14 px-4 text-slate-900 transition-all" 
                placeholder="name@firm.com" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              onClick={() => onLogin(email)}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
            >
              Log in to Dashboard
            </button>
            <p className="text-center text-sm text-slate-500">
              New here? <button onClick={() => onLogin('new@user.com')} className="text-primary font-bold">Create an account</button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

const RegisterView: React.FC<{ onRegister: (n: string, e: string, l: UserLevel) => void; onBack: () => void }> = ({ onRegister, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [level, setLevel] = useState<UserLevel>(UserLevel.INTERMEDIATE);

  return (
    <div className="min-h-screen flex flex-col consulting-grid-bg">
      <header className="w-full h-16 border-b border-slate-200 flex items-center px-8 bg-white/80">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <span className="material-symbols-outlined text-xl block">account_balance</span>
          </div>
          <h2 className="text-slate-900 text-lg font-bold">CaseConnect</h2>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[640px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="px-10 pt-12 pb-8 text-center border-b border-slate-100">
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-slate-500 text-base">Start your journey to the MBB offers with elite case prep.</p>
          </div>
          <div className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Full Name</label>
                <input className="w-full bg-slate-50 border-transparent focus:border-primary rounded-lg h-14 px-4" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Email Address</label>
                <input className="w-full bg-slate-50 border-transparent focus:border-primary rounded-lg h-14 px-4" placeholder="name@firm.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-slate-900 text-sm font-bold uppercase tracking-wider">Select your level</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[UserLevel.ROOKIE, UserLevel.INTERMEDIATE, UserLevel.MASTER, UserLevel.COACH].map(l => (
                  <div 
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`relative group cursor-pointer border-2 rounded-xl p-5 transition-all ${level === l ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary/30'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-2xl">{l === UserLevel.ROOKIE ? 'school' : l === UserLevel.INTERMEDIATE ? 'trending_up' : l === UserLevel.MASTER ? 'workspace_premium' : 'co_present'}</span>
                      </div>
                      <input type="radio" checked={level === l} onChange={() => setLevel(l)} className="text-primary focus:ring-primary h-4 w-4" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-base mb-1">{l}</h3>
                    <p className="text-slate-500 text-sm leading-snug">Description for {l} level.</p>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => onRegister(name, email, level)}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Join CaseConnect</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <p className="text-center text-sm text-slate-500">
              Already have an account? <button onClick={onBack} className="text-primary font-bold">Log in here</button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardView: React.FC<{ user: User; onToggle: (d: string, h: string) => void; onSave: () => void }> = ({ user, onToggle, onSave }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-[320px] flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary text-xl">settings_input_component</span>
            <h2 className="text-base font-bold">Session Setup</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Case Type</label>
              <select className="w-full h-12 bg-slate-50 border-slate-200 rounded-lg text-sm font-medium focus:ring-primary appearance-none px-4">
                <option>{user.caseFocus}</option>
                <option>Market Entry</option>
                <option>Profitability</option>
                <option>M&A</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Role Preferences</label>
              <select className="w-full h-12 bg-slate-50 border-slate-200 rounded-lg text-sm font-medium focus:ring-primary appearance-none px-4">
                <option selected={user.rolePreference === 'flexible'}>Flexible / Either</option>
                <option selected={user.rolePreference === 'interviewer'}>Interviewer (Coach)</option>
                <option selected={user.rolePreference === 'interviewee'}>Interviewee (Candidate)</option>
              </select>
            </div>
            <button onClick={onSave} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              <span>Confirm Schedule</span>
              <span className="material-symbols-outlined text-lg">calendar_add_on</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-4 leading-relaxed">Changes will be visible to potential partners immediately after confirmation.</p>
          </div>
        </div>
      </aside>
      <section className="flex-1">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-base font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">calendar_view_week</span>
              Weekly Availability
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5"><div className="size-3 rounded-sm border border-slate-200"></div><span>Available</span></div>
              <div className="flex items-center gap-1.5"><div className="size-3 rounded-sm bg-primary"></div><span>Selected</span></div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-slate-200">
                <div className="p-4 bg-slate-50 border-r border-slate-200"></div>
                {DAYS.map(d => (
                  <div key={d} className="p-4 text-center border-r border-slate-100 last:border-r-0">
                    <p className="text-[10px] font-black text-slate-400 tracking-widest">{d}</p>
                    <p className="text-lg font-bold">{Math.floor(Math.random() * 31) + 1}</p>
                  </div>
                ))}
              </div>
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                {HOURS.map(h => (
                  <div key={h} className="grid grid-cols-[100px_repeat(5,1fr)]">
                    <div className="h-16 flex items-center justify-center border-r border-b border-slate-200 bg-slate-50">
                      <span className="text-[11px] font-bold text-slate-500">{h}</span>
                    </div>
                    {DAYS.map(d => {
                      const key = `${d.toLowerCase()}-${h.substring(0, 2)}`;
                      const isSelected = user.availability.includes(key);
                      return (
                        <div 
                          key={d} 
                          onClick={() => onToggle(d, h)}
                          className={`border-r border-b border-slate-100 last:border-r-0 cursor-pointer transition-colors flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'hover:bg-primary/5'}`}
                        >
                          {isSelected && <span className="material-symbols-outlined">check_circle</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FindPartnerView: React.FC<{ 
  partners: User[]; 
  smartMatches: string[];
  onSmartMatch: () => void;
  isLoading: boolean;
  onRequest: (name: string) => void;
}> = ({ partners, smartMatches, onSmartMatch, isLoading, onRequest }) => {
  const [filter, setFilter] = useState('');
  
  const filtered = partners
    .filter(p => p.fullName.toLowerCase().includes(filter.toLowerCase()) || p.caseFocus.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      const aMatch = smartMatches.indexOf(a.id);
      const bMatch = smartMatches.indexOf(b.id);
      if (aMatch !== -1 && bMatch !== -1) return aMatch - bMatch;
      if (aMatch !== -1) return -1;
      if (bMatch !== -1) return 1;
      return 0;
    });

  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-black mb-6">Practice Interviews</h1>
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-xl bg-slate-200 p-1">
          <button 
            onClick={onSmartMatch}
            className={`flex-1 flex items-center justify-center rounded-lg px-4 text-sm font-semibold transition-all h-full ${smartMatches.length > 0 ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}>
            {isLoading ? 'Finding matches...' : 'Smart Match'}
          </button>
          <button className={`flex-1 flex items-center justify-center rounded-lg px-4 text-sm font-semibold transition-all h-full ${smartMatches.length === 0 ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}>
            Discover
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="flex gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
            <input 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64" 
              placeholder="Filter by name or focus..." 
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>
        </div>
        <button onClick={() => setFilter('')} className="text-sm font-medium text-primary hover:underline">Clear all filters</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => {
          const isMatch = smartMatches.includes(p.id);
          return (
            <div key={p.id} className={`bg-white border rounded-xl p-6 hover:shadow-lg transition-all ${isMatch ? 'border-primary shadow-xl shadow-primary/5' : 'border-slate-200'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <Avatar name={p.fullName} size="lg" />
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      {p.fullName}
                      {isMatch && <span className="material-symbols-outlined text-primary text-sm fill-current">auto_awesome</span>}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="material-symbols-outlined text-sm fill-current">star</span>
                      <span className="text-sm font-semibold text-slate-700">{p.rating}</span>
                      <span className="text-xs text-slate-500 font-normal">({p.casesCompleted} cases)</span>
                    </div>
                  </div>
                </div>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">{p.level}</span>
              </div>
              <div className="flex gap-2 mb-6">
                {p.tags.map(t => (
                  <span key={t} className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded uppercase">{t}</span>
                ))}
              </div>
              <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Today's Availability</p>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {p.availability.filter(a => a.startsWith('mon')).map(a => (
                    <button key={a} className="px-3 py-1.5 whitespace-nowrap text-xs font-bold border border-slate-200 rounded-lg hover:border-primary hover:text-primary transition-colors">
                      {a.split('-')[1]}:00
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-slate-100 text-sm font-bold rounded-lg hover:bg-slate-200">View Profile</button>
                <button 
                  onClick={() => onRequest(p.fullName)}
                  className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90">
                  Request
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ResourcesView: React.FC<{ resources: Resource[] }> = ({ resources }) => {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-black tracking-tight mb-3">Resource Library</h1>
          <p className="text-slate-500 text-lg">Curated frameworks, case studies, and quantitative drills designed for consulting interview mastery.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          <button className="px-4 py-2 bg-white shadow-sm rounded-lg text-sm font-bold">All Resources</button>
          <button className="px-4 py-2 text-sm font-bold text-slate-500">Bookmarked</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {resources.map(r => (
          <div key={r.id} className="group flex items-center bg-white p-5 rounded-xl border border-slate-200 hover:border-primary/50 hover:shadow-xl transition-all cursor-pointer">
            <div className="mr-6 bg-slate-50 p-4 rounded-xl group-hover:bg-primary/5 transition-colors">
              <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary">
                {r.type === 'Framework' ? 'account_tree' : r.type === 'Practice Case' ? 'health_and_safety' : r.type === 'Skill Drill' ? 'calculate' : 'smart_display'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded">{r.type}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 text-xs font-medium">{r.category}</span>
              </div>
              <h3 className="text-slate-900 font-bold text-lg truncate">{r.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-2">{r.description}</p>
            </div>
            <button className={`ml-4 h-11 w-11 rounded-full flex items-center justify-center ${r.status === 'completed' ? 'bg-teal-50 text-teal-600' : 'bg-slate-50 text-slate-400 hover:bg-primary hover:text-white'} transition-all`}>
              <span className="material-symbols-outlined text-xl">{r.status === 'completed' ? 'check_circle' : (r.type === 'Framework' ? 'download' : 'open_in_new')}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
