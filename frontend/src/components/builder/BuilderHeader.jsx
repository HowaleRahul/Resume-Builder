import React from 'react';
import { FileText, Sparkles, Play, Code2, Loader2, LayoutTemplate } from 'lucide-react';
import TabButton from '../ui/TabButton';

export default function BuilderHeader({ 
  activeTab, 
  setActiveTab, 
  resumeData, 
  generatedLatex, 
  previewCode,
  templateType,
  setTemplateType,
  codeEditMode,
  setCodeEditMode,
  handleParse,
  handleGenerate,
  handleDownloadPdf,
  setJdSidebarOpen,
  loading,
  latexInput,
  TEMPLATE_REGISTRY
}) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-10 shrink-0 no-print">
      <div className="flex space-x-1 bg-slate-100 p-1.5 rounded-2xl shadow-inner">
        <TabButton active={activeTab === 'input'} onClick={() => setActiveTab('input')} icon={<FileText size={16}/>} label="Source" />
        <TabButton active={activeTab === 'edit'} onClick={() => setActiveTab('edit')} icon={<Sparkles size={16}/>} label="Visual Editor" disabled={!resumeData} />
        <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} icon={<Play size={16}/>} label="Export PDF" disabled={!generatedLatex && !previewCode} />
      </div>

      <div className="flex space-x-3 items-center">
        {activeTab === 'edit' && (
          <>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 hover:bg-slate-100 transition cursor-default">
              <LayoutTemplate size={14} className="text-slate-400 mr-2" />
              <select
                value={templateType}
                onChange={e => setTemplateType(e.target.value)}
                className="bg-transparent text-sm font-black text-slate-700 outline-none appearance-none cursor-pointer"
              >
                {Object.entries(TEMPLATE_REGISTRY).map(([key, t]) => (
                  <option key={key} value={key}>{t.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setCodeEditMode(m => !m)}
              className={`flex items-center text-xs font-black tracking-widest uppercase px-4 py-2.5 rounded-xl border transition ${codeEditMode ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              <Code2 size={14} className="mr-2" />
              {codeEditMode ? 'Visual Mode' : 'Latex Code'}
            </button>
          </>
        )}

        {activeTab === 'input' && (
          <button onClick={handleParse} disabled={!latexInput || loading} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-200 disabled:opacity-50 flex items-center">
            {loading && <Loader2 size={14} className="animate-spin mr-2" />}
            Parse Resume ✨
          </button>
        )}
        
        {activeTab === 'edit' && (
          <div className="flex space-x-3">
            <button 
              onClick={() => setJdSidebarOpen(true)}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 group flex items-center"
            >
              <Sparkles size={14} className="mr-2 group-hover:scale-125 transition-transform" />
              AI Power Lab
            </button>
            <button onClick={handleGenerate} disabled={loading} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center">
              {loading && <Loader2 size={14} className="animate-spin mr-2" />}
              Sync & Preview 🚀
            </button>
          </div>
        )}

        {activeTab === 'preview' && (
          <button 
            onClick={handleDownloadPdf}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center"
          >
            <FileText size={14} className="mr-2" />
            Save as PDF
          </button>
        )}
      </div>
    </div>
  );
}
