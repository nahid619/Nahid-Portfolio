"use client";

import { useState, useEffect } from "react";

export default function HeroSection({ onContactClick }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const fadeIn = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

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
        @keyframes scrollBounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(6px); }
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
        }
        .hero-social-icon:hover {
          background: #021f40;
          border-color: #059212;
          transform: translateY(-3px);
        }
        .hero-contact-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #059212, #06D001);
          color: white; border: none;
          padding: 13px 28px;
          border-radius: 8px;
          font-size: 0.938rem; font-weight: 700;
          font-family: var(--font-poppins), Poppins, sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(5,146,18,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
        }
        .hero-contact-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(5,146,18,0.45);
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
          <div>
            {/* Greeting badge */}
            <div style={{ ...fadeIn(0), marginBottom: "1.25rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(5,146,18,0.1)",
                  border: "1px solid rgba(5,146,18,0.3)",
                  color: "#9BEC00",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  padding: "5px 14px",
                  borderRadius: "20px",
                  letterSpacing: "0.05em",
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#06D001", display: "inline-block", animation: "blobGlow 2s ease infinite" }} />
                AVAILABLE FOR WORK
              </span>
            </div>

            {/* Name */}
            <h1
              style={{
                ...fadeIn(100),
                color: "#ffffff",
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: "0.75rem",
                letterSpacing: "-0.02em",
              }}
            >
              Hi, I'm{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #06D001, #9BEC00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Nahid Hasan
              </span>
            </h1>

            {/* Role */}
            <h2
              style={{
                ...fadeIn(200),
                color: "#bcc4ba",
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                fontWeight: 500,
                marginBottom: "1.25rem",
                lineHeight: 1.4,
              }}
            >
              Salesforce Technical Consultant Level-1
            </h2>

            {/* Description */}
            <p
              style={{
                ...fadeIn(300),
                color: "#bcc4ba",
                fontSize: "0.938rem",
                lineHeight: 1.8,
                maxWidth: "520px",
                marginBottom: "2rem",
              }}
            >
              Salesforce Technical Consultant & QA Automation Engineer with hands-on experience automating business processes and ensuring quality delivery. Skilled in Flow Builder automation, end-to-end QA testing, API testing with Postman, and Salesforce configuration.
            </p>

            {/* Buttons + social */}
            <div
              style={{
                ...fadeIn(400),
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <button className="hero-contact-btn" onClick={onContactClick}>
                Contact Me
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.86A16 16 0 0 0 13 13.91l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 15.22z"/>
                </svg>
              </button>

              <a href="/assets/Nahid Hasan.pdf" download className="hero-contact-btn"
                style={{ background: "transparent", border: "1px solid #059212", color: "#06D001", boxShadow: "none" }}
              >
                Download CV
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>

              {/* Social icons */}
              <div style={{ display: "flex", gap: "8px", marginLeft: "4px" }}>
                <a href="https://www.linkedin.com/in/nahid-hasan-0274881a7/" target="_blank" rel="noopener noreferrer" className="hero-social-icon" title="LinkedIn">in</a>
                <a href="https://github.com/nahid619" target="_blank" rel="noopener noreferrer" className="hero-social-icon" title="GitHub">GH</a>
              </div>
            </div>
          </div>

          {/* RIGHT: animated blob */}
          <div
            style={{
              ...fadeIn(200),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <div
              style={{
                width: "clamp(180px, 22vw, 260px)",
                height: "clamp(180px, 22vw, 260px)",
                background: "linear-gradient(135deg, #059212 0%, #06D001 60%, #9BEC00 100%)",
                borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
                animation: "blobMorph 6s ease-in-out infinite, blobGlow 3s ease-in-out infinite",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {/* Profile image placeholder — will show initials until image uploaded */}
              <span
                style={{
                  color: "white",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 700,
                  userSelect: "none",
                  letterSpacing: "-0.02em",
                }}
              >
                NH
              </span>
            </div>

            {/* Scroll down indicator */}
            <a
              href="#about"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                color: "#bcc4ba",
                fontSize: "0.75rem",
                textDecoration: "none",
                animation: "scrollBounce 2s ease-in-out infinite",
              }}
            >
              <span>Scroll</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}