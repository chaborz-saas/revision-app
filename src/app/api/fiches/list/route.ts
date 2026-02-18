import { NextResponse } from 'next/server';
import { getAllCourses, getChaptersByCourse, getSummaryByChapter } from '@/lib/db';

export async function GET() {
  try {
    const courses = getAllCourses();

    // Track seen content to deduplicate copies across chapters
    const seenResumeContent = new Set<string>();
    const seenMemoContent = new Set<string>();

    const coursesWithFiches = courses.map((course) => {
      const chapters = getChaptersByCourse(course.id);

      const chaptersWithFiches = chapters.map((chapter) => {
        const resume = getSummaryByChapter(chapter.id, 'resume');
        const memo = getSummaryByChapter(chapter.id, 'memo');

        // Deduplicate resumes
        let isDuplicateResume = false;
        if (resume) {
          const contentKey = resume.content.trim().slice(0, 200);
          if (seenResumeContent.has(contentKey)) {
            isDuplicateResume = true;
          } else {
            seenResumeContent.add(contentKey);
          }
        }

        // Deduplicate memos (flashcards)
        let isDuplicateMemo = false;
        if (memo) {
          const memoKey = memo.content.trim().slice(0, 200);
          if (seenMemoContent.has(memoKey)) {
            isDuplicateMemo = true;
          } else {
            seenMemoContent.add(memoKey);
          }
        }

        return {
          id: chapter.id,
          title: chapter.title,
          order_index: chapter.order_index,
          hasResume: !!resume && !isDuplicateResume,
          hasMemo: !!memo && !isDuplicateMemo,
          resumeId: (!isDuplicateResume && resume?.id) ?? null,
          memoId: (!isDuplicateMemo && memo?.id) ?? null,
        };
      });

      return {
        id: course.id,
        title: course.title,
        subject: course.subject,
        color: course.color,
        tag: course.tag || 'Cours',
        chapter_count: course.chapter_count,
        chapters: chaptersWithFiches,
      };
    });

    return NextResponse.json({ courses: coursesWithFiches });
  } catch (error) {
    console.error('Erreur lors du chargement des fiches:', error);
    return NextResponse.json(
      { error: 'Impossible de charger les fiches. Réessayez.' },
      { status: 500 }
    );
  }
}
