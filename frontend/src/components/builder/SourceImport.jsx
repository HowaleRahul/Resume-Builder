import React from 'react';
import { Code2 } from 'lucide-react';

export default function SourceImport({ latexInput, setLatexInput }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-white p-8 space-y-6 no-print">
      <div className="flex items-center space-x-3 mb-2">
         <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
           <Code2 size={20} />
         </div>
         <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Source Import</h2>
            <p className="text-xs text-slate-400 font-medium tracking-tight">Paste your existing Overleaf / LaTeX code to begin visual editing.</p>
         </div>
      </div>
      <textarea
        className="flex-1 w-full bg-slate-900 text-blue-100 font-mono p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 outline-none resize-none border-8 border-slate-50 transition-all focus:border-blue-50/50 text-sm leading-relaxed"
        placeholder="\\documentclass{article}..."
        value={latexInput}
        onChange={(e) => setLatexInput(e.target.value)}
      />
    </div>
  );
}
