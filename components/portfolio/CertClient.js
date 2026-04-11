// components/portfolio/CertClient.js
// Phase 4 — NEW FILE
//
// Why this exists:
// CertSection is now a server component.
// But the carousel needs useState (index) and useEffect (auto-rotate).
// All interactive carousel logic lives here.
// The certifications data comes in as a prop — no fetching.

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowNav } from "@/components/shared";

const VISIBLE = 3;

function useCardWidth() {
  const [w, setW] = useState(220);
  useEffect(() => {
    function calc() {
      const vw = window.innerWidth;
      if      (vw < 480) setW(Math.floor((vw - 48) / 2));
      else if (vw < 768) setW(Math.floor((vw - 64) / 2));
      else               setW(220);
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return w;
}

export default function CertClient({ certifications = [] }) {
  const [idx,    setIdx]    = useState(0);
  const CARD_W   = useCardWidth();
  const CARD_GAP = 12;

  const maxIdx = Math.max(0, certifications.length - VISIBLE);

  const next = useCallback(() => {
    setIdx(i => (i >= maxIdx ? 0 : i + 1));
  }, [maxIdx]);

  const prev = () => setIdx(i => Math.max(0, i - 1));

  // Auto-rotate every 3s
  useEffect(() => {
    if (!certifications.length) return;
    const timer = setInterval(() => {
      setIdx(i => (i >= maxIdx ? 0 : i + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [certifications.length, maxIdx, CARD_W]);

  if (!certifications.length) return null;

  return (
    <>
      {/* Cards strip */}
      <div style={{ overflow: "hidden" }}>
        <div style={{
          display: "flex",
          gap: `${CARD_GAP}px`,
          transform: `translateX(calc(-${idx} * ${CARD_W + CARD_GAP}px))`,
          transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
        }}>
          {certifications.map(cert => (
            <div
              key={cert._id}
              className="cert-card"
              style={{
                width:      `${CARD_W}px`,
                flexShrink: 0,
                background: "#00193b",
                border: "1px solid #02275b",
                borderRadius: "10px",
                overflow: "hidden",
                transition: "border-color 0.2s, box-shadow 0.2s",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#059212";
                e.currentTarget.style.boxShadow   = "0 4px 16px rgba(5,146,18,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#02275b";
                e.currentTarget.style.boxShadow   = "none";
              }}
            >
              {/* Image area — fixed height */}
              <div style={{
                height: "130px",
                flexShrink: 0,
                background: "#02275b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
              }}>
                {cert.imageUrl ? (
                  <Image
                    src={cert.imageUrl}
                    alt={cert.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes={`${CARD_W}px`}
                  />
                ) : (
                  <span style={{ fontSize: "2rem" }}>📜</span>
                )}
              </div>

              {/* Title area — fixed height, clamped to 2 lines */}
              <div style={{
                height: "56px",
                flexShrink: 0,
                padding: "0 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}>
                <span style={{
                  color: "#9BEC00",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  lineHeight: 1.4,
                  textAlign: "center",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {cert.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow nav */}
      <ArrowNav
        onPrev={prev}
        onNext={next}
        prevDisabled={idx === 0}
        nextDisabled={idx >= maxIdx}
      />

      {/* Dots */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "6px",
        marginTop: "12px",
      }}>
        {certifications.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(Math.min(i, maxIdx))}
            style={{
              width: "8px", height: "8px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              background: i === idx ? "#059212" : "#02275b",
              transition: "background 0.2s, transform 0.2s",
              transform: i === idx ? "scale(1.3)" : "scale(1)",
              padding: 0,
            }}
            aria-label={`Go to certification ${i + 1}`}
          />
        ))}
      </div>

      <style>{`
        @keyframes certShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 600px) { .cert-card { min-width: 160px !important; } }
        @media (max-width: 400px) { .cert-card { min-width: 140px !important; } }
      `}</style>
    </>
  );
}
