export type SemesterStatus = 'active' | 'archived';

export interface UserProfile {
  fullName: string;
  university: string;
  department: string;
  currentSemester: string;
  targetCgpa: number;
  createdAt?: number;
}

export interface Semester {
  id: string;
  name: string;
  status: SemesterStatus;
  targetGpa: number;
  createdAt: number;
}

export interface Course {
  id: string;
  semesterId: string;
  code: string;
  title: string;
  credits: number;
  passMarks: number;
  ctWeight: number;
  createdAt: number;
}

export type AssessmentType = 'ct' | 'quiz' | 'assignment' | 'lab';

export interface Assessment {
  id: string;
  type: AssessmentType;
  name: string;
  marksObtained: number;
  maxMarks: number;
  weight: number;
  date: string;
  createdAt: number;
}

export interface RoutineSlot {
  id: string;
  courseId: string;
  courseLabel: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  createdAt: number;
}

export type TargetType = 'gpa' | 'cgpa' | 'attendance' | 'custom';

export interface AcademicTarget {
  id: string;
  type: TargetType;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  createdAt: number;
}
