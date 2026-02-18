'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import QuizResults from '@/components/QuizResults';

interface QuestionResult {
  id: number;
  question: string;
  type: string;
  correct_answer: string;
  explanation: string;
  userAnswer: string;
  isCorrect: boolean;
}

interface ResultsData {
  score: number;
  total: number;
  percentage: number;
  timeSpent: number;
  mode: string;
  quizTitle: string;
  results: QuestionResult[];
  chapterScores: { chapterTitle: string; score: number; total: number }[];
}

export default function QuizResultsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const quizId = Number(params.id);

  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchResults();
  }, [quizId]);

  async function fetchResults() {
    try {
      const res = await fetch(`/api/quiz/correct?results=${quizId}`);
      if (!res.ok) throw new Error('Resultats introuvables');

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Erreur chargement resultats:', err);
      toast('Resultats introuvables', 'error');
      router.push('/quiz');
    } finally {
      setLoading(false);
    }
  }

  async function handleRetry() {
    try {
      const res = await fetch(`/api/quiz/correct?quizId=${quizId}`);
      if (!res.ok) throw new Error('Quiz non trouve');
      router.push(`/quiz/${quizId}`);
    } catch {
      toast('Impossible de relancer le quiz', 'error');
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-zinc-400">Chargement des resultats...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-zinc-400">Resultats introuvables.</p>
        <Button onClick={() => router.push('/quiz')} className="mt-4">
          Retour aux quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/quiz')}
        icon={<ArrowLeft size={16} />}
      >
        Retour aux quiz
      </Button>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">{data.quizTitle || 'Resultats du quiz'}</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {data.mode === 'examen' ? 'Examen blanc' : 'Quiz rapide'} | {data.total} questions
        </p>
      </div>

      {/* Results component */}
      <QuizResults
        score={data.score}
        total={data.total}
        questions={data.results.map(r => ({
          id: r.id,
          question: r.question,
          type: r.type,
          correct_answer: r.correct_answer,
          explanation: r.explanation,
          userAnswer: r.userAnswer,
          isCorrect: r.isCorrect,
        }))}
        timeSpent={data.timeSpent}
        mode={data.mode}
        onRetry={handleRetry}
        onNewQuiz={() => router.push('/quiz')}
        chapterScores={data.chapterScores}
      />
    </div>
  );
}
