import { Link } from "react-router-dom";
import styles from "./ThankYou.module.css";

export default function ThankYou() {
  return (
    <div className={`container section ${styles.wrap}`}>
      <span className={styles.emoji}>📚</span>
      <h1 className={styles.h1}>Welcome to Readrop!</h1>
      <p className="section-lead">
        Your account is ready. Start by giving a book or browse what's available near you.
      </p>
      <div className={styles.ctas}>
        <Link to="/give" className="btn btn-terra">Give a book →</Link>
        <Link to="/books" className="btn btn-ghost">Browse books</Link>
      </div>
    </div>
  );
}
