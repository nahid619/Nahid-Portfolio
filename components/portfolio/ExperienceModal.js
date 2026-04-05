// components/portfolio/ExperienceModal.js
"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { TechBadge } from "@/components/shared";

function fmt(dateStr) {
  if (!dateStr) return "";
  const [y, m] = dateStr.split("-");
  return new Date(y, m - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function calcDuration(startDate, endDate, isCurrent) {
  if (!startDate) return "";
  const start  = new Date(startDate.replace("-", "/") + "/01");
  const end    = isCurrent || !endDate ? new Date() : new Date(endDate.replace("-", "/") + "/01");
  const months = Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
  const years  = Math.floor(months / 12);
  const rem    = months % 12;
  if (years === 0) return `${months} month${months !== 1 ? "s" : ""}`;
  if (rem   === 0) return `${years} year${years !== 1 ? "s" : ""}`;
  return `${years} year${years !== 1 ? "s" : ""} ${rem} month${rem !== 1 ? "s" : ""}`;
}

export default function ExperienceModal({ exp, isOpen, onClose }) {
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

  // Don't render on server or when closed
  if (!isOpen || !exp) return null;
  if (typeof window === "undefined") return null;

  const period   = `${fmt(exp.startDate)} – ${exp.isCurrent ? "Present" : fmt(exp.endDate) || "Present"}`;
  const duration = calcDuration(exp.startDate, exp.endDate, exp.isCurrent);

  const modal = (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9000,
        background: "rgba(1,20,40,0.88)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <style>{`
        @keyframes expModalIn {
          from { opacity:0; transform:translateY(24px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .exp-modal-body::-webkit-scrollbar { width: 5px; }
        .exp-modal-body::-webkit-scrollbar-thumb { background:#059212; border-radius:3px; }
      `}</style>

      {/* Panel */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",    /* ← for absolute × button */
          background: "#00193b",
          border: "1px solid #059212",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "640px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          animation: "expModalIn 0.28s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(9,146,18,0.25)",
        }}
      >
        {/* × button — absolutely pinned to top-right, always visible */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            zIndex: 10,
            background: "rgba(2,39,91,0.85)",
            border: "1px solid #02275b",
            color: "#bcc4ba",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#00e417"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#02275b"; e.currentTarget.style.color = "#bcc4ba"; }}
        >
          ×
        </button>

        {/* Scrollable body — padding-top leaves room under × button */}
        <div className="exp-modal-body" style={{ overflowY: "auto", flex: 1, padding: "28px 28px 20px", paddingTop: "52px" }}>

          {/* Company header */}
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "24px" }}>
            <div style={{
              width: "60px", height: "60px", background: "#02275b", borderRadius: "12px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", fontWeight: 700, color: "#06D001",
              flexShrink: 0, overflow: "hidden", position: "relative",
            }}>
              {exp.companyLogoUrl
                ? <Image src={exp.companyLogoUrl} alt={exp.company} fill style={{ objectFit: "cover" }} sizes="60px" />
                : exp.company?.slice(0, 2).toUpperCase()
              }
            </div>

            <div style={{ flex: 1, paddingRight: "20px" }}>
              <h2 style={{ color: "white", fontSize: "1.2rem", fontWeight: 700, margin: "0 0 5px", lineHeight: 1.3 }}>
                {exp.role}
              </h2>
              <div style={{ color: "#06D001", fontSize: "0.938rem", fontWeight: 600, marginBottom: "4px" }}>
                {exp.company}{exp.employmentType ? ` · ${exp.employmentType}` : ""}
              </div>
              <div style={{ color: "#bcc4ba", fontSize: "0.838rem" }}>
                🗓 {period} &nbsp;·&nbsp; <span style={{ color: "#9BEC00", fontWeight: 600 }}>{duration}</span>
              </div>
              {exp.location && (
                <div style={{ color: "#bcc4ba", fontSize: "0.838rem", marginTop: "3px" }}>📍 {exp.location}</div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#02275b", marginBottom: "20px" }} />

          {/* Description */}
          {exp.description && (
            <div style={{ marginBottom: "22px" }}>
              <SectionLabel>Description</SectionLabel>
              <p style={{ color: "#bcc4ba", fontSize: "0.938rem", lineHeight: 1.9, margin: 0 }}>
                {exp.description}
              </p>
            </div>
          )}

          {/* Skills */}
          {exp.skills?.length > 0 && (
            <div>
              <SectionLabel>Skills Used</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {exp.skills.map(s => <TechBadge key={s} label={s} />)}
              </div>
            </div>
          )}
        </div>

        {/* Fixed footer */}
        <div style={{
          padding: "16px 28px",
          borderTop: "1px solid #02275b",
          display: "flex",
          gap: "10px",
          background: "#00193b",
          borderRadius: "0 0 16px 16px",
          flexShrink: 0,
        }}>
          {exp.companyUrl && (
            <a
              href={exp.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                background: "linear-gradient(135deg,#059212,#06D001)",
                color: "white", border: "none", borderRadius: "8px",
                padding: "12px", fontSize: "0.938rem", fontWeight: 700,
                cursor: "pointer", textAlign: "center", textDecoration: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              Visit Company →
            </a>
          )}
          <button
            onClick={onClose}
            style={{
              flex: exp.companyUrl ? "0 0 auto" : 1,
              minWidth: "100px",
              background: "transparent",
              border: "1px solid #02275b",
              color: "#bcc4ba",
              borderRadius: "8px",
              padding: "12px 20px",
              fontSize: "0.938rem",
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
  );

  // Portal into document.body — fixes position:fixed being trapped inside
  // SectionWrapper's transform (translateY) stacking context
  return createPortal(modal, document.body);
}

function SectionLabel({ children }) {
  return (
    <div style={{ color: "#06D001", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
      {children}
    </div>
  );
}