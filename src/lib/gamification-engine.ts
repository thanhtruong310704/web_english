/**
 * SPRINT 1.4 (TASK-1.4.1 -> TASK-1.4.6):
 * Hệ Thống Gamification Công Bằng, Không Dùng Tiền Mua Hạng & Onboarding Không Rào Cản
 * Căn cứ chính xác theo: Kế Hoạch Chi Tiết Web Học Tiếng Anh.md (dòng 117-202, 380-396)
 */

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "Master";

export type ActivityType =
  | "listening_comprehension"
  | "dictation"
  | "shadowing"
  | "minimal_pairs"
  | "ai_conversation";

export interface DailyGoalOption {
  id: "casual" | "regular" | "serious" | "intense";
  label: string;
  minutes: 5 | 15 | 30 | 60;
  durationDisplay: string;
  recommendedVolume: string;
  targetAudience: string;
}

/**
 * TASK-1.4.6: 4 chế độ mục tiêu học mỗi ngày theo đúng bảng trong kế hoạch (dòng 195-201)
 */
export const DAILY_GOAL_MODES: DailyGoalOption[] = [
  {
    id: "casual",
    label: "Khởi động (Casual)",
    minutes: 5,
    durationDisplay: "5 phút/ngày",
    recommendedVolume: "1 bài nghe ngắn hoặc 1 drill phát âm",
    targetAudience: "Người bận rộn, duy trì thói quen",
  },
  {
    id: "regular",
    label: "Tiêu chuẩn (Regular)",
    minutes: 15,
    durationDisplay: "15 phút/ngày",
    recommendedVolume: "2 bài nghe + 1 bài đàm thoại AI",
    targetAudience: "Học sinh, sinh viên, người đi làm",
  },
  {
    id: "serious",
    label: "Tập trung (Serious)",
    minutes: 30,
    durationDisplay: "30 phút/ngày",
    recommendedVolume: "4 bài đa dạng kỹ năng (Nghe + Nói + Chép)",
    targetAudience: "Muốn bứt phá trình độ nhanh",
  },
  {
    id: "intense",
    label: "Chinh phục (Intense)",
    minutes: 60,
    durationDisplay: "45–60 phút/ngày",
    recommendedVolume: "Hoàn thành trọn bộ 1 Topic",
    targetAudience: "Ôn thi chứng chỉ, du học, định cư",
  },
];

/**
 * TASK-1.4.3: Bảng điểm XP chuẩn theo kế hoạch (dòng 123-140)
 * - Khởi đầu: Level A1 (0 XP) | A2: 500 XP | B1: 1,500 XP | B2: 3,000 XP | Master (C1 Proficiency): 6,000 XP
 * - Listening Comprehension: +15 XP
 * - Dictation (đạt >= 85%): +20 XP
 * - Shadowing: +15 XP
 * - Minimal Pairs / Phát âm chuẩn: +10 XP
 * - Hoàn thành 1 phiên hội thoại với AI (>= 5 lượt): +30 XP
 * - Đạt mục tiêu học hàng ngày (Daily Goal): +15 XP thưởng
 * - Thưởng duy trì chuỗi học (Mỗi 7 ngày liên tiếp): +70 XP
 * - Bài học đạt điểm tuyệt đối (100% Accuracy): +25% bonus XP
 */
export const BASE_XP_BY_ACTIVITY: Record<ActivityType, number> = {
  listening_comprehension: 15,
  dictation: 20,
  shadowing: 15,
  minimal_pairs: 10,
  ai_conversation: 30,
};

export function calculateActivityXP(activity: ActivityType, accuracyPercent: number): number {
  const base = BASE_XP_BY_ACTIVITY[activity];
  const bonus = accuracyPercent === 100 ? Math.round(base * 0.25) : 0;
  return base + bonus;
}

export function determineCEFRLevelFromXP(totalXp: number): CEFRLevel {
  if (totalXp >= 6000) return "Master";
  if (totalXp >= 3000) return "B2";
  if (totalXp >= 1500) return "B1";
  if (totalXp >= 500) return "A2";
  return "A1";
}

/**
 * TASK-1.4.4 & TASK-1.4.5:
 * Streak & Streak Freeze Token (dòng 144-161):
 * - Đổi Token trong Cửa Hàng XP: 100 XP / 1 Token (Giữ tối đa 3 Token)
 * - Tặng miễn phí 1 Token mỗi khi duy trì chuỗi đạt mốc 7 ngày, 14 ngày, 30 ngày
 * - Mốc vinh danh Streak:
 *   + 7 ngày: Huy hiệu "Week Warrior" + Thưởng 50 XP + 1 Streak Freeze Token (+ 70 XP thưởng chu kỳ mỗi 7 ngày)
 *   + 30 ngày: Huy hiệu "Monthly Champion" + Mở khóa Bộ Theme giao diện Cổ Điển + 1 Freeze Token
 *   + 100 ngày: Danh hiệu "Centurion" + Mở khóa Avatar AI độc quyền + 3 Freeze Tokens
 *   + 365 ngày: Ghi danh vào Bảng Vàng Danh Dự (Hall of Fame) + Huy hiệu Hoàng Kim vĩnh viễn
 */
export interface UserStreakState {
  currentStreak: number;
  longestStreak: number;
  freezeTokens: number;
  totalXp: number;
  unlockedBadges: string[];
  unlockedThemes: string[];
  unlockedAvatars: string[];
  inHallOfFame: boolean;
}

export const STREAK_MILESTONES_TABLE = [
  {
    streakDays: 7,
    badge: "Week Warrior",
    rewardDescription: 'Huy hiệu "Week Warrior" + Thưởng 50 XP + 1 Streak Freeze Token',
    milestoneBonusXp: 50,
    recurring7DayXp: 70,
    freeTokensGranted: 1,
  },
  {
    streakDays: 30,
    badge: "Monthly Champion",
    rewardDescription: 'Huy hiệu "Monthly Champion" + Mở khóa Bộ Theme giao diện Cổ Điển',
    milestoneBonusXp: 0,
    recurring7DayXp: 0,
    freeTokensGranted: 1,
    unlockTheme: "classic_sepia",
  },
  {
    streakDays: 100,
    badge: "Centurion",
    rewardDescription: 'Danh hiệu "Centurion" + Mở khóa Avatar AI độc quyền + 3 Freeze Tokens',
    milestoneBonusXp: 0,
    recurring7DayXp: 0,
    freeTokensGranted: 3,
    unlockAvatar: "centurion_ai_avatar",
  },
  {
    streakDays: 365,
    badge: "Hall of Fame",
    rewardDescription: "Ghi danh vào Bảng Vàng Danh Dự (Hall of Fame) + Huy hiệu Hoàng Kim vĩnh viễn",
    milestoneBonusXp: 0,
    recurring7DayXp: 0,
    freeTokensGranted: 0,
    hallOfFame: true,
  },
];

export function exchangeXPForFreezeToken(state: UserStreakState): {
  success: boolean;
  message: string;
  nextState: UserStreakState;
} {
  if (state.freezeTokens >= 3) {
    return {
      success: false,
      message: "Kho cá nhân chỉ giữ tối đa 3 Streak Freeze Tokens.",
      nextState: state,
    };
  }
  if (state.totalXp < 100) {
    return {
      success: false,
      message: "Cần tối thiểu 100 XP để đổi 1 Streak Freeze Token.",
      nextState: state,
    };
  }
  return {
    success: true,
    message: "Đã đổi thành công 1 Streak Freeze Token (-100 XP)!",
    nextState: {
      ...state,
      totalXp: state.totalXp - 100,
      freezeTokens: state.freezeTokens + 1,
    },
  };
}

export function recordDailyLessonCompletion(
  state: UserStreakState,
  missedYesterday: boolean
): UserStreakState {
  let nextStreak = state.currentStreak;
  let nextTokens = state.freezeTokens;
  let nextXp = state.totalXp;
  const badges = new Set(state.unlockedBadges);
  const themes = new Set(state.unlockedThemes);
  const avatars = new Set(state.unlockedAvatars);
  let inHallOfFame = state.inHallOfFame;

  if (missedYesterday) {
    if (nextTokens > 0) {
      nextTokens -= 1; // Tự động dùng 1 Freeze Token bảo vệ chuỗi
      nextStreak += 1;
    } else {
      nextStreak = 1;
    }
  } else {
    nextStreak += 1;
  }

  // Thưởng duy trì chuỗi học mỗi 7 ngày liên tiếp: +70 XP (dòng 138)
  if (nextStreak % 7 === 0) {
    nextXp += 70;
  }

  // Mốc 7 ngày: Huy hiệu "Week Warrior" + Thưởng 50 XP + 1 Streak Freeze Token (dòng 150, 157)
  if (nextStreak === 7) {
    badges.add("Week Warrior");
    nextXp += 50;
    nextTokens = Math.min(3, nextTokens + 1);
  }

  // Mốc 14 ngày: Huy hiệu "Iron Will" + Tặng miễn phí 1 Token (dòng 150, 174)
  if (nextStreak === 14) {
    badges.add("Iron Will");
    nextTokens = Math.min(3, nextTokens + 1);
  }

  // Mốc 30 ngày: Huy hiệu "Monthly Champion" + Mở khóa Bộ Theme giao diện Cổ Điển + 1 Token (dòng 150, 158)
  if (nextStreak === 30) {
    badges.add("Monthly Champion");
    themes.add("classic_sepia");
    nextTokens = Math.min(3, nextTokens + 1);
  }

  // Mốc 100 ngày: Danh hiệu "Centurion" + Mở khóa Avatar AI độc quyền + 3 Freeze Tokens (dòng 159)
  if (nextStreak === 100) {
    badges.add("Centurion");
    avatars.add("centurion_ai_avatar");
    nextTokens = 3; // Tối đa 3 Freeze Tokens trong kho
  }

  // Mốc 365 ngày: Bảng Vàng Danh Dự (Hall of Fame) + Huy hiệu Hoàng Kim vĩnh viễn (dòng 160)
  if (nextStreak >= 365) {
    badges.add("Hall of Fame");
    badges.add("Golden Eternal Badge");
    inHallOfFame = true;
  }

  return {
    currentStreak: nextStreak,
    longestStreak: Math.max(state.longestStreak, nextStreak),
    freezeTokens: nextTokens,
    totalXp: nextXp,
    unlockedBadges: Array.from(badges),
    unlockedThemes: Array.from(themes),
    unlockedAvatars: Array.from(avatars),
    inHallOfFame,
  };
}

/**
 * Chỉ số Đo lường & Đánh giá Tác động Giáo dục (dòng 380-396 trong kế hoạch)
 * Loại bỏ toàn bộ chỉ số thương mại (MRR, Churn, LTV, Paywall); tập trung 100% vào hiệu quả học tập
 */
export type LearningAnalyticsEventName =
  | "lesson_started"
  | "lesson_completed"
  | "pronunciation_drilled"
  | "conversation_turn_reached"
  | "streak_milestone_unlocked";

export interface LearningAnalyticsEvent {
  event: LearningAnalyticsEventName;
  payload: Record<string, string | number | boolean>;
  timestamp: string;
}

export const COMMUNITY_EDUCATION_KPIS = {
  d7RetentionTargetPercent: 45,          // Tỷ lệ gắn bó ngày thứ 7 >= 45%
  firstLessonCompletionTargetPercent: 75, // Tỷ lệ hoàn thành bài học đầu tiên >= 75%
  avgDailyLearningMinutes: "15–20 phút/người học/ngày",
  npsTargetScore: 65,                    // NPS >= +65 điểm từ cộng đồng
};

export function trackLearningEvent(
  event: LearningAnalyticsEventName,
  payload: Record<string, string | number | boolean> = {}
): LearningAnalyticsEvent {
  const entry: LearningAnalyticsEvent = {
    event,
    payload,
    timestamp: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(window.localStorage.getItem("ef_learning_analytics") || "[]");
      existing.push(entry);
      window.localStorage.setItem("ef_learning_analytics", JSON.stringify(existing.slice(-200)));
    } catch (_) {}
  }
  return entry;
}

/**
 * TASK-1.4.2: Bộ bài kiểm tra đầu vào Placement Test 20 câu thực tế phân loại A1 -> B2
 */
export interface PlacementQuestion {
  id: number;
  targetLevel: "A1" | "A2" | "B1" | "B2";
  question: string;
  options: string[];
  answer: string;
}

export const PLACEMENT_TEST_20_QUESTIONS: PlacementQuestion[] = [
  // Cấp A1 (Câu 1 - 5)
  { id: 1, targetLevel: "A1", question: "Hello! My name ___ Minh. I am from Vietnam.", options: ["am", "is", "are", "be"], answer: "is" },
  { id: 2, targetLevel: "A1", question: "___ you like drinking coffee in the morning?", options: ["Are", "Do", "Does", "Is"], answer: "Do" },
  { id: 3, targetLevel: "A1", question: "She usually ___ up at 6:30 AM every day.", options: ["wake", "wakes", "waking", "to wake"], answer: "wakes" },
  { id: 4, targetLevel: "A1", question: "Where is the bank? — It is ___ to the post office.", options: ["near", "next", "between", "under"], answer: "next" },
  { id: 5, targetLevel: "A1", question: "There are four ___ in my family.", options: ["person", "peoples", "people", "mans"], answer: "people" },
  // Cấp A2 (Câu 6 - 10)
  { id: 6, targetLevel: "A2", question: "I ___ a wonderful movie with my best friend last night.", options: ["watch", "watched", "have watched", "watching"], answer: "watched" },
  { id: 7, targetLevel: "A2", question: "Could I have the ___ please? I would like to pay for dinner.", options: ["menu", "bill", "recipe", "ticket"], answer: "bill" },
  { id: 8, targetLevel: "A2", question: "This blue jacket is ___ than the black one.", options: ["cheap", "cheaper", "more cheap", "cheapest"], answer: "cheaper" },
  { id: 9, targetLevel: "A2", question: "What ___ you doing when it started to rain yesterday?", options: ["did", "were", "was", "are"], answer: "were" },
  { id: 10, targetLevel: "A2", question: "You ___ bring an umbrella because the sky looks very dark.", options: ["should", "would", "may", "need"], answer: "should" },
  // Cấp B1 (Câu 11 - 15)
  { id: 11, targetLevel: "B1", question: "If I ___ more free time this weekend, I would join your hiking trip.", options: ["have", "had", "will have", "would have"], answer: "had" },
  { id: 12, targetLevel: "B1", question: "She has worked as a software engineer at this company ___ 2021.", options: ["for", "since", "during", "from"], answer: "since" },
  { id: 13, targetLevel: "B1", question: "Learning English opens up many international career ___.", options: ["opportunities", "situations", "locations", "routines"], answer: "opportunities" },
  { id: 14, targetLevel: "B1", question: "The flight was delayed ___ the heavy fog at the airport.", options: ["because", "although", "due to", "despite"], answer: "due to" },
  { id: 15, targetLevel: "B1", question: "By the time we arrived at the station, the train ___ already left.", options: ["has", "was", "had", "did"], answer: "had" },
  // Cấp B2 (Câu 16 - 20)
  { id: 16, targetLevel: "B2", question: "___ the economic challenges, the community project achieved remarkable growth.", options: ["Despite", "Although", "Even though", "Whereas"], answer: "Despite" },
  { id: 17, targetLevel: "B2", question: "Remote work offers great flexibility; ___, it requires strong self-discipline.", options: ["moreover", "nevertheless", "therefore", "otherwise"], answer: "nevertheless" },
  { id: 18, targetLevel: "B2", question: "Had we known about the rate limit earlier, we ___ a multi-provider fallback.", options: ["will implement", "would implement", "would have implemented", "implemented"], answer: "would have implemented" },
  { id: 19, targetLevel: "B2", question: "The seminar moderator asked how artificial intelligence ___ interpersonal communication.", options: ["affects", "effects", "affection", "effective"], answer: "affects" },
  { id: 20, targetLevel: "B2", question: "Not only ___ cost-effective, but the open-source architecture is also highly scalable.", options: ["it is", "is it", "it was", "was it"], answer: "is it" },
];

export function evaluatePlacementTest(correctCount: number): "A1" | "A2" | "B1" | "B2" {
  if (correctCount >= 17) return "B2";
  if (correctCount >= 12) return "B1";
  if (correctCount >= 6) return "A2";
  return "A1";
}
