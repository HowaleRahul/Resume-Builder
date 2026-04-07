import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { Sparkles, Zap, ShieldCheck, ArrowRight, Monitor } from 'lucide-react';
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
        <InnerApp />
      </Router>
    </ClerkProvider>
  );
}

function InnerApp() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      // Sync user data with our backend
      axios.post('http://localhost:5000/api/users/sync', {
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.imageUrl
      }).catch(err => console.error("Sync error:", err));
    }
  }, [isSignedIn, user]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-blue-50">
                C
              </div>
              <Link to="/" className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-600 tracking-tighter">
                CareerFlow <span className="text-slate-900">AI</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition shadow-xl shadow-slate-200">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link to="/compare" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition">
                  Compare
                </Link>
                <Link to="/dashboard" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition">
                  Dashboard
                </Link>
                <Link to="/builder" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition">
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
          <Route path="/dashboard" element={<SignedIn><Dashboard /></SignedIn>} />
          <Route path="/compare" element={<SignedIn><ComparisonTool /></SignedIn>} />
          <Route path="/builder" element={<SignedIn><BuilderPage /></SignedIn>} />
        </Routes>
      </main>
    </div>
  );
}

// Premium Landing Page Component
function LandingPage() {
  return (
    <div className="flex-1 bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 bg-linear-to-b from-blue-50/40 via-white to-white -z-10" />
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-fade-in shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">v2.0 — Production-Ready AI Suite</span>
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
                <button className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center group">
                  Elevate Your Career
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 transition flex items-center group">
                Enter Workspace
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SignedIn>
            <button className="px-10 py-5 bg-white text-slate-600 border border-slate-100 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition shadow-sm">
              Explore Templates
            </button>
          </div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100 bg-slate-50/50 rounded-3xl">
          {[
            { label: 'ATS Success Avg', val: '96%' },
            { label: 'Cloud Templates', val: '12+' },
            { label: 'Processing Speed', val: '⚡ 1.2s' },
            { label: 'Enterprise Format', val: 'Overleaf' }
          ].map((s, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{s.val}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <section className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-left mb-24 max-w-3xl">
            <p className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4">Core Intelligence</p>
            <h2 className="text-5xl font-black text-slate-900 mb-6 leading-tight">Everything you need to bypass screening bots.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Sparkles className="text-amber-500" />}
              title="Career Tailor"
              desc="Instant rewriting of project bullets to match high-priority keywords in any JD."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-emerald-500" />}
              title="Skill Evaluator"
              desc="Gap analysis report showing exactly what certifications or tech you're missing."
            />
            <FeatureCard 
              icon={<Monitor className="text-indigo-600" />}
              title="Portfolio Sync"
              desc="Deep-sync your GitHub repositories to extract meaningful project metrics automatically."
            />
            <FeatureCard 
              icon={<Zap className="text-blue-600" />}
              title="Binary Export"
              desc="Download production-grade PDFs or raw LaTeX code for full manual control."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <div className="flex items-center space-x-3 mb-8 md:mb-0">
             <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 shadow-xl flex items-center justify-center text-white font-black text-2xl">C</div>
             <span className="font-black text-slate-900 text-xl tracking-tighter">CareerFlow AI</span>
          </div>
          <div className="flex space-x-12">
            <a href="#" className="font-black uppercase tracking-widest text-[10px] hover:text-blue-600 transition-colors">Documentation</a>
            <a href="#" className="font-black uppercase tracking-widest text-[10px] hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="font-black uppercase tracking-widest text-[10px] hover:text-blue-600 transition-colors">Status</a>
          </div>
          <div className="mt-8 md:mt-0 font-black uppercase tracking-[0.2em] text-[9px]">© 2024 CareerFlow AI. Developed for Excellence.</div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2 transition-all duration-500 group text-left">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-white shadow-inner group-hover:scale-110 transition-transform duration-500">
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium text-xs">{desc}</p>
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
