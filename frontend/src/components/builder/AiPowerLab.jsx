import React from 'react';
import { Sparkles, PanelRightClose, BriefcaseBusiness, Code2, Search, FileText, AlertCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AiActionCard from './AiActionCard';

export default function AiPowerLab({
  jdSidebarOpen,
  setJdSidebarOpen,
  jdText,
  setJdText,
  handleQuickJDMatch,
  jdMatchLoading,
  jdAnalysis,
  handleAiAction,
  _aiLoading,
  loadingStates,
  portfolioUrl,
  setPortfolioUrl,
  handlePortfolioAnalyze,
  aiResult,
  setAiResult
}) {
  return (
    jdSidebarOpen && (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setJdSidebarOpen(false)} />
        <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in">
          <div className="p-6 border-b flex justify-between items-center bg-indigo-600 text-white">
            <h3 className="text-xl font-bold flex items-center"><Sparkles className="mr-2"/> AI Power Lab</h3>
            <button onClick={() => setJdSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><PanelRightClose/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* JD Input */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 flex items-center"><BriefcaseBusiness size={18} className="mr-2 text-indigo-600"/> Target Job Description</h4>
              <textarea 
                className="w-full h-32 bg-slate-50 border rounded-xl p-4 text-xs outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="Paste JD here logic for all AI actions..." 
                value={jdText} 
                onChange={e => setJdText(e.target.value)} 
              />
              <button onClick={handleQuickJDMatch} disabled={jdMatchLoading} className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 transition">
                 Check ATS Compatibility
              </button>
            </div>

            {jdAnalysis && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                  <div className="text-2xl font-black text-emerald-600">{jdAnalysis.score}%</div>
                  <div className="text-[10px] font-bold text-emerald-400">ATS MATCH</div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                  <div className="text-2xl font-black text-indigo-600">{jdAnalysis.matchedKeywords?.length}</div>
                  <div className="text-[10px] font-bold text-indigo-400">KEYWORDS FOUND</div>
                </div>
              </div>
            )}

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-4">
              <AiActionCard 
                icon={<Sparkles className="text-amber-500"/>} 
                title="Tailor Resume" 
                desc="Smart bullet rewriter"
                loading={loadingStates?.tailoring}
                onClick={() => handleAiAction('tailor')}
              />
              <AiActionCard 
                icon={<FileText className="text-blue-500"/>} 
                title="Cover Letter" 
                desc="Generate LaTeX body"
                loading={loadingStates?.generatingLetter}
                onClick={() => handleAiAction('cover-letter')}
              />
              <AiActionCard 
                icon={<AlertCircle className="text-rose-500"/>} 
                title="Skill Gap" 
                desc="Identify missing skills"
                loading={loadingStates?.skillGap}
                onClick={() => handleAiAction('skill-gap')}
              />
              <AiActionCard 
                icon={<BriefcaseBusiness className="text-indigo-500"/>} 
                title="Interview Prep" 
                desc="Prep for this JD"
                loading={loadingStates?.interviewPrep}
                onClick={() => handleAiAction('interview-prep')}
              />
            </div>

            {/* URL Analyze */}
            <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-4">
              <div className="flex items-center space-x-2">
                <Code2 className="text-cyan-400" size={18}/>
                <h4 className="font-bold">Portfolio Intelligence</h4>
              </div>
              <p className="text-[10px] text-slate-400">Paste your GitHub / Portfolio URL to extract projects.</p>
              <div className="flex space-x-2">
                <input 
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-cyan-400"
                  placeholder="https://github.com/..."
                  value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
                />
                <button onClick={handlePortfolioAnalyze} className="bg-cyan-500 hover:bg-cyan-400 p-2 rounded-lg text-slate-900"><Search size={16}/></button>
              </div>
            </div>

            {/* AI Results Display */}
            {aiResult && (
              <div className="bg-slate-50 border rounded-xl p-4 animate-fade-in relative">
                <button onClick={() => setAiResult(null)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"><Trash2 size={14}/></button>
                <h5 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-widest">{aiResult.type.replace('-',' ')}</h5>
                <div className="text-xs text-slate-700 space-y-3 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                  {JSON.stringify(aiResult.data, null, 2)}
                </div>
                <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(aiResult.data, null, 2)); toast.success('Copied!'); }} className="mt-4 w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50">Copy Result</button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
}
