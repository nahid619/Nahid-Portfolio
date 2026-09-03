// components/portfolio/SkillsClient.js
"use client";

// BUG FIX — "clicked Salesforce but still see every skill"
//
// What was wrong:
//   handleTabChange called setActiveTab(value) synchronously, then awaited
//   fetch("/api/skills?category=..."). The tab underline moved instantly,
//   but the grid kept rendering the PREVIOUS category's skills until the
//   request resolved. With force-dynamic routes + a cold MongoDB Atlas
//   connection that gap is regularly 2-5s, so the UI showed stale data as
//   if it were the answer.
//
//   Worse, `if (... || fetchingRef.current) return;` meant any tab clicked
//   while a request was in flight was silently DISCARDED — the highlight
//   didn't even move. That's the "feels stuck" symptom.
//
// The fix:
//   Don't fetch at all. lib/data.js already loads every skill server-side
//   and ships it with the page HTML, so filtering happens in memory.
//   Tab switching is now instant, there is no loading state to get stuck
//   in, and the race condition is structurally impossible.
//
//   /api/skills still exists — the admin panel uses it.

import { useState, useMemo } from "react";
import Image from "next/image";
import { TabGroup } from "@/components/shared";

export default function SkillsClient({
  tabs          = [],
  skills        = [],   // ALL skills, from the server
  firstSkillTab = "",
}) {
  const [activeTab, setActiveTab] = useState(firstSkillTab);

  // An empty tab value means "All".
  const visible = useMemo(
    () => (activeTab ? skills.filter(s => s.category === activeTab) : skills),
    [skills, activeTab]
  );

  return (
    <>
      <TabGroup tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "10px",
        }}
      >
        {visible.length === 0 ? (
          <div style={{
            gridColumn: "1 / -1", textAlign: "center",
            padding: "2.5rem 0", color: "#bcc4ba", fontSize: "0.875rem",
          }}>
            No skills listed in this category yet.
          </div>
        ) : visible.map((skill, i) => (
          <div
            /*
              Keying on activeTab replaces the old animKey counter: changing
              tab changes every key, so React remounts the cards and the
              cardIn animation replays. One less piece of state.
            */
            key={`${activeTab}-${skill._id}`}
            className="skill-card"
            style={{ animationDelay: `${i * 70}ms` }}
            onMouseEnter={e => {
              e.currentTarget.style.transform   = "translateY(-3px)";
              e.currentTarget.style.boxShadow   = "0 6px 20px rgba(5,146,18,0.18)";
              e.currentTarget.style.borderColor = "#06D001";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform   = "translateY(0)";
              e.currentTarget.style.boxShadow   = "none";
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