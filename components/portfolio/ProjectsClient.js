"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { TabGroup, TechBadge } from "@/components/shared";
import ProjectModal from "./ProjectModal";

export default function ProjectsClient({
  tabs = [], initialProjects = [], firstProjectTab = "", totalCount = 0,
}) {
  const [activeTab,       setActiveTab] = useState(firstProjectTab);
  const [projects,        setProjects]  = useState(initialProjects);
  const [animKey,         setAnimKey]   = useState(0);
  const [selectedProject, setSelected] = useState(null);
  const fetchingRef = useRef(false);

  async function handleTabChange(value) {
    if (value === activeTab || fetchingRef.current) return;
    fetchingRef.current = true;
    setActiveTab(value);
    try {
      const url = value ? `/api/projects?category=${encodeURIComponent(value)}` : "/api/projects";
      const res  = await fetch(url);
      const data = await res.json();
      setProjects(data);
      setAnimKey(k => k + 1);
    } catch (err) {
      console.error("Projects fetch error:", err);
    } finally {
      fetchingRef.current = false;
    }
  }

  const visible = projects.slice(0, 3);

  return (
    <>
      <TabGroup tabs={tabs} active={activeTab} onChange={handleTabChange} />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "16px",
      }}>
        {visible.map((project, i) => (
          <div
            key={`${animKey}-${project._id}`}
            className="project-card"
            style={{ animationDelay: `${i * 120}ms` }}
            onClick={() => setSelected(project)}
            onMouseEnter={e => {
              e.currentTarget.style.transform   = "translateY(-5px)";
              e.currentTarget.style.boxShadow   = "0 10px 32px rgba(5,146,18,0.2)";
              e.currentTarget.style.borderColor  = "#059212";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform   = "translateY(0)";
              e.currentTarget.style.boxShadow   = "none";
              e.currentTarget.style.borderColor  = "#02275b";
            }}
          >
            <div style={{
              height: "140px",
              background: "linear-gradient(135deg, #021f40, #059212 120%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", position: "relative",
            }}>
              {project.projectImageUrl ? (
                <Image
                  src={project.projectImageUrl} alt={project.title}
                  fill style={{ objectFit: "cover" }}
                  sizes="(max-width: 600px) 100vw, 300px"
                />
              ) : (
                <span style={{ color: "#9BEC00", fontSize: "0.813rem", fontWeight: 600, padding: "0 12px", textAlign: "center" }}>
                  {project.title}
                </span>
              )}
            </div>
            <div style={{ padding: "12px 14px" }}>
              <h3 style={{ color: "white", fontSize: "0.938rem", fontWeight: 700, margin: "0 0 8px" }}>
                {project.title}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {project.techStack?.slice(0, 4).map(t => <TechBadge key={t} label={t} />)}
              </div>
            </div>
          </div>
        ))}

        {/* See All card */}
        <div
          key={`${animKey}-see-all`}
          className="project-card see-all-card"
          style={{ animationDelay: `${visible.length * 100}ms`, minHeight: "180px" }}
          onMouseEnter={e => {
            e.currentTarget.style.transform   = "translateY(-5px)";
            e.currentTarget.style.background  = "#021f40";
            e.currentTarget.style.borderColor = "#06D001";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform   = "translateY(0)";
            e.currentTarget.style.background  = "#00193b";
            e.currentTarget.style.borderColor = "#059212";
          }}
        >
          <Link href="/projects" style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: "8px", width: "100%", height: "100%",
            textDecoration: "none", padding: "24px",
          }}>
            <span style={{ fontSize: "2rem", color: "#06D001" }}>→</span>
            <span style={{ color: "#06D001", fontSize: "0.938rem", fontWeight: 700 }}>See All Projects</span>
            <span style={{ color: "#bcc4ba", fontSize: "0.75rem" }}>View all {totalCount} projects</span>
          </Link>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelected(null)}
      />

      <style>{`
        .project-card {
          background: #00193b;
          border: 1px solid #02275b;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          opacity: 0;
          animation: cardIn 0.55s ease forwards;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease;
        }
        .see-all-card {
          border: 2px dashed #059212;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </>
  );
}