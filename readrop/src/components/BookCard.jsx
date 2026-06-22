import PropTypes from "prop-types";
import styles from "./BookCard.module.css";
import { CONDITION_LABELS, CONDITION_COLORS, GENRE_COLORS } from "../data/books.js";

export default function BookCard({ book, onClaim }) {
  const condLabel = CONDITION_LABELS[book.condition] || book.condition;
  const condColor = CONDITION_COLORS[book.condition] || "var(--muted)";
  const genreStyle = GENRE_COLORS[book.genre] || {};
  const coverBg = genreStyle.bg
    ? `linear-gradient(135deg, ${genreStyle.bg}, var(--cream))`
    : "linear-gradient(135deg, var(--terra-light), var(--forest-light))";

  return (
    <article className={styles.card} data-testid="book-card">
      <div className={styles.cover} style={{ background: coverBg }}>
        <span className={styles.emoji}>{book.emoji || "📚"}</span>
        <div className={styles.badges}>
          {book.exchange && (
            <span className={styles.badgeExchange}>🔄 Exchange</span>
          )}
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.meta}>
          <span
            className={styles.genre}
            style={{ background: genreStyle.bg, color: genreStyle.color }}
          >
            {book.genre}
          </span>
          <span className={styles.cond} style={{ color: condColor }}>
            {condLabel}
          </span>
        </div>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author}</p>
        <div className={styles.footer}>
          <span className={styles.city}>📍 {book.city}</span>
          {onClaim && (
            <button
              type="button"
              data-testid="claim-book-button"
              className={`btn btn-terra btn-sm ${styles.claim}`}
              onClick={() => onClaim(book)}
            >
              Claim
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

BookCard.propTypes = {
  book: PropTypes.shape({
    title:     PropTypes.string.isRequired,
    author:    PropTypes.string.isRequired,
    genre:     PropTypes.string,
    condition: PropTypes.string,
    city:      PropTypes.string,
    emoji:     PropTypes.string,
    exchange:  PropTypes.bool,
  }).isRequired,
  onClaim: PropTypes.func,
};
