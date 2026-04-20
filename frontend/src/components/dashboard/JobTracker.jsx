import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { 
  BriefcaseBusiness, 
  MapPin, 
  Calendar, 
  Link as LinkIcon, 
  MoreVertical, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import API_BASE_URL from '../../config/api';

const STATUS_COLUMNS = [
  { id: 'wishlist', label: 'Wishlist', icon: <Clock className="text-slate-400" size={16}/>, color: 'bg-slate-100 text-slate-600' },
  { id: 'applied', label: 'Applied', icon: <BriefcaseBusiness className="text-blue-500" size={16}/>, color: 'bg-blue-50 text-blue-600' },
  { id: 'interviewing', label: 'Interviewing', icon: <MessageSquare className="text-amber-500" size={16}/>, color: 'bg-amber-50 text-amber-600' },
  { id: 'offered', label: 'Offered', icon: <CheckCircle2 className="text-emerald-500" size={16}/>, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'rejected', label: 'Rejected', icon: <XCircle className="text-rose-500" size={16}/>, color: 'bg-rose-50 text-rose-600' },
];

export default function JobTracker() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedJob, setExpandedJob] = useState(null); // ID of the job being edited in detail
  const [newJob, setNewJob] = useState({ company: '', position: '', status: 'wishlist', url: '', location: '', notes: '' });

  useEffect(() => {
    if (user?.id) fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/jobs/list/${user.id}`);
      if (res.data.success) {
        setJobs(res.data.jobs || []);
      }
    } catch (err) {
      const errorDetail = err.response?.data?.details || err.message;
      toast.error(`Job Tracker: ${errorDetail}`);
      console.error("Job Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/jobs/create`, { ...newJob, userId: user.id });
      if (res.data.success) {
        setJobs([res.data.job, ...jobs]);
        setShowAddModal(false);
        setNewJob({ company: '', position: '', status: 'wishlist', url: '', location: '' });
        toast.success('Job added to tracker');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      toast.error(`Failed to add job: ${errorMsg}`);
      console.error("Job Creation Error:", err.response?.data);
    }
  };

  const handleUpdate = async (jobId, updates) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/jobs/update/${jobId}`, updates);
      if (res.data.success) {
        setJobs(jobs.map(j => j._id === jobId ? { ...j, ...updates } : j));
        if (updates.status) toast.success(`Moved to ${updates.status}`);
        else toast.success('Job details updated');
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Remove this job from tracker?')) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/jobs/delete/${jobId}`);
      if (res.data.success) {
        setJobs(jobs.filter(j => j._id !== jobId));
        toast.success('Job removed');
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading tracker...</div>;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50">
      {/* Header */}
      <div className="p-6 flex justify-between items-center bg-white border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Job Application Tracker</h2>
          <p className="text-sm text-slate-500">Organize and monitor your career progress.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition flex items-center"
        >
          <Plus size={18} className="mr-2"/> Track New Job
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex h-full min-w-max gap-6">
          {STATUS_COLUMNS.map(col => (
            <div key={col.id} className="w-80 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg ${col.color}`}>
                    {col.icon}
                  </div>
                  <span className="font-bold text-slate-700">{col.label}</span>
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                    {jobs.filter(j => j.status === col.id).length}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-10">
                {jobs.filter(j => j.status === col.id).map(job => (
                  <div key={job._id} className={`bg-white rounded-2xl border transition-all duration-300 group relative ${expandedJob === job._id ? 'border-blue-500 shadow-xl scale-[1.02] z-10' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="cursor-pointer flex-1" onClick={() => setExpandedJob(expandedJob === job._id ? null : job._id)}>
                          <h4 className="font-black text-slate-900 leading-tight mb-1">{job.position}</h4>
                          <p className="text-xs font-bold text-blue-600">{job.company}</p>
                        </div>
                        <div className="flex space-x-2">
                           <button onClick={() => setExpandedJob(expandedJob === job._id ? null : job._id)} className="text-slate-300 hover:text-blue-500 transition">
                             <MoreVertical size={14}/>
                           </button>
                           <button onClick={() => handleDeleteJob(job._id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                             <Trash2 size={14}/>
                           </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {job.location && (
                          <div className="flex items-center text-[11px] text-slate-500 font-medium">
                            <MapPin size={12} className="mr-1.5 text-slate-400" /> {job.location}
                          </div>
                        )}
                        <div className="flex items-center text-[11px] text-slate-500 font-medium">
                          <Calendar size={12} className="mr-1.5 text-slate-400" /> 
                          {new Date(job.dateApplied).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      {expandedJob === job._id && (
                        <div className="mb-4 space-y-3 animate-slide-up border-t pt-4">
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Personal Notes</label>
                              <textarea 
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10 min-h-20"
                                placeholder="Add interview notes, contacts, or reminders..."
                                defaultValue={job.notes}
                                onBlur={(e) => handleUpdate(job._id, { notes: e.target.value })}
                              />
                           </div>
                        </div>
                      )}
  
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="flex space-x-2">
                           {STATUS_COLUMNS.filter(c => c.id !== job.status).slice(0, 2).map(c => (
                             <button 
                               key={c.id}
                               onClick={() => handleUpdate(job._id, { status: c.id })}
                               className="text-[9px] font-black uppercase text-slate-400 hover:text-blue-600 transition"
                             >
                               To {c.label}
                             </button>
                           ))}
                        </div>
                        {job.url && (
                          <a href={job.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600">
                            <LinkIcon size={12}/>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {jobs.filter(j => j.status === col.id).length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xs italic">
                    No items in {col.label}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-4xl w-full max-w-lg shadow-2xl p-8 overflow-hidden animate-slide-up">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Track Application</h3>
            <form onSubmit={handleAddJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Company</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="e.g. Google" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Position</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="e.g. Frontend Dev" value={newJob.position} onChange={e => setNewJob({...newJob, position: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Job URL</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="https://linkedin.com/jobs/..." value={newJob.url} onChange={e => setNewJob({...newJob, url: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Initial Notes / Context</label>
                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-24 resize-none" 
                  placeholder="Remote role, referral from Mike..." value={newJob.notes} onChange={e => setNewJob({...newJob, notes: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Location</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="e.g. Remote" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Status</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none" 
                    value={newJob.status} onChange={e => setNewJob({...newJob, status: e.target.value})}>
                    {STATUS_COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition">Save Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
