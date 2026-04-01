"use client";

import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import { SectionWrapper, SectionHeader, SkeletonLoader } from "@/components/shared";
import { calculateTotalExperience } from "@/lib/calculateExperience";

export default function AboutSection() {
  const { data: profile, loading: profileLoading } = useFetch("/api/profile");
  const { data: experiences } = useFetch("/api/experiences");
  const { data: projects } = useFetch("/api/projects");

  const expText = experiences
    ? calculateTotalExperience(experiences)
    : null;

  const projectCount = projects ? `${String(projects.length).padStart(2, "0")}+` : null;

  return (
    <SectionWrapper id="about">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Nahid Hasan" subtitle="My introduction" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "clamp(1.5rem, 4vw, 3rem)",
            alignItems: "start",
          }}
        >
          {/* Profile photo */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            {profileLoading ? (
              <SkeletonLoader variant="circle" width="160px" height="160px" />
            ) : (
              <div
                style={{
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
                }}
              >
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
            )}
          </div>

          {/* Text content */}
          <div>
            {profileLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <SkeletonLoader variant="line" width="100%" />
                <SkeletonLoader variant="line" width="90%" />
                <SkeletonLoader variant="line" width="95%" />
                <SkeletonLoader variant="line" width="80%" />
              </div>
            ) : (
              <p
                style={{
                  color: "#bcc4ba",
                  fontSize: "0.938rem",
                  lineHeight: 1.85,
                  marginBottom: "1.75rem",
                }}
              >
                {profile?.bio}
              </p>
            )}

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                gap: "clamp(1.5rem, 4vw, 3rem)",
                marginBottom: "1.75rem",
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  value: "3.70",
                  label: "Final\nCGPA",
                },
                {
                  value: projectCount,
                  label: "Projects\nCompleted",
                  loading: !projectCount,
                },
                {
                  value: expText ? `${expText}` : null,
                  label: "Experience",
                  loading: !expText,
                  small: true,
                },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  {stat.loading ? (
                    <SkeletonLoader variant="line" width="60px" height="28px" style={{ marginBottom: "6px" }} />
                  ) : (
                    <span
                      style={{
                        display: "block",
                        color: "#06D001",
                        fontSize: stat.small ? "1.1rem" : "1.5rem",
                        fontWeight: 700,
                        lineHeight: 1.2,
                        marginBottom: "4px",
                      }}
                    >
                      {stat.value}
                    </span>
                  )}
                  <span
                    style={{
                      display: "block",
                      color: "#bcc4ba",
                      fontSize: "0.75rem",
                      whiteSpace: "pre-line",
                      lineHeight: 1.4,
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Download CV button */}
            <a
              href="/assets/Nahid Hasan.pdf"
              download
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #059212, #06D001)",
                color: "white",
                padding: "10px 22px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(5,146,18,0.3)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(5,146,18,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(5,146,18,0.3)";
              }}
            >
              Download CV
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}