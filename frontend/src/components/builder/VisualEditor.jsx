import React from 'react';
import { FileText, Sparkles, Code2, Plus, Trash2, XCircle } from 'lucide-react';
import InputField from '../ui/InputField';
import ExperienceEditor from '../editor/ExperienceEditor';

export default function VisualEditor({ resumeData, setResumeData, updatePersonal, onEnhanceBullet, loadingStates }) {
  if (!resumeData) return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
           <FileText size={32} />
        </div>
        <p className="text-slate-500 font-bold">Initializing editor data...</p>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 overflow-y-auto p-8 scroll-smooth bg-slate-50 no-print no-scrollbar">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Personal Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 group hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-500">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Personal Identity</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" value={resumeData.personal?.name} onChange={v => updatePersonal('name', v)} />
            <InputField label="Primary Email" value={resumeData.personal?.email} onChange={v => updatePersonal('email', v)} />
            <InputField label="Phone" value={resumeData.personal?.phone} onChange={v => updatePersonal('phone', v)} />
            <InputField label="Location" value={resumeData.personal?.location} onChange={v => updatePersonal('location', v)} />
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 group hover:shadow-2xl hover:shadow-cyan-200/20 transition-all duration-500">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Professional Summary</h3>
          </div>
          <textarea 
            className="w-full h-32 bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all resize-none shadow-inner"
            placeholder="A brief overview of your professional career and aspirations..."
            value={resumeData.summary || ''}
            onChange={e => setResumeData({...resumeData, summary: e.target.value})}
          />
        </div>

        {/* Experience Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 group transition-all duration-500">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Professional Experience</h3>
            </div>
          </div>
          <ExperienceEditor 
            experienceArray={resumeData.experience || []} 
            onUpdateRole={(idx, f, v) => {
              const n = [...(resumeData.experience || [])]; 
              if (n[idx]) {
                n[idx] = {...n[idx], [f]: v};
                setResumeData({...resumeData, experience: n});
              }
            }} 
            onRemoveRole={idx => {
              const n = (resumeData.experience || []).filter((_, i) => i !== idx);
              setResumeData({...resumeData, experience: n});
            }} 
            onAddRole={() => setResumeData({...resumeData, experience: [...(resumeData.experience || []), { title: '', companyOrInst: '', date: '', location: '', url: '', bullets: [''] }]})}
            onEnhance={onEnhanceBullet}
            loadingStates={loadingStates}
          />
        </div>

        {/* Education Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
           <div className="flex justify-between items-center mb-6">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                 <Plus size={20} className="rotate-45" />
               </div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Academic Foundation</h3>
             </div>
             <button onClick={() => setResumeData({...resumeData, education: [...(resumeData.education || []), { title: '', companyOrInst: '', date: '', location: '', details: '' }]})} className="text-[10px] bg-slate-900 text-white font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center hover:bg-slate-700 transition"><Plus size={12} className="mr-2"/> Add School</button>
           </div>
           <div className="space-y-6">
             {(resumeData.education || []).map((edu, idx) => (
               <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl relative group">
                 <button onClick={() => setResumeData({...resumeData, education: (resumeData.education || []).filter((_, i) => i !== idx)})} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <InputField label="Degree / Certificate" value={edu.title} onChange={v => {
                      const n = [...(resumeData.education || [])]; n[idx] = {...n[idx], title: v};
                      setResumeData({...resumeData, education: n});
                   }} />
                   <InputField label="Institution" value={edu.companyOrInst} onChange={v => {
                      const n = [...(resumeData.education || [])]; n[idx] = {...n[idx], companyOrInst: v};
                      setResumeData({...resumeData, education: n});
                   }} />
                   <InputField label="Dates" value={edu.date} onChange={v => {
                      const n = [...(resumeData.education || [])]; n[idx] = {...n[idx], date: v};
                      setResumeData({...resumeData, education: n});
                   }} />
                   <InputField label="Details / CGPA" value={edu.details} onChange={v => {
                      const n = [...(resumeData.education || [])]; n[idx] = {...n[idx], details: v};
                      setResumeData({...resumeData, education: n});
                   }} />
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
           <div className="flex justify-between items-center mb-6">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                 <Code2 size={20} />
               </div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Significant Projects</h3>
             </div>
             <button onClick={() => setResumeData({...resumeData, projects: [...(resumeData.projects || []), { title: '', techStack: '', bullets: [''] }]})} className="text-[10px] bg-slate-900 text-white font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center hover:bg-slate-700 transition"><Plus size={12} className="mr-2"/> Add Project</button>
           </div>
           <div className="space-y-6">
             {(resumeData.projects || []).map((proj, idx) => (
               <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl relative group">
                 <button onClick={() => setResumeData({...resumeData, projects: (resumeData.projects || []).filter((_, i) => i !== idx)})} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                   <InputField label="Project Title" value={proj.title} onChange={v => {
                      const n = [...(resumeData.projects || [])]; n[idx] = {...n[idx], title: v};
                      setResumeData({...resumeData, projects: n});
                   }} />
                   <InputField label="Tech Stack" value={proj.techStack} onChange={v => {
                      const n = [...(resumeData.projects || [])]; n[idx] = {...n[idx], techStack: v};
                      setResumeData({...resumeData, projects: n});
                   }} />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Description Bullets <button onClick={() => {
                        const n = [...(resumeData.projects || [])]; n[idx].bullets = [...(n[idx].bullets || []), ""];
                        setResumeData({...resumeData, projects: n});
                    }} className="text-rose-600">+ Add</button></div>
                    {(proj.bullets || []).map((b, bIdx) => (
                        <div key={bIdx} className="flex space-x-2">
                            <textarea className="flex-1 bg-white border border-slate-100 rounded-xl p-3 text-xs text-slate-600 outline-none focus:ring-2 focus:ring-rose-500/20 shadow-sm min-h-12" value={b} onChange={e => {
                                const n = [...(resumeData.projects || [])]; n[idx].bullets[bIdx] = e.target.value;
                                setResumeData({...resumeData, projects: n});
                            }}/>
                            <button onClick={() => {
                                const n = [...(resumeData.projects || [])]; n[idx].bullets = (n[idx].bullets || []).filter((_, i) => i !== bIdx);
                                setResumeData({...resumeData, projects: n});
                            }} className="text-slate-300 hover:text-rose-500"><XCircle size={14}/></button>
                        </div>
                    ))}
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Code2 size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Stack & Competencies</h3>
            </div>
            <button onClick={() => setResumeData({...resumeData, skills: [...(resumeData.skills || []), { category: 'Tools', items: [''] }]})} className="text-[10px] bg-slate-900 text-white font-black uppercase tracking-widest px-4 py-2 rounded-xl flex items-center hover:bg-slate-700 transition shadow-lg shadow-slate-200"><Plus size={12} className="mr-2"/> New Class</button>
          </div>
          <div className="space-y-6">
            {(resumeData.skills || []).map((cat, cIdx) => (
              <div key={cIdx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl relative group">
                <button onClick={() => setResumeData({...resumeData, skills: (resumeData.skills || []).filter((_, i) => i !== cIdx)})} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                <input className="bg-transparent font-black text-slate-800 text-sm outline-none border-b-2 border-transparent focus:border-emerald-500 mb-4 w-full" value={cat.category} onChange={e => {
                  const n = [...(resumeData.skills || [])]; n[cIdx] = {...n[cIdx], category: e.target.value};
                  setResumeData({...resumeData, skills: n});
                }} />
                <div className="flex flex-wrap gap-3">
                  {(cat.items || []).map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center bg-white border border-slate-100 shadow-sm rounded-xl px-4 py-2 group/item">
                      <input className="bg-transparent text-xs font-bold text-slate-600 w-24 outline-none" value={item} onChange={e => {
                        const n = [...(resumeData.skills || [])];
                        const items = [...(n[cIdx].items || [])]; items[iIdx] = e.target.value;
                        n[cIdx] = {...n[cIdx], items};
                        setResumeData({...resumeData, skills: n});
                      }} />
                      <button onClick={() => {
                        const n = [...(resumeData.skills || [])];
                        const items = (n[cIdx].items || []).filter((_, i) => i !== iIdx);
                        n[cIdx] = {...n[cIdx], items};
                        setResumeData({...resumeData, skills: n});
                      }} className="ml-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover/item:opacity-100 transition-opacity"><XCircle size={12}/></button>
                    </div>
                  ))}
                  <button onClick={() => {
                     const n = [...(resumeData.skills || [])]; n[cIdx] = {...n[cIdx], items: [...(n[cIdx].items || []), ""]};
                     setResumeData({...resumeData, skills: n});
                  }} className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition tracking-widest uppercase">+ Add Item</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-40" />
      </div>
    </div>
  );
}
