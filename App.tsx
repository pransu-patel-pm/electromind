import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ProjectLab from './components/ProjectLab';
import { AppView } from './types';
import { Activity, ShieldCheck, Zap, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile navigation wrapper
  const handleViewChange = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.STUDY_ASSISTANT:
        return (
          <div className="h-full flex flex-col">
             <div className="mb-4">
                <h2 className="text-2xl font-bold text-slate-100">Study Assistant</h2>
                <p className="text-slate-400">Your AI tutor for circuit theory, math, and homework help.</p>
             </div>
             <div className="flex-1 overflow-hidden">
                <ChatInterface mode="study" />
             </div>
          </div>
        );
      case AppView.MARKET_INSIGHTS:
        return (
          <div className="h-full flex flex-col">
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-slate-100">Industry Insights</h2>
                <p className="text-slate-400">Real-time data on components, datasheets, and market trends.</p>
             </div>
            <div className="flex-1 overflow-hidden">
                <ChatInterface mode="market" />
            </div>
          </div>
        );
      case AppView.PROJECT_LAB:
        return (
            <div className="h-full flex flex-col">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-slate-100">Project Lab</h2>
                    <p className="text-slate-400">Generate ideas and get step-by-step expert guidance.</p>
                </div>
                <div className="flex-1 overflow-hidden">
                    <ProjectLab />
                </div>
            </div>
        );
      case AppView.DASHBOARD:
      default:
        return (
          <div className="h-full overflow-y-auto">
             <div className="max-w-4xl mx-auto space-y-8 py-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Welcome to ElectroMind
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        The ultimate AI-powered workbench for electronics students. Design, learn, and build with expert guidance backed by real industry data.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div 
                        onClick={() => setCurrentView(AppView.PROJECT_LAB)}
                        className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-cyan-500 transition-all cursor-pointer group shadow-lg"
                    >
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Zap className="text-cyan-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Start a Project</h3>
                        <p className="text-slate-400 text-sm">Generate unique ideas based on your skill level and get full build guides.</p>
                    </div>

                    <div 
                        onClick={() => setCurrentView(AppView.MARKET_INSIGHTS)}
                        className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all cursor-pointer group shadow-lg"
                    >
                         <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Activity className="text-purple-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Industry Data</h3>
                        <p className="text-slate-400 text-sm">Search real-time component prices, specs, and technology news.</p>
                    </div>

                    <div 
                         onClick={() => setCurrentView(AppView.STUDY_ASSISTANT)}
                         className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-green-500 transition-all cursor-pointer group shadow-lg"
                    >
                         <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="text-green-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Expert Tutor</h3>
                        <p className="text-slate-400 text-sm">Resolve circuit doubts and learn theory with a personal AI professor.</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700 mt-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-4">Why ElectroMind?</h2>
                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                <span>Powered by Gemini 1.5 Pro/Flash for expert reasoning.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                <span>Real-time grounding with Google Search for accurate datasheets.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                <span>Code generation for Arduino, ESP32, Raspberry Pi & more.</span>
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
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-slate-800 rounded-lg text-white border border-slate-700 shadow-lg"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="absolute inset-0 z-40 bg-slate-950/95 md:hidden pt-16 px-4">
             <nav className="space-y-4">
                <button onClick={() => handleViewChange(AppView.DASHBOARD)} className="block w-full text-left p-4 bg-slate-800 rounded-xl">Dashboard</button>
                <button onClick={() => handleViewChange(AppView.PROJECT_LAB)} className="block w-full text-left p-4 bg-slate-800 rounded-xl">Project Lab</button>
                <button onClick={() => handleViewChange(AppView.STUDY_ASSISTANT)} className="block w-full text-left p-4 bg-slate-800 rounded-xl">Study Assistant</button>
                <button onClick={() => handleViewChange(AppView.MARKET_INSIGHTS)} className="block w-full text-left p-4 bg-slate-800 rounded-xl">Industry Insights</button>
             </nav>
        </div>
      )}

      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 p-4 md:p-6 overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;