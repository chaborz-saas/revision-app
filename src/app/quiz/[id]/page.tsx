'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, Clock, Loader2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { useToast } from '@/components/ui/Toast';
import QuizQuestion from '@/components/QuizQuestion';
import { formatTime } from '@/lib/quiz-engine';

interface Question {
  id: number;
  quiz_id: number;
  type: 'qcm' | 'vrai_faux' | 'reponse_courte';
  question: string;
  options_json: string;
  correct_answer: string;
  explanation: string;
}

interface QuizData {
  id: number;
  title: string;
  mode: string;
  difficulty: string;
  time_limit: number;
  question_count: number;
}

interface AnswerRecord {
  questionId: number;
  answer: string;
  isCorrect?: boolean;
}

export default function QuizSessionPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const quizId = Number(params.id);

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [currentCorrect, setCurrentCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (timerRunning && quiz?.mode === 'examen') {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (quiz.time_limit > 0 && prev >= quiz.time_limit) {
            handleTimeUp();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [timerRunning, quiz]);

  async function fetchQuiz() {
    try {
      const res = await fetch(`/api/quiz/correct?quizId=${quizId}`);
      if (!res.ok) throw new Error('Quiz non trouve');

      const data = await res.json();
      setQuiz(data.quiz);
      setQuestions(data.questions || []);
      setTimerRunning(true);
      startTimeRef.current = Date.now();
    } catch (err) {
      console.error('Erreur chargement quiz:', err);
      toast('Quiz introuvable', 'error');
      router.push('/quiz');
    } finally {
      setLoading(false);
    }
  }

  function handleTimeUp() {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setTimerRunning(false);
    toast('Temps ecoule !', 'info');
    submitQuiz();
  }

  function handleAnswer(answer: string) {
    const question = questions[currentIndex];
    const isCorrect = answer.toLowerCase() === question.correct_answer.toLowerCase();

    const newAnswers = [...answers, { questionId: question.id, answer, isCorrect }];
    setAnswers(newAnswers);

    if (quiz?.mode === 'rapide') {
      setCurrentCorrect(isCorrect);
      setShowResult(true);
    } else {
      goToNext(newAnswers);
    }
  }

  function goToNext(currentAnswers?: AnswerRecord[]) {
    const ans = currentAnswers || answers;
    setShowResult(false);
    setCurrentCorrect(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      submitQuiz(ans);
    }
  }

  const submitQuiz = useCallback(async (finalAnswers?: AnswerRecord[]) => {
    const ans = finalAnswers || answers;
    if (submitting) return;
    setSubmitting(true);
    setTimerRunning(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      const res = await fetch('/api/quiz/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId,
          answers: ans.map(a => ({
            questionId: a.questionId,
            answer: a.answer,
          })),
          timeSpent,
        }),
      });

      if (!res.ok) throw new Error('Erreur correction');

      router.push(`/quiz/results/${quizId}`);
    } catch (err) {
      console.error('Erreur soumission quiz:', err);
      toast('Erreur lors de la soumission', 'error');
      setSubmitting(false);
    }
  }, [answers, quizId, router, submitting, toast]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-zinc-400">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-zinc-400">Quiz introuvable ou vide.</p>
        <Button onClick={() => router.push('/quiz')} className="mt-4">Retour</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const options: string[] = (() => {
    try {
      return JSON.parse(currentQuestion.options_json);
    } catch {
      return [];
    }
  })();

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isExam = quiz.mode === 'examen';
  const hasAnsweredCurrent = answers.some(a => a.questionId === currentQuestion.id);
  const timeRemaining = quiz.time_limit > 0 ? quiz.time_limit - timer : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-200">{quiz.title}</h1>
          <p className="text-xs text-zinc-500">
            {quiz.difficulty} | {quiz.mode === 'examen' ? 'Examen' : 'Rapide'}
          </p>
        </div>
        {isExam && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-bold ${
            timeRemaining !== null && timeRemaining < 60
              ? 'bg-red-500/15 text-red-400 border border-red-500/30'
              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
          }`}>
            <Clock size={16} />
            {timeRemaining !== null ? formatTime(timeRemaining) : formatTime(timer)}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Question {currentIndex + 1} / {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} color="#06b6d4" size="sm" />
      </div>

      {/* Question */}
      <Card className="!p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium px-2 py-1 rounded bg-zinc-800 text-zinc-400">
            {currentQuestion.type === 'qcm' ? 'QCM' : currentQuestion.type === 'vrai_faux' ? 'Vrai / Faux' : 'Reponse courte'}
          </span>
          <span className="text-xs text-zinc-600">
            Question {currentIndex + 1}
          </span>
        </div>

        <QuizQuestion
          question={currentQuestion.question}
          type={currentQuestion.type}
          options={options}
          onAnswer={handleAnswer}
          showResult={showResult}
          isCorrect={currentCorrect}
          explanation={currentQuestion.explanation}
          correctAnswer={currentQuestion.correct_answer}
          disabled={hasAnsweredCurrent}
        />
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="text-xs text-zinc-600">
          {answers.length} / {questions.length} repondu{answers.length > 1 ? 's' : ''}
        </div>

        {quiz.mode === 'rapide' && showResult && (
          <Button
            onClick={() => goToNext()}
            icon={currentIndex < questions.length - 1 ? <ArrowRight size={16} /> : undefined}
          >
            {currentIndex < questions.length - 1 ? 'Suivante' : 'Voir les resultats'}
          </Button>
        )}

        {isExam && hasAnsweredCurrent && (
          <Button
            onClick={() => goToNext()}
            icon={currentIndex < questions.length - 1 ? <ArrowRight size={16} /> : undefined}
          >
            {currentIndex < questions.length - 1 ? 'Suivante' : "Terminer l'examen"}
          </Button>
        )}
      </div>

      {/* Submitting overlay */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="!p-8 text-center max-w-sm">
            <Loader2 size={32} className="animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-zinc-200 font-medium">Correction en cours...</p>
            <p className="text-sm text-zinc-500 mt-1">{"L'IA analyse tes reponses"}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
