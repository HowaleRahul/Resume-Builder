import React from 'react';
import { Code2 } from 'lucide-react';

export default function SourceImport({ latexInput, setLatexInput }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-white p-8 space-y-6 no-print overflow-hidden">
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
              <Code2 size={24} />
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Source Import</h2>
               <p className="text-sm text-slate-400 font-medium tracking-tight">Paste your existing Overleaf / LaTeX code to begin visual editing.</p>
            </div>
         </div>
         <div className="hidden md:block px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Supported Formats</p>
            <p className="text-xs font-bold text-slate-600">ModernCV · Awesome-CV · Article</p>
         </div>
      </div>
      
      <div className="flex-1 relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-indigo-600 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-10 transition duration-1000"></div>
        <textarea
          className="relative flex-1 w-full h-full bg-slate-900 text-blue-100 font-mono p-10 rounded-[2.5rem] shadow-2xl outline-none resize-none border-0 transition-all text-sm leading-relaxed no-scrollbar"
          placeholder="% Paste your LaTeX source code here...
\documentclass{article}
\begin{document}
Hello World
\end{document}"
          value={latexInput}
          onChange={(e) => setLatexInput(e.target.value)}
        />
        <div className="absolute bottom-6 right-6 opacity-40 group-focus-within:opacity-100 transition-opacity">
           <div className="px-3 py-1 bg-slate-800 rounded-md text-[10px] text-slate-500 font-mono">UTF-8 · LaTeX</div>
        </div>
      </div>

      <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-start space-x-3">
         <div className="mt-1 flex-shrink-0">
           <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">!</div>
         </div>
         <p className="text-xs text-blue-800 leading-relaxed">
            <span className="font-bold">Pro Tip:</span> Our AI parser works best with structured CV entries like <code className="font-mono bg-blue-100 px-1 rounded">\cventry</code> or <code className="font-mono bg-blue-100 px-1 rounded">\resumeSubheading</code>. Try to use standard templates for the highest accuracy.
         </p>
      </div>
    </div>
  );
}
