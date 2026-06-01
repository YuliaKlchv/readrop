import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";
import { api } from "../lib/api.js";
import styles from "./Admin.module.css";

/* Days until the next upcoming Sunday (drops go out Sunday 09:00 CET). */
function daysToNextSunday() {
  const day = new Date().getDay(); // 0 = Sunday
  let diff = (7 - day) % 7;
  if (diff === 0) diff = 7;
  return diff;
}

const QUEUE = [
  { drop: "🦢 Paper Crane Origami", cat: "Craft", date: "2026-05-24", status: "Sent" },
  { drop: "👾 Pixel Art: Space Invader", cat: "Digital", date: "2026-05-31", status: "Ready" },
  { drop: "🇯🇵 5 Japanese Phrases", cat: "Language", date: "2026-06-07", status: "Scheduled" },
  { drop: "✍️ Calligraphy: Your Name", cat: "Art", date: "2026-06-14", status: "Scheduled" },
  { drop: "📡 Morse Code Basics", cat: "Secret", date: "2026-06-21", status: "Draft" },
];

const QUICK = [
  ["Pro / Free split", "26 / 21"],
  ["Annual plans", "9"],
  ["Avg. watch time", "4m 51s"],
  ["Most-loved drop", "🔮 Fortune Teller"],
  ["Churn (30d)", "2.1%"],
  ["Library size", "38 videos"],
];

const PLAN_META = {
  pro: { label: "Pro", className: "tagPro" },
  free: { label: "Free", className: "tagFree" },
  lead: { label: "Lead", className: "tagLead" },
};

export default function Admin() {
  const days = daysToNextSunday();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    api("subscribers").then((res) => {
      if (res.status === 200) setSubs(res.data.subscribers);
    });
  }, []);

  const onSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <div className={styles.admin}>
        <div className={styles.header}>
          <div className={`container ${styles.headerInner}`}>
            <span className={styles.logo}>
              <img src="/logo-light.png" alt="SkillOport" height={26} /> <em>ADMIN</em>
            </span>
            <div className={styles.headerRight}>
              <nav className={styles.quickNav} aria-label="Dashboard quick links">
                <Link to="/" className={styles.quickLink}>← Back to site</Link>
                <Link to="/gallery" className={styles.quickLink}>Gallery</Link>
                <Link to="/pricing" className={styles.quickLink}>Pricing</Link>
                <Link to="/legal" className={styles.quickLink}>Legal</Link>
              </nav>
              <span className={styles.user}>{user?.email}</span>
              <button type="button" className={styles.back} onClick={onSignOut}>
                Log out
              </button>
            </div>
          </div>
        </div>

        <div className={`container ${styles.body}`}>
          <h1 className={styles.title}>Dashboard</h1>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Audience</span>
              <span className={styles.statValue}>{subs.length}</span>
              <span className={`${styles.trend} ${styles.up}`}>live users + free-start leads</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>MRR</span>
              <span className={styles.statValue}>€152</span>
              <span className={`${styles.trend} ${styles.up}`}>▲ €24 this month</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Open rate</span>
              <span className={styles.statValue}>68%</span>
              <span className={`${styles.trend} ${styles.up}`}>▲ 3 pts</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Next drop in</span>
              <span className={styles.statValue}>
                {days} {days === 1 ? "day" : "days"}
              </span>
              <span className={styles.trend}>Sunday 09:00 CET</span>
            </div>
          </div>

          <div className={styles.cols}>
            <div className={styles.main}>
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <h2>Subscribers &amp; leads</h2>
                  <span className={styles.pill}>{subs.length} total</span>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Email</th><th>Plan</th><th>Joined</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subs.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: "26px" }}>
                            No signups or free-start leads yet — capture the first email.
                          </td>
                        </tr>
                      ) : (
                        subs.map((s) => {
                          const plan = PLAN_META[s.plan] || PLAN_META.free;
                          const dotClass =
                            s.dot === "amber" ? styles.dotAmber :
                            s.dot === "grey" ? styles.dotGrey :
                            styles.dotGreen;

                          return (
                            <tr key={`${s.kind}:${s.email}`}>
                              <td>{s.email}</td>
                              <td>
                                <span className={`${styles.tag} ${styles[plan.className]}`}>
                                  {plan.label}
                                </span>
                              </td>
                              <td>{(s.created_at || "").slice(0, 10)}</td>
                              <td>
                                <span className={`${styles.dot} ${dotClass}`} /> {s.status || "Active"}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <h2>Content queue</h2>
                  <span className={styles.pill}>5 upcoming</span>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Drop</th><th>Category</th><th>Air date</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {QUEUE.map((q) => (
                        <tr key={q.drop}>
                          <td>{q.drop}</td>
                          <td>{q.cat}</td>
                          <td>{q.date}</td>
                          <td>
                            <span className={`${styles.status} ${styles["status" + q.status]}`}>
                              {q.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <aside className={styles.side}>
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <h2>Quick stats</h2>
                </div>
                <ul className={styles.quick}>
                  {QUICK.map(([label, val]) => (
                    <li key={label}>
                      <span>{label}</span>
                      <strong>{val}</strong>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${styles.panel} ${styles.ctaPanel}`}>
                <h2>This week's drop</h2>
                <p>
                  👾 Pixel Art: Space Invader is <strong>ready to send</strong>.
                </p>
                <button type="button" className="btn btn-terra btn-block">
                  Send drop now
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
