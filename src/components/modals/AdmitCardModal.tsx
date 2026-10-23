import React, { useState } from 'react';
import { MadrasahClass, Student } from '../../types';
import { storage } from '../../services/storage';
import { X, Ticket, Search, Printer, AlertCircle, ShieldAlert, CheckCircle2, User } from 'lucide-react';

interface AdmitCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses?: any[]; // backwards compatibility
}

export const AdmitCardModal: React.FC<AdmitCardModalProps> = ({ isOpen, onClose }) => {
  const classes: MadrasahClass[] = storage.getClasses();
  const exams = storage.getExams();
  const settings = storage.getSettings();

  const [academicYear, setAcademicYear] = useState('2026');
  const [classId, setClassId] = useState(classes[0]?.id || 'class-shishu');
  const [examType, setExamType] = useState(exams[0]?.name || '১ম সাময়িক পরীক্ষা');
  const [roll, setRoll] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(null);

  if (!isOpen) return null;

  const currentClass = classes.find(c => c.id === classId) || classes[0];
  const examRoutines = storage.getExamRoutines().filter(r => r.classId === classId && r.examType === examType);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);

    const students = storage.getStudents();
    const match = students.find(
      s => s.roll === roll.trim() && s.classId === classId && s.academicYear === academicYear
    );
    setMatchedStudent(match || null);
  };

  const isBlocked = matchedStudent?.admitCardBlocked || (matchedStudent && !matchedStudent.hasPaidDues);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header (No-Print) */}
        <div className="no-print bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-wide text-white">
                পরীক্ষার প্রবেশপত্র (Admit Card) সংগ্রহ
              </h3>
              <p className="text-xs text-amber-200 font-medium">
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Search Form (No-Print) */}
          <form onSubmit={handleSearch} className="no-print bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  শিক্ষাবর্ষ
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="2026">২০২৬</option>
                  <option value="2025">২০২৫</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  শ্রেণি
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  পরীক্ষার নাম
                </label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                >
                  {exams.map((ex: any) => (
                    <option key={ex.id} value={ex.name}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  রোল নম্বর (Student ID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ০১, ০২, ০৩"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>প্রবেশপত্র অনুসন্ধান করুন</span>
            </button>
          </form>

          {/* Search Result */}
          {searched && (
            <div>
              {!matchedStudent ? (
                <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200 space-y-2">
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
                  <h4 className="text-base font-bold text-red-900">
                    কোনো প্রবেশপত্র খুঁজে পাওয়া যায়নি!
                  </h4>
                  <p className="text-xs text-red-700">
                    {currentClass.name}-এ রোল নম্বর "{roll}" এবং {academicYear} শিক্ষাবর্ষের কোনো সক্রিয় শিক্ষার্থী পাওয়া যায়নি। অনুগ্রহ করে সঠিক রোল নম্বর দিন।
                  </p>
                </div>
              ) : isBlocked ? (
                <div className="p-8 text-center bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-3">
                  <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto animate-pulse" />
                  <h4 className="text-lg font-black text-amber-950">
                    প্রবেশপত্র সাময়িকভাবে স্থগিত রয়েছে
                  </h4>
                  <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-amber-900 font-semibold max-w-md mx-auto">
                    {matchedStudent.blockedReason || 'বকেয়া ফি বা দাপ্তরিক তথ্যের অসঙ্গতির কারণে এই শিক্ষার্থীর প্রবেশপত্র স্থগিত রাখা হয়েছে।'}
                  </div>
                  <p className="text-xs text-slate-600">
                    জরুরি সহায়তার জন্য মাদ্রাসার অফিসে সরাসরি যোগাযোগ করুন অথবা কল করুন: <strong>{settings.hotline || '+880 1816-027456'}</strong>
                  </p>
                </div>
              ) : (
                /* Official Printable Admit Card */
                <div className="space-y-4">
                  <div className="printable-area p-6 sm:p-8 bg-white border-4 border-double border-emerald-800 rounded-2xl shadow-md relative overflow-hidden">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                      <span className="text-6xl font-black text-emerald-950 transform -rotate-12">
                        {settings.name}
                      </span>
                    </div>

                    {/* Official Card Header */}
                    <div className="text-center pb-4 border-b-2 border-emerald-800 space-y-1 relative">
                      <p className="text-[11px] font-bold text-emerald-800 tracking-wider">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </p>
                      <h2 className="text-lg sm:text-2xl font-black text-emerald-950 tracking-tight">
                        {settings.name}
                      </h2>
                      <p className="text-xs text-slate-700 font-medium">
                        {settings.address} • হটলাইন: {settings.hotline}
                      </p>
                      <div className="inline-block mt-1 px-4 py-1 bg-emerald-900 text-amber-300 font-black text-xs sm:text-sm rounded-full shadow-xs uppercase tracking-wider">
                        প্রবেশপত্র (ADMIT CARD) - {examType} ({academicYear})
                      </div>
                    </div>

                    {/* Student Info & Photo Grid */}
                    <div className="mt-4 flex flex-col-reverse sm:flex-row items-center sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-800 w-full sm:w-auto grow">
                        <div>
                          <span className="text-slate-500 font-medium">শিক্ষার্থীর নাম: </span>
                          <span className="font-bold text-slate-950">{matchedStudent.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">রোল নম্বর (ID): </span>
                          <span className="font-black text-emerald-900 text-sm">{matchedStudent.roll}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">পিতার নাম: </span>
                          <span className="font-semibold text-slate-900">{matchedStudent.fatherName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">শ্রেণি: </span>
                          <span className="font-bold text-emerald-900">{currentClass.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">মাতার নাম: </span>
                          <span className="font-semibold text-slate-900">{matchedStudent.motherName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">পরীক্ষার কেন্দ্র: </span>
                          <span className="font-semibold text-slate-900">মাদ্রাসার নিজস্ব ক্যাম্পাস</span>
                        </div>
                      </div>

                      {/* Photo Box */}
                      <div className="w-24 h-28 border-2 border-slate-300 rounded-lg p-1 bg-slate-50 shrink-0 flex flex-col items-center justify-center text-center">
                        {matchedStudent.photoUrl ? (
                          <img
                            src={matchedStudent.photoUrl}
                            alt={matchedStudent.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <User className="w-8 h-8" />
                            <span className="text-[9px] mt-1 font-bold">ছবি সংযুক্ত</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Examination Schedule / Subjects */}
                    <div className="mt-4">
                      <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                        পরীক্ষার বিষয়সূচি:
                      </h5>
                      <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-emerald-50 text-emerald-950 font-bold border-b border-slate-300 text-[11px]">
                            <tr>
                              <th className="p-2 border-r border-slate-300 text-center w-12">ক্রম</th>
                              <th className="p-2 border-r border-slate-300">বিষয়</th>
                              <th className="p-2 border-r border-slate-300 text-center">তারিখ ও বার</th>
                              <th className="p-2 text-center">সময়</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-[11px]">
                            {examRoutines.length > 0 ? (
                              examRoutines.map((ex, i) => (
                                <tr key={ex.id}>
                                  <td className="p-1.5 text-center border-r border-slate-200 font-bold">{i + 1}</td>
                                  <td className="p-1.5 font-bold text-slate-900 border-r border-slate-200">{ex.subjectName}</td>
                                  <td className="p-1.5 text-center border-r border-slate-200">{ex.date} ({ex.day})</td>
                                  <td className="p-1.5 text-center font-mono">{ex.time}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="p-2 text-center text-slate-500 italic">
                                  পরীক্ষার বিস্তারিত সময়সূচি মাদ্রাসার নোটিশ বোর্ডে নিয়মিত প্রকাশিত হয়।
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Rules & Guidelines */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-700 space-y-1">
                      <p className="font-bold text-slate-900">পরীক্ষার্থীদের প্রতি জরুরি নির্দেশাবলী:</p>
                      <p>১. পরীক্ষা শুরুর ১৫ মিনিট পূর্বে পরীক্ষা কক্ষে নিজ নিজ আসনে উপস্থিত হতে হবে।</p>
                      <p>২. প্রবেশপত্র ছাড়া কোনো অবস্থাতেই পরীক্ষা কক্ষে প্রবেশ করতে দেওয়া হবে না।</p>
                      <p>৩. পরীক্ষার প্রয়োজনীয় কলম, পেন্সিল, সিলেট ও অন্যান্য সামগ্রী সাথে আনতে হবে।</p>
                    </div>

                    {/* Official Signatures */}
                    <div className="mt-8 pt-4 flex items-end justify-between text-center text-xs">
                      <div>
                        <div className="h-10 flex items-end justify-center">
                          <span className="text-slate-400 font-serif italic text-xs">Verified</span>
                        </div>
                        <div className="w-32 border-t border-slate-800 pt-1 font-bold text-slate-800">
                          শ্রেণি শিক্ষক
                        </div>
                      </div>

                      <div className="text-center">
                        {settings.institutionSealUrl && (
                          <img
                            src={settings.institutionSealUrl}
                            alt="Seal"
                            className="w-14 h-14 object-contain mx-auto opacity-80"
                          />
                        )}
                        <span className="text-[10px] text-slate-400 block">মাদ্রাসার সিলমোহর</span>
                      </div>

                      <div>
                        <div className="h-10 flex items-end justify-center">
                          {settings.signatureUrl ? (
                            <img
                              src={settings.signatureUrl}
                              alt="Signature"
                              className="max-h-8 object-contain"
                            />
                          ) : (
                            <span className="text-emerald-900 font-serif italic font-bold">তোফাজ্জল</span>
                          )}
                        </div>
                        <div className="w-36 border-t border-slate-800 pt-1 font-bold text-slate-800">
                          মাওলানা তোফাজ্জল হোসেন
                          <span className="block text-[10px] text-slate-500 font-normal">প্রধান শিক্ষক</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Print Button (No-Print) */}
                  <div className="no-print flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => window.print()}
                      className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <Printer className="w-4 h-4 text-amber-300" />
                      <span>প্রবেশপত্র প্রিন্ট বা ডাউনলোড করুন (PDF)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
