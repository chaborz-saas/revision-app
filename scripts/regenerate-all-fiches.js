/**
 * Régénère TOUTES les fiches de A à Z avec le nouveau format esthétique.
 *
 * - Supprime toutes les anciennes fiches
 * - Audite chaque chapitre (contenu suffisant ? pas des données brutes ?)
 * - Génère résumé + flashcards pour les chapitres valides
 * - Log détaillé de ce qui est généré/ignoré
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
      return { ok: true };
    } else {
      const err = await res.text();
      return { ok: false, error: err.substring(0, 80) };
    }
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/**
 * Audit un chapitre : est-ce que son contenu a du sens pour une fiche ?
 */
function auditChapter(content, title) {
  if (!content || content.length < 200) {
    return { valid: false, reason: 'Contenu trop court (<200 chars)' };
  }

  // Check for raw tabular data (Excel/pipes)
  const pipeCount = (content.match(/\|/g) || []).length;
  if (pipeCount > 50 && pipeCount / content.length > 0.03) {
    return { valid: false, reason: `Données tabulaires brutes (${pipeCount} pipes)` };
  }

  // Check for mostly numbers (spreadsheet data)
  const numbersOnly = content.replace(/[^0-9.,\s]/g, '');
  if (numbersOnly.length / content.length > 0.4) {
    return { valid: false, reason: 'Données numériques brutes (>40% chiffres)' };
  }

  // Check if title is just "Feuil1" or generic
  if (/^Feuil\d+$/i.test(title.trim())) {
    // Still ok if content is substantial text
    if (content.length > 500) {
      return { valid: true, reason: 'OK (titre générique mais contenu suffisant)' };
    }
    return { valid: false, reason: 'Titre "Feuil" sans contenu textuel suffisant' };
  }

  // Check for meaningful text (at least some sentences)
  const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20);
  if (sentences.length < 3 && content.length < 500) {
    return { valid: false, reason: `Pas assez de phrases (${sentences.length} phrases, ${content.length} chars)` };
  }

  return { valid: true, reason: 'OK' };
}

async function main() {
  const Database = require('better-sqlite3');
  const path = require('path');
  const db = new Database(path.join(__dirname, '..', 'data', 'revision.db'));

  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  RÉGÉNÉRATION COMPLÈTE DES FICHES           ║');
  console.log('║  Nouveau format esthétique v2               ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  // Phase 1: Supprimer toutes les anciennes fiches
  const oldCount = db.prepare('SELECT COUNT(*) as c FROM summaries').get().c;
  console.log(`🗑️  Suppression de ${oldCount} anciennes fiches...`);
  db.prepare('DELETE FROM summaries').run();
  console.log('   ✅ Toutes les fiches supprimées\n');

  // Phase 2: Auditer et lister les chapitres par matière
  const chapters = db.prepare(`
    SELECT ch.id, ch.title, ch.content, length(ch.content) as len,
           c.id as course_id, c.title as course_title, c.subject, c.tag
    FROM chapters ch
    JOIN courses c ON ch.course_id = c.id
    ORDER BY c.subject, c.id, ch.order_index
  `).all();

  console.log(`📊 ${chapters.length} chapitres à auditer\n`);

  const subjects = {};
  let totalValid = 0;
  let totalInvalid = 0;

  for (const ch of chapters) {
    if (!subjects[ch.subject]) {
      subjects[ch.subject] = { valid: [], invalid: [] };
    }

    const audit = auditChapter(ch.content, ch.title);
    if (audit.valid) {
      subjects[ch.subject].valid.push(ch);
      totalValid++;
    } else {
      subjects[ch.subject].invalid.push({ ...ch, reason: audit.reason });
      totalInvalid++;
    }
  }

  console.log(`✅ ${totalValid} chapitres valides | ❌ ${totalInvalid} chapitres ignorés\n`);

  // Phase 3: Générer les fiches
  let totalGenerated = 0;
  let totalErrors = 0;

  for (const [subject, data] of Object.entries(subjects)) {
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`📚 ${subject}`);
    console.log(`${'═'.repeat(50)}`);

    if (data.invalid.length > 0) {
      console.log(`\n  ❌ Chapitres ignorés (${data.invalid.length}):`);
      for (const ch of data.invalid) {
        console.log(`     ch.${ch.id} "${ch.title.substring(0, 40)}" — ${ch.reason}`);
      }
    }

    console.log(`\n  ✅ Chapitres valides (${data.valid.length}):`);

    for (const ch of data.valid) {
      process.stdout.write(`     ch.${ch.id} "${ch.title.substring(0, 40)}"...`);

      // Generate resume
      const resumeResult = await generateFiche(ch.id, 'resume');
      if (resumeResult.ok) {
        process.stdout.write(' 📝');
        totalGenerated++;
      } else {
        process.stdout.write(' ❌R');
        totalErrors++;
      }

      // Generate memo (flashcards)
      const memoResult = await generateFiche(ch.id, 'memo');
      if (memoResult.ok) {
        process.stdout.write(' 🃏');
        totalGenerated++;
      } else {
        process.stdout.write(' ❌M');
        totalErrors++;
      }

      console.log('');
      await sleep(50); // Small delay
    }
  }

  // Phase 4: Vérification finale
  console.log(`\n${'═'.repeat(50)}`);
  const finalCount = db.prepare('SELECT COUNT(*) as c FROM summaries').get().c;
  const resumeCount = db.prepare("SELECT COUNT(*) as c FROM summaries WHERE type = 'resume'").get().c;
  const memoCount = db.prepare("SELECT COUNT(*) as c FROM summaries WHERE type = 'memo'").get().c;

  // Check quality
  const shortFiches = db.prepare('SELECT COUNT(*) as c FROM summaries WHERE length(content) < 200').get().c;
  const emptyMemos = db.prepare("SELECT COUNT(*) as c FROM summaries WHERE type = 'memo' AND (content = '[]' OR length(content) < 5)").get().c;

  console.log('\n📊 RÉSULTAT FINAL');
  console.log(`${'─'.repeat(50)}`);
  console.log(`   Total fiches: ${finalCount}`);
  console.log(`   Résumés: ${resumeCount}`);
  console.log(`   Flashcards: ${memoCount}`);
  console.log(`   Générées: ${totalGenerated} | Erreurs: ${totalErrors}`);
  console.log(`   Fiches courtes (<200): ${shortFiches}`);
  console.log(`   Mémos vides: ${emptyMemos}`);
  console.log(`${'═'.repeat(50)}\n`);

  db.close();
}

main();
