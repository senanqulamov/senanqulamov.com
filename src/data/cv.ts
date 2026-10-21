export type CvEntry = {
  when: string;
  current: boolean;
  title: string;
  org: string;
  location: string;
  text: string;
  highlights: string[];
};

export const cv = {
  profile:
    "I build scalable software and I have spent seven years helping people through hard moments. That mix shapes everything I do: I design systems for the people who will use them, and I lead teams the way I would want to be led.",
  stats: [
    {
      value: "7+",
      label: "Years writing code",
    },
    {
      value: "7+",
      label: "Years as a therapist",
    },
    {
      value: "100+",
      label: "Lives and projects",
    },
    {
      value: "10+",
      label: "Technical languages",
    },
    {
      value: "200+",
      label: "Books read",
    },
  ],
  ventures: [
    {
      when: "2024 to now",
      current: true,
      title: "Founder & CEO",
      org: "BidBary",
      location: "Baku, Azerbaijan",
      text: "One platform for every way people gather: auctions, concerts, private dinners, tours and workshops, each with its own rules for pricing and access.",
      highlights: [
        "Product vision, architecture and fundraising",
        "Building the platform and the founding team",
      ],
    },
    {
      when: "2020 to now",
      current: false,
      title: "Founder & CEO",
      org: "NeoSphere",
      location: "Remote",
      text: "A workers' union hub and gig marketplace connecting freelancers, job seekers and organizations. Product vision, architecture and development with Laravel and React, with backend APIs in Java (Javalin).",
      highlights: [
        "Designed the platform around Spheres, Core Hubs and Karma Points",
        "Built the MVP with jobs, events and user profiles",
        "Defined revenue streams: subscriptions, sponsored Spheres and transaction fees",
      ],
    },
  ],
  experience: [
    {
      when: "2025 to now",
      current: true,
      title: "Tech Lead",
      org: "PMIS (BP)",
      location: "Baku, Azerbaijan",
      text: "Leading engineering on project controls systems used on BP projects.",
      highlights: [],
    },
    {
      when: "May 2025 to now",
      current: false,
      title: "Strong Middle Backend Developer",
      org: "Inci Group of Companies LLC",
      location: "Baku, Azerbaijan",
      text: "Scalable backend systems for enterprise projects with Laravel and modern PHP, plus Java and Javalin APIs for microservices and integrations. Onsite in the Baku Economic Zone with cross-functional teams.",
      highlights: [
        "Backend services with Laravel 10/12, PHP 8+, MySQL and PostgreSQL",
        "Third-party and enterprise integrations: REST, OAuth, webhooks",
        "Microservices with Java (Javalin) for an API-first architecture",
        "Query and application performance tuning for high scalability",
        "CI/CD improvements with GitHub Actions and Docker",
      ],
    },
    {
      when: "Mar 2025 to May 2025",
      current: false,
      title: "Middle Backend Developer",
      org: "GlobalSoft",
      location: "Baku, Azerbaijan",
      text: "Laravel and PHP applications and enterprise web solutions: API development, integrations and performance work.",
      highlights: [
        "Delivered scalable Laravel and PHP applications",
        "Built and integrated RESTful APIs for business workflows",
        "Worked closely with frontend teams on feature delivery",
      ],
    },
    {
      when: "Jan 2024 to Jan 2025",
      current: false,
      title: "Military service",
      org: "Army duty",
      location: "Azerbaijan",
      text: "Mandatory military service. Discipline, resilience, teamwork and leadership that now shape how I run engineering teams.",
      highlights: [
        "Fulfilled mandatory service requirements",
        "Developed strong teamwork and leadership skills",
      ],
    },
    {
      when: "Aug 2023 to Jan 2024",
      current: false,
      title: "Freelance Full-stack Developer",
      org: "Self-employed",
      location: "Remote",
      text: "Six months delivering web apps and APIs end to end, from interface to data model and deployment.",
      highlights: [
        "Delivered client projects with Laravel and Next.js",
        "Integrated third-party APIs and optimized performance",
      ],
    },
    {
      when: "Nov 2022 to Jul 2023",
      current: false,
      title: "Technical Lead & Full-stack Developer",
      org: "ALLRENT",
      location: "Baku, Azerbaijan",
      text: "Led the full development of Allrent.io from scratch: an online rental marketplace with optimized booking workflows.",
      highlights: [
        "Integrated online payments, reviews and interactive maps",
        "Built a custom reservation calendar",
        "Moved from freelancer to permanent technical lead",
      ],
    },
    {
      when: "May 2022 to Oct 2022",
      current: false,
      title: "Team Leader & Full-stack Developer",
      org: "DEIRVLON Technologies",
      location: "Baku, Azerbaijan",
      text: "Led Laravel and JavaScript teams delivering logistics and enterprise solutions.",
      highlights: [
        "Architected and built a cargo management platform",
        "Directed cross-functional teams to deliver on time",
        "Contributed to Monyo.az",
      ],
    },
    {
      when: "Mar 2021 to May 2022",
      current: false,
      title: "Full-stack Developer & Cybersecurity Admin",
      org: "FERRUM CAPITAL",
      location: "Baku, Azerbaijan",
      text: "Laravel and React systems, secure architecture patterns and the first internal Java APIs, while running cybersecurity administration.",
      highlights: [
        "Delivered Otomall.az, Agagroup.az and Balli.az",
        "Authentication and authorization with Laravel Sanctum and Passport",
        "Internal Java (Javalin) APIs extending backend functionality",
        "Security best practices and threat monitoring",
      ],
    },
    {
      when: "Jul 2019 to Oct 2019",
      current: false,
      title: "Full-stack Web Developer Intern",
      org: "ATL Tech",
      location: "Baku, Azerbaijan",
      text: "PHP and Laravel internship focused on backend development and prototypes for partner companies.",
      highlights: [
        "Features for the Student Library project",
        "An online course platform as the final project",
      ],
    },
  ],
  practice: [
    {
      when: "7+ years, in parallel",
      current: false,
      title: "Therapist",
      org: "Private practice",
      location: "Baku, Azerbaijan",
      text: "Seven years of counseling alongside engineering. Listening before solving, naming what a room is not saying, and helping people through pressure, burnout and change.",
      highlights: [
        "Therapeutic counseling: empathy and support",
        "Now applied to teams, customers and investors",
      ],
    },
  ],
  education: [
    {
      when: "2021 to 2023",
      current: false,
      title: "Master of Computer Science",
      org: "Baku State University, SABAH Groups",
      location: "Baku, Azerbaijan",
      text: "Cyber Security and Data Science, GPA 88.7. Research on secure system design and scalable web platforms.",
      highlights: ["SABAH Groups certification, 2023", "Graduated with honors"],
    },
    {
      when: "2017 to 2021",
      current: false,
      title: "Bachelor of Computer Science",
      org: "Khazar University",
      location: "Baku, Azerbaijan",
      text: "Cyber Security, Web Development, Database Administration, Data Science and Robotics. GPA 89.",
      highlights: ["Diploma with honors", "2nd place, World Robot Olympiad Azerbaijan 2018"],
    },
  ],
  skills: [
    {
      group: "Backend",
      items: [
        "Java",
        "Javalin",
        "PHP",
        "Laravel",
        "OpenCart",
        "REST APIs",
        "Microservices",
        "OOP",
        "Algorithms",
      ],
    },
    {
      group: "Frontend",
      items: [
        "JavaScript",
        "Next.js",
        "React",
        "Livewire",
        "jQuery",
        "Ajax",
        "HTML",
        "CSS",
        "Sass",
        "Tailwind",
        "Bootstrap",
      ],
    },
    {
      group: "Data",
      items: ["MySQL", "PostgreSQL", "Oracle SQL", "JSON"],
    },
    {
      group: "Motion and 3D",
      items: ["GSAP", "WebGL", "Three.js"],
    },
    {
      group: "DevOps and security",
      items: ["Docker", "Git", "GitLab", "GitHub Actions", "Kali Linux", "Security hardening"],
    },
    {
      group: "Systems and hardware",
      items: ["C", "C++", "Arduino"],
    },
    {
      group: "People",
      items: ["Therapeutic counseling", "Team leadership", "Public speaking", "Writing"],
    },
  ],
} as {
  profile: string;
  stats: { value: string; label: string }[];
  ventures: CvEntry[];
  experience: CvEntry[];
  practice: CvEntry[];
  education: CvEntry[];
  skills: { group: string; items: string[] }[];
};
