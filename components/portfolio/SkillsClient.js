// components/portfolio/SkillsClient.js
// Phase 4 — NEW FILE
//
// Why this exists:
// SkillsSection is now a server component.
// But tab switching needs useState + fetch on tab change.
// So all interactive logic lives here.
//
// On first render: uses initialSkills (server-fetched, zero extra request)
// On tab switch: fetches from /api/skills?category=xxx

"use client";

import { useState } from "react";
import Image from "next/image";
import { TabGroup, SkeletonSkillCard } from "@/components/shared";

export default function SkillsClient({ tabs = [], initialSkills = [], firstSkillTab = "" }) {
  const [activeTab,    setActiveTab]    = useState(firstSkillTab);
  const [skills,       setSkills]       = useState(initialSkills);
  const [loading,      setLoading]      = useState(false);

  async function handleTabChange(value) {
    if (value === activeTab) return;
    setActiveTab(value);
    setLoading(true);
    try {
      const url = value
        ? `/api/skills?category=${encodeURIComponent(value)}`
        : "/api/skills";
      const res  = await fetch(url);
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.error("Skills fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TabGroup
        tabs={tabs}
        active={activeTab}
        onChange={handleTabChange}
      />

      <div
        className="skills-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "10px",
        }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonSkillCard key={i} />
            ))
          : skills.map(skill => (
              <div
                key={skill._id}
                style={{
                  background: "#00193b",
                  border: "1px solid #059212",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textAlign: "left",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform  = "translateY(-3px)";
                  e.currentTarget.style.boxShadow  = "0 6px 20px rgba(5,146,18,0.15)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform  = "translateY(0)";
                  e.currentTarget.style.boxShadow  = "none";
                }}
              >
                {/* Icon */}
                <div style={{
                  width: "36px", height: "36px",
                  background: "#011428",
                  borderRadius: "7px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, overflow: "hidden",
                }}>
                  {skill.iconUrl ? (
                    <Image
                      src={skill.iconUrl}
                      alt={skill.name}
                      width={26}
                      height={26}
                      style={{ objectFit: "contain" }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <span style={{ color: "#06D001", fontSize: "13px", fontWeight: 700 }}>
                      {skill.name.slice(0, 2)}
                    </span>
                  )}
                </div>

                {/* Name */}
                <span style={{
                  color: "white",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}>
                  {skill.name}
                </span>
              </div>
            ))
        }
      </div>

      <style>{`
        @keyframes skeletonShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
