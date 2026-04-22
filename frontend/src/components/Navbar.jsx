import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkHealth } from "../api";

export default function Navbar() {
  const location = useLocation();
  const [online, setOnline] = useState(null);

  useEffect(() => {
    checkHealth().then((r) => setOnline(!r.error));
  }, []);

  const links = [
    { to: "/",         label: "Home" },
    { to: "/upload",   label: "Audit" },
    { to: "/dashboard",label: "Dashboard" },
    { to: "/history",  label: "History" },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⚖️</span>
          <span style={styles.logoText}>Fair<span style={styles.logoAccent}>Sight</span></span>
        </Link>

        {/* Links */}
        <div style={styles.links}>
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}
              >
                {l.label}
                {active && <span style={styles.activeDot} />}
              </Link>
            );
          })}
        </div>

        {/* Status pill */}
        <div style={styles.statusPill}>
          <span style={{
            ...styles.statusDot,
            background: online === null ? "#64748b" : online ? "#10b981" : "#ef4444",
            boxShadow: online ? "0 0 8px #10b981" : online === false ? "0 0 8px #ef4444" : "none",
          }} />
          <span style={styles.statusLabel}>
            {online === null ? "Checking…" : online ? "API Online" : "API Offline"}
          </span>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(10,11,15,0.8)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    height: 64,
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
    flexShrink: 0,
  },
  logoIcon: { fontSize: "1.3rem" },
  logoText: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#f1f5f9",
  },
  logoAccent: { color: "#a78bfa" },
  links: { display: "flex", alignItems: "center", gap: 4 },
  link: {
    position: "relative",
    padding: "6px 14px",
    borderRadius: 8,
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "0.88rem",
    fontWeight: 500,
    transition: "color 0.2s, background 0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  linkActive: { color: "#a78bfa", background: "rgba(124,58,237,0.12)" },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "#a78bfa",
    display: "block",
  },
  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 99,
    flexShrink: 0,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    display: "inline-block",
    transition: "background 0.4s, box-shadow 0.4s",
  },
  statusLabel: { fontSize: "0.75rem", color: "#94a3b8", whiteSpace: "nowrap" },
};