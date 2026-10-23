import React, { useState, useEffect } from 'react';
import { HeroSlide } from '../../types';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface HeroSliderProps {
  slides: HeroSlide[];
  onCtaClick: (action: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides, onCtaClick }) => {
  const activeSlides = slides.filter(s => s.active);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (currentIdx >= activeSlides.length) {
      setCurrentIdx(0);
    }
  }, [activeSlides.length, currentIdx]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const current = activeSlides[currentIdx] || activeSlides[0];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-emerald-950 text-white select-none">
      {/* Background Image with layered gradient overlays */}
      <div className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[520px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out transform scale-105"
          style={{ backgroundImage: `url(${current.image})` }}
        >
          {/* Islamic deep emerald and dark tint overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/80 to-teal-950/70" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-emerald-950/40 to-emerald-950/85" />
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 w-full z-10">
          <div className="max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs sm:text-sm font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>নূরানী, নাজেরা ও আধুনিক ক্যাডেট শিক্ষার আদর্শ প্রতিষ্ঠান</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              {current.title}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-emerald-100/90 font-normal leading-relaxed max-w-2xl drop-shadow-sm">
              {current.subText}
            </p>

            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => onCtaClick(current.ctaAction || 'result')}
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{current.ctaText || 'রেজাল্ট দেখুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onCtaClick('admission')}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-emerald-800/80 hover:bg-emerald-700/80 text-white backdrop-blur-sm border border-emerald-600/50 transition-all"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>ভর্তি আবেদন (১০০০৳ ফি)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Previous / Next Navigation Arrows */}
        {activeSlides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-emerald-950/60 hover:bg-emerald-900/90 text-white/80 hover:text-white backdrop-blur-xs border border-emerald-700/40 transition-all z-20"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-emerald-950/60 hover:bg-emerald-900/90 text-white/80 hover:text-white backdrop-blur-xs border border-emerald-700/40 transition-all z-20"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIdx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
