export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  longBio: string;
  avatarUrl: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  websiteUrl: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  demoUrl?: string; // Optional links
  githubUrl?: string;
  imageUrl: string;
  featured: boolean;
  order: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  details?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Design' | 'Others' | 'Languages' | 'Frameworks' | 'Tools';
  level: number; // 0 to 100
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface PortfolioSettings {
  accentColor: string; // Tailwind hex color or color name
  themeMode: 'dark' | 'light';
  layoutStyle: 'bento' | 'minimal' | 'editorial' | 'cards';
  accentColorName: string;
}

export interface PortfolioData {
  profile: UserProfile;
  projects: Project[];
  education: Education[];
  skills: Skill[];
  settings: PortfolioSettings;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

