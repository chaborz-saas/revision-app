export const SUBJECT_COLORS = [
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

export function getSubjectColor(index: number): string {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
}

export const MASTERY_COLORS = {
  low: '#ef4444',    // red - 0-30%
  medium: '#f59e0b', // amber - 30-60%
  good: '#10b981',   // emerald - 60-85%
  expert: '#06b6d4', // cyan - 85-100%
};

export function getMasteryColor(score: number): string {
  if (score < 30) return MASTERY_COLORS.low;
  if (score < 60) return MASTERY_COLORS.medium;
  if (score < 85) return MASTERY_COLORS.good;
  return MASTERY_COLORS.expert;
}

export function getMasteryLabel(score: number): string {
  if (score < 30) return 'À travailler';
  if (score < 60) return 'En cours';
  if (score < 85) return 'Bien maîtrisé';
  return 'Expert';
}
