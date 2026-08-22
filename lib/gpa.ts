import type { Assessment } from '@/lib/types';

export interface Progress {
  obtained: number;
  max: number;
  percent: number;
}

export function courseProgress(assessments: Assessment[]): Progress {
  const obtained = assessments.reduce((sum, a) => sum + a.marksObtained, 0);
  const max = assessments.reduce((sum, a) => sum + a.maxMarks, 0);
  const percent = max === 0 ? 0 : Math.round((obtained / max) * 100);
  return { obtained, max, percent };
}

export function weightedPercent(assessments: Assessment[]): number {
  if (assessments.length === 0) return 0;
  const total = assessments.reduce(
    (sum, a) => sum + (a.marksObtained / a.maxMarks) * a.weight,
    0,
  );
  return Math.min(100, Math.round(total));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
