"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import AdminLayout        from "@/components/admin/AdminLayout";
import ProfileManager     from "@/components/admin/ProfileManager";
import ExperienceManager  from "@/components/admin/ExperienceManager";
import SkillsManager      from "@/components/admin/SkillsManager";
import ProjectsManager    from "@/components/admin/ProjectsManager";
import CertManager        from "@/components/admin/CertManager";
import SocialLinksManager from "@/components/admin/SocialLinksManager";
import CVManager          from "@/components/admin/CVManager";

const SECTIONS = {
  profile:    <ProfileManager    />,
  experience: <ExperienceManager />,
  skills:     <SkillsManager     />,
  projects:   <ProjectsManager   />,
  certs:      <CertManager       />,
  links:      <SocialLinksManager />,
  cv:         <CVManager          />,
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#011428", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#06D001", fontSize: "1rem" }}>Loading…</div>
      </div>
    );
  }

  return (
    <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
      {SECTIONS[activeSection]}
    </AdminLayout>
  );
}