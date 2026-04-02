// components/portfolio/ExperienceModal.js
"use client";

import { useEffect } from "react";
import Image from "next/image";
import { TechBadge } from "@/components/shared";

function formatPeriod(startDate, endDate, isCurrent) {
  if (!startDate) return "";
  const fmt = (d) => {
    const [y, m] = d.split("-");
    return new Date(y, m - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  const start  = fmt(startDate);
  const end    = isCurrent ? "Present" : endDate ? fmt(endDate) : "Present";
  const startMs = new Date(startDate.replace("-", "/") + "/01");
  const endMs   = isCurrent ? new Date() : new Date((endDate || startDate).replace("-", "/") + "/01");
  const months  = Math.max(0, (endMs.getFullYear() - startMs.getFullYear()) * 12 + (endMs.getMonth() - startMs.getMonth()));
  const years   = Math.floor(months / 12);
  const rem     = months % 12;
  const dur     = years > 0 ? `${years}y ${rem > 0 ? rem + "m" : ""}`.trim() : `${months}m`;
  return `${start} – ${end} · ${dur}`;
}

export default function ExperienceModal({ exp, isOpen, onClose }) {
  // Lock body scroll + Escape key
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !exp) return null;

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform: translateY(20px) scale(0.97); }
          to   { opacity:1; transform: translateY(0)    scale(1);    }
        }
        .exp-modal-scroll::-webkit-scrollbar { width: 4px; }
        .exp-modal-scroll::-webkit-scrollbar-thumb { background: #059212; border-radius: 2px; }
      `}</style>

      {/* Full-screen overlay — always centered on viewport */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(1,20,40,0.85)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        {/* Panel */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: "#00193b",
            border: "1px solid #059212",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "600px",       // wider than before
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            animation: "modalIn 0.25s ease",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(5,146,18,0.2)",
          }}
        >
          {/* Scrollable body */}
          <div className="exp-modal-scroll" style={{ overflowY: "auto", flex: 1, padding: "22px 24px" }}>

            {/* Header */}
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "20px" }}>
              <div style={{
                width: "56px", height: "56px",
                background: "#02275b", borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "18px", fontWeight: 700, color: "#06D001",
                flexShrink: 0, overflow: "hidden", position: "relative",
              }}>
                {exp.companyLogoUrl
                  ? <Image src={exp.companyLogoUrl} alt={exp.company} fill style={{ objectFit: "cover" }} sizes="56px" />
                  : exp.company?.slice(0, 2).toUpperCase()
                }
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: "white", fontSize: "1.15rem", fontWeight: 700, margin: "0 0 4px" }}>{exp.role}</h3>
                <div style={{ color: "#06D001", fontSize: "0.9rem", marginBottom: "3px" }}>
                  {exp.company}{exp.employmentType ? ` · ${exp.employmentType}` : ""}
                </div>
                <div style={{ color: "#bcc4ba", fontSize: "0.813rem" }}>
                  {formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}
                </div>
                {exp.location && (
                  <div style={{ color: "#bcc4ba", fontSize: "0.813rem", marginTop: "2px" }}>📍 {exp.location}</div>
                )}
              </div>
            </div>

            {/* Description */}
            {exp.description && (
              <div style={{ marginBottom: "20px" }}>
                <Label>Description</Label>
                <p style={{ color: "#bcc4ba", fontSize: "0.938rem", lineHeight: 1.85, margin: 0 }}>
                  {exp.description}
                </p>
              </div>
            )}

            {/* Skills */}
            {exp.skills?.length > 0 && (
              <div>
                <Label>Skills Used</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                  {exp.skills.map(s => <TechBadge key={s} label={s} />)}
                </div>
              </div>
            )}
          </div>

          {/* Fixed footer */}
          <div style={{
            padding: "14px 24px",
            borderTop: "1px solid #02275b",
            display: "flex",
            gap: "10px",
            flexShrink: 0,
            background: "#00193b",
            borderRadius: "0 0 16px 16px",
          }}>
            {exp.companyUrl && (
              <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg,#059212,#06D001)",
                  color: "white", border: "none", borderRadius: "8px",
                  padding: "11px", fontSize: "0.9rem", fontWeight: 700,
                  cursor: "pointer", textAlign: "center", textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                Visit Company →
              </a>
            )}
            {/* Close button — always visible and working */}
            <button
              onClick={onClose}
              style={{
                flex: exp.companyUrl ? "0 0 auto" : 1,
                background: "transparent",
                border: "1px solid #02275b",
                color: "#bcc4ba",
                borderRadius: "8px",
                padding: "11px 20px",
                fontSize: "0.9rem",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#059212"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#02275b"; e.currentTarget.style.color = "#bcc4ba"; }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Label({ children }) {
  return (
    <div style={{ color: "#06D001", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
      {children}
    </div>
  );
}