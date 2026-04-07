import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import { FileText, Sparkles, Code2, Zap, ShieldCheck, ArrowRight, Layout, Monitor, Terminal } from 'lucide-react';
import BuilderPage from './pages/Builder';
import Dashboard from './pages/Dashboard';
import ComparisonTool from './pages/ComparisonTool';

// Ensure to configure VITE_CLERK_PUBLISHABLE_KEY in frontend/.env
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_YmFzZS1wbGFjZWhvbGRlci1rZXk=";

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Toaster position="top-center" />
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
          
          {/* Top Navigation */}
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded bg-linear-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    L
                  </div>
                  <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-cyan-600">
                    LaTeX AI Builder
                  </Link>
                </div>
                
                <div className="flex items-center space-x-4">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="px-5 py-2 rounded-full text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition shadow-md">
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <Link to="/compare" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
                      Compare
                    </Link>
                    <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
                      Dashboard
                    </Link>
                    <Link to="/builder" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
                      Builder
                    </Link>
                    <div className="w-px h-6 bg-slate-200 mx-2"></div>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={
                <SignedIn>
                  <Dashboard />
                </SignedIn>
              } />
              <Route path="/compare" element={
                <SignedIn>
                  <ComparisonTool />
                </SignedIn>
              } />
              <Route path="/builder" element={
                <SignedIn>
                  <BuilderPage />
                </SignedIn>
              } />
            </Routes>
          </main>
          
        </div>
      </Router>
    </ClerkProvider>
  );
}

// Premium Landing Page Component
function LandingPage() {
  return (
    <div className="flex-1 bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 bg-linear-to-b from-blue-50/50 to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-fade-in shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">v2.0 — Enhanced AI Engine</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.05] mb-8">
            The Gold Standard for <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500">
              LaTeX Resumes
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Forget struggling with TeX syntax. Our AI architect parses your background, optimizes for ATS, and builds professional Overleaf-ready code in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center group">
                  Start Building for Free
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition flex items-center group">
                Go to Dashboard
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SignedIn>
            <button className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition shadow-sm">
              View Examples
            </button>
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100">
          {[
            { label: 'ATS Score Avg', val: '94+' },
            { label: 'Premium Templates', val: '6+' },
            { label: 'Latency', val: '<2s' },
            { label: 'Export Format', val: 'Overleaf' }
          ].map((s, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{s.val}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <section className="bg-slate-50 py-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Everything you need to land the interview.</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">A full suite of tools designed to bypass the resume screening bots and wow hiring managers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="text-blue-600" />}
              title="Instant AI Parsing"
              desc="Upload your current resume. Our Gemini-powered engine extracts every detail instantly with near-perfect accuracy."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-500" />}
              title="ATS Optimization"
              desc="Get a real-time ATS score and suggestions on missing keywords based on modern job descriptions."
            />
            <FeatureCard 
              icon={<Code2 className="text-indigo-600" />}
              title="Live LaTeX Export"
              desc="Switch between 6 professional templates with a single click. Download or open directly in Overleaf."
            />
          </div>
        </div>
      </section>

      {/* The "Process" Section */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1]">
                Designed for the <br />
                modern developer.
              </h2>
              
              <div className="space-y-8">
                <ProcessStep step="1" title="Import" desc="Paste your old resume text or upload your current PDF for AI extraction." />
                <ProcessStep step="2" title="Optimize" desc="Use AI to polish bullets, add skills, and hit a 90+ ATS compatibility score." />
                <ProcessStep step="3" title="Deploy" desc="Download as professional PDF or grab the production-ready .tex code." />
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-10 bg-linear-to-tr from-blue-100/50 to-indigo-100/50 rounded-[4rem] blur-3xl opacity-60 -z-10" />
              <div className="bg-slate-900 rounded-[3rem] p-5 shadow-2xl shadow-indigo-100/50 border border-slate-800 font-mono">
                <div className="bg-slate-800 rounded-t-4xl p-4 flex space-x-2 border-b border-slate-700/50 font-sans">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-inner" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-inner" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-inner" />
                </div>
                <div className="p-10 text-sm space-y-3">
                   <div className="text-blue-400">\\documentclass<span className="text-slate-500">{"{article}"}</span></div>
                   <div className="text-indigo-400">\\usepackage<span className="text-slate-500">{"{geometry}"}</span></div>
                   <div className="text-slate-500 mt-6 pt-4 border-t border-slate-800 italic font-sans">// AI is building your career...</div>
                   <div className="text-emerald-400">\\begin<span className="text-slate-500">{"{document}"}</span></div>
                   <div className="text-slate-300 ml-6">\\section<span className="text-slate-500">{"{Experience}"}</span></div>
                   <div className="text-slate-400 ml-12">\\resumeItem<span className="text-slate-200">{"{Enhanced bullet...}"}</span></div>
                   <div className="text-slate-400 ml-12 animate-pulse font-bold text-white border-l-2 pl-1 border-blue-500">_</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
             <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 shadow-lg flex items-center justify-center text-white font-black text-xl font-sans">L</div>
             <span className="font-black text-slate-800 text-lg">LaTeX AI Builder</span>
          </div>
          <div className="flex space-x-10">
            <a href="#" className="font-bold hover:text-blue-600 transition-colors">GitHub</a>
            <a href="#" className="font-bold hover:text-blue-600 transition-colors">Twitter</a>
            <a href="#" className="font-bold hover:text-blue-600 transition-colors">Pricing</a>
          </div>
          <div className="mt-8 md:mt-0 font-medium tracking-wide">© 2024 LaTeX AI. Crafted for Engineers.</div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2 transition-all duration-500 group text-left">
      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-10 border border-white shadow-inner group-hover:scale-110 transition-transform duration-500">
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-5">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium text-sm">{desc}</p>
    </div>
  );
}

function ProcessStep({ step, title, desc }) {
  return (
    <div className="flex items-start group">
      <div className="shrink-0 w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg mr-8 shadow-xl shadow-blue-200 group-hover:scale-110 transition-transform">
        {step}
      </div>
      <div className="pt-1">
        <h4 className="text-xl font-black text-slate-900 mb-2">{title}</h4>
        <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default App;
