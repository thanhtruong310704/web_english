"use client";
import React, { useState, useEffect } from "react";
import { updateSRSCardSM2, SRSCard } from "@/lib/srs-flashcards";
import {
  TOPIC_VOCABULARY_DATA,
  getTopicVocabularyCards,
  getTopicTitle,
} from "@/lib/topic-vocabulary";
import {
  BookOpen,
  Volume2,
  Sparkles,
  ArrowLeft,
  Layers,
  Search,
  ChevronRight,
} from "lucide-react";

export default function VocabularyPage() {
  const [level, setLevel] = useState<"A1" | "A2" | "B1" | "B2">("A1");
  const [topicIdx, setTopicIdx] = useState(0);
  const [deck, setDeck] = useState<SRSCard[]>(() => getTopicVocabularyCards("A1", 0));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [xp, setXp] = useState(520);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("ef_auth_user")) {
      window.location.replace("/login");
    }
  }, []);

  useEffect(() => {
    setDeck(getTopicVocabularyCards(level, topicIdx));
    setIdx(0);
    setFlipped(false);
  }, [level, topicIdx]);

  const current = deck[idx % deck.length] || deck[0];

  const handleRate = (q: 1 | 3 | 5) => {
    const next = [...deck];
    next[idx % deck.length] = updateSRSCardSM2(current, q);
    setDeck(next);
    setFlipped(false);
    setIdx((i) => (i + 1) % deck.length);
    if (q === 5) setXp((x) => x + 5);
  };

  const handleSpeak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const currentTopics = TOPIC_VOCABULARY_DATA[level];
  const activeTopicWords = currentTopics[topicIdx % currentTopics.length].words.filter(
    (w) =>
      !searchQuery.trim() ||
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaningVi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-canvas text-slate-900">
      {/* Top Studio Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm">
              EF
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                Kho Từ Vựng 40 Chủ Đề & Thẻ Lật SRS SM-2
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                640+ mục từ vựng chuẩn CEFR A1–B2 • Phiên âm IPA & Phát âm bản xứ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold font-mono inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{xp} XP</span>
            </span>
            <a
              href="/"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Về Bàn Học Chính</span>
            </a>
          </div>
        </div>
      </header>

      {/* Widescreen 2-Pane Layout */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Level & Topic Picker (4 cols) */}
        <aside className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-card space-y-4 lg:sticky lg:top-22">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Chọn Cấp Độ & Chủ Đề</span>
            </span>
            <span className="text-[11px] font-mono text-indigo-600 font-bold">
              {deck.length} từ
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
            {(["A1", "A2", "B1", "B2"] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  setLevel(lvl);
                  setTopicIdx(0);
                }}
                className={`py-2 rounded-xl text-xs font-extrabold transition ${
                  level === lvl
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
            {currentTopics.map((item, i) => {
              const active = topicIdx === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopicIdx(i)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs transition flex items-center justify-between gap-2 ${
                    active
                      ? "bg-indigo-50 text-indigo-950 font-bold border border-indigo-200"
                      : "hover:bg-slate-50 text-slate-600 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`w-6 h-6 rounded-lg font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                        active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="truncate">{item.topicTitle}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Stage: Flashcard Deck + Grid Wordlist (8 cols) */}
        <main className="lg:col-span-8 space-y-6">
          {/* Interactive SRS Flashcard Deck */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 text-center space-y-6 shadow-card">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>
                  {getTopicTitle(level, topicIdx)} (Cấp {level})
                </span>
              </span>
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Thẻ {(idx % deck.length) + 1} / {deck.length}
              </span>
            </div>

            <div
              onClick={() => setFlipped(!flipped)}
              className="cursor-pointer min-h-[240px] p-8 rounded-3xl bg-gradient-to-b from-slate-50 to-indigo-50/30 border-2 border-dashed border-indigo-200 hover:border-indigo-400 transition flex flex-col items-center justify-center space-y-3"
            >
              {!flipped ? (
                <>
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {current.word}
                  </span>
                  <span className="text-sm font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl font-semibold">
                    {current.ipa}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(current.word);
                    }}
                    className="mt-1 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-indigo-600 hover:bg-indigo-50 inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe phát âm</span>
                  </button>
                  <span className="text-xs text-slate-400 pt-1">
                    Chạm vào thẻ để lật xem nghĩa tiếng Việt & câu ví dụ
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-extrabold text-teal-700">
                    {current.meaningVi}
                  </span>
                  <p className="text-sm italic text-slate-700 max-w-lg bg-white px-4 py-3 rounded-2xl border border-slate-200">
                    &ldquo;{current.exampleSentence}&rdquo;
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(current.exampleSentence);
                    }}
                    className="text-xs text-indigo-600 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe câu ví dụ mẫu</span>
                  </button>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleRate(1)}
                className="py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
              >
                Chưa nhớ (1 ngày)
              </button>
              <button
                type="button"
                onClick={() => handleRate(3)}
                className="py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition"
              >
                Nhớ vừa (3 ngày)
              </button>
              <button
                type="button"
                onClick={() => handleRate(5)}
                className="py-3 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition"
              >
                Nhớ rất rõ (+5 XP)
              </button>
            </div>
          </div>

          {/* Searchable Multi-Column Wordlist Grid */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-extrabold text-slate-900">
                Danh sách từ vựng chủ đề &ldquo;{getTopicTitle(level, topicIdx)}&rdquo;
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm nhanh từ hoặc nghĩa..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {activeTopicWords.map((item, wIdx) => (
                <div
                  key={wIdx}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-start justify-between gap-3 hover:bg-white hover:border-indigo-300 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-sm">{item.word}</span>
                      <span className="font-mono text-indigo-600 text-xs">{item.ipa}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                        {item.pos}
                      </span>
                    </div>
                    <div className="text-teal-700 font-bold text-xs">{item.meaningVi}</div>
                    <div className="text-slate-500 italic text-[11px]">
                      &ldquo;{item.exampleSentence}&rdquo;
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSpeak(item.word)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 text-xs font-bold shrink-0 shadow-2xs"
                    title="Nghe phát âm từ này"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
