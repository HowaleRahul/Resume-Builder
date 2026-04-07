import React from 'react';

export default function TabButton({ active, onClick, icon, label, disabled }) {
  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition ${
        active 
          ? 'bg-white text-slate-900 shadow-sm' 
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}
