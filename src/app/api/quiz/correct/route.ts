import { NextRequest, NextResponse } from 'next/server';
import {
  getQuiz,
  getQuestionsByQuiz,
  insertAttempt,
  upsertMastery,
  getChaptersByCourse,
  getChapter,
  getAllAttempts,
  getAttemptsByQuiz,
  getAllMastery,
  getAllQuizzes,
} from '@/lib/db';
import { correctAnswer as correctAnswerAI } from '@/lib/claude';

interface AnswerPayload {
  questionId: number;
  answer: string;
}

export async function GET(req: NextRequest) {
  try {
    const quizIdParam = req.nextUrl.searchParams.get('quizId');
    const recentParam = req.nextUrl.searchParams.get('recent');
    const masteryParam = req.nextUrl.searchParams.get('mastery');
    const resultsParam = req.nextUrl.searchParams.get('results');

    // Fetch quiz + questions for the quiz session page
    if (quizIdParam) {
      const quizId = Number(quizIdParam);
      const quiz = getQuiz(quizId);
      if (!quiz) {
        return NextResponse.json({ error: 'Quiz non trouve' }, { status: 404 });
      }
      const questions = getQuestionsByQuiz(quizId);
      return NextResponse.json({ quiz, questions });
    }

    // Fetch results for a completed quiz
    if (resultsParam) {
      const quizId = Number(resultsParam);
      const quiz = getQuiz(quizId);
      if (!quiz) {
        return NextResponse.json({ error: 'Quiz non trouve' }, { status: 404 });
      }
      const attempts = getAttemptsByQuiz(quizId);
      if (attempts.length === 0) {
        return NextResponse.json({ error: 'Aucun resultat trouve' }, { status: 404 });
      }

      const latestAttempt = attempts[0];
      const questions = getQuestionsByQuiz(quizId);
      let answersData: { questionId: number; answer: string; isCorrect: boolean }[] = [];
      try {
        answersData = JSON.parse(latestAttempt.answers_json);
      } catch {
        answersData = [];
      }

      const results = questions.map(q => {
        const answerRecord = answersData.find(a => a.questionId === q.id);
        return {
          id: q.id,
          question: q.question,
          type: q.type,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          userAnswer: answerRecord?.answer || '',
          isCorrect: answerRecord?.isCorrect ?? false,
        };
      });

      let chapterScores: { chapterTitle: string; score: number; total: number }[] = [];
      if (quiz.mode === 'examen' && quiz.course_id) {
        const chapters = getChaptersByCourse(quiz.course_id);
        if (chapters.length > 0) {
          const scorePerChapter = Math.round(latestAttempt.score / chapters.length);
          const totalPerChapter = Math.round(latestAttempt.total / chapters.length);
          chapterScores = chapters.map(ch => ({
            chapterTitle: ch.title,
            score: scorePerChapter,
            total: totalPerChapter,
          }));
        }
      }

      return NextResponse.json({
        score: latestAttempt.score,
        total: latestAttempt.total,
        percentage: latestAttempt.total > 0 ? Math.round((latestAttempt.score / latestAttempt.total) * 100) : 0,
        timeSpent: latestAttempt.time_spent,
        mode: quiz.mode,
        quizTitle: quiz.title,
        results,
        chapterScores,
      });
    }

    // Fetch recent attempts
    if (recentParam) {
      const allAttempts = getAllAttempts();
      const allQuizzes = getAllQuizzes();
      const quizMap = new Map(allQuizzes.map(q => [q.id, q]));

      const attempts = allAttempts.slice(0, 10).map(a => ({
        id: a.id,
        quiz_id: a.quiz_id,
        score: a.score,
        total: a.total,
        time_spent: a.time_spent,
        created_at: a.created_at,
        quiz_title: quizMap.get(a.quiz_id)?.title || `Quiz #${a.quiz_id}`,
      }));

      return NextResponse.json({ attempts });
    }

    // Fetch mastery data with chapter titles
    if (masteryParam) {
      const allMastery = getAllMastery();
      const masteryWithTitles = allMastery.map(m => {
        const chapter = getChapter(m.chapter_id);
        return {
          ...m,
          chapter_title: chapter?.title || `Chapitre ${m.chapter_id}`,
        };
      });
      return NextResponse.json({ mastery: masteryWithTitles });
    }

    return NextResponse.json({ error: 'Parametre manquant' }, { status: 400 });
  } catch (err) {
    console.error('GET /api/quiz/correct error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizId, answers, timeSpent = 0 } = body as {
      quizId: number;
      answers: AnswerPayload[];
      timeSpent?: number;
    };

    if (!quizId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Donnees invalides' }, { status: 400 });
    }

    const quiz = getQuiz(quizId);
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz non trouve' }, { status: 404 });
    }

    const questions = getQuestionsByQuiz(quizId);
    if (questions.length === 0) {
      return NextResponse.json({ error: 'Aucune question trouvee' }, { status: 404 });
    }

    let score = 0;
    const detailedResults: {
      questionId: number;
      question: string;
      type: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      explanation: string;
      aiCorrection?: string;
    }[] = [];

    for (const question of questions) {
      const userAnswerObj = answers.find(a => a.questionId === question.id);
      const userAnswer = userAnswerObj?.answer?.trim() || '';
      let isCorrect = false;
      let aiCorrection: string | undefined;

      if (question.type === 'reponse_courte') {
        if (userAnswer.toLowerCase() === question.correct_answer.toLowerCase()) {
          isCorrect = true;
        } else if (userAnswer.length > 0) {
          try {
            const correction = await correctAnswerAI(
              question.question,
              userAnswer,
              question.correct_answer
            );
            aiCorrection = correction;
            const lowerCorrection = correction.toLowerCase();
            isCorrect =
              lowerCorrection.includes('correct') &&
              !lowerCorrection.includes('incorrect') &&
              !lowerCorrection.includes('pas correct') &&
              !lowerCorrection.includes('n\'est pas correct');
          } catch (err) {
            console.error('Erreur correction IA:', err);
            isCorrect = false;
          }
        }
      } else {
        isCorrect = userAnswer.toLowerCase() === question.correct_answer.toLowerCase();
      }

      if (isCorrect) score++;

      detailedResults.push({
        questionId: question.id,
        question: question.question,
        type: question.type,
        userAnswer,
        correctAnswer: question.correct_answer,
        isCorrect,
        explanation: question.explanation,
        aiCorrection,
      });
    }

    const answersJson = JSON.stringify(
      detailedResults.map(r => ({
        questionId: r.questionId,
        answer: r.userAnswer,
        isCorrect: r.isCorrect,
      }))
    );

    insertAttempt({
      quiz_id: quizId,
      score,
      total: questions.length,
      answers_json: answersJson,
      time_spent: timeSpent,
    });

    const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;

    if (quiz.chapter_id) {
      upsertMastery(quiz.chapter_id, percentage);
    } else if (quiz.course_id) {
      const chapters = getChaptersByCourse(quiz.course_id);
      for (const chapter of chapters) {
        upsertMastery(chapter.id, percentage);
      }
    }

    let chapterScores: { chapterTitle: string; score: number; total: number }[] = [];
    if (quiz.mode === 'examen' && quiz.course_id) {
      const chapters = getChaptersByCourse(quiz.course_id);
      const questionChapterMap: Record<number, { chapterTitle: string; score: number; total: number }> = {};

      for (const chapter of chapters) {
        questionChapterMap[chapter.id] = {
          chapterTitle: chapter.title,
          score: 0,
          total: 0,
        };
      }

      for (const result of detailedResults) {
        if (quiz.chapter_id) {
          const entry = questionChapterMap[quiz.chapter_id];
          if (entry) {
            entry.total++;
            if (result.isCorrect) entry.score++;
          }
        } else {
          const keys = Object.keys(questionChapterMap);
          if (keys.length > 0) {
            const entry = questionChapterMap[Number(keys[0])];
            entry.total++;
            if (result.isCorrect) entry.score++;
          }
        }
      }

      chapterScores = Object.values(questionChapterMap).filter(cs => cs.total > 0);
    }

    return NextResponse.json({
      quizId,
      score,
      total: questions.length,
      percentage: Math.round(percentage),
      timeSpent,
      results: detailedResults,
      chapterScores,
    });
  } catch (err) {
    console.error('POST /api/quiz/correct error:', err);
    return NextResponse.json({ error: 'Erreur lors de la correction' }, { status: 500 });
  }
}
