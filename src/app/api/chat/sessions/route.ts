import { NextResponse } from 'next/server';
import { getChatSessions } from '@/lib/db';

export async function GET() {
  try {
    const sessions = getChatSessions();
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Erreur chargement sessions:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des sessions' },
      { status: 500 }
    );
  }
}
