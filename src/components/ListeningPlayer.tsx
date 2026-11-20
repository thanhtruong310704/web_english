"use client";
import React, { useState, useEffect, useRef } from "react";
import { getAudioStreamUrl, generateTranscriptBlob } from "@/lib/supabase-r2";
import {
  playSingleWordAudio,
  playWordByWordAudio,
  playSegmentAudio,
} from "@/lib/intensive-listening-engine";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Download,
  Volume2,
  CheckCircle2,
  XCircle,
  Lightbulb,
  FileText,
  Eye,
  EyeOff,
  Award,
} from "lucide-react";

export interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: "multiple_choice" | "true_false";
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface ListeningLessonProps {
  lessonId: string;
  title: string;
  cefrLevel: "A1" | "A2" | "B1" | "B2";
  transcript: string;
  duration: number;
  questions: QuizQuestion[];
  vocabularyNotes: string[];
  onCompleteLesson?: (score: number, xpEarned: number) => void;
}

const WAVE_BARS = [
  28, 52, 38, 72, 64, 92, 48, 80, 60, 35, 74, 88, 54, 42, 68, 95, 62, 46, 78, 50,
  84, 58, 40, 70, 90, 56, 44, 76, 64, 36, 68, 82, 52, 45, 72, 60, 40, 66, 54, 34,
];

export default function ListeningPlayer({
  lessonId,
  title,
  cefrLevel,
  transcript,
  duration,
  questions,
  vocabularyNotes,
  onCompleteLesson,
}: ListeningLessonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<0.6 | 0.75 | 1.0 | 1.25 | 1.5>(1.0);
  const [accent, setAccent] = useState<"US" | "UK" | "AU">("US");
  const [clickedWordInfo, setClickedWordInfo] = useState<{
    word: string;
    phrase: string;
    idx: number;
  } | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement | null>(null);

  const audioUrl = getAudioStreamUrl(lessonId, accent);

  useEffect(() => {
    setCurrentQuestionIdx(0);
    setShowExplanation(false);
    setQuizCompleted(false);
    setIsPlaying(false);
    setCurrentTime(0);
    if (typeof window !== "undefined") {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      const saved = window.localStorage.getItem(`ef_guest_progress_${lessonId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.selectedAnswers) setSelectedAnswers(parsed.selectedAnswers);
        } catch (_) {}
      } else {
        setSelectedAnswers({});
      }
    }
  }, [lessonId]);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(transcript);
          utter.lang = accent === "UK" ? "en-GB" : accent === "AU" ? "en-AU" : "en-US";
          utter.rate = playbackRate;
          utter.onend = () => setIsPlaying(false);
          window.speechSynthesis.speak(utter);
        }
      });
      setIsPlaying(true);
    }
  };

  const handleSkip = (deltaSec: number) => {
    if (!audioRef.current) return;
    const nextTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + deltaSec));
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleSpeedChange = (speed: 0.6 | 0.75 | 1.0 | 1.25 | 1.5) => {
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const speechLang: "en-US" | "en-GB" | "en-AU" =
    accent === "UK" ? "en-GB" : accent === "AU" ? "en-AU" : "en-US";
  const transcriptWords = transcript.split(/\s+/).filter(Boolean);

  const handleSelectOption = (questionId: string, option: string) => {
    const next = { ...selectedAnswers, [questionId]: option };
    setSelectedAnswers(next);
    setShowExplanation(true);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        `ef_guest_progress_${lessonId}`,
        JSON.stringify({ selectedAnswers: next, updatedAt: new Date().toISOString() })
      );
    }
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      setQuizCompleted(true);
      const correctCount = questions.filter((q) => selectedAnswers[q.id] === q.correct_answer).length;
      const score = Math.round((correctCount / Math.max(1, questions.length)) * 100);
      const baseXp = 15;
      const bonusXp = score === 100 ? Math.round(baseXp * 0.25) : 0;
      if (onCompleteLesson) onCompleteLesson(score, baseXp + bonusXp);
    }
  };

  const handleDownloadTranscript = () => {
    const textContent = generateTranscriptBlob(title, cefrLevel, transcript, vocabularyNotes);
    if (typeof window !== "undefined") {
      const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${lessonId}_transcript.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const currentQuestion = questions[currentQuestionIdx];
  const progressRatio = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  return (
    <div className="space-y-5">
      {/* Studio Audio Console Deck */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-soft border border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
              CEFR {cefrLevel} • Studio Audio
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {accent === "US" ? "🇺🇸 Giọng Mỹ" : accent === "UK" ? "🇬🇧 Giọng Anh" : "🇦🇺 Giọng Úc"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleDownloadTranscript}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải Transcript (.txt)</span>
          </button>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Nghe chủ động kết hợp đọc lời thoại và trả lời câu hỏi kiểm tra bên dưới
          </p>
        </div>

        {/* Acoustic Waveform Stage */}
        <div
          ref={waveformContainerRef}
          className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3"
        >
          <div className="flex items-end gap-1 h-12 px-1">
            {WAVE_BARS.map((height, idx) => {
              const barRatio = idx / WAVE_BARS.length;
              const isPassed = isPlaying || barRatio <= progressRatio;
              return (
                <div
                  key={idx}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    isPlaying
                      ? idx % 2 === 0
                        ? "bg-indigo-400 animate-pulse"
                        : "bg-teal-400 animate-pulse"
                      : isPassed
                      ? "bg-indigo-500"
                      : "bg-slate-700"
                  }`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>{isPlaying ? "● Đang phát âm thanh bản xứ" : "○ Sẵn sàng phát"}</span>
            <span>
              {Math.floor(currentTime)}s / {duration}s ({playbackRate}x)
            </span>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Transport Controls + Speed & Accent Pickers */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Play / Skip Controls */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleSkip(-5)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>-5s</span>
            </button>
            <button
              type="button"
              onClick={handleTogglePlay}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? "Tạm dừng" : "Phát bài nghe"}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSkip(5)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold inline-flex items-center gap-1 transition"
            >
              <span>+5s</span>
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed & Accent Group */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 gap-0.5">
              {([0.6, 0.75, 1.0, 1.25, 1.5] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => handleSpeedChange(spd)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition ${
                    playbackRate === spd
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 gap-0.5">
              {(["US", "UK", "AU"] as const).map((acc) => (
                <button
                  key={acc}
                  type="button"
                  onClick={() => setAccent(acc)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    accent === acc
                      ? "bg-teal-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {acc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transcript & Comprehension Quiz Grid (Desktop 2 columns inside center stage) */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Interactive Transcript Panel (5 cols on wide screen) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-card flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Lời thoại bài nghe (Transcript)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTranscript(!showTranscript)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showTranscript ? "Ẩn để luyện tai" : "Hiện lời thoại"}</span>
              </button>
            </div>

            {showTranscript ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span>Bấm vào bất kỳ từ nào để nghe phát âm chậm riêng từ đó:</span>
                  <button
                    type="button"
                    onClick={() => playWordByWordAudio(transcript, speechLang)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold shrink-0 inline-flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Đọc tách từng từ</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700 leading-relaxed font-medium flex flex-wrap gap-1">
                  {transcriptWords.map((word, idx) => {
                    const isPicked = clickedWordInfo?.idx === idx;
                    return (
                      <button
                        key={`${idx}-${word}`}
                        type="button"
                        onClick={() => {
                          const start = Math.max(0, idx - 1);
                          const end = Math.min(transcriptWords.length, idx + 2);
                          const phrase = transcriptWords.slice(start, end).join(" ");
                          setClickedWordInfo({ word, phrase, idx });
                          playSingleWordAudio(word, speechLang, 0.72);
                        }}
                        className={`px-1.5 py-0.5 rounded-lg transition ${
                          isPicked
                            ? "bg-indigo-600 text-white font-bold"
                            : "hover:bg-indigo-100 hover:text-indigo-900"
                        }`}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
                {clickedWordInfo && (
                  <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-extrabold text-indigo-950">
                      Đang soi: &ldquo;{clickedWordInfo.word.replace(/[.,!?]/g, "")}&rdquo;
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => playSingleWordAudio(clickedWordInfo.word, speechLang, 0.6)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-100"
                      >
                        Siêu chậm 0.6x
                      </button>
                      <button
                        type="button"
                        onClick={() => playSegmentAudio(clickedWordInfo.phrase, 0.75, speechLang)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                      >
                        Nghe cụm: &ldquo;{clickedWordInfo.phrase}&rdquo;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-1">
                <p className="text-xs font-bold text-slate-600">Chế độ Nghe Không Nhìn Chữ</p>
                <p className="text-xs text-slate-400">
                  Tập trung bắt từ khóa từ âm thanh trước khi mở lời thoại.
                </p>
              </div>
            )}
          </div>

          {vocabularyNotes.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400">Cụm từ trọng tâm trong bài</div>
              {vocabularyNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="text-xs text-slate-600 bg-indigo-50/50 border border-indigo-100 px-3 py-1.5 rounded-xl font-medium"
                >
                  • {note}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comprehension Quiz Card (7 cols on wide screen) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-card flex flex-col justify-between">
          {!quizCompleted && currentQuestion ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  Câu hỏi nghe hiểu {currentQuestionIdx + 1} / {questions.length}
                </span>
                <div className="flex items-center gap-1.5">
                  {questions.map((q, idx) => (
                    <span
                      key={q.id}
                      className={`w-2.5 h-2.5 rounded-full transition ${
                        idx === currentQuestionIdx
                          ? "bg-indigo-600 scale-110"
                          : selectedAnswers[q.id]
                          ? "bg-teal-500"
                          : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {currentQuestion.question_text}
              </h3>

              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const chosen = selectedAnswers[currentQuestion.id] === opt;
                  const isCorrect = opt === currentQuestion.correct_answer;
                  const optionLetter = String.fromCharCode(65 + idx);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, opt)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-sm transition flex items-center justify-between gap-3 ${
                        chosen
                          ? isCorrect
                            ? "bg-teal-50/90 border-teal-500 text-teal-950 font-bold shadow-2xs"
                            : "bg-rose-50/90 border-rose-400 text-rose-950 font-bold"
                          : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 text-slate-700 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl text-xs font-extrabold flex items-center justify-center shrink-0 ${
                            chosen
                              ? isCorrect
                                ? "bg-teal-600 text-white"
                                : "bg-rose-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {optionLetter}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {chosen &&
                        (isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        ))}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs sm:text-sm text-amber-950 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Giải thích:</strong> {currentQuestion.explanation}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm transition"
                >
                  {currentQuestionIdx + 1 < questions.length
                    ? "Câu hỏi tiếp theo →"
                    : "Hoàn thành bài nghe"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center mx-auto">
                <Award className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Đã hoàn thành bài luyện nghe!
                </h3>
                <p className="text-xs text-slate-500">
                  Điểm kinh nghiệm (XP) và tiến độ bài học đã được lưu tự động.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setQuizCompleted(false);
                  setCurrentQuestionIdx(0);
                  setShowExplanation(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Làm lại bộ câu hỏi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
