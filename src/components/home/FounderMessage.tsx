import React, { useState } from 'react';
import { InstituteSettings } from '../../types';
import { Award, Quote, CheckCircle2, ShieldCheck, HeartHandshake, BookOpen } from 'lucide-react';

interface FounderMessageProps {
  settings: InstituteSettings;
  onExploreCourses: () => void;
}

export const FounderMessage: React.FC<FounderMessageProps> = ({ settings, onExploreCourses }) => {
  const [activeTab, setActiveTab] = useState<'founder' | 'principal'>('founder');

  return (
    <section id="founder-section" className="py-12 sm:py-16 bg-gradient-to-b from-white to-emerald-50/40 border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-950">
            প্রতিষ্ঠাতা ও সভাপতির বাণী
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            দ্বীনি ও আধুনিক ক্যাডেট শিক্ষার প্রসারে সুযোগ্য নেতৃত্ব এবং দিকনির্দেশনামূলক বার্তা
          </p>

          {/* Toggle Tab */}
          <div className="flex justify-center mt-5 gap-2">
            <button
              onClick={() => setActiveTab('founder')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'founder'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
              }`}
            >
              প্রতিষ্ঠাতা ও সভাপতির বাণী
            </button>
            <button
              onClick={() => setActiveTab('principal')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'principal'
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
              }`}
            >
              প্রধান শিক্ষক ও অধ্যক্ষের বক্তব্য
            </button>
          </div>
        </div>

        {/* Card Content based on Active Tab */}
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl text-white shadow-xl overflow-hidden border border-emerald-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
            {/* Left Photo & Badges */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600 opacity-75 blur-sm group-hover:opacity-100 transition duration-300" />
                
                <div className="relative w-56 sm:w-64 md:w-72 aspect-4/5 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl bg-emerald-900">
                  <img
                    src={activeTab === 'founder' ? settings.founderPhotoUrl : (settings.principalPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80')}
                    alt={activeTab === 'founder' ? settings.founderName : (settings.principalName || 'প্রধান শিক্ষক')}
                    className="w-full h-full object-cover object-top filter brightness-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 inset-x-3 text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold tracking-wide shadow-md">
                      {activeTab === 'founder' ? settings.founderTitle : (settings.principalTitle || 'প্রধান শিক্ষক')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-xl sm:text-2xl font-extrabold text-amber-300 tracking-wide">
                  {activeTab === 'founder' ? settings.founderName : (settings.principalName || 'মাওলানা তোফাজ্জল হোসেন')}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-200 font-medium mt-0.5">
                  {activeTab === 'founder' ? settings.founderTitle : (settings.principalTitle || 'প্রধান শিক্ষক')}
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-amber-300/90 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা পরিচালনা পরিষদ</span>
                </div>
              </div>
            </div>

            {/* Right Speech, Commitments, Signature & Stamp */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">
                <Quote className="w-3.5 h-3.5 text-amber-300" />
                <span>{activeTab === 'founder' ? 'প্রতিষ্ঠাতা ও সভাপতির দিকনির্দেশনা' : 'প্রধান শিক্ষকের অফিসিয়াল বার্তা'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-arabic">
                {activeTab === 'founder' ? '“পবিত্র কুরআন ও হাদিসের আলোয় আলোকিত হোক ভবিষ্যৎ প্রজন্ম”' : '“সুশৃঙ্খল দ্বীনি ও ক্যাডেট শিক্ষা আমাদের মূল অঙ্গীকার”'}
              </h2>

              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal text-justify">
                {activeTab === 'founder' ? settings.founderSpeech : (settings.principalSpeech || 'সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসার সুশৃঙ্খল পাঠদান ব্যবস্থা ও স্নেহশীল পরিবেশ কোমলমতি শিক্ষার্থীদের মেধা ও মনন বিকাশে এক অনন্য ভূমিকা পালন করছে।')}
              </p>

              {/* Core Commitments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm text-emerald-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>সহীহ মাখরাজ ও তাজবীদ শিক্ষা</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ক্যাডেট মানের গণিত ও ইংরেজি পাঠ্যক্রম</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>মাসআলা, সালাত ও চরিত্র গঠন</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ডিজিটাল ফলাফল ও রেজাল্ট ট্র্যাকিং</span>
                </div>
              </div>

              {/* Official Seal and Signatures */}
              <div className="pt-4 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white/95 p-1.5 rounded-lg border border-amber-300 shadow-xs">
                    <img
                      src={settings.signatureUrl}
                      alt="স্বাক্ষর"
                      className="h-10 sm:h-12 w-auto object-contain"
                    />
                    <div className="text-[9px] text-emerald-950 text-center font-bold">প্রধান শিক্ষক কর্তৃক স্বাক্ষরিত</div>
                  </div>

                  <div className="bg-white/95 p-1 rounded-full border border-amber-400/80 shadow-xs">
                    <img
                      src={settings.institutionSealUrl}
                      alt="সিলমোহর"
                      className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
                    />
                  </div>
                </div>

                <button
                  onClick={onExploreCourses}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-md inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>শ্রেণি ও বিষয়সমূহ দেখুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
