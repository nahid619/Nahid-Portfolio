// components/portfolio/ProjectsSection.js
// Server component — no "use client".
//
// Change: receives the FULL projects array (page.js already had it for the
// project count) instead of only the first tab's slice. ProjectsClient
// filters in memory, so no client-side fetch on tab change.

import { SectionWrapper, SectionHeader } from "@/components/shared";
import ProjectsClient from "./ProjectsClient";

export default function ProjectsSection({
  projectCategories = [],
  projects          = [],
  firstProjectTab   = "",
  totalCount        = 0,
}) {
  // Map DB categories to the shape TabGroup expects
  const tabs = projectCategories.map(c => ({ label: c.name, value: c.value }));

  return (
    <SectionWrapper id="portfolio">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Projects" subtitle="Notable works" />

        <ProjectsClient
          tabs={tabs}
          projects={projects}
          firstProjectTab={firstProjectTab}
          totalCount={totalCount}
        />
      </div>
    </SectionWrapper>
  );
}