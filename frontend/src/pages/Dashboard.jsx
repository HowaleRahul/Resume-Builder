import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
} from 'lucide-react';
import { TEMPLATE_REGISTRY } from '../templates';
import JobTracker from '../components/dashboard/JobTracker';
import Sidebar from '../components/dashboard/Sidebar';
import ResumeCard from '../components/dashboard/ResumeCard';
import TemplateCard from '../components/dashboard/TemplateCard';
import API_BASE_URL from '../config/api';

export default function Dashboard() {
  const { user } = useUser();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('resumes'); // 'resumes' | 'jobs' | 'templates'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.id) {
      axios.get(`${API_BASE_URL}/api/resume/list/${user.id}`)
        .then(res => { if (res.data.success) setResumes(res.data.resumes); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  const templates = Object.entries(TEMPLATE_REGISTRY);
  const filteredResumes = resumes.filter(r => (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      
      <Sidebar activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />

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
