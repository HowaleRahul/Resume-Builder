import React from 'react';
import { Code2, Play, RotateCcw, XCircle } from 'lucide-react';

export default function CodeEditor({ 
  generatedLatex, 
  setGeneratedLatex, 
  handleGenerate, 
  handleResetTemplate, 
  compileError 
}) {
  return (
    <div className="absolute inset-0 p-8 flex flex-col bg-slate-900 overflow-hidden no-print">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Code2 size={16} />
          </div>
          <span className="text-slate-100 font-black tracking-tight uppercase text-xs">Direct LaTeX Stream</span>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition flex items-center shadow-lg shadow-blue-900/40">
            <Play size={12} className="mr-2" /> Recompile
          </button>
        </div>
      </div>
      <div className="flex-1 flex space-x-6 min-h-0">
        <div className="flex-1 flex flex-col relative">
          <textarea
            className="flex-1 bg-slate-800/50 text-blue-50 font-mono p-8 rounded-4xl shadow-inner outline-none resize-none border border-slate-700/50 text-sm leading-relaxed"
            value={generatedLatex}
            onChange={(e) => setGeneratedLatex(e.target.value)}
          />
          <button 
            onClick={handleResetTemplate}
            className="absolute top-4 right-4 p-3 bg-slate-700/30 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition"
            title="Reset to Template"
          >
            <RotateCcw size={18} />
          </button>
        </div>
        {compileError && (
          <div className="w-80 bg-rose-900/10 border border-rose-500/20 rounded-4xl p-6 overflow-y-auto font-mono text-[11px] text-rose-200/80 animate-fade-in">
            <div className="text-rose-400 font-black flex items-center mb-4 uppercase tracking-widest"><XCircle size={14} className="mr-2"/> Warning</div>
            {compileError.message}
            <div className="mt-4 p-3 bg-rose-900/20 rounded-lg text-rose-300 italic opacity-60">
              {compileError.log}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
