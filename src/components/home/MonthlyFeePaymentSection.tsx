import React, { useState } from 'react';
import { MadrasahClass, InstituteSettings } from '../../types';
import { storage } from '../../services/storage';
import { CreditCard, CheckCircle2, AlertCircle, ArrowRight, Printer, Phone, Calendar, User, FileText } from 'lucide-react';

interface MonthlyFeePaymentSectionProps {
  courses?: any[]; // For backwards compatibility
  settings: InstituteSettings;
}

export const MonthlyFeePaymentSection: React.FC<MonthlyFeePaymentSectionProps> = ({ settings }) => {
  const classes: MadrasahClass[] = storage.getClasses();
  const [academicYear, setAcademicYear] = useState('2026');
  const [classId, setClassId] = useState(classes[0]?.id || 'class-shishu');
  const [roll, setRoll] = useState('');
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [month, setMonth] = useState('এপ্রিল ২০২৬');
  const [feeType, setFeeType] = useState('মাসিক বেতন');
  const [amount, setAmount] = useState('৫০০');
  const [trxId, setTrxId] = useState('');
  const [receipt, setReceipt] = useState<any | null>(null);

  const handleRollLookup = (val: string) => {
    setRoll(val);
    const students = storage.getStudents();
    const matched = students.find(s => s.roll === val.trim() && s.academicYear === academicYear && s.classId === classId);
    if (matched) {
      setStudentName(matched.name);
      setPhone(matched.phone);
    }
  };

  const handleClassChange = (newClassId: string) => {
    setClassId(newClassId);
    if (roll) {
      const students = storage.getStudents();
      const matched = students.find(s => s.roll === roll.trim() && s.academicYear === academicYear && s.classId === newClassId);
      if (matched) {
        setStudentName(matched.name);
        setPhone(matched.phone);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roll.trim() || !studentName.trim() || !phone.trim() || !trxId.trim() || !amount) {
      alert('অনুগ্রহ করে শ্রেণি, রোল নম্বর, শিক্ষার্থীর নাম, অভিভাবকের মোবাইল ও ট্রানজেকশন আইডি (TrxID) দিন।');
      return;
    }

    const currentClass = classes.find(c => c.id === classId);
    const receiptData = {
      receiptNo: `FEE-${Date.now().toString().slice(-6)}`,
      academicYear,
      className: currentClass?.name || 'শিশু শ্রেণি',
      roll: roll.trim(),
      studentName: studentName.trim(),
      phone: phone.trim(),
      month,
      feeType,
      amount: amount.trim(),
      trxId: trxId.trim().toUpperCase(),
      date: new Date().toLocaleDateString('bn-BD')
    };

    // Also record in Madrasah ledger
    storage.saveLedger([
      {
        id: `ledger-${Date.now()}`,
        type: 'income',
        category: 'মাসিক বেতন ও ফি',
        description: `${receiptData.studentName} (রোল ${receiptData.roll}, ${receiptData.className}) - ${month}`,
        amount: Number(amount.replace(/[^\d]/g, '')) || 500,
        date: new Date().toISOString().split('T')[0],
        receiptNo: receiptData.receiptNo,
        academicYear
      },
      ...storage.getLedger()
    ]);

    setReceipt(receiptData);
    setTrxId('');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <section id="fee-section" className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 to-emerald-50/30 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-2">
            <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
            <span>ফি ও মাসিক বেতন পরিশোধ পোর্টাল</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
            মাসিক বেতন ও আনুষঙ্গিক ফি পরিশোধ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            মাদ্রাসার অফিসে সরাসরি নগদ জমা দিন অথবা বিকাশ/নগদে ফি পরিশোধ করে মানি রিসিট সংগ্রহ করুন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Office Notice & Payment Guidelines */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 rounded-2xl shadow-md">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                মাদ্রাসা অফিস নির্দেশিকা
              </span>
              <h3 className="text-sm sm:text-base font-bold leading-relaxed text-white">
                ভর্তি ও নিয়মিত মাসিক বেতন সংক্রান্ত নিয়মাবলী
              </h3>
              <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
                ভর্তি ফি ১,০০০/- (এক হাজার টাকা) সরাসরি মাদ্রাসার অফিসে জমা দিতে হবে। বই, খাতা, চক ও সিলেট মাদ্রাসার লাইব্রেরি বা অফিস থেকে আলাদা সংগ্রহ করতে হবে।
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>বিকাশ / নগদ পেমেন্ট তথ্য:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                অনলাইনে ফি পরিশোধের জন্য মাদ্রাসার হটলাইন নম্বরে (<strong>{settings.hotline || '+880 1816-027456'}</strong>) Send Money / ক্যাশ ইন করে প্রাপ্ত TrxID নিচের ফর্মে দিন।
              </p>
              <div className="p-3 bg-white rounded-xl border border-amber-200 text-center">
                <span className="text-[11px] text-slate-500 font-semibold block">মাদ্রাসার অফিশিয়াল নম্বর (Personal / Send Money)</span>
                <span className="text-base font-black text-emerald-800 tracking-wider">
                  {settings.hotline || '+880 1816-027456'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>প্রতি মাসের ১০ তারিখের মধ্যে মাসিক বেতন পরিশোধ করা উত্তম।</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>অনলাইনে ফি সাবমিট করার পর কম্পিউটারাইজড রিসিট সাথে সাথে প্রিন্ট করা যাবে।</span>
              </div>
            </div>
          </div>

          {/* Right: Payment Submission Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            {receipt ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-black text-emerald-950">
                    ফি পরিশোধের তথ্য সফলভাবে গৃহীত হয়েছে!
                  </h3>
                  <p className="text-xs text-slate-600">
                    মাদ্রাসার অফিস কর্তৃপক্ষ দ্রুত যাচাই করে চূড়ান্ত অনুমোদন প্রদান করবেন।
                  </p>
                </div>

                {/* Printable Receipt Preview */}
                <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-emerald-300 font-mono text-xs space-y-3">
                  <div className="text-center pb-3 border-b border-slate-300">
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {settings.name}
                    </h4>
                    <p className="text-[11px] text-slate-600">{settings.address}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                      ফি জমার রসিদ (মানি রিসিট)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>রসিদ নং: <span className="font-bold">{receipt.receiptNo}</span></div>
                    <div>তারিখ: <span className="font-bold">{receipt.date}</span></div>
                    <div>শিক্ষার্থীর নাম: <span className="font-bold">{receipt.studentName}</span></div>
                    <div>শ্রেণি: <span className="font-bold">{receipt.className}</span></div>
                    <div>রোল নং: <span className="font-bold">{receipt.roll}</span></div>
                    <div>মাস/ফি ধরন: <span className="font-bold">{receipt.month} ({receipt.feeType})</span></div>
                    <div>টাকার পরিমাণ: <span className="font-bold">{receipt.amount} টাকা</span></div>
                    <div>TrxID: <span className="font-bold text-emerald-800">{receipt.trxId}</span></div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrintReceipt}
                    className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>রসিদ প্রিন্ট করুন</span>
                  </button>
                  <button
                    onClick={() => setReceipt(null)}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                  >
                    নতুন ফি জমা দিন
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      শিক্ষাবর্ষ *
                    </label>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="2026">২০২৬ শিক্ষাবর্ষ</option>
                      <option value="2025">২০২৫ শিক্ষাবর্ষ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      শ্রেণি *
                    </label>
                    <select
                      value={classId}
                      onChange={(e) => handleClassChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      শিক্ষার্থীর রোল নম্বর (Student ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ০১, ০২, ০৩"
                      value={roll}
                      onChange={(e) => handleRollLookup(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      শিক্ষার্থীর পূর্ণ নাম *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="শিক্ষার্থীর নাম"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      অভিভাবকের মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="০১৮১৬০২৭৪৫৬"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ফি-এর ধরন ও মাস *
                    </label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="জানুয়ারি ২০২৬">জানুয়ারি ২০২৬</option>
                      <option value="ফেব্রুয়ারি ২০২৬">ফেব্রুয়ারি ২০২৬</option>
                      <option value="মার্চ ২০২৬">মার্চ ২০২৬</option>
                      <option value="এপ্রিল ২০২৬">এপ্রিল ২০২৬</option>
                      <option value="মে ২০২৬">মে ২০২৬</option>
                      <option value="জুন ২০২৬">জুন ২০২৬</option>
                      <option value="জুলাই ২০২৬">জুলাই ২০২৬</option>
                      <option value="আগস্ট ২০২৬">আগস্ট ২০২৬</option>
                      <option value="সেপ্টেম্বর ২০২৬">সেপ্টেম্বর ২০২৬</option>
                      <option value="অক্টোবর ২০২৬">অক্টোবর ২০২৬</option>
                      <option value="নভেম্বর ২০২৬">নভেম্বর ২০২৬</option>
                      <option value="ডিসেম্বর ২০২৬">ডিসেম্বর ২০২৬</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      টাকার পরিমাণ (টাকা) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="৫০০"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      বিকাশ/নগদ TrxID / ব্যাংক ভাউচার *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: BKX928420"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold tracking-wider uppercase text-slate-800 focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 px-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>ফি সাবমিট করুন ও রসিদ তৈরি করুন</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
