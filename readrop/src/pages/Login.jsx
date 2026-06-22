import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { validateEmail } from "../lib/validation.js";
import { DEMO_ACCOUNT, DEMO_ACCOUNT_2 } from "../lib/demoUser.js";
import styles from "./Auth.module.css";

export default function Login() {
  const { signIn, mode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailErr = validateEmail(email);
    if (emailErr) return setError(emailErr);
    if (!password) return setError("Password is required.");

    setBusy(true);
    const { error: authErr } = await signIn(email, password);
    setBusy(false);

    if (authErr) {
      // Deliberately generic — never reveal whether the email exists.
      setError("Invalid email or password.");
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className={`container section ${styles.wrap}`}>
      <div className={styles.card}>
        <span className="eyebrow">Welcome back</span>
        <h1 className={styles.title}>Log in to Readrop</h1>
        <p className={styles.lead}>Welcome back to your book community.</p>

        {mode === "demo" && (
          <p className={styles.notice}>
            Demo mode active. User 1: <code>{DEMO_ACCOUNT.email}</code> / <code>{DEMO_ACCOUNT.password}</code>.
            {" "}User 2: <code>{DEMO_ACCOUNT_2.email}</code> / <code>{DEMO_ACCOUNT_2.password}</code>.
          </p>
        )}
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <form onSubmit={onSubmit} noValidate>
          <label className={styles.label} htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            data-testid="login-email"
            type="email"
            autoComplete="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className={styles.label} htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            data-testid="login-password"
            type="password"
            autoComplete="current-password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className={styles.forgotRow}>
            <Link to="/forgot">Forgot password?</Link>
          </div>

          <button type="submit" data-testid="login-submit" className="btn btn-terra btn-block" disabled={busy}>
            {busy ? "Signing in…" : "Log in"}
          </button>
        </form>

        <p className={styles.alt}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
