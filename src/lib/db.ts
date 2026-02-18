import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'revision.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subject TEXT DEFAULT '',
      content TEXT DEFAULT '',
      chapter_count INTEGER DEFAULT 0,
      page_count INTEGER DEFAULT 0,
      color TEXT DEFAULT '#06b6d4',
      file_path TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('resume', 'memo')),
      content TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      course_id INTEGER,
      chapter_id INTEGER,
      difficulty TEXT DEFAULT 'moyen',
      question_count INTEGER DEFAULT 10,
      mode TEXT DEFAULT 'rapide',
      time_limit INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('qcm', 'vrai_faux', 'reponse_courte')),
      question TEXT NOT NULL,
      options_json TEXT DEFAULT '[]',
      correct_answer TEXT NOT NULL,
      explanation TEXT DEFAULT '',
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      score INTEGER DEFAULT 0,
      total INTEGER DEFAULT 0,
      answers_json TEXT DEFAULT '[]',
      time_spent INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      course_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS mastery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter_id INTEGER NOT NULL UNIQUE,
      score REAL DEFAULT 0,
      attempts INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS spaced_review (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter_id INTEGER NOT NULL UNIQUE,
      next_review TEXT NOT NULL DEFAULT (datetime('now')),
      interval_days INTEGER DEFAULT 1,
      ease_factor REAL DEFAULT 2.5,
      repetitions INTEGER DEFAULT 0,
      last_reviewed TEXT,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    );
  `);
}

// === COURSES ===
export function getAllCourses() {
  return getDb().prepare('SELECT * FROM courses ORDER BY created_at DESC').all() as Course[];
}

export function getCourse(id: number) {
  return getDb().prepare('SELECT * FROM courses WHERE id = ?').get(id) as Course | undefined;
}

export function insertCourse(course: Omit<Course, 'id' | 'created_at'>) {
  const stmt = getDb().prepare(
    'INSERT INTO courses (title, subject, content, chapter_count, page_count, color, file_path) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  return stmt.run(course.title, course.subject, course.content, course.chapter_count, course.page_count, course.color, course.file_path);
}

export function courseExistsByPath(filePath: string) {
  return getDb().prepare('SELECT id FROM courses WHERE file_path = ?').get(filePath) as { id: number } | undefined;
}

// === CHAPTERS ===
export function getChaptersByCourse(courseId: number) {
  return getDb().prepare('SELECT * FROM chapters WHERE course_id = ? ORDER BY order_index').all(courseId) as Chapter[];
}

export function getChapter(id: number) {
  return getDb().prepare('SELECT * FROM chapters WHERE id = ?').get(id) as Chapter | undefined;
}

export function insertChapter(chapter: Omit<Chapter, 'id'>) {
  const stmt = getDb().prepare(
    'INSERT INTO chapters (course_id, title, content, order_index) VALUES (?, ?, ?, ?)'
  );
  return stmt.run(chapter.course_id, chapter.title, chapter.content, chapter.order_index);
}

// === SUMMARIES ===
export function getSummaryByChapter(chapterId: number, type: 'resume' | 'memo') {
  return getDb().prepare('SELECT * FROM summaries WHERE chapter_id = ? AND type = ?').get(chapterId, type) as Summary | undefined;
}

export function insertSummary(summary: Omit<Summary, 'id' | 'created_at'>) {
  const stmt = getDb().prepare('INSERT INTO summaries (chapter_id, type, content) VALUES (?, ?, ?)');
  return stmt.run(summary.chapter_id, summary.type, summary.content);
}

export function deleteSummary(id: number) {
  return getDb().prepare('DELETE FROM summaries WHERE id = ?').run(id);
}

// === QUIZZES ===
export function getAllQuizzes() {
  return getDb().prepare('SELECT * FROM quizzes ORDER BY created_at DESC').all() as Quiz[];
}

export function getQuiz(id: number) {
  return getDb().prepare('SELECT * FROM quizzes WHERE id = ?').get(id) as Quiz | undefined;
}

export function insertQuiz(quiz: Omit<Quiz, 'id' | 'created_at'>) {
  const stmt = getDb().prepare(
    'INSERT INTO quizzes (title, course_id, chapter_id, difficulty, question_count, mode, time_limit) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  return stmt.run(quiz.title, quiz.course_id, quiz.chapter_id, quiz.difficulty, quiz.question_count, quiz.mode, quiz.time_limit);
}

// === QUESTIONS ===
export function getQuestionsByQuiz(quizId: number) {
  return getDb().prepare('SELECT * FROM questions WHERE quiz_id = ?').all(quizId) as Question[];
}

export function insertQuestion(q: Omit<Question, 'id'>) {
  const stmt = getDb().prepare(
    'INSERT INTO questions (quiz_id, type, question, options_json, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)'
  );
  return stmt.run(q.quiz_id, q.type, q.question, q.options_json, q.correct_answer, q.explanation);
}

// === QUIZ ATTEMPTS ===
export function getAttemptsByQuiz(quizId: number) {
  return getDb().prepare('SELECT * FROM quiz_attempts WHERE quiz_id = ? ORDER BY created_at DESC').all(quizId) as QuizAttempt[];
}

export function getAllAttempts() {
  return getDb().prepare('SELECT * FROM quiz_attempts ORDER BY created_at DESC').all() as QuizAttempt[];
}

export function insertAttempt(attempt: Omit<QuizAttempt, 'id' | 'created_at'>) {
  const stmt = getDb().prepare(
    'INSERT INTO quiz_attempts (quiz_id, score, total, answers_json, time_spent) VALUES (?, ?, ?, ?, ?)'
  );
  return stmt.run(attempt.quiz_id, attempt.score, attempt.total, attempt.answers_json, attempt.time_spent);
}

// === CHAT ===
export function getChatMessages(sessionId: string) {
  return getDb().prepare('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at').all(sessionId) as ChatMessage[];
}

export function getChatSessions() {
  return getDb().prepare(
    'SELECT session_id, MIN(created_at) as started_at, COUNT(*) as message_count, course_id FROM chat_messages GROUP BY session_id ORDER BY MIN(created_at) DESC'
  ).all() as { session_id: string; started_at: string; message_count: number; course_id: number | null }[];
}

export function insertChatMessage(msg: Omit<ChatMessage, 'id' | 'created_at'>) {
  const stmt = getDb().prepare(
    'INSERT INTO chat_messages (session_id, role, content, course_id) VALUES (?, ?, ?, ?)'
  );
  return stmt.run(msg.session_id, msg.role, msg.content, msg.course_id);
}

// === MASTERY ===
export function getMastery(chapterId: number) {
  return getDb().prepare('SELECT * FROM mastery WHERE chapter_id = ?').get(chapterId) as Mastery | undefined;
}

export function getAllMastery() {
  return getDb().prepare('SELECT * FROM mastery').all() as Mastery[];
}

export function upsertMastery(chapterId: number, score: number) {
  const existing = getMastery(chapterId);
  if (existing) {
    const newScore = (existing.score * existing.attempts + score) / (existing.attempts + 1);
    getDb().prepare(
      'UPDATE mastery SET score = ?, attempts = attempts + 1, updated_at = datetime(\'now\') WHERE chapter_id = ?'
    ).run(Math.round(newScore * 100) / 100, chapterId);
  } else {
    getDb().prepare(
      'INSERT INTO mastery (chapter_id, score, attempts) VALUES (?, ?, 1)'
    ).run(chapterId, score);
  }
}

// === SEARCH ===
export function searchCourses(query: string) {
  const q = `%${query}%`;
  return getDb().prepare(
    'SELECT * FROM courses WHERE title LIKE ? OR subject LIKE ? OR content LIKE ? ORDER BY title'
  ).all(q, q, q) as Course[];
}

// === STATS ===
export function getStats() {
  const db = getDb();
  const courseCount = (db.prepare('SELECT COUNT(*) as c FROM courses').get() as { c: number }).c;
  const chapterCount = (db.prepare('SELECT COUNT(*) as c FROM chapters').get() as { c: number }).c;
  const quizCount = (db.prepare('SELECT COUNT(*) as c FROM quizzes').get() as { c: number }).c;
  const attemptCount = (db.prepare('SELECT COUNT(*) as c FROM quiz_attempts').get() as { c: number }).c;
  const ficheCount = (db.prepare('SELECT COUNT(*) as c FROM summaries').get() as { c: number }).c;
  const avgScore = (db.prepare('SELECT AVG(CAST(score AS REAL) / CAST(total AS REAL) * 100) as avg FROM quiz_attempts WHERE total > 0').get() as { avg: number | null }).avg;
  return { courseCount, chapterCount, quizCount, attemptCount, ficheCount, avgScore: avgScore ?? 0 };
}

// === SPACED REVIEW ===
export function getDueReviews() {
  return getDb().prepare(
    `SELECT sr.*, ch.title as chapter_title, ch.course_id, c.title as course_title
     FROM spaced_review sr
     JOIN chapters ch ON sr.chapter_id = ch.id
     JOIN courses c ON ch.course_id = c.id
     WHERE sr.next_review <= datetime('now')
     ORDER BY sr.next_review ASC`
  ).all() as (SpacedReview & { chapter_title: string; course_id: number; course_title: string })[];
}

export function getSpacedReview(chapterId: number) {
  return getDb().prepare('SELECT * FROM spaced_review WHERE chapter_id = ?').get(chapterId) as SpacedReview | undefined;
}

export function getAllSpacedReviews() {
  return getDb().prepare(
    `SELECT sr.*, ch.title as chapter_title, ch.course_id, c.title as course_title
     FROM spaced_review sr
     JOIN chapters ch ON sr.chapter_id = ch.id
     JOIN courses c ON ch.course_id = c.id
     ORDER BY sr.next_review ASC`
  ).all() as (SpacedReview & { chapter_title: string; course_id: number; course_title: string })[];
}

export function upsertSpacedReview(chapterId: number, quality: number) {
  const existing = getSpacedReview(chapterId);

  let intervalDays: number;
  let easeFactor: number;
  let repetitions: number;

  if (existing) {
    easeFactor = existing.ease_factor;
    repetitions = existing.repetitions;
    intervalDays = existing.interval_days;
  } else {
    easeFactor = 2.5;
    repetitions = 0;
    intervalDays = 1;
  }

  // SM-2 algorithm
  if (quality <= 2) {
    // Reset on poor quality
    intervalDays = 1;
    repetitions = 0;
  } else if (quality === 3) {
    intervalDays = 1;
    repetitions += 1;
  } else if (quality === 4) {
    intervalDays = Math.max(1, Math.round(intervalDays * easeFactor));
    repetitions += 1;
  } else {
    // quality === 5
    intervalDays = Math.max(1, Math.round(intervalDays * easeFactor * 1.3));
    repetitions += 1;
  }

  // Adjust ease factor
  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.round(easeFactor * 100) / 100;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);
  const nextReviewStr = nextReview.toISOString().replace('T', ' ').substring(0, 19);

  if (existing) {
    getDb().prepare(
      `UPDATE spaced_review SET next_review = ?, interval_days = ?, ease_factor = ?, repetitions = ?, last_reviewed = datetime('now') WHERE chapter_id = ?`
    ).run(nextReviewStr, intervalDays, easeFactor, repetitions, chapterId);
  } else {
    getDb().prepare(
      `INSERT INTO spaced_review (chapter_id, next_review, interval_days, ease_factor, repetitions, last_reviewed) VALUES (?, ?, ?, ?, ?, datetime('now'))`
    ).run(chapterId, nextReviewStr, intervalDays, easeFactor, repetitions);
  }

  return { intervalDays, easeFactor, repetitions, nextReview: nextReviewStr };
}

export function initSpacedReviewForAll() {
  const chapters = getDb().prepare('SELECT id FROM chapters').all() as { id: number }[];
  const insertStmt = getDb().prepare(
    `INSERT OR IGNORE INTO spaced_review (chapter_id, next_review, interval_days, ease_factor, repetitions) VALUES (?, datetime('now'), 1, 2.5, 0)`
  );
  const transaction = getDb().transaction(() => {
    for (const ch of chapters) {
      insertStmt.run(ch.id);
    }
  });
  transaction();
  return chapters.length;
}

// === TYPES ===
export interface Course {
  id: number;
  title: string;
  subject: string;
  content: string;
  chapter_count: number;
  page_count: number;
  color: string;
  tag: string;
  file_path: string;
  created_at: string;
}

export interface Chapter {
  id: number;
  course_id: number;
  title: string;
  content: string;
  order_index: number;
}

export interface Summary {
  id: number;
  chapter_id: number;
  type: 'resume' | 'memo';
  content: string;
  created_at: string;
}

export interface Quiz {
  id: number;
  title: string;
  course_id: number | null;
  chapter_id: number | null;
  difficulty: string;
  question_count: number;
  mode: string;
  time_limit: number;
  created_at: string;
}

export interface Question {
  id: number;
  quiz_id: number;
  type: 'qcm' | 'vrai_faux' | 'reponse_courte';
  question: string;
  options_json: string;
  correct_answer: string;
  explanation: string;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  score: number;
  total: number;
  answers_json: string;
  time_spent: number;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  course_id: number | null;
  created_at: string;
}

export interface Mastery {
  id: number;
  chapter_id: number;
  score: number;
  attempts: number;
  updated_at: string;
}

export interface SpacedReview {
  id: number;
  chapter_id: number;
  next_review: string;
  interval_days: number;
  ease_factor: number;
  repetitions: number;
  last_reviewed: string | null;
}
