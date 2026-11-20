import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EnglishFlow Studio — Luyện Nghe, Từ Vựng SRS & Giao Tiếp Tiếng Anh A1–B2",
  description:
    "Nền tảng học tiếng Anh miễn phí 100% cho cộng đồng người Việt: 240 bài nghe đa giọng, 640+ từ vựng SRS SM-2 và đối thoại tình huống A1-B2.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-canvas text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}
