import React, { useState } from 'react';
import { getComponentDetails } from '../services/geminiService';
import { ComponentData } from '../types';
import { Search, Info, Cpu, Layers, Activity, Loader2, Image } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

const ComponentDetails: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ComponentData | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setData(null);
    
    const result = await getComponentDetails(query);
    setData(result);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col gap-4 md:gap-6">
      <div className="bg-slate-800 p-4 md:p-6 rounded-2xl border border-slate-700">
         <h2 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Cpu className="text-cyan-400" />
            Component Encyclopedia
         </h2>
         <div className="flex gap-2">
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter component (e.g., NE555)..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 md:py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button 
                onClick={handleSearch}
                disabled={loading || !query}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-4 md:px-6 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                <span className="hidden md:inline">Search</span>
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!data && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4 p-8 text-center">
                <Layers size={64} className="opacity-20" />
                <p>Search for a component to view its datasheet details and imagery.</p>
            </div>
        )}

        {loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                 <Loader2 size={48} className="animate-spin text-cyan-400" />
                 <p>Analyzing datasheets and generating visuals...</p>
            </div>
        )}

        {data && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pb-6">
                {/* Visuals Column */}
                <div className="space-y-4 md:space-y-6">
                    <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 h-64 md:h-96 flex items-center justify-center overflow-hidden relative group">
                        {data.imageUrl ? (
                             <img src={data.imageUrl} alt={data.name} className="w-full h-full object-contain" />
                        ) : (
                             <div className="text-slate-500 flex flex-col items-center">
                                <Image size={48} className="mb-2" />
                                No image available
                             </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-mono text-sm">AI Generated Visualization</span>
                        </div>
                    </div>

                    <div className="bg-slate-800 rounded-2xl p-4 md:p-6 border border-slate-700">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Activity size={20} className="text-purple-400" />
                            Technical Specifications
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                             {data.specs.map((spec, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                                    <span className="text-slate-400 text-sm">{spec.param}</span>
                                    <span className="text-slate-200 font-mono text-sm text-right pl-4">{spec.value}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Info Column */}
                <div className="space-y-4 md:space-y-6">
                    <div className="bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">{data.name}</h1>
                            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs border border-cyan-500/20">Active</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed mb-6">
                            {data.description}
                        </p>
                    </div>

                    <div className="bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700">
                         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Info size={20} className="text-green-400" />
                            Pin Configuration & Notes
                        </h3>
                        <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-slate-200">
                             <MarkdownRenderer content={data.pinout} />
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ComponentDetails;