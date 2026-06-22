import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GENRE_COLORS, CONDITION_LABELS } from "../data/books.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useT } from "../context/LangContext.jsx";
import { api } from "../lib/api.js";
import styles from "./Discover.module.css";

function cardAnimClass(animDir, stylesObj) {
  if (animDir === "left")  return stylesObj.flyLeft;
  if (animDir === "right") return stylesObj.flyRight;
  return "";
}

export default function Discover() {
  const t = useT();
  const td = t.discover;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [liked, setLiked] = useState([]);
  const [animDir, setAnimDir] = useState(null);
  const [claimMsg, setClaimMsg] = useState(null);

  useEffect(() => {
    api("books").then((res) => {
      if (res.ok) {
        const shuffled = [...(res.data.books || [])].sort(() => Math.random() - 0.5);
        setBooks(shuffled);
      }
      setLoading(false);
    });
  }, []);

  const current   = books[idx];
  const next      = books[idx + 1];
  const afterNext = books[idx + 2];
  const isDone    = !loading && idx >= books.length;

  const handleAction = async (dir) => {
    if (animDir || !current) return;
    setAnimDir(dir);
    setClaimMsg(null);

    if (dir === "right") {
      if (!user) {
        navigate("/login");
        return;
      }
      setLiked((prev) => [...prev, current]);
      if (current.id) {
        const res = await api(`books/${current.id}/claim`);
        if (res.ok) {
          setClaimMsg({ type: "ok", text: `"${current.title}" claimed! Arrange a pickup with the owner.` });
        } else if (res.status === 409) {
          setClaimMsg({ type: "warn", text: "This book was just claimed by someone else." });
        }
      }
    }

    setTimeout(() => {
      setIdx((i) => i + 1);
      setAnimDir(null);
    }, 320);
  };

  const genreStyle = current ? (GENRE_COLORS[current.genre] || {}) : {};
  const likedSuffix = liked.length === 1 ? td.likedSuffix : td.likedSuffixPlural;

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={`container ${styles.inner}`}>
          <p style={{ color: "var(--muted)", padding: "60px 0" }}>Loading books…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <span className="eyebrow">{td.eyebrow}</span>
          <h1 className={styles.h1}>{td.h1}</h1>
          <p className={styles.sub}>
            {td.sub.split("\n")[0]}<br />{td.sub.split("\n")[1]}
          </p>

          {claimMsg && (
            <div className={styles[claimMsg.type === "ok" ? "claimOk" : "claimWarn"]}>
              {claimMsg.text}
            </div>
          )}

          {liked.length > 0 && (
            <div className={styles.likedList}>
              <p className={styles.likedLabel}>
                {td.likedLabel} {liked.length} {likedSuffix}:
              </p>
              {liked.map((b) => (
                <div key={b.id ?? b.title} className={styles.likedItem}>
                  <span>{b.emoji || "📚"}</span>
                  <span className={styles.likedTitle}>{b.title}</span>
                </div>
              ))}
            </div>
          )}

          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{ width: `${Math.min((idx / (books.length || 1)) * 100, 100)}%` }}
            />
          </div>
          <p className={styles.progressText}>
            {isDone ? td.allDone : `${idx + 1} / ${books.length}`}
          </p>
        </div>

        <div className={styles.right}>
          {isDone ? (
            <div className={styles.doneCard}>
              <span className={styles.doneEmoji}>🎉</span>
              <h2>{td.allDoneSub}</h2>
              <p>
                {td.liked} <strong>{liked.length}</strong> {td.outOf} {books.length}.
              </p>
              <div className={styles.doneBtns}>
                <Link to="/books" className="btn btn-terra">Browse all books</Link>
                <button className="btn btn-ghost" onClick={() => { setIdx(0); setLiked([]); setClaimMsg(null); }}>
                  {td.startOver}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.stack}>
              {afterNext && (
                <div className={`${styles.card} ${styles.card3}`}>
                  <div className={styles.cardCover}>
                    <span className={styles.cardEmoji}>{afterNext.emoji || "📚"}</span>
                  </div>
                </div>
              )}
              {next && (
                <div className={`${styles.card} ${styles.card2}`}>
                  <div className={styles.cardCover}>
                    <span className={styles.cardEmoji}>{next.emoji || "📚"}</span>
                  </div>
                </div>
              )}

              {current && (
                <div className={`${styles.card} ${styles.cardFront} ${cardAnimClass(animDir, styles)}`}>
                  <div
                    className={styles.cardCover}
                    style={{ background: `linear-gradient(135deg, ${genreStyle.bg || "var(--terra-light)"}, var(--cream))` }}
                  >
                    <span className={styles.cardEmoji}>{current.emoji || "📚"}</span>
                    {current.exchange && <span className={styles.exchangeBadge}>🔄 Exchange</span>}
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardGenre} style={{ background: genreStyle.bg, color: genreStyle.color }}>
                        {current.genre}
                      </span>
                      <span className={styles.cardCity}>📍 {current.city}</span>
                    </div>
                    <h2 className={styles.cardTitle}>{current.title}</h2>
                    <p className={styles.cardAuthor}>{current.author}</p>
                    <p className={styles.cardCond}>
                      <strong>{CONDITION_LABELS[current.condition] || current.condition}</strong>
                    </p>
                  </div>
                </div>
              )}

              <div className={styles.actions}>
                <button
                  className={`${styles.actionBtn} ${styles.skipBtn}`}
                  onClick={() => handleAction("left")}
                  aria-label="Skip this book"
                  disabled={!!animDir}
                >
                  <span className={styles.actionIcon}>✕</span>
                  <span>{td.skip}</span>
                </button>
                <button
                  data-testid="claim-book-button"
                  className={`${styles.actionBtn} ${styles.wantBtn}`}
                  onClick={() => handleAction("right")}
                  aria-label="I want this book"
                  disabled={!!animDir}
                >
                  <span className={styles.actionIcon}>♥</span>
                  <span>{td.want}</span>
                </button>
              </div>

              <p className={styles.hint}>
                {user ? td.hint : "Log in to claim a book"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
