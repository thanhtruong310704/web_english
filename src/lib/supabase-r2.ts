/**
 * TASK-1.1.2, TASK-1.1.5 & TASK-1.2.8:
 * Kết nối trực tiếp Project Supabase Free Tier (itnedwoaolzgybyaiife) qua @supabase/ssr & REST API
 * + Lưu trữ âm thanh Cloudflare R2 ($0 Egress)
 * + Đồng bộ tiến độ học tập hai chiều từ LocalStorage/IndexedDB (Guest Mode) lên Supabase Cloud
 */

export interface SupabaseConfig {
  projectId: string;
  url: string;
  publishableKey: string;
  anonKey: string;
  r2PublicDomain: string;
}

export const SUPABASE_LIVE_PROJECT_ID = "itnedwoaolzgybyaiife";
export const SUPABASE_LIVE_URL = "https://itnedwoaolzgybyaiife.supabase.co";
export const SUPABASE_LIVE_PUBLISHABLE_KEY = "sb_publishable_0OeQF8b3XLI9Osr-oFiOuQ_Xnq9t41v";
export const SUPABASE_LIVE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bmVkd29hb2x6Z3lieWFpaWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQzMTQ0NzMsImV4cCI6MjEwOTg5MDQ3M30.aCub4JTxvytAJDLS4KfeOz23FFy9QonrgV7SV-1G8BA";

export const getEnvConfig = (): SupabaseConfig => ({
  projectId: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || SUPABASE_LIVE_PROJECT_ID,
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_LIVE_URL,
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || SUPABASE_LIVE_PUBLISHABLE_KEY,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_LIVE_ANON_KEY,
  r2PublicDomain: process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://audio.englishflow.vn",
});

/**
 * Helper tạo headers chuẩn gọi trực tiếp tới Supabase PostgREST API
 * (Hỗ trợ cả môi trường trình duyệt, Edge Function và Node.js SSR qua @supabase/ssr)
 */
export function buildSupabaseHeaders(accessToken?: string): Record<string, string> {
  const { anonKey } = getEnvConfig();
  return {
    apikey: anonKey,
    Authorization: `Bearer ${accessToken || anonKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

/**
 * Truy vấn danh sách chủ đề CEFR (A1 -> B2) trực tiếp từ Supabase
 */
export async function fetchTopicsFromSupabase(cefrLevel?: "A1" | "A2" | "B1" | "B2") {
  const { url } = getEnvConfig();
  const filter = cefrLevel ? `&cefr_level=eq.${cefrLevel}` : "";
  const res = await fetch(`${url}/rest/v1/topics?select=*&order=order_index.asc${filter}`, {
    headers: buildSupabaseHeaders(),
  });
  if (!res.ok) throw new Error(`Supabase topics fetch error: ${res.status}`);
  return res.json();
}

/**
 * Truy vấn danh sách bài học và câu hỏi trắc nghiệm theo cấp độ từ Supabase
 */
export async function fetchLessonsByLevelFromSupabase(
  cefrLevel: "A1" | "A2" | "B1" | "B2" = "A1",
  limit = 50
) {
  const { url } = getEnvConfig();
  const endpoint = `${url}/rest/v1/lessons?select=*,lesson_questions(*)&cefr_level=eq.${cefrLevel}&order=lesson_code.asc&limit=${limit}`;
  const res = await fetch(endpoint, {
    headers: buildSupabaseHeaders(),
  });
  if (!res.ok) throw new Error(`Supabase lessons fetch error: ${res.status}`);
  return res.json();
}

/**
 * Truy vấn Bảng xếp hạng tuần (TASK-2.3.2) từ bảng profiles & user_xp_logs trên Supabase
 */
export async function fetchWeeklyLeaderboardFromSupabase(limit = 10) {
  const { url } = getEnvConfig();
  const res = await fetch(
    `${url}/rest/v1/profiles?select=id,username,avatar_url,cefr_level,total_xp,in_hall_of_fame&order=total_xp.desc&limit=${limit}`,
    { headers: buildSupabaseHeaders() }
  );
  if (!res.ok) return [];
  return res.json();
}

/**
 * Gửi đóng góp học liệu từ Giáo viên & Cộng đồng lên bảng community_contributions (TASK-3.3.3)
 */
export async function submitCommunityContributionToSupabase(payload: {
  contributor_name: string;
  contributor_email?: string;
  contribution_type: "new_question" | "translation_fix" | "audio_report" | "reading_passage";
  cefr_level: "A1" | "A2" | "B1" | "B2";
  content: Record<string, unknown>;
}) {
  const { url } = getEnvConfig();
  const res = await fetch(`${url}/rest/v1/community_contributions`, {
    method: "POST",
    headers: {
      ...buildSupabaseHeaders(),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      ...payload,
      status: "pending",
    }),
  });
  return { ok: res.ok, status: res.status };
}

/**
 * Ghi nhận sự kiện Learning Analytics lên Supabase (dòng 384-390 Kế Hoạch Chi Tiết)
 */
export async function logLearningAnalyticsToSupabase(
  eventName:
    | "lesson_started"
    | "lesson_completed"
    | "pronunciation_drilled"
    | "conversation_turn_reached"
    | "streak_milestone_unlocked",
  payload: Record<string, unknown> = {},
  userId?: string
) {
  const { url } = getEnvConfig();
  const res = await fetch(`${url}/rest/v1/learning_analytics_events`, {
    method: "POST",
    headers: buildSupabaseHeaders(),
    body: JSON.stringify({
      user_id: userId || null,
      event_name: eventName,
      payload,
    }),
  });
  return { ok: res.ok, status: res.status };
}

/**
 * TASK-1.2.8: Đồng bộ tự động tiến độ học ở chế độ Guest (LocalStorage / IndexedDB) lên Supabase khi đăng nhập
 */
export async function syncGuestProgressToSupabase(
  userId: string,
  accessToken: string,
  guestLessons: { lessonId: string; score: number; isCompleted: boolean; timeSpentSec: number }[]
) {
  const { url } = getEnvConfig();
  const rows = guestLessons.map((item) => ({
    user_id: userId,
    lesson_id: item.lessonId,
    score: item.score,
    is_completed: item.isCompleted,
    time_spent_sec: item.timeSpentSec,
    last_studied_at: new Date().toISOString(),
  }));

  const res = await fetch(`${url}/rest/v1/user_progress?on_conflict=user_id,lesson_id`, {
    method: "POST",
    headers: {
      ...buildSupabaseHeaders(accessToken),
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(rows),
  });
  return { ok: res.ok, status: res.status };
}

/**
 * Helper tạo URL âm thanh chuẩn WebM/Opus 32kbps trên Cloudflare R2
 * Hỗ trợ chuyển đổi giọng đọc US, UK, AU miễn phí 100%
 */
export function getAudioStreamUrl(lessonId: string, accent: "US" | "UK" | "AU" = "US"): string {
  const { r2PublicDomain } = getEnvConfig();
  const normalizedAccent = accent.toLowerCase();
  return `${r2PublicDomain}/lessons/${lessonId}_${normalizedAccent}_32kbps.webm`;
}

/**
 * Helper tạo nội dung file Transcript .txt cho phép học viên tải về máy học offline (TASK-1.2.7)
 */
export function generateTranscriptBlob(
  title: string,
  cefrLevel: string,
  transcript: string,
  vocabularyNotes: string[]
): string {
  return [
    `==========================================================`,
    `ENGLISHFLOW - HỌC TIẾNG ANH CỘNG ĐỒNG MIỄN PHÍ 100%`,
    `Bài học: ${title} (Cấp độ: ${cefrLevel})`,
    `==========================================================`,
    ``,
    `--- NỘI DUNG BÀI NGHE (TRANSCRIPT) ---`,
    transcript,
    ``,
    `--- GHI CHÚ TỪ VỰNG & NGỮ PHÁP ---`,
    ...vocabularyNotes.map((note, idx) => `${idx + 1}. ${note}`),
    ``,
    `Nguồn: Kho học liệu mở OER (Creative Commons / Public Domain)`,
  ].join("\n");
}
