import React from 'react';
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
  ChevronRight,
  FileSearch,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useComparison } from '../hooks/useComparison';
import PdfPreview from '../components/preview/PdfPreview';

export default function ComparisonTool() {
  const { state, actions } = useComparison();

  const handleFile = async (e, setter, labelSetter, isPdf = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isPdf || file.type === 'application/pdf') {
       const text = await actions.handlePdfUpload(file);
       if (text) {
         setter(text);
         if (labelSetter) labelSetter(file.name.replace(/\.[^.]+$/, ''));
       }
    } else {
       const reader = new FileReader();
       reader.onload = (e) => setter(e.target.result);
       reader.readAsText(file);
       if (labelSetter) labelSetter(file.name.replace(/\.[^.]+$/, ''));
       toast.success(`Loaded: ${file.name}`);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 p-8 min-h-screen no-scrollbar overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-600 text-white mb-6 shadow-xl shadow-blue-200 uppercase tracking-[0.2em] font-black text-[10px]">
            <ShieldCheck size={14} className="text-blue-200" />
            <span>Precision AI Synergy Match</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            Maximize Your <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Hireability.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium">Head-to-head resume comparison and precision Job Description matching with PDF support. All features unlocked.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-1 bg-slate-200/50 p-1.5 rounded-2xl mb-10 w-fit backdrop-blur shadow-inner">
          {[
            { id: 'jd', icon: <Target size={18}/>, label: 'JD Match' },
            { id: 'compare', icon: <ArrowRightLeft size={18}/>, label: 'Resume Battle' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => state.setMode(tab.id)}
              className={`flex items-center px-6 py-3 rounded-xl text-sm font-black tracking-tight transition-all duration-300 ${state.mode === tab.id ? 'bg-white shadow-xl shadow-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <span className="mr-2.5">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* ── JD MATCH MODE ────────────────────────────────────────────────── */}
        {state.mode === 'jd' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-8 group transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                       <BriefcaseBusiness size={20} />
                     </div>
                     <span className="font-black text-slate-900 tracking-tight">Job Description</span>
                   </div>
                </div>
                <textarea 
                  className="w-full h-80 bg-slate-50 border border-slate-100 text-slate-700 text-sm p-6 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none font-medium"
                  placeholder="Paste JD text here..." 
                  value={state.jdText} 
                  onChange={e => state.setJdText(e.target.value)} 
                />
              </div>

              <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-8 group transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                       <FileSearch size={20} />
                     </div>
                     <span className="font-black text-slate-900 tracking-tight">Technical Resume</span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <label className="flex items-center cursor-pointer text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition">
                        <Upload size={10} className="mr-2" /> PDF
                        <input type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e, state.setResumeText, null, true)} />
                     </label>
                     <label className="flex items-center cursor-pointer text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition">
                        <Code2 size={10} className="mr-2" /> .tex
                        <input type="file" accept=".tex,.txt" className="hidden" onChange={e => handleFile(e, state.setResumeText, null, false)} />
                     </label>
                   </div>
                </div>
                <textarea 
                  className="w-full h-80 bg-slate-900 text-blue-100 font-mono text-xs p-6 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all resize-none shadow-inner"
                  placeholder="Paste Resume (LaTeX or Plain Text)..." 
                  value={state.resumeText} 
                  onChange={e => state.setResumeText(e.target.value)} 
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button 
                onClick={actions.handleJDMatch} 
                disabled={state.loading}
                className="group relative flex items-center space-x-3 bg-slate-900 text-white px-12 py-5 rounded-4xl font-black text-lg shadow-2xl hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {state.loading ? <Loader2 className="animate-spin" size={24} /> : <FileCheck2 size={24} />}
                <span>{state.loading ? 'Analyzing Synergy...' : 'Launch AI Match Engine'}</span>
              </button>
            </div>

            {/* Results display remains the same... */}
            {state.jdResult && (
              <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-12 mt-12 animate-slide-up">
                 <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-12 border-b pb-12 mb-12">
                    <div className="w-32 h-32 rounded-full bg-slate-900 flex flex-col items-center justify-center text-white ring-8 ring-blue-50 shadow-2xl shrink-0">
                       <span className="text-4xl font-black">{state.jdResult.score}</span>
                       <span className="text-[10px] font-black uppercase text-slate-400">Match %</span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Match Quality Analysis</h2>
                      <p className="text-slate-500 font-medium text-lg">{state.jdResult.summary}</p>
                    </div>
                 </div>
                 <KeywordGroup title="Matched Highlights" items={state.jdResult.matchedKeywords} color="emerald" icon={<CheckCircle2 size={16}/>} />
              </div>
            )}
          </div>
        )}

        {/* ── COMPARISON MODE ─────────────────────────────────────────────────── */}
        {state.mode === 'compare' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-3xl border p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <Code2 size={20} className="text-slate-400" />
                <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Resume Comparison Flow</h4>
              </div>
              <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
                 {['latex', 'text'].map(m => (
                   <button 
                     key={m} onClick={() => {
                        state.setCompareInputMode(m);
                     }}
                     className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${state.compareInputMode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                   >
                     {m}
                   </button>
                 ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <ComparisonInputCard 
                 label={state.resumeALabel} setLabel={state.setResumeALabel}
                 value={state.resumeAText} setValue={state.setResumeAText}
                 mode={state.compareInputMode} 
                 onUpload={e => handleFile(e, state.setResumeAText, state.setResumeALabel, false)}
                 onPdfUpload={e => handleFile(e, state.setResumeAText, state.setResumeALabel, true)}
               />
               <ComparisonInputCard 
                 label={state.resumeBLabel} setLabel={state.setResumeBLabel}
                 value={state.resumeBText} setValue={state.setResumeBText}
                 mode={state.compareInputMode}
                 onUpload={e => handleFile(e, state.setResumeBText, state.setResumeBLabel, false)}
                 onPdfUpload={e => handleFile(e, state.setResumeBText, state.setResumeBLabel, true)}
               />
            </div>

            <div className="flex justify-center pt-4">
              <button 
                onClick={actions.handleCompare} 
                disabled={state.loading}
                className="bg-slate-900 text-white px-12 py-5 rounded-4xl font-black text-lg shadow-2xl hover:bg-slate-800 transition-all flex items-center group"
              >
                {state.loading ? <Loader2 className="animate-spin mr-3" size={24} /> : <Trophy className="mr-3 group-hover:scale-110 transition" size={24} />}
                <span>{state.loading ? 'Judging variants...' : 'Compare Side-by-Side'}</span>
              </button>
            </div>

            {state.compareResult && (
               <div className="animate-slide-up space-y-12 pb-24">
                  <div className="bg-white rounded-[3rem] shadow-2xl border overflow-hidden">
                    <div className="p-12 text-center border-b bg-linear-to-b from-slate-50 to-white">
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">{state.compareResult.winner} <span className="text-slate-400 font-medium">Takes the Lead</span></h2>
                      <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">AI-driven analysis focusing on keyword density, impact quantification, and formatting precision.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-x">
                       <ScoreStat label={state.resumeALabel} score={state.compareResult.resumeAScore} color="blue" />
                       <ScoreStat label={state.resumeBLabel} score={state.compareResult.resumeBScore} color="indigo" />
                    </div>
                  </div>

                  {/* Side-by-Side PDF Comparison (Only if LaTeX input was used) */}
                  {state.compareInputMode === 'latex' && state.resumeAText.includes('\\documentclass') && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest text-center">Visual Benchmarking</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[700px]">
                         <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col">
                            <div className="p-3 bg-slate-900 text-white flex justify-between items-center px-6">
                               <span className="text-[10px] font-black uppercase tracking-widest">{state.resumeALabel} PDF Preview</span>
                            </div>
                            <div className="flex-1 bg-slate-100 p-4 overflow-y-auto no-scrollbar">
                               <div className="max-w-full mx-auto bg-white shadow-lg overflow-hidden transform origin-top scale-90">
                                  <PdfPreview latexCode={state.resumeAText} />
                               </div>
                            </div>
                         </div>
                         <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col">
                            <div className="p-3 bg-slate-900 text-white flex justify-between items-center px-6">
                               <span className="text-[10px] font-black uppercase tracking-widest">{state.resumeBLabel} PDF Preview</span>
                            </div>
                            <div className="flex-1 bg-slate-100 p-4 overflow-y-auto no-scrollbar">
                               <div className="max-w-full mx-auto bg-white shadow-lg overflow-hidden transform origin-top scale-90">
                                  <PdfPreview latexCode={state.resumeBText} />
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-[3rem] p-12 shadow-xl border">
                     <h3 className="text-lg font-black text-slate-900 mb-8 border-l-4 border-blue-600 pl-4 uppercase tracking-tight">Differentiation Summary</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {state.compareResult.differences?.map((diff, i) => (
                          <div key={i} className="flex items-start space-x-4 p-5 bg-slate-50/50 rounded-2xl hover:bg-white hover:shadow-md transition">
                             <ChevronRight size={16} className="text-blue-600 mt-1 shrink-0" />
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

function ComparisonInputCard({ label, setLabel, value, setValue, mode, onUpload, onPdfUpload }) {
  const isLatex = mode === 'latex';
  return (
    <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-8 group transition-all duration-500">
      <div className="flex items-center justify-between mb-6">
         <input 
           className="font-black text-slate-900 bg-transparent outline-none border-b-2 border-transparent focus:border-blue-500 transition-colors"
           value={label}
           onChange={e => setLabel(e.target.value)}
         />
         <div className="flex items-center space-x-2">
           <label className="flex items-center cursor-pointer text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition">
              <Upload size={10} className="mr-2" /> PDF
              <input type="file" accept=".pdf" className="hidden" onChange={onPdfUpload} />
           </label>
           <label className="flex items-center cursor-pointer text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition">
              <Upload size={10} className="mr-2" /> .tex
              <input type="file" accept=".tex,.txt" className="hidden" onChange={onUpload} />
           </label>
         </div>
      </div>
      <textarea 
        className={`w-full h-80 rounded-3xl p-6 outline-none transition-all resize-none shadow-inner text-sm font-medium ${isLatex ? 'bg-slate-900 text-blue-100 font-mono text-xs focus:ring-4 focus:ring-blue-500/10' : 'bg-slate-50 text-slate-700'}`}
        placeholder={isLatex ? 'Paste LaTeX source...' : 'Paste plain text content...'}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
}

function KeywordGroup({ title, items, color, icon }) {
  const bg = color === 'emerald' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700';
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
        {icon} <span className="ml-2">{title}</span>
      </h3>
      <div className="flex flex-wrap gap-2">
         {items?.map(k => (
           <span key={k} className={`px-4 py-2 ${bg} rounded-xl text-xs font-black shadow-sm`}>{k}</span>
         ))}
      </div>
    </div>
  );
}

function ScoreStat({ label, score, color }) {
  const accentColor = color === 'blue' ? 'text-blue-600' : 'text-indigo-600';
  return (
    <div className="p-10 flex flex-col items-center justify-center bg-slate-50/20">
       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{label} Analysis Score</div>
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
             <span className="text-[10px] font-bold text-slate-400">Points</span>
          </div>
       </div>
    </div>
  );
}
