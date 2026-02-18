import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();

    // Get all exercise/cas pratique documents grouped by subject
    const exercises = db.prepare(`
      SELECT
        c.id as course_id,
        c.title as course_title,
        c.subject,
        c.tag,
        c.color,
        ch.id as chapter_id,
        ch.title as chapter_title,
        ch.content as chapter_content,
        ch.order_index
      FROM courses c
      JOIN chapters ch ON ch.course_id = c.id
      WHERE c.tag IN ('Cas pratique', 'Exercice', 'Corrigé', 'Examen')
         OR c.title LIKE '%exercice%'
         OR c.title LIKE '%examen%'
         OR c.title LIKE '%CC %'
         OR c.title LIKE '%corrig%'
      ORDER BY c.subject, c.tag, c.id, ch.order_index
    `).all();

    // Group by subject → course
    const bySubject: Record<string, {
      subject: string;
      courses: {
        id: number;
        title: string;
        tag: string;
        color: string;
        chapters: {
          id: number;
          title: string;
          content: string;
          order_index: number;
        }[];
      }[];
    }> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const row of exercises as any[]) {
      if (!bySubject[row.subject]) {
        bySubject[row.subject] = { subject: row.subject, courses: [] };
      }

      const subjectGroup = bySubject[row.subject];
      let course = subjectGroup.courses.find(c => c.id === row.course_id);
      if (!course) {
        course = {
          id: row.course_id,
          title: row.course_title,
          tag: row.tag || 'Exercice',
          color: row.color,
          chapters: [],
        };
        subjectGroup.courses.push(course);
      }

      course.chapters.push({
        id: row.chapter_id,
        title: row.chapter_title,
        content: row.chapter_content || '',
        order_index: row.order_index,
      });
    }

    return NextResponse.json({
      subjects: Object.values(bySubject),
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: `Impossible de charger les exercices: ${errMsg}` },
      { status: 500 }
    );
  }
}
