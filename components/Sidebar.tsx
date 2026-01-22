import React from 'react';
import { AppView } from '../types';
import { LayoutDashboard, BookOpen, Lightbulb, TrendingUp, Cpu } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.STUDY_ASSISTANT, label: 'Study Assistant', icon: BookOpen },
    { id: AppView.PROJECT_LAB, label: 'Project Lab', icon: Lightbulb },
    { id: AppView.MARKET_INSIGHTS, label: 'Industry Insights', icon: TrendingUp },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col h-full hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
          <Cpu className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">ElectroMind</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
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

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">Gemini Powered</p>
          <p>Real-time data & expert models active.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;