import React, { useState } from 'react';
import { Logo } from './Logo';
import { Shield, PhoneCall, Award, BookOpen, Calendar, Users, Bell, Image, Menu, X, CheckCircle, GraduationCap } from 'lucide-react';
import { InstituteSettings } from '../../types';

interface HeaderProps {
  onOpenAdminLogin: () => void;
  onNavigate: (section: string) => void;
  hotline: string;
  logoUrl?: string;
  headerTextSize?: 'normal' | 'large' | 'extra-large';
  settings?: InstituteSettings;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdminLogin,
  onNavigate,
  hotline,
  logoUrl,
  headerTextSize,
  settings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-emerald-900/15 shadow-sm">
      {/* Top Islamic notification bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-slate-100 text-xs py-1.5 px-3 sm:px-6 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-xs">
              ভর্তি চলছে
            </span>
            <span className="truncate max-w-[240px] sm:max-w-none text-emerald-100 font-medium">
              ২০২৬ শিক্ষাবর্ষে শিশু থেকে ৩য় শ্রেণি পর্যন্ত সীমিত আসনে ভর্তি চলছে!
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs ml-auto">
            <span className="hidden md:inline text-amber-300 font-medium">
              উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম
            </span>
            <a
              href={`tel:${hotline || '+8801816027456'}`}
              className="inline-flex items-center gap-1.5 font-bold text-amber-300 hover:text-amber-200 transition-colors bg-white/10 px-2.5 py-0.5 rounded-md"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>{hotline || '+880 1816-027456'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <div className="cursor-pointer shrink-0" onClick={() => handleNavClick('home')}>
            <Logo
              size="md"
              showText={true}
              customLogoUrl={logoUrl || settings?.logoUrl}
              textSize={headerTextSize || settings?.headerTextSize}
              instituteName={settings?.name}
              subName={settings?.subName}
              founderName={settings?.founderName}
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-[13.5px] font-semibold text-slate-700">
            <button
              onClick={() => handleNavClick('home')}
              className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50 transition-colors"
            >
              মূল পাতা
            </button>
            <button
              onClick={() => handleNavClick('courses')}
              className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50 transition-colors inline-flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              শ্রেণিসমূহ
            </button>
            <button
              onClick={() => handleNavClick('founder')}
              className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50 transition-colors inline-flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              আমাদের পরিচয় ও বাণী
            </button>
            <button
              onClick={() => handleNavClick('teachers')}
              className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50 transition-colors inline-flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              শিক্ষক মণ্ডলী
            </button>
            <button
              onClick={() => handleNavClick('admission')}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 text-amber-900 border border-amber-500/30 font-bold hover:bg-amber-500/25 transition-colors inline-flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
              ভর্তি আবেদন
            </button>
            <button
              onClick={() => handleNavClick('result')}
              className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50 transition-colors inline-flex items-center gap-1 text-emerald-900 font-bold"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              রেজাল্ট ও মার্কশিট
            </button>
            <button
              onClick={() => handleNavClick('routine')}
              className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50 transition-colors inline-flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              রুটিন
            </button>
            <button
              onClick={() => handleNavClick('notice')}
              className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50 transition-colors inline-flex items-center gap-1"
            >
              <Bell className="w-3.5 h-3.5 text-rose-600" />
              নোটিশ
            </button>
            <button
              onClick={() => handleNavClick('gallery')}
              className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50 transition-colors inline-flex items-center gap-1"
            >
              <Image className="w-3.5 h-3.5 text-teal-700" />
              গ্যালারি
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="px-2.5 py-1.5 rounded-lg hover:text-emerald-900 hover:bg-emerald-50 transition-colors inline-flex items-center gap-1"
            >
              যোগাযোগ
            </button>
          </nav>

          {/* Right Action: Admin Login & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-800 to-teal-900 hover:from-emerald-900 hover:to-teal-950 rounded-lg shadow-sm hover:shadow transition-all ring-1 ring-emerald-700/50"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>অ্যাডমিন</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-emerald-100 bg-white/98 px-4 py-3 shadow-lg space-y-1 text-sm font-semibold text-slate-800">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50"
          >
            মূল পাতা
          </button>
          <button
            onClick={() => handleNavClick('courses')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 flex items-center justify-between"
          >
            <span>শ্রেণিসমূহ ও কারিকুলাম</span>
            <BookOpen className="w-4 h-4 text-emerald-700" />
          </button>
          <button
            onClick={() => handleNavClick('founder')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 flex items-center justify-between"
          >
            <span>আমাদের পরিচয় ও বাণী</span>
            <Award className="w-4 h-4 text-amber-600" />
          </button>
          <button
            onClick={() => handleNavClick('teachers')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 flex items-center justify-between"
          >
            <span>শিক্ষক মণ্ডলী ও আইডি</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </button>
          <button
            onClick={() => handleNavClick('admission')}
            className="w-full text-left px-3 py-2 rounded-lg bg-amber-50 text-amber-900 font-bold flex items-center justify-between"
          >
            <span>অনলাইন ভর্তি আবেদন (১০০০৳ ফি)</span>
            <GraduationCap className="w-4 h-4 text-amber-700" />
          </button>
          <button
            onClick={() => handleNavClick('result')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-800 font-bold flex items-center justify-between"
          >
            <span>রেজাল্ট ও মার্কশিট অনুসন্ধান</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </button>
          <button
            onClick={() => handleNavClick('routine')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 flex items-center justify-between"
          >
            <span>ক্লাস ও পরীক্ষার রুটিন</span>
            <Calendar className="w-4 h-4 text-emerald-700" />
          </button>
          <button
            onClick={() => handleNavClick('notice')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 flex items-center justify-between"
          >
            <span>নোটিশ বোর্ড</span>
            <Bell className="w-4 h-4 text-rose-600" />
          </button>
          <button
            onClick={() => handleNavClick('gallery')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 flex items-center justify-between"
          >
            <span>ফটো ও ভিডিও গ্যালারি</span>
            <Image className="w-4 h-4 text-teal-700" />
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50"
          >
            যোগাযোগ ও ঠিকানা
          </button>
        </div>
      )}
    </header>
  );
};
