/**
 * ENGINE GHÉP CÂU & CHUYỂN TỪ VỰNG THỤ ĐỘNG SANG CHỦ ĐỘNG (Passive-to-Active Sentence Builder)
 * Giải quyết bài toán: "Đọc câu người khác viết thì không thấy từ nào lạ,
 * nhưng lúc muốn tự nói ý đó bằng tiếng Anh thì không biết ghép câu thế nào."
 *
 * 100% chạy cục bộ trên trình duyệt ($0 Stack):
 *  1. Ghép khối câu từ ý tiếng Việt (Chunk Assembly) kèm gợi ý từng tầng & so sánh tư duy Việt-Anh
 *  2. Xưởng khung câu xương sống (Reusable Sentence Frames) thay thế linh hoạt theo ngữ cảnh
 *  3. Tự diễn đạt chủ động (Active Recall Free-Write) + phát hiện lỗi dịch từng chữ kiểu Việt (Vietlish)
 */

import { ListeningSegment } from "./intensive-listening-engine";
import { computeLevenshteinDistance } from "./dictation-shadowing-engine";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2";

export interface SentenceDrillItem {
  id: string;
  cefrLevel: CEFRLevel;
  category: string;
  vietnameseIntent: string;
  englishTarget: string;
  acceptedAlternatives: string[];
  chunks: string[];
  distractorChunks: string[];
  formulaVi: string;
  viToEnTip: string;
  keywords: string[];
}

export interface FrameSlot {
  id: string;
  labelVi: string;
  placeholder: string;
  options: { en: string; vi: string }[];
}

export interface SentenceFrame {
  id: string;
  cefrLevel: CEFRLevel;
  category: string;
  titleVi: string;
  patternEn: string;
  meaningVi: string;
  whenToUseVi: string;
  templateParts: string[]; // Xen kẽ giữa các slot: parts[0] + slot0 + parts[1] + slot1 + ...
  slots: FrameSlot[];
}

export interface VietlishIssue {
  patternLabel: string;
  explanationVi: string;
  fixSuggestion: string;
}

export interface SentenceEvaluationResult {
  score: number;
  passed: boolean;
  xpEarned: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  bestReference: string;
  vietlishIssues: VietlishIssue[];
  feedbackVi: string;
}

export interface SentenceBuilderProgress {
  completedDrillIds: string[];
  totalXp: number;
  streakCorrect: number;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// 1) KHO 32 BÀI LUYỆN GHÉP CÂU THỰC TẾ (A1 → B2) — Toàn từ quen, nhưng hay bí cách diễn đạt
// ---------------------------------------------------------------------------

export const SENTENCE_DRILLS_BY_LEVEL: Record<CEFRLevel, SentenceDrillItem[]> = {
  A1: [
    {
      id: "sb-a1-1",
      cefrLevel: "A1",
      category: "Giao tiếp hàng ngày",
      vietnameseIntent: "Xin lỗi, bạn có thể nói chậm lại một chút được không?",
      englishTarget: "Excuse me, could you speak a little slower, please?",
      acceptedAlternatives: [
        "Excuse me, can you speak a bit slower, please?",
        "Sorry, could you speak more slowly, please?",
        "Could you speak a little slower, please?",
      ],
      chunks: ["Excuse me,", "could you", "speak", "a little slower,", "please?"],
      distractorChunks: ["you can", "slowly little"],
      formulaVi: "[Lời mở đầu] + Could you + [Động từ nguyên mẫu] + [Mức độ] + please?",
      viToEnTip: "Người Việt hay dịch 'bạn có thể' thành 'you can...', nhưng khi hỏi lịch sự hãy đảo thành 'Could you + V?'.",
      keywords: ["could", "speak", "slower"],
    },
    {
      id: "sb-a1-2",
      cefrLevel: "A1",
      category: "Giao tiếp hàng ngày",
      vietnameseIntent: "Tôi hiểu ý bạn, nhưng tôi không biết nói câu đó bằng tiếng Anh thế nào.",
      englishTarget: "I understand you, but I don't know how to say it in English.",
      acceptedAlternatives: [
        "I understand what you mean, but I don't know how to say it in English.",
        "I understand you, but I don't know how to say that in English.",
      ],
      chunks: ["I understand you,", "but", "I don't know", "how to say it", "in English."],
      distractorChunks: ["I no know", "say how it"],
      formulaVi: "I understand you, but I don't know + how to + [V] + in English.",
      viToEnTip: "Cụm 'không biết làm thế nào để...' luôn dùng 'don't know how to + V' (không dịch 'no know how').",
      keywords: ["understand", "know", "how", "say", "English"],
    },
    {
      id: "sb-a1-3",
      cefrLevel: "A1",
      category: "Đi lại & Thời gian",
      vietnameseIntent: "Đi bộ từ đây đến trạm xe buýt mất khoảng bao lâu?",
      englishTarget: "How long does it take to walk from here to the bus stop?",
      acceptedAlternatives: [
        "How long does it take to walk to the bus stop from here?",
        "How many minutes does it take to walk to the bus stop?",
      ],
      chunks: ["How long", "does it take", "to walk", "from here", "to the bus stop?"],
      distractorChunks: ["How much time", "it takes"],
      formulaVi: "How long does it take + to [V] + from [A] to [B]?",
      viToEnTip: "Tiếng Việt nói 'mất bao lâu' trực tiếp, còn tiếng Anh luôn mượn chủ ngữ giả 'it': 'How long does it take to...?'",
      keywords: ["how", "long", "take", "walk", "bus"],
    },
    {
      id: "sb-a1-4",
      cefrLevel: "A1",
      category: "Ăn uống & Mua sắm",
      vietnameseIntent: "Cho tôi một ly cà phê đá ít đường nhé.",
      englishTarget: "Could I have an iced coffee with less sugar, please?",
      acceptedAlternatives: [
        "Can I get an iced coffee with less sugar, please?",
        "I would like an iced coffee with less sugar, please.",
      ],
      chunks: ["Could I have", "an iced coffee", "with less sugar,", "please?"],
      distractorChunks: ["Give me", "little sugar"],
      formulaVi: "Could I have + [Món] + with [Yêu cầu thêm/bớt], please?",
      viToEnTip: "Tránh dịch 'Cho tôi...' thành 'Give me...' (nghe hơi cộc). Hãy dùng 'Could I have...' hoặc 'Can I get...'.",
      keywords: ["have", "coffee", "less", "sugar"],
    },
    {
      id: "sb-a1-5",
      cefrLevel: "A1",
      category: "Sở thích & Thói quen",
      vietnameseIntent: "Cuối tuần tôi thường ở nhà đọc sách và nghe nhạc.",
      englishTarget: "On weekends, I usually stay at home to read books and listen to music.",
      acceptedAlternatives: [
        "On weekends, I usually stay home, read books, and listen to music.",
        "I usually stay at home and read books and listen to music on weekends.",
      ],
      chunks: ["On weekends,", "I usually", "stay at home", "to read books", "and listen to music."],
      distractorChunks: ["listen music", "in weekend"],
      formulaVi: "On weekends, I usually + [V1] + and + [V2].",
      viToEnTip: "Nhớ cụm cố định 'listen TO music' (có giới từ 'to') và 'on weekends' (không dùng 'in weekend').",
      keywords: ["weekends", "usually", "stay", "read", "listen"],
    },
    {
      id: "sb-a1-6",
      cefrLevel: "A1",
      category: "Hỏi thông tin",
      vietnameseIntent: "Từ này trong tiếng Anh phát âm như thế nào?",
      englishTarget: "How do you pronounce this word in English?",
      acceptedAlternatives: [
        "How do I pronounce this word?",
        "How do you say this word in English?",
      ],
      chunks: ["How do you", "pronounce", "this word", "in English?"],
      distractorChunks: ["How you", "pronunciation"],
      formulaVi: "How do you + [Động từ: pronounce/spell/say] + [Đối tượng]?",
      viToEnTip: "Khi hỏi chung chung 'người ta đọc từ này sao?', tiếng Anh dùng 'How do you...?' rất tự nhiên.",
      keywords: ["how", "pronounce", "word"],
    },
    {
      id: "sb-a1-7",
      cefrLevel: "A1",
      category: "Kế hoạch",
      vietnameseIntent: "Tối nay tôi định đi ăn tối với mấy người bạn.",
      englishTarget: "I'm planning to have dinner with some friends tonight.",
      acceptedAlternatives: [
        "I am going to have dinner with my friends tonight.",
        "I plan to have dinner with some friends tonight.",
      ],
      chunks: ["I'm planning to", "have dinner", "with some friends", "tonight."],
      distractorChunks: ["eat dinner with", "tonight I"],
      formulaVi: "I'm planning to + [V] + with [Ai] + [Thời gian].",
      viToEnTip: "Người bản xứ hay dùng 'have dinner' thay vì 'eat dinner', và đặt thời gian ('tonight') ở cuối câu.",
      keywords: ["planning", "dinner", "friends", "tonight"],
    },
    {
      id: "sb-a1-8",
      cefrLevel: "A1",
      category: "Cảm xúc & Trạng thái",
      vietnameseIntent: "Hôm nay tôi hơi mệt vì tối qua ngủ muộn.",
      englishTarget: "I'm a bit tired today because I went to bed late last night.",
      acceptedAlternatives: [
        "I feel a bit tired today because I slept late last night.",
        "Today I'm a little tired because I stayed up late last night.",
      ],
      chunks: ["I'm a bit tired", "today", "because", "I went to bed late", "last night."],
      distractorChunks: ["I very tired", "because ... so"],
      formulaVi: "I'm a bit + [Tính từ] + because + [Nguyên nhân quá khứ].",
      viToEnTip: "Tính từ 'tired' cần động từ 'to be' (I'm tired). Và đã dùng 'because' thì KHÔNG dùng 'so' trong cùng câu.",
      keywords: ["tired", "today", "because", "late"],
    },
  ],
  A2: [
    {
      id: "sb-a2-1",
      cefrLevel: "A2",
      category: "Học tiếng Anh",
      vietnameseIntent: "Tôi biết từ này khi đọc, nhưng lúc nói lại không nghĩ ra.",
      englishTarget: "I recognize this word when I read, but I can't think of it when I speak.",
      acceptedAlternatives: [
        "I know this word when reading, but I forget it when speaking.",
        "I know this word when I read, but I can't remember it when I speak.",
      ],
      chunks: ["I recognize this word", "when I read,", "but I can't", "think of it", "when I speak."],
      distractorChunks: ["think it", "when speaking I no"],
      formulaVi: "I recognize [X] when I [V1], but I can't think of it when I [V2].",
      viToEnTip: "'Nghĩ ra (một từ/ý tưởng)' trong tiếng Anh dùng cụm động từ 'think OF something' hoặc 'come up with'.",
      keywords: ["word", "read", "think", "speak"],
    },
    {
      id: "sb-a2-2",
      cefrLevel: "A2",
      category: "Hẹn gặp & Lịch trình",
      vietnameseIntent: "Chiều thứ Sáu này bạn có rảnh đi uống cà phê không?",
      englishTarget: "Are you free to grab a coffee this Friday afternoon?",
      acceptedAlternatives: [
        "Are you free for coffee this Friday afternoon?",
        "Do you have time to get a coffee this Friday afternoon?",
      ],
      chunks: ["Are you free", "to grab a coffee", "this Friday", "afternoon?"],
      distractorChunks: ["Do you free", "go drink coffee"],
      formulaVi: "Are you free + to [V] + [Thời gian]?",
      viToEnTip: "'Free' là tính từ nên phải hỏi 'Are you free...?' (không dùng 'Do you free'). 'Grab a coffee' tự nhiên hơn 'drink coffee'.",
      keywords: ["free", "coffee", "Friday", "afternoon"],
    },
    {
      id: "sb-a2-3",
      cefrLevel: "A2",
      category: "Nhờ giúp đỡ",
      vietnameseIntent: "Bạn có phiền xem giúp tôi đoạn email này trước khi tôi gửi không?",
      englishTarget: "Would you mind checking this email before I send it?",
      acceptedAlternatives: [
        "Could you help me check this email before I send it?",
        "Do you mind checking this email before I send it?",
      ],
      chunks: ["Would you mind", "checking", "this email", "before I send it?"],
      distractorChunks: ["to check", "before send"],
      formulaVi: "Would you mind + [V-ing] + before I [V]?",
      viToEnTip: "Sau 'Would you mind' luôn là động từ thêm '-ing' (checking), và sau 'before' cần có chủ ngữ (before I send it).",
      keywords: ["mind", "checking", "email", "before", "send"],
    },
    {
      id: "sb-a2-4",
      cefrLevel: "A2",
      category: "Sức khỏe & Đời sống",
      vietnameseIntent: "Tôi đang cố ngủ sớm hơn để sáng hôm sau có nhiều năng lượng.",
      englishTarget: "I'm trying to go to bed earlier so I have more energy the next morning.",
      acceptedAlternatives: [
        "I'm trying to sleep earlier to have more energy the next morning.",
        "I try to go to bed earlier so that I have more energy in the morning.",
      ],
      chunks: ["I'm trying to", "go to bed earlier", "so I have", "more energy", "the next morning."],
      distractorChunks: ["try sleep early", "for have energy"],
      formulaVi: "I'm trying to + [V] + so [Chủ ngữ] + [Kết quả].",
      viToEnTip: "Không dùng 'for + V' để chỉ mục đích (tránh 'for have'). Dùng 'to + V' hoặc 'so + S + V'.",
      keywords: ["trying", "earlier", "energy", "morning"],
    },
    {
      id: "sb-a2-5",
      cefrLevel: "A2",
      category: "Mua sắm & Đổi trả",
      vietnameseIntent: "Chiếc áo này hơi chật, ở đây có cỡ lớn hơn không?",
      englishTarget: "This shirt is a bit too tight; do you have it in a larger size?",
      acceptedAlternatives: [
        "This shirt is a little small, do you have a bigger size?",
        "This shirt is too tight. Do you have a larger size?",
      ],
      chunks: ["This shirt is", "a bit too tight;", "do you have it", "in a larger size?"],
      distractorChunks: ["have size bigger", "a bit small too"],
      formulaVi: "[Đồ vật] is a bit too [Tính từ]; do you have it in [Kích cỡ/Màu]?",
      viToEnTip: "Cấu trúc 'in a larger size' / 'in blue' là cách nói chuẩn khi hỏi size hoặc màu ở cửa hàng.",
      keywords: ["shirt", "tight", "have", "size"],
    },
    {
      id: "sb-a2-6",
      cefrLevel: "A2",
      category: "Công việc cơ bản",
      vietnameseIntent: "Tôi sẽ gửi lại báo cáo cho bạn trước 5 giờ chiều nay.",
      englishTarget: "I'll send the report back to you before 5 PM today.",
      acceptedAlternatives: [
        "I will send you the report before 5 PM today.",
        "I'll get the report back to you by 5 PM today.",
      ],
      chunks: ["I'll send", "the report", "back to you", "before 5 PM", "today."],
      distractorChunks: ["send again", "before 5 o'clock afternoon"],
      formulaVi: "I'll send [Tài liệu] back to you + before / by [Giờ].",
      viToEnTip: "'5 giờ chiều' chỉ cần nói '5 PM' (không ghép '5 o'clock afternoon').",
      keywords: ["send", "report", "before", "5"],
    },
    {
      id: "sb-a2-7",
      cefrLevel: "A2",
      category: "Kinh nghiệm cá nhân",
      vietnameseIntent: "Lần đầu nghe tiếng Anh nhanh, tôi hầu như chẳng bắt được từ nào.",
      englishTarget: "The first time I heard fast English, I could barely catch a single word.",
      acceptedAlternatives: [
        "When I first heard fast English, I could hardly catch any words.",
        "The first time I listened to fast English, I almost couldn't catch any word.",
      ],
      chunks: ["The first time", "I heard fast English,", "I could barely", "catch", "a single word."],
      distractorChunks: ["First time listen", "no catch word"],
      formulaVi: "The first time I [V-quá khứ], I could barely [V].",
      viToEnTip: "'Hầu như không thể...' diễn đạt cực tự nhiên bằng 'could barely + V' hoặc 'could hardly + V'.",
      keywords: ["first", "fast", "barely", "catch", "word"],
    },
    {
      id: "sb-a2-8",
      cefrLevel: "A2",
      category: "Đề xuất ý kiến",
      vietnameseIntent: "Thay vì học thuộc từng từ lẻ, sao mình không học theo cả cụm câu?",
      englishTarget: "Instead of memorizing single words, why don't we learn in full phrases?",
      acceptedAlternatives: [
        "Instead of learning single words, why don't we learn full phrases?",
        "Why don't we learn phrases instead of memorizing individual words?",
      ],
      chunks: ["Instead of", "memorizing single words,", "why don't we", "learn", "in full phrases?"],
      distractorChunks: ["Instead memorize", "why we not"],
      formulaVi: "Instead of + [V-ing], why don't we + [V nguyên mẫu]?",
      viToEnTip: "Sau 'Instead of' luôn là V-ing. Câu đề xuất 'Sao mình không...?' dùng 'Why don't we + V?'.",
      keywords: ["instead", "words", "why", "learn", "phrases"],
    },
  ],
  B1: [
    {
      id: "sb-b1-1",
      cefrLevel: "B1",
      category: "Công việc & Dự án",
      vietnameseIntent: "Tôi đang gặp chút vướng mắc ở phần kết nối, bạn có thể xem qua cùng tôi không?",
      englishTarget: "I'm running into a small issue with the connection; could you take a look with me?",
      acceptedAlternatives: [
        "I have a small problem with the connection, could you take a look with me?",
        "I'm having trouble with the connection; can you look at it with me?",
      ],
      chunks: ["I'm running into", "a small issue", "with the connection;", "could you", "take a look with me?"],
      distractorChunks: ["meeting an issue", "see with me"],
      formulaVi: "I'm running into [vấn đề] with [hạng mục]; could you take a look?",
      viToEnTip: "Trong môi trường công việc, 'gặp vướng mắc' dùng 'run into an issue' và 'xem qua' dùng 'take a look' rất tự nhiên.",
      keywords: ["issue", "connection", "take", "look"],
    },
    {
      id: "sb-b1-2",
      cefrLevel: "B1",
      category: "Thảo luận & Nêu ý kiến",
      vietnameseIntent: "Tôi đồng ý với ý của bạn, nhưng mình cũng nên tính đến thời gian thực tế.",
      englishTarget: "I see your point, but we should also consider the realistic timeline.",
      acceptedAlternatives: [
        "I agree with your point, but we should also think about the realistic timeline.",
        "I agree with you, however we should also consider the actual timeline.",
      ],
      chunks: ["I see your point,", "but we should also", "consider", "the realistic timeline."],
      distractorChunks: ["I am agree", "also should we"],
      formulaVi: "I see your point, but we should also + [V] + [yếu tố cần cân nhắc].",
      viToEnTip: "Tránh 'I am agree' (vì 'agree' là động từ). Dùng 'I agree' hoặc mềm mại hơn là 'I see your point'.",
      keywords: ["point", "should", "consider", "timeline"],
    },
    {
      id: "sb-b1-3",
      cefrLevel: "B1",
      category: "Giải thích nguyên nhân",
      vietnameseIntent: "Lý do tôi luyện nghe mỗi ngày là để quen với cách nối âm tự nhiên.",
      englishTarget: "The reason I practice listening every day is to get used to natural connected speech.",
      acceptedAlternatives: [
        "I practice listening every day to get used to natural connected speech.",
        "The reason why I practice listening daily is to get used to connected speech.",
      ],
      chunks: ["The reason", "I practice listening", "every day", "is to get used to", "natural connected speech."],
      distractorChunks: ["is because", "used to"],
      formulaVi: "The reason [S + V] is to + [V mục đích].",
      viToEnTip: "'Quen với việc gì' dùng 'get used to + N/V-ing'. Tránh viết 'The reason ... is because ...' (lặp nghĩa).",
      keywords: ["reason", "practice", "listening", "used"],
    },
    {
      id: "sb-b1-4",
      cefrLevel: "B1",
      category: "Phỏng vấn & Sự nghiệp",
      vietnameseIntent: "Một trong những điểm mạnh của tôi là tự tìm cách giải quyết vấn đề mới.",
      englishTarget: "One of my main strengths is figuring out how to solve new problems independently.",
      acceptedAlternatives: [
        "One of my key strengths is solving new problems on my own.",
        "One of my strengths is figuring out solutions to new problems by myself.",
      ],
      chunks: ["One of my main strengths", "is figuring out", "how to solve", "new problems", "independently."],
      distractorChunks: ["One of my strength", "is figure out"],
      formulaVi: "One of my [Danh từ số nhiều] is + [V-ing].",
      viToEnTip: "Sau 'One of my...' danh từ luôn ở số nhiều ('strengths'), và động từ giải thích phía sau dùng V-ing ('figuring out').",
      keywords: ["strengths", "solve", "problems"],
    },
    {
      id: "sb-b1-5",
      cefrLevel: "B1",
      category: "Hỏi làm rõ",
      vietnameseIntent: "Ý bạn là chúng ta nên ưu tiên sửa lỗi này trước khi thêm tính năng mới phải không?",
      englishTarget: "Do you mean we should prioritize fixing this bug before adding new features?",
      acceptedAlternatives: [
        "Are you saying we should fix this bug first before adding new features?",
        "So you mean we should focus on fixing this bug before adding new features?",
      ],
      chunks: ["Do you mean", "we should prioritize", "fixing this bug", "before adding", "new features?"],
      distractorChunks: ["Your mean is", "before add"],
      formulaVi: "Do you mean + [Mệnh đề tóm tắt ý]?",
      viToEnTip: "Không dịch 'Ý bạn là...' thành 'Your mean is...'. Luôn dùng 'Do you mean...?' hoặc 'Are you saying...?'.",
      keywords: ["mean", "prioritize", "fixing", "before", "features"],
    },
    {
      id: "sb-b1-6",
      cefrLevel: "B1",
      category: "Thói quen hiệu quả",
      vietnameseIntent: "Càng luyện ghép câu nhiều, tôi càng phản xạ nhanh hơn khi giao tiếp.",
      englishTarget: "The more I practice building sentences, the faster I respond in conversations.",
      acceptedAlternatives: [
        "The more I practice making sentences, the faster I react in conversations.",
      ],
      chunks: ["The more", "I practice building sentences,", "the faster", "I respond", "in conversations."],
      distractorChunks: ["More I practice", "faster I respond"],
      formulaVi: "The more [S1 + V1], the + [So sánh hơn] + [S2 + V2].",
      viToEnTip: "Cấu trúc 'Càng... càng...' cực kỳ hữu ích: 'The more..., the [adj-er]...' — luôn có 'the' ở cả hai vế.",
      keywords: ["more", "practice", "faster", "respond"],
    },
    {
      id: "sb-b1-7",
      cefrLevel: "B1",
      category: "Báo cáo tiến độ",
      vietnameseIntent: "Nhìn chung tiến độ vẫn đúng kế hoạch, chỉ còn vài chi tiết nhỏ cần kiểm tra lại.",
      englishTarget: "Overall, we're still on track, with just a few minor details left to double-check.",
      acceptedAlternatives: [
        "Overall, we are still on schedule, with only a few small details to check again.",
      ],
      chunks: ["Overall,", "we're still on track,", "with just", "a few minor details", "left to double-check."],
      distractorChunks: ["still right plan", "check again again"],
      formulaVi: "Overall, we're still on track, with just [phần còn lại] left to [V].",
      viToEnTip: "'Đúng tiến độ' dùng cụm ngắn gọn 'on track' hoặc 'on schedule'; 'kiểm tra kỹ lại' dùng 'double-check'.",
      keywords: ["overall", "track", "details", "check"],
    },
    {
      id: "sb-b1-8",
      cefrLevel: "B1",
      category: "Cảm ơn & Phản hồi",
      vietnameseIntent: "Cảm ơn bạn đã giải thích rõ ràng, giờ tôi đã hiểu cách hoạt động của nó rồi.",
      englishTarget: "Thanks for explaining it so clearly; now I understand how it works.",
      acceptedAlternatives: [
        "Thank you for explaining that clearly; now I see how it works.",
      ],
      chunks: ["Thanks for", "explaining it", "so clearly;", "now I understand", "how it works."],
      distractorChunks: ["Thanks to explain", "how does it work"],
      formulaVi: "Thanks for + [V-ing]; now I understand + [how/why + S + V].",
      viToEnTip: "Trong câu khẳng định 'hiểu nó hoạt động thế nào', KHÔNG đảo trợ động từ: dùng 'how it works' (không phải 'how does it work').",
      keywords: ["thanks", "explaining", "clearly", "how", "works"],
    },
  ],
  B2: [
    {
      id: "sb-b2-1",
      cefrLevel: "B2",
      category: "Phân tích & Đề xuất",
      vietnameseIntent: "Theo góc nhìn của tôi, đầu tư vào kỹ năng nghe trước sẽ tạo nền tảng vững hơn cho việc nói.",
      englishTarget: "From my perspective, investing in listening first builds a stronger foundation for speaking.",
      acceptedAlternatives: [
        "In my view, focusing on listening first creates a stronger foundation for speaking.",
      ],
      chunks: ["From my perspective,", "investing in listening first", "builds", "a stronger foundation", "for speaking."],
      distractorChunks: ["According to me", "build a foundation stronger"],
      formulaVi: "From my perspective, [V-ing chủ ngữ] + [Động từ số ít] + [Tác động].",
      viToEnTip: "Tránh dịch 'Theo tôi' thành 'According to me' (chỉ dùng 'According to + người khác/nguồn'). Dùng 'From my perspective' hoặc 'In my view'.",
      keywords: ["perspective", "listening", "foundation", "speaking"],
    },
    {
      id: "sb-b2-2",
      cefrLevel: "B2",
      category: "Đàm phán & Thỏa hiệp",
      vietnameseIntent: "Nếu chúng ta thống nhất được phạm vi cốt lõi, tôi tin nhóm có thể bàn giao đúng hạn.",
      englishTarget: "Provided we align on the core scope, I'm confident the team can deliver on time.",
      acceptedAlternatives: [
        "If we agree on the core scope, I'm confident the team can deliver on time.",
      ],
      chunks: ["Provided we align", "on the core scope,", "I'm confident", "the team can", "deliver on time."],
      distractorChunks: ["If we will align", "confident that can"],
      formulaVi: "Provided we [V hiện tại], I'm confident [Chủ ngữ] can [V].",
      viToEnTip: "Trong mệnh đề điều kiện ('If / Provided'), không dùng 'will' ở vế điều kiện.",
      keywords: ["align", "scope", "confident", "deliver"],
    },
    {
      id: "sb-b2-3",
      cefrLevel: "B2",
      category: "Phản biện lịch sự",
      vietnameseIntent: "Phương án đó nghe rất hấp dẫn, tuy nhiên chi phí bảo trì về lâu dài có thể khá cao.",
      englishTarget: "That approach sounds appealing; however, the long-term maintenance cost could be quite high.",
      acceptedAlternatives: [
        "That option sounds great, however the long-term maintenance cost might be high.",
      ],
      chunks: ["That approach", "sounds appealing;", "however,", "the long-term maintenance cost", "could be quite high."],
      distractorChunks: ["although ... but", "cost maintenance long"],
      formulaVi: "[Phương án] sounds [Tính từ]; however, [Rủi ro] could be [Mức độ].",
      viToEnTip: "Tiếng Anh xếp tính từ bổ nghĩa trước danh từ chính: 'long-term maintenance cost' (chi phí bảo trì dài hạn).",
      keywords: ["approach", "however", "maintenance", "cost"],
    },
    {
      id: "sb-b2-4",
      cefrLevel: "B2",
      category: "Tóm tắt & Chốt vấn đề",
      vietnameseIntent: "Nói ngắn gọn lại, nút thắt lớn nhất không nằm ở từ vựng mà ở phản xạ ghép câu.",
      englishTarget: "In short, the biggest bottleneck isn't vocabulary, but the reflex of assembling sentences.",
      acceptedAlternatives: [
        "In short, the main bottleneck is not vocabulary, but building sentences quickly.",
      ],
      chunks: ["In short,", "the biggest bottleneck", "isn't vocabulary,", "but the reflex of", "assembling sentences."],
      distractorChunks: ["Short speaking", "not lie in"],
      formulaVi: "In short, the biggest [vấn đề] isn't [A], but [B].",
      viToEnTip: "Cặp 'isn't A, but B' giúp nhấn mạnh tương phản cực sắc bén khi thuyết trình hoặc tranh luận.",
      keywords: ["short", "bottleneck", "vocabulary", "sentences"],
    },
    {
      id: "sb-b2-5",
      cefrLevel: "B2",
      category: "Giải quyết sự cố",
      vietnameseIntent: "Để tránh lỗi này lặp lại, chúng ta nên bổ sung một bước kiểm thử tự động.",
      englishTarget: "To prevent this error from happening again, we should add an automated test step.",
      acceptedAlternatives: [
        "To stop this bug from happening again, we should add an automated test.",
      ],
      chunks: ["To prevent this error", "from happening again,", "we should add", "an automated test step."],
      distractorChunks: ["prevent this error happen", "avoid this error to"],
      formulaVi: "To prevent [X] from [V-ing], we should [Giải pháp].",
      viToEnTip: "Cấu trúc chuẩn luôn là 'prevent + something + FROM + V-ing'.",
      keywords: ["prevent", "error", "happening", "automated", "test"],
    },
    {
      id: "sb-b2-6",
      cefrLevel: "B2",
      category: "Trình bày lợi ích",
      vietnameseIntent: "Lợi thế rõ rệt nhất của cách học này là bạn có thể áp dụng ngay vào tình huống thực tế.",
      englishTarget: "The clearest advantage of this method is that you can apply it directly to real-life situations.",
      acceptedAlternatives: [
        "The main advantage of this approach is that you can use it right away in real situations.",
      ],
      chunks: ["The clearest advantage", "of this method", "is that you can", "apply it directly", "to real-life situations."],
      distractorChunks: ["apply directly it", "advantage most clear"],
      formulaVi: "The clearest advantage of [X] is that + [Mệnh đề kết quả].",
      viToEnTip: "Đặt tân ngữ 'it' ngay sau 'apply' ('apply it directly to...'), không chèn trạng từ vào giữa 'apply' và 'it'.",
      keywords: ["advantage", "method", "apply", "real-life"],
    },
    {
      id: "sb-b2-7",
      cefrLevel: "B2",
      category: "So sánh & Đánh giá",
      vietnameseIntent: "Mặc dù đọc hiểu khá ổn, nhiều người vẫn thấy áp lực khi phải trả lời ngay lập tức.",
      englishTarget: "Even though their reading comprehension is solid, many people still feel pressured to reply on the spot.",
      acceptedAlternatives: [
        "Although their reading is good, many learners still feel pressured to answer immediately.",
      ],
      chunks: ["Even though", "their reading comprehension is solid,", "many people still", "feel pressured", "to reply on the spot."],
      distractorChunks: ["Even though ... but", "feel pressure to"],
      formulaVi: "Even though [Mệnh đề 1], [Chủ ngữ] still [Mệnh đề 2].",
      viToEnTip: "Đã dùng 'Even though / Although' thì tuyệt đối không thêm 'but' ở vế sau. 'On the spot' = ngay lập tức tại chỗ.",
      keywords: ["though", "reading", "pressured", "reply"],
    },
    {
      id: "sb-b2-8",
      cefrLevel: "B2",
      category: "Hợp tác nhóm",
      vietnameseIntent: "Nếu bạn có ý tưởng nào tốt hơn, cứ thoải mái chia sẻ để nhóm cùng cải thiện nhé.",
      englishTarget: "If you have any better ideas, feel free to share them so the team can improve together.",
      acceptedAlternatives: [
        "If you have a better idea, feel free to share it so we can improve together.",
      ],
      chunks: ["If you have", "any better ideas,", "feel free to", "share them", "so the team can improve together."],
      distractorChunks: ["comfortable to share", "share for team"],
      formulaVi: "If you have [X], feel free to + [V] + so [Mục đích].",
      viToEnTip: "'Cứ thoải mái làm gì nhé' trong tiếng Anh luôn dùng cụm vàng 'feel free to + V'.",
      keywords: ["better", "ideas", "feel", "free", "share"],
    },
  ],
};

// ---------------------------------------------------------------------------
// 2) XƯỞNG KHUNG CÂU XƯƠNG SỐNG (12 KHUNG CÂU ĐA NĂNG A1-B2)
// ---------------------------------------------------------------------------

export const REUSABLE_SENTENCE_FRAMES: SentenceFrame[] = [
  {
    id: "fr-a1-1",
    cefrLevel: "A1",
    category: "Nhờ vả lịch sự",
    titleVi: "Nhờ ai đó làm giúp việc gì",
    patternEn: "Could you [hành động] [chi tiết], please?",
    meaningVi: "Bạn có thể [làm gì] giúp tôi được không?",
    whenToUseVi: "Dùng mọi lúc khi nhờ vả trong lớp học, quán cà phê, hay nơi làm việc.",
    templateParts: ["Could you ", " ", ", please?"],
    slots: [
      {
        id: "action",
        labelVi: "Hành động",
        placeholder: "speak / repeat / explain...",
        options: [
          { en: "repeat", vi: "nhắc lại" },
          { en: "speak", vi: "nói" },
          { en: "spell", vi: "đánh vần" },
          { en: "show me", vi: "chỉ cho tôi" },
        ],
      },
      {
        id: "detail",
        labelVi: "Chi tiết",
        placeholder: "that sentence / a bit slower...",
        options: [
          { en: "that sentence", vi: "câu vừa rồi" },
          { en: "a little slower", vi: "chậm hơn một chút" },
          { en: "that word", vi: "từ đó" },
          { en: "how to do this", vi: "cách làm cái này" },
        ],
      },
    ],
  },
  {
    id: "fr-a1-2",
    cefrLevel: "A1",
    category: "Kể kế hoạch",
    titleVi: "Nói dự định sắp làm",
    patternEn: "I'm planning to [việc dự định] [thời gian].",
    meaningVi: "Tôi đang dự định [làm gì] vào [lúc nào].",
    whenToUseVi: "Trả lời câu hỏi 'What are you going to do...?' một cách tự nhiên.",
    templateParts: ["I'm planning to ", " ", "."],
    slots: [
      {
        id: "activity",
        labelVi: "Việc dự định",
        placeholder: "practice English / visit my family...",
        options: [
          { en: "practice listening for 20 minutes", vi: "luyện nghe 20 phút" },
          { en: "cook dinner at home", vi: "nấu cơm tối ở nhà" },
          { en: "meet a friend for coffee", vi: "gặp bạn uống cà phê" },
          { en: "finish my project", vi: "hoàn thành dự án" },
        ],
      },
      {
        id: "time",
        labelVi: "Thời gian",
        placeholder: "tonight / this weekend...",
        options: [
          { en: "tonight", vi: "tối nay" },
          { en: "this weekend", vi: "cuối tuần này" },
          { en: "after work", vi: "sau giờ làm" },
          { en: "tomorrow morning", vi: "sáng mai" },
        ],
      },
    ],
  },
  {
    id: "fr-a1-3",
    cefrLevel: "A1",
    category: "Diễn đạt khó khăn",
    titleVi: "Nói mình chưa biết cách làm gì",
    patternEn: "I don't know how to [việc] [ngữ cảnh].",
    meaningVi: "Tôi không biết cách [làm gì] [trong tình huống nào].",
    whenToUseVi: "Cực kỳ hữu ích khi bị bí từ lúc giao tiếp thực tế.",
    templateParts: ["I don't know how to ", " ", "."],
    slots: [
      {
        id: "verb",
        labelVi: "Hành động",
        placeholder: "say / pronounce / explain...",
        options: [
          { en: "say this", vi: "nói câu này" },
          { en: "explain my idea", vi: "giải thích ý tưởng của mình" },
          { en: "pronounce this word", vi: "phát âm từ này" },
          { en: "use this phrase", vi: "dùng cụm từ này" },
        ],
      },
      {
        id: "ctx",
        labelVi: "Ngữ cảnh",
        placeholder: "in English / in a sentence...",
        options: [
          { en: "in English", vi: "bằng tiếng Anh" },
          { en: "naturally", vi: "một cách tự nhiên" },
          { en: "in a real conversation", vi: "trong hội thoại thực tế" },
          { en: "correctly", vi: "cho đúng" },
        ],
      },
    ],
  },
  {
    id: "fr-a2-1",
    cefrLevel: "A2",
    category: "Nêu nỗ lực & Vướng mắc",
    titleVi: "Đang cố làm gì nhưng gặp khó",
    patternEn: "I'm trying to [mục tiêu], but [vấn đề].",
    meaningVi: "Tôi đang cố [làm gì], nhưng mà [gặp vấn đề].",
    whenToUseVi: "Dùng khi mô tả khó khăn trong học tập, công việc hoặc nhờ hỗ trợ.",
    templateParts: ["I'm trying to ", ", but ", "."],
    slots: [
      {
        id: "goal",
        labelVi: "Mục tiêu đang làm",
        placeholder: "improve my listening...",
        options: [
          { en: "catch every word when listening", vi: "bắt từng từ khi nghe" },
          { en: "build sentences faster", vi: "ghép câu nhanh hơn" },
          { en: "remember new vocabulary", vi: "nhớ từ vựng mới" },
          { en: "speak without translating", vi: "nói mà không phải dịch từng chữ" },
        ],
      },
      {
        id: "problem",
        labelVi: "Vấn đề gặp phải",
        placeholder: "native speakers talk too fast...",
        options: [
          { en: "native speakers talk too fast", vi: "người bản xứ nói nhanh quá" },
          { en: "my mind goes blank", vi: "đầu óc cứ trống rỗng" },
          { en: "I keep forgetting the word order", vi: "tôi cứ quên thứ tự từ" },
          { en: "I need more daily practice", vi: "tôi cần luyện thêm mỗi ngày" },
        ],
      },
    ],
  },
  {
    id: "fr-a2-2",
    cefrLevel: "A2",
    category: "Đề xuất & Gợi ý",
    titleVi: "Đề xuất cách làm thay thế",
    patternEn: "Instead of [cách cũ], why don't we [cách mới]?",
    meaningVi: "Thay vì [làm cách cũ], sao mình không [làm cách mới]?",
    whenToUseVi: "Đưa ra gợi ý nhẹ nhàng, lịch sự cho bạn bè hoặc đồng nghiệp.",
    templateParts: ["Instead of ", ", why don't we ", "?"],
    slots: [
      {
        id: "oldWay",
        labelVi: "Cách cũ (V-ing)",
        placeholder: "memorizing single words...",
        options: [
          { en: "memorizing single words", vi: "học thuộc từng từ lẻ" },
          { en: "translating word by word", vi: "dịch từng chữ một" },
          { en: "listening at full speed right away", vi: "nghe tốc độ nhanh ngay lập tức" },
          { en: "waiting until next week", vi: "đợi đến tuần sau" },
        ],
      },
      {
        id: "newWay",
        labelVi: "Cách mới (V nguyên mẫu)",
        placeholder: "practice with short phrases...",
        options: [
          { en: "practice with short chunks", vi: "luyện theo từng cụm ngắn" },
          { en: "start at 0.7x speed first", vi: "bắt đầu ở tốc độ 0.7x trước" },
          { en: "build 5 sentences every day", vi: "ghép 5 câu mỗi ngày" },
          { en: "test a quick prototype today", vi: "thử một bản mẫu nhanh hôm nay" },
        ],
      },
    ],
  },
  {
    id: "fr-b1-1",
    cefrLevel: "B1",
    category: "Công việc & Thảo luận",
    titleVi: "Đồng tình một phần & bổ sung góc nhìn",
    patternEn: "I see your point about [ý đối phương], but we should also [bổ sung].",
    meaningVi: "Tôi hiểu ý bạn về [vấn đề], nhưng mình cũng nên [xem xét thêm].",
    whenToUseVi: "Phản biện lịch sự trong cuộc họp mà không gây căng thẳng.",
    templateParts: ["I see your point about ", ", but we should also ", "."],
    slots: [
      {
        id: "theirPoint",
        labelVi: "Ý đối phương",
        placeholder: "saving time / the budget...",
        options: [
          { en: "launching early", vi: "ra mắt sớm" },
          { en: "keeping the budget low", vi: "giữ chi phí thấp" },
          { en: "adding more features", vi: "thêm nhiều tính năng" },
          { en: "practicing grammar", vi: "luyện ngữ pháp" },
        ],
      },
      {
        id: "addition",
        labelVi: "Điều cần bổ sung",
        placeholder: "consider user experience...",
        options: [
          { en: "consider the user experience", vi: "cân nhắc trải nghiệm người dùng" },
          { en: "check the realistic timeline", vi: "kiểm tra mốc thời gian thực tế" },
          { en: "test it with beginners first", vi: "thử nghiệm với người mới trước" },
          { en: "focus on daily speaking practice", vi: "tập trung luyện nói hàng ngày" },
        ],
      },
    ],
  },
  {
    id: "fr-b1-2",
    cefrLevel: "B1",
    category: "Giải thích & Mục đích",
    titleVi: "Nêu rõ lý do đằng sau một hành động",
    patternEn: "The main reason I [hành động] is to [mục tiêu].",
    meaningVi: "Lý do chính tôi [làm việc này] là để [đạt mục tiêu].",
    whenToUseVi: "Trả lời phỏng vấn hoặc giải thích quyết định một cách mạch lạc.",
    templateParts: ["The main reason I ", " is to ", "."],
    slots: [
      {
        id: "habit",
        labelVi: "Hành động",
        placeholder: "practice shadowing every morning...",
        options: [
          { en: "listen to short clips daily", vi: "nghe đoạn ngắn mỗi ngày" },
          { en: "learn sentence frames", vi: "học theo khung câu" },
          { en: "take notes in English", vi: "ghi chú bằng tiếng Anh" },
          { en: "join English discussions", vi: "tham gia thảo luận tiếng Anh" },
        ],
      },
      {
        id: "purpose",
        labelVi: "Mục tiêu",
        placeholder: "build natural speaking reflexes...",
        options: [
          { en: "turn passive vocabulary into active speaking", vi: "biến từ vựng thụ động thành nói chủ động" },
          { en: "recognize connected speech effortlessly", vi: "nhận ra nối âm một cách tự nhiên" },
          { en: "communicate confidently at work", vi: "giao tiếp tự tin trong công việc" },
          { en: "express complex ideas simply", vi: "diễn đạt ý phức tạp một cách đơn giản" },
        ],
      },
    ],
  },
  {
    id: "fr-b2-1",
    cefrLevel: "B2",
    category: "Trình bày & Chốt ý",
    titleVi: "Nhấn mạnh bản chất vấn đề",
    patternEn: "From my perspective, the real challenge isn't [A], but [B].",
    meaningVi: "Theo góc nhìn của tôi, thách thức thực sự không phải là [A], mà là [B].",
    whenToUseVi: "Rất hiệu quả khi thuyết trình, viết bài luận hoặc tranh luận học thuật.",
    templateParts: ["From my perspective, the real challenge isn't ", ", but ", "."],
    slots: [
      {
        id: "notA",
        labelVi: "Không phải yếu tố A",
        placeholder: "knowing enough words...",
        options: [
          { en: "knowing enough vocabulary", vi: "biết đủ nhiều từ vựng" },
          { en: "finding study materials", vi: "tìm tài liệu học" },
          { en: "understanding written English", vi: "hiểu tiếng Anh viết" },
          { en: "having expensive tools", vi: "có công cụ đắt tiền" },
        ],
      },
      {
        id: "butB",
        labelVi: "Mà là yếu tố B",
        placeholder: "recalling phrases in real time...",
        options: [
          { en: "recalling the right phrases in real time", vi: "gọi ra đúng cụm từ ngay lúc nói" },
          { en: "training our ears to catch connected speech", vi: "luyện tai bắt được âm nối" },
          { en: "staying consistent every single day", vi: "duy trì sự đều đặn mỗi ngày" },
          { en: "bridging passive knowledge and active output", vi: "bắc cầu từ hiểu thụ động sang nói chủ động" },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// 3) TẠO BÀI GHÉP CÂU ĐỘNG TỪ CHÍNH BÀI NGHE ĐANG HỌC
// ---------------------------------------------------------------------------

export function buildDynamicChunkDrillsFromLesson(
  segments: ListeningSegment[],
  cefrLevel: CEFRLevel,
  topicTitle: string
): SentenceDrillItem[] {
  return segments.map((seg, idx) => {
    const words = seg.text.trim().split(/\s+/).filter(Boolean);
    const chunks: string[] = [];
    // Gom thành các cụm 2-3 từ tự nhiên
    for (let i = 0; i < words.length; ) {
      const remaining = words.length - i;
      const take = remaining <= 3 ? remaining : remaining === 4 ? 2 : 3;
      chunks.push(words.slice(i, i + take).join(" "));
      i += take;
    }
    const keywords = words
      .map((w) => w.replace(/[^a-zA-Z']/g, "").toLowerCase())
      .filter((w) => w.length >= 4)
      .slice(0, 4);

    return {
      id: `lesson-sb-${cefrLevel}-${idx}`,
      cefrLevel,
      category: `Từ bài nghe: ${topicTitle}`,
      vietnameseIntent: `Nghe câu mẫu #${idx + 1} trong bài "${topicTitle}" rồi ghép lại đúng trật tự các cụm từ.`,
      englishTarget: seg.text,
      acceptedAlternatives: [seg.text],
      chunks,
      distractorChunks: [],
      formulaVi: `Câu gồm ${chunks.length} cụm nghĩa — bấm nghe mẫu trước nếu bạn cần định hình nhịp câu.`,
      viToEnTip: "Tập ghép theo cụm 2-3 từ thay vì từng từ lẻ giúp não nhớ cấu trúc câu nhanh gấp đôi.",
      keywords,
    };
  });
}

// ---------------------------------------------------------------------------
// 4) BỘ PHÁT HIỆN LỖI DỊCH TỪNG CHỮ KIỂU VIỆT (VIETLISH DETECTOR)
// ---------------------------------------------------------------------------

const VIETLISH_RULES: { regex: RegExp; issue: VietlishIssue }[] = [
  {
    regex: /\bi\s+am\s+agree\b/i,
    issue: {
      patternLabel: "I am agree",
      explanationVi: "'Agree' đã là động từ thường, không đi kèm 'am/is/are'.",
      fixSuggestion: "Dùng: 'I agree' hoặc 'I see your point'.",
    },
  },
  {
    regex: /\bvery\s+like\b/i,
    issue: {
      patternLabel: "very like",
      explanationVi: "Không đặt 'very' trước động từ 'like'.",
      fixSuggestion: "Dùng: 'really like' hoặc 'like ... very much'.",
    },
  },
  {
    regex: /\bgo\s+to\s+home\b/i,
    issue: {
      patternLabel: "go to home",
      explanationVi: "'Home' là trạng từ chỉ nơi chốn nên không dùng 'to' trước nó.",
      fixSuggestion: "Dùng: 'go home'.",
    },
  },
  {
    regex: /\b(because|although|even though)\b.*\b(so|but)\b/i,
    issue: {
      patternLabel: "because...so / although...but",
      explanationVi: "Tiếng Việt hay nói 'vì...nên...' hoặc 'tuy...nhưng...', nhưng tiếng Anh chỉ giữ MỘT từ nối trong câu.",
      fixSuggestion: "Chỉ dùng 'because' HOẶC 'so'; 'although' HOẶC 'but'.",
    },
  },
  {
    regex: /\b(no|not)\s+(know|have|like|want|understand)\b/i,
    issue: {
      patternLabel: "no/not + động từ thường",
      explanationVi: "Phủ định động từ thường ở hiện tại cần trợ động từ 'don't / doesn't'.",
      fixSuggestion: "Dùng: 'I don't know / I don't have / I don't understand'.",
    },
  },
  {
    regex: /\baccording\s+to\s+me\b/i,
    issue: {
      patternLabel: "According to me",
      explanationVi: "Người bản xứ không dùng 'According to me' cho ý kiến của chính mình.",
      fixSuggestion: "Dùng: 'In my opinion' hoặc 'From my perspective'.",
    },
  },
  {
    regex: /\bdo\s+you\s+(free|tired|busy|ready|sure)\b/i,
    issue: {
      patternLabel: "Do you + tính từ",
      explanationVi: "Với tính từ (free, tired, busy...), câu hỏi phải dùng 'Are you...?' thay vì 'Do you...?'.",
      fixSuggestion: "Dùng: 'Are you free / busy / ready...?'",
    },
  },
  {
    regex: /\blisten\s+(music|english|podcast)\b/i,
    issue: {
      patternLabel: "listen + danh từ (thiếu 'to')",
      explanationVi: "Động từ 'listen' luôn cần giới từ 'to' trước đối tượng được nghe.",
      fixSuggestion: "Dùng: 'listen to music / listen to English'.",
    },
  },
];

export function detectVietlishIssues(text: string): VietlishIssue[] {
  return VIETLISH_RULES.filter((r) => r.regex.test(text)).map((r) => r.issue);
}

// ---------------------------------------------------------------------------
// 5) CHẤM ĐIỂM GHÉP KHỐI & TỰ DIỄN ĐẠT CHỦ ĐỘNG
// ---------------------------------------------------------------------------

function normalizeSentence(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"'()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function evaluateChunkAssembly(
  drill: SentenceDrillItem,
  selectedChunks: string[]
): {
  isExact: boolean;
  accuracyPercent: number;
  assembledSentence: string;
  xpEarned: number;
  feedbackVi: string;
} {
  const assembled = selectedChunks.join(" ").trim();
  const normAssembled = normalizeSentence(assembled);
  const candidates = [drill.englishTarget, ...drill.acceptedAlternatives];

  const isExact = candidates.some((c) => normalizeSentence(c) === normAssembled);

  let bestAcc = 0;
  for (const cand of candidates) {
    const nc = normalizeSentence(cand);
    const maxLen = Math.max(nc.length, normAssembled.length, 1);
    const dist = computeLevenshteinDistance(nc, normAssembled);
    const acc = Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));
    if (acc > bestAcc) bestAcc = acc;
  }

  return {
    isExact,
    accuracyPercent: isExact ? 100 : bestAcc,
    assembledSentence: assembled,
    xpEarned: isExact ? 15 : bestAcc >= 80 ? 8 : 0,
    feedbackVi: isExact
      ? "Chuẩn xác! Bạn đã ghép đúng cấu trúc câu tự nhiên như người bản xứ."
      : `Gần đúng rồi (${bestAcc}%). Hãy kiểm tra lại trật tự các cụm từ và xem gợi ý khung câu bên dưới.`,
  };
}

export function evaluateFreeSentenceProduction(
  userText: string,
  drill: SentenceDrillItem
): SentenceEvaluationResult {
  const normUser = normalizeSentence(userText);
  const userTokens = new Set(normUser.split(" ").filter(Boolean));
  const vietlishIssues = detectVietlishIssues(userText);

  const matchedKeywords = drill.keywords.filter((kw) => userTokens.has(kw.toLowerCase()));
  const missingKeywords = drill.keywords.filter((kw) => !userTokens.has(kw.toLowerCase()));
  const keywordScore =
    drill.keywords.length > 0 ? (matchedKeywords.length / drill.keywords.length) * 100 : 70;

  const candidates = [drill.englishTarget, ...drill.acceptedAlternatives];
  let bestSim = 0;
  let bestReference = drill.englishTarget;

  for (const cand of candidates) {
    const nc = normalizeSentence(cand);
    const maxLen = Math.max(nc.length, normUser.length, 1);
    const dist = computeLevenshteinDistance(nc, normUser);
    const sim = Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));
    if (sim > bestSim) {
      bestSim = sim;
      bestReference = cand;
    }
  }

  const penalty = Math.min(25, vietlishIssues.length * 12);
  const rawScore = Math.round(bestSim * 0.6 + keywordScore * 0.4 - penalty);
  const score = Math.max(0, Math.min(100, rawScore));
  const passed = score >= 70 && vietlishIssues.length === 0;

  let feedbackVi = "";
  if (score >= 88 && vietlishIssues.length === 0) {
    feedbackVi = "Tuyệt vời! Bạn đã tự diễn đạt ý tiếng Việt sang tiếng Anh rất tự nhiên và đúng cấu trúc.";
  } else if (passed) {
    feedbackVi = "Rất khá! Ý nghĩa đã rõ ràng. Xem câu mẫu bên dưới để mài giũa cho tự nhiên hơn nữa.";
  } else if (vietlishIssues.length > 0) {
    feedbackVi = "Câu của bạn có một lỗi dịch sát kiểu Việt (xem mục sửa bên dưới) — sửa xong là chuẩn ngay!";
  } else {
    feedbackVi = "Bạn đang đi đúng hướng! Hãy thử bổ sung các từ khóa còn thiếu hoặc đối chiếu với khung câu gợi ý.";
  }

  return {
    score,
    passed,
    xpEarned: passed ? 20 : score >= 50 ? 8 : 2,
    matchedKeywords,
    missingKeywords,
    bestReference,
    vietlishIssues,
    feedbackVi,
  };
}

// ---------------------------------------------------------------------------
// 6) LƯU TIẾN ĐỘ LOCALSTORAGE
// ---------------------------------------------------------------------------

const STORAGE_KEY = "ef_sentence_builder_progress_v1";

export function loadSentenceBuilderProgress(): SentenceBuilderProgress {
  if (typeof window === "undefined") {
    return { completedDrillIds: [], totalXp: 0, streakCorrect: 0, updatedAt: "" };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedDrillIds: [], totalXp: 0, streakCorrect: 0, updatedAt: "" };
    return JSON.parse(raw);
  } catch (_) {
    return { completedDrillIds: [], totalXp: 0, streakCorrect: 0, updatedAt: "" };
  }
}

export function saveSentenceBuilderProgress(progress: SentenceBuilderProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...progress, updatedAt: new Date().toISOString() })
  );
}
