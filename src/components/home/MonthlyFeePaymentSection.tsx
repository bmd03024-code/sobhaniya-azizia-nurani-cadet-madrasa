import React, { useState } from 'react';
import { MadrasahClass, InstituteSettings, StudentFeeBill } from '../../types';
import { storage } from '../../services/storage';
import {
  FileText,
  Search,
  Printer,
  Download,
  AlertCircle,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  RefreshCw,
  Coins,
  Receipt
} from 'lucide-react';
import { toBengaliNum } from './CoursesSection';

interface MonthlyFeePaymentSectionProps {
  courses?: any[];
  classes?: MadrasahClass[];
  settings: InstituteSettings;
}

const MONTHS_LIST = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
];

export const MonthlyFeePaymentSection: React.FC<MonthlyFeePaymentSectionProps> = ({ settings, classes: propClasses }) => {
  const classes: MadrasahClass[] = propClasses || storage.getClasses();

  // Search filter states (NO amount field!)
  const [academicYear, setAcademicYear] = useState('2026');
  const [className, setClassName] = useState(classes[0]?.name || 'শিশু শ্রেণি');
  const [roll, setRoll] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('সকল মাস');

  // Search results state
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedBills, setMatchedBills] = useState<StudentFeeBill[]>([]);
  const [activeBill, setActiveBill] = useState<StudentFeeBill | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roll.trim()) {
      alert('অনুগ্রহ করে শিক্ষার্থীর রোল নম্বর দিন।');
      return;
    }

    const allBills = storage.getFeeBills();
    const cleanRoll = roll.trim();

    // Filter by academic year, class name, and roll
    const filtered = allBills.filter(bill => {
      const matchYear = bill.academicYear === academicYear;
      const matchClass =
        bill.className === className ||
        bill.classId === classes.find(c => c.name === className)?.id;
      const matchRoll =
        bill.roll.replace(/^0+/, '') === cleanRoll.replace(/^0+/, '') ||
        bill.roll === cleanRoll;
      const matchMonth =
        selectedMonth === 'সকল মাস' || bill.month.includes(selectedMonth);

      return matchYear && matchClass && matchRoll && matchMonth;
    });

    setHasSearched(true);
    setMatchedBills(filtered);
    if (filtered.length > 0) {
      setActiveBill(filtered[0]);
    } else {
      setActiveBill(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="fee-section" className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 via-emerald-50/30 to-slate-50 border-b border-emerald-900/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header with Official Madrasah Logo */}
        <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center">
          {settings.logoUrl && (
            <img
              src={settings.logoUrl}
              alt="মাদ্রাসার লোগো"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto mb-3 drop-shadow-md"
            />
          )}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-2 border border-emerald-200">
            <Receipt className="w-3.5 h-3.5 text-emerald-700" />
            <span>অফিশিয়াল ফি সার্ভিস ও রশিদ পোর্টাল</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            মাসিক বেতন ও আনুষঙ্গিক ফি রশিদ ডাউনলোড
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            শিক্ষাবর্ষ, শ্রেণি ও শিক্ষার্থীর রোল নির্বাচন করে অ্যাডমিন কর্তৃক নির্ধারিত আনপেইড ফি রশিদ খুঁজুন এবং ডাউনলোড / প্রিন্ট করুন।
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-lg text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>এখানে কোনো টাকা দিতে হবে না। আনপেইড রশিদটি ডাউনলোড করে মাদ্রাসার অফিসে এসে সরাসরি জমা দিন।</span>
          </div>
        </div>

        {/* Search Bar / Filter Form */}
        <div className="bg-white rounded-2xl shadow-xl shadow-emerald-950/5 border border-emerald-900/15 p-5 sm:p-7 mb-10">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            
            {/* Academic Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>শিক্ষাবর্ষ</span>
              </label>
              <select
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50"
              >
                <option value="2026">২০২৬ শিক্ষাবর্ষ</option>
                <option value="2025">২০২৫ শিক্ষাবর্ষ</option>
                <option value="2027">২০২৭ শিক্ষাবর্ষ</option>
              </select>
            </div>

            {/* Class Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>শ্রেণি</span>
              </label>
              <select
                value={className}
                onChange={e => setClassName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Student Roll Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>শিক্ষার্থীর রোল নম্বর *</span>
              </label>
              <input
                type="text"
                required
                value={roll}
                onChange={e => setRoll(e.target.value)}
                placeholder="যেমন: 01 বা 1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50"
              />
            </div>

            {/* Month Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>মাসের নাম</span>
              </label>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50"
              >
                <option value="সকল মাস">সকল মাস</option>
                {MONTHS_LIST.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>রশিদ খুঁজুন ও ডাউনলোড</span>
              </button>
            </div>
          </form>
        </div>

        {/* When Searched and Results are Available */}
        {hasSearched && (
          <div>
            {matchedBills.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center max-w-xl mx-auto">
                <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  কোনো ফি রশিদ পাওয়া যায়নি
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  শিক্ষাবর্ষ: <strong>{toBengaliNum(academicYear)}</strong>, শ্রেণি: <strong>{className}</strong> এবং রোল: <strong>{toBengaliNum(roll)}</strong> এর জন্য এখনো কোনো আনপেইড ফি রশিদ অ্যাডমিন কর্তৃক পাবলিশ করা হয়নি।
                </p>
                <p className="text-xs text-amber-800 mt-3 font-medium bg-amber-100/70 py-2 px-3 rounded-lg">
                  💡 অনুগ্রহ করে সরাসরি মাদ্রাসা অফিসে যোগাযোগ করুন অথবা অ্যাডমিন প্যানেল থেকে উক্ত শিক্ষার্থীর ফি যুক্ত করার পর পুনরায় চেষ্টা করুন।
                </p>
              </div>
            ) : (
              <div>
                {/* If multiple bills match, show month selector buttons */}
                {matchedBills.length > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                    <span className="text-xs font-bold text-slate-600 mr-2">উপলব্ধ রশিদসমূহ:</span>
                    {matchedBills.map(bill => (
                      <button
                        key={bill.id}
                        type="button"
                        onClick={() => setActiveBill(bill)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          activeBill?.id === bill.id
                            ? 'bg-emerald-700 text-white shadow-md'
                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {bill.month} (৳{toBengaliNum(bill.totalAmount)})
                      </button>
                    ))}
                  </div>
                )}

                {/* Printable Official Slip Card */}
                {activeBill && (
                  <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border-2 border-emerald-800/30 overflow-hidden relative">
                    
                    {/* Top Action Bar (hidden in print) */}
                    <div className="bg-slate-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>অফিশিয়াল আনপেইড রশিদ পাওয়া গেছে</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePrint}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>রশিদ ডাউনলোড / প্রিন্ট করুন</span>
                        </button>
                      </div>
                    </div>

                    {/* Receipt Document Area (Formatted for Print) */}
                    <div className="p-6 sm:p-8 bg-white relative">
                      
                      {/* Watermark in background */}
                      {settings.logoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                          <img src={settings.logoUrl} alt="Watermark" className="w-72 h-72 object-contain" />
                        </div>
                      )}

                      {/* Header of the Slip */}
                      <div className="border-b-2 border-emerald-900 pb-4 text-center relative z-10">
                        <div className="flex items-center justify-center gap-3 mb-2">
                          {settings.logoUrl && (
                            <img src={settings.logoUrl} alt="Logo" className="w-14 h-14 object-contain" />
                          )}
                          <div>
                            <h1 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
                              {settings.name}
                            </h1>
                            <p className="text-xs text-slate-700 font-semibold">
                              {settings.address}
                            </p>
                          </div>
                        </div>
                        <div className="inline-block bg-emerald-900 text-white px-4 py-0.5 rounded-full text-xs font-bold mt-1 tracking-wider uppercase">
                          আনপেইড ফি জমার রশিদ (UNPAID SLIP)
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-mono">
                          রশিদ নং: {activeBill.billNo} | প্রকাশের তারিখ: {toBengaliNum(activeBill.publishDate)}
                        </p>
                      </div>

                      {/* Student Info Box */}
                      <div className="my-5 bg-slate-50/80 rounded-xl p-4 border border-slate-200 text-xs text-slate-800 grid grid-cols-2 gap-y-2 gap-x-4 relative z-10">
                        <div>
                          <span className="text-slate-500 font-medium">শিক্ষার্থীর নাম:</span>
                          <span className="font-bold ml-1.5 text-slate-900">{activeBill.studentName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">পিতার নাম:</span>
                          <span className="font-bold ml-1.5 text-slate-900">{activeBill.fatherName || 'উল্লেখ নেই'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">শ্রেণি:</span>
                          <span className="font-bold ml-1.5 text-emerald-800">{activeBill.className}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">রোল নম্বর:</span>
                          <span className="font-bold ml-1.5 text-slate-900">{toBengaliNum(activeBill.roll)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">শিক্ষাবর্ষ:</span>
                          <span className="font-bold ml-1.5 text-slate-900">{toBengaliNum(activeBill.academicYear)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">ফি-র মাস:</span>
                          <span className="font-bold ml-1.5 text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                            {activeBill.month}
                          </span>
                        </div>
                      </div>

                      {/* Fee Breakdown Table (Configured by Admin) */}
                      <div className="relative z-10 mb-5">
                        <table className="w-full text-xs text-left border-collapse border border-slate-300">
                          <thead>
                            <tr className="bg-emerald-900 text-white">
                              <th className="border border-emerald-950 p-2 font-bold text-center w-12">ক্র.</th>
                              <th className="border border-emerald-950 p-2 font-bold">ফি বিবরণী</th>
                              <th className="border border-emerald-950 p-2 font-bold text-right w-28">টাকার পরিমাণ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeBill.items.map((item, idx) => (
                              <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="border border-slate-300 p-2 text-center text-slate-600 font-semibold">
                                  {toBengaliNum(idx + 1)}
                                </td>
                                <td className="border border-slate-300 p-2 font-semibold text-slate-800">
                                  {item.title}
                                </td>
                                <td className="border border-slate-300 p-2 text-right font-bold text-slate-900 font-mono">
                                  ৳ {toBengaliNum(item.amount)}
                                </td>
                              </tr>
                            ))}
                            {/* Total Row */}
                            <tr className="bg-emerald-50 border-t-2 border-emerald-900">
                              <td colSpan={2} className="border border-slate-300 p-2.5 font-extrabold text-emerald-950 text-right">
                                সর্বমোট প্রদেয় টাকা:
                              </td>
                              <td className="border border-slate-300 p-2.5 text-right font-black text-emerald-900 text-sm font-mono">
                                ৳ {toBengaliNum(activeBill.totalAmount)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Special Instruction & Stamp */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-200 relative z-10">
                        <div className="text-left">
                          <div className="inline-block border-2 border-rose-600 text-rose-700 px-3 py-1 rounded font-black text-xs uppercase tracking-wider -rotate-2">
                            UNPAID — অফিসে প্রদেয়
                          </div>
                          <p className="text-[11px] text-slate-600 mt-2 max-w-xs leading-relaxed">
                            ⚠️ এই রশিদের অর্থ সরাসরি মাদ্রাসার হিসাব শাখায় এসে নগদ জমা দিয়ে সিলমোহরযুক্ত পেইড কপি গ্রহণ করুন।
                          </p>
                        </div>

                        {/* Signatures */}
                        <div className="text-center sm:text-right">
                          {settings.signatureUrl ? (
                            <img src={settings.signatureUrl} alt="Signature" className="h-8 mx-auto sm:ml-auto object-contain mb-1" />
                          ) : (
                            <div className="h-8"></div>
                          )}
                          <div className="border-t border-slate-700 w-36 pt-1 text-[11px] font-bold text-slate-800 text-center">
                            হিসাব শাখা / প্রধান শিক্ষক
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Download & Print Button in Slip Card (hidden in print) */}
                    <div className="bg-slate-50 border-t border-slate-200 p-4 text-center print:hidden flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-98 transition-all cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>অফিসিয়াল রশিদ প্রিন্ট / ডাউনলোড করুন</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
