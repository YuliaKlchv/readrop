import { createContext, useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import { isValidEmail, suggestEmail } from "../lib/validation.js";
import styles from "./SignupModal.module.css";

const Ctx = createContext(null);
export const useSignupModal = () => useContext(Ctx);

/*
 * "Start free" gate. Free signup isn't a free pass — we ask for at least an
 * email (strictly validated) before sending the user on to the thank-you page.
 */
export function SignupModalProvider({ children }) {
  const dialogRef = useRef(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const open = () => {
    setEmail("");
    setSubmitError("");
    setBusy(false);
    dialogRef.current?.showModal();
  };
  const close = () => {
    setSubmitError("");
    setBusy(false);
    dialogRef.current?.close();
  };

  const valid = isValidEmail(email);
  const suggestion = suggestEmail(email);
  const invalidEmail = email.length > 0 && !valid;
  const error = submitError || (invalidEmail ? "Please enter a valid email address" : "");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!valid || busy) return;
    setSubmitError("");
    setBusy(true);

    try {
      const res = await api("subscribe", { email: email.trim() });
      if (res.status !== 200) {
        setSubmitError(res.data?.error || "Could not save your email. Please try again.");
        setBusy(false);
        return;
      }
    } catch {
      setSubmitError("Couldn't reach the server. Please try again.");
      setBusy(false);
      return;
    }

    close();
    navigate("/thank-you");
  };

  const value = useMemo(() => ({ open }), []);

  return (
    <Ctx.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        className={styles.modal}
        aria-labelledby="signup-modal-title"
        onClick={(e) => { if (e.target === dialogRef.current) close(); }}
      >
        <button type="button" className={styles.close} aria-label="Close" onClick={close}>
          ×
        </button>
        <h2 id="signup-modal-title" className={styles.title}>Get your first skill video free</h2>
        <form onSubmit={onSubmit} noValidate>
          <input
            className={styles.input}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-label="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (submitError) setSubmitError("");
            }}
          />
          {error && <p className={styles.error}>{error}</p>}
          {!error && suggestion && (
            <p className={styles.suggest}>
              Did you mean{" "}
              <button type="button" className={styles.suggestFix} onClick={() => setEmail(suggestion)}>
                {suggestion}
              </button>?
            </p>
          )}
          <button type="submit" className="btn btn-terra btn-block" disabled={!valid || busy}>
            {busy ? "Saving…" : "Get started free →"}
          </button>
        </form>
        <p className={styles.note}>No credit card. Cancel anytime.</p>
      </dialog>
    </Ctx.Provider>
  );
}
