export interface InstituteSettings {
  name: string;
  subName: string;
  code?: string;
  logoUrl?: string;
  headerTextSize?: 'normal' | 'large' | 'extra-large';
  phone: string;
  hotline: string;
  email: string;
  address: string;
  
  // Founders & Speeches
  founderName: string;
  founderTitle: string;
  founderSpeech: string;
  founderPhotoUrl: string;

  principalName: string;
  principalTitle: string;
  principalSpeech: string;
  principalPhotoUrl: string;

  // Digital Seals & Signatures
  signatureUrl: string;
  signatureSealUrl: string;
  institutionSealUrl: string;
  watermarkUrl?: string;

  // Theme & Styling
  primaryColor: string;
  secondaryColor: string;
  welcomeText: string;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl?: string;
  mapEmbedUrl: string;

  // Admission Policy & Rules
  admissionFee: number; // 1000 TK
  admissionNotice: string;
  banglaQrHeading?: string;
  banglaQrUrl?: string;

  // Page Specific Special Notes (CMS controlled for each page/module)
  pageNotes?: Record<string, string>;

  // Footer Info
  footerText?: string;
  footerCopyright?: string;
  footerNotice?: string;

  // GitHub Data Sync
  githubRepo?: string;
  githubBranch?: string;
  githubToken?: string;
  githubAutoPushEnabled?: boolean;
}

export interface HeroSlide {
  id: string;
  title: string;
  subText: string;
  image: string;
  ctaText: string;
  ctaAction: string;
  active: boolean;
}

export interface ShortcutItem {
  id: string;
  title: string;
  iconName: string;
  badge?: string;
  color: string;
  target: string;
  enabled: boolean;
}

export interface MadrasahClass {
  id: string;
  name: string;
  code: string;
  order: number;
  subjects?: string[];
  examTypes?: string[];
}

export interface UploadedRoutineDoc {
  id: string;
  academicYear: string;
  classId: string;
  className: string;
  routineType: 'class' | 'exam';
  examType?: string;
  fileData: string; // Base64 data URL for image or PDF
  fileName: string;
  fileType: 'image' | 'pdf';
  uploadedAt: string;
}

export interface MadrasahSubject {
  id: string;
  name: string;
  code: string;
  totalMarks: number;
  passMarks: number;
  classId?: string; // Optional per-class binding
}

export interface ExamTypeItem {
  id: string;
  name: string;
  code: string;
  isAnnual?: boolean;
  classId?: string; // Optional per-class binding
}

export interface Teacher {
  id: string; // Teacher ID (e.g. TID-101)
  name: string;
  designation: string;
  phone: string;
  email?: string;
  qualification: string;
  experience: string;
  specialist: string[];
  photoUrl: string;
  bloodGroup?: string;
  joiningDate?: string;
  bio?: string;
}

export interface Student {
  id: string; // Roll is Student ID
  academicYear: string;
  classId: string;
  className: string;
  roll: string; // Roll-e Student ID
  name: string;
  fatherName: string;
  motherName: string;
  phone: string;
  address: string;
  birthRegNo?: string;
  dob?: string;
  gender?: 'ছেলে' | 'মেয়ে';
  prevSchool?: string;
  admissionDate: string;
  photoUrl?: string;
  status: 'active' | 'graduated' | 'tc';
  currentRank?: number; // বর্তমান রোল (Calculated from result)
  hasPaidDues?: boolean;
  admitCardBlocked?: boolean;
  blockedReason?: string;
}

export interface AdmissionApplication {
  id: string;
  trackingNo: string;
  academicYear: string;
  applicantName: string;
  fatherName: string;
  motherName: string;
  targetClass: string;
  dob: string;
  birthRegNo?: string;
  phone: string;
  address: string;
  prevSchool?: string;
  photoUrl?: string;
  birthCertImage?: string;
  isVerifiedEVerify?: boolean;
  feeAmount: number; // 1000 TK
  paymentStatus: 'অফিসে জমা দিতে হবে' | 'পরিশোধিত';
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: string;
  remarks?: string;
}

export interface SubjectMark {
  subjectId: string;
  subjectName: string;
  obtained: number;
  total: number;
  grade: string;
  gpa: number;
  highestMarks?: number;
}

export interface ResultRecord {
  id: string;
  academicYear: string;
  classId: string;
  className: string;
  examType: string; // ১ম সাময়িক, ২য় সাময়িক, বার্ষিক
  roll: string; // Roll = Student ID
  studentId?: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  phone?: string;
  marks: SubjectMark[];
  totalMarks: number;
  gpa: number;
  grade: string;
  rank: number; // বর্তমান রোল (Smart Rank)
  autoRemarks: string; // অটো মন্তব্য (যেমন: অসাধারণ ফলাফল, উত্তম, আরো পরিশ্রম করা প্রয়োজন)
  published: boolean;
  date: string;
}

export interface ClassRoutineItem {
  id: string;
  classId: string;
  className: string;
  day: string; // শনিবার, রবিবার, ...
  period: string; // ১ম পিরিয়ড, ২য় পিরিয়ড, ...
  time: string; // যেমন: সকাল ৮:০০ - ৮:৪৫
  subjectName: string;
  teacherName: string;
  roomNo?: string;
}

export interface ExamRoutineItem {
  id: string;
  examType: string;
  classId: string;
  className: string;
  date: string;
  day: string;
  time: string;
  subjectName: string;
  roomNo?: string;
}

export interface LedgerItem {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  receiptNo?: string;
  recordedBy?: string;
  academicYear: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  content: string;
  images: string[];
  pdfUrl?: string;
  videoUrl?: string;
  pinned?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption?: string;
  type: 'image' | 'video' | 'embed';
  url: string;
  category: string;
  date: string;
}

export interface FreeNoteItem {
  id: string;
  title: string;
  subject: string;
  classOrCourse: string;
  description: string;
  previewImage?: string;
  fileUrl: string;
  pdfUrl?: string;
  fileSize?: string;
  date: string;
}

export interface DemoClassItem {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  youtubeId: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  subject?: string;
  description?: string;
}

export interface TransferCertificate {
  id: string;
  tcNo: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  roll: string;
  className: string;
  academicYear: string;
  issueDate: string;
  reason: string;
  character: string;
  duesCleared: boolean;
  nextSchool?: string;
}

export interface CertificateRecord {
  id: string;
  certificateNo: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  roll: string;
  className: string;
  academicYear: string;
  examType: string;
  gpa: number;
  grade: string;
  issueDate: string;
  type: 'বার্ষিক উত্তীর্ণ সনদপত্র' | 'প্রশংসাপত্র (Testimonial)' | 'হিফজুল কুরআন সনদ';
}

export interface AdminCredentials {
  email: string;
  password: string;
  masterPin: string;
}

export interface FeeItemBreakdown {
  id: string;
  title: string;
  amount: number;
}

export interface StudentFeeBill {
  id: string;
  billNo: string;
  academicYear: string;
  className: string;
  classId?: string;
  roll: string;
  studentName: string;
  fatherName?: string;
  phone?: string;
  month: string;
  items: FeeItemBreakdown[];
  totalAmount: number;
  status: 'unpaid' | 'paid';
  publishDate: string;
  dueDate?: string;
  notes?: string;
}
