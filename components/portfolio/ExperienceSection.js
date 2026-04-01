"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import { SectionWrapper, SectionHeader, ArrowNav, TechBadge, SkeletonLoader } from "@/components/shared";
import ExperienceModal from "./ExperienceModal";

function formatPeriodShort(startDate, endDate, isCurrent) {
  if (!startDate) return "";
  const fmt = (d) => {
    const [y, m] = d.split("-");
    return new Date(y, m - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  const start = fmt(startDate);
  const end = isCurrent ? "Present" : endDate ? fmt(endDate) : "Present";
  const startMs = new Date(startDate.replace("-", "/") + "/01");
  const endMs   = isCurrent ? new Date() : new Date((endDate || startDate).replace("-", "/") + "/01");
  const months  = Math.max(0, (endMs.getFullYear() - startMs.getFullYear()) * 12 + (endMs.getMonth() - startMs.getMonth()));
  const years   = Math.floor(months / 12);
  const rem     = months % 12;
  const dur     = years > 0 ? `${years}y ${rem > 0 ? rem + "m" : ""}` : `${months}m`;
  return `${start} – ${end} · ${dur.trim()}`;
}

export default function ExperienceSection() {
  const { data: experiences, loading } = useFetch("/api/experiences");
  const [selectedExp, setSelectedExp] = useState(null);
  const [scrollIdx, setScrollIdx]     = useState(0);
  const stripRef = useRef(null);

  const CARD_WIDTH = 240; // px including gap

  function scroll(dir) {
    const max = Math.max(0, (experiences?.length || 0) - 1);
    const next = Math.max(0, Math.min(scrollIdx + dir, max));
    setScrollIdx(next);
    if (stripRef.current) {
      stripRef.current.scrollTo({ left: next * (CARD_WIDTH + 12), behavior: "smooth" });
    }
  }

  return (
    <SectionWrapper id="experience">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Work Experience" subtitle="Where I've worked — latest first" />

        {/* Card strip */}
        <div
          ref={stripRef}
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            scrollbarWidth: "none",
            paddingBottom: "4px",
          }}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    minWidth: `${CARD_WIDTH}px`,
                    background: "#00193b",
                    border: "1px solid #02275b",
                    borderRadius: "10px",
                    padding: "14px",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <SkeletonLoader variant="circle" width="38px" height="38px" />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                      <SkeletonLoader variant="line" width="80%" height="10px" />
                      <SkeletonLoader variant="line" width="60%" height="8px" />
                    </div>
                  </div>
                  <SkeletonLoader variant="line" width="90%" height="8px" style={{ marginBottom: "10px" }} />
                  <div style={{ display: "flex", gap: "6px" }}>
                    <SkeletonLoader variant="line" width="50px" height="20px" />
                    <SkeletonLoader variant="line" width="50px" height="20px" />
                  </div>
                </div>
              ))
            : experiences?.map((exp) => (
                <div
                  key={exp._id}
                  onClick={() => setSelectedExp(exp)}
                  style={{
                    minWidth: `${CARD_WIDTH}px`,
                    maxWidth: `${CARD_WIDTH}px`,
                    background: "#00193b",
                    border: "1px solid #02275b",
                    borderRadius: "10px",
                    padding: "14px",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "border-color 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#06D001";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#02275b";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Card top */}
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                    <div
                      style={{
                        width: "38px", height: "38px",
                        background: "#02275b",
                        borderRadius: "8px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", fontWeight: 700, color: "#06D001",
                        flexShrink: 0, overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {exp.companyLogoUrl
                        ? <Image src={exp.companyLogoUrl} alt={exp.company} fill style={{ objectFit: "cover" }} sizes="38px" />
                        : exp.company?.slice(0, 2).toUpperCase()
                      }
                    </div>
                    <div>
                      <div style={{ color: "white", fontSize: "0.813rem", fontWeight: 700, lineHeight: 1.3 }}>{exp.role}</div>
                      <div style={{ color: "#06D001", fontSize: "0.75rem" }}>{exp.company}</div>
                    </div>
                  </div>

                  {/* Period */}
                  <div style={{ color: "#bcc4ba", fontSize: "0.75rem", marginBottom: "10px" }}>
                    🗓 {formatPeriodShort(exp.startDate, exp.endDate, exp.isCurrent)}
                  </div>

                  {/* Skill tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {exp.skills?.slice(0, 4).map((s) => (
                      <TechBadge key={s} label={s} />
                    ))}
                    {exp.skills?.length > 4 && (
                      <TechBadge label={`+${exp.skills.length - 4}`} variant="outline" />
                    )}
                  </div>
                </div>
              ))}
        </div>

        {/* Arrow navigation */}
        {!loading && experiences?.length > 1 && (
          <ArrowNav
            onPrev={() => scroll(-1)}
            onNext={() => scroll(1)}
            prevDisabled={scrollIdx === 0}
            nextDisabled={scrollIdx >= (experiences?.length || 1) - 1}
          />
        )}
      </div>

      {/* Experience Modal */}
      <ExperienceModal
        exp={selectedExp}
        isOpen={!!selectedExp}
        onClose={() => setSelectedExp(null)}
      />
    </SectionWrapper>
  );
}