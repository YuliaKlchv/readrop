import { Link } from "react-router-dom";
import { useSignupModal } from "../components/SignupModal.jsx";
import styles from "./Pricing.module.css";

export default function Pricing() {
  const { open } = useSignupModal();
  return (
    <div className="container section">
      <div className="page-head">
        <span className="eyebrow">Simple pricing</span>
        <h1>One coffee a month.</h1>
        <p className="section-lead">
          Start free forever. Upgrade when you want the weekly habit and the full archive.
        </p>
      </div>

      <div className={styles.grid}>
        {/* FREE */}
        <article className={styles.card}>
          <div className={styles.head}>
            <h3>Free</h3>
            <p className={styles.tag}>€0<span>/forever</span></p>
            <p className={styles.blurb}>A taste of the habit. No card, no catch.</p>
          </div>
          <ul className={styles.list}>
            <li className={styles.yes}>1 video per month</li>
            <li className={styles.yes}>Access to all free drops</li>
            <li className={styles.yes}>Sunday email reminder</li>
            <li className={styles.no}>Weekly video drops</li>
            <li className={styles.no}>Full archive access</li>
            <li className={styles.no}>Seasonal themed series</li>
          </ul>
          <button type="button" className="btn btn-ghost btn-block" onClick={open}>Start free</button>
        </article>

        {/* PRO */}
        <article className={`${styles.card} ${styles.pro}`}>
          <span className={styles.flag}>Most popular</span>
          <div className={styles.head}>
            <h3>Pro</h3>
            <p className={styles.tag}>€3.99<span>/month</span></p>
            <p className={styles.blurb}>
              The full weekly habit, or <strong>€29/year</strong> (save 39%).
            </p>
          </div>
          <ul className={styles.list}>
            <li className={styles.yes}>Weekly video drops</li>
            <li className={styles.yes}>Full archive access</li>
            <li className={styles.yes}>Seasonal themed series</li>
            <li className={styles.yes}>Downloadable practice sheets</li>
            <li className={styles.yes}>Early access to new categories</li>
            <li className={styles.yes}>Cancel any time</li>
          </ul>
          <Link to="/checkout" className="btn btn-terra btn-block">Go Pro — €3.99/mo</Link>
        </article>
      </div>

      <p className={styles.foot}>
        Prices include applicable VAT. Billed via our payment partner. You can cancel before any
        renewal — see the{" "}
        <Link to="/legal?tab=cancellation">cancellation policy</Link>.
      </p>
    </div>
  );
}
