import { NextRequest, NextResponse } from 'next/server';
import { getSummaryByChapter } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = Number(searchParams.get('chapterId'));
    const type = searchParams.get('type') as 'resume' | 'memo';

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

    const summary = getSummaryByChapter(chapterId, type);
    if (!summary) {
      return NextResponse.json(
        { error: 'Fiche introuvable.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: summary.id,
      content: summary.content,
      created_at: summary.created_at,
    });
  } catch (error) {
    console.error('Erreur lors du chargement de la fiche:', error);
    return NextResponse.json(
      { error: 'Impossible de charger la fiche.' },
      { status: 500 }
    );
  }
}
