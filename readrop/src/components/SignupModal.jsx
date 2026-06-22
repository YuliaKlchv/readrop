import { createContext, useContext, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail, suggestEmail } from "../lib/validation.js";
import styles from "./SignupModal.module.css";

const Ctx = createContext(null);
export const useSignupModal = () => useContext(Ctx);

export function SignupModalProvider({ children }) {
  const dialogRef = useRef(null);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const open = () => {
    setEmail("");
    dialogRef.current?.showModal();
  };
  const close = () => {
    dialogRef.current?.close();
  };

  const valid = isValidEmail(email);
  const suggestion = suggestEmail(email);
  const invalidEmail = email.length > 0 && !valid;
  const error = invalidEmail ? "Please enter a valid email address" : "";

  const onSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    close();
    navigate(`/register?email=${encodeURIComponent(email.trim())}`);
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
        <h2 id="signup-modal-title" className={styles.title}>Join Readrop for free</h2>
        <p className={styles.subtitle}>Start sharing books with readers in your city.</p>
        <form onSubmit={onSubmit} noValidate>
          <input
            className={styles.input}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className="btn btn-terra btn-block" disabled={!valid}>
            Create free account →
          </button>
        </form>
        <p className={styles.note}>Always free · No shipping · Local pickups</p>
      </dialog>
    </Ctx.Provider>
  );
}
