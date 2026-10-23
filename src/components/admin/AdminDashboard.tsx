import React, { useState, useEffect } from 'react';
import {
  InstituteSettings,
  MadrasahClass,
  MadrasahSubject,
  Teacher,
  Student,
  AdmissionApplication,
  ResultRecord,
  ClassRoutineItem,
  ExamRoutineItem,
  LedgerItem,
  NoticeItem,
  GalleryItem,
  CertificateRecord,
  TransferCertificate,
  AdminCredentials
} from '../../types';
import { storage } from '../../services/storage';
import { masterGateway } from '../../services/masterGateway';
import { ResultGeneratorModule } from './ResultGeneratorModule';
import { GitHubSyncModal } from './GitHubSyncModal';
import {
  Settings,
  Users,
  GraduationCap,
  BarChart3,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  DollarSign,
  Bell,
  Image as ImageIcon,
  KeyRound,
  Save,
  Plus,
  Trash2,
  Edit,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Globe,
  RefreshCw,
  Search,
  Sparkles,
  QrCode,
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Check,
  X,
  Upload,
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewWebsite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onViewWebsite }) => {
  // Navigation Modules
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [notification, setNotification] = useState<string | null>(null);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  // Live Data States
  const [settings, setSettings] = useState<InstituteSettings>(() => storage.getSettings());
  const [classes, setClasses] = useState<MadrasahClass[]>(() => storage.getClasses());
  const [subjects, setSubjects] = useState<MadrasahSubject[]>(() => storage.getSubjects());
  const [teachers, setTeachers] = useState<Teacher[]>(() => storage.getTeachers());
  const [students, setStudents] = useState<Student[]>(() => storage.getStudents());
  const [applications, setApplications] = useState<AdmissionApplication[]>(() => storage.getApplications());
  const [results, setResults] = useState<ResultRecord[]>(() => storage.getResults());
  const [classRoutines, setClassRoutines] = useState<ClassRoutineItem[]>(() => storage.getClassRoutines());
  const [examRoutines, setExamRoutines] = useState<ExamRoutineItem[]>(() => storage.getExamRoutines());
  const [ledger, setLedger] = useState<LedgerItem[]>(() => storage.getLedger());
  const [notices, setNotices] = useState<NoticeItem[]>(() => storage.getNotices());
  const [gallery, setGallery] = useState<GalleryItem[]>(() => storage.getGallery());
  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => storage.getCertificates());
  const [creds, setCreds] = useState<AdminCredentials>(() => storage.getAdminCredentials());

  // Print Modals & Preview States
  const [printDocumentType, setPrintDocumentType] = useState<'blank_marksheet' | 'blank_attendance' | 'cashbook' | 'teacher_id' | 'student_id' | null>(null);
  const [selectedTeacherForPrint, setSelectedTeacherForPrint] = useState<Teacher | null>(null);
  const [selectedStudentForPrint, setSelectedStudentForPrint] = useState<Student | null>(null);
  const [selectedClassForDoc, setSelectedClassForDoc] = useState<string>(classes[0]?.id || 'class-shishu');

  // Trigger brief alert toast
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Master Save Function
  const handleSaveAll = () => {
    storage.saveSettings(settings);
    storage.saveClasses(classes);
    storage.saveSubjects(subjects);
    storage.saveTeachers(teachers);
    storage.saveStudents(students);
    storage.saveApplications(applications);
    storage.saveResults(results);
    storage.saveClassRoutines(classRoutines);
    storage.saveExamRoutines(examRoutines);
    storage.saveLedger(ledger);
    storage.saveNotices(notices);
    storage.saveGallery(gallery);
    storage.saveCertificates(certificates);
    storage.saveAdminCredentials(creds);

    // Broadcast sync event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bs_sync', { detail: { key: 'all' } }));
    }
    triggerNotification('✓ সকল তথ্য সফলভাবে ক্লাউড ও সিস্টেমে সংরক্ষিত হয়েছে!');
  };

  // Auto-Promotion Trigger
  const handleRunAutoPromotion = () => {
    if (confirm('আপনি কি বার্ষিক মেধা তালিকার ভিত্তিতে সকল ছাত্র-ছাত্রীদের পরবর্তী শ্রেণিতে উত্তীর্ণ করতে চান? এই পদক্ষেপে নতুন রোল নম্বর বরাদ্দ হবে।')) {
      const { promotedCount, summary } = storage.autoPromoteStudents();
      setStudents(storage.getStudents());
      triggerNotification(`সাফল্যের সাথে ${promotedCount} জন শিক্ষার্থীকে পরবর্তী শ্রেণিতে অটো প্রমোশন দেওয়া হয়েছে!`);
    }
  };

  // Image Upload Helper
  const handleImageUpload = (field: keyof InstituteSettings, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSettings(prev => ({ ...prev, [field]: reader.result as string }));
        triggerNotification('ছবি লোড হয়েছে। সংরক্ষণ বাটনে চাপ দিন।');
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick Stats
  const totalIncome = ledger.filter(l => l.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = ledger.filter(l => l.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingApps = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white border-b-2 border-amber-500/50 sticky top-0 z-40 shadow-lg px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
              ম
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-wide text-white">
                  {settings.name}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  অ্যাডমিন প্যানেল
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 font-medium">
                {settings.address} • হটলাইন: {settings.hotline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsGitHubModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-white/20 text-xs font-bold transition-all hidden md:flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>গিটহাব সিঙ্ক</span>
            </button>

            <button
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>সংরক্ষণ করুন</span>
            </button>

            <button
              onClick={onViewWebsite}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">ওয়েবসাইট</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white transition-colors"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grow flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          {/* Quick Metrics Badge */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs mb-3 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>মোট শিক্ষার্থী:</span>
              <span className="font-bold text-slate-900">{students.length} জন</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>শিক্ষক মণ্ডলী:</span>
              <span className="font-bold text-slate-900">{teachers.length} জন</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>ভর্তি আবেদন:</span>
              <span className="font-bold text-amber-700">{pendingApps} টি অপেক্ষমাণ</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 pt-2 border-t border-slate-100">
              <span>ক্যাশ ব্যালেন্স:</span>
              <span className="font-black text-emerald-800">৳ {(totalIncome - totalExpense).toLocaleString('bn-BD')}</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <nav className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs space-y-1 text-xs font-bold">
            {[
              { id: 'overview', label: '📊 ড্যাশবোর্ড ওভারভিউ', icon: BarChart3 },
              { id: 'settings', label: '🏛️ প্রতিষ্ঠান সেটিংস ও বাণী', icon: Settings },
              { id: 'classes', label: '📚 শ্রেণি ও বিষয় কনট্রোল', icon: Layers },
              { id: 'teachers', label: '👨‍🏫 শিক্ষক ও আইডি কার্ড', icon: Users },
              { id: 'students', label: '🎓 শিক্ষার্থী ও আইডি কার্ড', icon: GraduationCap },
              { id: 'admissions', label: '📝 ভর্তি আবেদন ও e-Verify', icon: UserCheck, badge: pendingApps > 0 ? String(pendingApps) : undefined },
              { id: 'results', label: '📈 রেজাল্ট ও মার্কশিট ইঞ্জিন', icon: FileSpreadsheet },
              { id: 'promotion', label: '🚀 বার্ষিক অটো প্রমোশন', icon: TrendingUp },
              { id: 'routines', label: '📅 ক্লাস ও পরীক্ষার রুটিন', icon: Calendar },
              { id: 'documents', label: '📄 ফাঁকা নম্বর ফর্দ ও সনদপত্র', icon: FileText },
              { id: 'ledger', label: '💰 আয়-ব্যয় ও ক্যাশবুক', icon: DollarSign },
              { id: 'notices', label: '📢 নোটিশ ও ফটো গ্যালারি', icon: Bell },
              { id: 'security', label: '🔐 সিকিউরিটি ও মাস্টার পিন', icon: KeyRound },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                  activeTab === tab.id
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Content View */}
        <main className="grow min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider inline-block">
                    ডিজিটাল মাদ্রাসা অটোমেশন পোর্টাল
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {settings.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                    সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসার রেজাল্ট, ভর্তি, শিক্ষার্থী ডাটাবেস, আইডি কার্ড, ক্লাস ও পরীক্ষার রুটিন এবং আর্থিক ক্যাশবুক কেন্দ্রীয়ভাবে নিয়ন্ত্রণ করুন।
                  </p>
                </div>
              </div>

              {/* Quick Action Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase">মোট শিক্ষার্থী</span>
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{students.length} জন</div>
                  <span className="text-[11px] text-emerald-700 font-semibold">৪টি সক্রিয় শ্রেণি (শিশু-৩য়)</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase">শিক্ষক মণ্ডলী</span>
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{teachers.length} জন</div>
                  <span className="text-[11px] text-blue-700 font-semibold">TID-101 থেকে TID-105</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase">ভর্তি আবেদন</span>
                    <UserCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{pendingApps} টি</div>
                  <span className="text-[11px] text-amber-700 font-semibold">অনলাইন OCR ও e-Verify</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase">ক্যাশ ব্যালেন্স</span>
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-800">৳ {(totalIncome - totalExpense).toLocaleString('bn-BD')}</div>
                  <span className="text-[11px] text-slate-500 font-semibold">আয়: ৳{totalIncome} | ব্যয়: ৳{totalExpense}</span>
                </div>
              </div>

              {/* Fast Action Buttons */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  দ্রুত পরিচালনার শর্টকাট:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveTab('results')}
                    className="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 text-xs font-bold text-center space-y-2 transition-colors"
                  >
                    <FileSpreadsheet className="w-6 h-6 text-emerald-700 mx-auto" />
                    <div>৭ বিষয়ের রেজাল্ট এন্ট্রি</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('admissions')}
                    className="p-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 text-xs font-bold text-center space-y-2 transition-colors"
                  >
                    <UserCheck className="w-6 h-6 text-amber-700 mx-auto" />
                    <div>ভর্তি আবেদন অনুমোদন</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('promotion')}
                    className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 text-xs font-bold text-center space-y-2 transition-colors"
                  >
                    <TrendingUp className="w-6 h-6 text-blue-700 mx-auto" />
                    <div>বার্ষিক অটো প্রমোশন</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('documents')}
                    className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 text-xs font-bold text-center space-y-2 transition-colors"
                  >
                    <Printer className="w-6 h-6 text-purple-700 mx-auto" />
                    <div>ফাঁকা নম্বর ফর্দ ও হাজিরা</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SETTINGS & SPEECHES */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-bold text-slate-900">মাদ্রাসার সাধারণ তথ্য ও বাণী ব্যবস্থাপনা</h2>
                <p className="text-xs text-slate-500">লোগো, সিল, ডিজিটাল স্বাক্ষর, প্রতিষ্ঠাতা ও অধ্যক্ষের বাণী সম্পাদন করুন</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মাদ্রাসার পূর্ণ নাম *</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">উপ-শিরোনাম / প্রতিষ্ঠাতা লাইন *</label>
                  <input
                    type="text"
                    value={settings.subName}
                    onChange={(e) => setSettings({ ...settings, subName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা *</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">হটলাইন / মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    value={settings.hotline}
                    onChange={(e) => setSettings({ ...settings, hotline: e.target.value, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-800"
                  />
                </div>
              </div>

              {/* Founders & Speeches */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-800">প্রতিষ্ঠাতা সভাপতি ও প্রধান শিক্ষকের বাণী:</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Founder */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-emerald-900">প্রতিষ্ঠাতা ও সভাপতি</h4>
                    <input
                      type="text"
                      placeholder="নাম"
                      value={settings.founderName}
                      onChange={(e) => setSettings({ ...settings, founderName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                    <textarea
                      rows={4}
                      value={settings.founderSpeech}
                      onChange={(e) => setSettings({ ...settings, founderSpeech: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs resize-none"
                      placeholder="বাণী লিখুন..."
                    />
                  </div>

                  {/* Principal */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-emerald-900">প্রধান শিক্ষক / অধ্যক্ষ</h4>
                    <input
                      type="text"
                      placeholder="নাম"
                      value={settings.principalName}
                      onChange={(e) => setSettings({ ...settings, principalName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                    <textarea
                      rows={4}
                      value={settings.principalSpeech}
                      onChange={(e) => setSettings({ ...settings, principalSpeech: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs resize-none"
                      placeholder="বাণী লিখুন..."
                    />
                  </div>
                </div>
              </div>

              {/* Digital Seals & Signatures */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-800">ডিজিটাল সিলমোহর ও স্বাক্ষর (মার্কশিট ও সনদের জন্য):</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 text-center space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">মাদ্রাসার অফিশিয়াল গোল সিল</span>
                    {settings.institutionSealUrl && (
                      <img src={settings.institutionSealUrl} alt="Seal" className="w-16 h-16 object-contain mx-auto" />
                    )}
                    <label className="cursor-pointer block px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300 hover:bg-emerald-100">
                      সিল আপলোড করুন
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('institutionSealUrl', e)} />
                    </label>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 text-center space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">প্রধান শিক্ষকের ডিজিটাল স্বাক্ষর</span>
                    {settings.signatureUrl && (
                      <img src={settings.signatureUrl} alt="Signature" className="max-h-12 object-contain mx-auto" />
                    )}
                    <label className="cursor-pointer block px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300 hover:bg-emerald-100">
                      স্বাক্ষর আপলোড করুন
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('signatureUrl', e)} />
                    </label>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 text-center space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">মাদ্রাসার মনোগ্রাম / লোগো</span>
                    {settings.logoUrl && (
                      <img src={settings.logoUrl} alt="Logo" className="w-14 h-14 object-contain mx-auto" />
                    )}
                    <label className="cursor-pointer block px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300 hover:bg-emerald-100">
                      লোগো আপলোড করুন
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('logoUrl', e)} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Admission Notice & Fee Policy */}
              <div className="border-t border-slate-200 pt-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-800">ভর্তি ফি ও নিয়মাবলী (সরাসরি অফিসে জমা):</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তি ফি (টাকা) *</label>
                    <input
                      type="number"
                      value={settings.admissionFee}
                      onChange={(e) => setSettings({ ...settings, admissionFee: Number(e.target.value) || 1000 })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-emerald-800"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তি নোটিশ ও বই-খাতার বার্তা</label>
                    <input
                      type="text"
                      value={settings.admissionNotice}
                      onChange={(e) => setSettings({ ...settings, admissionNotice: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Page Specific Special Notes (CMS controlled for each module) */}
              <div className="border-t border-slate-200 pt-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-800">পেজ-ভিত্তিক বিশেষ বার্তা (Page Special Notes):</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">হোম পেজ বিশেষ বার্তা</label>
                    <input
                      type="text"
                      placeholder="হোম পেজে প্রদর্শিত বার্তা..."
                      value={settings.pageNotes?.home || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        pageNotes: { ...(settings.pageNotes || {}), home: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ভর্তি পেজ বিশেষ বার্তা</label>
                    <input
                      type="text"
                      placeholder="ভর্তি পেজে প্রদর্শিত বার্তা..."
                      value={settings.pageNotes?.admission || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        pageNotes: { ...(settings.pageNotes || {}), admission: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">রেজাল্ট পেজ বিশেষ বার্তা</label>
                    <input
                      type="text"
                      placeholder="রেজাল্ট পেজে প্রদর্শিত বার্তা..."
                      value={settings.pageNotes?.result || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        pageNotes: { ...(settings.pageNotes || {}), result: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">রুটিন পেজ বিশেষ বার্তা</label>
                    <input
                      type="text"
                      placeholder="রুটিন পেজে প্রদর্শিত বার্তা..."
                      value={settings.pageNotes?.routine || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        pageNotes: { ...(settings.pageNotes || {}), routine: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>পরিবর্তন সংরক্ষণ করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CLASSES & SUBJECTS */}
          {activeTab === 'classes' && (
            <div className="space-y-6">
              {/* Classes */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">মাদ্রাসার ৪টি শ্রেণি ব্যবস্থাপনা</h3>
                    <p className="text-xs text-slate-500">শিশু শ্রেণি, ১ম শ্রেণি, ২য় শ্রেণি ও ৩য় শ্রেণি</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {classes.map(c => (
                    <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800">{c.code}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">সক্রিয়</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900">{c.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        শিক্ষার্থী: {students.filter(s => s.classId === c.id).length} জন
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7 Core Subjects */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">৭টি মৌলিক আবশ্যিক বিষয় (পূর্ণমান ১০০, মোট ৭০০)</h3>
                  <p className="text-xs text-slate-500">নূরানী ও ক্যাডেট কারিকুলাম অনুসারে নির্ধারিত বিষয়সমূহ</p>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-emerald-50 text-emerald-950 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3 text-center w-12">ক্রম</th>
                        <th className="p-3">বিষয়ের নাম</th>
                        <th className="p-3 text-center">বিষয় কোড</th>
                        <th className="p-3 text-center">পূর্ণমান</th>
                        <th className="p-3 text-center">পাস নম্বর</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {subjects.map((s, i) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-3 text-center font-bold text-slate-600">{i + 1}</td>
                          <td className="p-3 font-bold text-slate-900">{s.name}</td>
                          <td className="p-3 text-center font-mono text-slate-600">{s.code}</td>
                          <td className="p-3 text-center font-mono font-bold text-emerald-800">{s.totalMarks}</td>
                          <td className="p-3 text-center font-mono text-slate-700">{s.passMarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TEACHERS & TEACHER ID CARDS */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">শিক্ষক মণ্ডলী ও আইডি কার্ড কন্ট্রোল</h3>
                    <p className="text-xs text-slate-500">৫ জন নিয়মিত শিক্ষক: মাওলানা তোফাজ্জল হোসেনসহ সকল দায়িত্বশীল</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teachers.map(t => (
                    <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
                      <div className="flex items-start gap-3">
                        <img
                          src={t.photoUrl}
                          alt={t.name}
                          className="w-14 h-16 rounded-xl object-cover border border-slate-300 shrink-0"
                        />
                        <div className="grow">
                          <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            ID: {t.id}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{t.name}</h4>
                          <p className="text-xs text-emerald-800 font-semibold">{t.designation}</p>
                          <p className="text-[11px] text-slate-500">{t.phone}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-medium">
                          রক্তের গ্রুপ: <strong>{t.bloodGroup || 'A+'}</strong>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedTeacherForPrint(t);
                            setPrintDocumentType('teacher_id');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-300" />
                          <span>আইডি কার্ড</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STUDENTS & STUDENT ID CARDS */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      শিক্ষার্থী ডাটাবেস ও স্টুডেন্ট আইডি (রোল-ই স্টুডেন্ট আইডি)
                    </h3>
                    <p className="text-xs text-slate-500">
                      শিক্ষার্থীদের রোল নম্বর, বকেয়া ফি ট্র্যাকিং, প্রবেশপত্র স্থগিত/সক্রিয়করণ ও আইডি কার্ড প্রিন্ট
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-emerald-50 text-emerald-950 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3 text-center w-16">রোল (ID)</th>
                        <th className="p-3">শিক্ষার্থীর নাম</th>
                        <th className="p-3">শ্রেণি</th>
                        <th className="p-3">পিতার নাম</th>
                        <th className="p-3">মোবাইল নম্বর</th>
                        <th className="p-3 text-center">বকেয়া স্ট্যাটাস</th>
                        <th className="p-3 text-center">প্রবেশপত্র</th>
                        <th className="p-3 text-center w-28">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-3 text-center font-black text-emerald-900">{s.roll}</td>
                          <td className="p-3 font-bold text-slate-900">{s.name}</td>
                          <td className="p-3 text-slate-700">{s.className}</td>
                          <td className="p-3 text-slate-600">{s.fatherName}</td>
                          <td className="p-3 text-slate-600">{s.phone}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.hasPaidDues ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {s.hasPaidDues ? 'পরিশোধিত' : 'বকেয়া আছে'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                const updated = students.map(st => st.id === s.id ? { ...st, admitCardBlocked: !st.admitCardBlocked } : st);
                                setStudents(updated);
                                storage.saveStudents(updated);
                                triggerNotification(s.admitCardBlocked ? 'প্রবেশপত্র সক্রিয় করা হয়েছে' : 'প্রবেশপত্র স্থগিত করা হয়েছে');
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                                s.admitCardBlocked ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {s.admitCardBlocked ? 'স্থগিত (Blocked)' : 'সক্রিয় (Active)'}
                            </button>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setSelectedStudentForPrint(s);
                                setPrintDocumentType('student_id');
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 mx-auto"
                            >
                              <Printer className="w-3 h-3 text-amber-300" />
                              <span>আইডি কার্ড</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ADMISSIONS & E-VERIFY */}
          {activeTab === 'admissions' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ভর্তি আবেদন ও ১৭ ডিজিটের e-Verify তালিকা
                  </h3>
                  <p className="text-xs text-slate-500">
                    অনলাইনে জমা পড়া আবেদনপত্রসমূহ যাচাই ও ১ ক্লিকে শিক্ষার্থী ডাটাবেসে অনুমোদন
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-50 text-amber-950 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">ট্র্যাকিং নং</th>
                      <th className="p-3">আবেদনকারী</th>
                      <th className="p-3">আকাঙ্ক্ষিত শ্রেণি</th>
                      <th className="p-3">পিতার নাম</th>
                      <th className="p-3">মোবাইল</th>
                      <th className="p-3">১৭ ডিজিট জন্ম নিবন্ধন</th>
                      <th className="p-3 text-center">ই-ভেরিফাই</th>
                      <th className="p-3 text-center">স্ট্যাটাস</th>
                      <th className="p-3 text-center w-28">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-amber-800">{app.trackingNo}</td>
                        <td className="p-3 font-bold text-slate-900">{app.applicantName}</td>
                        <td className="p-3 text-emerald-800 font-semibold">{app.targetClass}</td>
                        <td className="p-3 text-slate-600">{app.fatherName}</td>
                        <td className="p-3 text-slate-600">{app.phone}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-700">{app.birthRegNo || 'প্রযোজ্য নয়'}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            app.isVerifiedEVerify ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {app.isVerifiedEVerify ? '✓ যাচাইকৃত' : 'যাচাই বাকি'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status === 'approved' ? 'অনুমোদিত' : app.status === 'rejected' ? 'বাতিল' : 'অপেক্ষমাণ'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {app.status === 'pending' && (
                            <button
                              onClick={() => {
                                // Approve and allocate next roll
                                const classStudents = students.filter(s => s.className === app.targetClass);
                                const nextRollNum = classStudents.length + 1;
                                const formattedRoll = nextRollNum < 10 ? `0${nextRollNum}` : `${nextRollNum}`;

                                const newStudent: Student = {
                                  id: `std-${Date.now()}`,
                                  academicYear: '2026',
                                  classId: classes.find(c => c.name === app.targetClass)?.id || 'class-shishu',
                                  className: app.targetClass,
                                  roll: formattedRoll,
                                  name: app.applicantName,
                                  fatherName: app.fatherName,
                                  motherName: app.motherName,
                                  phone: app.phone,
                                  address: app.address,
                                  admissionDate: new Date().toISOString().split('T')[0],
                                  status: 'active',
                                  hasPaidDues: true
                                };

                                const updatedStudents = [newStudent, ...students];
                                const updatedApps = applications.map(a => a.id === app.id ? { ...a, status: 'approved' as const } : a);
                                setStudents(updatedStudents);
                                setApplications(updatedApps);
                                storage.saveStudents(updatedStudents);
                                storage.saveApplications(updatedApps);
                                triggerNotification(`আবেদন অনুমোদিত হয়েছে! রোল নম্বর: ${formattedRoll}`);
                              }}
                              className="px-3 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                            >
                              অনুমোদন
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: RESULT & MARKSHEET GENERATOR */}
          {activeTab === 'results' && (
            <ResultGeneratorModule
              classes={classes}
              students={students}
              results={results}
              settings={settings}
              onUpdateResults={(newResults) => setResults(newResults)}
              triggerNotification={triggerNotification}
            />
          )}

          {/* TAB 8: ANNUAL AUTO-PROMOTION */}
          {activeTab === 'promotion' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white space-y-2">
                <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
                  বার্ষিক মেধা স্থান (Rank) ভিত্তিক অটোমেশন
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  বার্ষিক মেধা স্থান (Rank) অনুযায়ী পরবর্তী শ্রেণিতে প্রমোশন
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
                  বছর শেষের বার্ষিক পরীক্ষার সামগ্রিক ফলাফলের ভিত্তিতে শিশু শ্রেণির ছাত্ররা ১ম শ্রেণিতে, ১ম শ্রেণির ছাত্ররা ২য় শ্রেণিতে এবং ২য় শ্রেণির ছাত্ররা ৩য় শ্রেণিতে উন্নীত হবে। মেধা স্থান (Rank)-ই হবে নতুন রোল নম্বর!
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                  <span>প্রমোশন চালুর পূর্বে করণীয়:</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-5">
                  <li>সকল শিক্ষার্থীর বার্ষিক পরীক্ষার নম্বর ও ফলাফল এন্ট্রি সম্পন্ন থাকতে হবে।</li>
                  <li>সিস্টেম স্বয়ংক্রিয়ভাবে মোট নম্বর ও জিপিএ অনুযায়ী মেধা তালিকা গণনা করবে।</li>
                  <li>৩য় শ্রেণির ছাত্ররা উত্তীর্ণ হয়ে মাদ্রাসার প্রাক্তন ছাত্র (Graduated Alumni) হিসেবে সংরক্ষিত থাকবে।</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRunAutoPromotion}
                  className="py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg flex items-center gap-3 transition-transform active:scale-98"
                >
                  <TrendingUp className="w-5 h-5 text-amber-300" />
                  <span>বার্ষিক মেধা স্থান অনুযায়ী অটো প্রমোশন কার্যকর করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 9: ROUTINES */}
          {activeTab === 'routines' && (
            <div className="space-y-6">
              {/* Class Routines */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">সাপ্তাহিক ক্লাস রুটিন (শিশু শ্রেণি - ৩য় শ্রেণি)</h3>
                    <p className="text-xs text-slate-500">৭টি মৌলিক বিষয়ের সময়সূচি ও নির্ধারিত দায়িত্বশীল শিক্ষক</p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>রুটিন প্রিন্ট</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-emerald-50 text-emerald-950 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">শ্রেণি</th>
                        <th className="p-3">বার (Day)</th>
                        <th className="p-3">পিরিয়ড</th>
                        <th className="p-3">সময়</th>
                        <th className="p-3">বিষয়</th>
                        <th className="p-3">শিক্ষক</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classRoutines.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-emerald-900">{r.className}</td>
                          <td className="p-3 font-semibold text-slate-800">{r.day}</td>
                          <td className="p-3 text-slate-600">{r.period}</td>
                          <td className="p-3 font-mono text-slate-700">{r.time}</td>
                          <td className="p-3 font-bold text-slate-900">{r.subjectName}</td>
                          <td className="p-3 text-slate-700">{r.teacherName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: OFFICIAL DOCUMENTS SUITE */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">মাদ্রাসার অফিশিয়াল ডকুমেন্টস ও প্রিন্ট স্যুট</h3>
                  <p className="text-xs text-slate-500">ফাঁকা নম্বর ফর্দ, ফাঁকা হাজিরা শিট, উত্তীর্ণ সনদ ও প্রশংসাপত্র প্রিন্ট করুন</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                    <FileSpreadsheet className="w-8 h-8 text-emerald-700" />
                    <h4 className="text-sm font-bold text-slate-900">ফাঁকা নম্বর ফর্দ (Blank Marksheet)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      পরীক্ষকদের অফলাইনে ৭টি বিষয়ের নম্বর হাতে তোলার জন্য টেবিলযুক্ত ফাঁকা শিট।
                    </p>
                    <button
                      onClick={() => setPrintDocumentType('blank_marksheet')}
                      className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-300" />
                      <span>ফাঁকা নম্বর ফর্দ প্রিন্ট ভিউ</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-3">
                    <Calendar className="w-8 h-8 text-teal-700" />
                    <h4 className="text-sm font-bold text-slate-900">ফাঁকা হাজিরা শিট (Attendance Sheet)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      ১ থেকে ৩১ তারিখ পর্যন্ত শিক্ষার্থীদের নাম ও রোলসহ দৈনিক উপস্থিতি রেকর্ড শিট।
                    </p>
                    <button
                      onClick={() => setPrintDocumentType('blank_attendance')}
                      className="w-full py-2.5 rounded-xl bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-300" />
                      <span>হাজিরা শিট প্রিন্ট ভিউ</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                    <Award className="w-8 h-8 text-amber-700" />
                    <h4 className="text-sm font-bold text-slate-900">বার্ষিক উত্তীর্ণ সনদ ও প্রশংসাপত্র</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      শিক্ষার্থীদের বার্ষিক পরীক্ষায় সাফল্যের স্মারক হিসেবে অফিশিয়াল সনদপত্র।
                    </p>
                    <button
                      onClick={() => triggerNotification('সনদপত্র প্রস্তুত রয়েছে। শিক্ষার্থী তালিকা থেকে প্রিন্ট করুন।')}
                      className="w-full py-2.5 rounded-xl bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-200" />
                      <span>সনদপত্র প্রস্তুতকারী</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: FINANCIAL LEDGER & CASHBOOK */}
          {activeTab === 'ledger' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">আর্থিক হিসাব ও ক্যাশবুক লেজার</h3>
                  <p className="text-xs text-slate-500">ভর্তি ফি, মাসিক বেতন, শিক্ষক অনুদান ও মাদ্রাসার ব্যয় হিসাব</p>
                </div>
                <button
                  onClick={() => setPrintDocumentType('cashbook')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-4 h-4 text-amber-300" />
                  <span>মাসিক ক্যাশবুক রিপোর্ট প্রিন্ট</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-50 text-emerald-950 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">তারিখ</th>
                      <th className="p-3 text-center">ধরন</th>
                      <th className="p-3">খাত / ক্যাটাগরি</th>
                      <th className="p-3">বিবরণ</th>
                      <th className="p-3 text-right">টাকার পরিমাণ (৳)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ledger.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="p-3 text-slate-600 font-mono">{l.date}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            l.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {l.type === 'income' ? 'আয় (Income)' : 'ব্যয় (Expense)'}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-800">{l.category}</td>
                        <td className="p-3 text-slate-600">{l.description}</td>
                        <td className={`p-3 text-right font-mono font-bold ${
                          l.type === 'income' ? 'text-emerald-800' : 'text-red-700'
                        }`}>
                          {l.type === 'income' ? '+' : '-'} ৳ {l.amount.toLocaleString('bn-BD')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 12: NOTICES & GALLERY */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">নোটিশ বোর্ড ও গ্যালারি মিডিয়া কন্ট্রোল</h3>
                  <p className="text-xs text-slate-500">মাদ্রাসার সকল পরীক্ষা ও ছুটির নোটিশ প্রকাশ করুন</p>
                </div>

                <div className="space-y-3">
                  {notices.map(n => (
                    <div key={n.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-emerald-800 font-bold">{n.date}</span>
                          {n.pinned && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-800 font-bold">পিনকৃত</span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{n.title}</h4>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">প্রকাশিত</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: SECURITY & MASTER PIN */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-xl">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="text-base font-bold text-slate-900">অ্যাডমিন সিকিউরিটি ও মাস্টার পিন (Master PIN)</h3>
                <p className="text-xs text-slate-500">ইউজার আইডি, পাসওয়ার্ড ও গোপন ৬-১১ ডিজিটের মাস্টার পিন পরিবর্তন</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">অ্যাডমিন আইডি (Email) *</label>
                  <input
                    type="email"
                    value={creds.email}
                    onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">গোপন পাসওয়ার্ড * (সর্বদা মাস্কড)</label>
                  <input
                    type="password"
                    value={creds.password}
                    onChange={(e) => setCreds({ ...creds, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    গোপন মাস্টার পিন (Master PIN) * (৬-১১ ডিজিট)
                  </label>
                  <input
                    type="password"
                    minLength={6}
                    maxLength={11}
                    value={creds.masterPin}
                    onChange={(e) => setCreds({ ...creds, masterPin: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-emerald-900 bg-emerald-50/30"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    পাসওয়ার্ড ভুলে গেলে এই মাস্টার পিন দিয়ে তাৎক্ষণিক পাসওয়ার্ড পরিবর্তন করা যায়।
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      storage.saveAdminCredentials(creds);
                      triggerNotification('অ্যাডমিন ক্রেডেনশিয়াল সংরক্ষিত হয়েছে!');
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>ক্রেডেনশিয়াল আপডেট করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* DOCUMENT PRINT MODALS */}
      {printDocumentType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs select-none">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Top Modal Bar (No Print) */}
            <div className="no-print bg-emerald-900 text-white p-4 flex items-center justify-between shrink-0">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-amber-300" />
                <span>
                  {printDocumentType === 'blank_marksheet' && 'ফাঁকা নম্বর ফর্দ (৭টি বিষয়) - অফিশিয়াল প্রিন্ট'}
                  {printDocumentType === 'blank_attendance' && 'ফাঁকা হাজিরা শিট (১-৩১ তারিখ) - অফিশিয়াল প্রিন্ট'}
                  {printDocumentType === 'cashbook' && 'মাসিক ক্যাশবুক আয়-ব্যয় রিপোর্ট - অফিশিয়াল প্রিন্ট'}
                  {printDocumentType === 'teacher_id' && 'অফিশিয়াল শিক্ষক আইডি কার্ড'}
                  {printDocumentType === 'student_id' && 'অফিশিয়াল স্টুডেন্ট আইডি কার্ড (রোল-ই আইডি)'}
                </span>
              </h4>
              <button
                onClick={() => setPrintDocumentType(null)}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Printable Body */}
            <div className="p-6 overflow-y-auto grow">
              {/* 1. Blank Marksheet */}
              {printDocumentType === 'blank_marksheet' && (
                <div className="printable-area p-8 bg-white border-2 border-slate-800 rounded-xl space-y-4">
                  <div className="text-center pb-3 border-b-2 border-slate-800 space-y-1">
                    <p className="text-xs font-bold text-emerald-800">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                    <h2 className="text-xl font-black text-slate-950">{settings.name}</h2>
                    <p className="text-xs text-slate-600">{settings.address} • হটলাইন: {settings.hotline}</p>
                    <div className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-xs rounded mt-1">
                      পরীক্ষার ফাঁকা নম্বর ফর্দ (Tabulation Sheet) - ২০২৬
                    </div>
                  </div>

                  <div className="flex justify-between text-xs font-bold text-slate-800 pb-2">
                    <span>শ্রেণি: .......................................</span>
                    <span>পরীক্ষা: .......................................</span>
                    <span>শিক্ষক: .......................................</span>
                  </div>

                  <table className="w-full text-left text-[11px] border-collapse border border-slate-800">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-800 font-bold text-center">
                        <th className="border-r border-slate-800 p-1.5 w-10">রোল</th>
                        <th className="border-r border-slate-800 p-1.5 text-left w-36">শিক্ষার্থীর নাম</th>
                        {subjects.map(s => (
                          <th key={s.id} className="border-r border-slate-800 p-1.5">{s.name} (১০০)</th>
                        ))}
                        <th className="border-r border-slate-800 p-1.5 w-14">মোট (৭০০)</th>
                        <th className="border-r border-slate-800 p-1.5 w-12">GPA</th>
                        <th className="p-1.5 w-16">মন্তব্য</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 15 }).map((_, i) => (
                        <tr key={i} className="border-b border-slate-400 text-center h-8">
                          <td className="border-r border-slate-800 font-mono font-bold">{i + 1 < 10 ? `0${i + 1}` : i + 1}</td>
                          <td className="border-r border-slate-800 text-left px-2"></td>
                          {subjects.map(s => (
                            <td key={s.id} className="border-r border-slate-800"></td>
                          ))}
                          <td className="border-r border-slate-800"></td>
                          <td className="border-r border-slate-800"></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="pt-10 flex justify-between text-xs font-bold text-slate-800">
                    <span className="border-t border-slate-800 pt-1 w-32 text-center">পরীক্ষকের স্বাক্ষর</span>
                    <span className="border-t border-slate-800 pt-1 w-32 text-center">যাচাইকারীর স্বাক্ষর</span>
                    <span className="border-t border-slate-800 pt-1 w-36 text-center">প্রধান শিক্ষকের স্বাক্ষর</span>
                  </div>
                </div>
              )}

              {/* 2. Blank Attendance Sheet */}
              {printDocumentType === 'blank_attendance' && (
                <div className="printable-area p-8 bg-white border-2 border-slate-800 rounded-xl space-y-4">
                  <div className="text-center pb-3 border-b-2 border-slate-800 space-y-1">
                    <h2 className="text-xl font-black text-slate-950">{settings.name}</h2>
                    <p className="text-xs text-slate-600">{settings.address}</p>
                    <div className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-xs rounded mt-1">
                      শিক্ষার্থীদের দৈনিক হাজিরা খাতা (১ - ৩১ তারিখ)
                    </div>
                  </div>

                  <div className="flex justify-between text-xs font-bold text-slate-800 pb-2">
                    <span>শ্রেণি: .................................</span>
                    <span>মাস: .................................</span>
                    <span>সাল: ২০২৬</span>
                  </div>

                  <table className="w-full text-left text-[10px] border-collapse border border-slate-800">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-800 font-bold text-center">
                        <th className="border-r border-slate-800 p-1 w-8">রোল</th>
                        <th className="border-r border-slate-800 p-1 text-left w-32">শিক্ষার্থীর নাম</th>
                        {Array.from({ length: 31 }).map((_, d) => (
                          <th key={d} className="border-r border-slate-400 p-0.5 w-5">{d + 1}</th>
                        ))}
                        <th className="p-1 w-10">মোট</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 15 }).map((_, i) => (
                        <tr key={i} className="border-b border-slate-400 text-center h-7">
                          <td className="border-r border-slate-800 font-mono font-bold">{i + 1 < 10 ? `0${i + 1}` : i + 1}</td>
                          <td className="border-r border-slate-800 text-left px-1.5 font-semibold"></td>
                          {Array.from({ length: 31 }).map((_, d) => (
                            <td key={d} className="border-r border-slate-400"></td>
                          ))}
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 3. Teacher ID Card Print */}
              {printDocumentType === 'teacher_id' && selectedTeacherForPrint && (
                <div className="printable-area max-w-sm mx-auto p-6 bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl shadow-xl border-4 border-amber-400 text-center space-y-4">
                  <div className="border-b border-emerald-700/60 pb-3">
                    <h3 className="text-base font-black text-amber-300">{settings.name}</h3>
                    <p className="text-[10px] text-emerald-200">{settings.address}</p>
                    <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] uppercase">
                      শিক্ষক পরিচয়পত্র (Teacher ID)
                    </span>
                  </div>

                  <img
                    src={selectedTeacherForPrint.photoUrl}
                    alt={selectedTeacherForPrint.name}
                    className="w-24 h-28 object-cover rounded-2xl mx-auto border-2 border-amber-300 shadow-md"
                  />

                  <div>
                    <h4 className="text-lg font-bold text-white">{selectedTeacherForPrint.name}</h4>
                    <p className="text-xs text-amber-300 font-semibold">{selectedTeacherForPrint.designation}</p>
                    <span className="inline-block text-[11px] font-mono font-bold bg-white/10 px-2.5 py-0.5 rounded-full text-emerald-100 mt-1">
                      আইডি নং: {selectedTeacherForPrint.id}
                    </span>
                  </div>

                  <div className="text-left text-xs bg-white/10 p-3 rounded-2xl space-y-1 text-emerald-100">
                    <div>মোবাইল: <strong className="text-white">{selectedTeacherForPrint.phone}</strong></div>
                    <div>রক্তের গ্রুপ: <strong className="text-amber-300">{selectedTeacherForPrint.bloodGroup || 'A+'}</strong></div>
                    <div>যোগ্যতা: <strong className="text-white">{selectedTeacherForPrint.qualification}</strong></div>
                  </div>

                  <div className="pt-2 flex justify-between items-end text-[10px]">
                    <div className="text-center">
                      <span className="block font-mono text-[9px] text-emerald-200">সিলমোহর</span>
                    </div>
                    <div className="text-center border-t border-white/40 pt-1 w-28">
                      <span className="font-bold text-white">প্রধান শিক্ষক</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Student ID Card Print */}
              {printDocumentType === 'student_id' && selectedStudentForPrint && (
                <div className="printable-area max-w-sm mx-auto p-6 bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl shadow-xl border-4 border-amber-400 text-center space-y-4">
                  <div className="border-b border-emerald-700/60 pb-3">
                    <h3 className="text-base font-black text-amber-300">{settings.name}</h3>
                    <p className="text-[10px] text-emerald-200">{settings.address}</p>
                    <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] uppercase">
                      শিক্ষার্থী পরিচয়পত্র (Student ID)
                    </span>
                  </div>

                  <div className="w-24 h-28 bg-white/10 rounded-2xl mx-auto border-2 border-amber-300 shadow-md flex items-center justify-center font-bold text-3xl text-amber-300 font-mono">
                    {selectedStudentForPrint.roll}
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white">{selectedStudentForPrint.name}</h4>
                    <p className="text-xs text-amber-300 font-semibold">{selectedStudentForPrint.className}</p>
                    <span className="inline-block text-xs font-mono font-bold bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full mt-1">
                      রোল (Student ID): {selectedStudentForPrint.roll}
                    </span>
                  </div>

                  <div className="text-left text-xs bg-white/10 p-3 rounded-2xl space-y-1 text-emerald-100">
                    <div>পিতার নাম: <strong className="text-white">{selectedStudentForPrint.fatherName}</strong></div>
                    <div>মোবাইল: <strong className="text-white">{selectedStudentForPrint.phone}</strong></div>
                    <div>শিক্ষাবর্ষ: <strong className="text-amber-300">{selectedStudentForPrint.academicYear}</strong></div>
                  </div>

                  <div className="pt-2 flex justify-between items-end text-[10px]">
                    <div className="text-center">
                      <span className="block font-mono text-[9px] text-emerald-200">সিলমোহর</span>
                    </div>
                    <div className="text-center border-t border-white/40 pt-1 w-28">
                      <span className="font-bold text-white">প্রধান শিক্ষক</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Modal Actions (No Print) */}
            <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>প্রিন্ট করুন বা PDF ডাউনলোড</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Sync Modal */}
      <GitHubSyncModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings(newSettings)}
        triggerNotification={triggerNotification}
      />
    </div>
  );
};
