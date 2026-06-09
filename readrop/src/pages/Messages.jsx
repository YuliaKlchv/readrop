import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useT } from "../context/LangContext.jsx";
import { api } from "../lib/api.js";
import { notifyMessagesUpdated } from "../lib/useUnreadCount.js";
import styles from "./Messages.module.css";

export default function Messages() {
  const { user } = useAuth();
  const t  = useT();
  const tm = t.messages;

  const [convos, setConvos]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeId, setActiveId]     = useState(null);
  const [input, setInput]           = useState("");
  const [mobileView, setMobileView] = useState("list");
  const bottomRef = useRef(null);

  const active = convos.find((c) => c.id === activeId) || null;

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api("messages").then((res) => {
      if (res.ok) setConvos(res.data.conversations || []);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length]);

  if (!user) {
    return (
      <div className={styles.gate}>
        <div className={styles.gateInner}>
          <span className={styles.gateIcon}>💬</span>
          <h2 className={styles.gateTitle}>{tm.loginTitle}</h2>
          <p className={styles.gateSub}>{tm.loginSub}</p>
          <div className={styles.gateBtns}>
            <Link to="/login"    className="btn btn-terra">{tm.loginCta}</Link>
            <Link to="/register" className="btn btn-ghost">{tm.signupCta}</Link>
          </div>
        </div>
      </div>
    );
  }

  const selectConvo = (id) => {
    setActiveId(id);
    setConvos((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
    setMobileView("thread");
    api("messages/read", { conversationId: id });
    notifyMessagesUpdated();
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !active) return;
    setInput("");

    const res = await api("messages/send", { conversationId: active.id, text });
    if (res.ok) {
      const msg = res.data.message;
      setConvos((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, messages: [...c.messages, msg], preview: text } : c
        )
      );
    }
  };

  const myEmail = user.email.toLowerCase();

  return (
    <div className={styles.page}>
      {/* ---- Sidebar ---- */}
      <aside className={`${styles.sidebar} ${mobileView === "thread" ? styles.sidebarHidden : ""}`}>
        <div className={styles.sideHead}>
          <span className="eyebrow">{tm.eyebrow}</span>
          <h1 className={styles.sideTitle}>{tm.h1}</h1>
        </div>

        {loading && <div className={styles.emptyList}><p>…</p></div>}
        {!loading && convos.length === 0 && (
          <div className={styles.emptyList}>
            <p>{tm.empty}</p>
            <p className={styles.emptyHint}>{tm.emptyHint}</p>
          </div>
        )}
        {!loading && convos.length > 0 && (
          <ul className={styles.list}>
            {convos.map((c) => (
              <li key={c.id}>
                <button
                  className={`${styles.convoItem} ${activeId === c.id ? styles.convoActive : ""}`}
                  onClick={() => selectConvo(c.id)}
                >
                  <span className={styles.avatar}>{c.avatar}</span>
                  <div className={styles.convoInfo}>
                    <div className={styles.convoTop}>
                      <span className={styles.convoName}>{c.name}</span>
                      <span className={styles.convoTime}>{c.time}</span>
                    </div>
                    <p className={styles.convoBook}>
                      {c.exchange ? "🔄" : "📚"} {c.book}
                    </p>
                    <p className={styles.convoPreview}>{c.preview}</p>
                  </div>
                  {c.unread > 0 && <span className={styles.badge}>{c.unread}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* ---- Thread panel ---- */}
      <div className={`${styles.thread} ${mobileView === "list" ? styles.threadHidden : ""}`}>
        {active ? (
          <>
            <div className={styles.threadHead}>
              <button className={styles.back} onClick={() => setMobileView("list")}>←</button>
              <span className={styles.threadAvatar}>{active.avatar}</span>
              <div>
                <p className={styles.threadName}>{active.name}</p>
                <p className={styles.threadSub}>
                  {active.exchange ? "🔄" : "📚"} {active.book} · 📍 {active.city}
                </p>
              </div>
            </div>

            <div className={styles.messages}>
              {active.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.bubble} ${msg.from === myEmail ? styles.bubbleMe : styles.bubbleThem}`}
                >
                  <p className={styles.bubbleText}>{msg.text}</p>
                  <span className={styles.bubbleTime}>{msg.time}</span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <form className={styles.inputRow} onSubmit={sendMessage}>
              <input
                className={styles.inputField}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={tm.placeholder}
                autoComplete="off"
              />
              <button type="submit" className={`btn btn-terra ${styles.sendBtn}`} disabled={!input.trim()}>
                {tm.send}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.noThread}>
            <span className={styles.noThreadIcon}>💬</span>
            <p>{tm.selectConvo}</p>
          </div>
        )}
      </div>
    </div>
  );
}
