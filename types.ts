
export enum UserLevel {
  ROOKIE = 'Rookie',
  INTERMEDIATE = 'Intermediate',
  MASTER = 'Master',
  COACH = 'Coach'
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  level: UserLevel;
  rolePreference: 'interviewer' | 'interviewee' | 'flexible';
  caseFocus: string;
  availability: string[]; // Format: "day-hour" e.g., "mon-09"
  casesCompleted: number;
  rating: number;
  tags: string[];
}

export interface Resource {
  id: string;
  type: 'Framework' | 'Practice Case' | 'Skill Drill' | 'Video Guide';
  category: string;
  title: string;
  description: string;
  fileInfo?: string;
  isBookmarked?: boolean;
  status?: 'completed' | 'available';
}

export enum AppView {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  FIND_PARTNER = 'FIND_PARTNER',
  RESOURCES = 'RESOURCES'
}
