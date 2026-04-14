import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useBuilder } from '../hooks/useBuilder';
import { TEMPLATE_REGISTRY } from '../templates';
import BuilderHeader from '../components/builder/BuilderHeader';
import SourceImport from '../components/builder/SourceImport';
import VisualEditor from '../components/builder/VisualEditor';
import CodeEditor from '../components/builder/CodeEditor';
import AiPowerLab from '../components/builder/AiPowerLab';
import PdfPreview from '../components/preview/PdfPreview';

import API_BASE_URL from '../config/api';

export default function Builder() {
  const { state, actions } = useBuilder();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const template = queryParams.get('template');

    if (id) {
      state.setLoading(true);
      axios.get(`${API_BASE_URL}/api/resume/${id}`)
        .then(res => {
          if (res.data.success) {
            const resume = res.data.resume;
            const latestVersion = resume.versions[resume.versions.length - 1];
            if (latestVersion && latestVersion.jsonSnapshot) {
              state.setResumeData(latestVersion.jsonSnapshot);
              state.setTemplateType(resume.templateType || 'jitin-nair');
              const code = resume.generatedLatexCode || resume.originalLatexCode || '';
              state.setGeneratedLatex(code);
              state.setPreviewCode(code);
              state.setActiveTab('edit');
            }
          }
        })
        .catch(err => {
          console.error("Failed to load resume:", {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: err.config?.url
          });
          toast.error(`Failed to load resume: ${err.response?.data?.message || err.message}`);
        })
        .finally(() => state.setLoading(false));
    } else if (template && TEMPLATE_REGISTRY[template]) {
      state.setTemplateType(template);
      state.setResumeData({ ...state.resumeData }); // Keep current if existing or use default logic in hook
      state.setGeneratedLatex(TEMPLATE_REGISTRY[template].code);
      state.setActiveTab('edit');
      toast.success(`Template loaded! Edit visually or in the code editor.`, { icon: '📄' });
    }
  }, [location.search]);

  const handleDownloadPdf = () => {
    window.print();
    toast.success("Preparing PDF for download...");
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] bg-slate-50 overflow-hidden relative">
      
      {/* ─── Global Print Styles ────────────────────────────────────────────── */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 210mm; /* A4 Width */
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print { display: none !important; }
        }
        @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>

      <BuilderHeader 
        {...state} 
        {...actions} 
        handleDownloadPdf={handleDownloadPdf}
        TEMPLATE_REGISTRY={TEMPLATE_REGISTRY}
      />

      <div className="flex-1 relative overflow-hidden">
        {state.activeTab === 'input' && (
          <SourceImport 
            latexInput={state.latexInput} 
            setLatexInput={state.setLatexInput} 
          />
        )}

        {state.activeTab === 'edit' && state.resumeData && (
          state.codeEditMode ? (
            <CodeEditor 
              generatedLatex={state.generatedLatex}
              setGeneratedLatex={state.setGeneratedLatex}
              handleGenerate={actions.handleGenerate}
              handleResetTemplate={actions.handleResetTemplate}
              compileError={state.compileError}
            />
          ) : (
            <VisualEditor 
              resumeData={state.resumeData}
              setResumeData={state.setResumeData}
              updatePersonal={actions.updatePersonal}
            />
          )
        )}

        {state.activeTab === 'preview' && (
          <div className="absolute inset-0 flex h-full">
            <div className="w-[40%] flex flex-col bg-slate-900 border-r border-slate-800 no-print shadow-2xl z-10 transition-all duration-300">
              <div className="p-4 bg-slate-800/50 flex justify-between items-center text-slate-400 font-black text-[10px] tracking-[0.2em] uppercase">
                <span className="flex items-center">Compiled LaTeX Source</span>
                <div className="flex space-x-3">
                   <button onClick={() => state.setPreviewCode(state.generatedLatex)} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40">Sync Editor</button>
                </div>
              </div>
              <textarea 
                className="flex-1 bg-transparent text-blue-50/70 font-mono p-8 outline-none resize-none text-[13px] leading-relaxed no-scrollbar" 
                value={state.generatedLatex} 
                onChange={e => state.setGeneratedLatex(e.target.value)} 
              />
            </div>
            <div className="w-[60%] h-full print-section relative overflow-y-auto no-scrollbar bg-slate-100 p-6 md:p-12 transition-all duration-300">
               <div className="max-w-[210mm] mx-auto bg-white shadow-2xl relative">
                  <PdfPreview latexCode={state.previewCode} />
               </div>
            </div>
          </div>
        )}
      </div>

      <AiPowerLab 
        {...state} 
        {...actions} 
      />
    </div>
  );
}
