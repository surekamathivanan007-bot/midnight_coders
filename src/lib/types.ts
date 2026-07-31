export type Theme = 'dark' | 'light';

export type TemplateId = 'aurora' | 'minimal' | 'bold';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  slug: string;
  template: TemplateId;
  theme: Theme;
  accent_color: string;
  is_published: boolean;
  title: string | null;
  tagline: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  portfolio_id: string;
  institution: string;
  degree: string | null;
  field: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Experience {
  id: string;
  portfolio_id: string;
  company: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  portfolio_id: string;
  name: string;
  category: string | null;
  proficiency: number;
  sort_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  portfolio_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  tags: string[];
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  portfolio_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  portfolio_id: string;
  title: string;
  issuer: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  credential_url: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  portfolio_id: string;
  title: string;
  description: string | null;
  date: string | null;
  sort_order: number;
  created_at: string;
}

export interface Contact {
  id: string;
  portfolio_id: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  created_at: string;
}

export interface SocialLink {
  id: string;
  portfolio_id: string;
  platform: string;
  url: string;
  sort_order: number;
  created_at: string;
}

export interface Resume {
  id: string;
  portfolio_id: string;
  file_url: string;
  file_name: string | null;
  uploaded_at: string;
}

export interface PortfolioData {
  portfolio: Portfolio;
  profile: Profile | null;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  blogPosts: BlogPost[];
  certificates: Certificate[];
  achievements: Achievement[];
  contacts: Contact[];
  socialLinks: SocialLink[];
  resumes: Resume[];
}
