'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Clock,
  Flame,
  RotateCcw,
  Layers,
  BookOpen,
  FileText,
  Eye,
  EyeOff,
  GraduationCap,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { DueReviewItem, SpacedReviewStats } from '@/app/api/spaced-review/route';

// ─── Types ───
type ActiveTab = 'exercises' | 'spaced';
type ReviewMode = 'overview' | 'reviewing' | 'done';

interface ExerciseChapter {
  id: number;
  title: string;
  content: string;
  order_index: number;
}

interface ExerciseCourse {
  id: number;
  title: string;
  tag: string;
  color: string;
  chapters: ExerciseChapter[];
}

interface ExerciseSubject {
  subject: string;
  courses: ExerciseCourse[];
}

interface QualityOption {
  quality: number;
  label: string;
  sublabel: string;
  color: string;
  bgColor: string;
}

const QUALITY_OPTIONS: QualityOption[] = [
  { quality: 1, label: 'Difficile', sublabel: 'À revoir demain', color: 'text-red-400', bgColor: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20' },
  { quality: 3, label: 'Moyen', sublabel: 'Dans quelques jours', color: 'text-amber-400', bgColor: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20' },
  { quality: 5, label: 'Facile', sublabel: 'Pas avant longtemps', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20' },
];

const TAG_ICONS: Record<string, string> = {
  'Cas pratique': '📋',
  'Exercice': '✏️',
  'Examen': '📝',
  'Corrigé': '✅',
};

// ─── Main page ───
export default function PracticePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('exercises');

  return (
    <div className="space-y-6 max-w-[900px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap size={20} className="text-cyan-400" />
          <h1 className="text-2xl font-bold text-zinc-100">Practice</h1>
        </div>
        <p className="text-sm text-zinc-500">
          Exercices, cas pratiques et révision espacée
        </p>
      </motion.div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'exercises'
              ? 'bg-zinc-800 text-cyan-400 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          <FileText size={16} />
          Exercices &amp; Cas Pratiques
        </button>
        <button
          onClick={() => setActiveTab('spaced')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'spaced'
              ? 'bg-zinc-800 text-cyan-400 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          <Brain size={16} />
          Révision Espacée
        </button>
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === 'exercises' ? (
          <motion.div
            key="exercises"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ExercisesTab />
          </motion.div>
        ) : (
          <motion.div
            key="spaced"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <SpacedReviewTab />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXERCISES TAB
// ═══════════════════════════════════════════════════════════

function ExercisesTab() {
  const [subjects, setSubjects] = useState<ExerciseSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [visibleCorrections, setVisibleCorrections] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await fetch('/api/practice');
        if (!res.ok) throw new Error('Erreur');
        const data = await res.json();
        setSubjects(data.subjects ?? []);
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    }
    fetchExercises();
  }, []);

  const toggleCorrection = (chapterId: number) => {
    setVisibleCorrections(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl h-20" />
        ))}
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="p-4 bg-zinc-800 rounded-full">
          <FileText size={32} className="text-zinc-500" />
        </div>
        <p className="text-zinc-400">Aucun exercice disponible.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {subjects.map((subject) => (
        <div key={subject.subject} className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
            <BookOpen size={18} className="text-cyan-400" />
            {subject.subject}
            <span className="text-xs text-zinc-500 font-normal">
              ({subject.courses.length} exercice{subject.courses.length > 1 ? 's' : ''})
            </span>
          </h2>

          <div className="space-y-2">
            {subject.courses.map((course) => {
              const isExpanded = expandedCourse === course.id;
              const tagIcon = TAG_ICONS[course.tag] || '📄';

              return (
                <div
                  key={course.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                >
                  {/* Course header */}
                  <button
                    onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-zinc-800/50 transition-colors text-left"
                  >
                    <span className="text-lg">{tagIcon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">
                        {course.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge color={course.color}>{course.tag}</Badge>
                        <span className="text-xs text-zinc-500">
                          {course.chapters.length} partie{course.chapters.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-zinc-800">
                          {course.chapters.map((chapter) => {
                            const isVisible = visibleCorrections.has(chapter.id);
                            // Hide corrections: chapters after the first one (order_index > 0)
                            const shouldHide = course.chapters.length > 1 && chapter.order_index > 0;

                            return (
                              <div key={chapter.id} className="border-b border-zinc-800/50 last:border-b-0">
                                {shouldHide && !isVisible ? (
                                  <div className="px-5 py-4">
                                    <button
                                      onClick={() => toggleCorrection(chapter.id)}
                                      className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg text-cyan-400 text-sm font-medium transition-colors"
                                    >
                                      <Eye size={16} />
                                      Voir la correction
                                    </button>
                                  </div>
                                ) : (
                                  <div className="px-5 py-4">
                                    {shouldHide && (
                                      <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                                          <CheckCircle2 size={14} />
                                          Correction
                                        </h4>
                                        <button
                                          onClick={() => toggleCorrection(chapter.id)}
                                          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                                        >
                                          <EyeOff size={12} />
                                          Masquer
                                        </button>
                                      </div>
                                    )}
                                    {!shouldHide && chapter.title && (
                                      <h4 className="text-sm font-medium text-zinc-300 mb-3">
                                        {chapter.title}
                                      </h4>
                                    )}
                                    <div className="prose-revision text-sm">
                                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {chapter.content}
                                      </ReactMarkdown>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SPACED REVIEW TAB
// ═══════════════════════════════════════════════════════════

function SpacedReviewTab() {
  const [dueReviews, setDueReviews] = useState<DueReviewItem[]>([]);
  const [stats, setStats] = useState<SpacedReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<ReviewMode>('overview');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/spaced-review');
      if (!res.ok) throw new Error('Erreur de chargement');
      const data = await res.json();
      setDueReviews(data.dueReviews ?? []);
      setStats(data.stats ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleStartReview = () => {
    setMode('reviewing');
    setCurrentIndex(0);
    setShowContent(false);
    setReviewedCount(0);
  };

  const handleRate = async (quality: number) => {
    const current = dueReviews[currentIndex];
    if (!current || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/spaced-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: current.chapter_id, quality }),
      });
      if (!res.ok) throw new Error('Erreur');

      const newReviewed = reviewedCount + 1;
      setReviewedCount(newReviewed);

      if (currentIndex + 1 < dueReviews.length) {
        setCurrentIndex(currentIndex + 1);
        setShowContent(false);
      } else {
        setMode('done');
      }
    } catch {
      // silently handle
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setMode('overview');
    setCurrentIndex(0);
    setShowContent(false);
    setReviewedCount(0);
    fetchReviews();
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 h-16" />
          ))}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-48" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="p-4 bg-red-500/10 rounded-full">
          <Brain size={32} className="text-red-400" />
        </div>
        <p className="text-zinc-400 text-sm">{error}</p>
        <Button variant="secondary" onClick={fetchReviews}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatMini icon={<Layers size={16} />} label="Total cartes" value={stats.totalCards} color="text-cyan-400" />
          <StatMini icon={<Calendar size={16} />} label="À réviser" value={stats.dueCount} color="text-amber-400" />
          <StatMini icon={<CheckCircle2 size={16} />} label="Révisé aujourd'hui" value={stats.reviewedToday} color="text-emerald-400" />
          <StatMini icon={<Flame size={16} />} label="Facilité moy." value={stats.averageEase.toFixed(1)} color="text-violet-400" />
        </div>
      )}

      {/* Main content */}
      <AnimatePresence mode="wait">
        {mode === 'overview' && (
          <SpacedOverview key="overview" dueReviews={dueReviews} onStart={handleStartReview} />
        )}
        {mode === 'reviewing' && dueReviews[currentIndex] && (
          <SpacedReviewing
            key={`review-${currentIndex}`}
            card={dueReviews[currentIndex]}
            index={currentIndex}
            total={dueReviews.length}
            showContent={showContent}
            submitting={submitting}
            onReveal={() => setShowContent(true)}
            onRate={handleRate}
          />
        )}
        {mode === 'done' && (
          <SpacedDone key="done" reviewedCount={reviewedCount} onReset={handleReset} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Spaced sub-components ───

function StatMini({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3">
      <div className={`${color}`}>{icon}</div>
      <div>
        <p className="text-lg font-bold text-zinc-100">{value}</p>
        <p className="text-[11px] text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

function SpacedOverview({ dueReviews, onStart }: { dueReviews: DueReviewItem[]; onStart: () => void }) {
  if (dueReviews.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="p-5 bg-emerald-500/10 rounded-full">
          <CheckCircle2 size={40} className="text-emerald-400" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-100">Tout est à jour !</h2>
        <p className="text-sm text-zinc-500 text-center max-w-md">
          Aucun chapitre à réviser pour le moment. Reviens plus tard ou consulte tes fiches pour continuer à apprendre.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <Card className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="p-4 bg-cyan-500/10 rounded-full flex-shrink-0">
          <Brain size={32} className="text-cyan-400" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-lg font-semibold text-zinc-100">
            {dueReviews.length} chapitre{dueReviews.length > 1 ? 's' : ''} à réviser
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Les cartes sont triées par urgence. Évalue ta maîtrise après chaque fiche.
          </p>
        </div>
        <Button size="lg" icon={<ChevronRight size={18} />} onClick={onStart} className="flex-shrink-0">
          Commencer
        </Button>
      </Card>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-zinc-400 px-1">Chapitres en attente</h3>
        {dueReviews.map((item, idx) => (
          <motion.div
            key={item.chapter_id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-zinc-700 transition-colors"
          >
            <div className="p-2 bg-cyan-500/10 rounded-lg flex-shrink-0">
              <BookOpen size={16} className="text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">{item.chapter_title}</p>
              <p className="text-xs text-zinc-500 truncate">{item.course_title}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-zinc-500">
                {item.repetitions > 0 ? `${item.repetitions} révision${item.repetitions > 1 ? 's' : ''}` : 'Nouveau'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SpacedReviewing({ card, index, total, showContent, submitting, onReveal, onRate }: {
  card: DueReviewItem; index: number; total: number; showContent: boolean; submitting: boolean; onReveal: () => void; onRate: (q: number) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
      <div className="flex items-center gap-3">
        <p className="text-xs text-zinc-500 flex-shrink-0">{index + 1} / {total}</p>
        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" initial={{ width: `${(index / total) * 100}%` }} animate={{ width: `${((index + 1) / total) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg"><BookOpen size={16} className="text-cyan-400" /></div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-zinc-100 truncate">{card.chapter_title}</h2>
            <p className="text-xs text-zinc-500">{card.course_title}</p>
          </div>
          {card.repetitions > 0 && (
            <div className="flex items-center gap-1 text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md">
              <RotateCcw size={12} /><span>{card.repetitions}x</span>
            </div>
          )}
        </div>

        <div className="p-5">
          {card.summary_content ? (
            showContent ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="prose-revision max-h-[400px] overflow-y-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{card.summary_content}</ReactMarkdown>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center py-10 space-y-4">
                <div className="p-4 bg-zinc-800 rounded-full"><Brain size={28} className="text-zinc-500" /></div>
                <p className="text-sm text-zinc-400 text-center">Essaie de te rappeler le contenu de ce chapitre...</p>
                <Button variant="secondary" size="lg" onClick={onReveal}>Voir la fiche</Button>
              </div>
            )
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-zinc-500">Aucune fiche résumé disponible pour ce chapitre.</p>
            </div>
          )}
        </div>

        {(showContent || !card.summary_content) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="px-5 py-4 border-t border-zinc-800 bg-zinc-900/50">
            <p className="text-xs text-zinc-500 text-center mb-3">Comment as-tu maîtrisé ce chapitre ?</p>
            <div className="grid grid-cols-3 gap-3">
              {QUALITY_OPTIONS.map((opt) => (
                <button key={opt.quality} onClick={() => onRate(opt.quality)} disabled={submitting}
                  className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${opt.bgColor}`}>
                  <span className={`text-sm font-semibold ${opt.color}`}>{opt.label}</span>
                  <span className="text-[10px] text-zinc-500">{opt.sublabel}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function SpacedDone({ reviewedCount, onReset }: { reviewedCount: number; onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center py-16 space-y-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }} className="p-6 bg-emerald-500/10 rounded-full">
        <CheckCircle2 size={48} className="text-emerald-400" />
      </motion.div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-zinc-100">Session terminée !</h2>
        <p className="text-sm text-zinc-400">
          Tu as révisé <span className="text-cyan-400 font-semibold">{reviewedCount}</span> chapitre{reviewedCount > 1 ? 's' : ''}. Bravo !
        </p>
      </div>
      <Button variant="secondary" icon={<Clock size={16} />} onClick={onReset}>Retour</Button>
    </motion.div>
  );
}
