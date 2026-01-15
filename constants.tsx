
import { UserLevel, Resource, User } from './types';

export const INITIAL_PARTNERS: User[] = [
  {
    id: 'p1',
    fullName: 'Alex Chen',
    email: 'alex@mbb.com',
    level: UserLevel.MASTER,
    rolePreference: 'flexible',
    caseFocus: 'Market Entry',
    availability: ['mon-14', 'mon-15', 'mon-18', 'tue-10', 'wed-14'],
    casesCompleted: 24,
    rating: 4.9,
    tags: ['Market Entry', 'M&A']
  },
  {
    id: 'p2',
    fullName: 'Sarah Miller',
    email: 'sarah@mbb.com',
    level: UserLevel.INTERMEDIATE,
    rolePreference: 'interviewee',
    caseFocus: 'Profitability',
    availability: ['mon-09', 'mon-11', 'wed-10'],
    casesCompleted: 12,
    rating: 5.0,
    tags: ['Profitability', 'Operations']
  },
  {
    id: 'p3',
    fullName: 'James Wilson',
    email: 'james@bcg.com',
    level: UserLevel.MASTER,
    rolePreference: 'interviewer',
    caseFocus: 'Growth',
    availability: ['mon-16', 'mon-17', 'mon-19', 'mon-21'],
    casesCompleted: 31,
    rating: 4.8,
    tags: ['Market Entry', 'Growth']
  },
  {
    id: 'p4',
    fullName: 'Elena Rodriguez',
    email: 'elena@bain.com',
    level: UserLevel.INTERMEDIATE,
    rolePreference: 'flexible',
    caseFocus: 'Digital',
    availability: ['mon-10', 'tue-11'],
    casesCompleted: 18,
    rating: 4.7,
    tags: ['Digital', 'Brain Teasers']
  },
  {
    id: 'p5',
    fullName: 'David Park',
    email: 'david@mbb.com',
    level: UserLevel.MASTER,
    rolePreference: 'interviewer',
    caseFocus: 'M&A',
    availability: ['mon-15', 'mon-16', 'fri-13'],
    casesCompleted: 42,
    rating: 4.9,
    tags: ['M&A', 'Private Equity']
  },
  {
    id: 'p6',
    fullName: 'Priya Sharma',
    email: 'priya@social.org',
    level: UserLevel.INTERMEDIATE,
    rolePreference: 'interviewee',
    caseFocus: 'Public Sector',
    availability: ['mon-13', 'mon-14'],
    casesCompleted: 9,
    rating: 5.0,
    tags: ['Public Sector', 'Social Impact']
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'r1',
    type: 'Framework',
    category: '1.2 MB PDF',
    title: 'The Profitability Tree Masterclass',
    description: 'The ultimate breakdown for analyzing revenue and cost drivers with precision.',
    fileInfo: '1.2 MB PDF'
  },
  {
    id: 'r2',
    type: 'Practice Case',
    category: 'Healthcare',
    title: 'MediLink: Market Entry Strategy',
    description: 'Analyze potential expansion into Southeast Asian markets for a medical tech firm.'
  },
  {
    id: 'r3',
    type: 'Skill Drill',
    category: 'Mental Math',
    title: 'Daily Quantitative Drills: Vol. 4',
    description: '20 rigorous mental math problems focused on percentage changes and large divisions.',
    status: 'completed'
  },
  {
    id: 'r4',
    type: 'Video Guide',
    category: 'Ex-MBB Lead',
    title: 'Structuring Like a Principal',
    description: 'Learn the subtle communication nuances that separate candidates from hires.'
  },
  {
    id: 'r5',
    type: 'Framework',
    category: '450 KB DOCX',
    title: 'Supply Chain Resilience Audit',
    description: 'A structured approach to evaluating post-pandemic manufacturing vulnerabilities.'
  },
  {
    id: 'r6',
    type: 'Practice Case',
    category: 'Technology',
    title: 'SaaS Subscription Optimization',
    description: 'Help a cloud storage giant reduce churn and increase ARPU through bundling.'
  }
];

export const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
export const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
