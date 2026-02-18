'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Loader2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

interface ChapterDetail {
  id: number;
  title: string;
  order_index: number;
  course: {
    id: number;
    title: string;
    color: string;
    subject: string;
  };
  resume: { id: number; content: string; created_at: string } | null;
  prevChapterId: number | null;
  nextChapterId: number | null;
}

export default function FicheDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = Number(params.chapterId);
  const { toast } = useToast();

  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchChapter = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/fiches/list`);
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();

      // Trouver le chapitre dans les cours
      let found: ChapterDetail | null = null;
      for (const course of data.courses) {
        const idx = course.chapters.findIndex(
          (ch: { id: number }) => ch.id === chapterId
        );
        if (idx !== -1) {
          const ch = course.chapters[idx];

          // Charger le contenu du resume si il existe
          let resumeData = null;
          if (ch.hasResume) {
            const rRes = await fetch(
              `/api/fiches/detail?chapterId=${chapterId}&type=resume`
            );
            if (rRes.ok) resumeData = await rRes.json();
          }

          found = {
            id: ch.id,
            title: ch.title,
            order_index: ch.order_index,
            course: {
              id: course.id,
              title: course.title,
              color: course.color,
              subject: course.subject,
            },
            resume: resumeData,
            prevChapterId:
              idx > 0 ? course.chapters[idx - 1].id : null,
            nextChapterId:
              idx < course.chapters.length - 1
                ? course.chapters[idx + 1].id
                : null,
          };
          break;
        }
      }

      if (!found) {
        toast('Chapitre introuvable.', 'error');
        router.push('/fiches');
        return;
      }

      setChapter(found);
    } catch (error) {
      console.error(error);
      toast('Impossible de charger la fiche.', 'error');
    } finally {
      setLoading(false);
    }
  }, [chapterId, router, toast]);

  useEffect(() => {
    if (chapterId) fetchChapter();
  }, [chapterId, fetchChapter]);

  async function handleGenerate() {
    if (generating) return;
    setGenerating(true);

    try {
      const res = await fetch('/api/fiches/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId, type: 'resume' }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur de generation');
      }

      toast('Fiche resume generee avec succes !', 'success');
      await fetchChapter();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      toast(message, 'error');
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse mb-6" />
        <div className="h-8 w-64 bg-zinc-800 rounded animate-pulse mb-4" />
        <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse mb-8" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-zinc-800 rounded animate-pulse"
              style={{ width: `${70 + Math.random() * 30}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!chapter) return null;

  return (
    <div className="animate-fade-in max-w-4xl">
      {/* Retour */}
      <Link
        href="/fiches"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Retour aux fiches
      </Link>

      {/* En-tete */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Badge color={chapter.course.color}>
            {chapter.course.subject || chapter.course.title}
          </Badge>
          <span className="text-xs text-zinc-500">
            Chapitre {chapter.order_index + 1}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">
          {chapter.title}
        </h1>
        <p className="text-sm text-zinc-500">{chapter.course.title}</p>
      </div>

      {/* Contenu resume */}
      {generating ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <Loader2 size={32} className="text-cyan-400 animate-spin mb-4" />
          <p className="text-zinc-400 text-sm">
            Generation du resume en cours...
          </p>
          <p className="text-zinc-600 text-xs mt-1">
            Cela peut prendre quelques secondes.
          </p>
        </Card>
      ) : chapter.resume ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-zinc-500">
              Genere le{' '}
              {new Date(chapter.resume.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerate}
              icon={<RefreshCw size={14} />}
              loading={generating}
            >
              Regenerer
            </Button>
          </div>
          <Card className="prose-revision">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {chapter.resume.content}
            </ReactMarkdown>
          </Card>
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
            <FileText size={28} className="text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-300 mb-2">
            Pas encore de resume
          </h3>
          <p className="text-sm text-zinc-500 mb-6 text-center max-w-sm">
            Generez une fiche resume pour ce chapitre. L&apos;IA va analyser le
            contenu et extraire les points essentiels.
          </p>
          <Button
            onClick={handleGenerate}
            icon={<Sparkles size={16} />}
            loading={generating}
          >
            Generer le resume
          </Button>
        </Card>
      )}

      {/* Navigation chapitre precedent / suivant */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-800">
        {chapter.prevChapterId ? (
          <Link
            href={`/fiches/${chapter.prevChapterId}`}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            <ChevronLeft size={16} />
            Chapitre precedent
          </Link>
        ) : (
          <div />
        )}
        {chapter.nextChapterId ? (
          <Link
            href={`/fiches/${chapter.nextChapterId}`}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            Chapitre suivant
            <ChevronRight size={16} />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
