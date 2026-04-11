// components/portfolio/ExperienceSection.js
// Phase 3 change: removed useFetch
// Now receives experiences as prop from page.js
// Split into:
//   ExperienceSection (this file) — server component, no "use client"
//   ExperienceClient  (below)    — "use client", handles modal open/close

import Link from "next/link";
import ExperienceClient from "./ExperienceClient";
import { SectionWrapper, SectionHeader } from "@/components/shared";

// Server component — no data fetching, just passes data down
export default function ExperienceSection({ experiences = [] }) {
  return (
    <SectionWrapper id="experience">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader
          title="Work Experience"
          subtitle="Where I've worked — latest first"
        />

        {/*
          ExperienceClient handles:
          - Rendering the cards (needs onClick for modal)
          - Modal open/close state
          - The "See All" link card
          Data is passed down — no fetching inside
        */}
        <ExperienceClient
          experiences={experiences}
        />
      </div>
    </SectionWrapper>
  );
}
