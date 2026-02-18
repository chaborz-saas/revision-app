'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Brain, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import ChapterNav from '@/components/ChapterNav';
import type { Course, Chapter } from '@/lib/db';

function formatContentToMarkdown(content: string): string {
  let formatted = content;

  // Remove standalone slide numbers (lines that are just a number, e.g. "3", "12")
  formatted = formatted.replace(/^\d{1,3}\s*$/gm, '');

  // Remove PPT source citations (standalone Source: lines)
  formatted = formatted.replace(/^Source\s*:\s*.{10,200}$/gm, '');

  // Fix compressed text from PPT (e.g. "contrôledegestion" → keep as-is, it's display)
  // These are too numerous and varied to fix reliably with regex

  // Convert chapter-style headings
  formatted = formatted.replace(/^(Chapitre|CHAPITRE|Chapter)\s+(\d+|[IVXLC]+)\s*[:\-\u2013\u2014.]?\s*(.+)$/gm, '# $1 $2 \u2014 $3');

  // Convert numbered section headings (e.g. "1. Introduction au cours")
  formatted = formatted.replace(/^(\d+)\.\s+([A-Z\u00C0-\u00DC][\w\s\-\u2019'\u00e0-\u00ff]{3,80})$/gm, '## $1. $2');
  formatted = formatted.replace(/^(\d+[\.\-]\d+)\s+(.+)$/gm, '### $1 $2');
  formatted = formatted.replace(/^(\d+[\.\-]\d+[\.\-]\d+)\s+(.+)$/gm, '#### $1 $2');

  // Convert bullet points
  formatted = formatted.replace(/^[\u2022\u25CF\u25E6\u25AA\u25B8]\s*(.+)$/gm, '- $1');
  formatted = formatted.replace(/^[-\u2013\u2014]\s+(.+)$/gm, '- $1');

  // Bold keywords
  formatted = formatted.replace(/(D\u00e9finition|Th\u00e9or\u00e8me|Remarque|Exemple|Important|Note|Attention)\s*[:\uff1a]/gi, '**$1** :');

  // Remove excessive blank lines (4+ → 2)
  formatted = formatted.replace(/\n{4,}/g, '\n\n\n');

  // Remove lines that are just repeated headers from PPT slides
  // (e.g. lines that appear to be slide titles repeated verbatim)
  const lines = formatted.split('\n');
  const seen = new Set<string>();
  const filtered: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    // Only deduplicate lines that look like section headers (>30 chars, not bullet/list items)
    if (trimmed.length > 30 && !trimmed.startsWith('-') && !trimmed.startsWith('#') && !trimmed.startsWith('|') && !trimmed.startsWith('>')) {
      if (seen.has(trimmed)) continue;
      seen.add(trimmed);
    }
    filtered.push(line);
  }

  return filtered.join('\n');
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapter, setActiveChapter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/cours/${courseId}`);

        if (!res.ok) {
          if (res.status === 404) {
            setError('Ce cours n\'existe pas.');
          } else {
            setError('Impossible de charger le cours.');
          }
          return;
        }

        const data = await res.json();
        setCourse(data.course);
        setChapters(data.chapters);
      } catch {
        setError('Erreur de connexion au serveur.');
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId]);

  const formattedContent = useMemo(() => {
    if (chapters.length === 0) return '';
    const chapter = chapters[activeChapter];
    if (!chapter) return '';
    return formatContentToMarkdown(chapter.content);
  }, [chapters, activeChapter]);

  /* Markdown rendering is now handled by ReactMarkdown below */

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="animate-pulse bg-zinc-800 rounded-lg h-8 w-32" />
          <div className="animate-pulse bg-zinc-800 rounded-lg h-8 w-64" />
        </div>
        <div className="flex gap-6">
          <div className="w-72 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-zinc-800 rounded-lg h-10 w-full" />
            ))}
          </div>
          <div className="flex-1">
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <BookOpen size={48} className="text-zinc-600 mb-4" />
        <h2 className="text-xl font-semibold text-zinc-300 mb-2">
          {error || 'Cours introuvable'}
        </h2>
        <p className="text-zinc-500 mb-6">
          Ce cours n&apos;existe pas ou a ete supprime.
        </p>
        <Button variant="secondary" onClick={() => router.push('/cours')}>
          Retour aux cours
        </Button>
      </div>
    );
  }

  const currentChapter = chapters[activeChapter];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/cours')}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-100">{course.title}</h1>
              <Badge color={course.color}>{course.subject || 'Cours'}</Badge>
            </div>
            <p className="text-sm text-zinc-500 mt-1">
              {course.chapter_count} chapitre{course.chapter_count > 1 ? 's' : ''}{' '}
              {course.page_count > 0 && `- ${course.page_count} pages`}
            </p>
          </div>
        </div>
      </div>

      {/* Main content with sidebar */}
      <div className="flex gap-6">
        {/* Chapter navigation sidebar */}
        {chapters.length > 1 && (
          <div className="w-72 flex-shrink-0">
            <div className="sticky top-8">
              <Card className="p-3">
                <ChapterNav
                  chapters={chapters}
                  activeIndex={activeChapter}
                  onSelect={setActiveChapter}
                  accentColor={course.color}
                />
              </Card>
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {currentChapter && (
            <>
              {/* Chapter title + action buttons */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-200">
                  {currentChapter.title}
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<FileText size={14} />}
                    onClick={() => router.push(`/fiches?chapter=${currentChapter.id}`)}
                  >
                    Generer fiche
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Brain size={14} />}
                    onClick={() => router.push(`/quiz?chapter=${currentChapter.id}`)}
                  >
                    Quiz rapide
                  </Button>
                </div>
              </div>

              {/* Markdown content */}
              <Card>
                <div className="prose-revision">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {formattedContent}
                  </ReactMarkdown>
                </div>
              </Card>

              {/* Chapter navigation arrows */}
              {chapters.length > 1 && (
                <div className="flex justify-between mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={activeChapter === 0}
                    onClick={() => setActiveChapter(prev => prev - 1)}
                  >
                    Chapitre precedent
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={activeChapter === chapters.length - 1}
                    onClick={() => setActiveChapter(prev => prev + 1)}
                  >
                    Chapitre suivant
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
