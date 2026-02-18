const db = require('better-sqlite3')('./data/revision.db');
const all = db.prepare('SELECT id, quiz_id, question, type, correct_answer, explanation, options_json FROM questions ORDER BY quiz_id, id').all();

console.log('Total questions:', all.length);
console.log('');

let badCount = 0;
all.forEach(q => {
  const issues = [];
  if (q.question.includes('»') || q.question.includes('«')) issues.push('guillemets');
  if (q.question.length > 120) issues.push('trop long (' + q.question.length + ')');
  if (q.question.includes('Convention ne fixe pas')) issues.push('texte brut de cours');
  if (q.question.includes('Intérêts de retard')) issues.push('texte brut de cours');
  if (q.question.includes('⚖️')) issues.push('contient emoji titre');

  // Check if it looks like a copy-paste from course content
  if (q.question.includes(' : «') || q.question.includes(' : "')) issues.push('citation de cours');

  if (issues.length > 0) {
    badCount++;
    console.log(`--- BAD #${badCount} ---`);
    console.log(`ID: ${q.id} | Quiz: ${q.quiz_id} | Type: ${q.type}`);
    console.log(`Q: ${q.question.substring(0, 250)}`);
    console.log(`A: ${(q.correct_answer || '').substring(0, 150)}`);
    console.log(`Issues: ${issues.join(', ')}`);
    console.log('');
  }
});

console.log(`\n=== ${badCount} problematic questions out of ${all.length} total ===`);

// Also show ALL questions for quiz 13 (Droit) since that's where most problems are
console.log('\n\n=== ALL QUESTIONS FOR EACH QUIZ ===');
const quizzes = db.prepare('SELECT id, title FROM quizzes ORDER BY id').all();
quizzes.forEach(quiz => {
  const qs = db.prepare('SELECT id, question, type, correct_answer FROM questions WHERE quiz_id = ?').all(quiz.id);
  console.log(`\n--- ${quiz.title} (Quiz ${quiz.id}, ${qs.length} questions) ---`);
  qs.forEach((q, i) => {
    console.log(`  ${i+1}. [${q.type}] ${q.question.substring(0, 150)}`);
  });
});

db.close();
