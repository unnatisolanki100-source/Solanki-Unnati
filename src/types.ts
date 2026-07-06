export type Role = 'hire' | 'creator' | 'talent' | 'agency';

export type ScreenState = 'splash' | 'continue' | 'dashboard';

export interface RecentProject {
  title: string;
  link?: string;
  description?: string;
}

export interface ViralReel {
  title: string;
  viewsStr: string;
  link?: string;
  thumbnailUrl?: string;
}

export interface SocialCreator {
  id: string;
  name: string;
  instagramHandle: string;
  category: 'food' | 'fashion' | 'tech' | 'travel' | 'comedy' | 'beauty' | 'fitness';
  avatar: string;
  followers: number; // raw count
  followersStr: string; // formatted e.g., "450K"
  engagementRate: string; // e.g., "4.8%"
  location: string;
  recentReels: string[]; // image URLs
  bio: string;
  averageViews: string; // e.g., "120K"
  brandCollaborations: string[]; // e.g., ["Zara", "H&M"]
  recentProject?: RecentProject;
  viralReel?: ViralReel;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  location: string;
  rating: number;
  completedProjects: number;
  rate: string;
  availability: 'Available Now' | 'Next Week' | 'In 2 Weeks';
  skills: string[];
  bio: string;
  portfolio: string[];
  recentProject?: RecentProject;
}

export interface TalentCategory {
  id: string;
  name: string;
  count: number;
  icon: string;
  popularSkills: string[];
}

export interface CreatorProject {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  subscriberCount: string;
  title: string;
  description: string;
  budget: string;
  duration: string;
  requiredRole: string;
  location: string;
}

