import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  LayoutTemplate, 
  Star, 
  Settings, 
  BriefcaseBusiness, 
  ArrowRightLeft, 
  Search, 
  LayoutDashboard,
  Zap,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { TEMPLATE_REGISTRY } from '../templates';
import JobTracker from '../components/dashboard/JobTracker';

const TAG_COLORS = {
  blue:    'bg-blue-100 text-blue-700',
  rose:    'bg-rose-100 text-rose-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  violet:  'bg-violet-100 text-violet-700',
  slate:   'bg-slate-200 text-slate-600',
  amber:   'bg-amber-100 text-amber-700',
};

export default function Dashboard() {
  const { user } = useUser();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('resumes'); // 'resumes' | 'jobs' | 'comparison' | 'templates'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:5000/api/resume/list/${user.id}`)
        .then(res => { if (res.data.success) setResumes(res.data.resumes); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  const templates = Object.entries(TEMPLATE_REGISTRY);
  const filteredResumes = resumes.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      
      {/* ── Sidebar Navigation ─────────────────────────────────────────── */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-blue-50">
              C
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">CareerFlow AI</span>
          </div>

          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Suite</div>
          <nav className="space-y-1">
            <SidebarLink icon={<LayoutDashboard size={18}/>} label="My Resumes" active={activeSubTab === 'resumes'} onClick={() => setActiveSubTab('resumes')} />
            <SidebarLink icon={<BriefcaseBusiness size={18}/>} label="Job Tracker" active={activeSubTab === 'jobs'} onClick={() => setActiveSubTab('jobs')} tag="PRO" />
            <SidebarLink icon={<LayoutTemplate size={18}/>} label="Templates" active={activeSubTab === 'templates'} onClick={() => setActiveSubTab('templates')} />
          </nav>

          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-8 mb-4">Quick Tools</div>
          <nav className="space-y-1">
            <Link to="/compare" className="flex items-center space-x-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition">
              <ArrowRightLeft size={18} /> <span>Head-to-Head</span>
            </Link>
            <SidebarLink icon={<Settings size={18}/>} label="Settings" active={activeSubTab === 'settings'} onClick={() => setActiveSubTab('settings')} />
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500 rounded-full blur-2xl opacity-40 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="text-xs font-bold text-blue-400 mb-1">PRO PLAN</div>
              <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">Unlock advanced AI tailoring & unlimited cloud storage.</p>
              <button className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-[10px] font-black uppercase transition-colors">Upgrade Now</button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center flex-1 max-w-xl">
             <div className="relative w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Search resumes, jobs, or templates..." 
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
               />
             </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right mr-2 hidden sm:block">
              <div className="text-sm font-bold text-slate-900">{user?.fullName}</div>
              <div className="text-[10px] font-medium text-slate-400">Free Tier</div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          
          {activeSubTab === 'resumes' && (
            <div className="p-8 max-w-6xl mx-auto">
              {/* Welcome Banner */}
              <div className="mb-10 p-8 bg-white border border-slate-200 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-sm">
                 <div className="absolute top-0 right-0 w-64 h-full bg-linear-to-l from-blue-50 to-transparent -z-10" />
                 <div className="mb-6 md:mb-0">
                   <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome back, {user?.firstName || 'Builder'}! 👋</h1>
                   <p className="text-slate-500 font-medium">You have {resumes.length} active resumes. Ready to land your next role?</p>
                 </div>
                 <Link to="/builder" className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition flex items-center group">
                   <Plus size={20} className="mr-2" /> Start New Resume
                 </Link>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  <FileText className="mr-2 text-blue-600" size={20}/> Recently Edited
                </h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-100 rounded-3xl animate-pulse" />)}
                </div>
              ) : filteredResumes.length === 0 ? (
                <div className="text-center py-20 bg-white border border-slate-200 border-dashed rounded-[2.5rem]">
                  <FileText className="mx-auto h-16 w-16 text-slate-200 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900">No resumes matching search</h3>
                  <p className="text-slate-500 mt-2 mb-8">Try a different query or start a fresh creation.</p>
                  <Link to="/builder" className="text-blue-600 font-bold hover:underline">New resume →</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResumes.map(r => (
                    <ResumeCard key={r._id} resume={r} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'jobs' && <JobTracker />}

          {activeSubTab === 'templates' && (
             <div className="p-8 max-w-6xl mx-auto">
                <div className="mb-10">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Premium Templates</h2>
                  <p className="text-slate-500 font-medium tracking-tight">Curated collection of Overleaf-ready LaTeX designs for modern careers.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map(([key, tpl]) => (
                    <TemplateCard key={key} tpl={tpl} tKey={key} />
                  ))}
                </div>
             </div>
          )}

          <div className="pb-20" />
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick, tag }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition duration-200 group ${active ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      <div className="flex items-center space-x-3 text-sm font-bold">
        {icon}
        <span>{label}</span>
      </div>
      {tag && (
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>{tag}</span>
      )}
    </button>
  );
}

function ResumeCard({ resume }) {
  return (
    <Link to={`/builder?id=${resume._id}`} className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-300 group flex flex-col relative">
      <div className="h-40 bg-slate-100 flex items-center justify-center border-b border-slate-50 relative overflow-hidden">
        <FileText size={48} className="text-slate-300 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-linear-to-tr from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {resume.atsScore && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm flex items-center space-x-1.5">
            <Zap size={12} className="text-amber-500 fill-current" />
            <span className="text-xs font-black text-slate-800">{resume.atsScore} Score</span>
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-black text-slate-900 text-lg leading-tight truncate">{resume.title}</h3>
          <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
            <Sparkles size={10} className="mr-1.5 text-blue-500" /> {resume.templateType} Engine
          </div>
        </div>
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center text-[11px] text-slate-400 font-bold">
            <Clock size={12} className="mr-1.5" /> 
            {new Date(resume.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function TemplateCard({ tpl, tKey }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-200/40 transition-all duration-300 group">
      <div className={`h-40 bg-linear-to-br ${tpl.color} relative p-6 flex flex-col justify-between overflow-hidden`}>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className={`self-end px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm ${TAG_COLORS[tpl.tagColor] || TAG_COLORS.slate}`}>
          {tpl.tag}
        </div>
        <div className="space-y-2 relative">
          <div className="w-24 h-2 bg-white/30 rounded" />
          <div className="w-full h-1.5 bg-white/20 rounded" />
          <div className="w-5/6 h-1.5 bg-white/20 rounded" />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-black text-slate-900 mb-1">{tpl.label}</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">by {tpl.author}</p>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium line-clamp-2 h-10">{tpl.desc}</p>
        <Link
          to={`/builder?template=${tKey}`}
          className="block text-center w-full bg-slate-900 text-white hover:bg-slate-700 font-black py-3 rounded-xl transition text-xs tracking-widest uppercase shadow-lg shadow-slate-200"
        >
          Use Template
        </Link>
      </div>
    </div>
  );
}
