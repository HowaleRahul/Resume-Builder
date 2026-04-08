import React from 'react';
import { Sparkles, ShieldCheck, Monitor, Zap } from 'lucide-react';

export default function Features() {
  return (
    <section className="bg-white py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-left mb-24 max-w-3xl">
          <p className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4">Core Intelligence</p>
          <h2 className="text-5xl font-black text-slate-900 mb-6 leading-tight">Everything you need to bypass screening bots.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Sparkles className="text-amber-500" />}
            title="Career Tailor"
            desc="Instant rewriting of project bullets to match high-priority keywords in any JD."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-emerald-500" />}
            title="Skill Evaluator"
            desc="Gap analysis report showing exactly what certifications or tech you're missing."
          />
          <FeatureCard 
            icon={<Monitor className="text-indigo-600" />}
            title="Portfolio Sync"
            desc="Deep-sync your GitHub repositories to extract meaningful project metrics automatically."
          />
          <FeatureCard 
            icon={<Zap className="text-blue-600" />}
            title="Binary Export"
            desc="Download production-grade PDFs or raw LaTeX code for full manual control."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2 transition-all duration-500 group text-left">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-white shadow-inner group-hover:scale-110 transition-transform duration-500">
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium text-xs">{desc}</p>
    </div>
  );
}
