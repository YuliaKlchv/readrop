import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <img src="/logo-light.png" alt="SkillOport" height={28} className={styles.logo} />
          <p>Your weekly creative micro-break.</p>
        </div>

        <div className={styles.cols}>
          <div className={styles.col}>
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/pricing">Pricing</Link>
          </div>
          <div className={styles.col}>
            <h4>Legal</h4>
            <Link to="/legal?tab=impressum">Impressum</Link>
            <Link to="/legal?tab=privacy">Privacy</Link>
            <Link to="/legal?tab=terms">Terms</Link>
            <Link to="/legal?tab=cancellation">Cancellation</Link>
          </div>
          <div className={styles.col}>
            <h4>Say hi</h4>
            <a href="mailto:hello@skilloport.com">hello@skilloport.com</a>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </div>

      <div className={`container ${styles.base}`}>
        <span>© {new Date().getFullYear()} SkillOport · Yuliya Kalcheva</span>
        <span>Anti-doomscroll since day one.</span>
      </div>
    </footer>
  );
}
