import React, { useState, useMemo } from 'react';
import { ResultRecord, MadrasahClass, ExamTypeItem } from '../../types';
import { storage } from '../../services/storage';
import {
  X,
  Search,
  Printer,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { toBengaliNum } from '../home/CoursesSection';

interface MarksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes?: MadrasahClass[];
}

const toEnglishNum = (str: string): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return (str || '').replace(/[০-৯]/g, d => String(banglaDigits.indexOf(d))).trim();
};

export const MarksheetModal: React.FC<MarksheetModalProps> = ({ isOpen, onClose, classes = storage.getClasses() }) => {
  const settings = storage.getSettings();
  const examTypes = storage.getExamTypes();

  // Filters
  const [academicYear, setAcademicYear] = useState('2026');
  const [classId, setClassId] = useState(classes[1]?.id || classes[0]?.id || 'class-1');
  const [examType, setExamType] = useState(examTypes[0]?.name || '১ম সাময়িক');
  const [rollInput, setRollInput] = useState('01');

  // Search States
  const [foundResult, setFoundResult] = useState<ResultRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setErrorMsg('');
    setFoundResult(null);

    const cleanRoll = toEnglishNum(rollInput).padStart(2, '0');
    const allResults = storage.getResults();

    const matched = allResults.find(r => {
      const matchYear = r.academicYear === academicYear;
      const matchClass = r.classId === classId || r.className === classes.find(c => c.id === classId)?.name;
      const matchExam = r.examType.includes(examType) || examType.includes(r.examType);
      const matchRoll = toEnglishNum(r.roll) === cleanRoll || toEnglishNum(r.roll) === toEnglishNum(rollInput);
      return matchYear && matchClass && matchExam && matchRoll;
    });

    if (matched) {
      if (!matched.published) {
        setErrorMsg('এই পরীক্ষার ফলাফল প্রক্রিয়াধীন রয়েছে, এখনো অফিশিয়ালি প্রকাশিত হয়নি।');
      } else {
        setFoundResult(matched);
      }
    } else {
      setErrorMsg(`রোল ${rollInput}-এর জন্য কোনো ফলাফল পাওয়া যায়নি। শ্রেণি, পরীক্ষার ধরন ও রোল নম্বর সঠিক কিনা যাচাই করুন।`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-emerald-900/20 flex flex-col my-auto animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-amber-500/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-slate-950 rounded-2xl shrink-0 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                অনলাইন রেজাল্ট ও অফিশিয়াল মার্কশিট পোর্টাল
              </h2>
              <p className="text-xs text-emerald-200">
                {settings.name} • উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম
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
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          
          {/* Search Filter Form */}
          <form onSubmit={handleSearch} className="bg-emerald-50/60 p-4 sm:p-5 rounded-2xl border border-emerald-200 space-y-4 no-print">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>ফলাফল অনুসন্ধান ফিল্টার (রোল-ই স্টুডেন্ট আইডি)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Year */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাবর্ষ</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  <option value="2026">২০২৬</option>
                  <option value="2025">২০২৫</option>
                </select>
              </div>

              {/* Class */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পরীক্ষার ধরন</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  {examTypes.map((ex) => (
                    <option key={ex.id} value={ex.name}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Roll */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">রোল / স্টুডেন্ট আইডি</label>
                <input
                  type="text"
                  value={rollInput}
                  onChange={(e) => setRollInput(e.target.value)}
                  placeholder="যেমন: 01"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold font-mono bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>ফলাফল দেখুন</span>
              </button>
            </div>
          </form>

          {/* Error / Not Found Alert */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs sm:text-sm no-print">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">দুঃখিত, ফলাফল পাওয়া যায়নি</div>
                <div>{errorMsg}</div>
              </div>
            </div>
          )}

          {/* Official Printable Marksheet */}
          {foundResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between no-print bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>অফিশিয়াল একাডেমিক মার্কশিট জেনারেট সম্পন্ন হয়েছে!</span>
                </span>
                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট / ডাউনলোড</span>
                </button>
              </div>

              {/* The Single-Page Printable Marksheet Area */}
              <div className="printable-area marksheet-border p-6 sm:p-8 bg-white text-slate-900 shadow-md rounded-2xl relative space-y-5">
                {/* Header */}
                <div className="text-center border-b-2 border-emerald-900/60 pb-4">
                  <div className="font-arabic text-lg text-emerald-800 font-bold mb-0.5">﷽</div>
                  <h1 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
                    {settings.name}
                  </h1>
                  <p className="text-xs font-medium text-slate-600">
                    উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম | মোবাইল: {settings.phone}
                  </p>
                  <div className="inline-block mt-2 px-4 py-1 bg-gradient-to-r from-emerald-800 to-teal-900 text-white font-bold text-xs rounded-full shadow-xs">
                    একাডেমিক মূল্যায়ন ও অফিশিয়াল নম্বরপত্র (Official Marksheet)
                  </div>
                </div>

                {/* Student Info Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200">
                  <div>
                    <span className="text-slate-500">শিক্ষার্থীর নাম:</span>
                    <div className="font-bold text-emerald-950 text-sm">{foundResult.studentName}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">রোল (স্টুডেন্ট আইডি):</span>
                    <div className="font-bold font-mono text-emerald-950 text-sm">
                      {foundResult.roll}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">শ্রেণি:</span>
                    <div className="font-bold text-slate-800 text-sm">{foundResult.className}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">পরীক্ষার নাম:</span>
                    <div className="font-bold text-slate-800 text-sm">{foundResult.examType} ({foundResult.academicYear})</div>
                  </div>
                  <div>
                    <span className="text-slate-500">পিতার নাম:</span>
                    <div className="font-semibold text-slate-800">{foundResult.fatherName || 'মাওলানা মো: কামরুল হাসান'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">মাতার নাম:</span>
                    <div className="font-semibold text-slate-800">{foundResult.motherName || 'রোকেয়া বেগম'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">বর্তমান রোল (Smart Rank):</span>
                    <div className="font-black text-amber-700 text-sm">
                      {toBengaliNum(foundResult.rank)}তম স্থান
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">ফলাফল গ্রেড ও জিপিএ:</span>
                    <div className="font-black text-emerald-800 text-sm">
                      জিপিএ: {foundResult.gpa.toFixed(2)} ({foundResult.grade})
                    </div>
                  </div>
                </div>

                {/* 7 Subjects Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-300">
                    <thead className="bg-emerald-900 text-white font-bold text-[11px] sm:text-xs">
                      <tr>
                        <th className="p-2 border border-slate-300 text-center w-10">ক্র:</th>
                        <th className="p-2 border border-slate-300">পাঠ্য বিষয়সমূহ</th>
                        <th className="p-2 border border-slate-300 text-center w-20">পূর্ণমান</th>
                        <th className="p-2 border border-slate-300 text-center w-24">প্রাপ্ত নম্বর</th>
                        <th className="p-2 border border-slate-300 text-center w-20">লেটার গ্রেড</th>
                        <th className="p-2 border border-slate-300 text-center w-16">জিপিএ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foundResult.marks.map((m, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2 border border-slate-300 text-center font-bold text-slate-600">
                            {toBengaliNum(idx + 1)}
                          </td>
                          <td className="p-2 border border-slate-300 font-bold text-slate-900">
                            {m.subjectName}
                          </td>
                          <td className="p-2 border border-slate-300 text-center text-slate-600">
                            {toBengaliNum(m.total || 100)}
                          </td>
                          <td className="p-2 border border-slate-300 text-center font-bold text-emerald-900">
                            {toBengaliNum(m.obtained)}
                          </td>
                          <td className="p-2 border border-slate-300 text-center font-bold">
                            <span className={m.obtained >= 80 ? 'text-emerald-700' : m.obtained >= 60 ? 'text-blue-700' : 'text-amber-700'}>
                              {m.grade}
                            </span>
                          </td>
                          <td className="p-2 border border-slate-300 text-center font-mono font-bold text-slate-800">
                            {m.gpa.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      {/* Summary Row */}
                      <tr className="bg-emerald-100/70 font-black text-slate-900 border-t-2 border-emerald-900">
                        <td colSpan={2} className="p-2.5 border border-slate-300 text-right pr-4 text-xs font-bold">
                          সর্বমোট অর্জিত নম্বর ও চূড়ান্ত মূল্যায়ন:
                        </td>
                        <td className="p-2.5 border border-slate-300 text-center">৭০০</td>
                        <td className="p-2.5 border border-slate-300 text-center text-emerald-950 font-black text-sm">
                          {toBengaliNum(foundResult.totalMarks)}
                        </td>
                        <td className="p-2.5 border border-slate-300 text-center text-emerald-800 font-black">
                          {foundResult.grade}
                        </td>
                        <td className="p-2.5 border border-slate-300 text-center font-mono font-black text-emerald-900">
                          {foundResult.gpa.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Auto Remarks Box */}
                <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-300 text-xs">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>প্রধান শিক্ষকের অটো মূল্যায়ন ও মন্তব্য (Auto Remarks):</span>
                  </div>
                  <p className="text-slate-800 font-semibold italic leading-relaxed">
                    "{foundResult.autoRemarks}"
                  </p>
                </div>

                {/* Signatures & Seal */}
                <div className="pt-6 flex justify-between items-end text-xs text-slate-600 border-t border-slate-200">
                  <div className="text-center">
                    <div className="w-32 border-b border-slate-400 mb-1" />
                    <span>শ্রেণি শিক্ষকের স্বাক্ষর</span>
                  </div>

                  <div className="text-center">
                    <img
                      src={settings.institutionSealUrl}
                      alt="সিলমোহর"
                      className="h-14 w-14 mx-auto object-contain mb-1"
                    />
                    <span className="text-[10px] text-slate-500 font-bold">অফিশিয়াল সিলমোহর</span>
                  </div>

                  <div className="text-center">
                    <img
                      src={settings.signatureUrl}
                      alt="স্বাক্ষর"
                      className="h-9 mx-auto object-contain mb-0.5"
                    />
                    <div className="w-36 border-b border-slate-400 mb-1" />
                    <span className="font-bold text-emerald-950">মাওলানা তোফাজ্জল হোসেন</span>
                    <div className="text-[10px] text-slate-500">প্রধান শিক্ষক</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
