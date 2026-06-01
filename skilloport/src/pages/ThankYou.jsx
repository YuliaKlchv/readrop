import { Link } from "react-router-dom";
import styles from "./ThankYou.module.css";

export default function ThankYou() {
  return (
    <div className={`container section ${styles.wrap}`}>
      <span className={styles.emoji}>📬</span>
      <h1 className={styles.h1}>You're in!</h1>
      <p className="section-lead">
        Your first drop lands this Sunday. Check your inbox.
      </p>
      <div className={styles.ctas}>
        <Link to="/gallery" className="btn btn-terra">Browse the gallery →</Link>
      </div>
    </div>
  );
}
