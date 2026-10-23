
export interface QAItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  teacherId?: string;
  teacherName?: string;
  teacherVerified: boolean;
  timesUsed: number;
  createdAt: string;
  lastUsedAt?: string;
}

export interface TrainingChunk {
  id: string;
  title: string;
  category: string;
  content: string; // Up to 1,000 words per chunk
  wordCount: number;
  tags: string[];
  updatedAt: string;
}

// Initial pre-trained teacher verified Q&A database for Sobhania Azizia Noorani Cadet Madrasah
const INITIAL_QA_ITEMS: QAItem[] = [
  {
    id: 'qa-1',
    question: 'সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসায় কোন কোন শ্রেণিতে ভর্তি হওয়া যায়?',
    answer: 'আমাদের মাদ্রাসায় শিশু শ্রেণি, ১ম শ্রেণি, ২য় শ্রেণি এবং ৩য় শ্রেণিতে নূরানী পদ্ধতি ও আধুনিক ক্যাডেট পাঠ্যক্রমে শিক্ষার্থী ভর্তি করানো হয়। প্রতিটি শ্রেণিতে অভিজ্ঞ আলেম ও শিক্ষক দ্বারা পাঠদান পরিচালিত হয়।',
    keywords: ['শ্রেণি', 'ক্লাস', 'ভর্তি', 'শিশু শ্রেণি', '১ম শ্রেণি', '২য় শ্রেণি', '৩য় শ্রেণি', 'সিলেবাস'],
    teacherName: 'মাওলানা তোফাজ্জল হোসেন',
    teacherVerified: true,
    timesUsed: 25,
    createdAt: '2026-01-10'
  },
  {
    id: 'qa-2',
    question: 'ভর্তি ফি কত এবং কীভাবে পরিশোধ করতে হয়?',
    answer: '২০২৬ শিক্ষাবর্ষে ভর্তি ফি মাত্র ১,০০০/- (এক হাজার টাকা)। এই ফি অবশ্যই সরাসরি মাদ্রাসার অফিসে এসে জমা দিতে হবে। বই, খাতা, চক ও সিলেট মাদ্রাসার অফিস বা লাইব্রেরি থেকে আলাদা ক্রয় করতে হবে। যোগাযোগের হটলাইন: +880 1816-027456।',
    keywords: ['ভর্তি ফি', 'ফি', 'টাকা', 'পেমেন্ট', 'বই', 'খাতা', 'অফিস'],
    teacherName: 'মাওলানা তোফাজ্জল হোসেন',
    teacherVerified: true,
    timesUsed: 42,
    createdAt: '2026-01-12'
  },
  {
    id: 'qa-3',
    question: 'মাদ্রাসার ৭টি মৌলিক আবশ্যিক পরীক্ষার বিষয় কী কী?',
    answer: 'মাদ্রাসার ৭টি মূল বিষয় হলো: ১. কুরআন মাজিদ ও আরবী মৌখিক, ২. হাদিস ও আসমাউল হুসনা, ৩. আ: মাসআলা ও আ: সালাত, ৪. আরবি, ৫. বাংলা, ৬. গণিত এবং ৭. ইংরেজি। প্রতি বিষয়ে ১০০ নম্বরের লিখিত ও মৌখিক মূল্যায়ন হয় এবং পাস নম্বর ৪০। মোট নম্বর ৭০০।',
    keywords: ['বিষয়', 'বিষয়সমূহ', 'কুরআন', 'হাদিস', 'আরবি', 'বাংলা', 'গণিত', 'ইংরেজি', 'নম্বর', 'পাস'],
    teacherName: 'মাওলানা তোফাজ্জল হোসেন',
    teacherVerified: true,
    timesUsed: 36,
    createdAt: '2026-01-15'
  },
  {
    id: 'qa-4',
    question: 'অনলাইনে রেজাল্ট ও মার্কশিট কীভাবে দেখা যায়?',
    answer: 'ওয়েবসাইটের "রেজাল্ট ও মার্কশিট" বাটনে ক্লিক করে শিক্ষাবর্ষ, শ্রেণি ও শিক্ষার্থীর রোল নম্বর লিখে সার্চ করলেই ৭টি বিষয়ের নম্বর, জিপিএ, লেটার গ্রেড ও মেধা তালিকা সম্বলিত অফিশিয়াল মার্কশিট চলে আসে। এটি তাৎক্ষণিক প্রিন্ট করা যায়।',
    keywords: ['রেজাল্ট', 'মার্কশিট', 'ফলাফল', 'রোল', 'গ্রেড', 'জিপিএ', 'প্রিন্ট'],
    teacherName: 'মাওলানা তোফাজ্জল হোসেন',
    teacherVerified: true,
    timesUsed: 28,
    createdAt: '2026-01-18'
  },
  {
    id: 'qa-5',
    question: 'মাদ্রাসার প্রতিষ্ঠাতা সভাপতি ও প্রধান শিক্ষক কে?',
    answer: 'সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসার প্রতিষ্ঠাতা ও সভাপতি আলহাজ্ব হযরত মাওলানা আবদুল মোমিন নাসেরি এবং প্রধান শিক্ষক মাওলানা তোফাজ্জল হোসেন। মাদ্রাসাটি চট্টগ্রামের মীরসরাই উপজেলার উত্তর ওয়াহেদপুরে অবস্থিত।',
    keywords: ['প্রতিষ্ঠাতা', 'সভাপতি', 'প্রধান শিক্ষক', 'পরিচালনা', 'ঠিকানা', 'মীরসরাই', 'ওয়াহেদপুর'],
    teacherName: 'আলহাজ্ব হযরত মাওলানা আবদুল মোমিন নাসেরি',
    teacherVerified: true,
    timesUsed: 50,
    createdAt: '2026-01-20'
  }
];

// Initial Training Chunks for Sobhania Azizia Noorani Cadet Madrasah
const INITIAL_TRAINING_CHUNKS: TrainingChunk[] = [
  {
    id: 'chunk-1',
    title: 'প্রতিষ্ঠান পরিচিতি, আদর্শ ও পরিচালনা পরিষদ',
    category: 'প্রতিষ্ঠান ও পরিচালনা',
    content: `সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসা উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রামে অবস্থিত একটি ঐতিহ্যবাহী দ্বীনি ও আধুনিক ক্যাডেট ধারার অনন্য শিক্ষাপ্রতিষ্ঠান। এর প্রতিষ্ঠাতা ও সভাপতি আলহাজ্ব হযরত মাওলানা আবদুল মোমিন নাসেরি এবং প্রধান শিক্ষক মাওলানা তোফাজ্জল হোসেন। প্রতিষ্ঠানটিতে পবিত্র কুরআন ও হাদিসের বিশুদ্ধ শিক্ষা, তাজবীদ ও সুন্নাহ অনুসরণের পাশাপাশি আধুনিক ক্যাডেট সিলেবাসের গণিত, ইংরেজি ও বাংলা পাঠদান করা হয়। শিশু শ্রেণি থেকে ৩য় শ্রেণি পর্যন্ত সুশৃঙ্খল পরিবেশে পাঠদানের মাধ্যমে চরিত্রবান, নৈতিক ও আলোকিত মানুষ গড়ে তোলাই এই মাদ্রাসার মূল লক্ষ্য।`,
    wordCount: 85,
    tags: ['প্রতিষ্ঠান', 'সোবহানিয়া আজিজিয়া', 'মাদ্রাসা', 'প্রতিষ্ঠাতা', 'প্রধান শিক্ষক', 'ওয়াহেদপুর', 'মীরসরাই'],
    updatedAt: '2026-01-15'
  },
  {
    id: 'chunk-2',
    title: 'ভর্তি পলিসি ও দাপ্তরিক নিয়মাবলী',
    category: 'ভর্তি ও ফি পলিসি',
    content: `২০২৬ শিক্ষাবর্ষে শিশু শ্রেণি থেকে ৩য় শ্রেণি পর্যন্ত নতুন শিক্ষার্থী ভর্তি চলছে। ভর্তি ফি ১,০০০/- (এক হাজার টাকা) যা সরাসরি মাদ্রাসার কার্যালয়ে এসে জমা দিতে হবে। নতুন শিক্ষার্থীদের জন্য বই, খাতা, চক ও সিলেট মাদ্রাসার অফিস বা নির্ধারিত লাইব্রেরি থেকে আলাদাভাবে সংগ্রহ করতে হবে। ভর্তি ফরম ওয়েবসাইটের "ভর্তি আবেদন" থেকে অনলাইনে পূরণ করা যায় অথবা সরাসরি মাদ্রাসার অফিসে এসে ফরম পূরণ করে ভর্তি নিশ্চিত করা যায়।`,
    wordCount: 72,
    tags: ['ভর্তি', 'ভর্তি ফি', '১০০০ টাকা', 'অফিস', 'বই খাতা', 'নিয়মাবলী'],
    updatedAt: '2026-01-18'
  },
  {
    id: 'chunk-3',
    title: 'পরীক্ষা পদ্ধতি, ৭টি আবশ্যিক বিষয় ও ফলাফল প্রণয়ন',
    category: 'পরীক্ষা ও ফলাফল',
    content: `সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসায় ১ম সাময়িক, ২য় সাময়িক ও বার্ষিক পরীক্ষা অনুষ্ঠিত হয়। প্রতিটি শ্রেণির ৭টি মৌলিক বিষয়ে সর্বমোট ৭০০ নম্বরে মূল্যায়ন করা হয়। বিষয়গুলো: কুরআন মাজিদ ও আরবী মৌখিক, হাদিস ও আসমাউল হুসনা, আ: মাসআলা ও আ: সালাত, আরবি, বাংলা, গণিত এবং ইংরেজি। প্রতিটি বিষয়ে পাস নম্বর ৪০। আধুনিক রেজাল্ট জেনারেটর সফটওয়্যারের মাধ্যমে স্বয়ংক্রিয় জিপিএ, মেধা স্থান (র‍্যাংক) এবং ফলাফলভিত্তিক অটো মন্তব্য প্রস্তুত করে তাৎক্ষণিক রঙিন মার্কশিট প্রদান করা হয়।`,
    wordCount: 80,
    tags: ['পরীক্ষা', '৭টি বিষয়', '৭০০ নম্বর', 'মার্কশিট', 'রেজাল্ট', 'জিপিএ', 'পাস ৪০'],
    updatedAt: '2026-01-20'
  }
];

class AIKnowledgeStoreService {
  private qaCache: QAItem[] = [];
  private chunksCache: TrainingChunk[] = [];
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;
    try {
      const qaRaw = localStorage.getItem('bs_ai_qa_kb');
      this.qaCache = qaRaw ? JSON.parse(qaRaw) : INITIAL_QA_ITEMS;

      const chunksRaw = localStorage.getItem('bs_ai_training_chunks');
      this.chunksCache = chunksRaw ? JSON.parse(chunksRaw) : INITIAL_TRAINING_CHUNKS;

      this.initialized = true;
    } catch {
      this.qaCache = INITIAL_QA_ITEMS;
      this.chunksCache = INITIAL_TRAINING_CHUNKS;
      this.initialized = true;
    }
  }

  // Save QA items to local storage
  private persistQA() {
    try {
      localStorage.setItem('bs_ai_qa_kb', JSON.stringify(this.qaCache));
      window.dispatchEvent(new CustomEvent('bs_sync', { detail: { key: 'ai_qa_kb' } }));
    } catch (e) {
      console.warn('Persist QA error:', e);
    }
  }

  // Save Training Chunks (up to 200,000+ words across chunks)
  private persistChunks() {
    try {
      localStorage.setItem('bs_ai_training_chunks', JSON.stringify(this.chunksCache));
      window.dispatchEvent(new CustomEvent('bs_sync', { detail: { key: 'ai_training_chunks' } }));
    } catch (e) {
      console.warn('Persist chunks error:', e);
    }
  }

  // Get all Q&A pairs
  getKnowledgeBase(): QAItem[] {
    this.init();
    return this.qaCache;
  }

  // Get all training chunks (supports 200,000+ words)
  getTrainingChunks(): TrainingChunk[] {
    this.init();
    return this.chunksCache;
  }

  // Total words across all knowledge chunks
  getTotalWordCount(): number {
    this.init();
    const chunkWords = this.chunksCache.reduce((acc, c) => acc + (c.content ? c.content.split(/\s+/).filter(Boolean).length : 0), 0);
    const qaWords = this.qaCache.reduce((acc, q) => acc + (q.answer ? q.answer.split(/\s+/).filter(Boolean).length : 0), 0);
    return chunkWords + qaWords;
  }

  // Add a verified Teacher-Student Q&A pair (Dynamic Self-Learning)
  addQAPair(
    question: string,
    answer: string,
    teacherName: string = 'মাওলানা তোফাজ্জল হোসেন',
    teacherVerified: boolean = true
  ): QAItem {
    this.init();
    const cleanQ = question.trim();
    const cleanA = answer.trim();

    // Extract relevant keywords
    const keywords = cleanQ
      .toLowerCase()
      .split(/[\s,?!;।+*()/-]+/)
      .filter(w => w.length > 2);

    // Check if question already exists
    const existingIndex = this.qaCache.findIndex(
      q => q.question.toLowerCase() === cleanQ.toLowerCase()
    );

    let savedItem: QAItem;
    if (existingIndex >= 0) {
      savedItem = {
        ...this.qaCache[existingIndex],
        answer: cleanA,
        teacherName: teacherName || this.qaCache[existingIndex].teacherName,
        teacherVerified: true,
        keywords: Array.from(new Set([...this.qaCache[existingIndex].keywords, ...keywords])),
        timesUsed: this.qaCache[existingIndex].timesUsed + 1,
        lastUsedAt: new Date().toISOString()
      };
      this.qaCache[existingIndex] = savedItem;
    } else {
      savedItem = {
        id: `qa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        question: cleanQ,
        answer: cleanA,
        keywords: Array.from(new Set(keywords)),
        teacherName,
        teacherVerified,
        timesUsed: 1,
        createdAt: new Date().toISOString().split('T')[0],
        lastUsedAt: new Date().toISOString()
      };
      this.qaCache.unshift(savedItem);
    }

    this.persistQA();
    return savedItem;
  }

  // Save or update an Admin Training Chunk (up to 1,000 words per chunk)
  saveTrainingChunk(
    chunk: Omit<TrainingChunk, 'id' | 'wordCount' | 'updatedAt'> & { id?: string }
  ): TrainingChunk {
    this.init();
    const words = chunk.content.trim().split(/\s+/).filter(Boolean).length;
    const finalId = chunk.id || `chunk-${Date.now()}`;

    const existingIdx = this.chunksCache.findIndex(c => c.id === finalId);
    const newChunk: TrainingChunk = {
      ...chunk,
      id: finalId,
      wordCount: words,
      tags: chunk.tags || [],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    if (existingIdx >= 0) {
      this.chunksCache[existingIdx] = newChunk;
    } else {
      this.chunksCache.push(newChunk);
    }

    this.persistChunks();
    return newChunk;
  }

  // Delete a training chunk
  deleteTrainingChunk(id: string): void {
    this.init();
    this.chunksCache = this.chunksCache.filter(c => c.id !== id);
    this.persistChunks();
  }

  // Delete a Q&A pair
  deleteQAPair(id: string): void {
    this.init();
    this.qaCache = this.qaCache.filter(q => q.id !== id);
    this.persistQA();
  }

  // Keyword and semantic retrieval algorithm for AI Chatbot
  searchLearnedAnswer(query: string): {
    answer: string;
    confidence: number;
    source: string;
    teacherName?: string;
  } | null {
    this.init();
    if (!query || !query.trim()) return null;

    const lowerQuery = query.toLowerCase().trim();
    const queryTerms = lowerQuery.split(/[\s,?!;।+*()/-]+/).filter(w => w.length > 1);

    if (queryTerms.length === 0) return null;

    // 1. Search in teacher-verified QA Items
    let bestQA: QAItem | null = null;
    let highestQAScore = 0;

    for (const item of this.qaCache) {
      const lowerQ = item.question.toLowerCase();
      let score = 0;

      if (lowerQ === lowerQuery) {
        score += 100;
      } else if (lowerQ.includes(lowerQuery) || lowerQuery.includes(lowerQ)) {
        score += 50;
      }

      for (const term of queryTerms) {
        if (item.keywords.some(k => k.toLowerCase() === term)) {
          score += 15;
        } else if (lowerQ.includes(term)) {
          score += 10;
        }
      }

      if (score > highestQAScore) {
        highestQAScore = score;
        bestQA = item;
      }
    }

    if (bestQA && highestQAScore >= 20) {
      bestQA.timesUsed = (bestQA.timesUsed || 0) + 1;
      bestQA.lastUsedAt = new Date().toISOString();
      this.persistQA();

      return {
        answer: bestQA.answer,
        confidence: Math.min(100, highestQAScore),
        source: `শিক্ষক কর্তৃক যাচাইকৃত প্রশ্নোত্তর (${bestQA.teacherName || 'মাওলানা তোফাজ্জল হোসেন'})`,
        teacherName: bestQA.teacherName
      };
    }

    // 2. Search in 200,000+ words Training Chunks
    let bestChunk: TrainingChunk | null = null;
    let highestChunkScore = 0;
    let matchedSnippet = '';

    for (const chunk of this.chunksCache) {
      const lowerContent = chunk.content.toLowerCase();
      const lowerTitle = chunk.title.toLowerCase();
      let score = 0;

      for (const term of queryTerms) {
        if (lowerTitle.includes(term)) {
          score += 20;
        }
        if (chunk.tags.some(t => t.toLowerCase() === term)) {
          score += 15;
        }
        const count = (lowerContent.match(new RegExp(term, 'g')) || []).length;
        score += Math.min(count * 5, 25);
      }

      if (score > highestChunkScore) {
        highestChunkScore = score;
        bestChunk = chunk;

        const sentences = chunk.content.split(/(?<=[।.\n])\s*/).map(s => s.trim()).filter(Boolean);
        const scoredSentences = sentences.map(sent => {
          const lowerS = sent.toLowerCase();
          let sentScore = 0;
          for (const term of queryTerms) {
            if (lowerS.includes(term)) sentScore += 10;
          }
          return { text: sent, score: sentScore };
        });

        const matched = scoredSentences.filter(s => s.score > 0);
        if (matched.length > 0) {
          const topScoring = [...matched].sort((a, b) => b.score - a.score).slice(0, 3);
          const orderedTexts = sentences.filter(s => topScoring.some(ts => ts.text === s));
          matchedSnippet = orderedTexts.join(' ');
        } else {
          matchedSnippet = sentences.slice(0, 2).join(' ');
        }
      }
    }

    if (bestChunk && highestChunkScore >= 20) {
      const finalExcerpt = matchedSnippet || bestChunk.content.slice(0, 300) + '...';
      return {
        answer: `📌 [${bestChunk.title}]\n\n${finalExcerpt}`,
        confidence: Math.min(95, highestChunkScore),
        source: `প্রতিষ্ঠানের ডাটাবেজ মডিউল (${bestChunk.category})`
      };
    }

    return null;
  }

  // Bulk update data from server
  hydrateFromServer(data: { qa?: QAItem[]; chunks?: TrainingChunk[] }) {
    if (data.qa && Array.isArray(data.qa)) {
      this.qaCache = data.qa;
      localStorage.setItem('bs_ai_qa_kb', JSON.stringify(this.qaCache));
    }
    if (data.chunks && Array.isArray(data.chunks)) {
      this.chunksCache = data.chunks;
      localStorage.setItem('bs_ai_training_chunks', JSON.stringify(this.chunksCache));
    }
    window.dispatchEvent(new CustomEvent('bs_sync', { detail: { key: 'ai_hydrated' } }));
  }
}

export const aiKnowledgeStore = new AIKnowledgeStoreService();
