/**
 * SPRINT 2.2 (TASK-2.2.1 & TASK-2.2.2):
 * - Dictation Engine (Chép chính tả câu ngắn + thuật toán Levenshtein tính % chính xác)
 * - Shadowing Engine (Luyện nhại giọng + so sánh độ khớp ngữ điệu/nhịp độ câu mẫu)
 */

export interface DictationEvaluation {
  accuracyPercent: number;
  passed85Percent: boolean;
  xpEarned: number;
  wordDiffs: { word: string; status: "correct" | "wrong" | "missing" }[];
}

/**
 * Thuật toán khoảng cách Levenshtein chuẩn tính độ tương đồng giữa 2 chuỗi
 */
export function computeLevenshteinDistance(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  const dp: number[][] = Array.from({ length: s1.length + 1 }, () =>
    Array(s2.length + 1).fill(0)
  );

  for (let i = 0; i <= s1.length; i++) dp[i][0] = i;
  for (let j = 0; j <= s2.length; j++) dp[0][j] = j;

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // xóa
        dp[i][j - 1] + 1,      // chèn
        dp[i - 1][j - 1] + cost // thay thế
      );
    }
  }
  return dp[s1.length][s2.length];
}

/**
 * TASK-2.2.1: Đánh giá bài chép chính tả (Dictation)
 * Thưởng +20 XP nếu đạt >= 85% chính xác, +25% bonus nếu đạt 100%
 */
export function evaluateDictationAttempt(
  targetSentence: string,
  userTyped: string
): DictationEvaluation {
  const cleanTarget = targetSentence.replace(/[.,!?]/g, "").trim();
  const cleanUser = userTyped.replace(/[.,!?]/g, "").trim();

  const maxLen = Math.max(cleanTarget.length, cleanUser.length, 1);
  const dist = computeLevenshteinDistance(cleanTarget, cleanUser);
  const accuracyPercent = Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));

  const targetWords = cleanTarget.split(/\s+/);
  const userWords = cleanUser.toLowerCase().split(/\s+/);

  const wordDiffs = targetWords.map((w, idx) => {
    const uWord = userWords[idx];
    if (!uWord) return { word: w, status: "missing" as const };
    if (uWord === w.toLowerCase()) return { word: w, status: "correct" as const };
    return { word: w, status: "wrong" as const };
  });

  const passed85Percent = accuracyPercent >= 85;
  let xpEarned = passed85Percent ? 20 : 5;
  if (accuracyPercent === 100) {
    xpEarned += Math.round(20 * 0.25); // +25% perfect bonus = 25 XP
  }

  return {
    accuracyPercent,
    passed85Percent,
    xpEarned,
    wordDiffs,
  };
}

/**
 * TASK-2.2.2: Shadowing Engine - So sánh nhịp độ & phát âm khi nhại giọng bản xứ
 */
export interface ShadowingEvaluation {
  rhythmMatchPercent: number;
  pronunciationMatchPercent: number;
  overallShadowingScore: number;
  xpEarned: number;
  feedbackVi: string;
}

export function evaluateShadowingAttempt(
  nativeSentence: string,
  nativeDurationSec: number,
  learnerSpokenTranscript: string,
  learnerDurationSec: number
): ShadowingEvaluation {
  const dictationCheck = evaluateDictationAttempt(nativeSentence, learnerSpokenTranscript);
  const pronunciationMatchPercent = dictationCheck.accuracyPercent;

  const durationRatio =
    nativeDurationSec > 0 ? Math.min(learnerDurationSec, nativeDurationSec) / Math.max(learnerDurationSec, nativeDurationSec) : 0.9;
  const rhythmMatchPercent = Math.round(durationRatio * 100);

  const overallShadowingScore = Math.round(pronunciationMatchPercent * 0.65 + rhythmMatchPercent * 0.35);
  const xpEarned = overallShadowingScore === 100 ? 19 : 15;

  return {
    rhythmMatchPercent,
    pronunciationMatchPercent,
    overallShadowingScore,
    xpEarned,
    feedbackVi:
      overallShadowingScore >= 85
        ? "Ngữ điệu và tốc độ bám sát câu mẫu của người bản xứ!"
        : "Hãy nghe kỹ trọng âm câu gốc và đọc nối âm mượt hơn.",
  };
}
