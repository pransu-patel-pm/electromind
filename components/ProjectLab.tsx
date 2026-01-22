import React, { useState, useEffect } from 'react';
import { ProjectIdea } from '../types';
import { generateProjectIdeas, generateImage } from '../services/geminiService';
import ChatInterface from './ChatInterface';
import { Sparkles, Hammer, Cpu, ArrowRight, Image as ImageIcon, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

const ProjectLab: React.FC = () => {
  const [step, setStep] = useState<'generate' | 'guide'>('generate');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectIdea[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectIdea | null>(null);
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [preferences, setPreferences] = useState({
    interest: 'IoT',
    level: 'Beginner'
  });

  const handleGenerate = async () => {
    setLoading(true);
    setShowFilters(false); // Auto collapse on mobile after searching
    const results = await generateProjectIdeas(preferences.interest, preferences.level);
    setProjects(results);
    setLoading(false);
  };

  const handleSelectProject = async (project: ProjectIdea) => {
    setSelectedProject(project);
    setStep('guide');
    setProjectImage(null); // Reset prev image
    
    // Generate an image for the project context
    const img = await generateImage(`A professional, high-quality photograph or realistic 3D render of a DIY electronics project: ${project.title}. Components visible: ${project.components.join(', ')}. Style: technical workbench.`);
    setProjectImage(img);
  };

  if (step === 'guide' && selectedProject) {
    return (
      <div className="h-full flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700">
            <div className="flex-1 flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 h-fit">
                    <Hammer size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-100">{selectedProject.title}</h2>
                    <p className="text-xs text-slate-400">Interactive Build Guide</p>
                </div>
            </div>
            {projectImage && (
                <div className="w-full md:w-32 h-32 md:h-24 rounded-lg overflow-hidden border border-slate-600 bg-slate-900 shrink-0">
                    <img src={projectImage} alt="Project Preview" className="w-full h-full object-cover" />
                </div>
            )}
            <button 
                onClick={() => setStep('generate')}
                className="text-sm text-slate-400 hover:text-white underline self-start md:self-center"
            >
                Back to Ideas
            </button>
        </div>
        <div className="flex-1 overflow-hidden">
            <ChatInterface 
                mode="study" 
                initialMessage={`Let's build the **${selectedProject.title}**. \n\n**Overview**: ${selectedProject.description}\n\n**Required Components**: ${selectedProject.components.join(', ')}.\n\nI can help you with:\n1. Circuit Diagram & Schematics\n2. Component explanation\n3. Source Code (Arduino/Python)\n4. Assembly steps\n\nWhere should we start?`} 
            />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 md:gap-6">
      {/* Controls */}
      <div className="bg-slate-800 p-4 md:p-6 rounded-2xl border border-slate-700">
        <div className="flex justify-between items-center md:hidden mb-4" onClick={() => setShowFilters(!showFilters)}>
            <div className="flex items-center gap-2 text-slate-200 font-medium">
                <SlidersHorizontal size={18} />
                <span>Project Options</span>
            </div>
            {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Area of Interest</label>
            <select 
                value={preferences.interest}
                onChange={(e) => setPreferences(prev => ({...prev, interest: e.target.value}))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
                <option value="IoT">Internet of Things (IoT)</option>
                <option value="Robotics">Robotics & Automation</option>
                <option value="Embedded">Embedded Systems</option>
                <option value="Analog">Analog Circuits</option>
                <option value="Power">Power Electronics</option>
            </select>
            </div>
            
            <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Difficulty Level</label>
            <select 
                value={preferences.level}
                onChange={(e) => setPreferences(prev => ({...prev, level: e.target.value}))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
            </select>
            </div>

            <div className="flex items-end">
            <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
            >
                {loading ? <Sparkles className="animate-spin" /> : <Sparkles />}
                {loading ? 'Dreaming...' : 'Generate Projects'}
            </button>
            </div>
        </div>
        
        {/* Mobile quick action when collapsed */}
        <div className={`mt-2 md:hidden ${showFilters ? 'hidden' : 'block'}`}>
             <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 p-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
                <Sparkles size={16} />
                Quick Generate ({preferences.interest})
            </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex-1 overflow-y-auto">
        {projects.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 p-8 text-center">
                <Cpu size={48} className="opacity-20" />
                <p>Select your preferences and generate ideas to start.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-slate-800 rounded-2xl p-5 md:p-6 border border-slate-700 flex flex-col hover:border-cyan-500/50 transition-colors group shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                project.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                                project.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                                {project.difficulty}
                            </span>
                            <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">{project.field}</span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-3 flex-1">{project.description}</p>
                        
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-1">
                                {project.components.slice(0, 3).map((c, i) => (
                                    <span key={i} className="text-[10px] bg-slate-900 text-slate-500 px-2 py-1 rounded border border-slate-700">{c}</span>
                                ))}
                                {project.components.length > 3 && <span className="text-[10px] text-slate-500 px-1">+{project.components.length - 3} more</span>}
                            </div>
                            
                            <button 
                                onClick={() => handleSelectProject(project)}
                                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 active:bg-slate-500"
                            >
                                Start Project <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProjectLab;