import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useT } from "../context/LangContext.jsx";
import styles from "./Home.module.css";

const SHELF_ROW1 = [
  { title: "Dune",        color: "#d97706", h: 130, w: 30 },
  { title: "1984",        color: "#c8432b", h: 110, w: 26 },
  { title: "Sapiens",     color: "#3d6b3a", h: 140, w: 34 },
  { title: "Cosmos",      color: "#6366f1", h: 125, w: 28 },
  { title: "Meditations", color: "#0d9488", h: 118, w: 28 },
  { title: "Fahrenheit",  color: "#e11d48", h: 134, w: 32 },
  { title: "Foundation",  color: "#7c3aed", h: 122, w: 28 },
  { title: "Alchemist",   color: "#b45309", h: 130, w: 30 },
];
const SHELF_ROW2 = [
  { title: "Brave New World", color: "#059669", h: 136, w: 34 },
  { title: "Moby-Dick",       color: "#1d4ed8", h: 118, w: 28 },
  { title: "Anna Karenina",   color: "#9d174d", h: 144, w: 30 },
  { title: "Normal People",   color: "#7c3aed", h: 114, w: 28 },
  { title: "Atomic Habits",   color: "#ea580c", h: 126, w: 30 },
  { title: "Sophie's World",  color: "#0f766e", h: 132, w: 32 },
  { title: "Hitchhiker's",    color: "#4338ca", h: 110, w: 28 },
  { title: "Crime & Punish.", color: "#92400e", h: 140, w: 30 },
];

function Bookshelf() {
  return (
    <div className={styles.bookshelf} aria-hidden="true">
      <div className={styles.shelfRow}>
        {SHELF_ROW1.map((b) => (
          <div
            key={b.title}
            className={styles.spine}
            style={{ background: b.color, height: b.h, width: b.w }}
            title={b.title}
          >
            <span className={styles.spineTitle}>{b.title}</span>
          </div>
        ))}
      </div>
      <div className={styles.shelfBoard} />
      <div className={styles.shelfRow}>
        {SHELF_ROW2.map((b) => (
          <div
            key={b.title}
            className={styles.spine}
            style={{ background: b.color, height: b.h, width: b.w }}
            title={b.title}
          >
            <span className={styles.spineTitle}>{b.title}</span>
          </div>
        ))}
      </div>
      <div className={styles.shelfBoard} />
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const t = useT();
  const h = t.home;

  return (
    <>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <span className="eyebrow">{h.eyebrow}</span>
            <h1 className={styles.h1}>
              {h.h1a}
              <br />
              <span className="text-terra">{h.h1b}</span>
            </h1>
            <p className={styles.sub}>{h.sub}</p>
            <div className={styles.ctas}>
              {user ? (
                <Link to="/give" className="btn btn-terra">{h.ctaGive}</Link>
              ) : (
                <Link to="/register" className="btn btn-terra">{h.ctaPrimary}</Link>
              )}
              <Link to="/discover" className="btn btn-ghost">{h.ctaDiscover}</Link>
            </div>
            <p className={styles.note}>{h.note}</p>
          </div>

          <Bookshelf />
        </div>
      </div>

      {/* FEATURES */}
      <div className="container section">
        <div className="section-head">
          <h2>{h.whyTitle}</h2>
          <p className="section-lead">{h.whySub}</p>
        </div>
        <div className={styles.featureGrid}>
          <article className={styles.feature}>
            <span className={`${styles.icon} ${styles.iconTerra}`}>📚</span>
            <h3>{h.f1t}</h3><p>{h.f1b}</p>
          </article>
          <article className={styles.feature}>
            <span className={`${styles.icon} ${styles.iconGold}`}>📍</span>
            <h3>{h.f2t}</h3><p>{h.f2b}</p>
          </article>
          <article className={styles.feature}>
            <span className={`${styles.icon} ${styles.iconForest}`}>♻️</span>
            <h3>{h.f3t}</h3><p>{h.f3b}</p>
          </article>
          <article className={styles.feature}>
            <span className={`${styles.icon} ${styles.iconIndigo}`}>🔄</span>
            <h3>{h.f4t}</h3><p>{h.f4b}</p>
          </article>
          <article className={styles.feature}>
            <span className={`${styles.icon} ${styles.iconTeal}`}>🔖</span>
            <h3>{h.f5t}</h3><p>{h.f5b}</p>
          </article>
          <article className={styles.feature}>
            <span className={`${styles.icon} ${styles.iconRose}`}>💬</span>
            <h3>{h.f6t}</h3><p>{h.f6b}</p>
          </article>
        </div>
      </div>

      {/* DISCOVER BAND */}
      <div className={styles.discoverBand}>
        <div className={`container ${styles.discoverInner}`}>
          <div className={styles.discoverText}>
            <span className={styles.eyebrowIndigo}>{h.discoverEyebrow}</span>
            <h2 className={styles.discoverTitle}>{h.discoverTitle}</h2>
            <p className={styles.discoverSub}>{h.discoverSub}</p>
            <Link to="/discover" className="btn btn-indigo">{h.discoverCta}</Link>
          </div>
          <div className={styles.discoverVisual} aria-hidden="true">
            <div className={styles.swipeCard}>
              <span className={styles.swipeEmoji}>🏜️</span>
              <div className={styles.swipeInfo}>
                <span className={styles.swipeGenre}>Sci-Fi</span>
                <p className={styles.swipeTitle}>Dune</p>
                <p className={styles.swipeAuthor}>Frank Herbert</p>
              </div>
              <span className={styles.swipeBadge}>🔄 Exchange</span>
            </div>
            <div className={styles.swipeActions}>
              <span className={styles.swipeSkip}>✕ {t.discover.skip}</span>
              <span className={styles.swipeWant}>♥ {t.discover.want}</span>
            </div>
          </div>
        </div>
      </div>

      {/* COMMUNITY BAND */}
      <div className={styles.communityBand}>
        <div className={`container ${styles.communityInner}`}>
          <div className={styles.communityVisual} aria-hidden="true">
            <div className={styles.clubPreview}>
              <div className={`${styles.clubCard} ${styles.clubCardIndigo}`}>
                <span className={styles.clubIcon}>🚀</span>
                <div>
                  <p className={styles.clubTitle}>Sci-Fi Universe</p>
                  <p className={styles.clubMembers}>1,240 {t.community.members} · 🟢</p>
                </div>
              </div>
              <div className={`${styles.clubCard} ${styles.clubCardForest}`}>
                <span className={styles.clubIcon}>🧠</span>
                <div>
                  <p className={styles.clubTitle}>Non-Fiction Nerds</p>
                  <p className={styles.clubMembers}>2,103 {t.community.members} · 🟢</p>
                </div>
              </div>
              <div className={`${styles.clubCard} ${styles.clubCardGold}`}>
                <span className={styles.clubIcon}>🎩</span>
                <div>
                  <p className={styles.clubTitle}>Classics Corner</p>
                  <p className={styles.clubMembers}>876 {t.community.members}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.communityText}>
            <span className={styles.eyebrowTeal}>{h.communityEyebrow}</span>
            <h2 className={styles.communityTitle}>{h.communityTitle}</h2>
            <p className={styles.communitySub}>{h.communitySub}</p>
            <Link to="/community" className="btn btn-teal">{h.communityCta}</Link>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className={styles.howSection}>
        <div className="container section">
          <div className="section-head">
            <h2>{h.howTitle}</h2>
            <p className="section-lead">{h.howSub}</p>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>1</span>
              <h3>{h.step1t}</h3><p>{h.step1b}</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>2</span>
              <h3>{h.step2t}</h3><p>{h.step2b}</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>3</span>
              <h3>{h.step3t}</h3><p>{h.step3b}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA BAND */}
      <div className={styles.ctaBand}>
        <div className={`container ${styles.ctaInner}`}>
          <div>
            <h2 className={styles.ctaTitle}>{h.ctaBandTitle}</h2>
            <p className={styles.ctaText}>{h.ctaBandSub}</p>
          </div>
          <div className={styles.ctaBtns}>
            {user ? (
              <Link to="/give" className="btn btn-terra">{h.ctaBandGive}</Link>
            ) : (
              <Link to="/register" className="btn btn-terra">{h.ctaBandPrimary}</Link>
            )}
            <Link to="/books" className="btn btn-ghost btn-light">{h.ctaBandBrowse}</Link>
          </div>
        </div>
      </div>
    </>
  );
}
