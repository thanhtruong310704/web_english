-- ============================================================================
-- ENGLISHFLOW ZERO-COST DATABASE SCHEMA & RLS POLICIES (SUPABASE FREE TIER)
-- Project ID: itnedwoaolzgybyaiife (https://itnedwoaolzgybyaiife.supabase.co)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Bảng profiles (Hồ sơ người học)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT DEFAULT '/avatars/default.png',
  cefr_level TEXT NOT NULL DEFAULT 'A1' CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1')),
  daily_goal_minutes INTEGER NOT NULL DEFAULT 15 CHECK (daily_goal_minutes IN (5, 15, 30, 60)),
  total_xp INTEGER NOT NULL DEFAULT 0,
  theme_preference TEXT NOT NULL DEFAULT 'light',
  unlocked_badges JSONB NOT NULL DEFAULT '[]'::jsonb,
  unlocked_themes JSONB NOT NULL DEFAULT '["light"]'::jsonb,
  unlocked_avatars JSONB NOT NULL DEFAULT '["default"]'::jsonb,
  in_hall_of_fame BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Bảng topics (Chủ đề theo khung CEFR)
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cefr_level TEXT NOT NULL CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2')),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Bảng lessons (Bài học Nghe / Nói / Chính tả / Shadowing)
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_code TEXT UNIQUE,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  cefr_level TEXT NOT NULL CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2')),
  type TEXT NOT NULL CHECK (type IN ('listening', 'speaking', 'dictation', 'shadowing')),
  title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  audio_url_us TEXT NOT NULL,
  audio_url_uk TEXT,
  audio_url_au TEXT,
  transcript TEXT NOT NULL,
  timestamps JSONB DEFAULT '[]'::jsonb,
  vocabulary_notes JSONB DEFAULT '[]'::jsonb,
  duration INTEGER NOT NULL DEFAULT 120,
  oer_source TEXT DEFAULT 'VoA Learning English (Public Domain)',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Bảng lesson_questions (Câu hỏi trắc nghiệm & giải thích)
CREATE TABLE IF NOT EXISTS public.lesson_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false')),
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 1
);

-- 5. Bảng user_progress (Tiến độ học tập)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  time_spent_sec INTEGER NOT NULL DEFAULT 0,
  last_studied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 6. Bảng user_streaks (Chuỗi ngày học & Freeze Tokens)
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  freeze_tokens INTEGER NOT NULL DEFAULT 0 CHECK (freeze_tokens >= 0 AND freeze_tokens <= 3),
  last_active_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Bảng user_xp_logs (Nhật ký tích lũy XP minh bạch)
CREATE TABLE IF NOT EXISTS public.user_xp_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp_amount INTEGER NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'listening_comprehension',
    'dictation',
    'shadowing',
    'minimal_pairs',
    'ai_conversation',
    'daily_goal_bonus',
    'streak_7d_bonus',
    'perfect_score_bonus',
    'buy_freeze_token',
    'unlock_theme'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Bảng srs_flashcards (Thẻ từ vựng lặp lại ngắt quãng SM-2)
CREATE TABLE IF NOT EXISTS public.srs_flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  ipa TEXT,
  meaning_vi TEXT NOT NULL,
  example_sentence TEXT,
  cefr_level TEXT DEFAULT 'A1',
  repetitions INTEGER NOT NULL DEFAULT 0,
  easiness_factor REAL NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 1,
  next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Bảng community_contributions (Đóng góp từ giáo viên & cộng đồng)
CREATE TABLE IF NOT EXISTS public.community_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contributor_name TEXT NOT NULL,
  contributor_email TEXT,
  contribution_type TEXT NOT NULL CHECK (contribution_type IN ('new_question', 'translation_fix', 'audio_report', 'reading_passage')),
  cefr_level TEXT NOT NULL DEFAULT 'A1',
  content JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Bảng learning_analytics_events (Sự kiện theo dõi học tập cộng đồng)
CREATE TABLE IF NOT EXISTS public.learning_analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL CHECK (event_name IN (
    'lesson_started',
    'lesson_completed',
    'pronunciation_drilled',
    'conversation_turn_reached',
    'streak_milestone_unlocked'
  )),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (TASK-1.1.4 & TASK-SEC-01)
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_xp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.srs_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public topics are viewable by everyone" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Public lessons are viewable by everyone" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Public questions are viewable by everyone" ON public.lesson_questions FOR SELECT USING (true);

CREATE POLICY "Profiles viewable by everyone for leaderboard" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((select auth.uid()) = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((select auth.uid()) = id);

CREATE POLICY "Users view own progress" ON public.user_progress FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users insert own progress" ON public.user_progress FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users update own progress" ON public.user_progress FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users view own streaks" ON public.user_streaks FOR SELECT USING ((select auth.uid()) = user_id);
CREATE POLICY "Users insert own streaks" ON public.user_streaks FOR INSERT WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users update own streaks" ON public.user_streaks FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "XP logs viewable by everyone" ON public.user_xp_logs FOR SELECT USING (true);
CREATE POLICY "Users insert own xp logs" ON public.user_xp_logs FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users manage own flashcards" ON public.srs_flashcards FOR ALL USING ((select auth.uid()) = user_id);

CREATE POLICY "View approved contributions" ON public.community_contributions FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can submit contribution" ON public.community_contributions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can insert learning analytics" ON public.learning_analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public aggregated learning analytics viewable" ON public.learning_analytics_events FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_lessons_topic_id ON public.lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_lessons_cefr_level ON public.lessons(cefr_level);
CREATE INDEX IF NOT EXISTS idx_lesson_questions_lesson_id ON public.lesson_questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON public.user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_xp_logs_user_id ON public.user_xp_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_srs_flashcards_user_id ON public.srs_flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_analytics_events_user_id ON public.learning_analytics_events(user_id);
