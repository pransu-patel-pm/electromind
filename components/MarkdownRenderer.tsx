import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-sm max-w-none 
      prose-headings:text-cyan-400 prose-a:text-cyan-300 
      prose-code:text-yellow-300 prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;