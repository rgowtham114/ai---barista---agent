import { useState, useEffect } from 'react';
import { MenuItem, ChatMessage } from './types';
import { MenuSidebar } from './components/MenuSidebar';
import { ChatInterface } from './components/ChatInterface';
import { Coffee, Menu, X } from 'lucide-react';

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to ☕ Coffee Shop! What can I get started for you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);
        setIsLoadingMenu(false);
      })
      .catch((err) => {
        console.error('Failed to load menu:', err);
        setIsLoadingMenu(false);
      });
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingChat(true);

    try {
      const historyForApi = messages.map((m) => ({
        role: m.role,
        text: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: historyForApi }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || "Sorry, I couldn't generate a response. Please try again!",
        suggestedItems: data.suggestedItems || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Apologies, I ran into an issue processing your order request. Please check back in a moment!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Welcome back! What would you like to explore on our menu today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FDFBF7]">
      {/* Mobile Top Bar */}
      <header className="lg:hidden bg-[#8B5E3C] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Coffee className="w-6 h-6" />
          <span className="font-serif font-bold text-lg">Coffee Shop</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-20 backdrop-blur-xs"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`lg:static fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <MenuSidebar
            items={menuItems}
            onSelectPrompt={(prompt) => {
              handleSendMessage(prompt);
              setIsSidebarOpen(false);
            }}
            isLoadingMenu={isLoadingMenu}
          />
        </div>

        {/* Main Chat Interface */}
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoadingChat}
          onResetChat={handleResetChat}
          onSelectPrompt={(prompt) => handleSendMessage(prompt)}
        />
      </div>
    </div>
  );
}
