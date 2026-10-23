// components/portfolio/CertSection.js
// Phase 4 change: removed useFetch
// Now receives certifications as prop from page.js
// This is a server component — no "use client"
// Interaction (spotlight, grid, viewer modal) is handled by CertClient

import { SectionWrapper, SectionHeader } from "@/components/shared";
import CertClient from "./CertClient";

export default function CertSection({ certifications = [] }) {
  return (
    <SectionWrapper id="certification">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Certifications" subtitle="Training and certifications" />

        {/*
          Homepage preview: spotlight + top 3 by display order + "See all"
          (→ /certifications). Data is passed down — no fetching inside.
        */}
        <CertClient certifications={certifications} variant="preview" />
      </div>
    </SectionWrapper>
  );
}