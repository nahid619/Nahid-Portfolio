// app/page.js
// Force dynamic rendering — ensures MongoDB data is always fresh on every
// request. Without this, Next.js statically caches the page and newly added
// skills / projects / certs / experiences won't appear until a server restart.
export const dynamic = "force-dynamic";

import { getHomePageData, getProfile } from "@/lib/data";
import { formatExperienceForDisplay } from "@/lib/calculateExperience";

import NavBar            from "@/components/portfolio/NavBar";
import HeroSection       from "@/components/portfolio/HeroSection";
import AboutSection      from "@/components/portfolio/AboutSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import SkillsSection     from "@/components/portfolio/SkillsSection";
import QualificationSection from "@/components/portfolio/QualificationSection";
import ProjectsSection   from "@/components/portfolio/ProjectsSection";
import CertSection       from "@/components/portfolio/CertSection";
import ContactSection    from "@/components/portfolio/ContactSection";
import Footer            from "@/components/portfolio/Footer";
import ContactModalWrapper from "@/components/portfolio/ContactModalWrapper";
import ScrollToTop       from "@/components/portfolio/ScrollToTop";

// Search / link-preview text follows the CMS profile, so editing the
// headline in the admin panel also updates Google and LinkedIn previews.
// getProfile is wrapped in React cache(), so this shares the page's query.
const FALLBACK_DESCRIPTION =
  "Salesforce Technical Consultant and Certified Agentforce Specialist. Flow Builder automation, Apex, LWC, end-to-end QA and API testing.";

function clip(text, max = 160) {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:\s]+$/, "") + "…";
}

export async function generateMetadata() {
  const profile = await getProfile();
  const role = (profile?.jobTitle || "Salesforce Technical Consultant").split("|")[0].trim();
  const title = `Nahid Hasan — ${role}`;
  const description = clip(profile?.heroDescription) || FALLBACK_DESCRIPTION;

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, url: "/", type: "profile", siteName: "Nahid Hasan" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Home() {
  const data = await getHomePageData();

  const expText = data.experiences
    ? formatExperienceForDisplay(data.experiences)
    : null;

  const projectCount = data.projects
    ? `${String(data.projects.length).padStart(2, "0")}+`
    : null;

  return (
    <main style={{ background: "#011428", minHeight: "100vh" }}>
      <NavBar navLinks={data.navLinks} />

      <HeroSection
        profile={data.profile}
        heroLinks={data.heroLinks}
      />

      <AboutSection
        profile={data.profile}
        expText={expText}
        projectCount={projectCount}
      />

      {/* Order: proof first. Recruiters scan for experience, projects and
          certifications; skills and education support those claims. */}
      <ExperienceSection
        experiences={data.experiences}
      />

      <ProjectsSection
        projectCategories={data.projectCategories}
        projects={data.projects}
        firstProjectTab={data.firstProjectTab}
        totalCount={data.projects?.length}
      />

      <CertSection
        certifications={data.certifications}
      />

      <SkillsSection
        skillCategories={data.skillCategories}
        skills={data.skills}
        firstSkillTab={data.firstSkillTab}
      />

      <QualificationSection
        qualifications={data.qualifications}
      />

      <ContactSection />

      <Footer
        profile={data.profile}
        footerLinks={data.footerLinks}
      />

      <ContactModalWrapper
        contactLinks={data.contactLinks}
      />

      <ScrollToTop />
    </main>
  );
}