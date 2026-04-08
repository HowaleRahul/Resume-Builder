import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 bg-linear-to-b from-blue-50/40 via-white to-white -z-10" />
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 text-white mb-10 shadow-2xl shadow-blue-500/20 animate-fade-in border border-slate-800">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">The Engineering Resume Engine</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8">
          The New Standard for <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500">
            Professional Resumes.
          </span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
          Forget manual TeX formatting. CareerFlow AI parses your expertise, optimizes for ATS, and builds high-fidelity PDF outputs tailored for engineering roles.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-10 py-5 bg-slate-900 text-white rounded-4xl font-black text-lg shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center group">
                Elevate Your Career
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard" className="px-10 py-5 bg-blue-600 text-white rounded-4xl font-black text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 transition flex items-center group">
              Enter Workspace
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </SignedIn>
          <button className="px-10 py-5 bg-white text-slate-600 border border-slate-100 rounded-4xl font-black text-lg hover:bg-slate-50 transition shadow-sm">
            Explore Templates
          </button>
        </div>
      </div>
    </section>
  );
}
