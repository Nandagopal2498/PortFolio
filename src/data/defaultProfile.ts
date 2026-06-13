import { PortfolioData } from '../types';

export const defaultProfileData: PortfolioData = {
  profile: {
    name: "Dudaka Nanda Gopal",
    title: "Computer Science Student | Data Science & Machine Learning Enthusiast",
    bio: "I enjoy building modern web applications and leveraging data-driven approaches to solve real-world problems. With a strong interest in Machine Learning, Full-Stack Development, and Software Engineering, I focus on creating efficient, scalable, and user-centric solutions.",
    longBio: "I believe great software is built on strong fundamentals, continuous learning, and attention to detail. Every project is an opportunity to improve problem-solving skills, write cleaner code, and create meaningful solutions. My goal is not just to build applications, but to understand how systems work, scale, and evolve.\n\nTechnology moves fast, but fundamentals last. I focus on mastering core concepts, building practical projects, and staying curious enough to keep learning. Every line of code is a chance to become a better engineer than yesterday.",
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    email: "nandagopaldudaka@gmail.com",
    phone: "+91 9390349899",
    location: "Hyderabad, India",
    githubUrl: "https://github.com/Nandagopal2498",
    linkedinUrl: "https://www.linkedin.com/in/nanda-gopal-dudaka-631b57322/",
    twitterUrl: "https://twitter.com",
    websiteUrl: "https://nandagopal.dev"
  },
  projects: [
    {
      id: "proj-1",
      title: "Nova Analytics Suite",
      description: "A real-time data visualization dashboard with customizable widget arrangements, sub-second aggregation queries, and offline synchronization capabilities.",
      longDescription: "Nova was built to solve the frustration of sluggish enterprise analytics dashboards. By implementing a virtualized grid engine and a highly optimized client-side sync queue, we achieved under 50ms render latency for datasets exceeding 100k records.\n\nThe system utilizes indexedDB for real-time local caching and streams telemetry updates using standard WebSockets. Developed an elegant, tailwind-powered theme engine allowing deep personalization.",
      tags: ["React", "TypeScript", "Tailwind CSS", "D3.js", "IndexedDB"],
      demoUrl: "https://example.com/demo/nova",
      githubUrl: "https://github.com",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      featured: true,
      order: 1
    },
    {
      id: "proj-2",
      title: "Synapse: AI Code Companion",
      description: "An interactive, browser-based playground that helps developers Refactor complex syntax, write automated unit tests, and visualize AST representations in real-time.",
      longDescription: "Synapse is a web-based code workspace. It lets developers paste intricate code blocks and instantly runs localized parser nodes (using WebAssembly-compiled Tree-sitter binaries) to build visually rich Abstract Syntax Tree (AST) tree-maps. It also features a customizable LLM prompt playground that interfaces with leading API engines securely through lazy environment configurations.",
      tags: ["React", "WebAssembly", "TypeScript", "Tailwind", "Monaco Editor"],
      demoUrl: "https://example.com/demo/synapse",
      githubUrl: "https://github.com",
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
      featured: true,
      order: 2
    },
    {
      id: "proj-3",
      title: "Zenith Commerce",
      description: "Next-generation headless e-commerce interface focusing on speed, accessible keyboard orchestration, fluid paginated lists, and rich product presentation grids.",
      longDescription: "Zenith reinvents standard catalog navigation. Built as a fully decoupled Headless UI application, it features fluid animations for cart actions, instantaneous full-text index searches over 10,000 SKUs using client-side Web-Workers, and a compliant WCAG 2.1 AA keyboard layout that can navigate from search to final purchase without a cursor.",
      tags: ["React", "Motion", "Tailwind CSS", "Fuse.js", "WCAG 2.1"],
      demoUrl: "https://example.com/demo/zenith",
      githubUrl: "https://github.com",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      featured: false,
      order: 3
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Technology in Computer Science",
      institution: "NXTWAVE INSTITUTE OF ADVANCED TECHNOLOGY",
      location: "Hyderabad, India",
      startDate: "2024",
      endDate: "2028 (Expected)",
      gpa: "Current Student",
      details: "• Prompt Engineering\n• AI Application Development\n• Team Collaboration\n• Code Optimization\n• Data Structures & Algorithms\n• Object-Oriented Programming (OOP)\n• Problem Solving\n• Full-Stack Development\n• Responsive Web Design"
    }
  ],
  skills: [
    { id: "sk-1", name: "HTML", category: "Frontend", level: 90 },
    { id: "sk-2", name: "CSS", category: "Frontend", level: 85 },
    { id: "sk-3", name: "Python", category: "Backend", level: 85 },
    { id: "sk-4", name: "JavaScript", category: "Frontend", level: 80 },
    { id: "sk-5", name: "React.js", category: "Frontend", level: 75 },
    { id: "sk-6", name: "C++", category: "Backend", level: 75 },
    { id: "sk-7", name: "C", category: "Backend", level: 75 },
    { id: "sk-8", name: "SQL", category: "Backend", level: 70 },
  ],
  settings: {
    accentColor: "#3b82f6", // default blue
    accentColorName: "indigo",
    themeMode: "dark",
    layoutStyle: "bento"
  }
};
