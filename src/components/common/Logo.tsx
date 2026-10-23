import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  customLogoUrl?: string;
  textSize?: 'normal' | 'large' | 'extra-large';
  instituteName?: string;
  subName?: string;
  founderName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  customLogoUrl,
  textSize = 'normal',
  instituteName = 'সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা',
  subName = 'উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম'
}) => {
  const sizeMap = {
    sm: { box: 'w-10 h-10', text: 'text-sm' },
    md: { box: 'w-13 h-13', text: 'text-base' },
    lg: { box: 'w-16 h-16', text: 'text-xl' },
    xl: { box: 'w-24 h-24', text: 'text-2xl' },
  };

  const dim = sizeMap[size];

  const titleScaleClass =
    textSize === 'large'
      ? 'text-lg sm:text-2xl'
      : textSize === 'extra-large'
      ? 'text-xl sm:text-3xl font-black'
      : 'brand-title';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 shrink-0 ${className}`}>
      {/* Madrasah Crescent & Star / Gold & Emerald Emblem */}
      <div className={`relative ${dim.box} rounded-full shrink-0 shadow-md ring-2 ring-emerald-600/80 p-0.5 bg-gradient-to-br from-amber-400 via-emerald-600 to-emerald-900 overflow-hidden`}>
        {customLogoUrl ? (
          <img
            src={customLogoUrl}
            alt="সোবহানিয়া আজিজিয়া মাদ্রাসা লোগো"
            className="w-full h-full rounded-full object-cover bg-white"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#064e3b] to-[#022c22] flex items-center justify-center p-1 text-center shadow-inner overflow-hidden relative">
            <div className="absolute inset-1 rounded-full border border-dashed border-amber-300/40 pointer-events-none" />
            <div className="flex flex-col items-center justify-center text-amber-300">
              <span className="text-[12px] font-bold leading-none font-arabic">☪</span>
              <span className="text-[7.5px] sm:text-[8px] font-bold text-white tracking-tight leading-none mt-0.5">মাদ্রাসা</span>
            </div>
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100/80 px-1.5 py-0.2 rounded border border-emerald-300/60 hidden sm:inline-block">
              নূরানী ও ক্যাডেট
            </span>
          </div>
          <h1 className={`${titleScaleClass} font-bold text-emerald-950 tracking-tight leading-tight whitespace-nowrap`}>
            {instituteName}
          </h1>
          <p className="brand-sub font-medium text-emerald-800 tracking-normal whitespace-nowrap hidden sm:block">
            {subName}
          </p>
        </div>
      )}
    </div>
  );
};
