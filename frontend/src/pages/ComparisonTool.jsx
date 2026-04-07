import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ArrowRightLeft, 
  FileCheck2, 
  Loader2, 
  BriefcaseBusiness, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Code2,
  Sparkles,
  Zap,
  Target,
  Trophy,
  ChevronRight
} from 'lucide-react';

export default function ComparisonTool() {
  const [mode, setMode] = useState('jd'); // 'jd' | 'compare'
  const [loading, setLoading] = useState(false);

  // JD Match mode
  const [jdText, setJdText] = useState('');
  const [resumeFile, setResumeFile] = useState('');
  const [jdResult, setJdResult] = useState(null);

  // Compare mode
  const [compareInputMode, setCompareInputMode] = useState('latex'); // 'latex' | 'text'
  const [resumeAText, setResumeAText] = useState('');
  const [resumeBText, setResumeBText] = useState('');
  const [resumeALabel, setResumeALabel] = useState('Resume A');
  const [resumeBLabel, setResumeBLabel] = useState('Resume B');
  const [compareResult, setCompareResult] = useState(null);

  const readFile = (file, setter, labelSetter) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setter(e.target.result);
    reader.readAsText(file);
    if (labelSetter) labelSetter(file.name.replace(/\.[^.]+$/, ''));
    toast.success(`Loaded: ${file.name}`);
  };

  const handleResumeFileUpload = (e) => readFile(e.target.files[0], setResumeFile, null);

  const handleJDMatch = async () => {
    if (!jdText.trim()) { toast.error('Please paste a Job Description'); return; }
    if (!resumeFile.trim()) { toast.error('Please upload or paste your resume'); return; }
    setLoading(true); setJdResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/jd-match', { jobDescription: jdText, resumeText: resumeFile });
      if (res.data.success) { setJdResult(res.data); toast.success(`Match Score: ${res.data.score}%`, { icon: '🎯' }); }
      else toast.error('Analysis failed');
    } catch { toast.error('Failed to analyze'); }
    finally { setLoading(false); }
  };

  const handleCompare = async () => {
    if (!resumeAText.trim() || !resumeBText.trim()) { toast.error('Please provide both resumes'); return; }
    setLoading(true); setCompareResult(null);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/compare-text', {
        resumeAText, resumeBText, resumeALabel, resumeBLabel, inputMode: compareInputMode
      });
      if (res.data.success) setCompareResult(res.data.data);
      else toast.error('Comparison failed');
    } catch { toast.error('Comparison failed — check backend'); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex-1 bg-slate-50 p-8 min-h-screen no-scrollbar overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6 shadow-sm">
            <Zap size={14} className="text-blue-600" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">AI Career Suite — Analyzer v2.0</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Maximize Your <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Hireability.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium">Head-to-head resume comparison and precision Job Description matching powered by Gemini AI.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-1 bg-slate-200/50 p-1.5 rounded-2xl mb-10 w-fit backdrop-blur shadow-inner">
          {[
            { id: 'jd', icon: <Target size={18}/>, label: 'Job Description Match' },
            { id: 'compare', icon: <ArrowRightLeft size={18}/>, label: 'Resume Head-to-Head' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setMode(tab.id)}
              className={`flex items-center px-6 py-3 rounded-xl text-sm font-black tracking-tight transition-all duration-300 ${mode === tab.id ? 'bg-white shadow-xl shadow-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <span className="mr-2.5">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* ── JD MATCH MODE ────────────────────────────────────────────────── */}
        {mode === 'jd' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* JD Input */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 group hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                       <BriefcaseBusiness size={20} />
                     </div>
                     <span className="font-black text-slate-900 tracking-tight">Job Description</span>
                   </div>
                   <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{jdText.length} Characters</div>
                </div>
                <textarea 
                  className="w-full h-80 bg-slate-50 border border-slate-100 text-slate-700 text-sm p-6 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none font-medium"
                  placeholder="Paste the full job responsibilities and requirements here..." 
                  value={jdText} 
                  onChange={e => setJdText(e.target.value)} 
                />
              </div>

              {/* Resume Input */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 group hover:shadow-2xl hover:shadow-indigo-200/20 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                       <FileText size={20} />
                     </div>
                     <span className="font-black text-slate-900 tracking-tight">Technical Resume</span>
                   </div>
                   <label className="flex items-center cursor-pointer text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition shadow-sm">
                      <Upload size={12} className="mr-2" /> Upload .tex
                      <input type="file" accept=".tex,.txt" className="hidden" onChange={handleResumeFileUpload} />
                   </label>
                </div>
                <textarea 
                  className="w-full h-80 bg-slate-900 text-blue-100 font-mono text-xs p-6 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-inner"
                  placeholder="Paste your resume LaTeX source code or plain text..." 
                  value={resumeFile} 
                  onChange={e => setResumeFile(e.target.value)} 
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button 
                onClick={handleJDMatch} 
                disabled={loading}
                className="group relative flex items-center space-x-3 bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-1 disabled:opacity-50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                {loading ? <Loader2 className="animate-spin" size={24} /> : <FileCheck2 size={24} />}
                <span>{loading ? 'Analyzing Synergy...' : 'Launch AI Match Engine'}</span>
              </button>
            </div>

            {/* Results Area */}
            {jdResult && (
              <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 border border-slate-100 p-12 mt-12 animate-slide-up">
                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-12 border-b border-slate-50 pb-12 mb-12">
                   <div className="w-32 h-32 rounded-full bg-slate-900 flex flex-col items-center justify-center text-white ring-8 ring-blue-50 shadow-2xl shadow-blue-200 shrink-0">
                      <span className="text-4xl font-black tracking-tighter">{jdResult.score}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Match %</span>
                   </div>
                   <div className="flex-1 text-center md:text-left">
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Automated Match Summary</p>
                     <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                        {jdResult.score >= 75 ? 'Optimal Fit Found ⚡' : jdResult.score >= 50 ? 'Promising Synergy 📈' : 'Structural Gaps Detected 🛠️'}
                     </h2>
                     <p className="text-slate-500 font-medium text-lg leading-relaxed">{jdResult.summary}</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
                      <CheckCircle2 size={16} className="mr-2 text-emerald-500" /> Key Strengths Found
                    </h3>
                    <div className="flex flex-wrap gap-2">
                       {jdResult.matchedKeywords?.map(k => (
                         <span key={k} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black shadow-sm border border-emerald-100">{k}</span>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
                      <XCircle size={16} className="mr-2 text-rose-500" /> Missing Opportunities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                       {jdResult.missingKeywords?.map(k => (
                         <span key={k} className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-black shadow-sm border border-rose-100">{k}</span>
                       ))}
                    </div>
                  </div>
                </div>

                {jdResult.suggestions?.length > 0 && (
                   <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 text-slate-100 group-hover:text-amber-200 transition-colors">
                       <Sparkles size={48} />
                     </div>
                     <h3 className="text-slate-900 font-black text-lg mb-6 flex items-center">
                       <AlertTriangle size={20} className="mr-3 text-amber-500" /> Strategic Recommendations
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                       {jdResult.suggestions.map((s, i) => (
                         <div key={i} className="flex items-start space-x-4 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
                           <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-[10px] font-black flex items-center justify-center shrink-0">{i+1}</span>
                           <p className="text-sm text-slate-600 font-medium leading-relaxed">{s}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── COMPARISON MODE ─────────────────────────────────────────────────── */}
        {mode === 'compare' && (
          <div className="space-y-8 animate-fade-in">
            {/* Format Sub-Toggle */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Code2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Comparison Engine</h4>
                  <p className="text-[10px] font-bold text-slate-400">Switch between Raw LaTeX or Text parsing</p>
                </div>
              </div>
              <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
                 <button 
                   onClick={() => setCompareInputMode('latex')}
                   className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${compareInputMode === 'latex' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   LaTeX
                 </button>
                 <button 
                   onClick={() => setCompareInputMode('text')}
                   className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${compareInputMode === 'text' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   Text
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <ComparisonInputCard 
                 label={resumeALabel} setLabel={setResumeALabel}
                 value={resumeAText} setValue={setResumeAText}
                 color="blue" mode={compareInputMode} 
                 onUpload={e => readFile(e.target.files[0], setResumeAText, setResumeALabel)}
               />
               <ComparisonInputCard 
                 label={resumeBLabel} setLabel={setResumeBLabel}
                 value={resumeBText} setValue={setResumeBText}
                 color="indigo" mode={compareInputMode}
                 onUpload={e => readFile(e.target.files[0], setResumeBText, setResumeBLabel)}
               />
            </div>

            <div className="flex justify-center pt-4">
              <button 
                onClick={handleCompare} 
                disabled={loading}
                className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-1 disabled:opacity-50 flex items-center"
              >
                {loading ? <Loader2 className="animate-spin mr-3" size={24} /> : <Trophy className="mr-3" size={24} />}
                <span>{loading ? 'Running Head-to-Head...' : 'Determine Better Variant'}</span>
              </button>
            </div>

            {compareResult && (
               <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
                  <div className="p-12 text-center border-b border-slate-50 bg-linear-to-b from-slate-50 to-white">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4 block">AI Benchmarking Report</span>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">{compareResult.winner} <span className="text-slate-400 font-medium">Takes the Podium</span></h2>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Based on keywords density, formatting consistency, and impact quantification.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-slate-100">
                     <ScoreStat label={resumeALabel} score={compareResult.resumeAScore} color="blue" />
                     <ScoreStat label={resumeBLabel} score={compareResult.resumeBScore} color="indigo" />
                  </div>

                  <div className="p-12">
                     <h3 className="text-lg font-black text-slate-900 mb-8 border-l-4 border-blue-600 pl-4 uppercase tracking-tight">Key Differentiation Factors</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {compareResult.differences?.map((diff, i) => (
                          <div key={i} className="flex items-start space-x-4 p-5 bg-slate-50/50 rounded-2xl group hover:bg-white hover:shadow-md transition duration-300">
                             <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                               <ChevronRight size={16} className="text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                             </div>
                             <p className="text-sm font-medium text-slate-600 leading-relaxed">{diff}</p>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}
          </div>
        )}

      </div>
      
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function ComparisonInputCard({ label, setLabel, value, setValue, color, mode, onUpload }) {
  const isLatex = mode === 'latex';
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 group hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
         <div className="flex items-center space-x-3">
           <div className={`w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-200 animate-pulse`} />
           <input 
             className="font-black text-slate-900 bg-transparent outline-none border-b-2 border-transparent focus:border-blue-500 transition-colors"
             value={label}
             onChange={e => setLabel(e.target.value)}
           />
         </div>
         <label className={`flex items-center cursor-pointer text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition`}>
            <Upload size={10} className="mr-2" /> Load .tex
            <input type="file" accept=".tex,.txt" className="hidden" onChange={onUpload} />
         </label>
      </div>
      <textarea 
        className={`w-full h-80 rounded-3xl p-6 outline-none transition-all resize-none shadow-inner text-sm font-medium ${isLatex ? 'bg-slate-900 text-blue-100 font-mono text-xs focus:ring-4 focus:ring-blue-500/10' : 'bg-slate-50 text-slate-700 focus:ring-4 focus:ring-slate-200/50'}`}
        placeholder={isLatex ? '\\documentclass{...}' : 'Enter full resume content...'}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
}

function ScoreStat({ label, score, color }) {
  const accentColor = color === 'blue' ? 'text-blue-600' : 'text-indigo-600';
  const bgColor = color === 'blue' ? 'bg-blue-50' : 'bg-indigo-50';
  return (
    <div className={`p-10 flex flex-col items-center justify-center ${bgColor}/20`}>
       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{label} Reliability</div>
       <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
             <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
             <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
               strokeDasharray={364} 
               strokeDashoffset={364 - (364 * score) / 100} 
               className={`${accentColor} transition-all duration-1000 ease-out`} 
             />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-4xl font-black text-slate-900 tracking-tighter">{score}</span>
             <span className="text-[10px] font-bold text-slate-400">Score</span>
          </div>
       </div>
    </div>
  );
}
