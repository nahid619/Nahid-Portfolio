// components/portfolio/AllProjectsClient.js
// "use client" — handles tab switching, modal open/close, hover effects
// Receives initialProjects + categories as props from the server page
// On tab change fetches from /api/projects?category=xxx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SectionHeader, TabGroup, TechBadge, SkeletonCard } from "@/components/shared";
import ProjectModal from "@/components/portfolio/ProjectModal";

export default function AllProjectsClient({ initialProjects = [], categories = [] }) {
  // Build tabs from DB categories — always add "All" at the front
  const tabs = [
    { label: "All", value: "" },
    ...categories
      .filter(c => c.value !== "")
      .map(c => ({ label: c.name, value: c.value })),
  ];

  const [activeTab,       setActiveTab]  = useState("");
  const [projects,        setProjects]   = useState(initialProjects);
  const [loading,         setLoading]    = useState(false);
  const [selectedProject, setSelected]  = useState(null);

  async function handleTabChange(value) {
    if (value === activeTab) return;
    setActiveTab(value);
    setLoading(true);
    try {
      const url = value
        ? `/api/projects?category=${encodeURIComponent(value)}`
        : "/api/projects";
      const res  = await fetch(url);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Projects fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>

      {/* Back link */}
      <Link
        href="/#portfolio"
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          color: "#bcc4ba", fontSize: "0.875rem",
          textDecoration: "none", marginBottom: "1.5rem",
          transition: "color 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#06D001")}
        onMouseLeave={e => (e.currentTarget.style.color = "#bcc4ba")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to Portfolio
      </Link>

      <SectionHeader
        title="All Projects"
        subtitle={`${projects?.length ?? "..."} projects total`}
        align="left"
      />

      <TabGroup tabs={tabs} active={activeTab} onChange={handleTabChange} />

      {/* Projects grid */}
      <div
        className="all-projects-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : projects?.length === 0
          ? (
            <div style={{
              gridColumn: "1 / -1", textAlign: "center",
              padding: "4rem 0", color: "#bcc4ba",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📁</div>
              <p style={{ fontSize: "1rem" }}>No projects found in this category.</p>
            </div>
          )
          : projects?.map((project, i) => (
              <ProjectCard
                key={project._id}
                project={project}
                index={i}
                onClick={() => setSelected(project)}
              />
            ))
        }
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelected(null)}
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function ProjectCard({ project, index, onClick }) {
  const categoryColors = {
    salesforce: { bg: "#0c2a4a", text: "#60a5fa", label: "Salesforce" },
    sqa:        { bg: "#0e3501", text: "#9BEC00", label: "SQA"        },
    web:        { bg: "#2d1b00", text: "#fb923c", label: "Web"        },
  };
  const cat = categoryColors[project.category] || categoryColors.web;

  return (
    <div
      onClick={onClick}
      style={{
        background: "#00193b",
        border: "1px solid #02275b",
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
        opacity: 0,
        animation: "fadeUp 0.5s ease forwards",
        animationDelay: `${index * 60}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform   = "translateY(-5px)";
        e.currentTarget.style.boxShadow   = "0 10px 32px rgba(5,146,18,0.2)";
        e.currentTarget.style.borderColor = "#059212";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform   = "translateY(0)";
        e.currentTarget.style.boxShadow   = "none";
        e.currentTarget.style.borderColor = "#02275b";
      }}
    >
      {/* Image */}
      <div style={{
        height: "170px",
        background: "linear-gradient(135deg, #021f40, #059212 150%)",
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        {project.projectImageUrl ? (
          <Image
            src={project.projectImageUrl}
            alt={project.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 600px) 100vw, 300px"
          />
        ) : (
          <span style={{ color: "#9BEC00", fontSize: "0.875rem", fontWeight: 600, padding: "0 16px", textAlign: "center" }}>
            {project.title}
          </span>
        )}

        {/* Category badge */}
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          background: cat.bg, color: cat.text,
          fontSize: "0.7rem", fontWeight: 700,
          padding: "3px 9px", borderRadius: "4px", letterSpacing: "0.05em",
        }}>
          {cat.label}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px", textAlign: "left" }}>
        <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700, margin: "0 0 6px", lineHeight: 1.3 }}>
          {project.title}
        </h3>

        <p style={{
          color: "#bcc4ba", fontSize: "0.813rem", lineHeight: 1.6,
          margin: "0 0 12px",
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "14px" }}>
          {project.techStack?.slice(0, 4).map(t => (
            <TechBadge key={t} label={t} />
          ))}
          {project.techStack?.length > 4 && (
            <TechBadge label={`+${project.techStack.length - 4}`} variant="outline" />
          )}
        </div>

        {/* Action links */}
        <div style={{ display: "flex", gap: "8px" }} onClick={e => e.stopPropagation()}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, display: "flex", alignItems: "center",
                justifyContent: "center", gap: "5px",
                background: "linear-gradient(135deg, #059212, #06D001)",
                color: "white", padding: "7px", borderRadius: "6px",
                fontSize: "0.75rem", fontWeight: 700, textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              GitHub →
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, display: "flex", alignItems: "center",
                justifyContent: "center", gap: "5px",
                background: "transparent", border: "1px solid #059212",
                color: "#06D001", padding: "7px", borderRadius: "6px",
                fontSize: "0.75rem", fontWeight: 700, textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#021f40")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              Live →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
