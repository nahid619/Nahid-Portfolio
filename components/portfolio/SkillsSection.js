// components/portfolio/SkillsSection.js
// Server component — no "use client".
//
// Change: now receives the FULL skills array instead of only the first
// tab's slice. SkillsClient filters in memory, so tab switching no longer
// triggers a client-side fetch (which is what caused the stale-content bug).

import { SectionWrapper, SectionHeader } from "@/components/shared";
import SkillsClient from "./SkillsClient";

export default function SkillsSection({
  skillCategories = [],
  skills          = [],
  firstSkillTab   = "",
}) {
  // Map DB categories to the shape TabGroup expects
  const tabs = skillCategories.map(c => ({ label: c.name, value: c.value }));

  return (
    <SectionWrapper id="skills">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Skills" subtitle="My technical level" />

        <SkillsClient
          tabs={tabs}
          skills={skills}
          firstSkillTab={firstSkillTab}
        />
      </div>
    </SectionWrapper>
  );
}