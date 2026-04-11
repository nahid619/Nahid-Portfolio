// components/portfolio/SkillsSection.js
// Phase 4 change: removed useFetch calls
// Now receives skillCategories, initialSkills, firstSkillTab as props
// This is a server component — no "use client"
// Initial tab data (firstSkillTab skills) arrives WITH the page HTML
// Tab switching is handled by SkillsClient which fetches on demand

import { SectionWrapper, SectionHeader } from "@/components/shared";
import SkillsClient from "./SkillsClient";

export default function SkillsSection({
  skillCategories = [],
  initialSkills   = [],
  firstSkillTab   = "",
}) {
  // Map DB categories to the shape TabGroup expects
  const tabs = skillCategories.map(c => ({ label: c.name, value: c.value }));

  return (
    <SectionWrapper id="skills">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Skills" subtitle="My technical level" />

        {/*
          SkillsClient receives:
          - tabs: for the tab switcher UI
          - initialSkills: first tab's skills already fetched server-side
          - firstSkillTab: which tab is active on first render
          When user clicks a different tab, SkillsClient fetches that
          tab's skills from /api/skills?category=xxx client-side
        */}
        <SkillsClient
          tabs={tabs}
          initialSkills={initialSkills}
          firstSkillTab={firstSkillTab}
        />
      </div>
    </SectionWrapper>
  );
}