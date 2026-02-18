/**
 * INJECTION QUIZ COHÉRENTS v2
 *
 * 4 quiz (un par matière) + 1 quiz général multi-matières
 * Toutes les questions sont basées sur le contenu des fiches de révision.
 *
 * Types : qcm, vrai_faux
 * Difficulté : moyen
 *
 * Usage: node scripts/inject-smart-quiz.js
 */

const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'data', 'revision.db'));

// ============================================================
// HELPERS
// ============================================================

function createQuiz(title, courseId, chapterId, questionCount, mode = 'rapide') {
  const result = db.prepare(
    'INSERT INTO quizzes (title, course_id, chapter_id, difficulty, question_count, mode, time_limit) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(title, courseId, chapterId, 'moyen', questionCount, mode, mode === 'examen' ? questionCount * 90 : 0);
  return Number(result.lastInsertRowid);
}

function addQCM(quizId, question, options, correctIndex, explanation) {
  db.prepare(
    'INSERT INTO questions (quiz_id, type, question, options_json, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(quizId, 'qcm', question, JSON.stringify(options), options[correctIndex], explanation);
}

function addVF(quizId, question, isTrue, explanation) {
  db.prepare(
    'INSERT INTO questions (quiz_id, type, question, options_json, correct_answer, explanation) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(quizId, 'vrai_faux', question, JSON.stringify(['Vrai', 'Faux']), isTrue ? 'Vrai' : 'Faux', explanation);
}

// ============================================================
// 📊 QUIZ ANALYSE QUANTI
// ============================================================

function quizAnalyseQuanti() {
  console.log('\n📊 Quiz Analyse Quanti...');
  const qid = createQuiz('Quiz Analyse Quantitative', 4, 5, 12);

  addQCM(qid,
    "Quel indicateur est le plus robuste face aux valeurs extrêmes ?",
    ["La moyenne", "La médiane", "L'écart-type", "Le mode"],
    1,
    "La médiane coupe l'échantillon en deux et n'est pas influencée par les valeurs extrêmes, contrairement à la moyenne."
  );

  addVF(qid,
    "On peut calculer une moyenne sur des codes postaux.",
    false,
    "Les codes postaux sont des variables qualitatives (catégories). Calculer leur moyenne n'a aucun sens statistique."
  );

  addQCM(qid,
    "Que mesure le coefficient r de Pearson ?",
    ["La causalité entre deux variables", "La force du lien linéaire entre deux variables quantitatives", "L'indépendance entre deux variables qualitatives", "La dispersion des données"],
    1,
    "Le coefficient r de Pearson mesure la force et le sens de la relation LINÉAIRE entre deux variables quantitatives, de -1 à +1."
  );

  addQCM(qid,
    "Si r = 0.16 avec p = 0.03, que peut-on conclure ?",
    ["Relation forte et significative", "Relation significative mais négligeable en pratique (R² = 2.6%)", "Aucune relation", "Corrélation négative"],
    1,
    "p < 0.05 donc significatif, MAIS R² = 0.16² = 2.6% → la variable explique très peu de la variance. Significatif ≠ Important."
  );

  addVF(qid,
    "Deux variables corrélées impliquent toujours une relation de causalité.",
    false,
    "Corrélation ≠ Causalité ! Le piège n°1 en statistiques. Une variable confondante peut expliquer les deux."
  );

  addQCM(qid,
    "Quel test utilise-t-on pour comparer les moyennes de 4 groupes ?",
    ["Test du Khi-deux", "Corrélation de Pearson", "ANOVA", "Test de Student"],
    2,
    "L'ANOVA compare les moyennes de 3+ groupes. Le test de Student ne fonctionne qu'avec 2 groupes."
  );

  addQCM(qid,
    "Que représente F en ANOVA ?",
    ["Le nombre de groupes", "Le ratio variance inter / variance intra", "Le nombre total d'observations", "La moyenne des groupes"],
    1,
    "F = Variance inter-groupes / Variance intra-groupe. Plus F est grand, plus les différences entre groupes sont significatives."
  );

  addVF(qid,
    "Après une ANOVA significative, on sait exactement quels groupes diffèrent.",
    false,
    "L'ANOVA dit 'il y a une différence' mais pas OÙ. Il faut un test post-hoc (Tukey, Bonferroni) pour identifier quels groupes diffèrent."
  );

  addQCM(qid,
    "Quel test utilise-t-on pour 2 variables qualitatives ?",
    ["ANOVA", "Corrélation de Pearson", "Test du Khi-deux", "Régression linéaire"],
    2,
    "Le Khi-deux teste l'indépendance entre 2 variables qualitatives, en comparant effectifs observés vs théoriques."
  );

  addQCM(qid,
    "La formule de l'effectif théorique en Khi-deux est :",
    ["(Total ligne × Total colonne) / Total général", "Σ(Observé - Théorique)²", "Moyenne des lignes × Moyenne des colonnes", "Total général / nombre de cellules"],
    0,
    "Effectif théorique = (Total ligne × Total colonne) / Total général. Condition : tous les effectifs théoriques ≥ 5."
  );

  addVF(qid,
    "Dans une distribution normale, 95% des données se trouvent à ±2 écarts-types de la moyenne.",
    true,
    "Règle 68-95-99 : 68% à ±1σ, 95% à ±2σ, 99.7% à ±3σ."
  );

  addQCM(qid,
    "Comment interpréter β = 2.5 en régression ?",
    ["Y est toujours égal à 2.5", "Quand X augmente d'une unité, Y augmente de 2.5 toutes choses égales par ailleurs", "La corrélation est de 2.5", "Le R² est de 2.5%"],
    1,
    "Le coefficient β indique la variation de Y quand X augmente d'une unité, toutes les autres variables étant maintenues constantes."
  );

  console.log('  ✅ 12 questions');
  return qid;
}

// ============================================================
// ⚖️ QUIZ DROIT
// ============================================================

function quizDroit() {
  console.log('\n⚖️ Quiz Droit...');
  const qid = createQuiz('Quiz Droit du Commerce International', 10, 23, 15);

  addQCM(qid,
    "Quand la CVIM s'applique-t-elle automatiquement ?",
    ["Toujours entre entreprises de pays différents", "Quand les deux parties sont dans des États signataires", "Uniquement si le contrat le prévoit", "Entre particuliers de pays différents"],
    1,
    "La CVIM s'applique automatiquement aux ventes de marchandises entre parties ayant leur établissement dans des États différents, tous deux signataires (art. 1 §1 a)."
  );

  addVF(qid,
    "Selon la CVIM, l'acheteur peut réclamer un défaut de conformité à tout moment.",
    false,
    "L'acheteur doit examiner rapidement (art. 38) et notifier le défaut dans un délai raisonnable de 2-4 semaines (art. 39). Une réclamation tardive est irrecevable."
  );

  addQCM(qid,
    "Qu'est-ce qu'une violation essentielle (art. 25 CVIM) ?",
    ["Tout retard de paiement", "Un manquement privant l'autre partie de ce qu'elle attendait du contrat", "Un défaut mineur de conformité", "Un non-respect des Incoterms"],
    1,
    "La violation essentielle est un manquement si grave que l'autre partie est privée de ce qu'elle attendait du contrat. Seule cette violation permet la résolution."
  );

  addQCM(qid,
    "En Incoterm FOB, quand les risques sont-ils transférés à l'acheteur ?",
    ["À la signature du contrat", "À la livraison chez l'acheteur", "À la remise au transporteur (mise à bord du navire)", "Au passage de la frontière"],
    2,
    "FOB (Free On Board) : les risques sont transférés quand la marchandise est remise au transporteur au port d'embarquement."
  );

  addVF(qid,
    "La CVIM fixe le taux d'intérêt de retard applicable.",
    false,
    "L'art. 78 donne droit aux intérêts mais ne fixe PAS le taux. Celui-ci est déterminé par le droit national applicable."
  );

  addQCM(qid,
    "Quel est le montant habituel de l'indemnité de fin de contrat de l'agent commercial ?",
    ["6 mois de commissions", "1 an de commissions", "2 ans de commissions", "3 ans de commissions"],
    2,
    "La jurisprudence constante fixe l'indemnité à environ 2 ans de commissions brutes."
  );

  addVF(qid,
    "L'agent commercial est un salarié de l'entreprise.",
    false,
    "L'agent commercial est un mandataire INDÉPENDANT (art. L134-1 du Code de commerce). Il organise librement son activité."
  );

  addQCM(qid,
    "Qu'a changé la CJUE le 4 juin 2020 pour les agents commerciaux ?",
    ["Réduit l'indemnité de fin de contrat", "Élargi la définition : il suffit de négocier, même sans modifier les conditions", "Supprimé le statut d'agent commercial", "Rendu le contrat obligatoirement écrit"],
    1,
    "La CJUE a élargi la définition : il suffit que l'agent négocie les ventes, même sans pouvoir de modifier les termes. Plus de personnes protégées."
  );

  addQCM(qid,
    "Qu'est-ce que le hardship (imprévision) ?",
    ["L'impossibilité totale d'exécuter le contrat", "Un déséquilibre fondamental du contrat dû à des événements imprévus", "Une clause de résiliation anticipée", "Un retard de paiement"],
    1,
    "Le hardship survient quand des événements imprévus modifient fondamentalement l'équilibre du contrat. La partie lésée peut demander une renégociation."
  );

  addVF(qid,
    "En cas de hardship, la partie lésée peut suspendre l'exécution de ses obligations.",
    false,
    "Non ! La partie en hardship doit continuer à exécuter pendant la demande de renégociation. Seul le tribunal peut adapter ou résilier le contrat."
  );

  addQCM(qid,
    "Quand se forme le contrat d'achat sur Amazon ?",
    ["À la commande", "À la confirmation de commande", "À l'expédition (email de confirmation d'expédition)", "À la livraison"],
    2,
    "Le contrat n'est formé qu'à l'expédition. L'email de confirmation de commande n'est qu'un accusé de réception."
  );

  addQCM(qid,
    "Quel est le délai de rétractation du consommateur européen ?",
    ["7 jours", "14 jours", "30 jours", "60 jours"],
    1,
    "14 jours à compter de la réception du produit, sans avoir à se justifier."
  );

  addVF(qid,
    "Amazon exclut expressément l'application de la CVIM dans ses conditions de vente.",
    true,
    "Amazon choisit le droit luxembourgeois et exclut expressément la Convention de Vienne dans ses CGV."
  );

  addQCM(qid,
    "Les 5 étapes d'un cas pratique en droit international sont dans l'ordre :",
    [
      "Conclure → Qualifier → Appliquer → Identifier → Droit applicable",
      "Qualifier les faits → Droit applicable → Problèmes juridiques → Appliquer les règles → Conclure",
      "Droit applicable → Qualifier → Conclure → Identifier → Appliquer",
      "Identifier → Qualifier → Conclure → Appliquer → Droit applicable"
    ],
    1,
    "1) Qualifier les faits, 2) Déterminer le droit applicable, 3) Identifier les problèmes juridiques, 4) Appliquer les règles (citer les articles), 5) Conclure."
  );

  addQCM(qid,
    "Quelle est la différence entre force majeure et hardship ?",
    ["Aucune différence", "Force majeure = exécution impossible, Hardship = exécution plus onéreuse", "Force majeure = retard, Hardship = impossibilité", "Les deux permettent la suspension du contrat"],
    1,
    "Force majeure = exécution IMPOSSIBLE (événement irrésistible). Hardship = exécution encore possible mais BEAUCOUP plus onéreuse → renégociation."
  );

  console.log('  ✅ 15 questions');
  return qid;
}

// ============================================================
// 📈 QUIZ PILOTAGE
// ============================================================

function quizPilotage() {
  console.log('\n📈 Quiz Pilotage de la Performance...');
  const qid = createQuiz('Quiz Pilotage de la Performance', 41, 68, 15);

  addQCM(qid,
    "Quels sont les 4 facteurs d'évolution de la masse salariale ?",
    [
      "Inflation, productivité, concurrence, fiscalité",
      "Variation d'activité, effectifs, augmentations collectives, mesures individuelles (GVT)",
      "Recrutement, licenciement, formation, retraite",
      "CA, marge, résultat, trésorerie"
    ],
    1,
    "Les 4 facteurs : 1) Variation d'activité, 2) Effectifs, 3) Augmentations générales/catégorielles, 4) Mesures individuelles (GVT)."
  );

  addQCM(qid,
    "Qu'est-ce que l'effet de Noria ?",
    ["L'augmentation des salaires avec l'inflation", "L'impact du remplacement de salariés anciens par des jeunes", "L'effet des heures supplémentaires", "La variation due aux primes"],
    1,
    "L'effet de Noria mesure l'impact du remplacement de salariés anciens (chers) par des jeunes (moins chers). Formule : Nb remplacements × (salaire entrant - salaire sortant)."
  );

  addVF(qid,
    "Le tableau de bord et le reporting sont la même chose.",
    false,
    "Le tableau de bord est un outil de PILOTAGE tourné vers l'action. Le reporting est une remontée de données financières qui vérifie a posteriori si les objectifs sont atteints."
  );

  addQCM(qid,
    "Quelles sont les 4 perspectives du Balanced Scorecard ?",
    [
      "Finance, Marketing, Production, RH",
      "Court terme, Moyen terme, Long terme, Très long terme",
      "Finance, Clients, Processus internes, Apprentissage",
      "Stratégie, Tactique, Opérationnel, Fonctionnel"
    ],
    2,
    "Les 4 perspectives du BSC de Kaplan & Norton : Finance (actionnaires), Clients (satisfaction), Processus internes (qualité), Apprentissage (formation)."
  );

  addQCM(qid,
    "Combien d'indicateurs maximum dans un bon tableau de bord ?",
    ["1 à 3", "5 à 10", "15 à 20", "Autant que nécessaire"],
    1,
    "5 à 10 indicateurs maximum. Trop d'indicateurs noie l'information et empêche l'action."
  );

  addQCM(qid,
    "Comment se décompose l'écart sur matières ?",
    [
      "Écart sur quantités + Écart sur prix",
      "Écart sur volume + Écart sur mix",
      "Écart sur rendement + Écart sur efficience",
      "Écart favorable + Écart défavorable"
    ],
    0,
    "Écart sur quantités = (Qr - Qp) × Pp et Écart sur prix = (Pr - Pp) × Qr."
  );

  addVF(qid,
    "Un écart positif (coût réel > coût prévu) est favorable.",
    false,
    "Un écart positif signifie qu'on a dépensé PLUS que prévu → c'est DÉFAVORABLE."
  );

  addQCM(qid,
    "Quel est le point de départ du processus budgétaire ?",
    ["Le budget de trésorerie", "Le budget de production", "Le budget des ventes", "Le budget des investissements"],
    2,
    "Le budget des ventes est toujours le point de départ. Tout en découle : production, approvisionnements, trésorerie."
  );

  addQCM(qid,
    "La formule du coût cible est :",
    ["Coût cible = Coût réel + Marge", "Coût cible = Prix du marché - Marge souhaitée", "Coût cible = Prix de vente × (1 - TVA)", "Coût cible = Charges fixes + Charges variables"],
    1,
    "Le coût cible inverse l'équation : au lieu de Prix = Coût + Marge, on fait Coût = Prix marché - Marge voulue."
  );

  addQCM(qid,
    "Combien y a-t-il de mudas (gaspillages) dans le Lean ?",
    ["3", "5", "7", "9"],
    2,
    "Les 7 mudas : Surproduction, Attente, Transport, Sur-traitement, Stocks, Mouvements inutiles, Défauts."
  );

  addVF(qid,
    "Le Kaizen signifie 'amélioration continue par petits pas'.",
    true,
    "Kaizen = 'changement pour le bien' en japonais. Amélioration continue par petits pas, impliquant tout le monde."
  );

  addQCM(qid,
    "Que signifient les critères ESG ?",
    ["Efficacité, Sécurité, Gestion", "Écologique, Social, Gouvernance", "Économique, Stratégique, Global", "Environnement, Solidarité, Garantie"],
    1,
    "ESG = Écologique (environnement), Social et Gouvernance. Les 3 critères de la performance extra-financière."
  );

  addQCM(qid,
    "Quel style de conduite du changement est le plus durable ?",
    ["Autoritaire", "Persuasion", "Négociation", "Participatif / Concerté"],
    3,
    "Le style participatif/concerté génère le plus fort engagement et les résultats les plus durables, même s'il prend plus de temps."
  );

  addQCM(qid,
    "Que sont les 5M (diagramme d'Ishikawa) ?",
    ["5 types de management", "5 catégories de causes d'un problème", "5 niveaux de qualité", "5 étapes du Lean"],
    1,
    "Les 5M : Main-d'œuvre, Matière, Matériel, Méthodes, Milieu. Outil d'analyse des causes d'un problème."
  );

  addQCM(qid,
    "Qu'est-ce que le rolling forecast ?",
    ["Un budget fixé une fois par an", "Des prévisions glissantes réactualisées régulièrement", "Un outil de reporting financier", "Une méthode de calcul des coûts"],
    1,
    "Le rolling forecast = prévisions glissantes sur 12 mois, réactualisées régulièrement. Plus agile que le budget fixe annuel."
  );

  console.log('  ✅ 15 questions');
  return qid;
}

// ============================================================
// 👥 QUIZ RH
// ============================================================

function quizRH() {
  console.log('\n👥 Quiz RH...');
  const qid = createQuiz('Quiz Ressources Humaines', 62, 104, 15);

  addQCM(qid,
    "Qu'est-ce que le CSE et quand est-il obligatoire ?",
    [
      "Comité Social et Économique, obligatoire dès 11 salariés",
      "Comité de Sécurité et d'Emploi, obligatoire dès 50 salariés",
      "Commission Sociale d'Entreprise, obligatoire dès 100 salariés",
      "Comité Social et Économique, obligatoire dès 5 salariés"
    ],
    0,
    "Le CSE (Comité Social et Économique) a été créé par les ordonnances Macron de 2017. Obligatoire dans les entreprises de 11+ salariés."
  );

  addVF(qid,
    "La GRH est uniquement la responsabilité du service RH.",
    false,
    "La GRH est une responsabilité PARTAGÉE entre la DRH (qui définit les politiques et outils) et les managers opérationnels (qui les mettent en œuvre)."
  );

  addQCM(qid,
    "Quelles sont les 4 étapes du processus de recrutement ?",
    [
      "Annonce, CV, Entretien, Embauche",
      "Identification du besoin, Sourcing, Sélection, Intégration",
      "Profil, Annonce, Test, Contrat",
      "Besoin, Recherche, Négociation, Période d'essai"
    ],
    1,
    "1) Identification du besoin (profil poste + candidat), 2) Sourcing (recherche), 3) Sélection (tests, entretiens), 4) Intégration (onboarding)."
  );

  addQCM(qid,
    "Quel outil de sélection a la meilleure validité prédictive ?",
    ["L'entretien libre", "La graphologie", "Les mises en situation / simulations", "Les tests de personnalité"],
    2,
    "Les mises en situation ont la meilleure validité prédictive. La graphologie a une validité NULLE."
  );

  addVF(qid,
    "La graphologie est un outil de recrutement fiable et validé scientifiquement.",
    false,
    "La graphologie a une validité prédictive NULLE. Elle n'a aucune base scientifique pour prédire la performance professionnelle."
  );

  addQCM(qid,
    "Quel est l'effet de halo en recrutement ?",
    [
      "Favoriser les candidats qui arrivent en premier",
      "Une caractéristique positive/négative qui influence tout le jugement",
      "Préférer les candidats recommandés",
      "Surévaluer les candidats internes"
    ],
    1,
    "L'effet de halo : une seule caractéristique (positive ou négative) colore l'ensemble du jugement sur le candidat."
  );

  addQCM(qid,
    "Différence entre intéressement et participation ?",
    [
      "Aucune différence",
      "Intéressement = facultatif et lié aux résultats. Participation = obligatoire si 50+ salariés",
      "Intéressement = obligatoire. Participation = facultative",
      "Les deux sont obligatoires"
    ],
    1,
    "Intéressement = facultatif, lié aux résultats/performances. Participation = obligatoire si 50+ salariés pendant 5 ans, part des bénéfices."
  );

  addQCM(qid,
    "Comment fidéliser par la rémunération ?",
    [
      "Augmenter le salaire de base chaque année",
      "Proposer de la rémunération différée (stock-options, épargne) + avantages",
      "Distribuer des primes exceptionnelles",
      "Réduire le temps de travail"
    ],
    1,
    "La fidélisation passe par la rémunération différée (stock-options, PEE, ancienneté) et les avantages difficiles à quitter."
  );

  addQCM(qid,
    "Sur quelles 3 dimensions porte l'évaluation des salariés ?",
    [
      "Présence, Ponctualité, Productivité",
      "Performance, Compétences, Potentiel",
      "Résultats, Comportement, Motivation",
      "Objectifs, Moyens, Résultats"
    ],
    1,
    "Performance (résultats vs objectifs), Compétences (savoirs, savoir-faire, savoir-être) et Potentiel (capacité d'évolution future)."
  );

  addVF(qid,
    "L'entretien annuel d'évaluation est obligatoire pour toutes les entreprises.",
    false,
    "L'entretien annuel n'est PAS obligatoire, sauf si la convention collective le prévoit. 60% des salariés en bénéficient."
  );

  addQCM(qid,
    "Que signifie SMART pour les objectifs ?",
    [
      "Simple, Modeste, Adapté, Rapide, Temporaire",
      "Spécifique, Mesurable, Atteignable, Réaliste, Temporellement défini",
      "Stratégique, Managérial, Actionnable, Rentable, Total",
      "Social, Motivant, Ambitieux, Récompensé, Transparent"
    ],
    1,
    "SMART = Spécifiques, Mesurables, Atteignables, Réalistes, Temporellement définis. Standard pour fixer des objectifs."
  );

  addQCM(qid,
    "Qu'est-ce que l'évaluation à 360° ?",
    [
      "Une évaluation uniquement par le N+1",
      "Une évaluation par le N+1, les pairs, les subordonnés et les clients",
      "Une auto-évaluation",
      "Une évaluation par un cabinet externe"
    ],
    1,
    "L'évaluation à 360° dépasse la simple appréciation hiérarchique en intégrant N+1, pairs, subordonnés et clients. Surtout pour les cadres supérieurs."
  );

  addQCM(qid,
    "Quelle est la fréquence obligatoire de l'entretien professionnel ?",
    ["Tous les ans", "Tous les 2 ans", "Tous les 3 ans", "Tous les 5 ans"],
    1,
    "L'entretien professionnel est obligatoire tous les 2 ans. Il est DISTINCT de l'entretien annuel d'évaluation et porte sur les perspectives d'évolution."
  );

  addQCM(qid,
    "Qu'est-ce qu'une carrière protéenne (Hall) ?",
    [
      "Une carrière gérée par l'entreprise",
      "Une carrière pilotée par l'individu selon ses valeurs",
      "Une carrière uniquement verticale",
      "Une carrière dans le secteur public"
    ],
    1,
    "Carrière protéenne (Hall) : l'individu pilote sa propre carrière selon ses valeurs et aspirations, pas selon la hiérarchie de l'entreprise."
  );

  addQCM(qid,
    "Quels sont les 4 types de mobilité professionnelle ?",
    [
      "Interne, Externe, Temporaire, Permanente",
      "Verticale, Horizontale, Géographique, Inter-entreprises",
      "Promotion, Mutation, Détachement, Licenciement",
      "Ascendante, Descendante, Latérale, Diagonale"
    ],
    1,
    "4 types : Verticale (promotion), Horizontale (changement de fonction), Géographique (mutation), Inter-entreprises (mobilité externe)."
  );

  console.log('  ✅ 15 questions');
  return qid;
}

// ============================================================
// 🎯 QUIZ EXAMEN BLANC (multi-matières)
// ============================================================

function quizExamenBlanc() {
  console.log('\n🎯 Examen Blanc multi-matières...');
  const qid = createQuiz('Examen Blanc — Toutes matières', null, null, 20, 'examen');

  // Analyse Quanti (5 questions)
  addQCM(qid,
    "Le coefficient de variation sert à :",
    ["Calculer la moyenne", "Comparer la dispersion entre deux séries d'unités différentes", "Tester l'indépendance de deux variables", "Mesurer la corrélation"],
    1,
    "CV = (Écart-type / Moyenne) × 100. Permet de comparer la dispersion entre séries ayant des unités différentes."
  );

  addVF(qid,
    "Un R² de 0.75 signifie que X explique 75% de la variance de Y.",
    true,
    "R² = coefficient de détermination = proportion de la variance de Y expliquée par X."
  );

  addQCM(qid,
    "Les conditions d'application de l'ANOVA sont :",
    ["Échantillons grands et variables qualitatives", "Normalité, homogénéité des variances, indépendance", "Corrélation forte et p-value < 0.05", "2 groupes minimum et données nominales"],
    1,
    "ANOVA nécessite : normalité des distributions, homogénéité des variances (test de Levene), indépendance des observations."
  );

  addQCM(qid,
    "Quel est le seul indicateur de tendance centrale utilisable pour les variables qualitatives ?",
    ["La moyenne", "La médiane", "Le mode", "L'écart-type"],
    2,
    "Le mode (valeur la plus fréquente) est la seule mesure de tendance centrale utilisable pour les variables qualitatives."
  );

  addVF(qid,
    "Le test du Khi-deux nécessite des effectifs théoriques ≥ 5 dans chaque cellule.",
    true,
    "Condition de validité du Khi-deux : tous les effectifs théoriques doivent être ≥ 5."
  );

  // Droit (5 questions)
  addQCM(qid,
    "Art. 77 CVIM : le devoir de limitation du dommage signifie que :",
    ["Le dommage est plafonné à 10 000 €", "La partie lésée doit minimiser son préjudice", "Le juge peut réduire les dommages", "L'assurance couvre tout"],
    1,
    "Art. 77 : la partie lésée doit prendre des mesures raisonnables pour minimiser son préjudice (ex : trouver un autre fournisseur)."
  );

  addQCM(qid,
    "Quel est le délai de prescription pour réclamer l'indemnité de l'agent commercial ?",
    ["6 mois", "1 an", "2 ans", "5 ans"],
    1,
    "L'agent commercial dispose d'1 an après la cessation du contrat pour réclamer son indemnité de fin de contrat."
  );

  addVF(qid,
    "Le hardship permet à la partie lésée de suspendre immédiatement l'exécution du contrat.",
    false,
    "En cas de hardship, la partie lésée doit continuer à exécuter ses obligations pendant la demande de renégociation."
  );

  addQCM(qid,
    "Art. 49 CVIM : la résolution du contrat par l'acheteur est possible :",
    ["À tout moment", "Uniquement en cas de violation essentielle ou après Nachfrist", "Avec un préavis de 30 jours", "Seulement avec l'accord du vendeur"],
    1,
    "La résolution n'est possible qu'en cas de violation essentielle (art. 25) ou après expiration d'un délai supplémentaire (Nachfrist)."
  );

  addQCM(qid,
    "Les 4 conditions du hardship (art. 6.2.2 UNIDROIT) incluent :",
    [
      "Événements postérieurs, imprévisibles, hors du contrôle de la partie lésée, risque non assumé",
      "Impossibilité, irrésistibilité, extériorité, imprévisibilité",
      "Urgence, gravité, irréversibilité, bonne foi",
      "Accord mutuel, notification, délai raisonnable, compensation"
    ],
    0,
    "4 conditions : événements postérieurs au contrat, imprévisibles, hors du contrôle de la partie lésée, risque non assumé par elle."
  );

  // Pilotage (5 questions)
  addQCM(qid,
    "Que signifie GVT dans l'évolution de la masse salariale ?",
    ["Gestion de la Valeur Totale", "Glissement, Vieillissement, Technicité", "Garantie de Versement Trimestriel", "Grille de Validation Technique"],
    1,
    "GVT = Glissement (promotions individuelles), Vieillissement (progression d'ancienneté), Technicité (évolution des qualifications)."
  );

  addVF(qid,
    "Le Balanced Scorecard utilise uniquement des indicateurs financiers.",
    false,
    "Le BSC a été créé précisément parce que les indicateurs financiers ne suffisent pas. Il inclut 4 perspectives : Finance, Clients, Processus, Apprentissage."
  );

  addQCM(qid,
    "Un centre de profit est responsable de :",
    ["Minimiser les coûts", "Maximiser le CA", "Maximiser la marge (recettes - coûts)", "Optimiser le ROI"],
    2,
    "Centre de profit = responsable de la marge = recettes - coûts. Ex : filiale, ligne de produit."
  );

  addQCM(qid,
    "La CSRD est :",
    ["Un outil de calcul des coûts", "Une directive européenne de reporting extra-financier", "Un type de centre de responsabilité", "Un indicateur du BSC"],
    1,
    "CSRD = Corporate Sustainability Reporting Directive. Obligation de reporting extra-financier pour les grandes entreprises depuis 2024."
  );

  addQCM(qid,
    "La formule de la TVA à décaisser est :",
    ["TVA collectée + TVA déductible", "TVA collectée - TVA déductible", "TVA sur ventes × taux", "TVA déductible - TVA collectée"],
    1,
    "TVA à décaisser = TVA collectée (sur ventes) - TVA déductible (sur achats). Si négatif → crédit de TVA."
  );

  // RH (5 questions)
  addQCM(qid,
    "Formule de la réserve spéciale de participation :",
    [
      "RSP = ½ × (Bénéfice - 5% Capitaux propres) × Salaires / VA",
      "RSP = Bénéfice × 10%",
      "RSP = Masse salariale × 5%",
      "RSP = CA × 2%"
    ],
    0,
    "RSP = ½ × (Bénéfice - 5% Capitaux propres) × Salaires / Valeur Ajoutée."
  );

  addVF(qid,
    "L'entretien professionnel (obligatoire tous les 2 ans) est le même que l'entretien annuel d'évaluation.",
    false,
    "Ils sont DISTINCTS ! L'entretien professionnel porte sur les perspectives d'évolution et la formation. L'entretien annuel évalue la performance."
  );

  addQCM(qid,
    "Un mauvais recrutement coûte en moyenne :",
    ["1 mois de salaire", "6 mois de salaire", "1.5 à 3 fois le salaire annuel", "Le salaire net annuel"],
    2,
    "Un mauvais recrutement coûte 1.5 à 3 fois le salaire annuel (coûts de recrutement, formation, perte de productivité, nouveau recrutement)."
  );

  addQCM(qid,
    "Les 4 qualités d'une bonne politique de rémunération sont :",
    [
      "Élevée, Fixe, Simple, Uniforme",
      "Équitable, Compétitive, Motivante, Souple",
      "Transparente, Progressive, Indexée, Collective",
      "Attractive, Stable, Prévisible, Croissante"
    ],
    1,
    "Une bonne politique de rémunération est Équitable, Compétitive, Motivante et Souple."
  );

  addQCM(qid,
    "Qu'est-ce qu'un plan de succession en RH ?",
    [
      "Un plan de licenciement collectif",
      "Un outil identifiant les remplaçants potentiels pour les postes clés",
      "Un plan de retraite anticipée",
      "Un processus de transmission d'entreprise"
    ],
    1,
    "Le plan de succession identifie les remplaçants potentiels pour les postes clés de l'organisation. Anticipe les départs et assure la continuité."
  );

  console.log('  ✅ 20 questions');
  return qid;
}

// ============================================================
// MAIN
// ============================================================

function main() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  INJECTION QUIZ COHÉRENTS v2                         ║');
  console.log('║  Basés sur les fiches de révision reformulées         ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  // Clear old quizzes
  const oldQ = db.prepare('SELECT COUNT(*) as c FROM quizzes').get().c;
  console.log(`\n🗑️  Suppression de ${oldQ} anciens quiz...`);
  db.prepare('DELETE FROM questions').run();
  db.prepare('DELETE FROM quizzes').run();

  // Create quizzes
  quizAnalyseQuanti();
  quizDroit();
  quizPilotage();
  quizRH();
  quizExamenBlanc();

  // Stats
  const totalQ = db.prepare('SELECT COUNT(*) as c FROM quizzes').get().c;
  const totalQuestions = db.prepare('SELECT COUNT(*) as c FROM questions').get().c;

  console.log('\n══════════════════════════════════════');
  console.log('📊 RÉSULTAT FINAL:');
  console.log(`  ${totalQ} quiz créés`);
  console.log(`  ${totalQuestions} questions au total`);
  console.log('══════════════════════════════════════');

  db.close();
}

main();
