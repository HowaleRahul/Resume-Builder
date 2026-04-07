import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { FileText, Plus, LayoutTemplate, Star, Wifi, ExternalLink } from 'lucide-react';
import { TEMPLATE_REGISTRY } from '../templates';

const TAG_COLORS = {
  blue:    'bg-blue-100 text-blue-700',
  rose:    'bg-rose-100 text-rose-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  violet:  'bg-violet-100 text-violet-700',
  slate:   'bg-slate-200 text-slate-600',
  amber:   'bg-amber-100 text-amber-700',
};

export default function Dashboard() {
  const { user } = useUser();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:5000/api/resume/list/${user.id}`)
        .then(res => { if (res.data.success) setResumes(res.data.resumes); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user]);

  const templates = Object.entries(TEMPLATE_REGISTRY);

  return (
    <div className="flex-1 bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Resumes</h1>
          <Link to="/builder" className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm">
            <Plus size={18} /><span>Create New</span>
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading your resumes...</p>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 border-dashed rounded-xl">
            <FileText className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No resumes yet</h3>
            <p className="text-slate-500 mb-6 border-b pb-6 max-w-sm mx-auto">Pick a template below or start from scratch.</p>
            <Link to="/builder" className="text-blue-600 font-semibold hover:underline">Start building →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {resumes.map(r => (
              <Link to={`/builder?id=${r._id}`} key={r._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition cursor-pointer group flex flex-col">
                <div className="h-32 bg-slate-100 flex items-center justify-center border-b border-slate-200 relative">
                  <FileText size={32} className="text-slate-300" />
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 truncate">{r.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 capitalize">{r.templateType} Template</p>
                  </div>
                  <div className="mt-4 text-[11px] text-slate-400 font-medium">
                    Updated {new Date(r.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── Template Gallery ───────────────────────────────────────────────── */}
        <div className="mt-16 border-t border-slate-200 pt-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <LayoutTemplate className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">Resume Templates</h2>
            </div>
            <span className="text-sm text-slate-400">{templates.length} templates · all Overleaf-compatible</span>
          </div>
          <p className="text-sm text-slate-500 mb-8">
            Select a template, edit your details in the visual editor or code editor, then preview and export as PDF.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(([key, tpl]) => (
              <div key={key} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all group">
                {/* Preview mockup */}
                <div className={`h-36 bg-gradient-to-br ${tpl.color} relative p-4 flex flex-col justify-between`}>
                  {/* Tag badge */}
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold flex items-center shadow-sm ${TAG_COLORS[tpl.tagColor] || TAG_COLORS.slate}`}>
                    <Star size={10} className="mr-1 fill-current" /> {tpl.tag}
                  </div>
                  {/* Skeleton lines */}
                  <div className="w-20 h-2.5 bg-slate-400/30 rounded mb-2" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-full h-1.5 bg-slate-300/50 rounded" />
                    <div className="w-5/6 h-1.5 bg-slate-200/60 rounded" />
                    <div className="w-4/6 h-1.5 bg-slate-200/60 rounded" />
                    <div className="w-3/6 h-1.5 bg-slate-200/40 rounded" />
                  </div>
                  {/* Compat badge */}
                  <div className="flex items-center space-x-1">
                    <Wifi size={10} className="text-emerald-600" />
                    <span className="text-[10px] font-semibold text-emerald-700">latexonline.cc + Overleaf</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-800">{tpl.label}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 mb-1">by {tpl.author}</p>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">{tpl.desc}</p>
                  <Link
                    to={`/builder?template=${key}`}
                    className="block text-center w-full bg-slate-900 text-white hover:bg-slate-700 font-semibold py-2 rounded-lg transition text-sm"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
            ))}

            {/* Start from scratch card */}
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col">
              <div className="h-36 bg-slate-50 flex items-center justify-center">
                <LayoutTemplate size={36} className="text-slate-300" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-slate-800">Paste Any Overleaf Template</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 flex-1 leading-relaxed">
                  Got a .tex file from Overleaf? Upload or paste it into the builder — all standard packages are supported.
                </p>
                <Link to="/builder" className="block text-center w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 rounded-lg transition text-sm">
                  Open Builder
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
