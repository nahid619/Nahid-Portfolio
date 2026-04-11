// components/portfolio/ExperienceClient.js
// Phase 3 — NEW FILE
//
// Why this exists:
// ExperienceSection is now a server component.
// But the experience cards need onClick (to open modal)
// and the modal needs useState.
// So all interactive parts live here as a client component.
// The data (experiences array) comes in as a prop — no fetching.

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TechBadge } from "@/components/shared";
import ExperienceModal from "./ExperienceModal";

function formatPeriodShort(startDate, endDate, isCurrent) {
  if (!startDate) return "";
  const fmt = (d) => {
    const [y, m] = d.split("-");
    return new Date(y, m - 1).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };
  const start   = fmt(startDate);
  const end     = isCurrent ? "Present" : endDate ? fmt(endDate) : "Present";
  const startMs = new Date(startDate.replace("-", "/") + "/01");
  const endMs   = isCurrent
    ? new Date()
    : new Date((endDate || startDate).replace("-", "/") + "/01");
  const months  = Math.max(
    0,
    (endMs.getFullYear() - startMs.getFullYear()) * 12 +
      (endMs.getMonth() - startMs.getMonth())
  );
  const years = Math.floor(months / 12);
  const rem   = months % 12;
  const dur   = years > 0
    ? `${years}y ${rem > 0 ? rem + "m" : ""}`.trim()
    : `${months}m`;
  return `${start} – ${end} · ${dur}`;
}

export default function ExperienceClient({ experiences = [] }) {
  const [selectedExp, setSelectedExp] = useState(null);

  // Show only the 2 most recent
  const visible = experiences.slice(0, 2);

  return (
    <>
      <div
        className="exp-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {visible.map(exp => (
          <ExperienceCard
            key={exp._id}
            exp={exp}
            onClick={() => setSelectedExp(exp)}
          />
        ))}

        {/* See All card */}
        <Link
          href="/experiences"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            background: "#00193b",
            border: "2px dashed #059212",
            borderRadius: "12px",
            minHeight: "160px",
            textDecoration: "none",
            transition: "background 0.2s, border-color 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background    = "#021f40";
            e.currentTarget.style.borderColor   = "#06D001";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background    = "#00193b";
            e.currentTarget.style.borderColor   = "#059212";
          }}
        >
          <span style={{ fontSize: "2rem", color: "#06D001" }}>→</span>
          <span style={{ color: "#06D001", fontSize: "0.938rem", fontWeight: 700 }}>
            See All Experience
          </span>
          <span style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>
            View all {experiences.length} entries
          </span>
        </Link>
      </div>

      <ExperienceModal
        exp={selectedExp}
        isOpen={!!selectedExp}
        onClose={() => setSelectedExp(null)}
      />
    </>
  );
}

function ExperienceCard({ exp, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#00193b",
        border: "1px solid #02275b",
        borderRadius: "12px",
        padding: "18px 20px",
        cursor: "pointer",
        minWidth: 0,
        overflow: "hidden",
        textAlign: "left",
        transition: "border-color 0.2s, box-shadow 0.2s",
        position: "relative",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor  = "#06D001";
        e.currentTarget.style.boxShadow    = "0 8px 24px rgba(5,146,18,0.15)";
        e.currentTarget.style.marginTop    = "-4px";
        e.currentTarget.style.marginBottom = "4px";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor  = "#02275b";
        e.currentTarget.style.boxShadow    = "none";
        e.currentTarget.style.marginTop    = "0";
        e.currentTarget.style.marginBottom = "0";
      }}
    >
      {/* Top: logo + role */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
        <div style={{
          width: "42px", height: "42px",
          background: "#02275b",
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px", fontWeight: 700, color: "#06D001",
          flexShrink: 0, overflow: "hidden", position: "relative",
        }}>
          {exp.companyLogoUrl ? (
            <Image
              src={exp.companyLogoUrl}
              alt={exp.company}
              fill
              style={{ objectFit: "cover" }}
              sizes="42px"
            />
          ) : (
            exp.company?.slice(0, 2).toUpperCase()
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            color: "white",
            fontSize: "0.875rem",
            fontWeight: 700,
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}>
            {exp.role}
          </div>
          <div style={{ color: "#06D001", fontSize: "0.8rem" }}>
            {exp.company}
          </div>
        </div>
      </div>

      {/* Period */}
      <div style={{ color: "#bcc4ba", fontSize: "0.775rem", marginBottom: "12px" }}>
        🗓 {formatPeriodShort(exp.startDate, exp.endDate, exp.isCurrent)}
      </div>

      {/* Skill tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", overflow: "hidden" }}>
        {exp.skills?.slice(0, 4).map(s => (
          <TechBadge key={s} label={s} />
        ))}
        {exp.skills?.length > 4 && (
          <TechBadge label={`+${exp.skills.length - 4}`} variant="outline" />
        )}
      </div>

      {/* Click hint */}
      <div style={{ color: "#bcc4ba", fontSize: "0.7rem", marginTop: "10px", opacity: 0.6 }}>
        Click to see full details →
      </div>
    </div>
  );
}
