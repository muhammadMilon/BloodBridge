import { useMemo, useState } from "react";
import { FiSend, FiMessageCircle, FiX } from "react-icons/fi";

const assistantIntro =
  "Hi! I'm the BloodBridge assistant. Ask me anything about registration, eligibility, donor safety, or FAQ support.";

const buildPayload = (history, prompt) => {
  const contents = history.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
  contents.push({
    role: "user",
    parts: [{ text: prompt }],
  });
  return { contents };
};

const GeminiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: assistantIntro },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const helperText = useMemo(() => {
    if (!apiKey) {
      return "Add VITE_GEMINI_API_KEY to use live chat.";
    }
    return "";
  }, [apiKey]);

  const handleSend = async () => {
    if (!input.trim() || !apiKey) return;
    const userMessage = { role: "user", content: input.trim() };
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload(messages, userMessage.content)),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.error?.message || "Gemini API returned an error";
        throw new Error(errorMessage);
      }
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm sorry, I couldn't find an answer right now.";

      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I ran into an issue connecting to Gemini: ${
            err.message || "Unknown error"
          }. Please try again shortly.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-rose-100 flex flex-col z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white p-4 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] font-semibold">
                BloodBridge
              </p>
              <h3 className="font-bold text-lg">Help Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 transition"
              aria-label="Close chat"
            >
              <FiX />
            </button>
          </div>

          <div className="flex-1 flex flex-col p-4 space-y-2 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow ${
                    msg.role === "assistant"
                      ? "bg-rose-50 text-slate-800 border border-rose-100"
                      : "bg-gradient-to-r from-rose-600 to-red-600 text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-xs text-slate-500">Assistant is typing…</div>
            )}
            {helperText && (
              <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl p-2">
                {helperText}
              </div>
            )}
          </div>

          <div className="border-t border-rose-100 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={loading || !apiKey}
                placeholder={
                  helperText ? helperText : "Ask about eligibility, FAQ…"
                }
                className="flex-1 border border-rose-200 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:bg-slate-100"
              />
              <button
                onClick={handleSend}
                disabled={loading || !apiKey || !input.trim()}
                className="p-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-full w-14 h-14 shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-40"
        aria-label="Open BloodBridge chat assistant"
      >
        <FiMessageCircle className="w-6 h-6" />
      </button>
    </>
  );
};

export default GeminiChatWidget;

