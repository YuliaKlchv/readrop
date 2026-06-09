import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Legal.module.css";

const TABS = [
  { key: "impressum",   label: "Impressum" },
  { key: "privacy",     label: "Privacy Policy" },
  { key: "terms",       label: "Terms" },
  { key: "cancellation",label: "Account & Data" },
  { key: "cookies",     label: "Cookie Notice" },
];

const PANELS = {
  impressum: (
    <>
      <h2>Impressum</h2>
      <p>Information pursuant to § 5 ECG (E-Commerce-Gesetz) and § 25 MedienG (Austria).</p>
      <h3>Operator</h3>
      <p>
        Yuliya Kalcheva<br />
        Readrop (sole proprietorship)<br />
        Vienna, Austria
      </p>
      <h3>Contact</h3>
      <p>
        Email: hello@readrop.app<br />
        Web: readrop.app
      </p>
      <h3>Business purpose</h3>
      <p>
        Operation of an online platform enabling users to give away, exchange, and discover
        second-hand books, and to participate in genre-based reading communities.
      </p>
      <h3>VAT</h3>
      <p>Small-business operator. VAT rules are applied in accordance with Austrian and EU law.</p>
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
        This policy explains how Readrop handles your personal data under the EU General Data
        Protection Regulation (GDPR) and the Austrian Data Protection Act (DSG).
      </p>
      <h3>Who is responsible</h3>
      <p>
        Yuliya Kalcheva, Readrop, Vienna, Austria — hello@readrop.app — is the controller
        for the processing of your personal data.
      </p>
      <h3>What we collect</h3>
      <p>
        <strong>Account data:</strong> your name, email address, and city when you register.
        <br />
        <strong>Book listings:</strong> the title, author, condition, city, and description you
        enter when listing a book. These are publicly visible on the platform.
        <br />
        <strong>Messages:</strong> the content of direct messages you exchange with other users
        for arranging book pickups or exchanges.
        <br />
        <strong>Usage data:</strong> basic access logs and session information needed to keep
        you signed in.
      </p>
      <h3>Why we process it (legal basis)</h3>
      <p>
        To provide the service you registered for (Art. 6(1)(b) GDPR), to comply with legal
        obligations (Art. 6(1)(c)), and — for optional analytics — on the basis of your consent
        (Art. 6(1)(a)), which you may withdraw at any time.
      </p>
      <h3>Processors</h3>
      <p>
        We use carefully selected providers for email delivery and hosting. Data is processed
        within the EU/EEA; where any transfer occurs, Standard Contractual Clauses apply.
      </p>
      <h3>Retention</h3>
      <p>
        Account data is kept while your account is active and deleted within 90 days of account
        closure. Book listings are removed immediately on deletion. Message history is deleted
        within 30 days of account closure.
      </p>
      <h3>Your rights</h3>
      <p>
        You have the right to access, rectification, erasure, restriction, portability, and
        objection. To exercise any right, email hello@readrop.app. You may also lodge a complaint
        with the Austrian Data Protection Authority (Datenschutzbehörde, Vienna).
      </p>
    </>
  ),
  terms: (
    <>
      <h2>Terms of Service</h2>
      <h3>1. Scope</h3>
      <p>
        These terms govern your use of Readrop, operated by Yuliya Kalcheva, Vienna, Austria.
        By creating an account you accept these terms.
      </p>
      <h3>2. The service</h3>
      <p>
        Readrop is a free platform where registered members can list physical books for free
        give-away or exchange, browse available books, arrange local pickups with other users,
        and participate in genre-based reading community clubs.
      </p>
      <h3>3. Free use</h3>
      <p>
        Basic use of Readrop — listing books, browsing, claiming books, and joining clubs — is
        free of charge. We may introduce optional paid features in the future; these will always
        be clearly labelled and never required to access the core functionality.
      </p>
      <h3>4. User responsibilities</h3>
      <p>
        You agree to list only books you own and are legally entitled to give away or exchange.
        You are responsible for arranging safe pickup logistics with other users. Readrop is a
        matchmaking platform; we are not a party to any book transaction between users.
      </p>
      <h3>5. Prohibited content</h3>
      <p>
        You may not use Readrop to share or distribute copyrighted digital content without
        authorisation, post false or misleading listings, harass other users, or use the platform
        for any purpose other than book sharing and community discussion.
      </p>
      <h3>6. Intellectual property</h3>
      <p>
        Platform design, code, and branding are the property of Readrop. User-submitted content
        (listings, messages, discussion posts) remains yours; you grant Readrop a licence to
        display it on the platform.
      </p>
      <h3>7. Liability</h3>
      <p>
        Readrop facilitates connections between users but does not guarantee any transaction.
        We are not responsible for the condition of exchanged books or the conduct of users
        during meetups. We are liable only for intent and gross negligence to the extent
        permitted by Austrian law.
      </p>
      <h3>8. Governing law</h3>
      <p>
        Austrian law applies. The mandatory consumer protection of your country of residence
        remains unaffected.
      </p>
    </>
  ),
  cancellation: (
    <>
      <h2>Account &amp; Data Deletion</h2>
      <h3>Closing your account</h3>
      <p>
        You can delete your account at any time from your account settings or by emailing
        hello@readrop.app. Deleting your account removes your profile, all book listings, and
        your community posts within 90 days.
      </p>
      <h3>What happens to your listings</h3>
      <p>
        Active book listings are removed immediately when you delete your account. If a book
        claim is in progress, the other user is notified that the listing is no longer available.
      </p>
      <h3>What happens to your messages</h3>
      <p>
        Direct messages you sent to other users are deleted from our servers within 30 days of
        account closure. Copies may remain on the recipient's device until they also delete
        their account.
      </p>
      <h3>Right to erasure (GDPR Art. 17)</h3>
      <p>
        You have the right to request deletion of your personal data. To exercise it, email
        hello@readrop.app with the subject "Data deletion request". We will confirm and complete
        the request within 30 days.
      </p>
      <h3>No paid subscription</h3>
      <p>
        Readrop is currently free. There are no recurring charges to cancel. If paid features
        are introduced in the future, this section will be updated with full cancellation and
        refund terms.
      </p>
    </>
  ),
  cookies: (
    <>
      <h2>Cookie Notice</h2>
      <p>
        Readrop keeps cookies to a minimum. We believe finding your next book shouldn't come
        with a tracking circus.
      </p>
      <h3>Strictly necessary</h3>
      <p>
        A small number of cookies are required to keep you signed in and to remember your
        language preference. These are set on the legal basis of our legitimate interest in
        providing the service and cannot be switched off.
      </p>
      <h3>Analytics (optional)</h3>
      <p>
        With your consent, we use privacy-friendly, aggregated analytics to understand how
        readers use the platform — for example, which genres are popular. No cross-site tracking,
        no advertising profiles, no selling of data — ever.
      </p>
      <h3>Managing cookies</h3>
      <p>
        You can change or withdraw consent at any time via your browser settings. Blocking
        strictly necessary cookies may prevent you from staying signed in.
      </p>
      <h3>No third-party advertising</h3>
      <p>
        We do not run ad networks or social tracking pixels. Any affiliate links (e.g. to
        bookshops) are clearly labelled.
      </p>
    </>
  ),
};

export default function Legal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("tab");
  const initial = PANELS[requested] ? requested : "impressum";
  const [active, setActive] = useState(initial);

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
          Everything required for an EU platform, in plain-ish language.
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
