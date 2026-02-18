import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCourses,
  getCourse,
  getChapter,
  getChaptersByCourse,
  insertQuiz,
  insertQuestion,
} from '@/lib/db';
import { generateQuiz } from '@/lib/claude';
import { generateOfflineQuiz } from '@/lib/offline-quiz';

export async function GET(req: NextRequest) {
  try {
    const courseId = req.nextUrl.searchParams.get('courseId');

    if (courseId) {
      const chapters = getChaptersByCourse(Number(courseId));
      return NextResponse.json({ chapters });
    }

    const courses = getAllCourses();
    return NextResponse.json({ courses });
  } catch (err) {
    console.error('GET /api/quiz/generate error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      courseId,
      chapterId,
      chapterIds,
      difficulty = 'moyen',
      questionCount = 10,
      types = ['qcm'],
      mode = 'rapide',
    } = body;

    let content = '';
    let title = 'Quiz';
    let resolvedCourseId: number | null = courseId ?? null;
    let resolvedChapterId: number | null = chapterId ?? null;

    if (chapterIds && chapterIds.length > 0) {
      const chapterContents: string[] = [];
      const chapterTitles: string[] = [];
      for (const cid of chapterIds) {
        const chapter = getChapter(Number(cid));
        if (chapter) {
          chapterContents.push(chapter.content);
          chapterTitles.push(chapter.title);
          if (!resolvedCourseId) resolvedCourseId = chapter.course_id;
        }
      }
      content = chapterContents.join('\n\n---\n\n');
      title = `Quiz - ${chapterTitles.join(', ')}`;
      if (chapterIds.length === 1) {
        resolvedChapterId = chapterIds[0];
      }
    } else if (chapterId) {
      const chapter = getChapter(Number(chapterId));
      if (!chapter) {
        return NextResponse.json({ error: 'Chapitre non trouve' }, { status: 404 });
      }
      content = chapter.content;
      title = `Quiz - ${chapter.title}`;
      resolvedCourseId = chapter.course_id;
      resolvedChapterId = chapter.id;
    } else if (courseId) {
      const course = getCourse(Number(courseId));
      if (!course) {
        return NextResponse.json({ error: 'Cours non trouve' }, { status: 404 });
      }
      const chapters = getChaptersByCourse(course.id);
      if (chapters.length > 0) {
        content = chapters.map(ch => ch.content).join('\n\n---\n\n');
      } else {
        content = course.content;
      }
      title = `Quiz - ${course.title}`;
      resolvedCourseId = course.id;
    } else {
      return NextResponse.json({ error: 'Aucun cours ou chapitre specifie' }, { status: 400 });
    }

    if (!content || content.trim().length < 50) {
      return NextResponse.json({ error: 'Contenu insuffisant pour generer un quiz' }, { status: 400 });
    }

    // Essayer d'abord l'API Claude, puis fallback sur le générateur offline
    let result: { questions: { type: 'qcm' | 'vrai_faux' | 'reponse_courte'; question: string; options: string[]; correct_answer: string; explanation: string }[] };
    let usedOffline = false;

    try {
      result = await generateQuiz(content, difficulty, questionCount, types);
      if (!result.questions || result.questions.length === 0) {
        throw new Error('API Claude: aucune question générée');
      }
    } catch (apiError) {
      console.warn('API Claude indisponible, fallback sur le générateur offline:', apiError instanceof Error ? apiError.message : apiError);
      result = generateOfflineQuiz(content, difficulty, questionCount, types);
      usedOffline = true;
    }

    if (!result.questions || result.questions.length === 0) {
      return NextResponse.json({ error: 'Aucune question generee' }, { status: 500 });
    }

    if (usedOffline) {
      console.info(`Quiz généré en mode offline: ${result.questions.length} questions`);
    }

    const timeLimit = mode === 'examen' ? questionCount * 90 : 0;

    const quizResult = insertQuiz({
      title,
      course_id: resolvedCourseId,
      chapter_id: resolvedChapterId,
      difficulty,
      question_count: result.questions.length,
      mode,
      time_limit: timeLimit,
    });

    const quizId = Number(quizResult.lastInsertRowid);

    for (const q of result.questions) {
      insertQuestion({
        quiz_id: quizId,
        type: q.type,
        question: q.question,
        options_json: JSON.stringify(q.options || []),
        correct_answer: q.correct_answer,
        explanation: q.explanation || '',
      });
    }

    return NextResponse.json({
      quizId,
      title,
      questionCount: result.questions.length,
      mode,
      difficulty,
    });
  } catch (err) {
    console.error('POST /api/quiz/generate error:', err);
    return NextResponse.json({ error: 'Erreur lors de la generation du quiz' }, { status: 500 });
  }
}
