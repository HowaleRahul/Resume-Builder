import React, { useState } from 'react';
import { Sparkles, PanelRightClose, BriefcaseBusiness, Code2, Search, FileText, AlertCircle, Trash2, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AiActionCard from './AiActionCard';
import AiResultDisplay from './AiResultDisplay';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

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
  setResumeData,
  handleParseText,
  loading
}) {
  // Resume upload state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeLabel, setResumeLabel] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setResumeFile(file);
    setResumeLabel(file.name.replace(/\.[^.]+$/, ''));
    
    if (file.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('file', file);
      setResumeLoading(true);
      setUploadProgress(0);
      
      try {
        const res = await axios.post(`${API_BASE_URL}/api/ai/parse-pdf`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        });
        
        if (res.data.success) {
          setResumeText(res.data.text);
          toast.success('Resume PDF extracted');
        } else {
          toast.error('Failed to extract resume');
        }
      } catch (err) {
        console.error('Upload error:', err);
        toast.error('Error parsing resume PDF');
      } finally {
        setResumeLoading(false);
        setTimeout(() => setUploadProgress(0), 1500);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setResumeText(ev.target.result);
        toast.success('Resume file loaded');
      };
      reader.readAsText(file);
    }
  };

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
            {/* Resume Upload Section */}
            <div className="p-5 bg-slate-50 border border-indigo-100 rounded-2xl space-y-4">
              <div className="flex items-center space-x-2 text-slate-900">
                <Upload className="text-indigo-600" size={18}/>
                <h4 className="font-bold uppercase tracking-tight text-sm text-indigo-900">Resume Intelligence</h4>
              </div>
              
              <div className="flex flex-col space-y-3">
                <input 
                  type="file" 
                  accept=".pdf,.tex,.txt" 
                  className="hidden" 
                  id="resume-upload" 
                  onChange={handleResumeUpload} 
                />
                <label 
                  htmlFor="resume-upload" 
                  className="cursor-pointer flex items-center justify-center px-4 py-4 bg-white border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/30 text-indigo-600 rounded-xl transition-all group"
                >
                  {resumeLoading ? (
                    <Loader2 className="animate-spin mr-2" size={18} />
                  ) : (
                    <Upload className="mr-2 group-hover:-translate-y-1 transition-transform" size={18} />
                  )}
                  <span className="text-sm font-bold">{resumeLabel || 'Upload PDF for Analysis'}</span>
                </label>

                {uploadProgress > 0 && (
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-300 ease-out" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {resumeFile && resumeFile.type === 'application/pdf' && (
                <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 shadow-xl bg-white animate-fade-in">
                  <div className="bg-slate-900 px-3 py-2 text-[10px] font-black text-cyan-400 border-b flex justify-between items-center">
                    LIVE PDF PREVIEW
                    <span className="text-white opacity-60 uppercase">{resumeFile.name}</span>
                  </div>
                  <iframe 
                    src={URL.createObjectURL(resumeFile)} 
                    className="w-full h-80 border-none" 
                    title="Resume Preview"
                  />
                  <div className="p-3 bg-slate-50 border-t flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">Text extracted successfully</span>
                    <button 
                      onClick={() => handleParseText(resumeText)}
                      disabled={loading || resumeLoading}
                      className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin mr-2" size={12}/> : <Sparkles className="mr-2" size={12}/>}
                      USE IN BUILDER
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* JD Input */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 flex items-center"><BriefcaseBusiness size={18} className="mr-2 text-indigo-600"/> Target Job Description</h4>
              <textarea 
                className="w-full h-32 bg-slate-50 border rounded-xl p-4 text-xs outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="Paste JD here to match with your resume..." 
                value={jdText} 
                onChange={e => setJdText(e.target.value)} 
              />
              <button 
                onClick={() => {
                   if (resumeText && resumeFile) {
                      // If we have extracted text, pass it specifically or use it in the prompt
                      handleQuickJDMatch(resumeText);
                   } else {
                      handleQuickJDMatch();
                   }
                }} 
                disabled={loadingStates?.jdMatch} 
                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-md active:scale-[0.98]"
              >
                 {loadingStates?.jdMatch ? 'Analyzing Requirements...' : 'Check ATS Compatibility'}
              </button>
            </div>

            {jdAnalysis && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center shadow-sm">
                  <div className="text-2xl font-black text-emerald-600">{(jdAnalysis.score || 0)}%</div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">ATS MATCH</div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center shadow-sm">
                  <div className="text-2xl font-black text-indigo-600">{(jdAnalysis.matchedKeywords?.length || 0)}</div>
                  <div className="text-[10px] font-bold text-indigo-400 uppercase">KEYWORDS FOUND</div>
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
            <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-4 shadow-xl">
              <div className="flex items-center space-x-2">
                <Code2 className="text-cyan-400" size={18}/>
                <h4 className="font-bold flex-1">Portfolio Intelligence</h4>
                <div className="px-2 py-0.5 bg-cyan-900/30 text-cyan-400 text-[8px] font-black rounded uppercase">Experimental</div>
              </div>
              <p className="text-[10px] text-slate-400">Sync with your GitHub or Portfolio to pull project data.</p>
              <div className="flex space-x-2">
                <input 
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-cyan-400 placeholder:text-slate-600"
                  placeholder="https://github.com/..."
                  value={portfolioUrl || ''}
                  onChange={e => setPortfolioUrl(e.target.value)}
                />
                <button 
                  onClick={handlePortfolioAnalyze} 
                  className="bg-cyan-500 hover:bg-cyan-400 p-2 rounded-lg text-slate-900 transition-all active:scale-95"
                >
                  <Search size={16}/>
                </button>
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
