import React from 'react';
import { Sparkles, PanelRightClose, BriefcaseBusiness, Code2, Search, FileText, AlertCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AiActionCard from './AiActionCard';
import AiResultDisplay from './AiResultDisplay';

export default function AiPowerLab({ 
  jdSidebarOpen, 
  setJdSidebarOpen, 
  jdText, 
  setJdText, 
  handleQuickJDMatch, 
  jdAnalysis, 
  handleAiAction, 
  setAiResult,
  loadingStates,
  portfolioUrl,
  setPortfolioUrl,
  handlePortfolioAnalyze,
  aiResult,
  setResumeData
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
                  placeholder="Paste JD here to match with your resume..." 
                  value={jdText} 
                  onChange={e => setJdText(e.target.value)} 
                />
                <button onClick={handleQuickJDMatch} disabled={loadingStates?.jdMatch} className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 transition">
                   {loadingStates?.jdMatch ? 'Analyzing...' : 'Check ATS Compatibility'}
                </button>
              </div>
  
              {jdAnalysis && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                    <div className="text-2xl font-black text-emerald-600">{(jdAnalysis.score || 0)}%</div>
                    <div className="text-[10px] font-bold text-emerald-400">ATS MATCH</div>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                    <div className="text-2xl font-black text-indigo-600">{(jdAnalysis.matchedKeywords?.length || 0)}</div>
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
                  value={portfolioUrl || ''}
                  onChange={e => setPortfolioUrl(e.target.value)}
                />
                <button onClick={handlePortfolioAnalyze} className="bg-cyan-500 hover:bg-cyan-400 p-2 rounded-lg text-slate-900"><Search size={16}/></button>
              </div>
            </div>

            {/* AI Results Display */}
            {aiResult && (
              <div className="animate-fade-in relative group">
                <button 
                  onClick={() => setAiResult(null)} 
                  className="absolute top-0 right-0 p-2 text-slate-300 hover:text-rose-500 transition-colors z-10"
                >
                  <Trash2 size={16}/>
                </button>
                <AiResultDisplay 
                  result={aiResult} 
                  onApply={(type, data) => {
                    if (type === 'project') {
                      setResumeData(prev => ({
                        ...prev,
                        projects: [...(prev.projects || []), data]
                      }));
                      toast.success('Project added to resume!');
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
}
