# Nahid Hasan — Portfolio v2

A modern, full-stack portfolio website with a complete admin CMS. Built with **Next.js (App Router)**, **MongoDB Atlas**, **Cloudinary**, and **NextAuth.js**. Deployed on **Vercel**.

---

## 🔗 Live Links

| | URL |
|---|---|
| **Portfolio** | https://nahid-hasan-portfolio.vercel.app |
| **Admin Panel** | https://nahid-hasan-portfolio.vercel.app/admin |
| **GitHub** | https://github.com/nahid619/Nahid-Portfolio |
| **Previous static site** | https://nahid-hasan-00619.vercel.app |

---

## ✨ Features

- **Fully dynamic portfolio** — every section (bio, skills, projects, certs, qualifications, social links) is managed through the admin panel. No code changes needed for content updates.
- **Admin CMS** — full CRUD for all 9 content sections with inline editing
- **Dynamic tab categories** — Skills and Projects tab labels are stored in MongoDB. Admin can add, rename, reorder, or delete tabs and changes reflect on the portfolio immediately
- **Cloudinary storage** — all images (profile photo, skill icons, project images, certificate images), social icons, and the CV PDF are stored on Cloudinary
- **CV proxy download** — CV is served through a Next.js server-side proxy route (`/api/cv-download`) to avoid Cloudinary 401 errors on direct PDF delivery
- **MongoDB Atlas** — NoSQL cloud database, free tier
- **NextAuth.js** — single admin login with JWT sessions (24-hour expiry)
- **Auto-calculated experience** — total work duration computed from experience entries, shown in About section
- **Smooth scroll navigation** — custom easing scroll (`lib/smoothScroll.js`) used across navbar, footer, scroll-to-top button and hero scroll arrow. Speed controlled via a single `duration` value.
- **Accurate nav highlighting** — active navbar link uses `IntersectionObserver` with tight `rootMargin` (`-20% 0px -85% 0px`) so the correct section is always highlighted as you scroll
- **Fully responsive** — mobile, tablet, and desktop layouts with a collapsible hamburger nav, responsive experience grid, and properly constrained card widths on all screen sizes

---

## 📁 Project Folder Structure

```
nahid-portfolio-v2/
│
├── app/                                   ← Next.js App Router pages & API
│   ├── layout.js                          ← Root layout (Poppins font + AuthProvider)
│   ├── page.js                            ← Public portfolio homepage (all sections)
│   ├── globals.css                        ← Global styles, CSS variables, mobile responsive
│   ├── AuthProvider.js                    ← NextAuth SessionProvider wrapper
│   │
│   ├── admin/
│   │   ├── page.js                        ← Admin login page
│   │   └── dashboard/
│   │       └── page.js                    ← Admin dashboard (JWT-protected)
│   │
│   ├── projects/
│   │   └── page.js                        ← All projects page (/projects)
│   │
│   ├── experiences/
│   │   └── page.js                        ← All experiences page (/experiences)
│   │
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.js               ← NextAuth credentials handler
│       ├── profile/
│       │   └── route.js                   ← GET + PUT profile
│       ├── cv-download/
│       │   └── route.js                   ← Server-side CV proxy (avoids Cloudinary 401)
│       ├── experiences/
│       │   ├── route.js                   ← GET all (sorted latest first) + POST
│       │   └── [id]/route.js              ← PUT + DELETE experience by ID
│       ├── skills/
│       │   ├── route.js                   ← GET all (optional ?category= filter) + POST
│       │   └── [id]/route.js              ← PUT + DELETE skill by ID
│       ├── projects/
│       │   ├── route.js                   ← GET all (optional ?category= filter) + POST
│       │   └── [id]/route.js              ← PUT + DELETE project by ID
│       ├── certifications/
│       │   ├── route.js                   ← GET all (sorted by order) + POST
│       │   └── [id]/route.js              ← PUT + DELETE certification by ID
│       ├── categories/
│       │   ├── route.js                   ← GET all (optional ?section= filter) + POST
│       │   └── [id]/route.js              ← PUT + DELETE category by ID
│       ├── qualifications/
│       │   ├── route.js                   ← GET all (sorted by order) + POST
│       │   └── [id]/route.js              ← PUT + DELETE qualification by ID
│       ├── social-links/
│       │   ├── route.js                   ← GET all (optional ?location= filter) + POST
│       │   └── [id]/route.js              ← PUT + DELETE social link by ID
│       ├── upload/
│       │   └── route.js                   ← Cloudinary upload handler (images + PDF)
│       └── test-db/
│           └── route.js                   ← MongoDB ping/connection test endpoint
│
├── components/
│   ├── shared/                            ← Reusable UI building blocks
│   │   ├── index.js                       ← Barrel export (import all from here)
│   │   ├── SectionWrapper.js              ← Fade-in on scroll wrapper for every section
│   │   ├── SectionHeader.js               ← Title + subtitle + green accent underline
│   │   ├── TabGroup.js                    ← Reusable tab switcher (Skills + Projects)
│   │   ├── SkeletonLoader.js              ← Shimmer loading placeholders (line, circle, card)
│   │   ├── ArrowNav.js                    ← Left/right arrow navigation buttons
│   │   ├── Modal.js                       ← Generic modal with portal + pinned × button
│   │   └── TechBadge.js                   ← Colored pill/tag component
│   │
│   ├── portfolio/                         ← Public portfolio section components
│   │   ├── NavBar.js                      ← Sticky nav, mobile hamburger, smooth scroll, accurate active highlight
│   │   ├── HeroSection.js                 ← Animated blob, name, role, social icons, CV + contact buttons
│   │   ├── AboutSection.js                ← Profile photo, bio, dynamic stats, auto-width CV button
│   │   ├── ExperienceSection.js           ← Responsive auto-fill grid, 2 latest cards + "See All" card
│   │   ├── ExperienceModal.js             ← LinkedIn-style modal via createPortal + × button
│   │   ├── SkillsSection.js               ← DB-driven tab categories + skills grid
│   │   ├── QualificationSection.js        ← Two-column timeline (DB-driven with hardcoded fallback)
│   │   ├── ProjectsSection.js             ← DB-driven tab categories + 3 cards + "See All" card
│   │   ├── ProjectModal.js                ← Scrollable project detail + pinned × + action buttons
│   │   ├── CertSection.js                 ← Auto-rotating 3s carousel, 3 visible, uniform card size
│   │   ├── ContactSection.js              ← Contact info items + mailto message form
│   │   ├── ContactModal.js                ← Dynamic contact options from socialLinks (contact-modal)
│   │   ├── Footer.js                      ← 3-column footer, smooth scroll quick links, fade-in animations
│   │   └── ScrollToTop.js                 ← Fixed scroll-to-top button with smooth scroll (appears after 400px)
│   │
│   └── admin/                             ← Admin dashboard components
│       ├── AdminLayout.js                 ← Sidebar nav + top header wrapper (mobile responsive)
│       ├── AdminUI.js                     ← Shared admin UI primitives (table, form, input, select…)
│       ├── CategoryPanel.js               ← Collapsible tab category manager (add/edit/delete/reorder)
│       ├── ProfileManager.js              ← Edit name, job title, hero desc, bio, photo, contact, links
│       ├── ExperienceManager.js           ← Full experience CRUD with auto-calculated total display
│       ├── SkillsManager.js               ← Skills CRUD + icon upload + embedded CategoryPanel
│       ├── ProjectsManager.js             ← Projects CRUD + image upload + embedded CategoryPanel
│       ├── CertManager.js                 ← Certifications CRUD + image upload
│       ├── QualificationManager.js        ← Education timeline CRUD (left/right side, order)
│       ├── SocialLinksManager.js          ← Social links CRUD with multi-location checkboxes
│       └── CVManager.js                   ← Upload/replace CV PDF to Cloudinary
│
├── hooks/
│   └── useFetch.js                        ← Reusable data-fetching hook (loading, error, refetch)
│
├── lib/
│   ├── mongodb.js                         ← MongoDB connection singleton (dev global / prod per-request)
│   ├── cloudinary.js                      ← Cloudinary upload/delete helpers
│   ├── calculateExperience.js             ← Auto-calculate total professional experience duration
│   └── smoothScroll.js                    ← Shared smooth scroll utility with cubic easing (used site-wide)
│
├── scripts/
│   └── seed.js                            ← One-time DB seed script (run: npm run seed)
│
├── middleware.js                          ← Route protection — redirects unauthenticated /admin/dashboard
├── next.config.mjs                        ← Next.js config (Cloudinary remotePatterns, SVG, 10MB body)
├── jsconfig.json                          ← Path aliases (@/ → project root)
├── package.json                           ← Dependencies + npm scripts
├── postcss.config.mjs                     ← PostCSS config (Tailwind v4)
├── eslint.config.mjs                      ← ESLint config (no-unescaped-entities off)
├── .env.local                             ← Environment variables (never commit!)
├── .gitignore                             ← Git ignore rules
└── README.md                              ← This file
```

---

## 🗄️ MongoDB Collections

| Collection | Key Fields | Notes |
|---|---|---|
| `profile` | `name`, `jobTitle`, `heroDescription`, `bio`, `email`, `phone`, `whatsappLink`, `location`, `profileImageUrl`, `profileImagePublicId`, `cvFileUrl`, `cvPublicId` | Single document — upserted on PUT |
| `experiences` | `role`, `company`, `companyLogoUrl`, `companyUrl`, `employmentType`, `location`, `startDate`, `endDate`, `isCurrent`, `description`, `skills[]`, `order` | Sorted by `startDate` descending |
| `skills` | `name`, `iconUrl`, `iconPublicId`, `category`, `order` | Filtered by `?category=` param |
| `projects` | `title`, `category`, `description`, `highlights[]`, `challenges`, `techStack[]`, `projectImageUrl`, `projectImagePublicId`, `videoUrl`, `githubUrl`, `liveUrl`, `publishedDate`, `order` | Filtered by `?category=` param |
| `certifications` | `title`, `imageUrl`, `order` | Sorted by `order` ascending |
| `categories` | `name`, `value`, `section`, `order` | `section` = `"skills"` or `"projects"`. `value` = slug used as filter param. Empty `value` = "All" tab |
| `qualifications` | `title`, `subtitle`, `institution`, `period`, `detail`, `highlights[]`, `side`, `order` | `side` = `"left"` or `"right"` for timeline layout |
| `socialLinks` | `name`, `url`, `logo`, `iconImageUrl`, `iconPublicId`, `showIn[]`, `order` | `showIn` is an array — one link can appear in multiple locations |

### Social Links — `showIn` Locations

| Value | Where it appears |
|---|---|
| `"navbar"` | Top-right icon buttons in the navigation bar |
| `"hero"` | Social icon row below buttons in the Hero section |
| `"footer"` | "Find Me On" column in the footer |
| `"contact-modal"` | Contact options listed in the contact modal |

---

## ⚙️ Environment Variables

Create a `.env.local` file at the project root:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/portfolio

# NextAuth
NEXTAUTH_SECRET=any-long-random-string-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000

# Admin login credentials (stored in env — not in DB)
ADMIN_USERNAME=nahid
ADMIN_PASSWORD=your-secure-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

> ⚠️ Never commit `.env.local` to GitHub. It's already in `.gitignore`.

---

## 🚀 Getting Started (Local)

```bash
# 1. Clone the repository
git clone https://github.com/nahid619/Nahid-Portfolio.git
cd Nahid-Portfolio

# 2. Install dependencies
npm install

# 3. Create .env.local with your credentials (see above)

# 4. Seed the database with initial data
npm run seed

# 5. Start the development server
npm run dev

# 6. Open in browser
# Portfolio:   http://localhost:3000
# Admin Panel: http://localhost:3000/admin
```

---

## 📦 npm Scripts

| Script | Command | What it does |
|---|---|---|
| `dev` | `npm run dev` | Start development server (hot reload) |
| `build` | `npm run build` | Build for production |
| `start` | `npm run start` | Start production server |
| `seed` | `npm run seed` | Seed all MongoDB collections with initial data |

---

## 🌐 Deploy to Vercel

**Step by step:**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import the GitHub repository
3. In **Environment Variables**, add all keys from your `.env.local`
4. Change `NEXTAUTH_URL` to your live Vercel domain (e.g. `https://your-app.vercel.app`)
5. In MongoDB Atlas → **Network Access** → add `0.0.0.0/0` (allow all IPs — required for Vercel)
6. Click **Deploy**

After first deploy, run `npm run seed` once locally pointing at the production `MONGODB_URI` to populate the database, or use the MongoDB Atlas UI to insert documents.

---

## 🔧 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 16.x |
| Database | MongoDB Atlas | Free tier |
| File Storage | Cloudinary | v2 SDK |
| Authentication | NextAuth.js | v4 |
| Styling | Tailwind CSS + inline styles | v4 |
| Animations | Framer Motion | v12 |
| Font | Poppins (Google Fonts) | — |
| Hosting | Vercel | Free tier |

---

## 🎨 Color Scheme

| CSS Variable | Hex | Usage |
|---|---|---|
| `--navy` | `#011428` | Page background |
| `--dark-blue` | `#00193b` | Card / panel background |
| `--mid-blue` | `#02275b` | Borders, inputs, table headers |
| `--green` | `#059212` | Primary buttons, accents, active borders |
| `--green-2` | `#06D001` | Active states, highlights, hover text |
| `--lime` | `#9BEC00` | Tags, badges, skill card borders |
| `--muted` | `#bcc4ba` | Body text, secondary labels |
| `--white` | `#ffffff` | Headings, primary text |

---

## 👤 Admin Panel

Access at `/admin`. Login with `ADMIN_USERNAME` + `ADMIN_PASSWORD` from your environment variables.

### Sidebar Sections

| Section | What you can manage |
|---|---|
| **Profile** | Name, job title, hero description (Home section), about bio (About section), profile photo, email, phone, WhatsApp link, location |
| **Experience** | Add / edit / delete work experience entries. Shows auto-calculated total experience duration. |
| **Skills** | Add / edit / delete skills with icon upload. Includes embedded **Category Panel** to manage skill tab labels and order. |
| **Projects** | Add / edit / delete projects with image upload, tech stack, GitHub/live links. Includes embedded **Category Panel** to manage project tab labels and order. |
| **Certifications** | Add / edit / delete certificates with image upload and display order. |
| **Qualification** | Add / edit / delete education timeline entries (left or right side, custom order). |
| **Social Links** | Add / edit / delete social/profile links. Each link can be shown in one or more locations: Navbar, Hero, Footer, Contact Modal. |
| **CV / Resume** | Upload or replace the PDF CV. Stored on Cloudinary. Both "Download CV" buttons use the proxy route automatically. |

### Category Panel (embedded in Skills and Projects)

The **Category Panel** is a collapsible section at the top of both SkillsManager and ProjectsManager. It lets you:

- **Add** a new tab (display name + slug + order)
- **Edit** an existing tab inline
- **Delete** a tab (skills/projects in that category are not deleted — they just won't appear in the tab)
- **Reorder** tabs with ↑ ↓ buttons
- The tab with the **lowest order number** is the default active tab on page load
- An empty slug (`value: ""`) creates an **All** tab that shows everything

---

## 📝 Key Behaviours & Notes

- **Skill icons** — Upload SVG or PNG via Admin → Skills. All icons stored on Cloudinary. Skills without an icon show the first 2 letters of the skill name as a fallback.
- **CV download** — Upload PDF via Admin → CV. Both "Download CV" buttons route through `/api/cv-download` — a server-side proxy that generates a signed Cloudinary URL and streams the PDF directly to the browser. This avoids the Cloudinary 401 that occurs when browsers try to access PDFs directly.
- **Cloudinary PDF setting** — In Cloudinary Dashboard → Settings → Security, **"PDF and ZIP files delivery"** must be **checked** for the proxy route to work.
- **Profile photo** — One photo, used in two places: the animated blob in the Hero section and the circle in the About section. Uploading a new photo automatically removes the old one from Cloudinary.
- **Job title sync** — `profile.jobTitle` is the single source of truth for the role label. It appears in the Hero section, the Footer, and the About section — all pulling from the same DB field.
- **Experience duration** — Auto-calculated from all experience entries using `lib/calculateExperience.js`. Updates live when entries are added or removed.
- **Projects count** — Auto-counted from the database. Updates automatically.
- **Smooth scrolling** — All anchor navigation (navbar links, footer quick links, scroll-to-top button, hero scroll arrow) uses a shared `smoothScrollTo()` utility in `lib/smoothScroll.js` with cubic easing. To adjust scroll speed change the `duration` default value in that file (current: `800ms`).
- **Nav active highlight** — Uses `IntersectionObserver` with `rootMargin: "-20% 0px -85% 0px"` so the active link updates precisely as each section's heading enters the upper portion of the viewport — not when a section is merely peeking at the edge.
- **Experience grid** — Uses `repeat(auto-fill, minmax(280px, 1fr))` so it collapses from 3 columns on desktop to 2 on medium screens and 1 on mobile, preventing card overflow.
- **Skill/Project tab defaults** — The first tab (lowest `order` number) in the categories collection is the default active tab on page load. Controlled entirely from the admin panel.
- **Modal centering** — Both `ExperienceModal` and the generic `Modal` use `createPortal` to render into `document.body`. This bypasses the CSS stacking context created by `SectionWrapper`'s `transform` animation, so modals always center correctly in the viewport.
- **Social links multi-location** — A single social link can appear in multiple locations simultaneously by checking multiple boxes in the admin (Navbar, Hero, Footer, Contact Modal).
- **Qualification fallback** — If the `qualifications` collection is empty, the section displays hardcoded BSc / HSC / SSC data so the page is never blank.
- **MongoDB Atlas IP** — Set Network Access to `0.0.0.0/0` in Atlas for Vercel compatibility. Vercel uses dynamic IPs so a fixed IP allowlist will not work.
- **ESLint** — `react/no-unescaped-entities` is turned off in `eslint.config.mjs` so apostrophes in JSX text never need manual escaping.

---

## 🗺️ Public Routes

| Route | Description |
|---|---|
| `/` | Main portfolio page (all sections) |
| `/projects` | All projects page with category filter tabs |
| `/experiences` | All work experience entries |
| `/admin` | Admin login page |
| `/admin/dashboard` | Admin CMS dashboard (JWT-protected) |
| `/api/cv-download` | Server-side CV proxy — triggers PDF download |

---

*Built with ❤️ by Nahid Hasan*