import { NextRequest, NextResponse } from 'next/server';
import { getChatMessages } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId requis' },
        { status: 400 }
      );
    }

    const messages = getChatMessages(sessionId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Erreur chargement historique:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement de l\'historique' },
      { status: 500 }
    );
  }
}
