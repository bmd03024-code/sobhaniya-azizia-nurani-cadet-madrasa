import React, { useState } from 'react';
import { MadrasahClass, ExamTypeItem, ClassRoutineItem, ExamRoutineItem } from '../../types';
import { storage } from '../../services/storage';
import { X, Calendar, Printer, Clock, BookOpen, Layers } from 'lucide-react';
import { toBengaliNum } from '../home/CoursesSection';

interface RoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes?: MadrasahClass[];
  initialTab?: 'class' | 'exam';
}

export const RoutineModal: React.FC<RoutineModalProps> = ({
  isOpen,
  onClose,
  classes = storage.getClasses(),
  initialTab = 'class'
}) => {
  const [activeTab, setActiveTab] = useState<'class' | 'exam'>(initialTab);
  const [selectedClassId, setSelectedClassId] = useState(classes[1]?.id || classes[0]?.id || 'class-1');
  const [selectedExamType, setSelectedExamType] = useState('১ম সাময়িক');

  if (!isOpen) return null;

  const settings = storage.getSettings();
  const examTypes = storage.getExamTypes();
  const classRoutines = storage.getClassRoutines();
  const examRoutines = storage.getExamRoutines();

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];

  const filteredClassRoutines = classRoutines.filter(
    r => r.classId === selectedClassId || r.className === selectedClass?.name
  );

  const filteredExamRoutines = examRoutines.filter(
    r => (r.examType.includes(selectedExamType) || selectedExamType.includes(r.examType)) &&
         (r.classId === selectedClassId || r.className === selectedClass?.name)
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-emerald-900/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="no-print bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>অফিশিয়াল রুটিন ও সময়সূচি</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            ক্লাস ও পরীক্ষার সময়সূচি পোর্টাল
          </h2>
          <p className="text-xs text-emerald-200">
            {settings.name} • উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম
          </p>

          {/* Tab Selector */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('class')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'class'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              ক্লাস রুটিন (Class Routine)
            </button>
            <button
              onClick={() => setActiveTab('exam')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'exam'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              পরীক্ষার রুটিন (Exam Routine)
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="no-print p-4 sm:p-5 bg-emerald-50/50 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি নির্বাচন:</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {activeTab === 'exam' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পরীক্ষার ধরন:</label>
                <select
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  {examTypes.map((ex) => (
                    <option key={ex.id} value={ex.name}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>রুটিন প্রিন্ট করুন</span>
          </button>
        </div>

        {/* Printable Routine Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <div className="printable-area p-6 bg-white border-2 border-emerald-900/60 rounded-2xl text-slate-900 space-y-5">
            {/* Header */}
            <div className="text-center border-b-2 border-emerald-900/80 pb-3">
              <div className="font-arabic text-base text-emerald-800 font-bold mb-0.5">﷽</div>
              <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
                {settings.name}
              </h1>
              <p className="text-xs text-slate-600">
                উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম | মোবাইল: {settings.phone}
              </p>
              <div className="inline-block mt-2 px-4 py-1 bg-emerald-800 text-white rounded-full font-bold text-xs shadow-xs">
                {activeTab === 'class' ? `${selectedClass?.name}-এর অফিসিয়াল সাপ্তাহিক ক্লাস রুটিন` : `${selectedClass?.name}-এর ${selectedExamType} পরীক্ষার সময়সূচি`}
              </div>
            </div>

            {/* CLASS ROUTINE TABLE */}
            {activeTab === 'class' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-emerald-900 text-white font-bold">
                    <tr>
                      <th className="p-2.5 border border-slate-300">বার / দিন</th>
                      <th className="p-2.5 border border-slate-300">পিরিয়ড</th>
                      <th className="p-2.5 border border-slate-300">সময়</th>
                      <th className="p-2.5 border border-slate-300">পাঠ্য বিষয়</th>
                      <th className="p-2.5 border border-slate-300">শিক্ষক</th>
                      <th className="p-2.5 border border-slate-300">কক্ষ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClassRoutines.length > 0 ? (
                      filteredClassRoutines.map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2.5 border border-slate-300 font-bold text-slate-900">{item.day}</td>
                          <td className="p-2.5 border border-slate-300 font-semibold text-emerald-800">{item.period}</td>
                          <td className="p-2.5 border border-slate-300 text-slate-600 font-mono">{item.time}</td>
                          <td className="p-2.5 border border-slate-300 font-bold text-slate-900">{item.subjectName}</td>
                          <td className="p-2.5 border border-slate-300 font-medium text-slate-700">{item.teacherName}</td>
                          <td className="p-2.5 border border-slate-300 text-slate-600">{item.roomNo || 'কক্ষ ১০১'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-500 font-medium">
                          এই শ্রেণির জন্য এখনো কোনো ক্লাস রুটিন এন্ট্রি করা হয়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* EXAM ROUTINE TABLE */}
            {activeTab === 'exam' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-300">
                  <thead className="bg-emerald-900 text-white font-bold">
                    <tr>
                      <th className="p-2.5 border border-slate-300 text-center w-12">ক্র:</th>
                      <th className="p-2.5 border border-slate-300">তারিখ</th>
                      <th className="p-2.5 border border-slate-300">বার</th>
                      <th className="p-2.5 border border-slate-300">সময়</th>
                      <th className="p-2.5 border border-slate-300">বিষয়</th>
                      <th className="p-2.5 border border-slate-300">পরীক্ষার হল</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExamRoutines.length > 0 ? (
                      filteredExamRoutines.map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2.5 border border-slate-300 text-center font-bold text-slate-600">{toBengaliNum(idx + 1)}</td>
                          <td className="p-2.5 border border-slate-300 font-bold font-mono text-emerald-900">{item.date}</td>
                          <td className="p-2.5 border border-slate-300 font-semibold text-slate-800">{item.day}</td>
                          <td className="p-2.5 border border-slate-300 text-slate-600">{item.time}</td>
                          <td className="p-2.5 border border-slate-300 font-bold text-slate-900">{item.subjectName}</td>
                          <td className="p-2.5 border border-slate-300 text-slate-600">{item.roomNo || 'হলরুম-১'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-500 font-medium">
                          এই পরীক্ষার জন্য এখনো কোনো রুটিন এন্ট্রি করা হয়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Rules Note */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950">
              <b>জরুরি নির্দেশনা:</b> {settings.pageNotes?.routine || 'সকল শিক্ষার্থীকে নির্ধারিত সময়ের ১০ মিনিট পূর্বে মাদ্রাসার পোশাক ও টুপি পরিধান করে উপস্থিত হতে হবে।'}
            </div>

            {/* Signatures */}
            <div className="pt-8 flex justify-between items-end text-xs text-slate-600 border-t border-slate-200">
              <div className="text-center">
                <div className="w-32 border-b border-slate-400 mb-1" />
                <span>পরীক্ষা নিয়ন্ত্রক</span>
              </div>
              <div className="text-center">
                <img src={settings.institutionSealUrl} alt="সিল" className="h-12 w-12 mx-auto object-contain mb-1" />
                <span className="text-[10px] text-slate-500 font-bold">মাদ্রাসার অফিশিয়াল সিল</span>
              </div>
              <div className="text-center">
                <img src={settings.signatureUrl} alt="স্বাক্ষর" className="h-9 mx-auto object-contain mb-0.5" />
                <div className="w-36 border-b border-slate-400 mb-1" />
                <span className="font-bold text-emerald-950">মাওলানা তোফাজ্জল হোসেন</span>
                <div className="text-[10px] text-slate-500">প্রধান শিক্ষক</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
