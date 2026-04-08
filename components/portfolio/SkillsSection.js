// components/portfolio/SkillsSection.js
"use client";

import { useState } from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import { SectionWrapper, SectionHeader, TabGroup, SkeletonSkillCard } from "@/components/shared";

export default function SkillsSection() {
  // Fetch tabs from DB — sorted by order ascending
  const { data: categories, loading: catsLoading } = useFetch("/api/categories?section=skills");

  // undefined = user has not clicked a tab yet
  const [activeTab, setActiveTab] = useState(undefined);

  // Derive the real active tab: user choice OR first DB category OR null (skip fetch)
  // No useEffect needed — computed inline on every render, no cascading setState
  const effectiveTab = activeTab !== undefined ? activeTab : (categories?.[0]?.value ?? null);

  // Fetch skills — skip until effectiveTab resolves
  const { data: skills, loading: skillsLoading } = useFetch("/api/skills", {
    params: effectiveTab && effectiveTab !== "" ? { category: effectiveTab } : {},
    skip: effectiveTab === null,
  });

  // Map DB categories to TabGroup shape
  const tabs = categories?.map(c => ({ label: c.name, value: c.value })) || [];

  return (
    <SectionWrapper id="skills">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Skills" subtitle="My technical level" />

        {/* Only render tabs once categories have loaded — avoids empty tab flash */}
        {!catsLoading && tabs.length > 0 && (
          <TabGroup
            tabs={tabs}
            active={effectiveTab ?? ""}
            onChange={setActiveTab}
          />
        )}

        {/* Skeleton tab placeholders while categories load */}
        {catsLoading && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "1.5rem" }}>
            {[80, 55, 100, 60, 45].map((w, i) => (
              <div
                key={i}
                style={{
                  width: `${w}px`, height: "32px", borderRadius: "4px",
                  background: "linear-gradient(90deg,#02275b 25%,#02356e 50%,#02275b 75%)",
                  backgroundSize: "200% 100%",
                  animation: "skeletonShimmer 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        )}

        {/* Skills grid */}
        <div
          className="skills-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "10px",
          }}
        >
          {skillsLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonSkillCard key={i} />)
            : skills?.map((skill) => (
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(5,146,18,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
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
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <span style={{ color: "#06D001", fontSize: "13px", fontWeight: 700 }}>
                        {skill.name.slice(0, 2)}
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <span style={{ color: "white", fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.3 }}>
                    {skill.name}
                  </span>
                </div>
              ))}
        </div>
      </div>

      <style>{`
        @keyframes skeletonShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </SectionWrapper>
  );
}