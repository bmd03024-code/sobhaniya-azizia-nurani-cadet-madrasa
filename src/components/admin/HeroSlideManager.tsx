import React, { useState } from 'react';
import { HeroSlide } from '../../types';
import { storage } from '../../services/storage';
import {
  Sliders,
  Plus,
  Trash2,
  Edit3,
  Save,
  Upload,
  Image as ImageIcon,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface HeroSlideManagerProps {
  slides: HeroSlide[];
  onSlidesUpdate: (updatedSlides: HeroSlide[]) => void;
  triggerNotification: (msg: string) => void;
}

// Preset Islamic & Educational high quality background images
const PRESET_BACKGROUNDS = [
  {
    id: 'p1',
    name: 'মসজিদ ও গম্বুজ (সূর্যাস্ত)',
    url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'p2',
    name: 'শ্রেণিকক্ষ ও পাঠদান',
    url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'p3',
    name: 'পবিত্র কুরআন ও রিহাল',
    url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'p4',
    name: 'ইসলামিক ইসলামিক স্থাপত্য',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'p5',
    name: 'মাদ্রাসা ক্যাম্পাস ও সবুজ উদ্যান',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80'
  },
  {
    id: 'p6',
    name: 'আধুনিক লাইব্রেরি ও বই',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80'
  }
];

const CTA_OPTIONS = [
  { value: 'result', label: 'অনলাইন রেজাল্ট ও মার্কশিট' },
  { value: 'admission', label: 'ভর্তি আবেদন ফরম' },
  { value: 'routine', label: 'ক্লাস ও পরীক্ষার রুটিন' },
  { value: 'notice', label: 'নোটিশ বোর্ড' },
  { value: 'contact', label: 'যোগাযোগ ও হটলাইন' },
  { value: 'teachers', label: 'শিক্ষক মণ্ডলী তালিকা' }
];

export const HeroSlideManager: React.FC<HeroSlideManagerProps> = ({
  slides,
  onSlidesUpdate,
  triggerNotification
}) => {
  // Editing / Modal state
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form State
  const [formData, setFormData] = useState<HeroSlide>({
    id: '',
    title: '',
    subText: '',
    image: '',
    ctaText: 'অনলাইন রেজাল্ট দেখুন',
    ctaAction: 'result',
    active: true
  });

  const [imageInputTab, setImageInputTab] = useState<'upload' | 'url' | 'preset'>('upload');
  const [imageFileLoading, setImageFileLoading] = useState(false);

  // Open Edit Modal
  const handleStartEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setIsAddingNew(false);
    setFormData({ ...slide });
  };

  // Open Add New Slide Modal
  const handleStartAdd = () => {
    const newId = `slide-${Date.now()}`;
    setEditingSlide(null);
    setIsAddingNew(true);
    setFormData({
      id: newId,
      title: 'সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা',
      subText: 'উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম। নূরানী, নাজেরা ও আধুনিক ক্যাডেট পাঠ্যক্রমের সমন্বয়ে আলোকিত দ্বীনি ভবিষ্যৎ গড়ে তুলুন।',
      image: PRESET_BACKGROUNDS[0].url,
      ctaText: 'অনলাইন রেজাল্ট দেখুন',
      ctaAction: 'result',
      active: true
    });
  };

  // Cancel Form
  const handleCancelForm = () => {
    setEditingSlide(null);
    setIsAddingNew(false);
  };

  // Handle local image file upload & base64 conversion
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।');
      return;
    }

    setImageFileLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData(prev => ({ ...prev, image: base64 }));
      setImageFileLoading(false);
      triggerNotification(`'${file.name}' ছবিটি স্লাইডের ব্যাকগ্রাউন্ড হিসেবে যুক্ত হয়েছে!`);
    };
    reader.onerror = () => {
      alert('ছবি আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      setImageFileLoading(false);
    };
    reader.readAsDataURL(file);
  };

  // Save current slide form (Add or Edit)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('স্লাইডের শিরোনাম খালি রাখা যাবে না।');
      return;
    }
    if (!formData.image.trim()) {
      alert('স্লাইডের ব্যাকগ্রাউন্ড ছবি আবশ্যক। ছবি আপলোড করুন অথবা লিংক দিন।');
      return;
    }

    let updated: HeroSlide[];
    if (isAddingNew) {
      updated = [...slides, formData];
      triggerNotification(`'${formData.title.substring(0, 20)}...' স্লাইডটি সফলভাবে যোগ করা হয়েছে!`);
    } else {
      updated = slides.map(s => (s.id === formData.id ? formData : s));
      triggerNotification(`'${formData.title.substring(0, 20)}...' স্লাইডটি সফলভাবে আপডেট করা হয়েছে!`);
    }

    onSlidesUpdate(updated);
    storage.saveSlides(updated);
    setEditingSlide(null);
    setIsAddingNew(false);
  };

  // Toggle active/inactive
  const handleToggleActive = (slideId: string) => {
    const updated = slides.map(s => (s.id === slideId ? { ...s, active: !s.active } : s));
    onSlidesUpdate(updated);
    storage.saveSlides(updated);
    const target = updated.find(s => s.id === slideId);
    triggerNotification(
      target?.active ? 'স্লাইডটি ওয়েবসাইটে সক্রিয় করা হয়েছে।' : 'স্লাইডটি সাময়িকভাবে নিষ্ক্রিয় করা হয়েছে।'
    );
  };

  // Delete slide
  const handleDeleteSlide = (slideId: string, title: string) => {
    if (slides.length <= 1) {
      alert('কমপক্ষে একটি স্লাইড থাকা আবশ্যক। আপনি এটি মুছতে পারবেন না, চাইলে নিষ্ক্রিয় বা পরিবর্তন করতে পারেন।');
      return;
    }

    if (confirm(`আপনি কি নিশ্চিত যে '${title}' স্লাইডটি মুছে ফেলতে চান?`)) {
      const updated = slides.filter(s => s.id !== slideId);
      onSlidesUpdate(updated);
      storage.saveSlides(updated);
      triggerNotification('স্লাইডটি সফলভাবে মুছে ফেলা হয়েছে।');
    }
  };

  // Reorder slides
  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    onSlidesUpdate(updated);
    storage.saveSlides(updated);
    triggerNotification('স্লাইডের ক্রম সফলভাবে পরিবর্তন করা হয়েছে।');
  };

  // Reset to default slides
  const handleResetDefaults = () => {
    if (confirm('আপনি কি পূর্বনির্ধারিত মূল ৩টি স্লাইডে রিসেট করতে চান? আপনার বর্তমান পরিবর্তনগুলো মুছে যাবে।')) {
      const defaults: HeroSlide[] = [
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
      onSlidesUpdate(defaults);
      storage.saveSlides(defaults);
      triggerNotification('সফলভাবে ডিফল্ট স্লাইডে রিসেট করা হয়েছে!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-2">
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>হোমপেজ ব্যানার স্লাইডার</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">হিরো স্লাইড ম্যানেজমেন্ট</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            হোমপেজের মূল ব্যানারে প্রদর্শিত স্লাইডগুলোর ছবি ও টেক্সট সরাসরি এডিট, নতুন স্লাইড যোগ অথবা ছবি পরিবর্তন করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="ডিফল্ট ৩টি স্লাইডে ফিরুন"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>ডিফল্ট রিসেট</span>
          </button>

          <button
            onClick={handleStartAdd}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>নতুন স্লাইড যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Slide Edit / Add Modal or Inline Form */}
      {(isAddingNew || editingSlide) && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500/40 shadow-lg p-5 sm:p-7 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isAddingNew ? 'নতুন হিরো স্লাইড তৈরি করুন' : 'হিরো স্লাইড সম্পাদনা করুন'}
                </h3>
                <p className="text-xs text-slate-500">শিরোনাম, বর্ণনা এবং ছবি পরিবর্তন করে সংরক্ষণ করুন</p>
              </div>
            </div>
            <button
              onClick={handleCancelForm}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-6">
            {/* Live Interactive Preview Box */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-700" />
                  <span>লাইভ ব্যানার প্রিভিউ (ওয়েবসাইটে যেমন দেখাবে)</span>
                </label>
                <span className="text-[11px] text-slate-400">রিয়েল-টাইম প্রিভিউ</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-emerald-950 text-white min-h-[220px] sm:min-h-[260px] flex items-center border border-emerald-900 shadow-md">
                {/* Background Image with realistic emerald gradient overlays */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                  style={{ backgroundImage: `url(${formData.image || PRESET_BACKGROUNDS[0].url})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/80 to-teal-950/70" />
                  <div className="absolute inset-0 bg-radial-gradient from-transparent via-emerald-950/40 to-emerald-950/85" />
                </div>

                <div className="relative p-6 sm:p-8 max-w-2xl space-y-3 z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-semibold backdrop-blur-xs">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>নূরানী, নাজেরা ও আধুনিক ক্যাডেট শিক্ষার আদর্শ প্রতিষ্ঠান</span>
                  </div>

                  <h4 className="text-lg sm:text-2xl font-black text-white leading-tight drop-shadow-sm">
                    {formData.title || 'শিরোনাম লিখুন...'}
                  </h4>

                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed line-clamp-2">
                    {formData.subText || 'উপ-শিরোনাম বা বর্ণনা লিখুন...'}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 shadow-md">
                      <span>{formData.ctaText || 'অ্যাকশন বাটন'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-800/80 text-white border border-emerald-600/50">
                      <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                      <span>ভর্তি আবেদন (১০০০৳ ফি)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  স্লাইডের মূল শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 focus:outline-emerald-800"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  উপ-শিরোনাম বা বিস্তারিত বিবরণ *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="যেমন: উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম। নূরানী, নাজেরা ও আধুনিক ক্যাডেট পাঠ্যক্রমের সমন্বয়ে আলোকিত দ্বীনি ভবিষ্যৎ গড়ে তুলুন।"
                  value={formData.subText}
                  onChange={e => setFormData({ ...formData, subText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  কল-টু-অ্যাকশন (CTA) বাটন টেক্সট
                </label>
                <input
                  type="text"
                  placeholder="যেমন: অনলাইন রেজাল্ট দেখুন"
                  value={formData.ctaText}
                  onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বাটন ক্লিক অ্যাকশন (কোন পেজ বা মডালে যাবে)
                </label>
                <select
                  value={formData.ctaAction}
                  onChange={e => setFormData({ ...formData, ctaAction: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                >
                  {CTA_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.value})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* IMAGE MANAGEMENT SECTION (File Upload / Direct URL / Presets) */}
            <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-800" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    স্লাইডের ব্যাকগ্রাউন্ড ছবি পরিবর্তন করুন:
                  </span>
                </div>

                {/* Sub-tabs for Image Selection */}
                <div className="inline-flex rounded-xl bg-slate-200/80 p-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setImageInputTab('upload')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      imageInputTab === 'upload' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    সরাসরি আপলোড (ফাইল)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputTab('url')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      imageInputTab === 'url' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ছবির লিংক (URL)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputTab('preset')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      imageInputTab === 'preset' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    রেডিমেড ইসলামিক ফটো
                  </button>
                </div>
              </div>

              {/* 1. Direct File Upload */}
              {imageInputTab === 'upload' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    আপনার মোবাইল বা কম্পিউটার থেকে সরাসরি উচ্চমানের ছবি আপলোড করুন। এটি স্বয়ংক্রিয়ভাবে প্রসেস হয়ে ব্রাউজার ও গিটহাবে সংরক্ষিত হবে।
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label className="cursor-pointer px-4 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors">
                      <Upload className="w-4 h-4 text-amber-300" />
                      <span>{imageFileLoading ? 'প্রসেস হচ্ছে...' : 'কম্পিউটার/মোবাইল থেকে ছবি সিলেক্ট করুন'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={imageFileLoading}
                      />
                    </label>

                    {formData.image && (
                      <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>ছবি সফলভাবে সংযুক্ত রয়েছে</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. Direct URL Input */}
              {imageInputTab === 'url' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    ছবির ওয়েব লিংক (Direct Image URL - HTTPS)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... অথবা নিজস্ব হোস্টিং লিংক"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    উচ্চ রেজোলিউশনের (১৬০০×৯০০ পিক্সেল) ল্যান্ডস্কেপ ছবি ব্যবহারে সর্বোত্তম লুক পাওয়া যাবে।
                  </p>
                </div>
              )}

              {/* 3. Preset Images */}
              {imageInputTab === 'preset' && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600">
                    নিচের যে কোনো একটি ইসলামিক ও শিক্ষামূলক ছবিতে ক্লিক করে ১-ক্লিকেই স্লাইডে সেট করুন:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    {PRESET_BACKGROUNDS.map(preset => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, image: preset.url });
                          triggerNotification(`'${preset.name}' ছবিটি নির্বাচন করা হয়েছে!`);
                        }}
                        className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all ${
                          formData.image === preset.url
                            ? 'border-emerald-600 ring-2 ring-emerald-500/30 scale-102'
                            : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-16 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="p-1.5 bg-white text-[10px] font-bold text-slate-800 truncate">
                          {preset.name}
                        </div>
                        {formData.image === preset.url && (
                          <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active Toggle & Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={e => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700"
                />
                <span className="text-xs font-bold text-slate-800">
                  স্লাইডটি ওয়েবসাইটে সক্রিয় রাখুন (Active on Website)
                </span>
              </label>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>{isAddingNew ? 'স্লাইডটি যুক্ত করুন' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Existing Slides List Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-800" />
            <h3 className="text-base font-bold text-slate-900">
              বর্তমান স্লাইড তালিকা ({slides.length} টি)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            ক্রম পরিবর্তন করতে তীরচিহ্ন বা সম্পাদনা বাটনে ক্লিক করুন
          </span>
        </div>

        {slides.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-3">
            <ImageIcon className="w-12 h-12 mx-auto stroke-1" />
            <p className="text-sm font-semibold">কোনো স্লাইড পাওয়া যায়নি।</p>
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
            >
              ডিফল্ট স্লাইড যোগ করুন
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {slides.map((slide, index) => (
              <div
                key={slide.id || index}
                className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-2xl border transition-all gap-4 ${
                  slide.active
                    ? 'border-slate-200 bg-white hover:border-emerald-300 shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 opacity-75'
                }`}
              >
                {/* Left: Thumbnail & Content */}
                <div className="flex items-start sm:items-center gap-4 grow min-w-0">
                  {/* Order Index & Controls */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveSlide(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"
                      title="উপরে নিন"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black text-slate-500 w-5 text-center">
                      {index + 1}
                    </span>
                    <button
                      onClick={() => handleMoveSlide(index, 'down')}
                      disabled={index === slides.length - 1}
                      className="p-1 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"
                      title="নিচে নিন"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail Image */}
                  <div className="relative w-24 sm:w-32 h-16 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 shadow-2xs">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate max-w-md">
                        {slide.title}
                      </h4>
                      {slide.active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <Check className="w-3 h-3" /> সক্রিয়
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                          <EyeOff className="w-3 h-3" /> নিষ্ক্রিয়
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-lg">
                      {slide.subText}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 pt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-semibold border border-amber-200/60">
                        বাটন: {slide.ctaText || 'অ্যাকশন'}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>টার্গেট: {slide.ctaAction}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {/* Quick Active Toggle */}
                  <button
                    onClick={() => handleToggleActive(slide.id)}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      slide.active
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title={slide.active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                  >
                    {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span className="hidden sm:inline">{slide.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => handleStartEdit(slide)}
                    className="p-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>এডিট করুন</span>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteSlide(slide.id, slide.title)}
                    className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
