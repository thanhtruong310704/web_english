/**
 * SPRINT 2.1 (TASK-2.1.1 -> TASK-2.1.5):
 * Phòng Luyện Đối Thoại AI 2 Chiều (AI Conversation Room - $0 Stack)
 * - Luồng: Web Speech API -> Edge API -> Gemini 1.5 Flash / Groq Llama 3 -> Web SpeechSynthesis TTS
 * - System Prompt CEFR-Aware kèm khối sửa lỗi: "💡 Quick tip: [Giải thích ngắn bằng tiếng Việt]"
 * - Kho 20 kịch bản thực tế mở tự do 100%
 * - Fair-Use Rate Limiter: 15 lượt nói/phút/IP chống bot cào dữ liệu
 * - Lưu lịch sử hội thoại cục bộ vào IndexedDB / LocalStorage
 */

export interface ConversationScenario {
  id: string;
  cefrLevel: "A1" | "A2" | "B1" | "B2";
  title: string;
  aiPersona: string;
  goalDescription: string;
  openingGreeting: string;
  suggestedPhrases: string[];
}

export const CONVERSATION_SCENARIOS_20: ConversationScenario[] = [
  // A1 (5 kịch bản)
  {
    id: "scen-a1-01",
    cefrLevel: "A1",
    title: "Làm quen bạn mới tại lớp học",
    aiPersona: "Friendly classmate",
    goalDescription: "Chào hỏi, giới thiệu tên, quê quán và sở thích cá nhân",
    openingGreeting: "Hi there! I'm Alex. Is this your first day in the English class?",
    suggestedPhrases: ["Hi Alex, my name is...", "Yes, it is my first day.", "I am from Vietnam."],
  },
  {
    id: "scen-a1-02",
    cefrLevel: "A1",
    title: "Hỏi giờ và phương tiện công cộng",
    aiPersona: "Passerby on the street",
    goalDescription: "Hỏi giờ hiện tại và chuyến xe buýt tiếp theo",
    openingGreeting: "Excuse me! Do you need help finding the bus stop?",
    suggestedPhrases: ["What time is it now?", "When does bus number 8 arrive?", "Thank you so much!"],
  },
  {
    id: "scen-a1-03",
    cefrLevel: "A1",
    title: "Mua sắm tại cửa hàng tạp hóa",
    aiPersona: "Store cashier",
    goalDescription: "Hỏi giá trái cây, bánh mì và thanh toán",
    openingGreeting: "Good morning! Did you find everything you needed today?",
    suggestedPhrases: ["How much are these apples?", "I would like a loaf of bread.", "Can I pay by cash?"],
  },
  {
    id: "scen-a1-04",
    cefrLevel: "A1",
    title: "Giới thiệu các thành viên gia đình",
    aiPersona: "New neighbor",
    goalDescription: "Kể về số thành viên và nghề nghiệp trong gia đình",
    openingGreeting: "Welcome to the neighborhood! Do you live here with your family?",
    suggestedPhrases: ["There are four people in my family.", "My father is a teacher.", "We love this street."],
  },
  {
    id: "scen-a1-05",
    cefrLevel: "A1",
    title: "Hỏi thăm thời tiết cuối tuần",
    aiPersona: "Dormitory roommate",
    goalDescription: "Nói về thời tiết hôm nay và kế hoạch đi dạo công viên",
    openingGreeting: "Look outside! The sun is shining brightly today. Do you want to go out?",
    suggestedPhrases: ["It is warm and sunny.", "Let's walk in the park.", "Should I bring an umbrella?"],
  },
  // A2 (5 kịch bản)
  {
    id: "scen-a2-01",
    cefrLevel: "A2",
    title: "Đặt phòng và nhận phòng khách sạn",
    aiPersona: "Hotel receptionist",
    goalDescription: "Làm thủ tục check-in, hỏi giờ ăn sáng và mật khẩu Wi-Fi",
    openingGreeting: "Good afternoon! Welcome to Grand Lotus Hotel. How may I help you check in?",
    suggestedPhrases: ["I have a reservation under...", "What time is breakfast served?", "Could I have the Wi-Fi password?"],
  },
  {
    id: "scen-a2-02",
    cefrLevel: "A2",
    title: "Gọi món và thanh toán tại nhà hàng",
    aiPersona: "Waiter/Waitress",
    goalDescription: "Gọi 1 món chính, 1 đồ uống và yêu cầu hóa đơn",
    openingGreeting: "Good evening! Welcome to Bistro 24. Are you ready to order, or would you like a few more minutes?",
    suggestedPhrases: ["I'd like to have...", "Can I get an orange juice?", "Could we have the bill, please?"],
  },
  {
    id: "scen-a2-03",
    cefrLevel: "A2",
    title: "Hỏi đường đến cổng lên máy bay",
    aiPersona: "Airport information staff",
    goalDescription: "Kiểm tra cổng boarding và hướng dẫn đi qua khu an ninh",
    openingGreeting: "Hello! Welcome to the international terminal. May I see your boarding pass?",
    suggestedPhrases: ["Where is Gate B12?", "Is my flight on time?", "How long does it take to walk there?"],
  },
  {
    id: "scen-a2-04",
    cefrLevel: "A2",
    title: "Mô tả triệu chứng tại hiệu thuốc",
    aiPersona: "Pharmacist",
    goalDescription: "Nói về triệu chứng đau đầu, cảm nhẹ và hỏi liều dùng thuốc",
    openingGreeting: "Hello! How can I help you feel better today?",
    suggestedPhrases: ["I have had a headache since morning.", "Do you have medicine for a cold?", "How often should I take this?"],
  },
  {
    id: "scen-a2-05",
    cefrLevel: "A2",
    title: "Đổi trả quần áo không vừa size",
    aiPersona: "Clothing store assistant",
    goalDescription: "Đổi chiếc áo sang size lớn hơn cùng hóa đơn mua hàng",
    openingGreeting: "Hi there! How can I assist you with your purchase today?",
    suggestedPhrases: ["This shirt is a bit too small.", "Do you have this in size Large?", "Here is my receipt."],
  },
  // B1 (5 kịch bản)
  {
    id: "scen-b1-01",
    cefrLevel: "B1",
    title: "Phỏng vấn xin việc vòng giới thiệu",
    aiPersona: "HR interviewer",
    goalDescription: "Nêu kinh nghiệm làm việc, điểm mạnh và mục tiêu nghề nghiệp",
    openingGreeting: "Thanks for joining us today. Could you start by telling me a little about your background?",
    suggestedPhrases: ["I have two years of experience in...", "One of my key strengths is...", "I am eager to contribute to..."],
  },
  {
    id: "scen-b1-02",
    cefrLevel: "B1",
    title: "Xử lý sự cố thất lạc hành lý tại sân bay",
    aiPersona: "Baggage claim officer",
    goalDescription: "Miêu tả đặc điểm vali bị thất lạc và để lại địa chỉ nhận lại",
    openingGreeting: "I'm sorry to hear your luggage didn't arrive on the belt. Can you describe the suitcase for me?",
    suggestedPhrases: ["It is a medium-sized navy blue hardshell suitcase.", "It has a red name tag on the handle.", "Please deliver it to my hotel."],
  },
  {
    id: "scen-b1-03",
    cefrLevel: "B1",
    title: "Mở tài khoản ngân hàng cho du học sinh",
    aiPersona: "Bank advisor",
    goalDescription: "Hỏi về phí duy trì thẻ, dịch vụ mobile banking và giấy tờ cần thiết",
    openingGreeting: "Welcome to City Bank! Are you looking to open a student checking account today?",
    suggestedPhrases: ["Are there any monthly maintenance fees?", "I brought my passport and student ID.", "How do I activate mobile banking?"],
  },
  {
    id: "scen-b1-04",
    cefrLevel: "B1",
    title: "Thuê căn hộ và hỏi điều khoản hợp đồng",
    aiPersona: "Apartment landlord",
    goalDescription: "Hỏi về tiền đặt cọc, chi phí điện nước và quy định nuôi thú cưng",
    openingGreeting: "Here is the living room with a balcony view. What do you think of the apartment so far?",
    suggestedPhrases: ["Are utilities included in the monthly rent?", "How much is the security deposit?", "Is the lease for twelve months?"],
  },
  {
    id: "scen-b1-05",
    cefrLevel: "B1",
    title: "Báo cáo tiến độ công việc hàng tuần",
    aiPersona: "Team Lead",
    goalDescription: "Tóm tắt các hạng mục đã hoàn thành và đề xuất hỗ trợ kỹ thuật",
    openingGreeting: "Good morning! Let's do a quick sync on your tasks for this sprint. How is everything progressing?",
    suggestedPhrases: ["I have completed the main UI components.", "I ran into a minor blocker with...", "We are still on track for Friday."],
  },
  // B2 (5 kịch bản)
  {
    id: "scen-b2-01",
    cefrLevel: "B2",
    title: "Họp bàn giải pháp dự án cùng đồng nghiệp",
    aiPersona: "Senior Colleague",
    goalDescription: "Đưa ra ý kiến tối ưu hiệu năng, phản biện lịch sự và chốt deadline",
    openingGreeting: "We need to reduce page load time by 40% before launch. What approach do you think we should prioritize?",
    suggestedPhrases: ["From my perspective, caching at the edge will yield the fastest gain.", "I see your point, however...", "Let's align on a realistic timeline."],
  },
  {
    id: "scen-b2-02",
    cefrLevel: "B2",
    title: "Đàm phán và thuyết phục đối tác kinh doanh",
    aiPersona: "Business partner",
    goalDescription: "Thương lượng mức chiết khấu theo sản lượng và điều khoản thanh toán",
    openingGreeting: "We appreciate your proposal, though the unit pricing is slightly above our quarterly budget.",
    suggestedPhrases: ["If we commit to a twelve-month contract, could we revise the rate?", "This partnership offers mutual long-term value.", "Let's find a middle ground."],
  },
  {
    id: "scen-b2-03",
    cefrLevel: "B2",
    title: "Thuyết trình ý tưởng khởi nghiệp EdTech",
    aiPersona: "Social Impact Investor",
    goalDescription: "Trình bày sứ mệnh cộng đồng, kiến trúc $0 và tác động xã hội",
    openingGreeting: "Your zero-cost education platform sounds intriguing. How do you ensure long-term sustainability without paywalls?",
    suggestedPhrases: ["By leveraging browser-native AI and OER content, our marginal cost is near zero.", "Our retention metrics demonstrate strong organic growth.", "We maintain 100% financial transparency."],
  },
  {
    id: "scen-b2-04",
    cefrLevel: "B2",
    title: "Giải quyết khiếu nại khách hàng doanh nghiệp",
    aiPersona: "Enterprise Client Director",
    goalDescription: "Lắng nghe, nhận trách nhiệm chuyên nghiệp và đưa ra lộ trình khắc phục",
    openingGreeting: "The synchronization delay yesterday affected our afternoon reporting workflow. What steps are being taken?",
    suggestedPhrases: ["First, I sincerely apologize for the disruption.", "We have already deployed an automated failover mechanism.", "Here is our preventive action plan."],
  },
  {
    id: "scen-b2-05",
    cefrLevel: "B2",
    title: "Tranh biện học thuật về Trí Tuệ Nhân Tạo",
    aiPersona: "University Seminar Moderator",
    goalDescription: "Phân tích lợi ích và thách thức đạo đức của AI trong giáo dục đại chúng",
    openingGreeting: "Some argue that AI tutors might replace human interaction. Where do you stand on this debate?",
    suggestedPhrases: ["Rather than replacing educators, AI democratizes access to personalized practice.", "Crucially, we must safeguard learner privacy.", "The evidence suggests a hybrid model works best."],
  },
];

/**
 * TASK-2.1.2: Tạo System Prompt CEFR-Aware chuẩn theo đúng kế hoạch
 */
export function buildCEFRSystemPrompt(scenario: ConversationScenario): string {
  return [
    `You are a friendly, patient English conversation partner for a Vietnamese learner at CEFR ${scenario.cefrLevel} level.`,
    `Context & Guidelines:`,
    `- Keep responses concise, warm, and natural (max 15-20 words per response).`,
    `- Use vocabulary and sentence structures strictly appropriate for ${scenario.cefrLevel} level.`,
    `- Always ask one open-ended or choice-based follow-up question to keep the conversation flowing.`,
    `- In-line error correction: If the learner makes a grammar or word choice mistake, provide your natural response first, then on a new line add: "💡 Quick tip: [Gentle correction in Vietnamese]".`,
    `- Stay in character as: ${scenario.aiPersona}.`,
    `- Current Scenario: ${scenario.title} (${scenario.goalDescription}).`,
  ].join("\n");
}

/**
 * TASK-2.1.4: Fair-Use Rate Limiter (15 lượt nói / phút / IP)
 */
const ipWindowMap = new Map<string, number[]>();

export function checkFairUseRateLimit(clientIp: string, maxRequestsPerMin = 15): {
  allowed: boolean;
  remainingInMinute: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const oneMinuteAgo = now - 60_000;
  const history = (ipWindowMap.get(clientIp) || []).filter((ts) => ts > oneMinuteAgo);

  if (history.length >= maxRequestsPerMin) {
    const oldest = history[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + 60_000 - now) / 1000));
    return {
      allowed: false,
      remainingInMinute: 0,
      retryAfterSeconds,
    };
  }

  history.push(now);
  ipWindowMap.set(clientIp, history);
  return {
    allowed: true,
    remainingInMinute: maxRequestsPerMin - history.length,
    retryAfterSeconds: 0,
  };
}
