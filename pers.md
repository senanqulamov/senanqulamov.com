# Personal Information Audit

Audit date: 2026-11-02. This document inventories public information about Senan Qulamov that is currently stored, rendered, indexed, or exposed by this repository. It deliberately excludes framework code, generated build files, and third-party vendor code.

Use this as the source for corrections. Do not edit this document to change the website: mark the items that are wrong and provide the replacement text. The corresponding source files listed below will then be updated everywhere they are used.

## Primary profile record

The closest thing to a single source of truth is [`src/data/profile.ts`](src/data/profile.ts). Its current values are:

| Field | Current public value | Direct consumers |
| --- | --- | --- |
| Legal/display name | Senan Qulamov | Header, footer, metadata, schema, share image, press facts, routes, loading screen, console message, citations |
| Alternate spelling | Sanan Gulamov | Person structured data and press facts |
| Official website | https://senanqulamov.com | Canonicals, sitemap, robots, schema, social sharing URLs |
| Email | qulamovsenan@gmail.com | Contact page, footer, CV page, journal emails, Director assistant, form fallback, menu preview, console message, README example |
| Phone / WhatsApp | +994 51 583 80 95 | Director assistant only; number is held centrally in the profile record |
| LinkedIn | https://www.linkedin.com/in/senanqulamov | Footer/menu and Person structured data |
| GitHub | https://github.com/senanqulamov | Footer/menu and Person structured data |
| GitHub username | senanqulamov | Lab / GitHub integrations and profile references |
| BidBary URL | https://bidbary.me | Home CTA, footer, Director assistant |
| City | Baku, Azerbaijan | Hero, profile surfaces, structured data, press facts |
| Coordinates | 40.41° N, 49.87° E | Loader/header visual copy |
| Time zone | Asia/Baku | Live time displays and calendar language |
| Availability | Available | Header/menu/profile surfaces |
| Portrait | `/images/portrait.webp` | Home, press, article author card, menu, WebGL texture, social/schema image, gallery |
| Portrait alt text | Senan Qulamov leaning against a wooden wall at night in Baku | Home, gallery, article social image |
| Roles | Founder & CEO — BidBary; Tech Lead — PMIS; Shipping code since 2016 | Menu/footer profile blocks |

## Personal bio and identity claims

These claims are public-facing and are repeated in multiple places. Each needs factual review.

| Claim | Sources |
| --- | --- |
| Baku-based engineer | [`src/app/layout.tsx`](src/app/layout.tsx#L33), [`src/data/home.ts`](src/data/home.ts#L3), [`src/data/press.ts`](src/data/press.ts#L5), [`src/data/assistant.ts`](src/data/assistant.ts#L136) |
| Tech Lead at PMIS | [`src/data/profile.ts`](src/data/profile.ts#L24), [`src/data/home.ts`](src/data/home.ts#L5), [`src/data/press.ts`](src/data/press.ts#L10), [`src/data/cv.ts`](src/data/cv.ts#L49), [`src/data/assistant.ts`](src/data/assistant.ts#L136) |
| Founder / CEO of BidBary | [`src/data/profile.ts`](src/data/profile.ts#L23), [`src/data/cv.ts`](src/data/cv.ts#L30), [`src/data/home.ts`](src/data/home.ts#L49), [`src/data/press.ts`](src/data/press.ts#L14), [`src/data/assistant.ts`](src/data/assistant.ts#L136) |
| Former or seven-year therapist | [`src/app/layout.tsx`](src/app/layout.tsx#L33), [`src/data/cv.ts`](src/data/cv.ts#L157), [`src/data/home.ts`](src/data/home.ts#L5), [`src/data/press.ts`](src/data/press.ts#L10), [`src/data/assistant.ts`](src/data/assistant.ts#L415) |
| Engineer, founder, listener | [`src/app/layout.tsx`](src/app/layout.tsx#L59), [`src/lib/site.ts`](src/lib/site.ts#L26), [`src/app/opengraph-image.tsx`](src/app/opengraph-image.tsx#L6) |
| Work focus: responsive web apps, backends and APIs | [`src/data/assistant.ts`](src/data/assistant.ts#L551) |
| Visual direction and interface work | [`src/data/assistant.ts`](src/data/assistant.ts#L565) |
| NDA willingness | [`src/data/assistant.ts`](src/data/assistant.ts#L518) |
| Languages: Azerbaijani, English, Russian | [`src/components/pages/CreditsPage.tsx`](src/components/pages/CreditsPage.tsx#L93) |

## Timeline, employment, education, and practice

The full public CV is in [`src/data/cv.ts`](src/data/cv.ts). It contains the following factual record.

| Period | Role / organization | Location | Public detail |
| --- | --- | --- | --- |
| 2024–now | Founder & CEO, BidBary | Baku, Azerbaijan | Product vision, architecture, fundraising, platform and founding-team work |
| 2020–now | Founder & CEO, NeoSphere | Remote | Worker-union hub and gig marketplace; Laravel, React, and Java/Javalin |
| 2025–now | Tech Lead, PMIS | Baku, Azerbaijan | Leads engineering for project-controls systems used on BP projects |
| May 2025–now | Strong Middle Backend Developer, Inci Group of Companies LLC | Baku, Azerbaijan | Laravel/PHP, Java/Javalin APIs, integrations, performance, CI/CD |
| Mar–May 2025 | Middle Backend Developer, GlobalSoft | Baku, Azerbaijan | Laravel/PHP applications, APIs, integrations, performance |
| Jan 2024–Jan 2025 | Military service / Army duty | Azerbaijan | Mandatory service |
| Aug 2023–Jan 2024 | Freelance Full-stack Developer, self-employed | Remote | Web apps, APIs, data models, deployment |
| Nov 2022–Jul 2023 | Technical Lead & Full-stack Developer, ALLRENT | Baku, Azerbaijan | Built Allrent.io from scratch |
| May–Oct 2022 | Team Leader & Full-stack Developer, DEIRVLON Technologies | Baku, Azerbaijan | Laravel/JavaScript teams and cargo platform |
| Mar 2021–May 2022 | Full-stack Developer & Cybersecurity Admin, FERRUM CAPITAL | Baku, Azerbaijan | Laravel/React, security, Java APIs |
| Jul–Oct 2019 | Full-stack Web Developer Intern, ATL Tech | Baku, Azerbaijan | PHP/Laravel backend work |
| Seven years, parallel | Therapist, private practice | Baku, Azerbaijan | Counseling alongside engineering |
| 2021–2023 | Master of Computer Science, Baku State University / SABAH Groups | Baku, Azerbaijan | Cyber Security and Data Science; GPA 88.7; honors |
| 2017–2021 | Bachelor of Computer Science, Khazar University | Baku, Azerbaijan | GPA 89; honors; 2nd place at World Robot Olympiad Azerbaijan 2018 |

The CV also publishes these summary numbers: **7+ years writing code; 7+ years as a therapist; 100+ lives and projects; 10+ technical languages; 200+ books read**. See [`src/data/cv.ts`](src/data/cv.ts#L12).

## Home page claims

[`src/data/home.ts`](src/data/home.ts) controls most homepage copy. Current claims include:

- "Open to new projects from November" and "Portfolio, 2026 edition."
- "Engineer from Baku. Tech Lead at PMIS, founder of BidBary, and for seven years, a therapist."
- "Engineer · Founder · Listener · Since 2019."
- **7+** years writing production code; **7+** years as a therapist; **22** products and platforms shipped; **200+** books read.
- Timeline milestones: Khazar University and World Robot Olympiad (2017/2018); ATL Tech and client work (2019); first leadership work at Deirvlon and Allrent (2022); military service (2024); Inci Group and PMIS (2025); BidBary now.
- BidBary is described as a platform for auctions, concerts, private dinners, tours, and workshops.
- Contact offers include investing in BidBary, partnership, building work, and speaking on technology, psychology, and leadership.

## Press kit and talks

[`src/data/press.ts`](src/data/press.ts) contains three reusable biographies and public talk descriptions.

- Short bio: Baku-based engineer, tech lead, and BidBary founder.
- Medium bio: PMIS engineering lead, BidBary builder, seven years as a therapist.
- Long bio: Khazar University, Baku State University / SABAH Groups, production systems since 2019, Ferrum Capital, Deirvlon, Allrent, Inci Group, PMIS, BidBary, NeoSphere, and therapist history.
- Talks: **Leading engineers like a therapist** (30 minutes), **Platforms people gather on** (25 minutes), **Burnout-proof remote teams** (2 hours), and **Building from Baku for the world**.

## Director assistant: public answers that must stay current

[`src/data/assistant.ts`](src/data/assistant.ts) has English, Azerbaijani, and Russian answers. It duplicates and extends profile claims, so it needs updating whenever details change.

| Topic | Current public answer or promise | Primary locations |
| --- | --- | --- |
| Introduction | Baku engineer; PMIS Tech Lead; BidBary founder/CEO; seven years as therapist | Lines 131–140 |
| BidBary | Senan’s company for gathering formats | Lines 146–158 |
| Availability | Open from November; starts within two weeks of an agreed proposal | Lines 243–255 |
| Location | Baku, GMT+4; onsite and remote | Lines 258–270 |
| Marketplace experience | BidBary, AllRent, NeoSphere; AZN 7,000+; 12–20 weeks | Lines 337–351 |
| Fractional leadership | PMIS / Allrent / Deirvlon experience; from AZN 2,000 monthly | Lines 361–370 |
| Mentoring | Developers/founders; therapist background; from AZN 60 | Lines 395–403 |
| Career history | Production software since 2019; ATL Tech, Ferrum, Deirvlon, Allrent, GlobalSoft, Inci, PMIS | Lines 440–449 |
| Education | Baku State University master’s, Khazar bachelor’s, WRO Azerbaijan second place in 2018 | Lines 455–463 |
| Contact | Email and phone/WhatsApp | Lines 469–478 |
| Services and process promises | Written proposal in a few days; NDA willing; web-focused; custom UI available | Lines 487–491, 516–520, 549–567 |

## Portfolio and achievement claims

[`src/data/projects.ts`](src/data/projects.ts) is the source of all project cards, case studies, project metadata, sitemap entries, and `CreativeWork` schema. Every project has a client, year, status, role, long-form claims, technology list, and often numeric metrics.

| Project | Client | Period | Status | Role / metrics need factual review |
| --- | --- | --- | --- | --- |
| BidBary | BidBary | 2025–Present | In Development | Frontend developer; 8 supported languages, 3 user roles, 2D and 3D seatmaps |
| SCMAI | INCI Holding | 2025 | Active Development | Founder, system architect, full-stack developer |
| Edutoria | INCI | 2025–Present | Ongoing | Backend lead |
| JVD CLI | Personal Project | 2025–Present | Active | Solo developer; Java 21, 15+ commands, 100,000 max array, <30s build |
| Ofisait | INCI | 2025–Present | Ongoing | Backend developer; >99.9% uptime |
| AllRent | Startup Venture | 2022–2023 | Completed | Technical lead; 92% booking completion, <2s payments, 78% review participation |
| NeoSphere | Startup Venture | 2023–Present | MVP | Full-stack developer; +45% engagement, 20+ spheres, 28% higher job-fill rate |
| Ofisait10.az | Ofisait | 2025 | Completed | Backend developer |
| FLUXA | Personal Project | 2024–Present | Ongoing | Product architect, backend developer, UI system designer |
| HBNgroup.az | INCI | 2025–Present | Ongoing | Backend developer |
| Chat2 Maffin | INCI | 2025–Present | Ongoing | Backend owner; +~20% agent efficiency |
| GPS AI | INCI | 2025 | Completed | Backend engineer and admin-panel author |
| Passmate | Personal Project | 2024–Present | Completed | Java back-end developer; AES-256, <1s local sync, 0% exposure |
| Lucky Holidays | GlobalSoft | 2025 | Completed | Full-stack contributor; -30% catalog TTI, -40% checkout errors |
| CTSA | GlobalSoft | 2025 | Completed | Backend developer; -50% deploy time |
| Aqovo.az | Aqovo | 2024–Present | Ongoing | Full-stack developer |
| BIAR | BIAR | 2025 | Live | Designer, frontend and backend developer |
| JobHub.az | JobHub | 2024–2025 | Completed | Backend developer |
| AGA Group | FerrumCapital | 2021–2022 | Completed | Full-stack developer; <200ms TTFB, -60% editor effort |
| Shiplounge.co | Deirvlon Technologies | 2022 | Completed | Backend lead and UI architect; +~2× bulk operations |
| Otomall.az | FerrumCapital | 2021–2022 | Completed | Lead backend developer; <300ms, 99.7% payment success, 0 incidents |
| Balli | FerrumCapital | 2021–2022 | Completed | Backend/integration lead; +18% conversion, -35% LCP |

The exact narrative, feature, technology, link, image, and metric fields are next to each project entry. The first entry starts at [`src/data/projects.ts:37`](src/data/projects.ts#L37); the final entry ends near line 1130.

## Writing, books, gallery, and personal voice

- Five dated essays are defined in [`src/data/essays.ts`](src/data/essays.ts), with full public text in [`src/content/essays/`](src/content/essays). These include personal therapist/developer experience and first-person project narratives.
- [`src/data/books.ts`](src/data/books.ts) publishes sixteen books plus first-person notes about how they affected Senan’s thinking. The Library page claims more than **200 books** and that these sixteen are recurring recommendations.
- [`src/data/gallery.ts`](src/data/gallery.ts) publishes one portrait as a real photo: **Baku, 2025**, captioned "Between the builds." The remaining 50 photos are explicitly generated placeholders with Baku/Absheron/Quba/Sheki/Gabala labels, dates spanning 2019–2026, source credits, and `placeholder: true`.
- [`src/experience/extras.ts`](src/experience/extras.ts#L165) exposes a console signature and the email address.

## Metadata, search, and social identity

| Surface | Current personal information |
| --- | --- |
| Root metadata / Person schema | Name, alternate spelling, portrait, city, Tech Lead title, PMIS employer, LinkedIn, GitHub; [`src/app/layout.tsx`](src/app/layout.tsx) |
| Default site title | "Senan Qulamov \| Engineer, founder, listener"; [`src/app/layout.tsx`](src/app/layout.tsx#L59) |
| Open Graph image | Senan Qulamov, official domain, PMIS Tech Lead, BidBary founder, seven-year therapist claim; [`src/app/opengraph-image.tsx`](src/app/opengraph-image.tsx) |
| Route metadata | Name in descriptions for Work, Services, Start, Credits, Journal, Library, Lab, Press, Contact, Ask, and Gallery routes; [`src/app`](src/app) |
| Article schema | Portrait, author identity, article metadata; [`src/app/journal/[slug]/page.tsx`](src/app/journal/[slug]/page.tsx) |
| Project schema | Senan’s Person identifier as author; [`src/app/work/[slug]/page.tsx`](src/app/work/[slug]/page.tsx) |

## Contact and deployment configuration

| Setting | Current value | Location |
| --- | --- | --- |
| Form recipient fallback | qulamovsenan@gmail.com | [`src/app/api/contact/route.ts`](src/app/api/contact/route.ts#L22) |
| Example email recipient | qulamovsenan@gmail.com | [`.env.example`](.env.example) and [`README.md`](README.md#L81) |
| Example sender | `Portfolio <hello@senanqulamov.com>` | [`.env.example`](.env.example) and [`README.md`](README.md#L82) |
| Official production URL | https://senanqulamov.com | [`src/lib/site.ts`](src/lib/site.ts#L3), [`.env.example`](.env.example), [`README.md`](README.md) |
| Redirected temporary domain | senanqulamov.vercel.app | [`next.config.ts`](next.config.ts#L16) |
| Legacy-domain migration instructions | 48team.space → senanqulamov.com | [`README.md`](README.md#L121) |

## Inconsistencies and stale information to decide before editing

1. **Start year conflict:** `profile.roles` says "Shipping code since 2016," while the homepage, press bio, and assistant say production work started in **2019**. The CV begins with ATL Tech in 2019.
2. **Availability conflict:** `profile.availability` says **Available**, while the homepage and assistant say **Open to new projects from November**.
3. **Current-role flags:** In the CV, both **NeoSphere (2020–now)** and **Inci Group (May 2025–now)** use `current: false`, although their date ranges say "to now." This affects the visual current-status treatment.
4. **NeoSphere dates conflict:** CV says **2020–now**; the portfolio case study says **2023–Present**.
5. **BidBary role wording differs:** profile says Founder & CEO; homepage says Founder and CEO; project case study says backend developer; assistant calls it Senan’s company. Confirm the preferred title and scope.
6. **PMIS wording differs:** some older generated material had "PMIS (BP)"; current source says "PMIS," while the CV says its systems are used on BP projects. Confirm what may be named publicly.
7. **Time-sensitive copy:** "Portfolio, 2026 edition," photo caption "Baku, 2025," the footer copyright year, gallery range "2019–2026," and all `to now` statements should be reviewed periodically.
8. **High-risk quantitative claims:** CV totals, project conversion/performance percentages, assistant prices and timing promises, GPA values, and the book count all need confirmation before continued publication.

## Recommended correction format

Reply with edits in this form. I will update the canonical source and every duplicate, including English/Azerbaijani/Russian Director answers and search metadata where relevant.

```text
Name: ...
Alternate spelling: ...
Email: ...
Phone / WhatsApp: ...
Location and timezone: ...
Availability: ...
Current role / employer: ...
BidBary title and description: ...
Therapist statement: ...
Career start year: ...
CV changes: ...
Project changes (project name → correction): ...
Any claim to remove: ...
```
