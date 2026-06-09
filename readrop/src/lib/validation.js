/*
 * Client-side validation — a UX convenience and first line of defence.
 * The authoritative checks still run in the backend API; keep the two in sync.
 */

// Strict: text before @, a domain, a ≥2-char extension, no spaces.
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email) {
  return EMAIL_RE.test((email || "").trim());
}

export function validateEmail(email) {
  const value = (email || "").trim();
  if (!value) return "Email is required.";
  if (!EMAIL_RE.test(value)) return "Please enter a valid email address.";
  if (value.length > 254) return "That email is too long.";
  return null;
}

// Each rule is shown live as the user types. Mirrors the server.
export const PASSWORD_RULES = [
  { id: "len", label: "Minimum 12 characters", test: (p) => p.length >= 12 },
  { id: "upper", label: "At least 1 uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "At least 1 lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "num", label: "At least 1 number", test: (p) => /[0-9]/.test(p) },
  { id: "sym", label: "At least 1 special character (!@#$%^&*)", test: (p) => /[!@#$%^&*]/.test(p) },
];

export function passwordScore(password) {
  return PASSWORD_RULES.reduce((n, r) => n + (r.test(password) ? 1 : 0), 0);
}

export function passwordAllMet(password) {
  return passwordScore(password) === PASSWORD_RULES.length;
}

export function validatePassword(password) {
  if (!password) return "Password is required.";
  const failing = PASSWORD_RULES.filter((r) => !r.test(password));
  if (failing.length) return "Your password doesn't meet all the requirements yet.";
  return null;
}

/* ---------- "Did you mean …?" typo guard ----------
   .co / .io / .at are valid TLDs, so a regex can't tell "gmail.co" from
   "gmail.com". This suggests the likely-intended address. */
const COMMON_DOMAINS = [
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "hotmail.com",
  "hotmail.co.uk", "outlook.com", "live.com", "msn.com", "icloud.com",
  "me.com", "aol.com", "proton.me", "protonmail.com", "gmx.com", "gmx.de",
  "web.de", "mail.com", "yandex.com", "zoho.com",
];

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let cur = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}

export function suggestEmail(value) {
  const email = (value || "").trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (!domain || !domain.includes(".") || COMMON_DOMAINS.includes(domain)) return null;
  let best = null, bestDist = 99;
  for (const d of COMMON_DOMAINS) {
    const dist = levenshtein(domain, d);
    if (dist < bestDist) { bestDist = dist; best = d; }
  }
  return best && bestDist > 0 && bestDist <= 2 ? `${local}@${best}` : null;
}
