'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Zap,
  ChevronRight,
  ChevronDown,
  Clock,
  BookOpen,
  Play,
  Target,
  Sparkles,
  Settings2,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import ProgressBar from '@/components/ui/ProgressBar';
import { useToast } from '@/components/ui/Toast';
import { getScoreColor } from '@/lib/quiz-engine';

// ─── Types ───

interface SubjectCourse {
  id: number;
  title: string;
  tag: string;
  chapter_count: number;
  chapters: { id: number; title: string }[];
}

interface SubjectGroup {
  subject: string;
  color: string;
  courses: SubjectCourse[];
}

interface AvailableQuiz {
  id: number;
  title: string;
  question_count: number;
  mode: string;
  difficulty: string;
  time_limit: number;
  course_id: number | null;
  created_at: string;
}

interface AttemptSummary {
  id: number;
  quiz_id: number;
  score: number;
  total: number;
  time_spent: number;
  created_at: string;
  quiz_title?: string;
}

interface MasteryEntry {
  chapter_id: number;
  score: number;
  attempts: number;
  chapter_title?: string;
}

// ─── Main Component ───

export default function QuizPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [subjects, setSubjects] = useState<SubjectGroup[]>([]);
  const [availableQuizzes, setAvailableQuizzes] = useState<AvailableQuiz[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<AttemptSummary[]>([]);
  const [weakChapters, setWeakChapters] = useState<MasteryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Generator state
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapterIds, setSelectedChapterIds] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<'facile' | 'moyen' | 'difficile'>('moyen');
  const [questionCount, setQuestionCount] = useState(10);
  const [questionTypes, setQuestionTypes] = useState<string[]>(['qcm', 'vrai_faux']);
  const [generating, setGenerating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    try {
      const [subjectsRes, quizzesRes, attemptsRes, masteryRes] = await Promise.all([
        fetch('/api/quiz/generate'),
        fetch('/api/quiz/list'),
        fetch('/api/quiz/correct?recent=true'),
        fetch('/api/quiz/correct?mastery=true'),
      ]);

      if (subjectsRes.ok) {
        const data = await subjectsRes.json();
        const courses = data.courses || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const grouped: Record<string, SubjectGroup> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const c of courses as any[]) {
          if (!grouped[c.subject]) {
            grouped[c.subject] = { subject: c.subject, color: c.color, courses: [] };
          }
          grouped[c.subject].courses.push({
            id: c.id,
            title: c.title,
            tag: c.tag || 'Cours',
            chapter_count: c.chapter_count,
            chapters: [],
          });
        }
        setSubjects(Object.values(grouped));
      }

      if (quizzesRes.ok) {
        const data = await quizzesRes.json();
        setAvailableQuizzes(data.quizzes || []);
      }

      if (attemptsRes.ok) {
        const data = await attemptsRes.json();
        setRecentAttempts(data.attempts || []);
      }

      if (masteryRes.ok) {
        const data = await masteryRes.json();
        setWeakChapters((data.mastery || []).filter((m: MasteryEntry) => m.score < 60));
      }
    } catch {
      toast('Erreur lors du chargement', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectSubject(subject: string) {
    if (selectedSubject === subject) {
      setSelectedSubject(null);
      setSelectedChapterIds([]);
      return;
    }

    setSelectedSubject(subject);
    setSelectedChapterIds([]);

    const group = subjects.find(s => s.subject === subject);
    if (!group) return;

    const updatedCourses: SubjectCourse[] = [];
    for (const course of group.courses) {
      try {
        const res = await fetch(`/api/quiz/generate?courseId=${course.id}`);
        if (res.ok) {
          const data = await res.json();
          updatedCourses.push({
            ...course,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            chapters: (data.chapters || []).map((ch: any) => ({
              id: ch.id,
              title: ch.title,
            })),
          });
        } else {
          updatedCourses.push(course);
        }
      } catch {
        updatedCourses.push(course);
      }
    }

    setSubjects(prev =>
      prev.map(s =>
        s.subject === subject ? { ...s, courses: updatedCourses } : s
      )
    );
  }

  function toggleChapter(chapterId: number) {
    setSelectedChapterIds(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  }

  function selectAllChapters(subject: string) {
    const group = subjects.find(s => s.subject === subject);
    if (!group) return;
    const allIds = group.courses.flatMap(c => c.chapters.map(ch => ch.id));
    setSelectedChapterIds(allIds);
  }

  function toggleQuestionType(type: string) {
    setQuestionTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }

  async function handleGenerate() {
    if (selectedChapterIds.length === 0) {
      toast('Selectionne au moins un chapitre', 'error');
      return;
    }
    if (questionTypes.length === 0) {
      toast('Selectionne au moins un type de question', 'error');
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterIds: selectedChapterIds,
          difficulty,
          questionCount,
          types: questionTypes,
          mode: 'rapide',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur de generation');
      }

      const data = await res.json();
      router.push(`/quiz/${data.quizId}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erreur de generation', 'error');
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 w-56 bg-zinc-800 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-zinc-900 border border-zinc-800 rounded-xl" />
          ))}
        </div>
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const selectedGroup = subjects.find(s => s.subject === selectedSubject);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Brain size={24} className="text-cyan-400" />
          <h1 className="text-2xl font-bold text-zinc-100">Quiz</h1>
        </div>
        <p className="text-sm text-zinc-500">
          Genere des quiz personnalises par matiere et chapitre.
        </p>
      </motion.div>

      {/* ── Subject Selector ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <h2 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
          <Sparkles size={14} className="text-cyan-400" />
          Choisir une matiere
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {subjects.map((group) => {
            const isSelected = selectedSubject === group.subject;
            const courseCount = group.courses.filter(c => c.tag === 'Cours').length;
            return (
              <button
                key={group.subject}
                onClick={() => handleSelectSubject(group.subject)}
                className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-2 shadow-lg scale-[1.02]'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-800/80'
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: group.color,
                        backgroundColor: `${group.color}10`,
                        boxShadow: `0 4px 20px ${group.color}15`,
                      }
                    : undefined
                }
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${group.color}20` }}
                >
                  <BookOpen size={16} style={{ color: group.color }} />
                </div>
                <p className="text-sm font-semibold text-zinc-200 truncate">
                  {group.subject}
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {courseCount} cours · {group.courses.reduce((a, c) => a + c.chapter_count, 0)} chapitres
                </p>
                {isSelected && (
                  <motion.div
                    layoutId="subject-indicator"
                    className="absolute top-2 right-2 w-2 h-2 rounded-full"
                    style={{ backgroundColor: group.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Chapter Selector (when subject is selected) ── */}
      <AnimatePresence mode="wait">
        {selectedGroup && (
          <motion.div
            key={selectedSubject}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-200">
                  Chapitres — {selectedGroup.subject}
                </h3>
                <button
                  onClick={() => selectAllChapters(selectedGroup.subject)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Tout selectionner
                </button>
              </div>

              {selectedGroup.courses
                .filter(c => c.tag === 'Cours')
                .map((course) => (
                  <div key={course.id}>
                    <p className="text-xs font-medium text-zinc-400 mb-2 px-1">
                      {course.title}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {course.chapters.length === 0 ? (
                        <p className="text-xs text-zinc-600 italic px-1">Chargement...</p>
                      ) : (
                        course.chapters.map((ch) => {
                          const isChSelected = selectedChapterIds.includes(ch.id);
                          return (
                            <button
                              key={ch.id}
                              onClick={() => toggleChapter(ch.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                                isChSelected
                                  ? ''
                                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                              }`}
                              style={
                                isChSelected
                                  ? {
                                      backgroundColor: `${selectedGroup.color}20`,
                                      borderColor: selectedGroup.color,
                                      color: selectedGroup.color,
                                    }
                                  : undefined
                              }
                            >
                              {ch.title.length > 45 ? ch.title.slice(0, 45) + '...' : ch.title}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}

              {/* Options toggle */}
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors pt-2"
              >
                <Settings2 size={14} />
                Options avancees
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${showOptions ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Advanced Options */}
              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-800">
                      {/* Difficulty */}
                      <div>
                        <label className="text-xs text-zinc-500 block mb-2">Difficulte</label>
                        <div className="flex gap-1.5">
                          {(['facile', 'moyen', 'difficile'] as const).map((d) => (
                            <button
                              key={d}
                              onClick={() => setDifficulty(d)}
                              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                difficulty === d
                                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                                  : 'border-zinc-700 text-zinc-500 hover:border-zinc-600'
                              }`}
                            >
                              {d.charAt(0).toUpperCase() + d.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question count */}
                      <div>
                        <label className="text-xs text-zinc-500 block mb-2">Nombre de questions</label>
                        <div className="flex gap-1.5">
                          {[5, 10, 15, 20].map((n) => (
                            <button
                              key={n}
                              onClick={() => setQuestionCount(n)}
                              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                questionCount === n
                                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                                  : 'border-zinc-700 text-zinc-500 hover:border-zinc-600'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Question types */}
                      <div>
                        <label className="text-xs text-zinc-500 block mb-2">Types</label>
                        <div className="flex gap-1.5">
                          {[
                            { key: 'qcm', label: 'QCM' },
                            { key: 'vrai_faux', label: 'V/F' },
                          ].map((t) => (
                            <button
                              key={t.key}
                              onClick={() => toggleQuestionType(t.key)}
                              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                questionTypes.includes(t.key)
                                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                                  : 'border-zinc-700 text-zinc-500 hover:border-zinc-600'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generate button */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-zinc-500">
                  {selectedChapterIds.length === 0
                    ? 'Selectionne des chapitres'
                    : `${selectedChapterIds.length} chapitre${selectedChapterIds.length > 1 ? 's' : ''} selectionne${selectedChapterIds.length > 1 ? 's' : ''}`}
                </p>
                <Button
                  onClick={handleGenerate}
                  loading={generating}
                  disabled={selectedChapterIds.length === 0 || generating}
                  icon={generating ? undefined : <Zap size={16} />}
                >
                  {generating ? 'Generation...' : 'Generer le quiz'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Points faibles ── */}
      {weakChapters.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="!border-amber-500/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                <Target size={20} className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100 mb-1">Points faibles detectes</h3>
                <p className="text-sm text-zinc-500 mb-3">
                  {weakChapters.length} chapitre{weakChapters.length > 1 ? 's' : ''} avec une maitrise inferieure a 60%
                </p>
                <div className="flex flex-wrap gap-2">
                  {weakChapters.slice(0, 6).map((w) => (
                    <Badge key={w.chapter_id} color="#f59e0b">
                      {w.chapter_title || `Chapitre ${w.chapter_id}`} ({Math.round(w.score)}%)
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* ── Quiz disponibles ── */}
      {availableQuizzes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
            <BookOpen size={14} className="text-cyan-400" />
            Quiz disponibles ({availableQuizzes.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableQuizzes.slice(0, 8).map((q) => {
              const isExam = q.mode === 'examen';
              const color = isExam ? '#f59e0b' : '#06b6d4';
              return (
                <Card
                  key={q.id}
                  hover
                  onClick={() => router.push(`/quiz/${q.id}`)}
                  className="group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        {isExam ? (
                          <Target size={16} style={{ color }} />
                        ) : (
                          <Brain size={16} style={{ color }} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                          {q.title}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {q.question_count} questions · {q.difficulty}
                          {isExam && ` · ${Math.floor(q.time_limit / 60)} min`}
                        </p>
                      </div>
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Play size={14} style={{ color }} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Derniers resultats ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
          <Clock size={14} className="text-zinc-500" />
          Derniers resultats
        </h2>
        {recentAttempts.length === 0 ? (
          <Card className="text-center !py-10">
            <Brain size={36} className="mx-auto text-zinc-700 mb-3" />
            <p className="text-zinc-500 text-sm mb-1">Aucun quiz realise</p>
            <p className="text-xs text-zinc-600">
              Selectionne une matiere ci-dessus pour generer ton premier quiz !
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentAttempts.slice(0, 5).map((attempt) => {
              const pct = attempt.total > 0 ? Math.round((attempt.score / attempt.total) * 100) : 0;
              const color = getScoreColor(pct);
              return (
                <Card
                  key={attempt.id}
                  hover
                  onClick={() => router.push(`/quiz/results/${attempt.quiz_id}`)}
                  className="!py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        {pct}%
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          {attempt.quiz_title || `Quiz #${attempt.quiz_id}`}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {attempt.score}/{attempt.total} correct{attempt.score > 1 ? 's' : ''}
                          {attempt.time_spent > 0 && (
                            <span className="ml-2">
                              {Math.floor(attempt.time_spent / 60)}min {attempt.time_spent % 60}s
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ProgressBar value={pct} color={color} size="sm" className="w-20" />
                      <ChevronRight size={14} className="text-zinc-600" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
