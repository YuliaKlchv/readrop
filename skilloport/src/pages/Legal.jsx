import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Legal.module.css";

const TABS = [
  { key: "impressum", label: "Impressum" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "terms", label: "Terms" },
  { key: "cancellation", label: "Cancellation" },
  { key: "cookies", label: "Cookie Notice" },
];

const PANELS = {
  impressum: (
    <>
      <h2>Impressum</h2>
      <p>Information pursuant to § 5 ECG (E-Commerce-Gesetz) and § 25 MedienG (Austria).</p>
      <h3>Operator</h3>
      <p>
        Yuliya Kalcheva<br />
        SkillOport (sole proprietorship)<br />
        Vienna, Austria
      </p>
      <h3>Contact</h3>
      <p>
        Email: hello@skilloport.com<br />
        Web: www.skilloport.com
      </p>
      <h3>Business purpose</h3>
      <p>Operation of an online subscription service providing short-form educational video content.</p>
      <h3>VAT</h3>
      <p>Small-business operator. VAT is shown and applied in accordance with Austrian and EU rules at checkout.</p>
      <h3>Online dispute resolution</h3>
      <p>
        The European Commission provides a platform for online dispute resolution (ODR):
        ec.europa.eu/consumers/odr. We are neither obliged nor willing to participate in dispute
        resolution proceedings before a consumer arbitration board.
      </p>
    </>
  ),
  privacy: (
    <>
      <h2>Privacy Policy</h2>
      <p>
        This policy explains how SkillOport handles your personal data under the EU General Data
        Protection Regulation (GDPR) and the Austrian Data Protection Act (DSG).
      </p>
      <h3>Who is responsible</h3>
      <p>
        Yuliya Kalcheva, SkillOport, Vienna, Austria — hello@skilloport.com — is the controller
        for the processing of your personal data.
      </p>
      <h3>What we collect</h3>
      <p>
        <strong>Account &amp; subscription:</strong> your email address, chosen plan, and payment
        status (we never store full card numbers — these are handled by our payment processor).
        <br />
        <strong>Usage:</strong> which videos you open and basic delivery metrics so we know our
        emails arrive.
      </p>
      <h3>Why we process it (legal basis)</h3>
      <p>
        To deliver the service you subscribed to (Art. 6(1)(b) GDPR), to comply with tax and
        accounting law (Art. 6(1)(c)), and — for optional analytics — on the basis of your consent
        (Art. 6(1)(a)), which you may withdraw at any time.
      </p>
      <h3>Processors</h3>
      <p>
        We use carefully selected providers for email delivery, payment processing, and video
        hosting. Data may be processed within the EU/EEA; where transfers occur, Standard
        Contractual Clauses apply.
      </p>
      <h3>Retention</h3>
      <p>
        Account data is kept while your subscription is active and deleted within 90 days of
        closure, except records we must retain for tax law (typically 7 years in Austria).
      </p>
      <h3>Your rights</h3>
      <p>
        You have the right to access, rectification, erasure, restriction, portability, and
        objection. You may lodge a complaint with the Austrian Data Protection Authority
        (Datenschutzbehörde, Vienna).
      </p>
    </>
  ),
  terms: (
    <>
      <h2>Terms of Service</h2>
      <h3>1. Scope</h3>
      <p>
        These terms govern your use of SkillOport, operated by Yuliya Kalcheva, Vienna, Austria. By
        subscribing you accept these terms.
      </p>
      <h3>2. The service</h3>
      <p>
        SkillOport provides short-form instructional videos delivered on a free (one video per
        month) or Pro (weekly) basis. Content is for personal, non-commercial use.
      </p>
      <h3>3. Subscriptions &amp; payment</h3>
      <p>
        Pro is billed monthly (€3.99) or annually (€29) in advance and renews automatically until
        cancelled. Prices include applicable VAT.
      </p>
      <h3>4. Right of withdrawal</h3>
      <p>
        As a consumer you have a 14-day right of withdrawal for digital services. By starting Pro
        immediately you agree that delivery begins before the period ends, and you acknowledge
        that the right of withdrawal lapses once the service has been fully provided. See the
        Cancellation tab.
      </p>
      <h3>5. Intellectual property</h3>
      <p>
        All videos and materials remain the property of SkillOport. You may not redistribute,
        resell, or publicly broadcast the content.
      </p>
      <h3>6. Liability</h3>
      <p>
        The service is provided with care but "as is". We are liable only for intent and gross
        negligence to the extent permitted by Austrian law. Statutory consumer rights are
        unaffected.
      </p>
      <h3>7. Governing law</h3>
      <p>
        Austrian law applies. The mandatory consumer protection of your country of residence
        remains unaffected.
      </p>
    </>
  ),
  cancellation: (
    <>
      <h2>Cancellation &amp; Withdrawal</h2>
      <h3>Cancelling your subscription</h3>
      <p>
        You can cancel Pro at any time from your account or by emailing hello@skilloport.com.
        Cancellation stops the next renewal; you keep access until the end of the period you've
        already paid for. The free plan never charges you and can be left at any time.
      </p>
      <h3>Right of withdrawal (consumers)</h3>
      <p>
        You have the right to withdraw from this contract within 14 days without giving any
        reason. The withdrawal period expires 14 days from the day the contract was concluded.
      </p>
      <p>
        To exercise it, inform us (Yuliya Kalcheva, SkillOport, Vienna — hello@skilloport.com) by a
        clear statement (e.g. an email). You may use the model withdrawal form, but it is not
        obligatory.
      </p>
      <h3>Effects of withdrawal</h3>
      <p>
        If you withdraw in time, we reimburse all payments received without undue delay and within
        14 days. If you requested the service to begin during the withdrawal period, you pay an
        amount proportionate to what was provided until you informed us of the withdrawal.
      </p>
      <h3>Loss of the right of withdrawal</h3>
      <p>
        The right of withdrawal lapses for fully performed digital services where performance began
        with your prior express consent and acknowledgement that you thereby lose the right of
        withdrawal.
      </p>
    </>
  ),
  cookies: (
    <>
      <h2>Cookie Notice</h2>
      <p>
        SkillOport keeps cookies to a minimum. We believe a creative micro-break shouldn't come
        with a tracking circus.
      </p>
      <h3>Strictly necessary</h3>
      <p>
        A small number of cookies are required to keep you signed in and to remember your plan.
        These are set on the legal basis of our legitimate interest in providing the service and
        cannot be switched off.
      </p>
      <h3>Analytics (optional)</h3>
      <p>
        With your consent, we use privacy-friendly, aggregated analytics to understand which drops
        are popular. No cross-site tracking, no advertising profiles, no selling of data — ever.
      </p>
      <h3>Managing cookies</h3>
      <p>
        You can change or withdraw consent at any time via your browser settings or our cookie
        banner. Blocking necessary cookies may break sign-in.
      </p>
      <h3>No third-party advertising</h3>
      <p>
        We do not run ad networks or social tracking pixels. The only emails you get from us are
        your weekly drops.
      </p>
    </>
  ),
};

export default function Legal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("tab");
  const initial = PANELS[requested] ? requested : "impressum";
  const [active, setActive] = useState(initial);

  // Keep the active tab in sync if the URL query changes (e.g. footer links)
  useEffect(() => {
    if (requested && PANELS[requested] && requested !== active) {
      setActive(requested);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requested]);

  const select = (key) => {
    setActive(key);
    setSearchParams({ tab: key });
  };

  return (
    <div className="container section">
      <div className="page-head">
        <span className="eyebrow">The fine print</span>
        <h1>Legal &amp; policies</h1>
        <p className="section-lead">
          Everything required for an EU digital subscription, in plain-ish language.
        </p>
      </div>

      <div className={styles.layout}>
        <nav className={styles.tabs} aria-label="Legal sections">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`${styles.tab} ${active === t.key ? styles.active : ""}`}
              onClick={() => select(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className={styles.content}>
          <article key={active} className={styles.panel}>
            {PANELS[active]}
          </article>
        </div>
      </div>
    </div>
  );
}
