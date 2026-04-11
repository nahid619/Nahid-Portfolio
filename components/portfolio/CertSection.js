// components/portfolio/CertSection.js
// Phase 4 change: removed useFetch
// Now receives certifications as prop from page.js
// This is a server component — no "use client"
// The carousel interaction is handled by CertClient

import { SectionWrapper, SectionHeader } from "@/components/shared";
import CertClient from "./CertClient";

export default function CertSection({ certifications = [] }) {
  return (
    <SectionWrapper id="certification">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader title="Certifications" subtitle="Training and certifications" />

        {/*
          CertClient handles:
          - The sliding carousel (needs useState for index)
          - Auto-rotate interval (needs useEffect)
          - Arrow nav and dot nav clicks
          Data is passed down — no fetching inside
        */}
        <CertClient certifications={certifications} />
      </div>
    </SectionWrapper>
  );
}