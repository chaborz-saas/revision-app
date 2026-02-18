import { NextRequest, NextResponse } from 'next/server';
import {
  getDueReviews,
  getAllSpacedReviews,
  upsertSpacedReview,
  initSpacedReviewForAll,
  getSummaryByChapter,
} from '@/lib/db';

export interface DueReviewItem {
  id: number;
  chapter_id: number;
  chapter_title: string;
  course_id: number;
  course_title: string;
  next_review: string;
  interval_days: number;
  ease_factor: number;
  repetitions: number;
  last_reviewed: string | null;
  summary_content: string | null;
}

export interface SpacedReviewStats {
  totalCards: number;
  dueCount: number;
  reviewedToday: number;
  averageEase: number;
}

export interface SpacedReviewResponse {
  dueReviews: DueReviewItem[];
  stats: SpacedReviewStats;
}

export async function GET() {
  try {
    // Initialize reviews for all chapters that don't have one yet
    initSpacedReviewForAll();

    const dueReviews = getDueReviews();
    const allReviews = getAllSpacedReviews();

    // Enrich with summary content
    const enrichedDue: DueReviewItem[] = dueReviews.map((r) => {
      const summary = getSummaryByChapter(r.chapter_id, 'resume');
      return {
        id: r.id,
        chapter_id: r.chapter_id,
        chapter_title: r.chapter_title,
        course_id: r.course_id,
        course_title: r.course_title,
        next_review: r.next_review,
        interval_days: r.interval_days,
        ease_factor: r.ease_factor,
        repetitions: r.repetitions,
        last_reviewed: r.last_reviewed,
        summary_content: summary?.content ?? null,
      };
    });

    // Stats
    const today = new Date().toISOString().substring(0, 10);
    const reviewedToday = allReviews.filter(
      (r) => r.last_reviewed && r.last_reviewed.substring(0, 10) === today
    ).length;

    const totalEase = allReviews.reduce((sum, r) => sum + r.ease_factor, 0);
    const averageEase = allReviews.length > 0 ? Math.round((totalEase / allReviews.length) * 100) / 100 : 2.5;

    const stats: SpacedReviewStats = {
      totalCards: allReviews.length,
      dueCount: enrichedDue.length,
      reviewedToday,
      averageEase,
    };

    return NextResponse.json({ dueReviews: enrichedDue, stats } as SpacedReviewResponse);
  } catch (error) {
    console.error('Spaced review GET error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du chargement des revisions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chapterId, quality } = body as { chapterId: number; quality: number };

    if (!chapterId || quality === undefined || quality < 0 || quality > 5) {
      return NextResponse.json(
        { error: 'chapterId et quality (0-5) requis' },
        { status: 400 }
      );
    }

    const result = upsertSpacedReview(chapterId, quality);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Spaced review POST error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise a jour' },
      { status: 500 }
    );
  }
}
