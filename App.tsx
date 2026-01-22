import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ProjectLab from './components/ProjectLab';
import ComponentDetails from './components/ComponentDetails';
import { AppView } from './types';
import { Activity, ShieldCheck, Zap, Menu, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case AppView.STUDY_ASSISTANT:
        return (
          <div className="h-full flex flex-col pt-12 md:pt-0">
             <div className="mb-2 md:mb-4 px-1">
                <h2 className="text-xl md:text-2xl font-bold text-slate-100">Study Assistant</h2>
                <p className="text-sm md:text-base text-slate-400">Your AI tutor for circuit theory, math, and homework help.</p>
             </div>
             <div className="flex-1 overflow-hidden">
                <ChatInterface mode="study" />
             </div>
          </div>
        );
      case AppView.MARKET_INSIGHTS:
        return (
          <div className="h-full flex flex-col pt-12 md:pt-0">
            <div className="mb-2 md:mb-4 px-1">
                <h2 className="text-xl md:text-2xl font-bold text-slate-100">Industry Insights</h2>
                <p className="text-sm md:text-base text-slate-400">Real-time data on components, datasheets, and market trends.</p>
             </div>
            <div className="flex-1 overflow-hidden">
                <ChatInterface mode="market" />
            </div>
          </div>
        );
      case AppView.PROJECT_LAB:
        return (
            <div className="h-full flex flex-col pt-12 md:pt-0">
                <div className="mb-2 md:mb-4 px-1">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-100">Project Lab</h2>
                    <p className="text-sm md:text-base text-slate-400">Generate ideas and get step-by-step expert guidance.</p>
                </div>
                <div className="flex-1 overflow-hidden">
                    <ProjectLab />
                </div>
            </div>
        );
      case AppView.COMPONENT_DETAILS:
        return (
             <div className="h-full flex flex-col pt-12 md:pt-0">
                <div className="mb-2 md:mb-4 px-1">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-100">Component Details</h2>
                    <p className="text-sm md:text-base text-slate-400">Deep dive into datasheets, specs, and pinouts.</p>
                </div>
                <div className="flex-1 overflow-hidden">
                    <ComponentDetails />
                </div>
            </div>
        );
      case AppView.DASHBOARD:
      default:
        return (
          <div className="h-full overflow-y-auto pt-12 md:pt-0">
             <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 py-4 md:py-8">
                <div className="text-center space-y-4 px-4">
                    <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 leading-tight">
                        Welcome to ElectroMind
                    </h1>
                    <p className="text-sm md:text-lg text-slate-400 max-w-2xl mx-auto">
                        The ultimate AI-powered workbench for electronics students. Design, learn, and build with expert guidance backed by real industry data.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-1">
                    <div 
                        onClick={() => setCurrentView(AppView.PROJECT_LAB)}
                        className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-cyan-500 transition-all cursor-pointer group shadow-lg active:scale-95"
                    >
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Zap className="text-cyan-400" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Start a Project</h3>
                        <p className="text-slate-400 text-xs">Generate unique ideas & build guides.</p>
                    </div>

                    <div 
                         onClick={() => setCurrentView(AppView.COMPONENT_DETAILS)}
                         className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-pink-500 transition-all cursor-pointer group shadow-lg active:scale-95"
                    >
                         <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Cpu className="text-pink-400" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Component Info</h3>
                        <p className="text-slate-400 text-xs">Visuals, pinouts, and specs.</p>
                    </div>

                    <div 
                        onClick={() => setCurrentView(AppView.MARKET_INSIGHTS)}
                        className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all cursor-pointer group shadow-lg active:scale-95"
                    >
                         <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Activity className="text-purple-400" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Industry Data</h3>
                        <p className="text-slate-400 text-xs">Search real-time trends & prices.</p>
                    </div>

                    <div 
                         onClick={() => setCurrentView(AppView.STUDY_ASSISTANT)}
                         className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-green-500 transition-all cursor-pointer group shadow-lg active:scale-95"
                    >
                         <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="text-green-400" size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Expert Tutor</h3>
                        <p className="text-slate-400 text-xs">Circuit theory & debugging help.</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 border border-slate-700 mt-8 relative overflow-hidden mx-1">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Why ElectroMind?</h2>
                        <ul className="space-y-3 text-slate-300 text-sm md:text-base">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></div>
                                <span>Powered by Gemini 3 Flash & Pro for expert reasoning.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></div>
                                <span>Real-time grounding with Google Search for accurate datasheets.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></div>
                                <span>Generate schematics code and component visualizations.</span>
                            </li>
                        </ul>
                    </div>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 bg-slate-800/90 backdrop-blur rounded-lg text-white border border-slate-700 shadow-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar & Backdrop */}
      {mobileMenuOpen && (
        <>
            <div 
                className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
            />
            <Sidebar 
                currentView={currentView} 
                onChangeView={setCurrentView} 
                isMobile={true} 
                onClose={() => setMobileMenuOpen(false)} 
            />
        </>
      )}

      {/* Desktop Sidebar (Always rendered, hidden on mobile via CSS inside Sidebar component) */}
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 p-2 md:p-6 overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;