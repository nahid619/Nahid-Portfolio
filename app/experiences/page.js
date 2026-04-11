// app/experiences/page.js
// Server component — fetches experiences server-side
// Passes data down to AllExperiencesClient which handles modal/interactivity

import { getExperiences, getSocialLinks } from "@/lib/data";
import NavBar from "@/components/portfolio/NavBar";
import AllExperiencesClient from "@/components/portfolio/AllExperiencesClient";

export default async function AllExperiencesPage() {
  const [experiences, navLinks] = await Promise.all([
    getExperiences(),
    getSocialLinks("navbar"),
  ]);

  return (
    <main style={{ background: "#011428", minHeight: "100vh" }}>
      <NavBar navLinks={navLinks} />
      <AllExperiencesClient experiences={experiences} />
    </main>
  );
}