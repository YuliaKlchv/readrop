import { DEMO_ACCOUNT } from "./demoUser.js";

/*
 * Frontend client for the SkillOport backend API.
 * If the app is deployed without a reachable /api backend, we fall back to a
 * local demo mode so the UI can still be explored end-to-end.
 */
const STORAGE_KEYS = {
  leads: "skilloport.demo.leads",
  session: "skilloport.demo.session",
  users: "skilloport.demo.users",
};

const DEMO_SOURCE = "demo";
const BACKEND_SOURCE = "backend";

const DEMO_USER = Object.freeze({
  name: DEMO_ACCOUNT.name,
  email: DEMO_ACCOUNT.email.toLowerCase(),
  password: DEMO_ACCOUNT.password,
  plan: DEMO_ACCOUNT.plan,
});

function hasStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function readJson(key, fallback) {
  if (!hasStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (!hasStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key) {
  if (!hasStorage()) return;
  window.localStorage.removeItem(key);
}

function nowIso() {
  return new Date().toISOString();
}

function publicUser(user) {
  return { name: user.name, email: user.email, plan: user.plan };
}

function ensureDemoUsers() {
  const users = readJson(STORAGE_KEYS.users, []);
  const hasSeed = users.some((user) => normalizeEmail(user.email) === DEMO_USER.email);
  if (hasSeed) return users;

  const seededUsers = [
    {
      ...DEMO_USER,
      created_at: nowIso(),
    },
    ...users,
  ];
  writeJson(STORAGE_KEYS.users, seededUsers);
  return seededUsers;
}

function getDemoUsers() {
  return ensureDemoUsers();
}

function setDemoUsers(users) {
  writeJson(STORAGE_KEYS.users, users);
}

function getDemoLeads() {
  return readJson(STORAGE_KEYS.leads, []);
}

function setDemoLeads(leads) {
  writeJson(STORAGE_KEYS.leads, leads);
}

function getSessionEmail() {
  return readJson(STORAGE_KEYS.session, null)?.email || null;
}

function setSessionEmail(email) {
  writeJson(STORAGE_KEYS.session, { email: normalizeEmail(email) });
}

function currentDemoUser() {
  const sessionEmail = getSessionEmail();
  if (!sessionEmail) return null;
  return getDemoUsers().find((user) => normalizeEmail(user.email) === sessionEmail) || null;
}

function markLeadConverted(email) {
  const cleanEmail = normalizeEmail(email);
  const leads = getDemoLeads().map((lead) =>
    normalizeEmail(lead.email) === cleanEmail
      ? { ...lead, converted_at: lead.converted_at || nowIso() }
      : lead
  );
  setDemoLeads(leads);
}

function buildDemoSubscribers() {
  const users = getDemoUsers().map((user) => ({
    email: user.email,
    plan: user.plan,
    created_at: user.created_at,
    kind: "user",
    status: "Active",
    dot: "green",
  }));

  const userEmails = new Set(users.map((user) => normalizeEmail(user.email)));
  const leads = getDemoLeads()
    .filter((lead) => !lead.converted_at && !userEmails.has(normalizeEmail(lead.email)))
    .map((lead) => ({
      email: lead.email,
      plan: "lead",
      created_at: lead.created_at,
      kind: "lead",
      status: "Lead",
      dot: "amber",
    }));

  return [...users, ...leads].sort((a, b) => {
    const timeA = Date.parse(a.created_at || "") || 0;
    const timeB = Date.parse(b.created_at || "") || 0;
    if (timeA !== timeB) return timeB - timeA;
    return String(b.email).localeCompare(String(a.email));
  });
}

function demoResponse(status, data) {
  return { ok: status >= 200 && status < 300, status, data, source: DEMO_SOURCE };
}

function demoApi(route, body) {
  const payload = body || {};

  switch (route) {
    case "me": {
      const user = currentDemoUser();
      return user
        ? demoResponse(200, { user: publicUser(user) })
        : demoResponse(401, { error: "Not authenticated" });
    }

    case "login": {
      const email = normalizeEmail(payload.email);
      const password = String(payload.password || "");
      const user = getDemoUsers().find((entry) => normalizeEmail(entry.email) === email);

      if (!user || user.password !== password) {
        return demoResponse(401, { error: "Invalid email or password" });
      }

      setSessionEmail(user.email);
      return demoResponse(200, { user: publicUser(user) });
    }

    case "signup": {
      const email = normalizeEmail(payload.email);
      const users = getDemoUsers();
      const exists = users.some((user) => normalizeEmail(user.email) === email);
      if (exists) {
        return demoResponse(409, { error: "An account with this email already exists." });
      }

      const user = {
        name: String(payload.name || "").trim(),
        email,
        password: String(payload.password || ""),
        plan: payload.plan === "pro" ? "pro" : "free",
        created_at: nowIso(),
      };

      setDemoUsers([user, ...users]);
      markLeadConverted(email);
      setSessionEmail(user.email);
      return demoResponse(201, { user: publicUser(user) });
    }

    case "subscribe": {
      const email = normalizeEmail(payload.email);
      if (!email) return demoResponse(400, { error: "Please enter a valid email address." });

      const hasUser = getDemoUsers().some((user) => normalizeEmail(user.email) === email);
      if (hasUser) return demoResponse(200, { ok: true });

      const leads = getDemoLeads();
      const exists = leads.some((lead) => normalizeEmail(lead.email) === email);
      if (!exists) {
        setDemoLeads([
          { email, created_at: nowIso(), converted_at: null },
          ...leads,
        ]);
      }
      return demoResponse(200, { ok: true });
    }

    case "logout":
      removeItem(STORAGE_KEYS.session);
      return demoResponse(200, { ok: true });

    case "forgot-password":
      return demoResponse(200, { ok: true });

    case "subscribers": {
      if (!currentDemoUser()) {
        return demoResponse(401, { error: "Not authenticated" });
      }
      const subscribers = buildDemoSubscribers();
      return demoResponse(200, { count: subscribers.length, subscribers });
    }

    default:
      return demoResponse(404, { error: "Not found" });
  }
}

function shouldUseDemoFallback(res) {
  const contentType = res.headers.get("content-type") || "";
  return res.status === 404 || res.status === 405 || !contentType.includes("application/json");
}

export async function api(route, body) {
  try {
    const res = await fetch("/api/" + route, {
      method: body ? "POST" : "GET",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
    });

    if (shouldUseDemoFallback(res)) {
      return demoApi(route, body);
    }

    let data = {};
    try { data = await res.json(); } catch { /* empty body */ }
    return { ok: res.ok, status: res.status, data, source: BACKEND_SOURCE };
  } catch (error) {
    return { ...demoApi(route, body), error };
  }
}
