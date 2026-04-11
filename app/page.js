// app/page.js
import { getHomePageData } from "@/lib/data";
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

      <ExperienceSection
        experiences={data.experiences}
      />

      <SkillsSection
        skillCategories={data.skillCategories}
        initialSkills={data.initialSkills}
        firstSkillTab={data.firstSkillTab}
      />

      <QualificationSection
        qualifications={data.qualifications}
      />

      <ProjectsSection
        projectCategories={data.projectCategories}
        initialProjects={data.initialProjects}
        firstProjectTab={data.firstProjectTab}
        totalCount={data.projects?.length}
      />

      <CertSection
        certifications={data.certifications}
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