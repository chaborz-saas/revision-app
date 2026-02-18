'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { BookOpen, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/ui/SearchBar';
import { CardSkeleton } from '@/components/ui/Skeleton';
import CourseCard from '@/components/CourseCard';
import ImportButton from '@/components/ImportButton';
import type { Course } from '@/lib/db';

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
const TAG_ORDER = ['Cours', 'Exercice', 'Cas pratique', 'Examen', 'Corrigé', 'Ressource'];

export default function CoursPage() {
  return (
    <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}</div>}>
      <CoursPageInner />
    </Suspense>
  );
}

function CoursPageInner() {
  const searchParams = useSearchParams();
  const shouldAutoImport = searchParams.get('import') === 'true';

  const [courses, setCourses] = useState<(Course & { tag?: string })[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [collapsedSubjects, setCollapsedSubjects] = useState<Set<string>>(new Set());

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cours');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch {
      // Silently handle fetch errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (shouldAutoImport) {
      setShowImport(true);
    }
  }, [shouldAutoImport]);

  const handleImportComplete = useCallback(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Filter courses by search
  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.toLowerCase();
    return courses.filter(
      c =>
        c.title.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        (c.tag && c.tag.toLowerCase().includes(q))
    );
  }, [courses, search]);

  // Group by subject → tag
  const groupedBySubject = useMemo(() => {
    const groups: Record<string, Record<string, (Course & { tag?: string })[]>> = {};

    for (const subject of SUBJECT_ORDER) {
      const subjectCourses = filteredCourses.filter(c => c.subject === subject);
      if (subjectCourses.length === 0) continue;

      groups[subject] = {};
      for (const tag of TAG_ORDER) {
        const tagCourses = subjectCourses.filter(c => (c.tag || 'Cours') === tag);
        if (tagCourses.length > 0) {
          groups[subject][tag] = tagCourses;
        }
      }
      // Any courses with unknown tags
      const knownTags = new Set(TAG_ORDER);
      const otherCourses = subjectCourses.filter(c => !knownTags.has(c.tag || 'Cours'));
      if (otherCourses.length > 0) {
        groups[subject]['Autre'] = otherCourses;
      }
    }

    // Any courses not in known subjects
    const knownSubjects = new Set(SUBJECT_ORDER);
    const otherSubjectCourses = filteredCourses.filter(c => !knownSubjects.has(c.subject));
    if (otherSubjectCourses.length > 0) {
      groups['Autre'] = { 'Cours': otherSubjectCourses };
    }

    return groups;
  }, [filteredCourses]);

  function toggleSubject(subject: string) {
    setCollapsedSubjects(prev => {
      const next = new Set(prev);
      if (next.has(subject)) {
        next.delete(subject);
      } else {
        next.add(subject);
      }
      return next;
    });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Mes Cours</h1>
          <p className="text-zinc-400 mt-1">
            {courses.length > 0
              ? `${courses.length} cours · ${SUBJECT_ORDER.filter(s => filteredCourses.some(c => c.subject === s)).length} matières`
              : 'Importe tes premiers cours pour commencer'}
          </p>
        </div>
        {courses.length > 0 && !showImport && (
          <ImportButton onComplete={handleImportComplete} />
        )}
      </div>

      {showImport && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <ImportButton onComplete={handleImportComplete} />
        </div>
      )}

      {courses.length > 0 && (
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Rechercher par titre, matière ou type (cours, exercice, cas pratique...)"
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : Object.keys(groupedBySubject).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedBySubject).map(([subject, tagGroups]) => {
            const isCollapsed = collapsedSubjects.has(subject);
            const color = SUBJECT_COLORS[subject] || '#71717a';
            const icon = SUBJECT_ICONS[subject] || '📚';
            const courseCount = Object.values(tagGroups).reduce((a, b) => a + b.length, 0);

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
                    {courseCount} cours
                  </span>
                  <div className="flex-1" />
                  {isCollapsed ? (
                    <ChevronRight size={20} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                  ) : (
                    <ChevronDown size={20} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                  )}
                </button>

                {!isCollapsed && (
                  <div className="space-y-6 pl-2 border-l-2 ml-2.5" style={{ borderColor: `${color}30` }}>
                    {Object.entries(tagGroups).map(([tag, tagCourses]) => (
                      <div key={tag} className="pl-4">
                        {/* Tag sub-header */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            {tag}
                          </span>
                          <div className="flex-1 h-px bg-zinc-800" />
                          <span className="text-xs text-zinc-600">{tagCourses.length}</span>
                        </div>

                        {/* Course cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {tagCourses.map(course => (
                            <CourseCard key={course.id} course={course} />
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
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6">
            <FolderOpen size={36} className="text-zinc-600" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-300 mb-2">
            Aucun cours importe
          </h2>
          <p className="text-zinc-500 mb-6 max-w-md">
            Place tes fichiers PDF dans le dossier <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-cyan-400 text-sm">cours/</code> a la racine du projet, puis clique sur le bouton ci-dessous pour les importer.
          </p>
          <ImportButton onComplete={handleImportComplete} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen size={36} className="text-zinc-600 mb-4" />
          <h2 className="text-lg font-semibold text-zinc-400 mb-1">
            Aucun resultat
          </h2>
          <p className="text-zinc-500 text-sm">
            Aucun cours ne correspond a &quot;{search}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
