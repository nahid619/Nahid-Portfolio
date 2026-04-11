// lib/data.js
import { getDb } from "./mongodb";
import { cache } from "react";

// cache() makes sure if the same function is called
// multiple times in one request, DB is only hit once
// This is React's built-in request memoization

export const getProfile = cache(async () => {
  try {
    const db = await getDb();
    const profile = await db.collection("profile").findOne({});
    if (!profile) return null;
    // MongoDB _id is not serializable — convert to string
    return { ...profile, _id: profile._id.toString() };
  } catch (error) {
    console.error("getProfile error:", error);
    return null;
  }
});

export const getExperiences = cache(async () => {
  try {
    const db = await getDb();
    const experiences = await db
      .collection("experiences")
      .find({})
      .sort({ startDate: -1 })
      .toArray();
    return experiences.map(e => ({ ...e, _id: e._id.toString() }));
  } catch (error) {
    console.error("getExperiences error:", error);
    return [];
  }
});

export const getSkills = cache(async (category = "") => {
  try {
    const db = await getDb();
    const query = category ? { category } : {};
    const skills = await db
      .collection("skills")
      .find(query)
      .sort({ category: 1, order: 1 })
      .toArray();
    return skills.map(s => ({ ...s, _id: s._id.toString() }));
  } catch (error) {
    console.error("getSkills error:", error);
    return [];
  }
});

export const getProjects = cache(async (category = "") => {
  try {
    const db = await getDb();
    const query = category ? { category } : {};
    const projects = await db
      .collection("projects")
      .find(query)
      .sort({ order: 1, createdAt: -1 })
      .toArray();
    return projects.map(p => ({ ...p, _id: p._id.toString() }));
  } catch (error) {
    console.error("getProjects error:", error);
    return [];
  }
});

export const getCertifications = cache(async () => {
  try {
    const db = await getDb();
    const certs = await db
      .collection("certifications")
      .find({})
      .sort({ order: 1 })
      .toArray();
    return certs.map(c => ({ ...c, _id: c._id.toString() }));
  } catch (error) {
    console.error("getCertifications error:", error);
    return [];
  }
});

export const getCategories = cache(async (section = "") => {
  try {
    const db = await getDb();
    const query = section ? { section } : {};
    const categories = await db
      .collection("categories")
      .find(query)
      .sort({ order: 1 })
      .toArray();
    return categories.map(c => ({ ...c, _id: c._id.toString() }));
  } catch (error) {
    console.error("getCategories error:", error);
    return [];
  }
});

export const getQualifications = cache(async () => {
  try {
    const db = await getDb();
    const quals = await db
      .collection("qualifications")
      .find({})
      .sort({ order: 1 })
      .toArray();
    return quals.map(q => ({ ...q, _id: q._id.toString() }));
  } catch (error) {
    console.error("getQualifications error:", error);
    return [];
  }
});

export const getSocialLinks = cache(async (location = "") => {
  try {
    const db = await getDb();
    const query = location ? { showIn: { $in: [location] } } : {};
    const links = await db
      .collection("socialLinks")
      .find(query)
      .sort({ order: 1 })
      .toArray();
    return links.map(l => ({ ...l, _id: l._id.toString() }));
  } catch (error) {
    console.error("getSocialLinks error:", error);
    return [];
  }
});

// Fetch everything needed for the homepage in one go
// Promise.all runs all queries in parallel — much faster
export async function getHomePageData() {
  const [
    profile,
    experiences,
    projects,
    skillCategories,
    projectCategories,
    certifications,
    qualifications,
    navLinks,
    heroLinks,
    footerLinks,
    contactLinks,
  ] = await Promise.all([
    getProfile(),
    getExperiences(),
    getProjects(),
    getCategories("skills"),
    getCategories("projects"),
    getCertifications(),
    getQualifications(),
    getSocialLinks("navbar"),
    getSocialLinks("hero"),
    getSocialLinks("footer"),
    getSocialLinks("contact-modal"),
  ]);

  // Get initial skills for the first tab
  const firstSkillTab = skillCategories?.[0]?.value ?? "";
  const initialSkills = await getSkills(firstSkillTab);

  // Get initial projects for the first tab
  const firstProjectTab = projectCategories?.[0]?.value ?? "";
  const initialProjects = await getProjects(firstProjectTab);

  return {
    profile,
    experiences,
    projects,          // all projects (for count)
    skillCategories,
    projectCategories,
    certifications,
    qualifications,
    navLinks,
    heroLinks,
    footerLinks,
    contactLinks,
    initialSkills,
    initialProjects,
    firstSkillTab,
    firstProjectTab,
  };
}