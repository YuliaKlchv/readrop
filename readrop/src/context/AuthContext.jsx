import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

/*
 * Auth is backed by the Readrop API, typically the Java backend running on
 * /api. The session lives in an httpOnly cookie; here we only mirror "who is
 * logged in" into React state. signUp / signIn / signOut return a
 * { data, error } shape so pages can stay simple.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("backend");

  // Restore an existing session on first load.
  useEffect(() => {
    let active = true;
    api("me")
      .then((res) => {
        if (!active) return;
        setMode(res.source || "backend");
        setUser(res.status === 200 ? res.data.user : null);
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    mode,

    signUp: async ({ name, email, password, plan }) => {
      const res = await api("signup", { name, email: (email || "").trim(), password, plan });
      setMode(res.source || "backend");
      if (res.status === 201) { setUser(res.data.user); return { data: res.data, error: null }; }
      return { data: null, error: { message: res.data?.error || "Could not create your account." } };
    },

    signIn: async (email, password) => {
      const res = await api("login", { email: (email || "").trim(), password });
      setMode(res.source || "backend");
      if (res.status === 200) { setUser(res.data.user); return { data: res.data, error: null }; }
      return { data: null, error: { message: res.data?.error || "Invalid email or password." } };
    },

    signOut: async () => {
      const res = await api("logout", {});
      setMode(res.source || "backend");
      setUser(null);
      return { error: null };
    },

    forgotPassword: async (email) => {
      const res = await api("forgot-password", { email: (email || "").trim() });
      setMode(res.source || "backend");
      return res;
    },
  }), [user, loading, mode]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
