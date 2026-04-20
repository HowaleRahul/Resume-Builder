import React from 'react';
import { AlertCircle, FileText, RefreshCw } from 'lucide-react';

export default function ParseConfirmationModal({ 
  isOpen, 
  parsedData, 
  currentData,
  onKeepCurrent, 
  onUseParked,
  onCancel,
  isLoading
}) {
  if (!isOpen) return null;

  const hasCurrentData = currentData && (
    currentData.personal?.name || 
    currentData.experience?.length > 0 || 
    currentData.education?.length > 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Merge Strategy</h2>
            <p className="text-sm text-slate-500 mt-1">LaTeX code parsed successfully!</p>
          </div>
        </div>

        {/* Message */}
        {hasCurrentData ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-sm text-amber-900 font-medium">
              You already have data in your resume. How would you like to proceed?
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-sm text-blue-900 font-medium">
              New resume data parsed from your LaTeX code. Ready to import?
            </p>
          </div>
        )}

        {/* Data Preview */}
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {parsedData?.personal?.name && (
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <FileText size={16} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Name</p>
                <p className="text-sm font-bold text-slate-900">{parsedData.personal.name}</p>
              </div>
            </div>
          )}
          {parsedData?.personal?.email && (
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <FileText size={16} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email</p>
                <p className="text-sm font-bold text-slate-900">{parsedData.personal.email}</p>
              </div>
            </div>
          )}
          {parsedData?.experience?.length > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <FileText size={16} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Experience</p>
                <p className="text-sm font-bold text-slate-900">{parsedData.experience.length} entries</p>
              </div>
            </div>
          )}
          {parsedData?.education?.length > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <FileText size={16} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Education</p>
                <p className="text-sm font-bold text-slate-900">{parsedData.education.length} entries</p>
              </div>
            </div>
          )}
          {parsedData?.projects?.length > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <FileText size={16} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Projects</p>
                <p className="text-sm font-bold text-slate-900">{parsedData.projects.length} entries</p>
              </div>
            </div>
          )}
          {parsedData?.skills?.length > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <FileText size={16} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Skills</p>
                <p className="text-sm font-bold text-slate-900">{parsedData.skills.length} categories</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          {hasCurrentData && (
            <button
              onClick={onKeepCurrent}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-sm uppercase tracking-widest rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <FileText size={16} className="mr-2" />
              Keep Current
            </button>
          )}
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-sm uppercase tracking-widest rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onUseParked}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <RefreshCw size={16} className="mr-2" />
            {isLoading ? 'Importing...' : 'Use Parsed'}
          </button>
        </div>
      </div>
    </div>
  );
}
