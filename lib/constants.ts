export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const DAY_SHORT_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ASSESSMENT_TYPES = ['ct', 'quiz', 'assignment', 'lab'] as const;

export const ASSESSMENT_TYPE_LABELS: Record<string, string> = {
  ct: 'CT',
  quiz: 'Quiz',
  assignment: 'Assignment',
  lab: 'Lab',
};

export const TARGET_TYPES = ['gpa', 'cgpa', 'attendance', 'custom'] as const;

export const TARGET_TYPE_LABELS: Record<string, string> = {
  gpa: 'GPA',
  cgpa: 'CGPA',
  attendance: 'Attendance',
  custom: 'Custom',
};

export const MAX_GPA = 4.0;
