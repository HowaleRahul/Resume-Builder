import React from 'react';
import { LayoutDashboard, BriefcaseBusiness, LayoutTemplate, ArrowRightLeft, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar({ activeSubTab, setActiveSubTab }) {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg ring-4 ring-blue-50">
            L
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">ResumeForge AI</span>
        </div>

        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Suite</div>
        <nav className="space-y-1">
          <SidebarLink icon={<LayoutDashboard size={18}/>} label="My Resumes" active={activeSubTab === 'resumes'} onClick={() => setActiveSubTab('resumes')} />
          <SidebarLink icon={<BriefcaseBusiness size={18}/>} label="Job Tracker" active={activeSubTab === 'jobs'} onClick={() => setActiveSubTab('jobs')} />
          <SidebarLink icon={<LayoutTemplate size={18}/>} label="Templates" active={activeSubTab === 'templates'} onClick={() => setActiveSubTab('templates')} />
        </nav>

        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-8 mb-4">Quick Tools</div>
        <nav className="space-y-1">
          <Link to="/compare" className="flex items-center space-x-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition">
            <ArrowRightLeft size={18} /> <span>Head-to-Head Battle</span>
          </Link>
          <SidebarLink icon={<Settings size={18}/>} label="Settings" active={activeSubTab === 'settings'} onClick={() => setActiveSubTab('settings')} />
        </nav>
      </div>

    </aside>
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
