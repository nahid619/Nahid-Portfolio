"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import { SectionWrapper, SectionHeader, ArrowNav, SkeletonLoader } from "@/components/shared";

const VISIBLE = 4; // cards visible at once

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
  }, [certs?.length, maxIdx]); // ✅ both are numbers — stable

  return (
    <SectionWrapper id="certification">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Certifications" subtitle="Training and certifications" />

        {/* Cards strip */}
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              gap: "12px",
              transform: `translateX(calc(-${idx} * (160px + 12px)))`,
              transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {loading
              ? Array.from({ length: VISIBLE }).map((_, i) => (
                  <div key={i} style={{ minWidth: "160px", flexShrink: 0 }}>
                    <SkeletonLoader variant="card" height="120px" />
                    <SkeletonLoader variant="line" width="80%" style={{ marginTop: "8px" }} />
                  </div>
                ))
              : certs?.map((cert) => (
                  <div
                    key={cert._id}
                    style={{
                      minWidth: "160px",
                      flexShrink: 0,
                      background: "#00193b",
                      border: "1px solid #02275b",
                      borderRadius: "10px",
                      overflow: "hidden",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#059212")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#02275b")}
                  >
                    {/* Image */}
                    <div
                      style={{
                        height: "110px",
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
                          sizes="160px"
                        />
                      ) : (
                        <span style={{ fontSize: "2rem" }}>📜</span>
                      )}
                    </div>

                    {/* Title */}
                    <div
                      style={{
                        padding: "8px 10px",
                        color: "#9BEC00",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        lineHeight: 1.4,
                        textAlign: "center",
                      }}
                    >
                      {cert.title}
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
    </SectionWrapper>
  );
}