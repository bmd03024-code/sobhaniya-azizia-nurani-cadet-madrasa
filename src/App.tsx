import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import { masterGateway } from './services/masterGateway';
import { MadrasahClass, Teacher, NoticeItem, GalleryItem, FreeNoteItem, DemoClassItem } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroSlider } from './components/home/HeroSlider';
import { QuickActionGrid } from './components/home/QuickActionGrid';
import { FounderMessage } from './components/home/FounderMessage';
import { CoursesSection } from './components/home/CoursesSection';
import { MentorsSection } from './components/home/MentorsSection';
import { MonthlyFeePaymentSection } from './components/home/MonthlyFeePaymentSection';
import { NoticeSection } from './components/home/NoticeSection';
import { GallerySection } from './components/home/GallerySection';
import { FreeResourcesSection } from './components/home/FreeResourcesSection';
import { FloatingChatbot } from './components/chatbot/FloatingChatbot';
import { FloatingToolsSuite } from './components/tools/FloatingToolsSuite';

// Modals
import { EnrollModal } from './components/modals/EnrollModal';
import { AdmitCardModal } from './components/modals/AdmitCardModal';
import { MarksheetModal } from './components/modals/MarksheetModal';
import { CertificateModal } from './components/modals/CertificateModal';
import { RoutineModal } from './components/modals/RoutineModal';
import { ContactModal } from './components/modals/ContactModal';
import { StudentIdCardModal } from './components/modals/StudentIdCardModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // App Data States
  const [settings, setSettings] = useState(() => storage.getSettings());
  const [slides, setSlides] = useState(() => storage.getSlides());
  const [shortcuts, setShortcuts] = useState(() => storage.getShortcuts());
  const [classes, setClasses] = useState<MadrasahClass[]>(() => storage.getClasses());
  const [teachers, setTeachers] = useState<Teacher[]>(() => storage.getTeachers());
  const [notices, setNotices] = useState<NoticeItem[]>(() => storage.getNotices());
  const [gallery, setGallery] = useState<GalleryItem[]>(() => storage.getGallery());
  const [notes, setNotes] = useState<FreeNoteItem[]>(() => storage.getNotes());
  const [demoClasses, setDemoClasses] = useState<DemoClassItem[]>(() => storage.getDemoClasses());

  // Modals state
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [targetClassForEnroll, setTargetClassForEnroll] = useState<string>('শিশু শ্রেণি');
  const [admitModalOpen, setAdmitModalOpen] = useState(false);
  const [marksheetModalOpen, setMarksheetModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [routineModalOpen, setRoutineModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);

  // Robust Real-Time Sync function for all tabs and admin updates
  const refreshAppData = () => {
    setSettings(storage.getSettings());
    setSlides(storage.getSlides());
    setShortcuts(storage.getShortcuts());
    setClasses(storage.getClasses());
    setTeachers(storage.getTeachers());
    setNotices(storage.getNotices());
    setGallery(storage.getGallery());
    setNotes(storage.getNotes());
    setDemoClasses(storage.getDemoClasses());
  };

  useEffect(() => {
    refreshAppData();

    const unsubGateway = masterGateway.subscribe(() => {
      refreshAppData();
    });

    const handleCustomSync = () => {
      refreshAppData();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('bs_')) {
        refreshAppData();
      }
    };

    window.addEventListener('bs_sync', handleCustomSync);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleCustomSync);

    return () => {
      unsubGateway();
      window.removeEventListener('bs_sync', handleCustomSync);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleCustomSync);
    };
  }, []);

  // Universal Navigation & Shortcut Handler
  const handleNavigate = (target: string) => {
    switch (target) {
      case 'home':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'admission':
      case 'enroll':
        setTargetClassForEnroll('শিশু শ্রেণি');
        setEnrollModalOpen(true);
        break;
      case 'result':
      case 'marksheet':
      case 'merit-list':
        setMarksheetModalOpen(true);
        break;
      case 'routine':
      case 'class-routine':
      case 'exam-routine':
        setRoutineModalOpen(true);
        break;
      case 'admit':
      case 'admit-card':
        setAdmitModalOpen(true);
        break;
      case 'certificate':
        setCertificateModalOpen(true);
        break;
      case 'idcard':
      case 'id-card':
        setIdCardModalOpen(true);
        break;
      case 'courses':
      case 'curriculum': {
        const el = document.getElementById('courses-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'teachers':
      case 'mentors': {
        const el = document.getElementById('mentors-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'founder': {
        const el = document.getElementById('founder-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'fee': {
        const el = document.getElementById('fee-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'notice': {
        const el = document.getElementById('notice-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'gallery': {
        const el = document.getElementById('gallery-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'notes':
      case 'resources': {
        const el = document.getElementById('free-resources-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      case 'contact':
        setContactModalOpen(true);
        break;
      case 'admin':
        setIsAdminLoginModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleEnrollClass = (className: string) => {
    setTargetClassForEnroll(className);
    setEnrollModalOpen(true);
  };

  // If Admin is logged in, show full-suite Admin Dashboard
  if (isAdminLoggedIn) {
    return (
      <AdminDashboard
        onLogout={() => {
          setIsAdminLoggedIn(false);
          refreshAppData();
        }}
        onViewWebsite={() => {
          setIsAdminLoggedIn(false);
          refreshAppData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      <Header
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        onNavigate={handleNavigate}
        hotline={settings.hotline}
        logoUrl={settings.logoUrl}
        headerTextSize={settings.headerTextSize}
        settings={settings}
      />

      {/* Page Special Note Banner from Admin CMS */}
      {settings.pageNotes?.home && (
        <div className="no-print bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 py-2.5 px-4 text-xs font-bold text-center border-b border-amber-600/30 flex items-center justify-center gap-2 shadow-xs">
          <span>{settings.pageNotes.home}</span>
        </div>
      )}

      <main className="grow">
        <HeroSlider
          slides={slides}
          onCtaClick={handleNavigate}
        />

        <QuickActionGrid
          shortcuts={shortcuts}
          onActionClick={handleNavigate}
        />

        <FounderMessage
          settings={settings}
          onExploreCourses={() => handleNavigate('courses')}
        />

        <CoursesSection
          classes={classes}
          onEnrollClass={handleEnrollClass}
          settings={settings}
        />

        <MonthlyFeePaymentSection
          classes={classes}
          settings={settings}
        />

        <MentorsSection
          teachers={teachers}
        />

        <NoticeSection
          notices={notices}
        />

        <FreeResourcesSection
          notes={notes}
          demoClasses={demoClasses}
        />

        <GallerySection
          gallery={gallery}
          settings={settings}
        />
      </main>

      <Footer
        settings={settings}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        onNavigate={handleNavigate}
      />

      <FloatingChatbot />
      <FloatingToolsSuite />

      {/* Modals */}
      <EnrollModal
        isOpen={enrollModalOpen}
        initialClass={targetClassForEnroll}
        classes={classes}
        settings={settings}
        onClose={() => setEnrollModalOpen(false)}
        onSuccess={() => {}}
      />

      <AdmitCardModal
        isOpen={admitModalOpen}
        classes={classes}
        onClose={() => setAdmitModalOpen(false)}
      />

      <MarksheetModal
        isOpen={marksheetModalOpen}
        classes={classes}
        onClose={() => setMarksheetModalOpen(false)}
      />

      <CertificateModal
        isOpen={certificateModalOpen}
        classes={classes}
        onClose={() => setCertificateModalOpen(false)}
      />

      <RoutineModal
        isOpen={routineModalOpen}
        classes={classes}
        onClose={() => setRoutineModalOpen(false)}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        settings={settings}
      />

      <StudentIdCardModal
        isOpen={idCardModalOpen}
        classes={classes}
        onClose={() => setIdCardModalOpen(false)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoginModalOpen(false);
          setIsAdminLoggedIn(true);
        }}
      />
    </div>
  );
}
