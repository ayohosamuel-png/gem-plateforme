import React, { useState } from 'react';
import { aiService } from '../../services/ai';
import { Bot, Send, User, Sparkles, BookOpen, FileCode, CheckCircle2 } from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Bonjour ! Je suis votre Assistant Académique. Comment puis-je vous aider aujourd\'hui dans la rédaction de votre mémoire ? (Plan de rédaction, problématique, normes APA, revue de littérature)'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const reply = await aiService.askAssistant(userText);
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Désolé, une erreur est survenue lors de la communication avec Gemini.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white font-serif">Copilote Académique IA</h1>
        <p className="text-xs text-slate-400">
          Entraîné sur la méthodologie de rédaction universitaire en Afrique de l'Ouest
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[550px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-amber-400">
              <Bot className="w-4 h-4 animate-bounce" />
              <span>L'assistant réfléchit à votre question...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950 flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question académique..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center space-x-1 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
