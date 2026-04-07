import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Play, Sparkles, FileText, Trash2, Loader2, Plus, Code2, AlertCircle, XCircle, BriefcaseBusiness, PanelRightClose, Search, RotateCcw, CheckCircle2 } from 'lucide-react';
import TabButton from '../components/ui/TabButton';
import InputField from '../components/ui/InputField';
import ExperienceEditor from '../components/editor/ExperienceEditor';
import PdfPreview from '../components/preview/PdfPreview';
import { mergeDataIntoTemplate } from '../utils/templateMerger';
import { TEMPLATE_REGISTRY } from '../templates';

// ─── Constants ──────────────────────────────────────────────────────────────

const DEFAULT_RESUME_DATA = {
  personal: { name: "Your Name", email: "you@email.com", phone: "+1 234 567 8900", location: "City, Country", github: "", linkedin: "" },
  education: [{ title: "B.S. Computer Science", companyOrInst: "University Name", date: "May 2024", location: "New York, NY", details: "GPA: 3.9/4.0" }],
  experience: [{ title: "Software Engineer", companyOrInst: "Company Inc.", location: "San Francisco, CA", date: "2022 - Present", bullets: ["Developed scalable web applications using React and Node.js", "Improved performance by 40% through optimization"] }],
  projects: [{ title: "AI Resume Builder", date: "2024", location: "GitHub", bullets: ["Built AI-powered resume parsing using Gemini API", "Deployed on Vercel with real-time PDF preview"] }],
  skills: [
    { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS"] },
    { category: "Backend", items: ["Node.js", "Express", "MongoDB"] },
    { category: "DevOps & Tools", items: ["Docker", "Git", "AWS"] }
  ]
};

export default function Builder() {
  const [activeTab, setActiveTab] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rb_activeTab')) || 'input'; } catch { return 'input'; }
  });
  const [codeEditMode, setCodeEditMode] = useState(false);
  const [latexInput, setLatexInput] = useState(() => {
    try { return localStorage.getItem('rb_latexInput') || ''; } catch { return ''; }
  });
  const [resumeData, setResumeData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rb_resumeData')) || null; } catch { return null; }
  });
  const [generatedLatex, setGeneratedLatex] = useState(() => {
    try { return localStorage.getItem('rb_generatedLatex') || ''; } catch { return ''; }
  });
  const [previewCode, setPreviewCode] = useState(() => {
    try { return localStorage.getItem('rb_generatedLatex') || ''; } catch { return ''; }
  });
  const [loading, setLoading] = useState(false);
  const [atsScore, setAtsScore] = useState(null);
  const [compileError, setCompileError] = useState(null);
  const [jdSidebarOpen, setJdSidebarOpen] = useState(false);
  const [jdText, setJdText] = useState('');
  const [jdAnalysis, setJdAnalysis] = useState(null);
  const [jdMatchLoading, setJdMatchLoading] = useState(false);
  const [templateType, setTemplateType] = useState(() => {
    try { return localStorage.getItem('rb_templateType') || 'jitin-nair'; } catch { return 'jitin-nair'; }
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const location = useLocation();

  // ─── Persist State to localStorage ─────────────────────────────────────────
  useEffect(() => { try { localStorage.setItem('rb_activeTab', JSON.stringify(activeTab)); } catch {} }, [activeTab]);
  useEffect(() => { try { localStorage.setItem('rb_latexInput', latexInput); } catch {} }, [latexInput]);
  useEffect(() => { try { localStorage.setItem('rb_resumeData', JSON.stringify(resumeData)); } catch {} }, [resumeData]);
  useEffect(() => { try { localStorage.setItem('rb_generatedLatex', generatedLatex); } catch {} }, [generatedLatex]);
  useEffect(() => { try { localStorage.setItem('rb_templateType', templateType); } catch {} }, [templateType]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const template = queryParams.get('template');

    if (id) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/resume/${id}`)
        .then(res => {
          if (res.data.success) {
            const resume = res.data.resume;
            const latestVersion = resume.versions[resume.versions.length - 1];
            if (latestVersion && latestVersion.jsonSnapshot) {
              setResumeData(latestVersion.jsonSnapshot);
              setTemplateType(resume.templateType || 'jitin-nair');
              const code = resume.generatedLatexCode || resume.originalLatexCode || '';
              setGeneratedLatex(code);
              setPreviewCode(code);
              setActiveTab('edit');
            }
          }
        })
        .catch(err => console.error("Failed to load resume", err))
        .finally(() => setLoading(false));
    } else if (template && TEMPLATE_REGISTRY[template]) {
      setTemplateType(template);
      setResumeData({ ...DEFAULT_RESUME_DATA });
      setLatexInput(TEMPLATE_REGISTRY[template].code);
      setGeneratedLatex(TEMPLATE_REGISTRY[template].code);
      setActiveTab('edit');
      toast.success(`Template loaded! Edit visually or in the code editor.`, { icon: '📄' });
    }
  }, [location.search]);

  // Syntax check
  const checkLatexSyntax = async (code) => {
    try {
      const res = await axios.post('http://localhost:5000/api/ai/check-syntax', { latexCode: code });
      if (!res.data.valid) {
        setCompileError({
          type: 'Syntax Error',
          message: res.data.errors[0] || 'Unknown LaTeX syntax issue.',
          log: res.data.errors.join('\n')
        });
        toast.error("Syntax errors detected in LaTeX!");
      } else {
        setCompileError(null);
      }
    } catch (e) {
      setCompileError(null);
    }
  };

  // Field updaters
  const updatePersonal = (field, value) => setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  const updateEducation = (idx, field, value) => {
    const n = [...(resumeData.education || [])]; n[idx] = { ...n[idx], [field]: value };
    setResumeData({ ...resumeData, education: n });
  };
  const removeEducation = (idx) => { const n = [...resumeData.education]; n.splice(idx, 1); setResumeData({ ...resumeData, education: n }); };

  const handleParse = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/resume/parse', { latexCode: latexInput });
      if (res.data.success) {
        setResumeData(res.data.data);
        toast.success('Resume parsed successfully!', { icon: '✨' });
        setActiveTab('edit');
      }
    } catch (err) {
      toast.error('Failed to parse LaTeX');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (codeEditMode) {
        setPreviewCode(generatedLatex);
        setActiveTab('preview');
        toast.success('Preview updated!');
        return;
      }
      const rawTemplate = TEMPLATE_REGISTRY[templateType]?.code || '';
      const merged = mergeDataIntoTemplate(rawTemplate, resumeData, templateType);
      setGeneratedLatex(merged);
      setPreviewCode(merged);
      checkLatexSyntax(merged);
      setActiveTab('preview');
      toast.success('Preview generated!', { icon: '✅' });
    } catch (err) {
      toast.error('Failed to generate preview');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickJDMatch = async () => {
    if (!jdText.trim()) return toast.error("Paste a Job Description first!");
    setJdMatchLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/jd-match', {
        jobDescription: jdText,
        resumeText: JSON.stringify(resumeData)
      });
      setJdAnalysis(res.data);
      toast.success("AI Analysis Complete!");
    } catch (err) {
      toast.error("Analysis failed.");
    } finally {
      setJdMatchLoading(false);
    }
  };

  const handleAiAction = async (endpoint, extra = {}) => {
    if (!jdText.trim() && endpoint !== 'analyze-portfolio') return toast.error("Paste a JD first for context!");
    setAiLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/ai/${endpoint}`, {
        resumeData,
        jobDescription: jdText,
        ...extra
      });
      if (endpoint === 'tailor') {
        setResumeData(res.data.tailoredData);
        toast.success("Resume Tailored!");
      } else {
        setAiResult({ type: endpoint, data: res.data });
        toast.success("AI Generation Complete!");
      }
    } catch (err) {
      toast.error("AI Action failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const handlePortfolioAnalyze = async () => {
    if (!portfolioUrl.trim()) return toast.error("Enter a URL!");
    setAiLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/analyze-portfolio', { url: portfolioUrl });
      const newProjects = res.data.extractedData.projects || [];
      setResumeData({ ...resumeData, projects: [...(resumeData.projects || []), ...newProjects] });
      toast.success(`Extracted ${newProjects.length} projects!`);
    } catch (err) {
      toast.error("Portfolio analysis failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleResetTemplate = () => {
    if (window.confirm("Overwrite your direct code edits with a fresh version of the template?")) {
      const base = TEMPLATE_REGISTRY[templateType]?.code || '';
      const merged = mergeDataIntoTemplate(base, resumeData, templateType);
      setGeneratedLatex(merged);
      toast.success("Template Re-merged!");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] bg-slate-50 overflow-hidden relative">

      {/* Header Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
          <TabButton active={activeTab === 'input'} onClick={() => setActiveTab('input')} icon={<FileText size={16}/>} label="Source Code" />
          <TabButton active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} icon={<Sparkles size={16}/>} label="Editor" disabled={!resumeData} />
          <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} icon={<Play size={16}/>} label="Preview & Export" disabled={!generatedLatex && !previewCode} />
        </div>

        <div className="flex space-x-3 items-center">
          {activeTab === 'edit' && (
            <>
              <select
                value={templateType}
                onChange={e => setTemplateType(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(TEMPLATE_REGISTRY).map(([key, t]) => (
                  <option key={key} value={key}>{t.label}</option>
                ))}
              </select>

              <button
                onClick={() => setCodeEditMode(m => !m)}
                className={`flex items-center text-sm font-semibold px-3 py-2 rounded-lg border transition ${codeEditMode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
              >
                <Code2 size={15} className="mr-1.5" />
                {codeEditMode ? 'Visual Mode' : 'Code Mode'}
              </button>
            </>
          )}

          {activeTab === 'input' && (
            <button onClick={handleParse} disabled={!latexInput || loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center">
              {loading && <Loader2 size={16} className="animate-spin mr-2" />}
              {loading ? 'Parsing...' : 'Parse Resume ✨'}
            </button>
          )}
          {activeTab === 'edit' && (
            <button onClick={handleGenerate} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center">
              {loading && <Loader2 size={16} className="animate-spin mr-2" />}
              {loading ? 'Generating...' : 'Generate & Preview 🚀'}
            </button>
          )}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 relative overflow-hidden">
        {activeTab === 'input' && (
          <div className="absolute inset-0 flex flex-col bg-white p-6 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Import Resume</h2>
            <textarea
              className="flex-1 w-full bg-slate-900 text-slate-100 font-mono p-4 rounded-xl shadow-inner focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Paste LaTeX or text here..."
              value={latexInput}
              onChange={(e) => setLatexInput(e.target.value)}
            />
          </div>
        )}

        {activeTab === 'edit' && resumeData && (
          codeEditMode ? (
            /* Code Editor */
            <div className="absolute inset-0 p-6 flex flex-col bg-slate-900 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Code2 className="text-blue-400" size={18} />
                  <span className="text-slate-100 font-semibold">LaTeX Editor</span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setJdSidebarOpen(true)}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-900/50 text-indigo-300 hover:bg-indigo-900/80 border border-indigo-700/30 rounded-lg text-xs font-semibold transition"
                  >
                    <BriefcaseBusiness size={14} />
                    <span>AI JD Match</span>
                  </button>
                  <button onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded transition flex items-center">
                    <Play size={12} className="mr-1.5" /> Recompile
                  </button>
                </div>
              </div>
              <div className="flex-1 flex space-x-4 min-h-0">
                <div className="flex-1 flex flex-col relative">
                  <textarea
                    className="flex-1 bg-slate-800 text-blue-100 font-mono p-4 rounded-xl shadow-inner outline-none resize-none border border-slate-700 text-sm leading-relaxed"
                    value={generatedLatex}
                    onChange={(e) => setGeneratedLatex(e.target.value)}
                  />
                  <button 
                    onClick={handleResetTemplate}
                    className="absolute top-4 right-4 p-2 bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
                    title="Reset to Template"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
                {compileError && (
                  <div className="w-80 bg-red-900/20 border border-red-500/30 rounded-xl p-4 overflow-y-auto font-mono text-xs text-red-200">
                    <div className="text-red-400 font-bold flex items-center mb-2"><XCircle size={14} className="mr-2"/> {compileError.type}</div>
                    {compileError.message}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Visual Editor */
            <div className="absolute inset-0 overflow-y-auto p-6 scroll-smooth bg-slate-50">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><FileText className="mr-2 text-blue-600" size={18}/> Personal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Name" value={resumeData.personal?.name} onChange={v => updatePersonal('name', v)} />
                    <InputField label="Email" value={resumeData.personal?.email} onChange={v => updatePersonal('email', v)} />
                    <InputField label="Phone" value={resumeData.personal?.phone} onChange={v => updatePersonal('phone', v)} />
                    <InputField label="Location" value={resumeData.personal?.location} onChange={v => updatePersonal('location', v)} />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center"><Sparkles className="mr-2 text-amber-500" size={18}/> Experience</h3>
                  <ExperienceEditor 
                    experienceArray={resumeData.experience || []} 
                    onUpdateRole={(idx, f, v) => {
                      const n = [...resumeData.experience]; n[idx] = {...n[idx], [f]: v};
                      setResumeData({...resumeData, experience: n});
                    }} 
                    onRemoveRole={idx => {
                      const n = resumeData.experience.filter((_, i) => i !== idx);
                      setResumeData({...resumeData, experience: n});
                    }} 
                    onAddRole={() => setResumeData({...resumeData, experience: [...(resumeData.experience || []), { title: '', companyOrInst: '', date: '', location: '', url: '', bullets: [''] }]})}
                    onEnhance={(idx, text) => { /* Reuse existing enhance logic or call handleAiAction */ }}
                  />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center"><Code2 className="mr-2 text-emerald-500" size={18}/> Skills</h3>
                    <button onClick={() => setResumeData({...resumeData, skills: [...(resumeData.skills || []), { category: 'New Category', items: [''] }]})} className="text-xs bg-slate-100 font-bold px-3 py-1.5 rounded-lg flex items-center"><Plus size={14} className="mr-1"/> Add Category</button>
                  </div>
                  <div className="space-y-4">
                    {(resumeData.skills || []).map((cat, cIdx) => (
                      <div key={cIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                        <button onClick={() => setResumeData({...resumeData, skills: resumeData.skills.filter((_, i) => i !== cIdx)})} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
                        <input className="bg-transparent font-bold text-slate-700 outline-none border-b border-slate-300 focus:border-blue-500 mb-3 w-full" value={cat.category} onChange={e => {
                          const n = [...resumeData.skills]; n[cIdx] = {...n[cIdx], category: e.target.value};
                          setResumeData({...resumeData, skills: n});
                        }} />
                        <div className="flex flex-wrap gap-2">
                          {(cat.items || []).map((item, iIdx) => (
                            <div key={iIdx} className="flex items-center bg-white border border-slate-200 rounded-full px-3 py-1">
                              <input className="bg-transparent text-sm w-24 outline-none" value={item} onChange={e => {
                                const n = [...resumeData.skills];
                                const items = [...n[cIdx].items]; items[iIdx] = e.target.value;
                                n[cIdx] = {...n[cIdx], items};
                                setResumeData({...resumeData, skills: n});
                              }} />
                              <button onClick={() => {
                                const n = [...resumeData.skills];
                                const items = n[cIdx].items.filter((_, i) => i !== iIdx);
                                n[cIdx] = {...n[cIdx], items};
                                setResumeData({...resumeData, skills: n});
                              }} className="ml-1 text-slate-300 hover:text-red-500"><Trash2 size={10}/></button>
                            </div>
                          ))}
                          <button onClick={() => {
                             const n = [...resumeData.skills]; n[cIdx] = {...n[cIdx], items: [...n[cIdx].items, ""]};
                             setResumeData({...resumeData, skills: n});
                          }} className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">+ Add</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center"><FileText className="mr-2 text-indigo-500" size={18}/> Education</h3>
                    <button onClick={() => setResumeData({...resumeData, education: [...(resumeData.education || []), { title: '', companyOrInst: '', date: '', location: '', details: '', url: '' }]})} className="text-xs bg-slate-100 font-bold px-3 py-1.5 rounded-lg flex items-center"><Plus size={14} className="mr-1"/> Add Education</button>
                  </div>
                  <div className="space-y-4">
                    {(resumeData.education || []).map((edu, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                        <button onClick={() => updateEducation(idx, 'REMOVE')} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField label="Degree" value={edu.title} onChange={v => updateEducation(idx, 'title', v)} />
                          <InputField label="Institution" value={edu.companyOrInst} onChange={v => updateEducation(idx, 'companyOrInst', v)} />
                          <InputField label="Date" value={edu.date} onChange={v => updateEducation(idx, 'date', v)} />
                          <InputField label="URL (Optional)" value={edu.url} onChange={v => updateEducation(idx, 'url', v)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center"><BriefcaseBusiness className="mr-2 text-rose-500" size={18}/> Projects</h3>
                    <button onClick={() => setResumeData({...resumeData, projects: [...(resumeData.projects || []), { title: '', date: '', location: '', url: '', bullets: [''] }]})} className="text-xs bg-slate-100 font-bold px-3 py-1.5 rounded-lg flex items-center"><Plus size={14} className="mr-1"/> Add Project</button>
                  </div>
                  <div className="space-y-4">
                    {(resumeData.projects || []).map((proj, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                        <button onClick={() => {
                          const n = resumeData.projects.filter((_, i) => i !== idx);
                          setResumeData({...resumeData, projects: n});
                        }} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <InputField label="Project Title" value={proj.title} onChange={v => {
                            const n = [...resumeData.projects]; n[idx] = {...n[idx], title: v}; setResumeData({...resumeData, projects: n});
                          }} />
                          <InputField label="Project Link" value={proj.url} onChange={v => {
                            const n = [...resumeData.projects]; n[idx] = {...n[idx], url: v}; setResumeData({...resumeData, projects: n});
                          }} />
                        </div>
                        <div className="space-y-2">
                           {proj.bullets.map((b, bIdx) => (
                             <div key={bIdx} className="flex gap-2">
                               <input className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-sm" value={b} onChange={e => {
                                 const n = [...resumeData.projects]; const bts = [...n[idx].bullets]; bts[bIdx] = e.target.value; n[idx] = {...n[idx], bullets: bts}; setResumeData({...resumeData, projects: n});
                               }} />
                             </div>
                           ))}
                           <button onClick={() => {
                             const n = [...resumeData.projects]; const bts = [...n[idx].bullets, ""]; n[idx] = {...n[idx], bullets: bts}; setResumeData({...resumeData, projects: n});
                           }} className="text-[10px] uppercase font-bold text-blue-600">+ Add Bullet</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pb-10" />
              </div>
            </div>
          )
        )}

        {activeTab === 'preview' && (
          <div className="absolute inset-0 flex">
            <div className="w-1/2 flex flex-col bg-slate-900 border-r border-slate-800">
              <div className="p-3 bg-slate-800 flex justify-between items-center text-slate-300 font-mono text-xs">
                <span>resume.tex</span>
                <div className="flex space-x-2">
                   <button onClick={() => setPreviewCode(generatedLatex)} className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-500 transition">Recompile</button>
                   <button onClick={() => { navigator.clipboard.writeText(generatedLatex); toast.success('Copied!'); }} className="bg-slate-700 px-3 py-1 rounded hover:bg-slate-600 transition">Copy</button>
                </div>
              </div>
              <textarea className="flex-1 bg-transparent text-slate-300 font-mono p-4 outline-none resize-none text-sm" value={generatedLatex} onChange={e => setGeneratedLatex(e.target.value)} />
            </div>
            <div className="w-1/2 h-full">
              <PdfPreview latexCode={previewCode} />
            </div>
          </div>
        )}
      </div>

      {/* AI Power Lab Sidebar Drawer */}
      {jdSidebarOpen && (
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
                  desc="Click to rewrite bullets"
                  loading={aiLoading}
                  onClick={() => handleAiAction('tailor')}
                />
                <AiActionCard 
                  icon={<FileText className="text-blue-500"/>} 
                  title="Cover Letter" 
                  desc="Generate LaTeX body"
                  loading={aiLoading}
                  onClick={() => handleAiAction('cover-letter')}
                />
                <AiActionCard 
                  icon={<AlertCircle className="text-rose-500"/>} 
                  title="Skill Gap" 
                  desc="What am I missing?"
                  loading={aiLoading}
                  onClick={() => handleAiAction('skill-gap')}
                />
                <AiActionCard 
                  icon={<BriefcaseBusiness className="text-indigo-500"/>} 
                  title="Interview Prep" 
                  desc="Get 10 Q&A pairs"
                  loading={aiLoading}
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
      )}

      <style>{`
        @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}

function AiActionCard({ icon, title, desc, onClick, loading }) {
  return (
    <button 
      onClick={onClick} 
      disabled={loading}
      className="p-4 bg-white border border-slate-200 rounded-2xl text-left hover:border-indigo-500 hover:shadow-md transition group disabled:opacity-50"
    >
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-110 transition">
        {loading ? <Loader2 size={18} className="animate-spin text-slate-400"/> : icon}
      </div>
      <div className="font-bold text-slate-900 text-sm mb-1">{title}</div>
      <div className="text-[10px] text-slate-500 line-clamp-1">{desc}</div>
    </button>
  );
}
