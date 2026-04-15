import React, { useEffect } from 'react';
import { Code2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SourceImport({ latexInput, setLatexInput, syntaxStatus, handleCheckSyntax }) {
  // Real-time syntax check with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (latexInput) handleCheckSyntax();
    }, 1500);
    return () => clearTimeout(timer);
  }, [latexInput]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.tex') && !file.name.endsWith('.txt')) {
        return toast.error("Only .tex or .txt files are supported");
      }
      const reader = new FileReader();
      reader.onload = (e) => setLatexInput(e.target.result);
      reader.readAsText(file);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLatexInput(e.target.result);
      reader.readAsText(file);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-white p-8 space-y-6 no-print overflow-hidden">
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
              <Code2 size={24} />
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Source Import</h2>
               <p className="text-sm text-slate-400 font-medium tracking-tight">Paste your code or drop a .tex file to begin visual editing.</p>
            </div>
         </div>
         <div className="flex space-x-3">
            <label className="cursor-pointer px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition flex items-center">
               <span className="mr-2">Upload .tex</span>
               <input type="file" className="hidden" accept=".tex,.txt" onChange={handleFileChange} />
            </label>
            <div className="hidden md:block px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Supported Formats</p>
               <p className="text-xs font-bold text-slate-600">ModernCV · Awesome-CV · Article</p>
            </div>
         </div>
      </div>
      
      <div 
        className="flex-1 relative group"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-indigo-600 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-10 transition duration-1000"></div>
        <textarea
          className="relative flex-1 w-full h-full bg-slate-900 text-blue-100 font-mono p-10 rounded-[2.5rem] shadow-2xl outline-none resize-none border-0 transition-all text-sm leading-relaxed no-scrollbar"
          placeholder="% Paste your LaTeX source code here or drop a file...
\documentclass{article}
\begin{document}
Hello World
\end{document}"
          value={latexInput}
          onChange={(e) => setLatexInput(e.target.value)}
        />
        <div className="absolute bottom-6 right-6 flex items-center space-x-4">
           {latexInput && (
             <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border backdrop-blur shadow-sm transition-all duration-500 ${
               syntaxStatus === 'valid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
               syntaxStatus === 'invalid' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
               'bg-slate-800 border-slate-700 text-slate-500'
             }`}>
                {syntaxStatus === 'valid' && <CheckCircle2 size={12} className="text-emerald-500" />}
                {syntaxStatus === 'invalid' && <AlertCircle size={12} className="text-rose-500" />}
                {!syntaxStatus && <Loader2 size={12} className="animate-spin" />}
                <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                  {syntaxStatus === 'valid' ? 'Syntax Valid' : syntaxStatus === 'invalid' ? 'Syntax Error' : 'Checking Syntax'}
                </span>
             </div>
           )}
           <div className="px-3 py-1.5 bg-slate-800 rounded-xl text-[10px] text-slate-500 font-mono border border-slate-700">UTF-8 · LaTeX</div>
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
