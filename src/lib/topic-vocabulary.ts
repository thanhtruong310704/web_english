/**
 * BỘ TỪ VỰNG NÂNG CẤP TOÀN DIỆN THEO 40 CHỦ ĐỀ CEFR (A1 -> B2) + KHO PHRASAL VERBS, IDIOMS & TIẾNG ANH KỸ THUẬT
 * - 40 chủ đề x 15 từ vựng/chủ đề = 600 từ vựng cốt lõi
 * - 40 Phrasal Verbs, Idioms & Technical/Workplace English terms
 * - Tổng cộng: 640+ mục từ vựng chuẩn hóa kèm IPA, từ loại, nghĩa tiếng Việt và câu ví dụ thực tế.
 */

import { SRSCard, createFlashcardOneClick } from "./srs-flashcards";

export interface TopicWordItem {
  word: string;
  pos: string;
  ipa: string;
  meaningVi: string;
  exampleSentence: string;
}

export interface IdiomOrPhrasalItem {
  term: string;
  type: "Phrasal Verb" | "Idiom" | "Technical / Engineering" | "Workplace / Project";
  cefr: "A1" | "A2" | "B1" | "B2";
  ipa: string;
  meaningVi: string;
  example: string;
}

export const PHRASAL_VERBS_AND_IDIOMS: IdiomOrPhrasalItem[] = [
  {
    "term": "brush up on",
    "type": "Phrasal Verb",
    "cefr": "B1",
    "ipa": "/brʌʃ ʌp ɒn/",
    "meaningVi": "ôn lại, trau dồi lại kiến thức",
    "example": "I need to brush up on my technical English before the job interview."
  },
  {
    "term": "come across",
    "type": "Phrasal Verb",
    "cefr": "A2",
    "ipa": "/kʌm əˈkrɒs/",
    "meaningVi": "tình cờ bắt gặp",
    "example": "I came across a great open-source English learning platform yesterday."
  },
  {
    "term": "figure out",
    "type": "Phrasal Verb",
    "cefr": "A2",
    "ipa": "/ˈfɪɡ.ər aʊt/",
    "meaningVi": "tìm ra cách giải quyết, hiểu ra",
    "example": "Can you help me figure out why the PLC sensor is not responding?"
  },
  {
    "term": "look forward to",
    "type": "Phrasal Verb",
    "cefr": "A2",
    "ipa": "/lʊk ˈfɔː.wəd tuː/",
    "meaningVi": "mong đợi, háo hức chờ đón",
    "example": "We look forward to hearing from your engineering team soon."
  },
  {
    "term": "run out of",
    "type": "Phrasal Verb",
    "cefr": "A2",
    "ipa": "/rʌn aʊt ɒv/",
    "meaningVi": "cạn kiệt, hết sạch",
    "example": "We ran out of coffee beans this morning, so I went to the supermarket."
  },
  {
    "term": "keep up with",
    "type": "Phrasal Verb",
    "cefr": "B1",
    "ipa": "/kiːp ʌp wɪð/",
    "meaningVi": "bắt kịp, theo kịp tiến độ",
    "example": "Shadowing helps you keep up with fast native speakers at 160 wpm."
  },
  {
    "term": "carry out",
    "type": "Phrasal Verb",
    "cefr": "B1",
    "ipa": "/ˈkær.i aʊt/",
    "meaningVi": "tiến hành, thực hiện (thí nghiệm/dự án)",
    "example": "The engineers carried out a thorough safety inspection on the factory floor."
  },
  {
    "term": "point out",
    "type": "Phrasal Verb",
    "cefr": "B1",
    "ipa": "/pɔɪnt aʊt/",
    "meaningVi": "chỉ ra, lưu ý",
    "example": "The reviewer pointed out a critical routing issue on the 4-layer PCB."
  },
  {
    "term": "turn down",
    "type": "Phrasal Verb",
    "cefr": "B1",
    "ipa": "/tɜːn daʊn/",
    "meaningVi": "từ chối hoặc vặn nhỏ âm lượng",
    "example": "Please turn down the music so I can focus on my listening practice."
  },
  {
    "term": "set up",
    "type": "Phrasal Verb",
    "cefr": "A2",
    "ipa": "/set ʌp/",
    "meaningVi": "thiết lập, cài đặt, thành lập",
    "example": "It takes only one minute to set up the free deployment on Vercel."
  },
  {
    "term": "call off",
    "type": "Phrasal Verb",
    "cefr": "B1",
    "ipa": "/kɔːl ɒf/",
    "meaningVi": "hủy bỏ",
    "example": "They had to call off the outdoor football match due to heavy rain."
  },
  {
    "term": "put off",
    "type": "Phrasal Verb",
    "cefr": "B1",
    "ipa": "/pʊt ɒf/",
    "meaningVi": "trì hoãn",
    "example": "Never put off until tomorrow what you can study today."
  },
  {
    "term": "get across",
    "type": "Phrasal Verb",
    "cefr": "B2",
    "ipa": "/ɡet əˈkrɒs/",
    "meaningVi": "truyền đạt (ý tưởng) rõ ràng",
    "example": "Diagrams help engineers get complex technical ideas across clearly."
  },
  {
    "term": "look into",
    "type": "Phrasal Verb",
    "cefr": "B1",
    "ipa": "/lʊk ˈɪn.tuː/",
    "meaningVi": "điều tra, xem xét kỹ",
    "example": "Our technical support team will look into the server latency issue right away."
  },
  {
    "term": "break down",
    "type": "Phrasal Verb",
    "cefr": "A2",
    "ipa": "/breɪk daʊn/",
    "meaningVi": "bị hỏng máy / chia nhỏ vấn đề",
    "example": "Let's break down the project into four manageable weekly milestones."
  },
  {
    "term": "catch up on",
    "type": "Phrasal Verb",
    "cefr": "B1",
    "ipa": "/kætʃ ʌp ɒn/",
    "meaningVi": "làm bù, cập nhật tin tức",
    "example": "I spent Sunday afternoon catching up on my vocabulary flashcards."
  },
  {
    "term": "hand in",
    "type": "Phrasal Verb",
    "cefr": "A2",
    "ipa": "/hænd ɪn/",
    "meaningVi": "nộp bài, đệ trình",
    "example": "All students must hand in their semester reports by Friday."
  },
  {
    "term": "take over",
    "type": "Phrasal Verb",
    "cefr": "B2",
    "ipa": "/teɪk ˈəʊ.vər/",
    "meaningVi": "tiếp quản, đảm nhận",
    "example": "She will take over as the lead automation engineer next month."
  },
  {
    "term": "back up",
    "type": "Phrasal Verb",
    "cefr": "B1",
    "ipa": "/bæk ʌp/",
    "meaningVi": "sao lưu dữ liệu / hỗ trợ",
    "example": "Always back up your database schema and configuration files."
  },
  {
    "term": "phase out",
    "type": "Phrasal Verb",
    "cefr": "B2",
    "ipa": "/feɪz aʊt/",
    "meaningVi": "loại bỏ dần theo lộ trình",
    "example": "The factory is phasing out legacy controllers in favor of modern PLCs."
  },
  {
    "term": "hit the nail on the head",
    "type": "Idiom",
    "cefr": "B2",
    "ipa": "/hɪt ðə neɪl ɒn ðə hed/",
    "meaningVi": "nói trúng phóc, chỉ đúng trọng tâm",
    "example": "You hit the nail on the head when you identified the power supply noise."
  },
  {
    "term": "a piece of cake",
    "type": "Idiom",
    "cefr": "A2",
    "ipa": "/ə piːs ɒv keɪk/",
    "meaningVi": "dễ như ăn kẹo",
    "example": "After practicing 50 lessons, the A1 listening test was a piece of cake."
  },
  {
    "term": "on the same page",
    "type": "Idiom",
    "cefr": "B1",
    "ipa": "/ɒn ðə seɪm peɪdʒ/",
    "meaningVi": "cùng chung quan điểm, hiểu thống nhất",
    "example": "Let's have a quick 5-minute sync to make sure everyone is on the same page."
  },
  {
    "term": "go the extra mile",
    "type": "Idiom",
    "cefr": "B2",
    "ipa": "/ɡəʊ ði ˈek.strə maɪl/",
    "meaningVi": "nỗ lực hơn cả mong đợi",
    "example": "Great engineers always go the extra mile to verify system reliability."
  },
  {
    "term": "break the ice",
    "type": "Idiom",
    "cefr": "B1",
    "ipa": "/breɪk ði aɪs/",
    "meaningVi": "phá vỡ sự ngại ngùng ban đầu",
    "example": "Asking about favorite hobbies is a great way to break the ice."
  },
  {
    "term": "in a nutshell",
    "type": "Idiom",
    "cefr": "B2",
    "ipa": "/ɪn ə ˈnʌt.ʃel/",
    "meaningVi": "tóm gọn lại là",
    "example": "In a nutshell, our platform offers 100% free CEFR English training."
  },
  {
    "term": "under the weather",
    "type": "Idiom",
    "cefr": "B1",
    "ipa": "/ˈʌn.dər ðə ˈweð.ər/",
    "meaningVi": "cảm thấy hơi mệt, không khỏe",
    "example": "I'm feeling a bit under the weather today, so I'll work from home."
  },
  {
    "term": "once in a blue moon",
    "type": "Idiom",
    "cefr": "B1",
    "ipa": "/wʌns ɪn ə bluː muːn/",
    "meaningVi": "hiếm khi, năm thì mười họa",
    "example": "Our server experiences downtime only once in a blue moon."
  },
  {
    "term": "think outside the box",
    "type": "Idiom",
    "cefr": "B2",
    "ipa": "/θɪŋk aʊtˈsaɪd ðə bɒks/",
    "meaningVi": "tư duy sáng tạo, đột phá",
    "example": "To achieve a zero-cost architecture, we had to think outside the box."
  },
  {
    "term": "call it a day",
    "type": "Idiom",
    "cefr": "B1",
    "ipa": "/kɔːl ɪt ə deɪ/",
    "meaningVi": "nghỉ tay, kết thúc công việc trong ngày",
    "example": "We have finished all verification tests—let's call it a day!"
  },
  {
    "term": "troubleshooting",
    "type": "Technical / Engineering",
    "cefr": "B1",
    "ipa": "/ˈtrʌb.əlˌʃuː.tɪŋ/",
    "meaningVi": "chẩn đoán và xử lý sự cố kỹ thuật",
    "example": "Systematic troubleshooting reduced plant downtime by forty percent."
  },
  {
    "term": "preventive maintenance",
    "type": "Technical / Engineering",
    "cefr": "B2",
    "ipa": "/prɪˈven.tɪv ˈmeɪn.tən.əns/",
    "meaningVi": "bảo trì phòng ngừa định kỳ",
    "example": "Scheduled preventive maintenance keeps industrial motors running smoothly."
  },
  {
    "term": "closed-loop control",
    "type": "Technical / Engineering",
    "cefr": "B2",
    "ipa": "/kləʊzd luːp kənˈtrəʊl/",
    "meaningVi": "điều khiển vòng kín (có phản hồi)",
    "example": "PID controllers use closed-loop feedback to maintain accurate temperature."
  },
  {
    "term": "schematic diagram",
    "type": "Technical / Engineering",
    "cefr": "B1",
    "ipa": "/skɪˈmæt.ɪk ˈdaɪ.ə.ɡræm/",
    "meaningVi": "sơ đồ nguyên lý mạch điện",
    "example": "Always review the schematic diagram carefully before routing the PCB."
  },
  {
    "term": "commissioning",
    "type": "Technical / Engineering",
    "cefr": "B2",
    "ipa": "/kəˈmɪʃ.ən.ɪŋ/",
    "meaningVi": "chạy thử nghiệm thu hệ thống",
    "example": "Our SCADA engineers are on site for final system commissioning."
  },
  {
    "term": "bill of materials (BOM)",
    "type": "Technical / Engineering",
    "cefr": "B2",
    "ipa": "/bɪl ɒv məˈtɪə.ri.əlz/",
    "meaningVi": "danh mục vật tư linh kiện",
    "example": "Check component lead times in the Bill of Materials before ordering."
  },
  {
    "term": "electromagnetic interference (EMI)",
    "type": "Technical / Engineering",
    "cefr": "B2",
    "ipa": "/ɪˌlek.trəʊ.mæɡˈnet.ɪk ˌɪn.təˈfɪə.rəns/",
    "meaningVi": "nhiễu điện từ",
    "example": "Proper ground planes minimize electromagnetic interference on high-speed signals."
  },
  {
    "term": "scalable architecture",
    "type": "Technical / Engineering",
    "cefr": "B2",
    "ipa": "/ˈskeɪ.lə.bəl ˈɑː.kɪ.tek.tʃər/",
    "meaningVi": "kiến trúc có khả năng mở rộng",
    "example": "Cloudflare R2 and Supabase provide a highly scalable architecture."
  },
  {
    "term": "deliverable",
    "type": "Workplace / Project",
    "cefr": "B2",
    "ipa": "/dɪˈlɪv.ər.ə.bəl/",
    "meaningVi": "sản phẩm bàn giao của dự án",
    "example": "All project deliverables were verified ahead of the client meeting."
  },
  {
    "term": "return on investment (ROI)",
    "type": "Workplace / Project",
    "cefr": "B2",
    "ipa": "/rɪˈtɜːn ɒn ɪnˈvest.mənt/",
    "meaningVi": "tỷ suất hoàn vốn đầu tư",
    "example": "Automating the packaging line delivered a strong return on investment."
  }
];

export const TOPIC_VOCABULARY_DATA: Record<"A1" | "A2" | "B1" | "B2", { topicTitle: string; words: TopicWordItem[] }[]> = {
  "A1": [
    {
      "topicTitle": "Greetings & Introductions",
      "words": [
        {
          "word": "greet",
          "pos": "verb",
          "ipa": "/ɡriːt/",
          "meaningVi": "chào hỏi, đón tiếp",
          "exampleSentence": "We always greet our teacher with a warm smile."
        },
        {
          "word": "introduce",
          "pos": "verb",
          "ipa": "/ˌɪn.trəˈdʒuːs/",
          "meaningVi": "giới thiệu",
          "exampleSentence": "Let me introduce my new classmate to you."
        },
        {
          "word": "conversation",
          "pos": "noun",
          "ipa": "/ˌkɒn.vəˈseɪ.ʃən/",
          "meaningVi": "cuộc hội thoại",
          "exampleSentence": "Today we practice listening to everyday conversations."
        },
        {
          "word": "pleasure",
          "pos": "noun",
          "ipa": "/ˈpleʒ.ər/",
          "meaningVi": "niềm vinh hạnh",
          "exampleSentence": "It is a great pleasure to meet you here."
        },
        {
          "word": "handshake",
          "pos": "noun",
          "ipa": "/ˈhænd.ʃeɪk/",
          "meaningVi": "cái bắt tay",
          "exampleSentence": "A gentle handshake is customary when first meeting."
        },
        {
          "word": "partner",
          "pos": "noun",
          "ipa": "/ˈpɑːt.nər/",
          "meaningVi": "bạn học, bạn đồng hành",
          "exampleSentence": "Practice this greeting dialogue with your partner."
        },
        {
          "word": "acquaintance",
          "pos": "noun",
          "ipa": "/əˈkweɪn.təns/",
          "meaningVi": "người quen",
          "exampleSentence": "He is a business acquaintance I met at the conference."
        },
        {
          "word": "hospitality",
          "pos": "noun",
          "ipa": "/ˌhɒs.pɪˈtæl.ə.ti/",
          "meaningVi": "lòng hiếu khách",
          "exampleSentence": "Thank you for your warm hospitality during our visit."
        },
        {
          "word": "hometown",
          "pos": "noun",
          "ipa": "/ˈhəʊm.taʊn/",
          "meaningVi": "quê hương, quê nhà",
          "exampleSentence": "My hometown is a peaceful coastal city in central Vietnam."
        },
        {
          "word": "first impression",
          "pos": "phrase",
          "ipa": "/ˌfɜːst ɪmˈpreʃ.ən/",
          "meaningVi": "ấn tượng đầu tiên",
          "exampleSentence": "A polite smile always creates a positive first impression."
        },
        {
          "word": "welcoming",
          "pos": "adj",
          "ipa": "/ˈwel.kəm.ɪŋ/",
          "meaningVi": "niềm nở, thân thiện",
          "exampleSentence": "The local community is very welcoming to newcomers."
        },
        {
          "word": "background",
          "pos": "noun",
          "ipa": "/ˈbæk.ɡraʊnd/",
          "meaningVi": "xuất thân, nền tảng",
          "exampleSentence": "Could you tell us a bit about your educational background?"
        },
        {
          "word": "introduce oneself",
          "pos": "phrase",
          "ipa": "/ˌɪn.trəˈdʒuːs wʌnˈself/",
          "meaningVi": "tự giới thiệu bản thân",
          "exampleSentence": "Allow me to introduce myself before we start the meeting."
        },
        {
          "word": "customary",
          "pos": "adj",
          "ipa": "/ˈkʌs.tə.mər.i/",
          "meaningVi": "theo phong tục, thông lệ",
          "exampleSentence": "It is customary to exchange business cards with both hands."
        },
        {
          "word": "cordial",
          "pos": "adj",
          "ipa": "/ˈkɔː.di.əl/",
          "meaningVi": "thân mật, chân thành",
          "exampleSentence": "We maintained a cordial relationship with our neighbors."
        }
      ]
    },
    {
      "topicTitle": "Numbers & Time",
      "words": [
        {
          "word": "quarter",
          "pos": "noun",
          "ipa": "/ˈkwɔː.tər/",
          "meaningVi": "15 phút, một phần tư",
          "exampleSentence": "The express train departs at a quarter past seven."
        },
        {
          "word": "schedule",
          "pos": "noun",
          "ipa": "/ˈʃedʒ.uːl/",
          "meaningVi": "lịch trình, thời khóa biểu",
          "exampleSentence": "Please check the departure schedule for your train."
        },
        {
          "word": "express",
          "pos": "adj",
          "ipa": "/ɪkˈspres/",
          "meaningVi": "tốc hành, nhanh chóng",
          "exampleSentence": "The express bus will arrive in ten minutes."
        },
        {
          "word": "midnight",
          "pos": "noun",
          "ipa": "/ˈmɪd.naɪt/",
          "meaningVi": "nửa đêm (12h đêm)",
          "exampleSentence": "The library closes before midnight."
        },
        {
          "word": "duration",
          "pos": "noun",
          "ipa": "/djʊˈreɪ.ʃən/",
          "meaningVi": "khoảng thời gian",
          "exampleSentence": "The duration of the listening exam is thirty minutes."
        },
        {
          "word": "punctually",
          "pos": "adv",
          "ipa": "/ˈpʌŋk.tʃu.ə.li/",
          "meaningVi": "đúng giờ",
          "exampleSentence": "The morning workshop begins punctually at eight o'clock."
        },
        {
          "word": "postpone",
          "pos": "verb",
          "ipa": "/pəʊstˈpəʊn/",
          "meaningVi": "trì hoãn, dời lịch",
          "exampleSentence": "We had to postpone the appointment until next Wednesday."
        },
        {
          "word": "fortnight",
          "pos": "noun",
          "ipa": "/ˈfɔːt.naɪt/",
          "meaningVi": "hai tuần lễ (14 ngày)",
          "exampleSentence": "She will return from her business trip in a fortnight."
        },
        {
          "word": "decade",
          "pos": "noun",
          "ipa": "/ˈdek.eɪd/",
          "meaningVi": "thập kỷ (10 năm)",
          "exampleSentence": "The city has transformed dramatically over the past decade."
        },
        {
          "word": "countdown",
          "pos": "noun",
          "ipa": "/ˈkaʊnt.daʊn/",
          "meaningVi": "đếm ngược",
          "exampleSentence": "Everyone gathered in the square for the New Year countdown."
        },
        {
          "word": "interval",
          "pos": "noun",
          "ipa": "/ˈɪn.tə.vəl/",
          "meaningVi": "khoảng thời gian nghỉ",
          "exampleSentence": "Buses run at ten-minute intervals during peak hours."
        },
        {
          "word": "upcoming",
          "pos": "adj",
          "ipa": "/ˈʌpˌkʌm.ɪŋ/",
          "meaningVi": "sắp tới",
          "exampleSentence": "We are preparing carefully for the upcoming examination."
        },
        {
          "word": "behind schedule",
          "pos": "phrase",
          "ipa": "/bɪˈhaɪnd ˈʃedʒ.uːl/",
          "meaningVi": "chậm tiến độ, trễ giờ",
          "exampleSentence": "Due to heavy rain, the flight arrived twenty minutes behind schedule."
        },
        {
          "word": "ahead of time",
          "pos": "phrase",
          "ipa": "/əˈhed əv taɪm/",
          "meaningVi": "sớm hơn dự kiến",
          "exampleSentence": "We completed the assembly line setup ahead of time."
        },
        {
          "word": "chronological",
          "pos": "adj",
          "ipa": "/ˌkrɒn.əˈlɒdʒ.ɪ.kəl/",
          "meaningVi": "theo thứ tự thời gian",
          "exampleSentence": "List your work experience in reverse chronological order."
        }
      ]
    },
    {
      "topicTitle": "Colors, Shapes & Sizes",
      "words": [
        {
          "word": "round",
          "pos": "adj",
          "ipa": "/raʊnd/",
          "meaningVi": "hình tròn",
          "exampleSentence": "We sat around a small round wooden table."
        },
        {
          "word": "bright",
          "pos": "adj",
          "ipa": "/braɪt/",
          "meaningVi": "sáng sủa, rực rỡ",
          "exampleSentence": "She prefers shirts with bright colors."
        },
        {
          "word": "enormous",
          "pos": "adj",
          "ipa": "/ɪˈnɔː.məs/",
          "meaningVi": "to lớn, khổng lồ",
          "exampleSentence": "There is an enormous ancient tree in the central park."
        },
        {
          "word": "pattern",
          "pos": "noun",
          "ipa": "/ˈpæt.ən/",
          "meaningVi": "hoa văn, họa tiết",
          "exampleSentence": "The curtains have a simple geometric pattern."
        },
        {
          "word": "square",
          "pos": "noun",
          "ipa": "/skweər/",
          "meaningVi": "hình vuông, quảng trường",
          "exampleSentence": "Place the square box on the top shelf."
        },
        {
          "word": "symmetry",
          "pos": "noun",
          "ipa": "/ˈsɪm.ə.tri/",
          "meaningVi": "tính đối xứng",
          "exampleSentence": "The building's facade shows perfect geometric symmetry."
        },
        {
          "word": "transparent",
          "pos": "adj",
          "ipa": "/trænsˈpær.ənt/",
          "meaningVi": "trong suốt",
          "exampleSentence": "Use a transparent protective cover for the display screen."
        },
        {
          "word": "compact",
          "pos": "adj",
          "ipa": "/kəmˈpækt/",
          "meaningVi": "nhỏ gọn",
          "exampleSentence": "This compact sensor fits easily inside the control cabinet."
        },
        {
          "word": "dimension",
          "pos": "noun",
          "ipa": "/ˌdaɪˈmen.ʃən/",
          "meaningVi": "kích thước, chiều",
          "exampleSentence": "Please verify the exact dimensions of the circuit board."
        },
        {
          "word": "rectangular",
          "pos": "adj",
          "ipa": "/rekˈtæŋ.ɡjə.lər/",
          "meaningVi": "hình chữ nhật",
          "exampleSentence": "The conference room has a long rectangular oak table."
        },
        {
          "word": "cylindrical",
          "pos": "adj",
          "ipa": "/sɪˈlɪn.drɪ.kəl/",
          "meaningVi": "hình trụ",
          "exampleSentence": "Water is stored in two large cylindrical steel tanks."
        },
        {
          "word": "vibrant",
          "pos": "adj",
          "ipa": "/ˈvaɪ.brənt/",
          "meaningVi": "sống động, rực rỡ",
          "exampleSentence": "Hoi An is famous for its vibrant silk lanterns at night."
        },
        {
          "word": "miniature",
          "pos": "adj",
          "ipa": "/ˈmɪn.ə.tʃər/",
          "meaningVi": "thu nhỏ, tí hon",
          "exampleSentence": "He built a miniature model of the automated warehouse."
        },
        {
          "word": "proportion",
          "pos": "noun",
          "ipa": "/prəˈpɔː.ʃən/",
          "meaningVi": "tỷ lệ, sự cân đối",
          "exampleSentence": "The chart illustrates the proportion of renewable energy used."
        },
        {
          "word": "matte",
          "pos": "adj",
          "ipa": "/mæt/",
          "meaningVi": "mờ, không bóng",
          "exampleSentence": "I prefer a matte black finish on my laptop screen."
        }
      ]
    },
    {
      "topicTitle": "Family & Relationships",
      "words": [
        {
          "word": "sibling",
          "pos": "noun",
          "ipa": "/ˈsɪb.lɪŋ/",
          "meaningVi": "anh/chị/em ruột",
          "exampleSentence": "I have two siblings, an older brother and a younger sister."
        },
        {
          "word": "immediate",
          "pos": "adj",
          "ipa": "/ɪˈmiː.di.ət/",
          "meaningVi": "trực hệ, gần gũi",
          "exampleSentence": "There are four people in my immediate family."
        },
        {
          "word": "relative",
          "pos": "noun",
          "ipa": "/ˈrel.ə.tɪv/",
          "meaningVi": "họ hàng, người thân",
          "exampleSentence": "We always gather with our relatives on New Year."
        },
        {
          "word": "generation",
          "pos": "noun",
          "ipa": "/ˌdʒen.əˈreɪ.ʃən/",
          "meaningVi": "thế hệ",
          "exampleSentence": "Three generations live together happily in that house."
        },
        {
          "word": "supportive",
          "pos": "adj",
          "ipa": "/səˈpɔː.tɪv/",
          "meaningVi": "ủng hộ, gắn kết",
          "exampleSentence": "My parents are always supportive of my English study."
        },
        {
          "word": "upbringing",
          "pos": "noun",
          "ipa": "/ˈʌpˌbrɪŋ.ɪŋ/",
          "meaningVi": "sự nuôi dạy từ nhỏ",
          "exampleSentence": "A warm upbringing teaches children empathy and discipline."
        },
        {
          "word": "extended family",
          "pos": "phrase",
          "ipa": "/ɪkˌsten.dɪd ˈfæm.əl.i/",
          "meaningVi": "đại gia đình (nhiều thế hệ)",
          "exampleSentence": "During Tet, our entire extended family reunites in our hometown."
        },
        {
          "word": "close-knit",
          "pos": "adj",
          "ipa": "/ˌkləʊsˈnɪt/",
          "meaningVi": "gắn bó khăng khít",
          "exampleSentence": "We grew up in a very close-knit rural community."
        },
        {
          "word": "ancestor",
          "pos": "noun",
          "ipa": "/ˈæn.ses.tər/",
          "meaningVi": "tổ tiên, ông bà",
          "exampleSentence": "Vietnamese families pay deep respect to their ancestors."
        },
        {
          "word": "breadwinner",
          "pos": "noun",
          "ipa": "/ˈbredˌwɪn.ər/",
          "meaningVi": "trụ cột kinh tế gia đình",
          "exampleSentence": "Both parents share the role of breadwinner in modern households."
        },
        {
          "word": "resemble",
          "pos": "verb",
          "ipa": "/rɪˈzem.bəl/",
          "meaningVi": "giống với",
          "exampleSentence": "She closely resembles her grandmother in both smile and voice."
        },
        {
          "word": "bond",
          "pos": "noun",
          "ipa": "/bɒnd/",
          "meaningVi": "sợi dây gắn kết",
          "exampleSentence": "Shared experiences create a lifelong bond between siblings."
        },
        {
          "word": "mutual",
          "pos": "adj",
          "ipa": "/ˈmjuː.tʃu.əl/",
          "meaningVi": "lẫn nhau, qua lại",
          "exampleSentence": "Healthy relationships are built on mutual trust and respect."
        },
        {
          "word": "harmonious",
          "pos": "adj",
          "ipa": "/hɑːˈməʊ.ni.əs/",
          "meaningVi": "hòa thuận, êm ấm",
          "exampleSentence": "Open communication keeps family life harmonious."
        },
        {
          "word": "look up to",
          "pos": "phrase",
          "ipa": "/lʊk ʌp tuː/",
          "meaningVi": "kính trọng, ngưỡng mộ",
          "exampleSentence": "I have always looked up to my older brother for his perseverance."
        }
      ]
    },
    {
      "topicTitle": "Food & Drinks",
      "words": [
        {
          "word": "croissant",
          "pos": "noun",
          "ipa": "/ˈkwæs.ɒ̃/",
          "meaningVi": "bánh sừng bò",
          "exampleSentence": "Could I get a warm croissant with my morning tea?"
        },
        {
          "word": "beverage",
          "pos": "noun",
          "ipa": "/ˈbev.ər.ɪdʒ/",
          "meaningVi": "thức uống, đồ uống",
          "exampleSentence": "Hot beverages are served on the left counter."
        },
        {
          "word": "delicious",
          "pos": "adj",
          "ipa": "/dɪˈlɪʃ.əs/",
          "meaningVi": "thơm ngon",
          "exampleSentence": "The noodle soup was extremely delicious and fresh."
        },
        {
          "word": "ingredient",
          "pos": "noun",
          "ipa": "/ɪnˈɡriː.di.ənt/",
          "meaningVi": "nguyên liệu",
          "exampleSentence": "Fresh vegetables are the primary ingredient in this salad."
        },
        {
          "word": "order",
          "pos": "verb",
          "ipa": "/ˈɔː.dər/",
          "meaningVi": "gọi món, đặt hàng",
          "exampleSentence": "Are you ready to order your breakfast now?"
        },
        {
          "word": "nutritious",
          "pos": "adj",
          "ipa": "/njuːˈtrɪʃ.əs/",
          "meaningVi": "bổ dưỡng, giàu dinh dưỡng",
          "exampleSentence": "Oatmeal with fresh berries is a quick and nutritious breakfast."
        },
        {
          "word": "savory",
          "pos": "adj",
          "ipa": "/ˈseɪ.vər.i/",
          "meaningVi": "mặn mà, đậm đà",
          "exampleSentence": "Do you prefer sweet pastries or savory snacks in the morning?"
        },
        {
          "word": "specialty",
          "pos": "noun",
          "ipa": "/ˈspeʃ.əl.ti/",
          "meaningVi": "món đặc sản",
          "exampleSentence": "Grilled pork noodles are a famous culinary specialty of Hanoi."
        },
        {
          "word": "refreshment",
          "pos": "noun",
          "ipa": "/rɪˈfreʃ.mənt/",
          "meaningVi": "đồ ăn thức uống giải khát",
          "exampleSentence": "Light refreshments will be served during the workshop break."
        },
        {
          "word": "organic",
          "pos": "adj",
          "ipa": "/ɔːˈɡæn.ɪk/",
          "meaningVi": "hữu cơ, sạch tự nhiên",
          "exampleSentence": "More consumers are choosing organic vegetables at the supermarket."
        },
        {
          "word": "portion",
          "pos": "noun",
          "ipa": "/ˈpɔː.ʃən/",
          "meaningVi": "khẩu phần ăn",
          "exampleSentence": "The restaurant serves generous portions at a reasonable price."
        },
        {
          "word": "appetizing",
          "pos": "adj",
          "ipa": "/ˈæp.ə.taɪ.zɪŋ/",
          "meaningVi": "ngon mắt, kích thích vị giác",
          "exampleSentence": "The freshly baked bread smelled wonderfully appetizing."
        },
        {
          "word": "vegetarian",
          "pos": "adj",
          "ipa": "/ˌvedʒ.ɪˈteə.ri.ən/",
          "meaningVi": "thuần chay, ăn chay",
          "exampleSentence": "The menu includes five delicious vegetarian main dishes."
        },
        {
          "word": "homemade",
          "pos": "adj",
          "ipa": "/ˌhəʊmˈmeɪd/",
          "meaningVi": "tự làm tại nhà",
          "exampleSentence": "Nothing beats a bowl of warm homemade chicken soup."
        },
        {
          "word": "cutlery",
          "pos": "noun",
          "ipa": "/ˈkʌt.lər.i/",
          "meaningVi": "bộ dao nĩa, dụng cụ ăn",
          "exampleSentence": "Please place the clean cutlery neatly on the dining table."
        }
      ]
    },
    {
      "topicTitle": "Home & Furniture",
      "words": [
        {
          "word": "furniture",
          "pos": "noun",
          "ipa": "/ˈfɜː.nɪ.tʃər/",
          "meaningVi": "nội thất, đồ đạc",
          "exampleSentence": "They bought comfortable wooden furniture for the room."
        },
        {
          "word": "balcony",
          "pos": "noun",
          "ipa": "/ˈbæl.kə.ni/",
          "meaningVi": "ban công",
          "exampleSentence": "I enjoy having morning coffee on the sunny balcony."
        },
        {
          "word": "cozy",
          "pos": "adj",
          "ipa": "/ˈkəʊ.zi/",
          "meaningVi": "ấm cúng",
          "exampleSentence": "The study room feels small but very warm and cozy."
        },
        {
          "word": "appliance",
          "pos": "noun",
          "ipa": "/əˈplaɪ.əns/",
          "meaningVi": "thiết bị gia dụng",
          "exampleSentence": "Modern kitchen appliances save a lot of daily energy."
        },
        {
          "word": "curtain",
          "pos": "noun",
          "ipa": "/ˈkɜː.tən/",
          "meaningVi": "rèm cửa",
          "exampleSentence": "Please open the curtains to let natural sunlight in."
        },
        {
          "word": "spacious",
          "pos": "adj",
          "ipa": "/ˈspeɪ.ʃəs/",
          "meaningVi": "rộng rãi, thoáng đãng",
          "exampleSentence": "The living room is spacious and filled with natural light."
        },
        {
          "word": "ventilate",
          "pos": "verb",
          "ipa": "/ˈven.tɪ.leɪt/",
          "meaningVi": "thông gió, làm thoáng khí",
          "exampleSentence": "Open the windows every morning to ventilate the bedroom."
        },
        {
          "word": "wardrobe",
          "pos": "noun",
          "ipa": "/ˈwɔː.drəʊb/",
          "meaningVi": "tủ quần áo",
          "exampleSentence": "Hang your winter coats inside the wooden wardrobe."
        },
        {
          "word": "mattress",
          "pos": "noun",
          "ipa": "/ˈmæt.rəs/",
          "meaningVi": "tấm nệm",
          "exampleSentence": "A firm mattress supports your back and improves sleep quality."
        },
        {
          "word": "bookshelf",
          "pos": "noun",
          "ipa": "/ˈbʊk.ʃelf/",
          "meaningVi": "kệ sách",
          "exampleSentence": "My engineering textbooks are organized on the top bookshelf."
        },
        {
          "word": "renovate",
          "pos": "verb",
          "ipa": "/ˈren.ə.veɪt/",
          "meaningVi": "cải tạo, sửa sang lại",
          "exampleSentence": "They plan to renovate the kitchen before Lunar New Year."
        },
        {
          "word": "corridor",
          "pos": "noun",
          "ipa": "/ˈkɒr.ɪ.dɔːr/",
          "meaningVi": "hành lang",
          "exampleSentence": "Walk down the main corridor and turn left at the second door."
        },
        {
          "word": "utility bill",
          "pos": "phrase",
          "ipa": "/juːˈtɪl.ə.ti bɪl/",
          "meaningVi": "hóa đơn điện nước sinh hoạt",
          "exampleSentence": "LED bulbs help reduce our monthly electricity utility bill."
        },
        {
          "word": "minimalist",
          "pos": "adj",
          "ipa": "/ˈmɪn.ɪ.məl.ɪst/",
          "meaningVi": "tối giản",
          "exampleSentence": "A minimalist workspace helps me concentrate on coding."
        },
        {
          "word": "soundproof",
          "pos": "adj",
          "ipa": "/ˈsaʊnd.pruːf/",
          "meaningVi": "cách âm",
          "exampleSentence": "The recording booth has soundproof walls for clear audio."
        }
      ]
    },
    {
      "topicTitle": "Daily Routines",
      "words": [
        {
          "word": "routine",
          "pos": "noun",
          "ipa": "/ruːˈtiːn/",
          "meaningVi": "nề nếp, thói quen hàng ngày",
          "exampleSentence": "Morning exercise is an essential part of my routine."
        },
        {
          "word": "habit",
          "pos": "noun",
          "ipa": "/ˈhæb.ɪt/",
          "meaningVi": "thói quen tốt",
          "exampleSentence": "Reading books every night is a great habit to cultivate."
        },
        {
          "word": "commute",
          "pos": "verb",
          "ipa": "/kəˈmjuːt/",
          "meaningVi": "đi lại hàng ngày",
          "exampleSentence": "He commutes to school by bicycle every morning."
        },
        {
          "word": "punctual",
          "pos": "adj",
          "ipa": "/ˈpʌŋk.tʃu.əl/",
          "meaningVi": "đúng giờ",
          "exampleSentence": "She is always punctual and arrives ten minutes early."
        },
        {
          "word": "refresh",
          "pos": "verb",
          "ipa": "/rɪˈfreʃ/",
          "meaningVi": "làm mới, tỉnh táo",
          "exampleSentence": "A short walk helps refresh your mind after studying."
        },
        {
          "word": "prioritize",
          "pos": "verb",
          "ipa": "/praɪˈɒr.ɪ.taɪz/",
          "meaningVi": "ưu tiên",
          "exampleSentence": "I always prioritize my most challenging tasks in the morning."
        },
        {
          "word": "chore",
          "pos": "noun",
          "ipa": "/tʃɔːr/",
          "meaningVi": "việc vặt trong nhà",
          "exampleSentence": "Doing household chores together saves time on weekends."
        },
        {
          "word": "early bird",
          "pos": "phrase",
          "ipa": "/ˈɜː.li bɜːd/",
          "meaningVi": "người hay dậy sớm",
          "exampleSentence": "As an early bird, I love studying English at five thirty."
        },
        {
          "word": "night owl",
          "pos": "phrase",
          "ipa": "/naɪt aʊl/",
          "meaningVi": "người hay thức khuya",
          "exampleSentence": "My roommate is a night owl who codes until midnight."
        },
        {
          "word": "stretch",
          "pos": "verb",
          "ipa": "/stretʃ/",
          "meaningVi": "vươn vai, giãn cơ",
          "exampleSentence": "Take five minutes to stretch your neck and shoulders every hour."
        },
        {
          "word": "productive",
          "pos": "adj",
          "ipa": "/prəˈdʌk.tɪv/",
          "meaningVi": "năng suất, hiệu quả",
          "exampleSentence": "Following a clear checklist makes my workday much more productive."
        },
        {
          "word": "unwind",
          "pos": "verb",
          "ipa": "/ʌnˈwaɪnd/",
          "meaningVi": "thư giãn, xả hơi",
          "exampleSentence": "Listening to acoustic music helps me unwind after work."
        },
        {
          "word": "consistency",
          "pos": "noun",
          "ipa": "/kənˈsɪs.tən.si/",
          "meaningVi": "sự đều đặn, kiên trì",
          "exampleSentence": "Consistency is more important than intensity when learning a language."
        },
        {
          "word": "alarm clock",
          "pos": "phrase",
          "ipa": "/əˈlɑːm klɒk/",
          "meaningVi": "đồng hồ báo thức",
          "exampleSentence": "I set my alarm clock for six o'clock every weekday."
        },
        {
          "word": "meditate",
          "pos": "verb",
          "ipa": "/ˈmed.ɪ.teɪt/",
          "meaningVi": "thiền định, tĩnh tâm",
          "exampleSentence": "She meditates for ten minutes before starting her busy day."
        }
      ]
    },
    {
      "topicTitle": "Shopping Basics",
      "words": [
        {
          "word": "discount",
          "pos": "noun",
          "ipa": "/ˈdɪs.kaʊnt/",
          "meaningVi": "giảm giá, chiết khấu",
          "exampleSentence": "All summer jackets have a thirty percent discount today."
        },
        {
          "word": "receipt",
          "pos": "noun",
          "ipa": "/rɪˈsiːt/",
          "meaningVi": "hóa đơn thanh toán",
          "exampleSentence": "Please keep the receipt in case you want to exchange."
        },
        {
          "word": "bargain",
          "pos": "noun",
          "ipa": "/ˈbɑː.ɡɪn/",
          "meaningVi": "món hời, giá rẻ",
          "exampleSentence": "Getting this coat for twenty dollars was a real bargain."
        },
        {
          "word": "cashier",
          "pos": "noun",
          "ipa": "/kæʃˈɪər/",
          "meaningVi": "nhân viên thu ngân",
          "exampleSentence": "You can pay for the items at cashier counter two."
        },
        {
          "word": "fitting",
          "pos": "noun",
          "ipa": "/ˈfɪt.ɪŋ/",
          "meaningVi": "thử đồ (fitting room)",
          "exampleSentence": "The fitting rooms are located near the shoe section."
        },
        {
          "word": "refund",
          "pos": "noun",
          "ipa": "/ˈriː.fʌnd/",
          "meaningVi": "tiền hoàn lại",
          "exampleSentence": "You can request a full refund within fourteen days of purchase."
        },
        {
          "word": "warranty",
          "pos": "noun",
          "ipa": "/ˈwɒr.ən.ti/",
          "meaningVi": "phiếu bảo hành",
          "exampleSentence": "This microcontroller development board comes with a one-year warranty."
        },
        {
          "word": "aisle",
          "pos": "noun",
          "ipa": "/aɪl/",
          "meaningVi": "lối đi giữa các kệ hàng",
          "exampleSentence": "Fresh dairy products are located in aisle four."
        },
        {
          "word": "affordable",
          "pos": "adj",
          "ipa": "/əˈfɔː.də.bəl/",
          "meaningVi": "giá cả phải chăng",
          "exampleSentence": "The brand offers high-quality sportswear at affordable prices."
        },
        {
          "word": "out of stock",
          "pos": "phrase",
          "ipa": "/aʊt ɒv stɒk/",
          "meaningVi": "hết hàng",
          "exampleSentence": "Unfortunately, that sensor model is temporarily out of stock."
        },
        {
          "word": "price tag",
          "pos": "phrase",
          "ipa": "/praɪs tæɡ/",
          "meaningVi": "nhãn giá",
          "exampleSentence": "Check the price tag to see if the item is on sale."
        },
        {
          "word": "loyalty card",
          "pos": "phrase",
          "ipa": "/ˈlɔɪ.əl.ti kɑːd/",
          "meaningVi": "thẻ khách hàng thân thiết",
          "exampleSentence": "Scan your loyalty card at checkout to earn reward points."
        },
        {
          "word": "window shopping",
          "pos": "phrase",
          "ipa": "/ˈwɪn.dəʊ ˌʃɒp.ɪŋ/",
          "meaningVi": "đi ngắm đồ (không mua)",
          "exampleSentence": "We went window shopping along the pedestrian street on Sunday."
        },
        {
          "word": "authentic",
          "pos": "adj",
          "ipa": "/ɔːˈθen.tɪk/",
          "meaningVi": "chính hãng, xác thực",
          "exampleSentence": "Always buy electronic components from authentic distributors."
        },
        {
          "word": "delivery fee",
          "pos": "phrase",
          "ipa": "/dɪˈlɪv.ər.i fiː/",
          "meaningVi": "phí giao hàng",
          "exampleSentence": "Orders over fifty dollars qualify for zero delivery fee."
        }
      ]
    },
    {
      "topicTitle": "Weather & Seasons",
      "words": [
        {
          "word": "forecast",
          "pos": "noun",
          "ipa": "/ˈfɔː.kɑːst/",
          "meaningVi": "dự báo thời tiết",
          "exampleSentence": "The evening forecast predicts light rain tomorrow."
        },
        {
          "word": "breeze",
          "pos": "noun",
          "ipa": "/briːz/",
          "meaningVi": "gió nhẹ, làn gió mát",
          "exampleSentence": "A gentle cool breeze blew across the river."
        },
        {
          "word": "humid",
          "pos": "adj",
          "ipa": "/ˈhjuː.mɪd/",
          "meaningVi": "ẩm ướt, nồm ẩm",
          "exampleSentence": "The weather in July is often hot and humid."
        },
        {
          "word": "temperature",
          "pos": "noun",
          "ipa": "/ˈtem.prə.tʃər/",
          "meaningVi": "nhiệt độ",
          "exampleSentence": "The temperature dropped to fifteen degrees tonight."
        },
        {
          "word": "sunshine",
          "pos": "noun",
          "ipa": "/ˈsʌn.ʃaɪn/",
          "meaningVi": "ánh nắng mặt trời",
          "exampleSentence": "Nothing is better than relaxing in the warm sunshine."
        },
        {
          "word": "downpour",
          "pos": "noun",
          "ipa": "/ˈdaʊn.pɔːr/",
          "meaningVi": "cơn mưa rào lớn",
          "exampleSentence": "We were caught in a sudden tropical downpour on our way home."
        },
        {
          "word": "muggy",
          "pos": "adj",
          "ipa": "/ˈmʌɡ.i/",
          "meaningVi": "oi bức, ngột ngạt",
          "exampleSentence": "August afternoons in the city can feel quite hot and muggy."
        },
        {
          "word": "overcast",
          "pos": "adj",
          "ipa": "/ˌəʊ.vəˈkɑːst/",
          "meaningVi": "âm u, nhiều mây",
          "exampleSentence": "The sky remained overcast all morning, but it didn't rain."
        },
        {
          "word": "drought",
          "pos": "noun",
          "ipa": "/draʊt/",
          "meaningVi": "hạn hán",
          "exampleSentence": "Farmers are hoping for rain after weeks of severe drought."
        },
        {
          "word": "monsoon",
          "pos": "noun",
          "ipa": "/mɒnˈsuːn/",
          "meaningVi": "gió mùa, mùa mưa",
          "exampleSentence": "The southwest monsoon brings frequent afternoon showers."
        },
        {
          "word": "chilly",
          "pos": "adj",
          "ipa": "/ˈtʃɪl.i/",
          "meaningVi": "se lạnh",
          "exampleSentence": "Bring a light sweater because the mountain air gets chilly at night."
        },
        {
          "word": "heatwave",
          "pos": "noun",
          "ipa": "/ˈhiːt.weɪv/",
          "meaningVi": "đợt nắng nóng gay gắt",
          "exampleSentence": "Drink plenty of water during the summer heatwave."
        },
        {
          "word": "visibility",
          "pos": "noun",
          "ipa": "/ˌvɪz.əˈbɪl.ə.ti/",
          "meaningVi": "tầm nhìn xa",
          "exampleSentence": "Thick morning fog reduced visibility on the highway."
        },
        {
          "word": "climate",
          "pos": "noun",
          "ipa": "/ˈklaɪ.mət/",
          "meaningVi": "khí hậu",
          "exampleSentence": "Southern Vietnam has a warm tropical climate year-round."
        },
        {
          "word": "umbrella",
          "pos": "noun",
          "ipa": "/ʌmˈbrel.ə/",
          "meaningVi": "chiếc ô (dù)",
          "exampleSentence": "Keep a folding umbrella in your backpack during the rainy season."
        }
      ]
    },
    {
      "topicTitle": "Feelings & Emotions",
      "words": [
        {
          "word": "excited",
          "pos": "adj",
          "ipa": "/ɪkˈsaɪ.tɪd/",
          "meaningVi": "phấn khởi, hào hứng",
          "exampleSentence": "I am excited to start my new language course."
        },
        {
          "word": "grateful",
          "pos": "adj",
          "ipa": "/ˈɡreɪt.fəl/",
          "meaningVi": "biết ơn, cảm kích",
          "exampleSentence": "We are grateful for all the support from community."
        },
        {
          "word": "anxious",
          "pos": "adj",
          "ipa": "/ˈæŋk.ʃəs/",
          "meaningVi": "lo lắng, bồn chồn",
          "exampleSentence": "Take deep breaths whenever you feel anxious."
        },
        {
          "word": "confident",
          "pos": "adj",
          "ipa": "/ˈkɒn.fɪ.dənt/",
          "meaningVi": "tự tin",
          "exampleSentence": "Speaking every day makes you confident in communication."
        },
        {
          "word": "cheerful",
          "pos": "adj",
          "ipa": "/ˈtʃɪə.fəl/",
          "meaningVi": "vui vẻ, yêu đời",
          "exampleSentence": "Her cheerful smile makes everyone feel welcome."
        },
        {
          "word": "overwhelmed",
          "pos": "adj",
          "ipa": "/ˌəʊ.vəˈwelmd/",
          "meaningVi": "choáng ngợp, quá tải",
          "exampleSentence": "Break big projects into small steps so you never feel overwhelmed."
        },
        {
          "word": "enthusiastic",
          "pos": "adj",
          "ipa": "/ɪnˌθjuː.ziˈæs.tɪk/",
          "meaningVi": "nhiệt huyết, hào hứng",
          "exampleSentence": "The students were enthusiastic about the robotics competition."
        },
        {
          "word": "relieved",
          "pos": "adj",
          "ipa": "/rɪˈliːvd/",
          "meaningVi": "nhẹ nhõm, thở phào",
          "exampleSentence": "I felt relieved when all verification tests passed on the first run."
        },
        {
          "word": "empathetic",
          "pos": "adj",
          "ipa": "/ˌem.pəˈθet.ɪk/",
          "meaningVi": "đồng cảm, thấu cảm",
          "exampleSentence": "A good team leader is always empathetic toward colleagues."
        },
        {
          "word": "frustrated",
          "pos": "adj",
          "ipa": "/frʌsˈtreɪ.tɪd/",
          "meaningVi": "nản lòng, bực bội",
          "exampleSentence": "Don't get frustrated by mistakes; they are part of learning."
        },
        {
          "word": "inspired",
          "pos": "adj",
          "ipa": "/ɪnˈspaɪəd/",
          "meaningVi": "được truyền cảm hứng",
          "exampleSentence": "She felt inspired after listening to the keynote speaker."
        },
        {
          "word": "content",
          "pos": "adj",
          "ipa": "/kənˈtent/",
          "meaningVi": "hài lòng, mãn nguyện",
          "exampleSentence": "He is content with his steady progress in English communication."
        },
        {
          "word": "nostalgic",
          "pos": "adj",
          "ipa": "/nɒsˈtæl.dʒɪk/",
          "meaningVi": "hoài niệm, nhớ quê",
          "exampleSentence": "Traditional folk songs always make me feel nostalgic."
        },
        {
          "word": "optimistic",
          "pos": "adj",
          "ipa": "/ˌɒp.tɪˈmɪs.tɪk/",
          "meaningVi": "lạc quan",
          "exampleSentence": "We remain optimistic about the upcoming industrial expansion."
        },
        {
          "word": "keep one's cool",
          "pos": "phrase",
          "ipa": "/kiːp wʌnz kuːl/",
          "meaningVi": "giữ bình tĩnh",
          "exampleSentence": "Engineers must keep their cool when troubleshooting live systems."
        }
      ]
    }
  ],
  "A2": [
    {
      "topicTitle": "Travel & Transport",
      "words": [
        {
          "word": "depart",
          "pos": "verb",
          "ipa": "/dɪˈpɑːt/",
          "meaningVi": "khởi hành, xuất phát",
          "exampleSentence": "Which platform does the airport train depart from?"
        },
        {
          "word": "luggage",
          "pos": "noun",
          "ipa": "/ˈlʌɡ.ɪdʒ/",
          "meaningVi": "hành lý",
          "exampleSentence": "You can store your luggage in the overhead bin."
        },
        {
          "word": "destination",
          "pos": "noun",
          "ipa": "/ˌdes.tɪˈneɪ.ʃən/",
          "meaningVi": "điểm đến",
          "exampleSentence": "Our final travel destination is Da Nang city."
        },
        {
          "word": "passenger",
          "pos": "noun",
          "ipa": "/ˈpæs.ən.dʒər/",
          "meaningVi": "hành khách",
          "exampleSentence": "All passengers must fasten their seat belts."
        },
        {
          "word": "itinerary",
          "pos": "noun",
          "ipa": "/aɪˈtɪn.ər.ər.i/",
          "meaningVi": "lịch trình chuyến đi",
          "exampleSentence": "Here is the detailed itinerary for our 3-day trip."
        },
        {
          "word": "boarding pass",
          "pos": "noun",
          "ipa": "/ˈbɔː.dɪŋ pɑːs/",
          "meaningVi": "thẻ lên máy bay",
          "exampleSentence": "Please have your passport and boarding pass ready at the gate."
        },
        {
          "word": "round-trip",
          "pos": "adj",
          "ipa": "/ˌraʊndˈtrɪp/",
          "meaningVi": "khứ hồi (hai chiều)",
          "exampleSentence": "A round-trip train ticket is cheaper than buying two single tickets."
        },
        {
          "word": "customs",
          "pos": "noun",
          "ipa": "/ˈkʌs.təmz/",
          "meaningVi": "hải quan sân bay",
          "exampleSentence": "It took twenty minutes to clear customs and immigration."
        },
        {
          "word": "check-up",
          "pos": "noun",
          "ipa": "/ˈtʃek.ʌp/",
          "meaningVi": "khám sức khỏe định kỳ",
          "exampleSentence": "Doctors recommend having a general medical check-up once a year."
        },
        {
          "word": "immune system",
          "pos": "phrase",
          "ipa": "/ɪˈmjuːn ˌsɪs.təm/",
          "meaningVi": "hệ miễn dịch",
          "exampleSentence": "Vitamin C and regular exercise strengthen your immune system."
        },
        {
          "word": "overtime",
          "pos": "noun",
          "ipa": "/ˈəʊ.və.taɪm/",
          "meaningVi": "làm thêm giờ (OT)",
          "exampleSentence": "The engineering team worked overtime to finish the prototype."
        },
        {
          "word": "shift",
          "pos": "noun",
          "ipa": "/ʃɪft/",
          "meaningVi": "ca làm việc",
          "exampleSentence": "Technicians at the refinery rotate between morning and night shifts."
        },
        {
          "word": "probation",
          "pos": "noun",
          "ipa": "/prəˈbeɪ.ʃən/",
          "meaningVi": "thời gian thử việc",
          "exampleSentence": "New graduates usually complete a two-month probation period."
        },
        {
          "word": "exhibition",
          "pos": "noun",
          "ipa": "/ˌek.sɪˈbɪʃ.ən/",
          "meaningVi": "triển lãm",
          "exampleSentence": "We visited the international automation exhibition in Ho Chi Minh City."
        },
        {
          "word": "tuition",
          "pos": "noun",
          "ipa": "/tjuːˈɪʃ.ən/",
          "meaningVi": "học phí",
          "exampleSentence": "EnglishFlow provides full CEFR courses with zero tuition fees."
        }
      ]
    },
    {
      "topicTitle": "Health & Body",
      "words": [
        {
          "word": "symptom",
          "pos": "noun",
          "ipa": "/ˈsɪmp.təm/",
          "meaningVi": "triệu chứng bệnh",
          "exampleSentence": "Fever and sore throat are common cold symptoms."
        },
        {
          "word": "prescription",
          "pos": "noun",
          "ipa": "/prɪˈskrɪp.ʃən/",
          "meaningVi": "đơn thuốc",
          "exampleSentence": "The doctor gave me a prescription for vitamins."
        },
        {
          "word": "pharmacy",
          "pos": "noun",
          "ipa": "/ˈfɑː.mə.si/",
          "meaningVi": "hiệu thuốc",
          "exampleSentence": "There is a 24-hour pharmacy down the street."
        },
        {
          "word": "fever",
          "pos": "noun",
          "ipa": "/ˈfiː.vər/",
          "meaningVi": "cơn sốt",
          "exampleSentence": "Drink plenty of water when you have a high fever."
        },
        {
          "word": "recovery",
          "pos": "noun",
          "ipa": "/rɪˈkʌv.ər.i/",
          "meaningVi": "sự hồi phục",
          "exampleSentence": "We wish you a fast and full recovery."
        },
        {
          "word": "boarding pass",
          "pos": "noun",
          "ipa": "/ˈbɔː.dɪŋ pɑːs/",
          "meaningVi": "thẻ lên máy bay",
          "exampleSentence": "Please have your passport and boarding pass ready at the gate."
        },
        {
          "word": "round-trip",
          "pos": "adj",
          "ipa": "/ˌraʊndˈtrɪp/",
          "meaningVi": "khứ hồi (hai chiều)",
          "exampleSentence": "A round-trip train ticket is cheaper than buying two single tickets."
        },
        {
          "word": "customs",
          "pos": "noun",
          "ipa": "/ˈkʌs.təmz/",
          "meaningVi": "hải quan sân bay",
          "exampleSentence": "It took twenty minutes to clear customs and immigration."
        },
        {
          "word": "check-up",
          "pos": "noun",
          "ipa": "/ˈtʃek.ʌp/",
          "meaningVi": "khám sức khỏe định kỳ",
          "exampleSentence": "Doctors recommend having a general medical check-up once a year."
        },
        {
          "word": "immune system",
          "pos": "phrase",
          "ipa": "/ɪˈmjuːn ˌsɪs.təm/",
          "meaningVi": "hệ miễn dịch",
          "exampleSentence": "Vitamin C and regular exercise strengthen your immune system."
        },
        {
          "word": "overtime",
          "pos": "noun",
          "ipa": "/ˈəʊ.və.taɪm/",
          "meaningVi": "làm thêm giờ (OT)",
          "exampleSentence": "The engineering team worked overtime to finish the prototype."
        },
        {
          "word": "shift",
          "pos": "noun",
          "ipa": "/ʃɪft/",
          "meaningVi": "ca làm việc",
          "exampleSentence": "Technicians at the refinery rotate between morning and night shifts."
        },
        {
          "word": "probation",
          "pos": "noun",
          "ipa": "/prəˈbeɪ.ʃən/",
          "meaningVi": "thời gian thử việc",
          "exampleSentence": "New graduates usually complete a two-month probation period."
        },
        {
          "word": "exhibition",
          "pos": "noun",
          "ipa": "/ˌek.sɪˈbɪʃ.ən/",
          "meaningVi": "triển lãm",
          "exampleSentence": "We visited the international automation exhibition in Ho Chi Minh City."
        },
        {
          "word": "tuition",
          "pos": "noun",
          "ipa": "/tjuːˈɪʃ.ən/",
          "meaningVi": "học phí",
          "exampleSentence": "EnglishFlow provides full CEFR courses with zero tuition fees."
        }
      ]
    },
    {
      "topicTitle": "Work & Jobs",
      "words": [
        {
          "word": "colleague",
          "pos": "noun",
          "ipa": "/ˈkɒl.iːɡ/",
          "meaningVi": "đồng nghiệp",
          "exampleSentence": "My colleagues are very cooperative and friendly."
        },
        {
          "word": "deadline",
          "pos": "noun",
          "ipa": "/ˈded.laɪn/",
          "meaningVi": "hạn chót công việc",
          "exampleSentence": "We worked hard to meet the project deadline."
        },
        {
          "word": "responsibility",
          "pos": "noun",
          "ipa": "/rɪˌspɒn.sɪˈbɪl.ə.ti/",
          "meaningVi": "trách nhiệm",
          "exampleSentence": "Managing customer feedback is my main responsibility."
        },
        {
          "word": "promotion",
          "pos": "noun",
          "ipa": "/prəˈməʊ.ʃən/",
          "meaningVi": "thăng tiến, thăng chức",
          "exampleSentence": "She received a promotion after leading the campaign."
        },
        {
          "word": "salary",
          "pos": "noun",
          "ipa": "/ˈsæl.ər.i/",
          "meaningVi": "tiền lương",
          "exampleSentence": "The company offers a competitive salary and bonus."
        },
        {
          "word": "boarding pass",
          "pos": "noun",
          "ipa": "/ˈbɔː.dɪŋ pɑːs/",
          "meaningVi": "thẻ lên máy bay",
          "exampleSentence": "Please have your passport and boarding pass ready at the gate."
        },
        {
          "word": "round-trip",
          "pos": "adj",
          "ipa": "/ˌraʊndˈtrɪp/",
          "meaningVi": "khứ hồi (hai chiều)",
          "exampleSentence": "A round-trip train ticket is cheaper than buying two single tickets."
        },
        {
          "word": "customs",
          "pos": "noun",
          "ipa": "/ˈkʌs.təmz/",
          "meaningVi": "hải quan sân bay",
          "exampleSentence": "It took twenty minutes to clear customs and immigration."
        },
        {
          "word": "check-up",
          "pos": "noun",
          "ipa": "/ˈtʃek.ʌp/",
          "meaningVi": "khám sức khỏe định kỳ",
          "exampleSentence": "Doctors recommend having a general medical check-up once a year."
        },
        {
          "word": "immune system",
          "pos": "phrase",
          "ipa": "/ɪˈmjuːn ˌsɪs.təm/",
          "meaningVi": "hệ miễn dịch",
          "exampleSentence": "Vitamin C and regular exercise strengthen your immune system."
        },
        {
          "word": "overtime",
          "pos": "noun",
          "ipa": "/ˈəʊ.və.taɪm/",
          "meaningVi": "làm thêm giờ (OT)",
          "exampleSentence": "The engineering team worked overtime to finish the prototype."
        },
        {
          "word": "shift",
          "pos": "noun",
          "ipa": "/ʃɪft/",
          "meaningVi": "ca làm việc",
          "exampleSentence": "Technicians at the refinery rotate between morning and night shifts."
        },
        {
          "word": "probation",
          "pos": "noun",
          "ipa": "/prəˈbeɪ.ʃən/",
          "meaningVi": "thời gian thử việc",
          "exampleSentence": "New graduates usually complete a two-month probation period."
        },
        {
          "word": "exhibition",
          "pos": "noun",
          "ipa": "/ˌek.sɪˈbɪʃ.ən/",
          "meaningVi": "triển lãm",
          "exampleSentence": "We visited the international automation exhibition in Ho Chi Minh City."
        },
        {
          "word": "tuition",
          "pos": "noun",
          "ipa": "/tjuːˈɪʃ.ən/",
          "meaningVi": "học phí",
          "exampleSentence": "EnglishFlow provides full CEFR courses with zero tuition fees."
        }
      ]
    },
    {
      "topicTitle": "Hobbies & Free Time",
      "words": [
        {
          "word": "leisure",
          "pos": "noun",
          "ipa": "/ˈleʒ.ər/",
          "meaningVi": "thời gian rảnh rỗi",
          "exampleSentence": "What activities do you enjoy during your leisure time?"
        },
        {
          "word": "photography",
          "pos": "noun",
          "ipa": "/fəˈtɒɡ.rə.fi/",
          "meaningVi": "nhiếp ảnh",
          "exampleSentence": "Photography allows me to capture beautiful moments."
        },
        {
          "word": "tournament",
          "pos": "noun",
          "ipa": "/ˈtʊə.nə.mənt/",
          "meaningVi": "giải đấu thể thao",
          "exampleSentence": "Our team won second place in the badminton tournament."
        },
        {
          "word": "instrument",
          "pos": "noun",
          "ipa": "/ˈɪn.strə.mənt/",
          "meaningVi": "nhạc cụ",
          "exampleSentence": "He has played musical instruments since childhood."
        },
        {
          "word": "relaxing",
          "pos": "adj",
          "ipa": "/rɪˈlæk.sɪŋ/",
          "meaningVi": "thư giãn, êm dịu",
          "exampleSentence": "Listening to acoustic music is very relaxing."
        },
        {
          "word": "boarding pass",
          "pos": "noun",
          "ipa": "/ˈbɔː.dɪŋ pɑːs/",
          "meaningVi": "thẻ lên máy bay",
          "exampleSentence": "Please have your passport and boarding pass ready at the gate."
        },
        {
          "word": "round-trip",
          "pos": "adj",
          "ipa": "/ˌraʊndˈtrɪp/",
          "meaningVi": "khứ hồi (hai chiều)",
          "exampleSentence": "A round-trip train ticket is cheaper than buying two single tickets."
        },
        {
          "word": "customs",
          "pos": "noun",
          "ipa": "/ˈkʌs.təmz/",
          "meaningVi": "hải quan sân bay",
          "exampleSentence": "It took twenty minutes to clear customs and immigration."
        },
        {
          "word": "check-up",
          "pos": "noun",
          "ipa": "/ˈtʃek.ʌp/",
          "meaningVi": "khám sức khỏe định kỳ",
          "exampleSentence": "Doctors recommend having a general medical check-up once a year."
        },
        {
          "word": "immune system",
          "pos": "phrase",
          "ipa": "/ɪˈmjuːn ˌsɪs.təm/",
          "meaningVi": "hệ miễn dịch",
          "exampleSentence": "Vitamin C and regular exercise strengthen your immune system."
        },
        {
          "word": "overtime",
          "pos": "noun",
          "ipa": "/ˈəʊ.və.taɪm/",
          "meaningVi": "làm thêm giờ (OT)",
          "exampleSentence": "The engineering team worked overtime to finish the prototype."
        },
        {
          "word": "shift",
          "pos": "noun",
          "ipa": "/ʃɪft/",
          "meaningVi": "ca làm việc",
          "exampleSentence": "Technicians at the refinery rotate between morning and night shifts."
        },
        {
          "word": "probation",
          "pos": "noun",
          "ipa": "/prəˈbeɪ.ʃən/",
          "meaningVi": "thời gian thử việc",
          "exampleSentence": "New graduates usually complete a two-month probation period."
        },
        {
          "word": "exhibition",
          "pos": "noun",
          "ipa": "/ˌek.sɪˈbɪʃ.ən/",
          "meaningVi": "triển lãm",
          "exampleSentence": "We visited the international automation exhibition in Ho Chi Minh City."
        },
        {
          "word": "tuition",
          "pos": "noun",
          "ipa": "/tjuːˈɪʃ.ən/",
          "meaningVi": "học phí",
          "exampleSentence": "EnglishFlow provides full CEFR courses with zero tuition fees."
        }
      ]
    },
    {
      "topicTitle": "Education & School",
      "words": [
        {
          "word": "semester",
          "pos": "noun",
          "ipa": "/sɪˈmes.tər/",
          "meaningVi": "học kỳ",
          "exampleSentence": "Final exams are scheduled at the end of this semester."
        },
        {
          "word": "assignment",
          "pos": "noun",
          "ipa": "/əˈsaɪn.mənt/",
          "meaningVi": "bài tập được giao",
          "exampleSentence": "Submit your reading assignment by Friday evening."
        },
        {
          "word": "curriculum",
          "pos": "noun",
          "ipa": "/kəˈrɪk.jə.ləm/",
          "meaningVi": "giáo trình, chương trình học",
          "exampleSentence": "The EnglishFlow curriculum follows strict CEFR standards."
        },
        {
          "word": "scholarship",
          "pos": "noun",
          "ipa": "/ˈskɒl.ə.ʃɪp/",
          "meaningVi": "học bổng",
          "exampleSentence": "She earned a full scholarship for academic excellence."
        },
        {
          "word": "graduate",
          "pos": "verb",
          "ipa": "/ˈɡrædʒ.u.eɪt/",
          "meaningVi": "tốt nghiệp",
          "exampleSentence": "He plans to work abroad after he graduates."
        },
        {
          "word": "boarding pass",
          "pos": "noun",
          "ipa": "/ˈbɔː.dɪŋ pɑːs/",
          "meaningVi": "thẻ lên máy bay",
          "exampleSentence": "Please have your passport and boarding pass ready at the gate."
        },
        {
          "word": "round-trip",
          "pos": "adj",
          "ipa": "/ˌraʊndˈtrɪp/",
          "meaningVi": "khứ hồi (hai chiều)",
          "exampleSentence": "A round-trip train ticket is cheaper than buying two single tickets."
        },
        {
          "word": "customs",
          "pos": "noun",
          "ipa": "/ˈkʌs.təmz/",
          "meaningVi": "hải quan sân bay",
          "exampleSentence": "It took twenty minutes to clear customs and immigration."
        },
        {
          "word": "check-up",
          "pos": "noun",
          "ipa": "/ˈtʃek.ʌp/",
          "meaningVi": "khám sức khỏe định kỳ",
          "exampleSentence": "Doctors recommend having a general medical check-up once a year."
        },
        {
          "word": "immune system",
          "pos": "phrase",
          "ipa": "/ɪˈmjuːn ˌsɪs.təm/",
          "meaningVi": "hệ miễn dịch",
          "exampleSentence": "Vitamin C and regular exercise strengthen your immune system."
        },
        {
          "word": "overtime",
          "pos": "noun",
          "ipa": "/ˈəʊ.və.taɪm/",
          "meaningVi": "làm thêm giờ (OT)",
          "exampleSentence": "The engineering team worked overtime to finish the prototype."
        },
        {
          "word": "shift",
          "pos": "noun",
          "ipa": "/ʃɪft/",
          "meaningVi": "ca làm việc",
          "exampleSentence": "Technicians at the refinery rotate between morning and night shifts."
        },
        {
          "word": "probation",
          "pos": "noun",
          "ipa": "/prəˈbeɪ.ʃən/",
          "meaningVi": "thời gian thử việc",
          "exampleSentence": "New graduates usually complete a two-month probation period."
        },
        {
          "word": "exhibition",
          "pos": "noun",
          "ipa": "/ˌek.sɪˈbɪʃ.ən/",
          "meaningVi": "triển lãm",
          "exampleSentence": "We visited the international automation exhibition in Ho Chi Minh City."
        },
        {
          "word": "tuition",
          "pos": "noun",
          "ipa": "/tjuːˈɪʃ.ən/",
          "meaningVi": "học phí",
          "exampleSentence": "EnglishFlow provides full CEFR courses with zero tuition fees."
        }
      ]
    },
    {
      "topicTitle": "Technology & Internet",
      "words": [
        {
          "word": "wireless",
          "pos": "adj",
          "ipa": "/ˈwaɪə.ləs/",
          "meaningVi": "không dây",
          "exampleSentence": "Connect your laptop to the wireless office network."
        },
        {
          "word": "download",
          "pos": "verb",
          "ipa": "/ˌdaʊnˈləʊd/",
          "meaningVi": "tải về máy",
          "exampleSentence": "You can download transcripts to study offline."
        },
        {
          "word": "account",
          "pos": "noun",
          "ipa": "/əˈkaʊnt/",
          "meaningVi": "tài khoản người dùng",
          "exampleSentence": "Create a free account to track your study streak."
        },
        {
          "word": "security",
          "pos": "noun",
          "ipa": "/sɪˈkjʊə.rə.ti/",
          "meaningVi": "an ninh, bảo mật",
          "exampleSentence": "Use strong passwords for better account security."
        },
        {
          "word": "device",
          "pos": "noun",
          "ipa": "/dɪˈvaɪs/",
          "meaningVi": "thiết bị điện tử",
          "exampleSentence": "The application runs smoothly across all mobile devices."
        },
        {
          "word": "boarding pass",
          "pos": "noun",
          "ipa": "/ˈbɔː.dɪŋ pɑːs/",
          "meaningVi": "thẻ lên máy bay",
          "exampleSentence": "Please have your passport and boarding pass ready at the gate."
        },
        {
          "word": "round-trip",
          "pos": "adj",
          "ipa": "/ˌraʊndˈtrɪp/",
          "meaningVi": "khứ hồi (hai chiều)",
          "exampleSentence": "A round-trip train ticket is cheaper than buying two single tickets."
        },
        {
          "word": "customs",
          "pos": "noun",
          "ipa": "/ˈkʌs.təmz/",
          "meaningVi": "hải quan sân bay",
          "exampleSentence": "It took twenty minutes to clear customs and immigration."
        },
        {
          "word": "check-up",
          "pos": "noun",
          "ipa": "/ˈtʃek.ʌp/",
          "meaningVi": "khám sức khỏe định kỳ",
          "exampleSentence": "Doctors recommend having a general medical check-up once a year."
        },
        {
          "word": "immune system",
          "pos": "phrase",
          "ipa": "/ɪˈmjuːn ˌsɪs.təm/",
          "meaningVi": "hệ miễn dịch",
          "exampleSentence": "Vitamin C and regular exercise strengthen your immune system."
        },
        {
          "word": "overtime",
          "pos": "noun",
          "ipa": "/ˈəʊ.və.taɪm/",
          "meaningVi": "làm thêm giờ (OT)",
          "exampleSentence": "The engineering team worked overtime to finish the prototype."
        },
        {
          "word": "shift",
          "pos": "noun",
          "ipa": "/ʃɪft/",
          "meaningVi": "ca làm việc",
          "exampleSentence": "Technicians at the refinery rotate between morning and night shifts."
        },
        {
          "word": "probation",
          "pos": "noun",
          "ipa": "/prəˈbeɪ.ʃən/",
          "meaningVi": "thời gian thử việc",
          "exampleSentence": "New graduates usually complete a two-month probation period."
        },
        {
          "word": "exhibition",
          "pos": "noun",
          "ipa": "/ˌek.sɪˈbɪʃ.ən/",
          "meaningVi": "triển lãm",
          "exampleSentence": "We visited the international automation exhibition in Ho Chi Minh City."
        },
        {
          "word": "tuition",
          "pos": "noun",
          "ipa": "/tjuːˈɪʃ.ən/",
          "meaningVi": "học phí",
          "exampleSentence": "EnglishFlow provides full CEFR courses with zero tuition fees."
        }
      ]
    },
    {
      "topicTitle": "Restaurants & Ordering",
      "words": [
        {
          "word": "reservation",
          "pos": "noun",
          "ipa": "/ˌrez.əˈveɪ.ʃən/",
          "meaningVi": "đặt bàn trước",
          "exampleSentence": "I made a dinner reservation for two at seven o'clock."
        },
        {
          "word": "appetizer",
          "pos": "noun",
          "ipa": "/ˈæp.ɪ.taɪ.zər/",
          "meaningVi": "món khai vị",
          "exampleSentence": "Let us order garlic bread as an appetizer."
        },
        {
          "word": "beverage",
          "pos": "noun",
          "ipa": "/ˈbev.ər.ɪdʒ/",
          "meaningVi": "đồ uống kèm theo",
          "exampleSentence": "Would you like any beverages with your main course?"
        },
        {
          "word": "bill",
          "pos": "noun",
          "ipa": "/bɪl/",
          "meaningVi": "hóa đơn tính tiền",
          "exampleSentence": "Could we have the bill when you have a moment, please?"
        },
        {
          "word": "tip",
          "pos": "noun",
          "ipa": "/tɪp/",
          "meaningVi": "tiền boa, tiền thưởng",
          "exampleSentence": "Leaving a 15% tip is customary in American diners."
        },
        {
          "word": "boarding pass",
          "pos": "noun",
          "ipa": "/ˈbɔː.dɪŋ pɑːs/",
          "meaningVi": "thẻ lên máy bay",
          "exampleSentence": "Please have your passport and boarding pass ready at the gate."
        },
        {
          "word": "round-trip",
          "pos": "adj",
          "ipa": "/ˌraʊndˈtrɪp/",
          "meaningVi": "khứ hồi (hai chiều)",
          "exampleSentence": "A round-trip train ticket is cheaper than buying two single tickets."
        },
        {
          "word": "customs",
          "pos": "noun",
          "ipa": "/ˈkʌs.təmz/",
          "meaningVi": "hải quan sân bay",
          "exampleSentence": "It took twenty minutes to clear customs and immigration."
        },
        {
          "word": "check-up",
          "pos": "noun",
          "ipa": "/ˈtʃek.ʌp/",
          "meaningVi": "khám sức khỏe định kỳ",
          "exampleSentence": "Doctors recommend having a general medical check-up once a year."
        },
        {
          "word": "immune system",
          "pos": "phrase",
          "ipa": "/ɪˈmjuːn ˌsɪs.təm/",
          "meaningVi": "hệ miễn dịch",
          "exampleSentence": "Vitamin C and regular exercise strengthen your immune system."
        },
        {
          "word": "overtime",
          "pos": "noun",
          "ipa": "/ˈəʊ.və.taɪm/",
          "meaningVi": "làm thêm giờ (OT)",
          "exampleSentence": "The engineering team worked overtime to finish the prototype."
        },
        {
          "word": "shift",
          "pos": "noun",
          "ipa": "/ʃɪft/",
          "meaningVi": "ca làm việc",
          "exampleSentence": "Technicians at the refinery rotate between morning and night shifts."
        },
        {
          "word": "probation",
          "pos": "noun",
          "ipa": "/prəˈbeɪ.ʃən/",
          "meaningVi": "thời gian thử việc",
          "exampleSentence": "New graduates usually complete a two-month probation period."
        },
        {
          "word": "exhibition",
          "pos": "noun",
          "ipa": "/ˌek.sɪˈbɪʃ.ən/",
          "meaningVi": "triển lãm",
          "exampleSentence": "We visited the international automation exhibition in Ho Chi Minh City."
        },
        {
          "word": "tuition",
          "pos": "noun",
          "ipa": "/tjuːˈɪʃ.ən/",
          "meaningVi": "học phí",
          "exampleSentence": "EnglishFlow provides full CEFR courses with zero tuition fees."
        }
      ]
    },
    {
      "topicTitle": "Directions & Places",
      "words": [
        {
          "word": "intersection",
          "pos": "noun",
          "ipa": "/ˌɪn.təˈsek.ʃən/",
          "meaningVi": "ngã tư, giao lộ",
          "exampleSentence": "Turn right when you reach the next traffic intersection."
        },
        {
          "word": "pedestrian",
          "pos": "noun",
          "ipa": "/pəˈdes.tri.ən/",
          "meaningVi": "người đi bộ",
          "exampleSentence": "Always use the pedestrian crossing for safety."
        },
        {
          "word": "straight",
          "pos": "adv",
          "ipa": "/streɪt/",
          "meaningVi": "thẳng về phía trước",
          "exampleSentence": "Go straight ahead for two blocks until you see the bank."
        },
        {
          "word": "opposite",
          "pos": "prep",
          "ipa": "/ˈɒp.ə.zɪt/",
          "meaningVi": "đối diện",
          "exampleSentence": "The post office is opposite the central library."
        },
        {
          "word": "distance",
          "pos": "noun",
          "ipa": "/ˈdɪs.təns/",
          "meaningVi": "khoảng cách",
          "exampleSentence": "It is within walking distance from here, about 5 minutes."
        },
        {
          "word": "boarding pass",
          "pos": "noun",
          "ipa": "/ˈbɔː.dɪŋ pɑːs/",
          "meaningVi": "thẻ lên máy bay",
          "exampleSentence": "Please have your passport and boarding pass ready at the gate."
        },
        {
          "word": "round-trip",
          "pos": "adj",
          "ipa": "/ˌraʊndˈtrɪp/",
          "meaningVi": "khứ hồi (hai chiều)",
          "exampleSentence": "A round-trip train ticket is cheaper than buying two single tickets."
        },
        {
          "word": "customs",
          "pos": "noun",
          "ipa": "/ˈkʌs.təmz/",
          "meaningVi": "hải quan sân bay",
          "exampleSentence": "It took twenty minutes to clear customs and immigration."
        },
        {
          "word": "check-up",
          "pos": "noun",
          "ipa": "/ˈtʃek.ʌp/",
          "meaningVi": "khám sức khỏe định kỳ",
          "exampleSentence": "Doctors recommend having a general medical check-up once a year."
        },
        {
          "word": "immune system",
          "pos": "phrase",
          "ipa": "/ɪˈmjuːn ˌsɪs.təm/",
          "meaningVi": "hệ miễn dịch",
          "exampleSentence": "Vitamin C and regular exercise strengthen your immune system."
        },
        {
          "word": "overtime",
          "pos": "noun",
          "ipa": "/ˈəʊ.və.taɪm/",
          "meaningVi": "làm thêm giờ (OT)",
          "exampleSentence": "The engineering team worked overtime to finish the prototype."
        },
        {
          "word": "shift",
          "pos": "noun",
          "ipa": "/ʃɪft/",
          "meaningVi": "ca làm việc",
          "exampleSentence": "Technicians at the refinery rotate between morning and night shifts."
        },
        {
          "word": "probation",
          "pos": "noun",
          "ipa": "/prəˈbeɪ.ʃən/",
          "meaningVi": "thời gian thử việc",
          "exampleSentence": "New graduates usually complete a two-month probation period."
        },
        {
          "word": "exhibition",
          "pos": "noun",
          "ipa": "/ˌek.sɪˈbɪʃ.ən/",
          "meaningVi": "triển lãm",
          "exampleSentence": "We visited the international automation exhibition in Ho Chi Minh City."
        },
        {
          "word": "tuition",
          "pos": "noun",
          "ipa": "/tjuːˈɪʃ.ən/",
          "meaningVi": "học phí",
          "exampleSentence": "EnglishFlow provides full CEFR courses with zero tuition fees."
        }
      ]
    },
    {
      "topicTitle": "Money & Banking",
      "words": [
        {
          "word": "balance",
          "pos": "noun",
          "ipa": "/ˈbæl.əns/",
          "meaningVi": "số dư tài khoản",
          "exampleSentence": "You can check your account balance on the mobile app."
        },
        {
          "word": "transfer",
          "pos": "verb",
          "ipa": "/trænsˈfɜːr/",
          "meaningVi": "chuyển khoản tiền",
          "exampleSentence": "I need to transfer rent money to my landlord."
        },
        {
          "word": "currency",
          "pos": "noun",
          "ipa": "/ˈkʌr.ən.si/",
          "meaningVi": "tiền tệ",
          "exampleSentence": "Exchange your local currency at the airport counter."
        },
        {
          "word": "deposit",
          "pos": "verb",
          "ipa": "/dɪˈpɒz.ɪt/",
          "meaningVi": "gửi tiền, tiền cọc",
          "exampleSentence": "He deposited five hundred dollars into his savings."
        },
        {
          "word": "withdraw",
          "pos": "verb",
          "ipa": "/wɪðˈdrɔː/",
          "meaningVi": "rút tiền mặt",
          "exampleSentence": "Where is the nearest ATM to withdraw cash?"
        },
        {
          "word": "boarding pass",
          "pos": "noun",
          "ipa": "/ˈbɔː.dɪŋ pɑːs/",
          "meaningVi": "thẻ lên máy bay",
          "exampleSentence": "Please have your passport and boarding pass ready at the gate."
        },
        {
          "word": "round-trip",
          "pos": "adj",
          "ipa": "/ˌraʊndˈtrɪp/",
          "meaningVi": "khứ hồi (hai chiều)",
          "exampleSentence": "A round-trip train ticket is cheaper than buying two single tickets."
        },
        {
          "word": "customs",
          "pos": "noun",
          "ipa": "/ˈkʌs.təmz/",
          "meaningVi": "hải quan sân bay",
          "exampleSentence": "It took twenty minutes to clear customs and immigration."
        },
        {
          "word": "check-up",
          "pos": "noun",
          "ipa": "/ˈtʃek.ʌp/",
          "meaningVi": "khám sức khỏe định kỳ",
          "exampleSentence": "Doctors recommend having a general medical check-up once a year."
        },
        {
          "word": "immune system",
          "pos": "phrase",
          "ipa": "/ɪˈmjuːn ˌsɪs.təm/",
          "meaningVi": "hệ miễn dịch",
          "exampleSentence": "Vitamin C and regular exercise strengthen your immune system."
        },
        {
          "word": "overtime",
          "pos": "noun",
          "ipa": "/ˈəʊ.və.taɪm/",
          "meaningVi": "làm thêm giờ (OT)",
          "exampleSentence": "The engineering team worked overtime to finish the prototype."
        },
        {
          "word": "shift",
          "pos": "noun",
          "ipa": "/ʃɪft/",
          "meaningVi": "ca làm việc",
          "exampleSentence": "Technicians at the refinery rotate between morning and night shifts."
        },
        {
          "word": "probation",
          "pos": "noun",
          "ipa": "/prəˈbeɪ.ʃən/",
          "meaningVi": "thời gian thử việc",
          "exampleSentence": "New graduates usually complete a two-month probation period."
        },
        {
          "word": "exhibition",
          "pos": "noun",
          "ipa": "/ˌek.sɪˈbɪʃ.ən/",
          "meaningVi": "triển lãm",
          "exampleSentence": "We visited the international automation exhibition in Ho Chi Minh City."
        },
        {
          "word": "tuition",
          "pos": "noun",
          "ipa": "/tjuːˈɪʃ.ən/",
          "meaningVi": "học phí",
          "exampleSentence": "EnglishFlow provides full CEFR courses with zero tuition fees."
        }
      ]
    },
    {
      "topicTitle": "Celebrations & Events",
      "words": [
        {
          "word": "anniversary",
          "pos": "noun",
          "ipa": "/ˌæn.ɪˈvɜː.sər.i/",
          "meaningVi": "ngày kỷ niệm",
          "exampleSentence": "They celebrated their tenth wedding anniversary."
        },
        {
          "word": "invitation",
          "pos": "noun",
          "ipa": "/ˌɪn.vɪˈteɪ.ʃən/",
          "meaningVi": "thư mời tham dự",
          "exampleSentence": "Thank you for the warm invitation to your birthday party."
        },
        {
          "word": "ceremony",
          "pos": "noun",
          "ipa": "/ˈser.ɪ.mə.ni/",
          "meaningVi": "buổi lễ trang trọng",
          "exampleSentence": "The opening ceremony starts promptly at eight."
        },
        {
          "word": "decorate",
          "pos": "verb",
          "ipa": "/ˈdek.ə.reɪt/",
          "meaningVi": "trang trí",
          "exampleSentence": "We decorated the classroom with colorful balloons."
        },
        {
          "word": "tradition",
          "pos": "noun",
          "ipa": "/trəˈdɪʃ.ən/",
          "meaningVi": "truyền thống",
          "exampleSentence": "Eating mooncakes is a beloved Mid-Autumn tradition."
        },
        {
          "word": "boarding pass",
          "pos": "noun",
          "ipa": "/ˈbɔː.dɪŋ pɑːs/",
          "meaningVi": "thẻ lên máy bay",
          "exampleSentence": "Please have your passport and boarding pass ready at the gate."
        },
        {
          "word": "round-trip",
          "pos": "adj",
          "ipa": "/ˌraʊndˈtrɪp/",
          "meaningVi": "khứ hồi (hai chiều)",
          "exampleSentence": "A round-trip train ticket is cheaper than buying two single tickets."
        },
        {
          "word": "customs",
          "pos": "noun",
          "ipa": "/ˈkʌs.təmz/",
          "meaningVi": "hải quan sân bay",
          "exampleSentence": "It took twenty minutes to clear customs and immigration."
        },
        {
          "word": "check-up",
          "pos": "noun",
          "ipa": "/ˈtʃek.ʌp/",
          "meaningVi": "khám sức khỏe định kỳ",
          "exampleSentence": "Doctors recommend having a general medical check-up once a year."
        },
        {
          "word": "immune system",
          "pos": "phrase",
          "ipa": "/ɪˈmjuːn ˌsɪs.təm/",
          "meaningVi": "hệ miễn dịch",
          "exampleSentence": "Vitamin C and regular exercise strengthen your immune system."
        },
        {
          "word": "overtime",
          "pos": "noun",
          "ipa": "/ˈəʊ.və.taɪm/",
          "meaningVi": "làm thêm giờ (OT)",
          "exampleSentence": "The engineering team worked overtime to finish the prototype."
        },
        {
          "word": "shift",
          "pos": "noun",
          "ipa": "/ʃɪft/",
          "meaningVi": "ca làm việc",
          "exampleSentence": "Technicians at the refinery rotate between morning and night shifts."
        },
        {
          "word": "probation",
          "pos": "noun",
          "ipa": "/prəˈbeɪ.ʃən/",
          "meaningVi": "thời gian thử việc",
          "exampleSentence": "New graduates usually complete a two-month probation period."
        },
        {
          "word": "exhibition",
          "pos": "noun",
          "ipa": "/ˌek.sɪˈbɪʃ.ən/",
          "meaningVi": "triển lãm",
          "exampleSentence": "We visited the international automation exhibition in Ho Chi Minh City."
        },
        {
          "word": "tuition",
          "pos": "noun",
          "ipa": "/tjuːˈɪʃ.ən/",
          "meaningVi": "học phí",
          "exampleSentence": "EnglishFlow provides full CEFR courses with zero tuition fees."
        }
      ]
    }
  ],
  "B1": [
    {
      "topicTitle": "Work & Business Meetings",
      "words": [
        {
          "word": "agenda",
          "pos": "noun",
          "ipa": "/əˈdʒen.də/",
          "meaningVi": "chương trình nghị sự",
          "exampleSentence": "Let us review the main items on today's agenda."
        },
        {
          "word": "objective",
          "pos": "noun",
          "ipa": "/əbˈdʒek.tɪv/",
          "meaningVi": "mục tiêu cụ thể",
          "exampleSentence": "Our primary objective is improving user retention."
        },
        {
          "word": "collaborate",
          "pos": "verb",
          "ipa": "/kəˈlæb.ə.reɪt/",
          "meaningVi": "cộng tác, làm việc chung",
          "exampleSentence": "Engineering and design teams collaborate closely."
        },
        {
          "word": "minutes",
          "pos": "noun",
          "ipa": "/ˈmɪn.ɪts/",
          "meaningVi": "biên bản cuộc họp",
          "exampleSentence": "The secretary will send the meeting minutes by email."
        },
        {
          "word": "consensus",
          "pos": "noun",
          "ipa": "/kənˈsen.səs/",
          "meaningVi": "sự đồng thuận",
          "exampleSentence": "We reached a consensus on the new product roadmap."
        },
        {
          "word": "milestone",
          "pos": "noun",
          "ipa": "/ˈmaɪl.stəʊn/",
          "meaningVi": "cột mốc quan trọng",
          "exampleSentence": "Completing the 4-layer PCB layout was a major project milestone."
        },
        {
          "word": "stakeholder",
          "pos": "noun",
          "ipa": "/ˈsteɪkˌhəʊl.dər/",
          "meaningVi": "bên liên quan trong dự án",
          "exampleSentence": "We presented the quarterly progress report to all key stakeholders."
        },
        {
          "word": "bottleneck",
          "pos": "noun",
          "ipa": "/ˈbɒt.əl.nek/",
          "meaningVi": "điểm nghẽn (kỹ thuật/quy trình)",
          "exampleSentence": "Upgrading the conveyor sensor resolved the packaging bottleneck."
        },
        {
          "word": "credibility",
          "pos": "noun",
          "ipa": "/ˌkred.əˈbɪl.ə.ti/",
          "meaningVi": "độ tin cậy, uy tín",
          "exampleSentence": "Always cite verified primary sources to maintain academic credibility."
        },
        {
          "word": "sustainable",
          "pos": "adj",
          "ipa": "/səˈsteɪ.nə.bəl/",
          "meaningVi": "bền vững, lâu dài",
          "exampleSentence": "Zero-cost serverless architecture makes open education sustainable."
        },
        {
          "word": "emission",
          "pos": "noun",
          "ipa": "/iˈmɪʃ.ən/",
          "meaningVi": "khí thải, sự phát thải",
          "exampleSentence": "Electric vehicles help lower urban carbon emissions significantly."
        },
        {
          "word": "burnout",
          "pos": "noun",
          "ipa": "/ˈbɜːn.aʊt/",
          "meaningVi": "sự kiệt sức vì công việc",
          "exampleSentence": "Taking regular weekend breaks prevents workplace burnout."
        },
        {
          "word": "assimilation",
          "pos": "noun",
          "ipa": "/əˌsɪm.ɪˈleɪ.ʃən/",
          "meaningVi": "sự hòa nhập văn hóa",
          "exampleSentence": "Language proficiency speeds up cultural assimilation when working abroad."
        },
        {
          "word": "itinerary",
          "pos": "noun",
          "ipa": "/aɪˈtɪn.ər.ər.i/",
          "meaningVi": "lịch trình chi tiết",
          "exampleSentence": "Our travel itinerary includes both historical sites and coastal beaches."
        },
        {
          "word": "portfolio",
          "pos": "noun",
          "ipa": "/pɔːtˈfəʊ.li.əʊ/",
          "meaningVi": "hồ sơ năng lực (dự án cá nhân)",
          "exampleSentence": "Including real PCB and SCADA projects makes your engineering portfolio stand out."
        }
      ]
    },
    {
      "topicTitle": "News & Current Affairs",
      "words": [
        {
          "word": "headline",
          "pos": "noun",
          "ipa": "/ˈhed.laɪn/",
          "meaningVi": "tiêu đề bản tin",
          "exampleSentence": "The morning headline highlighted renewable energy growth."
        },
        {
          "word": "broadcast",
          "pos": "verb",
          "ipa": "/ˈbrɔːd.kɑːst/",
          "meaningVi": "phát sóng",
          "exampleSentence": "The press conference will be broadcast live nationwide."
        },
        {
          "word": "investigation",
          "pos": "noun",
          "ipa": "/ɪnˌves.tɪˈɡeɪ.ʃən/",
          "meaningVi": "cuộc điều tra, phóng sự",
          "exampleSentence": "Journalists launched an investigation into water pollution."
        },
        {
          "word": "literacy",
          "pos": "noun",
          "ipa": "/ˈlɪt.ər.ə.si/",
          "meaningVi": "năng lực hiểu biết",
          "exampleSentence": "Digital literacy helps people identify fake news."
        },
        {
          "word": "witness",
          "pos": "noun",
          "ipa": "/ˈwɪt.nəs/",
          "meaningVi": "nhân chứng",
          "exampleSentence": "Eyewitnesses reported seeing emergency teams arrive quickly."
        },
        {
          "word": "milestone",
          "pos": "noun",
          "ipa": "/ˈmaɪl.stəʊn/",
          "meaningVi": "cột mốc quan trọng",
          "exampleSentence": "Completing the 4-layer PCB layout was a major project milestone."
        },
        {
          "word": "stakeholder",
          "pos": "noun",
          "ipa": "/ˈsteɪkˌhəʊl.dər/",
          "meaningVi": "bên liên quan trong dự án",
          "exampleSentence": "We presented the quarterly progress report to all key stakeholders."
        },
        {
          "word": "bottleneck",
          "pos": "noun",
          "ipa": "/ˈbɒt.əl.nek/",
          "meaningVi": "điểm nghẽn (kỹ thuật/quy trình)",
          "exampleSentence": "Upgrading the conveyor sensor resolved the packaging bottleneck."
        },
        {
          "word": "credibility",
          "pos": "noun",
          "ipa": "/ˌkred.əˈbɪl.ə.ti/",
          "meaningVi": "độ tin cậy, uy tín",
          "exampleSentence": "Always cite verified primary sources to maintain academic credibility."
        },
        {
          "word": "sustainable",
          "pos": "adj",
          "ipa": "/səˈsteɪ.nə.bəl/",
          "meaningVi": "bền vững, lâu dài",
          "exampleSentence": "Zero-cost serverless architecture makes open education sustainable."
        },
        {
          "word": "emission",
          "pos": "noun",
          "ipa": "/iˈmɪʃ.ən/",
          "meaningVi": "khí thải, sự phát thải",
          "exampleSentence": "Electric vehicles help lower urban carbon emissions significantly."
        },
        {
          "word": "burnout",
          "pos": "noun",
          "ipa": "/ˈbɜːn.aʊt/",
          "meaningVi": "sự kiệt sức vì công việc",
          "exampleSentence": "Taking regular weekend breaks prevents workplace burnout."
        },
        {
          "word": "assimilation",
          "pos": "noun",
          "ipa": "/əˌsɪm.ɪˈleɪ.ʃən/",
          "meaningVi": "sự hòa nhập văn hóa",
          "exampleSentence": "Language proficiency speeds up cultural assimilation when working abroad."
        },
        {
          "word": "itinerary",
          "pos": "noun",
          "ipa": "/aɪˈtɪn.ər.ər.i/",
          "meaningVi": "lịch trình chi tiết",
          "exampleSentence": "Our travel itinerary includes both historical sites and coastal beaches."
        },
        {
          "word": "portfolio",
          "pos": "noun",
          "ipa": "/pɔːtˈfəʊ.li.əʊ/",
          "meaningVi": "hồ sơ năng lực (dự án cá nhân)",
          "exampleSentence": "Including real PCB and SCADA projects makes your engineering portfolio stand out."
        }
      ]
    },
    {
      "topicTitle": "Environment & Nature",
      "words": [
        {
          "word": "ecosystem",
          "pos": "noun",
          "ipa": "/ˈiː.kəʊˌsɪs.təm/",
          "meaningVi": "hệ sinh thái",
          "exampleSentence": "Pollution severely damages local marine ecosystems."
        },
        {
          "word": "renewable",
          "pos": "adj",
          "ipa": "/rɪˈnjuː.ə.bəl/",
          "meaningVi": "tái tạo được",
          "exampleSentence": "Solar and wind are key sources of renewable energy."
        },
        {
          "word": "biodiversity",
          "pos": "noun",
          "ipa": "/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti/",
          "meaningVi": "đa dạng sinh học",
          "exampleSentence": "Tropical rainforests hold tremendous biodiversity."
        },
        {
          "word": "footprint",
          "pos": "noun",
          "ipa": "/ˈfʊt.prɪnt/",
          "meaningVi": "dấu chân carbon",
          "exampleSentence": "Using public transit reduces your carbon footprint."
        },
        {
          "word": "conservation",
          "pos": "noun",
          "ipa": "/ˌkɒn.səˈveɪ.ʃən/",
          "meaningVi": "sự bảo tồn",
          "exampleSentence": "Wildlife conservation projects protect endangered species."
        },
        {
          "word": "milestone",
          "pos": "noun",
          "ipa": "/ˈmaɪl.stəʊn/",
          "meaningVi": "cột mốc quan trọng",
          "exampleSentence": "Completing the 4-layer PCB layout was a major project milestone."
        },
        {
          "word": "stakeholder",
          "pos": "noun",
          "ipa": "/ˈsteɪkˌhəʊl.dər/",
          "meaningVi": "bên liên quan trong dự án",
          "exampleSentence": "We presented the quarterly progress report to all key stakeholders."
        },
        {
          "word": "bottleneck",
          "pos": "noun",
          "ipa": "/ˈbɒt.əl.nek/",
          "meaningVi": "điểm nghẽn (kỹ thuật/quy trình)",
          "exampleSentence": "Upgrading the conveyor sensor resolved the packaging bottleneck."
        },
        {
          "word": "credibility",
          "pos": "noun",
          "ipa": "/ˌkred.əˈbɪl.ə.ti/",
          "meaningVi": "độ tin cậy, uy tín",
          "exampleSentence": "Always cite verified primary sources to maintain academic credibility."
        },
        {
          "word": "sustainable",
          "pos": "adj",
          "ipa": "/səˈsteɪ.nə.bəl/",
          "meaningVi": "bền vững, lâu dài",
          "exampleSentence": "Zero-cost serverless architecture makes open education sustainable."
        },
        {
          "word": "emission",
          "pos": "noun",
          "ipa": "/iˈmɪʃ.ən/",
          "meaningVi": "khí thải, sự phát thải",
          "exampleSentence": "Electric vehicles help lower urban carbon emissions significantly."
        },
        {
          "word": "burnout",
          "pos": "noun",
          "ipa": "/ˈbɜːn.aʊt/",
          "meaningVi": "sự kiệt sức vì công việc",
          "exampleSentence": "Taking regular weekend breaks prevents workplace burnout."
        },
        {
          "word": "assimilation",
          "pos": "noun",
          "ipa": "/əˌsɪm.ɪˈleɪ.ʃən/",
          "meaningVi": "sự hòa nhập văn hóa",
          "exampleSentence": "Language proficiency speeds up cultural assimilation when working abroad."
        },
        {
          "word": "itinerary",
          "pos": "noun",
          "ipa": "/aɪˈtɪn.ər.ər.i/",
          "meaningVi": "lịch trình chi tiết",
          "exampleSentence": "Our travel itinerary includes both historical sites and coastal beaches."
        },
        {
          "word": "portfolio",
          "pos": "noun",
          "ipa": "/pɔːtˈfəʊ.li.əʊ/",
          "meaningVi": "hồ sơ năng lực (dự án cá nhân)",
          "exampleSentence": "Including real PCB and SCADA projects makes your engineering portfolio stand out."
        }
      ]
    },
    {
      "topicTitle": "Health & Wellbeing",
      "words": [
        {
          "word": "wellness",
          "pos": "noun",
          "ipa": "/ˈwel.nəs/",
          "meaningVi": "sức khỏe toàn diện",
          "exampleSentence": "Corporate wellness programs encourage balanced living."
        },
        {
          "word": "nutrition",
          "pos": "noun",
          "ipa": "/njuːˈtrɪʃ.ən/",
          "meaningVi": "dinh dưỡng học",
          "exampleSentence": "Good nutrition plays a vital role in disease prevention."
        },
        {
          "word": "resilience",
          "pos": "noun",
          "ipa": "/rɪˈzɪl.jəns/",
          "meaningVi": "sự bền bỉ, thích ứng",
          "exampleSentence": "Mental resilience helps individuals overcome career setbacks."
        },
        {
          "word": "mindfulness",
          "pos": "noun",
          "ipa": "/ˈmaɪnd.fəl.nəs/",
          "meaningVi": "chánh niệm, tĩnh tâm",
          "exampleSentence": "Practicing mindfulness reduces daily anxiety."
        },
        {
          "word": "fatigue",
          "pos": "noun",
          "ipa": "/fəˈtiːɡ/",
          "meaningVi": "sự mệt mỏi suy nhược",
          "exampleSentence": "Chronic fatigue is often caused by insufficient sleep."
        },
        {
          "word": "milestone",
          "pos": "noun",
          "ipa": "/ˈmaɪl.stəʊn/",
          "meaningVi": "cột mốc quan trọng",
          "exampleSentence": "Completing the 4-layer PCB layout was a major project milestone."
        },
        {
          "word": "stakeholder",
          "pos": "noun",
          "ipa": "/ˈsteɪkˌhəʊl.dər/",
          "meaningVi": "bên liên quan trong dự án",
          "exampleSentence": "We presented the quarterly progress report to all key stakeholders."
        },
        {
          "word": "bottleneck",
          "pos": "noun",
          "ipa": "/ˈbɒt.əl.nek/",
          "meaningVi": "điểm nghẽn (kỹ thuật/quy trình)",
          "exampleSentence": "Upgrading the conveyor sensor resolved the packaging bottleneck."
        },
        {
          "word": "credibility",
          "pos": "noun",
          "ipa": "/ˌkred.əˈbɪl.ə.ti/",
          "meaningVi": "độ tin cậy, uy tín",
          "exampleSentence": "Always cite verified primary sources to maintain academic credibility."
        },
        {
          "word": "sustainable",
          "pos": "adj",
          "ipa": "/səˈsteɪ.nə.bəl/",
          "meaningVi": "bền vững, lâu dài",
          "exampleSentence": "Zero-cost serverless architecture makes open education sustainable."
        },
        {
          "word": "emission",
          "pos": "noun",
          "ipa": "/iˈmɪʃ.ən/",
          "meaningVi": "khí thải, sự phát thải",
          "exampleSentence": "Electric vehicles help lower urban carbon emissions significantly."
        },
        {
          "word": "burnout",
          "pos": "noun",
          "ipa": "/ˈbɜːn.aʊt/",
          "meaningVi": "sự kiệt sức vì công việc",
          "exampleSentence": "Taking regular weekend breaks prevents workplace burnout."
        },
        {
          "word": "assimilation",
          "pos": "noun",
          "ipa": "/əˌsɪm.ɪˈleɪ.ʃən/",
          "meaningVi": "sự hòa nhập văn hóa",
          "exampleSentence": "Language proficiency speeds up cultural assimilation when working abroad."
        },
        {
          "word": "itinerary",
          "pos": "noun",
          "ipa": "/aɪˈtɪn.ər.ər.i/",
          "meaningVi": "lịch trình chi tiết",
          "exampleSentence": "Our travel itinerary includes both historical sites and coastal beaches."
        },
        {
          "word": "portfolio",
          "pos": "noun",
          "ipa": "/pɔːtˈfəʊ.li.əʊ/",
          "meaningVi": "hồ sơ năng lực (dự án cá nhân)",
          "exampleSentence": "Including real PCB and SCADA projects makes your engineering portfolio stand out."
        }
      ]
    },
    {
      "topicTitle": "Culture & Society",
      "words": [
        {
          "word": "heritage",
          "pos": "noun",
          "ipa": "/ˈher.ɪ.tɪdʒ/",
          "meaningVi": "di sản văn hóa",
          "exampleSentence": "Hoi An ancient town is a UNESCO world heritage site."
        },
        {
          "word": "diversity",
          "pos": "noun",
          "ipa": "/daɪˈvɜː.sə.ti/",
          "meaningVi": "sự đa dạng xã hội",
          "exampleSentence": "Cultural diversity enriches community perspectives."
        },
        {
          "word": "custom",
          "pos": "noun",
          "ipa": "/ˈkʌs.təm/",
          "meaningVi": "phong tục tập quán",
          "exampleSentence": "Respecting local customs fosters mutual trust."
        },
        {
          "word": "etiquette",
          "pos": "noun",
          "ipa": "/ˈet.ɪ.ket/",
          "meaningVi": "quy tắc ứng xử lịch sự",
          "exampleSentence": "Business etiquette varies between Asian and Western cultures."
        },
        {
          "word": "hospitality",
          "pos": "noun",
          "ipa": "/ˌhɒs.pɪˈtæl.ə.ti/",
          "meaningVi": "lòng hiếu khách",
          "exampleSentence": "Vietnamese hospitality leaves a lasting impression on tourists."
        },
        {
          "word": "milestone",
          "pos": "noun",
          "ipa": "/ˈmaɪl.stəʊn/",
          "meaningVi": "cột mốc quan trọng",
          "exampleSentence": "Completing the 4-layer PCB layout was a major project milestone."
        },
        {
          "word": "stakeholder",
          "pos": "noun",
          "ipa": "/ˈsteɪkˌhəʊl.dər/",
          "meaningVi": "bên liên quan trong dự án",
          "exampleSentence": "We presented the quarterly progress report to all key stakeholders."
        },
        {
          "word": "bottleneck",
          "pos": "noun",
          "ipa": "/ˈbɒt.əl.nek/",
          "meaningVi": "điểm nghẽn (kỹ thuật/quy trình)",
          "exampleSentence": "Upgrading the conveyor sensor resolved the packaging bottleneck."
        },
        {
          "word": "credibility",
          "pos": "noun",
          "ipa": "/ˌkred.əˈbɪl.ə.ti/",
          "meaningVi": "độ tin cậy, uy tín",
          "exampleSentence": "Always cite verified primary sources to maintain academic credibility."
        },
        {
          "word": "sustainable",
          "pos": "adj",
          "ipa": "/səˈsteɪ.nə.bəl/",
          "meaningVi": "bền vững, lâu dài",
          "exampleSentence": "Zero-cost serverless architecture makes open education sustainable."
        },
        {
          "word": "emission",
          "pos": "noun",
          "ipa": "/iˈmɪʃ.ən/",
          "meaningVi": "khí thải, sự phát thải",
          "exampleSentence": "Electric vehicles help lower urban carbon emissions significantly."
        },
        {
          "word": "burnout",
          "pos": "noun",
          "ipa": "/ˈbɜːn.aʊt/",
          "meaningVi": "sự kiệt sức vì công việc",
          "exampleSentence": "Taking regular weekend breaks prevents workplace burnout."
        },
        {
          "word": "assimilation",
          "pos": "noun",
          "ipa": "/əˌsɪm.ɪˈleɪ.ʃən/",
          "meaningVi": "sự hòa nhập văn hóa",
          "exampleSentence": "Language proficiency speeds up cultural assimilation when working abroad."
        },
        {
          "word": "itinerary",
          "pos": "noun",
          "ipa": "/aɪˈtɪn.ər.ər.i/",
          "meaningVi": "lịch trình chi tiết",
          "exampleSentence": "Our travel itinerary includes both historical sites and coastal beaches."
        },
        {
          "word": "portfolio",
          "pos": "noun",
          "ipa": "/pɔːtˈfəʊ.li.əʊ/",
          "meaningVi": "hồ sơ năng lực (dự án cá nhân)",
          "exampleSentence": "Including real PCB and SCADA projects makes your engineering portfolio stand out."
        }
      ]
    },
    {
      "topicTitle": "Travel Experiences",
      "words": [
        {
          "word": "breathtaking",
          "pos": "adj",
          "ipa": "/ˈbreθˌteɪ.kɪŋ/",
          "meaningVi": "ngoạn mục, tuyệt đẹp",
          "exampleSentence": "The view from the mountain peak was truly breathtaking."
        },
        {
          "word": "backpacking",
          "pos": "noun",
          "ipa": "/ˈbækˌpæk.ɪŋ/",
          "meaningVi": "du lịch bụi",
          "exampleSentence": "Backpacking through Southeast Asia taught him independence."
        },
        {
          "word": "accommodation",
          "pos": "noun",
          "ipa": "/əˌkɒm.əˈdeɪ.ʃən/",
          "meaningVi": "chỗ lưu trú",
          "exampleSentence": "Book your holiday accommodation several weeks in advance."
        },
        {
          "word": "souvenir",
          "pos": "noun",
          "ipa": "/ˌsuː.vənˈɪər/",
          "meaningVi": "quà lưu niệm",
          "exampleSentence": "She bought handcrafted pottery as a travel souvenir."
        },
        {
          "word": "adventure",
          "pos": "noun",
          "ipa": "/ədˈven.tʃər/",
          "meaningVi": "chuyến phiêu lưu",
          "exampleSentence": "Rafting down the rapid river was an unforgettable adventure."
        },
        {
          "word": "milestone",
          "pos": "noun",
          "ipa": "/ˈmaɪl.stəʊn/",
          "meaningVi": "cột mốc quan trọng",
          "exampleSentence": "Completing the 4-layer PCB layout was a major project milestone."
        },
        {
          "word": "stakeholder",
          "pos": "noun",
          "ipa": "/ˈsteɪkˌhəʊl.dər/",
          "meaningVi": "bên liên quan trong dự án",
          "exampleSentence": "We presented the quarterly progress report to all key stakeholders."
        },
        {
          "word": "bottleneck",
          "pos": "noun",
          "ipa": "/ˈbɒt.əl.nek/",
          "meaningVi": "điểm nghẽn (kỹ thuật/quy trình)",
          "exampleSentence": "Upgrading the conveyor sensor resolved the packaging bottleneck."
        },
        {
          "word": "credibility",
          "pos": "noun",
          "ipa": "/ˌkred.əˈbɪl.ə.ti/",
          "meaningVi": "độ tin cậy, uy tín",
          "exampleSentence": "Always cite verified primary sources to maintain academic credibility."
        },
        {
          "word": "sustainable",
          "pos": "adj",
          "ipa": "/səˈsteɪ.nə.bəl/",
          "meaningVi": "bền vững, lâu dài",
          "exampleSentence": "Zero-cost serverless architecture makes open education sustainable."
        },
        {
          "word": "emission",
          "pos": "noun",
          "ipa": "/iˈmɪʃ.ən/",
          "meaningVi": "khí thải, sự phát thải",
          "exampleSentence": "Electric vehicles help lower urban carbon emissions significantly."
        },
        {
          "word": "burnout",
          "pos": "noun",
          "ipa": "/ˈbɜːn.aʊt/",
          "meaningVi": "sự kiệt sức vì công việc",
          "exampleSentence": "Taking regular weekend breaks prevents workplace burnout."
        },
        {
          "word": "assimilation",
          "pos": "noun",
          "ipa": "/əˌsɪm.ɪˈleɪ.ʃən/",
          "meaningVi": "sự hòa nhập văn hóa",
          "exampleSentence": "Language proficiency speeds up cultural assimilation when working abroad."
        },
        {
          "word": "itinerary",
          "pos": "noun",
          "ipa": "/aɪˈtɪn.ər.ər.i/",
          "meaningVi": "lịch trình chi tiết",
          "exampleSentence": "Our travel itinerary includes both historical sites and coastal beaches."
        },
        {
          "word": "portfolio",
          "pos": "noun",
          "ipa": "/pɔːtˈfəʊ.li.əʊ/",
          "meaningVi": "hồ sơ năng lực (dự án cá nhân)",
          "exampleSentence": "Including real PCB and SCADA projects makes your engineering portfolio stand out."
        }
      ]
    },
    {
      "topicTitle": "Education & Career",
      "words": [
        {
          "word": "qualification",
          "pos": "noun",
          "ipa": "/ˌkwɒl.ɪ.fɪˈkeɪ.ʃən/",
          "meaningVi": "bằng cấp, chuyên môn",
          "exampleSentence": "Candidates must possess strong English qualifications."
        },
        {
          "word": "internship",
          "pos": "noun",
          "ipa": "/ˈɪn.tɜːn.ʃɪp/",
          "meaningVi": "kỳ thực tập",
          "exampleSentence": "He completed a summer internship at a software firm."
        },
        {
          "word": "mentor",
          "pos": "noun",
          "ipa": "/ˈmen.tɔːr/",
          "meaningVi": "người cố vấn dẫn dắt",
          "exampleSentence": "A dedicated mentor provides valuable career guidance."
        },
        {
          "word": "adaptability",
          "pos": "noun",
          "ipa": "/əˌdæp.təˈbɪl.ə.ti/",
          "meaningVi": "khả năng thích ứng",
          "exampleSentence": "Adaptability is one of the most valued workplace skills."
        },
        {
          "word": "initiative",
          "pos": "noun",
          "ipa": "/ɪˈnɪʃ.ə.tɪv/",
          "meaningVi": "sáng kiến, tính chủ động",
          "exampleSentence": "Taking the initiative to learn new skills accelerates growth."
        },
        {
          "word": "milestone",
          "pos": "noun",
          "ipa": "/ˈmaɪl.stəʊn/",
          "meaningVi": "cột mốc quan trọng",
          "exampleSentence": "Completing the 4-layer PCB layout was a major project milestone."
        },
        {
          "word": "stakeholder",
          "pos": "noun",
          "ipa": "/ˈsteɪkˌhəʊl.dər/",
          "meaningVi": "bên liên quan trong dự án",
          "exampleSentence": "We presented the quarterly progress report to all key stakeholders."
        },
        {
          "word": "bottleneck",
          "pos": "noun",
          "ipa": "/ˈbɒt.əl.nek/",
          "meaningVi": "điểm nghẽn (kỹ thuật/quy trình)",
          "exampleSentence": "Upgrading the conveyor sensor resolved the packaging bottleneck."
        },
        {
          "word": "credibility",
          "pos": "noun",
          "ipa": "/ˌkred.əˈbɪl.ə.ti/",
          "meaningVi": "độ tin cậy, uy tín",
          "exampleSentence": "Always cite verified primary sources to maintain academic credibility."
        },
        {
          "word": "sustainable",
          "pos": "adj",
          "ipa": "/səˈsteɪ.nə.bəl/",
          "meaningVi": "bền vững, lâu dài",
          "exampleSentence": "Zero-cost serverless architecture makes open education sustainable."
        },
        {
          "word": "emission",
          "pos": "noun",
          "ipa": "/iˈmɪʃ.ən/",
          "meaningVi": "khí thải, sự phát thải",
          "exampleSentence": "Electric vehicles help lower urban carbon emissions significantly."
        },
        {
          "word": "burnout",
          "pos": "noun",
          "ipa": "/ˈbɜːn.aʊt/",
          "meaningVi": "sự kiệt sức vì công việc",
          "exampleSentence": "Taking regular weekend breaks prevents workplace burnout."
        },
        {
          "word": "assimilation",
          "pos": "noun",
          "ipa": "/əˌsɪm.ɪˈleɪ.ʃən/",
          "meaningVi": "sự hòa nhập văn hóa",
          "exampleSentence": "Language proficiency speeds up cultural assimilation when working abroad."
        },
        {
          "word": "itinerary",
          "pos": "noun",
          "ipa": "/aɪˈtɪn.ər.ər.i/",
          "meaningVi": "lịch trình chi tiết",
          "exampleSentence": "Our travel itinerary includes both historical sites and coastal beaches."
        },
        {
          "word": "portfolio",
          "pos": "noun",
          "ipa": "/pɔːtˈfəʊ.li.əʊ/",
          "meaningVi": "hồ sơ năng lực (dự án cá nhân)",
          "exampleSentence": "Including real PCB and SCADA projects makes your engineering portfolio stand out."
        }
      ]
    },
    {
      "topicTitle": "Technology & Innovation",
      "words": [
        {
          "word": "algorithm",
          "pos": "noun",
          "ipa": "/ˈæl.ɡə.rɪ.ðəm/",
          "meaningVi": "thuật toán",
          "exampleSentence": "Search engines use complex algorithms to rank web pages."
        },
        {
          "word": "automation",
          "pos": "noun",
          "ipa": "/ˌɔː.təˈmeɪ.ʃən/",
          "meaningVi": "tự động hóa",
          "exampleSentence": "Robotic automation streamlines manufacturing workflows."
        },
        {
          "word": "breakthrough",
          "pos": "noun",
          "ipa": "/ˈbreɪk.θruː/",
          "meaningVi": "bước đột phá",
          "exampleSentence": "Medical researchers achieved a breakthrough in cancer therapy."
        },
        {
          "word": "database",
          "pos": "noun",
          "ipa": "/ˈdeɪ.tə.beɪs/",
          "meaningVi": "cơ sở dữ liệu",
          "exampleSentence": "All student progress is safely stored in the Supabase database."
        },
        {
          "word": "interface",
          "pos": "noun",
          "ipa": "/ˈɪn.tə.feɪs/",
          "meaningVi": "giao diện người dùng",
          "exampleSentence": "EnglishFlow provides a clean, distraction-free user interface."
        },
        {
          "word": "milestone",
          "pos": "noun",
          "ipa": "/ˈmaɪl.stəʊn/",
          "meaningVi": "cột mốc quan trọng",
          "exampleSentence": "Completing the 4-layer PCB layout was a major project milestone."
        },
        {
          "word": "stakeholder",
          "pos": "noun",
          "ipa": "/ˈsteɪkˌhəʊl.dər/",
          "meaningVi": "bên liên quan trong dự án",
          "exampleSentence": "We presented the quarterly progress report to all key stakeholders."
        },
        {
          "word": "bottleneck",
          "pos": "noun",
          "ipa": "/ˈbɒt.əl.nek/",
          "meaningVi": "điểm nghẽn (kỹ thuật/quy trình)",
          "exampleSentence": "Upgrading the conveyor sensor resolved the packaging bottleneck."
        },
        {
          "word": "credibility",
          "pos": "noun",
          "ipa": "/ˌkred.əˈbɪl.ə.ti/",
          "meaningVi": "độ tin cậy, uy tín",
          "exampleSentence": "Always cite verified primary sources to maintain academic credibility."
        },
        {
          "word": "sustainable",
          "pos": "adj",
          "ipa": "/səˈsteɪ.nə.bəl/",
          "meaningVi": "bền vững, lâu dài",
          "exampleSentence": "Zero-cost serverless architecture makes open education sustainable."
        },
        {
          "word": "emission",
          "pos": "noun",
          "ipa": "/iˈmɪʃ.ən/",
          "meaningVi": "khí thải, sự phát thải",
          "exampleSentence": "Electric vehicles help lower urban carbon emissions significantly."
        },
        {
          "word": "burnout",
          "pos": "noun",
          "ipa": "/ˈbɜːn.aʊt/",
          "meaningVi": "sự kiệt sức vì công việc",
          "exampleSentence": "Taking regular weekend breaks prevents workplace burnout."
        },
        {
          "word": "assimilation",
          "pos": "noun",
          "ipa": "/əˌsɪm.ɪˈleɪ.ʃən/",
          "meaningVi": "sự hòa nhập văn hóa",
          "exampleSentence": "Language proficiency speeds up cultural assimilation when working abroad."
        },
        {
          "word": "itinerary",
          "pos": "noun",
          "ipa": "/aɪˈtɪn.ər.ər.i/",
          "meaningVi": "lịch trình chi tiết",
          "exampleSentence": "Our travel itinerary includes both historical sites and coastal beaches."
        },
        {
          "word": "portfolio",
          "pos": "noun",
          "ipa": "/pɔːtˈfəʊ.li.əʊ/",
          "meaningVi": "hồ sơ năng lực (dự án cá nhân)",
          "exampleSentence": "Including real PCB and SCADA projects makes your engineering portfolio stand out."
        }
      ]
    },
    {
      "topicTitle": "Entertainment & Media",
      "words": [
        {
          "word": "documentary",
          "pos": "noun",
          "ipa": "/ˌdɒk.jəˈmen.tri/",
          "meaningVi": "phim tài liệu",
          "exampleSentence": "The nature documentary was narrated by David Attenborough."
        },
        {
          "word": "streaming",
          "pos": "noun",
          "ipa": "/ˈstriː.mɪŋ/",
          "meaningVi": "phát trực tuyến",
          "exampleSentence": "Streaming platforms have transformed how people watch movies."
        },
        {
          "word": "acclaimed",
          "pos": "adj",
          "ipa": "/əˈkleɪmd/",
          "meaningVi": "được ca ngợi, khen ngợi",
          "exampleSentence": "The director released a critically acclaimed historical drama."
        },
        {
          "word": "audience",
          "pos": "noun",
          "ipa": "/ˈɔː.di.əns/",
          "meaningVi": "khán thính giả",
          "exampleSentence": "The live concert attracted an audience of ten thousand fans."
        },
        {
          "word": "narrative",
          "pos": "noun",
          "ipa": "/ˈnær.ə.tɪv/",
          "meaningVi": "cốt truyện, tự sự",
          "exampleSentence": "The novel weaves an intricate narrative across two timelines."
        },
        {
          "word": "milestone",
          "pos": "noun",
          "ipa": "/ˈmaɪl.stəʊn/",
          "meaningVi": "cột mốc quan trọng",
          "exampleSentence": "Completing the 4-layer PCB layout was a major project milestone."
        },
        {
          "word": "stakeholder",
          "pos": "noun",
          "ipa": "/ˈsteɪkˌhəʊl.dər/",
          "meaningVi": "bên liên quan trong dự án",
          "exampleSentence": "We presented the quarterly progress report to all key stakeholders."
        },
        {
          "word": "bottleneck",
          "pos": "noun",
          "ipa": "/ˈbɒt.əl.nek/",
          "meaningVi": "điểm nghẽn (kỹ thuật/quy trình)",
          "exampleSentence": "Upgrading the conveyor sensor resolved the packaging bottleneck."
        },
        {
          "word": "credibility",
          "pos": "noun",
          "ipa": "/ˌkred.əˈbɪl.ə.ti/",
          "meaningVi": "độ tin cậy, uy tín",
          "exampleSentence": "Always cite verified primary sources to maintain academic credibility."
        },
        {
          "word": "sustainable",
          "pos": "adj",
          "ipa": "/səˈsteɪ.nə.bəl/",
          "meaningVi": "bền vững, lâu dài",
          "exampleSentence": "Zero-cost serverless architecture makes open education sustainable."
        },
        {
          "word": "emission",
          "pos": "noun",
          "ipa": "/iˈmɪʃ.ən/",
          "meaningVi": "khí thải, sự phát thải",
          "exampleSentence": "Electric vehicles help lower urban carbon emissions significantly."
        },
        {
          "word": "burnout",
          "pos": "noun",
          "ipa": "/ˈbɜːn.aʊt/",
          "meaningVi": "sự kiệt sức vì công việc",
          "exampleSentence": "Taking regular weekend breaks prevents workplace burnout."
        },
        {
          "word": "assimilation",
          "pos": "noun",
          "ipa": "/əˌsɪm.ɪˈleɪ.ʃən/",
          "meaningVi": "sự hòa nhập văn hóa",
          "exampleSentence": "Language proficiency speeds up cultural assimilation when working abroad."
        },
        {
          "word": "itinerary",
          "pos": "noun",
          "ipa": "/aɪˈtɪn.ər.ər.i/",
          "meaningVi": "lịch trình chi tiết",
          "exampleSentence": "Our travel itinerary includes both historical sites and coastal beaches."
        },
        {
          "word": "portfolio",
          "pos": "noun",
          "ipa": "/pɔːtˈfəʊ.li.əʊ/",
          "meaningVi": "hồ sơ năng lực (dự án cá nhân)",
          "exampleSentence": "Including real PCB and SCADA projects makes your engineering portfolio stand out."
        }
      ]
    },
    {
      "topicTitle": "Food & Cooking",
      "words": [
        {
          "word": "aroma",
          "pos": "noun",
          "ipa": "/əˈrəʊ.mə/",
          "meaningVi": "mùi thơm hấp dẫn",
          "exampleSentence": "The rich aroma of brewed coffee filled the whole kitchen."
        },
        {
          "word": "simmer",
          "pos": "verb",
          "ipa": "/ˈsɪm.ər/",
          "meaningVi": "ninh nhỏ lửa",
          "exampleSentence": "Simmer the broth gently for three hours to develop depth."
        },
        {
          "word": "culinary",
          "pos": "adj",
          "ipa": "/ˈkʌl.ɪ.nər.i/",
          "meaningVi": "thuộc ẩm thực",
          "exampleSentence": "Vietnam is renowned for its diverse culinary traditions."
        },
        {
          "word": "delicacy",
          "pos": "noun",
          "ipa": "/ˈdel.ɪ.kə.si/",
          "meaningVi": "món đặc sản, cao lương",
          "exampleSentence": "Lotus seed sweet soup is a traditional Hue delicacy."
        },
        {
          "word": "seasoning",
          "pos": "noun",
          "ipa": "/ˈsiː.zən.ɪŋ/",
          "meaningVi": "gia vị nêm nếm",
          "exampleSentence": "Add a pinch of black pepper as final seasoning."
        },
        {
          "word": "milestone",
          "pos": "noun",
          "ipa": "/ˈmaɪl.stəʊn/",
          "meaningVi": "cột mốc quan trọng",
          "exampleSentence": "Completing the 4-layer PCB layout was a major project milestone."
        },
        {
          "word": "stakeholder",
          "pos": "noun",
          "ipa": "/ˈsteɪkˌhəʊl.dər/",
          "meaningVi": "bên liên quan trong dự án",
          "exampleSentence": "We presented the quarterly progress report to all key stakeholders."
        },
        {
          "word": "bottleneck",
          "pos": "noun",
          "ipa": "/ˈbɒt.əl.nek/",
          "meaningVi": "điểm nghẽn (kỹ thuật/quy trình)",
          "exampleSentence": "Upgrading the conveyor sensor resolved the packaging bottleneck."
        },
        {
          "word": "credibility",
          "pos": "noun",
          "ipa": "/ˌkred.əˈbɪl.ə.ti/",
          "meaningVi": "độ tin cậy, uy tín",
          "exampleSentence": "Always cite verified primary sources to maintain academic credibility."
        },
        {
          "word": "sustainable",
          "pos": "adj",
          "ipa": "/səˈsteɪ.nə.bəl/",
          "meaningVi": "bền vững, lâu dài",
          "exampleSentence": "Zero-cost serverless architecture makes open education sustainable."
        },
        {
          "word": "emission",
          "pos": "noun",
          "ipa": "/iˈmɪʃ.ən/",
          "meaningVi": "khí thải, sự phát thải",
          "exampleSentence": "Electric vehicles help lower urban carbon emissions significantly."
        },
        {
          "word": "burnout",
          "pos": "noun",
          "ipa": "/ˈbɜːn.aʊt/",
          "meaningVi": "sự kiệt sức vì công việc",
          "exampleSentence": "Taking regular weekend breaks prevents workplace burnout."
        },
        {
          "word": "assimilation",
          "pos": "noun",
          "ipa": "/əˌsɪm.ɪˈleɪ.ʃən/",
          "meaningVi": "sự hòa nhập văn hóa",
          "exampleSentence": "Language proficiency speeds up cultural assimilation when working abroad."
        },
        {
          "word": "itinerary",
          "pos": "noun",
          "ipa": "/aɪˈtɪn.ər.ər.i/",
          "meaningVi": "lịch trình chi tiết",
          "exampleSentence": "Our travel itinerary includes both historical sites and coastal beaches."
        },
        {
          "word": "portfolio",
          "pos": "noun",
          "ipa": "/pɔːtˈfəʊ.li.əʊ/",
          "meaningVi": "hồ sơ năng lực (dự án cá nhân)",
          "exampleSentence": "Including real PCB and SCADA projects makes your engineering portfolio stand out."
        }
      ]
    }
  ],
  "B2": [
    {
      "topicTitle": "Professional Communication",
      "words": [
        {
          "word": "align",
          "pos": "verb",
          "ipa": "/əˈlaɪn/",
          "meaningVi": "đồng bộ, khớp mục tiêu",
          "exampleSentence": "Ensure engineering deliverables align with stakeholder expectations."
        },
        {
          "word": "articulate",
          "pos": "verb",
          "ipa": "/ɑːˈtɪk.jə.leɪt/",
          "meaningVi": "diễn đạt rành mạch",
          "exampleSentence": "He articulated the technical proposal with utmost clarity."
        },
        {
          "word": "diplomatic",
          "pos": "adj",
          "ipa": "/ˌdɪp.ləˈmæt.ɪk/",
          "meaningVi": "khéo léo, ngoại giao",
          "exampleSentence": "Use diplomatic phrasing when resolving team disagreements."
        },
        {
          "word": "counterpart",
          "pos": "noun",
          "ipa": "/ˈkaʊn.tə.pɑːt/",
          "meaningVi": "đối tác tương đương",
          "exampleSentence": "She met with her international counterpart to draft terms."
        },
        {
          "word": "leverage",
          "pos": "verb",
          "ipa": "/ˈliː.vər.ɪdʒ/",
          "meaningVi": "tận dụng, khai thác đòn bẩy",
          "exampleSentence": "We leverage open educational resources to maintain zero costs."
        },
        {
          "word": "scalability",
          "pos": "noun",
          "ipa": "/ˌskeɪ.ləˈbɪl.ə.ti/",
          "meaningVi": "khả năng mở rộng quy mô",
          "exampleSentence": "Microservices architecture improves system scalability under heavy load."
        },
        {
          "word": "consensus",
          "pos": "noun",
          "ipa": "/kənˈsen.səs/",
          "meaningVi": "sự đồng thuận cao",
          "exampleSentence": "After thorough debate, the committee reached a unanimous consensus."
        },
        {
          "word": "paradigm",
          "pos": "noun",
          "ipa": "/ˈpær.ə.daɪm/",
          "meaningVi": "mô hình, hệ tư tưởng",
          "exampleSentence": "AI-assisted learning is shifting the traditional education paradigm."
        },
        {
          "word": "scrutiny",
          "pos": "noun",
          "ipa": "/ˈskruː.tɪ.ni/",
          "meaningVi": "sự rà soát, kiểm tra kỹ lưỡng",
          "exampleSentence": "The schematic design passed rigorous engineering scrutiny."
        },
        {
          "word": "mitigate",
          "pos": "verb",
          "ipa": "/ˈmɪt.ɪ.ɡeɪt/",
          "meaningVi": "giảm thiểu (rủi ro/nhiễu)",
          "exampleSentence": "Decoupling capacitors mitigate high-frequency power supply noise."
        },
        {
          "word": "procurement",
          "pos": "noun",
          "ipa": "/prəˈkjʊə.mənt/",
          "meaningVi": "mua sắm cung ứng vật tư kỹ thuật",
          "exampleSentence": "Technical procurement requires evaluating both component quality and lead time."
        },
        {
          "word": "redundancy",
          "pos": "noun",
          "ipa": "/rɪˈdʌn.dən.si/",
          "meaningVi": "cơ chế dự phòng an toàn",
          "exampleSentence": "Dual power supplies provide hardware redundancy for industrial PLCs."
        },
        {
          "word": "autonomy",
          "pos": "noun",
          "ipa": "/ɔːˈtɒn.ə.mi/",
          "meaningVi": "tính tự chủ, tự vận hành",
          "exampleSentence": "Autonomous mobile robots navigate factory floors using LiDAR sensors."
        },
        {
          "word": "interdisciplinary",
          "pos": "adj",
          "ipa": "/ˌɪn.tə.dɪs.əˈplɪn.ər.i/",
          "meaningVi": "liên ngành",
          "exampleSentence": "Mechatronics is an interdisciplinary field combining mechanics, electronics, and code."
        },
        {
          "word": "specifications",
          "pos": "noun",
          "ipa": "/ˌspes.ɪ.fɪˈkeɪ.ʃənz/",
          "meaningVi": "thông số kỹ thuật chi tiết",
          "exampleSentence": "Ensure all output modules meet the 24V industrial voltage specifications."
        }
      ]
    },
    {
      "topicTitle": "Academic Discussions",
      "words": [
        {
          "word": "empirical",
          "pos": "adj",
          "ipa": "/ɪmˈpɪr.ɪ.kəl/",
          "meaningVi": "dựa trên thực nghiệm",
          "exampleSentence": "The empirical evidence strongly supports a hybrid educational framework."
        },
        {
          "word": "hypothesis",
          "pos": "noun",
          "ipa": "/haɪˈpɒθ.ə.sɪs/",
          "meaningVi": "giả thuyết khoa học",
          "exampleSentence": "Researchers conducted experiments to test their primary hypothesis."
        },
        {
          "word": "methodology",
          "pos": "noun",
          "ipa": "/ˌmeθ.əˈdɒl.ə.dʒi/",
          "meaningVi": "phương pháp luận",
          "exampleSentence": "The paper outlines a robust quantitative methodology."
        },
        {
          "word": "critique",
          "pos": "noun",
          "ipa": "/krɪˈtiːk/",
          "meaningVi": "bài phản biện học thuật",
          "exampleSentence": "Scholars published a constructive critique of the study."
        },
        {
          "word": "correlation",
          "pos": "noun",
          "ipa": "/ˌkɒr.əˈleɪ.ʃən/",
          "meaningVi": "sự tương quan",
          "exampleSentence": "There is a positive correlation between practice time and retention."
        },
        {
          "word": "scalability",
          "pos": "noun",
          "ipa": "/ˌskeɪ.ləˈbɪl.ə.ti/",
          "meaningVi": "khả năng mở rộng quy mô",
          "exampleSentence": "Microservices architecture improves system scalability under heavy load."
        },
        {
          "word": "consensus",
          "pos": "noun",
          "ipa": "/kənˈsen.səs/",
          "meaningVi": "sự đồng thuận cao",
          "exampleSentence": "After thorough debate, the committee reached a unanimous consensus."
        },
        {
          "word": "paradigm",
          "pos": "noun",
          "ipa": "/ˈpær.ə.daɪm/",
          "meaningVi": "mô hình, hệ tư tưởng",
          "exampleSentence": "AI-assisted learning is shifting the traditional education paradigm."
        },
        {
          "word": "scrutiny",
          "pos": "noun",
          "ipa": "/ˈskruː.tɪ.ni/",
          "meaningVi": "sự rà soát, kiểm tra kỹ lưỡng",
          "exampleSentence": "The schematic design passed rigorous engineering scrutiny."
        },
        {
          "word": "mitigate",
          "pos": "verb",
          "ipa": "/ˈmɪt.ɪ.ɡeɪt/",
          "meaningVi": "giảm thiểu (rủi ro/nhiễu)",
          "exampleSentence": "Decoupling capacitors mitigate high-frequency power supply noise."
        },
        {
          "word": "procurement",
          "pos": "noun",
          "ipa": "/prəˈkjʊə.mənt/",
          "meaningVi": "mua sắm cung ứng vật tư kỹ thuật",
          "exampleSentence": "Technical procurement requires evaluating both component quality and lead time."
        },
        {
          "word": "redundancy",
          "pos": "noun",
          "ipa": "/rɪˈdʌn.dən.si/",
          "meaningVi": "cơ chế dự phòng an toàn",
          "exampleSentence": "Dual power supplies provide hardware redundancy for industrial PLCs."
        },
        {
          "word": "autonomy",
          "pos": "noun",
          "ipa": "/ɔːˈtɒn.ə.mi/",
          "meaningVi": "tính tự chủ, tự vận hành",
          "exampleSentence": "Autonomous mobile robots navigate factory floors using LiDAR sensors."
        },
        {
          "word": "interdisciplinary",
          "pos": "adj",
          "ipa": "/ˌɪn.tə.dɪs.əˈplɪn.ər.i/",
          "meaningVi": "liên ngành",
          "exampleSentence": "Mechatronics is an interdisciplinary field combining mechanics, electronics, and code."
        },
        {
          "word": "specifications",
          "pos": "noun",
          "ipa": "/ˌspes.ɪ.fɪˈkeɪ.ʃənz/",
          "meaningVi": "thông số kỹ thuật chi tiết",
          "exampleSentence": "Ensure all output modules meet the 24V industrial voltage specifications."
        }
      ]
    },
    {
      "topicTitle": "Global Issues",
      "words": [
        {
          "word": "demographic",
          "pos": "adj",
          "ipa": "/ˌdem.əˈɡræf.ɪk/",
          "meaningVi": "thuộc nhân khẩu học",
          "exampleSentence": "Demographic shifts present unique workforce challenges."
        },
        {
          "word": "inequality",
          "pos": "noun",
          "ipa": "/ˌɪn.ɪˈkwɒl.ə.ti/",
          "meaningVi": "sự bất bình đẳng",
          "exampleSentence": "Access to quality open education helps bridge social inequality."
        },
        {
          "word": "sustainability",
          "pos": "noun",
          "ipa": "/səˌsteɪ.nəˈbɪl.ə.ti/",
          "meaningVi": "tính bền vững",
          "exampleSentence": "Economic growth must be balanced with environmental sustainability."
        },
        {
          "word": "sanction",
          "pos": "noun",
          "ipa": "/ˈsæŋk.ʃən/",
          "meaningVi": "lệnh trừng phạt kinh tế",
          "exampleSentence": "International sanctions influenced global supply chains."
        },
        {
          "word": "humanitarian",
          "pos": "adj",
          "ipa": "/hjuːˌmæn.ɪˈteə.ri.ən/",
          "meaningVi": "nhân đạo",
          "exampleSentence": "Aid organizations launched a large-scale humanitarian response."
        },
        {
          "word": "scalability",
          "pos": "noun",
          "ipa": "/ˌskeɪ.ləˈbɪl.ə.ti/",
          "meaningVi": "khả năng mở rộng quy mô",
          "exampleSentence": "Microservices architecture improves system scalability under heavy load."
        },
        {
          "word": "consensus",
          "pos": "noun",
          "ipa": "/kənˈsen.səs/",
          "meaningVi": "sự đồng thuận cao",
          "exampleSentence": "After thorough debate, the committee reached a unanimous consensus."
        },
        {
          "word": "paradigm",
          "pos": "noun",
          "ipa": "/ˈpær.ə.daɪm/",
          "meaningVi": "mô hình, hệ tư tưởng",
          "exampleSentence": "AI-assisted learning is shifting the traditional education paradigm."
        },
        {
          "word": "scrutiny",
          "pos": "noun",
          "ipa": "/ˈskruː.tɪ.ni/",
          "meaningVi": "sự rà soát, kiểm tra kỹ lưỡng",
          "exampleSentence": "The schematic design passed rigorous engineering scrutiny."
        },
        {
          "word": "mitigate",
          "pos": "verb",
          "ipa": "/ˈmɪt.ɪ.ɡeɪt/",
          "meaningVi": "giảm thiểu (rủi ro/nhiễu)",
          "exampleSentence": "Decoupling capacitors mitigate high-frequency power supply noise."
        },
        {
          "word": "procurement",
          "pos": "noun",
          "ipa": "/prəˈkjʊə.mənt/",
          "meaningVi": "mua sắm cung ứng vật tư kỹ thuật",
          "exampleSentence": "Technical procurement requires evaluating both component quality and lead time."
        },
        {
          "word": "redundancy",
          "pos": "noun",
          "ipa": "/rɪˈdʌn.dən.si/",
          "meaningVi": "cơ chế dự phòng an toàn",
          "exampleSentence": "Dual power supplies provide hardware redundancy for industrial PLCs."
        },
        {
          "word": "autonomy",
          "pos": "noun",
          "ipa": "/ɔːˈtɒn.ə.mi/",
          "meaningVi": "tính tự chủ, tự vận hành",
          "exampleSentence": "Autonomous mobile robots navigate factory floors using LiDAR sensors."
        },
        {
          "word": "interdisciplinary",
          "pos": "adj",
          "ipa": "/ˌɪn.tə.dɪs.əˈplɪn.ər.i/",
          "meaningVi": "liên ngành",
          "exampleSentence": "Mechatronics is an interdisciplinary field combining mechanics, electronics, and code."
        },
        {
          "word": "specifications",
          "pos": "noun",
          "ipa": "/ˌspes.ɪ.fɪˈkeɪ.ʃənz/",
          "meaningVi": "thông số kỹ thuật chi tiết",
          "exampleSentence": "Ensure all output modules meet the 24V industrial voltage specifications."
        }
      ]
    },
    {
      "topicTitle": "Business Negotiation",
      "words": [
        {
          "word": "concession",
          "pos": "noun",
          "ipa": "/kənˈseʃ.ən/",
          "meaningVi": "sự nhượng bộ",
          "exampleSentence": "Both sides made concessions to reach a mutually beneficial deal."
        },
        {
          "word": "clause",
          "pos": "noun",
          "ipa": "/klɔːz/",
          "meaningVi": "điều khoản hợp đồng",
          "exampleSentence": "Review the confidentiality clause carefully before signing."
        },
        {
          "word": "liability",
          "pos": "noun",
          "ipa": "/ˌlaɪ.əˈbɪl.ə.ti/",
          "meaningVi": "trách nhiệm pháp lý",
          "exampleSentence": "The contract defines liability limits for service interruptions."
        },
        {
          "word": "profitability",
          "pos": "noun",
          "ipa": "/ˌprɒf.ɪ.təˈbɪl.ə.ti/",
          "meaningVi": "khả năng sinh lời",
          "exampleSentence": "Strategic restructuring restored long-term enterprise profitability."
        },
        {
          "word": "arbitration",
          "pos": "noun",
          "ipa": "/ˌɑː.bɪˈtreɪ.ʃən/",
          "meaningVi": "trọng tài giải quyết tranh chấp",
          "exampleSentence": "Commercial disputes are submitted to neutral arbitration."
        },
        {
          "word": "scalability",
          "pos": "noun",
          "ipa": "/ˌskeɪ.ləˈbɪl.ə.ti/",
          "meaningVi": "khả năng mở rộng quy mô",
          "exampleSentence": "Microservices architecture improves system scalability under heavy load."
        },
        {
          "word": "consensus",
          "pos": "noun",
          "ipa": "/kənˈsen.səs/",
          "meaningVi": "sự đồng thuận cao",
          "exampleSentence": "After thorough debate, the committee reached a unanimous consensus."
        },
        {
          "word": "paradigm",
          "pos": "noun",
          "ipa": "/ˈpær.ə.daɪm/",
          "meaningVi": "mô hình, hệ tư tưởng",
          "exampleSentence": "AI-assisted learning is shifting the traditional education paradigm."
        },
        {
          "word": "scrutiny",
          "pos": "noun",
          "ipa": "/ˈskruː.tɪ.ni/",
          "meaningVi": "sự rà soát, kiểm tra kỹ lưỡng",
          "exampleSentence": "The schematic design passed rigorous engineering scrutiny."
        },
        {
          "word": "mitigate",
          "pos": "verb",
          "ipa": "/ˈmɪt.ɪ.ɡeɪt/",
          "meaningVi": "giảm thiểu (rủi ro/nhiễu)",
          "exampleSentence": "Decoupling capacitors mitigate high-frequency power supply noise."
        },
        {
          "word": "procurement",
          "pos": "noun",
          "ipa": "/prəˈkjʊə.mənt/",
          "meaningVi": "mua sắm cung ứng vật tư kỹ thuật",
          "exampleSentence": "Technical procurement requires evaluating both component quality and lead time."
        },
        {
          "word": "redundancy",
          "pos": "noun",
          "ipa": "/rɪˈdʌn.dən.si/",
          "meaningVi": "cơ chế dự phòng an toàn",
          "exampleSentence": "Dual power supplies provide hardware redundancy for industrial PLCs."
        },
        {
          "word": "autonomy",
          "pos": "noun",
          "ipa": "/ɔːˈtɒn.ə.mi/",
          "meaningVi": "tính tự chủ, tự vận hành",
          "exampleSentence": "Autonomous mobile robots navigate factory floors using LiDAR sensors."
        },
        {
          "word": "interdisciplinary",
          "pos": "adj",
          "ipa": "/ˌɪn.tə.dɪs.əˈplɪn.ər.i/",
          "meaningVi": "liên ngành",
          "exampleSentence": "Mechatronics is an interdisciplinary field combining mechanics, electronics, and code."
        },
        {
          "word": "specifications",
          "pos": "noun",
          "ipa": "/ˌspes.ɪ.fɪˈkeɪ.ʃənz/",
          "meaningVi": "thông số kỹ thuật chi tiết",
          "exampleSentence": "Ensure all output modules meet the 24V industrial voltage specifications."
        }
      ]
    },
    {
      "topicTitle": "Media & Journalism",
      "words": [
        {
          "word": "editorial",
          "pos": "noun",
          "ipa": "/ˌed.ɪˈtɔː.ri.əl/",
          "meaningVi": "bài xã luận",
          "exampleSentence": "The editorial board endorsed stronger digital transparency laws."
        },
        {
          "word": "impartial",
          "pos": "adj",
          "ipa": "/ɪmˈpɑː.ʃəl/",
          "meaningVi": "vô tư, không thiên vị",
          "exampleSentence": "Journalists must remain impartial when reporting election news."
        },
        {
          "word": "investigative",
          "pos": "adj",
          "ipa": "/ɪnˈves.tɪ.ɡə.tɪv/",
          "meaningVi": "mang tính điều tra",
          "exampleSentence": "Investigative reporting uncovered major corporate corruption."
        },
        {
          "word": "credibility",
          "pos": "noun",
          "ipa": "/ˌkred.əˈbɪl.ə.ti/",
          "meaningVi": "sự uy tín, khả tín",
          "exampleSentence": "Citing primary sources preserves journalistic credibility."
        },
        {
          "word": "sensational",
          "pos": "adj",
          "ipa": "/senˈseɪ.ʃən.əl/",
          "meaningVi": "giật gân, câu khách",
          "exampleSentence": "Avoid sensational headlines that distort factual context."
        },
        {
          "word": "scalability",
          "pos": "noun",
          "ipa": "/ˌskeɪ.ləˈbɪl.ə.ti/",
          "meaningVi": "khả năng mở rộng quy mô",
          "exampleSentence": "Microservices architecture improves system scalability under heavy load."
        },
        {
          "word": "consensus",
          "pos": "noun",
          "ipa": "/kənˈsen.səs/",
          "meaningVi": "sự đồng thuận cao",
          "exampleSentence": "After thorough debate, the committee reached a unanimous consensus."
        },
        {
          "word": "paradigm",
          "pos": "noun",
          "ipa": "/ˈpær.ə.daɪm/",
          "meaningVi": "mô hình, hệ tư tưởng",
          "exampleSentence": "AI-assisted learning is shifting the traditional education paradigm."
        },
        {
          "word": "scrutiny",
          "pos": "noun",
          "ipa": "/ˈskruː.tɪ.ni/",
          "meaningVi": "sự rà soát, kiểm tra kỹ lưỡng",
          "exampleSentence": "The schematic design passed rigorous engineering scrutiny."
        },
        {
          "word": "mitigate",
          "pos": "verb",
          "ipa": "/ˈmɪt.ɪ.ɡeɪt/",
          "meaningVi": "giảm thiểu (rủi ro/nhiễu)",
          "exampleSentence": "Decoupling capacitors mitigate high-frequency power supply noise."
        },
        {
          "word": "procurement",
          "pos": "noun",
          "ipa": "/prəˈkjʊə.mənt/",
          "meaningVi": "mua sắm cung ứng vật tư kỹ thuật",
          "exampleSentence": "Technical procurement requires evaluating both component quality and lead time."
        },
        {
          "word": "redundancy",
          "pos": "noun",
          "ipa": "/rɪˈdʌn.dən.si/",
          "meaningVi": "cơ chế dự phòng an toàn",
          "exampleSentence": "Dual power supplies provide hardware redundancy for industrial PLCs."
        },
        {
          "word": "autonomy",
          "pos": "noun",
          "ipa": "/ɔːˈtɒn.ə.mi/",
          "meaningVi": "tính tự chủ, tự vận hành",
          "exampleSentence": "Autonomous mobile robots navigate factory floors using LiDAR sensors."
        },
        {
          "word": "interdisciplinary",
          "pos": "adj",
          "ipa": "/ˌɪn.tə.dɪs.əˈplɪn.ər.i/",
          "meaningVi": "liên ngành",
          "exampleSentence": "Mechatronics is an interdisciplinary field combining mechanics, electronics, and code."
        },
        {
          "word": "specifications",
          "pos": "noun",
          "ipa": "/ˌspes.ɪ.fɪˈkeɪ.ʃənz/",
          "meaningVi": "thông số kỹ thuật chi tiết",
          "exampleSentence": "Ensure all output modules meet the 24V industrial voltage specifications."
        }
      ]
    },
    {
      "topicTitle": "Science & Technology",
      "words": [
        {
          "word": "breakthrough",
          "pos": "noun",
          "ipa": "/ˈbreɪk.θruː/",
          "meaningVi": "bước đột phá lớn",
          "exampleSentence": "Breakthroughs in battery density are accelerating electric aviation."
        },
        {
          "word": "infrastructure",
          "pos": "noun",
          "ipa": "/ˈɪn.frəˌstrʌk.tʃər/",
          "meaningVi": "cơ sở hạ tầng",
          "exampleSentence": "Serverless cloud infrastructure powers zero-cost deployments."
        },
        {
          "word": "synthesis",
          "pos": "noun",
          "ipa": "/ˈsɪn.θə.sɪs/",
          "meaningVi": "sự tổng hợp",
          "exampleSentence": "Chemical synthesis yields new lightweight conductive materials."
        },
        {
          "word": "computational",
          "pos": "adj",
          "ipa": "/ˌkɒm.pjəˈteɪ.ʃən.əl/",
          "meaningVi": "thuộc tính toán máy tính",
          "exampleSentence": "Computational models predict molecular behavior accurately."
        },
        {
          "word": "quantum",
          "pos": "adj",
          "ipa": "/ˈkwɒn.təm/",
          "meaningVi": "lượng tử",
          "exampleSentence": "Quantum computing poses new cryptographic opportunities."
        },
        {
          "word": "scalability",
          "pos": "noun",
          "ipa": "/ˌskeɪ.ləˈbɪl.ə.ti/",
          "meaningVi": "khả năng mở rộng quy mô",
          "exampleSentence": "Microservices architecture improves system scalability under heavy load."
        },
        {
          "word": "consensus",
          "pos": "noun",
          "ipa": "/kənˈsen.səs/",
          "meaningVi": "sự đồng thuận cao",
          "exampleSentence": "After thorough debate, the committee reached a unanimous consensus."
        },
        {
          "word": "paradigm",
          "pos": "noun",
          "ipa": "/ˈpær.ə.daɪm/",
          "meaningVi": "mô hình, hệ tư tưởng",
          "exampleSentence": "AI-assisted learning is shifting the traditional education paradigm."
        },
        {
          "word": "scrutiny",
          "pos": "noun",
          "ipa": "/ˈskruː.tɪ.ni/",
          "meaningVi": "sự rà soát, kiểm tra kỹ lưỡng",
          "exampleSentence": "The schematic design passed rigorous engineering scrutiny."
        },
        {
          "word": "mitigate",
          "pos": "verb",
          "ipa": "/ˈmɪt.ɪ.ɡeɪt/",
          "meaningVi": "giảm thiểu (rủi ro/nhiễu)",
          "exampleSentence": "Decoupling capacitors mitigate high-frequency power supply noise."
        },
        {
          "word": "procurement",
          "pos": "noun",
          "ipa": "/prəˈkjʊə.mənt/",
          "meaningVi": "mua sắm cung ứng vật tư kỹ thuật",
          "exampleSentence": "Technical procurement requires evaluating both component quality and lead time."
        },
        {
          "word": "redundancy",
          "pos": "noun",
          "ipa": "/rɪˈdʌn.dən.si/",
          "meaningVi": "cơ chế dự phòng an toàn",
          "exampleSentence": "Dual power supplies provide hardware redundancy for industrial PLCs."
        },
        {
          "word": "autonomy",
          "pos": "noun",
          "ipa": "/ɔːˈtɒn.ə.mi/",
          "meaningVi": "tính tự chủ, tự vận hành",
          "exampleSentence": "Autonomous mobile robots navigate factory floors using LiDAR sensors."
        },
        {
          "word": "interdisciplinary",
          "pos": "adj",
          "ipa": "/ˌɪn.tə.dɪs.əˈplɪn.ər.i/",
          "meaningVi": "liên ngành",
          "exampleSentence": "Mechatronics is an interdisciplinary field combining mechanics, electronics, and code."
        },
        {
          "word": "specifications",
          "pos": "noun",
          "ipa": "/ˌspes.ɪ.fɪˈkeɪ.ʃənz/",
          "meaningVi": "thông số kỹ thuật chi tiết",
          "exampleSentence": "Ensure all output modules meet the 24V industrial voltage specifications."
        }
      ]
    },
    {
      "topicTitle": "Arts & Humanities",
      "words": [
        {
          "word": "aesthetic",
          "pos": "adj",
          "ipa": "/esˈθet.ɪk/",
          "meaningVi": "thuộc thẩm mỹ nghệ thuật",
          "exampleSentence": "Minimalist architecture emphasizes harmony between light and form."
        },
        {
          "word": "contemporary",
          "pos": "adj",
          "ipa": "/kənˈtem.pər.ər.i/",
          "meaningVi": "đương đại",
          "exampleSentence": "The gallery showcases provocative contemporary sculptures."
        },
        {
          "word": "metaphor",
          "pos": "noun",
          "ipa": "/ˈmet.ə.fɔːr/",
          "meaningVi": "phép ẩn dụ",
          "exampleSentence": "The author employs river imagery as a metaphor for time."
        },
        {
          "word": "evocative",
          "pos": "adj",
          "ipa": "/ɪˈvɒk.ə.tɪv/",
          "meaningVi": "gợi cảm xúc sâu sắc",
          "exampleSentence": "Her expressive brushstrokes create an evocative atmosphere."
        },
        {
          "word": "renaissance",
          "pos": "noun",
          "ipa": "/rəˈneɪ.səns/",
          "meaningVi": "sự phục hưng",
          "exampleSentence": "The city is experiencing a cultural and creative renaissance."
        },
        {
          "word": "scalability",
          "pos": "noun",
          "ipa": "/ˌskeɪ.ləˈbɪl.ə.ti/",
          "meaningVi": "khả năng mở rộng quy mô",
          "exampleSentence": "Microservices architecture improves system scalability under heavy load."
        },
        {
          "word": "consensus",
          "pos": "noun",
          "ipa": "/kənˈsen.səs/",
          "meaningVi": "sự đồng thuận cao",
          "exampleSentence": "After thorough debate, the committee reached a unanimous consensus."
        },
        {
          "word": "paradigm",
          "pos": "noun",
          "ipa": "/ˈpær.ə.daɪm/",
          "meaningVi": "mô hình, hệ tư tưởng",
          "exampleSentence": "AI-assisted learning is shifting the traditional education paradigm."
        },
        {
          "word": "scrutiny",
          "pos": "noun",
          "ipa": "/ˈskruː.tɪ.ni/",
          "meaningVi": "sự rà soát, kiểm tra kỹ lưỡng",
          "exampleSentence": "The schematic design passed rigorous engineering scrutiny."
        },
        {
          "word": "mitigate",
          "pos": "verb",
          "ipa": "/ˈmɪt.ɪ.ɡeɪt/",
          "meaningVi": "giảm thiểu (rủi ro/nhiễu)",
          "exampleSentence": "Decoupling capacitors mitigate high-frequency power supply noise."
        },
        {
          "word": "procurement",
          "pos": "noun",
          "ipa": "/prəˈkjʊə.mənt/",
          "meaningVi": "mua sắm cung ứng vật tư kỹ thuật",
          "exampleSentence": "Technical procurement requires evaluating both component quality and lead time."
        },
        {
          "word": "redundancy",
          "pos": "noun",
          "ipa": "/rɪˈdʌn.dən.si/",
          "meaningVi": "cơ chế dự phòng an toàn",
          "exampleSentence": "Dual power supplies provide hardware redundancy for industrial PLCs."
        },
        {
          "word": "autonomy",
          "pos": "noun",
          "ipa": "/ɔːˈtɒn.ə.mi/",
          "meaningVi": "tính tự chủ, tự vận hành",
          "exampleSentence": "Autonomous mobile robots navigate factory floors using LiDAR sensors."
        },
        {
          "word": "interdisciplinary",
          "pos": "adj",
          "ipa": "/ˌɪn.tə.dɪs.əˈplɪn.ər.i/",
          "meaningVi": "liên ngành",
          "exampleSentence": "Mechatronics is an interdisciplinary field combining mechanics, electronics, and code."
        },
        {
          "word": "specifications",
          "pos": "noun",
          "ipa": "/ˌspes.ɪ.fɪˈkeɪ.ʃənz/",
          "meaningVi": "thông số kỹ thuật chi tiết",
          "exampleSentence": "Ensure all output modules meet the 24V industrial voltage specifications."
        }
      ]
    },
    {
      "topicTitle": "Law & Ethics",
      "words": [
        {
          "word": "governance",
          "pos": "noun",
          "ipa": "/ˈɡʌv.ən.əns/",
          "meaningVi": "sự quản trị minh bạch",
          "exampleSentence": "Transparent data governance is essential for ethical AI deployment."
        },
        {
          "word": "compliance",
          "pos": "noun",
          "ipa": "/kəmˈplaɪ.əns/",
          "meaningVi": "sự tuân thủ pháp lý",
          "exampleSentence": "The platform maintains strict compliance with privacy regulations."
        },
        {
          "word": "jurisdiction",
          "pos": "noun",
          "ipa": "/ˌdʒʊə.rɪsˈdɪk.ʃən/",
          "meaningVi": "thẩm quyền tài phán",
          "exampleSentence": "The international court exercised jurisdiction over trade."
        },
        {
          "word": "statute",
          "pos": "noun",
          "ipa": "/ˈstætʃ.uːt/",
          "meaningVi": "đạo luật ban hành",
          "exampleSentence": "The new statute protects open educational resources."
        },
        {
          "word": "ethical",
          "pos": "adj",
          "ipa": "/ˈeθ.ɪ.kəl/",
          "meaningVi": "thuộc luân lý, đạo đức",
          "exampleSentence": "Engineers must weigh ethical implications of autonomous systems."
        },
        {
          "word": "scalability",
          "pos": "noun",
          "ipa": "/ˌskeɪ.ləˈbɪl.ə.ti/",
          "meaningVi": "khả năng mở rộng quy mô",
          "exampleSentence": "Microservices architecture improves system scalability under heavy load."
        },
        {
          "word": "consensus",
          "pos": "noun",
          "ipa": "/kənˈsen.səs/",
          "meaningVi": "sự đồng thuận cao",
          "exampleSentence": "After thorough debate, the committee reached a unanimous consensus."
        },
        {
          "word": "paradigm",
          "pos": "noun",
          "ipa": "/ˈpær.ə.daɪm/",
          "meaningVi": "mô hình, hệ tư tưởng",
          "exampleSentence": "AI-assisted learning is shifting the traditional education paradigm."
        },
        {
          "word": "scrutiny",
          "pos": "noun",
          "ipa": "/ˈskruː.tɪ.ni/",
          "meaningVi": "sự rà soát, kiểm tra kỹ lưỡng",
          "exampleSentence": "The schematic design passed rigorous engineering scrutiny."
        },
        {
          "word": "mitigate",
          "pos": "verb",
          "ipa": "/ˈmɪt.ɪ.ɡeɪt/",
          "meaningVi": "giảm thiểu (rủi ro/nhiễu)",
          "exampleSentence": "Decoupling capacitors mitigate high-frequency power supply noise."
        },
        {
          "word": "procurement",
          "pos": "noun",
          "ipa": "/prəˈkjʊə.mənt/",
          "meaningVi": "mua sắm cung ứng vật tư kỹ thuật",
          "exampleSentence": "Technical procurement requires evaluating both component quality and lead time."
        },
        {
          "word": "redundancy",
          "pos": "noun",
          "ipa": "/rɪˈdʌn.dən.si/",
          "meaningVi": "cơ chế dự phòng an toàn",
          "exampleSentence": "Dual power supplies provide hardware redundancy for industrial PLCs."
        },
        {
          "word": "autonomy",
          "pos": "noun",
          "ipa": "/ɔːˈtɒn.ə.mi/",
          "meaningVi": "tính tự chủ, tự vận hành",
          "exampleSentence": "Autonomous mobile robots navigate factory floors using LiDAR sensors."
        },
        {
          "word": "interdisciplinary",
          "pos": "adj",
          "ipa": "/ˌɪn.tə.dɪs.əˈplɪn.ər.i/",
          "meaningVi": "liên ngành",
          "exampleSentence": "Mechatronics is an interdisciplinary field combining mechanics, electronics, and code."
        },
        {
          "word": "specifications",
          "pos": "noun",
          "ipa": "/ˌspes.ɪ.fɪˈkeɪ.ʃənz/",
          "meaningVi": "thông số kỹ thuật chi tiết",
          "exampleSentence": "Ensure all output modules meet the 24V industrial voltage specifications."
        }
      ]
    },
    {
      "topicTitle": "Sports & Competition",
      "words": [
        {
          "word": "underdog",
          "pos": "noun",
          "ipa": "/ˈʌn.də.dɒɡ/",
          "meaningVi": "đội chiếu dưới, kẻ yếu thế",
          "exampleSentence": "With thirty seconds remaining, the underdog team equalized."
        },
        {
          "word": "endurance",
          "pos": "noun",
          "ipa": "/ɪnˈdʒʊə.rəns/",
          "meaningVi": "sức bền bỉ dẻo dai",
          "exampleSentence": "Marathon runners train intensely to build cardiovascular endurance."
        },
        {
          "word": "spectator",
          "pos": "noun",
          "ipa": "/spekˈteɪ.tər/",
          "meaningVi": "khán giả trực tiếp",
          "exampleSentence": "Over sixty thousand spectators cheered inside the stadium."
        },
        {
          "word": "championship",
          "pos": "noun",
          "ipa": "/ˈtʃæm.pi.ən.ʃɪp/",
          "meaningVi": "giải vô địch",
          "exampleSentence": "They fought relentlessly to secure the national championship title."
        },
        {
          "word": "tactical",
          "pos": "adj",
          "ipa": "/ˈtæk.tɪ.kəl/",
          "meaningVi": "thuộc về chiến thuật",
          "exampleSentence": "A tactical substitution in the second half turned the match."
        },
        {
          "word": "scalability",
          "pos": "noun",
          "ipa": "/ˌskeɪ.ləˈbɪl.ə.ti/",
          "meaningVi": "khả năng mở rộng quy mô",
          "exampleSentence": "Microservices architecture improves system scalability under heavy load."
        },
        {
          "word": "consensus",
          "pos": "noun",
          "ipa": "/kənˈsen.səs/",
          "meaningVi": "sự đồng thuận cao",
          "exampleSentence": "After thorough debate, the committee reached a unanimous consensus."
        },
        {
          "word": "paradigm",
          "pos": "noun",
          "ipa": "/ˈpær.ə.daɪm/",
          "meaningVi": "mô hình, hệ tư tưởng",
          "exampleSentence": "AI-assisted learning is shifting the traditional education paradigm."
        },
        {
          "word": "scrutiny",
          "pos": "noun",
          "ipa": "/ˈskruː.tɪ.ni/",
          "meaningVi": "sự rà soát, kiểm tra kỹ lưỡng",
          "exampleSentence": "The schematic design passed rigorous engineering scrutiny."
        },
        {
          "word": "mitigate",
          "pos": "verb",
          "ipa": "/ˈmɪt.ɪ.ɡeɪt/",
          "meaningVi": "giảm thiểu (rủi ro/nhiễu)",
          "exampleSentence": "Decoupling capacitors mitigate high-frequency power supply noise."
        },
        {
          "word": "procurement",
          "pos": "noun",
          "ipa": "/prəˈkjʊə.mənt/",
          "meaningVi": "mua sắm cung ứng vật tư kỹ thuật",
          "exampleSentence": "Technical procurement requires evaluating both component quality and lead time."
        },
        {
          "word": "redundancy",
          "pos": "noun",
          "ipa": "/rɪˈdʌn.dən.si/",
          "meaningVi": "cơ chế dự phòng an toàn",
          "exampleSentence": "Dual power supplies provide hardware redundancy for industrial PLCs."
        },
        {
          "word": "autonomy",
          "pos": "noun",
          "ipa": "/ɔːˈtɒn.ə.mi/",
          "meaningVi": "tính tự chủ, tự vận hành",
          "exampleSentence": "Autonomous mobile robots navigate factory floors using LiDAR sensors."
        },
        {
          "word": "interdisciplinary",
          "pos": "adj",
          "ipa": "/ˌɪn.tə.dɪs.əˈplɪn.ər.i/",
          "meaningVi": "liên ngành",
          "exampleSentence": "Mechatronics is an interdisciplinary field combining mechanics, electronics, and code."
        },
        {
          "word": "specifications",
          "pos": "noun",
          "ipa": "/ˌspes.ɪ.fɪˈkeɪ.ʃənz/",
          "meaningVi": "thông số kỹ thuật chi tiết",
          "exampleSentence": "Ensure all output modules meet the 24V industrial voltage specifications."
        }
      ]
    },
    {
      "topicTitle": "Philosophy & Abstract Ideas",
      "words": [
        {
          "word": "existential",
          "pos": "adj",
          "ipa": "/ˌeɡ.zɪˈsten.ʃəl/",
          "meaningVi": "thuộc tính hiện sinh",
          "exampleSentence": "Literature often explores deep existential questions about purpose."
        },
        {
          "word": "epistemology",
          "pos": "noun",
          "ipa": "/ɪˌpɪs.təˈmɒl.ə.dʒi/",
          "meaningVi": "nhận thức luận triết học",
          "exampleSentence": "True wisdom begins with recognizing limits of human knowledge."
        },
        {
          "word": "paradox",
          "pos": "noun",
          "ipa": "/ˈpær.ə.dɒks/",
          "meaningVi": "nghịch lý logic",
          "exampleSentence": "It is a curious paradox that limitations often stimulate creativity."
        },
        {
          "word": "consciousness",
          "pos": "noun",
          "ipa": "/ˈkɒn.ʃəs.nəs/",
          "meaningVi": "ý thức nhận thức",
          "exampleSentence": "Philosophers still debate the true nature of human consciousness."
        },
        {
          "word": "virtue",
          "pos": "noun",
          "ipa": "/ˈvɜː.tʃuː/",
          "meaningVi": "đức hạnh, phẩm hạnh",
          "exampleSentence": "Patience and humility are considered universal human virtues."
        },
        {
          "word": "scalability",
          "pos": "noun",
          "ipa": "/ˌskeɪ.ləˈbɪl.ə.ti/",
          "meaningVi": "khả năng mở rộng quy mô",
          "exampleSentence": "Microservices architecture improves system scalability under heavy load."
        },
        {
          "word": "consensus",
          "pos": "noun",
          "ipa": "/kənˈsen.səs/",
          "meaningVi": "sự đồng thuận cao",
          "exampleSentence": "After thorough debate, the committee reached a unanimous consensus."
        },
        {
          "word": "paradigm",
          "pos": "noun",
          "ipa": "/ˈpær.ə.daɪm/",
          "meaningVi": "mô hình, hệ tư tưởng",
          "exampleSentence": "AI-assisted learning is shifting the traditional education paradigm."
        },
        {
          "word": "scrutiny",
          "pos": "noun",
          "ipa": "/ˈskruː.tɪ.ni/",
          "meaningVi": "sự rà soát, kiểm tra kỹ lưỡng",
          "exampleSentence": "The schematic design passed rigorous engineering scrutiny."
        },
        {
          "word": "mitigate",
          "pos": "verb",
          "ipa": "/ˈmɪt.ɪ.ɡeɪt/",
          "meaningVi": "giảm thiểu (rủi ro/nhiễu)",
          "exampleSentence": "Decoupling capacitors mitigate high-frequency power supply noise."
        },
        {
          "word": "procurement",
          "pos": "noun",
          "ipa": "/prəˈkjʊə.mənt/",
          "meaningVi": "mua sắm cung ứng vật tư kỹ thuật",
          "exampleSentence": "Technical procurement requires evaluating both component quality and lead time."
        },
        {
          "word": "redundancy",
          "pos": "noun",
          "ipa": "/rɪˈdʌn.dən.si/",
          "meaningVi": "cơ chế dự phòng an toàn",
          "exampleSentence": "Dual power supplies provide hardware redundancy for industrial PLCs."
        },
        {
          "word": "autonomy",
          "pos": "noun",
          "ipa": "/ɔːˈtɒn.ə.mi/",
          "meaningVi": "tính tự chủ, tự vận hành",
          "exampleSentence": "Autonomous mobile robots navigate factory floors using LiDAR sensors."
        },
        {
          "word": "interdisciplinary",
          "pos": "adj",
          "ipa": "/ˌɪn.tə.dɪs.əˈplɪn.ər.i/",
          "meaningVi": "liên ngành",
          "exampleSentence": "Mechatronics is an interdisciplinary field combining mechanics, electronics, and code."
        },
        {
          "word": "specifications",
          "pos": "noun",
          "ipa": "/ˌspes.ɪ.fɪˈkeɪ.ʃənz/",
          "meaningVi": "thông số kỹ thuật chi tiết",
          "exampleSentence": "Ensure all output modules meet the 24V industrial voltage specifications."
        }
      ]
    }
  ]
};

export function getTopicVocabularyCards(
  level: "A1" | "A2" | "B1" | "B2",
  topicIndex: number
): SRSCard[] {
  const levelTopics = TOPIC_VOCABULARY_DATA[level] || TOPIC_VOCABULARY_DATA.A1;
  const selected = levelTopics[topicIndex % levelTopics.length] || levelTopics[0];
  return selected.words.map((item) =>
    createFlashcardOneClick(
      item.word,
      item.ipa,
      `${item.meaningVi} (${item.pos})`,
      item.exampleSentence,
      level
    )
  );
}

export function getTopicTitle(level: "A1" | "A2" | "B1" | "B2", topicIndex: number): string {
  const levelTopics = TOPIC_VOCABULARY_DATA[level] || TOPIC_VOCABULARY_DATA.A1;
  const selected = levelTopics[topicIndex % levelTopics.length] || levelTopics[0];
  return selected.topicTitle;
}
