export interface Student {
  id: string;
  admissionNo: string;
  name: string;
  email: string;
  phone: string;
  classId: string;
  sectionId: string;
  guardianName: string;
  guardianPhone: string;
  feeStatus: 'paid' | 'pending' | 'overdue';
  totalFees: number;
  paidFees: number;
}

export interface Class {
  id: string;
  name: string;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  classId: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Timetable {
  id: string;
  classId: string;
  sectionId: string;
  day: string;
  period: number;
  subjectId: string;
  teacherId: string;
  room: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
}

export interface Homework {
  id: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  assignedBy: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: string[];
  createdBy: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  classApplied: string;
  source: string;
  status: 'new' | 'contacted' | 'application' | 'admitted' | 'rejected';
  notes: string;
  createdAt: string;
}

// Mock data
export const mockClasses: Class[] = [
  {
    id: 'class-1',
    name: 'Class 1',
    sections: [
      { id: 'sec-1a', name: 'A', classId: 'class-1' },
      { id: 'sec-1b', name: 'B', classId: 'class-1' }
    ]
  },
  {
    id: 'class-2',
    name: 'Class 2',
    sections: [
      { id: 'sec-2a', name: 'A', classId: 'class-2' },
      { id: 'sec-2b', name: 'B', classId: 'class-2' }
    ]
  }
];

export const mockSubjects: Subject[] = [
  { id: 'sub-1', name: 'Mathematics', code: 'MATH' },
  { id: 'sub-2', name: 'English', code: 'ENG' },
  { id: 'sub-3', name: 'Science', code: 'SCI' },
  { id: 'sub-4', name: 'Social Studies', code: 'SS' },
  { id: 'sub-5', name: 'Physical Education', code: 'PE' }
];

export const mockStudents: Student[] = [
  {
    id: '3',
    admissionNo: 'STU001',
    name: 'Alice Student',
    email: 'alice@school.com',
    phone: '+1234567892',
    classId: 'class-1',
    sectionId: 'sec-1a',
    guardianName: 'Bob Parent',
    guardianPhone: '+1234567893',
    feeStatus: 'paid',
    totalFees: 5000,
    paidFees: 5000
  },
  {
    id: 'stu-2',
    admissionNo: 'STU002',
    name: 'Charlie Student',
    email: 'charlie@school.com',
    phone: '+1234567895',
    classId: 'class-1',
    sectionId: 'sec-1a',
    guardianName: 'David Parent',
    guardianPhone: '+1234567896',
    feeStatus: 'pending',
    totalFees: 5000,
    paidFees: 3000
  },
  {
    id: 'stu-3',
    admissionNo: 'STU003',
    name: 'Eve Student',
    email: 'eve@school.com',
    phone: '+1234567897',
    classId: 'class-2',
    sectionId: 'sec-2a',
    guardianName: 'Frank Parent',
    guardianPhone: '+1234567898',
    feeStatus: 'overdue',
    totalFees: 5500,
    paidFees: 2000
  }
];

export const mockTimetable: Timetable[] = [
  {
    id: 'tt-1',
    classId: 'class-1',
    sectionId: 'sec-1a',
    day: 'Monday',
    period: 1,
    subjectId: 'sub-1',
    teacherId: '2',
    room: 'Room 101'
  },
  {
    id: 'tt-2',
    classId: 'class-1',
    sectionId: 'sec-1a',
    day: 'Monday',
    period: 2,
    subjectId: 'sub-2',
    teacherId: '2',
    room: 'Room 101'
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'School Reopening Notice',
    content: 'School will reopen on Monday, September 9th, 2025. Please ensure all students arrive on time.',
    targetAudience: ['student', 'parent', 'teacher'],
    createdBy: '1',
    createdAt: '2025-09-04T10:00:00Z',
    priority: 'high'
  },
  {
    id: 'ann-2',
    title: 'Parent-Teacher Meeting',
    content: 'Parent-Teacher meeting scheduled for September 15th, 2025. Please confirm your attendance.',
    targetAudience: ['parent'],
    createdBy: '1',
    createdAt: '2025-09-04T09:00:00Z',
    priority: 'medium'
  }
];

export const mockLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1234567899',
    classApplied: 'Class 1',
    source: 'Website',
    status: 'new',
    notes: 'Interested in admission for next academic year',
    createdAt: '2025-09-04T08:00:00Z'
  },
  {
    id: 'lead-2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1234567800',
    classApplied: 'Class 2',
    source: 'Referral',
    status: 'contacted',
    notes: 'Follow up scheduled for next week',
    createdAt: '2025-09-03T14:30:00Z'
  }
];

// Data management functions
export const getDataFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

export const saveDataToStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize mock data in localStorage if not exists
export const initializeMockData = (): void => {
  if (!localStorage.getItem('students')) {
    saveDataToStorage('students', mockStudents);
  }
  if (!localStorage.getItem('classes')) {
    saveDataToStorage('classes', mockClasses);
  }
  if (!localStorage.getItem('subjects')) {
    saveDataToStorage('subjects', mockSubjects);
  }
  if (!localStorage.getItem('timetable')) {
    saveDataToStorage('timetable', mockTimetable);
  }
  if (!localStorage.getItem('announcements')) {
    saveDataToStorage('announcements', mockAnnouncements);
  }
  if (!localStorage.getItem('leads')) {
    saveDataToStorage('leads', mockLeads);
  }
};