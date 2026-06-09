import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";
import { api } from "../lib/api.js";
import styles from "./Admin.module.css";

const RECENT_BOOKS = [
  { title: "🚀 The Hitchhiker's Guide", genre: "Sci-Fi", city: "Berlin", date: "2026-06-05", status: "Available" },
  { title: "📖 Sapiens", genre: "Non-Fiction", city: "Berlin", date: "2026-06-04", status: "Available" },
  { title: "🌑 1984", genre: "Dystopia", city: "Hamburg", date: "2026-06-03", status: "Claimed" },
  { title: "🏜️ Dune", genre: "Sci-Fi", city: "Munich", date: "2026-06-02", status: "Available" },
  { title: "🧠 Thinking, Fast and Slow", genre: "Non-Fiction", city: "Berlin", date: "2026-06-01", status: "Claimed" },
];

const QUICK = [
  ["Books listed", "47"],
  ["Books claimed", "31"],
  ["Cities active", "8"],
  ["Most-listed genre", "Sci-Fi"],
  ["Avg. claim time", "1.4 days"],
  ["Books this week", "6"],
];

const PLAN_META = {
  member: { label: "Member", className: "tagFree" },
  free: { label: "Member", className: "tagFree" },
};

function dotClass(dot, styles) {
  if (dot === "amber") return styles.dotAmber;
  if (dot === "grey") return styles.dotGrey;
  return styles.dotGreen;
}

export default function Admin() {
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
              <img src="/logo-light.svg" alt="Readrop" height={26} /> <em>ADMIN</em>
            </span>
            <div className={styles.headerRight}>
              <nav className={styles.quickNav} aria-label="Dashboard quick links">
                <Link to="/" className={styles.quickLink}>← Back to site</Link>
                <Link to="/books" className={styles.quickLink}>Browse</Link>
                <Link to="/give" className={styles.quickLink}>Give a book</Link>
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
              <span className={styles.statLabel}>Registered users</span>
              <span className={styles.statValue}>{subs.length}</span>
              <span className={`${styles.trend} ${styles.up}`}>total accounts</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Books available</span>
              <span className={styles.statValue}>16</span>
              <span className={`${styles.trend} ${styles.up}`}>▲ 3 this week</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Claimed books</span>
              <span className={styles.statValue}>31</span>
              <span className={`${styles.trend} ${styles.up}`}>▲ 5 this month</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Active cities</span>
              <span className={styles.statValue}>8</span>
              <span className={styles.trend}>Berlin · Munich · Hamburg…</span>
            </div>
          </div>

          <div className={styles.cols}>
            <div className={styles.main}>
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <h2>Registered users</h2>
                  <span className={styles.pill}>{subs.length} total</span>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Email</th><th>Role</th><th>Joined</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subs.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: "26px" }}>
                            No registered users yet.
                          </td>
                        </tr>
                      ) : (
                        subs.map((s) => {
                          const meta = PLAN_META[s.plan] ?? PLAN_META.member;
                          const dc = dotClass(s.dot, styles);
                          return (
                            <tr key={`${s.kind}:${s.email}`}>
                              <td>{s.email}</td>
                              <td>
                                <span className={`${styles.tag} ${styles[meta.className]}`}>
                                  {meta.label}
                                </span>
                              </td>
                              <td>{(s.created_at || "").slice(0, 10)}</td>
                              <td>
                                <span className={`${styles.dot} ${dc}`} /> {s.status || "Active"}
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
                  <h2>Recent listings</h2>
                  <span className={styles.pill}>5 latest</span>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Book</th><th>Genre</th><th>City</th><th>Listed</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_BOOKS.map((b) => (
                        <tr key={b.title}>
                          <td>{b.title}</td>
                          <td>{b.genre}</td>
                          <td>{b.city}</td>
                          <td>{b.date}</td>
                          <td>
                            <span className={`${styles.status} ${styles["status" + b.status]}`}>
                              {b.status}
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
                <h2>Add a book</h2>
                <p>
                  Have a book to give away? List it and someone nearby will claim it.
                </p>
                <Link to="/give" className="btn btn-terra btn-block">
                  Give a book
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
