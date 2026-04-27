import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertCircle } from 'lucide-react';
import { askNur } from '../services/geminiService';
import { ChatMessage } from '../types';
import { translations } from '../i18n';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

export default function NurAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const t = translations.ar;

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const response = await askNur(userMessage, messages);
    setMessages(prev => [...prev, { role: 'model', content: response }]);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">
      <div className="bg-emerald-800 p-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center border border-white/20">
          <Bot className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-white font-serif text-xl font-medium leading-none">{t.aiTitle}</h2>
          <p className="text-emerald-200 text-xs mt-1 uppercase tracking-widest font-bold">{t.aiSubtitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <SparkleIcon className="text-emerald-500 w-8 h-8" />
            </div>
            <h3 className="text-emerald-900 font-bold text-lg">{t.greeting}</h3>
            <p className="text-emerald-500 max-w-xs mx-auto text-sm leading-relaxed">
              {t.aiWelcome}
            </p>
            <div className="grid grid-cols-1 gap-2 pt-4">
              {['تاريخ النبي محمد صلى الله عليه وسلم', 'ما هو الإحسان؟', 'آية عن الصبر'].map(q => (
                <button 
                  key={q}
                  onClick={() => setInput(q)}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs rounded-xl hover:bg-emerald-100 transition-all font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn(
            "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
            m.role === 'user' ? "flex-row-reverse" : "flex-row"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
              m.role === 'user' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
            )}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed",
              m.role === 'user' ? "bg-amber-50 text-amber-900" : "bg-emerald-50 text-emerald-900"
            )}>
              <div className="markdown-body">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl animate-pulse">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-emerald-50 bg-emerald-50/10">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.typeMessage}
            className="flex-1 px-5 py-3 rounded-2xl bg-white border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-emerald-800 text-white rounded-2xl hover:bg-emerald-900 disabled:opacity-50 transition-all shrink-0"
          >
            <Send className="w-5 h-5 -rotate-90" />
          </button>
        </form>
        <div className="flex items-center gap-1 mt-3 px-1">
          <AlertCircle className="w-3 h-3 text-emerald-400" />
          <span className="text-[9px] text-emerald-400 uppercase font-bold tracking-widest">{t.aiDisclaimer}</span>
        </div>
      </div>
    </div>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
