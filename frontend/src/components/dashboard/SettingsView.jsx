import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { User, Bell, Palette, Shield, Trash2, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsView() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();

  const handleClearData = () => {
    if (window.confirm("Are you sure? This will clear all local workspace sessions. Database records are unaffected.")) {
      localStorage.clear();
      toast.success("Local workspace cleared.");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 animate-fade-in pb-32">
      <header className="mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Workspace Settings</h2>
        <p className="text-slate-500 font-medium">Manage your LatentCV profile and engineering preferences.</p>
      </header>

      {/* Profile Section */}
      <section className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Personal Identity</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Linked via Clerk</p>
            </div>
          </div>
          <button 
            onClick={() => openUserProfile()}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition shadow-xl shadow-slate-200 flex items-center"
          >
            Manage Profile <ExternalLink size={12} className="ml-2" />
          </button>
        </div>
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-50/50">
          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
             <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-700">{user?.fullName}</span>
                <CheckCircle2 size={14} className="text-emerald-500" />
             </div>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Email</label>
             <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-slate-200 overflow-hidden">
                <Mail size={14} className="text-slate-400 shrink-0" />
                <span className="font-bold text-slate-700 truncate">{user?.primaryEmailAddress?.emailAddress}</span>
             </div>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
            <Palette size={24} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Visual Engine</h3>
          <p className="text-sm text-slate-500 font-medium mb-6">Customize how LatentCV appears in your workspace.</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <span className="text-sm font-bold text-slate-700">Interface Theme</span>
               <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-widest">System</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-50">
               <span className="text-sm font-bold text-slate-700">Compact Mode</span>
               <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-not-allowed">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
            <Bell size={24} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Core Alerts</h3>
          <p className="text-sm text-slate-500 font-medium mb-6">Manage how the AI engine communicates with you.</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <span className="text-sm font-bold text-slate-700">Sync Notifications</span>
               <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full tracking-widest">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <span className="text-sm font-bold text-slate-700">AI Advice Popups</span>
               <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-200 px-3 py-1 rounded-full tracking-widest">Disabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <section className="bg-rose-50/50 rounded-[3rem] border border-rose-100 p-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 rounded-[2rem] bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
               <Shield size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Data Integrity</h3>
              <p className="text-sm text-rose-800/60 font-medium max-w-sm">Manage your local storage sessions. Clearing this will reset your unsaved builder drafts.</p>
            </div>
          </div>
          <button 
            onClick={handleClearData}
            className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition shadow-xl shadow-rose-200 flex items-center"
          >
            <Trash2 size={16} className="mr-2" /> 
            Purge Local Cache
          </button>
        </div>
      </section>

      <footer className="text-center pt-10">
         <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">LatentCV Engine v1.0.4 · Production Build</p>
      </footer>
    </div>
  );
}
