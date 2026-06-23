import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <img src="/logo.png" alt="Logo" height={42} className={styles.logo} />
          <p>Give your read books a new home.</p>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/books">Browse books</Link>
            <Link to="/discover">Discover</Link>
            <Link to="/community">Community</Link>
            <Link to="/give">Give a book</Link>
          </div>
          <div className={styles.col}>
            <h4>Legal</h4>
            <Link to="/legal?tab=impressum">Impressum</Link>
            <Link to="/legal?tab=privacy">Privacy</Link>
            <Link to="/legal?tab=terms">Terms</Link>
          </div>
          <div className={styles.col}>
            <h4>Say hi</h4>
            <a href="mailto:hello@readrop.app">hello@readrop.app</a>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>

      <div className={`container ${styles.base}`}>
        <span>© {new Date().getFullYear()} Readrop · Yuliya Kalcheva</span>
        <span>Books find new readers, readers find new books.</span>
      </div>
    </footer>
  );
}
