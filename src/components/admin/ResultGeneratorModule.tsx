import React, { useState } from 'react';
import { MadrasahClass, Student, ResultRecord, SubjectMark, InstituteSettings, MadrasahSubject } from '../../types';
import { storage } from '../../services/storage';
import {
  BarChart3,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Printer,
  Edit,
  Award,
  Search,
  RefreshCw,
  X,
  FileCheck2,
  Camera,
  Upload,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

interface ResultGeneratorModuleProps {
  classes: MadrasahClass[];
  students: Student[];
  results: ResultRecord[];
  settings: InstituteSettings;
  onUpdateResults: (newResults: ResultRecord[]) => void;
  triggerNotification: (msg: string) => void;
}

export const calculateGradeAndGPA = (obtained: number, total: number = 100): { grade: string; gpa: number } => {
  if (total <= 0) return { grade: 'F', gpa: 0.0 };
  const percentage = (obtained / total) * 100;

  if (percentage >= 80) return { grade: 'A+', gpa: 5.0 };
  if (percentage >= 70) return { grade: 'A', gpa: 4.0 };
  if (percentage >= 60) return { grade: 'A-', gpa: 3.5 };
  if (percentage >= 50) return { grade: 'B', gpa: 3.0 };
  if (percentage >= 40) return { grade: 'C', gpa: 2.0 };
  if (percentage >= 33) return { grade: 'D', gpa: 1.0 };
  return { grade: 'F', gpa: 0.0 };
};

export const calculateOverallGPA = (marks: SubjectMark[]): { gpa: number; grade: string; totalObtained: number; totalMax: number } => {
  if (!marks || marks.length === 0) {
    return { gpa: 0.0, grade: 'F', totalObtained: 0, totalMax: 0 };
  }

  let totalObtained = 0;
  let totalMax = 0;
  let totalGPA = 0;
  let hasFailed = false;

  marks.forEach(m => {
    const ob = Number(m.obtained) || 0;
    const tot = Number(m.total) || 100;
    totalObtained += ob;
    totalMax += tot;
    const itemCalc = calculateGradeAndGPA(ob, tot);
    totalGPA += itemCalc.gpa;
    if (itemCalc.grade === 'F') {
      hasFailed = true;
    }
  });

  if (hasFailed) {
    return { gpa: 0.0, grade: 'F', totalObtained, totalMax };
  }

  const rawGPA = totalGPA / marks.length;
  const roundedGPA = Number(rawGPA.toFixed(2));

  let overallGrade = 'F';
  if (roundedGPA >= 5.0) overallGrade = 'A+';
  else if (roundedGPA >= 4.0) overallGrade = 'A';
  else if (roundedGPA >= 3.5) overallGrade = 'A-';
  else if (roundedGPA >= 3.0) overallGrade = 'B';
  else if (roundedGPA >= 2.0) overallGrade = 'C';
  else if (roundedGPA >= 1.0) overallGrade = 'D';

  return { gpa: roundedGPA, grade: overallGrade, totalObtained, totalMax };
};

export const ResultGeneratorModule: React.FC<ResultGeneratorModuleProps> = ({
  classes,
  students,
  results,
  settings,
  onUpdateResults,
  triggerNotification
}) => {
  const allSubjects: MadrasahSubject[] = storage.getSubjects();
  const exams = storage.getExams();

  const [academicYear, setAcademicYear] = useState('2026');
  const [classId, setClassId] = useState(classes[0]?.id || 'class-shishu');
  const [examType, setExamType] = useState('১ম সাময়িক পরীক্ষা');
  const [selectedRoll, setSelectedRoll] = useState('');
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [phone, setPhone] = useState('');

  // 7 core subject marks initialized with 100 max
  const [marks, setMarks] = useState<SubjectMark[]>(() =>
    allSubjects.map(s => ({
      subjectId: s.id,
      subjectName: s.name,
      obtained: 85,
      total: 100,
      grade: 'A+',
      gpa: 5.0
    }))
  );

  const [filterClass, setFilterClass] = useState(classes[0]?.id || 'all');
  const [filterExam, setFilterExam] = useState('all');
  const [filterYear, setFilterYear] = useState('2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewResult, setPreviewResult] = useState<ResultRecord | null>(null);

  // OCR state
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [ocrMessage, setOcrMessage] = useState<string | null>(null);

  // Handle Roll Selection / Auto-Fill student profile
  const handleRollChange = (rollVal: string) => {
    setSelectedRoll(rollVal);
    const matched = students.find(
      s => s.roll === rollVal.trim() && s.classId === classId && s.academicYear === academicYear
    );
    if (matched) {
      setStudentName(matched.name);
      setFatherName(matched.fatherName || '');
      setMotherName(matched.motherName || '');
      setPhone(matched.phone || '');
    }
  };

  const handleMarkChange = (index: number, val: string) => {
    const numericVal = Math.min(100, Math.max(0, Number(val) || 0));
    setMarks(prev => {
      const next = [...prev];
      const item = next[index];
      const { grade, gpa } = calculateGradeAndGPA(numericVal, item.total);
      next[index] = { ...item, obtained: numericVal, grade, gpa };
      return next;
    });
  };

  // OCR Scanner Handler: Upload handwritten or printed marksheet
  const handleOcrMarksheetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningOCR(true);
    setOcrMessage('Gemini Flash OCR দিয়ে নম্বর ফর্দ বিশ্লেষণ করা হচ্ছে...');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch('/api/ocr/scan-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, docType: 'marksheet' })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            const ext = data.data;
            if (ext.roll) handleRollChange(String(ext.roll));
            if (ext.studentName) setStudentName(ext.studentName);
            if (ext.marks && Array.isArray(ext.marks)) {
              setMarks(prev =>
                prev.map(p => {
                  const mMatch = ext.marks.find((em: any) =>
                    em.subjectName?.toLowerCase().includes(p.subjectName.toLowerCase()) ||
                    p.subjectName.toLowerCase().includes(em.subjectName?.toLowerCase() || '')
                  );
                  if (mMatch && mMatch.obtained !== undefined) {
                    const ob = Number(mMatch.obtained) || 0;
                    const { grade, gpa } = calculateGradeAndGPA(ob, p.total);
                    return { ...p, obtained: ob, grade, gpa };
                  }
                  return p;
                })
              );
            }
            setOcrMessage('✓ নম্বর ফর্দ থেকে তথ্য সফলভাবে স্ক্যান করা হয়েছে!');
            triggerNotification('OCR স্ক্যান সম্পন্ন হয়েছে!');
          }
        } else {
          setOcrMessage('OCR স্ক্যানে বিলম্ব হচ্ছে, আপনি সরাসরি নম্বর এন্ট্রি করতে পারেন।');
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setOcrMessage('OCR প্রসেস করা যায়নি, সরাসরি নম্বর এন্ট্রি করুন।');
    } finally {
      setIsScanningOCR(false);
    }
  };

  // Submit / Save Marksheet
  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoll.trim() || !studentName.trim()) {
      alert('অনুগ্রহ করে রোল নম্বর এবং শিক্ষার্থীর নাম নিশ্চিত করুন।');
      return;
    }

    const { gpa, grade, totalObtained } = calculateOverallGPA(marks);
    const autoRemarks = storage.generateAutoRemarks(gpa, grade);
    const currentClass = classes.find(c => c.id === classId);

    const record: ResultRecord = {
      id: editingId || `res-${Date.now()}`,
      academicYear,
      classId,
      className: currentClass?.name || 'শিশু শ্রেণি',
      examType,
      roll: selectedRoll.trim(),
      studentName: studentName.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      phone: phone.trim(),
      marks: [...marks],
      totalMarks: totalObtained,
      gpa,
      grade,
      rank: 1, // Will be computed globally across all students of this class & exam
      autoRemarks,
      published: true,
      date: new Date().toISOString().split('T')[0]
    };

    let updatedList = [...results];
    if (editingId) {
      updatedList = updatedList.map(r => (r.id === editingId ? record : r));
      setEditingId(null);
    } else {
      // Remove previous result if same exam, class, roll
      updatedList = updatedList.filter(
        r => !(r.academicYear === academicYear && r.classId === classId && r.examType === examType && r.roll === record.roll)
      );
      updatedList.unshift(record);
    }

    // Recompute Smart Rank for this class and exam
    const sortedForRank = updatedList
      .filter(r => r.academicYear === academicYear && r.classId === classId && r.examType === examType)
      .sort((a, b) => b.totalMarks - a.totalMarks);

    sortedForRank.forEach((r, idx) => {
      r.rank = idx + 1;
    });

    storage.saveResults(updatedList);
    onUpdateResults(updatedList);
    triggerNotification('রেজাল্ট সফলভাবে সংরক্ষিত ও মেধা স্থান (Rank) গণনা করা হয়েছে!');

    // Reset Form for next student
    setSelectedRoll('');
    setStudentName('');
    setFatherName('');
    setMotherName('');
    setPhone('');
  };

  const handleEdit = (res: ResultRecord) => {
    setEditingId(res.id);
    setAcademicYear(res.academicYear);
    setClassId(res.classId);
    setExamType(res.examType);
    setSelectedRoll(res.roll);
    setStudentName(res.studentName);
    setFatherName(res.fatherName);
    setMotherName(res.motherName);
    setPhone(res.phone || '');
    setMarks(res.marks);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই রেজাল্ট রেকর্ডটি মুছে ফেলতে চান?')) {
      const updated = results.filter(r => r.id !== id);
      storage.saveResults(updated);
      onUpdateResults(updated);
      triggerNotification('রেজাল্ট মুছে ফেলা হয়েছে!');
    }
  };

  // Filtered Results List
  const filteredResults = results.filter(r => {
    if (filterClass !== 'all' && r.classId !== filterClass) return false;
    if (filterExam !== 'all' && r.examType !== filterExam) return false;
    if (filterYear !== 'all' && r.academicYear !== filterYear) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.roll.toLowerCase().includes(q) || r.studentName.toLowerCase().includes(q);
    }
    return true;
  });

  const { gpa: liveGPA, grade: liveGrade, totalObtained: liveTotal } = calculateOverallGPA(marks);

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-700" />
            <span>রেজাল্ট ও মার্কশিট কন্ট্রোল ইঞ্জিন</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            ৭টি বিষয়ে নম্বর এন্ট্রি, জিপিএ ও অটো মন্তব্য
          </h2>
          <p className="text-xs text-slate-500">
            শিশু, ১ম, ২য় ও ৩য় শ্রেণির ফলাফল প্রস্তুত, OCR নম্বর ফর্দ স্ক্যান ও মেধা স্থান (Rank) ট্র্যাকিং
          </p>
        </div>

        {/* OCR Scan Marksheet Button */}
        <div className="flex items-center gap-3">
          <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all">
            <Camera className="w-4 h-4" />
            <span>OCR নম্বর ফর্দ স্ক্যান করুন</span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleOcrMarksheetUpload}
              disabled={isScanningOCR}
            />
          </label>
        </div>
      </div>

      {ocrMessage && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>{ocrMessage}</span>
          </div>
          <button onClick={() => setOcrMessage(null)} className="text-amber-700 hover:text-amber-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Entry Form */}
      <form onSubmit={handleSaveResult} className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            <span>{editingId ? 'রেজাল্ট ও মার্কস সংশোধন করুন' : 'নতুন রেজাল্ট ও মার্কস এন্ট্রি করুন'}</span>
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setSelectedRoll('');
                setStudentName('');
              }}
              className="text-xs text-red-600 hover:underline font-bold"
            >
              সংশোধন বাতিল করুন
            </button>
          )}
        </div>

        {/* Student & Exam Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাবর্ষ *</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
            >
              <option value="2026">২০২৬</option>
              <option value="2025">২০২৫</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি *</label>
            <select
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                if (selectedRoll) handleRollChange(selectedRoll);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পরীক্ষার নাম *</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
            >
              {exams.map((ex: any) => (
                <option key={ex.id} value={ex.name}>{ex.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">রোল নম্বর (Student ID) *</label>
            <input
              type="text"
              required
              placeholder="যেমন: ০১, ০২, ০৩"
              value={selectedRoll}
              onChange={(e) => handleRollChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-900 bg-emerald-50/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষার্থীর পূর্ণ নাম *</label>
            <input
              type="text"
              required
              placeholder="শিক্ষার্থীর নাম"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পিতার নাম</label>
            <input
              type="text"
              placeholder="পিতার নাম"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">মাতার নাম</label>
            <input
              type="text"
              placeholder="মাতার নাম"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800"
            />
          </div>
        </div>

        {/* 7 Subjects Marks Entry Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              ৭টি মৌলিক বিষয়ে প্রাপ্ত নম্বর এন্ট্রি (পূর্ণমান: ১০০ প্রতি বিষয়, মোট: ৭০০)
            </h4>
            <span className="text-[11px] font-semibold text-slate-500">
              পাস নম্বর: ৩৩ • ৮০+ নম্বর = A+ (GPA 5.0)
            </span>
          </div>

          <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-900 text-white font-bold text-[11px]">
                <tr>
                  <th className="p-3 border-r border-emerald-800 text-center w-12">ক্রম</th>
                  <th className="p-3 border-r border-emerald-800">বিষয়ের নাম</th>
                  <th className="p-3 border-r border-emerald-800 text-center w-24">পূর্ণমান</th>
                  <th className="p-3 border-r border-emerald-800 text-center w-36">প্রাপ্ত নম্বর (Obtained)</th>
                  <th className="p-3 border-r border-emerald-800 text-center w-24">লেটার গ্রেড</th>
                  <th className="p-3 text-center w-24">গ্রেড পয়েন্ট (GP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {marks.map((m, idx) => (
                  <tr key={m.subjectId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center font-bold text-slate-600 border-r border-slate-200">
                      {idx + 1}
                    </td>
                    <td className="p-3 font-bold text-slate-900 border-r border-slate-200">
                      {m.subjectName}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-600 border-r border-slate-200">
                      {m.total}
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={m.obtained}
                        onChange={(e) => handleMarkChange(idx, e.target.value)}
                        className="w-24 px-3 py-1.5 text-center font-mono font-bold text-sm rounded-lg border-2 border-emerald-600 bg-white focus:ring-2 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="p-3 text-center font-black border-r border-slate-200">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        m.grade === 'A+' ? 'bg-emerald-100 text-emerald-800' :
                        m.grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {m.grade}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800">
                      {m.gpa.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Computed GPA, Total & Remarks Preview */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">মোট প্রাপ্ত নম্বর</span>
              <span className="text-xl font-black text-emerald-950 font-mono">{liveTotal} / 700</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">সামগ্রিক জিপিএ (GPA)</span>
              <span className="text-xl font-black text-emerald-800 font-mono">{liveGPA.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">লেটার গ্রেড</span>
              <span className="text-xl font-black text-emerald-900">{liveGrade}</span>
            </div>
          </div>

          <div className="grow max-w-md">
            <span className="text-[11px] font-bold text-slate-500 block">স্বয়ংক্রিয় অটো মন্তব্য (Auto Remarks):</span>
            <span className="text-xs font-bold text-emerald-900 italic">
              "{storage.generateAutoRemarks(liveGPA, liveGrade)}"
            </span>
          </div>

          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>{editingId ? 'আপডেট সম্পন্ন করুন' : 'রেজাল্ট সংরক্ষণ ও মেধা স্থান নির্ধারণ'}</span>
          </button>
        </div>
      </form>

      {/* Results Database Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              সংরক্ষিত রেজাল্ট তালিকা ({filteredResults.length} জন শিক্ষার্থী)
            </h3>
            <p className="text-xs text-slate-500">
              ক্লাস ও মেধা স্থান (Rank / বর্তমান রোল) অনুযায়ী সাজানো হয়েছে
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800"
            >
              <option value="all">সকল শ্রেণি</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800"
            >
              <option value="all">সকল পরীক্ষা</option>
              {exams.map((ex: any) => (
                <option key={ex.id} value={ex.name}>{ex.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="রোল বা নাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800"
            />
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 text-center w-12">মেধা স্থান (Rank)</th>
                <th className="p-3 text-center w-16">রোল</th>
                <th className="p-3">শিক্ষার্থীর নাম</th>
                <th className="p-3">শ্রেণি</th>
                <th className="p-3">পরীক্ষা</th>
                <th className="p-3 text-center">মোট নম্বর</th>
                <th className="p-3 text-center">GPA</th>
                <th className="p-3 text-center">গ্রেড</th>
                <th className="p-3">অটো মন্তব্য</th>
                <th className="p-3 text-center w-28">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length > 0 ? (
                filteredResults.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center font-black text-amber-700">
                      #{r.rank}
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-900">
                      {r.roll}
                    </td>
                    <td className="p-3 font-bold text-slate-900">
                      {r.studentName}
                    </td>
                    <td className="p-3 text-slate-700">
                      {r.className}
                    </td>
                    <td className="p-3 text-slate-700">
                      {r.examType}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800">
                      {r.totalMarks}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-emerald-800">
                      {r.gpa.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                        r.grade === 'A+' ? 'bg-emerald-100 text-emerald-800' :
                        r.grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {r.grade}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 text-[11px] italic max-w-xs truncate">
                      {r.autoRemarks}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEdit(r)}
                          className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="সম্পাদনা করুন"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    কোনো রেজাল্ট ডাটা পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
