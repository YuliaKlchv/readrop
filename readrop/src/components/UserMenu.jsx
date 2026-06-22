import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useT } from "../context/LangContext.jsx";
import { useUnreadCount } from "../lib/useUnreadCount.js";
import styles from "./UserMenu.module.css";

function getInitials(name, email) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return (email || "?").slice(0, 2).toUpperCase();
}

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const t = useT();
  const navigate = useNavigate();
  const unread = useUnreadCount(user);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const close = () => setOpen(false);

  const onSignOut = async () => {
    close();
    await signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.avatar}
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
        aria-expanded={open}
      >
        {getInitials(user.name, user.email)}
        {unread > 0 && <span className={styles.dot} aria-hidden="true" />}
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <div className={styles.menuHead}>
            <span className={styles.menuName}>{user.name || user.email}</span>
            <span className={styles.menuEmail}>{user.email}</span>
          </div>

          <div className={styles.divider} />

          <Link to="/messages" className={styles.item} onClick={close} role="menuitem">
            <span className={styles.itemIcon}>💬</span>
            <span>{t.nav.messages}</span>
            {unread > 0 && <span className={styles.badge}>{unread > 9 ? "9+" : unread}</span>}
          </Link>

          <Link to="/dashboard" className={styles.item} onClick={close} role="menuitem">
            <span className={styles.itemIcon}>📊</span>
            <span>{t.nav.dashboard}</span>
          </Link>

          <div className={styles.divider} />

          <button className={`${styles.item} ${styles.signoutItem}`} onClick={onSignOut} role="menuitem">
            <span className={styles.itemIcon}>↪</span>
            <span>{t.nav.logout}</span>
          </button>
        </div>
      )}
    </div>
  );
}
