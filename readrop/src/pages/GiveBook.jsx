import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useT } from "../context/LangContext.jsx";
import { api } from "../lib/api.js";
import styles from "./GiveBook.module.css";

const GENRES = [
  "Fiction", "Sci-Fi", "Classics", "Non-Fiction", "Dystopia",
  "Science", "Philosophy", "History", "Biography", "Children", "Comics", "Other",
];
const CONDITIONS = [
  { value: "GREAT", label: "Great — like new" },
  { value: "GOOD",  label: "Good — minor wear" },
  { value: "WORN",  label: "Well-loved — readable but worn" },
];

export default function GiveBook() {
  const { user } = useAuth();
  const t  = useT();
  const tg = t.give;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", author: "", genre: "", condition: "GOOD",
    description: "", city: user?.city || "",
    exchange: false,
  });
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await api("books", form);
    setLoading(false);
    if (res.ok) {
      navigate("/books");
    } else {
      setError(res.data?.error || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container section">
      <div className={styles.wrap}>
        <div className="page-head">
          <span className="eyebrow">{tg.eyebrow}</span>
          <h1>{tg.h1}</h1>
          <p className="section-lead">{tg.sub}</p>
        </div>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>{tg.title}</span>
              <input type="text" className={styles.input} value={form.title}
                onChange={set("title")} placeholder="e.g. Dune" required />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>{tg.author}</span>
              <input type="text" className={styles.input} value={form.author}
                onChange={set("author")} placeholder="e.g. Frank Herbert" required />
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.label}>{tg.genre}</span>
              <select className={styles.input} value={form.genre} onChange={set("genre")} required>
                <option value="">{tg.genrePlaceholder}</option>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>{tg.condition}</span>
              <select className={styles.input} value={form.condition} onChange={set("condition")}>
                {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </label>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <span className={styles.label}>{tg.offerType}</span>
              <div className={styles.segmented}>
                <button type="button"
                  className={`${styles.seg} ${form.exchange ? "" : styles.segActive}`}
                  onClick={() => setForm((f) => ({ ...f, exchange: false }))}>
                  {tg.free}
                </button>
                <button type="button"
                  className={`${styles.seg} ${form.exchange ? styles.segActiveTeal : ""}`}
                  onClick={() => setForm((f) => ({ ...f, exchange: true }))}>
                  {tg.exchange}
                </button>
              </div>
            </div>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>{tg.city}</span>
            <input type="text" className={styles.input} value={form.city}
              onChange={set("city")} placeholder="e.g. Vienna" required />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              {tg.description} <span className={styles.opt}>{tg.descOpt}</span>
            </span>
            <textarea className={`${styles.input} ${styles.textarea}`}
              value={form.description} onChange={set("description")}
              placeholder={tg.descPlaceholder} rows={3} />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className="btn btn-terra" disabled={loading}>
            {loading ? tg.submitting : tg.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
