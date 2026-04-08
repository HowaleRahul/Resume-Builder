import React from 'react';
import { Link } from 'react-router-dom';

const TAG_COLORS = {
  blue:    'bg-blue-100 text-blue-700',
  rose:    'bg-rose-100 text-rose-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  violet:  'bg-violet-100 text-violet-700',
  slate:   'bg-slate-200 text-slate-600',
  amber:   'bg-amber-100 text-amber-700',
};

export default function TemplateCard({ tpl, tKey }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-200/40 transition-all duration-300 group">
      <div className={`h-40 bg-linear-to-br ${tpl.color} relative p-6 flex flex-col justify-between overflow-hidden`}>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className={`self-end px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm ${TAG_COLORS[tpl.tagColor] || TAG_COLORS.slate}`}>
          {tpl.tag}
        </div>
        <div className="space-y-2 relative">
          <div className="w-24 h-2 bg-white/30 rounded" />
          <div className="w-full h-1.5 bg-white/20 rounded" />
          <div className="w-5/6 h-1.5 bg-white/20 rounded" />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-black text-slate-900 mb-1">{tpl.label}</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">by {tpl.author}</p>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium line-clamp-2 h-10">{tpl.desc}</p>
        <Link
          to={`/builder?template=${tKey}`}
          className="block text-center w-full bg-slate-900 text-white hover:bg-slate-700 font-black py-3 rounded-xl transition text-xs tracking-widest uppercase shadow-lg shadow-slate-200"
        >
          Use Template
        </Link>
      </div>
    </div>
  );
}
