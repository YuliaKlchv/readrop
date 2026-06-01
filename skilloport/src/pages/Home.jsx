import { Link } from "react-router-dom";
import EmailForm from "../components/EmailForm.jsx";
import { useSignupModal } from "../components/SignupModal.jsx";
import styles from "./Home.module.css";

export default function Home() {
  const { open } = useSignupModal();
  return (
    <>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <span className="eyebrow">✨ For curious people everywhere</span>
            <h1 className={styles.h1}>
              A tiny skill.
              <br />
              <span className="text-terra">Every week.</span>
            </h1>
            <p className={styles.sub}>
              One short video. One small creative skill you didn't have on Monday and do by
              Sunday. No feeds, no doomscroll — just your weekly creative micro-break.
            </p>
            <div className={styles.ctas}>
              <button type="button" className="btn btn-terra" onClick={open}>Start free</button>
              <Link to="/gallery" className="btn btn-ghost">Browse the drops</Link>
            </div>
            <p className={styles.note}>Free forever plan · No card needed · Cancel any time</p>
          </div>

          {/* CSS-only player mockup */}
          <div className={styles.player} aria-hidden="true">
            <div className={styles.frame}>
              <div className={styles.thumb}>
                <span className={styles.thumbEmoji}>🦢</span>
                <button className={styles.playBtn} aria-label="Play preview">
                  <span className={styles.tri} />
                </button>
                <span className={styles.badge}>This week's drop</span>
              </div>
              <div className={styles.bar}>
                <div className={styles.progress}><span /></div>
                <div className={styles.meta}>
                  <span className={styles.title}>Paper Crane Origami</span>
                  <span className={styles.time}>6:04</span>
                </div>
              </div>
            </div>
            <div className={styles.glow} />
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="container section">
        <div className="section-head">
          <h2>Small skills, seriously made</h2>
          <p className="section-lead">
            Every drop is hand-picked, tightly edited, and built to finish in one sitting.
          </p>
        </div>
        <div className={styles.featureGrid}>
          <article className={styles.feature}>
            <span className={`${styles.icon} ${styles.iconTerra}`}>🎯</span>
            <h3>Curated</h3>
            <p>No infinite library to drown in. One drop a week, chosen so it's actually worth your coffee break.</p>
          </article>
          <article className={styles.feature}>
            <span className={`${styles.icon} ${styles.iconGold}`}>⏱️</span>
            <h3>Short-form</h3>
            <p>Every video runs 3–8 minutes. Long enough to learn the thing, short enough to never feel like homework.</p>
          </article>
          <article className={styles.feature}>
            <span className={`${styles.icon} ${styles.iconForest}`}>🎨</span>
            <h3>Creative</h3>
            <p>Origami, pixel art, calligraphy, secret skills. You make something real with your hands and your head.</p>
          </article>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className={styles.howSection}>
        <div className="container section">
          <div className="section-head">
            <h2>How it works</h2>
            <p className="section-lead">
              Three steps. Then a new little skill lands in your inbox every Sunday.
            </p>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>1</span>
              <h3>Subscribe</h3>
              <p>Drop your email. Start on the free plan or go Pro — either way you're in within seconds.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>2</span>
              <h3>Get your drop</h3>
              <p>Every Sunday a new 3–8 minute video arrives. Watch it with a coffee, no app-switching required.</p>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>3</span>
              <h3>Make something</h3>
              <p>Follow along, pause when you need to, and finish the week knowing one new tiny thing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* EMAIL CAPTURE CTA */}
      <div className={styles.ctaBand}>
        <div className={`container ${styles.ctaInner}`}>
          <div>
            <h2 className={styles.ctaTitle}>Your first drop is on the house.</h2>
            <p className={styles.ctaText}>
              Join thousands trading five minutes of scrolling for five minutes of making.
            </p>
          </div>
          <EmailForm />
        </div>
      </div>
    </>
  );
}
