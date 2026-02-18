export interface AnswerRecord {
  questionId: number;
  answer: string;
  isCorrect?: boolean;
}

export interface MasteryEntry {
  chapter_id: number;
  score: number;
  attempts: number;
}

export function calculateScore(
  questions: { id: number; correct_answer: string; type: string }[],
  answers: AnswerRecord[]
): { score: number; total: number; details: AnswerRecord[] } {
  let score = 0;
  const total = questions.length;
  const details: AnswerRecord[] = [];

  for (const question of questions) {
    const userAnswer = answers.find(a => a.questionId === question.id);
    const answer = userAnswer?.answer?.trim() || '';
    const correct = question.correct_answer.trim();

    let isCorrect = false;

    if (question.type === 'qcm' || question.type === 'vrai_faux') {
      isCorrect = answer.toLowerCase() === correct.toLowerCase();
    } else {
      isCorrect = answer.toLowerCase() === correct.toLowerCase();
    }

    if (isCorrect) score++;

    details.push({
      questionId: question.id,
      answer,
      isCorrect,
    });
  }

  return { score, total, details };
}

export function getWeakChapters(
  masteryList: MasteryEntry[],
  threshold: number = 60
): MasteryEntry[] {
  return masteryList.filter(m => m.score < threshold);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function shuffleOptions<T>(options: T[]): T[] {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 80) return '#10b981';
  if (percentage >= 60) return '#06b6d4';
  if (percentage >= 40) return '#f59e0b';
  return '#ef4444';
}

export function getScoreLabel(percentage: number): string {
  if (percentage >= 90) return 'Excellent !';
  if (percentage >= 80) return 'Tres bien !';
  if (percentage >= 60) return 'Bien';
  if (percentage >= 40) return 'Peut mieux faire';
  return 'A revoir';
}
