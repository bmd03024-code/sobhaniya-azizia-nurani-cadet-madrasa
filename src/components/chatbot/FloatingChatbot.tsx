import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Phone,
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { storage } from '../../services/storage';
import { chatbot } from '../../services/chatbot';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  sourceBadge?: string;
}

export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const settings = storage.getSettings();
  const teachers = storage.getTeachers();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: `আসসালামু আলাইকুম! সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসার অনলাইন হেল্পডেস্কে আপনাকে স্বাগতম।\n\nভর্তি নিয়মাবলী, ভর্তি ফি (১০০০ টাকা), ৪টি শ্রেণির সিলেবাস, ৭টি মৌলিক বিষয়, পরীক্ষার ফলাফল অথবা শিক্ষকবৃন্দের যোগাযোগ নম্বর জানতে আমাকে প্রশ্ন করতে পারেন।`,
      timestamp: 'এখন'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // 1. Try server-side AI chat first
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setMessages((prev) => [
            ...prev,
            {
              id: `b-${Date.now()}`,
              sender: 'bot',
              text: data.reply,
              timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
              sourceBadge: 'AI স্মার্ট হেল্পডেস্ক'
            }
          ]);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback to local chatbot
    }

    // Local Madrasah Intelligence Fallback
    try {
      const reply = await chatbot.ask(textToSend.trim());
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: reply,
          timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
          sourceBadge: 'মাদ্রাসা নলেজবেস'
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: `সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা সম্পর্কে তথ্যের জন্য অনুগ্রহ করে আমাদের হটলাইনে কল করুন: ${settings.hotline}`,
          timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickChips = [
    'ভর্তি ফি ও নিয়মাবলী',
    'মাদ্রাসার ৪টি শ্রেণি ও কারিকুলাম',
    '৭টি মৌলিক বিষয়সমূহ',
    'শিক্ষক মণ্ডলী ও যোগাযোগ',
    'রেজাল্ট ও মার্কশিট সংগ্রহ'
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="মাদ্রাসা স্মার্ট হেল্পডেস্ক"
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl border-2 border-amber-300 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group no-print"
      >
        <span className="relative flex items-center justify-center">
          {isOpen ? (
            <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <>
              <MessageCircle className="w-7 h-7 text-white" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-emerald-900 animate-ping" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-emerald-900" />
            </>
          )}
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 w-[92vw] sm:w-[410px] h-[550px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 no-print">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner">
                <Bot className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    মাদ্রাসা স্মার্ট হেল্পডেস্ক
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-emerald-950">
                    অনলাইন
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100 font-medium">
                  সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="grow overflow-y-auto p-4 space-y-3 bg-slate-50/60">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-xs whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-emerald-800 text-white rounded-br-none font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.sourceBadge && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 mb-1.5">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{m.sourceBadge}</span>
                    </div>
                  )}
                  <p>{m.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs py-2">
                <div className="w-7 h-7 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <span className="animate-pulse">উত্তর তৈরি করা হচ্ছে...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Chips */}
          <div className="p-2 bg-slate-100 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickChips.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-[11px] font-semibold text-slate-700 hover:text-emerald-900 whitespace-nowrap transition-all shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="আপনার প্রশ্ন লিখুন (যেমন: ভর্তি ফি কত?)..."
              className="grow px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-slate-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-xs transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
