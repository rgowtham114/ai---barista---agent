import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Bot, User, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { MenuItemCard } from './MenuItemCard';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
  onResetChat: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onResetChat,
  onSelectPrompt,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '🥛 What dairy-free pastries do you have?',
    '🧊 Recommend a strong cold drink',
    '🥐 What sweet breakfast options exist?',
    '🎃 Does the Pumpkin Latte contain dairy?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FDFBF7]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#EBE3D5] bg-white/80 backdrop-blur-xs flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#8B5E3C] flex items-center justify-center text-white shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#3D2C1E]">AI Barista</h1>
            <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              • Ready to take your order
            </p>
          </div>
        </div>

        <button
          onClick={onResetChat}
          className="text-xs text-[#8C7A6B] hover:text-[#3D2C1E] px-3 py-1.5 rounded-lg border border-[#E3D9CC] hover:bg-[#F5EFE6] transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Reset chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Order</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs ${
                msg.role === 'user' ? 'bg-[#3D2C1E]' : 'bg-[#8B5E3C] shadow-xs'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-2 max-w-[85%] sm:max-w-[75%]">
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#3D2C1E] text-white rounded-tr-none'
                    : 'bg-white border border-[#EBE3D5] text-[#2C221E] shadow-2xs rounded-tl-none'
                }`}
              >
                {/* Format paragraphs & bold text */}
                <div className="whitespace-pre-wrap space-y-1">
                  {msg.content.split('\n').map((line, idx) => {
                    if (!line) return <br key={idx} />;
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={idx}>
                        {parts.map((part, pIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={pIdx} className="font-semibold text-[#8B5E3C]">
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Suggested items cards under barista reply */}
              {msg.suggestedItems && msg.suggestedItems.length > 0 && (
                <div className="pt-1">
                  <p className="text-[11px] font-semibold text-[#8C7A6B] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#8B5E3C]" /> Suggested Menu Items:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {msg.suggestedItems.map((item) => (
                      <MenuItemCard
                        key={item.name}
                        item={item}
                        compact
                        onSelectPrompt={onSelectPrompt}
                      />
                    ))}
                  </div>
                </div>
              )}

              <span className="text-[10px] text-[#A09083] block px-1">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-full bg-[#8B5E3C] flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-[#EBE3D5] rounded-2xl rounded-tl-none px-4 py-3 text-sm text-[#7A6B60] flex items-center gap-2 shadow-2xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#8B5E3C]" />
              <span>Barista is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-[#EBE3D5] bg-[#F5EFE6]/50">
        <p className="text-[11px] text-[#8C7A6B] font-medium mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#8B5E3C]" /> Quick suggestions:
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSendMessage(prompt.replace(/^[^\w\s]+/, '').trim())}
              className="text-xs bg-white text-[#52443A] hover:text-[#8B5E3C] hover:bg-[#FDFBF7] border border-[#E3D9CC] rounded-full px-3 py-1 whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-[#EBE3D5]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI Barista for recommendations..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 bg-[#FBF8F3] border border-[#E5D7C5] rounded-xl text-sm text-[#2C221E] placeholder-[#A09083] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-[#8B5E3C] text-white rounded-lg hover:bg-[#6F4E37] disabled:opacity-40 disabled:hover:bg-[#8B5E3C] transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
