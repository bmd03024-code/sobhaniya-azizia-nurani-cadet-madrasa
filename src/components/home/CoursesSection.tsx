import React, { useState } from 'react';
import { MadrasahClass, MadrasahSubject, InstituteSettings } from '../../types';
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles, BookOpen, Layers, GraduationCap, AlertCircle } from 'lucide-react';

import { storage } from '../../services/storage';

export interface CoursesSectionProps {
  classes?: MadrasahClass[];
  subjects?: MadrasahSubject[];
  settings?: InstituteSettings;
  onApplyAdmission?: (targetClass?: string) => void;
  onEnrollClass?: (targetClass: string) => void;
  courses?: any; // backward compatibility
  onEnrollCourse?: any; // backward compatibility
}

// Convert English numbers to Bengali numerals
export const toBengaliNum = (num: number | string): string => {
  const bnNums: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return String(num).replace(/[0-9]/g, (match) => bnNums[match] || match);
};

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  classes: propClasses,
  subjects: propSubjects,
  settings: propSettings,
  onApplyAdmission,
  onEnrollClass
}) => {
  const classes = propClasses || storage.getClasses();
  const subjects = propSubjects || storage.getSubjects();
  const settings = propSettings || storage.getSettings();

  const handleEnroll = (targetClass: string) => {
    if (onEnrollClass) onEnrollClass(targetClass);
    else if (onApplyAdmission) onApplyAdmission(targetClass);
  };

  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || 'class-shishu');
  const activeClassObj = classes.find(c => c.id === selectedClass) || classes[0];

  return (
    <section id="courses-section" className="py-12 sm:py-16 bg-slate-50 border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10 flex flex-col items-center">
          {settings?.logoUrl && (
            <img
              src={settings.logoUrl}
              alt="মাদ্রাসার লোগো"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto mb-3 drop-shadow-md"
            />
          )}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>শিক্ষাক্রম, শ্রেণি ও পরীক্ষার বিষয়সমূহ (Curriculum)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-950">
            আমাদের শ্রেণিসমূহ ও ৭টি মূল বিষয়
          </h2>
          <p className="text-sm text-slate-600 mt-1.5">
            শিশু শ্রেণি থেকে ৩য় শ্রেণি পর্যন্ত নূরানী ও আধুনিক ক্যাডেট পাঠ্যক্রমের সমন্বয়
          </p>
        </div>

        {/* Admission Fee & Official Policy Alert Banner */}
        <div className="mb-10 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-amber-400/40 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-center md:text-left">
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="মাদ্রাসার লোগো"
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0 hidden sm:block p-1 bg-white/10 rounded-2xl border border-white/20"
              />
            ) : (
              <div className="p-3 bg-amber-400/20 rounded-2xl text-amber-300 shrink-0 hidden sm:block border border-amber-400/30">
                <GraduationCap className="w-8 h-8" />
              </div>
            )}
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black tracking-wide mb-1">
                ভর্তি ফি: {toBengaliNum(settings?.admissionFee || 1000)} টাকা
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                ২০২৬ শিক্ষাবর্ষে নতুন শিক্ষার্থী ভর্তি নির্দেশিকা
              </h3>
              <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-2xl">
                ⚠️ <b className="text-amber-300">বিশেষ বিজ্ঞপ্তি:</b> {settings?.admissionNotice || 'ভর্তি ফি ১০০০ টাকা অবশ্যই সরাসরি মাদ্রাসায় এসে অফিসে জমা দিতে হবে। বই, খাতা, চক ও সিলেট আলাদা করে কিনতে হবে।'}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleEnroll(activeClassObj?.name || 'শিশু শ্রেণি')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <span>ভর্তি ফরম পূরণ করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Class Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                selectedClass === cls.id
                  ? 'bg-emerald-800 text-white shadow-md ring-2 ring-emerald-600'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{cls.name}</span>
            </button>
          ))}
        </div>

        {/* 7 Core Exam Subjects Grid for the Selected Class */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-black text-emerald-950 flex items-center gap-2">
                <span>{activeClassObj?.name}-এর নির্ধারিত ৭টি বিষয় ও নম্বর বণ্টন</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  পরীক্ষার বিষয়
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                প্রতিটি বিষয়ে ১০০ নম্বরের লিখিত ও মৌখিক মূল্যায়ন অনুষ্ঠিত হয় (পাস নম্বর: ৪০)
              </p>
            </div>
            <div className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              মোট নম্বর: ৭০০
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subj, idx) => (
              <div
                key={subj.id}
                className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-300 transition-all flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                  {toBengaliNum(idx + 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900">
                    {subj.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                      কোড: {subj.code}
                    </span>
                    <span className="text-emerald-800 font-semibold">
                      পূর্ণমান: {toBengaliNum(subj.totalMarks || 100)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>নূরানী বোর্ড ও ক্যাডেট মানদণ্ডে পাঠদান পরিচালনা করা হয়</span>
            </div>

            <button
              onClick={() => handleEnroll(activeClassObj?.name || 'শিশু শ্রেণি')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>{activeClassObj?.name}-এ ভর্তির আবেদন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
