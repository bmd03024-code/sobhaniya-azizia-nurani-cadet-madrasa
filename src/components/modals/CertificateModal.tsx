import React, { useState } from 'react';
import { MadrasahClass, Student } from '../../types';
import { storage } from '../../services/storage';
import {
  X,
  Award,
  Search,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { toBengaliNum } from '../home/CoursesSection';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes?: MadrasahClass[];
  initialStudent?: Student | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  classes = storage.getClasses(),
  initialStudent
}) => {
  const settings = storage.getSettings();
  const students = storage.getStudents();

  // Document Type
  const [docType, setDocType] = useState<'passing' | 'testimonial' | 'tc'>('passing');

  // Search
  const [classId, setClassId] = useState(classes[1]?.id || classes[0]?.id || 'class-1');
  const [rollInput, setRollInput] = useState(initialStudent?.roll || '01');
  const [student, setStudent] = useState<Student | null>(initialStudent || students[0] || null);

  // Document details
  const [certificateNo, setCertificateNo] = useState(`SAN-CERT-${new Date().getFullYear()}-0101`);
  const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString('bn-BD'));
  const [gpaText, setGpaText] = useState('৫.০০ (A+)');
  const [tcReason, setTcReason] = useState('অভিভাবকের বাসস্থান পরিবর্তন ও স্থানান্তরজনিত কারণে');

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoll = rollInput.trim().padStart(2, '0');
    const match = students.find(
      s => (s.classId === classId || s.className === classes.find(c => c.id === classId)?.name) &&
           (s.roll.trim() === cleanRoll || s.roll.trim() === rollInput.trim())
    );
    if (match) {
      setStudent(match);
      setCertificateNo(`SAN-DOC-${match.roll}-${Date.now().toString().slice(-4)}`);
    } else {
      alert(`রোল ${rollInput}-এর শিক্ষার্থী পাওয়া যায়নি।`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentClass = classes.find(c => c.id === classId) || classes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-emerald-900/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="no-print bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>সনদপত্র, প্রশংসাপত্র ও ছাড়পত্র জেনারেটর (Official Documents)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            অফিশিয়াল একাডেমিক সনদপত্র স্যুট
          </h2>
          <p className="text-xs text-emerald-200">
            বার্ষিক উত্তীর্ণ সনদপত্র, প্রশংসাপত্র (Testimonial) ও ছাড়পত্র (TC)
          </p>

          {/* Doc Type Selector */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setDocType('passing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                docType === 'passing' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white/15 text-white'
              }`}
            >
              বার্ষিক উত্তীর্ণ সনদপত্র
            </button>
            <button
              onClick={() => setDocType('testimonial')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                docType === 'testimonial' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white/15 text-white'
              }`}
            >
              প্রশংসাপত্র (Testimonial)
            </button>
            <button
              onClick={() => setDocType('tc')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                docType === 'tc' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white/15 text-white'
              }`}
            >
              ছাড়পত্র / টিসি (Transfer Certificate)
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="no-print p-4 bg-emerald-50/50 border-b border-emerald-200 flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
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
                value={rollInput}
                onChange={(e) => setRollInput(e.target.value)}
                placeholder="01"
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold font-mono bg-white focus:ring-2 focus:ring-emerald-600 outline-none w-20"
                required
              />
            </div>

            <div className="pt-5 flex gap-2">
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-800 text-white font-bold text-xs rounded-xl hover:bg-emerald-900"
              >
                লোড করুন
              </button>
            </div>
          </form>

          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>

        {/* Document Display Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 flex justify-center bg-slate-100">
          {student ? (
            <div className="printable-area certificate-border bg-white p-8 sm:p-12 w-full max-w-3xl text-slate-900 shadow-xl rounded-2xl relative space-y-6">
              
              {/* Header */}
              <div className="text-center border-b-2 border-emerald-900/60 pb-5 pt-2">
                <div className="font-arabic text-xl text-emerald-800 font-bold mb-1">﷽</div>
                <h1 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
                  {settings.name}
                </h1>
                <p className="text-xs text-slate-600">
                  উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম | মোবাইল: {settings.phone}
                </p>
                <div className="mt-3">
                  <span className="px-5 py-1.5 bg-emerald-900 text-amber-300 font-black text-sm rounded-full shadow-xs uppercase tracking-wide">
                    {docType === 'passing' && 'বার্ষিক উত্তীর্ণ ও মেধা সনদপত্র'}
                    {docType === 'testimonial' && 'প্রশংসাপত্র • TESTIMONIAL'}
                    {docType === 'tc' && 'ছাড়পত্র / টিসি • TRANSFER CERTIFICATE'}
                  </span>
                </div>
              </div>

              {/* Meta Number and Date */}
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 px-2">
                <div>স্মারক নং: <b className="font-mono text-emerald-950">{certificateNo}</b></div>
                <div>ইস্যু তারিখ: <b className="text-emerald-950">{issueDate}</b></div>
              </div>

              {/* Body Text */}
              <div className="text-sm sm:text-base leading-loose text-justify text-slate-800 px-4 space-y-3 font-medium">
                {docType === 'passing' && (
                  <p>
                    এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, <b className="text-emerald-950 underline">{student.name}</b>, পিতা: <b className="text-slate-900">{student.fatherName || 'মাওলানা কামরুল হাসান'}</b>, মাতা: <b className="text-slate-900">{student.motherName || 'রোকেয়া বেগম'}</b>, ঠিকানা: {student.address}। সে সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসার <b className="text-emerald-950">{student.className}</b>-এর নিয়মিত শিক্ষার্থী, যার রোল নম্বর/স্টুডেন্ট আইডি: <b className="font-mono text-emerald-950">{student.roll}</b>।
                    <br />
                    সে <b className="font-mono">{student.academicYear}</b> শিক্ষাবর্ষের বার্ষিক পরীক্ষায় অংশগ্রহণ করে ৭টি বিষয়ে মোট নম্বরের ওপর জিপিএ <b className="text-emerald-900 font-bold">{gpaText}</b> পেয়ে কৃতিত্বের সাথে উত্তীর্ণ হয়ে পরবর্তী শ্রেণিতে প্রমোশন লাভ করেছে।
                  </p>
                )}

                {docType === 'testimonial' && (
                  <p>
                    এই মর্মে অত্যন্ত আনন্দের সাথে প্রশংসাপত্র প্রদান করা যাচ্ছে যে, <b className="text-emerald-950 underline">{student.name}</b>, রোল নং: <b className="font-mono text-emerald-950">{student.roll}</b>, শ্রেণি: <b className="text-emerald-950">{student.className}</b>, সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসায় অধ্যয়নকালীন সময়ে অত্যন্ত চরিত্রবান, বিনম্র, ধর্মপরায়ণ ও মনোযোগী শিক্ষার্থী ছিল।
                    <br />
                    মাদ্রাসায় অধ্যয়নকালে সে কুরআন তিলাওয়াত, হাদিস, আরবি ব্যাকরণ এবং শৃঙ্খলা রক্ষায় প্রশংসনীয় কৃতিত্ব প্রদর্শন করেছে। প্রতিষ্ঠান বিরোধী কোনো কার্যকলাপে সে লিপ্ত ছিল না। আমি তার ভবিষ্যৎ জীবনের সার্বিক কল্যাণ, উন্নতি ও উত্তরোত্তর সাফল্য কামনা করি।
                  </p>
                )}

                {docType === 'tc' && (
                  <p>
                    এই মর্মে ছাড়পত্র (TC) প্রদান করা যাচ্ছে যে, <b className="text-emerald-950 underline">{student.name}</b>, পিতা: <b className="text-slate-900">{student.fatherName || 'মাওলানা কামরুল হাসান'}</b>, রোল নং: <b className="font-mono text-emerald-950">{student.roll}</b>, শ্রেণি: <b className="text-emerald-950">{student.className}</b>, শিক্ষাবর্ষ: <b className="font-mono">{student.academicYear}</b>।
                    <br />
                    <b className="text-slate-900">{tcReason}</b>-এর আবেদনের প্রেক্ষিতে তাকে প্রতিষ্ঠান থেকে ছাড়পত্র প্রদান করা হলো। বর্তমান তারিখ পর্যন্ত মাদ্রাসার সকল প্রকার বেতন ও আর্থিক পাওনাদি সম্পূর্ণ পরিশোধিত আছে। তার চরিত্র উত্তম ও প্রশংসনীয়।
                  </p>
                )}
              </div>

              {/* Signatures & Seal */}
              <div className="pt-10 flex justify-between items-end text-xs text-slate-700 border-t border-emerald-900/40 px-4">
                <div className="text-center">
                  <div className="w-32 border-b border-slate-500 mb-1" />
                  <span>শ্রেণি শিক্ষকের স্বাক্ষর</span>
                </div>

                <div className="text-center">
                  <img src={settings.institutionSealUrl} alt="সিল" className="h-16 w-16 mx-auto object-contain mb-1" />
                  <span className="text-[10px] text-slate-500 font-bold">মাদ্রাসার অফিশিয়াল সিল</span>
                </div>

                <div className="text-center">
                  <img src={settings.signatureUrl} alt="স্বাক্ষর" className="h-10 mx-auto object-contain mb-0.5" />
                  <div className="w-36 border-b border-slate-500 mb-1" />
                  <span className="font-bold text-emerald-950">মাওলানা তোফাজ্জল হোসেন</span>
                  <div className="text-[10px] text-slate-500">প্রধান শিক্ষক</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-slate-500">
              অনুগ্রহ করে শিক্ষার্থী নির্বাচন করুন।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
