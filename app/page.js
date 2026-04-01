"use client";

import { useState } from "react";
import NavBar               from "@/components/portfolio/NavBar";
import HeroSection          from "@/components/portfolio/HeroSection";
import AboutSection         from "@/components/portfolio/AboutSection";
import ExperienceSection    from "@/components/portfolio/ExperienceSection";
import SkillsSection        from "@/components/portfolio/SkillsSection";
import QualificationSection from "@/components/portfolio/QualificationSection";
import ProjectsSection      from "@/components/portfolio/ProjectsSection";
import CertSection          from "@/components/portfolio/CertSection";
import ContactSection       from "@/components/portfolio/ContactSection";
import ContactModal         from "@/components/portfolio/ContactModal";
import Footer               from "@/components/portfolio/Footer";

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main style={{ background: "#011428", minHeight: "100vh" }}>
      <NavBar />

      <HeroSection onContactClick={() => setContactOpen(true)} />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <QualificationSection />
      <ProjectsSection />
      <CertSection />
      <ContactSection />
      <Footer />

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </main>
  );
}