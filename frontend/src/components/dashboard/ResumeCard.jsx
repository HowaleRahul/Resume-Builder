import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Zap, Sparkles, Clock, ChevronRight } from 'lucide-react';

export default function ResumeCard({ resume }) {
  return (
    <Link to={`/builder?id=${resume._id}`} className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-300 group flex flex-col relative">
      <div className="h-40 bg-slate-100 flex items-center justify-center border-b border-slate-50 relative overflow-hidden">
        <FileText size={48} className="text-slate-300 group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-linear-to-tr from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {resume.atsScore && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm flex items-center space-x-1.5">
            <Zap size={12} className="text-amber-500 fill-current" />
            <span className="text-xs font-black text-slate-800">{resume.atsScore} Score</span>
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-black text-slate-900 text-lg leading-tight truncate">{resume.title}</h3>
          <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
            <Sparkles size={10} className="mr-1.5 text-blue-500" /> {resume.templateType || 'default'} Engine
          </div>
        </div>
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center text-[11px] text-slate-400 font-bold">
            <Clock size={12} className="mr-1.5" /> 
            {new Date(resume.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
}
