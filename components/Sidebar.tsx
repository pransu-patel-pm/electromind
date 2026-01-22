import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, BookOpen, Lightbulb, TrendingUp, Cpu, X } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isMobile = false, onClose }) => {
  
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.STUDY_ASSISTANT, label: 'Study Assistant', icon: BookOpen },
    { id: AppView.PROJECT_LAB, label: 'Project Lab', icon: Lightbulb },
    { id: AppView.COMPONENT_DETAILS, label: 'Component Info', icon: Cpu },
    { id: AppView.MARKET_INSIGHTS, label: 'Industry Insights', icon: TrendingUp },
  ];

  const baseClasses = "bg-slate-900 border-r border-slate-700 flex flex-col h-full transition-transform duration-300";
  const mobileClasses = "fixed inset-y-0 left-0 z-50 w-72 shadow-2xl";
  const desktopClasses = "hidden md:flex w-64 relative";

  return (
    <aside className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">ElectroMind</h1>
        </div>
        {isMobile && onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onChangeView(item.id);
                if (isMobile && onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-white'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">Gemini Powered</p>
          <p>Real-time data & expert models active.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;