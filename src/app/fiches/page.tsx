'use client';

import { useState, useEffect, useMemo } from 'react';
import { FileText, BookOpen, Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import SearchBar from '@/components/ui/SearchBar';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import FicheCard from '@/components/FicheCard';

const SUBJECT_ORDER = ['Analyse Quanti', 'Droit', 'Pilotage de la Performance', 'RH'];
const SUBJECT_COLORS: Record<string, string> = {
  'Analyse Quanti': '#06b6d4',
  'Droit': '#f59e0b',
  'Pilotage de la Performance': '#8b5cf6',
  'RH': '#10b981',
};
const SUBJECT_ICONS: Record<string, string> = {
  'Analyse Quanti': '📊',
  'Droit': '⚖️',
  'Pilotage de la Performance': '📈',
  'RH': '👥',
};

interface ChapterFiche {
  id: number;
  title: string;
  order_index: number;
  hasResume: boolean;
  hasMemo: boolean;
  resumeId: number | null;
  memoId: number | null;
}

interface CourseFiches {
  id: number;
  title: string;
  subject: string;
  color: string;
  tag: string;
  chapter_count: number;
  chapters: ChapterFiche[];
}

export default function FichesPage() {
  const [courses, setCourses] = useState<CourseFiches[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [collapsedSubjects, setCollapsedSubjects] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchFiches();
  }, []);

  async function fetchFiches() {
    try {
      setLoading(true);
      const res = await fetch('/api/fiches/list');
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      setCourses(data.courses);
    } catch (error) {
      console.error(error);
      toast('Impossible de charger les fiches.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(chapterId: number, type: 'resume' | 'memo') {
    const key = `${chapterId}-${type}`;
    if (generatingIds.has(key)) return;

    setGeneratingIds((prev) => new Set(prev).add(key));
    try {
      const res = await fetch('/api/fiches/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId, type }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur de generation');
      }

      toast(
        type === 'resume' ? 'Fiche resume generee !' : 'Flashcards generees !',
        'success'
      );
      await fetchFiches();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast(message, 'error');
    } finally {
      setGeneratingIds((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  }

  // Filter and group
  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.toLowerCase();
    return courses
      .map((course) => {
        const matchesCourse =
          course.title.toLowerCase().includes(q) ||
          course.subject.toLowerCase().includes(q);
        const matchedChapters = course.chapters.filter((ch) =>
          ch.title.toLowerCase().includes(q)
        );
        if (matchesCourse) return course;
        if (matchedChapters.length > 0) {
          return { ...course, chapters: matchedChapters };
        }
        return null;
      })
      .filter(Boolean) as CourseFiches[];
  }, [courses, search]);

  // Group by subject, only include courses that have at least 1 fiche
  const groupedBySubject = useMemo(() => {
    const groups: Record<string, CourseFiches[]> = {};

    for (const subject of SUBJECT_ORDER) {
      const subjectCourses = filteredCourses.filter(
        c => c.subject === subject && c.chapters.some(ch => ch.hasResume || ch.hasMemo)
      );
      if (subjectCourses.length > 0) {
        groups[subject] = subjectCourses;
      }
    }

    return groups;
  }, [filteredCourses]);

  const totalFiches = courses.reduce(
    (acc, c) =>
      acc +
      c.chapters.reduce(
        (a, ch) => a + (ch.hasResume ? 1 : 0) + (ch.hasMemo ? 1 : 0),
        0
      ),
    0
  );

  function toggleSubject(subject: string) {
    setCollapsedSubjects(prev => {
      const next = new Set(prev);
      if (next.has(subject)) next.delete(subject);
      else next.add(subject);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-80 bg-zinc-800 rounded-lg animate-pulse" />
        </div>
        <div className="grid gap-4">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Fiches de revision</h1>
        <p className="text-zinc-400 mb-8">
          Generez des fiches resume et flashcards pour vos cours.
        </p>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6">
            <BookOpen size={32} className="text-zinc-600" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-300 mb-2">
            Aucun cours importe
          </h2>
          <p className="text-zinc-500 mb-6 max-w-md">
            Importez d&apos;abord vos cours pour pouvoir generer des fiches de
            revision.
          </p>
          <Link href="/cours?import=true">
            <Button icon={<BookOpen size={16} />}>Importer des cours</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Fiches de revision</h1>
          <p className="text-zinc-400">
            {totalFiches} fiche{totalFiches !== 1 ? 's' : ''} · {Object.keys(groupedBySubject).length} matiere{Object.keys(groupedBySubject).length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <FileText size={16} className="text-cyan-400" />
          <span>{courses.length} cours</span>
        </div>
      </div>

      {/* Recherche */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Rechercher un cours, chapitre ou matiere..."
        className="mb-8 max-w-md"
      />

      {/* Grouped by subject */}
      <div className="space-y-10">
        {Object.entries(groupedBySubject).map(([subject, subjectCourses]) => {
          const isCollapsed = collapsedSubjects.has(subject);
          const color = SUBJECT_COLORS[subject] || '#71717a';
          const icon = SUBJECT_ICONS[subject] || '📚';
          const ficheCount = subjectCourses.reduce(
            (acc, c) => acc + c.chapters.reduce((a, ch) => a + (ch.hasResume ? 1 : 0) + (ch.hasMemo ? 1 : 0), 0),
            0
          );

          return (
            <div key={subject}>
              {/* Subject header */}
              <button
                onClick={() => toggleSubject(subject)}
                className="flex items-center gap-3 w-full text-left mb-4 group"
              >
                <span className="text-xl">{icon}</span>
                <h2 className="text-xl font-bold text-zinc-100">{subject}</h2>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {ficheCount} fiches
                </span>
                <div className="flex-1" />
                {isCollapsed ? (
                  <ChevronRight size={20} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                ) : (
                  <ChevronDown size={20} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                )}
              </button>

              {!isCollapsed && (
                <div className="space-y-8 pl-2 border-l-2 ml-2.5" style={{ borderColor: `${color}30` }}>
                  {subjectCourses.map((course) => (
                    <div key={course.id} className="pl-4">
                      {/* Course header */}
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-sm font-semibold text-zinc-300">
                          {course.title}
                        </h3>
                        <Badge color={course.color}>{course.tag || 'Cours'}</Badge>
                        <span className="text-xs text-zinc-500 ml-auto">
                          {course.chapters.filter(ch => ch.hasResume || ch.hasMemo).length}/{course.chapters.length} ch.
                        </span>
                      </div>

                      {/* Chapter fiches */}
                      <div className="grid gap-2">
                        {course.chapters.map((chapter) => (
                          <div key={chapter.id} className="flex items-center gap-3">
                            <div className="flex-1">
                              <FicheCard
                                chapterId={chapter.id}
                                chapterTitle={chapter.title}
                                orderIndex={chapter.order_index}
                                courseColor={course.color}
                                hasResume={chapter.hasResume}
                                hasMemo={chapter.hasMemo}
                              />
                            </div>
                            <div className="flex flex-col gap-1.5 flex-shrink-0">
                              {!chapter.hasResume && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  loading={generatingIds.has(`${chapter.id}-resume`)}
                                  onClick={() => handleGenerate(chapter.id, 'resume')}
                                  icon={<Sparkles size={14} />}
                                  title="Generer un resume"
                                >
                                  Resume
                                </Button>
                              )}
                              {!chapter.hasMemo && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  loading={generatingIds.has(`${chapter.id}-memo`)}
                                  onClick={() => handleGenerate(chapter.id, 'memo')}
                                  icon={<Sparkles size={14} />}
                                  title="Generer des flashcards"
                                >
                                  Memo
                                </Button>
                              )}
                              {chapter.hasResume && chapter.hasMemo && (
                                <span className="text-xs text-emerald-500 px-2">
                                  <Sparkles size={14} className="inline mr-1" />
                                  Complet
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {Object.keys(groupedBySubject).length === 0 && search && (
        <div className="text-center py-16 text-zinc-500">
          <p>Aucun resultat pour &quot;{search}&quot;</p>
        </div>
      )}
    </div>
  );
}
