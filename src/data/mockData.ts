import { ResourceRequest, UserProfile } from '../types';

export const INITIAL_REQUESTS: ResourceRequest[] = [
  {
    id: 'req-1',
    subjectType: 'existing',
    subjectName: 'Computer Science (2210)',
    syllabusCode: '2210',
    details: 'Topical past papers for Logic Gates and Boolean Algebra.',
    categoryTag: 'Topical Past Papers',
    requestedAt: 'Requested on Oct 24, 2023',
    status: 'In Progress',
    requesterEmail: 'ayyanh34@gmail.com'
  },
  {
    id: 'req-2',
    subjectType: 'existing',
    subjectName: 'Additional Mathematics (4037)',
    syllabusCode: '4037',
    details: 'Revision notes for Kinematics and Integration.',
    categoryTag: 'Revision Notes',
    requestedAt: 'Requested on Sep 12, 2023',
    status: 'Fulfilled',
    requesterEmail: 'alex.scholar@cambridge.org'
  },
  {
    id: 'req-3',
    subjectType: 'new',
    subjectName: 'Environmental Management',
    syllabusCode: '5014',
    details: 'New subject syllabus addition request.',
    categoryTag: 'Syllabus Addition',
    requestedAt: 'Requested on Aug 05, 2023',
    status: 'Closed',
    requesterEmail: 'student.study@cambridge.org'
  },
  {
    id: 'req-4',
    subjectType: 'existing',
    subjectName: 'Urdu First Language (3247 / 3248)',
    syllabusCode: '3248',
    details: '2022 May/June & Oct/Nov complete past papers and solved translation essays.',
    categoryTag: 'Past Papers',
    requestedAt: 'Requested on Nov 04, 2023',
    status: 'Under Review',
    requesterEmail: 'ayyanh34@gmail.com'
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex',
  email: 'alex.scholar@cambridge.org',
  role: 'Student',
  isLoggedIn: true,
};
