import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { Target, Zap, Code2, FileText } from 'lucide-react';

// Lazy load pages for optimization
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ComparisonTool = React.lazy(() => import('./pages/ComparisonTool'));
const BuilderPage = React.lazy(() => import('./pages/Builder'));

import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import API_BASE_URL from './config/api';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  console.error('VITE_CLERK_PUBLISHABLE_KEY is not set. Please check environment variables.');
}



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("Uncaught error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8 text-center flex-col">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Something went wrong.</h2>
          <p className="text-slate-500 mb-8 max-w-md">The CareerFlow Suite encountered an unexpected error. Please refresh the page.</p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition">Restore Workspace</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          layout: { socialButtonsPlacement: 'bottom', logoPlacement: 'inside', shimmer: true },
          variables: { colorPrimary: '#2563EB', fontWeight: { bold: 900, medium: 600 } },
          elements: {
            card: "shadow-2xl border border-slate-100 rounded-[2rem]",
            formButtonPrimary: "bg-slate-900 hover:bg-slate-800 rounded-xl uppercase tracking-widest text-[10px] font-black h-12 transition-all",
            socialButtonsBlockButton: "rounded-xl border-slate-200 hover:bg-slate-50 transition-all",
            formFieldInput: "rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-all"
          }
        }}
      >
        <Toaster position="top-center" />
        <Router>
          <InnerApp />
        </Router>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

function InnerApp() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      axios.post(`${API_BASE_URL}/api/users/sync`, {
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
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20 ring-4 ring-blue-50 group-hover:scale-110 transition-transform duration-500">C</div>
            <Link to="/" className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-600 tracking-tighter">
              CareerFlow <span className="text-slate-900">AI</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <SignedIn>
              <nav className="hidden md:flex items-center space-x-8">
                {[
                  { label: 'Dashboard', path: '/dashboard' },
                  { label: 'Comparison', path: '/compare' },
                  { label: 'Builder', path: '/builder' }
                ].map(link => (
                  <Link key={link.path} to={link.path} className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] bg-slate-900 text-white hover:bg-slate-800 transition shadow-xl shadow-slate-200">
                  Access Portal
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <React.Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400 font-black uppercase tracking-widest animate-pulse">Initializing Suite...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<SignedIn><Dashboard /></SignedIn>} />
            <Route path="/compare" element={<SignedIn><ComparisonTool /></SignedIn>} />
            <Route path="/builder" element={<SignedIn><BuilderPage /></SignedIn>} />
          </Routes>
        </React.Suspense>
      </main>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="flex-1 bg-white">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-16 border-y border-slate-100 bg-slate-50/30 rounded-[3rem] px-8">
          {[
            { label: 'ATS Success Avg', val: '96%', icon: <Target className="text-blue-600"/>, color: 'text-blue-600' },
            { label: 'Cloud Templates', val: '12+', icon: <FileText className="text-indigo-600"/>, color: 'text-indigo-600' },
            { label: 'Processing Speed', val: '1.2s', icon: <Zap className="text-amber-500 fill-amber-500"/>, color: 'text-amber-900' },
            { label: 'Enterprise Format', val: 'LaTeX', icon: <Code2 className="text-cyan-600"/>, color: 'text-cyan-600' }
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center group cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-200/20 transition-all duration-500">
                {s.icon}
              </div>
              <div className={`text-4xl font-black ${s.color} mb-1 tracking-tighter`}>{s.val}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Features />
      <footer className="bg-slate-900 py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl">C</div>
                <span className="text-white text-3xl font-black tracking-tighter">CareerFlow AI</span>
              </div>
              <p className="text-slate-400 text-lg max-w-sm font-medium leading-relaxed">
                Empowering the next generation of engineers with high-fidelity, AI-optimized carrier tools. Built on the power of LaTeX.
              </p>
            </div>
            <div>
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-6">Product</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500 underline-offset-4 decoration-blue-500">
                <li className="hover:text-blue-400 cursor-pointer transition">Resume Builder</li>
                <li className="hover:text-blue-400 cursor-pointer transition">JD Matcher</li>
                <li className="hover:text-blue-400 cursor-pointer transition">LaTeX Parser</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-6">Connect</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li className="hover:text-blue-400 cursor-pointer transition">LinkedIn</li>
                <li className="hover:text-blue-400 cursor-pointer transition">GitHub</li>
                <li className="hover:text-blue-400 cursor-pointer transition">Support</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <div>© 2024 CareerFlow AI. Built for the Tech Elite.</div>
            <div className="mt-4 md:mt-0 flex items-center bg-slate-800/50 px-4 py-2 rounded-xl backdrop-blur">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse"></div>
              All Systems Operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
