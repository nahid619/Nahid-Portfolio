// app/projects/page.js
// Server component — fetches all projects + categories server-side
// Passes data down to AllProjectsClient which handles tabs/modal/interactivity

import { getProjects, getCategories } from "@/lib/data";
import NavBar from "@/components/portfolio/NavBar";
import AllProjectsClient from "@/components/portfolio/AllProjectsClient";
import { getSocialLinks } from "@/lib/data";

export default async function AllProjectsPage() {
  const [projects, categories, navLinks] = await Promise.all([
    getProjects(),
    getCategories("projects"),
    getSocialLinks("navbar"),
  ]);

  return (
    <main style={{ background: "#011428", minHeight: "100vh" }}>
      <NavBar navLinks={navLinks} />
      <AllProjectsClient
        initialProjects={projects}
        categories={categories}
      />
    </main>
  );
}