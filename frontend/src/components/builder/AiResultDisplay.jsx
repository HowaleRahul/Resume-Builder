import React from 'react';
import { 
  FileText, 
  MessageSquare, 
  Target, 
  ClipboardCheck, 
  ChevronRight,
  Sparkles,
  Zap,
  Code2,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AiResultDisplay({ result, onApply }) {
  if (!result) return null;

  const { type, data } = result;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
    toast.success('Copied to clipboard');
  };

  const renderCoverLetter = (text) => (
    <div className="space-y-4">
      <div className="prose prose-slate prose-sm max-w-none text-slate-700 bg-white p-6 rounded-2xl border border-slate-100 shadow-inner whitespace-pre-wrap font-serif leading-relaxed h-96 overflow-y-auto">
        {text}
      </div>
      <div className="flex space-x-3">
        <button 
          onClick={() => handleCopy(text)}
          className="flex-1 flex items-center justify-center p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
        >
          <ClipboardCheck size={14} className="mr-2" /> Copy Text
        </button>
      </div>
    </div>
  );

  const renderInterviewPrep = (prepData) => {
    // If not array, try to find an array in the object
    const items = Array.isArray(prepData) ? prepData : (prepData.qna || prepData.questions || []);
    return (
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 no-scrollbar">
        {items.map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-black">{i+1}</span>
              </div>
              <p className="text-xs font-black text-slate-900 leading-tight">{item.question}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-[11px] text-slate-600 leading-relaxed italic">"{item.answer}"</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSkillGap = (gapData) => {
    const missing = gapData.missing || gapData.gaps || [];
    const keywords = gapData.keywords || [];
    return (
        <div className="space-y-6">
            <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl">
                 <h6 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-3 flex items-center">
                    <Target size={12} className="mr-2"/> Essential Skills Missing
                 </h6>
                 <div className="flex flex-wrap gap-2">
                    {missing.map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white text-rose-700 text-[10px] font-bold rounded-lg shadow-sm">{s}</span>
                    ))}
                 </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
                 <h6 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center">
                    <CheckCircle2 size={12} className="mr-2"/> Keywords Found
                 </h6>
                 <div className="flex flex-wrap gap-2">
                    {keywords.map((k, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white text-emerald-700 text-[10px] font-bold rounded-lg shadow-sm">{k}</span>
                    ))}
                 </div>
            </div>
        </div>
    );
  };

  const renderPortfolio = (portfolioData) => {
    const projects = portfolioData.projects || [];
    return (
      <div className="space-y-4 max-h-96 overflow-y-auto no-scrollbar">
        {projects.map((proj, i) => (
          <div key={i} className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3 group">
            <div className="flex justify-between items-start">
              <div>
                <h6 className="font-black text-cyan-400 text-sm">{proj.title}</h6>
                <p className="text-[10px] text-slate-400 font-bold">{proj.techStack}</p>
              </div>
              <button 
                onClick={() => onApply('project', proj)}
                className="text-[10px] font-black uppercase text-white bg-cyan-600 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition"
              >
                Add+
              </button>
            </div>
            <ul className="space-y-1">
              {(proj.bullets || []).map((b, bi) => (
                <li key={bi} className="text-[10px] text-slate-300 flex items-start">
                   <ChevronRight size={10} className="mr-1 mt-0.5 text-cyan-800" /> {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4 px-1">
         <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
               {type === 'cover-letter' && <FileText size={14} />}
               {type === 'interview-prep' && <MessageSquare size={14} />}
               {type === 'skill-gap' && <Target size={14} />}
               {type === 'portfolio-extraction' && <Code2 size={14} />}
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-900">
                {type.replace('-', ' ')}
            </span>
         </div>
         {type !== 'portfolio-extraction' && (
           <button onClick={() => handleCopy(data)} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition flex items-center">
             <ClipboardCheck size={12} className="mr-1"/> JSON
           </button>
         )}
      </div>

      <div className="bg-white/50 backdrop-blur rounded-[2rem] border border-slate-100 p-6 shadow-sm">
        {type === 'cover-letter' && renderCoverLetter(data)}
        {type === 'interview-prep' && renderInterviewPrep(data)}
        {type === 'skill-gap' && renderSkillGap(data)}
        {type === 'portfolio-extraction' && renderPortfolio(data)}
        {(!['cover-letter', 'interview-prep', 'skill-gap', 'portfolio-extraction'].includes(type)) && (
          <pre className="text-[10px] text-slate-600 bg-white p-4 rounded-xl border border-slate-100 overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
