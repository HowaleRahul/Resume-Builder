import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ArrowRight, Sparkles, ShieldCheck, Target, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-44 overflow-hidden bg-white">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-200 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-150 h-150 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-100 h-100 bg-indigo-100/20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-slate-900 text-white mb-10 shadow-2xl border border-slate-800 animate-slide-up">
            <Sparkles size={14} className="text-blue-400 group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Engineering Resume Engine</span>
          </div>

          <h1 className="text-6xl md:text-[94px] font-black text-slate-900 tracking-tighter leading-[0.95] mb-10 max-w-5xl">
            Engineer your next <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500">
              Career Break.
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
            Stop fighting LaTeX templates. ResumeForge AI parses your expertise into high-fidelity, ATS-optimized PDFs tailored for the world's elite engineering teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-12 py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all flex items-center group">
                  Elevate Your Career
                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="px-12 py-5 bg-blue-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-blue-700 transition flex items-center group">
                Enter Command Center
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SignedIn>
            <button className="px-12 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-3xl font-black text-sm uppercase tracking-widest hover:border-slate-200 transition shadow-sm">
              View Templates
            </button>
          </div>

          {/* Floating Feature Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
             <div className="flex items-center space-x-4 p-6 bg-slate-50/50 rounded-4xl border border-slate-100/50 backdrop-blur">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                   <Target size={20} />
                </div>
                <div className="text-left">
                   <div className="text-lg font-black text-slate-900">96% Fit</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ATS Pass Rate</div>
                </div>
             </div>
             <div className="flex items-center space-x-4 p-6 bg-slate-50/50 rounded-4xl border border-slate-100/50 backdrop-blur">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
                   <ShieldCheck size={20} />
                </div>
                <div className="text-left">
                   <div className="text-lg font-black text-slate-900">Verified</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LaTeX Structure</div>
                </div>
             </div>
             <div className="flex items-center space-x-4 p-6 bg-slate-50/50 rounded-4xl border border-slate-100/50 backdrop-blur">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-amber-500">
                   <Zap size={20} />
                </div>
                <div className="text-left">
                   <div className="text-lg font-black text-slate-900">1.2s Sync</div>
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Engine Speed</div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </section>
  );
}
