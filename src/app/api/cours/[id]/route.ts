import { NextRequest, NextResponse } from 'next/server';
import { getCourse, getChaptersByCourse } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de cours invalide.' },
        { status: 400 }
      );
    }

    const course = getCourse(id);

    if (!course) {
      return NextResponse.json(
        { error: 'Cours introuvable.' },
        { status: 404 }
      );
    }

    const chapters = getChaptersByCourse(id);

    return NextResponse.json({ course, chapters });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: `Impossible de charger le cours: ${errMsg}` },
      { status: 500 }
    );
  }
}
