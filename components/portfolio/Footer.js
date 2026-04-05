// components/portfolio/Footer.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";

const QUICK_LINKS = [
  { label: "Home",          href: "#home"          },
  { label: "About",         href: "#about"         },
  { label: "Experience",    href: "#experience"    },
  { label: "Projects",      href: "#portfolio"     },
  { label: "Certifications",href: "#certification" },
  { label: "Contact",       href: "#contact"       },
];

export default function Footer() {
  const { data: footerLinks } = useFetch("/api/social-links", { params: { location: "footer" } });
  // Same source as HeroSection — keeps role in sync
  const { data: profile }     = useFetch("/api/profile");

  // Animate in when footer enters viewport
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = document.getElementById("site-footer");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fadeUp = (delay = 0) => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  });

  return (
    <>
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 6px rgba(6,208,1,0.5); }
          50%       { box-shadow: 0 0 14px rgba(6,208,1,0.9); }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .footer-social-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 0.5px solid rgba(255,255,255,0.08);
          color: #bcc4ba;
          padding: 7px 12px;
          border-radius: 8px;
          font-size: 0.813rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.25s, border-color 0.25s, color 0.25s, transform 0.2s;
          width: fit-content;
        }
        .footer-social-link:hover {
          background: rgba(6,208,1,0.08);
          border-color: rgba(6,208,1,0.35);
          color: #06D001;
          transform: translateX(4px);
        }
        .footer-nav-link {
          color: #bcc4ba;
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.2s, padding-left 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .footer-nav-link:hover {
          color: #06D001;
          padding-left: 6px;
        }
      `}</style>

      <footer id="site-footer">
        {/* ── Animated gradient divider line ── */}
        <div style={{
          height: "2px",
          // background: "linear-gradient(90deg, transparent, #059212, #9BEC00, #06D001, transparent)",
          background: "linear-gradient(110deg, transparent, #059212, #06D001, transparent)",
          //background: "linear-gradient(135deg, #059212 0%, #028f00 100%)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 4s ease infinite",
        }} />

        <div style={{
          background: "linear-gradient(180deg, #00193b 0%, #011428 100%)",
          padding: "3rem 0 0",
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>

            <div
              className="footer-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1fr",
                gap: "2rem",
                marginBottom: "2.5rem",
                alignItems: "start",
              }}
            >
              {/* ── Col 1: Brand ── */}
              <div style={fadeUp(0)}>
                {/* NH Avatar */}
                <div style={{
                  width: "44px", height: "44px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #059212, #06D001)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.875rem", fontWeight: 700, color: "#011428",
                  marginBottom: "14px",
                  boxShadow: "0 4px 16px rgba(5,146,18,0.35)",
                }}>
                  NH
                </div>

                <h2 style={{
                  color: "#ffffff",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  margin: "0 0 4px",
                  letterSpacing: "-0.01em",
                }}>
                  Nahid Hasan
                </h2>

                {/* Role — pulled from DB, same as HeroSection */}
                <p style={{ color: "#06D001", fontSize: "0.813rem", margin: "0 0 10px", fontWeight: 500 }}>
                  {profile?.jobTitle || "Salesforce Technical Consultant"}
                </p>

                <p style={{
                  color: "#bcc4ba",
                  fontSize: "0.75rem",
                  lineHeight: 1.7,
                  maxWidth: "200px",
                  opacity: 0.8,
                  margin: "0 0 16px",
                }}>
                  Building reliable Salesforce solutions &amp; QA automation from Bangladesh.
                </p>

                {/* Available for work badge */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(5,146,18,0.12)",
                  border: "0.5px solid rgba(6,208,1,0.35)",
                  borderRadius: "20px",
                  padding: "4px 12px",
                }}>
                  <span style={{
                    width: "7px", height: "7px",
                    borderRadius: "50%",
                    background: "#06D001",
                    flexShrink: 0,
                    animation: "pulseGlow 2s ease-in-out infinite",
                  }} />
                  <span style={{ fontSize: "0.75rem", color: "#06D001", fontWeight: 500 }}>
                    Open to opportunities
                  </span>
                </div>
              </div>

              {/* ── Col 2: Quick Links ── */}
              <div style={fadeUp(100)}>
                <div style={{
                  color: "#06D001",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}>
                  Navigate
                </div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {QUICK_LINKS.map(link => (
                    <li key={link.href}>
                      <a href={link.href} className="footer-nav-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Col 3: Social Links from DB ── */}
              <div style={fadeUp(200)}>
                <div style={{
                  color: "#06D001",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}>
                  Find Me On
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {footerLinks?.map(link => (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social-link"
                    >
                      {link.iconImageUrl ? (
                        <span style={{
                          width: "16px", height: "16px",
                          position: "relative",
                          display: "inline-block",
                          flexShrink: 0,
                        }}>
                          <Image
                            src={link.iconImageUrl}
                            alt={link.name}
                            fill
                            style={{ objectFit: "contain" }}
                            sizes="16px"
                          />
                        </span>
                      ) : (
                        <span style={{ fontSize: "14px", lineHeight: 1 }}>{link.logo}</span>
                      )}
                      <span>{link.name}</span>
                      <span style={{ marginLeft: "auto", opacity: 0.45, fontSize: "0.75rem" }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Bottom bar ── */}
            <div style={{
              ...fadeUp(300),
              borderTop: "0.5px solid rgba(2,39,91,0.8)",
              paddingTop: "1.25rem",
              paddingBottom: "1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}>
              <p style={{ color: "#bcc4ba", fontSize: "0.75rem", opacity: 0.5, margin: 0 }}>
                © {new Date().getFullYear()} Nahid Hasan. All rights reserved.
              </p>
              <p style={{ color: "#bcc4ba", fontSize: "0.75rem", opacity: 0.5, margin: 0 }}>
                Rajshahi, Bangladesh
              </p>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}