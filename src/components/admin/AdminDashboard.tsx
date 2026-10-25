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
  AdminCredentials,
  UploadedRoutineDoc,
  StudentFeeBill,
  FeeItemBreakdown
} from '../../types';
import { storage } from '../../services/storage';
import { githubDataService } from '../../services/githubDataService';
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
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Check,
  X,
  Upload,
  UserCheck,
  Video,
  Play,
  Eye,
  Receipt,
  CreditCard,
  Camera
} from 'lucide-react';
import { toBengaliNum } from '../home/CoursesSection';

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
  const [uploadedRoutines, setUploadedRoutines] = useState<UploadedRoutineDoc[]>(() => storage.getUploadedRoutines());
  const [ledger, setLedger] = useState<LedgerItem[]>(() => storage.getLedger());
  const [notices, setNotices] = useState<NoticeItem[]>(() => storage.getNotices());
  const [gallery, setGallery] = useState<GalleryItem[]>(() => storage.getGallery());
  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => storage.getCertificates());
  const [creds, setCreds] = useState<AdminCredentials>(() => storage.getAdminCredentials());
  const [feeBills, setFeeBills] = useState<StudentFeeBill[]>(() => storage.getFeeBills());

  // Monthly Fee Manager States
  const [feeYear, setFeeYear] = useState('2026');
  const [feeClass, setFeeClass] = useState(classes[0]?.name || 'শিশু শ্রেণি');
  const [feeRoll, setFeeRoll] = useState('');
  const [feeStudentName, setFeeStudentName] = useState('');
  const [feeFatherName, setFeeFatherName] = useState('');
  const [feePhone, setFeePhone] = useState('');
  const [feeMonth, setFeeMonth] = useState('জানুয়ারি');
  const [feeItems, setFeeItems] = useState<FeeItemBreakdown[]>([
    { id: 'item-1', title: 'মাসিক বেতন', amount: 500 },
    { id: 'item-2', title: 'সেশন চার্জ', amount: 200 }
  ]);
  const [feeNotes, setFeeNotes] = useState('মাদ্রাসার হিসাব শাখায় সরাসরি এসে নগদ জমা দিন।');
  const [editingFeeBillId, setEditingFeeBillId] = useState<string | null>(null);

  // Fee List Filter
  const [feeFilterYear, setFeeFilterYear] = useState('2026');
  const [feeFilterClass, setFeeFilterClass] = useState('সকল শ্রেণি');
  const [feeFilterMonth, setFeeFilterMonth] = useState('সকল মাস');
  const [feeSearchQuery, setFeeSearchQuery] = useState('');
  const [selectedFeeBillForPrint, setSelectedFeeBillForPrint] = useState<StudentFeeBill | null>(null);

  // Print Modals & Preview States
  // Print Modals & Preview States
  const [printDocumentType, setPrintDocumentType] = useState<
    'blank_marksheet' | 'blank_attendance' | 'cashbook' | 'teacher_id' | 'student_id' | 'certificate' | 'testimonial' | null
  >(null);
  const [selectedTeacherForPrint, setSelectedTeacherForPrint] = useState<Teacher | null>(null);
  const [selectedStudentForPrint, setSelectedStudentForPrint] = useState<Student | null>(null);

  // Document Generator Filter States
  const [docAcademicYear, setDocAcademicYear] = useState<string>('2026');
  const [docClassId, setDocClassId] = useState<string>(classes[0]?.id || 'class-shishu');
  const [docExamType, setDocExamType] = useState<string>('১ম সাময়িক পরীক্ষা');

  // Attendance Sheet Filter States
  const [docAttendanceYear, setDocAttendanceYear] = useState<string>('2026');
  const [docAttendanceClassId, setDocAttendanceClassId] = useState<string>(classes[0]?.id || 'class-shishu');
  const [docMonth, setDocMonth] = useState<string>('জানুয়ারি');

  // Passing Certificate Generator States (Strictly Annual Exam based)
  const [certYear, setCertYear] = useState<string>('2026');
  const [certClassId, setCertClassId] = useState<string>(classes[0]?.id || 'class-shishu');
  const [certRoll, setCertRoll] = useState<string>('');
  const [certStudent, setCertStudent] = useState<Student | null>(null);
  const [certResult, setCertResult] = useState<ResultRecord | null>(null);

  // Testimonial Generator States (Direct without exam results)
  const [testimonialYear, setTestimonialYear] = useState<string>('2026');
  const [testimonialClassId, setTestimonialClassId] = useState<string>(classes[0]?.id || 'class-shishu');
  const [testimonialRoll, setTestimonialRoll] = useState<string>('');
  const [testimonialStudent, setTestimonialStudent] = useState<Student | null>(null);

  // Lookup Annual Exam result for Passing Certificate
  const handleCertLookup = (year: string, cId: string, rollVal: string) => {
    setCertRoll(rollVal);
    const cleanRoll = rollVal.trim();
    if (!cleanRoll) {
      setCertStudent(null);
      setCertResult(null);
      return;
    }
    const targetClassObj = classes.find(c => c.id === cId);
    const matchedStd = students.find(
      s => s.academicYear === year &&
           (s.classId === cId || (targetClassObj && s.className === targetClassObj.name)) &&
           (s.roll === cleanRoll || s.roll.replace(/^0+/, '') === cleanRoll.replace(/^0+/, ''))
    );
    setCertStudent(matchedStd || null);

    // Strictly lookup Annual Exam result
    const matchedAnnualRes = results.find(
      r => r.academicYear === year &&
           (r.classId === cId || (targetClassObj && r.className === targetClassObj.name)) &&
           (r.roll === cleanRoll || r.roll.replace(/^0+/, '') === cleanRoll.replace(/^0+/, '')) &&
           (r.examType.includes('বার্ষিক') || r.examType.includes('চূড়ান্ত'))
    );
    setCertResult(matchedAnnualRes || null);
  };

  // Lookup Student for Testimonial (No exam result needed)
  const handleTestimonialLookup = (year: string, cId: string, rollVal: string) => {
    setTestimonialRoll(rollVal);
    const cleanRoll = rollVal.trim();
    if (!cleanRoll) {
      setTestimonialStudent(null);
      return;
    }
    const targetClassObj = classes.find(c => c.id === cId);
    const matchedStd = students.find(
      s => s.academicYear === year &&
           (s.classId === cId || (targetClassObj && s.className === targetClassObj.name)) &&
           (s.roll === cleanRoll || s.roll.replace(/^0+/, '') === cleanRoll.replace(/^0+/, ''))
    );
    setTestimonialStudent(matchedStd || null);
  };

  // Student Filter & Management States
  const [studentFilterYear, setStudentFilterYear] = useState('2026');
  const [studentFilterClass, setStudentFilterClass] = useState(classes[0]?.name || 'শিশু শ্রেণি');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [bulkStudentText, setBulkStudentText] = useState('');

  // Single Student Add Form State
  const [newStudentYear, setNewStudentYear] = useState('2026');
  const [newStudentClass, setNewStudentClass] = useState(classes[0]?.name || 'শিশু শ্রেণি');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentFather, setNewStudentFather] = useState('');
  const [newStudentMother, setNewStudentMother] = useState('');
  const [newStudentDob, setNewStudentDob] = useState('2019-01-01');
  const [newStudentBirthReg, setNewStudentBirthReg] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('+880 1816-027456');
  const [newStudentAddress, setNewStudentAddress] = useState('উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম');
  const [newStudentPhoto, setNewStudentPhoto] = useState('');

  // Teacher Form & Edit States
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [newTeacherId, setNewTeacherId] = useState(`TID-${100 + teachers.length + 1}`);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherDesig, setNewTeacherDesig] = useState('সহকারী শিক্ষক');
  const [newTeacherPhone, setNewTeacherPhone] = useState('+880 1816-027456');
  const [newTeacherQual, setNewTeacherQual] = useState('দাওরায়ে হাদিস / কামিল');
  const [newTeacherExp, setNewTeacherExp] = useState('৫ বছর');
  const [newTeacherBlood, setNewTeacherBlood] = useState('O+');
  const [newTeacherPhoto, setNewTeacherPhoto] = useState('');

  // Routine Upload States
  const [routineUploadClass, setRoutineUploadClass] = useState(classes[0]?.name || 'শিশু শ্রেণি');
  const [routineUploadYear, setRoutineUploadYear] = useState('2026');
  const [routineUploadType, setRoutineUploadType] = useState<'class' | 'exam'>('class');
  const [routineUploadExamType, setRoutineUploadExamType] = useState('১ম সাময়িক');

  // Cashbook Form States
  const [ledgerType, setLedgerType] = useState<'income' | 'expense'>('income');
  const [ledgerCategory, setLedgerCategory] = useState('মাসিক বেতন');
  const [ledgerDesc, setLedgerDesc] = useState('');
  const [ledgerAmount, setLedgerAmount] = useState('');

  // Notice & Gallery Add States
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeDate, setNewNoticeDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticePinned, setNewNoticePinned] = useState(false);
  const [newNoticeImage, setNewNoticeImage] = useState('');
  const [newNoticePdf, setNewNoticePdf] = useState('');

  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState('ক্যাম্পাস');
  const [newGalleryType, setNewGalleryType] = useState<'image' | 'video' | 'embed'>('image');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Trigger brief alert toast
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Real-Time Synchronizer for Admin Dashboard (Respects Admin Authority)
  useEffect(() => {
    const handleSync = (e: any) => {
      const detail = e.detail || {};
      // Ignore events dispatched by actions in this local admin session
      if (detail.fromLocalAdmin) return;

      // Selective update if specific module changed from outside
      if (detail.key === 'teachers' && detail.value) {
        setTeachers(detail.value);
        return;
      }
      if (detail.key === 'students' && detail.value) {
        setStudents(detail.value);
        return;
      }
      if (detail.key === 'settings' && detail.value) {
        setSettings(detail.value);
        return;
      }
      if (detail.key === 'fee_bills' && detail.value) {
        setFeeBills(detail.value);
        return;
      }

      // Full refresh only on explicit external GitHub sync
      if (detail.fromGitHub || detail.source === 'manual_pull') {
        setSettings(storage.getSettings());
        setClasses(storage.getClasses());
        setSubjects(storage.getSubjects());
        setTeachers(storage.getTeachers());
        setStudents(storage.getStudents());
        setApplications(storage.getApplications());
        setResults(storage.getResults());
        setClassRoutines(storage.getClassRoutines());
        setExamRoutines(storage.getExamRoutines());
        setUploadedRoutines(storage.getUploadedRoutines());
        setLedger(storage.getLedger());
        setNotices(storage.getNotices());
        setGallery(storage.getGallery());
        setCertificates(storage.getCertificates());
        setFeeBills(storage.getFeeBills());
      }
    };

    window.addEventListener('bs_sync', handleSync);
    return () => window.removeEventListener('bs_sync', handleSync);
  }, []);

  // Master Save Function
  const handleSaveAll = () => {
    const fullDb: Record<string, any> = {
      settings,
      slides: storage.getSlides(),
      shortcuts: storage.getShortcuts(),
      classes,
      subjects,
      exam_types: storage.getExamTypes(),
      teachers,
      students,
      applications,
      results,
      class_routines: classRoutines,
      exam_routines: examRoutines,
      uploaded_routines: uploadedRoutines,
      ledger,
      notices,
      gallery,
      certificates,
      admin_creds: creds,
      fee_bills: feeBills
    };

    storage.saveAll(fullDb);
    triggerNotification('✓ সকল তথ্য ব্রাউজার ও লাইভ ডাটাবেজে সফলভাবে সংরক্ষিত হয়েছে!');

    // Trigger instant commit to GitHub if configured
    try {
      const cfg = githubDataService.getConfig();
      if (cfg.token) {
        githubDataService.commitAndPush(fullDb, `Admin Manual Save: ${new Date().toLocaleTimeString('bn-BD')}`)
          .then((res) => {
            if (res.success) {
              triggerNotification('✓ GitHub ও Vercel-এ সফলভাবে ডাটা সিঙ্ক সম্পন্ন হয়েছে!');
            } else {
              triggerNotification(`⚠️ GitHub পুশ নোটিস: ${res.message}`);
            }
          })
          .catch(() => {});
      }
    } catch {}
  };

  // Fee Management Handlers
  const handleFeeRollChange = (rollVal: string) => {
    setFeeRoll(rollVal);
    const cleanRoll = rollVal.trim();
    if (!cleanRoll) return;

    const matched = students.find(
      s => s.academicYear === feeYear &&
           s.className === feeClass &&
           (s.roll === cleanRoll || s.roll.replace(/^0+/, '') === cleanRoll.replace(/^0+/, ''))
    );
    if (matched) {
      setFeeStudentName(matched.name);
      setFeeFatherName(matched.fatherName || '');
      setFeePhone(matched.phone || '');
    }
  };

  const handleAddFeeItem = () => {
    setFeeItems([
      ...feeItems,
      { id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`, title: '', amount: 0 }
    ]);
  };

  const handleRemoveFeeItem = (id: string) => {
    if (feeItems.length <= 1) {
      alert('কমপক্ষে একটি ফি বিবরণী থাকতে হবে।');
      return;
    }
    setFeeItems(feeItems.filter(i => i.id !== id));
  };

  const handleUpdateFeeItem = (id: string, field: 'title' | 'amount', value: any) => {
    setFeeItems(
      feeItems.map(item => {
        if (item.id === id) {
          return {
            ...item,
            [field]: field === 'amount' ? Number(value) || 0 : value
          };
        }
        return item;
      })
    );
  };

  const handleSaveFeeBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeRoll.trim() || !feeStudentName.trim()) {
      alert('অনুগ্রহ করে শ্রেণি, রোল ও শিক্ষার্থীর নাম প্রদান করুন।');
      return;
    }

    const validItems = feeItems.filter(item => item.title.trim().length > 0);
    if (validItems.length === 0) {
      alert('কমপক্ষে একটি ফি বিবরণী ও টাকার অঙ্ক যোগ করুন।');
      return;
    }

    const totalAmount = validItems.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const currentClassObj = classes.find(c => c.name === feeClass);

    if (editingFeeBillId) {
      const updated = feeBills.map(b => {
        if (b.id === editingFeeBillId) {
          return {
            ...b,
            academicYear: feeYear,
            className: feeClass,
            classId: currentClassObj?.id,
            roll: feeRoll.trim().padStart(2, '0'),
            studentName: feeStudentName.trim(),
            fatherName: feeFatherName.trim(),
            phone: feePhone.trim(),
            month: feeMonth,
            items: validItems,
            totalAmount,
            notes: feeNotes
          };
        }
        return b;
      });
      setFeeBills(updated);
      storage.saveFeeBills(updated);
      setEditingFeeBillId(null);
      triggerNotification(`রশিদ '${feeStudentName}' (${feeMonth}) সফলভাবে আপডেট করা হয়েছে!`);
    } else {
      const newBill: StudentFeeBill = {
        id: `bill-${Date.now()}`,
        billNo: `REC-${feeYear.slice(-2)}${Math.floor(1000 + Math.random() * 9000)}`,
        academicYear: feeYear,
        className: feeClass,
        classId: currentClassObj?.id,
        roll: feeRoll.trim().padStart(2, '0'),
        studentName: feeStudentName.trim(),
        fatherName: feeFatherName.trim(),
        phone: feePhone.trim(),
        month: feeMonth,
        items: validItems,
        totalAmount,
        status: 'unpaid',
        publishDate: new Date().toISOString().split('T')[0],
        notes: feeNotes
      };

      const updated = [newBill, ...feeBills];
      setFeeBills(updated);
      storage.saveFeeBills(updated);
      triggerNotification(`রোল ${feeRoll}-এর '${feeMonth}' মাসের ফি রশিদ সফলভাবে পাবলিশ হয়েছে!`);
    }

    setFeeRoll('');
    setFeeStudentName('');
    setFeeFatherName('');
  };

  const handleEditFeeBill = (bill: StudentFeeBill) => {
    setEditingFeeBillId(bill.id);
    setFeeYear(bill.academicYear);
    setFeeClass(bill.className);
    setFeeRoll(bill.roll);
    setFeeStudentName(bill.studentName);
    setFeeFatherName(bill.fatherName || '');
    setFeePhone(bill.phone || '');
    setFeeMonth(bill.month);
    setFeeItems(bill.items.length > 0 ? bill.items : [{ id: '1', title: 'মাসিক বেতন', amount: bill.totalAmount }]);
    setFeeNotes(bill.notes || 'মাদ্রাসার হিসাব শাখায় সরাসরি এসে নগদ জমা দিন।');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteFeeBill = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে এই ফি রশিদটি মুছে ফেলতে চান?')) {
      const updated = feeBills.filter(b => b.id !== id);
      setFeeBills(updated);
      storage.saveFeeBills(updated);
      triggerNotification('ফি রশিদ সফলভাবে মুছে ফেলা হয়েছে।');
    }
  };

  const handleToggleFeeStatus = (id: string) => {
    const updated = feeBills.map(b => {
      if (b.id === id) {
        const newStatus = b.status === 'unpaid' ? 'paid' : 'unpaid';
        return { ...b, status: newStatus as 'unpaid' | 'paid' };
      }
      return b;
    });
    setFeeBills(updated);
    storage.saveFeeBills(updated);
    triggerNotification('রশিদের স্ট্যাটাস সফলভাবে পরিবর্তিত হয়েছে।');
  };

  // Generic File Upload to Base64
  const handleFileToBase64 = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (base64: string, filename: string, isPdf: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      reader.onload = () => {
        onComplete(reader.result as string, file.name, isPdf);
        triggerNotification(`'${file.name}' সফলভাবে লোড হয়েছে!`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-Promotion Trigger
  const handleRunAutoPromotion = () => {
    if (
      confirm(
        'আপনি কি বার্ষিক মেধা তালিকার ভিত্তিতে সকল ছাত্র-ছাত্রীদের পরবর্তী শ্রেণিতে উত্তীর্ণ করতে চান? এই পদক্ষেপে নতুন মেধা রোল নম্বর বরাদ্দ হবে।'
      )
    ) {
      const { promotedCount } = storage.autoPromoteStudents();
      setStudents(storage.getStudents());
      triggerNotification(`সাফল্যের সাথে ${promotedCount} জন শিক্ষার্থীকে পরবর্তী শ্রেণিতে অটো প্রমোশন দেওয়া হয়েছে!`);
    }
  };

  // 1. Single Student Add Handler
  const handleAddSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentRoll.trim() || !newStudentName.trim()) {
      alert('অনুগ্রহ করে রোল নম্বর এবং শিক্ষার্থীর নাম লিখুন।');
      return;
    }

    const currentClassObj = classes.find(c => c.name === newStudentClass);
    const newStd: Student = {
      id: `std-${Date.now()}-${newStudentRoll}`,
      academicYear: newStudentYear,
      classId: currentClassObj?.id || 'class-shishu',
      className: newStudentClass,
      roll: newStudentRoll.trim(),
      name: newStudentName.trim(),
      fatherName: newStudentFather.trim() || 'অভিভাবক',
      motherName: newStudentMother.trim() || '',
      phone: newStudentPhone.trim(),
      address: newStudentAddress.trim(),
      dob: newStudentDob,
      birthRegNo: newStudentBirthReg.trim(),
      photoUrl: newStudentPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'active',
      hasPaidDues: true
    };

    const updated = [newStd, ...students.filter(s => !(s.academicYear === newStudentYear && s.className === newStudentClass && s.roll === newStudentRoll.trim()))];
    setStudents(updated);
    storage.saveStudents(updated);
    triggerNotification(`শিক্ষার্থী '${newStudentName}' (রোল: ${newStudentRoll}) সফলভাবে যুক্ত হয়েছে!`);

    // Reset roll for next student
    setNewStudentRoll('');
    setNewStudentName('');
    setNewStudentPhoto('');
  };

  // 2. Bulk Students Import (Word / Excel copy-paste parser)
  const handleBulkImportStudents = () => {
    if (!bulkStudentText.trim()) {
      alert('অনুগ্রহ করে এক্সেল বা ওয়ার্ড থেকে কপি করা ডাটা পেস্ট করুন।');
      return;
    }

    const lines = bulkStudentText.split(/\r?\n/).filter(line => line.trim().length > 0);
    const importedList: Student[] = [];
    const currentClassObj = classes.find(c => c.name === studentFilterClass);

    lines.forEach((line, idx) => {
      // Split by tab, pipe, or comma
      const parts = line.includes('\t')
        ? line.split('\t').map(p => p.trim())
        : line.includes(',')
        ? line.split(',').map(p => p.trim())
        : line.split(/\s{2,}/).map(p => p.trim());

      if (parts.length >= 2) {
        const roll = parts[0] || String(idx + 1).padStart(2, '0');
        const name = parts[1] || `শিক্ষার্থী ${roll}`;
        const father = parts[2] || 'অভিভাবক';
        const mother = parts[3] || '';
        const phone = parts[4] || '+880 1816-027456';
        const birthReg = parts[5] || '';

        importedList.push({
          id: `std-bulk-${Date.now()}-${idx}-${roll}`,
          academicYear: studentFilterYear,
          classId: currentClassObj?.id || 'class-shishu',
          className: studentFilterClass,
          roll: roll.padStart(2, '0'),
          name,
          fatherName: father,
          motherName: mother,
          phone,
          address: 'উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম',
          dob: '2019-01-01',
          birthRegNo: birthReg,
          photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
          admissionDate: new Date().toISOString().split('T')[0],
          status: 'active',
          hasPaidDues: true
        });
      }
    });

    if (importedList.length === 0) {
      alert('সঠিক ফরম্যাটে তথ্য পাওয়া যায়নি। প্রতি লাইনে: রোল, নাম, পিতার নাম, মোবাইল দিন।');
      return;
    }

    const merged = [...importedList, ...students];
    setStudents(merged);
    storage.saveStudents(merged);
    setBulkStudentText('');
    triggerNotification(`একসাথে ${importedList.length} জন শিক্ষার্থী সফলভাবে ডাটাবেসে যুক্ত হয়েছে!`);
  };

  // 3. Teacher Add Handler
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) {
      alert('শিক্ষকের নাম দিন।');
      return;
    }

    const t: Teacher = {
      id: newTeacherId.trim() || `TID-${Date.now()}`,
      name: newTeacherName.trim(),
      designation: newTeacherDesig.trim(),
      phone: newTeacherPhone.trim(),
      qualification: newTeacherQual.trim(),
      experience: newTeacherExp.trim(),
      specialist: ['কুরআন ও তাজবীদ', 'ক্যাডেট পাঠ্যক্রম'],
      bloodGroup: newTeacherBlood,
      photoUrl: newTeacherPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    };

    const updated = [t, ...teachers];
    setTeachers(updated);
    storage.saveTeachers(updated);
    triggerNotification(`শিক্ষক '${newTeacherName}' সফলভাবে যুক্ত হয়েছেন!`);

    setNewTeacherName('');
    setNewTeacherPhoto('');
    setNewTeacherId(`TID-${100 + updated.length + 1}`);
  };

  // 4. Routine Direct Photo / PDF Upload Handler
  const handleRoutineUpload = (base64: string, filename: string, isPdf: boolean) => {
    const currentClassObj = classes.find(c => c.name === routineUploadClass);
    const newDoc: UploadedRoutineDoc = {
      id: `rt-doc-${Date.now()}`,
      academicYear: routineUploadYear,
      classId: currentClassObj?.id || 'class-shishu',
      className: routineUploadClass,
      routineType: routineUploadType,
      examType: routineUploadType === 'exam' ? routineUploadExamType : undefined,
      fileData: base64,
      fileName: filename,
      fileType: isPdf ? 'pdf' : 'image',
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newDoc, ...uploadedRoutines];
    setUploadedRoutines(updated);
    storage.saveUploadedRoutines(updated);
    triggerNotification(
      `${routineUploadType === 'class' ? 'ক্লাস' : 'পরীক্ষার'} রুটিন ফাইল '${filename}' সফলভাবে আপলোড হয়েছে!`
    );
  };

  // 5. Cashbook Transaction Add Handler
  const handleAddLedger = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(ledgerAmount.replace(/[^\d]/g, ''));
    if (!numAmount || !ledgerDesc.trim()) {
      alert('অনুগ্রহ করে বিবরণ ও টাকার সঠিক অঙ্ক লিখুন।');
      return;
    }

    const newItem: LedgerItem = {
      id: `led-${Date.now()}`,
      type: ledgerType,
      category: ledgerCategory,
      description: ledgerDesc.trim(),
      amount: numAmount,
      date: new Date().toISOString().split('T')[0],
      academicYear: '2026'
    };

    const updated = [newItem, ...ledger];
    setLedger(updated);
    storage.saveLedger(updated);
    setLedgerDesc('');
    setLedgerAmount('');
    triggerNotification(`৳${numAmount.toLocaleString('bn-BD')} টাকার ${ledgerType === 'income' ? 'আয়' : 'ব্যয়'} হিসাব যুক্ত হয়েছে!`);
  };

  // 6. Notice Add Handler
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim()) {
      alert('নোটিশের শিরোনাম দিন।');
      return;
    }

    const n: NoticeItem = {
      id: `not-${Date.now()}`,
      title: newNoticeTitle.trim(),
      date: newNoticeDate,
      content: newNoticeContent.trim(),
      pinned: newNoticePinned,
      images: newNoticeImage ? [newNoticeImage] : [],
      pdfUrl: newNoticePdf || undefined
    };

    const updated = [n, ...notices];
    setNotices(updated);
    storage.saveNotices(updated);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNewNoticeImage('');
    setNewNoticePdf('');
    triggerNotification('নতুন নোটিশ সফলভাবে প্রকাশিত হয়েছে!');
  };

  // 7. Gallery Add Handler
  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle.trim() || !newGalleryUrl.trim()) {
      alert('শিরোনাম ও ফটো/ভিডিও URL বা ফাইল আপলোড করুন।');
      return;
    }

    const g: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newGalleryTitle.trim(),
      category: newGalleryCategory,
      type: newGalleryType,
      url: newGalleryUrl.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [g, ...gallery];
    setGallery(updated);
    storage.saveGallery(updated);
    setNewGalleryTitle('');
    setNewGalleryUrl('');
    triggerNotification('গ্যালারিতে মিডিয়া সফলভাবে যুক্ত হয়েছে!');
  };

  // Filtered Students for Students Tab
  const filteredStudents = students.filter(
    s => s.academicYear === studentFilterYear && s.className === studentFilterClass
  );

  // Financial Ledger Calculations
  const totalIncome = ledger.filter(l => l.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = ledger.filter(l => l.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const pendingApps = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-amber-400">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white border-b-2 border-amber-500/50 sticky top-0 z-40 shadow-lg px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="লোগো" className="w-10 h-10 object-contain rounded-xl bg-white p-0.5 shadow-md shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg shadow-md shrink-0">
                ম
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-wide text-white truncate max-w-[200px] sm:max-w-none">
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

          <div className="flex items-center gap-2 sm:gap-2.5">
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
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
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
              <span className="font-black text-emerald-800">৳ {netBalance.toLocaleString('bn-BD')}</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <nav className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs space-y-1 text-xs font-bold">
            {[
              { id: 'overview', label: '📊 ড্যাশবোর্ড ওভারভিউ', icon: BarChart3 },
              { id: 'settings', label: '🏛️ প্রতিষ্ঠান সেটিংস ও বাণী', icon: Settings },
              { id: 'fees', label: '🧾 মাসিক ফি অ্যাড ও রশিদ', icon: Receipt },
              { id: 'teachers', label: '👨‍🏫 শিক্ষক ও আইডি কার্ড', icon: Users },
              { id: 'students', label: '🎓 শিক্ষার্থী ও আইডি কার্ড', icon: GraduationCap },
              { id: 'admissions', label: '📝 ভর্তি আবেদন ও e-Verify', icon: UserCheck, badge: pendingApps > 0 ? String(pendingApps) : undefined },
              { id: 'results', label: '📈 রেজাল্ট ও মার্কশিট ইঞ্জিন', icon: FileSpreadsheet },
              { id: 'promotion', label: '🚀 বার্ষিক অটো প্রমোশন', icon: TrendingUp },
              { id: 'routines', label: '📅 ক্লাস ও পরীক্ষার রুটিন', icon: Calendar },
              { id: 'documents', label: '📄 ফাঁকা নম্বর ফর্দ, হাজিরা ও সনদ', icon: FileText },
              { id: 'ledger', label: '💰 আয় ও ব্যয় ক্যাশবুক', icon: DollarSign },
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

        {/* Content Area */}
        <main className="grow min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Institution Welcome Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wide">
                    ২০২৬ শিক্ষাবর্ষ
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black">{settings.name}</h2>
                  <p className="text-xs sm:text-sm text-emerald-100">{settings.subName}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('results')}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-sm transition-colors"
                  >
                    রেজাল্ট প্রস্তুত করুন
                  </button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase">মোট শিক্ষার্থী</span>
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{students.length} জন</div>
                  <span className="text-[11px] text-emerald-700 font-semibold">৪টি সক্রিয় শ্রেণি (শিশু-৩য়)</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase">শিক্ষক মণ্ডলী</span>
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{teachers.length} জন</div>
                  <span className="text-[11px] text-blue-700 font-semibold">মাওলানা তোফাজ্জল হোসেনসহ সকল শিক্ষক</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase">ভর্তি আবেদন</span>
                    <UserCheck className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{pendingApps} টি</div>
                  <span className="text-[11px] text-amber-700 font-semibold">অনলাইন OCR ও ১৭ ডিজিট e-Verify</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase">ক্যাশ ব্যালেন্স</span>
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-800">৳ {netBalance.toLocaleString('bn-BD')}</div>
                  <span className="text-[11px] text-slate-500 font-semibold">মোট আয়: ৳{totalIncome} | ব্যয়: ৳{totalExpense}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SETTINGS & SPEECHES (With Direct Photo/Logo Upload & TikTok) */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-bold text-slate-900">মাদ্রাসার প্রতিষ্ঠান সেটিংস ও বাণী ব্যবস্থাপনা</h2>
                <p className="text-xs text-slate-500">লোগো, প্রতিষ্ঠাতা ও প্রধান শিক্ষকের ছবি, সিলমোহর, স্বাক্ষর ও সোশ্যাল লিংক সম্পাদনা</p>
              </div>

              {/* Institution Identity */}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">উপ-শিরোনাম / ঠিকানা লাইন *</label>
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

              {/* DIRECT PHOTO & LOGO UPLOADS */}
              <div className="border-t border-slate-200 pt-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-800">মাদ্রাসার ছবি, লোগো, সিল ও স্বাক্ষর সরাসরি আপলোড:</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* 1. Madrasah Logo */}
                  <div className="p-4 rounded-2xl border border-slate-200 text-center space-y-3 bg-slate-50">
                    <span className="text-xs font-bold text-slate-800 block">মাদ্রাসার মনোগ্রাম / লোগো</span>
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" className="w-16 h-16 object-contain mx-auto bg-white p-1 rounded-xl shadow-xs" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-200 mx-auto flex items-center justify-center text-xs">ছবি নেই</div>
                    )}
                    <label className="cursor-pointer block px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs">
                      লোগো আপলোড
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileToBase64(e, (b64) => setSettings({ ...settings, logoUrl: b64 }))}
                      />
                    </label>
                  </div>

                  {/* 2. Founder Photo */}
                  <div className="p-4 rounded-2xl border border-slate-200 text-center space-y-3 bg-slate-50">
                    <span className="text-xs font-bold text-slate-800 block">প্রতিষ্ঠাতা ও সভাপতির ছবি</span>
                    {settings.founderPhotoUrl ? (
                      <img src={settings.founderPhotoUrl} alt="Founder" className="w-16 h-16 object-cover object-top mx-auto rounded-xl shadow-xs" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-200 mx-auto flex items-center justify-center text-xs">ছবি নেই</div>
                    )}
                    <label className="cursor-pointer block px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs">
                      ছবি আপলোড
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileToBase64(e, (b64) => setSettings({ ...settings, founderPhotoUrl: b64 }))}
                      />
                    </label>
                  </div>

                  {/* 3. Principal Photo */}
                  <div className="p-4 rounded-2xl border border-slate-200 text-center space-y-3 bg-slate-50">
                    <span className="text-xs font-bold text-slate-800 block">প্রধান শিক্ষক / অধ্যক্ষের ছবি</span>
                    {settings.principalPhotoUrl ? (
                      <img src={settings.principalPhotoUrl} alt="Principal" className="w-16 h-16 object-cover object-top mx-auto rounded-xl shadow-xs" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-200 mx-auto flex items-center justify-center text-xs">ছবি নেই</div>
                    )}
                    <label className="cursor-pointer block px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs">
                      ছবি আপলোড
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileToBase64(e, (b64) => setSettings({ ...settings, principalPhotoUrl: b64 }))}
                      />
                    </label>
                  </div>

                  {/* 4. Institution Seal */}
                  <div className="p-4 rounded-2xl border border-slate-200 text-center space-y-3 bg-slate-50">
                    <span className="text-xs font-bold text-slate-800 block">মাদ্রাসার গোল সিলমোহর</span>
                    {settings.institutionSealUrl ? (
                      <img src={settings.institutionSealUrl} alt="Seal" className="w-16 h-16 object-contain mx-auto" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-200 mx-auto flex items-center justify-center text-xs">সিল নেই</div>
                    )}
                    <label className="cursor-pointer block px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs">
                      সিল আপলোড
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileToBase64(e, (b64) => setSettings({ ...settings, institutionSealUrl: b64 }))}
                      />
                    </label>
                  </div>

                  {/* 5. Principal Signature */}
                  <div className="p-4 rounded-2xl border border-slate-200 text-center space-y-3 bg-slate-50">
                    <span className="text-xs font-bold text-slate-800 block">প্রধান শিক্ষকের ডিজিটাল স্বাক্ষর</span>
                    {settings.signatureUrl ? (
                      <img src={settings.signatureUrl} alt="Signature" className="max-h-12 w-auto object-contain mx-auto" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-200 mx-auto flex items-center justify-center text-xs">স্বাক্ষর নেই</div>
                    )}
                    <label className="cursor-pointer block px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs">
                      স্বাক্ষর আপলোড
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileToBase64(e, (b64) => setSettings({ ...settings, signatureUrl: b64 }))}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Founder and Principal Speeches */}
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

              {/* Social Media Links including TikTok */}
              <div className="border-t border-slate-200 pt-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-800">সোশ্যাল মিডিয়া ও ভিডিও লিংক (ফেসবুক, ইউটিউব, টিকটক):</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ফেসবুক পেজ লিংক</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={settings.facebookUrl}
                      onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ইউটিউব চ্যানেল লিংক</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/..."
                      value={settings.youtubeUrl}
                      onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">টিকটক (TikTok) লিংক</label>
                    <input
                      type="url"
                      placeholder="https://tiktok.com/@..."
                      value={settings.tiktokUrl || ''}
                      onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Section Customization */}
              <div className="border-t border-slate-200 pt-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-800">ফুটার টেক্সট ও কপিরাইট নিয়ন্ত্রণ:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ফুটার পরিচিতি বক্তব্য</label>
                    <textarea
                      rows={2}
                      value={settings.footerText || ''}
                      onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ফুটার কপিরাইট লাইন</label>
                    <input
                      type="text"
                      value={settings.footerCopyright || ''}
                      onChange={(e) => setSettings({ ...settings, footerCopyright: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveAll}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-700"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>সেটিংস পরিবর্তন সংরক্ষণ করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: MONTHLY FEES & BILLS MANAGER */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              
              {/* Add / Edit Fee Bill Form Card */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-1">
                      <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{editingFeeBillId ? 'ফি রশিদ সম্পাদনা' : 'মাসিক ফি নির্ধারণ ও আনপেইড রশিদ পাবলিশ'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {editingFeeBillId ? 'বিদ্যমান ফি রশিদ আপডেট করুন' : 'শিক্ষার্থীর মাসিক ও আনুষঙ্গিক ফি এন্ট্রি করুন'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      শিক্ষাবর্ষ, শ্রেণি, রোল ও মাস নির্ধারণ করে নির্দিষ্ট ফি বিবরণী ও টাকার অঙ্ক যোগ করুন। পাবলিশ করলে মূল ওয়েবসাইট থেকে সরাসরি আনপেইড রশিদটি ডাউনলোড করা যাবে।
                    </p>
                  </div>

                  {editingFeeBillId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFeeBillId(null);
                        setFeeRoll('');
                        setFeeStudentName('');
                        setFeeFatherName('');
                        setFeePhone('');
                        setFeeItems([
                          { id: 'item-1', title: 'মাসিক বেতন', amount: 500 },
                          { id: 'item-2', title: 'সেশন চার্জ', amount: 200 }
                        ]);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
                    >
                      বাতিল করুন
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveFeeBill} className="space-y-5">
                  {/* Basic Info Selection Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Academic Year */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাবর্ষ *</label>
                      <select
                        value={feeYear}
                        onChange={e => setFeeYear(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="2026">২০২৬ শিক্ষাবর্ষ</option>
                        <option value="2025">২০২৫ শিক্ষাবর্ষ</option>
                        <option value="2027">২০২৭ শিক্ষাবর্ষ</option>
                      </select>
                    </div>

                    {/* Class Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি *</label>
                      <select
                        value={feeClass}
                        onChange={e => {
                          setFeeClass(e.target.value);
                          if (feeRoll) handleFeeRollChange(feeRoll);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                      >
                        {classes.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Student Roll & Quick Student Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">রোল নম্বর *</label>
                        {students.filter(s => s.academicYear === feeYear && s.className === feeClass).length > 0 && (
                          <span className="text-[10px] text-emerald-700 font-bold">
                            ({students.filter(s => s.academicYear === feeYear && s.className === feeClass).length} জন ছাত্র)
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          required
                          value={feeRoll}
                          onChange={e => handleFeeRollChange(e.target.value)}
                          placeholder="যেমন: 01"
                          className="w-24 px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                        />
                        <select
                          value={feeRoll}
                          onChange={e => handleFeeRollChange(e.target.value)}
                          className="grow px-2 py-2 rounded-xl border border-slate-200 text-[11px] text-slate-600 bg-slate-50"
                        >
                          <option value="">-- ছাত্র নির্বাচন --</option>
                          {students
                            .filter(s => s.academicYear === feeYear && s.className === feeClass)
                            .map(s => (
                              <option key={s.id} value={s.roll}>
                                রোল {s.roll} - {s.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* Month Selection */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ফি-র মাস *</label>
                      <select
                        value={feeMonth}
                        onChange={e => setFeeMonth(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                      >
                        {[
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
                        ].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Student Details (Auto-filled on roll input) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-900/10">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">শিক্ষার্থীর নাম *</label>
                      <input
                        type="text"
                        required
                        value={feeStudentName}
                        onChange={e => setFeeStudentName(e.target.value)}
                        placeholder="শিক্ষার্থীর পূর্ণ নাম"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">পিতার নাম</label>
                      <input
                        type="text"
                        value={feeFatherName}
                        onChange={e => setFeeFatherName(e.target.value)}
                        placeholder="পিতার নাম"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">অভিভাবকের মোবাইল</label>
                      <input
                        type="text"
                        value={feePhone}
                        onChange={e => setFeePhone(e.target.value)}
                        placeholder="+880 1816-027456"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* Dynamic Line Items Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <span>ফি বিবরণী ও টাকার অঙ্ক নির্ধারণ ({feeItems.length} টি বিবরণী)</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          বিভিন্ন খাত অনুযায়ী টাকার পরিমাণ যুক্ত করুন (যেমন: মাসিক বেতন, সেশন চার্জ, ইত্যাদি)
                        </p>
                      </div>

                      {/* Quick Add Helper Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setFeeItems([...feeItems, { id: `item-${Date.now()}`, title: 'পরীক্ষার ফি', amount: 250 }])}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10px] font-bold"
                        >
                          + পরীক্ষার ফি (২৫০৳)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFeeItems([...feeItems, { id: `item-${Date.now()}`, title: 'আইডি কার্ড ও ডায়েরি', amount: 150 }])}
                          className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 text-[10px] font-bold"
                        >
                          + আইডি ও ডায়েরি (১৫০৳)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFeeItems([...feeItems, { id: `item-${Date.now()}`, title: 'বিদ্যুৎ ও সংস্কার ফি', amount: 100 }])}
                          className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold"
                        >
                          + ইউটিলিটি (১০০৳)
                        </button>
                      </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="space-y-2">
                      {feeItems.map((item, idx) => (
                        <div key={item.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                          <span className="w-6 text-center text-xs font-bold text-slate-400">
                            {idx + 1}.
                          </span>
                          <input
                            type="text"
                            required
                            placeholder="ফি বিবরণীর নাম (যেমন: মাসিক বেতন, পরীক্ষা ফি, ইত্যাদি)"
                            value={item.title}
                            onChange={e => handleUpdateFeeItem(item.id, 'title', e.target.value)}
                            className="grow px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                          />
                          <div className="flex items-center gap-1 w-32 shrink-0">
                            <span className="text-xs font-bold text-slate-500">৳</span>
                            <input
                              type="number"
                              required
                              min="0"
                              placeholder="টাকা"
                              value={item.amount || ''}
                              onChange={e => handleUpdateFeeItem(item.id, 'amount', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-right bg-white"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeeItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={handleAddFeeItem}
                        className="px-3 py-1.5 rounded-xl border border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>আরও ফি বিবরণী যোগ করুন</span>
                      </button>

                      {/* Live Total Calculation */}
                      <div className="bg-emerald-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-3 shadow-xs">
                        <span>সর্বমোট প্রদেয় টাকা:</span>
                        <span className="text-base font-black text-amber-300">
                          ৳ {toBengaliNum(feeItems.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">রশিদের বিশেষ নির্দেশনা / নোট</label>
                    <input
                      type="text"
                      value={feeNotes}
                      onChange={e => setFeeNotes(e.target.value)}
                      placeholder="যেমন: মাদ্রাসার হিসাব শাখায় সরাসরি এসে নগদ জমা দিন।"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                    >
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>{editingFeeBillId ? 'রশিদ আপডেট ও পুনরায় পাবলিশ' : 'ফি রশিদ সংরক্ষণ ও পাবলিশ করুন'}</span>
                    </button>

                    <span className="text-xs text-slate-500">
                      💡 পাবলিশ করার সাথে সাথে মূল ওয়েবসাইটের "মাসিক বেতন ও আনুষঙ্গিক ফি রশিদ" সেকশনে রোল দিয়ে খুঁজলে এই রশিদ পাওয়া যাবে।
                    </span>
                  </div>
                </form>
              </div>

              {/* Published Fee Bills List Card */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      পাবলিশড ফি রশিদ ও বিলসমূহ ({feeBills.length} টি)
                    </h3>
                    <p className="text-xs text-slate-500">
                      শিক্ষার্থীদের জন্য নির্ধারিত সকল ফি রশিদ তালিকা, প্রিভিউ এবং প্রিন্ট
                    </p>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <select
                      value={feeFilterYear}
                      onChange={e => setFeeFilterYear(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold"
                    >
                      <option value="সকল বছর">সকল বছর</option>
                      <option value="2026">২০২৬ শিক্ষাবর্ষ</option>
                      <option value="2025">২০২৫ শিক্ষাবর্ষ</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={feeFilterClass}
                      onChange={e => setFeeFilterClass(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold"
                    >
                      <option value="সকল শ্রেণি">সকল শ্রেণি</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={feeFilterMonth}
                      onChange={e => setFeeFilterMonth(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold"
                    >
                      <option value="সকল মাস">সকল মাস</option>
                      {[
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
                      ].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={feeSearchQuery}
                      onChange={e => setFeeSearchQuery(e.target.value)}
                      placeholder="রোল বা নাম দিয়ে খুঁজুন..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                        <th className="p-2.5 font-bold">রশিদ নং</th>
                        <th className="p-2.5 font-bold">শিক্ষাবর্ষ ও শ্রেণি</th>
                        <th className="p-2.5 font-bold">রোল ও শিক্ষার্থীর নাম</th>
                        <th className="p-2.5 font-bold">ফি-র মাস</th>
                        <th className="p-2.5 font-bold">বিবরণীসমূহ</th>
                        <th className="p-2.5 font-bold text-right">মোট টাকা</th>
                        <th className="p-2.5 font-bold text-center">স্ট্যাটাস</th>
                        <th className="p-2.5 font-bold text-center">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {feeBills
                        .filter(bill => {
                          const matchYear = feeFilterYear === 'সকল বছর' || bill.academicYear === feeFilterYear;
                          const matchClass = feeFilterClass === 'সকল শ্রেণি' || bill.className === feeFilterClass;
                          const matchMonth = feeFilterMonth === 'সকল মাস' || bill.month.includes(feeFilterMonth);
                          const matchSearch =
                            !feeSearchQuery ||
                            bill.studentName.toLowerCase().includes(feeSearchQuery.toLowerCase()) ||
                            bill.roll.includes(feeSearchQuery) ||
                            bill.billNo.includes(feeSearchQuery);
                          return matchYear && matchClass && matchMonth && matchSearch;
                        })
                        .map(bill => (
                          <tr key={bill.id} className="hover:bg-slate-50/80">
                            <td className="p-2.5 font-mono text-slate-600 font-bold">{bill.billNo}</td>
                            <td className="p-2.5">
                              <span className="font-semibold text-slate-900">{bill.className}</span>
                              <span className="block text-[10px] text-slate-400 font-mono">({bill.academicYear})</span>
                            </td>
                            <td className="p-2.5">
                              <span className="font-bold text-emerald-950 block">{bill.studentName}</span>
                              <span className="text-[10px] text-slate-500 font-mono">রোল: {toBengaliNum(bill.roll)}</span>
                            </td>
                            <td className="p-2.5">
                              <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold text-[11px]">
                                {bill.month}
                              </span>
                            </td>
                            <td className="p-2.5 max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {bill.items.map(it => (
                                  <span key={it.id} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                                    {it.title}: ৳{toBengaliNum(it.amount)}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-2.5 text-right font-black text-emerald-900 font-mono text-sm">
                              ৳ {toBengaliNum(bill.totalAmount)}
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleFeeStatus(bill.id)}
                                title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                  bill.status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                }`}
                              >
                                {bill.status === 'paid' ? 'PAID (পরিশোধিত)' : 'UNPAID (বকেয়া)'}
                              </button>
                            </td>
                            <td className="p-2.5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedFeeBillForPrint(bill)}
                                  className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                                  title="রশিদ প্রিভিউ ও প্রিন্ট"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditFeeBill(bill)}
                                  className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                  title="সম্পাদনা করুন"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFeeBill(bill.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: TEACHERS & TEACHER ID CARDS (With Edit, Delete, Photo Upload) */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              
              {/* Add Teacher Form */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">নতুন শিক্ষক যুক্তকরণ ও তথ্য ব্যবস্থাপনা</h3>
                    <p className="text-xs text-slate-500">শিক্ষকের ব্যক্তিগত তথ্য, পদবি এবং সরাসরি ছবি আপলোড করুন</p>
                  </div>
                </div>

                <form onSubmit={handleAddTeacher} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষক আইডি *</label>
                    <input
                      type="text"
                      required
                      value={newTeacherId}
                      onChange={(e) => setNewTeacherId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষকের পূর্ণ নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="মাওলানা ..."
                      value={newTeacherName}
                      onChange={(e) => setNewTeacherName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">পদবি *</label>
                    <select
                      value={newTeacherDesig}
                      onChange={(e) => setNewTeacherDesig(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      <option value="প্রধান শিক্ষক">প্রধান শিক্ষক</option>
                      <option value="সহ-প্রধান শিক্ষক">সহ-প্রধান শিক্ষক</option>
                      <option value="সহকারী শিক্ষক">সহকারী শিক্ষক</option>
                      <option value="হিফজ শিক্ষক">হিফজ শিক্ষক</option>
                      <option value="নূরানী ক্বারী">নূরানী ক্বারী</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      value={newTeacherPhone}
                      onChange={(e) => setNewTeacherPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা</label>
                    <input
                      type="text"
                      value={newTeacherQual}
                      onChange={(e) => setNewTeacherQual(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">অভিজ্ঞতা</label>
                    <input
                      type="text"
                      value={newTeacherExp}
                      onChange={(e) => setNewTeacherExp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
                    <select
                      value={newTeacherBlood}
                      onChange={(e) => setNewTeacherBlood(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="O+">O+</option>
                      <option value="AB+">AB+</option>
                      <option value="A-">A-</option>
                      <option value="B-">B-</option>
                      <option value="O-">O-</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  {/* Direct Photo Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষকের ছবি সরাসরি আপলোড *</label>
                    <label className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-800">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{newTeacherPhoto ? '✓ ছবি লোড হয়েছে' : 'ছবি আপলোড করুন'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileToBase64(e, (b64) => setNewTeacherPhoto(b64))}
                      />
                    </label>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>শিক্ষক যুক্ত করুন</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Teachers List Grid */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">নিবন্ধিত শিক্ষক মণ্ডলীর তালিকা ({teachers.length} জন)</h3>
                  <p className="text-xs text-slate-500">তথ্য সম্পাদনা, ছবি পরিবর্তন ও অফিশিয়াল আইডি কার্ড প্রিন্ট</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teachers.map(t => (
                    <div key={t.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="relative group shrink-0">
                          <img
                            src={t.photoUrl}
                            alt={t.name}
                            className="w-16 h-20 rounded-xl object-cover border border-slate-300"
                          />
                          <label
                            title="ছবি পরিবর্তন করুন"
                            className="absolute inset-0 bg-black/60 text-white text-[9px] font-bold rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                          >
                            <Camera className="w-4 h-4 text-amber-300 mb-0.5" />
                            <span>ছবি পরিবর্তন</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileToBase64(e, (b64) => {
                                  const updated = teachers.map(tc => (tc.id === t.id ? { ...tc, photoUrl: b64 } : tc));
                                  setTeachers(updated);
                                  storage.saveTeachers(updated);
                                  triggerNotification(`'${t.name}'-এর ছবি সফলভাবে আপডেট ও সেভ হয়েছে!`);
                                })
                              }
                            />
                          </label>
                        </div>

                        <div className="grow min-w-0">
                          <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                            ID: {t.id}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-1 truncate">{t.name}</h4>
                          <p className="text-xs text-emerald-800 font-semibold">{t.designation}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{t.phone}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5 truncate">{t.qualification}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedTeacherForPrint(t);
                              setPrintDocumentType('teacher_id');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                          >
                            <Printer className="w-3 h-3 text-amber-300" />
                            <span>আইডি কার্ড</span>
                          </button>

                          <button
                            onClick={() => setEditingTeacher({ ...t })}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1 border border-blue-200"
                            title="সকল তথ্য ও ছবি সম্পাদন করুন"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>এডিট</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`আপনি কি নিশ্চিত যে '${t.name}' শিক্ষককে মুছে ফেলতে চান?`)) {
                                const updated = teachers.filter(tc => tc.id !== t.id);
                                setTeachers(updated);
                                storage.saveTeachers(updated);
                                triggerNotification(`শিক্ষক '${t.name}' মুছে ফেলা হয়েছে!`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-[10px] text-slate-500 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {t.bloodGroup || 'O+'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comprehensive Edit Teacher Modal */}
              {editingTeacher && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 my-8 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900">
                            শিক্ষকের সকল তথ্য ও ছবি সম্পাদন (Edit Profile)
                          </h3>
                          <span className="text-xs text-slate-500 font-mono">
                            Teacher ID: {editingTeacher.id}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingTeacher(null)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Photo Edit Section */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative group shrink-0">
                        <img
                          src={editingTeacher.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                          alt={editingTeacher.name}
                          className="w-24 h-28 object-cover rounded-2xl border-2 border-emerald-700 shadow-md"
                        />
                        <label className="cursor-pointer absolute inset-0 bg-black/60 text-white rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">
                          <Camera className="w-5 h-5 mb-1 text-amber-300" />
                          <span>ছবি পরিবর্তন</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileToBase64(e, (b64) => {
                                setEditingTeacher({ ...editingTeacher, photoUrl: b64 });
                              })
                            }
                          />
                        </label>
                      </div>

                      <div className="grow space-y-2 text-center sm:text-left w-full">
                        <div className="text-xs font-bold text-emerald-950">শিক্ষকের প্রোফাইল ছবি পরিবর্তন ও আপলোড:</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs">
                            <Upload className="w-3.5 h-3.5 text-amber-300" />
                            <span>ডিভাইস বা ফাইল থেকে নতুন ছবি আপলোড</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileToBase64(e, (b64) => {
                                  setEditingTeacher({ ...editingTeacher, photoUrl: b64 });
                                })
                              }
                            />
                          </label>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">অথবা অনলাইন ছবির লিঙ্ক (URL) দিন:</label>
                          <input
                            type="url"
                            value={editingTeacher.photoUrl}
                            onChange={(e) => setEditingTeacher({ ...editingTeacher, photoUrl: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">শিক্ষকের পূর্ণ নাম *</label>
                        <input
                          type="text"
                          required
                          value={editingTeacher.name}
                          onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">পদবি *</label>
                        <select
                          value={editingTeacher.designation}
                          onChange={(e) => setEditingTeacher({ ...editingTeacher, designation: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-emerald-800 bg-white"
                        >
                          <option value="প্রধান শিক্ষক">প্রধান শিক্ষক</option>
                          <option value="সহ-প্রধান শিক্ষক">সহ-প্রধান শিক্ষক</option>
                          <option value="সহকারী শিক্ষক">সহকারী শিক্ষক</option>
                          <option value="হিফজ শিক্ষক">হিফজ শিক্ষক</option>
                          <option value="নূরানী ক্বারী">নূরানী ক্বারী</option>
                          <option value="ক্বারী ও মুয়াল্লিম">ক্বারী ও মুয়াল্লিম</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                        <input
                          type="tel"
                          value={editingTeacher.phone}
                          onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">ইমেইল</label>
                        <input
                          type="email"
                          value={editingTeacher.email || ''}
                          onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                          placeholder="teacher@gmail.com"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা</label>
                        <input
                          type="text"
                          value={editingTeacher.qualification}
                          onChange={(e) => setEditingTeacher({ ...editingTeacher, qualification: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">অভিজ্ঞতা</label>
                        <input
                          type="text"
                          value={editingTeacher.experience}
                          onChange={(e) => setEditingTeacher({ ...editingTeacher, experience: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
                        <select
                          value={editingTeacher.bloodGroup || 'O+'}
                          onChange={(e) => setEditingTeacher({ ...editingTeacher, bloodGroup: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
                        >
                          <option value="A+">A+</option>
                          <option value="B+">B+</option>
                          <option value="O+">O+</option>
                          <option value="AB+">AB+</option>
                          <option value="A-">A-</option>
                          <option value="B-">B-</option>
                          <option value="O-">O-</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">যোগদানের সন / তারিখ</label>
                        <input
                          type="text"
                          value={editingTeacher.joiningDate || ''}
                          onChange={(e) => setEditingTeacher({ ...editingTeacher, joiningDate: e.target.value })}
                          placeholder="২০১৮"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">সংক্ষিপ্ত পরিচিতি / বায়ো</label>
                        <textarea
                          rows={2}
                          value={editingTeacher.bio || ''}
                          onChange={(e) => setEditingTeacher({ ...editingTeacher, bio: e.target.value })}
                          placeholder="শিক্ষকের সংক্ষিপ্ত পরিচিতি..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs resize-none"
                        />
                      </div>
                    </div>

                    {/* Modal Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setEditingTeacher(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        বাতিল
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!editingTeacher.name.trim()) {
                            alert('শিক্ষকের নাম দিন।');
                            return;
                          }
                          const updated = teachers.map(tc => tc.id === editingTeacher.id ? editingTeacher : tc);
                          setTeachers(updated);
                          storage.saveTeachers(updated);
                          triggerNotification(`✅ শিক্ষক '${editingTeacher.name}'-এর সকল তথ্য ও ছবি সফলভাবে সংরক্ষিত হয়েছে!`);
                          setEditingTeacher(null);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4 text-amber-300" />
                        <span>তথ্য ও ছবি সংরক্ষণ করুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: STUDENTS & STUDENT ID CARDS (Single Add, Bulk Paste Box, Filter, Edit, Delete, Photo) */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              
              {/* Single Student Add Box */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    একক শিক্ষার্থী যুক্তকরণ (Student Registration)
                  </h3>
                  <p className="text-xs text-slate-500">
                    শিক্ষাবর্ষ, শ্রেণি, রোল, নাম, পিতা-মাতার নাম, ১৭ ডিজিট জন্ম নিবন্ধন ও শিক্ষার্থীর ছবি সরাসরি আপলোড করুন
                  </p>
                </div>

                <form onSubmit={handleAddSingleStudent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাবর্ষ *</label>
                    <select
                      value={newStudentYear}
                      onChange={(e) => setNewStudentYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      <option value="2026">২০২৬ শিক্ষাবর্ষ</option>
                      <option value="2025">২০২৫ শিক্ষাবর্ষ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি *</label>
                    <select
                      value={newStudentClass}
                      onChange={(e) => setNewStudentClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">রোল নম্বর *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ০১, ০২"
                      value={newStudentRoll}
                      onChange={(e) => setNewStudentRoll(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষার্থীর পূর্ণ নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="নাম বাংলায়"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">পিতার নাম</label>
                    <input
                      type="text"
                      placeholder="পিতার নাম"
                      value={newStudentFather}
                      onChange={(e) => setNewStudentFather(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মাতার নাম</label>
                    <input
                      type="text"
                      placeholder="মাতার নাম"
                      value={newStudentMother}
                      onChange={(e) => setNewStudentMother(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">জন্ম তারিখ</label>
                    <input
                      type="date"
                      value={newStudentDob}
                      onChange={(e) => setNewStudentDob(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">১৭ সংখ্যার জন্ম নিবন্ধন নম্বর</label>
                    <input
                      type="text"
                      maxLength={17}
                      placeholder="২০১৯১৫৯২৩৪৫০০...."
                      value={newStudentBirthReg}
                      onChange={(e) => setNewStudentBirthReg(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">অভিভাবকের মোবাইল</label>
                    <input
                      type="tel"
                      value={newStudentPhone}
                      onChange={(e) => setNewStudentPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ঠিকানা</label>
                    <input
                      type="text"
                      value={newStudentAddress}
                      onChange={(e) => setNewStudentAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  {/* Direct Photo Upload */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষার্থীর ছবি সরাসরি আপলোড</label>
                    <label className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-800">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{newStudentPhoto ? '✓ ছবি লোড সম্পন্ন' : 'সরাসরি ছবি নির্বাচন ও আপলোড করুন'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileToBase64(e, (b64) => setNewStudentPhoto(b64))}
                      />
                    </label>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>শিক্ষার্থী ডাটাবেসে যোগ করুন</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Large Bulk Import Box (Excel / Word Copy-Paste) */}
              <div className="bg-amber-50/60 rounded-3xl border-2 border-dashed border-amber-300 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                      <span>এক্সেল বা ওয়ার্ড (Excel / Word) থেকে একসাথে একাধিক শিক্ষার্থী যুক্তকরণ</span>
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      এক্সেল বা ওয়ার্ড ফাইল থেকে কপি করে সরাসরি নিচের বক্সে পেস্ট করুন (প্রতি লাইনে: রোল, নাম, পিতার নাম, মাতার নাম, মোবাইল, জন্ম নিবন্ধন)
                    </p>
                  </div>
                  <button
                    onClick={handleBulkImportStudents}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xs shrink-0"
                  >
                    এক ক্লিকে সকল শিক্ষার্থী যুক্ত করুন
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={bulkStudentText}
                  onChange={(e) => setBulkStudentText(e.target.value)}
                  placeholder={`০১	মোহাম্মদ আব্দুল্লাহ	মাওলানা কামরুল হাসান	রোকেয়া বেগম	০১৮১৬০২৭৪৫৬	২০১৯১৫৯২৩৪৫০০১২৩৪\n০২	আহমেদ হাসান	মো: রফিকুল ইসলাম	নাজমা বেগম	০১৮১৮১১২২৩৩	২০১৯১৫৯২৩৪৫০০১২৩৫`}
                  className="w-full p-3 rounded-2xl border border-amber-200 bg-white font-mono text-xs text-slate-800 resize-none shadow-inner"
                />
              </div>

              {/* Filtered Students List */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      শিক্ষার্থী ডাটাবেস ও আইডি কার্ড তালিকা ({filteredStudents.length} জন)
                    </h3>
                    <p className="text-xs text-slate-500">
                      শিক্ষাবর্ষ ও শ্রেণি অনুযায়ী শিক্ষার্থীদের তালিকা, তথ্য এডিট, ছবি ও আইডি কার্ড প্রিন্ট
                    </p>
                  </div>

                  {/* Filter Selectors */}
                  <div className="flex items-center gap-2">
                    <select
                      value={studentFilterYear}
                      onChange={(e) => setStudentFilterYear(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      <option value="2026">২০২৬ শিক্ষাবর্ষ</option>
                      <option value="2025">২০২৫ শিক্ষাবর্ষ</option>
                    </select>

                    <select
                      value={studentFilterClass}
                      onChange={(e) => setStudentFilterClass(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-800"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-emerald-50 text-emerald-950 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3 text-center w-16">ছবি</th>
                        <th className="p-3 text-center w-16">রোল</th>
                        <th className="p-3">শিক্ষার্থীর নাম</th>
                        <th className="p-3">শ্রেণি</th>
                        <th className="p-3">পিতার নাম</th>
                        <th className="p-3">মোবাইল</th>
                        <th className="p-3">১৭ ডিজিট জন্ম নিবন্ধন</th>
                        <th className="p-3 text-center w-28">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-slate-400 font-semibold">
                            এই শ্রেণিতে এখনো কোনো শিক্ষার্থী যুক্ত করা হয়নি। উপরের ফরম থেকে যুক্ত করুন।
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map(s => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="p-2.5 text-center">
                              <div className="relative group inline-block">
                                <img
                                  src={s.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                                  alt={s.name}
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-300 mx-auto"
                                />
                                <label className="absolute inset-0 bg-black/60 rounded-xl text-white text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                  পরিবর্তন
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleFileToBase64(e, (b64) => {
                                        const updated = students.map(std => (std.id === s.id ? { ...std, photoUrl: b64 } : std));
                                        setStudents(updated);
                                        storage.saveStudents(updated);
                                        triggerNotification(`'${s.name}'-এর ছবি আপডেট হয়েছে!`);
                                      })
                                    }
                                  />
                                </label>
                              </div>
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-slate-900 bg-slate-50">{s.roll}</td>
                            <td className="p-3 font-bold text-slate-900">{s.name}</td>
                            <td className="p-3 text-emerald-800 font-semibold">{s.className}</td>
                            <td className="p-3 text-slate-600">{s.fatherName}</td>
                            <td className="p-3 font-mono text-slate-700">{s.phone}</td>
                            <td className="p-3 font-mono text-[11px] text-slate-600">{s.birthRegNo || 'প্রযোজ্য নয়'}</td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedStudentForPrint(s);
                                    setPrintDocumentType('student_id');
                                  }}
                                  className="px-2 py-1 rounded-md bg-emerald-800 text-white text-[11px] font-bold shadow-xs hover:bg-emerald-700"
                                  title="আইডি কার্ড"
                                >
                                  ID কার্ড
                                </button>
                                <button
                                  onClick={() => {
                                    const newName = prompt('শিক্ষার্থীর নাম সম্পাদন করুন:', s.name);
                                    if (newName && newName.trim()) {
                                      const newRoll = prompt('রোল নম্বর:', s.roll) || s.roll;
                                      const newFather = prompt('পিতার নাম:', s.fatherName) || s.fatherName;
                                      const newPhone = prompt('মোবাইল নম্বর:', s.phone) || s.phone;
                                      const updated = students.map(std =>
                                        std.id === s.id ? { ...std, name: newName.trim(), roll: newRoll.trim(), fatherName: newFather.trim(), phone: newPhone.trim() } : std
                                      );
                                      setStudents(updated);
                                      storage.saveStudents(updated);
                                      triggerNotification('শিক্ষার্থীর তথ্য সফলভাবে আপডেট হয়েছে!');
                                    }
                                  }}
                                  className="p-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700"
                                  title="সম্পাদনা"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`আপনি কি নিশ্চিত যে '${s.name}' শিক্ষার্থীকে ডাটাবেস থেকে মুছে ফেলতে চান?`)) {
                                      const updated = students.filter(std => std.id !== s.id);
                                      setStudents(updated);
                                      storage.saveStudents(updated);
                                      triggerNotification(`শিক্ষার্থী '${s.name}' মুছে ফেলা হয়েছে!`);
                                    }
                                  }}
                                  className="p-1 rounded-md bg-red-100 hover:bg-red-200 text-red-700"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ADMISSIONS & E-VERIFY */}
          {activeTab === 'admissions' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    অনলাইন ভর্তি আবেদন ও ১৭ ডিজিটের e-Verify তালিকা
                  </h3>
                  <p className="text-xs text-slate-500">
                    অনলাইনে জমাকৃত আবেদনসমূহ পর্যালোচনা ও ১ ক্লিকে রোল বরাদ্দ করে অনুমোদন
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
                        <td className="p-3 text-slate-600 font-mono">{app.phone}</td>
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
                                const classStudents = students.filter(
                                  s => s.className === app.targetClass && s.academicYear === (app.academicYear || '2026')
                                );
                                const nextRollNum = classStudents.length + 1;
                                const formattedRoll = nextRollNum < 10 ? `0${nextRollNum}` : `${nextRollNum}`;

                                const newStudent: Student = {
                                  id: `std-${Date.now()}-${formattedRoll}`,
                                  academicYear: app.academicYear || '2026',
                                  classId: classes.find(c => c.name === app.targetClass)?.id || 'class-shishu',
                                  className: app.targetClass,
                                  roll: formattedRoll,
                                  name: app.applicantName,
                                  fatherName: app.fatherName,
                                  motherName: app.motherName,
                                  phone: app.phone,
                                  address: app.address || 'উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম',
                                  dob: app.dob,
                                  birthRegNo: app.birthRegNo,
                                  photoUrl: app.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
                                  admissionDate: new Date().toISOString().split('T')[0],
                                  status: 'active',
                                  hasPaidDues: true
                                };

                                const updatedStudents = [
                                  newStudent,
                                  ...students.filter(
                                    s => !(s.academicYear === newStudent.academicYear && s.className === newStudent.className && s.roll === formattedRoll)
                                  )
                                ];
                                const updatedApps = applications.map(a => a.id === app.id ? { ...a, status: 'approved' as const } : a);
                                setStudents(updatedStudents);
                                setApplications(updatedApps);
                                storage.saveStudents(updatedStudents);
                                storage.saveApplications(updatedApps);
                                setStudentFilterYear(app.academicYear || '2026');
                                setStudentFilterClass(app.targetClass);
                                triggerNotification(
                                  `✓ আবেদন অনুমোদিত! '${app.applicantName}' (${app.targetClass}) শ্রেণি তালিকায় রোল ${formattedRoll} হিসেবে যুক্ত হয়েছে।`
                                );
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1 mx-auto"
                            >
                              <Check className="w-3.5 h-3.5 text-amber-300" />
                              <span>অনুমোদন</span>
                            </button>
                          )}
                          {app.status === 'approved' && (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  const matched = students.find(
                                    s => (s.name === app.applicantName || s.birthRegNo === app.birthRegNo || s.phone === app.phone) &&
                                         s.className === app.targetClass
                                  );
                                  if (matched) {
                                    setSelectedStudentForPrint(matched);
                                    setPrintDocumentType('student_id');
                                  } else {
                                    setStudentFilterClass(app.targetClass);
                                    setActiveTab('students');
                                  }
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold shadow-xs flex items-center gap-1"
                                title="আইডি কার্ড প্রিন্ট করুন"
                              >
                                <Printer className="w-3 h-3 text-slate-950" />
                                <span>আইডি কার্ড</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: RESULTS & MARKSHEET GENERATOR */}
          {activeTab === 'results' && (
            <ResultGeneratorModule
              classes={classes}
              students={students}
              results={results}
              settings={settings}
              onUpdateResults={(newRes) => setResults(newRes)}
              triggerNotification={triggerNotification}
            />
          )}

          {/* TAB 7: AUTO PROMOTION */}
          {activeTab === 'promotion' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-bold text-slate-900">বার্ষিক ফলাফলভিত্তিক স্বয়ংক্রিয় প্রমোশন ইঞ্জিন</h3>
                <p className="text-xs text-slate-500">
                  বার্ষিক পরীক্ষায় প্রাপ্ত সর্বোচ্চ মোট নম্বরের ভিত্তিতে ১ ক্লিকে পরবর্তী ক্লাসে মেধা স্থান অনুসারে রোল বরাদ্দ
                </p>
              </div>

              <div className="p-5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl shadow-md space-y-3">
                <h4 className="text-sm font-bold text-amber-300">অটো প্রমোশন কার্যাবলী:</h4>
                <ul className="text-xs space-y-2 text-emerald-100 list-disc list-inside">
                  <li>শিশু শ্রেণি উত্তীর্ণ হয়ে ১ম শ্রেণিতে নতুন মেধা রোল পাবে।</li>
                  <li>১ম শ্রেণি উত্তীর্ণ হয়ে ২য় শ্রেণিতে উন্নীত হবে।</li>
                  <li>২য় শ্রেণি উত্তীর্ণ হয়ে ৩য় শ্রেণিতে উন্নীত হবে।</li>
                  <li>৩য় শ্রেণির উত্তীর্ণ শিক্ষার্থীরা সাফল্যের স্মারকসহ গ্র্যাজুয়েট (Alumni) হিসেবে সংরক্ষিত হবে।</li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={handleRunAutoPromotion}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-colors"
                  >
                    🚀 সকল শিক্ষার্থীকে এক ক্লিকে অটো প্রমোশন দিন
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ROUTINES (With Direct Photo/PDF Upload for Class & Exam Routines) */}
          {activeTab === 'routines' && (
            <div className="space-y-6">
              
              {/* Routine File Upload Box */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    ক্লাস ও পরীক্ষার রুটিন সরাসরি ছবি বা পিডিএফ (PDF) আপলোড
                  </h3>
                  <p className="text-xs text-slate-500">
                    শিক্ষাবর্ষ ও শ্রেণি নির্বাচন করে সরাসরি রুটিনের ছবি বা ডকুমেন্ট আপলোড করুন যা ওয়েবসাইটে তাৎক্ষণিক প্রদর্শিত হবে
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">রুটিনের ধরন *</label>
                    <select
                      value={routineUploadType}
                      onChange={(e) => setRoutineUploadType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      <option value="class">ক্লাস রুটিন (Class Routine)</option>
                      <option value="exam">পরীক্ষার রুটিন (Exam Routine)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাবর্ষ *</label>
                    <select
                      value={routineUploadYear}
                      onChange={(e) => setRoutineUploadYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      <option value="2026">২০২৬ শিক্ষাবর্ষ</option>
                      <option value="2025">২০২৫ শিক্ষাবর্ষ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি *</label>
                    <select
                      value={routineUploadClass}
                      onChange={(e) => setRoutineUploadClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {routineUploadType === 'exam' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">পরীক্ষার নাম *</label>
                      <select
                        value={routineUploadExamType}
                        onChange={(e) => setRoutineUploadExamType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                      >
                        <option value="১ম সাময়িক">১ম সাময়িক পরীক্ষা</option>
                        <option value="২য় সাময়িক">২য় সাময়িক পরীক্ষা</option>
                        <option value="বার্ষিক">বার্ষিক চূড়ান্ত পরীক্ষা</option>
                      </select>
                    </div>
                  )}

                  {/* Upload Drop Button */}
                  <div className="sm:col-span-2 lg:col-span-4">
                    <label className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100/50 rounded-2xl transition-colors text-center">
                      <Upload className="w-8 h-8 text-emerald-700 mb-2" />
                      <span className="text-xs font-bold text-emerald-950">
                        {routineUploadClass}-এর {routineUploadType === 'class' ? 'ক্লাস রুটিন' : 'পরীক্ষার রুটিন'} ছবি বা PDF আপলোড করতে ক্লিক করুন
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1">PNG, JPG, JPEG অথবা PDF ফাইল ফরম্যাট সমর্থিত</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => handleFileToBase64(e, handleRoutineUpload)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Uploaded Routines Gallery List */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    আপলোডকৃত রুটিন নথিসমূহ ({uploadedRoutines.length} টি)
                  </h3>
                  <p className="text-xs text-slate-500">ওয়েবসাইটে সংরক্ষিত ক্লাস ও পরীক্ষার সরাসরি রুটিন ডকুমেন্ট</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedRoutines.length === 0 ? (
                    <div className="sm:col-span-3 text-center p-8 text-slate-400 text-xs font-semibold">
                      এখনো কোনো সরাসরি রুটিন ছবি বা PDF আপলোড করা হয়নি। উপরের বক্স থেকে ফাইল নির্বাচন করুন।
                    </div>
                  ) : (
                    uploadedRoutines.map(r => (
                      <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.routineType === 'class' ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {r.routineType === 'class' ? 'ক্লাস রুটিন' : `পরীক্ষার রুটিন (${r.examType || ''})`}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{r.uploadedAt}</span>
                        </div>

                        <div className="text-xs font-bold text-slate-900">
                          {r.className} ({r.academicYear})
                        </div>

                        {/* Preview */}
                        <div className="aspect-video rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center border border-slate-300">
                          {r.fileType === 'pdf' ? (
                            <div className="text-center p-2">
                              <FileText className="w-8 h-8 text-red-600 mx-auto mb-1" />
                              <span className="text-[10px] text-slate-700 font-mono truncate max-w-[150px] block">{r.fileName}</span>
                            </div>
                          ) : (
                            <img src={r.fileData} alt={r.fileName} className="w-full h-full object-cover" />
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                          <a
                            href={r.fileData}
                            download={r.fileName}
                            className="px-3 py-1 rounded bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 hover:bg-emerald-700"
                          >
                            <Download className="w-3 h-3" />
                            <span>ডাউনলোড / ভিউ</span>
                          </a>

                          <button
                            onClick={() => {
                              if (confirm('আপনি কি এই রুটিন ফাইলটি মুছে ফেলতে চান?')) {
                                const updated = uploadedRoutines.filter(u => u.id !== r.id);
                                setUploadedRoutines(updated);
                                storage.saveUploadedRoutines(updated);
                                triggerNotification('রুটিন ডকুমেন্ট মুছে ফেলা হয়েছে!');
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: DOCUMENTS (Blank Marksheet, Blank Attendance Sheet, Passing Certificate, Testimonial) */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    মাদ্রাসার অফিশিয়াল ডকুমেন্টস স্যুট ও সনদপত্র প্রস্তুতকারী
                  </h3>
                  <p className="text-xs text-slate-500">
                    শিক্ষাবর্ষ, শ্রেণি ও পরীক্ষার ধরণভিত্তিক ফাঁকা নম্বর ফর্দ, শিক্ষাবর্ষ ও মাসভিত্তিক ফাঁকা হাজিরা শিট, বার্ষিক পরীক্ষার ফলাফলভিত্তিক উত্তীর্ণ সনদপত্র এবং ফলাফল ছাড়া সরাসরি প্রশংসাপত্র প্রিন্ট করুন
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  
                  {/* 1. Blank Marksheet Card */}
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shadow-xs">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">১. ফাঁকা নম্বর ফর্দ (Blank Marksheet)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        শিক্ষাবর্ষ, শ্রেণি ও পরীক্ষার ধরণ নির্বাচন করে অফলাইনে পরীক্ষকদের নম্বর হাতে তোলার জন্য টেবিলযুক্ত ফাঁকা ফর্দ।
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-emerald-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">১. শিক্ষাবর্ষ নির্বাচন *</label>
                        <select
                          value={docAcademicYear}
                          onChange={(e) => setDocAcademicYear(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                        >
                          <option value="2026">২০২৬ শিক্ষাবর্ষ</option>
                          <option value="2025">২০২৫ শিক্ষাবর্ষ</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">২. শ্রেণি নির্বাচন *</label>
                        <select
                          value={docClassId}
                          onChange={(e) => setDocClassId(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                        >
                          {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">৩. পরীক্ষার ধরন নির্বাচন *</label>
                        <select
                          value={docExamType}
                          onChange={(e) => setDocExamType(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                        >
                          <option value="১ম সাময়িক পরীক্ষা">১ম সাময়িক পরীক্ষা</option>
                          <option value="২য় সাময়িক পরীক্ষা">২য় সাময়িক পরীক্ষা</option>
                          <option value="বার্ষিক চূড়ান্ত মূল্যায়ন পরীক্ষা">বার্ষিক চূড়ান্ত মূল্যায়ন পরীক্ষা</option>
                        </select>
                      </div>

                      <button
                        onClick={() => setPrintDocumentType('blank_marksheet')}
                        className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-emerald-700 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-300" />
                        <span>ফাঁকা নম্বর ফর্দ প্রিন্ট ভিউ</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Blank Attendance Sheet Card */}
                  <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-teal-800 text-amber-300 flex items-center justify-center shadow-xs">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">২. ফাঁকা হাজিরা শিট (Attendance Sheet)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        শিক্ষাবর্ষ, শ্রেণি ও নির্দিষ্ট মাস নির্বাচন করে ১ থেকে ৩১ তারিখ পর্যন্ত রোল ও নামসহ দৈনিক হাজিরা খাতা শিট।
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-teal-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">১. শিক্ষাবর্ষ নির্বাচন *</label>
                        <select
                          value={docAttendanceYear}
                          onChange={(e) => setDocAttendanceYear(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                        >
                          <option value="2026">২০২৬ শিক্ষাবর্ষ</option>
                          <option value="2025">২০২৫ শিক্ষাবর্ষ</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">২. শ্রেণি নির্বাচন *</label>
                        <select
                          value={docAttendanceClassId}
                          onChange={(e) => setDocAttendanceClassId(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                        >
                          {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">৩. মাস নির্বাচন *</label>
                        <select
                          value={docMonth}
                          onChange={(e) => setDocMonth(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                        >
                          <option value="জানুয়ারি">জানুয়ারি</option>
                          <option value="ফেব্রুয়ারি">ফেব্রুয়ারি</option>
                          <option value="মার্চ">মার্চ</option>
                          <option value="এপ্রিল">এপ্রিল</option>
                          <option value="মে">মে</option>
                          <option value="জুন">জুন</option>
                          <option value="জুলাই">জুলাই</option>
                          <option value="আগস্ট">আগস্ট</option>
                          <option value="সেপ্টেম্বর">সেপ্টেম্বর</option>
                          <option value="অক্টোবর">অক্টোবর</option>
                          <option value="নভেম্বর">নভেম্বর</option>
                          <option value="ডিসেম্বর">ডিসেম্বর</option>
                        </select>
                      </div>

                      <button
                        onClick={() => setPrintDocumentType('blank_attendance')}
                        className="w-full py-2.5 rounded-xl bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:bg-teal-700 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-300" />
                        <span>হাজিরা শিট প্রিন্ট ভিউ</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Certificate of Achievement (বার্ষিক পরীক্ষার ফলাফলভিত্তিক উত্তীর্ণ সনদপত্র) */}
                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-700 text-amber-200 flex items-center justify-center shadow-xs">
                        <Award className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">৩. উত্তীর্ণ সনদপত্র (Passing Certificate)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        একমাত্র <b>বার্ষিক চূড়ান্ত পরীক্ষা</b>র ফলাফল থাকলে জেনারেট হবে। মেধা স্থান (বর্তমান রোল), জিপিএ ও গ্রেড স্বয়ংক্রিয়ভাবে সনদে বসবে।
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-amber-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">১. শিক্ষাবর্ষ *</label>
                        <select
                          value={certYear}
                          onChange={(e) => {
                            setCertYear(e.target.value);
                            handleCertLookup(e.target.value, certClassId, certRoll);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                        >
                          <option value="2026">২০২৬ শিক্ষাবর্ষ</option>
                          <option value="2025">২০২৫ শিক্ষাবর্ষ</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">২. শ্রেণি নির্বাচন *</label>
                        <select
                          value={certClassId}
                          onChange={(e) => {
                            setCertClassId(e.target.value);
                            handleCertLookup(certYear, e.target.value, certRoll);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                        >
                          {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">৩. শিক্ষার্থীর রোল নম্বর *</label>
                        <input
                          type="text"
                          placeholder="রোল দিন (যেমন: 01)"
                          value={certRoll}
                          onChange={(e) => handleCertLookup(certYear, certClassId, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold font-mono bg-white"
                        />
                      </div>

                      {/* Status feedback */}
                      {certRoll.trim() && (
                        certStudent ? (
                          certResult ? (
                            <div className="p-2.5 bg-emerald-100/90 rounded-xl border border-emerald-300 text-[11px] text-emerald-950 space-y-0.5">
                              <div className="font-bold flex items-center gap-1 text-emerald-900">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                <span>{certStudent.name} (বার্ষিক ফলাফল প্রাপ্ত)</span>
                              </div>
                              <div>পিতা: {certStudent.fatherName}</div>
                              <div className="font-mono text-[10px]">
                                বর্তমান রোল/স্থান: <b>{toBengaliNum(certResult.rank)}ম</b> | GPA: <b>{certResult.gpa.toFixed(2)}</b> ({certResult.grade})
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 bg-red-50 rounded-xl border border-red-300 text-[11px] text-red-900 space-y-1">
                              <div className="font-bold flex items-center gap-1 text-red-800">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>বার্ষিক পরীক্ষার ফলাফল পাওয়া যায়নি!</span>
                              </div>
                              <p className="text-[10px] text-red-700 leading-tight">
                                উত্তীর্ণ সনদপত্র একমাত্র <b>বার্ষিক চূড়ান্ত পরীক্ষার ফলাফল</b> থাকলে তৈরি হবে। 'ফলাফল ও মার্কশিট' থেকে বার্ষিক পরীক্ষার ফলাফল যুক্ত করুন।
                              </p>
                            </div>
                          )
                        ) : (
                          <div className="p-2 bg-slate-100 rounded-lg text-[10px] text-slate-600">
                            রোল {certRoll} অনুযায়ী কোনো শিক্ষার্থী পাওয়া যায়নি।
                          </div>
                        )
                      )}

                      <button
                        onClick={() => {
                          if (!certRoll.trim()) {
                            alert('অনুগ্রহ করে শিক্ষার্থীর রোল নম্বর দিন।');
                            return;
                          }
                          if (!certResult) {
                            alert('বার্ষিক পরীক্ষার ফলাফল ছাড়া উত্তীর্ণ সনদপত্র তৈরি করা যাবে না। অনুগ্রহ করে আগে বার্ষিক পরীক্ষার ফলাফল এন্ট্রি করুন।');
                            return;
                          }
                          setPrintDocumentType('certificate');
                        }}
                        disabled={!certResult}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors ${
                          certResult
                            ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>উত্তীর্ণ সনদপত্র ডাউনলোড ও প্রিন্ট</span>
                      </button>
                    </div>
                  </div>

                  {/* 4. Testimonial (প্রশংসাপত্র - কোনো ফলাফল ছাড়া সরাসরি) */}
                  <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-indigo-900 text-amber-300 flex items-center justify-center shadow-xs">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">৪. প্রশংসাপত্র (Testimonial)</h4>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-200 text-indigo-900">সরাসরি</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        কোনো পরীক্ষার ফলাফল ছাড়াই সরাসরি অধ্যয়নরত সকল শিক্ষার্থীদের মাদ্রাসার অফিশিয়াল প্রশংসাপত্র ও চারিত্রিক প্রত্যয়নপত্র প্রিন্ট করুন।
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-indigo-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">১. শিক্ষাবর্ষ *</label>
                        <select
                          value={testimonialYear}
                          onChange={(e) => {
                            setTestimonialYear(e.target.value);
                            handleTestimonialLookup(e.target.value, testimonialClassId, testimonialRoll);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                        >
                          <option value="2026">২০২৬ শিক্ষাবর্ষ</option>
                          <option value="2025">২০২৫ শিক্ষাবর্ষ</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">২. শ্রেণি নির্বাচন *</label>
                        <select
                          value={testimonialClassId}
                          onChange={(e) => {
                            setTestimonialClassId(e.target.value);
                            handleTestimonialLookup(testimonialYear, e.target.value, testimonialRoll);
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                        >
                          {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">৩. শিক্ষার্থীর রোল নম্বর *</label>
                        <input
                          type="text"
                          placeholder="রোল দিন (যেমন: 01)"
                          value={testimonialRoll}
                          onChange={(e) => handleTestimonialLookup(testimonialYear, testimonialClassId, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold font-mono bg-white"
                        />
                      </div>

                      {/* Student Preview */}
                      {testimonialRoll.trim() && (
                        testimonialStudent ? (
                          <div className="p-2.5 bg-indigo-100/80 rounded-xl border border-indigo-300 text-[11px] text-indigo-950 space-y-0.5">
                            <div className="font-bold flex items-center gap-1 text-indigo-900">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span>{testimonialStudent.name}</span>
                            </div>
                            <div>পিতা: {testimonialStudent.fatherName}</div>
                            <div>মাতা: {testimonialStudent.motherName || 'অভিভাবিকা'}</div>
                            <div className="text-[10px] text-indigo-800 truncate">ঠিকানা: {testimonialStudent.address || 'উত্তর ওয়াহেদপুর'}</div>
                          </div>
                        ) : (
                          <div className="p-2 bg-slate-100 rounded-lg text-[10px] text-slate-600">
                            রোল {testimonialRoll} অনুযায়ী কোনো শিক্ষার্থী পাওয়া যায়নি।
                          </div>
                        )
                      )}

                      <button
                        onClick={() => {
                          if (!testimonialRoll.trim()) {
                            alert('অনুগ্রহ করে শিক্ষার্থীর রোল নম্বর দিন।');
                            return;
                          }
                          if (!testimonialStudent) {
                            alert('প্রদত্ত রোল ও শ্রেণিতে কোনো শিক্ষার্থী পাওয়া যায়নি। সঠিক রোল নম্বর দিন।');
                            return;
                          }
                          setPrintDocumentType('testimonial');
                        }}
                        disabled={!testimonialStudent}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors ${
                          testimonialStudent
                            ? 'bg-indigo-900 hover:bg-indigo-800 text-white cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Printer className="w-3.5 h-3.5 text-amber-300" />
                        <span>প্রশংসাপত্র ডাউনলোড ও প্রিন্ট</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 10: CASHBOOK & FINANCIAL STATEMENT */}
          {activeTab === 'ledger' && (
            <div className="space-y-6">
              
              {/* Financial Add Form */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      আয় ও ব্যয় ক্যাশবুক হিসাব ভুক্তি (Cashbook Entry)
                    </h3>
                    <p className="text-xs text-slate-500">
                      ১. আয় অথবা ব্যয় নির্বাচন করুন, ২. বিবরণ দিন, ৩. টাকার পরিমাণ যোগ করে সংরক্ষণ করুন
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddLedger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">লেনদেনের ধরন *</label>
                    <select
                      value={ledgerType}
                      onChange={(e) => setLedgerType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      <option value="income">🟢 আয় (Income)</option>
                      <option value="expense">🔴 ব্যয় (Expense)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">খাত / বিবরণী ক্যাটাগরি *</label>
                    <select
                      value={ledgerCategory}
                      onChange={(e) => setLedgerCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      {ledgerType === 'income' ? (
                        <>
                          <option value="ভর্তি ফি">ভর্তি ফি</option>
                          <option value="মাসিক বেতন">মাসিক বেতন</option>
                          <option value="পরীক্ষা ফি">পরীক্ষা ফি</option>
                          <option value="অনুদান ও সাহায্য">অনুদান ও সাহায্য</option>
                          <option value="অন্যান্য আয়">অন্যান্য আয়</option>
                        </>
                      ) : (
                        <>
                          <option value="শিক্ষক বেতন">শিক্ষক বেতন</option>
                          <option value="অফিস ও স্টেশনারি">অফিস ও স্টেশনারি</option>
                          <option value="বিদ্যুৎ ও ইউটিলিটি">বিদ্যুৎ ও ইউটিলিটি</option>
                          <option value="মেরামত ও সংস্কার">মেরামত ও সংস্কার</option>
                          <option value="অনুষ্ঠান ও পুরস্কার">অনুষ্ঠান ও পুরস্কার</option>
                          <option value="অন্যান্য ব্যয়">অন্যান্য ব্যয়</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">বিবরণ (Description) *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ৩য় শ্রেণির বেতন বাবদ..."
                      value={ledgerDesc}
                      onChange={(e) => setLedgerDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">টাকার পরিমাণ (৳) *</label>
                    <input
                      type="text"
                      required
                      placeholder="টাকার অঙ্ক (যেমন: ৫০০)"
                      value={ledgerAmount}
                      onChange={(e) => setLedgerAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-emerald-800"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 pt-1">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>{ledgerType === 'income' ? 'আয় যুক্ত করুন' : 'ব্যয় যুক্ত করুন'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Financial Balance Summary Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
                  <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">সর্বমোট অর্জিত আয়</span>
                  <div className="text-2xl font-black text-emerald-950 font-mono">৳ {totalIncome.toLocaleString('bn-BD')}</div>
                </div>

                <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl">
                  <span className="text-xs font-bold text-rose-800 uppercase block mb-1">সর্বমোট খরচ / ব্যয়</span>
                  <div className="text-2xl font-black text-rose-950 font-mono">৳ {totalExpense.toLocaleString('bn-BD')}</div>
                </div>

                <div className="bg-teal-50 border border-teal-200 p-5 rounded-2xl">
                  <span className="text-xs font-bold text-teal-800 uppercase block mb-1">বর্তমান আর্থিক স্থিতি (ব্যালেন্স)</span>
                  <div className="text-2xl font-black text-teal-950 font-mono">৳ {netBalance.toLocaleString('bn-BD')}</div>
                </div>
              </div>

              {/* Ledger Transactions Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">লেনদেন বিবরণী খতিয়ান ({ledger.length} টি)</h3>
                    <p className="text-xs text-slate-500">মাদ্রাসার অফিসিয়াল ক্যাশবুক আয়-ব্যয় রেকর্ড</p>
                  </div>
                  <button
                    onClick={() => setPrintDocumentType('cashbook')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>ক্যাশবুক রিপোর্ট প্রিন্ট</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-emerald-50 text-emerald-950 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">তারিখ</th>
                        <th className="p-3 text-center">ধরন</th>
                        <th className="p-3">খাত</th>
                        <th className="p-3">বিবরণ</th>
                        <th className="p-3 text-right">পরিমাণ (৳)</th>
                        <th className="p-3 text-center w-16">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ledger.map(l => (
                        <tr key={l.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-slate-600">{l.date}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              l.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {l.type === 'income' ? 'আয়' : 'ব্যয়'}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-800">{l.category}</td>
                          <td className="p-3 text-slate-700">{l.description}</td>
                          <td className={`p-3 text-right font-mono font-bold ${
                            l.type === 'income' ? 'text-emerald-800' : 'text-rose-800'
                          }`}>
                            {l.type === 'income' ? '+' : '-'} ৳{l.amount.toLocaleString('bn-BD')}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                if (confirm('আপনি কি এই লেনদেনটি মুছে ফেলতে চান?')) {
                                  const updated = ledger.filter(item => item.id !== l.id);
                                  setLedger(updated);
                                  storage.saveLedger(updated);
                                  triggerNotification('লেনদেন রেকর্ড মুছে ফেলা হয়েছে!');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

          {/* TAB 11: NOTICES & PHOTO/VIDEO GALLERY */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              
              {/* Notice Publish Box */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    নতুন নোটিশ প্রকাশ (ছবি ও PDF আপলোডসহ)
                  </h3>
                  <p className="text-xs text-slate-500">
                    মাদ্রাসার পরীক্ষা, ভর্তি ও ছুটির বিজ্ঞপ্তি তৈরি ও সরাসরি ইমেজ/পিডিএফ ফাইল আপলোড
                  </p>
                </div>

                <form onSubmit={handleAddNotice} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশের শিরোনাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: পবিত্র মাহে রমজান ও ঈদুল ফিতরের ছুটির নোটিশ..."
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">তারিখ *</label>
                    <input
                      type="date"
                      value={newNoticeDate}
                      onChange={(e) => setNewNoticeDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশের বিস্তারিত বক্তব্য</label>
                    <textarea
                      rows={3}
                      value={newNoticeContent}
                      onChange={(e) => setNewNoticeContent(e.target.value)}
                      placeholder="নোটিশের বিস্তারিত বার্তা লিখুন..."
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs resize-none"
                    />
                  </div>

                  {/* Direct Image Upload for Notice */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশ ছবি সরাসরি আপলোড</label>
                    <label className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-800">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{newNoticeImage ? '✓ ছবি লোড হয়েছে' : 'ছবি নির্বাচন করুন'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileToBase64(e, (b64) => setNewNoticeImage(b64))}
                      />
                    </label>
                  </div>

                  {/* Direct PDF Upload for Notice */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশ PDF সরাসরি আপলোড</label>
                    <label className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-800">
                      <FileText className="w-3.5 h-3.5 text-red-600" />
                      <span>{newNoticePdf ? '✓ PDF ফাইল লোড হয়েছে' : 'PDF নির্বাচন করুন'}</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => handleFileToBase64(e, (b64) => setNewNoticePdf(b64))}
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="pinNotice"
                      checked={newNoticePinned}
                      onChange={(e) => setNewNoticePinned(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-800"
                    />
                    <label htmlFor="pinNotice" className="text-xs font-bold text-slate-800 cursor-pointer">
                      জরুরি বিজ্ঞপ্তি হিসেবে পিন করুন
                    </label>
                  </div>

                  <div className="sm:col-span-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>নোটিশ প্রকাশ করুন</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Gallery Media Add Box (Image, Video, Social Video Embed) */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    গ্যালারি মিডিয়া আপলোড (ছবি, ভিডিও ও সোশ্যাল মিডিয়া লিংক)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ক্যাম্পাসের ছবি ও ভিডিও সরাসরি আপলোড করুন অথবা ইউটিউব/ফেসবুক ভিডিও লিংক যুক্ত করুন
                  </p>
                </div>

                <form onSubmit={handleAddGallery} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মিডিয়ার শিরোনাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: পুরস্কার বিতরণী অনুষ্ঠান ২০২৬"
                      value={newGalleryTitle}
                      onChange={(e) => setNewGalleryTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                    <select
                      value={newGalleryCategory}
                      onChange={(e) => setNewGalleryCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      <option value="ক্যাম্পাস">ক্যাম্পাস</option>
                      <option value="অনুষ্ঠান">অনুষ্ঠান</option>
                      <option value="ক্লাসরুম">ক্লাসরুম</option>
                      <option value="পুরস্কার">পুরস্কার</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">মিডিয়ার ধরন *</label>
                    <select
                      value={newGalleryType}
                      onChange={(e) => setNewGalleryType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      <option value="image">ছবি (Image)</option>
                      <option value="video">ভিডিও ফাইল (Direct Video MP4)</option>
                      <option value="embed">সোশ্যাল মিডিয়া ভিডিও (YouTube/Facebook)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {newGalleryType === 'embed' ? 'সোশ্যাল ভিডিও URL (YouTube/FB)' : 'সরাসরি ফাইল আপলোড'}
                    </label>
                    {newGalleryType === 'embed' ? (
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/embed/..."
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    ) : (
                      <label className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-800">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{newGalleryUrl ? '✓ ফাইল লোড হয়েছে' : 'ফাইল নির্বাচন করুন'}</span>
                        <input
                          type="file"
                          accept={newGalleryType === 'image' ? 'image/*' : 'video/*'}
                          className="hidden"
                          onChange={(e) => handleFileToBase64(e, (b64) => setNewGalleryUrl(b64))}
                        />
                      </label>
                    )}
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 pt-1">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-amber-300" />
                      <span>গ্যালারিতে যুক্ত করুন</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Gallery Items Grid */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">গ্যালারি আইটেমস ({gallery.length} টি)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {gallery.map(g => (
                    <div key={g.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
                        {g.type === 'image' ? (
                          <img src={g.url} alt={g.title} className="w-full h-full object-cover" />
                        ) : g.url.includes('embed') ? (
                          <iframe src={g.url} title={g.title} className="w-full h-full" allowFullScreen />
                        ) : (
                          <video src={g.url} controls className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">{g.title}</span>
                        <button
                          onClick={() => {
                            if (confirm('আপনি কি এই মিডিয়াটি মুছে ফেলতে চান?')) {
                              const updated = gallery.filter(item => item.id !== g.id);
                              setGallery(updated);
                              storage.saveGallery(updated);
                              triggerNotification('মিডিয়া মুছে ফেলা হয়েছে!');
                            }
                          }}
                          className="p-1 rounded text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: SECURITY & MASTER PIN */}
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

      {/* DOCUMENT PRINT MODALS (Blank Marksheet, Attendance Sheet, Cashbook, ID Cards, Certificates) */}
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
                  {printDocumentType === 'certificate' && 'বার্ষিক উত্তীর্ণ সনদপত্র - অফিশিয়াল প্রিন্ট'}
                  {printDocumentType === 'testimonial' && 'মাদ্রাসার অফিশিয়াল প্রশংসাপত্র (Testimonial) - অফিশিয়াল প্রিন্ট'}
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
              
              {/* 1. Blank Marksheet (৭টি বিষয়) */}
              {printDocumentType === 'blank_marksheet' && (() => {
                const blankClassObj = classes.find(c => c.id === docClassId);
                const rosterStudents = students.filter(
                  s => s.academicYear === docAcademicYear &&
                       (s.classId === docClassId || (blankClassObj && s.className === blankClassObj.name))
                ).sort((a, b) => Number(a.roll) - Number(b.roll));
                const maxRosterRows = Math.max(15, rosterStudents.length);

                return (
                  <div className="printable-area p-8 bg-white border-2 border-slate-800 rounded-xl space-y-4">
                    <div className="text-center pb-3 border-b-2 border-slate-800 space-y-1">
                      <p className="text-xs font-bold text-emerald-800 font-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                      <h2 className="text-xl font-black text-slate-950">{settings.name}</h2>
                      <p className="text-xs text-slate-600">{settings.address} • হটলাইন: {settings.hotline}</p>
                      <div className="inline-block mt-2 px-4 py-1 bg-slate-900 text-white font-bold text-xs rounded-full">
                        ফাঁকা নম্বর ফর্দ ও মূল্যায়ন শিট (নম্বর এন্ট্রি কপি)
                      </div>
                    </div>

                    <div className="flex justify-between text-xs font-bold text-slate-800 py-1">
                      <span>শ্রেণি: {blankClassObj?.name || 'শিশু শ্রেণি'}</span>
                      <span>পরীক্ষা: {docExamType}</span>
                      <span>শিক্ষাবর্ষ: {toBengaliNum(docAcademicYear)}</span>
                      <span>পূর্ণমান: ৭০০ (৭টি বিষয়)</span>
                    </div>

                    <table className="w-full border-collapse border border-slate-800 text-[11px]">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-800">
                          <th className="border border-slate-800 p-2 text-center w-12">রোল</th>
                          <th className="border border-slate-800 p-2 text-left w-44">শিক্ষার্থীর নাম</th>
                          {subjects.map(s => (
                            <th key={s.id} className="border border-slate-800 p-1.5 text-center leading-tight">
                              {s.name}
                              <span className="block font-normal text-[9px]">(১০০)</span>
                            </th>
                          ))}
                          <th className="border border-slate-800 p-2 text-center w-16">মোট প্রাপ্ত</th>
                          <th className="border border-slate-800 p-2 text-center w-14">মেধা স্থান</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: maxRosterRows }).map((_, i) => {
                          const std = rosterStudents[i];
                          return (
                            <tr key={i} className="h-8">
                              <td className="border border-slate-800 text-center font-bold font-mono">
                                {std ? std.roll : toBengaliNum(i + 1 < 10 ? `0${i + 1}` : `${i + 1}`)}
                              </td>
                              <td className="border border-slate-800 px-2 font-medium">
                                {std ? std.name : ''}
                              </td>
                              {subjects.map(s => (
                                <td key={s.id} className="border border-slate-800 text-center"></td>
                              ))}
                              <td className="border border-slate-800 text-center font-mono font-bold"></td>
                              <td className="border border-slate-800 text-center font-bold"></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="pt-8 flex justify-between text-xs font-bold text-slate-900">
                      <span className="border-t border-slate-800 pt-1">পরীক্ষকের স্বাক্ষর</span>
                      <span className="border-t border-slate-800 pt-1">সহ-প্রধান শিক্ষকের স্বাক্ষর</span>
                      <span className="border-t border-slate-800 pt-1">প্রধান শিক্ষকের অনুমোদন ও সিল</span>
                    </div>
                  </div>
                );
              })()}

              {/* 2. Blank Attendance Sheet (১-৩১ তারিখ) */}
              {printDocumentType === 'blank_attendance' && (() => {
                const attClassObj = classes.find(c => c.id === docAttendanceClassId);
                const attStudents = students.filter(
                  s => s.academicYear === docAttendanceYear &&
                       (s.classId === docAttendanceClassId || (attClassObj && s.className === attClassObj.name))
                ).sort((a, b) => Number(a.roll) - Number(b.roll));
                const maxAttRows = Math.max(15, attStudents.length);

                return (
                  <div className="printable-area p-8 bg-white border-2 border-slate-800 rounded-xl space-y-4">
                    <div className="text-center pb-2 border-b-2 border-slate-800 space-y-1">
                      <p className="text-xs font-bold text-emerald-800 font-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                      <h2 className="text-xl font-black text-slate-950">{settings.name}</h2>
                      <p className="text-xs text-slate-600">{settings.address}</p>
                      <div className="inline-block px-4 py-1 bg-slate-900 text-white font-bold text-xs rounded-full">
                        শিক্ষার্থীদের দৈনিক উপস্থিতি হাজিরা খাতা (১ - ৩১ তারিখ)
                      </div>
                    </div>

                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>শ্রেণি: {attClassObj?.name || 'শিশু শ্রেণি'}</span>
                      <span>মাস: {docMonth}</span>
                      <span>শিক্ষাবর্ষ: {toBengaliNum(docAttendanceYear)}</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-800 text-[10px]">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border border-slate-800 p-1 text-center w-8">রোল</th>
                            <th className="border border-slate-800 p-1 text-left w-36">নাম</th>
                            {Array.from({ length: 31 }).map((_, d) => (
                              <th key={d} className="border border-slate-800 p-0.5 text-center w-5">
                                {d + 1}
                              </th>
                            ))}
                            <th className="border border-slate-800 p-1 text-center w-8">মোট</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: maxAttRows }).map((_, i) => {
                            const std = attStudents[i];
                            return (
                              <tr key={i} className="h-6">
                                <td className="border border-slate-800 text-center font-mono font-bold">
                                  {std ? std.roll : toBengaliNum(i + 1 < 10 ? `0${i + 1}` : `${i + 1}`)}
                                </td>
                                <td className="border border-slate-800 px-1 font-medium truncate max-w-[120px]">
                                  {std ? std.name : ''}
                                </td>
                                {Array.from({ length: 31 }).map((_, d) => (
                                  <td key={d} className="border border-slate-800 text-center"></td>
                                ))}
                                <td className="border border-slate-800 text-center"></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-6 flex justify-between text-xs font-bold text-slate-900">
                      <span className="border-t border-slate-800 pt-1">শ্রেণি শিক্ষকের স্বাক্ষর</span>
                      <span className="border-t border-slate-800 pt-1">প্রধান শিক্ষকের অনুমোদন ও সিল</span>
                    </div>
                  </div>
                );
              })()}

              {/* 3. Certificate of Achievement (উত্তীর্ণ সনদপত্র - বার্ষিক পরীক্ষাভিত্তিক) */}
              {printDocumentType === 'certificate' && (
                <div className="printable-area certificate-border p-8 bg-emerald-50/20 rounded-xl space-y-6 text-slate-900 relative">
                  <div className="text-center pt-3 pb-2 space-y-1">
                    {settings.logoUrl && (
                      <img src={settings.logoUrl} alt="লোগো" className="w-16 h-16 object-contain mx-auto mb-1" />
                    )}
                    <h2 className="text-2xl font-black text-emerald-950">{settings.name}</h2>
                    <p className="text-xs text-slate-700">{settings.address} • হটলাইন: {settings.hotline}</p>
                    <div className="inline-block mt-3 px-6 py-1.5 bg-gradient-to-r from-emerald-800 to-teal-800 text-amber-300 font-extrabold text-sm rounded-full shadow-sm border border-amber-400">
                      বার্ষিক উত্তীর্ণ ও মেধা সনদপত্র (Certificate of Academic Success)
                    </div>
                  </div>

                  <div className="space-y-4 text-sm leading-relaxed text-slate-800 text-justify px-4">
                    <p>
                      প্রত্যয়ন করা যাচ্ছে যে, শিক্ষার্থী{' '}
                      <b className="text-emerald-900 text-base border-b border-dotted border-slate-800 px-2">
                        {certStudent?.name || 'মোহাম্মদ আব্দুল্লাহ'}
                      </b>
                      , পিতা:{' '}
                      <b className="text-slate-900 border-b border-dotted border-slate-800 px-2">
                        {certStudent?.fatherName || 'মাওলানা মো: কামরুল হাসান'}
                      </b>
                      , মাতা:{' '}
                      <b className="text-slate-900 border-b border-dotted border-slate-800 px-2">
                        {certStudent?.motherName || 'রোকেয়া বেগম'}
                      </b>
                      , বর্তমান রোল নম্বর:{' '}
                      <b className="font-mono text-emerald-900 font-bold border-b border-dotted border-slate-800 px-2">
                        {certStudent?.roll || certRoll || '01'}
                      </b>
                      ; অত্র মাদ্রাসার{' '}
                      <b className="text-emerald-900 font-bold border-b border-dotted border-slate-800 px-2">
                        {classes.find(c => c.id === certClassId)?.name || '১ম শ্রেণি'}
                      </b>{' '}
                      হতে {toBengaliNum(certYear)} শিক্ষাবর্ষে নূরানী ও ক্যাডেট পাঠ্যক্রমের ৭টি বিষয়ে <b>বার্ষিক চূড়ান্ত মূল্যায়ন পরীক্ষা</b>য় সাফল্যের সাথে উত্তীর্ণ হয়ে জিপিএ{' '}
                      <b className="font-mono text-emerald-900 font-bold border-b border-dotted border-slate-800 px-2">
                        {certResult?.gpa ? certResult.gpa.toFixed(2) : '5.00'}
                      </b>{' '}
                      (গ্রেড:{' '}
                      <b className="font-mono text-emerald-900 font-bold border-b border-dotted border-slate-800 px-2">
                        {certResult?.grade || 'A+'}
                      </b>
                      ) এবং বার্ষিক মেধা স্থান (বর্তমান রোল){' '}
                      <b className="text-emerald-900 font-bold border-b border-dotted border-slate-800 px-2">
                        {toBengaliNum(certResult?.rank || 1)}ম
                      </b>{' '}
                      অর্জন করেছে।
                    </p>
                    <p>
                      অত্র প্রতিষ্ঠানে অধ্যয়নকালে তার নৈতিক চরিত্র, আচার-ব্যবহার ও ইসলামী অনুশাসন পালন প্রশংসনীয় ছিল। আমরা তার উজ্জ্বল ভবিষ্যৎ ও ইলমে বরকত কামনা করি।
                    </p>
                  </div>

                  <div className="pt-10 flex justify-between items-end px-4 text-xs font-bold text-slate-900">
                    <div className="text-center">
                      <p className="font-mono font-medium text-[11px] mb-1">তারিখ: {new Date().toLocaleDateString('bn-BD')}</p>
                      <div className="border-t border-slate-800 pt-1">সনদ প্রস্তুতকারী</div>
                    </div>

                    <div className="text-center">
                      {settings.institutionSealUrl && (
                        <img src={settings.institutionSealUrl} alt="সিল" className="w-16 h-16 object-contain mx-auto mb-1" />
                      )}
                      <div className="border-t border-slate-800 pt-1">অফিশিয়াল সিলমোহর</div>
                    </div>

                    <div className="text-center">
                      {settings.signatureUrl && (
                        <img src={settings.signatureUrl} alt="স্বাক্ষর" className="h-10 mx-auto object-contain mb-1" />
                      )}
                      <div className="border-t border-slate-800 pt-1">প্রধান শিক্ষক / অধ্যক্ষ</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Testimonial (মাদ্রাসার অফিশিয়াল প্রশংসাপত্র - কোনো ফলাফল ছাড়া সরাসরি) */}
              {printDocumentType === 'testimonial' && testimonialStudent && (
                <div className="printable-area certificate-border p-8 bg-gradient-to-b from-amber-50/20 via-white to-emerald-50/20 rounded-xl space-y-6 text-slate-900 relative">
                  <div className="text-center pt-3 pb-2 space-y-1">
                    <p className="text-sm font-bold text-emerald-900 font-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                    {settings.logoUrl && (
                      <img src={settings.logoUrl} alt="লোগো" className="w-16 h-16 object-contain mx-auto mb-1" />
                    )}
                    <h2 className="text-2xl font-black text-emerald-950 tracking-wide">{settings.name}</h2>
                    <p className="text-xs text-slate-700">{settings.address} • যোগাযোগ: {settings.hotline}</p>
                    <div className="inline-block mt-3 px-6 py-1.5 bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 text-amber-300 font-extrabold text-sm rounded-full shadow-sm border border-amber-400">
                      প্রশংসাপত্র (TESTIMONIAL & CHARACTER CERTIFICATE)
                    </div>
                  </div>

                  <div className="space-y-4 text-sm leading-relaxed text-slate-800 text-justify px-4">
                    <p>
                      প্রত্যয়ন করা যাচ্ছে যে, শিক্ষার্থী{' '}
                      <b className="text-emerald-950 text-base border-b border-dotted border-slate-800 px-2 font-black">
                        {testimonialStudent.name}
                      </b>
                      , পিতা:{' '}
                      <b className="text-slate-900 border-b border-dotted border-slate-800 px-2 font-bold">
                        {testimonialStudent.fatherName || 'অভিভাবক'}
                      </b>
                      , মাতা:{' '}
                      <b className="text-slate-900 border-b border-dotted border-slate-800 px-2 font-bold">
                        {testimonialStudent.motherName || 'অভিভাবিকা'}
                      </b>
                      , গ্রাম/ঠিকানা:{' '}
                      <b className="text-slate-900 border-b border-dotted border-slate-800 px-2">
                        {testimonialStudent.address || 'উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম'}
                      </b>
                      , জন্ম তারিখ:{' '}
                      <b className="font-mono text-slate-900 border-b border-dotted border-slate-800 px-2">
                        {testimonialStudent.dob || '২০১৯-০১-০১'}
                      </b>
                      ; অত্র মাদ্রাসার{' '}
                      <b className="text-emerald-950 font-bold border-b border-dotted border-slate-800 px-2">
                        {classes.find(c => c.id === testimonialClassId)?.name || testimonialStudent.className}
                      </b>{' '}
                      শ্রেণিতে{' '}
                      <b className="text-emerald-950 font-bold border-b border-dotted border-slate-800 px-2">
                        {toBengaliNum(testimonialYear)}
                      </b>{' '}
                      শিক্ষাবর্ষে (রোল নম্বর:{' '}
                      <b className="font-mono text-emerald-950 font-bold border-b border-dotted border-slate-800 px-2">
                        {testimonialStudent.roll}
                      </b>
                      ) নিয়মিত অধ্যয়নরত ছিল / সুনামের সহিত পাঠ সমাপ্ত করেছে।
                    </p>
                    <p>
                      অত্র প্রতিষ্ঠানে অধ্যয়নকালে সে অত্যন্ত নম্র, ভদ্র, সত্যবাদী, শান্তিপ্রিয় ও নিয়মিত শিক্ষার্থী ছিল। সে সদা মাদ্রাসার সকল নিয়ম-শৃঙ্খলা, আদব ও ধর্মীয় অনুশাসন নিষ্ঠার সহিত পালন করেছে। অত্র মাদ্রাসা কিংবা রাষ্ট্র ও সমাজবিরোধী কোনো কার্যকলাপের সহিত তাহার কখনোই কোনো সংশ্লিষ্টতা পরিলক্ষিত হয়নি। তাহার স্বভাব-চরিত্র অত্যন্ত প্রশংসনীয় ও অনুকরণীয়।
                    </p>
                    <p className="font-medium text-emerald-950">
                      আমরা তাহার ভবিষ্যৎ জীবনের সর্বাঙ্গীন মঙ্গল, সুস্বাস্থ্য, দীর্ঘায়ু এবং ইহলৌকিক ও পারলৌকিক সার্বিক সাফল্য ও উজ্জ্বল ভবিষ্যৎ কামনা করি।
                    </p>
                  </div>

                  <div className="pt-10 flex justify-between items-end px-4 text-xs font-bold text-slate-900">
                    <div className="text-center">
                      <p className="font-mono font-medium text-[11px] mb-1">তারিখ: {new Date().toLocaleDateString('bn-BD')}</p>
                      <div className="border-t border-slate-800 pt-1">শ্রেণি শিক্ষকের স্বাক্ষর</div>
                    </div>

                    <div className="text-center">
                      {settings.institutionSealUrl && (
                        <img src={settings.institutionSealUrl} alt="সিল" className="w-16 h-16 object-contain mx-auto mb-1" />
                      )}
                      <div className="border-t border-slate-800 pt-1">মাদ্রাসার সিলমোহর</div>
                    </div>

                    <div className="text-center">
                      {settings.signatureUrl && (
                        <img src={settings.signatureUrl} alt="স্বাক্ষর" className="h-10 mx-auto object-contain mb-1" />
                      )}
                      <div className="border-t border-slate-800 pt-1">প্রধান শিক্ষক / অধ্যক্ষ</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Cashbook Financial Statement */}
              {printDocumentType === 'cashbook' && (
                <div className="printable-area p-8 bg-white border-2 border-slate-800 rounded-xl space-y-4">
                  <div className="text-center pb-3 border-b-2 border-slate-800 space-y-1">
                    <p className="text-xs font-bold text-emerald-800 font-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                    <h2 className="text-xl font-black text-slate-950">{settings.name}</h2>
                    <p className="text-xs text-slate-600">{settings.address}</p>
                    <div className="inline-block mt-1 px-4 py-1 bg-slate-900 text-white font-bold text-xs rounded-full">
                      মাসিক ক্যাশবুক ও আর্থিক হিসাব বিবরণী
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-center font-bold">
                    <div>মোট আয়: <span className="text-emerald-800 font-mono font-black">৳{totalIncome.toLocaleString('bn-BD')}</span></div>
                    <div>মোট ব্যয়: <span className="text-rose-800 font-mono font-black">৳{totalExpense.toLocaleString('bn-BD')}</span></div>
                    <div>নিট স্থিতি: <span className="text-teal-900 font-mono font-black">৳{netBalance.toLocaleString('bn-BD')}</span></div>
                  </div>

                  <table className="w-full border-collapse border border-slate-800 text-xs">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-800 p-2 text-center w-24">তারিখ</th>
                        <th className="border border-slate-800 p-2 text-center w-20">ধরন</th>
                        <th className="border border-slate-800 p-2 text-left">খাত / বিবরণ</th>
                        <th className="border border-slate-800 p-2 text-right w-28">আয় (৳)</th>
                        <th className="border border-slate-800 p-2 text-right w-28">ব্যয় (৳)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledger.map(l => (
                        <tr key={l.id} className="h-7">
                          <td className="border border-slate-800 text-center font-mono">{l.date}</td>
                          <td className="border border-slate-800 text-center font-bold">
                            {l.type === 'income' ? 'আয়' : 'ব্যয়'}
                          </td>
                          <td className="border border-slate-800 px-2">{l.category} - {l.description}</td>
                          <td className="border border-slate-800 text-right px-2 font-mono text-emerald-800 font-bold">
                            {l.type === 'income' ? `+${l.amount.toLocaleString('bn-BD')}` : ''}
                          </td>
                          <td className="border border-slate-800 text-right px-2 font-mono text-rose-800 font-bold">
                            {l.type === 'expense' ? `-${l.amount.toLocaleString('bn-BD')}` : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="pt-8 flex justify-between text-xs font-bold text-slate-900">
                    <span className="border-t border-slate-800 pt-1">হিসাবরক্ষকের স্বাক্ষর</span>
                    <span className="border-t border-slate-800 pt-1">সভাপতি / পরিচালনা পরিষদ</span>
                    <span className="border-t border-slate-800 pt-1">প্রধান শিক্ষকের অনুমোদন ও সিল</span>
                  </div>
                </div>
              )}

              {/* 5. Teacher ID Card */}
              {printDocumentType === 'teacher_id' && selectedTeacherForPrint && (
                <div className="printable-area flex flex-col items-center justify-center p-4 sm:p-6 space-y-4">
                  {/* Photo Change Bar (No Print) */}
                  <div className="no-print bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 w-full max-w-sm shadow-sm">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span className="text-xs font-bold text-emerald-950">
                        আইডি কার্ডের ছবি পরিবর্তন:
                      </span>
                    </div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-300" />
                      <span>নতুন ছবি আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileToBase64(e, (b64) => {
                            const updated = teachers.map(tc =>
                              tc.id === selectedTeacherForPrint.id ? { ...tc, photoUrl: b64 } : tc
                            );
                            setTeachers(updated);
                            setSelectedTeacherForPrint({ ...selectedTeacherForPrint, photoUrl: b64 });
                            storage.saveTeachers(updated);
                            triggerNotification(`'${selectedTeacherForPrint.name}'-এর ছবি আইডি কার্ডে আপডেট হয়েছে!`);
                          })
                        }
                      />
                    </label>
                  </div>

                  <div className="id-card-frame bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white p-5 flex flex-col items-center justify-between border-4 border-amber-400 relative">
                    <div className="text-center w-full">
                      <div className="font-arabic text-[11px] text-amber-300 font-bold">﷽</div>
                      <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide leading-tight mt-1">
                        {settings.name}
                      </h4>
                      <span className="text-[10px] text-emerald-200">উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম</span>
                      <div className="mt-1.5 px-3 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full inline-block">
                        শিক্ষক পরিচয়পত্র (Teacher ID)
                      </div>
                    </div>

                    <div className="text-center my-2 space-y-2">
                      <div className="relative group inline-block">
                        <img
                          src={selectedTeacherForPrint.photoUrl}
                          alt={selectedTeacherForPrint.name}
                          className="w-24 h-28 object-cover rounded-xl border-2 border-amber-400 shadow-md mx-auto"
                        />
                        <label
                          title="ছবি পরিবর্তন করুন"
                          className="no-print cursor-pointer absolute inset-0 bg-black/60 rounded-xl text-white text-[9px] font-bold flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Camera className="w-4 h-4 text-amber-300 mb-0.5" />
                          <span>ছবি পরিবর্তন</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileToBase64(e, (b64) => {
                                const updated = teachers.map(tc =>
                                  tc.id === selectedTeacherForPrint.id ? { ...tc, photoUrl: b64 } : tc
                                );
                                setTeachers(updated);
                                setSelectedTeacherForPrint({ ...selectedTeacherForPrint, photoUrl: b64 });
                                storage.saveTeachers(updated);
                                triggerNotification(`'${selectedTeacherForPrint.name}'-এর ছবি আইডি কার্ডে আপডেট হয়েছে!`);
                              })
                            }
                          />
                        </label>
                      </div>
                      <h3 className="text-base font-bold text-white">{selectedTeacherForPrint.name}</h3>
                      <p className="text-xs text-amber-300 font-semibold">{selectedTeacherForPrint.designation}</p>
                      <span className="text-[11px] font-mono font-bold bg-white/10 px-2.5 py-0.5 rounded text-emerald-200 block">
                        ID: {selectedTeacherForPrint.id}
                      </span>
                    </div>

                    <div className="w-full text-left text-[11px] space-y-1 border-t border-emerald-800/80 pt-2 text-emerald-100">
                      <div>মোবাইল: <b className="font-mono text-white">{selectedTeacherForPrint.phone}</b></div>
                      <div>রক্তের গ্রুপ: <b className="text-amber-300">{selectedTeacherForPrint.bloodGroup || 'O+'}</b></div>
                    </div>

                    <div className="w-full pt-2 border-t border-emerald-800/80 flex items-center justify-between text-[9px] text-emerald-300">
                      <span>জরুরি হটলাইন: {settings.hotline}</span>
                      <div className="text-center">
                        {settings.signatureUrl && (
                          <img src={settings.signatureUrl} alt="স্বাক্ষর" className="h-6 mx-auto object-contain" />
                        )}
                        <span className="border-t border-white/40 pt-0.5 block">প্রধান শিক্ষক</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Student ID Card */}
              {printDocumentType === 'student_id' && selectedStudentForPrint && (
                <div className="printable-area flex justify-center p-6">
                  <div className="id-card-frame bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white p-5 flex flex-col items-center justify-between border-4 border-amber-400 relative">
                    <div className="text-center w-full">
                      <div className="font-arabic text-[11px] text-amber-300 font-bold">﷽</div>
                      <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide leading-tight mt-1">
                        {settings.name}
                      </h4>
                      <span className="text-[10px] text-emerald-200">উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম</span>
                      <div className="mt-1.5 px-3 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full inline-block">
                        শিক্ষার্থী পরিচয়পত্র (Student ID)
                      </div>
                    </div>

                    <div className="text-center my-2 space-y-2">
                      <img
                        src={selectedStudentForPrint.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                        alt={selectedStudentForPrint.name}
                        className="w-24 h-28 object-cover rounded-xl border-2 border-amber-400 shadow-md mx-auto"
                      />
                      <h3 className="text-base font-bold text-white">{selectedStudentForPrint.name}</h3>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-amber-300 font-bold">{selectedStudentForPrint.className}</span>
                        <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                          রোল: {selectedStudentForPrint.roll}
                        </span>
                      </div>
                    </div>

                    <div className="w-full text-left text-[11px] space-y-1 border-t border-emerald-800/80 pt-2 text-emerald-100">
                      <div>পিতা: <b className="text-white">{selectedStudentForPrint.fatherName}</b></div>
                      <div>মোবাইল: <b className="font-mono text-white">{selectedStudentForPrint.phone}</b></div>
                      <div>শিক্ষাবর্ষ: <b className="text-amber-300">{selectedStudentForPrint.academicYear}</b></div>
                    </div>

                    <div className="w-full pt-2 border-t border-emerald-800/80 flex items-center justify-between text-[9px] text-emerald-300">
                      <span>মাদ্রাসার ঠিকানা: উত্তর ওয়াহেদপুর</span>
                      <div className="text-center">
                        {settings.signatureUrl && (
                          <img src={settings.signatureUrl} alt="স্বাক্ষর" className="h-6 mx-auto object-contain" />
                        )}
                        <span className="border-t border-white/40 pt-0.5 block">প্রধান শিক্ষক</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions Bar */}
            <div className="no-print p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setPrintDocumentType(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                বন্ধ করুন
              </button>

              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>প্রিন্ট / সেভ করুন (Print PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Fee Bill Slip Modal */}
      {selectedFeeBillForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">অফিসিয়াল আনপেইড ফি জমার রশিদ</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>প্রিন্ট করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFeeBillForPrint(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Slip Paper for Print */}
            <div className="printable-area p-8 bg-white relative">
              {/* Background Watermark */}
              {settings.logoUrl && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                  <img src={settings.logoUrl} alt="Watermark" className="w-64 h-64 object-contain" />
                </div>
              )}

              {/* Madrasah Header */}
              <div className="text-center border-b-2 border-emerald-900 pb-4 relative z-10">
                <div className="flex items-center justify-center gap-3 mb-2">
                  {settings.logoUrl && (
                    <img src={settings.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />
                  )}
                  <div>
                    <h2 className="text-2xl font-black text-emerald-950">{settings.name}</h2>
                    <p className="text-xs text-slate-600 font-semibold">{settings.address}</p>
                  </div>
                </div>
                <div className="inline-block bg-emerald-900 text-white px-4 py-0.5 rounded-full text-xs font-bold mt-1 tracking-wider uppercase">
                  আনপেইড ফি জমার রশিদ (UNPAID SLIP)
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  রশিদ নং: {selectedFeeBillForPrint.billNo} | প্রকাশের তারিখ: {toBengaliNum(selectedFeeBillForPrint.publishDate)}
                </p>
              </div>

              {/* Student Info Box */}
              <div className="my-5 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-800 grid grid-cols-2 gap-y-2 gap-x-4 relative z-10">
                <div>
                  <span className="text-slate-500 font-medium">শিক্ষার্থীর নাম:</span>
                  <span className="font-bold ml-1.5 text-slate-900">{selectedFeeBillForPrint.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">পিতার নাম:</span>
                  <span className="font-bold ml-1.5 text-slate-900">{selectedFeeBillForPrint.fatherName || 'উল্লেখ নেই'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">শ্রেণি:</span>
                  <span className="font-bold ml-1.5 text-emerald-800">{selectedFeeBillForPrint.className}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">রোল নম্বর:</span>
                  <span className="font-bold ml-1.5 text-slate-900">{toBengaliNum(selectedFeeBillForPrint.roll)}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">শিক্ষাবর্ষ:</span>
                  <span className="font-bold ml-1.5 text-slate-900">{toBengaliNum(selectedFeeBillForPrint.academicYear)}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">ফি-র মাস:</span>
                  <span className="font-bold ml-1.5 text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    {selectedFeeBillForPrint.month}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="relative z-10 mb-6">
                <table className="w-full text-xs text-left border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-emerald-900 text-white">
                      <th className="border border-emerald-950 p-2 font-bold text-center w-12">ক্র.</th>
                      <th className="border border-emerald-950 p-2 font-bold">ফি বিবরণী</th>
                      <th className="border border-emerald-950 p-2 font-bold text-right w-28">টাকার পরিমাণ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFeeBillForPrint.items.map((it, i) => (
                      <tr key={it.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="border border-slate-300 p-2 text-center text-slate-600 font-semibold">{toBengaliNum(i + 1)}</td>
                        <td className="border border-slate-300 p-2 font-semibold text-slate-800">{it.title}</td>
                        <td className="border border-slate-300 p-2 text-right font-bold text-slate-900 font-mono">
                          ৳ {toBengaliNum(it.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-emerald-50 border-t-2 border-emerald-900">
                      <td colSpan={2} className="border border-slate-300 p-2.5 font-extrabold text-emerald-950 text-right">
                        সর্বমোট প্রদেয় টাকা:
                      </td>
                      <td className="border border-slate-300 p-2.5 text-right font-black text-emerald-900 text-sm font-mono">
                        ৳ {toBengaliNum(selectedFeeBillForPrint.totalAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Stamp & Notice */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-200 relative z-10">
                <div className="text-left">
                  <div className={`inline-block border-2 px-3 py-1 rounded font-black text-xs uppercase tracking-wider -rotate-2 ${
                    selectedFeeBillForPrint.status === 'paid'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-rose-600 text-rose-700'
                  }`}>
                    {selectedFeeBillForPrint.status === 'paid' ? 'PAID — পরিশোধিত' : 'UNPAID — অফিসে প্রদেয়'}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 max-w-xs leading-relaxed">
                    ⚠️ এই রশিদের অর্থ সরাসরি মাদ্রাসার হিসাব শাখায় এসে নগদ জমা দিয়ে সিলমোহরযুক্ত পেইড কপি গ্রহণ করুন।
                  </p>
                </div>

                <div className="text-center sm:text-right">
                  {settings.signatureUrl ? (
                    <img src={settings.signatureUrl} alt="Signature" className="h-9 mx-auto sm:ml-auto object-contain mb-1" />
                  ) : (
                    <div className="h-9"></div>
                  )}
                  <div className="border-t border-slate-700 w-36 pt-1 text-[11px] font-bold text-slate-800 text-center">
                    হিসাব শাখা / প্রধান শিক্ষক
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="no-print p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedFeeBillForPrint(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>প্রিন্ট / সেভ করুন (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Sync Modal */}
      {isGitHubModalOpen && (
        <GitHubSyncModal
          isOpen={isGitHubModalOpen}
          onClose={() => setIsGitHubModalOpen(false)}
          settings={settings}
          onUpdateSettings={(newS) => {
            setSettings(newS);
            storage.saveSettings(newS);
          }}
          triggerNotification={triggerNotification}
        />
      )}

    </div>
  );
};
