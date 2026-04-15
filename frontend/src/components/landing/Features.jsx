import React from 'react';
import { Sparkles, ShieldCheck, Monitor, Zap } from 'lucide-react';

export default function Features() {
  return (
    <section className="bg-slate-50/50 py-44 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-[120px] -translate-x-1/2 -z-10" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <p className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6">Product Intelligence</p>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter">
              Bypass screening algorithms <br />
              <span className="text-slate-400">with mathematical precision.</span>
            </h2>
          </div>
          <p className="text-slate-500 font-medium text-lg max-w-sm mb-2">
            Our neural engine ensures your expertise is formatted exactly how hiring managers and ATS bots expect. No guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Sparkles className="text-amber-500" />}
            title="Career Tailor"
            desc="AI-driven rewriting of project outcomes to match JD priority keywords with 99% accuracy."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-blue-600" />}
            title="Skill Auditor"
            desc="Exhaustive gap analysis reports that highlight exactly where your technical stack needs reinforcement."
          />
          <FeatureCard 
            icon={<Monitor className="text-indigo-600" />}
            title="Deep Extraction"
            desc="Intelligently sync your GitHub repositories to quantify project metrics and impact automatically."
          />
          <FeatureCard 
            icon={<Zap className="text-cyan-500" />}
            title="Source Control"
            desc="Full export capability to production LaTeX code or high-fidelity PDF, giving you total creative control."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200/50 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-3 transition-all duration-700 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-10 border border-white shadow-inner group-hover:scale-110 transition-transform duration-700 relative z-10">
        {React.cloneElement(icon, { size: 36, strokeWidth: 2.5 })}
      </div>
      
      <h3 className="text-2xl font-black text-slate-900 mb-5 tracking-tight relative z-10">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-semibold text-xs relative z-10">{desc}</p>
    </div>
  );
}
