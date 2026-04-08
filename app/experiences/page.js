// app/experiences/page.js
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { SectionHeader, TechBadge, SkeletonLoader } from "@/components/shared";
import ExperienceModal from "@/components/portfolio/ExperienceModal";
import NavBar from "@/components/portfolio/NavBar";

function formatPeriod(startDate, endDate, isCurrent) {
  if (!startDate) return "";
  const fmt = (d) => {
    const [y, m] = d.split("-");
    return new Date(y, m - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };
  const start  = fmt(startDate);
  const end    = isCurrent ? "Present" : endDate ? fmt(endDate) : "Present";
  const startMs = new Date(startDate.replace("-", "/") + "/01");
  const endMs   = isCurrent ? new Date() : new Date((endDate || startDate).replace("-", "/") + "/01");
  const months  = Math.max(0, (endMs.getFullYear() - startMs.getFullYear()) * 12 + (endMs.getMonth() - startMs.getMonth()));
  const years   = Math.floor(months / 12);
  const rem     = months % 12;
  const dur     = years > 0 ? `${years} year${years !== 1 ? "s" : ""} ${rem > 0 ? rem + " mo" : ""}`.trim() : `${months} months`;
  return { period: `${start} – ${end}`, duration: dur };
}

export default function AllExperiencesPage() {
  const { data: experiences, loading } = useFetch("/api/experiences");
  const [selected, setSelected]        = useState(null);

  return (
    <main style={{ background: "#011428", minHeight: "100vh" }}>
      <NavBar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
        {/* Back link */}
        <Link href="/#experience"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#bcc4ba", fontSize: "0.875rem", textDecoration: "none", marginBottom: "2.5rem", transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#06D001"}
          onMouseLeave={e => e.currentTarget.style.color = "#bcc4ba"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Portfolio
        </Link>

        <SectionHeader
          title="Work Experience"
          subtitle={`${experiences?.length ?? "..."} experience ${experiences?.length === 1 ? "entry" : "entries"}`}
          align="left"
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ background: "#00193b", border: "1px solid #02275b", borderRadius: "12px", padding: "20px" }}>
                  <div style={{ display: "flex", gap: "14px", marginBottom: "12px" }}>
                    <SkeletonLoader variant="circle" width="52px" height="52px" />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                      <SkeletonLoader variant="line" width="60%" height="14px" />
                      <SkeletonLoader variant="line" width="40%" height="10px" />
                    </div>
                  </div>
                  <SkeletonLoader variant="line" width="100%" height="9px" style={{ marginBottom: "6px" }} />
                  <SkeletonLoader variant="line" width="80%" height="9px" />
                </div>
              ))
            : experiences?.map((exp, i) => {
                const { period, duration } = formatPeriod(exp.startDate, exp.endDate, exp.isCurrent);
                return (
                  <div
                    key={exp._id}
                    onClick={() => setSelected(exp)}
                    className="exp-row"
                    style={{
                      background: "#00193b",
                      border: "1px solid #02275b",
                      borderRadius: "12px",
                      padding: "20px 24px",
                      cursor: "pointer",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: "16px",
                      alignItems: "center",
                      opacity: 0,
                      animation: `fadeUp 0.4s ease forwards`,
                      animationDelay: `${i * 60}ms`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#059212"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(5,146,18,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#02275b"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {/* Logo */}
                    <div style={{
                      width: "52px", height: "52px",
                      background: "#02275b", borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", fontWeight: 700, color: "#06D001",
                      flexShrink: 0, overflow: "hidden", position: "relative",
                    }}>
                      {exp.companyLogoUrl
                        ? <Image src={exp.companyLogoUrl} alt={exp.company} fill style={{ objectFit: "cover" }} sizes="52px" />
                        : exp.company?.slice(0, 2).toUpperCase()
                      }
                    </div>

                    {/* Content */}
                    <div style={{ textAlign: "left" }}>
                      <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700, margin: "0 0 3px" }}>{exp.role}</h3>
                      <div style={{ color: "#06D001", fontSize: "0.875rem", marginBottom: "4px" }}>
                        {exp.company}{exp.employmentType ? ` · ${exp.employmentType}` : ""}
                      </div>
                      <div style={{ color: "#bcc4ba", fontSize: "0.8rem", marginBottom: "8px" }}>
                        {period}
                      </div>
                      {exp.skills?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                          {exp.skills.slice(0, 5).map(s => <TechBadge key={s} label={s} />)}
                          {exp.skills.length > 5 && <TechBadge label={`+${exp.skills.length - 5}`} variant="outline" />}
                        </div>
                      )}
                    </div>

                    {/* Right: duration + status badge */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ color: "#9BEC00", fontSize: "0.875rem", fontWeight: 700 }}>{duration}</div>
                      {exp.isCurrent && (
                        <span style={{ display: "inline-block", background: "rgba(5,146,18,0.15)", border: "1px solid #059212", color: "#06D001", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", marginTop: "4px" }}>
                          Current
                        </span>
                      )}
                      <div style={{ color: "#bcc4ba", fontSize: "0.75rem", marginTop: "6px" }}>View details →</div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

      <ExperienceModal
        exp={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}