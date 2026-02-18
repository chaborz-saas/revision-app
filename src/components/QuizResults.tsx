'use client';

import { useMemo } from 'react';
import { Check, X, RotateCcw, Plus, Trophy, Target, BarChart3 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { getScoreColor, getScoreLabel } from '@/lib/quiz-engine';

interface QuestionResult {
  id: number;
  question: string;
  type: string;
  correct_answer: string;
  explanation: string;
  userAnswer: string;
  isCorrect: boolean;
}

interface QuizResultsProps {
  score: number;
  total: number;
  questions: QuestionResult[];
  timeSpent?: number;
  mode?: string;
  onRetry?: () => void;
  onNewQuiz?: () => void;
  chapterScores?: { chapterTitle: string; score: number; total: number }[];
}

export default function QuizResults({
  score,
  total,
  questions,
  timeSpent,
  mode,
  onRetry,
  onNewQuiz,
  chapterScores,
}: QuizResultsProps) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const color = getScoreColor(percentage);
  const label = getScoreLabel(percentage);

  const statsByType = useMemo(() => {
    const stats: Record<string, { correct: number; total: number }> = {};
    for (const q of questions) {
      const typeLabel = q.type === 'qcm' ? 'QCM' : q.type === 'vrai_faux' ? 'Vrai/Faux' : 'Reponse courte';
      if (!stats[typeLabel]) stats[typeLabel] = { correct: 0, total: 0 };
      stats[typeLabel].total++;
      if (q.isCorrect) stats[typeLabel].correct++;
    }
    return stats;
  }, [questions]);

  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-8">
      {/* Score principal */}
      <Card className="!p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-40 h-40">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="#27272a"
                strokeWidth="10"
              />
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color }}>{percentage}%</span>
              <span className="text-sm text-zinc-500">{score}/{total}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Trophy size={20} style={{ color }} />
              <h2 className="text-xl font-bold" style={{ color }}>{label}</h2>
            </div>
            {timeSpent !== undefined && timeSpent > 0 && (
              <p className="text-sm text-zinc-500">
                Temps : {Math.floor(timeSpent / 60)}min {timeSpent % 60}s
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            {onRetry && (
              <Button variant="secondary" icon={<RotateCcw size={16} />} onClick={onRetry}>
                Refaire ce quiz
              </Button>
            )}
            {onNewQuiz && (
              <Button icon={<Plus size={16} />} onClick={onNewQuiz}>
                Nouveau quiz
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Stats par type */}
      {Object.keys(statsByType).length > 1 && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-cyan-400" />
            Statistiques par type
          </h3>
          <div className="space-y-3">
            {Object.entries(statsByType).map(([type, stats]) => {
              const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">{type}</span>
                    <span className="text-zinc-300 font-medium">{stats.correct}/{stats.total} ({pct}%)</span>
                  </div>
                  <ProgressBar value={pct} color={getScoreColor(pct)} size="sm" />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Scores par chapitre (mode examen) */}
      {mode === 'examen' && chapterScores && chapterScores.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
            <Target size={16} className="text-cyan-400" />
            Bulletin par chapitre
          </h3>
          <div className="space-y-3">
            {chapterScores.map((cs, i) => {
              const pct = cs.total > 0 ? Math.round((cs.score / cs.total) * 100) : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-400">{cs.chapterTitle}</span>
                    <span className="text-zinc-300 font-medium">{cs.score}/{cs.total} ({pct}%)</span>
                  </div>
                  <ProgressBar value={pct} color={getScoreColor(pct)} size="sm" />
                </div>
              );
            })}
          </div>
          {percentage < 60 && (
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-300">
                Recommandation : Concentre-toi sur les chapitres en dessous de 60% et refais un quiz cible.
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Detail des questions */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Detail des questions</h3>
        <div className="space-y-3">
          {questions.map((q, i) => (
            <Card
              key={q.id}
              className={`!p-4 border-l-4 ${
                q.isCorrect ? '!border-l-emerald-500' : '!border-l-red-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                  q.isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}>
                  {q.isCorrect ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <X size={14} className="text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 mb-2">
                    <span className="text-zinc-500 mr-2">Q{i + 1}.</span>
                    {q.question}
                  </p>
                  <div className="space-y-1 text-xs">
                    <p className={q.isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                      <span className="text-zinc-500">Ta reponse : </span>
                      {q.userAnswer || '(pas de reponse)'}
                    </p>
                    {!q.isCorrect && (
                      <p className="text-emerald-400">
                        <span className="text-zinc-500">Bonne reponse : </span>
                        {q.correct_answer}
                      </p>
                    )}
                    {q.explanation && (
                      <p className="text-zinc-500 mt-1 leading-relaxed">{q.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
