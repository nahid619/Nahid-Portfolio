// components/portfolio/HeroSection.js
// Server component — no "use client"
// All interactive parts (Contact button, scroll button) are separate client components

import Image from "next/image";
import HeroContactButton from "./HeroContactButton";
import HeroScrollButton from "./HeroScrollButton";

export default function HeroSection({ profile, heroLinks = [] }) {
  const description =
    profile?.heroDescription ||
    "Salesforce Technical Consultant & QA Automation Engineer with hands-on experience automating business processes and ensuring quality delivery.";

  const jobTitle =
    profile?.jobTitle || "Salesforce Technical Consultant Level-1";

  return (
    <>
      <style>{`
        @keyframes blobMorph {
          0%,100% { border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; }
          33%      { border-radius: 40% 60% 45% 55% / 60% 40% 60% 40%; }
          66%      { border-radius: 55% 45% 60% 40% / 45% 55% 45% 55%; }
        }
        @keyframes blobGlow {
          0%,100% { box-shadow: 0 0 40px rgba(5,146,18,0.3); }
          50%      { box-shadow: 0 0 70px rgba(6,208,1,0.45); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-social-icon {
          width: 38px; height: 38px;
          border-radius: 9px;
          background: #00193b;
          border: 1px solid #02275b;
          display: flex; align-items: center; justify-content: center;
          color: #06D001;
          font-size: 13px; font-weight: 700;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          position: relative; overflow: hidden;
        }
        .hero-social-icon:hover {
          background: #021f40;
          border-color: #059212;
          transform: translateY(-3px);
        }
        .hero-cv-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent;
          border: 1px solid #059212;
          color: #06D001;
          padding: 13px 28px;
          border-radius: 8px;
          font-size: 0.938rem; font-weight: 700;
          font-family: var(--font-poppins), Poppins, sans-serif;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .hero-cv-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(5,146,18,0.2);
        }
        .hero-fade-1 { animation: heroFadeUp 0.7s ease 0.1s both; }
        .hero-fade-2 { animation: heroFadeUp 0.7s ease 0.2s both; }
        .hero-fade-3 { animation: heroFadeUp 0.7s ease 0.3s both; }
        .hero-fade-4 { animation: heroFadeUp 0.7s ease 0.4s both; }
        .hero-fade-5 { animation: heroFadeUp 0.7s ease 0.5s both; }
        @media (max-width: 860px) {
          .hero-cv-btn { width: 100%; justify-content: center; }
          .hero-social-icons-wrap { justify-content: center; width: 100%; margin-left: 0 !important; }
          .hero-badge-wrap { justify-content: center !important; }
          .hero-desc { max-width: 100% !important; text-align: center; }
        }
      `}</style>

      <section
        id="home"
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          padding: "4rem 1.5rem 3rem",
          borderBottom: "1px solid #02275b",
        }}
      >
        <div
          className="hero-grid"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {/* LEFT: text content */}
          <div className="hero-text-col" style={{ display: "flex", flexDirection: "column" }}>

            {/* Greeting badge */}
            <div className="hero-fade-1 hero-badge-wrap" style={{ marginBottom: "1.25rem", width: "100%", display: "flex", justifyContent: "flex-start" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "rgba(5,146,18,0.1)",
                border: "1px solid rgba(5,146,18,0.3)",
                color: "#9BEC00", fontSize: "0.75rem", fontWeight: 600,
                padding: "5px 14px", borderRadius: "20px", letterSpacing: "0.05em",
              }}>
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "#06D001", display: "inline-block",
                  animation: "blobGlow 2s ease infinite",
                }} />
                AVAILABLE FOR WORK
              </span>
            </div>

            {/* Name */}
            <h1 className="hero-fade-2" style={{
              color: "#ffffff",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 700, lineHeight: 1.15,
              marginBottom: "0.75rem", letterSpacing: "-0.02em",
            }}>
              Hi, I&apos;m{" "}
              <span style={{
                background: "linear-gradient(135deg, #06D001, #9BEC00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Nahid Hasan
              </span>
            </h1>

            {/* Role */}
            <h2 className="hero-fade-3" style={{
              color: "#bcc4ba",
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              fontWeight: 500, marginBottom: "1.25rem", lineHeight: 1.4,
            }}>
              {jobTitle}
            </h2>

            {/* Description */}
            <p className="hero-desc hero-fade-4" style={{
              color: "#bcc4ba", fontSize: "0.938rem",
              lineHeight: 1.8, maxWidth: "520px", marginBottom: "2rem",
            }}>
              {description}
            </p>

            {/* Buttons + social icons */}
            <div className="hero-buttons hero-fade-5" style={{
              display: "flex", alignItems: "center",
              flexWrap: "wrap", gap: "1rem", width: "100%",
            }}>
              {/* Contact Me — client component */}
              <HeroContactButton />

              {/* Download CV — plain anchor, no JS handlers needed */}
              <a
                href={profile?.cvFileUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cv-btn"
                style={{
                  opacity: profile?.cvFileUrl ? 1 : 0.5,
                  pointerEvents: profile?.cvFileUrl ? "auto" : "none",
                }}
                title={profile?.cvFileUrl ? "Download CV" : "CV not uploaded yet"}
              >
                Download CV
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>

              {/* Social icons — plain anchors, CSS handles hover */}
              {heroLinks.length > 0 && (
                <div className="hero-social-icons-wrap" style={{ display: "flex", gap: "8px", marginLeft: "4px" }}>
                  {heroLinks.map(link => (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hero-social-icon"
                      title={link.name}
                    >
                      {link.iconImageUrl ? (
                        <Image src={link.iconImageUrl} alt={link.name} fill style={{ objectFit: "contain" }} sizes="38px" />
                      ) : (
                        link.logo
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: animated blob + scroll button */}
          <div className="hero-blob-wrap hero-fade-3" style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "2rem",
          }}>
            <div style={{
              width: "clamp(180px, 22vw, 260px)",
              height: "clamp(180px, 22vw, 260px)",
              background: "linear-gradient(135deg, #059212 0%, #06D001 60%, #9BEC00 100%)",
              borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
              animation: "blobMorph 6s ease-in-out infinite, blobGlow 3s ease-in-out infinite",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", flexShrink: 0, position: "relative",
            }}>
              {profile?.profileImageUrl ? (
                <Image src={profile.profileImageUrl} alt="Nahid Hasan" fill style={{ objectFit: "cover" }} sizes="260px" priority />
              ) : (
                <span style={{ color: "white", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 700, userSelect: "none", letterSpacing: "-0.02em" }}>
                  NH
                </span>
              )}
            </div>

            {/* Scroll button — client component because it needs onClick */}
            <HeroScrollButton />
          </div>
        </div>
      </section>
    </>
  );
}
