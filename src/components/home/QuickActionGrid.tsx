import React from 'react';
import { ShortcutItem } from '../../types';
import {
  BookOpen,
  Bell,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  Ticket,
  CreditCard,
  BarChart3,
  Award,
  FileText,
  PlayCircle,
  Users,
  PhoneCall,
  Sparkles,
  GraduationCap,
  Clock,
  CheckCircle,
  UserPlus
} from 'lucide-react';

interface QuickActionGridProps {
  shortcuts: ShortcutItem[];
  onActionClick: (target: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
  Bell: <Bell className="w-5 h-5 sm:w-6 sm:h-6" />,
  Calendar: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />,
  Image: <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
  MessageSquare: <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />,
  Ticket: <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />,
  CreditCard: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />,
  BarChart3: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />,
  Award: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
  FileText: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
  PlayCircle: <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
  Users: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
  Phone: <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />,
  PhoneCall: <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />,
  GraduationCap: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />,
  Clock: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
  CheckCircle: <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
  UserPlus: <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
};

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({ shortcuts, onActionClick }) => {
  const enabledShortcuts = shortcuts.filter(s => s.enabled);

  return (
    <section className="py-7 sm:py-10 bg-gradient-to-b from-emerald-50/50 via-slate-50 to-white border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 sm:mb-7 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-1.5 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>স্মার্ট শর্টকাট হাব (Quick Services)</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-950">
              ডিজিটাল সেবা ও সরাসরি অ্যাকশন
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              এক ক্লিকে রেজাল্ট, ভর্তি আবেদন, ক্লাস ও পরীক্ষার রুটিন, শিক্ষক পরিচিতি ও নোটিশ বোর্ড
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hidden sm:block">
            মাদ্রাসার অফিসিয়াল ডিজিটাল সার্ভিসেস
          </div>
        </div>

        {/* Dynamic Shortcut Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {enabledShortcuts.map((item) => (
            <button
              key={item.id}
              onClick={() => onActionClick(item.target)}
              className="group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-white border border-emerald-900/10 hover:border-emerald-500/50 shadow-xs hover:shadow-lg transition-all duration-200 text-center hover:-translate-y-1 active:translate-y-0"
            >
              {/* Optional badge */}
              {item.badge && (
                <span className="absolute -top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950 shadow-xs">
                  {item.badge}
                </span>
              )}

              {/* Icon with gradient badge */}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white mb-2 shadow-sm bg-gradient-to-br ${
                  item.color || 'from-emerald-700 to-teal-800'
                } group-hover:scale-110 transition-transform`}
              >
                {iconMap[item.iconName] || <BookOpen className="w-6 h-6" />}
              </div>

              {/* Title */}
              <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-900 leading-tight">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
