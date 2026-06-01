"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { TabGroup } from "@/components/shared";

export default function SkillsClient({ tabs = [], initialSkills = [], firstSkillTab = "" }) {
  const [activeTab, setActiveTab] = useState(firstSkillTab);
  const [skills,    setSkills]    = useState(initialSkills);
  const [animKey,   setAnimKey]   = useState(0);
  const fetchingRef = useRef(false);

  async function handleTabChange(value) {
    if (value === activeTab || fetchingRef.current) return;
    fetchingRef.current = true;
    setActiveTab(value);
    try {
      const url = value ? `/api/skills?category=${encodeURIComponent(value)}` : "/api/skills";
      const res  = await fetch(url);
      const data = await res.json();
      setSkills(data);
      setAnimKey(k => k + 1); // re-trigger CSS animation on new items
    } catch (err) {
      console.error("Skills fetch error:", err);
    } finally {
      fetchingRef.current = false;
    }
  }

  return (
    <>
      <TabGroup tabs={tabs} active={activeTab} onChange={handleTabChange} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "10px",
        }}
      >
        {skills.map((skill, i) => (
          <div
            key={`${animKey}-${skill._id}`}
            className="skill-card"
            style={{ animationDelay: `${i * 70}ms` }}
            onMouseEnter={e => {
              e.currentTarget.style.transform  = "translateY(-3px)";
              e.currentTarget.style.boxShadow  = "0 6px 20px rgba(5,146,18,0.18)";
              e.currentTarget.style.borderColor = "#06D001";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform  = "translateY(0)";
              e.currentTarget.style.boxShadow  = "none";
              e.currentTarget.style.borderColor = "#059212";
            }}
          >
            <div style={{
              width: "36px", height: "36px",
              background: "#011428", borderRadius: "7px",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, overflow: "hidden",
            }}>
              {skill.iconUrl ? (
                <Image
                  src={skill.iconUrl} alt={skill.name}
                  width={26} height={26}
                  style={{ objectFit: "contain" }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              ) : (
                <span style={{ color: "#06D001", fontSize: "13px", fontWeight: 700 }}>
                  {skill.name.slice(0, 2)}
                </span>
              )}
            </div>
            <span style={{ color: "white", fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.3 }}>
              {skill.name}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .skill-card {
          background: #00193b;
          border: 1px solid #059212;
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: default;
          opacity: 0;
          animation: cardIn 0.55s ease forwards;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </>
  );
}