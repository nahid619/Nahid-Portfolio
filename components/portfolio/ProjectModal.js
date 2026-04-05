// components/portfolio/ProjectModal.js
"use client";

import Image from "next/image";
import { Modal, TechBadge } from "@/components/shared";

export default function ProjectModal({ project, isOpen, onClose }) {
  if (!project) return null;

  const footer = (
    <>
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #059212, #06D001)",
            color: "white",
            border: "none",
            borderRadius: "7px",
            padding: "10px",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: "pointer",
            textAlign: "center",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          View on GitHub →
        </a>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            background: "transparent",
            border: "1px solid #059212",
            color: "#06D001",
            borderRadius: "7px",
            padding: "10px",
            fontSize: "0.875rem",
            fontWeight: 700,
            cursor: "pointer",
            textAlign: "center",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          Live Preview →
        </a>
      )}
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="520px" footer={footer}>
      {/* Project image */}
      <div
        style={{
          height: "160px",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "16px",
          background: "linear-gradient(135deg, #059212 0%, #011428 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {project.projectImageUrl ? (
          <Image
            src={project.projectImageUrl}
            alt={project.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="520px"
          />
        ) : (
          <span style={{ color: "#9BEC00", fontSize: "0.875rem", fontWeight: 600 }}>
            {project.title}
          </span>
        )}
      </div>

      {/* Title + date */}
      <h3 style={{ color: "white", fontSize: "1.1rem", fontWeight: 700, margin: "0 0 4px" }}>
        {project.title}
      </h3>
      <div style={{ color: "#bcc4ba", fontSize: "0.8rem", marginBottom: "16px" }}>
        {project.publishedDate
          ? new Date(project.publishedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : ""}
      </div>

      {/* Tech stack */}
      {project.techStack?.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <SectionLabel>Tech Stack</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {project.techStack.map((t) => <TechBadge key={t} label={t} />)}
          </div>
        </div>
      )}

      {/* About */}
      {project.description && (
        <div style={{ marginBottom: "16px" }}>
          <SectionLabel>About the Project</SectionLabel>
          <p style={{ color: "#bcc4ba", fontSize: "0.9rem", lineHeight: 1.8, margin: 0 }}>
            {project.description}
          </p>
        </div>
      )}

      {/* Highlights */}
      {project.highlights?.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <SectionLabel>Key Highlights</SectionLabel>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {project.highlights.map((h, i) => (
              <li key={i} style={{ color: "#bcc4ba", fontSize: "0.875rem", lineHeight: 1.8, display: "flex", gap: "8px" }}>
                <span style={{ color: "#06D001", flexShrink: 0 }}>✓</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Challenges */}
      {project.challenges && (
        <div style={{ marginBottom: "16px" }}>
          <SectionLabel>Challenges & Learnings</SectionLabel>
          <p style={{ color: "#bcc4ba", fontSize: "0.9rem", lineHeight: 1.8, margin: 0 }}>
            {project.challenges}
          </p>
        </div>
      )}

      {/* Video */}
      {project.videoUrl && (
        <div>
          <SectionLabel>Demo Video</SectionLabel>
          <a
            href={project.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              background: "#011428",
              border: "1px dashed #028f00",
              borderRadius: "8px",
              padding: "16px",
              color: "#059212",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              transition: "border-color 0.2s",
            }}
          >
            ▶ Watch Demo Video
          </a>
        </div>
      )}
    </Modal>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        color: "#06D001",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: "8px",
      }}
    >
      {children}
    </div>
  );
}