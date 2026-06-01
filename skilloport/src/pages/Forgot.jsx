import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { isValidEmail, validateEmail } from "../lib/validation.js";
import styles from "./Auth.module.css";

export default function Forgot() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const err = validateEmail(email);
    if (err) return setError(err);
    setBusy(true);
    await forgotPassword(email); // same outcome whether or not the address exists
    setBusy(false);
    setSentTo(email.trim());
  };

  if (sentTo) {
    return (
      <div className={`container section ${styles.wrap}`}>
        <div className={styles.card} style={{ textAlign: "center" }}>
          <span className={styles.bigEmoji}>📬</span>
          <h1 className={styles.title}>Check your inbox</h1>
          <p className={styles.lead}>
            If an account exists for <strong>{sentTo}</strong>, we've sent a password-reset link to
            it. The link expires in 30 minutes.
          </p>
          <p className={styles.lead}>
            Didn't get it? Check your spam folder, or{" "}
            <button
              type="button"
              className={styles.suggestFix}
              onClick={() => { setSentTo(""); setEmail(""); }}
            >
              try another email
            </button>.
          </p>
          <Link to="/login" className="btn btn-terra btn-block">Back to log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container section ${styles.wrap}`}>
      <div className={styles.card}>
        <span className="eyebrow">No worries</span>
        <h1 className={styles.title}>Reset your password</h1>
        <p className={styles.lead}>
          Enter your account email and we'll send a link to set a new password.
        </p>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <form onSubmit={onSubmit} noValidate>
          <label className={styles.label} htmlFor="forgot-email">Email</label>
          <input
            id="forgot-email" type="email" autoComplete="email" className={styles.input}
            placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit" className="btn btn-terra btn-block"
            disabled={busy || !isValidEmail(email)}
          >
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className={styles.alt}>
          Remembered it? <Link to="/login">Back to log in</Link>
        </p>
      </div>
    </div>
  );
}
