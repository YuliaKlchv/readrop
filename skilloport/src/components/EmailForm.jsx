import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { isValidEmail, suggestEmail } from "../lib/validation.js";
import styles from "./EmailForm.module.css";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const valid = isValidEmail(email);
  const suggestion = suggestEmail(email);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!valid || busy) {
      if (!valid) setError("Please enter a valid email address");
      return;
    }

    setError("");
    setBusy(true);

    try {
      const res = await api("subscribe", { email: email.trim() });
      if (res.status !== 200) {
        setError(res.data?.error || "Could not save your email. Please try again.");
        setBusy(false);
        return;
      }
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setBusy(false);
      return;
    }

    setEmail("");
    setBusy(false);
    navigate("/thank-you");
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="capture-email">
        Email address
      </label>
      <input
        id="capture-email"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError("");
        }}
        required
      />
      <button type="submit" className="btn btn-ink" disabled={!valid || busy}>
        {busy ? "Saving…" : "Get my first drop"}
      </button>
      {error ? <p className={styles.error}>{error}</p> : null}
      {!error && suggestion ? (
        <p className={styles.suggest}>
          Did you mean{" "}
          <button type="button" className={styles.suggestFix} onClick={() => setEmail(suggestion)}>
            {suggestion}
          </button>?
        </p>
      ) : null}
    </form>
  );
}
