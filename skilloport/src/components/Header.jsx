import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./Header.module.css";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/gallery", label: "Gallery" },
  { to: "/pricing", label: "Pricing" },
  { to: "/legal", label: "Legal" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const close = () => setOpen(false);

  const onSignOut = async () => {
    close();
    await signOut();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} onClick={close} aria-label="SkillOport home">
          <img src="/logo.png" alt="SkillOport" height={36} />
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
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={close}
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              {l.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink
                to="/admin"
                onClick={close}
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Dashboard
              </NavLink>
              <span className={styles.userEmail} title={user.email}>
                {user.email}
              </span>
              <button type="button" className={styles.signout} onClick={onSignOut}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={close}
                className={({ isActive }) => (isActive ? styles.active : "")}
              >
                Log in
              </NavLink>
              <Link
                to="/register"
                onClick={close}
                className={`btn btn-terra btn-sm ${styles.cta}`}
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
