"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ListeningSegment,
  buildWordSpottingDrill,
  buildWordDiscriminationDrill,
  evaluateWordDiscrimination,
  WordDiscriminationResult,
  buildClozeDrill,
  evaluateClozeDrill,
  ClozeEvaluation,
  detectConnectedSpeechTips,
  splitIntoSpeechChunks,
  getNextLadderSpeed,
  loadIntensiveListeningProfile,
  saveIntensiveListeningProfile,
  computeListeningEarIndex,
  playSegmentAudio,
  playWordByWordAudio,
  playSingleWordAudio,
  LadderSpeed,
} from "@/lib/intensive-listening-engine";
import {
  Volume2,
  Ear,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  SlidersHorizontal,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

export interface IntensiveListeningDrillProps {
  lessonId: string;
  title: string;
  cefrLevel: "A1" | "A2" | "B1" | "B2";
  segments: ListeningSegment[];
  onXpEarned?: (xp: number) => void;
}

type Stage = "spot" | "wordChoice" | "cloze" | "xray" | "summary";

/**
 * MODULE NGHE NHẬN DẠNG TỪ CHUYÊN SÂU — Tối ưu cho người nghe yếu:
 * 1. Nghe chậm (0.6x/0.7x) + Tách cụm + Đọc tách từng từ → Bắt từ nghe được (Word Spotting)
 * 2. Phân biệt từ dễ nhầm (Word Discrimination — chỉ 1 từ thực sự có trong câu, nghe so sánh trực tiếp)
 * 3. Điền từ có trợ giúp (Chế độ Chọn từ cho người yếu / Tự gõ + Gợi ý chữ cái + Nghe riêng cụm)
 * 4. Giải mã âm thanh (Audio X-Ray): Bấm từng từ nghe tách lẻ + Mẹo Nối âm & Rút gọn
 */
export default function IntensiveListeningDrill({
  lessonId,
  title,
  cefrLevel,
  segments,
  onXpEarned,
}: IntensiveListeningDrillProps) {
  const [profile, setProfile] = useState(() => loadIntensiveListeningProfile(lessonId));
  const [segmentIdx, setSegmentIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("spot");
  const [replayCount, setReplayCount] = useState(0);
  const [activeSpeed, setActiveSpeed] = useState<LadderSpeed>(profile.currentSpeed);

  // Stage 1: Word Spotting
  const [spottedWords, setSpottedWords] = useState<string[]>([]);
  const [spotChecked, setSpotChecked] = useState(false);

  // Stage 2: Word Discrimination
  const [wdResult, setWdResult] = useState<WordDiscriminationResult | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Stage 3: Scaffolded Cloze
  const [clozeInputs, setClozeInputs] = useState<string[]>([]);
  const [clozeResult, setClozeResult] = useState<ClozeEvaluation | null>(null);
  const [beginnerWordBank, setBeginnerWordBank] = useState(true);
  const [showLetterHints, setShowLetterHints] = useState(false);

  // Stage 4: Audio X-Ray
  const [activeXrayWord, setActiveXrayWord] = useState<string | null>(null);

  const [roundXp, setRoundXp] = useState(0);

  const lang: "en-US" | "en-GB" = cefrLevel === "B2" ? "en-GB" : "en-US";

  useEffect(() => {
    const loaded = loadIntensiveListeningProfile(lessonId);
    setProfile(loaded);
    setActiveSpeed(loaded.currentSpeed);
    setSegmentIdx(0);
    setStage("spot");
    setReplayCount(0);
    setSpottedWords([]);
    setSpotChecked(false);
    setWdResult(null);
    setSelectedWord(null);
    setClozeResult(null);
    setShowLetterHints(false);
    setActiveXrayWord(null);
    setRoundXp(0);
  }, [lessonId]);

  const segment = segments[segmentIdx] || segments[0];
  const chunks = useMemo(() => splitIntoSpeechChunks(segment.text), [segment]);
  const spotDrill = useMemo(() => buildWordSpottingDrill(segment, segmentIdx), [segment, segmentIdx]);
  const wordDrill = useMemo(
    () => buildWordDiscriminationDrill(segment, segmentIdx),
    [segment, segmentIdx]
  );
  const clozeDrill = useMemo(() => buildClozeDrill(segment, segmentIdx, 2), [segment, segmentIdx]);
  const tips = useMemo(() => detectConnectedSpeechTips(segment.text), [segment]);

  useEffect(() => {
    setClozeInputs(Array(clozeDrill.blanks.length).fill(""));
    setShowLetterHints(false);
  }, [clozeDrill]);

  const handlePlay = (customRate?: number) => {
    playSegmentAudio(segment.text, customRate ?? activeSpeed, lang);
    setReplayCount((c) => c + 1);
  };

  const handleToggleSpotWord = (word: string) => {
    if (spotChecked) {
      playSingleWordAudio(word, lang, 0.75);
      return;
    }
    setSpottedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const handleCheckSpot = () => {
    setSpotChecked(true);
    const hits = spottedWords.filter((w) => spotDrill.targetWords.includes(w)).length;
    const falsePositives = spottedWords.filter((w) => !spotDrill.targetWords.includes(w)).length;
    const earned = Math.max(0, hits * 3 - falsePositives);
    setRoundXp((x) => x + earned);
  };

  const handleSelectWord = (word: string) => {
    if (wdResult) {
      playSingleWordAudio(word, lang, 0.75);
      return;
    }
    setSelectedWord(word);
    const result = evaluateWordDiscrimination(wordDrill, word);
    setWdResult(result);
    setRoundXp((x) => x + result.xpEarned);
  };

  const handlePickBankWord = (word: string) => {
    if (clozeResult) return;
    const emptyIdx = clozeInputs.findIndex((v) => !v.trim());
    const targetIdx = emptyIdx >= 0 ? emptyIdx : clozeInputs.length - 1;
    const next = [...clozeInputs];
    next[targetIdx] = word;
    setClozeInputs(next);
  };

  const handleSubmitCloze = () => {
    const result = evaluateClozeDrill(clozeDrill, clozeInputs);
    setClozeResult(result);
    setRoundXp((x) => x + result.xpEarned);

    const nextProfile = {
      ...profile,
      currentSpeed: activeSpeed,
      wordDiscriminationAccuracyHistory: [
        ...profile.wordDiscriminationAccuracyHistory,
        wdResult?.isCorrect ? 100 : 0,
      ],
      clozeAccuracyHistory: [...profile.clozeAccuracyHistory, result.accuracyPercent],
      completedSegments: profile.completedSegments + 1,
    };
    setProfile(nextProfile);
    saveIntensiveListeningProfile(nextProfile);
  };

  const finishRound = () => {
    const earIndex = computeListeningEarIndex(profile);
    const ladder = getNextLadderSpeed(activeSpeed, earIndex);
    const finalProfile = {
      ...profile,
      currentSpeed: ladder.nextSpeed,
      totalXpEarned: profile.totalXpEarned + roundXp,
    };
    setProfile(finalProfile);
    saveIntensiveListeningProfile(finalProfile);
    setActiveSpeed(ladder.nextSpeed);
    if (onXpEarned && roundXp > 0) onXpEarned(roundXp);
    setStage("summary");
  };

  const handleNextSegment = () => {
    if (segmentIdx + 1 < segments.length) {
      setSegmentIdx((i) => i + 1);
      setStage("spot");
      setReplayCount(0);
      setSpottedWords([]);
      setSpotChecked(false);
      setWdResult(null);
      setSelectedWord(null);
      setClozeResult(null);
      setActiveXrayWord(null);
    } else {
      finishRound();
    }
  };

  const handleRestartAtNewSpeed = () => {
    setSegmentIdx(0);
    setStage("spot");
    setReplayCount(0);
    setSpottedWords([]);
    setSpotChecked(false);
    setWdResult(null);
    setSelectedWord(null);
    setClozeResult(null);
    setActiveXrayWord(null);
    setRoundXp(0);
  };

  const earIndex = computeListeningEarIndex(profile);
  const ladderPreview = getNextLadderSpeed(activeSpeed, earIndex);

  const stageStepIndex = { spot: 1, wordChoice: 2, cloze: 3, xray: 4, summary: 4 }[stage];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-card space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Ear className="w-4 h-4 text-indigo-600" />
            <span>Nghe Nhận Dạng Từ (Cho Người Mới / Nghe Yếu)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{title}</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
            {activeSpeed}x
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
            Nhận diện từ: {earIndex}%
          </span>
        </div>
      </div>

      {/* Progress & Speed Quick Bar */}
      {stage !== "summary" && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
            <span>
              Câu {segmentIdx + 1}/{segments.length} • Bước {stageStepIndex}/4
            </span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{
                  width: `${((segmentIdx + stageStepIndex / 4) / Math.max(1, segments.length)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Beginner Audio Assist Console */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handlePlay()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe câu ({activeSpeed}x)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playWordByWordAudio(segment.text, lang);
                  setReplayCount((c) => c + 1);
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-bold inline-flex items-center gap-1.5 transition"
                title="Đọc tách từng từ chậm có khoảng nghỉ để tai nhận diện ranh giới từ"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Đọc tách từng từ</span>
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-[11px] font-mono">
              {([0.6, 0.7, 0.8, 1.0] as const).map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => {
                    setActiveSpeed(spd);
                    handlePlay(spd);
                  }}
                  className={`px-2 py-1 rounded-lg font-bold transition ${
                    activeSpeed === spd
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 1: WORD SPOTTING (BẮT TỪ NGHE ĐƯỢC) */}
      {stage === "spot" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
            <div className="text-xs font-extrabold text-indigo-900">
              Bước 1 — Nghe và chạm vào {spotDrill.targetWords.length} từ BẠN NGHE THẤY trong câu:
            </div>
            <p className="text-xs text-indigo-800/80">
              Nếu nghe liền hơi quá nhanh, hãy bấm <strong>&ldquo;Đọc tách từng từ&rdquo;</strong> hoặc nghe từng cụm ngắn bên dưới:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {chunks.map((ch, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    playSegmentAudio(ch, Math.min(0.75, activeSpeed), lang);
                    setReplayCount((c) => c + 1);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-indigo-100 border border-indigo-200 text-[11px] font-bold text-indigo-700 inline-flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Cụm {idx + 1}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {spotDrill.allChips.map((word) => {
              const isSelected = spottedWords.includes(word);
              const isTarget = spotDrill.targetWords.includes(word);
              let styleClass =
                "bg-white border-slate-200 hover:border-indigo-400 text-slate-800";
              if (!spotChecked && isSelected) {
                styleClass = "bg-indigo-600 border-indigo-600 text-white shadow-sm";
              } else if (spotChecked) {
                if (isTarget && isSelected) {
                  styleClass = "bg-teal-50 border-teal-500 text-teal-900";
                } else if (isTarget && !isSelected) {
                  styleClass = "bg-amber-50 border-amber-400 text-amber-900";
                } else if (!isTarget && isSelected) {
                  styleClass = "bg-rose-50 border-rose-400 text-rose-900";
                } else {
                  styleClass = "bg-slate-50 border-slate-200 text-slate-400";
                }
              }

              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => handleToggleSpotWord(word)}
                  className={`p-3 rounded-2xl border text-sm font-bold transition flex items-center justify-between gap-2 ${styleClass}`}
                >
                  <span className="truncate">{word}</span>
                  {spotChecked ? (
                    <Volume2 className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  ) : (
                    isSelected && <CheckCircle2 className="w-4 h-4 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {!spotChecked ? (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCheckSpot}
                disabled={spottedWords.length === 0}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs sm:text-sm font-bold transition"
              >
                {replayCount === 0
                  ? "Nghe câu trước rồi chọn từ..."
                  : `Kiểm tra (${spottedWords.length} từ đã chọn)`}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-slate-900">
                  Các từ có trong câu: {spotDrill.targetWords.join(", ")}
                </div>
                <div>
                  Bấm vào bất kỳ ô từ nào ở trên để nghe lại phát âm riêng của từ đó!
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStage("wordChoice")}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold inline-flex items-center justify-center gap-1.5"
              >
                <span>Bước 2: Phân biệt từ dễ nhầm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* STAGE 2: WORD DISCRIMINATION (FIXED: ONLY 1 WORD EXISTS IN SENTENCE) */}
      {stage === "wordChoice" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-slate-800">
              Bước 2 — Trong 4 từ phát âm gần giống nhau này, từ nào THỰC SỰ xuất hiện trong câu?
            </div>
            <p className="text-xs text-slate-500">{wordDrill.hintVi}</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {wordDrill.options.map((opt) => {
              const chosen = selectedWord === opt;
              const isCorrectOpt = opt.toLowerCase() === wordDrill.targetWord.toLowerCase();
              let btnStyle = "bg-white border-slate-200 hover:border-indigo-400 text-slate-800";
              if (wdResult) {
                if (isCorrectOpt) {
                  btnStyle = "bg-teal-50 border-teal-500 text-teal-900";
                } else if (chosen) {
                  btnStyle = "bg-rose-50 border-rose-400 text-rose-900";
                } else {
                  btnStyle = "bg-slate-50 border-slate-200 text-slate-500";
                }
              }

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectWord(opt)}
                  className={`p-3.5 rounded-2xl border text-sm font-bold transition flex items-center justify-between gap-2 ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {wdResult ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold">
                      {isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                      {chosen && !isCorrectOpt && <XCircle className="w-4 h-4 text-rose-600" />}
                      <Volume2 className="w-3.5 h-3.5 opacity-60" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {wdResult && (
            <>
              <div
                className={`p-3.5 rounded-2xl text-xs font-semibold border ${
                  wdResult.isCorrect
                    ? "bg-teal-50 border-teal-200 text-teal-900"
                    : "bg-amber-50 border-amber-200 text-amber-900"
                }`}
              >
                {wdResult.feedbackVi}
              </div>
              <button
                type="button"
                onClick={() => setStage("cloze")}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold inline-flex items-center justify-center gap-1.5"
              >
                <span>Bước 3: Điền từ còn thiếu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}

      {/* STAGE 3: SCAFFOLDED CLOZE */}
      {stage === "cloze" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-extrabold text-slate-800">
              Bước 3 — Nghe và điền {clozeDrill.blanks.length} từ còn thiếu:
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setBeginnerWordBank((v) => !v)}
                className={`px-2.5 py-1 rounded-lg border transition ${
                  beginnerWordBank
                    ? "bg-teal-50 border-teal-300 text-teal-800"
                    : "bg-slate-100 border-slate-200 text-slate-600"
                }`}
              >
                {beginnerWordBank ? "Đang bật: Chọn từ gợi ý" : "Bật chọn từ cho người yếu"}
              </button>
              <button
                type="button"
                onClick={() => setShowLetterHints((v) => !v)}
                className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 inline-flex items-center gap-1"
              >
                <Lightbulb className="w-3 h-3" />
                <span>Gợi ý chữ cái</span>
              </button>
            </div>
          </div>

          <p className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed font-medium">
            {clozeDrill.displayWords.join(" ")}
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {clozeDrill.blanks.map((b, i) => (
              <div key={b.index} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-500">Chỗ trống #{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => playSegmentAudio(b.contextChunk, 0.7, lang)}
                    className="text-indigo-600 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Nghe riêng cụm này</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={clozeInputs[i] || ""}
                  onChange={(e) => {
                    const next = [...clozeInputs];
                    next[i] = e.target.value;
                    setClozeInputs(next);
                  }}
                  disabled={!!clozeResult}
                  placeholder={showLetterHints ? b.letterHint : `Nhập hoặc chọn từ #${i + 1}...`}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-semibold disabled:bg-slate-100 outline-none focus:border-indigo-500"
                />
                {showLetterHints && (
                  <div className="text-[11px] font-mono text-amber-700 font-bold">
                    Gợi ý: {b.letterHint}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Beginner Word Bank */}
          {beginnerWordBank && !clozeResult && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
              <div className="text-[11px] font-bold text-indigo-700">
                Bấm chọn từ để điền nhanh (dành cho người mới chưa nhớ mặt chữ):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {clozeDrill.wordBankOptions.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => handlePickBankWord(w)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-xs font-bold text-slate-800 transition"
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!clozeResult ? (
            <button
              type="button"
              onClick={handleSubmitCloze}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition"
            >
              Chấm điểm
            </button>
          ) : (
            <>
              <div
                className={`p-4 rounded-2xl text-xs font-semibold border space-y-1.5 ${
                  clozeResult.passed
                    ? "bg-teal-50 border-teal-200 text-teal-900"
                    : "bg-amber-50 border-amber-200 text-amber-900"
                }`}
              >
                <div className="font-extrabold">Độ chính xác: {clozeResult.accuracyPercent}%</div>
                {clozeResult.perBlank.map((pb, i) => (
                  <div key={i}>
                    {pb.correct ? "✓" : "✗"} Đáp án đúng: <strong>{pb.answer}</strong>
                    {!pb.correct && pb.userInput && <> (bạn điền: &ldquo;{pb.userInput}&rdquo;)</>}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStage("xray")}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold inline-flex items-center justify-center gap-1.5"
              >
                <span>Bước 4: Soi từng từ & Giải mã nối âm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}

      {/* STAGE 4: AUDIO X-RAY (CLICKABLE WORD-BY-WORD TRANSCRIPT + CONNECTED SPEECH) */}
      {stage === "xray" && (
        <div className="space-y-4">
          <div className="text-xs font-extrabold text-slate-800">
            Bước 4 — Giải mã âm thanh: Bấm vào BẤT KỲ TỪ NÀO để nghe riêng từ đó và so sánh với câu nói liền!
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap gap-1.5">
            {segment.text.split(/\s+/).map((rawWord, idx) => {
              const isSelected = activeXrayWord === `${idx}-${rawWord}`;
              return (
                <button
                  key={`${idx}-${rawWord}`}
                  type="button"
                  onClick={() => {
                    setActiveXrayWord(`${idx}-${rawWord}`);
                    playSingleWordAudio(rawWord, lang, 0.72);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-sm font-bold border transition ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                      : "bg-white text-slate-800 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50"
                  }`}
                >
                  {rawWord}
                </button>
              );
            })}
          </div>

          {tips.length > 0 ? (
            <div className="space-y-2">
              <div className="text-[11px] font-extrabold text-amber-800 uppercase">
                Hiện tượng nối âm / rút gọn trong câu này:
              </div>
              {tips.map((tip) => (
                <div key={tip.id} className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="text-xs font-extrabold text-amber-950">{tip.pattern}</div>
                  <p className="text-xs text-amber-900 mt-0.5">{tip.explanationVi}</p>
                  <p className="text-[11px] text-amber-700 mt-1 italic">👂 {tip.listenForVi}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900">
              💡 Hãy nghe 1 lượt <strong>Đọc tách từng từ</strong> rồi nghe ngay 1 lượt <strong>1.0x</strong> để tai quen với ranh giới từng từ trong câu này.
            </div>
          )}

          <button
            type="button"
            onClick={handleNextSegment}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold inline-flex items-center justify-center gap-1.5"
          >
            <span>
              {segmentIdx + 1 < segments.length ? "Sang câu tiếp theo" : "Xem kết quả toàn bài"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STAGE 5: SUMMARY */}
      {stage === "summary" && (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Hoàn thành vòng luyện Nghe Nhận Dạng Từ!
          </h3>
          <div className="flex items-center justify-center gap-3 text-xs font-bold flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
              Chỉ số Nhận Diện Từ: {earIndex}%
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              +{roundXp} XP vòng này
            </span>
          </div>
          <p className="text-sm text-slate-600 max-w-md mx-auto">{ladderPreview.messageVi}</p>
          <div className="flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={handleRestartAtNewSpeed}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Luyện lại ở tốc độ {ladderPreview.nextSpeed}x</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
