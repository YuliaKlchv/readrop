import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard.jsx";
import { GENRES } from "../data/books.js";
import { api } from "../lib/api.js";
import { useT } from "../context/LangContext.jsx";
import styles from "./Books.module.css";

export default function Books() {
  const t = useT();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [genre, setGenre] = useState("all");
  const [showExchange, setShowExchange] = useState(false);

  useEffect(() => {
    api("books").then((res) => {
      if (res.ok) {
        setBooks(res.data.books || []);
      } else {
        setFetchError("Could not load books. Please try again later.");
      }
      setLoading(false);
    });
  }, []);

  const visible = useMemo(() => {
    let list = genre === "all" ? books : books.filter((b) => b.genre === genre);
    if (showExchange) list = list.filter((b) => b.exchange);
    return list;
  }, [books, genre, showExchange]);

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

      {loading && (
        <div className={styles.empty}>
          <p>Loading books…</p>
        </div>
      )}

      {!loading && fetchError && (
        <div className={styles.empty}>
          <p>{fetchError}</p>
        </div>
      )}

      {!loading && !fetchError && (
        visible.length ? (
          <div className={styles.grid}>
            {visible.map((b) => (
              <BookCard key={b.id ?? `${b.title}-${b.author}`} book={b} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>{t.books.empty}</p>
            <Link to="/give" className="btn btn-terra">{t.books.emptyCta}</Link>
          </div>
        )
      )}
    </div>
  );
}
