// components/portfolio/AboutSection.js
import Image from "next/image";
import { SectionWrapper, SectionHeader } from "@/components/shared";

// No "use client" — this is a server component
// All data comes in as props from page.js
// Hover effect on CV button handled via CSS class (no JS event handlers in server components)

export default function AboutSection({ profile, expText, projectCount }) {
  return (
    <>
      <style>{`
        .about-cv-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          background: linear-gradient(135deg, #059212, #06D001);
          color: white;
          padding: 10px 22px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(5,146,18,0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .about-cv-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(5,146,18,0.4);
        }
      `}</style>

      <SectionWrapper id="about">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
          <SectionHeader title="Nahid Hasan" subtitle="My introduction" />

          <div
            className="about-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "clamp(1.5rem, 4vw, 3rem)",
              alignItems: "start",
              justifyItems: "center",
            }}
          >
            {/* Photo */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{
                width: "clamp(110px, 14vw, 160px)",
                height: "clamp(110px, 14vw, 160px)",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #059212",
                boxShadow: "0 0 24px rgba(5,146,18,0.25)",
                background: "#00193b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
              }}>
                {profile?.profileImageUrl ? (
                  <Image
                    src={profile.profileImageUrl}
                    alt="Nahid Hasan"
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="160px"
                  />
                ) : (
                  <span style={{ color: "#06D001", fontSize: "2.5rem", fontWeight: 700 }}>NH</span>
                )}
              </div>
            </div>

            {/* Text */}
            <div>
              <p
                className="about-bio"
                style={{
                  color: "#bcc4ba",
                  fontSize: "0.938rem",
                  lineHeight: 1.85,
                  marginBottom: "1.75rem",
                  textAlign: "left",
                }}
              >
                {profile?.bio}
              </p>

              {/* Stats */}
              <div
                className="about-stats"
                style={{
                  display: "flex",
                  gap: "clamp(1.5rem, 4vw, 3rem)",
                  marginBottom: "1.75rem",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { value: projectCount, label: "Projects\nCompleted" },
                  { value: expText,      label: "Experience", small: true },
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <span style={{
                      display: "block",
                      color: "#06D001",
                      fontSize: stat.small ? "1.1rem" : "1.5rem",
                      fontWeight: 700,
                      lineHeight: 1.2,
                      marginBottom: "4px",
                    }}>
                      {stat.value}
                    </span>
                    <span style={{
                      display: "block",
                      color: "#bcc4ba",
                      fontSize: "0.75rem",
                      whiteSpace: "pre-line",
                      lineHeight: 1.4,
                    }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Download CV */}
              <div className="about-buttons" style={{ width: "100%" }}>
                <a
                  href="/api/cv-download"
                  className="about-cv-btn"
                  style={{
                    opacity: profile?.cvFileUrl ? 1 : 0.5,
                    pointerEvents: profile?.cvFileUrl ? "auto" : "none",
                  }}
                >
                  Download CV
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
