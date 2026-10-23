import { storage } from './storage';

export interface QAPair {
  id: string;
  q: string;
  a: string;
  ts: number;
  source?: string;
}

class LocalChatbot {
  memory: QAPair[] = [];

  constructor() {
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem('madrasah_chat_memory');
      this.memory = saved ? JSON.parse(saved) : [];
    } catch {
      this.memory = [];
    }
  }

  async appendQAPair(q: string, a: string, source = 'chat') {
    const p: QAPair = { id: `qa-${Date.now()}`, q, a, ts: Date.now(), source };
    this.memory.unshift(p);
    try {
      localStorage.setItem('madrasah_chat_memory', JSON.stringify(this.memory.slice(0, 50)));
    } catch {
      // ignore
    }
  }

  async ask(question: string): Promise<string> {
    const q = question.toLowerCase();
    const settings = storage.getSettings();
    const teachers = storage.getTeachers();

    if (q.includes('ভর্তি') || q.includes('admission') || q.includes('ফি') || q.includes('fee')) {
      return `সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসায় ভর্তি ফি ১,০০০/- (এক হাজার টাকা)। এই ফি সরাসরি মাদ্রাসার অফিসে জমা দিতে হবে। বই, খাতা, চক ও সিলেট মাদ্রাসার অফিস বা লাইব্রেরি থেকে আলাদা ক্রয় করতে হবে। যোগাযোগ: ${settings.hotline}`;
    }

    if (q.includes('শ্রেণি') || q.includes('ক্লাস') || q.includes('class')) {
      return `আমাদের মাদ্রাসায় মোট ৪টি শ্রেণি চালু রয়েছে: শিশু শ্রেণি, ১ম শ্রেণি, ২য় শ্রেণি এবং ৩য় শ্রেণি। প্রতিটি শ্রেণিতে নূরানী পদ্ধতি ও আধুনিক ক্যাডেট কারিকুলামে পাঠদান করা হয়।`;
    }

    if (q.includes('বিষয়') || q.includes('subject') || q.includes('বই') || q.includes('সিলেবাস')) {
      return `মাদ্রাসার ৭টি মৌলিক আবশ্যিক বিষয়: ১. কুরআন মাজিদ ও আরবী মৌখিক, ২. হাদিস ও আসমাউল হুসনা, ৩. আ: মাসআলা ও আ: সালাত, ৪. আরবি, ৫. বাংলা, ৬. গণিত এবং ৭. ইংরেজি।`;
    }

    if (q.includes('শিক্ষক') || q.includes('teacher') || q.includes('উস্তাদ') || q.includes('হুজুর')) {
      const tList = teachers.map(t => `${t.name} (${t.designation})`).join(', ');
      return `আমাদের মাদ্রাসার অভিজ্ঞ ও নিবেদিতপ্রাণ শিক্ষকবৃন্দ: ${tList}। প্রধান শিক্ষক: ${settings.principalName}।`;
    }

    if (q.includes('প্রতিষ্ঠাতা') || q.includes('সভাপতি') || q.includes('সভাপতি')) {
      return `মাদ্রাসার প্রতিষ্ঠাতা সভাপতি হলেন: ${settings.founderName}। প্রধান শিক্ষক: ${settings.principalName}।`;
    }

    if (q.includes('ঠিকানা') || q.includes('লোকেশন') || q.includes('কোথায়') || q.includes('address')) {
      return `ঠিকানা: ${settings.address}। হটলাইন / মোবাইল: ${settings.hotline}।`;
    }

    if (q.includes('রেজাল্ট') || q.includes('মার্কশিট') || q.includes('ফলাফল') || q.includes('result')) {
      return `ওয়েবসাইটের "রেজাল্ট ও মার্কশিট" বাটন থেকে শিক্ষাবর্ষ, শ্রেণি ও শিক্ষার্থীর রোল নম্বর দিয়ে তাৎক্ষণিক ৭টি বিষয়ের মার্কশিট ও মেধা তালিকা দেখা এবং প্রিন্ট করা যায়।`;
    }

    if (q.includes('রুটিন') || q.includes('ক্লাস টাইম') || q.includes('পরীক্ষা')) {
      return `ওয়েবসাইটের "ক্লাস ও পরীক্ষার রুটিন" অংশ থেকে শিশু শ্রেণি থেকে ৩য় শ্রেণির সম্পূর্ণ সময়সূচি এবং সাময়িক ও বার্ষিক পরীক্ষার রুটিন পাওয়া যায়।`;
    }

    // Default response with hotline
    return `আসসালামু আলাইকুম। সোবহানিয়া আজিজিয়া নূরানী ক্যাডেট মাদ্রাসার অনলাইন হেল্পডেস্কে আপনাকে স্বাগতম। ভর্তি, ফলাফল বা যেকোনো তথ্যের জন্য আমাদের হটলাইন ${settings.hotline}-এ কল করতে পারেন অথবা মাদ্রাসার অফিসে (উত্তর ওয়াহেদপুর, মীরসরাই, চট্টগ্রাম) যোগাযোগ করতে পারেন।`;
  }
}

export const chatbot = new LocalChatbot();
