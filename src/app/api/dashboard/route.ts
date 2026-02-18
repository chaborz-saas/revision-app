import { NextResponse } from 'next/server';
import {
  getStats,
  getAllAttempts,
  getAllMastery,
  getAllCourses,
  getAllQuizzes,
  getChaptersByCourse,
} from '@/lib/db';
import type { Course, Chapter, Quiz, QuizAttempt, Mastery } from '@/lib/db';

export interface DashboardData {
  stats: {
    courseCount: number;
    chapterCount: number;
    quizCount: number;
    attemptCount: number;
    ficheCount: number;
    avgScore: number;
  };
  scoreHistory: {
    date: string;
    score: number;
    quizTitle: string;
  }[];
  masteryData: {
    courseId: number;
    courseTitle: string;
    courseColor: string;
    chapters: {
      chapterId: number;
      chapterTitle: string;
      score: number;
      attempts: number;
    }[];
  }[];
  weakPoints: {
    chapterId: number;
    chapterTitle: string;
    courseTitle: string;
    courseId: number;
    score: number;
  }[];
  recentActivity: {
    attemptId: number;
    quizTitle: string;
    score: number;
    total: number;
    percentage: number;
    date: string;
  }[];
}

export async function GET() {
  try {
    const stats = getStats();
    const attempts = getAllAttempts();
    const mastery = getAllMastery();
    const courses = getAllCourses();
    const quizzes = getAllQuizzes();

    const quizMap = new Map<number, Quiz>();
    for (const q of quizzes) {
      quizMap.set(q.id, q);
    }

    // Score history: all attempts with quiz info, sorted by date ascending
    const scoreHistory = attempts
      .map((a: QuizAttempt) => {
        const quiz = quizMap.get(a.quiz_id);
        return {
          date: a.created_at,
          score: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
          quizTitle: quiz?.title ?? 'Quiz inconnu',
        };
      })
      .reverse();

    // Build mastery map grouped by course
    const courseMap = new Map<number, Course>();
    const courseChapters = new Map<number, Chapter[]>();
    for (const c of courses) {
      courseMap.set(c.id, c);
      try {
        const chapters = getChaptersByCourse(c.id);
        courseChapters.set(c.id, chapters);
      } catch {
        courseChapters.set(c.id, []);
      }
    }

    const masteryMap = new Map<number, Mastery>();
    for (const m of mastery) {
      masteryMap.set(m.chapter_id, m);
    }

    const masteryData: DashboardData['masteryData'] = [];
    const allChapterScores: {
      chapterId: number;
      chapterTitle: string;
      courseTitle: string;
      courseId: number;
      score: number;
    }[] = [];

    for (const course of courses) {
      const chapters = courseChapters.get(course.id) ?? [];
      const chapterEntries = chapters.map((ch: Chapter) => {
        const m = masteryMap.get(ch.id);
        const score = m ? Math.round(m.score) : 0;
        allChapterScores.push({
          chapterId: ch.id,
          chapterTitle: ch.title,
          courseTitle: course.title,
          courseId: course.id,
          score,
        });
        return {
          chapterId: ch.id,
          chapterTitle: ch.title,
          score,
          attempts: m?.attempts ?? 0,
        };
      });

      if (chapterEntries.length > 0) {
        masteryData.push({
          courseId: course.id,
          courseTitle: course.title,
          courseColor: course.color,
          chapters: chapterEntries,
        });
      }
    }

    // Top 5 weak points: chapters with lowest score (only those that have been attempted or exist)
    const weakPoints = allChapterScores
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);

    // Recent activity: last 5 attempts
    const recentActivity = attempts.slice(0, 5).map((a: QuizAttempt) => {
      const quiz = quizMap.get(a.quiz_id);
      return {
        attemptId: a.id,
        quizTitle: quiz?.title ?? 'Quiz inconnu',
        score: a.score,
        total: a.total,
        percentage: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
        date: a.created_at,
      };
    });

    const data: DashboardData = {
      stats,
      scoreHistory,
      masteryData,
      weakPoints,
      recentActivity,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement du dashboard' },
      { status: 500 }
    );
  }
}
