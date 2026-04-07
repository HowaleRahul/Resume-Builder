import React, { useState, useEffect, useRef } from 'react';
import { DownloadCloud, FileText, CheckCircle2, ExternalLink, AlertTriangle } from 'lucide-react';

const LOADING_STEPS = [
  'Sending code to LaTeX cloud compiler...',
  'Resolving packages & macros...',
  'Rendering typography & layout...',
  'Finalising PDF output...',
];

export default function PdfPreview({ latexCode }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timersRef = useRef([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    if (!latexCode) return;

    setPdfUrl(null);
    setIframeLoading(true);
    setIframeError(false);
    setStepIdx(0);
    setElapsed(0);
    clearAllTimers();

    // Step progression
    let cumDelay = 0;
    [1500, 2500, 2000, 1500].forEach((delay, i) => {
      cumDelay += delay;
      const t = setTimeout(() => setStepIdx(Math.min(i + 1, LOADING_STEPS.length - 1)), cumDelay);
      timersRef.current.push(t);
    });

    // Elapsed counter  
    let sec = 0;
    const interval = setInterval(() => { sec++; setElapsed(sec); }, 1000);
    timersRef.current.push(interval);

    const encodedLatex = encodeURIComponent(latexCode);
    const cloudApiUrl = `https://latexonline.cc/compile?text=${encodedLatex}`;
    setPdfUrl(cloudApiUrl);

    return () => clearAllTimers();
  }, [latexCode]);

  // Build Overleaf launch URL (POST trick via hidden form)
  const openInOverleaf = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.overleaf.com/docs';
    form.target = '_blank';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'snip';
    input.value = latexCode;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100">
      {/* Top bar */}
      <div className="p-3 border-b border-slate-200 bg-white flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2 text-slate-500 text-xs">
          <FileText size={14} />
          <span>PDF Preview</span>
          {iframeLoading && <span className="text-blue-500 font-medium animate-pulse">· Compiling...</span>}
          {!iframeLoading && !iframeError && pdfUrl && (
            <span className="text-emerald-500 font-medium flex items-center"><CheckCircle2 size={12} className="mr-1" /> Ready</span>
          )}
          {iframeError && <span className="text-red-400 font-medium flex items-center"><AlertTriangle size={12} className="mr-1" /> Compile failed</span>}
        </div>
        <div className="flex items-center space-x-2">
          {latexCode && (
            <button
              onClick={openInOverleaf}
              className="flex items-center text-xs font-semibold bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition"
            >
              <ExternalLink size={12} className="mr-1.5" /> Open in Overleaf
            </button>
          )}
          <a
            href={pdfUrl || '#'}
            download="resume.pdf"
            onClick={e => { if (!pdfUrl || iframeLoading || iframeError) e.preventDefault(); }}
            className={`flex items-center text-sm font-semibold px-4 py-1.5 rounded transition ${
              pdfUrl && !iframeLoading && !iframeError ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <DownloadCloud size={15} className="mr-1.5" /> Download
          </a>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Loading Overlay */}
        {iframeLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-50">
            {/* Animated document mockup */}
            <div className="relative w-32 h-40 mb-8">
              <div className="absolute inset-0 bg-white rounded-lg shadow-2xl border border-slate-200"></div>
              <div className="absolute inset-0 flex flex-col p-4 space-y-2 overflow-hidden">
                <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4 mx-auto"></div>
                {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8].map((d, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded animate-pulse ${i % 3 === 2 ? 'bg-blue-100 w-2/4' : 'bg-slate-100 w-full'}`}
                    style={{ animationDelay: `${d}s` }}
                  />
                ))}
              </div>
              <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
            </div>

            <p className="text-slate-700 text-sm font-semibold mb-1">{LOADING_STEPS[stepIdx]}</p>
            <p className="text-slate-400 text-xs mb-4">Elapsed: {elapsed}s · latexonline.cc</p>

            {/* Dots */}
            <div className="flex space-x-1.5 mb-6">
              {LOADING_STEPS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= stepIdx ? 'bg-blue-500 scale-110' : 'bg-slate-200'}`} />
              ))}
            </div>

            {/* Overleaf fallback hint after 8s */}
            {elapsed >= 8 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-center max-w-sm">
                <p className="text-xs text-amber-700 font-medium mb-2">Taking longer than usual?</p>
                <button
                  onClick={openInOverleaf}
                  className="text-xs font-bold bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition flex items-center mx-auto"
                >
                  <ExternalLink size={11} className="mr-1" /> Open in Overleaf instead
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error state */}
        {iframeError && !iframeLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 z-10">
            <AlertTriangle size={40} className="text-red-400 mb-3" />
            <p className="text-sm font-semibold text-red-700 mb-1">PDF Compile Failed</p>
            <p className="text-xs text-slate-500 mb-4 text-center max-w-xs">The LaTeX code may contain errors, or the template requires unavailable packages.</p>
            <button
              onClick={openInOverleaf}
              className="flex items-center text-sm font-bold bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <ExternalLink size={14} className="mr-2" /> Try in Overleaf
            </button>
          </div>
        )}

        {/* PDF iframe */}
        {pdfUrl && (
          <iframe
            key={pdfUrl}
            src={pdfUrl}
            title="PDF Preview"
            className={`w-full h-full border-none transition-opacity duration-500 ${iframeLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => { clearAllTimers(); setIframeLoading(false); setIframeError(false); }}
            onError={() => { clearAllTimers(); setIframeLoading(false); setIframeError(true); }}
          />
        )}

        {/* Empty state */}
        {!pdfUrl && !iframeLoading && !iframeError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <FileText size={40} className="mb-3 text-slate-300" />
            <p className="text-sm font-medium">No preview yet.</p>
            <p className="text-xs mt-1">Click <span className="font-semibold text-slate-500">Recompile PDF</span> to generate.</p>
          </div>
        )}
      </div>
    </div>
  );
}
