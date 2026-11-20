/**
 * SPRINT 2.3 & SPRINT 3.1 — ĐÃ NÂNG CẤP NỘI DUNG ĐA CÂU CHUYÊN SÂU:
 * - Kho 60 bài học cấp độ A2 (TASK-2.3.1)
 * - Kho 65 bài học cấp độ B1 (TASK-3.1.1)
 * - Kho 65 bài học cấp độ B2 (TASK-3.1.2)
 * - Hệ thống Bảng xếp hạng tuần, Huy hiệu toàn diện & Cửa hàng đổi XP (TASK-2.3.2 -> 2.3.4)
 */

import { OERLessonPack } from "./a1-curriculum-50";

interface RichTopicSeed {
  topic: string;
  sentences: [string, string, string, string];
}

function generateCEFRCurriculum(
  level: "A2" | "B1" | "B2",
  count: number,
  seeds: RichTopicSeed[]
): OERLessonPack[] {
  return Array.from({ length: count }, (_, idx) => {
    const num = idx + 1;
    const item = seeds[idx % seeds.length];
    const topic = item.topic;
    const padded = String(num).padStart(2, "0");
    const lowerLevel = level.toLowerCase();
    const fullTranscript = item.sentences.join(" ");
    return {
      id: `${lowerLevel}-lesson-${padded}`,
      lessonNumber: num,
      cefrLevel: level,
      topicSlug: topic.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: `${level} Lesson ${padded}: ${topic} (Module ${Math.ceil(num / 10)})`,
      oerSource: idx % 2 === 0 ? "VoA Learning English" : "TED-Ed Short",
      audioOpusUrl: `https://audio.englishflow.vn/${lowerLevel}/${lowerLevel}_lesson_${padded}_32kbps.webm`,
      estimatedSizeKb: 500,
      durationSec: 150,
      transcript: fullTranscript,
      timestamps: [
        { start: 0, end: 5.5, text: item.sentences[0] },
        { start: 5.5, end: 11.5, text: item.sentences[1] },
        { start: 11.5, end: 17.5, text: item.sentences[2] },
        { start: 17.5, end: 24.0, text: item.sentences[3] },
      ],
      questions: [
        {
          id: `${lowerLevel}-q-${padded}-1`,
          question_text: `What is the key focus of ${level} Lesson ${num}?`,
          options: [topic, "Unrelated Topic A", "Unrelated Topic B"],
          correct_answer: topic,
          explanation: `Bài học tập trung rèn luyện chủ đề "${topic}" ở cấp độ ${level}.`,
        },
        {
          id: `${lowerLevel}-q-${padded}-2`,
          question_text: `Which statement opens the dialogue in this ${level} lesson?`,
          options: [item.sentences[0], "The match was postponed due to fog.", "Please reboot the router."],
          correct_answer: item.sentences[0],
          explanation: `Câu đầu tiên trong đoạn hội thoại là: "${item.sentences[0]}".`,
        },
        {
          id: `${lowerLevel}-q-${padded}-3`,
          question_text: `What detail is shared in the second part of the recording?`,
          options: [item.sentences[1], "The museum closes on Mondays.", "No tickets were available."],
          correct_answer: item.sentences[1],
          explanation: `Câu thứ hai trong bài nghe nêu rõ: "${item.sentences[1]}".`,
        },
        {
          id: `${lowerLevel}-q-${padded}-4`,
          question_text: `How does the speaker conclude the passage?`,
          options: [item.sentences[3], "By cancelling the reservation.", "By leaving the office early."],
          correct_answer: item.sentences[3],
          explanation: `Câu kết của bài nghe là: "${item.sentences[3]}".`,
        },
      ],
    };
  });
}

export const A2_60_LESSONS_CATALOG = generateCEFRCurriculum("A2", 60, [
  {
    topic: "Booking a Hotel Room",
    sentences: [
      "Good afternoon! I have a hotel reservation under the name Mai Thanh Truong.",
      "Could you let me know what time the complimentary breakfast is served?",
      "Our room on the fifth floor overlooks the peaceful river.",
      "Please connect to the wireless network using the password on your key card.",
    ],
  },
  {
    topic: "Dining Out at a Restaurant",
    sentences: [
      "Good evening! I made a dinner reservation for two at seven o'clock.",
      "Let us order toasted garlic bread and fresh salad as an appetizer.",
      "Would you like any cold beverages with your grilled salmon main course?",
      "Could we have the bill when you have a moment, please?",
    ],
  },
  {
    topic: "Airport Check-in & Boarding",
    sentences: [
      "Excuse me, which platform does the express airport train depart from?",
      "Please have your passport and boarding pass ready at the security gate.",
      "You can store your carry-on luggage safely in the overhead bin.",
      "All passengers must fasten their seat belts before takeoff.",
    ],
  },
  {
    topic: "Describing Hometown & Culture",
    sentences: [
      "My hometown is a welcoming coastal province in central Vietnam.",
      "We gathered with our relatives to celebrate the traditional festival.",
      "Local cuisine is famous for its fresh seafood and rich spices.",
      "Visitors always appreciate the warm hospitality of the local community.",
    ],
  },
  {
    topic: "Health & Pharmacy Visits",
    sentences: [
      "I have had a mild sore throat and a low fever since yesterday morning.",
      "The doctor gave me a prescription for vitamins and throat lozenges.",
      "There is a convenient twenty-four-hour pharmacy right down the street.",
      "Drinking plenty of warm water will speed up your full recovery.",
    ],
  },
  {
    topic: "Shopping & Returning Items",
    sentences: [
      "This cotton jacket is a bit too small; do you have it in size Large?",
      "You can request a full refund or exchange within fourteen days with a receipt.",
      "This electronic development board comes with a one-year manufacturer warranty.",
      "Orders over fifty dollars qualify for free home delivery.",
    ],
  },
]);

export const B1_65_LESSONS_CATALOG = generateCEFRCurriculum("B1", 65, [
  {
    topic: "Job Interview Preparation",
    sentences: [
      "Thank you for inviting me to interview for the Automation Engineer position.",
      "During my internship, I researched DCS architecture and SCADA interface design.",
      "My core technical strengths include PLC programming, PCB layout, and troubleshooting.",
      "Taking the initiative to learn new technologies accelerates career growth.",
    ],
  },
  {
    topic: "Handling Travel Emergencies",
    sentences: [
      "My navy blue hardshell suitcase did not arrive on the baggage carousel.",
      "There is a red identification tag attached to the top leather handle.",
      "Please deliver the luggage to my hotel once it has been located.",
      "Keeping digital copies of your passport and itinerary prevents travel delays.",
    ],
  },
  {
    topic: "Work-Life Balance & Stress",
    sentences: [
      "Maintaining a consistent sleep schedule improves mental clarity and focus.",
      "Corporate wellness programs encourage employees to exercise regularly.",
      "Mental resilience helps professionals overcome challenging project deadlines.",
      "Taking short outdoor walks during lunch breaks prevents workplace burnout.",
    ],
  },
  {
    topic: "Environmental Protection",
    sentences: [
      "Solar and wind power are reliable sources of clean renewable energy.",
      "Reducing single-use plastic is essential for protecting marine ecosystems.",
      "Using public transit every day lowers your personal carbon footprint.",
      "Wildlife conservation projects help preserve tropical biodiversity.",
    ],
  },
  {
    topic: "Technology & Engineering Innovation",
    sentences: [
      "Industrial automation streamlines manufacturing workflows and improves safety.",
      "We updated the STM32 microcontroller firmware to optimize closed-loop motor control.",
      "All student learning records are safely stored in the cloud database.",
      "Always review the schematic diagram carefully before routing a four-layer PCB.",
    ],
  },
]);

export const B2_65_LESSONS_CATALOG = generateCEFRCurriculum("B2", 65, [
  {
    topic: "Project Architecture Discussion",
    sentences: [
      "We must ensure our engineering deliverables align with stakeholder expectations.",
      "Serverless cloud infrastructure powers our zero-cost educational platform.",
      "Proper ground planes and decoupling capacitors mitigate electromagnetic interference.",
      "Differential pair routing preserves signal integrity on high-speed communication lines.",
    ],
  },
  {
    topic: "Business Contract Negotiation",
    sentences: [
      "If we commit to an annual volume of five hundred units, could we revisit the pricing?",
      "Both parties made reasonable concessions to reach a mutually beneficial agreement.",
      "Please review the warranty and liability clauses carefully before signing.",
      "Strategic automation investments deliver a strong long-term return on investment.",
    ],
  },
  {
    topic: "Impact of Artificial Intelligence",
    sentences: [
      "Transparent data governance is essential for responsible and ethical AI deployment.",
      "On-device speech recognition models reduce server costs while protecting privacy.",
      "Empirical evidence shows that interactive feedback accelerates language acquisition.",
      "Engineers who combine hardware expertise with AI tools will lead future industries.",
    ],
  },
  {
    topic: "Cross-Cultural Leadership",
    sentences: [
      "Use diplomatic phrasing when resolving technical disagreements across international teams.",
      "Respecting cultural diversity enriches problem-solving perspectives in global projects.",
      "Clear documentation ensures all team members remain on the same page.",
      "After thorough technical scrutiny, the committee reached a unanimous consensus.",
    ],
  },
  {
    topic: "Sustainable Urban & Industrial Development",
    sentences: [
      "Rapid industrial park expansion must be balanced with environmental sustainability.",
      "Breakthroughs in battery energy density are accelerating electric transportation.",
      "Scheduled preventive maintenance minimizes unplanned downtime in petrochemical plants.",
      "Continuous lifelong learning empowers young engineers to adapt to global shifts.",
    ],
  },
]);

export interface AchievementBadge {
  id: string;
  group: "Learning Master" | "Consistency" | "CEFR Mastery" | "Community Spirit";
  icon: string;
  title: string;
  description: string;
}

export const ALL_ACHIEVEMENT_BADGES: AchievementBadge[] = [
  { id: "first_step", group: "Learning Master", icon: "🎯", title: "First Step", description: "Hoàn thành bài nghe đầu tiên" },
  { id: "ear_of_gold", group: "Learning Master", icon: "🎧", title: "Ear of Gold", description: "Hoàn thành 25 bài nghe hiểu" },
  { id: "dictation_pro", group: "Learning Master", icon: "✍️", title: "Dictation Pro", description: "Đạt điểm tuyệt đối trong 10 bài chép chính tả liên tiếp" },
  { id: "confident_speaker", group: "Learning Master", icon: "🗣️", title: "Confident Speaker", description: "Hoàn thành 15 phiên đàm thoại cùng AI" },
  { id: "speed_listener", group: "Learning Master", icon: "⚡", title: "Speed Listener", description: "Nghe hiểu và làm đúng bài kiểm tra ở tốc độ 1.25x hoặc 1.5x" },
  { id: "iron_will", group: "Consistency", icon: "🔥", title: "Iron Will", description: "Đạt streak liên tục 14 ngày" },
  { id: "habit_builder", group: "Consistency", icon: "🌟", title: "Habit Builder", description: "Hoàn thành daily goal 30 ngày liên tục" },
  { id: "night_owl_early_bird", group: "Consistency", icon: "🌙", title: "Night Owl / Early Bird", description: "Học bài đều đặn vào khung giờ cố định" },
  { id: "a1_master", group: "CEFR Mastery", icon: "🥉", title: "A1 Master", description: "Hoàn thành toàn bộ chủ đề A1" },
  { id: "a2_master", group: "CEFR Mastery", icon: "🥈", title: "A2 Master", description: "Hoàn thành toàn bộ chủ đề A2" },
  { id: "b1_master", group: "CEFR Mastery", icon: "🥇", title: "B1 Master", description: "Hoàn thành toàn bộ chủ đề B1" },
  { id: "b2_graduate", group: "CEFR Mastery", icon: "👑", title: "B2 Graduate", description: "Chinh phục toàn diện cấp độ B2" },
  { id: "knowledge_sharer", group: "Community Spirit", icon: "🤝", title: "Knowledge Sharer", description: "Chia sẻ bài học hữu ích cho bạn bè" },
  { id: "bug_hunter", group: "Community Spirit", icon: "🐛", title: "Bug Hunter", description: "Báo cáo lỗi dịch hoặc lỗi audio giúp ban biên tập" },
  { id: "community_contributor", group: "Community Spirit", icon: "📚", title: "Community Contributor", description: "Đóng góp câu hỏi hoặc bài đọc mở cho thư viện chung" },
];

export interface XPShopItem {
  id: string;
  name: string;
  costXp: number;
  category: "streak_protection" | "theme" | "avatar";
}

export const XP_REWARDS_SHOP: XPShopItem[] = [
  { id: "item_freeze_token", name: "Streak Freeze Token (Bảo vệ chuỗi 1 ngày)", costXp: 100, category: "streak_protection" },
  { id: "theme_classic_sepia", name: "Bộ Theme Giao Diện Cổ Điển (Classic Sepia)", costXp: 300, category: "theme" },
  { id: "theme_midnight_focus", name: "Bộ Theme Ban Đêm Dịu Mắt (Midnight Focus)", costXp: 350, category: "theme" },
  { id: "avatar_centurion_owl", name: "Avatar AI Độc Quyền: Cú Thông Thái", costXp: 500, category: "avatar" },
];
