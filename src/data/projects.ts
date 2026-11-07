export type ProjectType = "Startup" | "Client" | "Personal";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  type: ProjectType;
  status: string;
  summary: string;
  story: string[];
  problem: string;
  solution: string;
  impact: string;
  role: string;
  metrics: { value: string; label: string }[];
  note: string;
  features: string[];
  tech: string[];
  cover: string | null;
  images: string[];
  liveUrl: string;
  githubUrl: string;
  /** Two colors used behind the screenshots while they load. */
  colors: [string, string];
  /** Extended case-study metadata for richer project records. */
  yearRange?: string;
  shortDescription?: string;
  longDescription?: string;
  description?: string;
  blog?: string;
  techTags?: string[];
  technologies?: string[];
  personalNote?: string;
  category?: string;
  featured?: boolean;
  featuredOrder?: number;
  date?: string;
};

export const projectTypeLabel: Record<ProjectType, string> = {
  Startup: "Venture",
  Client: "Client work",
  Personal: "Personal",
};

export const projects: Project[] = [
  {
    slug: "bidbary",
    title: "BidBary",
    subtitle: "Event Discovery & Ticketing Platform",
    client: "BidBary",
    year: "2025 – Present",
    type: "Startup",
    status: "In Development",
    summary: "Full-featured event platform for discovering, booking, hosting, and managing live experiences.",
    story: [
      "BidBary is a modern event platform that connects attendees with concerts, auctions, parties, tours, workshops, exhibitions, and other live experiences. The platform includes event discovery, authentication, ticket booking, seat selection, payment processing, organizer tools, attendee management, admin moderation, QR ticket scanning, and multilingual support.",
      "The platform also provides organizers with event creation and editing tools, ticket tiers, media management, seatmap configuration, attendee analytics, check-in workflows, and QR-based ticket validation. Its frontend uses a modern responsive interface with multilingual support, dark mode, animations, PWA capabilities, and real backend API integration.",
    ],
    problem:
      "Event discovery and ticketing often require separate tools for browsing events, booking seats, processing payments, managing attendees, and validating tickets.",
    solution:
      "Built an integrated event marketplace with public event discovery, authenticated booking and payment flows, configurable seatmaps, organizer dashboards, admin moderation, attendee management, and QR-based check-in.",
    impact:
      "Created a unified experience for attendees, organizers, and administrators while supporting real API-backed commerce flows, multilingual navigation, digital tickets, and operational event management.",
    role: "Frontend developer responsible for the Next.js application, API integration, authentication flows, booking and payment UX, seatmap tooling, organizer dashboards, and ticket validation interfaces.",
    metrics: [
      {
        label: "Supported Languages",
        value: "8",
      },
      {
        label: "User Roles",
        value: "5",
      },
      {
        label: "Seatmap Experiences",
        value: "2D and 3D",
      },
    ],
    note: "BidBary combines marketplace, commerce, and event-operations workflows in one product. The most interesting challenge was keeping discovery, booking, payments, seat availability, organizer tools, and check-in flows consistent across different user roles.",
    features: [
      "Event Discovery",
      "Ticket Booking",
      "Seatmap Builder",
      "Payment Processing",
      "Organizer Dashboards",
      "QR Ticket Check-in",
      "Admin Moderation",
      "Multilingual Support",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js", "Framer Motion"],
    cover: "/images/bidbary/1.png",
    images: [
      "/images/bidbary/1.png",
      "/images/bidbary/2.png",
      "/images/bidbary/3.png",
      "/images/bidbary/4.png",
      "/images/bidbary/5.png",
      "/images/bidbary/6.png",
      "/images/bidbary/7.png",
      "/images/bidbary/8.png",
      "/images/bidbary/9.png",
      "/images/bidbary/10.png",
    ],
    liveUrl: "https://bidbary.me",
    githubUrl: "https://github.com/senanqulamov/BidBary",
    colors: ["#c084fc", "#f472b6"],
    yearRange: "2025 – Present",
    shortDescription:
      "Full-featured event platform for discovering, booking, hosting, and managing live experiences.",
    longDescription:
      "BidBary is a modern event platform that connects attendees with concerts, auctions, parties, tours, workshops, exhibitions, and other live experiences. The platform includes event discovery, authentication, ticket booking, seat selection, payment processing, organizer tools, attendee management, admin moderation, QR ticket scanning, and multilingual support.",
    description: "Event discovery, ticketing, booking, organizer management, payments, and seatmap tooling.",
    blog: "<p>BidBary is an all-in-one event platform built for discovering, booking, hosting, and managing live experiences. Attendees can browse events, save favorites, reserve seats, complete payments, and access digital tickets.</p><p>The platform also provides organizers with event creation and editing tools, ticket tiers, media management, seatmap configuration, attendee analytics, check-in workflows, and QR-based ticket validation. Its frontend uses a modern responsive interface with multilingual support, dark mode, animations, PWA capabilities, and real backend API integration.</p>",
    techTags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js", "Framer Motion"],
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "Radix UI",
      "Framer Motion",
      "Three.js",
      "React Three Fiber",
      "Konva",
      "Next-intl",
      "JWT",
    ],
    personalNote:
      "BidBary combines marketplace, commerce, and event-operations workflows in one product. The most interesting challenge was keeping discovery, booking, payments, seat availability, organizer tools, and check-in flows consistent across different user roles.",
    category: "Startups",
    featured: false,
    featuredOrder: 11,
    date: "2025 - Present",
  },
  {
    slug: "scmai",
    title: "SCMAI",
    subtitle: "SAP-Aligned Supply Chain & Procurement Platform",
    client: "INCI Holding",
    year: "2025",
    type: "Client",
    status: "Active Development",
    summary:
      "SCMAI is an enterprise-grade supply chain and procurement management platform developed for INCI Holding. The system is designed to mirror and extend SAP Ariba-style workflows while remaining fully customizable and internally controlled. Built on the FLUXA admin panel foundation, SCMAI delivers structured RFQ management, supplier portals, market-based product comparison, order workflows, SLA tracking, and compliance-focused analytics.",
    story: [
      "SCMAI was developed to address the limitations of off-the-shelf procurement solutions by providing SAP-aligned workflows without SAP-level rigidity or licensing constraints.",
      "The platform supports multi-market procurement, RFQ lifecycle management, supplier portals, quote comparison, order processing, and performance monitoring. Built on the FLUXA admin panel foundation, SCMAI emphasizes operational clarity, role separation, and enterprise-grade usability.",
      "Special focus was placed on mirroring SAP Ariba concepts such as RFQs, supplier invitations, award flows, SLA tracking, and audit-ready activity logs while keeping the system flexible and internally owned.",
    ],
    problem:
      "INCI Holding required SAP-aligned procurement workflows without the cost, rigidity, and complexity of full SAP Ariba adoption.",
    solution:
      "Designed and implemented a custom procurement platform based on FLUXA, replicating SAP Ariba concepts such as RFQs, supplier portals, quote evaluation, order flows, and SLA tracking while maintaining full internal control.",
    impact:
      "Centralized procurement operations, improved supplier visibility, faster RFQ cycles, and reduced dependency on external enterprise software vendors.",
    role: "Founder, System Architect, Full-Stack Developer",
    metrics: [
      {
        label: "Procurement Coverage",
        value: "End-to-End",
      },
      {
        label: "Workflow Alignment",
        value: "SAP-Compatible",
      },
    ],
    note: "SCMAI is one of the clearest examples of applying enterprise UX, SAP-level workflow thinking, and clean architecture on top of a custom-built admin foundation.",
    features: [
      "SAP-Aligned RFQ Workflows",
      "Supplier Portal",
      "Multi-Market Product Comparison",
      "Order & Award Management",
      "SLA Tracking",
      "Audit Logs & Activity Monitoring",
      "Role-Based Access Control",
      "FLUXA-Based Admin Architecture",
    ],
    tech: ["Laravel", "PHP 8.3", "FLUXA Admin Panel", "PostgreSQL", "REST APIs", "Role-Based Access Control"],
    cover: "/images/scmai/19.webp",
    images: [
      "/images/scmai/19.webp",
      "/images/scmai/1.webp",
      "/images/scmai/2.webp",
      "/images/scmai/3.webp",
      "/images/scmai/4.webp",
      "/images/scmai/5.webp",
      "/images/scmai/6.webp",
      "/images/scmai/7.webp",
      "/images/scmai/8.webp",
      "/images/scmai/9.webp",
      "/images/scmai/10.webp",
      "/images/scmai/11.webp",
      "/images/scmai/12.webp",
      "/images/scmai/13.webp",
      "/images/scmai/14.webp",
      "/images/scmai/15.webp",
      "/images/scmai/16.webp",
      "/images/scmai/17.webp",
      "/images/scmai/18.webp",
    ],
    liveUrl: "",
    githubUrl: "",
    colors: ["#1e293b", "#312e81"],
  },
  {
    slug: "edutoria",
    title: "Edutoria",
    subtitle: "Learning Management System",
    client: "INCI",
    year: "2025 to Present",
    type: "Client",
    status: "Ongoing",
    summary:
      "This Learning Management System (LMS) is a comprehensive educational platform built with Laravel, Livewire, and MySQL. It features course authoring tools, student enrollment management, quiz creation and grading, progress tracking, and certificate generation.",
    story: [
      "The Learning Management System required robust course delivery capabilities, comprehensive student tracking, and efficient grading tools. The implementation focused on performance optimization for larger cohorts, reliable quiz processing, and comprehensive reporting.",
      "Key features include course authoring, enrollment management, automated quiz grading, progress tracking, and certificate generation.",
    ],
    problem: "Needed a robust LMS with quizzes, grading, and progress tracking.",
    solution: "Implemented a modular Laravel architecture with RBAC, queues, and cached catalog queries.",
    impact: "Smooth student experience and maintainable admin workflows.",
    role: "Backend lead; collaborated with stakeholders on curriculum workflows.",
    metrics: [
      {
        label: "N+1 Queries",
        value: "Eliminated",
      },
      {
        label: "Scalability",
        value: "High",
      },
    ],
    note: "I enjoyed tuning reporting queries for larger cohorts.",
    features: ["Course Authoring", "Enrollment Management", "Quiz System", "Certificate Generation"],
    tech: ["Laravel", "PHP 8+", "MySQL", "Tailwind", "Livewire", "Docker"],
    cover: "/images/lms.maffin.az/2.webp",
    images: [
      "/images/lms.maffin.az/2.webp",
      "/images/lms.maffin.az/1.webp",
      "/images/lms.maffin.az/3.webp",
      "/images/lms.maffin.az/4.webp",
      "/images/lms.maffin.az/5.webp",
      "/images/lms.maffin.az/6.webp",
    ],
    liveUrl: "https://lms.maffin.az",
    githubUrl: "",
    colors: ["#2563eb", "#4338ca"],
  },
  {
    slug: "jvd-cli",
    title: "JVD CLI",
    subtitle: "Java Command-Line Interface Toolkit",
    client: "Personal Project",
    year: "2025 to Present",
    type: "Personal",
    status: "Active",
    summary:
      "JVD CLI is a powerful command-line toolkit built with Java 21 and Gradle, designed for demos, interviews, and as a foundation for premium CLI applications. It features math utilities, array operations, generators, and a comprehensive PrintHelpers module for rich terminal formatting including ANSI colors, progress bars, spinners, ASCII tables, and a fluent logging API. The architecture emphasizes clean separation of concerns, extensibility, and developer experience.",
    story: [
      "JVD CLI was created by Me to demonstrate clean architecture patterns in Java command-line applications. The project showcases not just algorithmic utilities, but also how to build developer-friendly interfaces with rich terminal output capabilities.",
      "The PrintHelpers module is the heart of the UX system, offering a fluent API for logging, formatted boxes, progress indicators, and ASCII tables. The command registry pattern makes adding new functionality trivial—just one registration line and a handler method.",
      "Technical highlights include performance-conscious StringBuilder usage, configurable color themes, lazy debug evaluation, and ANSI terminal support across platforms. The project serves as both a practical tool and a teaching resource for building production-ready CLI applications.",
    ],
    problem:
      "Building professional, user-friendly command-line applications in Java requires significant boilerplate for argument parsing, output formatting, and command management.",
    solution:
      "Developed JVD CLI with a clean command registry pattern, comprehensive PrintHelpers toolkit for rich terminal output, and extensible architecture. Implemented fluent APIs for logging, progress tracking, and formatted output to make CLI development intuitive and maintainable.",
    impact:
      "Provides a production-ready foundation for Java CLI applications. Reduces development time through reusable components and demonstrates best practices for terminal UX, making it ideal for demos, interviews, and educational purposes.",
    role: "Solo developer responsible for architecture design, implementation of all utilities and UI helpers, build configuration, and CI/CD pipeline setup.",
    metrics: [
      {
        label: "Java Version",
        value: "21",
      },
      {
        label: "Commands Supported",
        value: "15+",
      },
      {
        label: "Max Array Size",
        value: "100,000",
      },
      {
        label: "Build Time",
        value: "< 30s",
      },
    ],
    note: "I built JVD CLI for Java Days 2025 to showcase modern Java development practices. It's designed to be both a useful toolkit and a reference implementation for anyone building professional command-line applications.",
    features: [
      "Math Utilities",
      "Array Operations",
      "Rich Terminal Output",
      "Fluent Logging API",
      "Extensible Command System",
    ],
    tech: ["Java 21", "Gradle", "ANSI Terminal", "GitHub Actions"],
    cover: "/images/javadays/jvd.webp",
    images: [
      "/images/javadays/jvd.webp",
      "/images/javadays/jvd1.webp",
      "/images/javadays/jvd2.webp",
      "/images/javadays/jvd3.webp",
      "/images/javadays/jvd4.webp",
      "/images/javadays/jvd5.webp",
      "/images/javadays/jvd6.webp",
    ],
    liveUrl: "",
    githubUrl: "https://github.com/senanqulamov/JavaDays",
    colors: ["#f97316", "#ef4444"],
  },
  {
    slug: "ofisait",
    title: "Ofisait",
    subtitle: "Office Management System",
    client: "INCI",
    year: "2025 to Present",
    type: "Client",
    status: "Ongoing",
    summary:
      "Ofisait.az is an e-commerce platform specialized for office supplies, built with OpenCard, PHP and MySQL in a Docker environment. The system features product catalog management, order processing, inventory tracking, and customer account management with a focus on B2B workflows.",
    story: [
      "Ofisait.az required a reliable e-commerce platform with B2B capabilities and consistent environments across development and production. The solution leveraged Laravel with MySQL in Docker containers for reproducible deployments.",
      "Key features include comprehensive product catalog management, streamlined checkout for business accounts, and reliable order processing workflows.",
    ],
    problem: "Needed a reliable e‑commerce backend for office supplies with MySql.",
    solution: "Delivered a PHP + MySql stack with Docker for consistent environments.",
    impact: "Stable operations and maintainable codebase.",
    role: "Backend developer owning architecture and deployment.",
    metrics: [
      {
        label: "Uptime",
        value: "> 99.9%",
      },
      {
        label: "DB",
        value: "MySql",
      },
    ],
    note: "I leaned on Docker to keep environments identical across machines.",
    features: ["Product Catalog", "Order Processing", "Inventory Management", "Business Accounts"],
    tech: ["OpenCard", "PHP", "MySql", "Docker"],
    cover: "/images/ofisait.az/3.webp",
    images: [
      "/images/ofisait.az/3.webp",
      "/images/ofisait.az/1.webp",
      "/images/ofisait.az/2.webp",
      "/images/ofisait.az/4.webp",
      "/images/ofisait.az/5.webp",
    ],
    liveUrl: "https://ofisait.az",
    githubUrl: "",
    colors: ["#f97316", "#dc2626"],
  },
  {
    slug: "allrent",
    title: "AllRent",
    subtitle: "Online Rental Marketplace",
    client: "Startup Venture",
    year: "2022 to 2023",
    type: "Startup",
    status: "Completed",
    summary:
      "Allrent.io is a comprehensive rental marketplace platform built from the ground up. It features secure online payments, customer review systems, interactive property maps, and a custom reservation calendar system designed to handle complex booking scenarios.",
    story: [
      "Allrent.io is a modern rental platform I built from the ground up, initially as a freelancer and later as the company's technical lead. It features online payments, review systems, interactive maps, and a custom reservation calendar. Stack: Laravel, React, MySQL.",
      "The platform handles the entire rental lifecycle from discovery to booking to post-stay reviews, with custom workflows for different rental types and durations.",
    ],
    problem:
      "Existing rental platforms had rigid booking systems that didn't accommodate the variety of rental types and booking scenarios in the market.",
    solution:
      "Built a flexible rental platform with customizable booking rules, integrated payment processing, and location-based discovery tools.",
    impact:
      "Enabled property owners to define custom rental terms while providing renters with a streamlined, trustworthy booking experience.",
    role: "Technical lead responsible for platform architecture, payment integration, and booking system logic.",
    metrics: [
      {
        label: "Booking Completion Rate",
        value: "92%",
      },
      {
        label: "Payment Processing Time",
        value: "< 2s",
      },
      {
        label: "Review Participation",
        value: "78%",
      },
    ],
    note: "The custom reservation calendar was particularly challenging but rewarding to build—it needed to handle everything from hourly to multi-month bookings with different rules.",
    features: ["Online Payments", "Interactive Maps", "Custom Reservation Calendar", "Review System"],
    tech: ["Laravel", "React", "MySQL", "Bootstrap"],
    cover: "/images/allrent/2.webp",
    images: [
      "/images/allrent/2.webp",
      "/images/allrent/1.webp",
      "/images/allrent/3.webp",
      "/images/allrent/4.webp",
      "/images/allrent/5.webp",
      "/images/allrent/6.webp",
      "/images/allrent/7.webp",
      "/images/allrent/8.webp",
      "/images/allrent/9.webp",
      "/images/allrent/10.webp",
      "/images/allrent/11.webp",
      "/images/allrent/12.webp",
      "/images/allrent/13.webp",
      "/images/allrent/14.webp",
      "/images/allrent/15.webp",
    ],
    liveUrl: "",
    githubUrl: "",
    colors: ["#facc15", "#f97316"],
  },
  {
    slug: "neosphere",
    title: "NeoSphere",
    subtitle: "Union Hub & Gig Marketplace",
    client: "Startup Venture",
    year: "2023 to Present",
    type: "Startup",
    status: "MVP",
    summary:
      "NeoSphere is a hybrid gig marketplace and networking hub designed to connect people with opportunities, communities, and growth. The platform features a unique social structure with Spheres and Core Hubs, a karma-based reputation system, job boards, and event discovery tools.",
    story: [
      "NeoSphere is a hybrid gig marketplace and networking hub designed to connect people with opportunities, communities, and growth. Users can explore job boards, attend events, and build reputation through a karma-based system. Organizations can create sponsored Spheres, while Core Hubs provide structure and governance. Tech stack: Laravel (backend), React (frontend), MySQL.",
      "The platform reimagines how communities and work opportunities intersect, creating a more organic ecosystem for talent discovery and community building.",
    ],
    problem:
      "Traditional job boards and networking platforms operate in silos, separating professional opportunities from community engagement.",
    solution:
      "Created an integrated platform that merges gig economy functionality with community building through spheres, hubs, and karma-based reputation systems.",
    impact:
      "Provides a more holistic approach to professional networking that emphasizes community contribution alongside traditional job seeking.",
    role: "Full-stack developer responsible for core platform architecture, community features, and reputation systems.",
    metrics: [
      {
        label: "User Engagement",
        value: "+45% vs. traditional platforms",
      },
      {
        label: "Community Spheres",
        value: "20+",
      },
      {
        label: "Job Fill Rate",
        value: "28% higher than industry average",
      },
    ],
    note: "Building NeoSphere has been exciting because it approaches the connection between work and community from a fundamentally different perspective.",
    features: [
      "Job Marketplace",
      "Event Discovery & Hosting",
      "Karma Reputation System",
      "Sponsored & Community Spheres",
    ],
    tech: ["Laravel", "React", "MySQL"],
    cover: "/images/neosphere/1.webp",
    images: ["/images/neosphere/1.webp", "/images/neosphere/1.webp"],
    liveUrl: "",
    githubUrl: "",
    colors: ["#F2C57C", "#3A0E16"],
  },
  {
    slug: "ofisait10",
    title: "Ofisait10.az",
    subtitle: "Next-Gen E-Commerce Platform",
    client: "Ofisait",
    year: "2025",
    type: "Client",
    status: "Completed",
    summary:
      "Ofisait10.az is the new evolution of Ofisait — a cutting-edge e-commerce platform built with modern Laravel architecture and optimized for marketplace operations. It supports multi-vendor capabilities, advanced product catalogs, secure transactions, flexible vendor dashboards, and scalable commerce APIs tailored for growth.",
    story: [
      "Ofisait10.az represents a leap forward from the legacy Ofisait platform by integrating marketplace and vendor features into a modern, scalable Laravel system.",
      "The platform was built to support thousands of products, multiple vendors with role-based permissions, advanced order workflows, and performant APIs for both frontend and partner integrations.",
      "Key efforts focused on clean modular services, database scaling, secure payment pipelines, and flexible vendor management tools to handle varied commercial operations.",
    ],
    problem:
      "Legacy e-commerce lacked marketplace features and scalable backend for vendors and advanced commerce functionality.",
    solution:
      "Rebuilt with latest Laravel, modular vendor engine, performant APIs, multi-vendor workflows, and optimized database access.",
    impact:
      "Delivering a modern commerce experience, enabling vendors to grow, and reducing operational load for admins.",
    role: "Backend developer focused on architecture, vendor systems, and marketplace APIs.",
    metrics: [
      {
        label: "Marketplace Scalability",
        value: "Enabled",
      },
      {
        label: "Vendor Flexibility",
        value: "High",
      },
    ],
    note: "Enjoyed shaping a next-level commerce backend — marketplace logic is always fun to architect correctly.",
    features: [
      "Multi-Vendor Marketplace",
      "Vendor Dashboards",
      "Advanced Product Management",
      "Secure Transaction APIs",
      "Scalable Backend Services",
    ],
    tech: ["Laravel", "PHP 8+", "MySQL", "Redis", "Docker", "REST API"],
    cover: "/images/ofisait10.az/ofisait10_banner.webp",
    images: [
      "/images/ofisait10.az/ofisait10_banner.webp",
      "/images/ofisait10.az/1.webp",
      "/images/ofisait10.az/2.webp",
      "/images/ofisait10.az/3.webp",
      "/images/ofisait10.az/4.webp",
      "/images/ofisait10.az/5.webp",
      "/images/ofisait10.az/6.webp",
      "/images/ofisait10.az/8.webp",
      "/images/ofisait10.az/7.webp",
    ],
    liveUrl: "https://ofisait10.az",
    githubUrl: "",
    colors: ["#15803d", "#14532d"],
  },
  {
    slug: "fluxa",
    title: "FLUXA",
    subtitle: "Admin Panel Foundation",
    client: "Personal Project",
    year: "2024 to Present",
    type: "Personal",
    status: "Ongoing",
    summary:
      "FLUXA is a modern admin panel foundation designed for building serious internal tools and back-office systems. It prioritizes predictable UI patterns, workflow-driven layouts, and reusable components over visual noise. Built with Laravel 12, Livewire 3, and TallStackUI, FLUXA serves as a solid base for e-commerce platforms, ERP-style systems, content dashboards, and enterprise internal tools.",
    story: [
      "FLUXA was created to solve a recurring problem: most admin panels look good in screenshots but fail under real operational workloads.",
      "The goal was to design a dark-first, enterprise-feeling admin foundation that stays readable during long sessions, enforces consistent interaction rules, and scales across different business domains.",
      "FLUXA is intentionally positioned as a foundation — not a finished product — allowing developers to adapt, extend, and ship internal tools without fighting their UI or architecture.",
    ],
    problem:
      "Most admin panels are visually driven but break down in real operational workflows and long-term maintenance.",
    solution:
      "Designed a dark-first, workflow-oriented admin foundation with reusable components, consistent patterns, and pragmatic architecture.",
    impact:
      "Faster internal tool development, consistent admin UX, and reduced long-term UI and logic complexity.",
    role: "Product architect, backend developer, and UI system designer.",
    metrics: [
      {
        label: "Workflow Clarity",
        value: "High",
      },
      {
        label: "Extensibility",
        value: "Designed-in",
      },
    ],
    note: "FLUXA reflects how admin systems should actually feel when used daily, not just demoed.",
    features: [
      "Dark-First Design System",
      "Workflow-Oriented Layouts",
      "Reusable Admin Components",
      "Livewire-Driven Interactivity",
      "Enterprise-Ready Foundation",
    ],
    tech: ["Laravel 12", "Livewire 3", "TallStackUI", "PHP 8.3"],
    cover: "/images/fluxa/fluxa_banner.webp",
    images: ["/images/fluxa/fluxa_banner.webp"],
    liveUrl: "",
    githubUrl: "",
    colors: ["#262626", "#0a0a0a"],
  },
  {
    slug: "hbngroup",
    title: "HBNgroup.az",
    subtitle: "Enterprise Platform",
    client: "INCI",
    year: "2025 to Present",
    type: "Client",
    status: "Ongoing",
    summary:
      "HBNgroup.az is an enterprise-grade platform built with Laravel, PostgreSQL, and Docker. It features strict role-based access control, secure API endpoints, automated CI/CD pipelines, comprehensive monitoring, and strict database policies for data integrity and security.",
    story: [
      "HBNgroup.az required a secure enterprise platform with automated deployment processes and strict access controls. The implementation focused on hardened security, reliable CI/CD pipelines, and comprehensive monitoring.",
      "The system features strict role-based access control, secure API endpoints, automated testing in the CI/CD pipeline, and comprehensive audit logging for security compliance.",
    ],
    problem: "Required secure APIs and automated deployments for enterprise teams.",
    solution: "Built strict RBAC, CI/CD, and monitoring; tightened database policies and migrations.",
    impact: "Confidence in releases and data security; faster cycle times.",
    role: "Backend developer focusing on security and delivery.",
    metrics: [
      {
        label: "Release Confidence",
        value: "High",
      },
      {
        label: "Security",
        value: "Hardened",
      },
    ],
    note: "Loved bringing order and safety to a complex enterprise landscape.",
    features: ["Secure APIs", "Role-Based Access", "Automated CI/CD", "Enterprise Monitoring"],
    tech: ["Laravel", "PHP 8+", "PostgreSQL", "Docker", "CI/CD"],
    cover: "/images/hbngroup.az/3.webp",
    images: [
      "/images/hbngroup.az/3.webp",
      "/images/hbngroup.az/1.webp",
      "/images/hbngroup.az/2.webp",
      "/images/hbngroup.az/4.webp",
      "/images/hbngroup.az/5.webp",
      "/images/hbngroup.az/6.webp",
      "/images/hbngroup.az/7.webp",
      "/images/hbngroup.az/8.webp",
      "/images/hbngroup.az/9.webp",
      "/images/hbngroup.az/10.webp",
    ],
    liveUrl: "https://hbngroup.az",
    githubUrl: "",
    colors: ["#334155", "#0f172a"],
  },
  {
    slug: "chat2-maffin",
    title: "Chat2 Maffin",
    subtitle: "Real-Time Chat Application",
    client: "INCI",
    year: "2025 to Present",
    type: "Client",
    status: "Ongoing",
    summary:
      "Chat2Desk.az is a unified communication platform that integrates multiple messaging channels into a single interface. Built with Laravel and MySQL, it connects to external messaging APIs, provides secure routing based on user roles, and streamlines support workflows for customer service teams.",
    story: [
      "Chat2Desk.az needed to unify multiple communication channels and streamline support workflows for agents. The solution integrated external messaging APIs with reliable retry strategies and secure routing based on agent roles.",
      "The platform centralizes messages from various sources, provides context for support agents, and enables efficient workflow management for customer inquiries.",
    ],
    problem: "Teams needed a unified place for message routing and support workflows.",
    solution: "Built Laravel services integrating external APIs; implemented secure roles & workflows.",
    impact: "Cleaner comms and fewer manual steps for agents.",
    role: "Backend owner for integrations and secure routing.",
    metrics: [
      {
        label: "Agent Efficiency",
        value: "+~20%",
      },
    ],
    note: "Integration reliability is everything—retry strategies paid off.",
    features: ["Channel Integration", "Message Routing", "Agent Workflows", "Customer Context"],
    tech: ["Laravel", "PHP 8+", "MySQL"],
    cover: "/images/chat2.maffin.az/1.webp",
    images: [
      "/images/chat2.maffin.az/1.webp",
      "/images/chat2.maffin.az/2.webp",
      "/images/chat2.maffin.az/3.webp",
      "/images/chat2.maffin.az/4.webp",
      "/images/chat2.maffin.az/5.webp",
      "/images/chat2.maffin.az/6.webp",
    ],
    liveUrl: "https://chat2desk.az",
    githubUrl: "",
    colors: ["#a855f7", "#db2777"],
  },
  {
    slug: "gps-ai",
    title: "GPS AI",
    subtitle: "AI-Powered GPS Tracking",
    client: "INCI",
    year: "2025",
    type: "Client",
    status: "Completed",
    summary:
      "GPSAI.az is a sophisticated GPS tracking platform with AI-enhanced telemetry analysis. The system processes real-time location data, applies machine learning for pattern recognition, and provides actionable insights through a customized admin interface.",
    story: [
      "GPSAI.az required robust telemetry processing capabilities with a clear operator interface for monitoring and management. The solution focused on optimized data processing, background workers for analysis, and a clean admin UI for day-to-day operations.",
      "The system handles large volumes of telemetry data with optimized database design and efficient background processing for analytics and reporting.",
    ],
    problem: "Telemetry workloads demanded scalable APIs and a clear operator UI.",
    solution: "Built Laravel APIs and a custom admin panel; optimized hot reads and background jobs.",
    impact: "Stable operations with low latency; clean admin for day‑to‑day tasks.",
    role: "Backend engineer and admin panel author.",
    metrics: [
      {
        label: "API Latency",
        value: "Low",
      },
      {
        label: "Admin Tasks",
        value: "Streamlined",
      },
    ],
    note: "Telemetry is all about well‑indexed reads and reliable workers.",
    features: ["GPS Tracking", "AI Analysis", "Real-time Monitoring", "Custom Admin Interface"],
    tech: ["Laravel", "Javalin", "PHP 8+", "MySQL/PostgreSQL"],
    cover: "/images/gpsai.az/4.webp",
    images: [
      "/images/gpsai.az/4.webp",
      "/images/gpsai.az/1.webp",
      "/images/gpsai.az/2.webp",
      "/images/gpsai.az/3.webp",
    ],
    liveUrl: "https://gpsai.az",
    githubUrl: "",
    colors: ["#16a34a", "#0f766e"],
  },
  {
    slug: "passmate",
    title: "Passmate",
    subtitle: "Secure Password Manager",
    client: "Personal Project",
    year: "2024 to Present",
    type: "Personal",
    status: "Completed",
    summary:
      "Passmate is a secure password manager built with Java and JavaFX. It features end-to-end encryption, multiple vaults for password organization, and seamless cross-device synchronization through a Dockerized infrastructure. Designed as a practical cybersecurity-focused project for exploring encryption best practices and real-world data protection challenges.",
    story: [
      "Passmate began as a practical exploration of encryption best practices. I designed it to be a fully-featured password manager with a focus on user privacy and security. The app features AES-256 encryption for all stored credentials, with a zero-knowledge architecture that ensures even the application server cannot access your unencrypted data.",
      "Key technical highlights include secure vault management, cross-device synchronization, password strength analysis, and a clean interface built with Java and JavaFX",
    ],
    problem:
      "Managing and syncing passwords securely across multiple devices while maintaining user privacy is complex and often dependent on third-party cloud providers.",
    solution:
      "Developed Passmate — a self-hosted password manager with encrypted local storage and secure synchronization. Designed the architecture using Java for backend, JavaFX for a smooth interface, and Docker for reproducible environments.",
    impact:
      "Empowers users to take control of their password data without relying on external services. Enhances cybersecurity habits by promoting local encryption and user-managed vaults.",
    role: "Back-end Java Developer responsible for system architecture, encryption logic, app design integration, and deployment pipeline.",
    metrics: [
      {
        label: "Encryption Strength",
        value: "AES-256",
      },
      {
        label: "Sync Speed",
        value: "< 1s local vault sync",
      },
      {
        label: "User Data Exposure",
        value: "0%",
      },
    ],
    note: "I built Passmate to deepen my knowledge of encryption and security-oriented Java and JavaFX architectures. It's both a portfolio project and a personal tool for secure credential management.",
    features: ["End-to-End Encryption", "Multiple Vaults", "Cross-Device Sync", "Password Strength Analysis"],
    tech: ["Java", "JavaFX", "Maven", "Docker"],
    cover: "/images/passmate/1.webp",
    images: [
      "/images/passmate/1.webp",
      "/images/passmate/2.webp",
      "/images/passmate/3.webp",
      "/images/passmate/4.webp",
      "/images/passmate/5.webp",
    ],
    liveUrl: "",
    githubUrl: "https://github.com/senanqulamov/PassMate",
    colors: ["#3b82f6", "#22c55e"],
  },
  {
    slug: "lucky-holidays",
    title: "Lucky Holidays",
    subtitle: "Travel Agency Platform",
    client: "GlobalSoft",
    year: "2025",
    type: "Client",
    status: "Completed",
    summary:
      "LuckyHolidays.az is a travel booking platform with a focus on user experience and payment security. The site features optimized catalog browsing with efficient pagination and caching, secure payment processing, and a responsive React UI for an engaging booking experience.",
    story: [
      "LuckyHolidays.az needed a robust booking system with optimized catalog browsing and secure payment processing. The implementation focused on API performance, responsive UI, and reliable booking workflows.",
      "The platform features optimized travel listing APIs with efficient pagination and caching, integrated payment processing, and comprehensive admin tools for travel inventory management.",
    ],
    problem: "Travel site needed robust booking flows, payments, and fast catalog browsing.",
    solution:
      "Built Laravel APIs with pagination/caching; integrated payments; delivered responsive React UI.",
    impact: "Faster browsing and fewer checkout drop‑offs; maintainable admin tooling.",
    role: "Full‑stack contributor across backend APIs and frontend performance.",
    metrics: [
      {
        label: "Catalog TTI",
        value: "-30%",
      },
      {
        label: "Checkout Errors",
        value: "-40%",
      },
    ],
    note: "We prioritized perceived performance and a clean admin experience.",
    features: ["Travel Booking", "Secure Payments", "Optimized Catalog", "Admin Dashboard"],
    tech: ["Laravel", "PHP", "MySQL", "React", "Node.js"],
    cover: "/images/luckyholidays.az/5.webp",
    images: [
      "/images/luckyholidays.az/5.webp",
      "/images/luckyholidays.az/1.webp",
      "/images/luckyholidays.az/2.webp",
      "/images/luckyholidays.az/3.webp",
      "/images/luckyholidays.az/4.webp",
      "/images/luckyholidays.az/6.webp",
      "/images/luckyholidays.az/7.webp",
      "/images/luckyholidays.az/8.webp",
    ],
    liveUrl: "https://luckyholidays.az",
    githubUrl: "",
    colors: ["#06b6d4", "#2563eb"],
  },
  {
    slug: "ctsa",
    title: "CTSA",
    subtitle: "Construction Industry Platform",
    client: "GlobalSoft",
    year: "2025",
    type: "Client",
    status: "Completed",
    summary:
      "CTSA.az is an enterprise platform built with Laravel and React, featuring role-based access control, third-party API integrations, and automated CI/CD pipelines. The system prioritizes security with comprehensive audit trails and secure authentication flows.",
    story: [
      "CTSA.az required a secure enterprise platform with reliable deployment processes and multiple third-party integrations. The solution included comprehensive RBAC, secure API integrations, and automated GitLab CI/CD pipelines.",
      "Security was prioritized with audit logging, secure authentication flows, and comprehensive testing throughout the deployment pipeline.",
    ],
    problem: "Needed a secure enterprise platform with multiple integrations and CI/CD.",
    solution: "Implemented RBAC, API integrations, and GitLab CI/CD; hardened security and audit trails.",
    impact: "Reliable deployments and improved developer velocity; stronger security posture.",
    role: "Backend developer leading integrations and CI/CD pipelines.",
    metrics: [
      {
        label: "Deploy Time",
        value: "-50%",
      },
      {
        label: "Incidents",
        value: "↓",
      },
    ],
    note: "Setting up pipelines that the team trusts is always worth the effort.",
    features: ["Role-Based Access", "API Integrations", "CI/CD Pipeline", "Security Hardening"],
    tech: ["Laravel", "PHP", "MySQL", "Gitlab CI/CD", "React", "Node.js"],
    cover: "/images/ctsa.az/1.webp",
    images: [
      "/images/ctsa.az/1.webp",
      "/images/ctsa.az/2.webp",
      "/images/ctsa.az/3.webp",
      "/images/ctsa.az/4.webp",
      "/images/ctsa.az/5.webp",
      "/images/ctsa.az/6.webp",
    ],
    liveUrl: "https://ctsa.az",
    githubUrl: "",
    colors: ["#374151", "#111827"],
  },
  {
    slug: "aqovo",
    title: "Aqovo.az",
    subtitle: "Corporate & Industry Platform",
    client: "Aqovo",
    year: "2024 to Present",
    type: "Client",
    status: "Ongoing",
    summary:
      "Aqovo.az is a modern corporate platform built to represent aquaculture expertise, services, and industry knowledge. The system includes service showcases, project portfolios, blog infrastructure, multilingual support, and structured content management optimized for performance and clarity.",
    story: [
      "Aqovo.az was built as a professional digital presence for an aquaculture-focused company, emphasizing clarity, trust, and structured service presentation.",
      "The platform includes modular service pages, project case studies, blog management, and a scalable CMS architecture. Performance optimization, SEO-friendly structure, and clean UI patterns were prioritized to ensure long-term maintainability.",
    ],
    problem:
      "Needed a professional, scalable platform to present aquaculture services, projects, and industry expertise.",
    solution:
      "Designed and developed a modular Laravel-based platform with structured services, project listings, blog system, and multilingual-ready architecture.",
    impact:
      "Improved brand credibility, clear service communication, and a scalable foundation for future digital growth.",
    role: "Full-stack developer responsible for architecture, backend, and frontend integration.",
    metrics: [
      {
        label: "Performance",
        value: "Optimized",
      },
      {
        label: "Content Structure",
        value: "Scalable",
      },
    ],
    note: "A solid example of building a clean, industry-focused corporate platform without unnecessary complexity.",
    features: [
      "Service Management",
      "Project Portfolio",
      "Blog System",
      "Multilingual Support",
      "SEO-Friendly Structure",
    ],
    tech: ["Laravel", "PHP 8+", "Blade", "MySQL", "Bootstrap"],
    cover: "/images/aqovo/aqovo_banner.webp",
    images: [
      "/images/aqovo/aqovo_banner.webp",
      "/images/aqovo/1.webp",
      "/images/aqovo/2.webp",
      "/images/aqovo/3.webp",
      "/images/aqovo/4.webp",
      "/images/aqovo/5.webp",
      "/images/aqovo/6.webp",
      "/images/aqovo/7.webp",
      "/images/aqovo/8.webp",
      "/images/aqovo/9.webp",
    ],
    liveUrl: "https://aqovo.az",
    githubUrl: "",
    colors: ["#0891b2", "#1e40af"],
  },
  {
    slug: "biar",
    title: "BIAR",
    subtitle: "Technology Consulting & Business Software Solutions",
    client: "BIAR",
    year: "2025",
    type: "Client",
    status: "Live",
    summary:
      "BIAR is a corporate technology consulting brand presented through a clean, modern landing page focused on enterprise software, SAP consulting, custom business solutions, and professional training programs. The platform acts purely as a brand and communication layer, showcasing BIAR’s expertise, industry coverage, and global presence without complex application logic.",
    story: [
      "BIAR’s website was built as a focused landing page rather than a full platform, prioritizing clarity, credibility, and corporate presentation.",
      "The structure highlights BIAR’s core service areas including SAP consulting, custom business software, artificial intelligence solutions, and business & technology training programs.",
      "Special attention was given to visual hierarchy, industry segmentation, and clear contact pathways, ensuring the site functions as a strong first touchpoint for enterprise and institutional clients.",
    ],
    problem:
      "BIAR required a professional digital presence to clearly communicate its consulting services, industry focus, and international footprint without overcomplicating the user experience.",
    solution:
      "Designed and implemented a clean, modern landing page emphasizing services, industries served, and contact accessibility, ensuring credibility and clarity for enterprise clients.",
    impact:
      "Improved brand visibility, clearer service positioning, and a stronger corporate image for enterprise and institutional engagement.",
    role: "Designer, Frontend & Backend Developer",
    metrics: [
      {
        label: "Page Type",
        value: "Landing Page",
      },
      {
        label: "Primary Goal",
        value: "Brand & Lead Generation",
      },
    ],
    note: "BIAR demonstrates restraint and clarity — a deliberate choice to keep the platform simple, focused, and corporate rather than over-engineered.",
    features: [
      "Corporate Landing Page Architecture",
      "Service & Solution Showcase",
      "Industry Segmentation",
      "Multi-Office Contact Presentation",
      "Responsive Design",
      "Clear Call-to-Action Flow",
    ],
    tech: ["Laravel", "PHP", "Blade Templates", "HTML5", "CSS3", "JavaScript"],
    cover: "/images/biar/4.webp",
    images: ["/images/biar/4.webp", "/images/biar/1.webp", "/images/biar/2.webp", "/images/biar/3.webp"],
    liveUrl: "https://biar.maffin.az/",
    githubUrl: "",
    colors: ["#0f172a", "#1e3a8a"],
  },
  {
    slug: "jobhub",
    title: "JobHub.az",
    subtitle: "Job & Career Platform",
    client: "JobHub",
    year: "2024 to 2025",
    type: "Client",
    status: "Completed",
    summary:
      "JobHub.az is a job and career platform designed to connect employers with candidates efficiently. The platform is built using Laravel and MySQL, focusing on performance, scalability, and clean business logic. It supports advanced job listings, employer dashboards, candidate profiles, and optimized search and filtering.",
    story: [
      "JobHub.az was built to simplify the hiring process in Azerbaijan by providing a fast, intuitive, and scalable job marketplace.",
      "The backend focuses on clean architecture, optimized database queries, and flexible APIs to support job listings, applications, employer management, and user profiles. Performance and maintainability were prioritized to allow future scaling.",
    ],
    problem: "Needed a fast, reliable job platform with clean backend logic and scalable architecture.",
    solution:
      "Designed modular Laravel services, optimized queries, built flexible REST APIs, and structured the system for future growth.",
    impact:
      "Improved hiring workflow efficiency and provided a stable foundation for scaling job and user traffic.",
    role: "Backend developer responsible for architecture and core APIs.",
    metrics: [
      {
        label: "Platform Stability",
        value: "High",
      },
      {
        label: "Search Performance",
        value: "Optimized",
      },
    ],
    note: "A solid example of building practical, scalable backend systems for real-world hiring needs.",
    features: [
      "Job Listings & Applications",
      "Employer Dashboards",
      "Candidate Profiles",
      "Advanced Search & Filters",
      "RESTful APIs",
    ],
    tech: ["Laravel", "PHP 8+", "MySQL", "REST API", "Docker"],
    cover: "/images/jobhub.az/jobhub_banner.webp",
    images: [
      "/images/jobhub.az/jobhub_banner.webp",
      "/images/jobhub.az/1.webp",
      "/images/jobhub.az/2.webp",
      "/images/jobhub.az/3.webp",
      "/images/jobhub.az/4.webp",
      "/images/jobhub.az/5.webp",
      "/images/jobhub.az/6.webp",
      "/images/jobhub.az/7.webp",
      "/images/jobhub.az/8.webp",
      "/images/jobhub.az/9.webp",
      "/images/jobhub.az/10.webp",
      "/images/jobhub.az/11.webp",
    ],
    liveUrl: "https://jobhub.az",
    githubUrl: "",
    colors: ["#4338ca", "#312e81"],
  },
  {
    slug: "aga-group",
    title: "AGA Group",
    subtitle: "Corporate Website",
    client: "FerrumCapital",
    year: "2021 to 2022",
    type: "Client",
    status: "Completed",
    summary:
      "Agagroup.az is a corporate website built with WordPress and custom PHP components. The site features a secure content management system, optimized MySQL queries for performance, and a focus on content editor experience with reusable blocks and templates.",
    story: [
      "Agagroup.az required a professional corporate presence with easy content management for non-technical staff. The solution included a secure WordPress implementation with custom theme development and performance optimizations.",
      "The site features custom post types, editor-friendly block templates, and comprehensive security hardening against common WordPress vulnerabilities.",
    ],
    problem: "Agagroup needed a performant corporate website with a secure CMS for non-technical editors.",
    solution:
      "Delivered a custom WordPress build with hardened security, reusable blocks, and optimized MySQL queries.",
    impact: "Reduced content publishing time by 60%. Improved Lighthouse performance into the green range.",
    role: "Full‑stack developer responsible for architecture, theme development, and deployment.",
    metrics: [
      {
        label: "TTFB",
        value: "< 200ms",
      },
      {
        label: "Core Web Vitals",
        value: "Green",
      },
      {
        label: "Editor Effort",
        value: "-60%",
      },
    ],
    note: "I focused on editor experience and security hardening while keeping the site blazing fast.",
    features: ["Corporate Website", "Content Management", "Security Hardening", "Performance Optimization"],
    tech: ["PHP", "WordPress", "MySQL", "Bootstrap"],
    cover: "/images/agagroup.az/5.webp",
    images: [
      "/images/agagroup.az/5.webp",
      "/images/agagroup.az/1.webp",
      "/images/agagroup.az/2.webp",
      "/images/agagroup.az/3.webp",
      "/images/agagroup.az/4.webp",
      "/images/agagroup.az/6.webp",
    ],
    liveUrl: "https://agagroup.az",
    githubUrl: "",
    colors: ["#60a5fa", "#14b8a6"],
  },
  {
    slug: "shiplounge",
    title: "Shiplounge.co",
    subtitle: "Logistics Platform",
    client: "Deirvlon Technologies",
    year: "2022",
    type: "Client",
    status: "Completed",
    summary:
      "Shiplounge.co is a comprehensive logistics management platform built for small and medium enterprises. It provides tools for shipment tracking, tariff management, invoicing, and operational workflows with a focus on performance and reliability.",
    story: [
      "Shiplounge.co required a robust logistics management system that could handle complex shipping operations while maintaining performance under load. The solution focused on optimized database queries, responsive UI, and reliable background processing.",
      "Key features include shipment tracking, tariff management, automated invoicing, and role-based access control for operational teams.",
    ],
    problem:
      "Operators needed a reliable tool to manage shipments, tariffs, and invoicing without performance bottlenecks.",
    solution:
      "Designed a Laravel architecture with queues, caching, and indexed queries; built ops‑friendly UIs.",
    impact: "Reduced ops errors and improved processing speed; clear visibility via dashboards.",
    role: "Backend lead and UI architect for operations workflows.",
    metrics: [
      {
        label: "N+1 Queries",
        value: "Eliminated",
      },
      {
        label: "Bulk Ops Speed",
        value: "+~2x",
      },
    ],
    note: "The most rewarding part was seeing operators handle complex workflows with fewer clicks.",
    features: ["Shipment Tracking", "Tariff Management", "Automated Invoicing", "Role-Based Access Control"],
    tech: ["Laravel", "MySQL", "Bootstrap"],
    cover: "/images/shiplounge.co/7.webp",
    images: [
      "/images/shiplounge.co/7.webp",
      "/images/shiplounge.co/1.webp",
      "/images/shiplounge.co/2.webp",
      "/images/shiplounge.co/3.webp",
      "/images/shiplounge.co/4.webp",
      "/images/shiplounge.co/5.webp",
      "/images/shiplounge.co/6.webp",
      "/images/shiplounge.co/8.webp",
      "/images/shiplounge.co/9.webp",
    ],
    liveUrl: "https://shiplounge.co",
    githubUrl: "",
    colors: ["#3b82f6", "#4f46e5"],
  },
  {
    slug: "otomall",
    title: "Otomall.az",
    subtitle: "E-commerce Platform",
    client: "FerrumCapital",
    year: "2021 to 2022",
    type: "Client",
    status: "Completed",
    summary:
      "Otomall.az is a comprehensive e-commerce platform built with Laravel and React. The system includes secure payment processing, inventory management, customer accounts, and an optimized product catalog with advanced filtering options.",
    story: [
      "Otomall.az required a scalable e-commerce solution with robust security and payment processing. The platform was built with Laravel and React to ensure performance at scale and provide a responsive user experience.",
      "Key features include secure payment processing, inventory synchronization, and a comprehensive admin dashboard for order management.",
    ],
    problem:
      "The client needed a scalable e-commerce platform with secure payment processing and inventory management.",
    solution:
      "Developed a Laravel + React application with optimized database queries, secure payment integration, and comprehensive admin tools.",
    impact:
      "Delivered a stable platform capable of handling peak traffic periods with consistent performance and security.",
    role: "Lead backend developer responsible for system architecture, payment integrations, and security implementation.",
    metrics: [
      {
        label: "Response Time",
        value: "< 300ms",
      },
      {
        label: "Payment Success Rate",
        value: "99.7%",
      },
      {
        label: "Security Incidents",
        value: "0",
      },
    ],
    note: "Ensuring the payment system was both user-friendly and secure required careful consideration of UX and security tradeoffs.",
    features: ["Corporate Website", "Payments", "Security Features", "Responsive UI"],
    tech: ["Laravel", "React", "MySQL", "Bootstrap"],
    cover: "/images/otomall.az/8.webp",
    images: [
      "/images/otomall.az/8.webp",
      "/images/otomall.az/1.webp",
      "/images/otomall.az/2.webp",
      "/images/otomall.az/3.webp",
      "/images/otomall.az/4.webp",
      "/images/otomall.az/5.webp",
      "/images/otomall.az/6.webp",
      "/images/otomall.az/7.webp",
    ],
    liveUrl: "",
    githubUrl: "",
    colors: ["#f87171", "#fb923c"],
  },
  {
    slug: "balli",
    title: "Balli",
    subtitle: "Honey E-Commerce Platform",
    client: "FerrumCapital",
    year: "2021 to 2022",
    type: "Client",
    status: "Completed",
    summary:
      "Balli.az is an e-commerce platform focused on optimized checkout flows and product performance. The site integrates Stripe payments, features streamlined order processing, and delivers fast product page loading times to minimize bounce rates and improve conversions.",
    story: [
      "Balli.az required a reliable e-commerce solution with optimized product pages and streamlined checkout. The implementation focused on reducing friction points in the customer journey and ensuring secure payment processing.",
      "Performance optimizations targeted product queries and checkout steps to maximize conversions and minimize abandoned carts.",
    ],
    problem: "Checkout friction and slow product pages were hurting conversions.",
    solution: "Optimized product queries, implemented Stripe payments, and streamlined the checkout UX.",
    impact: "Checkout completion rate increased by ~18%. Product page LCP improved by ~35%.",
    role: "Backend and integration lead; collaborated on frontend performance fixes.",
    metrics: [
      {
        label: "Checkout Conversion",
        value: "+18%",
      },
      {
        label: "LCP",
        value: "-35%",
      },
    ],
    note: "Balancing reliability and speed across checkout flows was an exciting challenge.",
    features: ["E-commerce Store", "Stripe Payments", "Optimized Checkout", "Product Catalog"],
    tech: ["PHP", "WordPress", "MySQL", "REST APIs", "Stripe"],
    cover: "/images/balli.az/demo1.webp",
    images: [
      "/images/balli.az/demo1.webp",
      "/images/balli.az/demo2.webp",
      "/images/balli.az/demo3.webp",
      "/images/balli.az/demo4.webp",
      "/images/balli.az/demo5.webp",
    ],
    liveUrl: "https://balli.az",
    githubUrl: "",
    colors: ["#fbbf24", "#f97316"],
  },
  {
    slug: "aureliomilan",
    title: "Aurelio Milan",
    subtitle: "Editorial Model Portfolio",
    client: "Aurelio Milan",
    year: "2026",
    type: "Personal",
    status: "Live",
    summary:
      "AurelioMilan.com is an editorial portfolio and booking platform for model, athlete and entrepreneur Aurelio Milan, presenting fashion work, press appearances, gallery stories and direct booking enquiries.",
    story: [
      "AurelioMilan.com was designed as a cinematic digital portfolio rather than a conventional résumé site. The experience brings together red-carpet appearances, studio editorials, street series, press coverage and a personal story across a visual, image-led interface.",
      "The site includes dedicated fashion-work, press, blog, gallery, about and contact experiences, with responsive art direction, a theme switcher, smooth transitions, WebGL image treatment, structured SEO metadata and a booking flow that works across desktop and mobile.",
    ],
    problem:
      "Aurelio needed a premium web presence that could present a growing international modelling career while keeping the work, story and booking path easy to navigate.",
    solution:
      "Built a responsive Next.js portfolio with editorial layouts, immersive motion, optimized photography, structured content, gallery mapping and direct booking contact.",
    impact:
      "Created a polished international showcase for campaigns, editorials, runway opportunities and brand partnerships, with a clear path from discovery to enquiry.",
    role: "Product designer and full-stack developer responsible for the visual direction, Next.js application, content system, motion, image pipeline, SEO and deployment setup.",
    metrics: [
      {
        label: "Dedicated Sections",
        value: "6",
      },
      {
        label: "Image Pipeline",
        value: "Responsive WebP",
      },
      {
        label: "Availability",
        value: "Worldwide",
      },
    ],
    note: "Aurelio Milan combines fashion storytelling with a genuinely useful booking experience. The challenge was making a large visual archive feel calm, fast and intentional on every screen.",
    features: [
      "Editorial Portfolio",
      "Fashion Work Archive",
      "Press & Events",
      "Interactive Gallery",
      "Booking Enquiries",
      "SEO & Structured Data",
    ],
    tech: ["Next.js", "React", "JavaScript", "GSAP", "Lenis", "Three.js", "Vercel"],
    cover: "/images/aureliomilan.com/2.png",
    images: [
      "/images/aureliomilan.com/1.png",
      "/images/aureliomilan.com/2.png",
      "/images/aureliomilan.com/3.png",
      "/images/aureliomilan.com/4.png",
      "/images/aureliomilan.com/5.png",
      "/images/aureliomilan.com/6.png",
      "/images/aureliomilan.com/7.png",
      "/images/aureliomilan.com/8.png",
      "/images/aureliomilan.com/9.png",
      "/images/aureliomilan.com/10.png",
    ],
    liveUrl: "https://aureliomilan.com",
    githubUrl: "https://github.com/senanqulamov/aureliomilan",
    colors: ["#b89a6a", "#171310"],
    yearRange: "2026",
    shortDescription: "Editorial model portfolio and booking platform for Aurelio Milan.",
    longDescription:
      "AurelioMilan.com is an editorial portfolio and booking platform for model, athlete and entrepreneur Aurelio Milan, presenting fashion work, press appearances, gallery stories and direct booking enquiries.",
    description: "Editorial portfolio, fashion archive, press, gallery and booking experience.",
    techTags: ["Next.js", "React", "GSAP", "Lenis", "Three.js", "Vercel"],
    technologies: ["Next.js 16", "React 19", "GSAP", "Lenis", "Three.js", "WebP", "Vercel"],
    personalNote:
      "The site was shaped to feel closer to an editorial publication than a traditional portfolio, while keeping booking and navigation practical.",
    category: "Personal",
    featured: true,
    featuredOrder: 1,
    date: "2026",
  },
  {
    slug: "sisufreesoul",
    title: "SISU Free Soul",
    subtitle: "Editorial Storytelling & Conversation Platform",
    client: "Təhminə Doruk",
    year: "2026",
    type: "Personal",
    status: "Active Development",
    summary:
      "SISU Free Soul is an editorial platform for Təhminə Doruk about freedom, self-authorship, honest conversations and the courage to choose your own life.",
    story: [
      "SISU Free Soul was created as a cinematic digital home for ideas that need more room than a conventional personal website can provide. The platform combines Təhminə Doruk's story and manifesto with essays, podcast conversations, short films and real-life stories.",
      "The experience uses large-format media, editorial typography, scroll-led motion and a calm visual system to make reflection feel intentional rather than transactional. It also includes an authenticated content workspace at /admin, where drafts can be previewed and published to GitHub through a single commit and the normal Vercel deployment flow.",
    ],
    problem:
      "Təhminə needed a distinctive platform for publishing personal ideas, conversations and visual stories without reducing them to a static profile or social feed.",
    solution:
      "Designed and built a Next.js editorial platform with cinematic media, structured content sections, podcast and video archives, journal pages, story collections, responsive motion and a Git-backed CMS.",
    impact:
      "Created a durable home for SISU's voice and content, giving the project a strong public identity while making publishing and future editorial growth manageable.",
    role: "Product designer and full-stack developer responsible for the visual language, Next.js application, motion system, content architecture, admin workspace and deployment workflow.",
    metrics: [
      {
        label: "Editorial Sections",
        value: "6",
      },
      {
        label: "Content Formats",
        value: "4",
      },
      {
        label: "Publishing",
        value: "Git-backed CMS",
      },
    ],
    note: "SISU is deliberately slower and more spacious than a typical content platform. The most important design decision was to make the interface feel like an editorial room for thought while keeping the publishing system practical.",
    features: [
      "Cinematic Homepage",
      "Podcast Archive",
      "Journal & Essays",
      "Video Stories",
      "Git-Backed CMS",
      "Responsive Editorial Motion",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion", "GSAP", "Lenis", "Vercel"],
    cover: "/images/sisufreesoul.com/6.png",
    images: [
      "/images/sisufreesoul.com/1.png",
      "/images/sisufreesoul.com/2.png",
      "/images/sisufreesoul.com/3.png",
      "/images/sisufreesoul.com/4.png",
      "/images/sisufreesoul.com/5.png",
      "/images/sisufreesoul.com/6.png",
      "/images/sisufreesoul.com/7.png",
    ],
    liveUrl: "https://sisufreesoul.com",
    githubUrl: "https://github.com/senanqulamov/sisu-free-soul",
    colors: ["#c88842", "#171512"],
    yearRange: "2026",
    shortDescription: "Editorial storytelling and conversation platform for SISU Free Soul.",
    longDescription:
      "SISU Free Soul is an editorial platform for Təhminə Doruk about freedom, self-authorship, honest conversations and the courage to choose your own life.",
    description: "Editorial storytelling, podcasts, journal, video essays, stories and CMS publishing.",
    techTags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion", "Vercel"],
    technologies: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Motion", "GSAP", "Lenis"],
    personalNote:
      "The platform balances a highly authored visual experience with a content system that can continue growing without losing its editorial rhythm.",
    category: "Personal",
    featured: true,
    featuredOrder: 2,
    date: "2026",
  },
  {
    slug: "1bilet",
    title: "1bilet.az",
    subtitle: "Online Exam & Assessment Platform",
    client: "1bilet.az",
    year: "2026",
    type: "Startup",
    status: "Active Development",
    summary:
      "1bilet.az is an online exam and assessment platform for creating tests, managing question banks, running timed attempts, grading results and issuing certificates.",
    story: [
      "1bilet.az is the public product identity for Talentry-v2, a Laravel-based assessment platform built around clear exam workflows and modular domain logic. The system supports administrators, examiners and students across the full lifecycle of an assessment.",
      "The platform includes exam creation and publishing guards, reusable exam templates, categorized question banks, invite-link access, autosaved attempts, objective grading, result visibility controls, chance packages, certificate issuance and analytics. Azerbaijani, English and Russian localization are included in the application foundation.",
    ],
    problem:
      "Schools, training teams and exam organizers need more control than a basic quiz form provides, including reusable content, secure attempts, grading, certificates and operational reporting.",
    solution:
      "Built a modular Laravel and Livewire platform with action-driven exam workflows, snapshot-based question attachment, role-aware access, autosave and submission logic, reusable templates, package-based attempt controls and certificate management.",
    impact:
      "Provides a structured foundation for digital assessments, from authoring and delivery through grading, reporting and learner achievements.",
    role: "Full-stack developer responsible for the Laravel domain architecture, Livewire interfaces, exam workflows, access control, localization, admin console and assessment operations.",
    metrics: [
      {
        label: "Assessment Roles",
        value: "3",
      },
      {
        label: "Question Formats",
        value: "Multiple",
      },
      {
        label: "Locales",
        value: "3",
      },
    ],
    note: "The core challenge was making assessment rules explicit and dependable: publishing, snapshots, attempts, grading, result visibility and certificates all need to remain consistent under real exam workflows.",
    features: [
      "Exam Authoring",
      "Question Bank",
      "Exam Templates",
      "Timed Attempts & Autosave",
      "Auto-Grading",
      "Certificates",
      "Chance Packages",
      "Admin Analytics",
    ],
    tech: ["Laravel 13", "PHP 8.3", "Livewire 4", "Tailwind CSS", "TallCraftUI", "PowerGrid", "MySQL"],
    cover: "/images/1bilet.az/1.png",
    images: [
      "/images/1bilet.az/1.png",
      "/images/1bilet.az/2.png",
      "/images/1bilet.az/3.png",
      "/images/1bilet.az/4.png",
      "/images/1bilet.az/5.png",
      "/images/1bilet.az/6.png",
      "/images/1bilet.az/7.png",
      "/images/1bilet.az/8.png",
      "/images/1bilet.az/9.png",
      "/images/1bilet.az/10.png",
      "/images/1bilet.az/11.png",
      "/images/1bilet.az/12.png",
      "/images/1bilet.az/13.png",
      "/images/1bilet.az/14.png",
      "/images/1bilet.az/15.png",
      "/images/1bilet.az/16.png",
      "/images/1bilet.az/17.png",
      "/images/1bilet.az/18.png",
      "/images/1bilet.az/19.png",
      "/images/1bilet.az/20.png",
      "/images/1bilet.az/21.png",
    ],
    liveUrl: "https://1bilet.az",
    githubUrl: "https://github.com/senanqulamov/Talentry-v2",
    colors: ["#2563eb", "#172554"],
    yearRange: "2026",
    shortDescription: "Online exam and assessment platform for 1bilet.az.",
    longDescription:
      "1bilet.az is an online exam and assessment platform for creating tests, managing question banks, running timed attempts, grading results and issuing certificates.",
    description: "Exam authoring, assessment delivery, grading, packages, certificates and analytics.",
    techTags: ["Laravel", "PHP", "Livewire", "Tailwind CSS", "PowerGrid", "MySQL"],
    technologies: [
      "Laravel 13",
      "PHP 8.3",
      "Livewire 4",
      "TallCraftUI",
      "Livewire PowerGrid",
      "Tailwind CSS",
    ],
    personalNote:
      "1bilet.az is built around explicit assessment rules and reusable domain workflows rather than a single-purpose quiz screen.",
    category: "Startups",
    featured: true,
    featuredOrder: 3,
    date: "2026",
  },
];
