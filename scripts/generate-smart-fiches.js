/**
 * Génération intelligente de fiches de révision.
 * Sélectionne les meilleurs chapitres par matière (max ~10 par matière)
 * et ne génère des fiches que pour le contenu qui a du sens.
 *
 * Critères de sélection :
 * - Contenu > 500 chars
 * - Pas de données brutes (Excel/pipe tables)
 * - Priorité aux cours théoriques > cas pratiques > exercices
 * - Contenu réellement pédagogique
 */

const BASE = 'http://localhost:3000';

async function generateFiche(chapterId, type) {
  try {
    const res = await fetch(`${BASE}/api/fiches/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId, type, forceOffline: true }),
    });
    if (res.ok) {
      return true;
    } else {
      const err = await res.text();
      console.log(`    SKIP ch.${chapterId} (${type}): ${err.substring(0, 60)}`);
      return false;
    }
  } catch (e) {
    console.log(`    ERR ch.${chapterId} (${type}): ${e.message}`);
    return false;
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============================================================
// Chapitres sélectionnés par matière (basé sur l'audit)
// ============================================================

const FICHES_TO_GENERATE = {
  'Analyse Quanti': {
    description: 'Statistiques descriptives, bivariées, ANOVA',
    chapters: [
      // Cours 4: Infos générales - 3 chapitres
      { courseId: 4, chapterIds: [5, 6, 7], reason: 'Cours fondamental: types variables, stats descriptives' },
      // Cours 5: Relations bivariées - 2 chapitres
      { courseId: 5, chapterIds: [8, 9], reason: 'Cours: Khi-deux, corrélation, p-value' },
      // Cours 6: ANOVA - 2 chapitres
      { courseId: 6, chapterIds: [10, 11], reason: 'Cours: ANOVA, F-stat, post-hoc' },
      // Cours 2: Corrections examen - chapitre 3 seulement (le bon)
      { courseId: 2, chapterIds: [3], reason: 'Corrigé exam: régression, corrélation appliquée' },
    ],
  },
  'Droit': {
    description: 'Contrat de vente international, CVIM, agent commercial',
    chapters: [
      // Cours 28 & 29: Clause arbitrage + Hardship
      { courseId: 28, chapterIds: 'ALL', reason: 'Cours: clause d\'arbitrage' },
      { courseId: 29, chapterIds: 'ALL', reason: 'Cours: hardship UNIDROIT' },
      // Cas pratiques CVIM (fusionnés) - contenu riche
      { courseId: 10, chapterIds: 'ALL', reason: 'Cas pratique 1 CVIM' },
      { courseId: 11, chapterIds: 'ALL', reason: 'Cas pratique 2 CVIM' },
      { courseId: 12, chapterIds: 'ALL', reason: 'Cas pratique 3 CVIM' },
      { courseId: 13, chapterIds: 'ALL', reason: 'Cas pratique 4 CVIM' },
      // Code de commerce (référence légale)
      { courseId: 14, chapterIds: 'ALL', reason: 'Référence: Code commerce Agent Commercial' },
      // Cas LH Wind
      { courseId: 9, chapterIds: 'ALL', reason: 'Cas: Agent commercial' },
      // West Side Story
      { courseId: 30, chapterIds: 'ALL', reason: 'Cas: Contrat international' },
    ],
  },
  'Pilotage de la Performance': {
    description: 'Contrôle de gestion, coûts, tableaux de bord, seuils',
    chapters: [
      // Cours 41-46: Les parties du cours principal
      { courseId: 41, chapterIds: 'ALL', reason: 'Cours partie 1' },
      { courseId: 42, chapterIds: 'ALL', reason: 'Cours partie 2' },
      { courseId: 44, chapterIds: 'ALL', reason: 'Cours partie 5' },
      { courseId: 45, chapterIds: 'ALL', reason: 'Cours partie 6' },
      { courseId: 46, chapterIds: 'ALL', reason: 'Cours partie 7' },
      // Cas JIBI (seuil rentabilité - bon contenu)
      { courseId: 47, chapterIds: 'ALL', reason: 'Cas: Seuil de rentabilité' },
      // Examen CC
      { courseId: 37, chapterIds: 'ALL', reason: 'Sujet examen' },
    ],
  },
  'RH': {
    description: 'GRH, recrutement, rémunération, évaluation, carrières',
    chapters: [
      // Tous les cours RH (5 cours x 2-4 chapitres)
      { courseId: 62, chapterIds: 'ALL', reason: 'Intro GRH' },
      { courseId: 63, chapterIds: 'ALL', reason: 'Le Recrutement' },
      { courseId: 64, chapterIds: 'ALL', reason: 'La Rémunération' },
      { courseId: 65, chapterIds: 'ALL', reason: 'L\'Évaluation' },
      { courseId: 66, chapterIds: 'ALL', reason: 'Gestion Carrières' },
    ],
  },
};

async function main() {
  const Database = require('better-sqlite3');
  const path = require('path');
  const db = new Database(path.join(__dirname, '..', 'data', 'revision.db'));

  console.log('=== Génération intelligente des fiches ===\n');

  let totalGenerated = 0;
  let totalErrors = 0;

  for (const [subject, config] of Object.entries(FICHES_TO_GENERATE)) {
    console.log(`\n📚 ${subject}: ${config.description}`);
    console.log('─'.repeat(50));

    let subjectGenerated = 0;

    for (const group of config.chapters) {
      let chapterIds = [];

      if (group.chapterIds === 'ALL') {
        const chapters = db.prepare(
          'SELECT id, title, length(content) as len FROM chapters WHERE course_id = ? ORDER BY order_index'
        ).all(group.courseId);

        // Filter: only chapters with > 400 chars of content
        chapterIds = chapters
          .filter(ch => ch.len > 400)
          .map(ch => ch.id);

        if (chapterIds.length === 0) {
          console.log(`  ⚠️  Cours ${group.courseId}: aucun chapitre assez long, skip`);
          continue;
        }
      } else {
        chapterIds = group.chapterIds;
      }

      const courseName = db.prepare('SELECT title FROM courses WHERE id = ?').get(group.courseId);
      console.log(`\n  📖 ${courseName?.title || 'Cours ' + group.courseId} (${chapterIds.length} ch.)`);

      for (const chId of chapterIds) {
        const ch = db.prepare('SELECT title, length(content) as len FROM chapters WHERE id = ?').get(chId);
        if (!ch || ch.len < 400) {
          console.log(`    ⚠️  Ch.${chId}: trop court (${ch?.len || 0} chars), skip`);
          continue;
        }

        // Check if content is mostly pipe tables (Excel data)
        const chContent = db.prepare('SELECT content FROM chapters WHERE id = ?').get(chId);
        if (chContent && chContent.content) {
          const pipeCount = (chContent.content.match(/\|/g) || []).length;
          const textLen = chContent.content.length;
          if (pipeCount > 100 && pipeCount / textLen > 0.05) {
            console.log(`    ⚠️  Ch.${chId}: données tabulaires brutes (${pipeCount} pipes), skip`);
            continue;
          }
        }

        // Generate resume
        const resumeOk = await generateFiche(chId, 'resume');
        if (resumeOk) {
          console.log(`    ✅ Ch.${chId} "${ch.title.substring(0, 40)}..." → résumé OK`);
          subjectGenerated++;
          totalGenerated++;
        } else {
          totalErrors++;
        }

        // Generate memo (flashcards)
        const memoOk = await generateFiche(chId, 'memo');
        if (memoOk) {
          console.log(`    ✅ Ch.${chId} → flashcards OK`);
          subjectGenerated++;
          totalGenerated++;
        } else {
          totalErrors++;
        }

        await sleep(100);
      }
    }

    console.log(`\n  📊 ${subject}: ${subjectGenerated} fiches générées`);
  }

  console.log('\n═════════════════════════════════════');
  console.log(`✅ TERMINÉ: ${totalGenerated} fiches générées (${totalErrors} erreurs)`);
  console.log('═════════════════════════════════════');

  db.close();
}

main();
