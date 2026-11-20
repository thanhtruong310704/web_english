/**
 * MODULE LUYỆN NGHE CHUYÊN SÂU (Intensive Listening Engine) — NÂNG CẤP CHO NGƯỜI YẾU
 * Mục tiêu: Giúp người nghe yếu tách được từng từ trong dòng âm thanh nhanh:
 *  1. Nghe chậm 0.6x, đọc tách từng từ (Word-by-Word) và tách cụm nghĩa ngắn (Speech Chunks)
 *  2. Bắt từ nghe được (Word Spotting) — chọn đúng các từ xuất hiện trong câu giữa các từ bẫy gần âm
 *  3. Phân biệt từ dễ nhầm (Word Discrimination) — đảm bảo đáp án nhiễu KHÔNG nằm trong cùng câu
 *  4. Điền từ chọn lọc có trợ giúp theo tầng (Scaffolded Cloze: gợi ý chữ cái, chọn từ, nghe riêng cụm)
 *  5. Giải mã Nối âm & Rút gọn (Connected Speech Audio X-Ray)
 *  6. Thang tốc độ tự thích ứng (Speed Ladder: 0.6x → 1.1x)
 *
 * 100% chạy trên trình duyệt ($0 Stack).
 */

export interface ListeningSegment {
  start: number;
  end: number;
  text: string;
}

// ---------------------------------------------------------------------------
// 1) THƯ VIỆN NỐI ÂM & RÚT GỌN (CONNECTED SPEECH)
// ---------------------------------------------------------------------------

export interface ConnectedSpeechTip {
  id: string;
  pattern: string;
  matchRegex: RegExp;
  explanationVi: string;
  listenForVi: string;
}

export const CONNECTED_SPEECH_LIBRARY: ConnectedSpeechTip[] = [
  {
    id: "cs-gonna",
    pattern: "going to → gonna",
    matchRegex: /\bgoing to\b/i,
    explanationVi: "Người bản xứ thường nói lướt 'going to' thành /ˈɡʌnə/ (gonna) khi nói chuyện tự nhiên.",
    listenForVi: "Nghe âm 'gonna' liền một hơi, thay vì tách rõ 'going' và 'to'.",
  },
  {
    id: "cs-wanna",
    pattern: "want to → wanna",
    matchRegex: /\bwant to\b/i,
    explanationVi: "'Want to' thường được nối và rút gọn thành 'wanna' trong văn nói tự nhiên.",
    listenForVi: "Chú ý âm nhẹ 'nə' ở cuối thay vì nghe 'want' và 'to' tách biệt.",
  },
  {
    id: "cs-gotta",
    pattern: "(have) got to → gotta",
    matchRegex: /\bgot to\b/i,
    explanationVi: "'Got to' được rút gọn thành 'gotta'; âm 't' ở giữa hai nguyên âm bật nhẹ như âm 'd'.",
    listenForVi: "Nghe âm 't' giữa hai nguyên âm biến thành âm 'd' nhẹ (Flap T).",
  },
  {
    id: "cs-hafta",
    pattern: "have to → hafta",
    matchRegex: /\bhave to\b/i,
    explanationVi: "'Have to' trong văn nói thường biến âm /v/ thành /f/ và rút gọn thành 'hafta'.",
    listenForVi: "Nghe âm /f/ thay vì /v/, và 'to' bị rút ngắn gần như biến mất.",
  },
  {
    id: "cs-could-you",
    pattern: "could you / would you → couldja / wouldja",
    matchRegex: /\b(could|would|did)\s+you\b/i,
    explanationVi: "Âm /d/ cuối kết hợp âm /j/ của 'you' tạo thành âm /dʒ/ (nghe như 'could-ja', 'did-ja').",
    listenForVi: "Đừng chờ nghe rõ 'could' rồi 'you' — chúng dính liền thành một nhịp nhẹ.",
  },
  {
    id: "cs-of-reduction",
    pattern: "'of' → /əv/ hoặc /ə/",
    matchRegex: /\b(a lot of|cup of|kind of|out of|some of|one of)\b/i,
    explanationVi: "Từ 'of' trong cụm quen thuộc thường bị đọc lướt cực nhẹ thành /ə/ (ví dụ: 'cuppa coffee', 'a lotta').",
    listenForVi: "Tập bắt từ danh từ chính đi sau 'of' thay vì cố nghe âm /v/.",
  },
  {
    id: "cs-dropped-pronoun",
    pattern: "him/her/his/them → 'im/'er/'is/'em",
    matchRegex: /\b(him|her|his|them)\b/i,
    explanationVi: "Trong câu nói nhanh, âm 'h' đầu đại từ (him, her, his) hoặc cả từ 'them' thường bị nuốt/rút gọn rất mạnh.",
    listenForVi: "Nghe âm đại từ bị lướt rất nhẹ, gần như chỉ còn lại nguyên âm cuối.",
  },
  {
    id: "cs-and-reduction",
    pattern: "'and' → /ən/ hoặc /n/",
    matchRegex: /\band\b/i,
    explanationVi: "Từ nối 'and' trong câu nói tự nhiên gần như luôn bị rút gọn thành /ən/ hoặc chỉ còn /n/.",
    listenForVi: "Đừng tìm âm 'and' rõ ràng — nó thường chỉ còn lại âm 'n' nhẹ nối giữa 2 từ.",
  },
  {
    id: "cs-cv-linking",
    pattern: "Nối phụ âm cuối + nguyên âm đầu (C‿V Linking)",
    matchRegex: /\b[a-z]*[bcdfghjklmnpqrstvwxyz]\s+[aeiou][a-z]*\b/i,
    explanationVi: "Khi từ trước kết thúc bằng phụ âm và từ sau bắt đầu bằng nguyên âm (ví dụ: 'an apple', 'check it out'), hai từ dính liền như một từ mới.",
    listenForVi: "Nghe kỹ ranh giới hai từ — phụ âm cuối của từ trước sẽ nhảy sang làm âm đầu của từ sau.",
  },
  {
    id: "cs-flap-t",
    pattern: "âm 't' giữa 2 nguyên âm → 'd' nhẹ (Flap T)",
    matchRegex: /\b[a-z]*[aeiou]t[aeiou][a-z]*\b/i,
    explanationVi: "Âm 't' đứng giữa hai nguyên âm (như trong 'water', 'better', 'city') thường được đọc lướt thành âm 'd' nhẹ trong giọng Mỹ.",
    listenForVi: "Nghe như âm 'd' nhẹ thay vì âm 't' rõ — ví dụ 'water' nghe gần như 'wader'.",
  },
];

export function detectConnectedSpeechTips(sentence: string): ConnectedSpeechTip[] {
  return CONNECTED_SPEECH_LIBRARY.filter((tip) => tip.matchRegex.test(sentence)).slice(0, 3);
}

// ---------------------------------------------------------------------------
// 2) TÁCH CỤM NGHĨA NGẮN (SPEECH CHUNKS) CHO NGƯỜI NGHE YẾU
// ---------------------------------------------------------------------------

export function splitIntoSpeechChunks(sentence: string): string[] {
  const words = sentence.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 4) return [sentence.trim()];

  const chunks: string[] = [];
  let current: string[] = [];

  for (let i = 0; i < words.length; i++) {
    current.push(words[i]);
    const endsPunct = /[,;:.!?]$/.test(words[i]);
    const remaining = words.length - 1 - i;

    if (endsPunct || (current.length >= 3 && remaining >= 2)) {
      chunks.push(current.join(" "));
      current = [];
    }
  }
  if (current.length > 0) {
    if (current.length === 1 && chunks.length > 0) {
      chunks[chunks.length - 1] += " " + current[0];
    } else {
      chunks.push(current.join(" "));
    }
  }
  return chunks;
}

// ---------------------------------------------------------------------------
// 3) NGHE & BẮT TỪ (WORD SPOTTING) + PHÂN BIỆT ÂM (WORD DISCRIMINATION)
// ---------------------------------------------------------------------------

const CONFUSABLE_SOUND_GROUPS: string[][] = [
  ["ship", "sheep", "shop"],
  ["bit", "beat", "bet"],
  ["full", "fool", "fall"],
  ["pull", "pool", "pole"],
  ["cat", "cap", "cab"],
  ["knife", "nine", "night"],
  ["think", "sink", "thank"],
  ["thank", "tank", "bank"],
  ["tree", "three", "free"],
  ["live", "leave", "life"],
  ["said", "sad", "set"],
  ["work", "walk", "word"],
  ["world", "word", "warm"],
  ["these", "this", "those"],
  ["very", "vary", "every"],
  ["were", "where", "wear"],
  ["their", "there", "they"],
  ["quite", "quiet", "quick"],
  ["desert", "dessert", "design"],
  ["through", "though", "thought"],
  ["coat", "cold", "call"],
  ["right", "write", "ride"],
  ["peace", "piece", "place"],
  ["train", "rain", "plain"],
  ["class", "glass", "grass"],
  ["table", "cable", "label"],
  ["coffee", "copy", "cough"],
  ["morning", "warning", "moving"],
  ["family", "finally", "friendly"],
  ["teacher", "feature", "picture"],
  ["welcome", "outcome", "become"],
  ["minute", "finish", "limit"],
  ["check", "cheap", "chair"],
  ["fresh", "flash", "flesh"],
  ["bright", "bring", "bridge"],
  ["study", "steady", "story"],
  ["smile", "small", "smell"],
  ["partner", "pattern", "quarter"],
  ["travel", "trouble", "traffic"],
  ["modern", "model", "mother"],
];

const FALLBACK_DISTRACTOR_BANK: string[] = [
  "station", "market", "letter", "window", "garden", "office", "weather",
  "dinner", "ticket", "meeting", "project", "problem", "answer", "question",
  "journey", "village", "kitchen", "library", "airport", "channel", "product",
  "service", "balance", "feature", "process", "message", "picture", "package",
  "manager", "student", "weekend", "evening", "holiday", "partner", "pattern",
];

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "into", "your", "have",
  "are", "was", "were", "will", "would", "could", "should", "they", "them",
  "their", "there", "what", "when", "where", "which", "about", "our", "you",
]);

function cleanWordToken(w: string): string {
  return w.toLowerCase().replace(/[^a-z']/g, "");
}

function findConfusableGroup(word: string): string[] | null {
  const lower = cleanWordToken(word);
  return CONFUSABLE_SOUND_GROUPS.find((group) => group.includes(lower)) || null;
}

function deterministicSort<T>(items: T[], seed: string): T[] {
  const arr = [...items];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) | 0;
    const j = Math.abs(h) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Tìm từ nhiễu gần độ dài / gần chữ cái đầu nhưng TUYỆT ĐỐI KHÔNG xuất hiện trong câu gốc.
 */
function pickSafeDistractors(
  targetWord: string,
  sentenceWordSet: Set<string>,
  count: number,
  seed: string
): string[] {
  const lower = cleanWordToken(targetWord);
  const group = findConfusableGroup(lower);
  const picked: string[] = [];

  if (group) {
    for (const candidate of group) {
      if (candidate !== lower && !sentenceWordSet.has(candidate) && picked.length < count) {
        picked.push(candidate);
      }
    }
  }

  // Ưu tiên từ có cùng chữ cái đầu hoặc độ dài tương đương từ ngân hàng nhiễu
  const pool = [...CONFUSABLE_SOUND_GROUPS.flat(), ...FALLBACK_DISTRACTOR_BANK].filter(
    (w) => w !== lower && !sentenceWordSet.has(w) && !picked.includes(w)
  );
  const uniquePool = Array.from(new Set(pool));
  const scored = uniquePool
    .map((w) => ({
      w,
      score:
        (w[0] === lower[0] ? 3 : 0) +
        (Math.abs(w.length - lower.length) <= 1 ? 2 : 0) +
        (w.slice(-1) === lower.slice(-1) ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((x) => x.w);

  const shuffled = deterministicSort(scored, seed + lower);
  for (const cand of shuffled) {
    if (picked.length >= count) break;
    picked.push(cand);
  }
  return picked;
}

export interface WordSpottingDrill {
  segmentIndex: number;
  sentence: string;
  targetWords: string[]; // 3 từ nội dung thực sự có trong câu
  allChips: string[]; // 6 chip (3 đúng + 3 bẫy KHÔNG có trong câu)
}

export function buildWordSpottingDrill(
  segment: ListeningSegment,
  segmentIndex: number
): WordSpottingDrill {
  const rawWords = segment.text.split(/\s+/).filter(Boolean);
  const cleanWords = rawWords.map(cleanWordToken).filter((w) => w.length >= 3);
  const sentenceSet = new Set(cleanWords);

  const contentCandidates = Array.from(
    new Set(cleanWords.filter((w) => w.length >= 4 && !STOP_WORDS.has(w)))
  );
  const targetWords = (contentCandidates.length >= 3 ? contentCandidates : Array.from(sentenceSet))
    .slice(0, 3);

  const traps: string[] = [];
  for (const tw of targetWords) {
    const oneTrap = pickSafeDistractors(tw, new Set([...Array.from(sentenceSet), ...traps]), 1, `spot-${segmentIndex}`);
    if (oneTrap[0]) traps.push(oneTrap[0]);
  }

  const allChips = deterministicSort(
    Array.from(new Set([...targetWords, ...traps])),
    segment.text + segmentIndex
  );

  return {
    segmentIndex,
    sentence: segment.text,
    targetWords,
    allChips,
  };
}

export interface WordDiscriminationDrill {
  segmentIndex: number;
  sentence: string;
  targetWord: string;
  options: string[];
  hintVi: string;
}

export function buildWordDiscriminationDrill(
  segment: ListeningSegment,
  segmentIndex: number
): WordDiscriminationDrill {
  const words = segment.text.replace(/[.,!?]/g, "").split(/\s+/).filter(Boolean);
  const sentenceWordSet = new Set(words.map(cleanWordToken));
  let targetWord = "";
  let group: string[] | null = null;

  for (const w of words) {
    const g = findConfusableGroup(w);
    if (g) {
      targetWord = w;
      group = g;
      break;
    }
  }

  if (!targetWord) {
    const contentWords = words.filter((w) => w.length > 3 && !STOP_WORDS.has(cleanWordToken(w)));
    const sorted = [...contentWords].sort((a, b) => b.length - a.length);
    targetWord = sorted[0] || words[0] || segment.text;
  }

  const cleanTarget = cleanWordToken(targetWord);
  const distractors = pickSafeDistractors(cleanTarget, sentenceWordSet, 3, `wd-${segmentIndex}`);
  const options = deterministicSort(
    Array.from(new Set([cleanTarget, ...distractors])).slice(0, 4),
    segment.text + cleanTarget
  );

  return {
    segmentIndex,
    sentence: segment.text,
    targetWord: cleanTarget,
    options,
    hintVi: group
      ? "Nhóm từ phát âm rất gần nhau — nghe kỹ nguyên âm và âm cuối. Chỉ CÓ DUY NHẤT 1 từ xuất hiện trong câu!"
      : "Chỉ có DUY NHẤT 1 từ trong 4 đáp án thực sự xuất hiện trong câu vừa nghe.",
  };
}

export interface WordDiscriminationResult {
  isCorrect: boolean;
  xpEarned: number;
  feedbackVi: string;
}

export function evaluateWordDiscrimination(
  drill: WordDiscriminationDrill,
  selectedWord: string
): WordDiscriminationResult {
  const isCorrect = selectedWord.toLowerCase() === drill.targetWord.toLowerCase();
  return {
    isCorrect,
    xpEarned: isCorrect ? 8 : 0,
    feedbackVi: isCorrect
      ? "Chính xác! Tai bạn đã nhận diện đúng từ trong dòng âm thanh."
      : `Chưa đúng. Từ thực sự xuất hiện là "${drill.targetWord}" — hãy bấm nghe so sánh từng từ ở trên để phân biệt rõ âm.`,
  };
}

// ---------------------------------------------------------------------------
// 4) ĐIỀN TỪ CHỌN LỌC CÓ TRỢ GIÚP CHO NGƯỜI YẾU (SCAFFOLDED CLOZE)
// ---------------------------------------------------------------------------

export interface ClozeBlank {
  index: number;
  answer: string;
  contextChunk: string; // Cụm 3 từ quanh chỗ trống để nghe riêng
  letterHint: string; // Ví dụ: "d _ _ _ _ _ s (7 chữ)"
}

export interface ClozeDrill {
  segmentIndex: number;
  displayWords: string[];
  blanks: ClozeBlank[];
  wordBankOptions: string[]; // Dành cho người yếu bấm chọn thay vì phải tự đánh vần
}

export function formatLetterHint(word: string): string {
  const clean = cleanWordToken(word);
  if (clean.length <= 2) return `${clean[0]} _ (${clean.length} chữ)`;
  return `${clean[0]} ${"_ ".repeat(clean.length - 2)}${clean[clean.length - 1]} (${clean.length} chữ)`;
}

export function buildClozeDrill(
  segment: ListeningSegment,
  segmentIndex: number,
  blanksCount = 2
): ClozeDrill {
  const rawWords = segment.text.split(/\s+/).filter(Boolean);
  const cleanWords = rawWords.map(cleanWordToken);
  const sentenceSet = new Set(cleanWords);

  const priorityIdx = cleanWords
    .map((w, idx) => ({ w, idx }))
    .filter(({ w }) => w.length > 3 && !STOP_WORDS.has(w))
    .sort((a, b) => b.w.length - a.w.length)
    .slice(0, blanksCount)
    .map(({ idx }) => idx)
    .sort((a, b) => a - b);

  const fallbackIdx =
    priorityIdx.length > 0
      ? priorityIdx
      : cleanWords
          .map((w, idx) => ({ w, idx }))
          .filter(({ w }) => w.length > 2)
          .slice(0, blanksCount)
          .map(({ idx }) => idx);

  const displayWords = rawWords.map((w, idx) => {
    if (!fallbackIdx.includes(idx)) return w;
    const punct = w.match(/[.,!?]+$/)?.[0] || "";
    return `____${punct}`;
  });

  const blanks: ClozeBlank[] = fallbackIdx.map((idx) => {
    const start = Math.max(0, idx - 1);
    const end = Math.min(rawWords.length, idx + 2);
    return {
      index: idx,
      answer: cleanWords[idx],
      contextChunk: rawWords.slice(start, end).join(" "),
      letterHint: formatLetterHint(cleanWords[idx]),
    };
  });

  const answers = blanks.map((b) => b.answer);
  const bankTraps = pickSafeDistractors(
    answers[0] || "word",
    sentenceSet,
    Math.max(2, answers.length),
    `cloze-${segmentIndex}`
  );
  const wordBankOptions = deterministicSort(
    Array.from(new Set([...answers, ...bankTraps])),
    segment.text + "bank"
  );

  return { segmentIndex, displayWords, blanks, wordBankOptions };
}

export interface ClozeEvaluation {
  accuracyPercent: number;
  passed: boolean;
  xpEarned: number;
  perBlank: { answer: string; userInput: string; correct: boolean }[];
}

export function evaluateClozeDrill(drill: ClozeDrill, userInputs: string[]): ClozeEvaluation {
  const perBlank = drill.blanks.map((b, i) => {
    const userInput = (userInputs[i] || "").trim();
    const correct = cleanWordToken(userInput) === cleanWordToken(b.answer);
    return { answer: b.answer, userInput, correct };
  });
  const correctCount = perBlank.filter((b) => b.correct).length;
  const accuracyPercent = Math.round((correctCount / Math.max(1, perBlank.length)) * 100);
  const passed = accuracyPercent >= 80;
  return {
    accuracyPercent,
    passed,
    xpEarned: passed ? 12 : correctCount * 3,
    perBlank,
  };
}

// ---------------------------------------------------------------------------
// 5) THANG TỐC ĐỘ NGHE (SPEED LADDER) — bắt đầu từ 0.6x cho người nghe yếu
// ---------------------------------------------------------------------------

export const LISTENING_SPEED_LADDER = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1] as const;
export type LadderSpeed = (typeof LISTENING_SPEED_LADDER)[number];

export function getNextLadderSpeed(
  current: LadderSpeed,
  averageAccuracy: number
): { nextSpeed: LadderSpeed; didLevelUp: boolean; messageVi: string } {
  const currentIdx = LISTENING_SPEED_LADDER.indexOf(current);
  const safeIdx = currentIdx >= 0 ? currentIdx : 1;
  if (averageAccuracy >= 80 && safeIdx < LISTENING_SPEED_LADDER.length - 1) {
    const nextSpeed = LISTENING_SPEED_LADDER[safeIdx + 1];
    return {
      nextSpeed,
      didLevelUp: true,
      messageVi: `Tuyệt vời! Bạn nhận diện từ rất tốt ở tốc độ ${current}x (${averageAccuracy}%). Tăng lên ${nextSpeed}x!`,
    };
  }
  if (averageAccuracy < 50 && safeIdx > 0) {
    const nextSpeed = LISTENING_SPEED_LADDER[safeIdx - 1];
    return {
      nextSpeed,
      didLevelUp: false,
      messageVi: `Hơi nhanh ở tốc độ ${current}x (${averageAccuracy}%). Hạ xuống ${nextSpeed}x để tai bắt từ chắc hơn trước.`,
    };
  }
  return {
    nextSpeed: LISTENING_SPEED_LADDER[safeIdx],
    didLevelUp: false,
    messageVi: `Giữ nguyên tốc độ ${current}x và luyện thêm (${averageAccuracy}%).`,
  };
}

// ---------------------------------------------------------------------------
// 6) HỒ SƠ NĂNG LỰC NGHE (LISTENING PROFILE)
// ---------------------------------------------------------------------------

export interface IntensiveListeningProfile {
  lessonId: string;
  currentSpeed: LadderSpeed;
  wordDiscriminationAccuracyHistory: number[];
  clozeAccuracyHistory: number[];
  completedSegments: number;
  totalXpEarned: number;
  updatedAt: string;
}

function createEmptyProfile(lessonId: string): IntensiveListeningProfile {
  return {
    lessonId,
    currentSpeed: LISTENING_SPEED_LADDER[1], // Mặc định 0.7x thân thiện cho người mới
    wordDiscriminationAccuracyHistory: [],
    clozeAccuracyHistory: [],
    completedSegments: 0,
    totalXpEarned: 0,
    updatedAt: new Date().toISOString(),
  };
}

export function loadIntensiveListeningProfile(lessonId: string): IntensiveListeningProfile {
  if (typeof window === "undefined") return createEmptyProfile(lessonId);
  const raw = window.localStorage.getItem(`ef_intensive_listening_${lessonId}`);
  if (!raw) return createEmptyProfile(lessonId);
  try {
    const parsed = JSON.parse(raw);
    return { ...createEmptyProfile(lessonId), ...parsed };
  } catch (_) {
    return createEmptyProfile(lessonId);
  }
}

export function saveIntensiveListeningProfile(profile: IntensiveListeningProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    `ef_intensive_listening_${profile.lessonId}`,
    JSON.stringify({ ...profile, updatedAt: new Date().toISOString() })
  );
}

export function computeListeningEarIndex(profile: IntensiveListeningProfile): number {
  const allScores = [...profile.wordDiscriminationAccuracyHistory, ...profile.clozeAccuracyHistory];
  if (allScores.length === 0) return 0;
  const avg = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  return Math.round(avg);
}

// ---------------------------------------------------------------------------
// 7) PHÁT ÂM THANH (CẢ CÂU / TÁCH TỪNG TỪ / ĐƠN LẺ) — $0 Web SpeechSynthesis
// ---------------------------------------------------------------------------

export function playSegmentAudio(
  text: string,
  rate: number,
  lang: "en-US" | "en-GB" | "en-AU" = "en-US"
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = Math.max(0.5, Math.min(1.5, rate));
  window.speechSynthesis.speak(utter);
}

/**
 * Đọc tách rõ từng từ một (có khoảng nghỉ nhẹ) để người nghe yếu nhận diện ranh giới từ.
 */
export function playWordByWordAudio(
  text: string,
  lang: "en-US" | "en-GB" | "en-AU" = "en-US"
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const words = text.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean);
  words.forEach((word) => {
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = lang;
    utter.rate = 0.78;
    window.speechSynthesis.speak(utter);
  });
}

export function playSingleWordAudio(
  word: string,
  lang: "en-US" | "en-GB" | "en-AU" = "en-US",
  rate = 0.75
): void {
  playSegmentAudio(word.replace(/[.,!?;:"'()]/g, ""), rate, lang);
}
