import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi 👋 I’m FitBot (AI). Ask me about the Shop, Cart, AI quiz, shipping, returns, etc.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const listRef = useRef(null);

  const quickActions = useMemo(
    () => [
      { label: "Go to Shop", action: () => navigate("/shop") },
      { label: "Open Cart", action: () => navigate("/cart") },
      { label: "How AI quiz works?", action: () => sendText("How does AI quiz work?") },
      { label: "Return policy", action: () => sendText("What is the return policy?") },
    ],
    [navigate]
  );

  // Auto scroll to bottom
  useEffect(() => {
    if (!open) return;
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  // Optional: Tell user which page they are on
  useEffect(() => {
    if (!open) return;
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: `You are on: ${location.pathname}. How can I help here?` },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    await sendText(msg);
  };

  const sendText = async (text) => {
    const msg = (text || "").trim();
    if (!msg || loading) return;

    // add user message
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);

    // send last messages as history (keep small)
    const historyToSend = [...messages, { role: "user", text: msg }].slice(-10);

    try {
      const res = await api.post("/chat/", {
        message: msg,
        history: historyToSend,
      });

      const reply = res?.data?.reply || "I didn’t get a reply. Please try again.";
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (e) {
      const errText =
        e?.response?.data?.error ||
        e?.message ||
        "AI server error. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            "⚠️ AI is not responding.\n\nPossible reasons:\n- Django server not running\n- GROQ key missing\n- Model name wrong\n\nError: " +
            errText,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrap}>
      {open && (
        <div style={panel}>
          <div style={header}>
            <div>
              <div style={{ fontWeight: 900 }}>FitBot</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>
                AI customer help assistant
              </div>
            </div>

            <button onClick={() => setOpen(false)} style={iconBtn} aria-label="Close chatbot">
              ✕
            </button>
          </div>

          <div style={actionsRow}>
            {quickActions.map((q) => (
              <button key={q.label} style={chip} onClick={q.action} disabled={loading}>
                {q.label}
              </button>
            ))}
          </div>

          <div ref={listRef} style={messagesBox}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "10px 12px",
                    borderRadius: 14,
                    lineHeight: 1.5,
                    background: m.role === "user" ? "#0f172a" : "#f1f5f9",
                    color: m.role === "user" ? "white" : "#0f172a",
                    border: m.role === "user" ? "none" : "1px solid #e5e7eb",
                    fontSize: 13,
                    fontWeight: 600,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "10px 12px",
                    borderRadius: 14,
                    lineHeight: 1.5,
                    background: "#f1f5f9",
                    color: "#0f172a",
                    border: "1px solid #e5e7eb",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Typing...
                </div>
              </div>
            )}
          </div>

          <div style={inputRow}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              style={inputStyle}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
            <button onClick={send} style={sendBtn} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setOpen((s) => !s)} style={fab} aria-label="Open chatbot">
        {open ? "💬" : "💬 Help"}
      </button>
    </div>
  );
}

/* ---------------- styles ---------------- */

const wrap = {
  position: "fixed",
  right: 18,
  bottom: 18,
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 10,
};

const panel = {
  width: 340,
  height: 460,
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(15,23,42,0.18)",
  display: "flex",
  flexDirection: "column",
};

const header = {
  padding: 12,
  background: "#0f172a",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const iconBtn = {
  border: 0,
  background: "rgba(255,255,255,0.14)",
  color: "white",
  width: 34,
  height: 34,
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 900,
};

const actionsRow = {
  padding: "10px 10px 0",
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const chip = {
  border: "1px solid #e5e7eb",
  background: "#f8fafc",
  padding: "6px 10px",
  borderRadius: 999,
  cursor: "pointer",
  fontWeight: 800,
  fontSize: 12,
  color: "#0f172a",
};

const messagesBox = {
  padding: 12,
  overflow: "auto",
  flex: 1,
  background: "#ffffff",
};

const inputRow = {
  display: "flex",
  gap: 8,
  padding: 10,
  borderTop: "1px solid #e5e7eb",
  background: "#fff",
};

const inputStyle = {
  flex: 1,
  padding: "10px 10px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  outline: "none",
  fontWeight: 600,
};

const sendBtn = {
  border: 0,
  borderRadius: 12,
  padding: "10px 12px",
  cursor: "pointer",
  fontWeight: 900,
  background: "#22c55e",
  color: "#052e13",
};

const fab = {
  border: 0,
  borderRadius: 999,
  padding: "12px 14px",
  cursor: "pointer",
  fontWeight: 900,
  background: "#0f172a",
  color: "white",
  boxShadow: "0 12px 24px rgba(15,23,42,0.25)",
};