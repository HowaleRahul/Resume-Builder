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
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-blue-50">C</div>
              <Link to="/" className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-600 tracking-tighter">
                CareerFlow <span className="text-slate-900">AI</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 transition">Sign In</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <nav className="hidden md:flex space-x-6">
                  <Link to="/compare" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition">Compare</Link>
                  <Link to="/dashboard" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition">Dashboard</Link>
                  <Link to="/builder" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition">Builder</Link>
                </nav>
                <div className="w-px h-6 bg-slate-200 mx-2"></div>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
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
      <footer className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm font-black uppercase tracking-widest">
          <div className="flex items-center space-x-3 mb-8 md:mb-0">
             <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 shadow-xl flex items-center justify-center text-white font-black text-2xl">C</div>
             <span className="text-slate-900 text-xl tracking-tighter">CareerFlow AI</span>
          </div>
          <div className="mt-8 md:mt-0 text-[10px]">© 2024 CareerFlow AI. Developed for Excellence.</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
