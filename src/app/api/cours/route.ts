import { NextRequest, NextResponse } from 'next/server';
import { getAllCourses, searchCourses } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    const courses = query ? searchCourses(query) : getAllCourses();

    return NextResponse.json(courses);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: `Impossible de charger les cours: ${errMsg}` },
      { status: 500 }
    );
  }
}
