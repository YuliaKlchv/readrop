import { useState, useRef, useEffect } from "react";
import { useLang } from "../context/LangContext.jsx";
import { LANGUAGES } from "../data/i18n.js";
import styles from "./LangSwitcher.module.css";

export default function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-expanded={open}
      >
        <span className={styles.flag}>{current.flag}</span>
        <span className={styles.code}>{current.code.toUpperCase()}</span>
        <span className={`${styles.chevron} ${open ? styles.up : ""}`}>›</span>
      </button>

      {open && (
        <ul className={styles.dropdown} role="listbox">
          {LANGUAGES.map((l) => (
            <li
              key={l.code}
              role="option"
              aria-selected={l.code === lang}
              className={`${styles.option} ${l.code === lang ? styles.selected : ""}`}
              onClick={() => { setLang(l.code); setOpen(false); }}
            >
              <span className={styles.flag}>{l.flag}</span>
              <span className={styles.label}>{l.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
