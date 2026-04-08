// components/portfolio/ProjectsSection.js
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import { SectionWrapper, SectionHeader, TabGroup, TechBadge, SkeletonCard } from "@/components/shared";
import ProjectModal from "./ProjectModal";

export default function ProjectsSection() {
  // Fetch tabs from DB — sorted by order ascending
  const { data: categories, loading: catsLoading } = useFetch("/api/categories?section=projects");

  // undefined = user has not clicked a tab yet
  const [activeTab, setActiveTab]       = useState(undefined);
  const [selectedProject, setSelected] = useState(null);

  // Derive the real active tab: user choice OR first DB category OR null (skip fetch)
  // No useEffect needed — computed inline on every render, no cascading setState
  const effectiveTab = activeTab !== undefined ? activeTab : (categories?.[0]?.value ?? null);

  // Fetch projects — skip until effectiveTab resolves
  const { data: projects, loading: projectsLoading } = useFetch("/api/projects", {
    params: effectiveTab && effectiveTab !== "" ? { category: effectiveTab } : {},
    skip: effectiveTab === null,
  });

  // Map DB categories to TabGroup shape
  const tabs = categories?.map(c => ({ label: c.name, value: c.value })) || [];

  // Show max 3 project cards + the "See All" card in the 4th slot
  const visible = projects?.slice(0, 3) || [];

  return (
    <SectionWrapper id="portfolio">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Projects" subtitle="Notable works" />

        {/* Only render tabs once categories have loaded — avoids empty tab flash */}
        {!catsLoading && tabs.length > 0 && (
          <TabGroup
            tabs={tabs}
            active={effectiveTab ?? ""}
            onChange={setActiveTab}
          />
        )}

        {/* Skeleton tab placeholders while categories load */}
        {catsLoading && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "1.5rem" }}>
            {[90, 55, 65].map((w, i) => (
              <div
                key={i}
                style={{
                  width: `${w}px`, height: "32px", borderRadius: "4px",
                  background: "linear-gradient(90deg,#02275b 25%,#02356e 50%,#02275b 75%)",
                  backgroundSize: "200% 100%",
                  animation: "skeletonShimmer 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        )}

        {/* Projects grid */}
        <div
          className="projects-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {projectsLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : (
              <>
                {visible.map((project) => (
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#021f40";
                    e.currentTarget.style.borderColor = "#06D001";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#00193b";
                    e.currentTarget.style.borderColor = "#059212";
                  }}
                >
                  <span style={{ fontSize: "2rem", color: "#06D001" }}>→</span>
                  <span style={{ color: "#06D001", fontSize: "0.938rem", fontWeight: 700 }}>
                    See All Projects
                  </span>
                  <span style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>
                    View all {projects?.length || ""} projects
                  </span>
                </Link>
              </>
            )}
        </div>
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
    </SectionWrapper>
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
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(5,146,18,0.18)";
        e.currentTarget.style.borderColor = "#059212";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#02275b";
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
          <span style={{ color: "#9BEC00", fontSize: "0.813rem", fontWeight: 600, padding: "0 12px", textAlign: "center" }}>
            {project.title}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px" }}>
        <h3 style={{ color: "white", fontSize: "0.938rem", fontWeight: 700, margin: "0 0 8px" }}>
          {project.title}
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {project.techStack?.slice(0, 4).map((t) => (
            <TechBadge key={t} label={t} />
          ))}
        </div>
      </div>
    </div>
  );
}