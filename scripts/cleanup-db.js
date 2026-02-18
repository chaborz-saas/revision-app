/**
 * Script de nettoyage complet de la base de données.
 *
 * Actions :
 * 1. Supprimer les cours vides (PowerPoint non parsés)
 * 2. Supprimer les doublons (JIBI x2)
 * 3. Fusionner les paires énoncé + corrigé
 * 4. Supprimer le cours mal classé (Analyse Qualitative)
 * 5. Supprimer le cours sans valeur pédagogique (CC instructions)
 * 6. Fusionner les corrections d'examen Analyse Quanti
 * 7. Re-splitter les cours RH cassés
 * 8. Renommer les chapitres génériques
 * 9. Supprimer TOUTES les anciennes fiches (summaries)
 * 10. Nettoyer les spaced_review orphelins
 */

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'revision.db');
const db = new Database(DB_PATH);

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

let deletedCourses = 0;
let mergedPairs = 0;
let deletedSummaries = 0;
let renamedChapters = 0;
let resplitChapters = 0;

// ============================================================
// HELPERS
// ============================================================

function deleteCourse(id, reason) {
  const course = db.prepare('SELECT title FROM courses WHERE id = ?').get(id);
  if (!course) return;

  // Delete summaries for this course's chapters
  const chapters = db.prepare('SELECT id FROM chapters WHERE course_id = ?').all(id);
  for (const ch of chapters) {
    db.prepare('DELETE FROM summaries WHERE chapter_id = ?').run(ch.id);
  }
  // Delete chapters
  db.prepare('DELETE FROM chapters WHERE course_id = ?').run(id);
  // Delete spaced reviews
  db.prepare('DELETE FROM spaced_review WHERE chapter_id IN (SELECT id FROM chapters WHERE course_id = ?)').run(id);
  // Delete course
  db.prepare('DELETE FROM courses WHERE id = ?').run(id);

  console.log(`  🗑️  Supprimé cours ${id}: "${course.title}" — ${reason}`);
  deletedCourses++;
}

function mergeCourses(keepId, mergeId, newTitle, newTag) {
  const keepCourse = db.prepare('SELECT title FROM courses WHERE id = ?').get(keepId);
  const mergeCourse = db.prepare('SELECT title FROM courses WHERE id = ?').get(mergeId);
  if (!keepCourse || !mergeCourse) return;

  // Get chapters from both courses
  const keepChapters = db.prepare('SELECT id, title, content, order_index FROM chapters WHERE course_id = ? ORDER BY order_index').all(keepId);
  const mergeChapters = db.prepare('SELECT id, title, content, order_index FROM chapters WHERE course_id = ? ORDER BY order_index').all(mergeId);

  // If keepId has chapters, add mergeId chapters after them
  const maxOrder = keepChapters.length > 0 ? keepChapters[keepChapters.length - 1].order_index + 1 : 0;

  // Move merge chapters to keep course
  for (let i = 0; i < mergeChapters.length; i++) {
    const ch = mergeChapters[i];
    // Delete old summaries
    db.prepare('DELETE FROM summaries WHERE chapter_id = ?').run(ch.id);
    // Move chapter to keep course
    db.prepare('UPDATE chapters SET course_id = ?, order_index = ? WHERE id = ?').run(keepId, maxOrder + i, ch.id);
  }

  // Update course title and tag
  if (newTitle) {
    db.prepare('UPDATE courses SET title = ? WHERE id = ?').run(newTitle, keepId);
  }
  if (newTag) {
    db.prepare('UPDATE courses SET tag = ? WHERE id = ?').run(newTag, keepId);
  }

  // Delete old summaries for keep chapters too
  for (const ch of keepChapters) {
    db.prepare('DELETE FROM summaries WHERE chapter_id = ?').run(ch.id);
  }

  // Also merge course-level content
  const keepContent = db.prepare('SELECT content FROM courses WHERE id = ?').get(keepId);
  const mergeContent = db.prepare('SELECT content FROM courses WHERE id = ?').get(mergeId);
  if (mergeContent && mergeContent.content && mergeContent.content.length > 100) {
    const combined = (keepContent.content || '') + '\n\n---\n\n' + mergeContent.content;
    db.prepare('UPDATE courses SET content = ? WHERE id = ?').run(combined, keepId);
  }

  // Now delete the merged course (no chapters left)
  db.prepare('DELETE FROM spaced_review WHERE chapter_id IN (SELECT id FROM chapters WHERE course_id = ?)').run(mergeId);
  db.prepare('DELETE FROM chapters WHERE course_id = ?').run(mergeId);
  db.prepare('DELETE FROM courses WHERE id = ?').run(mergeId);

  console.log(`  🔗 Fusionné cours ${mergeId} → ${keepId}: "${newTitle || keepCourse.title}"`);
  mergedPairs++;
}

function renameChapter(chapterId, newTitle) {
  db.prepare('UPDATE chapters SET title = ? WHERE id = ?').run(newTitle, chapterId);
  renamedChapters++;
}

function resplitCourse(courseId, newChapters) {
  // Delete existing chapters and their summaries
  const oldChapters = db.prepare('SELECT id FROM chapters WHERE course_id = ?').all(courseId);
  for (const ch of oldChapters) {
    db.prepare('DELETE FROM summaries WHERE chapter_id = ?').run(ch.id);
    db.prepare('DELETE FROM spaced_review WHERE chapter_id = ?').run(ch.id);
  }
  db.prepare('DELETE FROM chapters WHERE course_id = ?').run(courseId);

  // Get full course content
  const course = db.prepare('SELECT content FROM courses WHERE id = ?').get(courseId);
  const fullContent = course.content || '';

  // Insert new chapters
  const insertChapter = db.prepare(
    'INSERT INTO chapters (course_id, title, content, order_index) VALUES (?, ?, ?, ?)'
  );

  for (let i = 0; i < newChapters.length; i++) {
    const ch = newChapters[i];
    let content = ch.content;

    // If content is a regex pattern, extract from full content
    if (ch.startPattern && ch.endPattern) {
      const startIdx = fullContent.indexOf(ch.startPattern);
      const endIdx = ch.endPattern === 'END' ? fullContent.length : fullContent.indexOf(ch.endPattern);
      if (startIdx !== -1) {
        content = fullContent.substring(startIdx, endIdx !== -1 ? endIdx : undefined).trim();
      }
    }

    insertChapter.run(courseId, ch.title, content || fullContent, i);
    resplitChapters++;
  }

  console.log(`  ✂️  Re-splitté cours ${courseId}: ${newChapters.length} nouveaux chapitres`);
}

// ============================================================
// MAIN
// ============================================================

const cleanup = db.transaction(() => {
  console.log('=== PHASE 1: Suppression des cours vides/inutiles ===\n');

  // Droit: 8 PowerPoint vides
  deleteCourse(19, 'PowerPoint non parsé (vide)');
  deleteCourse(20, 'PowerPoint non parsé (vide)');
  deleteCourse(21, 'PowerPoint non parsé (vide)');
  deleteCourse(22, 'PowerPoint non parsé (vide)');
  deleteCourse(23, 'PowerPoint non parsé (vide)');
  deleteCourse(24, 'PowerPoint non parsé (vide)');
  deleteCourse(26, 'PowerPoint non parsé (vide)');
  deleteCourse(27, 'PowerPoint non parsé (vide)');

  // Analyse Quanti: cours 1 = instructions de CC, pas de valeur pédagogique
  deleteCourse(1, 'Instructions de CC, pas de contenu pédagogique');

  // Pilotage: cours 32 = EcoGreen corrigé vide
  deleteCourse(32, 'Contenu vide (43 chars)');
  // Pilotage: cours 48 = doublon JIBI
  deleteCourse(48, 'Doublon exact de cours 47');
  // Pilotage: cours 53 = 23MB de données Excel brutes
  deleteCourse(53, 'Données Excel brutes (23MB), inutilisable');
  // Pilotage: cours 40 = mauvaise matière (méthodologie de recherche)
  deleteCourse(40, 'Mauvaise matière (analyse qualitative ≠ pilotage)');

  console.log(`\n=== PHASE 2: Fusion des paires énoncé + corrigé ===\n`);

  // Droit: Cas pratiques CVIM
  mergeCourses(10, 15, 'Cas Pratique 1 CVIM (Énoncé + Corrigé)', 'Cas pratique');
  mergeCourses(11, 16, 'Cas Pratique 2 CVIM (Énoncé + Corrigé)', 'Cas pratique');
  mergeCourses(12, 17, 'Cas Pratique 3 CVIM (Énoncé + Corrigé)', 'Cas pratique');
  mergeCourses(13, 18, 'Cas Pratique 4 CVIM (Énoncé + Corrigé)', 'Cas pratique');

  // Analyse Quanti: Fusion corrections d'examen
  mergeCourses(2, 3, 'Corrections d\'Examens Passés', 'Corrigé');

  // Pilotage: Paires énoncé+corrigé
  mergeCourses(47, 49, 'Cas JIBI - Seuil de Rentabilité', 'Cas pratique');
  mergeCourses(51, 52, 'Exercice Tableau de Bord 2', 'Exercice');
  mergeCourses(56, 57, 'Exercice Tableau de Bord', 'Exercice');
  mergeCourses(58, 59, 'Exercice Convention de Service', 'Exercice');
  mergeCourses(60, 61, 'Exercice Mudas', 'Exercice');
  mergeCourses(37, 36, 'CC Pilotage Performance (Sujet + Compléments)', 'Examen');
  mergeCourses(35, 34, 'Cas SEUROL - Calcul d\'Écarts', 'Cas pratique');
  mergeCourses(54, 39, 'Exercice CdG Sociale + Masse Salariale', 'Exercice');

  console.log(`\n=== PHASE 3: Renommage des chapitres génériques ===\n`);

  // RH - Cours 1 (id 62)
  const rh1Chapters = db.prepare('SELECT id, title FROM chapters WHERE course_id = 62 ORDER BY order_index').all();
  if (rh1Chapters.length >= 3) {
    renameChapter(rh1Chapters[0].id, 'Introduction et définition de la GRH');
    renameChapter(rh1Chapters[1].id, 'Les acteurs de la GRH');
    renameChapter(rh1Chapters[2].id, 'Le contexte de la GRH');
    console.log('  ✏️  Renommé 3 chapitres de RH - Cours 1');
  }

  // RH - Cours 3 (id 64)
  const rh3Chapters = db.prepare('SELECT id, title FROM chapters WHERE course_id = 64 ORDER BY order_index').all();
  if (rh3Chapters.length >= 2) {
    renameChapter(rh3Chapters[0].id, 'Les fondamentaux de la rémunération');
    renameChapter(rh3Chapters[1].id, 'L\'épargne salariale et rémunération collective');
    console.log('  ✏️  Renommé 2 chapitres de RH - Cours 3');
  }

  // RH - Cours 4 (id 65)
  const rh4Chapters = db.prepare('SELECT id, title FROM chapters WHERE course_id = 65 ORDER BY order_index').all();
  if (rh4Chapters.length >= 2) {
    renameChapter(rh4Chapters[0].id, 'L\'évaluation de la performance');
    renameChapter(rh4Chapters[1].id, 'L\'évaluation des compétences');
    console.log('  ✏️  Renommé 2 chapitres de RH - Cours 4');
  }

  // Rename chapter titles for Pilotage cours that have duplicated names
  const pilotChapters43 = db.prepare('SELECT id, title, length(content) as len FROM chapters WHERE course_id = 43 ORDER BY order_index').all();
  for (const ch of pilotChapters43) {
    if (ch.len < 50) {
      // Delete empty/stub chapters
      db.prepare('DELETE FROM summaries WHERE chapter_id = ?').run(ch.id);
      db.prepare('DELETE FROM spaced_review WHERE chapter_id = ?').run(ch.id);
      db.prepare('DELETE FROM chapters WHERE id = ?').run(ch.id);
      console.log(`  🗑️  Supprimé chapitre vide ${ch.id} du cours 43`);
    }
  }

  console.log(`\n=== PHASE 4: Re-split des cours RH cassés ===\n`);

  // RH - Cours 2 (id 63) - Le Recrutement
  // Chapters are broken (3 identical titles of 500-600 chars each)
  // Need to re-split based on the full course content
  const rh2Course = db.prepare('SELECT content FROM courses WHERE id = 63').get();
  if (rh2Course && rh2Course.content && rh2Course.content.length > 5000) {
    const content = rh2Course.content;

    // Delete old broken chapters
    const oldCh = db.prepare('SELECT id FROM chapters WHERE course_id = 63').all();
    for (const ch of oldCh) {
      db.prepare('DELETE FROM summaries WHERE chapter_id = ?').run(ch.id);
      db.prepare('DELETE FROM spaced_review WHERE chapter_id = ?').run(ch.id);
    }
    db.prepare('DELETE FROM chapters WHERE course_id = 63').run();

    // Split by major sections
    const sections = [];

    // Try to find natural section breaks
    const sectionBreaks = [
      { title: 'Les objectifs et enjeux du recrutement', pattern: /recrutement/i },
      { title: 'Le sourcing et les canaux de recrutement', pattern: /sourcing|canaux|e-recrutement/i },
      { title: 'La sélection des candidats', pattern: /s[eé]lection|candidat|entretien/i },
      { title: 'L\'intégration des nouveaux collaborateurs', pattern: /int[eé]gration|onboarding/i },
    ];

    // Simple split: divide content into roughly equal parts with section titles
    const totalLen = content.length;
    const partSize = Math.floor(totalLen / 4);

    const insertCh = db.prepare('INSERT INTO chapters (course_id, title, content, order_index) VALUES (?, ?, ?, ?)');

    for (let i = 0; i < 4; i++) {
      const start = i * partSize;
      const end = i === 3 ? totalLen : (i + 1) * partSize;
      // Find nearest sentence break
      let actualEnd = end;
      if (i < 3) {
        const dotIdx = content.indexOf('.', end);
        if (dotIdx !== -1 && dotIdx < end + 200) actualEnd = dotIdx + 1;
      }
      const chContent = content.substring(start, actualEnd).trim();
      insertCh.run(63, sectionBreaks[i].title, chContent, i);
      resplitChapters++;
    }
    console.log('  ✂️  Re-splitté cours 63 (RH - Recrutement): 4 chapitres');
  }

  // RH - Cours 5 (id 66) - Gestion de Carrières
  const rh5Course = db.prepare('SELECT content FROM courses WHERE id = 66').get();
  if (rh5Course && rh5Course.content && rh5Course.content.length > 3000) {
    const content = rh5Course.content;

    const oldCh = db.prepare('SELECT id FROM chapters WHERE course_id = 66').all();
    for (const ch of oldCh) {
      db.prepare('DELETE FROM summaries WHERE chapter_id = ?').run(ch.id);
      db.prepare('DELETE FROM spaced_review WHERE chapter_id = ?').run(ch.id);
    }
    db.prepare('DELETE FROM chapters WHERE course_id = 66').run();

    const totalLen = content.length;
    const partSize = Math.floor(totalLen / 3);

    const insertCh = db.prepare('INSERT INTO chapters (course_id, title, content, order_index) VALUES (?, ?, ?, ?)');
    const chTitles = [
      'Définition et enjeux de la gestion de carrières',
      'Politique de mobilité et parcours professionnels',
      'Outils de gestion et hauts potentiels'
    ];

    for (let i = 0; i < 3; i++) {
      const start = i * partSize;
      const end = i === 2 ? totalLen : (i + 1) * partSize;
      let actualEnd = end;
      if (i < 2) {
        const dotIdx = content.indexOf('.', end);
        if (dotIdx !== -1 && dotIdx < end + 200) actualEnd = dotIdx + 1;
      }
      const chContent = content.substring(start, actualEnd).trim();
      insertCh.run(66, chTitles[i], chContent, i);
      resplitChapters++;
    }
    console.log('  ✂️  Re-splitté cours 66 (RH - Gestion Carrières): 3 chapitres');
  }

  console.log(`\n=== PHASE 5: Suppression de TOUTES les anciennes fiches ===\n`);

  const summaryCount = db.prepare('SELECT COUNT(*) as cnt FROM summaries').get();
  db.prepare('DELETE FROM summaries').run();
  deletedSummaries = summaryCount.cnt;
  console.log(`  🗑️  Supprimé ${deletedSummaries} anciennes fiches (seront régénérées)`);

  // Clean up spaced_review
  db.prepare('DELETE FROM spaced_review').run();
  console.log('  🗑️  Reset de la révision espacée');
});

cleanup();

// ============================================================
// VÉRIFICATION FINALE
// ============================================================
console.log('\n=== VÉRIFICATION FINALE ===\n');

const subjects = ['Analyse Quanti', 'Droit', 'Pilotage de la Performance', 'RH'];
let totalCourses = 0;
let totalChapters = 0;

for (const subject of subjects) {
  const courses = db.prepare(
    `SELECT c.id, c.title, c.tag,
     (SELECT COUNT(*) FROM chapters ch WHERE ch.course_id = c.id) as ch_count
     FROM courses c WHERE c.subject = ?
     ORDER BY CASE tag WHEN 'Cours' THEN 1 WHEN 'Exercice' THEN 2 WHEN 'Cas pratique' THEN 3 WHEN 'Examen' THEN 4 WHEN 'Corrigé' THEN 5 WHEN 'Ressource' THEN 6 END, c.title`
  ).all(subject);

  console.log(`📚 ${subject} (${courses.length} cours)`);
  for (const c of courses) {
    console.log(`   ${c.id}. [${c.tag}] ${c.title} (${c.ch_count} ch.)`);
    totalChapters += c.ch_count;
  }
  totalCourses += courses.length;
  console.log('');
}

console.log('─────────────────────────────────────');
console.log(`📊 Total: ${totalCourses} cours, ${totalChapters} chapitres`);
console.log(`🗑️  ${deletedCourses} cours supprimés`);
console.log(`🔗 ${mergedPairs} paires fusionnées`);
console.log(`✏️  ${renamedChapters} chapitres renommés`);
console.log(`✂️  ${resplitChapters} chapitres re-splittés`);
console.log(`📝 ${deletedSummaries} anciennes fiches supprimées (à régénérer)`);
console.log('─────────────────────────────────────');

db.close();
