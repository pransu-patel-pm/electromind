import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { Send, Bot, User, Globe, Loader2, Eraser } from 'lucide-react';

interface ChatInterfaceProps {
  mode: 'study' | 'market';
  initialMessage?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ mode, initialMessage }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isMarket = mode === 'market';

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
        setMessages([{
            id: 'init',
            role: 'model',
            content: initialMessage,
            timestamp: Date.now()
        }]);
    } else if (messages.length === 0) {
         setMessages([{
            id: 'init',
            role: 'model',
            content: isMarket 
                ? "I can research the latest electronics industry trends, component prices, and chip shortages for you. What would you like to know?"
                : "I am your personal electronics tutor. Ask me about circuit theory, component calculations, or debugging help.",
            timestamp: Date.now()
        }]);
    }
  }, [mode, initialMessage, isMarket, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      
      const response = await sendMessageToGemini(history, userMsg.content, isMarket);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text,
        timestamp: Date.now(),
        sources: response.sources
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "I encountered an error connecting to the knowledge base. Please try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-700">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-cyan-600' : 'bg-slate-700'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} className="text-cyan-400" />}
            </div>
            
            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-cyan-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                <MarkdownRenderer content={msg.content} />
              </div>

              {/* Sources for Market Mode */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 text-xs flex flex-wrap gap-2">
                    {msg.sources.map((src, idx) => (
                        <a 
                            key={idx} 
                            href={src.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 bg-slate-800 text-cyan-400 px-2 py-1 rounded hover:bg-slate-700 transition-colors border border-slate-700"
                        >
                            <Globe size={12} />
                            {src.title}
                        </a>
                    ))}
                </div>
              )}
              
              <span className="text-[10px] text-slate-500 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <Loader2 className="animate-spin text-cyan-400" size={20} />
             </div>
             <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-700">
                <span className="text-slate-400 text-sm animate-pulse">Analyzing...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-2">
          <button 
            onClick={() => setMessages([])}
            className="p-3 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-xl transition-colors"
            title="Clear Chat"
          >
            <Eraser size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isMarket ? "Ask about latest sensors, chip prices, or trends..." : "Ask a question about electronics..."}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-cyan-900/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;