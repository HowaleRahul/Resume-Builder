import React from 'react';
import { Loader2 } from 'lucide-react';

export default function AiActionCard({ icon, title, desc, onClick, loading }) {
  return (
    <button 
      onClick={onClick} 
      disabled={loading}
      className="p-4 bg-white border border-slate-200 rounded-2xl text-left hover:border-indigo-500 hover:shadow-md transition group disabled:opacity-50"
    >
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3 group-hover:scale-110 transition">
        {loading ? <Loader2 size={18} className="animate-spin text-slate-400"/> : icon}
      </div>
      <div className="font-bold text-slate-900 text-sm mb-1">{title}</div>
      <div className="text-[10px] text-slate-500 line-clamp-1">{desc}</div>
    </button>
  );
}
