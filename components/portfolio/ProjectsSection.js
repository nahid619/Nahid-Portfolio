"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFetch } from "@/hooks/useFetch";
import { SectionWrapper, SectionHeader, TabGroup, TechBadge, SkeletonCard } from "@/components/shared";
import ProjectModal from "./ProjectModal";

const TABS = [
  { label: "Salesforce", value: "salesforce" },
  { label: "SQA",        value: "sqa"        },
  { label: "Web",        value: "web"        },
];

export default function ProjectsSection() {
  const [activeTab, setActiveTab]       = useState("sqa");
  const [selectedProject, setSelected] = useState(null);

  const { data: projects, loading } = useFetch("/api/projects", {
    params: { category: activeTab },
  });

  // Show max 3 cards + the "See All" card in the 4th slot
  const visible = projects?.slice(0, 3) || [];

  return (
    <SectionWrapper id="portfolio">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Projects" subtitle="Notable works" />

        <TabGroup tabs={TABS} active={activeTab} onChange={setActiveTab} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {loading
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
      <div
        style={{
          height: "140px",
          background: "linear-gradient(135deg, #021f40, #059212 120%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
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