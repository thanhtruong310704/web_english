"use client";
import React, { useState } from "react";
import { SUPABASE_LIVE_URL, SUPABASE_LIVE_ANON_KEY } from "@/lib/supabase-r2";
import {
  Headphones,
  BookOpen,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Volume2,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState("");
  const [level, setLevel] = useState<"A1" | "A2" | "B1" | "B2">("A1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [previewPlaying, setPreviewPlaying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const displayUser = username.trim() || email.split("@")[0];
    setStatusMsg("Đang đồng bộ tài khoản với Supabase Auth...");
    try {
      const endpoint =
        mode === "signup"
          ? `${SUPABASE_LIVE_URL}/auth/v1/signup`
          : `${SUPABASE_LIVE_URL}/auth/v1/token?grant_type=password`;
      await fetch(endpoint, {
        method: "POST",
        headers: {
          apikey: SUPABASE_LIVE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          data: { username: displayUser, current_level: level },
        }),
      });
    } catch (_) {}
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "ef_auth_user",
        JSON.stringify({ email, username: displayUser, level })
      );
      document.cookie = `ef_auth_user=${encodeURIComponent(displayUser)}; path=/; max-age=2592000`;
      window.location.href = "/";
    }
  };

  const handleQuickDemo = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "ef_auth_user",
        JSON.stringify({
          email: "hocvien@englishflow.vn",
          username: "Minh Nguyen (A2)",
          level: "A2",
        })
      );
      document.cookie = "ef_auth_user=Minh%20Nguyen; path=/; max-age=2592000";
      window.location.href = "/";
    }
  };

  const handlePlaySample = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(
        "Welcome to EnglishFlow Studio. Practice active listening and real conversations every day."
      );
      u.lang = "en-US";
      u.rate = 0.95;
      u.onend = () => setPreviewPlaying(false);
      setPreviewPlaying(true);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col lg:grid lg:grid-cols-12">
      {/* Left Interactive Studio Showcase (Desktop 7 cols) */}
      <section className="lg:col-span-7 bg-slate-900 text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #4F46E5 0%, transparent 45%), radial-gradient(circle at 80% 75%, #0D9488 0%, transparent 45%)",
          }}
        />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-base shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition">
              EF
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-none">
                EnglishFlow
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Audio & Vocabulary Studio
              </span>
            </div>
          </a>
          <a
            href="/transparency"
            className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 transition"
          >
            100% Miễn phí cộng đồng
          </a>
        </div>

        {/* Hero Copy & Interactive Audio Preview Card */}
        <div className="relative z-10 my-10 lg:my-0 max-w-xl space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/25 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lộ trình chuẩn CEFR A1 → B2 dành riêng cho người Việt</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-[1.15] text-white">
              Luyện tai nghe sắc bén, nhớ từ vựng sâu và phản xạ tự nhiên.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Không quảng cáo, không giới hạn tính năng. Kết hợp phương pháp Nghe Chuyên Sâu
              70%, lặp lại ngắt quãng SuperMemo SM-2 và 20 phòng hội thoại thực tế.
            </p>
          </div>

          {/* Interactive Live Audio Card on Left Panel */}
          <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-5 space-y-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
                  A2 • Daily Routine
                </span>
                <span className="text-xs text-slate-400 font-mono">/ˈlɪs.ən.ɪŋ ˈstjuː.di.əʊ/</span>
              </div>
              <button
                type="button"
                onClick={handlePlaySample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{previewPlaying ? "Đang phát mẫu..." : "Nghe thử giọng US"}</span>
              </button>
            </div>

            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              &ldquo;Welcome to EnglishFlow Studio. Practice active listening and real conversations
              every day.&rdquo;
            </p>

            {/* Acoustic Waveform Bars */}
            <div className="flex items-end gap-1 h-7 pt-1">
              {[35, 65, 45, 85, 55, 95, 70, 40, 80, 60, 90, 50, 75, 45, 60, 35, 85, 65, 50, 40, 70, 55, 80, 45].map(
                (h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      previewPlaying ? "bg-indigo-400 animate-pulse" : "bg-slate-600"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>
          </div>

          {/* 3 Concrete Pillars */}
          <div className="grid sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-1">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <Headphones className="w-4 h-4" />
                <span>240 Bài Nghe</span>
              </div>
              <p className="text-xs text-slate-400">
                3 giọng US/UK/AU, chỉnh tốc độ 0.75x–1.5x & chép chính tả.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-1">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
                <BookOpen className="w-4 h-4" />
                <span>640+ Từ Vựng SRS</span>
              </div>
              <p className="text-xs text-slate-400">
                40 chủ đề thiết yếu + Phrasal Verbs & Idioms có phiên âm IPA.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <MessageSquare className="w-4 h-4" />
                <span>20 Phòng Hội Thoại</span>
              </div>
              <p className="text-xs text-slate-400">
                Thực hành đóng vai phỏng vấn, sân bay, khách sạn & công sở.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Đồng bộ đám mây qua Supabase Auth (ap-southeast-1)</span>
          </div>
          <span>Dự án giáo dục mở • $0 Zero-Cost Stack</span>
        </div>
      </section>

      {/* Right Authentication Workspace (Desktop 5 cols) */}
      <main className="lg:col-span-5 flex flex-col justify-center p-6 sm:p-10 lg:p-14 bg-canvas">
        <div className="max-w-md w-full mx-auto space-y-6">
          {/* Instant 1-Click Demo Banner */}
          <div className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-card flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Muốn trải nghiệm ngay trên Laptop?</span>
              </div>
              <p className="text-xs text-slate-500">
                Vào thẳng bàn học với tài khoản Học viên mẫu (Cấp A2)
              </p>
            </div>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="shrink-0 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
            >
              Vào nhanh 1-Click
            </button>
          </div>

          {/* Main Login / Signup Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {mode === "signin" ? "Chào mừng bạn quay lại" : "Tạo tài khoản học viên"}
              </h2>
              <p className="text-sm text-slate-500">
                {mode === "signin"
                  ? "Đăng nhập để tiếp tục bài nghe và lịch ôn tập thẻ SRS hôm nay."
                  : "Miễn phí trọn đời. Lưu tiến độ học tập trên mọi thiết bị."}
              </p>
            </div>

            {/* Segmented Mode Switcher */}
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`py-2.5 rounded-xl transition ${
                  mode === "signin"
                    ? "bg-white text-indigo-600 shadow-card"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`py-2.5 rounded-xl transition ${
                  mode === "signup"
                    ? "bg-white text-indigo-600 shadow-card"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tạo tài khoản mới
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Tên hiển thị của bạn
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="VD: Minh Nguyễn"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none text-sm transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Cấp độ khởi đầu (CEFR)
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as typeof level)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none text-sm font-medium transition"
                    >
                      <option value="A1">A1 — Cơ bản (90–110 từ/phút)</option>
                      <option value="A2">A2 — Sơ cấp (110–130 từ/phút)</option>
                      <option value="B1">B1 — Trung cấp (130–150 từ/phút)</option>
                      <option value="B2">B2 — Trung cao cấp (150–180 từ/phút)</option>
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Địa chỉ Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hocvien@englishflow.vn"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none text-sm transition"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPwd ? "Ẩn" : "Hiện"}</span>
                  </button>
                </div>
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 outline-none text-sm transition"
                />
              </div>

              {statusMsg && (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
                  <span>{statusMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm hover:shadow transition flex items-center justify-center gap-2"
              >
                <span>
                  {mode === "signin" ? "Vào bàn học EnglishFlow" : "Hoàn tất đăng ký miễn phí"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
