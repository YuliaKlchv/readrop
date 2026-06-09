import { useState } from "react";
import { Link } from "react-router-dom";
import { BOOKS, GENRE_COLORS, CONDITION_LABELS } from "../data/books.js";
import { useT } from "../context/LangContext.jsx";
import styles from "./Discover.module.css";

const DECK = [...BOOKS].sort(() => Math.random() - 0.5);

function cardAnimClass(animDir, stylesObj) {
  if (animDir === "left")  return stylesObj.flyLeft;
  if (animDir === "right") return stylesObj.flyRight;
  return "";
}

export default function Discover() {
  const t = useT();
  const td = t.discover;

  const [idx, setIdx] = useState(0);
  const [liked, setLiked] = useState([]);
  const [animDir, setAnimDir] = useState(null);

  const current   = DECK[idx];
  const next      = DECK[idx + 1];
  const afterNext = DECK[idx + 2];
  const isDone    = idx >= DECK.length;

  const handleAction = (dir) => {
    if (animDir) return;
    setAnimDir(dir);
    if (dir === "right") setLiked((prev) => [...prev, current]);
    setTimeout(() => {
      setIdx((i) => i + 1);
      setAnimDir(null);
    }, 320);
  };

  const genreStyle = current ? (GENRE_COLORS[current.genre] || {}) : {};

  const likedSuffix = liked.length === 1 ? td.likedSuffix : td.likedSuffixPlural;

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <span className="eyebrow">{td.eyebrow}</span>
          <h1 className={styles.h1}>{td.h1}</h1>
          <p className={styles.sub}>
            {td.sub.split("\n")[0]}<br />{td.sub.split("\n")[1]}
          </p>

          {liked.length > 0 && (
            <div className={styles.likedList}>
              <p className={styles.likedLabel}>
                {td.likedLabel} {liked.length} {likedSuffix}:
              </p>
              {liked.map((b) => (
                <div key={b.title} className={styles.likedItem}>
                  <span>{b.emoji}</span>
                  <span className={styles.likedTitle}>{b.title}</span>
                </div>
              ))}
            </div>
          )}

          <div className={styles.progress}>
            <div
              className={styles.progressBar}
              style={{ width: `${Math.min((idx / DECK.length) * 100, 100)}%` }}
            />
          </div>
          <p className={styles.progressText}>
            {isDone ? td.allDone : `${idx + 1} / ${DECK.length}`}
          </p>
        </div>

        <div className={styles.right}>
          {isDone ? (
            <div className={styles.doneCard}>
              <span className={styles.doneEmoji}>🎉</span>
              <h2>{td.allDoneSub}</h2>
              <p>
                {td.liked} <strong>{liked.length}</strong> {td.outOf} {DECK.length}.
              </p>
              <div className={styles.doneBtns}>
                <Link to="/books" className="btn btn-terra">Browse all books</Link>
                <button className="btn btn-ghost" onClick={() => { setIdx(0); setLiked([]); }}>
                  {td.startOver}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.stack}>
              {afterNext && (
                <div className={`${styles.card} ${styles.card3}`}>
                  <div className={styles.cardCover}>
                    <span className={styles.cardEmoji}>{afterNext.emoji}</span>
                  </div>
                </div>
              )}
              {next && (
                <div className={`${styles.card} ${styles.card2}`}>
                  <div className={styles.cardCover}>
                    <span className={styles.cardEmoji}>{next.emoji}</span>
                  </div>
                </div>
              )}

              <div className={`${styles.card} ${styles.cardFront} ${cardAnimClass(animDir, styles)}`}>
                <div
                  className={styles.cardCover}
                  style={{ background: `linear-gradient(135deg, ${genreStyle.bg || "var(--terra-light)"}, var(--cream))` }}
                >
                  <span className={styles.cardEmoji}>{current.emoji}</span>
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
                    <strong>{CONDITION_LABELS[current.condition]}</strong>
                  </p>
                </div>
              </div>

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
                  className={`${styles.actionBtn} ${styles.wantBtn}`}
                  onClick={() => handleAction("right")}
                  aria-label="I want this book"
                  disabled={!!animDir}
                >
                  <span className={styles.actionIcon}>♥</span>
                  <span>{td.want}</span>
                </button>
              </div>

              <p className={styles.hint}>{td.hint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
