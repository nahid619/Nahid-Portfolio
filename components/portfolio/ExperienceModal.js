"use client";

import Image from "next/image";
import { Modal, TechBadge } from "@/components/shared";

function formatPeriod(startDate, endDate, isCurrent) {
  if (!startDate) return "";
  const fmt = (d) => {
    const [y, m] = d.split("-");
    return new Date(y, m - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  const start = fmt(startDate);
  const end = isCurrent ? "Present" : endDate ? fmt(endDate) : "Present";

  // duration
  const startMs = new Date(startDate.replace("-", "/") + "/01");
  const endMs   = isCurrent ? new Date() : new Date((endDate || startDate).replace("-", "/") + "/01");
  const months  = Math.max(0, (endMs.getFullYear() - startMs.getFullYear()) * 12 + (endMs.getMonth() - startMs.getMonth()));
  const years   = Math.floor(months / 12);
  const rem     = months % 12;
  const dur     = years > 0
    ? `${years}y ${rem > 0 ? rem + "m" : ""}`
    : `${months}m`;

  return `${start} – ${end} · ${dur}`;
}

export default function ExperienceModal({ exp, isOpen, onClose }) {
  if (!exp) return null;

  const footer = (
    <>
      {exp.companyUrl && (
        <a
          href={exp.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #059212, #06D001)",
            color: "white",
            border: "none",
            borderRadius: "7px",
            padding: "10px",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: "pointer",
            textAlign: "center",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          Visit Company →
        </a>
      )}
      <button
        onClick={onClose}
        style={{
          flex: exp.companyUrl ? "0 0 auto" : 1,
          background: "transparent",
          border: "1px solid #02275b",
          color: "#bcc4ba",
          borderRadius: "7px",
          padding: "10px 16px",
          fontSize: "0.875rem",
          cursor: "pointer",
          fontFamily: "var(--font-poppins), Poppins, sans-serif",
        }}
      >
        Close
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="480px" footer={footer}>
      {/* Header */}
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "20px" }}>
        <div
          style={{
            width: "52px", height: "52px",
            background: "#02275b",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", fontWeight: 700, color: "#06D001",
            flexShrink: 0, overflow: "hidden",
            position: "relative",
          }}
        >
          {exp.companyLogoUrl ? (
            <Image src={exp.companyLogoUrl} alt={exp.company} fill style={{ objectFit: "cover" }} sizes="52px" />
          ) : (
            exp.company?.slice(0, 2).toUpperCase()
          )}
        </div>
        <div>
          <h3 style={{ color: "white", fontSize: "1.05rem", fontWeight: 700, margin: "0 0 3px" }}>{exp.role}</h3>
          <div style={{ color: "#06D001", fontSize: "0.875rem", marginBottom: "3px" }}>
            {exp.company} · {exp.employmentType}
          </div>
          <div style={{ color: "#bcc4ba", fontSize: "0.8rem" }}>
            {formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}
          </div>
          {exp.location && (
            <div style={{ color: "#bcc4ba", fontSize: "0.8rem", marginTop: "2px" }}>
              📍 {exp.location}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {exp.description && (
        <div style={{ marginBottom: "18px" }}>
          <div style={{ color: "#06D001", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
            Description
          </div>
          <p style={{ color: "#bcc4ba", fontSize: "0.9rem", lineHeight: 1.8, margin: 0 }}>
            {exp.description}
          </p>
        </div>
      )}

      {/* Skills */}
      {exp.skills?.length > 0 && (
        <div>
          <div style={{ color: "#06D001", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
            Skills Used
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {exp.skills.map((skill) => (
              <TechBadge key={skill} label={skill} />
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}