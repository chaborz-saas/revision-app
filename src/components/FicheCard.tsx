'use client';

import Link from 'next/link';
import { FileText, CheckCircle, Circle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface FicheCardProps {
  chapterId: number;
  chapterTitle: string;
  orderIndex: number;
  courseColor: string;
  hasResume: boolean;
  hasMemo: boolean;
}

export default function FicheCard({
  chapterId,
  chapterTitle,
  orderIndex,
  courseColor,
  hasResume,
  hasMemo,
}: FicheCardProps) {
  const ficheCount = (hasResume ? 1 : 0) + (hasMemo ? 1 : 0);

  return (
    <Link href={`/fiches/${chapterId}`}>
      <Card hover accentColor={courseColor} className="group relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${courseColor}20` }}
          >
            <FileText size={20} style={{ color: courseColor }} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-zinc-500 mb-1">Chapitre {orderIndex + 1}</p>
            <h3 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-cyan-400 transition-colors">
              {chapterTitle}
            </h3>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5">
                {hasResume ? (
                  <CheckCircle size={14} className="text-emerald-400" />
                ) : (
                  <Circle size={14} className="text-zinc-600" />
                )}
                <Badge
                  color={hasResume ? '#10b981' : undefined}
                  className={!hasResume ? 'bg-zinc-800 text-zinc-500' : ''}
                >
                  Resume
                </Badge>
              </div>

              <div className="flex items-center gap-1.5">
                {hasMemo ? (
                  <CheckCircle size={14} className="text-cyan-400" />
                ) : (
                  <Circle size={14} className="text-zinc-600" />
                )}
                <Badge
                  color={hasMemo ? '#06b6d4' : undefined}
                  className={!hasMemo ? 'bg-zinc-800 text-zinc-500' : ''}
                >
                  Flashcards
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            {ficheCount === 2 ? (
              <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                Complet
              </span>
            ) : ficheCount === 1 ? (
              <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">
                1/2
              </span>
            ) : (
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">
                Vide
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
