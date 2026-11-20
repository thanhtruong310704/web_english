"use client";
import React, { useState } from "react";
import {
  TRANSPARENCY_DASHBOARD_DATA,
  OPEN_LEGAL_AND_COMMUNITY_INFO,
} from "@/lib/transparency-security-legal";
import { submitCommunityContributionToSupabase, SUPABASE_LIVE_URL } from "@/lib/supabase-r2";
import {
  ShieldCheck,
  HeartHandshake,
  Send,
  ArrowLeft,
  Server,
  CheckCircle2,
  Users,
} from "lucide-react";

export default function TransparencyPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState<
    "new_question" | "translation_fix" | "audio_report" | "reading_passage"
  >("new_question");
  const [level, setLevel] = useState<"A1" | "A2" | "B1" | "B2">("A1");
  const [contentText, setContentText] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contentText.trim()) return;
    const res = await submitCommunityContributionToSupabase({
      contributor_name: name,
      contribution_type: type,
      cefr_level: level,
      content: { text: contentText, submittedAt: new Date().toISOString() },
    });
    if (res.ok) {
      setStatusMsg(
        "Đã gửi đóng góp thành công lên cơ sở dữ liệu Supabase! Cảm ơn bạn đã chung tay xây dựng học liệu mở."
      );
      setContentText("");
    } else {
      setStatusMsg("Đã lưu đóng góp vào hàng đợi đồng bộ.");
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-slate-900">
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm">
              EF
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                Minh Bạch Hạ Tầng $0 & Đóng Góp Học Liệu Cộng Đồng
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Kết nối trực tiếp Supabase ({SUPABASE_LIVE_URL}) • Miễn phí 100% trọn đời
              </p>
            </div>
          </div>
          <a
            href="/"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về Bàn Học</span>
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Zero-Cost Infrastructure Table & Legal */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>Bảng Kê Chi Phí Hạ Tầng Thực Tế ($0 Zero-Cost Stack)</span>
              </h2>
              <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold font-mono">
                $0 / tháng
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 font-bold">Thành phần kỹ thuật</th>
                    <th className="py-2.5 font-bold">Gói dịch vụ</th>
                    <th className="py-2.5 font-bold text-right">Chi phí/tháng</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSPARENCY_DASHBOARD_DATA.servicesBreakdown.map((item) => (
                    <tr key={item.service} className="border-b border-slate-100">
                      <td className="py-3 font-bold text-slate-800">{item.service}</td>
                      <td className="py-3 text-slate-600">{item.tier}</td>
                      <td className="py-3 font-mono font-bold text-teal-600 text-right">
                        ${item.monthlyCostUSD} (0 VNĐ)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-card space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              <span>Cổng Đồng Hành & Ủng Hộ Tự Nguyện</span>
            </h2>
            <div className="grid sm:grid-cols-3 gap-3.5">
              {TRANSPARENCY_DASHBOARD_DATA.donationChannels.map((ch) => (
                <a
                  key={ch.name}
                  href={ch.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-white transition block space-y-1"
                >
                  <div className="font-extrabold text-indigo-600 text-sm">{ch.name}</div>
                  <div className="text-xs text-slate-600 leading-relaxed">{ch.description}</div>
                </a>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-card space-y-3 text-xs text-slate-600">
            <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              <span>Pháp Lý, Bản Quyền Mở & Cộng Đồng Học Tập</span>
            </div>
            <p className="leading-relaxed">{OPEN_LEGAL_AND_COMMUNITY_INFO.privacyAndTermsSummary}</p>
            <div className="pt-2 flex flex-wrap gap-3 font-bold text-indigo-600">
              <a
                href={OPEN_LEGAL_AND_COMMUNITY_INFO.communitySupportChannels.zaloGroup}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition"
              >
                Nhóm Zalo Cộng Đồng
              </a>
              <a
                href={OPEN_LEGAL_AND_COMMUNITY_INFO.communitySupportChannels.facebookGroup}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition"
              >
                Facebook Group
              </a>
              <a
                href={OPEN_LEGAL_AND_COMMUNITY_INFO.communitySupportChannels.discordServer}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition"
              >
                Discord Server
              </a>
            </div>
          </section>
        </div>

        {/* Right Column (5 cols): Community Contribution Studio Form */}
        <section className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-card space-y-5 lg:sticky lg:top-22">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Open Educational Resources (OER)</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 pt-1">
              Đóng Góp Câu Hỏi & Học Liệu Mở
            </h2>
            <p className="text-xs text-slate-500">
              Giáo viên và học viên có thể gửi câu hỏi mới, bài đọc hoặc báo lỗi dịch thuật trực
              tiếp lên Supabase.
            </p>
          </div>

          <form onSubmit={handleContribute} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Tên của bạn / Giáo viên</label>
              <input
                type="text"
                placeholder="VD: Cô Lan Anh (IELTS 8.0)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Loại đóng góp</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as typeof type)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                >
                  <option value="new_question">Câu hỏi mới</option>
                  <option value="translation_fix">Sửa lỗi dịch</option>
                  <option value="audio_report">Báo lỗi audio</option>
                  <option value="reading_passage">Bài đọc mở</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Cấp độ CEFR</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as typeof level)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                >
                  <option value="A1">Cấp độ A1</option>
                  <option value="A2">Cấp độ A2</option>
                  <option value="B1">Cấp độ B1</option>
                  <option value="B2">Cấp độ B2</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Nội dung đóng góp</label>
              <textarea
                rows={4}
                placeholder="Nhập câu hỏi, đoạn hội thoại hoặc góp ý chi tiết..."
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Đóng Góp Lên Supabase</span>
            </button>

            {statusMsg && (
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{statusMsg}</span>
              </div>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}
