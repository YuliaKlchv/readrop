import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useT } from "../context/LangContext.jsx";
import UserMenu from "./UserMenu.jsx";
import LangSwitcher from "./LangSwitcher.jsx";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { to: "/books",     tKey: "browse",    end: false },
  { to: "/discover",  tKey: "discover",  end: false },
  { to: "/community", tKey: "community", end: false },
  { to: "/give",      tKey: "give",      end: false },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const t = useT();
  const close = () => setOpen(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} onClick={close} aria-label="Readrop home">
          <img src="/logo.svg" alt="Readrop" height={36} />
        </Link>

        <button
          className={styles.toggle}
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <nav
          className={`${styles.nav} ${open ? styles.navOpen : ""}`}
          aria-label="Primary"
        >
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={close}
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              {t.nav[l.tKey]}
            </NavLink>
          ))}

          {user ? (
            <UserMenu />
          ) : (
            <>
              <NavLink to="/login" onClick={close} className={({ isActive }) => (isActive ? styles.active : "")}>
                {t.nav.login}
              </NavLink>
              <Link to="/register" onClick={close} className={`btn btn-terra btn-sm ${styles.cta}`}>
                {t.nav.signup}
              </Link>
            </>
          )}

          <LangSwitcher />
        </nav>
      </div>
    </header>
  );
}
