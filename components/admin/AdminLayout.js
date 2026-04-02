"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { id: "profile",       label: "Profile",        emoji: "👤" },
  { id: "experience",    label: "Experience",      emoji: "💼" },
  { id: "skills",        label: "Skills",          emoji: "⚡" },
  { id: "projects",      label: "Projects",        emoji: "📁" },
  { id: "certs",         label: "Certifications",  emoji: "📜" },
  { id: "qualification", label: "Qualification",   emoji: "🎓" },
  { id: "links",         label: "Social Links",    emoji: "🔗" },
  { id: "cv",            label: "CV / Resume",     emoji: "📄" },
];

export default function AdminLayout({ activeSection, onSectionChange, children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await signOut({ callbackUrl: "/admin" });
  }

  return (
    <>
      <style>{`
        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          color: #bcc4ba;
          font-size: 0.875rem;
          cursor: pointer;
          border-left: 3px solid transparent;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          user-select: none;
        }
        .admin-nav-item:hover {
          background: #02275b;
          color: white;
        }
        .admin-nav-item.active {
          background: #02275b;
          color: #06D001;
          border-left-color: #059212;
          font-weight: 600;
        }
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-sidebar.open { display: flex !important; }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#011428", fontFamily: "var(--font-poppins), Poppins, sans-serif" }}>

        {/* Top header */}
        <header style={{
          background: "#00193b",
          borderBottom: "1px solid #02275b",
          padding: "0 1.5rem",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(o => !o)}
              style={{ display: "none", background: "none", border: "none", color: "#bcc4ba", fontSize: "1.25rem", cursor: "pointer", padding: "4px" }}
              className="mobile-menu-btn"
            >
              ☰
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "linear-gradient(135deg,#059212,#06D001)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "white" }}>
                NH
              </div>
              <span style={{ color: "white", fontWeight: 700, fontSize: "0.938rem" }}>
                Admin Dashboard
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <a href="/" target="_blank" rel="noopener noreferrer"
              style={{ color: "#bcc4ba", fontSize: "0.813rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "5px", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#06D001"}
              onMouseLeave={e => e.currentTarget.style.color = "#bcc4ba"}
            >
              View Site ↗
            </a>
            <button
              onClick={handleLogout}
              style={{ background: "transparent", border: "1px solid #02275b", color: "#bcc4ba", padding: "5px 14px", borderRadius: "6px", fontSize: "0.813rem", cursor: "pointer", fontFamily: "inherit", transition: "border-color 0.2s, color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#059212"; e.currentTarget.style.color = "#06D001"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#02275b"; e.currentTarget.style.color = "#bcc4ba"; }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Body */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* Sidebar */}
          <aside
            className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}
            style={{
              width: "200px",
              background: "#00193b",
              borderRight: "1px solid #02275b",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              overflowY: "auto",
            }}
          >
            <nav style={{ padding: "8px 0", flex: 1 }}>
              {NAV_ITEMS.map(item => (
                <div
                  key={item.id}
                  className={`admin-nav-item ${activeSection === item.id ? "active" : ""}`}
                  onClick={() => { onSectionChange(item.id); setSidebarOpen(false); }}
                >
                  <span style={{ fontSize: "1rem" }}>{item.emoji}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </nav>

            {/* User info at bottom */}
            <div style={{ padding: "12px 16px", borderTop: "1px solid #02275b" }}>
              <div style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>Signed in as</div>
              <div style={{ color: "#06D001", fontSize: "0.813rem", fontWeight: 600 }}>{session?.user?.name}</div>
            </div>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}