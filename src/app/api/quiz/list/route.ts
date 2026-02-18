import { NextResponse } from 'next/server';
import { getAllQuizzes } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const quizzes = getAllQuizzes();
    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error('GET /api/quiz/list error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
