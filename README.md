# Nahid Hasan — Portfolio v2

A modern, full-stack portfolio website with a complete admin CMS. Built with **Next.js 14**, **MongoDB Atlas**, **Cloudinary**, and **NextAuth.js**. Deployed on **Vercel**.

---

## 🔗 Live Links

| | URL |
|---|---|
| **Portfolio** | https://your-vercel-domain.vercel.app |
| **Admin Panel** | https://your-vercel-domain.vercel.app/admin |
| **GitHub** | https://github.com/nahid619/nahid-portfolio |

---

## ✨ Features

- **Dynamic portfolio** — all content (bio, skills, projects, certs, social links) managed via admin panel
- **Admin CMS** — full CRUD for every section, no code changes needed ever
- **Cloudinary** — all images, icons, and CV PDF stored in the cloud
- **MongoDB Atlas** — NoSQL database, free tier
- **NextAuth.js** — single admin login with JWT sessions
- **Responsive** — works on mobile, tablet, and desktop
- **Scroll-to-top** button, active nav link highlighting, fade-in animations

---

## 📁 Project Folder Structure

```
nahid-portfolio-v2/
│
├── app/                              ← Next.js App Router pages & API
│   ├── layout.js                     ← Root layout (Poppins font + AuthProvider)
│   ├── page.js                       ← Public portfolio homepage
│   ├── globals.css                   ← Global styles + CSS variables + mobile responsive
│   ├── AuthProvider.js               ← NextAuth SessionProvider wrapper
│   │
│   ├── admin/
│   │   ├── page.js                   ← Admin login page
│   │   └── dashboard/
│   │       └── page.js               ← Admin dashboard (protected)
│   │
│   ├── projects/
│   │   └── page.js                   ← All projects page (/projects)
│   │
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.js          ← NextAuth credentials handler
│       ├── profile/
│       │   └── route.js              ← GET + PUT profile
│       ├── experiences/
│       │   ├── route.js              ← GET all + POST new experience
│       │   └── [id]/route.js         ← PUT + DELETE experience by ID
│       ├── skills/
│       │   ├── route.js              ← GET all (filter by category) + POST
│       │   └── [id]/route.js         ← PUT + DELETE skill by ID
│       ├── projects/
│       │   ├── route.js              ← GET all (filter by category) + POST
│       │   └── [id]/route.js         ← PUT + DELETE project by ID
│       ├── certifications/
│       │   ├── route.js              ← GET all + POST
│       │   └── [id]/route.js         ← PUT + DELETE cert by ID
│       ├── social-links/
│       │   ├── route.js              ← GET all (filter by showIn) + POST
│       │   └── [id]/route.js         ← PUT + DELETE link by ID
│       ├── upload/
│       │   └── route.js              ← Cloudinary upload handler (images + PDF)
│       └── test-db/
│           └── route.js              ← MongoDB connection test endpoint
│
├── components/
│   ├── shared/                       ← Reusable UI building blocks
│   │   ├── index.js                  ← Barrel export (import all from here)
│   │   ├── SectionWrapper.js         ← Fade-in on scroll wrapper for every section
│   │   ├── SectionHeader.js          ← Title + subtitle + green accent underline
│   │   ├── TabGroup.js               ← Reusable tab switcher (Skills + Projects)
│   │   ├── SkeletonLoader.js         ← Shimmer loading placeholders
│   │   ├── ArrowNav.js               ← Left/right arrow navigation buttons
│   │   ├── Modal.js                  ← Generic modal (scrollable body + fixed footer)
│   │   └── TechBadge.js              ← Colored pill/tag component
│   │
│   ├── portfolio/                    ← Public portfolio section components
│   │   ├── NavBar.js                 ← Sticky nav, mobile hamburger, active links
│   │   ├── HeroSection.js            ← Animated blob, name, role, contact button
│   │   ├── AboutSection.js           ← Photo, bio, dynamic stats (projects + exp)
│   │   ├── ExperienceSection.js      ← Scrollable card strip, latest first
│   │   ├── ExperienceModal.js        ← LinkedIn-style experience detail modal
│   │   ├── SkillsSection.js          ← Tabbed skills grid (Salesforce/SQA/Web/Programming)
│   │   ├── QualificationSection.js   ← BSc / HSC / SSC timeline
│   │   ├── ProjectsSection.js        ← 2×2 grid per tab + "See All" card
│   │   ├── ProjectModal.js           ← Scrollable project detail + pinned buttons
│   │   ├── CertSection.js            ← Auto-rotate 3s carousel with dots
│   │   ├── ContactSection.js         ← Info items + message form
│   │   ├── ContactModal.js           ← WhatsApp / LinkedIn / Facebook / Email options
│   │   ├── Footer.js                 ← 3-column footer with dynamic social links
│   │   └── ScrollToTop.js            ← Fixed scroll-to-top button
│   │
│   └── admin/                        ← Admin dashboard components
│       ├── AdminLayout.js            ← Sidebar + header wrapper
│       ├── AdminUI.js                ← Shared admin UI primitives (table, form, input...)
│       ├── ProfileManager.js         ← Edit bio, heroDescription, photo upload
│       ├── ExperienceManager.js      ← Add/edit/delete experiences (inline edit)
│       ├── SkillsManager.js          ← Add/edit/delete skills + icon upload
│       ├── ProjectsManager.js        ← Full project CRUD + image upload
│       ├── CertManager.js            ← Certificate CRUD + image upload
│       ├── SocialLinksManager.js     ← Social link CRUD with showIn selector
│       └── CVManager.js              ← Upload/replace CV PDF to Cloudinary
│
├── hooks/
│   └── useFetch.js                   ← Reusable data-fetching hook with loading/error
│
├── lib/
│   ├── mongodb.js                    ← MongoDB connection singleton
│   ├── cloudinary.js                 ← Cloudinary upload/delete helpers
│   └── calculateExperience.js        ← Auto-calculate total experience duration
│
├── scripts/
│   └── seed.js                       ← One-time DB seed script (run: npm run seed)
│
├── middleware.js                     ← Route protection for /admin/dashboard
├── next.config.mjs                   ← Next.js config (Cloudinary domains, SVG support)
├── tailwind.config.js                ← Tailwind CSS config
├── jsconfig.json                     ← Path aliases (@/ → project root)
├── package.json                      ← Dependencies + npm scripts
├── .env.local                        ← Environment variables (never commit!)
├── .gitignore                        ← Git ignore rules
├── DEPLOY.md                         ← Step-by-step Vercel deploy guide
└── README.md                         ← This file
```

---

## 🗄️ MongoDB Collections

| Collection | Purpose |
|---|---|
| `profile` | Name, bio, heroDescription, photo URL, CV URL, contact info |
| `experiences` | Work experience entries, auto-sorted latest first |
| `skills` | Skill name + Cloudinary icon URL + category |
| `projects` | Project details, tech stack, GitHub/live links, image |
| `certifications` | Certificate title + Cloudinary image |
| `socialLinks` | Social links with `showIn` control (both/footer/contact-modal) |

---

## ⚙️ Environment Variables

Create a `.env.local` file at the project root:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/portfolio

# NextAuth
NEXTAUTH_SECRET=any-long-random-string-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Admin login credentials
ADMIN_USERNAME=nahid
ADMIN_PASSWORD=your-secure-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

> ⚠️ Never commit `.env.local` to GitHub. It's in `.gitignore`.

---

## 🚀 Getting Started (Local)

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your credentials (see above)

# 3. Seed the database with initial data
npm run seed

# 4. Start development server
npm run dev

# 5. Open in browser
# Portfolio: http://localhost:3000
# Admin:     http://localhost:3000/admin
```

---

## 📦 npm Scripts

| Script | Command | What it does |
|---|---|---|
| `dev` | `npm run dev` | Start development server |
| `build` | `npm run build` | Build for production |
| `start` | `npm run start` | Start production server |
| `seed` | `npm run seed` | Seed MongoDB with initial data |

---

## 🌐 Deploy to Vercel

See **[DEPLOY.md](./DEPLOY.md)** for the complete step-by-step deployment guide.

**Quick summary:**
1. Push to GitHub
2. Import repo in Vercel
3. Add all `.env.local` variables to Vercel Environment Variables
4. Change `NEXTAUTH_URL` to your live Vercel URL
5. Deploy

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | MongoDB Atlas (free tier) |
| File Storage | Cloudinary (images + PDF) |
| Auth | NextAuth.js (credentials) |
| Styling | Tailwind CSS + inline styles |
| Hosting | Vercel (free tier) |
| Font | Poppins (Google Fonts) |

---

## 🎨 Color Scheme

| Variable | Hex | Usage |
|---|---|---|
| `--navy` | `#011428` | Page background |
| `--dark-blue` | `#00193b` | Card/panel background |
| `--mid-blue` | `#02275b` | Borders, inputs |
| `--green` | `#059212` | Primary buttons, accents |
| `--green-2` | `#06D001` | Active states, highlights |
| `--lime` | `#9BEC00` | Tags, badges |
| `--muted` | `#bcc4ba` | Body text |

---

## 👤 Admin Panel

Access at `/admin`. Login with your `ADMIN_USERNAME` + `ADMIN_PASSWORD`.

**Sections:**
- **Profile** — Update name, job title, hero description, about bio, photo, contact info
- **Experience** — Add/edit/delete work experiences (auto-calculates total duration)
- **Skills** — Add/edit/delete skills with Cloudinary icon upload
- **Projects** — Full project CRUD with image upload and tech stack
- **Certifications** — Upload certificate images with display order
- **Social Links** — Manage links with `showIn` control
- **CV / Resume** — Upload/replace PDF CV stored on Cloudinary

---

## 📝 Notes

- **Skill icons**: Upload SVG or PNG icons via Admin → Skills → Edit. All icons stored on Cloudinary.
- **CV**: Upload PDF via Admin → CV. Both "Download CV" buttons on the portfolio use the Cloudinary URL automatically.
- **Profile photo**: Uploading via Admin → Profile updates both the Hero section blob and the About section circle simultaneously.
- **Experience duration**: Auto-calculated from all experience entries. Updates automatically when you add/remove experiences.
- **Projects count**: Auto-counted from DB. Updates automatically.

---

*Built with ❤️ by Nahid Hasan*