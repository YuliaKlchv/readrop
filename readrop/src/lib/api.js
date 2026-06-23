import { DEMO_ACCOUNT, DEMO_ACCOUNT_2 } from "./demoUser.js";

/*
 * Frontend client for the Readrop backend API.
 * Falls back to local demo mode if the /api backend is not reachable.
 */
const STORAGE_KEYS = {
  session: "readrop.demo.session",
  users: "readrop.demo.users",
  books: "readrop.demo.books",
  messages: "readrop.demo.messages",
};

const DEMO_SOURCE = "demo";
const BACKEND_SOURCE = "backend";

const DEMO_USER = Object.freeze({
  name: DEMO_ACCOUNT.name,
  email: DEMO_ACCOUNT.email.toLowerCase(),
  password: DEMO_ACCOUNT.password,
  plan: DEMO_ACCOUNT.plan,
  city: DEMO_ACCOUNT.city,
  avatar: DEMO_ACCOUNT.avatar,
});

const DEMO_USER_2 = Object.freeze({
  name: DEMO_ACCOUNT_2.name,
  email: DEMO_ACCOUNT_2.email.toLowerCase(),
  password: DEMO_ACCOUNT_2.password,
  plan: DEMO_ACCOUNT_2.plan,
  city: DEMO_ACCOUNT_2.city,
  avatar: DEMO_ACCOUNT_2.avatar,
});

const DEMO_BOOKS_SEED = [
  { id: 1, title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", genre: "Sci-Fi", condition: "GOOD", city: "Berlin", ownerId: DEMO_USER.email, status: "AVAILABLE", emoji: "🚀" },
  { id: 2, title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-Fiction", condition: "GREAT", city: "Berlin", ownerId: DEMO_USER.email, status: "AVAILABLE", emoji: "📖" },
  { id: 3, title: "1984", author: "George Orwell", genre: "Dystopia", condition: "WORN", city: "Hamburg", ownerId: DEMO_USER.email, status: "AVAILABLE", emoji: "🌑" },
  { id: 4, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", condition: "GOOD", city: "Munich", ownerId: DEMO_USER.email, status: "AVAILABLE", emoji: "🏜️" },
];

function hasStorage() {
  return globalThis.localStorage !== undefined;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function readJson(key, fallback) {
  if (!hasStorage()) return fallback;
  try {
    const raw = globalThis.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (!hasStorage()) return;
  globalThis.localStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key) {
  if (!hasStorage()) return;
  globalThis.localStorage.removeItem(key);
}

function nowIso() {
  return new Date().toISOString();
}

function publicUser(user) {
  return { name: user.name, email: user.email, plan: user.plan, city: user.city, avatar: user.avatar || "👤" };
}

function ensureDemoUsers() {
  let users = readJson(STORAGE_KEYS.users, []);
  let changed = false;
  if (!users.some((u) => normalizeEmail(u.email) === DEMO_USER.email)) {
    users = [{ ...DEMO_USER, created_at: nowIso() }, ...users];
    changed = true;
  }
  if (!users.some((u) => normalizeEmail(u.email) === DEMO_USER_2.email)) {
    users = [...users, { ...DEMO_USER_2, created_at: nowIso() }];
    changed = true;
  }
  if (changed) writeJson(STORAGE_KEYS.users, users);
  return users;
}

function getDemoUsers() { return ensureDemoUsers(); }
function setDemoUsers(users) { writeJson(STORAGE_KEYS.users, users); }

function ensureDemoBooks() {
  const stored = readJson(STORAGE_KEYS.books, null);
  if (stored !== null) return stored;
  const seeded = DEMO_BOOKS_SEED.map((b) => ({ ...b, createdAt: nowIso() }));
  writeJson(STORAGE_KEYS.books, seeded);
  return seeded;
}

function getDemoBooks() { return ensureDemoBooks(); }
function setDemoBooks(books) { writeJson(STORAGE_KEYS.books, books); }

function makeDemoMessagesSeed() {
  return [
    {
      id: "conv_demo_sophie",
      participants: [DEMO_USER.email, DEMO_USER_2.email],
      book: "Fahrenheit 451",
      exchange: false,
      messages: [
        { id: 1, from: DEMO_USER_2.email, text: "Hi! I just claimed your Fahrenheit 451 listing 📚", time: "10:30", displayTime: "3 days ago" },
        { id: 2, from: DEMO_USER.email,   text: "Great! I can meet near Alexanderplatz on Friday.", time: "10:45", displayTime: "3 days ago" },
        { id: 3, from: DEMO_USER_2.email, text: "Perfect, see you then! Thank you so much 🙏", time: "11:00", displayTime: "3 days ago" },
      ],
      lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function ensureDemoMessages() {
  const stored = readJson(STORAGE_KEYS.messages, null);
  if (stored !== null) return stored;
  const seeded = makeDemoMessagesSeed();
  writeJson(STORAGE_KEYS.messages, seeded);
  return seeded;
}

function writeDemoMessages(conversations) {
  writeJson(STORAGE_KEYS.messages, conversations);
}

function getSessionEmail() {
  return readJson(STORAGE_KEYS.session, null)?.email ?? null;
}

function setSessionEmail(email) {
  writeJson(STORAGE_KEYS.session, { email: normalizeEmail(email) });
}

function currentDemoUser() {
  const email = getSessionEmail();
  return email
    ? (getDemoUsers().find((u) => normalizeEmail(u.email) === email) ?? null)
    : null;
}

function demoResponse(status, data) {
  return { ok: status >= 200 && status < 300, status, data, source: DEMO_SOURCE };
}

let demoBookIdCounter = 100;

// ---- Demo route handlers ----

function handleMe() {
  const user = currentDemoUser();
  return user
    ? demoResponse(200, { user: publicUser(user) })
    : demoResponse(401, { error: "Not authenticated" });
}

function handleLogin(payload) {
  const email = normalizeEmail(payload.email);
  const user = getDemoUsers().find((u) => normalizeEmail(u.email) === email);
  if (user?.password !== String(payload?.password ?? "")) {
    return demoResponse(401, { error: "Invalid email or password" });
  }
  setSessionEmail(user.email);
  return demoResponse(200, { user: publicUser(user) });
}

function handleSignup(payload) {
  const email = normalizeEmail(payload.email);
  const users = getDemoUsers();
  if (users.some((u) => normalizeEmail(u.email) === email)) {
    return demoResponse(409, { error: "An account with this email already exists." });
  }
  const user = {
    name: String(payload.name || "").trim(),
    email,
    password: String(payload.password || ""),
    plan: "member",
    city: String(payload.city || ""),
    created_at: nowIso(),
  };
  setDemoUsers([user, ...users]);
  setSessionEmail(user.email);
  return demoResponse(201, { user: publicUser(user) });
}

function handleSubscribers() {
  if (!currentDemoUser()) return demoResponse(401, { error: "Not authenticated" });
  const subs = getDemoUsers().map((u) => ({
    email: u.email,
    plan: u.plan,
    created_at: u.created_at,
    kind: "user",
    status: "Active",
    dot: "green",
  })).sort((a, b) => (Date.parse(b.created_at || "") || 0) - (Date.parse(a.created_at || "") || 0));
  return demoResponse(200, { count: subs.length, subscribers: subs });
}

function handleListBooks() {
  const available = getDemoBooks().filter((b) => b.status === "AVAILABLE");
  return demoResponse(200, { books: available, count: available.length });
}

function handleCreateBook(payload) {
  if (!currentDemoUser()) return demoResponse(401, { error: "Not authenticated" });
  if (!payload.title) return demoResponse(400, { error: "Title is required." });
  if (!payload.author) return demoResponse(400, { error: "Author is required." });
  if (!payload.genre) return demoResponse(400, { error: "Genre is required." });
  if (!payload.city) return demoResponse(400, { error: "City is required." });

  const book = {
    id: ++demoBookIdCounter,
    title: payload.title.trim(),
    author: payload.author.trim(),
    genre: payload.genre.trim(),
    condition: (payload.condition || "GOOD").toUpperCase(),
    description: payload.description || null,
    city: payload.city.trim(),
    ownerId: getSessionEmail(),
    status: "AVAILABLE",
    emoji: "📚",
    createdAt: nowIso(),
  };
  setDemoBooks([book, ...getDemoBooks()]);
  return demoResponse(201, { book });
}

function handleMyBooks() {
  const user = currentDemoUser();
  if (!user) return demoResponse(401, { error: "Not authenticated" });
  const mine = getDemoBooks().filter(
    (b) => normalizeEmail(b.ownerId) === normalizeEmail(user.email)
  );
  return demoResponse(200, { books: mine, count: mine.length });
}

function handleClaimBook(route) {
  if (!currentDemoUser()) return demoResponse(401, { error: "Not authenticated" });
  const bookId = Number.parseInt(route.split("/")[1], 10);
  const books = getDemoBooks();
  const idx = books.findIndex((b) => b.id === bookId);
  if (idx === -1) return demoResponse(404, { error: "Book not found." });
  if (books[idx].status !== "AVAILABLE") {
    return demoResponse(409, { error: "This book is no longer available." });
  }
  books[idx] = { ...books[idx], status: "CLAIMED" };
  setDemoBooks(books);
  return demoResponse(201, { claim: { bookId, status: "PENDING" } });
}

function handleGetConversations() {
  const user = currentDemoUser();
  if (!user) return demoResponse(401, { error: "Not authenticated" });

  const myEmail = normalizeEmail(user.email);
  const conversations = ensureDemoMessages();
  const allUsers = getDemoUsers();

  const result = conversations
    .filter((c) => c.participants.includes(myEmail))
    .map((c) => {
      const otherEmail = c.participants.find((p) => p !== myEmail);
      const other = allUsers.find((u) => normalizeEmail(u.email) === otherEmail);
      const lastMsg = c.messages[c.messages.length - 1];
      const unread = c.messages.filter((m) => m.from !== myEmail && !m.read).length;
      return {
        id: c.id,
        otherEmail,
        name: other?.name || otherEmail,
        avatar: other?.avatar || "👤",
        city: other?.city || "",
        book: c.book,
        exchange: c.exchange || false,
        preview: lastMsg?.text || "",
        time: lastMsg?.displayTime || "",
        unread,
        messages: c.messages,
      };
    })
    .sort((a, b) => {
      const ca = conversations.find((c) => c.id === a.id);
      const cb = conversations.find((c) => c.id === b.id);
      return (Date.parse(cb?.lastUpdated || "") || 0) - (Date.parse(ca?.lastUpdated || "") || 0);
    });

  return demoResponse(200, { conversations: result });
}

function handleSendMessage(payload) {
  const user = currentDemoUser();
  if (!user) return demoResponse(401, { error: "Not authenticated" });
  const { conversationId, text } = payload || {};
  if (!text?.trim()) return demoResponse(400, { error: "Message cannot be empty." });

  const conversations = ensureDemoMessages();
  const idx = conversations.findIndex((c) => c.id === conversationId);
  if (idx === -1) return demoResponse(404, { error: "Conversation not found." });

  const msg = {
    id: Date.now(),
    from: normalizeEmail(user.email),
    text: text.trim(),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    displayTime: "Just now",
  };

  conversations[idx] = {
    ...conversations[idx],
    messages: [...conversations[idx].messages, msg],
    lastUpdated: new Date().toISOString(),
  };

  writeDemoMessages(conversations);
  return demoResponse(201, { message: msg });
}

function handleGetUnreadCount() {
  const user = currentDemoUser();
  if (!user) return demoResponse(200, { unread: 0 });
  const myEmail = normalizeEmail(user.email);
  const count = ensureDemoMessages()
    .filter((c) => c.participants.includes(myEmail))
    .reduce((sum, c) => sum + c.messages.filter((m) => m.from !== myEmail && !m.read).length, 0);
  return demoResponse(200, { unread: count });
}

function handleMarkRead(payload) {
  const user = currentDemoUser();
  if (!user) return demoResponse(401, { error: "Not authenticated" });
  const myEmail = normalizeEmail(user.email);
  const conversations = ensureDemoMessages();
  const idx = conversations.findIndex((c) => c.id === payload?.conversationId);
  if (idx === -1) return demoResponse(404, { error: "Conversation not found." });
  conversations[idx] = {
    ...conversations[idx],
    messages: conversations[idx].messages.map((m) =>
      m.from === myEmail ? m : { ...m, read: true }
    ),
  };
  writeDemoMessages(conversations);
  return demoResponse(200, { ok: true });
}

function demoApi(route, body) {
  switch (route) {
    case "me":              return handleMe();
    case "login":           return handleLogin(body || {});
    case "signup":          return handleSignup(body || {});
    case "logout":          removeItem(STORAGE_KEYS.session); return demoResponse(200, { ok: true });
    case "forgot-password": return demoResponse(200, { ok: true });
    case "subscribers":     return handleSubscribers();
    case "books":            return body ? handleCreateBook(body) : handleListBooks();
    case "books/my":         return handleMyBooks();
    case "messages":         return body ? handleSendMessage(body) : handleGetConversations();
    case "messages/send":    return handleSendMessage(body || {});
    case "messages/unread":  return handleGetUnreadCount();
    case "messages/read":    return handleMarkRead(body);
    default:
      if (route.startsWith("books/") && route.endsWith("/claim")) {
        return handleClaimBook(route);
      }
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
      credentials: "include",
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
