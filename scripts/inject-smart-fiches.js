/**
 * INJECTION FICHES DE RÉVISION v4 — COMPLÈTE
 *
 * 17 fiches thématiques reformulées par Claude après analyse approfondie des cours.
 * Chaque fiche contient : résumé pédagogique + flashcards (recto/verso)
 *
 * Répartition :
 * - Analyse Quanti : 3 fiches (Stats descriptives, Relations bivariées, ANOVA)
 * - Droit : 4 fiches (CVIM, Agent commercial, Clauses contractuelles, Cas pratiques)
 * - Pilotage : 5 fiches (Masse salariale, Tableaux de bord, Budget/Écarts, Lean/Coûts cibles, RSE)
 * - RH : 5 fiches (Fondamentaux GRH, Recrutement, Rémunération, Évaluation, Carrières)
 *
 * Usage: node scripts/inject-smart-fiches.js
 */

const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'data', 'revision.db'));

// ============================================================
// HELPERS
// ============================================================

function insertFiche(chapterId, type, content) {
  db.prepare('DELETE FROM summaries WHERE chapter_id = ? AND type = ?').run(chapterId, type);
  db.prepare('INSERT INTO summaries (chapter_id, type, content) VALUES (?, ?, ?)').run(chapterId, type, content);
}

function copyFiche(fromChapterId, toChapterId) {
  const resume = db.prepare("SELECT content FROM summaries WHERE chapter_id = ? AND type = 'resume'").get(fromChapterId);
  const memo = db.prepare("SELECT content FROM summaries WHERE chapter_id = ? AND type = 'memo'").get(fromChapterId);
  if (resume) insertFiche(toChapterId, 'resume', resume.content);
  if (memo) insertFiche(toChapterId, 'memo', memo.content);
}

// ============================================================
// 📊 ANALYSE QUANTI — 3 fiches
// ============================================================

function generateAnalyseQuantiFiches() {
  console.log('\n📊 ANALYSE QUANTI...');

  // ── Fiche 1 : Stats descriptives (ch.5, 6, 7) ──
  insertFiche(5, 'resume', `# 📊 Statistiques descriptives

---

> 💡 **En bref :** Les statistiques descriptives résument un jeu de données avec des indicateurs (moyenne, médiane, écart-type) et des graphiques. L'objectif : comprendre l'histoire que racontent les données avant toute analyse approfondie.

## 🎯 Notions clés

- **Variable quantitative** — mesurable numériquement (âge, salaire, note). On peut calculer une moyenne
- **Variable qualitative** — exprime une catégorie (sexe, couleur, département). PAS de moyenne possible
- **Variable ordinale** — qualitative avec un ordre logique (satisfaction : faible < moyen < élevé)
- **Moyenne** — somme des valeurs / nombre d'observations. Sensible aux valeurs extrêmes
- **Médiane** — valeur qui coupe l'échantillon en deux. Plus robuste que la moyenne
- **Mode** — valeur la plus fréquente. Seule mesure de tendance centrale pour les variables qualitatives
- **Écart-type** — mesure la dispersion autour de la moyenne. Plus il est grand, plus les données sont dispersées
- **Variance** — carré de l'écart-type
- **Quartiles** — Q1 (25%), Q2 (médiane, 50%), Q3 (75%). Divisent les données en 4 groupes égaux
- **Étendue** — différence entre max et min
- **Distribution normale** — forme de cloche symétrique. 68% des données à ±1 écart-type de la moyenne
- **Asymétrie (skewness)** — distribution non symétrique. Positive = queue à droite, négative = queue à gauche

## 🔢 Formules essentielles

- **Moyenne** = \`Σxi / n\`
- **Variance** = \`Σ(xi - x̄)² / n\`
- **Écart-type** = \`√Variance\`
- **Coefficient de variation** = \`(Écart-type / Moyenne) × 100\` → compare la dispersion entre deux séries

## 💡 Exemples concrets

> **RH** : "Âge moyen logistique = 35 ans (écart-type 8), comptabilité = 42 ans" → logistique plus jeune et homogène.

> **Marketing** : "Note satisfaction moyenne = 4.2/5, médiane = 4.8/5" → la moyenne est tirée vers le bas par quelques clients très mécontents. La majorité est satisfaite.

## ⚠️ Pièges à éviter

- Ne JAMAIS calculer une moyenne sur une variable qualitative (ex : moyenne des codes postaux = absurde)
- Toujours regarder médiane + moyenne ensemble pour détecter les outliers
- Règle 68-95-99 : dans une distribution normale, 68% à ±1σ, 95% à ±2σ, 99.7% à ±3σ

---

> 🧠 **Méthode :** Avant toute analyse → décrire les données, vérifier le type de variable, regarder moyenne + médiane + écart-type.`);

  insertFiche(5, 'memo', JSON.stringify([
    {"recto": "Quelle différence entre variable **quantitative** et **qualitative** ?", "verso": "Quantitative = mesurable numériquement (âge, salaire) → on peut calculer une moyenne.\nQualitative = catégorie (sexe, couleur) → pas de moyenne possible."},
    {"recto": "Comment calcule-t-on la **moyenne** ?", "verso": "Moyenne = Σxi / n (somme des valeurs divisée par le nombre d'observations)"},
    {"recto": "Différence entre **moyenne** et **médiane** ?", "verso": "La moyenne est sensible aux valeurs extrêmes. La médiane coupe l'échantillon en deux parties égales et résiste aux outliers."},
    {"recto": "Qu'est-ce que le **mode** ?", "verso": "La valeur la plus fréquente. C'est la seule mesure de tendance centrale utilisable pour les variables qualitatives."},
    {"recto": "Formule de l'**écart-type** ?", "verso": "Écart-type = √Variance = √(Σ(xi - x̄)² / n). Mesure la dispersion des données autour de la moyenne."},
    {"recto": "Que signifient **Q1, Q2, Q3** ?", "verso": "Q1 = 25% des données en dessous\nQ2 = médiane (50%)\nQ3 = 75% des données en dessous\nIls divisent les données en 4 groupes."},
    {"recto": "Qu'est-ce qu'un **outlier** ?", "verso": "Une valeur aberrante, très éloignée des autres. Peut fausser la moyenne et l'écart-type. Toujours vérifier si c'est une erreur ou une vraie observation."},
    {"recto": "Peut-on calculer une moyenne sur des **codes postaux** ?", "verso": "Non ! Ce sont des variables qualitatives (catégories). Calculer leur moyenne n'a aucun sens."},
    {"recto": "À quoi sert le **coefficient de variation** ?", "verso": "CV = (Écart-type / Moyenne) × 100. Permet de comparer la dispersion entre deux séries ayant des unités différentes."},
    {"recto": "Règle **68-95-99** pour une distribution normale ?", "verso": "68% des données à ±1 écart-type\n95% à ±2 écart-types\n99.7% à ±3 écart-types de la moyenne"},
    {"recto": "Dans une distribution **asymétrique à droite**, moyenne vs médiane ?", "verso": "Moyenne > médiane, car tirée vers le haut par les valeurs extrêmes à droite."}
  ]));

  copyFiche(5, 6);
  copyFiche(5, 7);

  // ── Fiche 2 : Relations bivariées (ch.8, 9) ──
  insertFiche(8, 'resume', `# 📊 Relations entre deux variables

---

> 💡 **En bref :** L'analyse bivariée étudie le lien entre deux variables. Selon leur type (quanti ou quali), on utilise différents tests pour savoir si une relation existe et quelle est sa force.

## 🎯 Notions clés

- **Corrélation** — force et sens du lien LINÉAIRE entre 2 variables quantitatives. De -1 à +1
- **Coefficient r de Pearson** — r = 0 → aucun lien linéaire, r = ±1 → relation parfaite
- **Causalité ≠ Corrélation** — deux variables corrélées ne veut pas dire que l'une cause l'autre
- **Test du Khi-deux (χ²)** — teste l'indépendance entre 2 variables qualitatives
- **p-value** — probabilité d'observer le résultat si H0 est vraie. Si p < 0.05 → relation significative
- **Hypothèse nulle (H0)** — "il n'y a pas de relation". On cherche à la rejeter
- **Seuil α = 0.05** — risque maximal de se tromper qu'on accepte
- **Régression linéaire** — modélise Y = aX + b
- **R²** — % de variance de Y expliquée par X. R² = 0.75 → X explique 75% de la variation de Y
- **Significatif mais faible** — r = 0.16 avec p < 0.05 est significatif mais R² = 2.6% → négligeable en pratique

## 🔢 Formules

- **r de Pearson** = \`Σ(xi-x̄)(yi-ȳ) / √[Σ(xi-x̄)² × Σ(yi-ȳ)²]\`
- **R²** = r² (carré de la corrélation)
- **Khi-deux** = \`Σ (Observé - Théorique)² / Théorique\`
- **Effectif théorique** = \`(Total ligne × Total colonne) / Total général\`

## 📋 Quel test choisir ?

| Variables | Test |
|-----------|------|
| Quanti × Quanti | Corrélation de Pearson / Régression |
| Quali × Quali | Khi-deux (χ²) |
| Quali × Quanti (3+ groupes) | ANOVA |

## ⚠️ Pièges

- **Corrélation ≠ Causalité** — LE piège n°1 en stats
- **Significatif ≠ Important** — vérifier R² en plus de la p-value
- Le Khi-deux nécessite des effectifs théoriques ≥ 5

---

> 🧠 **En examen :** Pour r = 0.16 avec p < 0.05, dire : "Statistiquement significatif mais R² = 2.6%, donc pratiquement négligeable. Dangereux de baser une décision dessus."`);

  insertFiche(8, 'memo', JSON.stringify([
    {"recto": "Que mesure le **coefficient r** de Pearson ?", "verso": "La force et le sens de la relation LINÉAIRE entre deux variables quantitatives. De -1 à +1."},
    {"recto": "Différence **corrélation** vs **causalité** ?", "verso": "La corrélation mesure un lien statistique. La causalité implique que l'une CAUSE l'autre. Corrélation possible à cause d'une variable confondante."},
    {"recto": "Qu'est-ce que la **p-value** ?", "verso": "Probabilité d'observer nos résultats SI H0 est vraie. Si p < 0.05 → on rejette H0 → relation significative."},
    {"recto": "Quand utiliser le **Khi-deux** ?", "verso": "Pour tester l'indépendance entre 2 variables QUALITATIVES. Compare effectifs observés vs théoriques."},
    {"recto": "Que signifie **R² = 0.60** ?", "verso": "60% de la variance de Y est expliquée par X. 40% dus à d'autres facteurs."},
    {"recto": "r = 0.15 avec p = 0.03, résultat **important** ?", "verso": "Non ! Significatif (p < 0.05) mais R² = 2.3% → négligeable en pratique."},
    {"recto": "Formule **effectif théorique** ?", "verso": "Effectif théorique = (Total ligne × Total colonne) / Total général. Si tous ≥ 5, le Khi-deux est valide."},
    {"recto": "Test pour 2 variables **quantitatives** ?", "verso": "Corrélation de Pearson (force du lien) et/ou régression linéaire (Y = aX + b)."},
    {"recto": "Test pour 2 variables **qualitatives** ?", "verso": "Test du Khi-deux d'indépendance, sur un tableau croisé (contingence)."},
    {"recto": "Comment interpréter un **coefficient β = 2.5** en régression ?", "verso": "Quand X augmente d'une unité, Y augmente de 2.5 unités, toutes autres variables constantes."}
  ]));

  copyFiche(8, 9);

  // ── Fiche 3 : ANOVA (ch.10, 11) ──
  insertFiche(10, 'resume', `# 📊 L'ANOVA — Analyse de la Variance

---

> 💡 **En bref :** L'ANOVA compare les moyennes de 3+ groupes. Elle analyse si les différences observées sont statistiquement significatives ou dues au hasard.

## 🎯 Notions clés

- **ANOVA** — Analysis Of Variance. Compare les moyennes de 3+ groupes
- **Variable dépendante** — ce qu'on mesure (quantitative) : CA, score, temps
- **Variable indépendante (facteur)** — ce qui définit les groupes (qualitative) : région, département
- **Variance inter-groupes** — variabilité ENTRE les groupes. Grande = groupes différents
- **Variance intra-groupe** — variabilité DANS chaque groupe. C'est le "bruit" naturel
- **F de Fisher** — ratio inter/intra. Plus F est grand, plus la différence est significative
- **Test post-hoc** — après ANOVA significative, identifie QUELS groupes diffèrent (Tukey, Bonferroni)
- **Conditions** — normalité, homogénéité des variances (Levene), indépendance des observations

## 🔢 Formules

- **F** = \`Variance inter / Variance intra\`
- **df inter** = k - 1 (k = nombre de groupes)
- **df intra** = N - k (N = total observations)

## 💡 Exemple

> On teste si le CA diffère selon 4 régions. F = 5.23, p = 0.002. On rejette H0 → au moins une région diffère. Test de Tukey → c'est la région Sud.

## 📋 Quand utiliser l'ANOVA ?

1. Variable dépendante **quantitative**
2. Variable indépendante **qualitative avec 3+ modalités**
3. On veut **comparer les moyennes**

## ⚠️ Attention

- L'ANOVA dit "il y a une différence" mais pas OÙ → test post-hoc obligatoire
- Si 2 groupes seulement → t-test suffit
- Vérifier normalité + homoscédasticité

---

> 🧠 **À retenir :** ANOVA = comparer 3+ moyennes. Grand F = différences significatives. Toujours faire un post-hoc après.`);

  insertFiche(10, 'memo', JSON.stringify([
    {"recto": "Qu'est-ce que l'**ANOVA** et quand l'utiliser ?", "verso": "ANalysis Of VAriance. Compare les moyennes de 3+ groupes. Variable dépendante quantitative, indépendante qualitative."},
    {"recto": "Que mesure la **F-statistique** ?", "verso": "F = Variance inter / Variance intra. Plus F est grand, plus les différences entre groupes sont importantes."},
    {"recto": "Résultat ANOVA **significatif** (p < 0.05) — que conclure ?", "verso": "Au moins une moyenne de groupe est significativement différente. Mais l'ANOVA ne dit pas laquelle → test post-hoc."},
    {"recto": "Qu'est-ce qu'un **test post-hoc** ?", "verso": "Test complémentaire (Tukey, Bonferroni) après ANOVA significative pour identifier QUELS groupes diffèrent."},
    {"recto": "**Conditions** d'application de l'ANOVA ?", "verso": "1. Normalité des distributions\n2. Homogénéité des variances (test de Levene)\n3. Indépendance des observations"},
    {"recto": "Différence **variance inter** vs **intra** ?", "verso": "Inter = variabilité ENTRE groupes (moyennes différentes ?)\nIntra = variabilité DANS chaque groupe (bruit naturel)"},
    {"recto": "Si **2 groupes** seulement, quel test ?", "verso": "Un t-test de Student suffit. ANOVA et t-test donnent le même résultat avec 2 groupes."},
    {"recto": "**df inter** et **df intra** en ANOVA ?", "verso": "df inter = k - 1 (k = nombre de groupes)\ndf intra = N - k (N = total observations)"}
  ]));

  copyFiche(10, 11);

  // Fiche méthodologie examen (ch.2, 3)
  insertFiche(2, 'resume', `# 📊 Méthodologie d'examen — Analyse Quantitative

---

> 💡 **En bref :** Les pièges classiques d'examen et la méthodologie pour répondre aux questions de statistiques.

## 🎯 Points clés pour l'examen

- **Toujours identifier le type de variable** avant de choisir un test
- **Significatif ≠ Important** — vérifier R² en plus de la p-value
- **Régression multiple** — plusieurs variables indépendantes. Interpréter chaque coefficient "toutes choses égales par ailleurs"
- **Variables de contrôle** — isolent l'effet de la variable d'intérêt
- **Multi-colinéarité** — 2 variables indépendantes très corrélées → coefficients instables
- **Qualité du modèle** — R² ajusté, F-test global, significativité individuelle

## 💡 Réflexes d'examen

> Pour r = 0.16 avec p < 0.05 → "Statistiquement significatif mais R² = 2.6%, négligeable en pratique."

> Pour β = 2.5 → "Chaque augmentation d'une unité de X entraîne une variation de 2.5 de Y, toutes choses égales par ailleurs."

---

> 🧠 **Règle d'or :** Ne jamais se contenter de la p-value. Toujours discuter la taille de l'effet et les implications pratiques.`);

  insertFiche(2, 'memo', JSON.stringify([
    {"recto": "r = 0.16 avec p = 0.03 — que dire en examen ?", "verso": "Statistiquement significatif MAIS R² = 2.6% → négligeable en pratique. Ne pas baser de décision dessus."},
    {"recto": "Qu'est-ce qu'une **variable de contrôle** ?", "verso": "Variable ajoutée au modèle pour isoler l'effet de la variable d'intérêt (ex: contrôler l'âge et le revenu pour étudier l'effet du stress)."},
    {"recto": "Comment interpréter **β = 2.5** en régression ?", "verso": "Quand X augmente d'une unité, Y augmente de 2.5 unités, toutes les autres variables étant constantes."},
    {"recto": "Qu'est-ce que la **multi-colinéarité** ?", "verso": "Quand 2 variables indépendantes sont très corrélées entre elles → coefficients instables et difficiles à interpréter."},
    {"recto": "Comment évaluer la **qualité d'un modèle** de régression ?", "verso": "1. R² ajusté (% variance expliquée)\n2. F-test global (modèle significatif ?)\n3. p-value de chaque coefficient β"}
  ]));

  copyFiche(2, 3);
  copyFiche(2, 4);

  console.log('  ✅ 3 fiches thématiques + 1 méthodologie');
}

// ============================================================
// ⚖️ DROIT — 4 fiches
// ============================================================

function generateDroitFiches() {
  console.log('\n⚖️ DROIT...');

  // ── Fiche 1 : La CVIM (ch.23, 24, 25, 26, 28, 29, 30, 31) ──
  insertFiche(23, 'resume', `# ⚖️ La Convention de Vienne (CVIM) — Vente Internationale

---

> 💡 **En bref :** La CVIM (Convention de Vienne sur la Vente Internationale de Marchandises, 1980) est le texte de référence pour les contrats de vente internationale. Elle s'applique automatiquement quand les deux parties sont dans des États signataires (sauf exclusion expresse).

## 🎯 Notions clés

- **Champ d'application (art. 1)** — S'applique aux ventes de marchandises entre parties ayant leur établissement dans des États différents, tous deux signataires
- **Conformité (art. 35)** — Le vendeur doit livrer des marchandises conformes en quantité, qualité, description, et propres à leur usage habituel
- **Examen rapide (art. 38)** — L'acheteur doit examiner la marchandise dans un délai aussi bref que possible après réception
- **Notification (art. 39)** — L'acheteur doit signaler tout défaut dans un délai raisonnable (2-4 semaines en pratique)
- **Violation essentielle (art. 25)** — Un manquement si grave que l'autre partie est privée de ce qu'elle attendait du contrat
- **Résolution du contrat (art. 49/64)** — Possible uniquement en cas de violation essentielle ou après délai supplémentaire (Nachfrist)
- **Transfert des risques (art. 67-69)** — Selon les Incoterms : FOB = risques transférés à la remise au transporteur

## 📋 Obligations des parties

| Vendeur | Acheteur |
|---------|----------|
| Livrer conforme (art. 35) | Payer le prix (art. 53) |
| Respecter le délai (art. 33) | Prendre livraison (art. 60) |
| Transférer la propriété (art. 30) | Examiner rapidement (art. 38) |

## 🔢 Recours possibles

**Pour l'acheteur (défaut de conformité) :**
- Réduction du prix (art. 50)
- Remplacement si violation essentielle (art. 46)
- Dommages et intérêts (art. 74)
- Résolution du contrat (art. 49)

**Pour le vendeur (non-paiement) :**
- Exiger le paiement (art. 62)
- Résolution après mise en demeure (art. 64)
- Dommages et intérêts (art. 74)
- Intérêts de retard (art. 78)

## 💡 Incoterms importants

- **FOB** (Free On Board) — risques transférés quand la marchandise est à bord du navire
- **CIF** — vendeur paie le fret et l'assurance
- **DDP** — vendeur supporte tous les risques jusqu'à destination

## ⚠️ Points d'attention

- La réclamation tardive (> 4 semaines) peut rendre les recours irrecevables
- La CVIM ne fixe PAS le taux d'intérêt → renvoi au droit national
- Le devoir de **limitation du dommage** (art. 77) — la partie lésée doit minimiser son préjudice

---

> 🧠 **Méthode en cas pratique :** 1) La CVIM s'applique-t-elle ? 2) Quel manquement ? 3) Délai de réclamation respecté ? 4) Violation essentielle ou non ? 5) Quels recours ?`);

  insertFiche(23, 'memo', JSON.stringify([
    {"recto": "Quand la **CVIM** s'applique-t-elle automatiquement ?", "verso": "Quand le contrat porte sur une vente de marchandises entre parties ayant leur établissement dans 2 États différents, tous deux signataires de la Convention (art. 1 §1 a)."},
    {"recto": "Qu'est-ce que la **conformité** selon la CVIM (art. 35) ?", "verso": "Le vendeur doit livrer des marchandises conformes en quantité, qualité et description, et propres à leur usage habituel."},
    {"recto": "Quel est le délai pour **signaler un défaut** (art. 38-39) ?", "verso": "L'acheteur doit examiner la marchandise le plus vite possible (art. 38) et notifier le défaut dans un délai raisonnable (art. 39). En pratique : 2 à 4 semaines."},
    {"recto": "Qu'est-ce qu'une **violation essentielle** (art. 25) ?", "verso": "Un manquement si grave que l'autre partie est privée de ce qu'elle attendait du contrat. Seule cette violation permet la résolution du contrat."},
    {"recto": "Quels sont les **recours de l'acheteur** en cas de défaut ?", "verso": "1. Réduction du prix (art. 50)\n2. Remplacement si violation essentielle (art. 46)\n3. Dommages et intérêts (art. 74)\n4. Résolution du contrat (art. 49)"},
    {"recto": "Que signifie **FOB** pour le transfert des risques ?", "verso": "Free On Board : les risques sont transférés à l'acheteur quand la marchandise est remise au transporteur (à bord du navire)."},
    {"recto": "Quels recours pour le **vendeur** en cas de non-paiement ?", "verso": "Exiger le paiement (art. 62), résolution après mise en demeure (art. 64), dommages et intérêts (art. 74), intérêts de retard (art. 78)."},
    {"recto": "Qu'est-ce que le **Nachfrist** (délai supplémentaire) ?", "verso": "Mécanisme permettant de fixer un délai supplémentaire raisonnable pour exécuter. Si ce délai expire sans exécution → résolution possible."},
    {"recto": "La CVIM fixe-t-elle le **taux d'intérêt** de retard ?", "verso": "Non ! L'art. 78 donne droit aux intérêts mais le taux est déterminé par le droit national applicable."},
    {"recto": "Qu'est-ce que le devoir de **limitation du dommage** (art. 77) ?", "verso": "La partie lésée doit prendre des mesures raisonnables pour minimiser son préjudice (ex : trouver un autre fournisseur/acheteur)."}
  ]));

  // Copy CVIM fiche to all CVIM chapters
  [24, 25, 26, 28, 29, 30, 31].forEach(id => copyFiche(23, id));

  // ── Fiche 2 : L'Agent Commercial (ch.27, 38, 22) ──
  insertFiche(27, 'resume', `# ⚖️ L'Agent Commercial — Statut et Protection

---

> 💡 **En bref :** L'agent commercial est un mandataire indépendant qui négocie/conclut des contrats au nom d'un commettant. Il bénéficie d'un statut protecteur prévu par le Code de commerce (art. L134-1 à L134-17), notamment une indemnité de fin de contrat.

## 🎯 Notions clés

- **Définition (art. L134-1)** — Mandataire indépendant, chargé de façon permanente de négocier et conclure des contrats au nom et pour le compte d'un commettant
- **Indépendance** — L'agent n'est PAS salarié. Il organise librement son activité
- **Exclusivité** — Peut représenter plusieurs commettants, SAUF concurrents directs (sauf accord)
- **Obligations réciproques (art. L134-4)** — Loyauté et information mutuelles. L'agent agit en "bon professionnel"
- **Commission** — Rémunération sur les ventes réalisées. Due même si le client a été trouvé par l'agent pendant le contrat et commande après
- **Durée** — Contrat à durée déterminée ou indéterminée. Préavis de 1 à 3 mois selon l'ancienneté

## 💰 L'indemnité de fin de contrat

C'est LE point essentiel du statut :

- **Montant** — Jurisprudence constante : environ **2 ans de commissions** brutes
- **Conditions** — Due en cas de résiliation par le commettant, sauf faute grave de l'agent
- **Aussi due** en cas de cessation pour raison de santé, âge ou décès de l'agent
- **NON due** si l'agent résilie lui-même (sauf motifs légitimes : faute du commettant, âge, santé)
- **Prescription** — 1 an après la cessation pour la réclamer

## 📋 Décision CJUE du 4 juin 2020

La Cour de Justice de l'UE a élargi la définition de l'agent commercial :
- **Avant** : la Cour de cassation française exigeait que l'agent ait le pouvoir de modifier les conditions (prix, remises)
- **Après** : il suffit que l'agent **négocie** les ventes, même sans pouvoir de modifier les termes
- **Conséquence** : plus de personnes qualifiées d'agents commerciaux → plus de protections

## 💡 Cas pratique — LH Wind

> Diego, agent commercial depuis 25 ans, voit son contrat résilié par BOT Inc. après 14 ans. Questions clés : quelle loi applicable ? droit à l'indemnité ? Le contrat avec une clause de loi californienne pose le problème de l'application impérative du droit européen de l'agent commercial.

---

> 🧠 **À retenir :** L'agent commercial est très protégé en droit européen. Le commettant doit quasi-systématiquement verser ~2 ans de commissions à la fin du contrat.`);

  insertFiche(27, 'memo', JSON.stringify([
    {"recto": "Qu'est-ce qu'un **agent commercial** (art. L134-1) ?", "verso": "Un mandataire indépendant, chargé de façon permanente de négocier et conclure des contrats au nom et pour le compte d'un commettant. Pas un salarié."},
    {"recto": "Quelle est l'**indemnité de fin de contrat** de l'agent commercial ?", "verso": "Environ 2 ans de commissions brutes (jurisprudence constante). Due en cas de résiliation par le commettant, sauf faute grave de l'agent."},
    {"recto": "L'agent peut-il représenter des **concurrents** ?", "verso": "Non, sauf accord du commettant. Il peut représenter plusieurs commettants non concurrents librement."},
    {"recto": "Quelles sont les **obligations réciproques** agent/commettant ?", "verso": "Loyauté et information mutuelles (art. L134-4). L'agent doit agir en bon professionnel. Le contrat est dans l'intérêt commun des parties."},
    {"recto": "Quand l'indemnité est-elle **NON due** ?", "verso": "1. Faute grave de l'agent\n2. L'agent résilie lui-même (sauf motifs légitimes)\n3. L'agent cède son contrat à un tiers avec accord du commettant"},
    {"recto": "Quel **délai** pour réclamer l'indemnité ?", "verso": "1 an après la cessation du contrat (prescription)."},
    {"recto": "Qu'a changé la **CJUE le 4 juin 2020** ?", "verso": "Élargi la définition : il suffit que l'agent négocie, même sans pouvoir de modifier les conditions. Plus de personnes protégées par le statut."},
    {"recto": "Quel est le **préavis** de l'agent commercial ?", "verso": "1 mois la 1ère année, 2 mois la 2ème, 3 mois à partir de la 3ème année d'ancienneté."},
    {"recto": "L'indemnité est-elle due en cas de **décès** de l'agent ?", "verso": "Oui ! L'indemnité est due aux héritiers en cas de décès de l'agent commercial."}
  ]));

  copyFiche(27, 38);
  copyFiche(27, 22);

  // ── Fiche 3 : Clauses contractuelles internationales (ch.41, 42, 12) ──
  insertFiche(41, 'resume', `# ⚖️ Clauses clés du Commerce International

---

> 💡 **En bref :** Dans un contrat international, certaines clauses sont cruciales pour gérer les risques : la clause d'arbitrage, le hardship, et les conditions générales de vente. Comprendre ces mécanismes est essentiel.

## 🎯 La Clause d'Arbitrage

- **Définition** — Clause compromissoire qui prévoit qu'en cas de litige, les parties saisissent un tribunal arbitral au lieu des tribunaux étatiques
- **Avantages** — Confidentialité, rapidité, expertise des arbitres, neutralité
- **Portée large** — Couvre tous les litiges "de quelque nature que ce soit" liés au contrat
- **Extension** — Peut s'étendre aux garanties bancaires liées au contrat, même si le garant n'est pas partie au contrat
- **Principe** — En droit français, la clause d'arbitrage international est valide indépendamment de tout droit étatique (autonomie)

## 🎯 Le Hardship (Imprévision)

- **Définition (art. 6.2.2 Principes UNIDROIT)** — Quand des événements imprévus modifient fondamentalement l'équilibre du contrat
- **Conditions** : les événements doivent être :
  - Postérieurs à la conclusion du contrat
  - Imprévisibles au moment de la conclusion
  - Hors du contrôle de la partie lésée
  - Le risque n'a pas été assumé par la partie lésée
- **Effets** — La partie lésée peut demander une **renégociation** (mais ne peut PAS suspendre l'exécution)
- **Si pas d'accord** — Le tribunal peut adapter le contrat ou le résilier

## 🎯 Formation du contrat (Amazon comme exemple)

- **Offre et acceptation** — La commande = offre de l'acheteur. Le contrat n'est formé qu'à l'expédition (email de confirmation d'expédition)
- **Droit de rétractation** — 14 jours pour le consommateur (sauf produits personnalisés, logiciels ouverts, etc.)
- **Droit applicable** — Amazon = droit luxembourgeois, mais le consommateur bénéficie des lois impératives de son pays de résidence
- **Exclusion de la CVIM** — Amazon exclut expressément l'application de la Convention de Vienne

---

> 🧠 **À retenir :** Arbitrage = alternative aux tribunaux. Hardship = renégociation quand l'équilibre est rompu. Le consommateur européen est protégé par les lois impératives de son pays.`);

  insertFiche(41, 'memo', JSON.stringify([
    {"recto": "Qu'est-ce qu'une **clause d'arbitrage** (compromissoire) ?", "verso": "Clause prévoyant qu'en cas de litige, les parties saisissent un tribunal arbitral au lieu des tribunaux étatiques. Avantages : confidentialité, rapidité, expertise, neutralité."},
    {"recto": "Qu'est-ce que le **hardship** (imprévision) ?", "verso": "Situation où des événements imprévus modifient fondamentalement l'équilibre du contrat. La partie lésée peut demander une renégociation."},
    {"recto": "Quelles sont les **4 conditions** du hardship ?", "verso": "1. Événements postérieurs au contrat\n2. Imprévisibles à la conclusion\n3. Hors du contrôle de la partie lésée\n4. Risque non assumé par elle"},
    {"recto": "La partie en hardship peut-elle **suspendre** ses obligations ?", "verso": "Non ! Elle doit continuer à exécuter pendant la demande de renégociation. Seul le tribunal peut adapter ou résilier le contrat."},
    {"recto": "Quand se forme le contrat sur **Amazon** ?", "verso": "À l'expédition du produit (email de confirmation d'expédition), pas à la commande. L'email de confirmation de commande n'est qu'un accusé de réception."},
    {"recto": "Quel est le **droit de rétractation** du consommateur ?", "verso": "14 jours à compter de la réception pour retourner le produit, sans motif. Ne s'applique pas aux logiciels ouverts, produits personnalisés, etc."},
    {"recto": "Pourquoi Amazon **exclut** la CVIM ?", "verso": "Amazon choisit le droit luxembourgeois et exclut expressément la Convention de Vienne dans ses CGV."},
    {"recto": "Un consommateur français sur Amazon est-il protégé par le **droit français** ?", "verso": "Oui ! Malgré le choix du droit luxembourgeois, le consommateur bénéficie des dispositions impératives de son pays de résidence."}
  ]));

  copyFiche(41, 42);
  [12, 13, 14, 15, 16, 17, 18, 19].forEach(id => copyFiche(41, id));

  // ── Fiche 4 : Cas pratiques Droit (ch.20, 21, 43) ──
  insertFiche(20, 'resume', `# ⚖️ Cas Pratiques — Méthodologie et Exemples

---

> 💡 **En bref :** En droit du commerce international, les cas pratiques testent votre capacité à appliquer la CVIM, identifier les problèmes juridiques, et proposer des solutions argumentées.

## 📋 Méthodologie du cas pratique

1. **Qualifier les faits** — Identifier les parties, le type de contrat, les pays concernés
2. **Déterminer le droit applicable** — CVIM ? Droit national ? Exclusion contractuelle ?
3. **Identifier les problèmes juridiques** — Conformité ? Retard ? Non-paiement ? Hardship ?
4. **Appliquer les règles** — Citer les articles précis de la CVIM
5. **Conclure** — Proposer une solution argumentée

## 💡 Cas Pizzerias Siciliennes — Les points clés

- **Contexte** — Contrat entre un restaurateur français et un fabricant de meubles en teck (Lozère)
- **Problème** — Grèves en Inde → le fournisseur ne peut pas livrer à temps
- **Questions juridiques** — Force majeure ? Hardship ? Le retard justifie-t-il la résolution ?
- **Leçon** — L'importance des clauses de force majeure et de hardship dans les contrats

## 💡 Cas West Side Connemara — Les points clés

- **Contexte** — Architecte irlandais achète un poney islandais via une vente à Copenhague
- **CVIM applicable ?** — Oui si Irlande et Islande sont signataires, vente entre établissements dans 2 États différents
- **Problèmes** — Conformité du poney, vices cachés, réclamation dans les délais
- **Leçon** — Même pour des biens inhabituels (animaux), la CVIM peut s'appliquer

## 📋 Synthèse des 4 cas CVIM

| Cas | Problème | Articles clés |
|-----|----------|---------------|
| Vins France-Allemagne | Défaut de conformité + délai réclamation | Art. 35, 38, 39, 50 |
| Machines Italie-France | Retard de livraison + violation essentielle | Art. 25, 33, 49, 74 |
| Moteurs France-Espagne | Non-paiement | Art. 53, 62, 64, 74, 78 |
| TV France-Suède | Transfert des risques (FOB) | Art. 67, 36, 62 |

---

> 🧠 **En examen :** Toujours structurer : 1) Droit applicable, 2) Obligations violées, 3) Recours possibles. Citer les articles !`);

  insertFiche(20, 'memo', JSON.stringify([
    {"recto": "Les **5 étapes** d'un cas pratique en droit international ?", "verso": "1. Qualifier les faits\n2. Déterminer le droit applicable\n3. Identifier les problèmes juridiques\n4. Appliquer les règles (citer les articles)\n5. Conclure avec une solution argumentée"},
    {"recto": "Dans le cas des **vins France-Allemagne**, la réclamation est-elle recevable ?", "verso": "Risque d'être jugée tardive : l'acheteur a signalé le défaut 1 mois après réception. La pratique retient 2-4 semaines comme délai raisonnable (art. 39)."},
    {"recto": "Dans le cas des **machines Italie-France**, le retard est-il une violation essentielle ?", "verso": "Oui si le délai était essentiel (livraison à date fixe pour un contrat en aval). L'acheteur a perdu un contrat à cause du retard → privé de ce qu'il attendait du contrat (art. 25)."},
    {"recto": "Dans le cas des **TV France-Suède**, qui supporte les dommages pendant le transport ?", "verso": "L'acheteur ! En FOB, les risques sont transférés à la remise au transporteur (art. 67). L'acheteur doit agir contre le transporteur, pas le vendeur."},
    {"recto": "Dans le cas du **non-paiement France-Espagne**, le vendeur peut-il résoudre le contrat ?", "verso": "Oui, après mise en demeure avec délai supplémentaire (art. 64 §1 b). Le vendeur peut aussi exiger le paiement (art. 62) + dommages et intérêts (art. 74)."},
    {"recto": "Quand les **risques** sont-ils transférés en Incoterm **FOB** ?", "verso": "Quand la marchandise est remise au transporteur désigné par l'acheteur (mise à bord du navire au port d'embarquement)."},
    {"recto": "Différence entre **force majeure** et **hardship** ?", "verso": "Force majeure = exécution IMPOSSIBLE (événement irrésistible)\nHardship = exécution encore possible mais BEAUCOUP plus onéreuse → renégociation"}
  ]));

  copyFiche(20, 21);
  copyFiche(20, 43);

  console.log('  ✅ 4 fiches thématiques');
}

// ============================================================
// 📈 PILOTAGE DE LA PERFORMANCE — 5 fiches
// ============================================================

function generatePilotageFiches() {
  console.log('\n📈 PILOTAGE DE LA PERFORMANCE...');

  // ── Fiche 1 : Masse salariale et CdG sociale (ch.68, 69, 70, 71) ──
  insertFiche(68, 'resume', `# 📈 Masse Salariale et Contrôle de Gestion Sociale

---

> 💡 **En bref :** Le contrôle de gestion sociale pilote les coûts et performances RH. La masse salariale est LE premier poste de charges de l'entreprise. Comprendre ses facteurs d'évolution est essentiel pour tout manager.

## 🎯 Notions clés

- **Masse salariale** — Somme totale que l'entreprise consacre à la rémunération de ses salariés sur une période
- **Calcul** : Rémunérations nettes + charges sociales = brut. Brut + charges patronales = masse salariale
- **Contrôle de gestion sociale** — "Système d'aide au pilotage social ayant pour objectif de contribuer à la gestion des RH dans leurs performances et leurs coûts" (Martory)

## 📊 Les 4 facteurs d'évolution de la masse salariale

| Facteur | Description |
|---------|-------------|
| 1. **Variation d'activité** | Heures sup, chômage partiel, temps partiel, grèves |
| 2. **Effectifs** | Entrées, sorties, promotions, CDD, intérim |
| 3. **Augmentations générales/catégorielles** | Négociées collectivement, touchent tous les salariés |
| 4. **Mesures individuelles (GVT)** | Glissement, Vieillissement, Technicité |

## 🔢 Les effets sur la masse salariale

- **Effet de Noria** — Impact du remplacement de salariés anciens (chers) par des jeunes (moins chers). Généralement négatif (réduit la masse salariale)
- **Formule** : Nb remplacements × (salaire entrant - salaire sortant)
- **Effet d'effectif** — Impact de la variation du nombre de salariés
- **Formule** : Nb entrées × coût d'une entrée
- **Effet GVT** — Glissement (promotions individuelles), Vieillissement (ancienneté), Technicité (qualifications)

## 📋 GEPP (ex-GPEC)

- **Définition** — Gestion des Emplois et des Parcours Professionnels : démarche prévisionnelle pour anticiper les écarts entre besoins et ressources en compétences
- **4 étapes** : 1) Identifier les compétences, 2) Anticiper les besoins, 3) Développer les compétences (formation, VAE), 4) Valoriser et rémunérer

## 💡 Exemple chiffré

> Noria : 10 remplacements × (20 000 - 40 000) = **-200 000 €**
> Effet effectif : 5 entrées × 20 000 = **+100 000 €**
> Variation totale = **-100 000 €** (la masse salariale diminue)

---

> 🧠 **À retenir :** La masse salariale = 1er poste de charges. Les 4 facteurs d'évolution sont toujours à analyser dans cet ordre : activité, effectifs, augmentations collectives, mesures individuelles.`);

  insertFiche(68, 'memo', JSON.stringify([
    {"recto": "Qu'est-ce que la **masse salariale** ?", "verso": "Somme totale consacrée à la rémunération des salariés. Calcul : salaires nets + charges sociales = brut + charges patronales = masse salariale."},
    {"recto": "Quels sont les **4 facteurs** d'évolution de la masse salariale ?", "verso": "1. Variation d'activité (heures sup, chômage partiel)\n2. Effectifs (entrées/sorties)\n3. Augmentations générales/catégorielles\n4. Mesures individuelles (GVT)"},
    {"recto": "Qu'est-ce que l'**effet de Noria** ?", "verso": "L'impact du remplacement de salariés anciens (chers) par des jeunes (moins chers). Généralement négatif = réduit la masse salariale."},
    {"recto": "Que signifie **GVT** ?", "verso": "Glissement (promotions individuelles), Vieillissement (progression d'ancienneté), Technicité (évolution des qualifications)."},
    {"recto": "Qu'est-ce que la **GEPP** (ex-GPEC) ?", "verso": "Gestion des Emplois et des Parcours Professionnels. Démarche prévisionnelle pour anticiper les écarts entre besoins et ressources en compétences."},
    {"recto": "Formule de l'**effet de Noria** ?", "verso": "Nb remplacements × (salaire entrant - salaire sortant). Ex : 10 × (20 000 - 40 000) = -200 000 €"},
    {"recto": "Qu'est-ce que le **contrôle de gestion sociale** (Martory) ?", "verso": "Système d'aide au pilotage social contribuant à la gestion des RH dans leurs performances et leurs coûts."},
    {"recto": "Comment se décompose un salaire en **masse salariale** ?", "verso": "Salaire net (~1 550 €) + charges sociales (~450 €) = brut (2 000 €) + charges patronales (25-42%) = masse salariale (2 500-2 840 €)"}
  ]));

  copyFiche(68, 69);
  copyFiche(68, 70);
  copyFiche(68, 71);
  // Also link to bilan social and CdG sociale exercises
  [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 65, 66, 95].forEach(id => copyFiche(68, id));

  // ── Fiche 2 : Tableaux de bord et BSC (ch.72) ──
  insertFiche(72, 'resume', `# 📈 Tableaux de Bord et Indicateurs de Performance

---

> 💡 **En bref :** Le tableau de bord est l'outil central du pilotage. Il traduit la stratégie en indicateurs mesurables et permet aux managers d'agir rapidement. Le Balanced Scorecard (BSC) est le modèle de référence.

## 🎯 Notions clés

- **Tableau de bord** — Outil de pilotage tourné vers l'action. Défini PAR et POUR une entité/service. Contient des données financières ET non-financières
- **Reporting** — Remontée de données financières au niveau du groupe. Vérifie a posteriori si les objectifs sont atteints. N'est PAS un outil d'action
- **KPI** (Key Performance Indicator) — Indicateur clé mesurant un aspect de la performance

## 📊 Types d'indicateurs

| Type | Exemple |
|------|---------|
| **Financiers** | Marge, CA, résultat |
| **Physiques** | Quantités produites, taux de rebut |
| **D'objectifs** | Nb brevets déposés, nb ventes |
| **De moyens** | Budget formation, investissement R&D |
| **Rétrospectifs** | Résultats passés (lagging) |
| **Prospectifs** | Indicateurs avancés (leading) |

## 🏗️ Le Balanced Scorecard (BSC) — Kaplan & Norton

4 perspectives interconnectées :

1. **Finance** — "Que faut-il apporter aux actionnaires ?" → ROE, marge, CA
2. **Clients** — "Que faut-il apporter aux clients ?" → Satisfaction, fidélisation, parts de marché
3. **Processus internes** — "Quels processus excellents ?" → Qualité, délais, innovation
4. **Apprentissage** — "Comment progresser ?" → Formation, compétences, SI

> L'idée : les indicateurs financiers ne suffisent pas. La performance durable passe par les clients, les processus et les compétences.

## 📋 Construire un bon tableau de bord

1. Partir de la **stratégie** → objectifs → facteurs clés de succès → indicateurs
2. **5 à 10 indicateurs max** par tableau de bord
3. Mix **financier / non-financier** et **rétrospectif / prospectif**
4. Prévoir des **seuils d'alerte** (feu vert/orange/rouge)
5. **Fréquence** adaptée au cycle de décision (mensuel, hebdomadaire)

---

> 🧠 **À retenir :** Tableau de bord ≠ reporting. Le TdB est un outil D'ACTION, le reporting est un outil de VÉRIFICATION. Le BSC donne une vision à 360° avec ses 4 perspectives.`);

  insertFiche(72, 'memo', JSON.stringify([
    {"recto": "Différence entre **tableau de bord** et **reporting** ?", "verso": "Tableau de bord = outil de PILOTAGE tourné vers l'action, pour un service.\nReporting = remontée de données financières au groupe, vérifie a posteriori."},
    {"recto": "Quelles sont les **4 perspectives** du Balanced Scorecard ?", "verso": "1. Finance (actionnaires)\n2. Clients (satisfaction, fidélisation)\n3. Processus internes (qualité, délais)\n4. Apprentissage (formation, compétences)"},
    {"recto": "Qu'est-ce qu'un **KPI** ?", "verso": "Key Performance Indicator. Indicateur clé qui mesure un aspect précis de la performance (financier, qualité, délai...)."},
    {"recto": "Différence entre indicateur **rétrospectif** et **prospectif** ?", "verso": "Rétrospectif (lagging) = résultat passé (ex : CA réalisé).\nProspectif (leading) = indicateur avancé qui prédit la performance future (ex : pipeline de commandes)."},
    {"recto": "Combien d'indicateurs dans un bon **tableau de bord** ?", "verso": "5 à 10 maximum. Trop d'indicateurs noie l'information et empêche l'action."},
    {"recto": "Pourquoi le BSC a-t-il été créé ?", "verso": "Parce que les indicateurs financiers seuls ne suffisent pas. La performance durable passe aussi par les clients, les processus et les compétences."},
    {"recto": "Que signifie un indicateur au **feu rouge** dans un TdB ?", "verso": "L'indicateur a dépassé le seuil d'alerte → action corrective nécessaire immédiatement."},
    {"recto": "Comment construire un TdB : l'**ordre logique** ?", "verso": "Stratégie → Objectifs → Facteurs clés de succès → Indicateurs (KPI) → Seuils d'alerte"}
  ]));

  [56, 57, 58, 92, 93, 97, 98].forEach(id => copyFiche(72, id));

  // ── Fiche 3 : Budget et Contrôle budgétaire (ch.83, 84, 85, 86, 87) ──
  insertFiche(83, 'resume', `# 📈 Budget et Contrôle Budgétaire

---

> 💡 **En bref :** Le budget est l'outil central de prévision et de contrôle. Il traduit les objectifs en chiffres. Le contrôle budgétaire compare le réel au prévu pour identifier les écarts et agir.

## 🎯 Outils de prévision

- **Business plan** — Plan à 3-5 ans, vision stratégique long terme
- **Budget** — Plan annuel détaillé par mois. Engagement des managers
- **Rolling forecast** — Prévisions glissantes (12 mois), réactualisées régulièrement
- **Budget base zéro** — Chaque poste doit être rejustifié chaque année (pas d'acquis)

## 📊 Les budgets clés

1. **Budget des ventes** — Point de départ. CA prévisionnel = quantités × prix
2. **Budget de production** — Découle des ventes + stock de sécurité
3. **Budget des approvisionnements** — Achats nécessaires pour la production
4. **Budget de trésorerie** — Encaissements - Décaissements. Inclut les délais de paiement
5. **Budget de TVA** — TVA collectée - TVA déductible = TVA à décaisser

## 🔢 L'analyse des écarts (contrôle budgétaire)

**Écart total = Coût réel - Coût préétabli de la production préétablie**

Se décompose en :

**Sur matières :**
- **Écart sur quantités** = (Qréelle - Qprévue) × Prix prévu
- **Écart sur prix** = (Prixréel - Prixprévu) × Quantité réelle

**Sur main d'œuvre :**
- **Écart sur temps** = (Tréel - Tprévu) × Salaire prévu
- **Écart sur taux horaire** = (Sréel - Sprévu) × Temps réel

**Sur volume :** (PRODréelle - PRODprévue) × Coût unitaire prévu

## 💡 Exemple — Analyse d'écart matière

> Production prévue : 5 000 unités à 4 kg/unité à 8 €/kg
> Coût préétabli = 20 000 kg × 8 € = **160 000 €**
> Réel : 22 000 kg consommés pour 198 000 €
> Écart = 198 000 - 160 000 = **38 000 € défavorable**
> → 16 000 € d'écart sur quantités + 22 000 € d'écart sur prix

## 📋 Approches budgétaires

| Approche | Description |
|----------|-------------|
| **Top-down** | Direction fixe les objectifs, descend aux managers |
| **Bottom-up** | Managers remontent leurs prévisions terrain |
| **Mixte** | Lettre de cadrage (top-down) + remontées terrain (bottom-up) |

---

> 🧠 **À retenir :** Écart = Réel - Prévu. Si > 0 → défavorable (on a dépensé plus). Se décompose en écart sur quantités et écart sur prix.`);

  insertFiche(83, 'memo', JSON.stringify([
    {"recto": "Formule de l'**écart total** sur coûts ?", "verso": "Écart total = Coût réel - Coût préétabli de la production préétablie. Si > 0 → écart défavorable."},
    {"recto": "Comment se décompose l'écart sur **matières** ?", "verso": "Écart sur quantités = (Qr - Qp) × Pp\nÉcart sur prix = (Pr - Pp) × Qr\nÉcart total = somme des deux"},
    {"recto": "Comment se décompose l'écart sur **main d'œuvre** ?", "verso": "Écart sur temps = (Tr - Tp) × Sp (rendement)\nÉcart sur taux = (Sr - Sp) × Tr (coût horaire)"},
    {"recto": "Qu'est-ce que le **rolling forecast** ?", "verso": "Prévisions glissantes sur 12 mois, réactualisées régulièrement (chaque mois/trimestre). Plus agile que le budget fixe annuel."},
    {"recto": "Différence entre approche **top-down** et **bottom-up** ?", "verso": "Top-down : la direction fixe les objectifs.\nBottom-up : les managers remontent leurs prévisions.\nEn pratique : approche mixte."},
    {"recto": "Formule de la **TVA à décaisser** ?", "verso": "TVA à décaisser = TVA collectée (sur ventes) - TVA déductible (sur achats). Si négatif → crédit de TVA."},
    {"recto": "Quel est le **point de départ** du processus budgétaire ?", "verso": "Le budget des ventes. Tout le reste en découle : production, approvisionnements, trésorerie."},
    {"recto": "Qu'est-ce qu'un **coût préétabli** (standard) ?", "verso": "Un coût calculé à l'avance (quantité standard × coût unitaire standard). Sert de référence pour le contrôle budgétaire."},
    {"recto": "Un écart de **38 000 € défavorable** sur matières — comment l'analyser ?", "verso": "Décomposer : combien vient des quantités consommées en trop ? Combien vient du prix d'achat supérieur au prévu ?"}
  ]));

  copyFiche(83, 84);
  copyFiche(83, 85);
  copyFiche(83, 86);
  copyFiche(83, 87);
  [59, 60, 62, 61].forEach(id => copyFiche(83, id));

  // ── Fiche 4 : Lean Management et Coûts Cibles (ch.75, 76) ──
  insertFiche(75, 'resume', `# 📈 Lean Management, Coûts Cibles et Organisation

---

> 💡 **En bref :** Le Lean vise à éliminer les gaspillages. Le coût cible retourne l'équation des coûts : au lieu de prix = coût + marge, on part du prix du marché pour fixer le coût maximal acceptable.

## 🎯 Le Lean Management

- **Origine** — Toyota Production System (années 50). "Produire au plus juste"
- **Principe** — Éliminer les gaspillages (mudas) pour augmenter la valeur ajoutée
- **Kaizen** — "Changement pour le bien" = amélioration continue par petits pas

## 📊 Les 7 Mudas (gaspillages)

| Muda | Description |
|------|-------------|
| **Surproduction** | Produire plus ou avant le besoin |
| **Attente** | Temps d'inactivité (machines, personnes) |
| **Transport** | Déplacements inutiles de produits |
| **Sur-traitement** | Opérations superflues, qualité excessive |
| **Stocks** | Excès de matières, en-cours, produits finis |
| **Mouvements** | Gestes inutiles des opérateurs |
| **Défauts** | Rebuts, retouches, non-conformités |

## 🎯 Le Coût Cible (Target Costing)

**Équation inversée :**
- Traditionnelle : Prix = Coût + Marge (on subit)
- Coût cible : **Coût cible = Prix du marché - Marge souhaitée** (on agit)

Le prix est imposé par le marché. La marge est une décision stratégique. Le coût est le levier d'action.

## 📋 Les types de centres de responsabilité

| Centre | Responsabilité | Exemple |
|--------|---------------|---------|
| **Centre de coûts** | Minimiser les coûts | Usine, atelier |
| **Centre de dépenses** | Respecter un budget | DG, RH, marketing |
| **Centre de recettes** | Maximiser le CA | Agence commerciale |
| **Centre de profit** | Maximiser la marge | Filiale, ligne de produit |
| **Centre d'investissement** | Optimiser le ROI | Division autonome |

## 🔢 Les 5M (Ishikawa)

Outil d'analyse des causes d'un problème :
- **Main-d'œuvre** — compétences, effectifs
- **Matière** — qualité des intrants
- **Matériel** — outils, machines
- **Méthodes** — procédures, processus
- **Milieu** — environnement de travail

---

> 🧠 **À retenir :** Lean = chasser les mudas. Coût cible = Prix marché - Marge voulue. Les 5M pour analyser un problème.`);

  insertFiche(75, 'memo', JSON.stringify([
    {"recto": "Qu'est-ce que le **Lean Management** ?", "verso": "Système d'organisation visant à éliminer les gaspillages (mudas) pour produire au plus juste. Origine : Toyota Production System."},
    {"recto": "Quels sont les **7 mudas** (gaspillages) ?", "verso": "1. Surproduction\n2. Attente\n3. Transport\n4. Sur-traitement\n5. Stocks excessifs\n6. Mouvements inutiles\n7. Défauts/rebuts"},
    {"recto": "Formule du **coût cible** ?", "verso": "Coût cible = Prix du marché - Marge souhaitée. Le prix est imposé par le marché, le coût est le levier d'action."},
    {"recto": "Qu'est-ce que le **Kaizen** ?", "verso": "\"Changement pour le bien\" en japonais. Amélioration continue par petits pas. Tout le monde participe."},
    {"recto": "Différence **centre de coûts** vs **centre de profit** ?", "verso": "Centre de coûts : responsable de minimiser les coûts (usine).\nCentre de profit : responsable de la marge = recettes - coûts (filiale)."},
    {"recto": "Que sont les **5M** (Ishikawa) ?", "verso": "Main-d'œuvre, Matière, Matériel, Méthodes, Milieu. Outil pour analyser les causes d'un problème qualité."},
    {"recto": "Qu'est-ce qu'un **centre d'investissement** ?", "verso": "Centre responsable de la rentabilité des capitaux engagés (ROI). Le plus haut niveau de délégation."},
    {"recto": "Pourquoi le coût cible **inverse** l'équation traditionnelle ?", "verso": "Traditionnelle : Prix = Coût + Marge (on subit le coût).\nCoût cible : Coût = Prix - Marge (on agit sur le coût pour atteindre un objectif)."}
  ]));

  copyFiche(75, 76);
  [63, 64, 88, 90, 91, 96, 99, 100, 101, 102, 103].forEach(id => copyFiche(75, id));

  // ── Fiche 5 : RSE et Conduite du changement (ch.77, 78, 79, 80, 81, 82) ──
  insertFiche(77, 'resume', `# 📈 RSE, Conduite du Changement et Performance Extra-Financière

---

> 💡 **En bref :** La performance ne se mesure plus uniquement en termes financiers. La RSE, le reporting de durabilité (CSRD) et la conduite du changement sont devenus des enjeux majeurs du pilotage.

## 🎯 La RSE et la Performance Extra-Financière

- **RSE** — Responsabilité Sociétale des Entreprises : intégrer les préoccupations sociales, environnementales et économiques dans l'activité
- **Critères ESG** — Écologiques, Sociaux et de Gouvernance
- **Taxonomie européenne** — Classification des activités "durables" selon 6 objectifs environnementaux
- **3 ratios verts** — % du CA, % des investissements, % des dépenses opérationnelles provenant d'activités durables
- **CSRD** — Corporate Sustainability Reporting Directive : obligation de reporting extra-financier pour les grandes entreprises (depuis 2024)
- **Bilan carbone** — Mesure des émissions de GES (scopes 1, 2, 3)

## 🎯 La Conduite du Changement

### Les 4 styles de conduite

| Style | Caractéristiques |
|-------|-----------------|
| **Autoritaire** | Rapide, clair, mais résistance frontale ou passivité |
| **Persuasion** | Communication forte, conviction, mais adhésion fragile |
| **Négociation** | Compromis, réaliste mais lent et tendu |
| **Participatif** | Consensus, engagement fort mais processus très long |

### Le changement concerté (meilleure approche)

Mélange de négociation et participation : diagnostic participatif → groupes de projet → reconception concertée. Engagement fort + résultat réaliste.

### La résistance au changement

- Ce n'est PAS une "résistance naturelle" des salariés
- Chaque acteur a ses propres intérêts rationnels
- Les promoteurs du changement ne sont pas les seuls "détenteurs de la raison"

### Les outils du management par les processus

- **Brainstorming** — production d'idées en groupe (6 règles : roue libre, pas de critique, quantité, rebondir, tout noter, produire)
- **Diagramme d'Ishikawa (5M)** — analyse des causes d'un problème
- **Vote pondéré** — sélection des priorités en groupe
- **Metaplan** — outil visuel de restitution collective
- **Plan d'action** — actions, responsables, délais, budget, indicateurs

---

> 🧠 **À retenir :** La performance globale = financière + extra-financière (ESG). Le changement se conduit, il ne s'impose pas. Le style participatif/concerté est le plus durable.`);

  insertFiche(77, 'memo', JSON.stringify([
    {"recto": "Qu'est-ce que la **RSE** ?", "verso": "Responsabilité Sociétale des Entreprises : intégrer les préoccupations sociales, environnementales et économiques dans l'activité et les interactions avec les parties prenantes."},
    {"recto": "Que signifie **ESG** ?", "verso": "Écologique (environnement), Social et Gouvernance. Les 3 critères de la performance extra-financière."},
    {"recto": "Qu'est-ce que la **CSRD** ?", "verso": "Corporate Sustainability Reporting Directive. Obligation européenne de reporting extra-financier pour les grandes entreprises (depuis 2024)."},
    {"recto": "Quels sont les **4 styles** de conduite du changement ?", "verso": "1. Autoritaire (rapide mais résistance)\n2. Persuasion (conviction mais adhésion fragile)\n3. Négociation (compromis mais lent)\n4. Participatif (consensus mais très long)"},
    {"recto": "Qu'est-ce que le **changement concerté** ?", "verso": "Mélange de négociation et participation : diagnostic participatif → groupes de projet → reconception. Le plus durable et réaliste."},
    {"recto": "La résistance au changement est-elle **naturelle** ?", "verso": "Non ! Ce n'est pas une résistance innée. Chaque acteur a ses intérêts rationnels. Il faut comprendre et intégrer ces intérêts, pas les combattre."},
    {"recto": "Quels sont les **3 ratios verts** de la taxonomie ?", "verso": "% du CA, % des investissements, % des dépenses opérationnelles provenant d'activités classées comme durables."},
    {"recto": "Quelles sont les **6 règles** du brainstorming ?", "verso": "1. Roue libre (tout dire)\n2. Pas de critique\n3. Viser la quantité\n4. Rebondir sur les idées des autres\n5. Tout noter\n6. Respecter ces règles"},
    {"recto": "Qu'est-ce que le **bilan carbone** ?", "verso": "Mesure des émissions de gaz à effet de serre. Scope 1 = émissions directes, Scope 2 = énergie achetée, Scope 3 = chaîne de valeur."}
  ]));

  copyFiche(77, 78);
  copyFiche(77, 79);
  copyFiche(77, 80);
  copyFiche(77, 81);
  copyFiche(77, 82);

  console.log('  ✅ 5 fiches thématiques');
}

// ============================================================
// 👥 RH — 5 fiches
// ============================================================

function generateRHFiches() {
  console.log('\n👥 RH...');

  // ── Fiche 1 : Fondamentaux de la GRH (ch.104, 105, 106) ──
  insertFiche(104, 'resume', `# 👥 Introduction et Fondamentaux de la GRH

---

> 💡 **En bref :** La GRH ne concerne pas que le service RH ! Tout manager est un acteur RH : il recrute, évalue, forme et accompagne ses collaborateurs. La fonction RH a évolué de la simple administration du personnel vers un rôle stratégique.

## 🎯 Évolution historique de la fonction RH

| Période | Théorie dominante | Fonction | Pratiques |
|---------|-------------------|----------|-----------|
| 1900-1950 | Taylorisme/Fordisme | Administration du personnel | Réglementation, procédures |
| 1950-1970 | Relations humaines | Service RH | Communication, culture |
| 1960-1980 | Socio-technique | Développement social | Conditions de travail |
| Après 1980 | Management stratégique | GRH | Culture, GPEC, compétences |

## 🎯 Les acteurs de la GRH

- **Le manager** — Recrute, évalue, propose des formations, accompagne les carrières de ses collaborateurs
- **La DRH** — Définit les politiques RH, fournit les outils, conseille les managers
- **Les salariés** — Acteurs de leur propre développement
- **Le CSE** — Comité Social et Économique (ordonnances Macron 2017), remplace les anciennes instances (DP, CHSCT, CE)

## 📋 Le CSE (Comité Social et Économique)

- **Obligatoire** dans les entreprises de 11+ salariés
- **Missions** — Réclamations individuelles/collectives, santé-sécurité, conditions de travail
- **À 50+ salariés** — Consultation sur les décisions économiques, sociales et environnementales
- Peut saisir l'inspection du travail

## 🎯 Le contexte de la GRH

- **Contexte interne** — Stratégie, culture d'entreprise, taille de l'organisation
- **Contexte externe** — Marché du travail, technologie, réglementation
- **Culture d'entreprise** — Valeurs partagées qui mobilisent et canalisent les comportements

## 💡 À retenir pour l'examen

> Le cours est évalué par : Contrôle continu 40% (étude de cas fil rouge) + Partiel final 60% (étude de cas en présentiel, 2h, sans documents). Structurez vos réponses et mobilisez les concepts du cours.

---

> 🧠 **Idée force :** Tout manager est un "manager RH". La GRH est une responsabilité PARTAGÉE entre la DRH et les managers opérationnels.`);

  insertFiche(104, 'memo', JSON.stringify([
    {"recto": "Quelles sont les **4 grandes périodes** de l'évolution de la fonction RH ?", "verso": "1. Administration du personnel (taylorisme, 1900-1950)\n2. Relations humaines (communication, 1950-1970)\n3. Développement social (conditions de travail, 1960-1980)\n4. GRH stratégique (compétences, après 1980)"},
    {"recto": "Quel est le rôle du **manager** en GRH ?", "verso": "Recruter ses collaborateurs, les évaluer, proposer des formations, attribuer augmentations/primes, accompagner les carrières."},
    {"recto": "Qu'est-ce que le **CSE** et depuis quand ?", "verso": "Comité Social et Économique, créé par les ordonnances Macron de 2017. Remplace les DP, CHSCT et CE. Obligatoire dans les entreprises de 11+ salariés."},
    {"recto": "Quelles sont les **missions** du CSE ?", "verso": "Réclamations individuelles/collectives, santé et sécurité, conditions de travail. À 50+ salariés : consultation sur les décisions économiques et sociales."},
    {"recto": "Qu'est-ce que la **culture d'entreprise** ?", "verso": "Noyau de valeurs partagées par tous les membres. Sert à mobiliser les énergies et canaliser les comportements autour d'objectifs communs."},
    {"recto": "Qu'est-ce que le courant des **Relations humaines** ?", "verso": "Écoute, valorisation, motivation, fidélité. Rôle important des cadres, délégation, association des salariés aux décisions."},
    {"recto": "Pourquoi dit-on que la GRH est une responsabilité **partagée** ?", "verso": "La DRH définit les politiques et outils, mais c'est le manager opérationnel qui met en œuvre au quotidien (recrutement, évaluation, formation...)."}
  ]));

  copyFiche(104, 105);
  copyFiche(104, 106);

  // ── Fiche 2 : Le Recrutement (ch.116, 117, 118, 119) ──
  insertFiche(116, 'resume', `# 👥 Le Recrutement — Processus Complet

---

> 💡 **En bref :** Le recrutement est un processus en 4 étapes : identification du besoin, sourcing, sélection, intégration. Chaque étape implique des choix stratégiques (interne vs externe, outils de sélection, onboarding).

## 📋 Les 4 étapes du recrutement

### 1. Identification du besoin
- **Formulation** — Émane du N+1
- **Analyse** — Réalisée par les RH : le poste est-il nécessaire ? Solutions alternatives ?
- **Profil du poste** — Intitulé, missions, rémunération, perspectives d'évolution
- **Profil du candidat** — Formation, expériences, compétences (techniques + comportementales)

### 2. Sourcing (recherche de candidats)

| Interne | Externe |
|---------|---------|
| Délai plus court | Nouvelles compétences |
| Moins de candidatures | Nouvelles expériences |
| Coûts moins élevés | Renouvellement des RH |
| Motivation (évolution) | Enrichissement culturel |
| Risque plus faible | |

**Canaux principaux (APEC 2023) :**
- Offre d'emploi (83-94%)
- Réseaux sociaux (72-85%)
- Réseau de contacts (72-76%)
- Approche directe (69-74%)
- Candidatures spontanées (59-73%)
- Cooptation (43-52%)

### 3. Sélection des candidats

**Validité prédictive des outils :**
| Outil | Validité |
|-------|----------|
| Mises en situation/Simulations | **Élevée** |
| Tests d'aptitudes, QI | Élevée |
| Entretiens structurés | Assez bonne |
| Tests de personnalité | Faible |
| Graphologie | **Nulle** |

### 4. Intégration (onboarding)
- Étape cruciale souvent négligée
- Livret d'accueil, tuteur/parrain, formation initiale
- Les premiers mois sont déterminants pour la fidélisation

## ⚠️ Les biais cognitifs du recruteur

- **Effet de halo** — une caractéristique positive/négative influence tout le jugement
- **Biais de similitude** — favoriser les candidats qui nous ressemblent
- **Effet de primauté** — première impression trop déterminante

---

> 🧠 **À retenir :** Le recrutement est un investissement. Un mauvais recrutement coûte 1.5 à 3 fois le salaire annuel. Les mises en situation ont la meilleure validité prédictive.`);

  insertFiche(116, 'memo', JSON.stringify([
    {"recto": "Quelles sont les **4 étapes** du processus de recrutement ?", "verso": "1. Identification du besoin (profil poste + candidat)\n2. Sourcing (recherche interne/externe)\n3. Sélection (tests, entretiens)\n4. Intégration (onboarding)"},
    {"recto": "Quels sont les **avantages** du recrutement interne ?", "verso": "Délai plus court, coûts moins élevés, motivation des salariés (perspective d'évolution), risque plus faible, intégration plus facile."},
    {"recto": "Quel outil de sélection a la **meilleure validité** prédictive ?", "verso": "Les mises en situation / simulations professionnelles. La graphologie a une validité NULLE."},
    {"recto": "Quels sont les **3 principaux biais** du recruteur ?", "verso": "1. Effet de halo (une caractéristique colore tout)\n2. Biais de similitude (favoriser qui nous ressemble)\n3. Effet de primauté (première impression)"},
    {"recto": "Top 3 des **canaux de recrutement** les plus utilisés (APEC 2023) ?", "verso": "1. Offre d'emploi (83-94%)\n2. Réseaux sociaux (72-85%)\n3. Réseau de contacts (72-76%)"},
    {"recto": "Pourquoi l'**intégration** est-elle cruciale ?", "verso": "Les premiers mois sont déterminants pour la fidélisation. Un onboarding raté → démission rapide → coût élevé (1.5 à 3 fois le salaire annuel)."},
    {"recto": "Quels éléments dans le **profil du candidat** ?", "verso": "Formation (initiale + continue), expériences professionnelles, compétences (techniques + comportementales), caractéristiques spécifiques (disponibilité, mobilité...)."},
    {"recto": "Qu'est-ce que la **proposition de valeur** employeur (4 facteurs) ?", "verso": "1. Rémunération et avantages\n2. Développement professionnel\n3. Environnement de travail\n4. Sens et engagement sociétal"}
  ]));

  copyFiche(116, 117);
  copyFiche(116, 118);
  copyFiche(116, 119);

  // ── Fiche 3 : La Rémunération (ch.111, 112) ──
  insertFiche(111, 'resume', `# 👥 La Rémunération — Composantes et Politique

---

> 💡 **En bref :** La rémunération est bien plus qu'un salaire. C'est un levier stratégique pour attirer, motiver et fidéliser. Elle comporte une partie fixe, une partie variable, et des périphériques (intéressement, participation, avantages).

## 🎯 Les composantes de la rémunération

### 1. Rémunération directe (court terme)
- **Salaire de qualification (fixe)** — salaire de base + complément individuel
- **Salaire de performance (variable)** — individuel et/ou collectif
- **Primes** — fixes ou variables, liées au travail/fonction/emploi

### 2. Périphériques légaux (moyen terme)

| Dispositif | Caractéristiques |
|-----------|-----------------|
| **Intéressement** | Facultatif. Prime liée aux résultats/performances. Créé en 1959 |
| **Participation** | Obligatoire si 50+ salariés pendant 5 ans. Part des bénéfices |
| **PEE** | Plan d'Épargne Entreprise. Bloqué 5 ans. Abondement possible |

**Formule participation** = \`½ × (Bénéfice - 5% Capitaux propres) × Salaires / VA\`

### 3. Avantages en nature (court terme)
- Individuels : voiture, logement, téléphone
- Collectifs : chèques déjeuner, remises, activités loisirs

### 4. Périphériques statutaires
- Court terme : mutuelle
- Moyen terme : compte épargne-temps
- Long terme : retraite complémentaire

## 📋 Le Mix-Rémunération (selon l'objectif)

| Objectif | Levier de rémunération |
|----------|----------------------|
| **Attirer** | Rémunération directe élevée |
| **Fidéliser** | Rémunération différée (stock-options, épargne) + avantages |
| **Motiver** | Part variable individuelle sur des critères influençables |
| **Impliquer** | Variable collectif (intéressement, participation) |
| **Climat social** | Pas d'iniquités, augmentations générales |

## 🔢 La Masse Salariale

- **Calcul** : Salaire net + charges sociales = Brut + charges patronales (25-42%) = Masse salariale
- **Exemple** : Net 1 550 € → Brut 2 000 € → Masse salariale 2 500 à 2 840 €

## 💡 Caractéristiques d'une bonne politique de rémunération

**Équitable** — Compétitive — Motivante — Souple

---

> 🧠 **À retenir :** À travail égal, salaire égal. Le mix-rémunération doit être adapté aux objectifs RH (attirer, fidéliser, motiver, impliquer).`);

  insertFiche(111, 'memo', JSON.stringify([
    {"recto": "Quelles sont les **4 composantes** de la rémunération ?", "verso": "1. Rémunération directe (fixe + variable + primes)\n2. Périphériques légaux (intéressement, participation, PEE)\n3. Avantages en nature\n4. Périphériques statutaires (mutuelle, retraite)"},
    {"recto": "Différence entre **intéressement** et **participation** ?", "verso": "Intéressement = facultatif, lié aux résultats/performances.\nParticipation = obligatoire si 50+ salariés (5 ans), part des bénéfices."},
    {"recto": "Formule de la **réserve de participation** ?", "verso": "RSP = ½ × (Bénéfice - 5% Capitaux propres) × Salaires / Valeur Ajoutée"},
    {"recto": "Comment **attirer** des talents par la rémunération ?", "verso": "Rémunération directe élevée et compétitive (salaire de base + primes)."},
    {"recto": "Comment **fidéliser** par la rémunération ?", "verso": "Rémunération différée (stock-options, épargne salariale, ancienneté) + avantages difficiles à quitter (mutuelle, logement...)."},
    {"recto": "Comment **motiver** par la rémunération ?", "verso": "Part variable individuelle basée sur des critères que le salarié peut influencer."},
    {"recto": "Qu'est-ce que le **PEE** ?", "verso": "Plan d'Épargne Entreprise. Le salarié y verse participation/intéressement + versements perso. L'entreprise peut abonder. Bloqué 5 ans."},
    {"recto": "Les 4 qualités d'une bonne **politique de rémunération** ?", "verso": "Équitable, Compétitive, Motivante et Souple."},
    {"recto": "Un brut de 2 000 € donne quelle **masse salariale** ?", "verso": "Brut 2 000 € + charges patronales (25-42%) = masse salariale de 2 500 à 2 840 €."}
  ]));

  copyFiche(111, 112);

  // ── Fiche 4 : L'Évaluation (ch.113, 114) ──
  insertFiche(113, 'resume', `# 👥 L'Évaluation des Salariés — Performance et Compétences

---

> 💡 **En bref :** L'évaluation est au cœur de la GRH. Elle porte sur la performance (résultats), les compétences (moyens) et le potentiel (futur). C'est le déclencheur de nombreux processus RH (formation, rémunération, carrière).

## 🎯 L'évaluation porte sur 3 dimensions

| Dimension | Ce qu'on évalue | Comment |
|-----------|----------------|---------|
| **Performance** | Résultats obtenus vs objectifs fixés | Objectifs SMART, indicateurs |
| **Compétences** | Savoirs, savoir-faire, savoir-être mobilisés | Grille d'évaluation |
| **Potentiel** | Ce que la personne peut devenir | Difficile à mesurer |

## 📋 Les objectifs de l'évaluation

| Pour qui | Objectifs |
|----------|-----------|
| **Direction** | Contrôler la performance, responsabiliser, développer les compétences |
| **DRH** | Retours terrain, améliorer les processus RH, maintenir l'équité |
| **Manager** | Bilan de l'année, fixer des objectifs N+1, motiver |
| **Salarié** | S'exprimer, être informé, évoluer |

## 🎯 Les outils d'évaluation

### L'entretien annuel d'évaluation
- Concerne **60% des salariés** (86% dans les entreprises de 500+)
- Non obligatoire sauf convention collective
- Entre le salarié et son N+1 (auto-évaluation + évaluation manager)
- Contenu : bilan N, objectifs N+1, compétences, formation, carrière
- Aboutit à des objectifs **SMART** et au déclenchement de processus RH

### L'évaluation à 360°
- Dépasse la simple appréciation hiérarchique
- Évaluation par : N+1, pairs, subordonnés, clients
- Surtout pour les **cadres supérieurs**
- Adaptée aux organisations en réseau/projets

## ⚠️ Les difficultés de l'évaluation

- **Direction** : parfois contre-productif (démotivation, stratégies individualistes)
- **Managers** : complexifie leur rôle (juge ET coach simultanément)
- **Salariés** : écart entre le discours (transparence) et le vécu (langue de bois)
- Si les formations promises ne sont pas mises en œuvre → perte de crédibilité totale

---

> 🧠 **À retenir :** L'évaluation est au cœur de la GRH car elle déclenche tout : formation, rémunération, mobilité, carrière. Objectifs SMART. Le manager est à la fois juge et coach.`);

  insertFiche(113, 'memo', JSON.stringify([
    {"recto": "Sur quelles **3 dimensions** porte l'évaluation ?", "verso": "1. Performance (résultats vs objectifs)\n2. Compétences (savoirs, savoir-faire, savoir-être)\n3. Potentiel (capacité d'évolution future)"},
    {"recto": "Que sont les objectifs **SMART** ?", "verso": "Spécifiques, Mesurables, Atteignables, Réalistes, Temporellement définis. Standard pour fixer des objectifs en entretien annuel."},
    {"recto": "Qu'est-ce que l'**évaluation à 360°** ?", "verso": "Évaluation par le N+1, les pairs, les subordonnés et les clients. Dépasse la seule appréciation hiérarchique. Surtout pour les cadres supérieurs."},
    {"recto": "Quel % de salariés a un **entretien annuel** d'évaluation ?", "verso": "60% de l'ensemble des salariés, 86% dans les entreprises de 500+ salariés."},
    {"recto": "Pourquoi l'évaluation est-elle au **cœur de la GRH** ?", "verso": "Elle déclenche les autres processus : formation, rémunération (augmentations), mobilité, gestion de carrière."},
    {"recto": "Quelles sont les **difficultés** de l'évaluation pour le manager ?", "verso": "Il doit être à la fois juge (évaluer la performance) et coach (développer le salarié). Double rôle contradictoire."},
    {"recto": "Que se passe-t-il si les **formations promises** ne sont pas mises en œuvre ?", "verso": "Perte de crédibilité totale du système d'évaluation. Les salariés ne s'investissent plus dans le processus."},
    {"recto": "Différence entre évaluer la **performance** et les **compétences** ?", "verso": "Performance = QUOI (résultats obtenus, atteinte des objectifs)\nCompétences = COMMENT (moyens et comportements mis en œuvre pour y parvenir)"}
  ]));

  copyFiche(113, 114);

  // ── Fiche 5 : Gestion des Carrières (ch.120, 121, 122) ──
  insertFiche(120, 'resume', `# 👥 La Gestion des Carrières — Mobilité et Parcours

---

> 💡 **En bref :** La gestion des carrières est le point de rencontre entre les intérêts de l'organisation (compétences, brassage culturel) et ceux de l'individu (évolution, rétribution). Elle a évolué de la carrière traditionnelle (verticale) vers des parcours plus flexibles.

## 🎯 Définition et objectifs

- **Définition** — "Action organisée pour définir la succession des affectations individuelles du personnel" (Roger, 1991)

| Pour l'organisation | Pour le salarié |
|---------------------|----------------|
| Gérer emplois et compétences | Améliorer contributions/rétributions |
| Brassage culturel | Évoluer professionnellement |
| Stimuler la motivation | Diversifier les expériences |
| Diffuser les techniques de gestion | Se développer personnellement |

## 📋 De la carrière traditionnelle aux nouvelles carrières

| Carrière traditionnelle | Nouvelles carrières |
|------------------------|-------------------|
| Relation long terme | Parcours flexibles |
| Promotion verticale | Mobilité horizontale |
| Progression hiérarchique | Co-gestion de trajectoires |
| Loyauté = avancement | Compétences = employabilité |

**Concepts clés :**
- **Carrière protéenne** (Hall) — L'individu pilote sa carrière selon ses valeurs
- **Carrière sans frontières** (Arthur) — Mobilité entre organisations
- **Carrière nomade** (Cadin) — Parcours non linéaires

## 🎯 Les outils de gestion des carrières

- **Entretien professionnel** — Obligatoire tous les 2 ans. Distinct de l'entretien annuel d'évaluation. Porte sur les perspectives d'évolution et les besoins de formation
- **Bilan de compétences** — Analyse des compétences personnelles et professionnelles
- **Plan de succession** — Identifier les remplaçants potentiels pour les postes clés
- **Hauts potentiels** — Salariés identifiés pour leur capacité d'évolution vers des postes stratégiques. Programmes spécifiques (formations, mentoring, missions transversales)

## 📊 Les types de mobilité

| Type | Description |
|------|-------------|
| **Verticale** | Promotion hiérarchique |
| **Horizontale** | Changement de fonction au même niveau |
| **Géographique** | Changement de lieu (mutation, expatriation) |
| **Inter-entreprises** | Mobilité externe |

---

> 🧠 **À retenir :** La carrière n'est plus uniquement verticale. L'entretien professionnel (obligatoire tous les 2 ans) est DISTINCT de l'entretien annuel. La gestion des hauts potentiels est un enjeu stratégique.`);

  insertFiche(120, 'memo', JSON.stringify([
    {"recto": "Qu'est-ce que la **gestion des carrières** ?", "verso": "Action organisée pour définir la succession des affectations individuelles. Point de rencontre entre intérêts de l'organisation et de l'individu."},
    {"recto": "Différence entre **entretien annuel** et **entretien professionnel** ?", "verso": "Entretien annuel = évaluation de la performance et des compétences (non obligatoire).\nEntretien professionnel = perspectives d'évolution et formation (OBLIGATOIRE tous les 2 ans)."},
    {"recto": "Qu'est-ce qu'une **carrière protéenne** (Hall) ?", "verso": "L'individu pilote sa propre carrière selon ses valeurs et aspirations personnelles, pas selon la hiérarchie de l'entreprise."},
    {"recto": "Quels sont les **4 types de mobilité** ?", "verso": "1. Verticale (promotion)\n2. Horizontale (changement de fonction)\n3. Géographique (mutation)\n4. Inter-entreprises (externe)"},
    {"recto": "Qu'est-ce qu'un **haut potentiel** en RH ?", "verso": "Salarié identifié pour sa capacité d'évolution vers des postes stratégiques. Bénéficie de programmes spécifiques : formations, mentoring, missions transversales."},
    {"recto": "Qu'est-ce qu'un **plan de succession** ?", "verso": "Outil identifiant les remplaçants potentiels pour les postes clés de l'organisation. Anticipe les départs et assure la continuité."},
    {"recto": "Différence carrière **traditionnelle** vs **nouvelles carrières** ?", "verso": "Traditionnelle : promotion verticale, relation long terme, loyauté.\nNouvelle : mobilité horizontale, parcours flexibles, compétences = employabilité."},
    {"recto": "Qu'est-ce qu'un **bilan de compétences** ?", "verso": "Analyse des compétences personnelles et professionnelles du salarié. Permet de définir un projet professionnel et des besoins de formation."}
  ]));

  copyFiche(120, 121);
  copyFiche(120, 122);

  console.log('  ✅ 5 fiches thématiques');
}

// ============================================================
// MAIN
// ============================================================

function main() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  INJECTION FICHES REFORMULÉES v4 — COMPLÈTE          ║');
  console.log('║  17 fiches thématiques rédigées par Claude            ║');
  console.log('║  après analyse approfondie de tous les cours          ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  // Phase 1: Clear ALL old fiches and quizzes
  const oldFiches = db.prepare('SELECT COUNT(*) as c FROM summaries').get().c;
  const oldQuizzes = db.prepare('SELECT COUNT(*) as c FROM quizzes').get().c;
  console.log(`\n🗑️  Suppression de ${oldFiches} anciennes fiches et ${oldQuizzes} anciens quiz...`);
  db.prepare('DELETE FROM summaries').run();
  db.prepare('DELETE FROM questions').run();
  db.prepare('DELETE FROM quizzes').run();

  // Phase 2: Inject by subject
  generateAnalyseQuantiFiches();
  generateDroitFiches();
  generatePilotageFiches();
  generateRHFiches();

  // Stats
  const total = db.prepare('SELECT COUNT(*) as c FROM summaries').get().c;
  const resumes = db.prepare("SELECT COUNT(*) as c FROM summaries WHERE type = 'resume'").get().c;
  const memos = db.prepare("SELECT COUNT(*) as c FROM summaries WHERE type = 'memo'").get().c;

  // Count unique fiches (by content)
  const uniqueResumes = db.prepare("SELECT COUNT(DISTINCT content) as c FROM summaries WHERE type = 'resume'").get().c;
  const uniqueMemos = db.prepare("SELECT COUNT(DISTINCT content) as c FROM summaries WHERE type = 'memo'").get().c;

  console.log('\n══════════════════════════════════════');
  console.log('📊 RÉSULTAT FINAL:');
  console.log(`  Total entrées DB: ${total} (${resumes} résumés + ${memos} mémos)`);
  console.log(`  Fiches uniques: ${uniqueResumes} résumés + ${uniqueMemos} mémos`);
  console.log(`  = ${uniqueResumes} fiches thématiques avec flashcards`);
  console.log('══════════════════════════════════════');

  db.close();
}

main();
