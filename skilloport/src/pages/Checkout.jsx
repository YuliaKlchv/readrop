import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { isValidEmail } from "../lib/validation.js";
import styles from "./Auth.module.css";

const digits = (s) => (s || "").replace(/\D/g, "");

function luhnValid(num) {
  if (num.length < 13 || num.length > 19) return false;
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = parseInt(num[i], 10);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return sum % 10 === 0;
}

function expiryValid(v) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return false;
  const mm = parseInt(m[1], 10), yy = parseInt(m[2], 10);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const curYY = now.getFullYear() % 100, curMM = now.getMonth() + 1;
  return yy > curYY || (yy === curYY && mm >= curMM);
}

const cvcValid = (v) => /^\d{3,4}$/.test(v);

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");

  const cardDigits = digits(card);
  const emailOk = isValidEmail(email);
  const cardOk = luhnValid(cardDigits);
  const expOk = expiryValid(exp);
  const cvcOk = cvcValid(cvc);
  const ready = useMemo(
    () => emailOk && name.trim() && cardOk && expOk && cvcOk,
    [emailOk, name, cardOk, expOk, cvcOk]
  );

  const onCard = (e) => setCard(digits(e.target.value).slice(0, 19).replace(/(.{4})/g, "$1 ").trim());
  const onExp = (e) => {
    const d = digits(e.target.value).slice(0, 4);
    setExp(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
  };
  const onCvc = (e) => setCvc(digits(e.target.value).slice(0, 4));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!ready) return;
    navigate("/thank-you");
  };

  return (
    <div className={`container section ${styles.wrap}`}>
      <div className={styles.card}>
        <span className="eyebrow">Almost yours</span>
        <h1 className={styles.title}>Go Pro</h1>
        <p className={styles.lead}>Weekly drops, full archive and themed series — cancel anytime.</p>

        <div className={styles.orderSummary}>
          <div className={styles.orderRow}>
            <span>SkillOport Pro</span>
            <strong>€3.99<span>/month</span></strong>
          </div>
          <p className={styles.orderNote}>
            Billed monthly · Includes applicable VAT · Cancel before any renewal.
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <label className={styles.label} htmlFor="co-email">Email</label>
          <input
            id="co-email" type="email" autoComplete="email" className={styles.input}
            placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {email && !emailOk && (
            <p className={styles.fieldError}>Please enter a valid email address</p>
          )}

          <label className={styles.label} htmlFor="co-name">Name on card</label>
          <input
            id="co-name" type="text" autoComplete="cc-name" className={styles.input}
            placeholder="Ada Lovelace" value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className={styles.label} htmlFor="co-card">Card number</label>
          <input
            id="co-card" type="text" inputMode="numeric" autoComplete="cc-number"
            className={styles.input} placeholder="1234 5678 9012 3456" maxLength={23}
            value={card} onChange={onCard}
          />
          {cardDigits.length > 0 && !cardOk && (
            <p className={styles.fieldError}>Enter a valid card number</p>
          )}

          <div className={styles.row}>
            <div>
              <label className={styles.label} htmlFor="co-exp">Expiry</label>
              <input
                id="co-exp" type="text" inputMode="numeric" autoComplete="cc-exp"
                className={styles.input} placeholder="MM/YY" maxLength={5}
                value={exp} onChange={onExp}
              />
            </div>
            <div>
              <label className={styles.label} htmlFor="co-cvc">CVC</label>
              <input
                id="co-cvc" type="text" inputMode="numeric" autoComplete="cc-csc"
                className={styles.input} placeholder="123" maxLength={4}
                value={cvc} onChange={onCvc}
              />
            </div>
          </div>
          {((exp && !expOk) || (cvc && !cvcOk)) && (
            <p className={styles.fieldError}>Check the expiry date and CVC</p>
          )}

          <button type="submit" className="btn btn-terra btn-block" disabled={!ready}>
            Pay €3.99/month →
          </button>
        </form>

        <p className={styles.demo}>🔒 Demo checkout — no real card is charged.</p>
        <p className={styles.alt}><Link to="/pricing">← Back to plans</Link></p>
      </div>
    </div>
  );
}
