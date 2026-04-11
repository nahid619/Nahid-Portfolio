// components/portfolio/ProjectsSection.js
// Phase 4 change: removed useFetch calls
// Now receives projectCategories, initialProjects, firstProjectTab,
// and totalCount as props from page.js
// This is a server component — no "use client"
// Initial tab data arrives WITH the page HTML — zero extra request
// Tab switching is handled by ProjectsClient which fetches on demand

import { SectionWrapper, SectionHeader } from "@/components/shared";
import ProjectsClient from "./ProjectsClient";

export default function ProjectsSection({
  projectCategories = [],
  initialProjects   = [],
  firstProjectTab   = "",
  totalCount        = 0,
}) {
  // Map DB categories to the shape TabGroup expects
  const tabs = projectCategories.map(c => ({ label: c.name, value: c.value }));

  return (
    <SectionWrapper id="portfolio">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Projects" subtitle="Notable works" />

        {/*
          ProjectsClient receives:
          - tabs: for the tab switcher UI
          - initialProjects: first tab's projects already fetched server-side
          - firstProjectTab: which tab is active on first render
          - totalCount: total projects count for the "See All" card label
          When user clicks a different tab, ProjectsClient fetches
          from /api/projects?category=xxx client-side
        */}
        <ProjectsClient
          tabs={tabs}
          initialProjects={initialProjects}
          firstProjectTab={firstProjectTab}
          totalCount={totalCount}
        />
      </div>
    </SectionWrapper>
  );
}