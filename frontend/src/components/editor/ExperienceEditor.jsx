import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Sparkles, Trash2, Plus } from 'lucide-react';
import InputField from '../ui/InputField';

export default function ExperienceEditor({ 
  experienceArray, 
  onDragEnd, 
  onAddRole, 
  onUpdateRole, 
  onEnhance, 
  loading 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center">
          <span className="w-8 h-8 rounded-md bg-cyan-100 text-cyan-600 flex items-center justify-center mr-3 font-bold">2</span> 
          Work Experience
        </h3>
        <button 
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md" 
          onClick={onAddRole}
        >
          + Add Role
        </button>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="experienceList">
          {(provided) => (
            <div className="space-y-4" {...provided.droppableProps} ref={provided.innerRef}>
              {experienceArray && experienceArray.map((exp, idx) => (
                <Draggable key={`exp-${idx}`} draggableId={`exp-${idx}`} index={idx}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className="border border-slate-100 bg-slate-50 rounded-lg p-4 relative group">
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab px-1" {...provided.dragHandleProps}>
                        <div className="w-1.5 h-6 flex flex-col justify-between">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 group-hover:opacity-100 opacity-0 transition">
                        <button onClick={() => onRemoveRole(idx)} className="text-slate-400 hover:text-red-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 w-[95%]">
                         <InputField 
                            label="Job Title" 
                            value={exp.title} 
                            onChange={v => onUpdateRole(idx, 'title', v)} 
                         />
                         <InputField 
                            label="Company" 
                            value={exp.companyOrInst} 
                            onChange={v => onUpdateRole(idx, 'companyOrInst', v)} 
                         />
                         <InputField 
                            label="Project/Company Link" 
                            value={exp.url || ''} 
                            placeholder="https://..."
                            onChange={v => onUpdateRole(idx, 'url', v)} 
                         />
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-1 w-[95%]">
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Bullet Points</label>
                          <button onClick={() => {
                             const newBullets = [...(exp.bullets || [])];
                             newBullets.push("");
                             onUpdateRole(idx, 'bullets', newBullets);
                          }} className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center">
                            <Plus size={12} className="mr-1" /> Add Bullet
                          </button>
                        </div>
                        <div className="space-y-2 w-[95%]">
                          {exp.bullets && exp.bullets.map((bullet, bIdx) => (
                             <div key={bIdx} className="flex gap-2">
                               <textarea 
                                 className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-10"
                                 value={bullet}
                                 onChange={e => {
                                    const newBullets = [...exp.bullets];
                                    newBullets[bIdx] = e.target.value;
                                    onUpdateRole(idx, 'bullets', newBullets);
                                 }}
                               />
                               <button onClick={() => {
                                  const newBullets = [...exp.bullets];
                                  newBullets.splice(bIdx, 1);
                                  onUpdateRole(idx, 'bullets', newBullets);
                               }} className="text-slate-400 hover:text-red-500">
                                 <Trash2 size={14} />
                               </button>
                             </div>
                          ))}
                          {(!exp.bullets || exp.bullets.length === 0) && (
                             <p className="text-xs text-slate-400 italic">No bullets added yet.</p>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => onEnhance(idx, exp.bullets?.[0] || "")} 
                        disabled={loading} 
                        className="flex items-center text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded transition"
                      >
                        <Sparkles size={14} className="mr-1" />
                        {loading ? 'Enhancing...' : 'Enhance with AI'}
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
