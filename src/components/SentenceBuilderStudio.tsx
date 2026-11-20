"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  CEFRLevel,
  SENTENCE_DRILLS_BY_LEVEL,
  REUSABLE_SENTENCE_FRAMES,
  buildDynamicChunkDrillsFromLesson,
  evaluateChunkAssembly,
  evaluateFreeSentenceProduction,
  loadSentenceBuilderProgress,
  saveSentenceBuilderProgress,
  SentenceEvaluationResult,
} from "@/lib/sentence-builder-engine";
import { ListeningSegment, playSegmentAudio } from "@/lib/intensive-listening-engine";
import { SRSCard } from "@/lib/srs-flashcards";
import {
  Puzzle,
  Layers,
  PenTool,
  Volume2,
  Lightbulb,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Mic,
  Eye,
  EyeOff,
} from "lucide-react";

export interface SentenceBuilderStudioProps {
  cefrLevel: CEFRLevel;
  topicTitle: string;
  lessonSegments: ListeningSegment[];
  vocabCards: SRSCard[];
  onXpEarned?: (xp: number) => void;
}

type BuilderMode = "chunks" | "frames" | "activeRecall";

function deterministicShuffle<T>(arr: T[], seed: string): T[] {
  const copy = [...arr];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  for (let i = copy.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) | 0;
    const j = Math.abs(hash) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function SentenceBuilderStudio({
  cefrLevel,
  topicTitle,
  lessonSegments,
  vocabCards,
  onXpEarned,
}: SentenceBuilderStudioProps) {
  const [mode, setMode] = useState<BuilderMode>("chunks");
  const [drillSource, setDrillSource] = useState<"realLife" | "lesson">("realLife");
  const [drillIdx, setDrillIdx] = useState(0);
  const [progress, setProgress] = useState(() => loadSentenceBuilderProgress());

  // Mode 1: Chunk Assembly State
  const [includeTraps, setIncludeTraps] = useState(false);
  const [selectedChunkIndices, setSelectedChunkIndices] = useState<number[]>([]);
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2>(0);
  const [chunkResult, setChunkResult] = useState<ReturnType<typeof evaluateChunkAssembly> | null>(
    null
  );
  const [lockInMode, setLockInMode] = useState(false);
  const [lockInInput, setLockInInput] = useState("");
  const [lockInPassed, setLockInPassed] = useState<boolean | null>(null);

  // Mode 2: Reusable Frames State
  const framesForLevel = useMemo(() => {
    const exact = REUSABLE_SENTENCE_FRAMES.filter((f) => f.cefrLevel === cefrLevel);
    return exact.length > 0 ? exact : REUSABLE_SENTENCE_FRAMES;
  }, [cefrLevel]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [slotValues, setSlotValues] = useState<Record<string, string>>({});
  const [customSlotMode, setCustomSlotMode] = useState(false);

  // Mode 3: Active Recall Free-Write State
  const [freeInput, setFreeInput] = useState("");
  const [showKeywordsHint, setShowKeywordsHint] = useState(true);
  const [showFormulaHint, setShowFormulaHint] = useState(false);
  const [freeEval, setFreeEval] = useState<SentenceEvaluationResult | null>(null);
  const [isListeningMic, setIsListeningMic] = useState(false);

  const activeDrills = useMemo(() => {
    if (drillSource === "lesson" && lessonSegments.length > 0) {
      return buildDynamicChunkDrillsFromLesson(lessonSegments, cefrLevel, topicTitle);
    }
    return SENTENCE_DRILLS_BY_LEVEL[cefrLevel] || SENTENCE_DRILLS_BY_LEVEL.A1;
  }, [drillSource, lessonSegments, cefrLevel, topicTitle]);

  const currentDrill = activeDrills[drillIdx % activeDrills.length] || activeDrills[0];
  const currentFrame = framesForLevel[frameIdx % framesForLevel.length] || framesForLevel[0];

  // Reset drill state when drill changes
  useEffect(() => {
    setSelectedChunkIndices([]);
    setHintLevel(0);
    setChunkResult(null);
    setLockInMode(false);
    setLockInInput("");
    setLockInPassed(null);
    setFreeInput("");
    setShowFormulaHint(false);
    setFreeEval(null);
  }, [currentDrill.id, includeTraps]);

  // Reset frame slots when frame changes
  useEffect(() => {
    const initial: Record<string, string> = {};
    currentFrame.slots.forEach((slot) => {
      initial[slot.id] = slot.options[0]?.en || "";
    });
    setSlotValues(initial);
  }, [currentFrame]);

  // Reset indices on level/source switch
  useEffect(() => {
    setDrillIdx(0);
    setFrameIdx(0);
  }, [cefrLevel, drillSource]);

  const chunkPool = useMemo(() => {
    const raw = includeTraps
      ? [...currentDrill.chunks, ...currentDrill.distractorChunks]
      : [...currentDrill.chunks];
    return deterministicShuffle(raw, currentDrill.id + (includeTraps ? "-traps" : ""));
  }, [currentDrill, includeTraps]);

  const assembledChunks = selectedChunkIndices.map((idx) => chunkPool[idx]);

  const recordCompletion = (drillId: string, earnedXp: number) => {
    const nextCompleted = progress.completedDrillIds.includes(drillId)
      ? progress.completedDrillIds
      : [...progress.completedDrillIds, drillId];
    const nextProgress = {
      completedDrillIds: nextCompleted,
      totalXp: progress.totalXp + earnedXp,
      streakCorrect: progress.streakCorrect + 1,
      updatedAt: new Date().toISOString(),
    };
    setProgress(nextProgress);
    saveSentenceBuilderProgress(nextProgress);
    if (onXpEarned && earnedXp > 0) onXpEarned(earnedXp);
  };

  const handleTogglePoolChunk = (poolIdx: number) => {
    if (chunkResult) return;
    if (selectedChunkIndices.includes(poolIdx)) {
      setSelectedChunkIndices((prev) => prev.filter((i) => i !== poolIdx));
    } else {
      setSelectedChunkIndices((prev) => [...prev, poolIdx]);
    }
  };

  const handleStarterHint = () => {
    setHintLevel(2);
    const firstChunkText = currentDrill.chunks[0];
    const firstPoolIdx = chunkPool.findIndex((c) => c === firstChunkText);
    if (firstPoolIdx >= 0 && !selectedChunkIndices.includes(firstPoolIdx)) {
      setSelectedChunkIndices([firstPoolIdx, ...selectedChunkIndices]);
    }
  };

  const handleCheckChunks = () => {
    const res = evaluateChunkAssembly(currentDrill, assembledChunks);
    setChunkResult(res);
    if (res.isExact) {
      playSegmentAudio(currentDrill.englishTarget, 0.9);
      recordCompletion(currentDrill.id, res.xpEarned);
    }
  };

  const handleCheckLockIn = () => {
    const evalRes = evaluateFreeSentenceProduction(lockInInput, currentDrill);
    setLockInPassed(evalRes.passed);
    if (evalRes.passed && onXpEarned) onXpEarned(10);
  };

  const handleCheckFreeWrite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeInput.trim()) return;
    const res = evaluateFreeSentenceProduction(freeInput, currentDrill);
    setFreeEval(res);
    if (res.passed) {
      playSegmentAudio(res.bestReference, 0.92);
      recordCompletion(currentDrill.id + "-free", res.xpEarned);
    }
  };

  const handleVoiceDictate = () => {
    if (typeof window === "undefined") return;
    const SpeechRec =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SpeechRec) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new (SpeechRec as any)();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.onstart = () => setIsListeningMic(true);
      recognition.onend = () => setIsListeningMic(false);
      recognition.onerror = () => setIsListeningMic(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event?.results?.[0]?.[0]?.transcript || "";
        if (transcript) setFreeInput(transcript);
      };
      recognition.start();
    } catch (_) {
      setIsListeningMic(false);
    }
  };

  const builtFrameSentence = useMemo(() => {
    let out = "";
    currentFrame.templateParts.forEach((part, idx) => {
      out += part;
      const slot = currentFrame.slots[idx];
      if (slot) {
        out += slotValues[slot.id] || `[${slot.labelVi}]`;
      }
    });
    return out.replace(/\s+/g, " ").replace(/\s+([,.;?])/g, "$1").trim();
  }, [currentFrame, slotValues]);

  const builtFrameMeaningVi = useMemo(() => {
    return currentFrame.slots
      .map((slot) => {
        const val = slotValues[slot.id];
        const found = slot.options.find((o) => o.en === val);
        return `${slot.labelVi}: ${found ? found.vi : val}`;
      })
      .join(" • ");
  }, [currentFrame, slotValues]);

  return (
    <div className="space-y-5">
      {/* Sub-mode Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 bg-slate-200/70 p-1.5 rounded-2xl text-xs font-bold">
        {[
          { id: "chunks", label: "1. Ghép Khối Câu (Việt → Anh)", icon: Puzzle },
          { id: "frames", label: "2. Xưởng Khung Câu Đa Năng", icon: Layers },
          { id: "activeRecall", label: "3. Tự Diễn Đạt Chủ Động", icon: PenTool },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id as BuilderMode)}
              className={`py-2.5 px-3 rounded-xl transition inline-flex items-center justify-center gap-1.5 ${
                isActive
                  ? "bg-white text-indigo-600 shadow-card font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* MODE 1: CHUNK ASSEMBLY (VIETNAMESE THOUGHT -> ENGLISH CHUNKS) */}
      {mode === "chunks" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-card space-y-5">
          {/* Header & Source Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold">
                  Câu {(drillIdx % activeDrills.length) + 1} / {activeDrills.length} • {cefrLevel}
                </span>
                <span className="text-slate-400 font-semibold">{currentDrill.category}</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                Ghép cụm từ quen thuộc thành câu nói tự nhiên
              </h2>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setDrillSource("realLife")}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  drillSource === "realLife"
                    ? "bg-white text-indigo-600 shadow-2xs"
                    : "text-slate-500"
                }`}
              >
                Câu giao tiếp thực tế
              </button>
              <button
                type="button"
                onClick={() => setDrillSource("lesson")}
                className={`px-2.5 py-1.5 rounded-lg transition ${
                  drillSource === "lesson"
                    ? "bg-white text-indigo-600 shadow-2xs"
                    : "text-slate-500"
                }`}
              >
                Từ bài nghe đang học
              </button>
            </div>
          </div>

          {/* Vietnamese Intention Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-slate-50 border border-indigo-200/70 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
                Ý bạn muốn nói bằng tiếng Việt:
              </span>
              {drillSource === "lesson" && (
                <button
                  type="button"
                  onClick={() => playSegmentAudio(currentDrill.englishTarget, 0.8)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-white px-3 py-1 rounded-xl border border-indigo-200 hover:bg-indigo-50"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nghe câu mẫu (0.8x)</span>
                </button>
              )}
            </div>
            <p className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
              &ldquo;{currentDrill.vietnameseIntent}&rdquo;
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setHintLevel(hintLevel === 0 ? 1 : hintLevel)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 text-xs font-bold text-amber-800 inline-flex items-center gap-1.5 transition"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Gợi ý khung câu</span>
              </button>
              <button
                type="button"
                onClick={handleStarterHint}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-xs font-bold text-indigo-700 inline-flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Mồi cụm mở đầu</span>
              </button>
              {currentDrill.distractorChunks.length > 0 && (
                <label className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTraps}
                    onChange={(e) => setIncludeTraps(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span>Thêm bẫy lỗi Việt-Anh</span>
                </label>
              )}
            </div>
          </div>

          {/* Progressive Hint Box */}
          {hintLevel >= 1 && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="font-extrabold">Khung xương câu: {currentDrill.formulaVi}</div>
              <div className="text-amber-800">💡 {currentDrill.viToEnTip}</div>
            </div>
          )}

          {/* Assembly Drop Zone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500">Câu tiếng Anh bạn đang ghép:</span>
              {selectedChunkIndices.length > 0 && !chunkResult && (
                <button
                  type="button"
                  onClick={() => setSelectedChunkIndices([])}
                  className="text-slate-400 hover:text-rose-600 font-bold inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Xóa ghép lại</span>
                </button>
              )}
            </div>

            <div className="min-h-[76px] p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex flex-wrap items-center gap-2">
              {selectedChunkIndices.length === 0 ? (
                <span className="text-xs text-slate-400 font-medium">
                  Chạm lần lượt vào các khối từ bên dưới để lắp thành câu hoàn chỉnh...
                </span>
              ) : (
                selectedChunkIndices.map((poolIdx, orderIdx) => (
                  <button
                    key={`${poolIdx}-${orderIdx}`}
                    type="button"
                    onClick={() => handleTogglePoolChunk(poolIdx)}
                    disabled={!!chunkResult}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-sm hover:bg-indigo-700 disabled:opacity-90 transition"
                  >
                    {chunkPool[poolIdx]}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Clickable Chunk Bank */}
          <div className="flex flex-wrap gap-2">
            {chunkPool.map((chunk, idx) => {
              const isUsed = selectedChunkIndices.includes(idx);
              return (
                <button
                  key={`${chunk}-${idx}`}
                  type="button"
                  onClick={() => handleTogglePoolChunk(idx)}
                  disabled={isUsed || !!chunkResult}
                  className={`px-3.5 py-2.5 rounded-xl border text-sm font-bold transition ${
                    isUsed
                      ? "bg-slate-100 border-slate-200 text-slate-300 cursor-default"
                      : "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-800 shadow-2xs"
                  }`}
                >
                  {chunk}
                </button>
              );
            })}
          </div>

          {/* Action / Result Area */}
          {!chunkResult ? (
            <button
              type="button"
              onClick={handleCheckChunks}
              disabled={selectedChunkIndices.length === 0}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-bold shadow-sm transition"
            >
              Kiểm tra câu vừa ghép
            </button>
          ) : (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  chunkResult.isExact
                    ? "bg-teal-50/90 border-teal-300 text-teal-950"
                    : "bg-amber-50/90 border-amber-300 text-amber-950"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold flex items-center gap-1.5">
                    {chunkResult.isExact ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    <span>{chunkResult.feedbackVi}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => playSegmentAudio(currentDrill.englishTarget, 0.88)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-indigo-700 inline-flex items-center gap-1 shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe chuẩn</span>
                  </button>
                </div>
                <div className="text-sm font-bold text-slate-900 bg-white/80 px-3.5 py-2.5 rounded-xl border border-slate-200/70">
                  Câu chuẩn: &ldquo;{currentDrill.englishTarget}&rdquo;
                </div>
                <p className="text-xs text-slate-700">
                  <strong>Mẹo tư duy Việt → Anh:</strong> {currentDrill.viToEnTip}
                </p>
              </div>

              {/* Active Recall Lock-In Challenge */}
              {chunkResult.isExact && !lockInMode && (
                <button
                  type="button"
                  onClick={() => setLockInMode(true)}
                  className="w-full py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition"
                >
                  🧠 Khóa trí nhớ chủ động: Ẩn câu mẫu & tự gõ lại (+10 XP)
                </button>
              )}

              {lockInMode && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-700">
                    Gõ lại câu cho ý: &ldquo;{currentDrill.vietnameseIntent}&rdquo;
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={lockInInput}
                      onChange={(e) => setLockInInput(e.target.value)}
                      placeholder="Gõ lại từ trí nhớ của bạn..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleCheckLockIn}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                    >
                      Kiểm tra
                    </button>
                  </div>
                  {lockInPassed !== null && (
                    <p
                      className={`text-xs font-bold ${
                        lockInPassed ? "text-teal-700" : "text-amber-700"
                      }`}
                    >
                      {lockInPassed
                        ? "✓ Đã khóa vào trí nhớ chủ động! Lần sau gặp tình huống này bạn sẽ bật ra ngay."
                        : "Gần đúng rồi — hãy nghe lại câu chuẩn rồi thử gõ thêm lần nữa nhé."}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2.5">
                {!chunkResult.isExact && (
                  <button
                    type="button"
                    onClick={() => {
                      setChunkResult(null);
                      setSelectedChunkIndices([]);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                  >
                    Ghép lại câu này
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDrillIdx((i) => (i + 1) % activeDrills.length)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 transition"
                >
                  <span>Câu tiếp theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: REUSABLE SENTENCE FRAMES */}
      {mode === "frames" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-card space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                Khung câu xương sống • Cấp {cefrLevel}
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                1 khung câu → nói được hàng chục tình huống khác nhau
              </h2>
            </div>

            <select
              value={frameIdx % framesForLevel.length}
              onChange={(e) => setFrameIdx(Number(e.target.value))}
              className="text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
            >
              {framesForLevel.map((f, idx) => (
                <option key={f.id} value={idx}>
                  {idx + 1}. {f.titleVi}
                </option>
              ))}
            </select>
          </div>

          {/* Live Built Sentence Banner */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
              <span>Mẫu: {currentFrame.patternEn}</span>
              <span className="text-teal-300 font-semibold">{currentFrame.category}</span>
            </div>
            <p className="text-lg sm:text-xl font-extrabold leading-snug text-white">
              &ldquo;{builtFrameSentence}&rdquo;
            </p>
            <p className="text-xs text-slate-300">
              💡 {currentFrame.meaningVi} ({builtFrameMeaningVi})
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => playSegmentAudio(builtFrameSentence, 0.75)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe chậm 0.75x</span>
              </button>
              <button
                type="button"
                onClick={() => playSegmentAudio(builtFrameSentence, 1.0)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe tốc độ tự nhiên 1.0x</span>
              </button>
              <button
                type="button"
                onClick={() => setCustomSlotMode((v) => !v)}
                className="ml-auto px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-teal-200"
              >
                {customSlotMode ? "Chọn từ gợi ý" : "Tự điền ý của bạn"}
              </button>
            </div>
          </div>

          {/* Interactive Slots */}
          <div className="grid sm:grid-cols-2 gap-4">
            {currentFrame.slots.map((slot, sIdx) => (
              <div
                key={slot.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5"
              >
                <div className="text-xs font-extrabold text-slate-800">
                  Ô #{sIdx + 1}: {slot.labelVi}
                </div>
                {customSlotMode ? (
                  <input
                    type="text"
                    value={slotValues[slot.id] || ""}
                    onChange={(e) =>
                      setSlotValues((prev) => ({ ...prev, [slot.id]: e.target.value }))
                    }
                    placeholder={slot.placeholder}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm outline-none focus:border-indigo-500"
                  />
                ) : (
                  <div className="space-y-1.5">
                    {slot.options.map((opt) => {
                      const active = slotValues[slot.id] === opt.en;
                      return (
                        <button
                          key={opt.en}
                          type="button"
                          onClick={() =>
                            setSlotValues((prev) => ({ ...prev, [slot.id]: opt.en }))
                          }
                          className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition ${
                            active
                              ? "bg-indigo-600 border-indigo-600 text-white font-bold"
                              : "bg-white border-slate-200 hover:border-indigo-300 text-slate-700 font-medium"
                          }`}
                        >
                          <div>{opt.en}</div>
                          <div
                            className={`text-[11px] ${
                              active ? "text-indigo-100" : "text-slate-400"
                            }`}
                          >
                            {opt.vi}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900">
            <strong>Khi nào dùng khung này?</strong> {currentFrame.whenToUseVi}
          </div>
        </div>
      )}

      {/* MODE 3: ACTIVE RECALL FREE-WRITE + VIETLISH DETECTOR */}
      {mode === "activeRecall" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-card space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                Luyện Phản Xạ Tự Diễn Đạt • Câu {(drillIdx % activeDrills.length) + 1}/
                {activeDrills.length}
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                Đọc ý tiếng Việt → Tự đặt câu tiếng Anh (không nhìn đáp án)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setDrillIdx((i) => (i + 1) % activeDrills.length)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
            >
              Đổi câu khác →
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-[11px] font-extrabold uppercase text-slate-400">
              Hãy diễn đạt ý này bằng tiếng Anh:
            </div>
            <p className="text-base sm:text-lg font-extrabold text-slate-900">
              &ldquo;{currentDrill.vietnameseIntent}&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowKeywordsHint((v) => !v)}
                className="text-xs font-bold text-indigo-600 inline-flex items-center gap-1"
              >
                {showKeywordsHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showKeywordsHint ? "Ẩn từ khóa mồi" : "Hiện từ khóa mồi"}</span>
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => setShowFormulaHint((v) => !v)}
                className="text-xs font-bold text-amber-700 inline-flex items-center gap-1"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showFormulaHint ? "Ẩn khung công thức" : "Xem khung công thức"}</span>
              </button>
            </div>

            {showKeywordsHint && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400">Từ quen gợi ý:</span>
                {currentDrill.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 text-xs font-bold"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}

            {showFormulaHint && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold">
                Khung gợi ý: {currentDrill.formulaVi}
              </div>
            )}
          </div>

          <form onSubmit={handleCheckFreeWrite} className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                value={freeInput}
                onChange={(e) => setFreeInput(e.target.value)}
                placeholder="Gõ câu tiếng Anh của bạn (hoặc bấm biểu tượng micro để nói)..."
                className="w-full p-4 pr-12 rounded-2xl border border-slate-300 bg-white focus:border-indigo-500 outline-none text-sm font-medium"
              />
              <button
                type="button"
                onClick={handleVoiceDictate}
                title="Nói bằng micro (Web Speech API)"
                className={`absolute right-3 top-3 p-2 rounded-xl border transition ${
                  isListeningMic
                    ? "bg-rose-600 text-white border-rose-600 animate-pulse"
                    : "bg-slate-50 hover:bg-indigo-50 text-slate-600 border-slate-200"
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!freeInput.trim()}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-bold transition"
            >
              Chấm điểm & Sửa lỗi diễn đạt Việt → Anh
            </button>
          </form>

          {freeEval && (
            <div className="space-y-3">
              <div
                className={`p-4 rounded-2xl border space-y-2.5 ${
                  freeEval.passed
                    ? "bg-teal-50/90 border-teal-300 text-teal-950"
                    : "bg-amber-50/90 border-amber-300 text-amber-950"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold">
                    Điểm diễn đạt: {freeEval.score}/100 (+{freeEval.xpEarned} XP)
                  </span>
                  <button
                    type="button"
                    onClick={() => playSegmentAudio(freeEval.bestReference, 0.9)}
                    className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-indigo-700 inline-flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe cách nói tự nhiên</span>
                  </button>
                </div>
                <p className="text-xs font-semibold">{freeEval.feedbackVi}</p>

                <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs space-y-1">
                  <div className="font-bold text-slate-900">
                    Cách nói tự nhiên: &ldquo;{freeEval.bestReference}&rdquo;
                  </div>
                  <div className="text-slate-600">💡 {currentDrill.viToEnTip}</div>
                </div>

                {freeEval.vietlishIssues.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {freeEval.vietlishIssues.map((issue, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-0.5"
                      >
                        <div className="font-extrabold">
                          ⚠️ Lỗi dịch sát kiểu Việt: {issue.patternLabel}
                        </div>
                        <div>{issue.explanationVi}</div>
                        <div className="font-bold text-teal-800">→ {issue.fixSuggestion}</div>
                      </div>
                    ))}
                  </div>
                )}

                {freeEval.missingKeywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="font-bold text-slate-500">Từ khóa nên dùng thêm:</span>
                    {freeEval.missingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded-lg bg-white border border-amber-300 text-amber-800 font-bold"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Vocabulary Inspiration from Current Topic */}
          {vocabCards.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-bold text-slate-400">
                TỪ VỰNG BÀI &ldquo;{topicTitle.toUpperCase()}&rdquo; ĐỂ TẬP ĐẶT CÂU THÊM:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {vocabCards.slice(0, 6).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFreeInput((prev) => (prev ? `${prev} ${c.word}` : c.word))}
                    className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-xs font-semibold text-slate-700"
                    title={`${c.meaningVi} — bấm để chèn vào ô viết`}
                  >
                    {c.word} <span className="text-slate-400">({c.meaningVi})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
