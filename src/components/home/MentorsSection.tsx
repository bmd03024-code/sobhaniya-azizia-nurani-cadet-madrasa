import React, { useState } from 'react';
import { Teacher } from '../../types';
import { Award, Briefcase, GraduationCap, X, Phone, Mail, CheckCircle, Users, Shield, Calendar, Droplet } from 'lucide-react';

interface MentorsSectionProps {
  teachers: Teacher[];
  onOpenTeacherId?: (teacher: Teacher) => void;
}

export const MentorsSection: React.FC<MentorsSectionProps> = ({ teachers, onOpenTeacherId }) => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  return (
    <section id="teachers-section" className="py-12 sm:py-16 bg-white border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-2 border border-emerald-300">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>আমাদের শিক্ষক মণ্ডলী (Faculty & Teacher Panel)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-950">
            অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকবৃন্দ
          </h2>
          <p className="text-sm text-slate-600 mt-1.5">
            শিক্ষকের নামের ওপর ক্লিক করে ইউনিক Teacher ID, শিক্ষাগত যোগ্যতা ও আইডি কার্ড প্রোফাইল দেখুন
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              onClick={() => setSelectedTeacher(teacher)}
              className="group cursor-pointer bg-emerald-50/40 hover:bg-white rounded-2xl p-5 border border-emerald-900/15 hover:border-emerald-500 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-1"
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden p-1 ring-3 ring-emerald-700/30 group-hover:ring-amber-500 transition-all mb-4 bg-white shadow-inner">
                <img
                  src={teacher.photoUrl}
                  alt={teacher.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <span className="absolute bottom-1 right-2 bg-emerald-900 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-400">
                  {teacher.id}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                {teacher.name}
              </h3>
              <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                {teacher.designation}
              </p>

              <div className="mt-3 flex flex-wrap gap-1 justify-center">
                {teacher.specialist.slice(0, 2).map((sp, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-900 font-medium"
                  >
                    {sp}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 w-full flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px] font-mono text-emerald-950 font-semibold">{teacher.phone}</span>
                <span className="text-emerald-700 font-bold group-hover:underline">বিস্তারিত →</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Teacher Detailed Profile & ID Card */}
        {selectedTeacher && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-emerald-900/20 animate-in fade-in zoom-in duration-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-6 text-white relative">
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-amber-400 p-0.5 bg-white shrink-0">
                    <img
                      src={selectedTeacher.photoUrl}
                      alt={selectedTeacher.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold mb-1">
                      <Shield className="w-3 h-3" />
                      <span>Teacher ID: {selectedTeacher.id}</span>
                    </div>
                    <h3 className="text-xl font-black text-white">{selectedTeacher.name}</h3>
                    <p className="text-xs text-emerald-200">{selectedTeacher.designation}</p>
                    <p className="text-[11px] text-amber-300">সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                    <GraduationCap className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-700">শিক্ষাগত যোগ্যতা:</div>
                      <div className="text-sm font-semibold text-emerald-950">{selectedTeacher.qualification}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                    <Briefcase className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-700">অভিজ্ঞতা:</div>
                      <div className="text-sm text-slate-800">{selectedTeacher.experience}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-600">মোবাইল:</div>
                      <div className="font-mono font-bold text-emerald-900 mt-0.5">{selectedTeacher.phone}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-600 flex items-center gap-1">
                        <Droplet className="w-3.5 h-3.5 text-rose-600" />
                        <span>রক্তের গ্রুপ:</span>
                      </div>
                      <div className="font-bold text-rose-600 mt-0.5">{selectedTeacher.bloodGroup || 'O+'}</div>
                    </div>
                  </div>

                  {selectedTeacher.bio && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      <b className="text-emerald-950">শিক্ষক পরিচিতি:</b> {selectedTeacher.bio}
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-bold text-slate-700 mb-2">পাঠদানের বিষয়সমূহ:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTeacher.specialist.map((sp, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold">
                          ✓ {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedTeacher(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    বন্ধ করুন
                  </button>
                  <a
                    href={`tel:${selectedTeacher.phone}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>কল করুন</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
