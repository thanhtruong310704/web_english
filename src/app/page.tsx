"use client";
import React, { useState, useEffect } from "react";
import ListeningPlayer from "@/components/ListeningPlayer";
import IntensiveListeningDrill from "@/components/IntensiveListeningDrill";
import SentenceBuilderStudio from "@/components/SentenceBuilderStudio";
import { A1_50_LESSONS_CATALOG } from "@/lib/a1-curriculum-50";
import {
  A2_60_LESSONS_CATALOG,
  B1_65_LESSONS_CATALOG,
  B2_65_LESSONS_CATALOG,
} from "@/lib/cefr-catalog-and-badges";
import {
  SUPABASE_LIVE_PROJECT_ID,
  SUPABASE_LIVE_URL,
  SUPABASE_LIVE_ANON_KEY,
  fetchTopicsFromSupabase,
  logLearningAnalyticsToSupabase,
} from "@/lib/supabase-r2";
import { evaluateDictationAttempt } from "@/lib/dictation-shadowing-engine";
import { VIETNAMESE_MINIMAL_PAIRS, evaluateSpeakingRubric, SpeakingRubricResult } from "@/lib/speaking-engine";
import { CONVERSATION_SCENARIOS_20 } from "@/lib/conversation-engine";
import { createFlashcardOneClick, updateSRSCardSM2, SRSCard } from "@/lib/srs-flashcards";
import {
  TOPIC_VOCABULARY_DATA,
  getTopicVocabularyCards,
  getTopicTitle,
} from "@/lib/topic-vocabulary";
import {
  Headphones,
  BookOpen,
  MessageSquare,
  Compass,
  Flame,
  Sparkles,
  Volume2,
  CheckCircle2,
  LogOut,
  Plus,
  Send,
  Gauge,
  Mic,
  RotateCcw,
  ChevronRight,
  Layers,
  ShieldCheck,
  Award,
  Puzzle,
} from "lucide-react";

export default function HomePage() {
  const [authChecking, setAuthChecking] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<"A1" | "A2" | "B1" | "B2">("A1");
  const [selectedTopicIdx, setSelectedTopicIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "listening" | "builder" | "vocabulary" | "speaking" | "topics"
  >("listening");
  const [listeningSubMode, setListeningSubMode] = useState<
    "comprehension" | "intensive" | "dictation" | "shadowing" | "pronunciation" | "speed"
  >("comprehension");
  const [vocabSubMode, setVocabSubMode] = useState<"flashcard" | "quiz" | "wordlist">("flashcard");
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [topicsCount, setTopicsCount] = useState(40);
  const [xp, setXp] = useState(520);
  const [streakDays] = useState(7);

  // Auth Modal & Profile State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [userProfile, setUserProfile] = useState<{ email: string; username: string } | null>(null);

  // Vocabulary Deck State (SRS SM-2)
  const [vocabDeck, setVocabDeck] = useState<SRSCard[]>(() => getTopicVocabularyCards("A1", 0));
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  // Dictation & Speed Listening State
  const [dictationInput, setDictationInput] = useState("");
  const [dictationScore, setDictationScore] = useState<number | null>(null);
  const [speedRate, setSpeedRate] = useState(0.85);

  // AI Conversation & Speaking Room State
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sender: "ai" | "user"; text: string; tip?: string }[]
  >([]);
  const [speakingEvaluation, setSpeakingEvaluation] = useState<SpeakingRubricResult | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("ef_auth_user") : null;
    if (!saved) {
      window.location.replace("/login");
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      if (!parsed || (!parsed.email && !parsed.username)) {
        window.location.replace("/login");
        return;
      }
      setUserProfile(parsed);
      if (parsed.level && ["A1", "A2", "B1", "B2"].includes(parsed.level)) {
        setSelectedLevel(parsed.level);
      }
      setAuthChecking(false);
    } catch (_) {
      window.location.replace("/login");
      return;
    }

    fetchTopicsFromSupabase()
      .then((rows) => {
        if (Array.isArray(rows) && rows.length > 0) {
          setSupabaseConnected(true);
          setTopicsCount(rows.length);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ef_auth_user");
      document.cookie = "ef_auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      window.location.replace("/login");
    }
  };

  const catalogByLevel = {
    A1: A1_50_LESSONS_CATALOG,
    A2: A2_60_LESSONS_CATALOG,
    B1: B1_65_LESSONS_CATALOG,
    B2: B2_65_LESSONS_CATALOG,
  }[selectedLevel];

  const activeLesson =
    catalogByLevel[selectedTopicIdx % catalogByLevel.length] || catalogByLevel[0];

  useEffect(() => {
    setVocabDeck(getTopicVocabularyCards(selectedLevel, selectedTopicIdx));
    setCardIdx(0);
    setIsFlipped(false);
    setQuizAnswer(null);
    setDictationInput(activeLesson.transcript.split(".")[0] + ".");
    setDictationScore(null);
  }, [selectedLevel, selectedTopicIdx, activeLesson.transcript]);

  const scenariosForLevel = CONVERSATION_SCENARIOS_20.filter((s) => s.cefrLevel === selectedLevel);
  const activeScenario =
    scenariosForLevel[selectedScenarioIdx % Math.max(1, scenariosForLevel.length)] ||
    CONVERSATION_SCENARIOS_20[0];

  useEffect(() => {
    setChatHistory([{ sender: "ai", text: activeScenario.openingGreeting }]);
    setSpeakingEvaluation(null);
  }, [activeScenario.id, activeScenario.openingGreeting]);

  const currentCard = vocabDeck[cardIdx % vocabDeck.length] || vocabDeck[0];

  const speakText = (text: string, rate = 0.95) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = rate;
      window.speechSynthesis.speak(u);
    }
  };

  const handleRateCard = (q: 1 | 3 | 5) => {
    const updated = updateSRSCardSM2(currentCard, q);
    const nextDeck = [...vocabDeck];
    nextDeck[cardIdx % vocabDeck.length] = updated;
    setVocabDeck(nextDeck);
    setIsFlipped(false);
    setQuizAnswer(null);
    setCardIdx((c) => (c + 1) % vocabDeck.length);
    if (q === 5) setXp((x) => x + 5);
  };

  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;
    setVocabDeck((prev) => [
      createFlashcardOneClick(
        newWord.trim(),
        `/${newWord.trim().toLowerCase()}/`,
        newMeaning.trim(),
        activeLesson.transcript,
        selectedLevel
      ),
      ...prev,
    ]);
    setNewWord("");
    setNewMeaning("");
    setXp((x) => x + 3);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;
    const username = authEmail.split("@")[0];
    try {
      const endpoint =
        authMode === "signup"
          ? `${SUPABASE_LIVE_URL}/auth/v1/signup`
          : `${SUPABASE_LIVE_URL}/auth/v1/token?grant_type=password`;
      await fetch(endpoint, {
        method: "POST",
        headers: { apikey: SUPABASE_LIVE_ANON_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
    } catch (_) {}
    setUserProfile({ email: authEmail, username });
    setShowAuthModal(false);
  };

  const handleCheckDictation = () => {
    const targetSentence = activeLesson.transcript.split(".")[0] + ".";
    const res = evaluateDictationAttempt(targetSentence, dictationInput);
    setDictationScore(res.accuracyPercent);
    if (res.passed85Percent) setXp((prev) => prev + res.xpEarned);
    logLearningAnalyticsToSupabase("lesson_completed", {
      type: "dictation",
      accuracy: res.accuracyPercent,
    }).catch(() => {});
  };

  const handleSendConversation = async (textToSend?: string) => {
    const msg = (textToSend ?? chatInput).trim();
    if (!msg) return;
    setChatInput("");
    const evaluation = await evaluateSpeakingRubric(
      msg,
      6,
      activeScenario.title,
      selectedLevel
    );
    setSpeakingEvaluation(evaluation);

    const followUps = [
      "That sounds great! Could you tell me a bit more about that?",
      "Interesting point! What do you usually do next in this situation?",
      "I completely understand. How do you feel about that option?",
    ];
    const aiReply = followUps[chatHistory.length % followUps.length];
    const quickTip =
      msg.split(/\s+/).length < 5
        ? "Hãy thử mở rộng câu trả lời thêm 1 mệnh đề với 'because' hoặc 'so' để tăng điểm Fluency."
        : "Cấu trúc câu tự nhiên và rõ nghĩa! Bạn có thể dùng thêm từ nối để câu mượt hơn.";

    setChatHistory((prev) => [
      ...prev,
      { sender: "user", text: msg },
      { sender: "ai", text: aiReply, tip: quickTip },
    ]);
    speakText(aiReply, 0.95);
    setXp((x) => x + 10);
  };

  // Build 4 options for vocab quiz
  const quizOptions = React.useMemo(() => {
    const opts = new Set<string>([currentCard.meaningVi]);
    for (let i = 1; i <= vocabDeck.length && opts.size < 4; i++) {
      opts.add(vocabDeck[(cardIdx + i) % vocabDeck.length].meaningVi);
    }
    return Array.from(opts);
  }, [currentCard, vocabDeck, cardIdx]);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg animate-pulse mb-3 shadow-lg shadow-indigo-600/25">
          EF
        </div>
        <p className="text-sm font-semibold text-slate-600">Đang mở bàn học EnglishFlow Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-slate-900 flex flex-col">
      {/* Top Studio Header Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left Brand & Cloud Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm shadow-indigo-600/20">
              EF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base">
                  EnglishFlow
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  {supabaseConnected
                    ? `Supabase Live (${topicsCount} Chủ đề)`
                    : `Supabase (${SUPABASE_LIVE_PROJECT_ID.slice(0, 8)})`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Nghe Nhận Dạng Từ • Ghép Câu Chủ Động • Từ Vựng SRS • Hội Thoại AI
              </p>
            </div>
          </div>

          {/* Center Main Navigation Pills (Desktop) */}
          <nav className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60 gap-1">
            {[
              { id: "listening", label: "Phòng Nghe (70%)", icon: Headphones },
              { id: "builder", label: "Ghép Câu", icon: Puzzle },
              { id: "vocabulary", label: `Từ Vựng (${vocabDeck.length})`, icon: BookOpen },
              { id: "speaking", label: "Hội Thoại AI", icon: MessageSquare },
              { id: "topics", label: "40 Chủ Đề", icon: Compass },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition ${
                    isActive
                      ? "bg-white text-indigo-600 shadow-card"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right User Metrics & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 text-xs font-bold">
            <span
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200/80"
              title="Chuỗi ngày học liên tiếp"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>{streakDays} ngày</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/80 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{xp} XP</span>
            </span>

            <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 transition"
              >
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span className="max-w-[120px] truncate">
                  {userProfile ? userProfile.username : "Học viên"}
                </span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition"
                title="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Sub-Navigation Bar */}
        <div className="md:hidden px-4 py-2 flex gap-1.5 overflow-x-auto border-t border-slate-100 bg-white">
          {[
            { id: "listening", label: "🎧 Nghe (70%)" },
            { id: "builder", label: "🧩 Ghép Câu" },
            { id: "vocabulary", label: `📖 Từ Vựng (${vocabDeck.length})` },
            { id: "speaking", label: "💬 Hội Thoại AI" },
            { id: "topics", label: "🗺️ 40 Chủ Đề" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Widescreen 3-Column Studio Layout for Laptop/Desktop */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (3 cols on Desktop): CEFR Level & 10 Topic Navigator */}
        <aside className="lg:col-span-3 space-y-5 lg:sticky lg:top-22">
          {/* CEFR Level Switcher Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Cấp độ CEFR</span>
              </span>
              <span className="text-[11px] font-mono font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                {catalogByLevel.length} bài nghe
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
              {(["A1", "A2", "B1", "B2"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setSelectedLevel(lvl);
                    setSelectedTopicIdx(0);
                  }}
                  className={`py-2 rounded-xl text-xs font-extrabold transition ${
                    selectedLevel === lvl
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Topic List inside Current Level */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
                <span>10 CHỦ ĐỀ CẤP {selectedLevel}</span>
                <span>15 từ/bài</span>
              </div>
              <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
                {TOPIC_VOCABULARY_DATA[selectedLevel].map((topic, idx) => {
                  const isSelected = selectedTopicIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedTopicIdx(idx)}
                      className={`w-full text-left px-3 py-2.5 rounded-2xl text-xs transition flex items-center justify-between gap-2 ${
                        isSelected
                          ? "bg-indigo-50/90 text-indigo-950 font-bold border border-indigo-200/80"
                          : "hover:bg-slate-50 text-slate-600 font-medium border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {(idx + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="truncate">{topic.topicTitle}</span>
                      </div>
                      {isSelected && <ChevronRight className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-card space-y-2 text-xs">
            <a
              href="/vocabulary"
              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 text-slate-700 font-semibold transition"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>Chế độ Toàn màn hình Từ vựng</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="/transparency"
              className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 text-slate-700 font-semibold transition"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Minh bạch $0 & Đóng góp</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </aside>

        {/* CENTER WORKSPACE STAGE (6 cols on Desktop) */}
        <main className="lg:col-span-6 space-y-5">
          {/* Active Topic Context Header */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-card flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold">
                  Cấp {selectedLevel} • Bài {(selectedTopicIdx + 1).toString().padStart(2, "0")}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-medium">
                  {vocabDeck.length} từ vựng trọng tâm
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {getTopicTitle(selectedLevel, selectedTopicIdx)} — {activeLesson.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveTab(activeTab === "vocabulary" ? "listening" : "vocabulary")
                }
                className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 text-xs font-bold transition inline-flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>
                  {activeTab === "vocabulary" ? "Quay lại Nghe" : "Ôn bộ từ vựng này"}
                </span>
              </button>
            </div>
          </div>

          {/* TAB 1: LISTENING STUDIO */}
          {activeTab === "listening" && (
            <div className="space-y-5">
              {/* 6 Listening Drill Sub-Modes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 bg-slate-200/70 p-1.5 rounded-2xl text-xs font-bold">
                {[
                  { id: "comprehension", label: "1. Nghe Hiểu" },
                  { id: "intensive", label: "2. Nhận Dạng Từ" },
                  { id: "dictation", label: "3. Chính Tả" },
                  { id: "shadowing", label: "4. Shadowing" },
                  { id: "pronunciation", label: "5. Cặp Âm" },
                  { id: "speed", label: "6. Phản Xạ" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setListeningSubMode(m.id as typeof listeningSubMode)}
                    className={`py-2 px-2.5 rounded-xl transition text-center truncate ${
                      listeningSubMode === m.id
                        ? "bg-white text-indigo-600 shadow-card font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {listeningSubMode === "comprehension" && (
                <ListeningPlayer
                  lessonId={activeLesson.id}
                  title={activeLesson.title}
                  cefrLevel={activeLesson.cefrLevel}
                  transcript={activeLesson.transcript}
                  duration={activeLesson.durationSec}
                  questions={activeLesson.questions.map((q) => ({
                    ...q,
                    question_type: "multiple_choice",
                  }))}
                  vocabularyNotes={vocabDeck
                    .slice(0, 3)
                    .map((c) => `${c.word} (${c.ipa}): ${c.meaningVi}`)}
                  onCompleteLesson={(_, earned) => setXp((prev) => prev + earned)}
                />
              )}

              {listeningSubMode === "intensive" && (
                <IntensiveListeningDrill
                  lessonId={activeLesson.id}
                  title={activeLesson.title}
                  cefrLevel={activeLesson.cefrLevel}
                  segments={activeLesson.timestamps}
                  onXpEarned={(earned) => setXp((prev) => prev + earned)}
                />
              )}

              {listeningSubMode === "dictation" && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-base">
                        Chép Chính Tả (Levenshtein Accuracy ≥ 85%)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Bấm nghe câu mẫu và gõ lại chính xác từng từ bạn nghe được
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakText(activeLesson.transcript.split(".")[0] + ".", 0.9)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold inline-flex items-center gap-1.5 transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Phát câu mẫu</span>
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={dictationInput}
                    onChange={(e) => setDictationInput(e.target.value)}
                    placeholder="Gõ lại câu tiếng Anh bạn vừa nghe..."
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none text-sm font-medium"
                  />

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleCheckDictation}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
                    >
                      Chấm điểm chính tả
                    </button>
                    {dictationScore !== null && (
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        <span>Độ chính xác: {dictationScore}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {listeningSubMode === "shadowing" && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-base">
                        Luyện Nói Đuổi (Shadowing Technique)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Phát âm 40% • Nhịp điệu 30% • Độ trôi chảy 20% • Ngữ điệu 10%
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakText(activeLesson.transcript, 0.9)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe & Nhại theo ngay</span>
                    </button>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed font-medium">
                    {activeLesson.transcript}
                  </div>
                </div>
              )}

              {listeningSubMode === "pronunciation" && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
                  <div>
                    <h2 className="font-extrabold text-slate-900 text-base">
                      9 Bộ Cặp Âm Dễ Nhầm Cho Người Việt (Minimal Pairs)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Bấm vào từng từ hoặc câu để nghe sự khác biệt về độ dài nguyên âm và âm cuối
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    {VIETNAMESE_MINIMAL_PAIRS.map((mp) => (
                      <div
                        key={mp.id}
                        className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5"
                      >
                        <div className="font-bold text-indigo-700">{mp.categoryLabelVi}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {mp.words.map((w) => (
                            <button
                              key={w.word}
                              type="button"
                              onClick={() => speakText(w.word, 0.85)}
                              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-slate-800 font-bold inline-flex items-center gap-1.5 transition"
                            >
                              <span>{w.word}</span>
                              <span className="font-mono text-indigo-600 text-[11px]">{w.ipa}</span>
                              <Volume2 className="w-3 h-3 text-slate-400" />
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => speakText(mp.contextSentence, 0.9)}
                          className="text-left text-slate-600 hover:text-indigo-700 italic block w-full pt-1"
                        >
                          &ldquo;{mp.contextSentence}&rdquo; 🔊
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {listeningSubMode === "speed" && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-base">
                        Thang Tăng Tốc Phản Xạ Nghe (Speed Ladder)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Tốc độ hiện tại:{" "}
                        <strong className="font-mono text-indigo-600">
                          {speedRate.toFixed(2)}x
                        </strong>{" "}
                        → Mục tiêu phản xạ tự nhiên: <strong className="font-mono">1.25x</strong>
                      </p>
                    </div>
                    <Gauge className="w-6 h-6 text-indigo-600" />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
                    {activeLesson.transcript}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => speakText(activeLesson.transcript, speedRate)}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe ở tốc độ {speedRate.toFixed(2)}x</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const nextRate = Math.min(1.3, Number((speedRate + 0.05).toFixed(2)));
                        setSpeedRate(nextRate);
                        speakText(activeLesson.transcript, nextRate);
                        setXp((x) => x + 5);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition"
                    >
                      Đã nghe rõ ≥ 80% → Tăng lên +0.05x
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpeedRate(0.85)}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold inline-flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset 0.85x</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 1.5: SENTENCE BUILDER STUDIO (PASSIVE -> ACTIVE) */}
          {activeTab === "builder" && (
            <SentenceBuilderStudio
              cefrLevel={selectedLevel}
              topicTitle={getTopicTitle(selectedLevel, selectedTopicIdx)}
              lessonSegments={activeLesson.timestamps}
              vocabCards={vocabDeck}
              onXpEarned={(earned) => setXp((prev) => prev + earned)}
            />
          )}

          {/* TAB 2: VOCABULARY SRS STUDIO */}
          {activeTab === "vocabulary" && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-1.5 bg-slate-200/70 p-1.5 rounded-2xl text-xs font-bold">
                {[
                  { id: "flashcard", label: "1. Thẻ Lật SRS (SM-2)" },
                  { id: "quiz", label: "2. Trắc Nghiệm Phản Xạ" },
                  { id: "wordlist", label: `3. Sổ Từ Vựng (${vocabDeck.length})` },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setVocabSubMode(m.id as typeof vocabSubMode)}
                    className={`py-2.5 px-3 rounded-xl transition ${
                      vocabSubMode === m.id
                        ? "bg-white text-indigo-600 shadow-card font-extrabold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {vocabSubMode === "flashcard" && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card space-y-6 text-center">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold">Thuật toán SuperMemo SM-2</span>
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      Thẻ {(cardIdx % vocabDeck.length) + 1} / {vocabDeck.length}
                    </span>
                  </div>

                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="cursor-pointer min-h-[240px] p-8 rounded-3xl bg-gradient-to-b from-slate-50 to-indigo-50/30 border-2 border-dashed border-indigo-200 hover:border-indigo-400 transition flex flex-col items-center justify-center space-y-3"
                  >
                    {!isFlipped ? (
                      <>
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                          {currentCard.word}
                        </span>
                        <span className="text-sm font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl font-semibold">
                          {currentCard.ipa}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(currentCard.word, 0.9);
                          }}
                          className="mt-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-xs font-bold text-indigo-600 inline-flex items-center gap-1.5 shadow-2xs"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Nghe phát âm chuẩn</span>
                        </button>
                        <span className="text-xs text-slate-400 pt-2">
                          Chạm vào thẻ để lật xem nghĩa tiếng Việt & câu ví dụ
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-extrabold text-teal-700">
                          {currentCard.meaningVi}
                        </span>
                        <p className="text-sm italic text-slate-700 max-w-md bg-white px-4 py-3 rounded-2xl border border-slate-200/80">
                          &ldquo;{currentCard.exampleSentence}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(currentCard.exampleSentence, 0.92);
                            }}
                            className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Nghe câu ví dụ</span>
                          </button>
                          <span className="text-[11px] font-mono text-slate-400">
                            Chu kỳ: {currentCard.intervalDays}d • EF: {currentCard.easinessFactor}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => handleRateCard(1)}
                      className="py-3 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
                    >
                      Chưa nhớ (Ôn lại 1d)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRateCard(3)}
                      className="py-3 px-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition"
                    >
                      Nhớ mang máng (3d)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRateCard(5)}
                      className="py-3 px-3 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition"
                    >
                      Nhớ rất rõ (+5 XP)
                    </button>
                  </div>
                </div>
              )}

              {vocabSubMode === "quiz" && (
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-card space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      Kiểm tra phản xạ nghĩa từ vựng
                    </span>
                    <button
                      type="button"
                      onClick={() => speakText(currentCard.word, 0.9)}
                      className="text-xs font-bold text-slate-600 hover:text-indigo-600 inline-flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe từ</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      {currentCard.word}{" "}
                      <span className="text-sm font-mono font-normal text-indigo-600">
                        {currentCard.ipa}
                      </span>
                    </h3>
                    <p className="text-xs italic text-slate-500">
                      &ldquo;{currentCard.exampleSentence}&rdquo;
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {quizOptions.map((opt) => {
                      const isChosen = quizAnswer === opt;
                      const isRight = opt === currentCard.meaningVi;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setQuizAnswer(opt);
                            if (opt === currentCard.meaningVi) setXp((x) => x + 5);
                          }}
                          className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition ${
                            isChosen
                              ? isRight
                                ? "bg-teal-50 border-teal-500 text-teal-900"
                                : "bg-rose-50 border-rose-400 text-rose-900"
                              : "bg-slate-50/70 hover:bg-white border-slate-200 text-slate-700"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswer && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold text-teal-700">
                        Đáp án đúng: {currentCard.meaningVi}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setQuizAnswer(null);
                          setCardIdx((c) => (c + 1) % vocabDeck.length);
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                      >
                        Từ tiếp theo →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {vocabSubMode === "wordlist" && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-card space-y-5">
                  <form onSubmit={handleAddCustomWord} className="flex flex-wrap gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Từ tiếng Anh mới..."
                      value={newWord}
                      onChange={(e) => setNewWord(e.target.value)}
                      className="flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Nghĩa tiếng Việt..."
                      value={newMeaning}
                      onChange={(e) => setNewMeaning(e.target.value)}
                      className="flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm thẻ</span>
                    </button>
                  </form>

                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    {vocabDeck.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-indigo-300 transition flex items-start justify-between gap-2"
                      >
                        <div className="space-y-1">
                          <div className="font-extrabold text-slate-900 text-sm">
                            {c.word}{" "}
                            <span className="font-mono text-xs font-normal text-indigo-600">
                              {c.ipa}
                            </span>
                          </div>
                          <div className="text-teal-700 font-bold">{c.meaningVi}</div>
                          <div className="text-slate-500 italic text-[11px] line-clamp-2">
                            &ldquo;{c.exampleSentence}&rdquo;
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakText(c.word, 0.9)}
                          className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 shrink-0"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI ROLEPLAY & SPEAKING ROOM */}
          {activeTab === "speaking" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600">
                    Phòng Đối Thoại Tình Huống (Cấp {selectedLevel})
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {activeScenario.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Vai AI: <strong>{activeScenario.aiPersona}</strong> • Mục tiêu:{" "}
                    {activeScenario.goalDescription}
                  </p>
                </div>
                <select
                  value={selectedScenarioIdx}
                  onChange={(e) => setSelectedScenarioIdx(Number(e.target.value))}
                  className="text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                >
                  {scenariosForLevel.map((s, idx) => (
                    <option key={s.id} value={idx}>
                      Kịch bản {idx + 1}: {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conversation Transcript Stream */}
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {chatHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      item.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                        item.sender === "user"
                          ? "bg-indigo-600 text-white font-medium"
                          : "bg-slate-100 text-slate-800 font-medium"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>{item.text}</span>
                        {item.sender === "ai" && (
                          <button
                            type="button"
                            onClick={() => speakText(item.text, 0.95)}
                            className="text-indigo-600 hover:text-indigo-800 shrink-0"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    {item.tip && (
                      <div className="mt-1.5 max-w-[85%] px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                        💡 <strong>Quick tip:</strong> {item.tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Suggested Quick Prompts */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-400">
                    GỢI Ý MẪU CÂU PHẢN XẠ NHANH:
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("builder")}
                    className="text-[11px] font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Puzzle className="w-3 h-3" />
                    <span>Bí cách ghép câu? Mở Xưởng Ghép Câu →</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeScenario.suggestedPhrases.map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => handleSendConversation(phrase)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 text-xs font-semibold transition"
                    >
                      &ldquo;{phrase}&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendConversation();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Nhập câu trả lời tiếng Anh của bạn..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi lời thoại</span>
                </button>
              </form>

              {speakingEvaluation && (
                <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-teal-950">
                      Điểm Rubric: {speakingEvaluation.overallScore}/100 ({speakingEvaluation.wpm}{" "}
                      WPM)
                    </div>
                    <div className="text-teal-800">{speakingEvaluation.vietnameseFeedback}</div>
                  </div>
                  <div className="flex gap-2 font-mono font-bold text-[11px]">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-teal-200 text-teal-800">
                      Fluency {speakingEvaluation.fluencyScore}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-teal-200 text-teal-800">
                      Vocab {speakingEvaluation.vocabularyScore}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-teal-200 text-teal-800">
                      Grammar {speakingEvaluation.grammarScore}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 40-TOPIC CURRICULUM CATALOG */}
          {activeTab === "topics" && (
            <div className="grid sm:grid-cols-2 gap-3.5">
              {TOPIC_VOCABULARY_DATA[selectedLevel].map((topic, idx) => {
                const lesson = catalogByLevel[idx % catalogByLevel.length];
                return (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-card hover:border-indigo-300 transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold">
                          {selectedLevel} • Chủ đề {(idx + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="font-mono text-slate-400">{topic.words.length} từ</span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {topic.topicTitle}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{lesson.title}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTopicIdx(idx);
                          setActiveTab("vocabulary");
                        }}
                        className="flex-1 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition"
                      >
                        Từ vựng SRS
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTopicIdx(idx);
                          setActiveTab("listening");
                        }}
                        className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
                      >
                        Vào bài nghe →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* RIGHT COLUMN (3 cols on Desktop): Live Vocabulary Inspector & Quick Flashcard */}
        <aside className="lg:col-span-3 space-y-5 lg:sticky lg:top-22">
          {/* Quick Mini SRS Flashcard Widget */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Thẻ Từ Vựng Nhanh</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {(cardIdx % vocabDeck.length) + 1}/{vocabDeck.length}
              </span>
            </div>

            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/40 border border-slate-200/90 transition text-center space-y-1.5 min-h-[125px] flex flex-col items-center justify-center"
            >
              {!isFlipped ? (
                <>
                  <div className="text-lg font-extrabold text-slate-900">{currentCard.word}</div>
                  <div className="text-xs font-mono text-indigo-600">{currentCard.ipa}</div>
                  <span className="text-[11px] text-slate-400">Bấm để lật nghĩa</span>
                </>
              ) : (
                <>
                  <div className="text-base font-extrabold text-teal-700">
                    {currentCard.meaningVi}
                  </div>
                  <p className="text-[11px] italic text-slate-500 line-clamp-2">
                    &ldquo;{currentCard.exampleSentence}&rdquo;
                  </p>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleRateCard(1)}
                className="py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700"
              >
                Quên
              </button>
              <button
                type="button"
                onClick={() => handleRateCard(3)}
                className="py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800"
              >
                Nhớ vừa
              </button>
              <button
                type="button"
                onClick={() => handleRateCard(5)}
                className="py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800"
              >
                Nhớ rõ
              </button>
            </div>
          </div>

          {/* Active Lesson Vocabulary List */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">
                Từ vựng bài đang học
              </span>
              <button
                type="button"
                onClick={() => setActiveTab("vocabulary")}
                className="text-[11px] font-bold text-indigo-600 hover:underline"
              >
                Mở rộng →
              </button>
            </div>

            <div className="space-y-2 max-h-[330px] overflow-y-auto pr-1">
              {vocabDeck.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">
                      {item.word}{" "}
                      <span className="font-mono text-[11px] font-normal text-slate-500">
                        {item.ipa}
                      </span>
                    </div>
                    <div className="text-teal-700 font-medium truncate">{item.meaningVi}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakText(item.word, 0.9)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 shrink-0"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Supabase Account Switch Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">
                {authMode === "signin" ? "Đổi tài khoản học viên" : "Đăng ký tài khoản mới"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode("signin")}
                className={`py-2 rounded-lg ${
                  authMode === "signin" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-600"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className={`py-2 rounded-lg ${
                  authMode === "signup" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-600"
                }`}
              >
                Đăng ký mới
              </button>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
              <input
                type="email"
                required
                placeholder="Email học viên..."
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
              <input
                type="password"
                required
                placeholder="Mật khẩu..."
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                {authMode === "signin" ? "Đồng bộ tài khoản" : "Tạo tài khoản"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
