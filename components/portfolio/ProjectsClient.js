// components/portfolio/ProjectsClient.js
// Phase 4 — NEW FILE
//
// Why this exists:
// ProjectsSection is now a server component.
// But tab switching needs useState + fetch on tab change,
// and project cards need onClick to open the modal.
// All interactive logic lives here.
//
// On first render: uses initialProjects (server-fetched, zero extra request)
// On tab switch: fetches from /api/projects?category=xxx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TabGroup, TechBadge, SkeletonCard } from "@/components/shared";
import ProjectModal from "./ProjectModal";

export default function ProjectsClient({
  tabs            = [],
  initialProjects = [],
  firstProjectTab = "",
  totalCount      = 0,
}) {
  const [activeTab,        setActiveTab]       = useState(firstProjectTab);
  const [projects,         setProjects]        = useState(initialProjects);
  const [loading,          setLoading]         = useState(false);
  const [selectedProject,  setSelected]        = useState(null);

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

  // Show max 3 cards + "See All" card in 4th slot
  const visible = projects.slice(0, 3);

  return (
    <>
      <TabGroup
        tabs={tabs}
        active={activeTab}
        onChange={handleTabChange}
      />

      <div
        className="projects-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : (
            <>
              {visible.map(project => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onClick={() => setSelected(project)}
                />
              ))}

              {/* See All card — always 4th slot */}
              <Link
                href="/projects"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "#00193b",
                  border: "2px dashed #059212",
                  borderRadius: "10px",
                  minHeight: "180px",
                  textDecoration: "none",
                  width: "100%",
                  transition: "background 0.2s, border-color 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background  = "#021f40";
                  e.currentTarget.style.borderColor = "#06D001";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background  = "#00193b";
                  e.currentTarget.style.borderColor = "#059212";
                }}
              >
                <span style={{ fontSize: "2rem", color: "#06D001" }}>→</span>
                <span style={{ color: "#06D001", fontSize: "0.938rem", fontWeight: 700 }}>
                  See All Projects
                </span>
                <span style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>
                  View all {totalCount} projects
                </span>
              </Link>
            </>
          )}
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelected(null)}
      />

      <style>{`
        @keyframes skeletonShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}

function ProjectCard({ project, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#00193b",
        border: "1px solid #02275b",
        borderRadius: "10px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform    = "translateY(-4px)";
        e.currentTarget.style.boxShadow    = "0 8px 28px rgba(5,146,18,0.18)";
        e.currentTarget.style.borderColor  = "#059212";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform    = "translateY(0)";
        e.currentTarget.style.boxShadow    = "none";
        e.currentTarget.style.borderColor  = "#02275b";
      }}
    >
      {/* Image */}
      <div style={{
        height: "140px",
        background: "linear-gradient(135deg, #021f40, #059212 120%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
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
          <span style={{
            color: "#9BEC00",
            fontSize: "0.813rem",
            fontWeight: 600,
            padding: "0 12px",
            textAlign: "center",
          }}>
            {project.title}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px" }}>
        <h3 style={{
          color: "white",
          fontSize: "0.938rem",
          fontWeight: 700,
          margin: "0 0 8px",
        }}>
          {project.title}
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {project.techStack?.slice(0, 4).map(t => (
            <TechBadge key={t} label={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
