"use client";

import { useState } from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import { SectionWrapper, SectionHeader, TabGroup, SkeletonSkillCard } from "@/components/shared";

const TABS = [
  { label: "Salesforce",   value: "salesforce"   },
  { label: "SQA",          value: "sqa"          },
  { label: "Programming",  value: "programming"  },
  { label: "Web",          value: "web"          },
  { label: "All",          value: ""             },
];

export default function SkillsSection() {
  const [activeTab, setActiveTab] = useState("salesforce");

  const { data: skills, loading } = useFetch("/api/skills", {
    params: activeTab ? { category: activeTab } : {},
  });

  return (
    <SectionWrapper id="skills">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Skills" subtitle="My technical level" />

        <TabGroup tabs={TABS} active={activeTab} onChange={setActiveTab} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "10px",
          }}
        >
          {loading
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
                  <div
                    style={{
                      width: "36px", height: "36px",
                      background: "#011428",
                      borderRadius: "7px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, overflow: "hidden",
                    }}
                  >
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
                  <span
                    style={{
                      color: "white",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {skill.name}
                  </span>
                </div>
              ))}
        </div>
      </div>
    </SectionWrapper>
  );
}