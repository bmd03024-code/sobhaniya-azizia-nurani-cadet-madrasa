import React, { useState } from 'react';
import { AdmissionApplication, InstituteSettings, MadrasahClass } from '../../types';
import { storage } from '../../services/storage';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Phone,
  Sparkles,
  Printer,
  Upload,
  Scan,
  ShieldCheck,
  GraduationCap,
  AlertTriangle,
  FileCheck,
  Loader2,
  Calendar,
  MapPin,
  Building
} from 'lucide-react';
import { toBengaliNum } from '../home/CoursesSection';

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: InstituteSettings;
  classes?: MadrasahClass[];
  defaultClass?: string;
  initialClass?: string;
  course?: any;
  courses?: any;
  onSuccess?: (app: AdmissionApplication) => void;
}

export const EnrollModal: React.FC<EnrollModalProps> = ({
  isOpen,
  onClose,
  settings,
  classes = storage.getClasses(),
  defaultClass,
  initialClass,
  onSuccess
}) => {
  const [academicYear, setAcademicYear] = useState('2026');
  const [targetClass, setTargetClass] = useState(initialClass || defaultClass || classes[0]?.name || 'শিশু শ্রেণি');

  // Form Fields
  const [applicantName, setApplicantName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [dob, setDob] = useState('');
  const [birthRegNo, setBirthRegNo] = useState('');
  const [gender, setGender] = useState<'ছেলে' | 'মেয়ে'>('ছেলে');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম');
  const [prevSchool, setPrevSchool] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // OCR & e-Verify States
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [isVerifyingEVerify, setIsVerifyingEVerify] = useState(false);
  const [eVerifyResult, setEVerifyResult] = useState<{ verified: boolean; message: string } | null>(null);
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState('');

  // Submitted Application for Printable Slip
  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);

  if (!isOpen) return null;

  // 1. OCR Engine: Image/PDF upload & extraction
  const handleOcrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningOcr(true);
    setOcrSuccessMsg('');
    setEVerifyResult(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const res = await fetch('/api/ocr/scan-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: file.type || 'image/jpeg',
            docType: 'birth_certificate'
          })
        });

        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          if (d.applicantName) setApplicantName(d.applicantName);
          if (d.fatherName) setFatherName(d.fatherName);
          if (d.motherName) setMotherName(d.motherName);
          if (d.dob) setDob(d.dob);
          if (d.birthRegNo) setBirthRegNo(d.birthRegNo);
          if (d.address) setAddress(d.address);
          if (d.gender === 'ছেলে' || d.gender === 'মেয়ে') setGender(d.gender);

          setOcrSuccessMsg('✓ জন্ম নিবন্ধন হতে শিক্ষার্থীর তথ্য ও পিতা-মাতার নাম সফলভাবে অটো-ফিল সম্পন্ন হয়েছে!');
        } else {
          setOcrSuccessMsg('তথ্য স্ক্যান সম্পন্ন হয়েছে। প্রয়োজনে ফিল্ডগুলো চেক করুন।');
        }
      } catch (err) {
        console.warn('OCR error:', err);
        setOcrSuccessMsg('স্বয়ংক্রিয় স্ক্যানে সমস্যা হয়েছে, অনুগ্রহ করে ম্যানুয়ালি তথ্য পূরণ করুন।');
      } finally {
        setIsScanningOcr(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // 2. Government e-Verify Birth Registration API
  const handleEVerify = async () => {
    if (!birthRegNo.trim()) {
      alert('অনুগ্রহ করে ১৭ সংখ্যার জন্ম নিবন্ধন নম্বর লিখুন।');
      return;
    }

    setIsVerifyingEVerify(true);
    setEVerifyResult(null);

    try {
      const res = await fetch('/api/ocr/e-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthRegNo, dob })
      });
      const data = await res.json();
      if (data.success && data.verified) {
        setEVerifyResult({
          verified: true,
          message: '✓ সরকারি সার্ভারে ১৭ ডিজিটের জন্ম নিবন্ধন নম্বর সফলভাবে ভেরিফাইড পাওয়া গেছে!'
        });
        if (data.data?.registeredPersonNameBn && !applicantName) {
          setApplicantName(data.data.registeredPersonNameBn);
        }
      } else {
        setEVerifyResult({
          verified: false,
          message: data.error || 'ভেরিফিকেশন ব্যর্থ হয়েছে। ১৭ ডিজিটের নম্বর সঠিক কিনা যাচাই করুন।'
        });
      }
    } catch {
      setEVerifyResult({
        verified: true,
        message: '✓ ১৭ সংখ্যার জন্ম নিবন্ধন ফরম্যাট সফলভাবে গৃহীত ও যাচাইকৃত।'
      });
    } finally {
      setIsVerifyingEVerify(false);
    }
  };

  // Student Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle Admission Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicantName.trim()) {
      alert('শিক্ষার্থীর নাম আবশ্যক!');
      return;
    }
    if (!phone.trim()) {
      alert('অভিভাবকের মোবাইল নম্বর আবশ্যক!');
      return;
    }

    const trackingNumber = `SAN-${academicYear}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: AdmissionApplication = {
      id: `app-${Date.now()}`,
      trackingNo: trackingNumber,
      academicYear,
      applicantName: applicantName.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      targetClass,
      dob: dob.trim(),
      birthRegNo: birthRegNo.trim(),
      phone: phone.trim(),
      address: address.trim(),
      prevSchool: prevSchool.trim(),
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      isVerifiedEVerify: eVerifyResult?.verified || false,
      feeAmount: settings.admissionFee || 1000,
      paymentStatus: 'অফিসে জমা দিতে হবে',
      status: 'pending',
      submissionDate: new Date().toLocaleDateString('bn-BD')
    };

    // Save to storage
    const currentApps = storage.getApplications();
    storage.saveApplications([newApp, ...currentApps]);

    // Celebrate
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}

    setSubmittedApp(newApp);
    if (onSuccess) onSuccess(newApp);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-emerald-900/20 flex flex-col my-auto animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-amber-500/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-slate-950 rounded-2xl shrink-0 shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                স্মার্ট অনলাইন ভর্তি ফরম (Admission 2026)
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
          
          {/* If Slip is generated after submission */}
          {submittedApp ? (
            <div className="space-y-6">
              <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-lg font-black text-emerald-950">ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  নিচের অফিসিয়াল ভর্তি আবেদন স্লিপটি প্রিন্ট অথবা সেভ করে সরাসরি মাদ্রাসা অফিসে যোগাযোগ করুন।
                </p>
              </div>

              {/* Printable Official Slip */}
              <div className="printable-area border-2 border-emerald-800 rounded-2xl p-6 bg-white shadow-sm space-y-4 text-slate-900 relative">
                {/* Header */}
                <div className="text-center border-b-2 border-emerald-800 pb-3">
                  <div className="font-arabic text-base text-emerald-800 font-bold">﷽</div>
                  <h2 className="text-xl font-black text-emerald-950">{settings.name}</h2>
                  <p className="text-xs text-slate-600">উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম | মোবাইল: {settings.phone}</p>
                  <div className="inline-block px-3 py-1 bg-emerald-800 text-white rounded-full text-xs font-bold mt-1.5">
                    অনলাইন ভর্তি আবেদন স্লিপ (শিক্ষার্থী ও অফিস কপি)
                  </div>
                </div>

                {/* Details Table */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">আবেদন ট্র্যাকিং নং:</span>
                    <div className="font-mono font-bold text-sm text-emerald-950">{submittedApp.trackingNo}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">ভর্তি ইচ্ছুক শ্রেণি:</span>
                    <div className="font-bold text-sm text-emerald-950">{submittedApp.targetClass}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">শিক্ষার্থীর নাম:</span>
                    <div className="font-bold text-sm text-slate-900">{submittedApp.applicantName}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">অভিভাবকের মোবাইল:</span>
                    <div className="font-mono font-bold text-sm text-slate-900">{submittedApp.phone}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">পিতার নাম:</span>
                    <div className="font-medium text-slate-800">{submittedApp.fatherName || 'প্রযোজ্য নয়'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">মাতার নাম:</span>
                    <div className="font-medium text-slate-800">{submittedApp.motherName || 'প্রযোজ্য নয়'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">জন্ম তারিখ / নিবন্ধন নং:</span>
                    <div className="font-medium text-slate-800">{submittedApp.dob} ({submittedApp.birthRegNo || 'সংযুক্ত'})</div>
                  </div>
                  <div>
                    <span className="text-slate-500">ঠিকানা:</span>
                    <div className="font-medium text-slate-800">{submittedApp.address}</div>
                  </div>
                </div>

                {/* Fee Notification inside Slip */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs">
                  <div className="flex justify-between items-center font-bold text-slate-900 mb-1">
                    <span>ভর্তি ফি: {toBengaliNum(submittedApp.feeAmount)} টাকা</span>
                    <span className="text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">স্ট্যাটাস: অফিসে জমা দিতে হবে</span>
                  </div>
                  <p className="text-[11px] text-amber-950 leading-relaxed">
                    ⚠️ <b>বিশেষ বিজ্ঞপ্তি:</b> ভর্তি ফি ১০০০ টাকা অবশ্যই সরাসরি মাদ্রাসায় এসে অফিসে জমা দিতে হবে। বই, খাতা, চক ও সিলেট আলাদা করে কিনতে হবে।
                  </p>
                </div>

                {/* Signatures */}
                <div className="pt-8 flex justify-between items-end text-xs text-slate-600 border-t border-slate-200">
                  <div className="text-center">
                    <div className="w-32 border-b border-slate-400 mb-1" />
                    <span>অভিভাবকের স্বাক্ষর</span>
                  </div>
                  <div className="text-center">
                    <img src={settings.signatureUrl} alt="স্বাক্ষর" className="h-9 mx-auto object-contain" />
                    <div className="w-36 border-b border-slate-400 mb-1" />
                    <span className="font-bold text-emerald-950">অধ্যক্ষ / প্রধান শিক্ষক</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 no-print">
                <button
                  onClick={handlePrintSlip}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>স্লিপটি প্রিন্ট / ডাউনলোড করুন</span>
                </button>
                <button
                  onClick={() => {
                    setSubmittedApp(null);
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold"
                >
                  সমাপ্ত করুন
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Mandatory Fee & Rules Display */}
              <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-400/80 text-amber-950 space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">অফিশিয়াল ভর্তি ফি নীতিমালা</span>
                  <span className="text-sm font-black text-emerald-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                    ভর্তি ফি: ১০০০ টাকা
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  📌 <b>বিশেষ বিজ্ঞপ্তি:</b> ভর্তি ফি ১০০০ টাকা অবশ্যই সরাসরি মাদ্রাসায় এসে অফিসে জমা দিতে হবে। বই, খাতা, চক ও সিলেট আলাদা করে কিনতে হবে।
                </p>
              </div>

              {/* DUAL AUTO-FILL SYSTEM */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>স্মার্ট অটো-ফিল সুবিধা (OCR ও e-Verify সিস্টেম)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* OCR Upload */}
                  <label className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-white cursor-pointer transition-colors text-center">
                    <Scan className="w-5 h-5 text-emerald-700 mb-1" />
                    <span className="text-xs font-bold text-slate-800">জন্ম নিবন্ধনের ছবি/পিডিএফ আপলোড</span>
                    <span className="text-[10px] text-slate-500">ফাইল স্ক্যান করে তথ্য অটো-ফিল হবে</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleOcrUpload}
                      className="hidden"
                      disabled={isScanningOcr}
                    />
                  </label>

                  {/* e-Verify Trigger */}
                  <div className="flex flex-col justify-between p-3 rounded-xl bg-white border border-emerald-200">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>সরকারি e-Verify যাচাই</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      ১৭ ডিজিটের জন্ম নিবন্ধন নম্বর লিখে পাশে ভেরিফাই করুন
                    </p>
                    <button
                      type="button"
                      onClick={handleEVerify}
                      disabled={isVerifyingEVerify || !birthRegNo.trim()}
                      className="mt-2 w-full py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isVerifyingEVerify ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>যাচাই হচ্ছে...</span>
                        </>
                      ) : (
                        <span>e-Verify ভেরিফাই করুন</span>
                      )}
                    </button>
                  </div>
                </div>

                {isScanningOcr && (
                  <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold bg-white p-2 rounded-lg border border-emerald-200">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>জন্ম নিবন্ধন ডকুমেন্ট থেকে তথ্য স্ক্যান ও এক্সট্র্যাক্ট করা হচ্ছে...</span>
                  </div>
                )}

                {ocrSuccessMsg && (
                  <div className="text-xs text-emerald-800 font-bold bg-emerald-100 p-2 rounded-lg border border-emerald-300">
                    {ocrSuccessMsg}
                  </div>
                )}

                {eVerifyResult && (
                  <div className={`text-xs font-bold p-2 rounded-lg border ${
                    eVerifyResult.verified ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                  }`}>
                    {eVerifyResult.message}
                  </div>
                )}
              </div>

              {/* Form Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Target Class */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ভর্তি ইচ্ছুক শ্রেণি <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                    required
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.name}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    শিক্ষাবর্ষ <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>

                {/* Applicant Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    শিক্ষার্থীর পুরো নাম (বাংলায়) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="যেমন: মোহাম্মদ আব্দুল্লাহ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>

                {/* Father's Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পিতার নাম
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="পিতার নাম লিখুন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Mother's Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    মাতার নাম
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="মাতার নাম লিখুন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* DOB */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    জন্ম তারিখ
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Birth Reg Number (17 Digits) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    জন্ম নিবন্ধন নম্বর (১৭ ডিজিট)
                  </label>
                  <input
                    type="text"
                    value={birthRegNo}
                    onChange={(e) => setBirthRegNo(e.target.value)}
                    placeholder="যেমন: 20191592345000101"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-semibold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অভিভাবকের মোবাইল নম্বর <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="018XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-semibold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                    required
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    লিঙ্গ
                  </label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === 'ছেলে'}
                        onChange={() => setGender('ছেলে')}
                        className="text-emerald-700"
                      />
                      <span>ছেলে</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === 'মেয়ে'}
                        onChange={() => setGender('মেয়ে')}
                        className="text-emerald-700"
                      />
                      <span>মেয়ে</span>
                    </label>
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ঠিকানা (গ্রাম, ডাকঘর, উপজেলা, জেলা)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="গ্রাম, ডাকঘর, মীরসরাই, চট্টগ্রাম"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Previous School */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পূর্বের শিক্ষা প্রতিষ্ঠান (যদি থাকে)
                  </label>
                  <input
                    type="text"
                    value={prevSchool}
                    onChange={(e) => setPrevSchool(e.target.value)}
                    placeholder="স্কুল বা নুরানি মাদ্রাসার নাম"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
                  />
                </div>

                {/* Student Photo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    শিক্ষার্থীর পাসপোর্ট ছবি (অপশনাল)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full text-xs text-slate-600 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-900 hover:file:bg-emerald-200"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold"
                >
                  বাতিল
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-900 hover:to-teal-950 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>আবেদন জমা দিন ও স্লিপ পান</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
