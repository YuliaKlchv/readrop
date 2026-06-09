import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard.jsx";
import { BOOKS, GENRES } from "../data/books.js";
import { useT } from "../context/LangContext.jsx";
import styles from "./Books.module.css";

export default function Books() {
  const t = useT();
  const [genre, setGenre] = useState("all");
  const [showExchange, setShowExchange] = useState(false);

  const visible = useMemo(() => {
    let list = genre === "all" ? BOOKS : BOOKS.filter((b) => b.genre === genre);
    if (showExchange) list = list.filter((b) => b.exchange);
    return list;
  }, [genre, showExchange]);

  return (
    <div className="container section">
      <div className="page-head">
        <span className="eyebrow">{t.books.eyebrow}</span>
        <h1>{t.books.h1}</h1>
        <p className="section-lead">{t.books.sub}</p>
      </div>

      <div className={styles.filterRow}>
        {GENRES.map((g) => (
          <button
            key={g.key}
            className={`${styles.filter} ${genre === g.key ? styles.active : ""}`}
            onClick={() => setGenre(g.key)}
          >
            {g.emoji && <span>{g.emoji}</span>}
            {g.label}
          </button>
        ))}
      </div>

      <div className={styles.toggleRow}>
        <button
          className={`${styles.toggle} ${showExchange ? styles.toggleActiveTeal : ""}`}
          onClick={() => setShowExchange((v) => !v)}
        >
          {t.books.exchangeToggle}
        </button>
      </div>

      {visible.length ? (
        <div className={styles.grid}>
          {visible.map((b) => (
            <BookCard key={`${b.title}-${b.author}`} book={b} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>{t.books.empty}</p>
          <Link to="/give" className="btn btn-terra">{t.books.emptyCta}</Link>
        </div>
      )}
    </div>
  );
}
