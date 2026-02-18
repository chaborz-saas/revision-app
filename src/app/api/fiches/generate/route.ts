import { NextRequest, NextResponse } from 'next/server';
import { getChapter, getSummaryByChapter, deleteSummary, insertSummary } from '@/lib/db';
import { generateSummary } from '@/lib/claude';
import { generateOfflineResume, generateOfflineMemo } from '@/lib/offline-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chapterId, type, forceOffline } = body as { chapterId: number; type: 'resume' | 'memo'; forceOffline?: boolean };

    if (!chapterId || !type) {
      return NextResponse.json(
        { error: 'chapterId et type sont requis.' },
        { status: 400 }
      );
    }

    if (type !== 'resume' && type !== 'memo') {
      return NextResponse.json(
        { error: 'Le type doit être "resume" ou "memo".' },
        { status: 400 }
      );
    }

    const chapter = getChapter(chapterId);
    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapitre introuvable.' },
        { status: 404 }
      );
    }

    if (!chapter.content || chapter.content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Ce chapitre ne contient pas de contenu à résumer.' },
        { status: 400 }
      );
    }

    // Si une fiche du meme type existe deja, la supprimer (regeneration)
    const existing = getSummaryByChapter(chapterId, type);
    if (existing) {
      deleteSummary(existing.id);
    }

    let content: string;
    let mode: 'ai' | 'offline' = 'ai';

    if (forceOffline) {
      // Mode offline forcé
      content = type === 'resume'
        ? generateOfflineResume(chapter.content, chapter.title)
        : generateOfflineMemo(chapter.content, chapter.title);
      mode = 'offline';
    } else {
      // Essayer l'API Claude d'abord, fallback offline
      try {
        content = await generateSummary(chapter.content, chapter.title, type);
      } catch (apiError: unknown) {
        console.warn(`API Claude indisponible pour chapitre ${chapterId}, fallback offline:`,
          apiError instanceof Error ? apiError.message : String(apiError));
        content = type === 'resume'
          ? generateOfflineResume(chapter.content, chapter.title)
          : generateOfflineMemo(chapter.content, chapter.title);
        mode = 'offline';
      }
    }

    // Stocker en DB
    const result = insertSummary({
      chapter_id: chapterId,
      type,
      content,
    });

    return NextResponse.json({
      id: result.lastInsertRowid,
      chapter_id: chapterId,
      type,
      content,
      mode,
    });
  } catch (error) {
    console.error('Erreur lors de la generation de fiche:', error);
    return NextResponse.json(
      { error: 'La generation de la fiche a echoue.' },
      { status: 500 }
    );
  }
}
