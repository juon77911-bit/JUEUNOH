export interface ContentBlock {
  id: string;
  type: 'text' | 'image';
  content: string; // Text content or Image URL
  title?: string; // Optional title for text blocks
  sectionId?: string; // To link with visibility toggles (e.g., 'problem', 'approach', etc.)
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  about?: string;
  client?: string;
  services?: string;
  liveUrl?: string;
  date: string;
  contentBlocks: ContentBlock[];
  visibleSections: {
    [key: string]: boolean;
  };
  metrics?: string;
  tools?: string[];
  imageFilter?: 'none' | 'grayscale' | 'dark';
  images: string[]; // Keep this for gallery/thumbnails if needed, or move all to blocks
}

export interface ArchiveItem {
  id: string;
  year: string;
  category?: string;
  title: string;
  details: string[];
}

export interface SiteConfig {
  name: string;
  slogan: string;
  identity: string;
  about: string;
  education: string[];
  experience: string[];
  careerHighlights: string[];
  accentColor: string;
  secondaryColor: string;
  fontFamily: string;
  role: string;
  linkedin: string;
  email: string;
  resumeUrl: string;
  skills: string[];
  fontSizes: {
    slogan: number;
    body: number;
    heading: number;
  };
  projectLabels: {
    problem: string;
    approach: string;
    insights: string;
    impact: string;
    contribution: string;
  };
  sectionDescriptions: {
    about: string;
    projects: string;
    archive: string;
  };
  adminPassword: string;
}

export interface PortfolioData {
  config: SiteConfig;
  projects: Project[];
  archive: ArchiveItem[];
}
