// components/portfolio/QualificationSection.js
"use client";

import { useFetch } from "@/hooks/useFetch";
import { SectionWrapper, SectionHeader } from "@/components/shared";

// Fallback data — used if DB has no qualifications yet
const FALLBACK = [
  {
    _id: "1",
    title: "B.Sc. CSE",
    subtitle: "Computer Science and Engineering",
    institution: "Varendra University, Rajshahi",
    period: "2020 – 2024",
    detail: "CGPA: 3.70 / 4.00",
    highlights: [
      "Algorithms, DBMS, Data Structures, OOP, OS, Computer Networks",
      "Completed training on Generative AI and Machine Learning",
      "Placed 4th in intra-university coding competition",
    ],
    side: "left",
    order: 1,
  },
  {
    _id: "2",
    title: "HSC — Science",
    subtitle: "Rajshahi Government City College",
    institution: "Rajshahi",
    period: "2016 – 2018",
    detail: "GPA: 4.25 / 5.00",
    highlights: ["Physics, Chemistry, Math, Higher Math, ICT"],
    side: "right",
    order: 2,
  },
  {
    _id: "3",
    title: "SSC — Science",
    subtitle: "Darusha High School",
    institution: "Rajshahi",
    period: "2016",
    detail: "GPA: 5.00 / 5.00 — Golden A+",
    highlights: [],
    side: "left",
    order: 3,
  },
];

function QualCard({ item }) {
  const isLeft = item.side === "left";
  return (
    <div
      style={{
        background: "#00193b",
        border: "1px solid #02275b",
        borderRadius: "10px",
        padding: "14px 16px",
        textAlign: isLeft ? "left" : "right",
        transition: "border-color 0.2s",
      }}
      className={`qual-card ${isLeft ? "qual-card-left" : "qual-card-right"}`}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#059212"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#02275b"}
    >
      <div style={{ color: "white", fontSize: "0.938rem", fontWeight: 700, marginBottom: "3px" }}>{item.title}</div>
      {item.subtitle && <div style={{ color: "#06D001", fontSize: "0.813rem", marginBottom: "2px" }}>{item.subtitle}</div>}
      <div style={{ color: "#bcc4ba", fontSize: "0.75rem", marginBottom: "4px" }}>{item.institution}</div>
      <div style={{ color: "#9BEC00", fontSize: "0.75rem", fontWeight: 600, marginBottom: "8px" }}>
        {item.period}{item.detail ? ` · ${item.detail}` : ""}
      </div>
      {item.highlights?.length > 0 && (
        <ul style={{ margin: 0, padding: isLeft ? "0 0 0 14px" : "0 14px 0 0", listStyle: isLeft ? "disc" : "none" }}>
          {item.highlights.map((h, i) => (
            <li key={i} style={{ color: "#bcc4ba", fontSize: "0.8rem", lineHeight: 1.7 }}>
              {!isLeft && "— "}{h}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function QualificationSection() {
  const { data: dbQuals, loading } = useFetch("/api/qualifications");

  // Use DB data if available, otherwise fall back to hardcoded
  const qualifications = (dbQuals && dbQuals.length > 0) ? dbQuals : FALLBACK;

  return (
    <SectionWrapper id="qualification">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Qualification" subtitle="My personal journey" />

        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {qualifications.map((item, i) => (
            <div
              key={item._id}
              className="qual-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 40px 1fr",
                gap: "16px",
                alignItems: "stretch",
              }}
            >
              {/* Left slot */}
              <div className="qual-left-slot">
                {item.side === "left" ? <QualCard item={item} /> : null}
              </div>

              {/* Center timeline dot + line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "14px" }}>
                <div style={{
                  width: "14px", height: "14px",
                  borderRadius: "50%",
                  background: "#059212",
                  border: "3px solid #011428",
                  boxShadow: "0 0 8px rgba(5,146,18,0.5)",
                  flexShrink: 0, zIndex: 1,
                }} />
                {i < qualifications.length - 1 && (
                  <div style={{ flex: 1, width: "2px", background: "linear-gradient(to bottom, #059212, #02275b)", margin: "4px 0" }} />
                )}
              </div>

              {/* Right slot */}
              <div className="qual-right-slot">
                {item.side === "right" ? <QualCard item={item} /> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}