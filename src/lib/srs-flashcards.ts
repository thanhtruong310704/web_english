/**
 * SPRINT 3.2 (TASK-3.2.1 -> TASK-3.2.3):
 * Thuật Toán Lặp Lại Ngắt Quãng (Spaced Repetition System - SuperMemo SM-2)
 * & Tính năng 1-click thêm từ vựng mới vào Sổ từ vựng cá nhân
 */

export interface SRSCard {
  id: string;
  word: string;
  ipa: string;
  meaningVi: string;
  exampleSentence: string;
  cefrLevel: "A1" | "A2" | "B1" | "B2";
  repetitions: number;
  easinessFactor: number;
  intervalDays: number;
  nextReviewDate: string; // YYYY-MM-DD
}

/**
 * TASK-3.2.1: Thuật toán SuperMemo SM-2 chuẩn
 * quality: 0 -> 5 (0: quên hoàn toàn, 3: nhớ có suy nghĩ, 5: nhớ phản xạ ngay lập tức)
 */
export function updateSRSCardSM2(
  card: SRSCard,
  quality: 0 | 1 | 2 | 3 | 4 | 5,
  referenceDate: Date = new Date()
): SRSCard {
  let { repetitions, easinessFactor, intervalDays } = card;

  if (quality >= 3) {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easinessFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    intervalDays = 1;
  }

  // Công thức cập nhật EF của SM-2: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const delta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  easinessFactor = Math.max(1.3, Number((easinessFactor + delta).toFixed(2)));

  const nextDate = new Date(referenceDate.getTime() + intervalDays * 86_400_000);
  const nextReviewDate = nextDate.toISOString().slice(0, 10);

  return {
    ...card,
    repetitions,
    easinessFactor,
    intervalDays,
    nextReviewDate,
  };
}

/**
 * TASK-3.2.2: 1-Click Auto-add Vocabulary từ bài nghe vào sổ từ vựng
 */
export function createFlashcardOneClick(
  word: string,
  ipa: string,
  meaningVi: string,
  exampleSentence: string,
  cefrLevel: "A1" | "A2" | "B1" | "B2" = "A1"
): SRSCard {
  return {
    id: `srs-${word.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    word,
    ipa,
    meaningVi,
    exampleSentence,
    cefrLevel,
    repetitions: 0,
    easinessFactor: 2.5,
    intervalDays: 1,
    nextReviewDate: new Date().toISOString().slice(0, 10),
  };
}
