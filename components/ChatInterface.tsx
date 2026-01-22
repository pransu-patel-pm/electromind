import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessageToGemini, generateImage } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { Send, Bot, User, Globe, Loader2, Eraser, Image as ImageIcon } from 'lucide-react';

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
                : "I am your personal electronics tutor. Ask me about circuit theory, calculations, or ask me to generate diagrams.",
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

  const handleSend = async (type: 'text' | 'image' = 'text') => {
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
      let botMsg: Message;

      if (type === 'image') {
         // Image Generation Mode
         const imageUrl = await generateImage(userMsg.content);
         botMsg = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: imageUrl ? `Here is the visual representation for: **${userMsg.content}**` : "Sorry, I couldn't generate an image for that request.",
            imageUrl: imageUrl || undefined,
            timestamp: Date.now()
         };
      } else {
         // Text/Search Mode
         const history = messages.map(m => ({ role: m.role, content: m.content }));
         const response = await sendMessageToGemini(history, userMsg.content, isMarket);
         botMsg = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: response.text,
            timestamp: Date.now(),
            sources: response.sources
         };
      }

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
    <div className="flex flex-col h-full bg-slate-900/50 md:rounded-2xl rounded-xl overflow-hidden border border-slate-700">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4 md:space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-cyan-600' : 'bg-slate-700'
            }`}>
              {msg.role === 'user' ? <User size={16} className="md:w-5 md:h-5" /> : <Bot size={16} className="text-cyan-400 md:w-5 md:h-5" />}
            </div>
            
            <div className={`flex flex-col max-w-[85%] md:max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-3 py-2 md:px-4 md:py-3 rounded-2xl shadow-sm text-sm md:text-base ${
                msg.role === 'user' 
                  ? 'bg-cyan-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                {msg.imageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-slate-600">
                        <img src={msg.imageUrl} alt="Generated visual" className="w-full h-auto max-h-64 object-cover" />
                    </div>
                )}
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
                            <span className="truncate max-w-[150px]">{src.title}</span>
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
          <div className="flex gap-2 md:gap-4">
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <Loader2 className="animate-spin text-cyan-400" size={16} />
             </div>
             <div className="bg-slate-800 px-3 py-2 md:px-4 md:py-3 rounded-2xl rounded-tl-none border border-slate-700">
                <span className="text-slate-400 text-sm animate-pulse">Processing...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-2 md:p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-2 items-end">
          <button 
            onClick={() => setMessages([])}
            className="p-2 md:p-3 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-xl transition-colors shrink-0"
            title="Clear Chat"
          >
            <Eraser size={20} />
          </button>
          <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl flex items-center overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500">
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend('text')}
                placeholder={isMarket ? "Ask about sensors..." : "Ask questions..."}
                className="flex-1 bg-transparent px-3 py-2 md:px-4 text-slate-200 focus:outline-none placeholder-slate-500 min-w-0"
            />
             <button
                onClick={() => handleSend('image')}
                disabled={isLoading || !input.trim()}
                className="p-2 md:p-3 hover:bg-slate-800 disabled:opacity-50 text-cyan-400 transition-all border-l border-slate-800 shrink-0"
                title="Generate Visual"
            >
                <ImageIcon size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
          
          <button
            onClick={() => handleSend('text')}
            disabled={isLoading || !input.trim()}
            className="p-2 md:p-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-cyan-900/20 shrink-0"
            title="Send Message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;