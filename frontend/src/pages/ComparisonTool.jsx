import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowRightLeft, FileCheck2, Loader2, BriefcaseBusiness, Upload, CheckCircle2, XCircle, AlertTriangle, FileText, Code2 } from 'lucide-react';

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

  const ScoreBadge = ({ score }) => {
    const c = score >= 75 ? 'emerald' : score >= 50 ? 'amber' : 'red';
    return (
      <div className={`w-24 h-24 rounded-full border-4 border-${c}-200 bg-${c}-50 flex flex-col items-center justify-center shrink-0`}>
        <span className={`text-3xl font-black text-${c}-600`}>{score}</span>
        <span className={`text-xs font-semibold text-${c}-500`}>/ 100</span>
      </div>
    );
  };

  const ResumeInputCard = ({ customLabel, onCustomLabel, value, onChange, accentColor, onFileUpload }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${accentColor === 'green' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
          <input
            className="font-bold text-slate-800 text-sm bg-transparent outline-none border-b border-transparent focus:border-slate-300 transition"
            value={customLabel}
            onChange={e => onCustomLabel(e.target.value)}
            title="Click to rename"
          />
          <span className="text-xs text-slate-400">(rename)</span>
        </div>
        <label className="flex items-center cursor-pointer text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition">
          <Upload size={12} className="mr-1.5" /> Upload File
          <input type="file" accept=".tex,.txt" className="hidden" onChange={onFileUpload} />
        </label>
      </div>
      <p className="text-xs text-slate-400 mb-2">
        {compareInputMode === 'latex' ? 'Paste LaTeX (.tex) source code:' : 'Paste plain-text resume:'}
      </p>
      <textarea
        className={`flex-1 w-full min-h-56 rounded-xl p-4 outline-none resize-none transition focus:ring-2 ${
          compareInputMode === 'latex'
            ? 'bg-slate-900 text-slate-200 font-mono text-xs focus:ring-blue-500'
            : 'bg-slate-50 border border-slate-200 text-slate-700 text-sm focus:ring-slate-400'
        }`}
        placeholder={compareInputMode === 'latex' ? '\\documentclass{article}...' : 'John Doe\nSoftware Engineer\n\nExperience:\n- Built X at Y'}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <div className="text-right text-xs text-slate-400 mt-1">{value.length} chars</div>
    </div>
  );

  return (
    <div className="flex-1 bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <ArrowRightLeft className="mr-3 text-blue-600" /> AI Resume Analyzer
          </h1>
          <p className="text-slate-500 mt-2">Match your resume to a job description, or compare two resumes side-by-side via LaTeX or plain text.</p>
        </div>

        {/* Top mode toggle */}
        <div className="flex space-x-1 bg-slate-200 p-1 rounded-xl mb-8 w-fit">
          {[['jd', BriefcaseBusiness, 'JD Match Analysis'], ['compare', ArrowRightLeft, 'Resume vs Resume']].map(([m, Icon, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition ${mode === m ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Icon size={16} className="mr-2" /> {label}
            </button>
          ))}
        </div>

        {/* ─── JD MATCH ─────────────────────────────────────── */}
        {mode === 'jd' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <label className="font-bold text-slate-800 mb-1 flex items-center">
                  <BriefcaseBusiness size={16} className="mr-2 text-blue-600" /> Job Description
                </label>
                <p className="text-xs text-slate-400 mb-3">Paste the full JD from LinkedIn, Indeed, etc.</p>
                <textarea className="w-full h-64 bg-slate-50 border border-slate-200 text-slate-700 text-sm p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="We are looking for a Senior React Developer..." value={jdText} onChange={e => setJdText(e.target.value)} />
                <div className="text-right text-xs text-slate-400 mt-1">{jdText.length} chars</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <label className="font-bold text-slate-800 mb-1 flex items-center">
                  <FileText size={16} className="mr-2 text-purple-600" /> Your Resume
                </label>
                <p className="text-xs text-slate-400 mb-3">Upload a .tex file, or paste your resume text/LaTeX.</p>
                <label className="flex items-center justify-center w-full h-14 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition mb-3">
                  <input type="file" accept=".tex,.txt" className="hidden" onChange={handleResumeFileUpload} />
                  <Upload size={15} className="mr-2 text-slate-400" />
                  <span className="text-sm text-slate-500">{resumeFile ? '✅ Loaded — edit below' : 'Click to upload .tex / .txt'}</span>
                </label>
                <textarea className="w-full h-40 bg-slate-900 text-slate-200 font-mono text-xs p-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Or paste your resume LaTeX/text here..." value={resumeFile} onChange={e => setResumeFile(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-center">
              <button onClick={handleJDMatch} disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-10 py-3.5 rounded-full font-bold hover:bg-blue-700 shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 text-sm">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <FileCheck2 size={18} />}
                <span>{loading ? 'Analyzing with AI...' : 'Analyze Job Match'}</span>
              </button>
            </div>

            {jdResult && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div className="flex items-center space-x-8 border-b pb-8 mb-8">
                  <ScoreBadge score={jdResult.score} />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">JD Match Score</p>
                    <h2 className="text-3xl font-black text-slate-900">
                      {jdResult.score >= 75 ? '🎉 Strong Match!' : jdResult.score >= 50 ? '⚠️ Partial Match' : '❌ Needs Work'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">{jdResult.summary}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {jdResult.matchedKeywords?.length > 0 && (
                    <div>
                      <h3 className="font-bold text-slate-800 mb-3 flex items-center"><CheckCircle2 size={16} className="mr-2 text-emerald-500" /> Matched Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {jdResult.matchedKeywords.map(k => <span key={k} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">{k}</span>)}
                      </div>
                    </div>
                  )}
                  {jdResult.missingKeywords?.length > 0 && (
                    <div>
                      <h3 className="font-bold text-slate-800 mb-3 flex items-center"><XCircle size={16} className="mr-2 text-red-500" /> Missing Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {jdResult.missingKeywords.map(k => <span key={k} className="text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full font-medium">{k}</span>)}
                      </div>
                    </div>
                  )}
                </div>
                {jdResult.suggestions?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center"><AlertTriangle size={16} className="mr-2 text-amber-500" /> AI Recommendations</h3>
                    <ul className="space-y-2">
                      {jdResult.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start text-sm text-slate-600">
                          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center mr-3 mt-0.5 shrink-0 font-bold">{i + 1}</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── COMPARE MODE ─────────────────────────────────── */}
        {mode === 'compare' && (
          <div className="space-y-5">

            {/* Input format sub-toggle */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-bold text-slate-700">Choose input format:</p>
                <p className="text-xs text-slate-400 mt-0.5">The AI reads both resumes in the chosen format.</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCompareInputMode('latex')}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold border transition ${compareInputMode === 'latex' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  <Code2 size={14} className="mr-2" /> LaTeX Code (.tex)
                </button>
                <button
                  onClick={() => setCompareInputMode('text')}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold border transition ${compareInputMode === 'text' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  <FileText size={14} className="mr-2" /> Plain Text
                </button>
              </div>
            </div>

            {/* Context hint */}
            <div className={`flex items-start space-x-3 rounded-xl px-4 py-3 text-sm ${compareInputMode === 'latex' ? 'bg-blue-50 border border-blue-100 text-blue-700' : 'bg-amber-50 border border-amber-100 text-amber-700'}`}>
              {compareInputMode === 'latex'
                ? <><Code2 size={15} className="shrink-0 mt-0.5" /><span>Paste or upload <b>.tex</b> source code. AI will analyze structure, macro usage, formatting quality, and content depth.</span></>
                : <><FileText size={15} className="shrink-0 mt-0.5" /><span>Paste plain text copied from a PDF or document. AI will compare keywords, experience depth, and overall presentation.</span></>
              }
            </div>

            {/* Two resume cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResumeInputCard
                customLabel={resumeALabel} onCustomLabel={setResumeALabel}
                value={resumeAText} onChange={setResumeAText}
                accentColor="green"
                onFileUpload={e => readFile(e.target.files[0], setResumeAText, setResumeALabel)}
              />
              <ResumeInputCard
                customLabel={resumeBLabel} onCustomLabel={setResumeBLabel}
                value={resumeBText} onChange={setResumeBText}
                accentColor="blue"
                onFileUpload={e => readFile(e.target.files[0], setResumeBText, setResumeBLabel)}
              />
            </div>

            <div className="flex justify-center">
              <button onClick={handleCompare} disabled={loading}
                className="flex items-center space-x-2 bg-slate-800 text-white px-8 py-3.5 rounded-full font-bold hover:bg-slate-900 shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <FileCheck2 size={18} />}
                <span>{loading ? 'Comparing Resumes...' : 'Run Head-to-Head Comparison'}</span>
              </button>
            </div>

            {compareResult && (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div className="text-center mb-8 border-b pb-6">
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest block mb-2">Verdict</span>
                  <h2 className="text-4xl font-black text-slate-900">{compareResult.winner} is the stronger resume</h2>
                </div>
                <div className="grid grid-cols-2 gap-10 mb-8">
                  <div className="text-center flex flex-col items-center p-6 bg-green-50 rounded-2xl border border-green-100">
                    <span className="text-5xl font-black text-green-600 mb-2">{compareResult.resumeAScore}</span>
                    <span className="font-semibold text-green-800">{resumeALabel} Score</span>
                  </div>
                  <div className="text-center flex flex-col items-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <span className="text-5xl font-black text-blue-600 mb-2">{compareResult.resumeBScore}</span>
                    <span className="font-semibold text-blue-800">{resumeBLabel} Score</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-4">Key Differences</h3>
                <ul className="space-y-3">
                  {compareResult.differences?.map((diff, i) => (
                    <li key={i} className="flex items-start">
                      <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 mr-3 shrink-0">{i + 1}</span>
                      <p className="text-slate-600">{diff}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
