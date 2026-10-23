import React from 'react';
import { InstituteSettings } from '../../types';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, Globe, Sparkles, Shield, Heart } from 'lucide-react';

interface FooterProps {
  settings: InstituteSettings;
  onOpenAdminLogin: () => void;
  onNavigate: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdminLogin, onNavigate }) => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900/60">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 py-3.5 px-4 sm:px-6 border-b border-amber-500/20 text-center text-xs sm:text-sm text-emerald-100">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold">{settings.welcomeText}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Madrasah Brand & Speech */}
          <div className="lg:col-span-4 space-y-4">
            <div className="brightness-110">
              <Logo
                size="md"
                showText={true}
                customLogoUrl={settings.logoUrl}
                textSize={settings.headerTextSize}
                instituteName={settings.name}
                subName={settings.subName}
                founderName={settings.founderName}
              />
            </div>

            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
              {settings.footerText || 'সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা — দ্বীনি আদর্শ ও আধুনিক ক্যাডেট শিক্ষার মেলবন্ধন। অভিজ্ঞ শিক্ষক মণ্ডলী এবং নিবিড় তত্ত্বাবধান।'}
            </p>

            <div className="pt-2 text-xs text-emerald-300 space-y-1">
              <div>
                প্রতিষ্ঠাতা ও সভাপতি: <b className="text-amber-400">{settings.founderName}</b>
              </div>
              <div>
                প্রধান শিক্ষক: <b className="text-white">{settings.principalName || 'মাওলানা তোফাজ্জল হোসেন'}</b>
              </div>
              <div>অফিশিয়াল মোবাইল: <b className="text-white font-mono">{settings.hotline}</b></div>
              {settings.footerNotice && (
                <div className="text-[11px] text-amber-300/90 pt-1">
                  * {settings.footerNotice}
                </div>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-emerald-800 pb-2">
              প্রয়োজনীয় লিংক
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition-colors"
                >
                  মূল পাতা
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('founder')}
                  className="hover:text-amber-400 transition-colors"
                >
                  আমাদের পরিচয় ও বাণী
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('teachers')}
                  className="hover:text-amber-400 transition-colors"
                >
                  শিক্ষক মণ্ডলী
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admission')}
                  className="hover:text-amber-400 transition-colors font-bold text-amber-300"
                >
                  ভর্তি আবেদন (১০০০৳ ফি)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('result')}
                  className="hover:text-amber-400 transition-colors font-bold text-emerald-200"
                >
                  অনলাইন রেজাল্ট ও মার্কশিট
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('class-routine')}
                  className="hover:text-amber-400 transition-colors"
                >
                  ক্লাস রুটিন
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('exam-routine')}
                  className="hover:text-amber-400 transition-colors"
                >
                  পরীক্ষার রুটিন
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('notice')}
                  className="hover:text-amber-400 transition-colors"
                >
                  নোটিশ বোর্ড
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-amber-400 transition-colors"
                >
                  ফটো গ্যালারি
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-emerald-800 pb-2">
              ঠিকানা ও যোগাযোগ
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-200/90">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-white">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-300 shrink-0" />
                <span className="font-mono text-emerald-200 break-all">{settings.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ক্লাস স্তর: শিশু শ্রেণি হতে ৩য় শ্রেণি</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Google Map Embed */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider border-b border-emerald-800 pb-2">
              মাদ্রাসার অবস্থান
            </h4>
            <div className="w-full aspect-4/3 rounded-xl overflow-hidden border border-emerald-800 bg-emerald-900 shadow-inner">
              <iframe
                src={settings.mapEmbedUrl}
                title="Google Map"
                className="w-full h-full border-0 filter grayscale-15 contrast-110"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-12 pt-6 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-300/80">
          <div>
            {settings.footerCopyright || `© ${new Date().getFullYear()} ${settings.name}. সর্বস্বত্ব সংরক্ষিত।`}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdminLogin}
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors inline-flex items-center gap-1 bg-emerald-900/60 px-3 py-1.5 rounded-md border border-emerald-700/50"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>অ্যাডমিন পোর্টাল লগইন</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
