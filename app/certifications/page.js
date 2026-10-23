// app/certifications/page.js
// All certifications (/certifications), reached from the "See all" card on
// the homepage. Same pattern as /projects and /experiences: server component
// fetches, CertClient (variant="all") handles the viewer modal.
// Force dynamic so newly added certifications appear immediately.
export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCertifications, getSocialLinks } from "@/lib/data";
import NavBar from "@/components/portfolio/NavBar";
import CertClient from "@/components/portfolio/CertClient";
import { SectionHeader, NavProgress } from "@/components/shared";

export const metadata = {
  title: "Certifications — Nahid Hasan",
  description:
    "Certifications held by Nahid Hasan, Salesforce Technical Consultant and Certified Agentforce Specialist.",
  alternates: { canonical: "/certifications" },
  openGraph: { title: "Certifications — Nahid Hasan", url: "/certifications", type: "website" },
};

export default async function AllCertificationsPage() {
  const [certifications, navLinks] = await Promise.all([
    getCertifications(),
    getSocialLinks("navbar"),
  ]);

  const count = certifications.length;

  return (
    <main style={{ background: "#011428", minHeight: "100vh" }}>
      <NavBar navLinks={navLinks} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <Link href="/#certification" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Portfolio
          <NavProgress size={12} color="#bcc4ba" label="Loading portfolio" />
        </Link>

        <SectionHeader
          title="All Certifications"
          subtitle={`${count} ${count === 1 ? "certification" : "certifications"}`}
          align="left"
        />

        {count > 0 ? (
          <CertClient certifications={certifications} variant="all" />
        ) : (
          <p style={{ color: "#bcc4ba", padding: "3rem 0", textAlign: "center" }}>
            No certifications added yet.
          </p>
        )}
      </div>

      <style>{`
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: #bcc4ba; font-size: 0.875rem;
          text-decoration: none; margin-bottom: 1.5rem;
          transition: color 0.2s;
        }
        .back-link:hover { color: #06D001; }
      `}</style>
    </main>
  );
}
