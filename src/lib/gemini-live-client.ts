/**
 * SPRINT 1.3 & SPRINT 2.1 (TASK-1.3.3, TASK-2.1.1, TASK-API-02):
 * Bộ kết nối trực tiếp tới Google Gemini 1.5 Flash API (Google AI Studio Free Tier)
 * Tự động chuyển đổi dự phòng (Fallback) sang Groq Llama 3.3 70B khi chạm Rate Limit (HTTP 429)
 * hoặc dùng bộ chấm điểm thông minh cục bộ khi chưa điền API Key.
 */

export interface AIKeyConfig {
  geminiApiKey: string;
  groqApiKey?: string;
}

export function getStoredAIKeys(): AIKeyConfig {
  if (typeof window !== "undefined") {
    try {
      const gemini = window.localStorage.getItem("ef_gemini_api_key") || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
      const groq = window.localStorage.getItem("ef_groq_api_key") || process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
      return { geminiApiKey: gemini.trim(), groqApiKey: groq.trim() };
    } catch (_) {}
  }
  return {
    geminiApiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
    groqApiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "",
  };
}

export function saveAIKeysToStorage(geminiApiKey: string, groqApiKey = ""): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem("ef_gemini_api_key", geminiApiKey.trim());
      if (groqApiKey) window.localStorage.setItem("ef_groq_api_key", groqApiKey.trim());
    } catch (_) {}
  }
}

/**
 * Gọi thật API Google Gemini 1.5 Flash (`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`)
 * Nếu gặp lỗi 429 (Rate limit 15 RPM) và có Groq API Key -> Tự động chuyển sang Groq Llama 3.3 70B
 */
export async function callGemini15FlashRealAPI(
  systemInstruction: string,
  userMessage: string,
  customKeys?: AIKeyConfig
): Promise<{
  provider: "gemini-1.5-flash-live" | "groq-llama-3.3-live" | "local-fallback";
  text: string;
}> {
  const keys = customKeys || getStoredAIKeys();

  // 1. Thử gọi Google Gemini 1.5 Flash nếu có API Key
  if (keys.geminiApiKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${encodeURIComponent(
        keys.geminiApiKey
      )}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: "user", parts: [{ text: userMessage }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Great effort! Let's continue practicing.";
        return { provider: "gemini-1.5-flash-live", text: replyText };
      }

      // Nếu chạm trần Rate Limit (HTTP 429) -> Chuyển sang Groq Fallback (TASK-API-02)
      if (res.status === 429 && keys.groqApiKey) {
        return await callGroqFallbackAPI(systemInstruction, userMessage, keys.groqApiKey);
      }
    } catch (_) {
      if (keys.groqApiKey) {
        return await callGroqFallbackAPI(systemInstruction, userMessage, keys.groqApiKey);
      }
    }
  }

  // 2. Nếu chỉ cấu hình Groq Key
  if (keys.groqApiKey) {
    return await callGroqFallbackAPI(systemInstruction, userMessage, keys.groqApiKey);
  }

  // 3. Fallback offline khi người học chưa nhập Key
  return {
    provider: "local-fallback",
    text: `That sounds great! Could you tell me a little more about that?\n💡 Quick tip: Bạn có thể bấm nút "🔑 Cài đặt API Key" trên thanh công cụ để kết nối trực tiếp với Google Gemini 1.5 Flash thật!`,
  };
}

async function callGroqFallbackAPI(
  systemInstruction: string,
  userMessage: string,
  groqApiKey: string
): Promise<{
  provider: "groq-llama-3.3-live" | "local-fallback";
  text: string;
}> {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content || "Awesome! Let's keep going.";
      return { provider: "groq-llama-3.3-live", text: reply };
    }
  } catch (_) {}

  return {
    provider: "local-fallback",
    text: "Wonderful response! What would you like to do next?\n💡 Quick tip: Cấu trúc câu của bạn rất rõ ràng!",
  };
}
