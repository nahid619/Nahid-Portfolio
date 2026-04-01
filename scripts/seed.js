// scripts/seed.js
// Run with: node scripts/seed.js
// Make sure .env.local is set up first

import { MongoClient } from "mongodb";
import { config } from "dotenv";

config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    const db = client.db("portfolio");
    console.log("✅ Connected to MongoDB");

    // ── 1. PROFILE ──────────────────────────────────────────────
    await db.collection("profile").deleteMany({});
    await db.collection("profile").insertOne({
      name: "Nahid Hasan",
      jobTitle: "Salesforce Technical Consultant Level-1",
      heroDescription: "Salesforce Technical Consultant & QA Automation Engineer with hands-on experience automating business processes and ensuring quality delivery. Skilled in Flow Builder automation, end-to-end QA testing, API testing with Postman, and Salesforce configuration.",
      bio: "Currently working as a Salesforce Technical Consultant & QA Automation Engineer with hands-on experience in business process automation, manual testing, API testing, and test case design. Currently working as a Salesforce Technical Consultant at GFGG IT Solutions, where I build Flow Builder automations, configure security settings, and ensure quality delivery through structured testing processes. This role has strengthened my understanding of CRM systems, backend workflows, and automation from both development and QA perspectives. I'm passionate about software quality, problem-solving, and leveraging technology to create efficient, reliable solutions.",
      email: "nahidhasan00619@gmail.com",
      phone: "01756867148",
      whatsappLink: "https://wa.me/8801756867148",
      location: "Darusha, Kornohar, Paba, Rajshahi-6210, Bangladesh",
      profileImageUrl: "",
      profileImagePublicId: "",
      cvFileUrl: "",
      cvPublicId: "",
    });
    console.log("✅ Profile seeded");

    // ── 2. EXPERIENCES ───────────────────────────────────────────
    await db.collection("experiences").deleteMany({});
    await db.collection("experiences").insertMany([
      {
        role: "Salesforce Technical Consultant",
        company: "GFGG IT Solutions",
        companyLogoUrl: "",
        companyUrl: "",
        employmentType: "Full-time",
        location: "Rajshahi, Bangladesh",
        startDate: "2024-11",
        endDate: null,
        isCurrent: true,
        description:
          "Working as a Salesforce Technical Consultant responsible for building and managing Flow Builder automations, configuring security settings including roles, profiles, and permission sets. Conducting structured QA testing processes to ensure quality delivery of Salesforce implementations. Collaborating with stakeholders to gather requirements and translate them into Salesforce solutions.",
        skills: ["Salesforce Admin", "Flow Builder", "Apex", "LWC", "QA Testing", "Postman"],
        order: 1,
        createdAt: new Date(),
      },
    ]);
    console.log("✅ Experiences seeded");

    // ── 3. SKILLS ────────────────────────────────────────────────
    await db.collection("skills").deleteMany({});
    await db.collection("skills").insertMany([
      // Salesforce
      { name: "Salesforce Admin", iconUrl: "/assets/img/skill/saleforce.svg", category: "salesforce", order: 1, createdAt: new Date() },
      { name: "Apex",             iconUrl: "/assets/img/skill/apex.svg",      category: "salesforce", order: 2, createdAt: new Date() },
      { name: "Flows",            iconUrl: "/assets/img/skill/saleforce.svg", category: "salesforce", order: 3, createdAt: new Date() },
      { name: "LWC",              iconUrl: "/assets/img/skill/apex.svg",      category: "salesforce", order: 4, createdAt: new Date() },
      { name: "Apex Trigger",     iconUrl: "/assets/img/skill/apex.svg",      category: "salesforce", order: 5, createdAt: new Date() },
      { name: "Power BI",         iconUrl: "/assets/img/skill/PowerBI.svg",   category: "salesforce", order: 6, createdAt: new Date() },
      // SQA
      { name: "Manual Testing",   iconUrl: "/assets/img/skill/manual testing.svg", category: "sqa", order: 1, createdAt: new Date() },
      { name: "WebdriverIO",      iconUrl: "/assets/img/skill/webdriverio.svg",     category: "sqa", order: 2, createdAt: new Date() },
      { name: "Selenium",         iconUrl: "/assets/img/skill/selenium.svg",        category: "sqa", order: 3, createdAt: new Date() },
      { name: "Postman",          iconUrl: "/assets/img/skill/postman.svg",         category: "sqa", order: 4, createdAt: new Date() },
      { name: "Bug Reporting",    iconUrl: "/assets/img/skill/bugreport.svg",       category: "sqa", order: 5, createdAt: new Date() },
      { name: "Test Case Design", iconUrl: "/assets/img/skill/testcasedesign.svg",  category: "sqa", order: 6, createdAt: new Date() },
      { name: "STLC",             iconUrl: "/assets/img/skill/stlc.svg",            category: "sqa", order: 7, createdAt: new Date() },
      { name: "API Testing",      iconUrl: "/assets/img/skill/api.svg",             category: "sqa", order: 8, createdAt: new Date() },
      { name: "TestRail",         iconUrl: "/assets/img/skill/testrail.svg",        category: "sqa", order: 9, createdAt: new Date() },
      // Web
      { name: "HTML",       iconUrl: "/assets/img/skill/html.svg",       category: "web", order: 1, createdAt: new Date() },
      { name: "CSS",        iconUrl: "/assets/img/skill/css.svg",        category: "web", order: 2, createdAt: new Date() },
      { name: "JavaScript", iconUrl: "/assets/img/skill/js.svg",         category: "web", order: 3, createdAt: new Date() },
      { name: "PHP",        iconUrl: "/assets/img/skill/php.svg",        category: "web", order: 4, createdAt: new Date() },
      { name: "MySQL",      iconUrl: "/assets/img/skill/mysql.svg",      category: "web", order: 5, createdAt: new Date() },
      { name: "Bootstrap",  iconUrl: "/assets/img/skill/bootstrap.svg",  category: "web", order: 6, createdAt: new Date() },
      { name: "Laravel",    iconUrl: "/assets/img/skill/laravel.svg",    category: "web", order: 7, createdAt: new Date() },
      { name: "PostgreSQL", iconUrl: "/assets/img/skill/postgresql.svg", category: "web", order: 8, createdAt: new Date() },
      { name: "GIT",        iconUrl: "/assets/img/skill/git.svg",        category: "web", order: 9, createdAt: new Date() },
      { name: "GitHub",     iconUrl: "/assets/img/skill/github.svg",     category: "web", order: 10, createdAt: new Date() },
      // Programming
      { name: "JavaScript", iconUrl: "/assets/img/skill/js.svg",     category: "programming", order: 1, createdAt: new Date() },
      { name: "PHP",        iconUrl: "/assets/img/skill/php.svg",    category: "programming", order: 2, createdAt: new Date() },
      { name: "Python",     iconUrl: "/assets/img/skill/python.svg", category: "programming", order: 3, createdAt: new Date() },
      { name: "Java",       iconUrl: "/assets/img/skill/java.svg",   category: "programming", order: 4, createdAt: new Date() },
      { name: "C",          iconUrl: "/assets/img/skill/c.svg",      category: "programming", order: 5, createdAt: new Date() },
      { name: "C++",        iconUrl: "/assets/img/skill/cpp.svg",    category: "programming", order: 6, createdAt: new Date() },
    ]);
    console.log("✅ Skills seeded");

    // ── 4. PROJECTS ──────────────────────────────────────────────
    await db.collection("projects").deleteMany({});
    await db.collection("projects").insertMany([
      {
        title: "WafiCommerce QA Testing",
        category: "sqa",
        description: "A comprehensive QA testing project for WafiCommerce covering Product Management, Sales & Sales Orders, Purchases and Purchase Returns modules. Focused on validating business-critical flows with end-to-end test coverage.",
        highlights: [
          "Designed and executed 60+ test cases",
          "Identified critical defects in stock management",
          "Documented credit limit & sales order bugs",
          "Prepared Test Summary and Execution Guide",
          "Suggested improvements for system reliability",
        ],
        challenges: "Coordinating cross-module test dependencies was challenging. Learned to write tighter test cases and structure bug reports for smoother developer handoff.",
        techStack: ["Manual Testing", "Bug Reporting", "Test Case Design", "STLC"],
        projectImageUrl: "",
        videoUrl: "",
        githubUrl: "https://github.com/nahid619/WafiCommerce-QA-Testing-Assignmentr",
        liveUrl: "https://www.linkedin.com/posts/nahid-hasan-0274881a7_github-nahid619waficommerce-qa-testing-assignment-activity-7305986307502088195-JwJ6",
        publishedDate: "2025-05-27",
        order: 1,
        createdAt: new Date(),
      },
      {
        title: "Evershop QA Testing Project",
        category: "sqa",
        description: "QA testing project for the Evershop Demo Website, where I conducted both API and UI testing to validate core functionalities like product search, adding items to the cart, and cart verification.",
        highlights: [
          "Designed and executed manual test cases",
          "Performed API testing using Postman",
          "Identified and logged critical defects",
          "Created structured bug report and final test analysis",
        ],
        challenges: "Handling dynamic cart state during API testing required careful session management and ordering of test steps.",
        techStack: ["Manual Testing", "Postman", "API Testing", "Bug Reporting"],
        projectImageUrl: "",
        videoUrl: "",
        githubUrl: "https://github.com/nahid619/Evershop-QA-Testing",
        liveUrl: "https://docs.google.com/spreadsheets/d/1rFtgYXM0sCrA2aix3TSYuOMPoc8S5GL9LZNrLIpd96A/edit?usp=sharing",
        publishedDate: "2025-05-27",
        order: 2,
        createdAt: new Date(),
      },
      {
        title: "Attendance App",
        category: "web",
        description: "Designed to streamline attendance management with ease and efficiency, this app offers a seamless solution for tracking attendance in real-time.",
        highlights: [
          "User authentication with roles",
          "Real-time attendance tracking",
          "Dynamic dashboards for admins",
          "Built with Laravel and MySQL",
        ],
        challenges: "Implementing real-time updates without a websocket server required smart polling strategies.",
        techStack: ["HTML", "CSS", "PHP", "Laravel", "Blade", "MySQL", "JavaScript"],
        projectImageUrl: "",
        videoUrl: "",
        githubUrl: "https://github.com/nahid619/attendanceapp/tree/main",
        liveUrl: "https://www.linkedin.com/posts/nahid-hasan-0274881a7_attendancemanagement-appdevelopment-efficiency-activity-7246208106018316288-VvNy",
        publishedDate: "2024-10-15",
        order: 3,
        createdAt: new Date(),
      },
      {
        title: "BlogHut",
        category: "web",
        description: "BlogHut is a user-friendly blogging platform allowing users to read, create, and manage blogs across various categories like technology, lifestyle, and more.",
        highlights: [
          "Full CRUD for blog posts",
          "Category filtering and search",
          "User authentication",
          "Responsive design",
        ],
        challenges: "Structuring the database schema to efficiently handle categories and tags while keeping queries fast.",
        techStack: ["HTML", "CSS", "PHP", "MySQL", "JavaScript"],
        projectImageUrl: "",
        videoUrl: "",
        githubUrl: "https://github.com/nahid619/Bloghut",
        liveUrl: "http://bloghut.infinityfreeapp.com/index.php",
        publishedDate: "2024-06-01",
        order: 4,
        createdAt: new Date(),
      },
      {
        title: "Weather App",
        category: "web",
        description: "Developed using HTML, CSS, and JavaScript, this weather app allows users to search for weather information by city. It retrieves data from a weather API and displays current conditions.",
        highlights: [
          "City-based weather search",
          "Real-time API data",
          "Temperature, humidity, wind speed display",
          "Clean responsive UI",
        ],
        challenges: "Handling API rate limits and gracefully showing errors when a city name is not found.",
        techStack: ["HTML", "CSS", "JavaScript", "API Integration"],
        projectImageUrl: "",
        videoUrl: "",
        githubUrl: "https://github.com/nahid619/Weather-App-JavaScript",
        liveUrl: "https://weatherappjavascriptt.netlify.app/",
        publishedDate: "2024-03-01",
        order: 5,
        createdAt: new Date(),
      },
      {
        title: "Donate the Blood",
        category: "web",
        description: '"Donate The Blood" is a blood donation management system that connects donors and recipients based on location and blood group. Users can search for donors, register as donors, and update their availability.',
        highlights: [
          "Donor registration and management",
          "Search by blood group and location",
          "Donor availability toggle",
          "Coverage across Bangladesh districts",
        ],
        challenges: "Implementing location-based filtering across all districts in Bangladesh required careful geographic data structuring.",
        techStack: ["HTML", "CSS", "PHP", "MySQL", "JavaScript"],
        projectImageUrl: "",
        videoUrl: "",
        githubUrl: "https://github.com/nahid619/Donate-the-Blood",
        liveUrl: "http://donatetheblood.infinityfreeapp.com/?i=1",
        publishedDate: "2024-01-01",
        order: 6,
        createdAt: new Date(),
      },
    ]);
    console.log("✅ Projects seeded");

    // ── 5. CERTIFICATIONS ────────────────────────────────────────
    await db.collection("certifications").deleteMany({});
    await db.collection("certifications").insertMany([
      { title: "SQA Manual and Automation Testing", imageUrl: "", order: 1,  createdAt: new Date() },
      { title: "Prompt Engineering for ChatGPT",    imageUrl: "", order: 2,  createdAt: new Date() },
      { title: "Machine Learning and Generative AI", imageUrl: "", order: 3, createdAt: new Date() },
      { title: "Content Writing",                   imageUrl: "", order: 4,  createdAt: new Date() },
      { title: "TestRail",                          imageUrl: "", order: 5,  createdAt: new Date() },
      { title: "SQL",                               imageUrl: "", order: 6,  createdAt: new Date() },
      { title: "Programming Contest",               imageUrl: "", order: 7,  createdAt: new Date() },
      { title: "Postman API",                       imageUrl: "", order: 8,  createdAt: new Date() },
      { title: "Python",                            imageUrl: "", order: 9,  createdAt: new Date() },
      { title: "Telesales Marketing",               imageUrl: "", order: 10, createdAt: new Date() },
      { title: "HTML",                              imageUrl: "", order: 11, createdAt: new Date() },
    ]);
    console.log("✅ Certifications seeded");

    // ── 6. SOCIAL LINKS ──────────────────────────────────────────
    await db.collection("socialLinks").deleteMany({});
    await db.collection("socialLinks").insertMany([
      { name: "LinkedIn",    url: "https://www.linkedin.com/in/nahid-hasan-0274881a7/", logo: "in",  showIn: "both",          order: 1, createdAt: new Date() },
      { name: "GitHub",      url: "https://github.com/nahid619",                        logo: "GH",  showIn: "both",          order: 2, createdAt: new Date() },
      { name: "Facebook",    url: "https://www.facebook.com/nahidhasan987",             logo: "fb",  showIn: "footer",        order: 3, createdAt: new Date() },
      { name: "WhatsApp",    url: "https://wa.me/8801756867148",                        logo: "💬",  showIn: "contact-modal", order: 4, createdAt: new Date() },
    ]);
    console.log("✅ Social links seeded");

    console.log("\n🎉 All collections seeded successfully!");
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    await client.close();
  }
}

seed();