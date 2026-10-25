import {
  InstituteSettings,
  HeroSlide,
  ShortcutItem,
  MadrasahClass,
  MadrasahSubject,
  ExamTypeItem,
  Teacher,
  Student,
  AdmissionApplication,
  ResultRecord,
  SubjectMark,
  ClassRoutineItem,
  ExamRoutineItem,
  LedgerItem,
  NoticeItem,
  GalleryItem,
  FreeNoteItem,
  DemoClassItem,
  TransferCertificate,
  CertificateRecord,
  AdminCredentials,
  UploadedRoutineDoc,
  StudentFeeBill,
  FeeItemBreakdown
} from '../types';
import { githubDataService } from './githubDataService';
import { masterGateway } from './masterGateway';

// Default Islamic Badges, Seals, and Signatures
export const DEFAULT_ASSETS = {
  // Official Madrasah Crescent & Star Emblem with Open Quran
  logo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160"><defs><linearGradient id="emerald" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23047857"/><stop offset="50%" stop-color="%23065f46"/><stop offset="100%" stop-color="%23022c22"/></linearGradient><linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fbbf24"/><stop offset="50%" stop-color="%23f59e0b"/><stop offset="100%" stop-color="%23d97706"/></linearGradient></defs><circle cx="80" cy="80" r="76" fill="url(%23emerald)" stroke="url(%23gold)" stroke-width="4"/><circle cx="80" cy="80" r="68" fill="none" stroke="url(%23gold)" stroke-width="1.5" stroke-dasharray="3 3"/><path d="M80 22 C84 32, 94 36, 104 36 C92 42, 88 54, 88 66 C80 58, 76 46, 80 22 Z" fill="url(%23gold)"/><path d="M48 95 C62 82 78 88 80 100 C82 88 98 82 112 95 L112 108 C98 95 82 101 80 114 C78 101 62 95 48 108 Z" fill="url(%23gold)"/><circle cx="80" cy="50" r="6" fill="%23ffffff"/><polygon points="80,44 82,48 86,49 83,52 84,56 80,53 76,56 77,52 74,49 78,48" fill="url(%23gold)"/><text x="80" y="132" font-family="'Hind Siliguri', sans-serif" font-weight="bold" font-size="11" fill="%23ffffff" text-anchor="middle">সোবহানিয়া আজিজিয়া</text><text x="80" y="145" font-family="'Hind Siliguri', sans-serif" font-size="8.5" fill="url(%23gold)" text-anchor="middle">নূরানী ক্যাডেট মাদ্রাসা</text></svg>`,

  // Principal Signature (মাওলানা তোফাজ্জল হোসেন)
  signature: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 80" width="240" height="80"><path d="M25 45 C40 18, 55 60, 70 30 C85 10, 105 55, 120 35 C135 20, 150 50, 170 30 C185 15, 200 55, 215 40" fill="none" stroke="%23065f46" stroke-width="3" stroke-linecap="round"/><path d="M28 60 L205 50" stroke="%23065f46" stroke-width="2" stroke-linecap="round"/><text x="115" y="72" font-family="'Hind Siliguri', sans-serif" font-weight="600" font-size="12" fill="%23065f46" text-anchor="middle">মাওলানা তোফাজ্জল হোসেন</text></svg>`,

  // Official Signature Seal
  signatureSeal: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="140" height="140"><circle cx="70" cy="70" r="64" fill="none" stroke="%23dc2626" stroke-width="2.5" stroke-dasharray="5 3"/><circle cx="70" cy="70" r="54" fill="none" stroke="%23dc2626" stroke-width="1.5"/><text x="70" y="42" font-family="'Hind Siliguri', sans-serif" font-size="9" font-weight="bold" fill="%23dc2626" text-anchor="middle">মাওলানা তোফাজ্জল হোসেন</text><text x="70" y="60" font-family="'Hind Siliguri', sans-serif" font-size="8" fill="%23dc2626" text-anchor="middle">প্রধান শিক্ষক</text><text x="70" y="78" font-family="'Hind Siliguri', sans-serif" font-size="7" font-weight="bold" fill="%23dc2626" text-anchor="middle">সোবহানিয়া আজিজিয়া মাদ্রাসা</text><text x="70" y="96" font-family="Arial, sans-serif" font-size="7.5" font-weight="bold" fill="%23dc2626" text-anchor="middle">★ VERIFIED SEAL ★</text></svg>`,

  // Official Madrasah Stamp / Seal
  institutionSeal: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" width="150" height="150"><circle cx="75" cy="75" r="70" fill="none" stroke="%23047857" stroke-width="3"/><circle cx="75" cy="75" r="58" fill="none" stroke="%23047857" stroke-width="1.2"/><path id="madrasahTop" d="M 22 75 A 53 53 0 0 1 128 75" fill="none"/><text fill="%23047857" font-size="9" font-weight="bold" font-family="'Hind Siliguri', sans-serif"><textPath href="%23madrasahTop" startOffset="50%" text-anchor="middle">সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা</textPath></text><circle cx="75" cy="75" r="28" fill="%23ecfdf5" stroke="%23047857" stroke-width="1.5"/><text x="75" y="71" font-family="'Hind Siliguri', sans-serif" font-size="10" font-weight="bold" fill="%23047857" text-anchor="middle">অফিশিয়াল</text><text x="75" y="83" font-family="'Hind Siliguri', sans-serif" font-size="8" font-weight="bold" fill="%23047857" text-anchor="middle">সিলমোহর</text><path id="madrasahBottom" d="M 22 75 A 53 53 0 0 0 128 75" fill="none"/><text fill="%23047857" font-size="8" font-weight="bold" font-family="'Hind Siliguri', sans-serif"><textPath href="%23madrasahBottom" startOffset="50%" text-anchor="middle">★ উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম ★</textPath></text></svg>`
};

// Initial Institute Settings
const initialSettings: InstituteSettings = {
  name: "সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা",
  subName: "উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম | নূরানী, নাজেরা ও আধুনিক ক্যাডেট শিক্ষা",
  code: "SANCM-2026",
  logoUrl: DEFAULT_ASSETS.logo,
  headerTextSize: 'normal',
  phone: "+880 1816-027456",
  hotline: "+880 1816-027456",
  email: "sobhania.azizia.madrasah@gmail.com",
  address: "উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম, বাংলাদেশ",

  founderName: "আলহাজ্ব হযরত মাওলানা আবদুল মোমিন নাসেরি",
  founderTitle: "প্রতিষ্ঠাতা ও সভাপতি",
  founderSpeech: "বিসমিল্লাহির রাহমানির রাহিম। দ্বীনি ও আধুনিক শিক্ষার সমন্বয়ে আলোকিত সমাজ গড়াই সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসার মূল লক্ষ্য। পবিত্র কুরআনের সহীহ শিক্ষা, হাদিসের সঠিক জ্ঞান এবং আধুনিক সাধারণ শিক্ষার সমন্বয়ে আমরা ভবিষ্যৎ প্রজন্মকে যোগ্য নাগরিক ও খাঁটি ঈমানদার হিসেবে গড়ে তুলতে নিরলস কাজ করে যাচ্ছি। আল্লাহ সুবহানাহু ওয়া তা'আলা আমাদের এই প্রতিষ্ঠানকে কবুল করুন।",
  founderPhotoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",

  principalName: "মাওলানা তোফাজ্জল হোসেন",
  principalTitle: "প্রধান শিক্ষক",
  principalSpeech: "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ। সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসার সুশৃঙ্খল পাঠদান ব্যবস্থা ও স্নেহশীল পরিবেশ কোমলমতি শিক্ষার্থীদের মেধা ও মনন বিকাশে এক অনন্য ভূমিকা পালন করছে। অভিজ্ঞ শিক্ষক মণ্ডলী, নিয়মিত পরীক্ষা, দুর্বল শিক্ষার্থীদের বিশেষ যত্ন এবং ডিজিটাল প্রশাসনিক ব্যবস্থাপনা আমাদের অগ্রযাত্রার চালিকাশক্তি। অভিভাবকদের প্রতি আমাদের অনুরোধ, আপনার সন্তানের আলোকিত দ্বীনি ভবিষ্যৎ বিনির্মাণে আমাদের সাথে থাকুন।",
  principalPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",

  signatureUrl: DEFAULT_ASSETS.signature,
  signatureSealUrl: DEFAULT_ASSETS.signatureSeal,
  institutionSealUrl: DEFAULT_ASSETS.institutionSeal,
  watermarkUrl: DEFAULT_ASSETS.logo,

  primaryColor: "#047857",
  secondaryColor: "#d97706",
  welcomeText: "সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসায় স্বাগতম! দ্বীনি ও ক্যাডেট শিক্ষার সেরা সমন্বয়।",
  facebookUrl: "https://facebook.com",
  youtubeUrl: "https://youtube.com",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14713.238129037042!2d91.5645!3d22.7712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37535b6021f1c7a9%3A0x6b8ec10d8a6efc1!2sMirsarai%2C%20Chattogram!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd",

  admissionFee: 1000,
  admissionNotice: "ভর্তি ফি ১০০০ টাকা অবশ্যই সরাসরি মাদ্রাসায় এসে অফিসে জমা দিতে হবে। বই, খাতা, চক ও সিলেট আলাদা করে কিনতে হবে।",

  pageNotes: {
    home: "📢 ২০২৬ শিক্ষাবর্ষে শিশু শ্রেণি থেকে ৩য় শ্রেণিতে সীমিত আসনে ভর্তি চলছে! সরাসরি অফিসে যোগাযোগ করুন।",
    admission: "⚠️ বিশেষ বিজ্ঞপ্তি: অনলাইনে আবেদন শেষে ভর্তি ফি ১০০০ টাকা সরাসরি মাদ্রাসা অফিসে জমা দিয়ে চূড়ান্ত ভর্তি নিশ্চিত করতে হবে। বই, খাতা, চক ও সিলেট আলাদা কিনতে হবে।",
    result: "📌 ফলাফল নোটিস: প্রাপ্ত নম্বরের ভিত্তিতে স্বয়ংক্রিয়ভাবে জিপিএ, বর্তমান রোল (মেধা স্থান) ও অফিসিয়াল মূল্যায়ন মন্তব্য যুক্ত হয়েছে।",
    routine: "⏰ সকল শিক্ষার্থীকে নির্ধারিত সময়ের ১০ মিনিট পূর্বে মাদ্রাসার পোশাক ও টুপি পরিধান করে উপস্থিত হতে হবে।"
  },

  footerText: "সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা — দ্বীনি আদর্শ ও আধুনিক ক্যাডেট শিক্ষার মেলবন্ধন। অভিজ্ঞ শিক্ষক মণ্ডলী এবং নিবিড় তত্ত্বাবধান।",
  footerCopyright: `© ${new Date().getFullYear()} সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা। সর্বস্বত্ব সংরক্ষিত।`,
  footerNotice: "ভর্তি, পরীক্ষা ও যাবতীয় সনদ সরাসরি প্রধান শিক্ষক কর্তৃক অনুমোদিত।",
  githubRepo: "bmd03024-code/sobhaniya-azizia-nurani-cadet-madrasa",
  githubBranch: "main"
};

// Initial Hero Slides
const initialSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা",
    subText: "উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম। নূরানী, নাজেরা ও আধুনিক ক্যাডেট পাঠ্যক্রমের সমন্বয়ে আলোকিত দ্বীনি ভবিষ্যৎ গড়ে তুলুন।",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1600&q=80",
    ctaText: "অনলাইন রেজাল্ট দেখুন",
    ctaAction: "result",
    active: true
  },
  {
    id: "slide-2",
    title: "২০২৬ শিক্ষাবর্ষে নতুন শিক্ষার্থীবৃন্দের ভর্তি চলছে",
    subText: "শিশু শ্রেণি থেকে ৩য় শ্রেণি পর্যন্ত সীমিত আসনে ভর্তি চলছে। ভর্তি ফি ১০০০ টাকা (সরাসরি অফিসে জমা)। এখনই অনলাইনে আবেদন ফরম পূরণ করুন।",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1600&q=80",
    ctaText: "ভর্তি আবেদন ফরম",
    ctaAction: "admission",
    active: true
  },
  {
    id: "slide-3",
    title: "অভিজ্ঞ শিক্ষক মণ্ডলী ও সুশৃঙ্খল পাঠদান পরিবেশ",
    subText: "তাজবীদ সহ সহীহ কুরআন শিক্ষা, মাসআলা-সালাত, আরবি এবং বাংলা-ইংরেজি-গণিতে ক্যাডেট মানের আধুনিক শিক্ষাদানে আমরা অঙ্গীকারাবদ্ধ।",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80",
    ctaText: "ক্লাস ও পরীক্ষার রুটিন",
    ctaAction: "routine",
    active: true
  }
];

// Smart Shortcut Buttons (100% Admin Configurable & Dynamic)
const initialShortcuts: ShortcutItem[] = [
  { id: "sc-1", title: "অনলাইন রেজাল্ট", iconName: "BarChart3", badge: "লাইভ মার্কশিট", color: "from-emerald-700 to-teal-800", target: "result", enabled: true },
  { id: "sc-2", title: "ভর্তি আবেদন", iconName: "UserPlus", badge: "১০০০৳ ফি", color: "from-amber-600 to-yellow-600", target: "admission", enabled: true },
  { id: "sc-3", title: "ক্লাস রুটিন", iconName: "Calendar", badge: "সময়সূচী", color: "from-green-700 to-emerald-800", target: "class-routine", enabled: true },
  { id: "sc-4", title: "পরীক্ষার রুটিন", iconName: "Clock", badge: "পরীক্ষা", color: "from-blue-700 to-cyan-800", target: "exam-routine", enabled: true },
  { id: "sc-5", title: "নোটিশ বোর্ড", iconName: "Bell", badge: "নতুন বিজ্ঞপ্তি", color: "from-rose-600 to-red-700", target: "notice", enabled: true },
  { id: "sc-6", title: "শিক্ষক মণ্ডলী", iconName: "Users", badge: "আইডি কার্ড", color: "from-teal-700 to-green-800", target: "teachers", enabled: true },
  { id: "sc-7", title: "মেধা তালিকা", iconName: "Award", badge: "বর্তমান রোল", color: "from-amber-700 to-orange-700", target: "merit-list", enabled: true },
  { id: "sc-8", title: "ফটো গ্যালারি", iconName: "Image", badge: "ছবি ও ভিডিও", color: "from-indigo-700 to-purple-800", target: "gallery", enabled: true },
  { id: "sc-9", title: "প্রতিষ্ঠানের বাণী", iconName: "BookOpen", badge: "পরিচালনা পরিষদ", color: "from-emerald-800 to-teal-900", target: "founder", enabled: true },
  { id: "sc-10", title: "যোগাযোগ", iconName: "Phone", badge: "মীরসরাই", color: "from-slate-700 to-slate-900", target: "contact", enabled: true },
];

// 4 Dynamic Madrasah Classes
const initialClasses: MadrasahClass[] = [
  { id: "class-shishu", name: "শিশু শ্রেণি", code: "SHISHU", order: 1 },
  { id: "class-1", name: "১ম শ্রেণি", code: "CLS-01", order: 2 },
  { id: "class-2", name: "২য় শ্রেণি", code: "CLS-02", order: 3 },
  { id: "class-3", name: "৩য় শ্রেণি", code: "CLS-03", order: 4 },
];

// 7 Designated Exam Subjects
const initialSubjects: MadrasahSubject[] = [
  { id: "subj-1", name: "কুরআন মাজিদ ও আরবী মৌখিক", code: "QRN-101", totalMarks: 100, passMarks: 40 },
  { id: "subj-2", name: "হাদিস ও আসমাউল হুসনা", code: "HDS-102", totalMarks: 100, passMarks: 40 },
  { id: "subj-3", name: "আ: মাসআলা ও আ: সালাত", code: "MSL-103", totalMarks: 100, passMarks: 40 },
  { id: "subj-4", name: "আরবি", code: "ARB-104", totalMarks: 100, passMarks: 40 },
  { id: "subj-5", name: "বাংলা", code: "BAN-105", totalMarks: 100, passMarks: 40 },
  { id: "subj-6", name: "গণিত", code: "MAT-106", totalMarks: 100, passMarks: 40 },
  { id: "subj-7", name: "ইংরেজি", code: "ENG-107", totalMarks: 100, passMarks: 40 },
];

// Exam Types
const initialExamTypes: ExamTypeItem[] = [
  { id: "exam-1", name: "১ম সাময়িক", code: "TERM-1", isAnnual: false },
  { id: "exam-2", name: "২য় সাময়িক", code: "TERM-2", isAnnual: false },
  { id: "exam-3", name: "বার্ষিক", code: "ANNUAL", isAnnual: true },
];

// Teachers List (Exact 5 teachers with Unique Teacher ID)
const initialTeachers: Teacher[] = [
  {
    id: "TID-101",
    name: "মাওলানা তোফাজ্জল হোসেন",
    designation: "প্রধান শিক্ষক",
    phone: "+880 1816-027456",
    email: "tofazzel.hossein@gmail.com",
    qualification: "দাওরায়ে হাদিস (মাস্টার্স সমমান), বেফাকুল মাদারিসিল আরাবিয়া",
    experience: "১২ বছর দ্বীনি প্রতিষ্ঠান পরিচালনা ও পাঠদান অভিজ্ঞতা",
    specialist: ["কুরআন ও তাজবীদ", "হাদিস শরীফ", "ইসলামিক স্টাডিজ"],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bloodGroup: "O+",
    joiningDate: "2018-01-01",
    bio: "নূরানী পাঠ্যক্রম ও সুশৃঙ্খল ক্যাডেট ব্যবস্থাপনায় অত্যন্ত দক্ষ ও নিবেদিতপ্রাণ শিক্ষক।"
  },
  {
    id: "TID-102",
    name: "জাহিদুল ইসলাম জাবেদ",
    designation: "সহ-প্রধান শিক্ষক",
    phone: "+880 1812-345678",
    email: "jahidul.javed@gmail.com",
    qualification: "কামিল (হাদিস), বি.এ (অনার্স)",
    experience: "৮ বছর নূরানী ক্যাডেট প্রশিক্ষণ ও একাডেমি সমন্বয়",
    specialist: ["আরবি ব্যাকরণ", "মাসআলা ও সালাত", "বাংলা সাহিত্য"],
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bloodGroup: "A+",
    joiningDate: "2019-02-15",
    bio: "শিক্ষার্থীদের নৈতিক চরিত্র গঠন ও আরবি ভাষার বুৎপত্তি অর্জনে বিশেষ ভূমিকা রাখছেন।"
  },
  {
    id: "TID-103",
    name: "আলী আকবর",
    designation: "সহকারী শিক্ষক",
    phone: "+880 1813-456789",
    email: "ali.akbor@gmail.com",
    qualification: "ফাজিল (ইসলামিক স্টাডিজ), নূরানী মুয়াল্লিম বোর্ড প্রশিক্ষণপ্রাপ্ত",
    experience: "৫ বছর শিশু ও প্রাথমিক নূরানী শ্রেণি শিক্ষণ",
    specialist: ["শিশু নূরানী তালীম", "মাখরাজ ও কায়দা", "হাতে সুন্দর লেখা"],
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    bloodGroup: "B+",
    joiningDate: "2021-03-01",
    bio: "স্নেহ ও আন্তরিকতার সাথে ছোট সোনামণিদের মাখরাজ ও সহীহ কুরআন শিক্ষাদানে নিবেদিত।"
  },
  {
    id: "TID-104",
    name: "বোরহান উদ্দিন মহিম",
    designation: "সহকারী শিক্ষক",
    phone: "+880 1612-118307",
    email: "onlinetutionbyborhansir@gmail.com",
    qualification: "বি.এস.সি ও আইসিটি শিক্ষক, নূরানী শিক্ষক প্রশিক্ষণপ্রাপ্ত",
    experience: "৬ বছর আধুনিক গণিত, বিজ্ঞান ও তথ্যপ্রযুক্তি পাঠদান",
    specialist: ["গণিত", "ইংরেজি গ্রামার", "ডিজিটাল একাডেমি"],
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    bloodGroup: "AB+",
    joiningDate: "2020-01-10",
    bio: "সহজ পদ্ধতিতে ইংরেজি গ্রামার ও গণিতের ভিত্তি শক্ত করার পাশাপাশি ডিজিটাল ব্যবস্থাপনা পরিচালনা করেন।"
  },
  {
    id: "TID-105",
    name: "আমজাদ হোসেন",
    designation: "সহকারী শিক্ষক",
    phone: "+880 1815-678901",
    email: "amjad.hossein@gmail.com",
    qualification: "হাফেজে কুরআন ও ক্বারী, নূরানী মুয়াল্লিম সনদ",
    experience: "৭ বছর হিফজুল কুরআন ও নাজেরা শাখা পরিচালনা",
    specialist: ["হিফজুল কুরআন", "আসমাউল হুসনা", "হাদিস মুখস্থকরণ"],
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    bloodGroup: "O+",
    joiningDate: "2020-07-01",
    bio: "মধুর সুরে তিলাওয়াত ও আসমাউল হুসনা মুখস্থকরণে শিক্ষার্থীদের উদ্বুদ্ধ করেন।"
  }
];

// Initial Students (Roll is unique Student ID)
const initialStudents: Student[] = [
  {
    id: "01",
    roll: "01",
    academicYear: "2026",
    classId: "class-1",
    className: "১ম শ্রেণি",
    name: "মোহাম্মদ আব্দুল্লাহ",
    fatherName: "মাওলানা মো: কামরুল হাসান",
    motherName: "রোকেয়া বেগম",
    phone: "+880 1812-998877",
    address: "উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম",
    birthRegNo: "20191592345000101",
    dob: "2019-05-12",
    gender: "ছেলে",
    admissionDate: "2026-01-05",
    photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    status: "active",
    currentRank: 1,
    hasPaidDues: true
  },
  {
    id: "02",
    roll: "02",
    academicYear: "2026",
    classId: "class-1",
    className: "১ম শ্রেণি",
    name: "ফাতিমা বিনতে জামান",
    fatherName: "নুরুজ্জামান চৌধুরী",
    motherName: "শাহিনা আক্তার",
    phone: "+880 1813-887766",
    address: "দক্ষিণ ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম",
    birthRegNo: "20191592345000102",
    dob: "2019-08-20",
    gender: "মেয়ে",
    admissionDate: "2026-01-08",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    status: "active",
    currentRank: 2,
    hasPaidDues: true
  },
  {
    id: "03",
    roll: "03",
    academicYear: "2026",
    classId: "class-1",
    className: "১ম শ্রেণি",
    name: "ওমর ফারুক",
    fatherName: "আবু বকর সিদ্দিক",
    motherName: "হাফেজা আয়েশা খাতুন",
    phone: "+880 1814-776655",
    address: "মিঠাছড়া, মীরসরাই, চট্টগ্রাম",
    birthRegNo: "20191592345000103",
    dob: "2019-03-15",
    gender: "ছেলে",
    admissionDate: "2026-01-10",
    photoUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80",
    status: "active",
    currentRank: 3,
    hasPaidDues: true
  },
  {
    id: "04",
    roll: "04",
    academicYear: "2026",
    classId: "class-1",
    className: "১ম শ্রেণি",
    name: "জয়নব আক্তার",
    fatherName: "মো: রফিকুল ইসলাম",
    motherName: "মর্জিনা বেগম",
    phone: "+880 1815-665544",
    address: "খৈয়াছড়া, মীরসরাই, চট্টগ্রাম",
    birthRegNo: "20191592345000104",
    dob: "2019-11-02",
    gender: "মেয়ে",
    admissionDate: "2026-01-12",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    status: "active",
    currentRank: 4,
    hasPaidDues: true
  },
  {
    id: "05",
    roll: "05",
    academicYear: "2026",
    classId: "class-2",
    className: "২য় শ্রেণি",
    name: "হাসান মাহমুদ",
    fatherName: "মাহমুদুল হাসান",
    motherName: "নাছিমা আক্তার",
    phone: "+880 1816-554433",
    address: "ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম",
    birthRegNo: "20181592345000105",
    dob: "2018-04-10",
    gender: "ছেলে",
    admissionDate: "2025-01-15",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    status: "active",
    currentRank: 1,
    hasPaidDues: true
  }
];

// Helper to compute Auto Remarks from GPA
export function calculateAutoRemarks(gpa: number, totalMarks: number): string {
  if (gpa >= 5.0) return "অসাধারণ ও গৌরবোজ্জ্বল ফলাফল! এই অনন্য মেধা ও নিষ্ঠা অব্যাহত রাখো।";
  if (gpa >= 4.0) return "উত্তম ফলাফল! নিয়মিত পাঠাভ্যাস বজায় রাখলে আরও শীর্ষে পৌঁছানো সম্ভব।";
  if (gpa >= 3.5) return "সন্তোষজনক ফলাফল। আরবি ও গণিত বিষয়ে বিশেষ যত্ন প্রয়োজন।";
  if (gpa >= 3.0) return "মোটামুটি। সকল পাঠ্য বিষয়ে আরও গভীর মনোযোগ ও পরিশ্রম প্রয়োজন।";
  if (gpa >= 2.0) return "উত্তীর্ণ। দুর্বল বিষয়গুলোতে নিয়মিত রিভিশন ও শিক্ষকের সহায়তা জরুরি।";
  return "অকৃতকার্য। বিশেষ কোচিং ও অভিভাবকের নিবিড় তদারকি একান্ত প্রয়োজন।";
}

// Initial Exam Results with 7 subjects, auto GPA & rank
const initialResults: ResultRecord[] = [
  {
    id: "res-101",
    academicYear: "2026",
    classId: "class-1",
    className: "১ম শ্রেণি",
    examType: "১ম সাময়িক",
    roll: "01",
    studentName: "মোহাম্মদ আব্দুল্লাহ",
    fatherName: "মাওলানা মো: কামরুল হাসান",
    motherName: "রোকেয়া বেগম",
    phone: "+880 1812-998877",
    marks: [
      { subjectId: "subj-1", subjectName: "কুরআন মাজিদ ও আরবী মৌখিক", obtained: 95, total: 100, grade: "A+", gpa: 5.0, highestMarks: 95 },
      { subjectId: "subj-2", subjectName: "হাদিস ও আসমাউল হুসনা", obtained: 92, total: 100, grade: "A+", gpa: 5.0, highestMarks: 94 },
      { subjectId: "subj-3", subjectName: "আ: মাসআলা ও আ: সালাত", obtained: 90, total: 100, grade: "A+", gpa: 5.0, highestMarks: 92 },
      { subjectId: "subj-4", subjectName: "আরবি", obtained: 88, total: 100, grade: "A+", gpa: 5.0, highestMarks: 90 },
      { subjectId: "subj-5", subjectName: "বাংলা", obtained: 86, total: 100, grade: "A+", gpa: 5.0, highestMarks: 88 },
      { subjectId: "subj-6", subjectName: "গণিত", obtained: 96, total: 100, grade: "A+", gpa: 5.0, highestMarks: 96 },
      { subjectId: "subj-7", subjectName: "ইংরেজি", obtained: 87, total: 100, grade: "A+", gpa: 5.0, highestMarks: 89 }
    ],
    totalMarks: 634,
    gpa: 5.0,
    grade: "A+",
    rank: 1, // বর্তমান রোল (Smart Rank)
    autoRemarks: "অসাধারণ ও গৌরবোজ্জ্বল ফলাফল! এই অনন্য মেধা ও নিষ্ঠা অব্যাহত রাখো।",
    published: true,
    date: "2026-04-15"
  },
  {
    id: "res-102",
    academicYear: "2026",
    classId: "class-1",
    className: "১ম শ্রেণি",
    examType: "১ম সাময়িক",
    roll: "02",
    studentName: "ফাতিমা বিনতে জামান",
    fatherName: "নুরুজ্জামান চৌধুরী",
    motherName: "শাহিনা আক্তার",
    phone: "+880 1813-887766",
    marks: [
      { subjectId: "subj-1", subjectName: "কুরআন মাজিদ ও আরবী মৌখিক", obtained: 90, total: 100, grade: "A+", gpa: 5.0, highestMarks: 95 },
      { subjectId: "subj-2", subjectName: "হাদিস ও আসমাউল হুসনা", obtained: 88, total: 100, grade: "A+", gpa: 5.0, highestMarks: 94 },
      { subjectId: "subj-3", subjectName: "আ: মাসআলা ও আ: সালাত", obtained: 85, total: 100, grade: "A+", gpa: 5.0, highestMarks: 92 },
      { subjectId: "subj-4", subjectName: "আরবি", obtained: 84, total: 100, grade: "A+", gpa: 5.0, highestMarks: 90 },
      { subjectId: "subj-5", subjectName: "বাংলা", obtained: 82, total: 100, grade: "A+", gpa: 5.0, highestMarks: 88 },
      { subjectId: "subj-6", subjectName: "গণিত", obtained: 90, total: 100, grade: "A+", gpa: 5.0, highestMarks: 96 },
      { subjectId: "subj-7", subjectName: "ইংরেজি", obtained: 81, total: 100, grade: "A+", gpa: 5.0, highestMarks: 89 }
    ],
    totalMarks: 600,
    gpa: 5.0,
    grade: "A+",
    rank: 2,
    autoRemarks: "অসাধারণ ও গৌরবোজ্জ্বল ফলাফল! এই অনন্য মেধা ও নিষ্ঠা অব্যাহত রাখো।",
    published: true,
    date: "2026-04-15"
  },
  {
    id: "res-103",
    academicYear: "2026",
    classId: "class-1",
    className: "১ম শ্রেণি",
    examType: "১ম সাময়িক",
    roll: "03",
    studentName: "ওমর ফারুক",
    fatherName: "আবু বকর সিদ্দিক",
    motherName: "হাফেজা আয়েশা খাতুন",
    phone: "+880 1814-776655",
    marks: [
      { subjectId: "subj-1", subjectName: "কুরআন মাজিদ ও আরবী মৌখিক", obtained: 85, total: 100, grade: "A+", gpa: 5.0, highestMarks: 95 },
      { subjectId: "subj-2", subjectName: "হাদিস ও আসমাউল হুসনা", obtained: 82, total: 100, grade: "A+", gpa: 5.0, highestMarks: 94 },
      { subjectId: "subj-3", subjectName: "আ: মাসআলা ও আ: সালাত", obtained: 78, total: 100, grade: "A", gpa: 4.0, highestMarks: 92 },
      { subjectId: "subj-4", subjectName: "আরবি", obtained: 75, total: 100, grade: "A", gpa: 4.0, highestMarks: 90 },
      { subjectId: "subj-5", subjectName: "বাংলা", obtained: 76, total: 100, grade: "A", gpa: 4.0, highestMarks: 88 },
      { subjectId: "subj-6", subjectName: "গণিত", obtained: 88, total: 100, grade: "A+", gpa: 5.0, highestMarks: 96 },
      { subjectId: "subj-7", subjectName: "ইংরেজি", obtained: 74, total: 100, grade: "A", gpa: 4.0, highestMarks: 89 }
    ],
    totalMarks: 558,
    gpa: 4.43,
    grade: "A",
    rank: 3,
    autoRemarks: "উত্তম ফলাফল! নিয়মিত পাঠাভ্যাস বজায় রাখলে আরও শীর্ষে পৌঁছানো সম্ভব।",
    published: true,
    date: "2026-04-15"
  }
];

// Initial Class Routine
const initialClassRoutines: ClassRoutineItem[] = [
  { id: "cr-1", classId: "class-1", className: "১ম শ্রেণি", day: "শনিবার", period: "১ম পিরিয়ড", time: "সকাল ৮:০০ - ৮:৪৫", subjectName: "কুরআন মাজিদ ও আরবী মৌখিক", teacherName: "মাওলানা তোফাজ্জল হোসেন", roomNo: "কক্ষ ১০১" },
  { id: "cr-2", classId: "class-1", className: "১ম শ্রেণি", day: "শনিবার", period: "২য় পিরিয়ড", time: "সকাল ৮:৪৫ - ৯:৩০", subjectName: "হাদিস ও আসমাউল হুসনা", teacherName: "আমজাদ হোসেন", roomNo: "কক্ষ ১০১" },
  { id: "cr-3", classId: "class-1", className: "১ম শ্রেণি", day: "শনিবার", period: "৩য় পিরিয়ড", time: "সকাল ৯:৩০ - ১০:১৫", subjectName: "আ: মাসআলা ও আ: সালাত", teacherName: "জাহিদুল ইসলাম জাবেদ", roomNo: "কক্ষ ১০১" },
  { id: "cr-4", classId: "class-1", className: "১ম শ্রেণি", day: "শনিবার", period: "৪র্থ পিরিয়ড", time: "সকাল ১০:১৫ - ১১:০০", subjectName: "গণিত", teacherName: "বোরহান উদ্দিন মহিম", roomNo: "কক্ষ ১০১" },
  { id: "cr-5", classId: "class-1", className: "১ম শ্রেণি", day: "রবিবার", period: "১ম পিরিয়ড", time: "সকাল ৮:০০ - ৮:৪৫", subjectName: "আরবি", teacherName: "আলী আকবর", roomNo: "কক্ষ ১০১" },
  { id: "cr-6", classId: "class-1", className: "১ম শ্রেণি", day: "রবিবার", period: "২য় পিরিয়ড", time: "সকাল ৮:৪৫ - ৯:৩০", subjectName: "বাংলা", teacherName: "জাহিদুল ইসলাম জাবেদ", roomNo: "কক্ষ ১০১" },
  { id: "cr-7", classId: "class-1", className: "১ম শ্রেণি", day: "রবিবার", period: "৩য় পিরিয়ড", time: "সকাল ৯:৩০ - ১০:১৫", subjectName: "ইংরেজি", teacherName: "বোরহান উদ্দিন মহিম", roomNo: "কক্ষ ১০১" }
];

// Initial Exam Routine
const initialExamRoutines: ExamRoutineItem[] = [
  { id: "er-1", examType: "১ম সাময়িক", classId: "class-1", className: "১ম শ্রেণি", date: "২০২৬-০৪-১০", day: "শুক্রবার", time: "সকাল ৯:০০ - ১১:৩০", subjectName: "কুরআন মাজিদ ও আরবী মৌখিক", roomNo: "হলরুম-১" },
  { id: "er-2", examType: "১ম সাময়িক", classId: "class-1", className: "১ম শ্রেণি", date: "২০২৬-০৪-১২", day: "রবিবার", time: "সকাল ৯:০০ - ১১:৩০", subjectName: "হাদিস ও আসমাউল হুসনা", roomNo: "হলরুম-১" },
  { id: "er-3", examType: "১ম সাময়িক", classId: "class-1", className: "১ম শ্রেণি", date: "২০২৬-০৪-১৪", day: "মঙ্গলবার", time: "সকাল ৯:০০ - ১১:৩০", subjectName: "আ: মাসআলা ও আ: সালাত", roomNo: "হলরুম-১" },
  { id: "er-4", examType: "১ম সাময়িক", classId: "class-1", className: "১ম শ্রেণি", date: "২০২৬-০৪-১৬", day: "বৃহস্পতিবার", time: "সকাল ৯:০০ - ১১:৩০", subjectName: "আরবি", roomNo: "হলরুম-১" },
  { id: "er-5", examType: "১ম সাময়িক", classId: "class-1", className: "১ম শ্রেণি", date: "২০২৬-০৪-১৮", day: "শনিবার", time: "সকাল ৯:০০ - ১১:৩০", subjectName: "বাংলা", roomNo: "হলরুম-১" },
  { id: "er-6", examType: "১ম সাময়িক", classId: "class-1", className: "১ম শ্রেণি", date: "২০২৬-০৪-২০", day: "সোমবার", time: "সকাল ৯:০০ - ১১:৩০", subjectName: "গণিত", roomNo: "হলরুম-১" },
  { id: "er-7", examType: "১ম সাময়িক", classId: "class-1", className: "১ম শ্রেণি", date: "২০২৬-০৪-২২", day: "বুধবার", time: "সকাল ৯:০০ - ১১:৩০", subjectName: "ইংরেজি", roomNo: "হলরুম-১" }
];

// Initial Notices
const initialNotices: NoticeItem[] = [
  {
    id: "not-1",
    title: "২০২৬ শিক্ষাবর্ষে শিশু শ্রেণি থেকে ৩য় শ্রেণিতে ভর্তি বিজ্ঞপ্তি",
    date: "২০২৬-০১-০২",
    content: "সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসায় ২০২৬ শিক্ষাবর্ষে শিশু, ১ম, ২য় ও ৩য় শ্রেণিতে শিক্ষার্থী ভর্তি চলছে। ভর্তি ফি ১০০০ টাকা সরাসরি অফিসে জমা দিতে হবে। বই, খাতা, চক ও সিলেট অফিস হতে আলাদা ক্রয় করতে হবে।",
    images: ["https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=600&q=80"],
    pinned: true
  },
  {
    id: "not-2",
    title: "১ম সাময়িক পরীক্ষার সময়সূচী ও প্রবেশপত্র বিতরণ",
    date: "২০২৬-০৩-২৫",
    content: "আগামী ১০ এপ্রিল ২০২৬ হতে মাদ্রাসার ১ম সাময়িক পরীক্ষা অনুষ্ঠিত হবে। সকল শিক্ষার্থীকে অফিস হতে প্রবেশপত্র সংগ্রহ করার নির্দেশ দেওয়া যাচ্ছে।",
    images: [],
    pinned: true
  },
  {
    id: "not-3",
    title: "পবিত্র মাহে রমজান ও তাহফিজুল কুরআন বিশেষ তালীম",
    date: "২০২৬-০২-২০",
    content: "পবিত্র মাহে রমজান উপলক্ষে বিশেষ নাজেরা ও হিফজ ক্লাস পরিচালনা করা হবে। আগ্রহী অভিভাবকগণকে অফিসে যোগাযোগ করার জন্য অনুরোধ করা হলো।",
    images: [],
    pinned: false
  }
];

// Initial Accounts Ledger
const initialLedger: LedgerItem[] = [
  { id: "led-1", type: "income", category: "ভর্তি ফি", description: "রোল ০১ মোহাম্মদ আব্দুল্লাহ ভর্তি ফি বাবদ গ্রহণ", amount: 1000, date: "2026-01-05", receiptNo: "REC-1001", academicYear: "2026" },
  { id: "led-2", type: "income", category: "ভর্তি ফি", description: "রোল ০২ ফাতিমা বিনতে জামান ভর্তি ফি বাবদ গ্রহণ", amount: 1000, date: "2026-01-08", receiptNo: "REC-1002", academicYear: "2026" },
  { id: "led-3", type: "income", category: "ভর্তি ফি", description: "রোল ০৩ ওমর ফারুক ভর্তি ফি বাবদ গ্রহণ", amount: 1000, date: "2026-01-10", receiptNo: "REC-1003", academicYear: "2026" },
  { id: "led-4", type: "income", category: "মাসিক বেতন", description: "১ম শ্রেণি জানুয়ারি মাসের নিয়মিত বেতন আদায়", amount: 25000, date: "2026-01-20", receiptNo: "REC-1004", academicYear: "2026" },
  { id: "led-5", type: "expense", category: "শিক্ষক বেতন", description: "সকল শিক্ষক ও কর্মচারীদের জানুয়ারি মাসের সম্মানি প্রদান", amount: 35000, date: "2026-02-01", receiptNo: "VOU-2001", academicYear: "2026" },
  { id: "led-6", type: "expense", category: "ইউটিলিটি ও বিদ্যুৎ বিল", description: "মাদ্রাসার জানুয়ারি মাসের বিদ্যুৎ বিল পরিশোধ", amount: 3200, date: "2026-02-05", receiptNo: "VOU-2002", academicYear: "2026" },
  { id: "led-7", type: "expense", category: "আপ্যায়ন ও মেরামত", description: "অভিভাবক সমাবেশ আপ্যায়ন ও লাইব্রেরি শেলফ মেরামত", amount: 2400, date: "2026-02-12", receiptNo: "VOU-2003", academicYear: "2026" }
];

// Initial Gallery Items
const initialGallery: GalleryItem[] = [
  { id: "gal-1", title: "বার্ষিক কুরআন তিলাওয়াত প্রতিযোগিতা", caption: "শিক্ষার্থীদের মনোমুগ্ধকর তিলাওয়াত ও পুরস্কার বিতরণী", type: "image", url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80", category: "অনুষ্ঠান", date: "২০২৬-০২-১২" },
  { id: "gal-2", title: "শিশু শ্রেণির নূরানী মাখরাজ প্রশিক্ষণ ক্লাস", caption: "হাতে-কলমে বর্ণমালা ও সহীহ মাখরাজ শিক্ষাদান", type: "image", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80", category: "ক্লাসরুম", date: "২০২৬-০১-২০" },
  { id: "gal-3", title: "মাদ্রাসার মনোরম ক্যাম্পাস ও অভিভাবক সমাবেশ", caption: "নৈতিক শিক্ষার গুরুত্ব ও পাঠদান পদ্ধতি বিষয়ক আলোচনা", type: "image", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80", category: "ক্যাম্পাস", date: "২০২৬-০২-০৫" }
];

// Initial Admission Applications
const initialApplications: AdmissionApplication[] = [
  {
    id: "app-1001",
    trackingNo: "SAN-2026-1001",
    academicYear: "2026",
    applicantName: "আহমেদ মুসা",
    fatherName: "মো: রফিকুল ইসলাম",
    motherName: "নাজমা বেগম",
    targetClass: "১ম শ্রেণি",
    dob: "2019-06-14",
    birthRegNo: "20191592345000999",
    phone: "+880 1818-112233",
    address: "উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম",
    prevSchool: "ওয়াহেদপুর কিন্ডারগার্টেন",
    photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    feeAmount: 1000,
    paymentStatus: "অফিসে জমা দিতে হবে",
    status: "approved",
    submissionDate: "2026-01-04"
  }
];

// Initial Admin Credentials (Exact as specified in user requirement)
const initialCredentials: AdminCredentials = {
  email: "bmd03024@gmail.com",
  password: "01612118307",
  masterPin: "992288"
};

class MadrasahStorageService {
  private liveEventSource: EventSource | null = null;
  private currentDbVersion = 0;

  constructor() {
    this.initLiveSync();
    if (typeof window !== 'undefined') {
      githubDataService.pullLatestData().catch(() => {});
      githubDataService.startAutoPoll(60);
    }
  }

  public initLiveSync() {
    if (typeof window === 'undefined') return;
    this.hydrateFromServer();

    try {
      this.liveEventSource = new EventSource('/api/live-sync');
      this.liveEventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'SYNC_UPDATE' && payload.key) {
            this.setLocalSilently(payload.key, payload.value);
            window.dispatchEvent(new CustomEvent('bs_sync', { detail: { key: payload.key, value: payload.value, fromServer: true } }));
          } else if (payload.type === 'SYNC_ALL' || payload.type === 'AI_UPDATE') {
            this.hydrateFromServer();
          }
        } catch {}
      };
    } catch {}

    setInterval(() => {
      this.checkServerVersion();
    }, 15000);
  }

  private async checkServerVersion() {
    try {
      const res = await fetch('/api/sync/version');
      if (res.ok) {
        const { version } = await res.json();
        if (version && version > this.currentDbVersion) {
          this.hydrateFromServer();
        }
      }
    } catch {}
  }

  public async hydrateFromServer() {
    try {
      let data: Record<string, any> | null = null;
      let version = 0;

      try {
        const res = await fetch('/api/sync/all');
        const cType = res.headers.get('content-type') || '';
        if (res.ok && cType.includes('application/json')) {
          const json = await res.json();
          if (json && json.data && typeof json.data === 'object') {
            data = json.data;
            if (json.version) version = json.version;
          }
        }
      } catch {}

      if (!data) {
        for (const url of ['/institute_db.json', '/data/institute_db.json']) {
          try {
            const res = await fetch(url);
            const cType = res.headers.get('content-type') || '';
            if (res.ok && cType.includes('application/json')) {
              const parsed = await res.json();
              if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
                data = parsed;
                break;
              }
            }
          } catch {}
        }
      }

      if (data && typeof data === 'object') {
        for (const key of Object.keys(data)) {
          this.setLocalSilently(key, data[key]);
        }
        if (version) this.currentDbVersion = version;
        window.dispatchEvent(new CustomEvent('bs_sync', { detail: { key: 'all', fromServer: true } }));
      }
    } catch {}
  }

  public setLocalSilently<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`bs_${key}`, JSON.stringify(value));
    } catch {}
  }

  private get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(`bs_${key}`);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    this.setLocalSilently(key, value);
    try {
      localStorage.setItem(`bs_${key}_time`, Date.now().toString());
    } catch {}

    // 1. Instant 0ms UI update for the CURRENT window
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bs_sync', { detail: { key, value } }));
    }

    // 2. Real-time Multi-Tab (BroadcastChannel) & Multi-Device (Socket.io + SSE) propagation
    try {
      masterGateway.publish(key, value).catch(() => {});
    } catch {}

    // 3. Automated push to GitHub single source of truth
    githubDataService.triggerAutoPush(() => this.getFullDatabase());
  }

  private async pushToServer(key: string, value: any) {
    try {
      await fetch('/api/sync/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
    } catch {}
  }

  public getFullDatabase(): Record<string, any> {
    return {
      settings: this.getSettings(),
      slides: this.getSlides(),
      shortcuts: this.getShortcuts(),
      classes: this.getClasses(),
      subjects: this.getSubjects(),
      exam_types: this.getExamTypes(),
      teachers: this.getTeachers(),
      students: this.getStudents(),
      applications: this.getApplications(),
      results: this.getResults(),
      class_routines: this.getClassRoutines(),
      exam_routines: this.getExamRoutines(),
      ledger: this.getLedger(),
      notices: this.getNotices(),
      gallery: this.getGallery(),
      admin_creds: this.getAdminCredentials()
    };
  }

  // Getters & Setters
  getSettings(): InstituteSettings {
    const s = this.get<InstituteSettings>('settings', initialSettings);
    // Ensure all critical Madrasah fields are present
    return {
      ...initialSettings,
      ...s,
      pageNotes: { ...initialSettings.pageNotes, ...(s.pageNotes || {}) }
    };
  }
  saveSettings(settings: InstituteSettings): void {
    this.set('settings', settings);
  }

  getSlides(): HeroSlide[] {
    return this.get<HeroSlide[]>('slides', initialSlides);
  }
  saveSlides(slides: HeroSlide[]): void {
    this.set('slides', slides);
  }

  getShortcuts(): ShortcutItem[] {
    return this.get<ShortcutItem[]>('shortcuts', initialShortcuts);
  }
  saveShortcuts(shortcuts: ShortcutItem[]): void {
    this.set('shortcuts', shortcuts);
  }

  getClasses(): MadrasahClass[] {
    return this.get<MadrasahClass[]>('classes', initialClasses);
  }
  saveClasses(classes: MadrasahClass[]): void {
    this.set('classes', classes);
  }

  getSubjects(): MadrasahSubject[] {
    return this.get<MadrasahSubject[]>('subjects', initialSubjects);
  }
  saveSubjects(subjects: MadrasahSubject[]): void {
    this.set('subjects', subjects);
  }

  getExamTypes(): ExamTypeItem[] {
    return this.get<ExamTypeItem[]>('exam_types', initialExamTypes);
  }
  saveExamTypes(types: ExamTypeItem[]): void {
    this.set('exam_types', types);
  }

  getTeachers(): Teacher[] {
    return this.get<Teacher[]>('teachers', initialTeachers);
  }
  saveTeachers(teachers: Teacher[]): void {
    this.set('teachers', teachers);
  }

  getStudents(): Student[] {
    return this.get<Student[]>('students', initialStudents);
  }
  saveStudents(students: Student[]): void {
    this.set('students', students);
  }

  getApplications(): AdmissionApplication[] {
    return this.get<AdmissionApplication[]>('applications', initialApplications);
  }
  saveApplications(apps: AdmissionApplication[]): void {
    this.set('applications', apps);
  }

  getResults(): ResultRecord[] {
    return this.get<ResultRecord[]>('results', initialResults);
  }
  saveResults(results: ResultRecord[]): void {
    this.set('results', results);
  }

  getClassRoutines(): ClassRoutineItem[] {
    return this.get<ClassRoutineItem[]>('class_routines', initialClassRoutines);
  }
  saveClassRoutines(routines: ClassRoutineItem[]): void {
    this.set('class_routines', routines);
  }

  getExamRoutines(): ExamRoutineItem[] {
    return this.get<ExamRoutineItem[]>('exam_routines', initialExamRoutines);
  }
  saveExamRoutines(routines: ExamRoutineItem[]): void {
    this.set('exam_routines', routines);
  }

  getLedger(): LedgerItem[] {
    return this.get<LedgerItem[]>('ledger', initialLedger);
  }
  saveLedger(ledger: LedgerItem[]): void {
    this.set('ledger', ledger);
  }

  getNotices(): NoticeItem[] {
    return this.get<NoticeItem[]>('notices', initialNotices);
  }
  saveNotices(notices: NoticeItem[]): void {
    this.set('notices', notices);
  }

  getGallery(): GalleryItem[] {
    return this.get<GalleryItem[]>('gallery', initialGallery);
  }
  saveGallery(gallery: GalleryItem[]): void {
    this.set('gallery', gallery);
  }

  getAdminCredentials(): AdminCredentials {
    const creds = this.get<AdminCredentials>('admin_creds', initialCredentials);
    // Enforce exact credentials requested by user
    if (!creds.email || creds.email !== initialCredentials.email) {
      creds.email = initialCredentials.email;
      creds.password = initialCredentials.password;
      creds.masterPin = initialCredentials.masterPin;
      this.setLocalSilently('admin_creds', creds);
    }
    return creds;
  }

  saveAdminCredentials(creds: AdminCredentials): void {
    this.set('admin_creds', creds);
  }

  getExams(): ExamTypeItem[] {
    return this.get<ExamTypeItem[]>('exam_types', initialExamTypes);
  }

  getCertificates(): CertificateRecord[] {
    return this.get<CertificateRecord[]>('certificates', [
      {
        id: "cert-1",
        certificateNo: "CERT-2026-001",
        studentName: "মোহাম্মদ আব্দুল্লাহ",
        fatherName: "মাওলানা মো: কামরুল হাসান",
        motherName: "রোকেয়া বেগম",
        roll: "01",
        className: "১ম শ্রেণি",
        academicYear: "2026",
        examType: "বার্ষিক চূড়ান্ত মূল্যায়ন পরীক্ষা",
        gpa: 5.0,
        grade: "A+",
        issueDate: "2026-12-25",
        type: "বার্ষিক উত্তীর্ণ সনদপত্র"
      }
    ]);
  }

  saveCertificates(certs: CertificateRecord[]): void {
    this.set('certificates', certs);
  }

  getUploadedRoutines(): UploadedRoutineDoc[] {
    return this.get<UploadedRoutineDoc[]>('uploaded_routines', []);
  }

  saveUploadedRoutines(docs: UploadedRoutineDoc[]): void {
    this.set('uploaded_routines', docs);
  }

  getFeeBills(): StudentFeeBill[] {
    return this.get<StudentFeeBill[]>('fee_bills', [
      {
        id: "bill-1",
        billNo: "BILL-2026-001",
        academicYear: "2026",
        className: "শিশু শ্রেণি",
        classId: "class-shishu",
        roll: "01",
        studentName: "মোহাম্মদ আব্দুল্লাহ",
        fatherName: "মাওলানা মো: কামরুল হাসান",
        phone: "+880 1816-027456",
        month: "জানুয়ারি",
        items: [
          { id: "item-1", title: "মাসিক বেতন", amount: 500 },
          { id: "item-2", title: "সেশন চার্জ", amount: 200 },
          { id: "item-3", title: "আইডি কার্ড ও ডায়েরি ফি", amount: 150 }
        ],
        totalAmount: 850,
        status: "unpaid",
        publishDate: "2026-01-05",
        notes: "মাদ্রাসার হিসাব শাখায় সরাসরি এসে নগদ জমা দিন।"
      },
      {
        id: "bill-2",
        billNo: "BILL-2026-002",
        academicYear: "2026",
        className: "শিশু শ্রেণি",
        classId: "class-shishu",
        roll: "02",
        studentName: "ফাতিমা বিনতে হাসান",
        fatherName: "হাসান মাহমুদ",
        phone: "+880 1711-223344",
        month: "জানুয়ারি",
        items: [
          { id: "item-1", title: "মাসিক বেতন", amount: 500 },
          { id: "item-2", title: "সেশন চার্জ", amount: 200 }
        ],
        totalAmount: 700,
        status: "unpaid",
        publishDate: "2026-01-05",
        notes: "মাদ্রাসার হিসাব শাখায় সরাসরি এসে নগদ জমা দিন।"
      },
      {
        id: "bill-3",
        billNo: "BILL-2026-003",
        academicYear: "2026",
        className: "১ম শ্রেণি",
        classId: "class-1",
        roll: "01",
        studentName: "আহমাদ উল্লাহ",
        fatherName: "আব্দুল কুদ্দুস",
        phone: "+880 1812-345678",
        month: "জানুয়ারি",
        items: [
          { id: "item-1", title: "মাসিক বেতন", amount: 600 },
          { id: "item-2", title: "পরীক্ষা ফি", amount: 250 },
          { id: "item-3", title: "বিদ্যুৎ ও সংস্কার ফি", amount: 100 }
        ],
        totalAmount: 950,
        status: "unpaid",
        publishDate: "2026-01-05",
        notes: "মাদ্রাসার হিসাব শাখায় সরাসরি এসে নগদ জমা দিন।"
      }
    ]);
  }

  saveFeeBills(bills: StudentFeeBill[]): void {
    this.set('fee_bills', bills);
  }

  getNotes(): FreeNoteItem[] {
    return [
      {
        id: "fn-1",
        title: "নূরানী সহজ কায়দা ও মাখরাজ পরিচিতি চার্ট",
        subject: "কুরআন ও তাজবীদ",
        classOrCourse: "শিশু ও ১ম শ্রেণি",
        description: "২৯টি আরবি হরফের বিশুদ্ধ উচ্চারণ এবং মাখরাজের সচিত্র দিকনির্দেশনা শিট।",
        fileUrl: "#",
        fileSize: "১.৮ এমবি (PDF)",
        date: "২০২৬-০১-১০"
      },
      {
        id: "fn-2",
        title: "প্রতিদিনের প্রয়োজনীয় সহীহ দোয়া ও ৪০ হাদিস",
        subject: "হাদিস ও আদব",
        classOrCourse: "সকল শ্রেণির জন্য",
        description: "ঘুম থেকে ওঠা থেকে শুরু করে দৈনন্দিন জীবনের মাসনূন দোয়া ও ছোট হাদিস সংকলন।",
        fileUrl: "#",
        fileSize: "২.২ এমবি (PDF)",
        date: "২০২৬-০১-১৫"
      },
      {
        id: "fn-3",
        title: "নামাজের প্রয়োজনীয় সুরা, আত্তাহিয়্যাতু ও দুরুদ শরিফ",
        subject: "আ: মাসআলা ও সালাত",
        classOrCourse: "২য় ও ৩য় শ্রেণি",
        description: "সালাতের আরকান-আহকাম ও বিশুদ্ধভাবে সুরা ও তাসবীহ পাঠের সহায়িকা।",
        fileUrl: "#",
        fileSize: "১.৫ এমবি (PDF)",
        date: "২০২৬-০২-০১"
      }
    ];
  }

  getDemoClasses(): DemoClassItem[] {
    return [
      {
        id: "dc-1",
        title: "সহীহ নূরানী কায়দা ও মাখরাজ উচ্চারণ ক্লাস",
        instructor: "মাওলানা তোফাজ্জল হোসেন",
        duration: "২৫ মিনিট",
        youtubeId: "dQw4w9WgXcQ",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        subject: "কুরআন ও আরবী মৌখিক"
      },
      {
        id: "dc-2",
        title: "সহজ পদ্ধতিতে আরবি বর্ণমালা ও হরকত শিক্ষা",
        instructor: "মাওলানা জাহিদুল ইসলাম জাবেদ",
        duration: "২০ মিনিট",
        youtubeId: "dQw4w9WgXcQ",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        subject: "আরবি ভাষা"
      }
    ];
  }

  generateAutoRemarks(gpa: number, grade: string): string {
    if (grade === 'F' || gpa === 0) return 'আরো গভীর অধ্যবসায় ও মেহনত প্রয়োজন। নিয়মিত ক্লাসে উপস্থিতি আবশ্যক।';
    if (gpa >= 5.0) return 'অসাধারণ ও গৌরবোজ্জ্বল ফলাফল! আল্লাহ তায়ালা ইলমে বরকত দান করুন।';
    if (gpa >= 4.0) return 'উত্তম ও প্রশংসনীয় ফলাফল। ধারাবাহিকতা বজায় রাখা প্রয়োজন।';
    if (gpa >= 3.5) return 'খুব ভালো ফলাফল। আগামীতে আরো অগ্রগতির সুযোগ রয়েছে।';
    if (gpa >= 3.0) return 'সন্তোষজনক ফলাফল। দুর্বল বিষয়সমূহে বিশেষ যত্ন নেওয়া প্রয়োজন।';
    return 'উন্নতির সুযোগ রয়েছে। শিক্ষকের সাথে পরামর্শক্রমে পাঠাভ্যাস বাড়াতে হবে।';
  }

  // Auto Promote students based on Annual Exam Rank
  public autoPromoteStudents(fromClassId?: string, toClassId?: string, nextAcademicYear?: string): { promoted: number; promotedCount: number; message: string; summary: string } {
    const students = this.getStudents();
    const results = this.getResults();
    let totalPromoted = 0;

    const hierarchy = [
      { from: 'class-shishu', to: 'class-1', toName: '১ম শ্রেণি' },
      { from: 'class-1', to: 'class-2', toName: '২য় শ্রেণি' },
      { from: 'class-2', to: 'class-3', toName: '৩য় শ্রেণি' },
      { from: 'class-3', to: 'alumni', toName: 'উত্তীর্ণ (Alumni)' }
    ];

    hierarchy.forEach(step => {
      const classResults = results
        .filter(r => r.classId === step.from)
        .sort((a, b) => b.totalMarks - a.totalMarks);

      classResults.forEach((res, index) => {
        const std = students.find(s => s.roll === res.roll && s.classId === step.from);
        if (std) {
          if (step.to === 'alumni') {
            std.status = 'graduated';
          } else {
            std.classId = step.to;
            std.className = step.toName;
            const newRoll = String(index + 1).padStart(2, '0');
            std.roll = newRoll;
            std.id = newRoll;
            std.currentRank = index + 1;
            std.academicYear = '2026';
          }
          totalPromoted++;
        }
      });
    });

    this.saveStudents(students);
    return {
      promoted: totalPromoted,
      promotedCount: totalPromoted,
      message: `${totalPromoted} জন শিক্ষার্থীকে সফলভাবে পরবর্তী শ্রেণিতে উন্নীত করা হয়েছে!`,
      summary: `${totalPromoted} জন প্রমোশন পেয়েছেন`
    };
  }
}

export const storage = new MadrasahStorageService();
