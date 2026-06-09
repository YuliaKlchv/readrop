import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COMMUNITIES } from "../data/communities.js";
import { GENRES } from "../data/books.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useT, useLang } from "../context/LangContext.jsx";
import styles from "./Community.module.css";

const COLOR_MAP = {
  indigo: { bg: "var(--indigo-light)", accent: "var(--indigo)", dark: "var(--indigo-dark)" },
  teal:   { bg: "var(--teal-light)",   accent: "var(--teal)",   dark: "var(--teal-dark)" },
  forest: { bg: "var(--forest-light)", accent: "var(--forest)", dark: "var(--forest)" },
  terra:  { bg: "var(--terra-light)",  accent: "var(--terra)",  dark: "#b13a25" },
  gold:   { bg: "#fdf4e0",             accent: "var(--gold)",   dark: "#b8780a" },
  rose:   { bg: "var(--rose-light)",   accent: "var(--rose)",   dark: "#be1239" },
};

function btnLabel(loading, translated, tc) {
  if (loading)    return tc.translating;
  if (translated) return "← Original";
  return tc.translate;
}

/* Mock translations for thread titles — in production wire to a real API */
const MOCK_TRANSLATIONS = {
  de: {
    "What's the best hard sci-fi of the last decade?": "Was ist die beste Hard-SF des letzten Jahrzehnts?",
    "Dune vs Foundation — which world would you live in?": "Dune vs. Foundation — in welcher Welt würdest du leben?",
    "Currently reading: Project Hail Mary 🙌": "Gerade am Lesen: Project Hail Mary 🙌",
    "Starting Anna Karenina — send help 😅": "Fange Anna Karenina an — bitte helft mir 😅",
    "Best translation of Crime & Punishment?": "Beste Übersetzung von Schuld und Sühne?",
    "Are classics actually readable or do we just pretend?": "Sind Klassiker wirklich lesbar oder tun wir nur so?",
    "Sapiens changed my view on civilization — anyone else?": "Sapiens hat meine Sicht auf die Zivilisation verändert — euch auch?",
    "Best books on cognitive bias?": "Beste Bücher über kognitive Verzerrungen?",
    "Just finished 'The Body' — Bryson is unbeatable": "Gerade 'Der Körper' beendet — Bryson ist unschlagbar",
    "Is 1984 or Brave New World closer to now?": "Ist 1984 oder Schöne neue Welt näher an der Gegenwart?",
    "Hidden gems: underrated dystopian novels": "Versteckte Schätze: Unterschätzte Dystopien",
    "Rereading Fahrenheit 451 in 2025 hits differently": "Fahrenheit 451 in 2025 nochmal lesen trifft anders",
    "Carl Sagan still the GOAT of science writing?": "Ist Carl Sagan noch immer der GOAT des Wissenschaftsschreibens?",
    "Recommendations after A Brief History of Time?": "Empfehlungen nach 'Eine kurze Geschichte der Zeit'?",
    "Is 'The Gene' by Mukherjee worth it?": "Ist 'Das Gen' von Mukherjee lesenswert?",
    "Normal People is overhyped — change my mind": "Normal People ist überhyped — überzeugt mich vom Gegenteil",
    "Best debut novels of 2024?": "Beste Debütromane 2024?",
    "Is literary fiction becoming too self-aware?": "Wird literarische Fiktion zu selbstbewusst?",
    "Meditations as daily practice — how do you use it?": "Meditationen als tägliche Praxis — wie nutzt ihr es?",
    "Nietzsche is misunderstood — a thread": "Nietzsche wird missverstanden — ein Thread",
    "Best intro to Stoicism that isn't self-help fluff?": "Beste Einführung in die Stoa ohne Selbsthilfe-Fluff?",
  },
  tr: {
    "What's the best hard sci-fi of the last decade?": "Son on yılın en iyi hard bilim kurgusu nedir?",
    "Dune vs Foundation — which world would you live in?": "Dune mu Foundation mı — hangisinde yaşardın?",
    "Currently reading: Project Hail Mary 🙌": "Şu an okuyorum: Project Hail Mary 🙌",
    "Starting Anna Karenina — send help 😅": "Anna Karenina başlıyorum — yardım edin 😅",
    "Best translation of Crime & Punishment?": "Suç ve Ceza'nın en iyi çevirisi hangisi?",
    "Are classics actually readable or do we just pretend?": "Klasikler gerçekten okunabilir mi yoksa sadece okuyormuş gibi mi yapıyoruz?",
    "Sapiens changed my view on civilization — anyone else?": "Sapiens medeniyete bakışımı değiştirdi — başkaları da?",
    "Best books on cognitive bias?": "Bilişsel önyargı hakkında en iyi kitaplar?",
    "Just finished 'The Body' — Bryson is unbeatable": "Az önce 'Vücut'u bitirdim — Bryson rakipsiz",
    "Is 1984 or Brave New World closer to now?": "1984 mü Cesur Yeni Dünya mı günümüze daha yakın?",
    "Hidden gems: underrated dystopian novels": "Gizli mücevherler: Hafife alınan distopik romanlar",
    "Rereading Fahrenheit 451 in 2025 hits differently": "Fahrenheit 451'i 2025'te yeniden okumak bambaşka",
    "Carl Sagan still the GOAT of science writing?": "Carl Sagan hâlâ bilim yazarlığının en iyisi mi?",
    "Recommendations after A Brief History of Time?": "Zamanın Kısa Tarihi'nden sonra ne okuyalım?",
    "Is 'The Gene' by Mukherjee worth it?": "Mukherjee'nin 'Gen'i okunmaya değer mi?",
    "Normal People is overhyped — change my mind": "Normal People abartılmış — beni ikna et",
    "Best debut novels of 2024?": "2024'ün en iyi ilk romanları?",
    "Is literary fiction becoming too self-aware?": "Edebi kurgu çok öz-bilinçli mi oluyor?",
    "Meditations as daily practice — how do you use it?": "Günlük pratik olarak Özlü Düşünceler — nasıl kullanıyorsunuz?",
    "Nietzsche is misunderstood — a thread": "Nietzsche yanlış anlaşılıyor — bir tartışma",
    "Best intro to Stoicism that isn't self-help fluff?": "Öz-yardım saçmalığı olmayan en iyi Stoacılık girişi?",
  },
  fr: {
    "What's the best hard sci-fi of the last decade?": "Quel est le meilleur hard sci-fi de la dernière décennie ?",
    "Dune vs Foundation — which world would you live in?": "Dune vs Fondation — dans quel monde vivriez-vous ?",
    "Currently reading: Project Hail Mary 🙌": "En cours de lecture : Projet Salve Marie 🙌",
    "Are classics actually readable or do we just pretend?": "Les classiques sont-ils vraiment lisibles ou faisons-nous semblant ?",
    "Normal People is overhyped — change my mind": "Normal People est surestimé — convainquez-moi",
    "Best debut novels of 2024?": "Meilleurs premiers romans de 2024 ?",
    "Nietzsche is misunderstood — a thread": "Nietzsche est mal compris — un fil de discussion",
  },
};

function ThreadItem({ thread, tc }) {
  const { lang } = useLang();
  const [translated, setTranslated] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = () => {
    if (lang === "en") return;
    if (translated) { setTranslated(null); return; }
    setLoading(true);
    setTimeout(() => {
      const map = MOCK_TRANSLATIONS[lang] || {};
      setTranslated(map[thread.title] || `[${lang.toUpperCase()}] ${thread.title}`);
      setLoading(false);
    }, 600);
  };

  return (
    <li className={styles.thread}>
      <div className={styles.threadContent}>
        <span className={styles.threadTitle}>
          {thread.hot && <span className={styles.hotTag}>🔥</span>}
          {translated || thread.title}
        </span>
        {lang !== "en" && (
          <button
            className={`${styles.translateBtn} ${translated ? styles.translateActive : ""}`}
            onClick={handleTranslate}
            disabled={loading}
          >
            {btnLabel(loading, translated, tc)}
          </button>
        )}
      </div>
      <span className={styles.threadReplies}>{thread.replies} {tc.replies}</span>
    </li>
  );
}

function CommunityCard({ club, tc, user }) {
  const [joined, setJoined] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const colors = COLOR_MAP[club.colorVar] || COLOR_MAP.indigo;

  const handleJoin = () => {
    if (!user) { navigate("/login"); return; }
    setJoined((v) => !v);
  };

  return (
    <article
      className={styles.card}
      style={{ "--accent": colors.accent, "--accent-bg": colors.bg }}
    >
      <div className={styles.cardTop} style={{ background: colors.bg }}>
        <span className={styles.clubEmoji}>{club.emoji}</span>
        <div className={styles.clubHead}>
          <h3 className={styles.clubName}>{club.name}</h3>
          <p className={styles.clubTagline}>{club.tagline}</p>
        </div>
        {club.active && <span className={styles.activeDot} title="Active now" />}
      </div>

      <div className={styles.cardBody}>
        <p className={styles.clubDesc}>{club.description}</p>

        <div className={styles.cardStats}>
          <span className={styles.stat}>
            <span className={styles.statIcon}>👥</span>
            {club.members.toLocaleString()} {tc.members}
          </span>
          <span className={styles.stat}>
            <span className={styles.statIcon}>💬</span>
            {club.threads.length} {tc.threads}
          </span>
        </div>

        <button className={styles.threadToggle} onClick={() => setExpanded((v) => !v)}>
          {expanded ? tc.hideDiscussions : tc.showDiscussions}
          <span className={expanded ? styles.chevronUp : styles.chevron}>›</span>
        </button>

        {expanded && (
          <ul className={styles.threads}>
            {club.threads.map((thread) => (
              <ThreadItem key={thread.title} thread={thread} tc={tc} />
            ))}
          </ul>
        )}
      </div>

      <div className={styles.cardFooter}>
        <button
          className={`${styles.joinBtn} ${joined ? styles.joined : ""}`}
          style={joined
            ? { background: colors.bg, color: colors.accent, borderColor: colors.accent }
            : { background: colors.accent, color: "#fff", borderColor: colors.accent }
          }
          onClick={handleJoin}
        >
          {joined ? tc.joined : tc.join}
        </button>
      </div>
    </article>
  );
}

export default function Community() {
  const { user } = useAuth();
  const t  = useT();
  const tc = t.community;

  const [genreFilter, setGenreFilter] = useState("all");

  const genreOptions = [
    { key: "all", label: tc.allClubs },
    ...GENRES.filter((g) => g.key !== "all"),
  ];

  const visible = genreFilter === "all"
    ? COMMUNITIES
    : COMMUNITIES.filter((c) => c.genre === genreFilter);

  return (
    <div>
      <div className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <span className="eyebrow">{tc.eyebrow}</span>
          <h1 className={styles.heroTitle}>
            {tc.h1a}
            <br />
            <span className={styles.heroAccent}>{tc.h1b}</span>
          </h1>
          <p className={styles.heroSub}>{tc.sub}</p>
        </div>
      </div>

      <div className="container section">
        {!user && (
          <div className={styles.authBanner}>
            <span>🔒 {tc.loginToJoin}</span>
            <Link to="/login" className="btn btn-terra btn-sm">{t.nav.login}</Link>
          </div>
        )}

        <div className={styles.filters}>
          {genreOptions.map((g) => (
            <button
              key={g.key}
              className={`${styles.filter} ${genreFilter === g.key ? styles.active : ""}`}
              onClick={() => setGenreFilter(g.key)}
            >
              {g.emoji && <span>{g.emoji}</span>}
              {g.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className={styles.empty}><p>{tc.noClubs}</p></div>
        ) : (
          <div className={styles.grid}>
            {visible.map((club) => (
              <CommunityCard key={club.id} club={club} tc={tc} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
