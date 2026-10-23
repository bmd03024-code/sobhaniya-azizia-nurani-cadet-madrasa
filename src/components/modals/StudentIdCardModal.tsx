import React, { useState } from 'react';
import { Student, Teacher, MadrasahClass } from '../../types';
import { storage } from '../../services/storage';
import { X, Search, Printer, AlertCircle, ShieldCheck, Sparkles, GraduationCap, Users } from 'lucide-react';
import { toBengaliNum } from '../home/CoursesSection';

interface StudentIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes?: MadrasahClass[];
  initialStudent?: Student | null;
  initialTeacher?: Teacher | null;
  initialMode?: 'student' | 'teacher';
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
  isOpen,
  onClose,
  classes = storage.getClasses(),
  initialStudent,
  initialTeacher,
  initialMode = 'student'
}) => {
  const settings = storage.getSettings();
  const teachers = storage.getTeachers();
  const students = storage.getStudents();

  const [mode, setMode] = useState<'student' | 'teacher'>(initialMode);

  // Student Search
  const [classId, setClassId] = useState(classes[1]?.id || classes[0]?.id || 'class-1');
  const [studentRoll, setStudentRoll] = useState(initialStudent?.roll || '01');
  const [foundStudent, setFoundStudent] = useState<Student | null>(initialStudent || students[0] || null);

  // Teacher Search
  const [teacherId, setTeacherId] = useState(initialTeacher?.id || teachers[0]?.id || 'TID-101');
  const [foundTeacher, setFoundTeacher] = useState<Teacher | null>(initialTeacher || teachers[0] || null);

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleStudentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanRoll = studentRoll.trim().padStart(2, '0');
    const match = students.find(
      s => (s.classId === classId || s.className === classes.find(c => c.id === classId)?.name) &&
           (s.roll.trim() === cleanRoll || s.roll.trim() === studentRoll.trim())
    );

    if (match) {
      setFoundStudent(match);
    } else {
      setErrorMsg(`রোল ${studentRoll}-এর কোনো শিক্ষার্থীর তথ্য পাওয়া যায়নি।`);
    }
  };

  const handleTeacherSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const match = teachers.find(t => t.id === teacherId);
    if (match) {
      setFoundTeacher(match);
    } else {
      setErrorMsg(`Teacher ID ${teacherId}-এর কোনো শিক্ষকের তথ্য পাওয়া যায়নি।`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-900/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="no-print bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>আইডি কার্ড প্রিন্টিং স্যুট (Digital ID Management)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            অফিশিয়াল ডিজিটাল আইডি কার্ড
          </h2>
          <p className="text-xs text-emerald-200">
            রোল-ই স্টুডেন্ট আইডি ও ইউনিক Teacher ID সম্বলিত আইডি কার্ড জেনারেটর
          </p>

          {/* Mode Switcher */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => { setMode('student'); setErrorMsg(''); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'student' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white/15 text-white'
              }`}
            >
              শিক্ষার্থী আইডি কার্ড (Student ID)
            </button>
            <button
              onClick={() => { setMode('teacher'); setErrorMsg(''); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'teacher' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white/15 text-white'
              }`}
            >
              শিক্ষক আইডি কার্ড (Teacher ID)
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="no-print p-4 bg-emerald-50/50 border-b border-emerald-200">
          {mode === 'student' ? (
            <form onSubmit={handleStudentSearch} className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি:</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">রোল (Student ID):</label>
                <input
                  type="text"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  placeholder="যেমন: 01"
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold font-mono bg-white focus:ring-2 focus:ring-emerald-600 outline-none w-24"
                  required
                />
              </div>

              <div className="pt-5 flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-900"
                >
                  খুঁজুন
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs hover:bg-amber-400 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট আইডি</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleTeacherSearch} className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষক নির্বাচন:</label>
                <select
                  value={teacherId}
                  onChange={(e) => {
                    setTeacherId(e.target.value);
                    const match = teachers.find(t => t.id === e.target.value);
                    if (match) setFoundTeacher(match);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-5 flex gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs hover:bg-amber-400 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট আইডি কার্ড</span>
                </button>
              </div>
            </form>
          )}

          {errorMsg && (
            <div className="mt-2 text-xs text-rose-700 font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* ID Card Display Area */}
        <div className="p-6 overflow-y-auto flex-1 flex items-center justify-center bg-slate-100">
          
          {/* STUDENT ID CARD */}
          {mode === 'student' && foundStudent && (
            <div className="printable-area id-card-frame bg-white border-2 border-emerald-800 flex flex-col justify-between text-slate-900 relative p-0 overflow-hidden shadow-xl">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-3.5 text-center relative border-b-2 border-amber-400">
                <div className="font-arabic text-xs text-amber-300 font-bold leading-none mb-0.5">﷽</div>
                <h3 className="font-black text-sm tracking-tight text-white leading-tight">
                  {settings.name}
                </h3>
                <p className="text-[9px] text-emerald-200">উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম</p>
                <div className="inline-block px-2.5 py-0.5 bg-amber-400 text-slate-950 rounded-full text-[9px] font-black mt-1">
                  শিক্ষার্থী ডিজিটাল পরিচয়পত্র (STUDENT ID)
                </div>
              </div>

              {/* Photo & Roll */}
              <div className="px-4 py-3 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-emerald-700 p-0.5 bg-white shadow-md mb-2">
                  <img
                    src={foundStudent.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                    alt={foundStudent.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <h4 className="font-black text-base text-emerald-950 leading-tight">
                  {foundStudent.name}
                </h4>

                <div className="mt-1 px-3 py-0.5 bg-emerald-100 text-emerald-900 rounded-full text-xs font-mono font-black border border-emerald-300">
                  রোল / স্টুডেন্ট আইডি: {foundStudent.roll}
                </div>
              </div>

              {/* Info Details */}
              <div className="px-5 text-[11px] space-y-1.5 text-slate-800">
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                  <span className="text-slate-500 font-medium">শ্রেণি:</span>
                  <span className="font-bold text-slate-900">{foundStudent.className}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                  <span className="text-slate-500 font-medium">শিক্ষাবর্ষ:</span>
                  <span className="font-bold text-slate-900">{foundStudent.academicYear}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                  <span className="text-slate-500 font-medium">পিতার নাম:</span>
                  <span className="font-semibold text-slate-900">{foundStudent.fatherName || 'মাওলানা কামরুল হাসান'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                  <span className="text-slate-500 font-medium">জরুরি মোবাইল:</span>
                  <span className="font-bold font-mono text-emerald-900">{foundStudent.phone}</span>
                </div>
              </div>

              {/* Footer Signatures */}
              <div className="p-3 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-[9px] text-slate-600">
                <div className="text-center">
                  <img src={settings.institutionSealUrl} alt="সিল" className="h-7 w-7 mx-auto object-contain" />
                  <span>অফিশিয়াল সিল</span>
                </div>
                <div className="text-center">
                  <img src={settings.signatureUrl} alt="স্বাক্ষর" className="h-6 mx-auto object-contain" />
                  <span className="font-bold text-emerald-950">প্রধান শিক্ষক</span>
                </div>
              </div>
            </div>
          )}

          {/* TEACHER ID CARD */}
          {mode === 'teacher' && foundTeacher && (
            <div className="printable-area id-card-frame bg-white border-2 border-emerald-900 flex flex-col justify-between text-slate-900 relative p-0 overflow-hidden shadow-xl">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white p-3.5 text-center relative border-b-2 border-amber-400">
                <div className="font-arabic text-xs text-amber-300 font-bold leading-none mb-0.5">﷽</div>
                <h3 className="font-black text-sm tracking-tight text-white leading-tight">
                  {settings.name}
                </h3>
                <p className="text-[9px] text-emerald-200">উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম</p>
                <div className="inline-block px-3 py-0.5 bg-amber-400 text-slate-950 rounded-full text-[9px] font-black mt-1">
                  শিক্ষক পরিচয়পত্র (TEACHER ID CARD)
                </div>
              </div>

              {/* Photo & Teacher ID */}
              <div className="px-4 py-3 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-emerald-700 p-0.5 bg-white shadow-md mb-2">
                  <img
                    src={foundTeacher.photoUrl}
                    alt={foundTeacher.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <h4 className="font-black text-base text-emerald-950 leading-tight">
                  {foundTeacher.name}
                </h4>
                <p className="text-xs font-bold text-emerald-800">{foundTeacher.designation}</p>

                <div className="mt-1 px-3 py-0.5 bg-emerald-900 text-amber-300 rounded-full text-xs font-mono font-black border border-amber-400">
                  Teacher ID: {foundTeacher.id}
                </div>
              </div>

              {/* Info Details */}
              <div className="px-5 text-[11px] space-y-1.5 text-slate-800">
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                  <span className="text-slate-500 font-medium">মোবাইল:</span>
                  <span className="font-mono font-bold text-slate-900">{foundTeacher.phone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                  <span className="text-slate-500 font-medium">রক্তের গ্রুপ:</span>
                  <span className="font-bold text-rose-600">{foundTeacher.bloodGroup || 'O+'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-0.5">
                  <span className="text-slate-500 font-medium">যোগদানের সন:</span>
                  <span className="font-bold text-slate-900">{foundTeacher.joiningDate || '২০১৮'}</span>
                </div>
              </div>

              {/* Footer Signatures */}
              <div className="p-3 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-[9px] text-slate-600">
                <div className="text-center">
                  <img src={settings.institutionSealUrl} alt="সিল" className="h-7 w-7 mx-auto object-contain" />
                  <span>অফিশিয়াল সিল</span>
                </div>
                <div className="text-center">
                  <img src={settings.signatureUrl} alt="স্বাক্ষর" className="h-6 mx-auto object-contain" />
                  <span className="font-bold text-emerald-950">মাওলানা তোফাজ্জল হোসেন</span>
                  <div className="text-[8px] text-slate-500">প্রধান শিক্ষক</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
