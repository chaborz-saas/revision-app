/**
 * Script de réorganisation des cours par matière.
 *
 * Matières : Analyse Quanti, Droit, Pilotage de la Performance, RH
 * Couleurs fixes par matière :
 *   - Analyse Quanti : #06b6d4 (cyan)
 *   - Droit : #f59e0b (amber)
 *   - Pilotage de la Performance : #8b5cf6 (violet)
 *   - RH : #10b981 (emerald)
 *
 * Sous-catégories (tags) par type de document :
 *   - Cours, Exercice, Cas pratique, Examen, Corrigé, Ressource
 */

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'revision.db');
const db = new Database(DB_PATH);

// ============================================================
// Couleurs fixes par matière
// ============================================================
const SUBJECT_COLORS = {
  'Analyse Quanti': '#06b6d4',
  'Droit': '#f59e0b',
  'Pilotage de la Performance': '#8b5cf6',
  'RH': '#10b981',
};

// ============================================================
// Mapping titre DB → Matière réelle (basé sur les dossiers source)
// ============================================================
// Clé = début du titre en lowercase pour le matching
// Valeur = { subject, cleanTitle, tag }

const COURSE_MAP = {
  // ===================== ANALYSE QUANTI =====================
  1:  { subject: 'Analyse Quanti', title: 'Contrôle Continu', tag: 'Examen' },
  2:  { subject: 'Analyse Quanti', title: 'Correction Examen Track Anglo', tag: 'Corrigé' },
  3:  { subject: 'Analyse Quanti', title: 'Correction Partiel MQG 2022', tag: 'Corrigé' },
  4:  { subject: 'Analyse Quanti', title: 'Analyse des Données Quantitatives - Informations générales', tag: 'Cours' },
  5:  { subject: 'Analyse Quanti', title: 'Relation entre deux variables - Rappel', tag: 'Cours' },
  6:  { subject: 'Analyse Quanti', title: 'Relation entre deux variables - ANOVA', tag: 'Cours' },

  // ===================== DROIT =====================
  7:  { subject: 'Droit', title: 'Amazon - Conditions of Sale', tag: 'Ressource' },
  8:  { subject: 'Droit', title: 'Cas Pizzerias Siciliennes', tag: 'Cas pratique' },
  9:  { subject: 'Droit', title: 'Cas LH Wind', tag: 'Cas pratique' },
  10: { subject: 'Droit', title: 'Cas Pratique 1 CVIM', tag: 'Cas pratique' },
  11: { subject: 'Droit', title: 'Cas Pratique 2 CVIM', tag: 'Cas pratique' },
  12: { subject: 'Droit', title: 'Cas Pratique 3 CVIM', tag: 'Cas pratique' },
  13: { subject: 'Droit', title: 'Cas Pratique 4 CVIM', tag: 'Cas pratique' },
  14: { subject: 'Droit', title: 'Code de Commerce - Agent Commercial', tag: 'Ressource' },
  15: { subject: 'Droit', title: 'Corrigé Cas Pratique 1 CVIM', tag: 'Corrigé' },
  16: { subject: 'Droit', title: 'Corrigé Cas Pratique 2 CVIM', tag: 'Corrigé' },
  17: { subject: 'Droit', title: 'Corrigé Cas Pratique 3 CVIM', tag: 'Corrigé' },
  18: { subject: 'Droit', title: 'Corrigé Cas Pratique 4 CVIM', tag: 'Corrigé' },
  19: { subject: 'Droit', title: 'Droit du Contrat de Vente', tag: 'Cours' },
  20: { subject: 'Droit', title: 'Force Obligatoire du Contrat', tag: 'Cours' },
  21: { subject: 'Droit', title: 'Formation du Contrat', tag: 'Cours' },
  22: { subject: 'Droit', title: 'Incoterms & Crédit Documentaire', tag: 'Cours' },
  23: { subject: 'Droit', title: 'Contrats de Transport International - Maritime', tag: 'Cours' },
  24: { subject: 'Droit', title: 'Introduction au Contrat de Vente International', tag: 'Cours' },
  25: { subject: 'Droit', title: 'Les Echos - Agent Commercial', tag: 'Ressource' },
  26: { subject: 'Droit', title: 'Présentation Contrat International', tag: 'Cours' },
  27: { subject: 'Droit', title: 'Présentation de la CVIM', tag: 'Cours' },
  28: { subject: 'Droit', title: 'La Clause d\'Arbitrage', tag: 'Cours' },
  29: { subject: 'Droit', title: 'Le Hardship', tag: 'Cours' },
  30: { subject: 'Droit', title: 'West Side Connemara Story', tag: 'Cas pratique' },

  // ===================== PILOTAGE DE LA PERFORMANCE =====================
  31: { subject: 'Pilotage de la Performance', title: 'Bilan Social 2023', tag: 'Ressource' },
  32: { subject: 'Pilotage de la Performance', title: 'Cas EcoGreen Tech - Corrigé', tag: 'Corrigé' },
  33: { subject: 'Pilotage de la Performance', title: 'Cas EcoGreen Tech - Énoncé', tag: 'Cas pratique' },
  34: { subject: 'Pilotage de la Performance', title: 'Cas SEUROL (Écarts) - Correction', tag: 'Corrigé' },
  35: { subject: 'Pilotage de la Performance', title: 'Cas SEUROL (Écarts) - Énoncé', tag: 'Cas pratique' },
  36: { subject: 'Pilotage de la Performance', title: 'CC Pilotage Performance - Sujet Compléments', tag: 'Examen' },
  37: { subject: 'Pilotage de la Performance', title: 'CC Pilotage Performance - Sujet', tag: 'Examen' },
  38: { subject: 'Pilotage de la Performance', title: 'Corrigé Exercice Coûts Cibles', tag: 'Corrigé' },
  39: { subject: 'Pilotage de la Performance', title: 'Corrigé Exercice Masse Salariale', tag: 'Corrigé' },
  40: { subject: 'Pilotage de la Performance', title: 'Cours Analyse Qualitative', tag: 'Cours' },
  41: { subject: 'Pilotage de la Performance', title: 'Cours Pilotage de la Performance - Partie 1', tag: 'Cours' },
  42: { subject: 'Pilotage de la Performance', title: 'Cours Pilotage de la Performance - Partie 2', tag: 'Cours' },
  43: { subject: 'Pilotage de la Performance', title: 'Cours Pilotage de la Performance - Partie 4', tag: 'Cours' },
  44: { subject: 'Pilotage de la Performance', title: 'Cours Pilotage de la Performance - Partie 5', tag: 'Cours' },
  45: { subject: 'Pilotage de la Performance', title: 'Cours Pilotage de la Performance - Partie 6', tag: 'Cours' },
  46: { subject: 'Pilotage de la Performance', title: 'Cours Pilotage de la Performance - Partie 7', tag: 'Cours' },
  47: { subject: 'Pilotage de la Performance', title: 'Cas JIBI - Seuil de Rentabilité - Énoncé', tag: 'Cas pratique' },
  48: { subject: 'Pilotage de la Performance', title: 'Cas JIBI - Seuil de Rentabilité - Énoncé (doublon)', tag: 'Cas pratique' },
  49: { subject: 'Pilotage de la Performance', title: 'Cas JIBI - Seuil de Rentabilité - Corrigé', tag: 'Corrigé' },
  50: { subject: 'Pilotage de la Performance', title: 'Cas STAGNET - Coût Cible - Énoncé', tag: 'Cas pratique' },
  51: { subject: 'Pilotage de la Performance', title: 'Exercice Tableau de Bord 2 - Énoncé', tag: 'Exercice' },
  52: { subject: 'Pilotage de la Performance', title: 'Exercice Tableau de Bord 2 - Corrigé', tag: 'Corrigé' },
  53: { subject: 'Pilotage de la Performance', title: 'Exercice CdG Sociale - Énoncé', tag: 'Exercice' },
  54: { subject: 'Pilotage de la Performance', title: 'Exercice CdG Sociale - Corrigé', tag: 'Corrigé' },
  55: { subject: 'Pilotage de la Performance', title: 'Exercice Simplifié Coût Cible - Énoncé', tag: 'Exercice' },
  56: { subject: 'Pilotage de la Performance', title: 'Exercice Tableau de Bord - Énoncé', tag: 'Exercice' },
  57: { subject: 'Pilotage de la Performance', title: 'Exercice Tableau de Bord - Corrigé', tag: 'Corrigé' },
  58: { subject: 'Pilotage de la Performance', title: 'Exercice Convention de Service - Énoncé', tag: 'Exercice' },
  59: { subject: 'Pilotage de la Performance', title: 'Exercice Convention de Service - Corrigé', tag: 'Corrigé' },
  60: { subject: 'Pilotage de la Performance', title: 'Mudas - Énoncé', tag: 'Exercice' },
  61: { subject: 'Pilotage de la Performance', title: 'Mudas - Corrigé', tag: 'Corrigé' },

  // ===================== RH =====================
  62: { subject: 'RH', title: 'RH - Cours 1', tag: 'Cours' },
  63: { subject: 'RH', title: 'RH - Cours 2', tag: 'Cours' },
  64: { subject: 'RH', title: 'RH - Cours 3', tag: 'Cours' },
  65: { subject: 'RH', title: 'RH - Cours 4', tag: 'Cours' },
  66: { subject: 'RH', title: 'RH - Cours 5', tag: 'Cours' },
};

// ============================================================
// Ordre de tri dans chaque matière
// Priorité : Cours > Exercice > Cas pratique > Examen > Corrigé > Ressource
// ============================================================
const TAG_ORDER = {
  'Cours': 1,
  'Exercice': 2,
  'Cas pratique': 3,
  'Examen': 4,
  'Corrigé': 5,
  'Ressource': 6,
};

// ============================================================
// Exécution
// ============================================================
function main() {
  console.log('=== Réorganisation des cours par matière ===\n');

  // Ajouter colonne tag si elle n'existe pas
  try {
    db.exec(`ALTER TABLE courses ADD COLUMN tag TEXT DEFAULT 'Cours'`);
    console.log('✓ Colonne "tag" ajoutée à la table courses');
  } catch (e) {
    if (e.message.includes('duplicate column')) {
      console.log('→ Colonne "tag" déjà existante');
    } else {
      console.error('Erreur ajout colonne tag:', e.message);
    }
  }

  const updateStmt = db.prepare(
    `UPDATE courses SET subject = ?, title = ?, color = ?, tag = ? WHERE id = ?`
  );

  const stats = { updated: 0, skipped: 0 };

  // Créer un ordre global par matière puis par tag
  const subjectOrder = ['Analyse Quanti', 'Droit', 'Pilotage de la Performance', 'RH'];

  const updateTransaction = db.transaction(() => {
    for (const [idStr, mapping] of Object.entries(COURSE_MAP)) {
      const id = Number(idStr);
      const color = SUBJECT_COLORS[mapping.subject];

      if (!color) {
        console.error(`  ✗ Couleur non trouvée pour la matière "${mapping.subject}" (cours ${id})`);
        stats.skipped++;
        continue;
      }

      try {
        updateStmt.run(mapping.subject, mapping.title, color, mapping.tag, id);
        stats.updated++;
      } catch (err) {
        console.error(`  ✗ Erreur update cours ${id}: ${err.message}`);
        stats.skipped++;
      }
    }
  });

  updateTransaction();

  console.log(`\n✓ ${stats.updated} cours mis à jour`);
  if (stats.skipped > 0) console.log(`✗ ${stats.skipped} cours ignorés`);

  // Vérification
  console.log('\n=== Vérification ===\n');

  for (const subject of subjectOrder) {
    const courses = db.prepare(
      `SELECT id, title, subject, color, tag FROM courses WHERE subject = ? ORDER BY
       CASE tag
         WHEN 'Cours' THEN 1
         WHEN 'Exercice' THEN 2
         WHEN 'Cas pratique' THEN 3
         WHEN 'Examen' THEN 4
         WHEN 'Corrigé' THEN 5
         WHEN 'Ressource' THEN 6
         ELSE 7
       END, title`
    ).all(subject);

    console.log(`📚 ${subject} (${courses.length} cours) [${SUBJECT_COLORS[subject]}]`);
    for (const c of courses) {
      console.log(`   ${c.id}. [${c.tag}] ${c.title}`);
    }
    console.log('');
  }

  // Vérifier s'il reste des cours non mappés
  const unmapped = db.prepare(
    `SELECT id, title, subject FROM courses WHERE subject NOT IN ('Analyse Quanti', 'Droit', 'Pilotage de la Performance', 'RH')`
  ).all();

  if (unmapped.length > 0) {
    console.log('⚠️  Cours non classés :');
    for (const c of unmapped) {
      console.log(`   ${c.id}. "${c.title}" → subject="${c.subject}"`);
    }
  } else {
    console.log('✅ Tous les cours sont correctement classés !');
  }

  db.close();
  console.log('\n=== Terminé ===');
}

main();
