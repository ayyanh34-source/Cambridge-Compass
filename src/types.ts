export type ScreenTab = 'home' | 'resources' | 'whats-new' | 'request' | 'about' | 'login';

export type ThemeMode = 'light' | 'dark';

export type DirectoryType = 'Notes' | 'Worksheets' | 'Yearlies' | 'Past Papers' | 'Marking Schemes' | 'Topical Past Papers';

export type SubjectPattern = 'math' | 'physics' | 'chemistry' | 'cs' | 'biology' | 'english' | 'additional_math' | 'general';

export interface ResourceDocument {
  id: string;
  title: string;
  filename: string;
  subjectId: string;
  subjectName: string;
  syllabusCode: string;
  directory: DirectoryType;
  topic?: string;
  fileType: 'PDF' | 'DOCX' | 'ZIP';
  size: string;
  updatedAt: string;
  uploadGroup: 'recently_added' | 'last_week' | 'earlier';
  downloadCount: number;
  description: string;
  pageCount?: number;
  previewSnippet?: string[];
  solvedStatus?: 'Fully Solved' | 'Unsolved' | 'Marking Scheme Attached';
  year?: string;
  session?: 'May/June' | 'Oct/Nov' | 'Specimen';
}

export interface Subject {
  id: string;
  name: string;
  syllabusCode: string;
  level: string;
  tagline: string;
  description: string;
  pattern: SubjectPattern;
  documentCount: number;
  directories: DirectoryType[];
  topics: string[];
  popularResources: string[];
}

export interface ResourceRequest {
  id: string;
  subjectType: 'existing' | 'new';
  subjectName: string;
  syllabusCode?: string;
  details: string;
  categoryTag?: string;
  requestedAt: string;
  status: 'In Progress' | 'Fulfilled' | 'Closed' | 'Under Review';
  requesterEmail?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'Student' | 'Educator';
  isLoggedIn: boolean;
  activeSubjects: {
    subjectId: string;
    subjectName: string;
    syllabusCode: string;
    currentTopic: string;
    progressPercent: number;
    lastAccessed: string;
  }[];
  recentlyViewed: {
    documentId: string;
    title: string;
    subjectName: string;
    fileType: string;
    viewedAt: string;
  }[];
  pendingRequests: {
    subject: string;
    code: string;
    title: string;
    status: string;
  }[];
  monthlyExploredCount: number;
}
