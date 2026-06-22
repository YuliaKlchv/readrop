import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  validateEmail,
  validatePassword,
  passwordScore,
  passwordAllMet,
  isValidEmail,
  suggestEmail,
  PASSWORD_RULES,
} from "../lib/validation.js";
import styles from "./Auth.module.css";

const STRENGTH = ["Weak", "Weak", "Weak", "Fair", "Strong", "Very Strong"];

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const prefilledEmail = searchParams.get("email");
    if (prefilledEmail) setEmail(prefilledEmail);
  }, [searchParams]);

  const score = passwordScore(password);
  const suggestion = suggestEmail(email);
  const emailBad = email.length > 0 && !isValidEmail(email);
  const mismatch = confirm.length > 0 && confirm !== password;
  const ready =
    name.trim() && isValidEmail(email) && passwordAllMet(password) && password === confirm;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your name.");
    const emailErr = validateEmail(email);
    if (emailErr) return setError(emailErr);
    const pwErr = validatePassword(password);
    if (pwErr) return setError(pwErr);
    if (password !== confirm) return setError("Passwords don't match.");

    setBusy(true);
    const { error: authErr } = await signUp({ name, email, password, plan: "member" });
    setBusy(false);
    if (authErr) return setError(authErr.message);
    navigate("/thank-you");
  };

  return (
    <div className={`container section ${styles.wrap}`}>
      <div className={styles.card}>
        <span className="eyebrow">Join Readrop</span>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.lead}>Give books, find books, join the community. Free forever.</p>

        {error && (
          <p className={styles.error} role="alert">{error}</p>
        )}

        <form onSubmit={onSubmit} noValidate data-testid="register-form">
          <label className={styles.label} htmlFor="reg-name">Full name</label>
          <input
            id="reg-name"
            data-testid="register-name"
            type="text"
            autoComplete="name"
            className={styles.input}
            placeholder="Ada Lovelace"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className={styles.label} htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            data-testid="register-email"
            type="email"
            autoComplete="email"
            className={styles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailBad && <p className={styles.fieldError}>Please enter a valid email address</p>}
          {!emailBad && suggestion && (
            <p className={styles.suggest}>
              Did you mean{" "}
              <button type="button" className={styles.suggestFix} onClick={() => setEmail(suggestion)}>
                {suggestion}
              </button>?
            </p>
          )}

          <label className={styles.label} htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            data-testid="register-password"
            type="password"
            autoComplete="new-password"
            className={styles.input}
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {password && (
            <>
              <div className={styles.meter} aria-hidden="true">
                <span
                  className={styles.meterFill}
                  data-score={score}
                  style={{ width: `${(score / 5) * 100}%` }}
                />
              </div>
              <p className={styles.meterLabel}>Password strength: {STRENGTH[score]}</p>
              <ul className={styles.rules}>
                {PASSWORD_RULES.map((r) => (
                  <li key={r.id} className={r.test(password) ? styles.ok : styles.todo}>
                    {r.test(password) ? "✓" : "✗"} {r.label}
                  </li>
                ))}
              </ul>
            </>
          )}

          <label className={styles.label} htmlFor="reg-confirm">Confirm password</label>
          <input
            id="reg-confirm"
            data-testid="register-confirm"
            type="password"
            autoComplete="new-password"
            className={styles.input}
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {mismatch && <p className={styles.fieldError}>Passwords don't match.</p>}

          <button
            type="submit"
            data-testid="register-submit"
            className="btn btn-terra btn-block"
            disabled={busy || !ready}
          >
            {busy ? "Creating account…" : "Create free account"}
          </button>
        </form>

        <p className={styles.alt}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
