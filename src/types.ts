export type ScreenTab = 'home' | 'resources' | 'whats-new' | 'request' | 'about' | 'login';

export type ThemeMode = 'light' | 'dark';

// Matches your Supabase `categories.slug` values exactly
export type CategorySlug =
  | 'syllabus'
  | 'notes'
  | 'books'
  | 'practice_materials'
  | 'helpful_resources';

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  syllabus: 'Syllabus',
  notes: 'Notes',
  books: 'Books',
  practice_materials: 'Practice Materials',
  helpful_resources: 'Helpful Resources',
};

export interface Category {
  id: string;
  subjectId: string;
  slug: CategorySlug;
  name: string;
}

export interface ResourceDocument {
  id: string;
  title: string;          // human-readable, generated from filename
  filePath: string;       // relative path in the GitHub repo, e.g. "Chemistry/notes/Metals.pdf"
  subjectId: string;
  subjectName: string;
  categorySlug: CategorySlug;
  categoryLabel: string;
  subfolder?: string | null; // e.g. "History / Ch 3", "Geography / Notes", "Examiner Reports"
  year?: number | null;
  fileType: 'PDF';         // everything in the repo is a PDF right now — extend if that changes
}

export interface Subject {
  id: string;
  name: string;
  syllabusCode?: string | null; // null until you populate it in Supabase
  documentCount: number;
  categories: Category[];        // only the categories that actually exist for this subject
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
}