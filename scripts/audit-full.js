const db = require('better-sqlite3')('./data/revision.db');

// Check what existing fiches look like
const sample = db.prepare("SELECT s.id, s.type, s.chapter_id, LENGTH(s.content) as len, SUBSTR(s.content, 1, 300) as preview FROM summaries s WHERE s.type = 'resume' LIMIT 4").all();
console.log('=== SAMPLE FICHES (current quality) ===');
sample.forEach(s => {
  console.log(`ID: ${s.id} | Type: ${s.type} | Ch: ${s.chapter_id} | Len: ${s.len}`);
  console.log(`Preview: ${s.preview}`);
  console.log('---');
});

// Unique fiches per subject
const bySubject = db.prepare(`
  SELECT c.subject,
         COUNT(DISTINCT s.content) as unique_fiches,
         COUNT(s.id) as total_entries,
         COUNT(DISTINCT ch.id) as chapters_covered
  FROM summaries s
  JOIN chapters ch ON s.chapter_id = ch.id
  JOIN courses c ON ch.course_id = c.id
  GROUP BY c.subject
`).all();
console.log('\n=== FICHES PAR MATIÈRE ===');
bySubject.forEach(s => console.log(`${s.subject}: ${s.unique_fiches} fiches uniques, ${s.chapters_covered} chapitres, ${s.total_entries} entrées DB`));

// Now build the proper chapter mapping
// For each subject, identify REAL thematic chapters (not "Section 1", etc.)
console.log('\n\n=== ANALYSE THÉMATIQUE PAR MATIÈRE ===\n');

const subjects = db.prepare('SELECT DISTINCT subject FROM courses ORDER BY subject').all();
for (const { subject } of subjects) {
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`MATIÈRE: ${subject}`);
  console.log(`${'═'.repeat(50)}`);

  const courses = db.prepare('SELECT id, title, tag FROM courses WHERE subject = ? ORDER BY id').all(subject);

  const docsCours = [];
  const docsExo = [];
  const docsCas = [];
  const docsRessource = [];

  for (const c of courses) {
    const tag = (c.tag || '').toLowerCase();
    const title = (c.title || '').toLowerCase();

    if (tag === 'cours') {
      docsCours.push(c);
    } else if (tag === 'exercice' || tag === 'examen' || title.includes('exercice') || title.includes('examen') || title.includes('cc ')) {
      docsExo.push(c);
    } else if (tag === 'cas pratique' || title.includes('cas ')) {
      docsCas.push(c);
    } else if (tag === 'corrigé' || title.includes('corrig') || title.includes('correction')) {
      docsExo.push(c); // corrections go with exercises
    } else if (tag === 'ressource') {
      docsRessource.push(c);
    } else {
      docsCours.push(c); // default to cours
    }
  }

  console.log(`\n📚 Documents COURS (${docsCours.length}):`);
  docsCours.forEach(c => {
    const chs = db.prepare('SELECT id, title FROM chapters WHERE course_id = ?').all(c.id);
    console.log(`  - ${c.title} (${chs.length} ch)`);
  });

  console.log(`\n📋 Documents EXERCICES/EXAMENS (${docsExo.length}):`);
  docsExo.forEach(c => {
    const chs = db.prepare('SELECT id, title FROM chapters WHERE course_id = ?').all(c.id);
    console.log(`  - ${c.title} [${c.tag}] (${chs.length} ch)`);
  });

  console.log(`\n📝 Documents CAS PRATIQUES (${docsCas.length}):`);
  docsCas.forEach(c => {
    const chs = db.prepare('SELECT id, title FROM chapters WHERE course_id = ?').all(c.id);
    console.log(`  - ${c.title} (${chs.length} ch)`);
  });

  console.log(`\n📎 Documents RESSOURCES (${docsRessource.length}):`);
  docsRessource.forEach(c => {
    const chs = db.prepare('SELECT id, title FROM chapters WHERE course_id = ?').all(c.id);
    console.log(`  - ${c.title} (${chs.length} ch)`);
  });

  // Count total chapters
  const totalCh = db.prepare('SELECT COUNT(*) as c FROM chapters WHERE course_id IN (SELECT id FROM courses WHERE subject = ?)').get(subject);

  // Determine target fiche count based on cours documents
  const coursChapters = [];
  for (const c of docsCours) {
    const chs = db.prepare('SELECT id, title FROM chapters WHERE course_id = ? ORDER BY order_index').all(c.id);
    chs.forEach(ch => coursChapters.push({ ...ch, courseTitle: c.title }));
  }

  console.log(`\n→ Total chapitres (tous docs): ${totalCh.c}`);
  console.log(`→ Chapitres de cours: ${coursChapters.length}`);
  console.log(`→ Objectif fiches: ~1 par thème de cours identifié`);
}

db.close();
