// components/portfolio/CertSection.js
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import { SectionWrapper, SectionHeader, ArrowNav, SkeletonLoader } from "@/components/shared";

const VISIBLE   = 3;    // cards visible at once
const CARD_W    = 220;  // fixed card width in px
const CARD_GAP  = 16;   // gap between cards in px

export default function CertSection() {
  const { data: certs, loading } = useFetch("/api/certifications");
  const [idx, setIdx] = useState(0);

  const maxIdx = Math.max(0, (certs?.length || 0) - VISIBLE);

  const next = useCallback(() => {
    setIdx((i) => (i >= maxIdx ? 0 : i + 1));
  }, [maxIdx]);

  const prev = () => setIdx((i) => Math.max(0, i - 1));

  // Auto-rotate every 3s
  useEffect(() => {
    if (!certs?.length) return;
    const timer = setInterval(() => {
      setIdx((i) => (i >= maxIdx ? 0 : i + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [certs?.length, maxIdx]);

  return (
    <SectionWrapper id="certification">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Certifications" subtitle="Training and certifications" />

        {/* Cards strip — overflow hidden clips cards outside the visible window */}
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              gap: `${CARD_GAP}px`,
              transform: `translateX(calc(-${idx} * ${CARD_W + CARD_GAP}px))`,
              transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {loading
              ? Array.from({ length: VISIBLE }).map((_, i) => (
                  <div key={i} style={{ width: `${CARD_W}px`, flexShrink: 0 }}>
                    <SkeletonLoader variant="card" height="130px" />
                    <div style={{ marginTop: "8px", height: "52px", borderRadius: "6px", background: "linear-gradient(90deg,#02275b 25%,#02356e 50%,#02275b 75%)", backgroundSize: "200% 100%", animation: "certShimmer 1.5s ease-in-out infinite" }} />
                  </div>
                ))
              : certs?.map((cert) => (
                  <div
                    key={cert._id}
                    style={{
                      // ── Fixed identical size for every card ──
                      width:     `${CARD_W}px`,
                      flexShrink: 0,
                      background: "#00193b",
                      border: "1px solid #02275b",
                      borderRadius: "10px",
                      overflow: "hidden",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#059212";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(5,146,18,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#02275b";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Image area — fixed height */}
                    <div
                      style={{
                        height: "130px",
                        flexShrink: 0,
                        background: "#02275b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
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

                    {/* Title area — fixed height, text clamped to 2 lines */}
                    <div
                      style={{
                        height: "56px",
                        flexShrink: 0,
                        padding: "0 10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <span
                        style={{
                          color: "#9BEC00",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          lineHeight: 1.4,
                          textAlign: "center",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {cert.title}
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Arrows */}
        {!loading && (
          <ArrowNav
            onPrev={prev}
            onNext={next}
            prevDisabled={idx === 0}
            nextDisabled={idx >= maxIdx}
          />
        )}

        {/* Dots — one per cert */}
        {!loading && certs?.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "12px" }}>
            {certs.map((_, i) => (
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
        )}
      </div>

      <style>{`
        @keyframes certShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </SectionWrapper>
  );
}