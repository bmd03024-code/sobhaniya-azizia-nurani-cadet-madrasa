import React, { useState } from 'react';
import { X, MessageCircle, Send, Phone, User, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { storage } from '../../services/storage';

interface FloatingWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloatingWhatsAppModal: React.FC<FloatingWhatsAppModalProps> = ({ isOpen, onClose }) => {
  const settings = storage.getSettings();
  const teachers = storage.getTeachers();
  const principal = teachers.find(t => t.id === 'TID-101') || teachers[0];
  
  // Format WhatsApp clean phone number (Bangladesh: 8801...)
  const rawPhone = settings.hotline || settings.phone || '+880 1816-027456';
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');
  const waNumber = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;

  const [message, setMessage] = useState<string>('আসসালামু আলাইকুম। সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা সম্পর্কে তথ্য ও সহায়তার জন্য যোগাযোগ করছি।');

  if (!isOpen) return null;

  const quickMessages = [
    'আসসালামু আলাইকুম। নূরানী ক্যাডেট মাদ্রাসায় নতুন ছাত্র/ছাত্রী ভর্তির নিয়ম ও তথ্য জানতে চাই।',
    'মাদ্রাসার বার্ষিক ও সাময়িক পরীক্ষার ফলাফল ও মার্কশিট সংক্রান্ত তথ্য প্রয়োজন।',
    'শিশু, ১ম, ২য় ও ৩য় শ্রেণির ক্লাস ও পরীক্ষার রুটিন জানতে চাই।',
    'মাদ্রাসার ভর্তি ফি (১০০০ টাকা) ও আনুষঙ্গিক বই-খাতা সংক্রান্ত তথ্য।'
  ];

  const handleOpenWhatsApp = (customText?: string) => {
    const textToSend = customText || message;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(textToSend)}`;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs select-none no-print">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 text-white p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center shadow-inner relative">
              <MessageCircle className="w-6 h-6 text-emerald-200" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-wide text-white">
                  WhatsApp সরাসরি হেল্পডেস্ক
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-400 text-emerald-950">
                  অনলাইন
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Institution Contact Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 text-amber-300 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div className="grow">
              <p className="text-xs font-bold text-slate-800">
                {principal?.name || 'মাওলানা তোফাজ্জল হোসেন'} ({principal?.designation || 'প্রধান শিক্ষক'})
              </p>
              <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>{settings.hotline || '+880 1816-027456'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>অফিসিয়াল হোয়াটসঅ্যাপ</span>
              </p>
            </div>
          </div>

          {/* Quick Questions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              দ্রুত জানতে চান এমন বিষয় নির্বাচন করুন:
            </label>
            <div className="space-y-1.5">
              {quickMessages.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOpenWhatsApp(msg)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 text-xs font-medium transition-all flex items-start gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="grow leading-relaxed">{msg}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              অথবা আপনার নিজস্ব প্রশ্ন/বার্তা লিখুন:
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 resize-none font-medium"
              placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
            />
          </div>

          {/* Teacher Contact List Quick Pick */}
          <div className="space-y-1.5 border-t border-slate-100 pt-3">
            <p className="text-xs font-bold text-slate-600">মাদ্রাসার দায়িত্বশীল শিক্ষকবৃন্দ:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {teachers.slice(0, 4).map((t) => (
                <div key={t.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-800 truncate">{t.name}</div>
                  <div className="text-emerald-700 font-semibold">{t.phone}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Send CTA */}
          <button
            type="button"
            onClick={() => handleOpenWhatsApp()}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span>সরাসরি হোয়াটসঅ্যাপে চ্যাট শুরু করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
