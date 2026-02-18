/**
 * INJECTION FICHES V2 — Refonte complète
 *
 * Stratégie : 1 fiche par thème de cours (regroupement de chapitres liés)
 * Chaque fiche est la SOURCE DE VÉRITÉ : 100% du contenu du cours couvert.
 *
 * La fiche est injectée dans le premier chapitre du groupe,
 * puis copiée (copyFiche) aux chapitres liés.
 */

const db = require('better-sqlite3')('./data/revision.db');

// ─── Helpers ───────────────────────────────────────────────

function clearAll() {
  const delSummaries = db.prepare('DELETE FROM summaries').run();
  const delQuestions = db.prepare('DELETE FROM questions').run();
  const delQuizzes = db.prepare('DELETE FROM quizzes').run();
  console.log(`🗑️  Nettoyage : ${delSummaries.changes} fiches, ${delQuizzes.changes} quiz, ${delQuestions.changes} questions supprimés`);
}

function insertFiche(chapterId, resumeContent, flashcards) {
  // Insert resume
  db.prepare('INSERT INTO summaries (chapter_id, type, content) VALUES (?, ?, ?)').run(
    chapterId, 'resume', resumeContent
  );
  // Insert flashcards (memo)
  db.prepare('INSERT INTO summaries (chapter_id, type, content) VALUES (?, ?, ?)').run(
    chapterId, 'memo', JSON.stringify(flashcards)
  );
}

function copyFiche(fromChapterId, toChapterId) {
  const existing = db.prepare('SELECT content, type FROM summaries WHERE chapter_id = ?').all(fromChapterId);
  for (const row of existing) {
    db.prepare('INSERT INTO summaries (chapter_id, type, content) VALUES (?, ?, ?)').run(
      toChapterId, row.type, row.content
    );
  }
}

// ═══════════════════════════════════════════════════════════
// RH — 5 fiches (1 par cours)
// ═══════════════════════════════════════════════════════════

function injectRH() {
  console.log('\n📚 RH — Injection de 5 fiches...');

  // ── FICHE 1 : Introduction à la GRH (Cours 1 : CH 104, 105, 106) ──
  insertFiche(104, `# Introduction à la GRH

## 1. Qu'est-ce que la GRH ?

La **Gestion des Ressources Humaines** (GRH) est l'ensemble des activités qui permettent à l'entreprise de disposer des ressources humaines correspondant à ses besoins **en quantité et en qualité** (Peretti, 1977). C'est un système managérial dont l'objectif est de mettre en œuvre la **dimension humaine de la stratégie** de l'organisation (Ferrary, 2014).

> « Je préfère parler de richesses humaines. Chaque personne est unique, singulière, porteuse de talents et de sens. » — Olivier Lajous, ancien DRH de la Marine Nationale

### La GRH a deux dimensions :

| Dimension individuelle | Dimension collective |
|---|---|
| Recrutement | GEPP (Gestion des Emplois et Parcours Professionnels) |
| Rémunérations | Communication interne |
| Évaluation | Organisation des conditions de travail |
| Gestion des carrières | Relations sociales |
| Formation | Gestion des effectifs |
| Gestion des compétences individuelles | Gestion des compétences collectives |

### Les enjeux de la GRH :
- **Choisir, conserver, former** le personnel dont l'entreprise a besoin
- Contribuer à une **action collective efficace, efficiente et créative**
- **Intégrer les choix individuels** des salariés

## 2. Les acteurs de la GRH

La GRH est une **fonction partagée** entre plusieurs acteurs :

**En interne :**
- **La DRH** : définit la politique RH, conçoit les outils, accompagne les managers
- **Les managers opérationnels** : participent au recrutement, évaluent, proposent des formations, accompagnent l'évolution de carrière, attribuent augmentations et primes
- La direction générale, les salariés eux-mêmes, les représentants du personnel

**En externe :**
- L'État, les syndicats, les organismes de Sécurité Sociale, la Médecine du travail, les consultants

## 3. L'évolution historique de la fonction RH

| Période | Théorie dominante | Fonction RH | Pratiques |
|---|---|---|---|
| 1900-1950 | Bureaucratie (taylorisme/fordisme) | Administration du personnel | Réglementation, procédures |
| 1950-1970 | Relations humaines | Service des relations humaines | Communication, culture |
| 1960-1980 | Courant socio-technique | Développement social | Organisation, conditions de travail |
| Après 1980 | Management stratégique | GRH | Culture d'entreprise, gestion prévisionnelle, logique compétence |

**Le courant des Relations humaines** se fonde sur l'écoute, la valorisation, la motivation, la fidélité, l'esprit d'équipe, la délégation pour associer les salariés aux décisions.

**Le courant socio-technique** se préoccupe des conditions de travail, des conséquences des nouvelles technologies, et de la mise en place de groupes de production autonomes.

**Le management stratégique** considère l'humain comme une ressource de l'entreprise et vise à mobiliser les individus autour du projet de l'organisation.

### Le modèle d'Ulrich (1997) — 4 rôles de la fonction RH :

|  | Focus processus | Focus personnes |
|---|---|---|
| **Orientation futur** | Partenaire stratégique | Agent du changement |
| **Orientation présent** | Expert administratif | Champion des salariés |

## 4. Le contexte de la GRH

Il n'y a pas un seul « bon » modèle de GRH. Les politiques RH doivent prendre en compte le contexte **interne et externe**.

### Contexte interne :
- **La stratégie** : approche descendante (top-down : on aligne les RH sur la stratégie) vs approche ascendante (bottom-up : les compétences des salariés alimentent la stratégie)
- **La culture d'entreprise** : valeurs partagées qui mobilisent les énergies et canalisent les comportements
- **Le rôle du CSE** (Comité Social et Économique)

### Le CSE — points clés :
- Remplace les anciennes instances (DP, CHSCT, CE) depuis les **ordonnances Macron du 22/09/2017**
- **Obligatoire** dans toutes les entreprises de **11 salariés et plus**
- Composé de l'employeur et de délégués du personnel
- **Missions** : réclamations individuelles/collectives, santé-sécurité-conditions de travail, saisine de l'inspection du travail
- Dans les entreprises de **50+ salariés** : expression collective sur la gestion économique et financière, l'organisation du travail, la formation
- **Délégués syndicaux** possibles dans les entreprises de **50+ salariés** : négociation (NAO), propositions, revendications

### Les 3 thèmes de négociation obligatoire :

| Thème | Exemples | Périodicité |
|---|---|---|
| Rémunérations, temps de travail, partage de la VA | Salaires, durée du travail, intéressement, participation | Annuelle |
| Égalité F/H et qualité de vie au travail | Articulation vie pro/perso, discrimination, droit à la déconnexion | Annuelle |
| GEPP et mixité des métiers (entreprises 300+ salariés) | GPEC, mobilité, formation des jeunes, emploi des seniors | Triennale |

### Contexte externe :
- Changement **économique** (mondialisation, concurrence)
- Changement **technologique** (digitalisation, IA)
- Changement **démographique** (vieillissement, diversité)
- Impacts de la **crise sanitaire** (télétravail, flexibilité)
- Changement **socio-culturel** (RSE, quête de sens)

## Points à retenir

- La GRH = fonction **partagée** entre DRH et managers opérationnels
- Évolution historique : administration du personnel → GRH stratégique
- Le **CSE** est l'instance unique de représentation du personnel (11+ salariés)
- La politique RH doit s'adapter au contexte interne (stratégie, culture, CSE) et externe (économie, techno, démographie)
- **Modèle d'Ulrich** : 4 rôles (partenaire stratégique, agent du changement, expert administratif, champion des salariés)`, [
    { recto: "Qu'est-ce que la GRH selon Peretti (1977) ?", verso: "L'ensemble des activités qui permettent à l'entreprise de disposer des ressources humaines correspondant à ses besoins en quantité et en qualité." },
    { recto: "Quelles sont les deux dimensions de la GRH ?", verso: "Dimension individuelle (recrutement, rémunération, évaluation, carrières, formation) et dimension collective (GEPP, communication interne, relations sociales, conditions de travail)." },
    { recto: "Quels sont les 4 rôles du modèle d'Ulrich (1997) ?", verso: "1. Partenaire stratégique\n2. Agent du changement\n3. Expert administratif\n4. Champion des salariés" },
    { recto: "Qu'est-ce que le CSE et quand est-il obligatoire ?", verso: "Comité Social et Économique, obligatoire dans les entreprises de 11+ salariés. Remplace les anciennes instances (DP, CHSCT, CE) depuis les ordonnances Macron du 22/09/2017." },
    { recto: "Quels sont les 3 thèmes de négociation obligatoire ?", verso: "1. Rémunérations, temps de travail et partage de la VA (annuelle)\n2. Égalité F/H et qualité de vie au travail (annuelle)\n3. GEPP et mixité des métiers - entreprises 300+ salariés (triennale)" },
    { recto: "Distinguez l'approche RH descendante et ascendante.", verso: "Descendante (top-down) : la stratégie dicte les besoins RH, on aligne les ressources humaines.\nAscendante (bottom-up) : les compétences des salariés alimentent et influencent la stratégie." },
    { recto: "Quels sont les 4 courants historiques de la fonction RH ?", verso: "1. Bureaucratie/taylorisme (1900-1950) → administration du personnel\n2. Relations humaines (1950-1970) → communication, culture\n3. Socio-technique (1960-1980) → conditions de travail\n4. Management stratégique (après 1980) → GRH, gestion prévisionnelle" }
  ]);
  copyFiche(104, 105);
  copyFiche(104, 106);
  console.log('  ✅ Fiche 1/5 : Introduction à la GRH (CH 104→105,106)');

  // ── FICHE 2 : Le Recrutement (Cours 2 : CH 116, 117, 118, 119) ──
  insertFiche(116, `# Le Recrutement

## 1. Les objectifs et enjeux du recrutement

### Pourquoi recruter ?
- **Compenser les départs** (retraites, démissions)
- **Accompagner les mouvements** de personnel (mutations internes)
- **Soutenir le développement** de l'organisation

### Les enjeux pour chaque partie :
- **Employeurs** : enjeux financiers (coûts d'un mauvais recrutement), politiques, d'image
- **Candidats** : enjeux d'évaluation et de sélection
- **Société** : évolution du marché de l'emploi, enjeux juridiques et éthiques

### La proposition de valeur employeur (Mortensen et Edmondson, 2023)

Pour attirer les candidats, l'entreprise doit proposer une valeur sur 4 axes :

| Court terme | Long terme |
|---|---|
| **Avantages matériels** : salaire, bureau, transports, flexibilité, horaires | **Opportunités de développement** : nouvelles compétences, rotation de postes, formations, évolution |
| **Liens et communauté** : appartenance, culture, franchise, liens sociaux | **Sens et raison d'être** : ambitions de l'entreprise, impact sociétal |

## 2. Le processus de recrutement en 4 étapes

### Étape 1 : Identification des besoins
- La demande vient du **N+1**
- L'analyse est faite par les **RH** : le poste est-il nécessaire ? Existe-t-il des alternatives ?
- **Profil du poste** : intitulé, position dans l'organigramme, missions, rémunération, perspectives
- **Profil du candidat** : formation, expériences, compétences (théoriques, techniques, comportementales), caractéristiques spécifiques

### Étape 2 : Le sourcing (recherche de candidatures)

**Recrutement interne vs externe :**

| Interne | Externe |
|---|---|
| Délai plus court | Renouvellement des compétences |
| Moins de candidatures à traiter | Nouvelles expériences |
| Coûts moins élevés | Pas de rivalités internes |
| Opportunité d'évolution pour les salariés | Décision plus neutre, fondée sur les aptitudes |
| Risque plus faible | - |
| Intégration plus facile | - |

**Faire ou faire faire ?** L'entreprise peut recruter seule ou recourir à un **cabinet de recrutement** (privilégié pour les profils spécifiques ou de haut niveau).

**Les canaux de recrutement :**
- **Internes** : site internet, Intranet, bourses d'emploi, portails RH
- **Externes via le marché** : jobboards (APEC, France Travail, HelloWork), candidatures spontanées, salons professionnels
- **Externes via les réseaux** : LinkedIn, cooptation, relations

**Chiffres clés (APEC 2023 — PME vs ETI/Grandes entreprises) :**

| Canal | PME | ETI/GE |
|---|---|---|
| Offre d'emploi | 83% | 94% |
| Réseaux sociaux | 72% | 85% |
| Réseau de contacts | 72% | 76% |
| Approche directe | 69% | 74% |
| Candidatures spontanées | 59% | 73% |
| CVthèques | 46% | 65% |
| Cooptation | 43% | 52% |

**Outils du e-recrutement :** jobboards (Monster), sites/blogs d'entreprise, chats recruteurs, blog RH (ex : Séphora = 80 000 candidatures pour 850 postes grâce à 130 blogueurs salariés), réseaux sociaux (ex : Thalès utilise LinkedIn pour sourcer des profils expérimentés 10-15 ans).

### Étape 3 : La sélection des candidats

**Cadre légal :**
- Les méthodes de sélection doivent être **portées à la connaissance du candidat et du CSE**
- Doivent être **pertinentes** au regard de la finalité poursuivie
- Résultats **confidentiels** (sauf vis-à-vis du candidat)
- **Interdiction de la discrimination** à l'embauche (article L.122-45 du Code du travail)

**Vérifications pratiquées (APEC 2022) :**
- 61% : vérification des références
- 37% : recherche internet sur le candidat
- 29% : vérification du diplôme
- Lettre de motivation : en baisse (69% en 2019 → 56% en 2022)
- Présélection téléphonique : en hausse (58% → 67%)

**Les outils de sélection et leur validité prédictive :**

| Outil | Validité prédictive | Qualités pratiques |
|---|---|---|
| **Mises en situation / Simulations** | Élevée | Très bonnes |
| **Tests d'aptitudes, de QI** | Élevée | Assez bonnes |
| **Entretiens structurés** | Assez bonne | Excellentes |
| **Références, performances passées** | Assez bonne | Bonnes |
| Tests de personnalité | Faible | Assez bonnes |
| Graphologie, morphopsychologie | **Nulle** | Assez bonnes |

**Tests utilisés (APEC 2022) :** mise en situation (26%), test de personnalité (20%), test de langue (16%), test psychotechnique (14%).

**L'entretien :**
- 2 types de questions : **motivationnelles** et relatives aux **compétences/savoir-faire**

**Les biais cognitifs :**
- Côté recruteur : **effet de halo** (première impression qui influence tout), **biais de projection** (favoriser les candidats qui nous ressemblent), **effet d'inférence** (tirer des conclusions hâtives)
- Côté candidat : **effet de désirabilité sociale** (se présenter sous son meilleur jour)

**La décision d'embauche** est un acte rationnel seulement en apparence : rationalité limitée (Simon), jeux de pouvoir (Crozier et Friedberg).

### Étape 4 : L'intégration (onboarding)

**Enjeux :**
- Réussite du recrutement
- Maîtrise du **taux de rotation** : 36% des CDI se soldent par un départ dans les 12 premiers mois
- Enjeux financiers
- Transmission de la culture et du savoir-faire
- Dépasser la **courbe de sous-efficacité** (le nouvel arrivant est moins productif au début)

**Actions d'intégration :**
- **S'informer** : livret d'intégration, formation, stages
- **S'intégrer socialement** : équipes, lieux de socialisation, événements
- **S'adapter psychologiquement** : parrain, tuteur, collègues
- **Apprendre les comportements requis** : feedback du N+1, contact avec les anciens

## Points à retenir

- Le recrutement = **4 étapes** : identification des besoins → sourcing → sélection → intégration
- La **proposition de valeur** : avantages matériels + développement + communauté + sens
- Les **mises en situation** ont la meilleure validité prédictive ; la **graphologie est nulle**
- **36% des CDI** échouent dans les 12 premiers mois → l'intégration est cruciale
- Attention aux **biais cognitifs** (halo, projection, inférence, désirabilité sociale)`, [
    { recto: "Quelles sont les 4 étapes du processus de recrutement ?", verso: "1. Identification des besoins (N+1 demande, RH analyse)\n2. Sourcing (recherche de candidatures : interne/externe)\n3. Sélection des candidats (tests, entretiens)\n4. Intégration / onboarding" },
    { recto: "Quels sont les 4 axes de la proposition de valeur employeur ?", verso: "1. Avantages matériels (salaire, flexibilité)\n2. Opportunités de développement (formation, évolution)\n3. Liens et communauté (appartenance, culture)\n4. Sens et raison d'être (impact, ambitions)" },
    { recto: "Quel outil de sélection a la meilleure validité prédictive ? Le pire ?", verso: "Meilleur : les mises en situation / simulations (validité élevée).\nPire : la graphologie et la morphopsychologie (validité NULLE)." },
    { recto: "Quels sont les biais cognitifs en recrutement ?", verso: "Côté recruteur : effet de halo (1ère impression), biais de projection (favoriser ceux qui nous ressemblent), effet d'inférence (conclusions hâtives).\nCôté candidat : désirabilité sociale." },
    { recto: "Pourquoi l'intégration est-elle cruciale ? Chiffre clé ?", verso: "36% des CDI se soldent par un départ dans les 12 premiers mois. L'intégration vise à informer, socialiser, adapter psychologiquement et enseigner les comportements requis." },
    { recto: "Quels sont les avantages du recrutement interne vs externe ?", verso: "Interne : délai court, coûts faibles, opportunité d'évolution, risque faible.\nExterne : renouvellement des compétences, pas de rivalités internes, décision plus neutre." },
    { recto: "Quels canaux de recrutement sont les plus utilisés (APEC 2023) ?", verso: "Offres d'emploi (83-94%), réseaux sociaux (72-85%), réseau de contacts (72-76%), approche directe (69-74%), candidatures spontanées (59-73%)." }
  ]);
  copyFiche(116, 117);
  copyFiche(116, 118);
  copyFiche(116, 119);
  console.log('  ✅ Fiche 2/5 : Le Recrutement (CH 116→117,118,119)');

  // ── FICHE 3 : La Rémunération (Cours 3 : CH 111, 112) ──
  insertFiche(111, `# La Rémunération

## 1. Les dimensions de la rémunération

La rémunération est un sujet central en GRH, car elle touche à **5 dimensions** :
- **Économique** : en 2019, la rémunération des salariés = 57,6% de la valeur ajoutée des entreprises
- **Psychologique** : puissant élément de motivation (ou de démotivation)
- **Sociologique** : lien fort entre rémunération et statut social
- **Politique** : au cœur du rapport de forces entre direction et partenaires sociaux
- **Éthique et juridique** : à travail égal, salaire égal

## 2. Les objectifs d'une politique de rémunération

- **Vis-à-vis de la stratégie** : être en cohérence avec les objectifs économiques
- **Vis-à-vis du marché de l'emploi** : attirer des individus en nombre et en qualité, tenir compte du niveau du secteur
- **Vis-à-vis des salariés** : réguler le turnover, motiver la performance

## 3. Les composantes de la rémunération

### 3.1 La rémunération directe (court terme)
- **Salaire de qualification** (fixe) : salaire de base + complément individuel
- **Salaire de performance** (variable) : individuel et/ou collectif
- **Primes** (fixes et variables) : liées au travail, à la fonction ou à l'emploi (pas aux résultats individuels)

### 3.2 Les périphériques légaux (moyen terme)

**L'intéressement :**
- Créé en **1959**, révisé en 1986
- Prime proportionnelle aux **résultats ou performances** de l'entreprise
- **Facultatif**, concerne tous les salariés
- Objectif : encourager l'implication dans les objectifs de l'entreprise
- Soumis au forfait social (20%) pour les entreprises de **250+ salariés**

**La participation :**
- Créée en **1967**
- **Obligatoire** pour les entreprises de **50+ salariés** (sans interruption sur 5 ans)
- Sommes versées immédiatement ou placées en épargne (choix du salarié)
- Soumise au forfait social de **20%**
- **Formule de la réserve spéciale de participation :**

> **RSP = ½ × (Bénéfice − 5% Capitaux propres) × Salaires / Valeur ajoutée**

**Nouveauté 2025 :** les entreprises de **11 à 49 salariés** ayant réalisé un bénéfice net fiscal ≥ 1% du CA pendant 3 années consécutives doivent mettre en place un dispositif de partage de la valeur (intéressement, participation, abondement PEE, ou prime de partage de la valeur).

**Le Plan d'Épargne Entreprise (PEE) :**
- Créé en **1967**, facultatif
- Système d'épargne collective : les salariés versent participation + intéressement + versements complémentaires
- L'entreprise peut **abonder** (contribution supplémentaire)
- Sommes **bloquées 5 ans** (sauf cas de déblocage anticipé)
- Soumis au forfait social de 20%

### 3.3 Les avantages en nature (court terme)
- **Individuels** : logement de fonction, voiture, frais de représentation, téléphone
- **Collectifs** : chèques déjeuner, remises sur produits, aides familiales, bourses d'études

### 3.4 Les périphériques statutaires
- **Court terme** : mutuelle maladie, assurance automobile
- **Moyen terme** : compte épargne-temps
- **Long terme** : complément de retraite, pension d'invalidité, assurance-vie

## 4. Le mix-rémunération

La politique de rémunération doit **équilibrer ses composantes** selon les objectifs :

| Objectif | Leviers de rémunération |
|---|---|
| **Attirer** | Rémunération directe élevée (salaire de base + primes) |
| **Fidéliser** | Rémunération différée (actionnariat, stock-options), primes d'ancienneté, avantages (mutuelle, logement) |
| **Motiver** | Éléments variables individuels liés à la performance |
| **Impliquer dans le collectif** | Variables collectives (intéressement, participation), actionnariat salarié |
| **Maintenir le climat social** | Pas d'iniquités internes, augmentations générales |

## 5. La gestion des rémunérations

### La masse salariale
**Définition :** somme qu'une organisation consacre à la rémunération de ses salariés sur une période donnée.

**Calcul :**
- Rémunérations nettes + charges sociales = **Rémunérations brutes**
- Rémunérations brutes + charges patronales (25 à 42%) = **Masse salariale**

> Exemple : Salaire net 1 540-1 600€ → Brut 2 000€ → Masse salariale 2 500-2 840€

### Facteurs d'évolution de la masse salariale :
1. **L'évolution de l'emploi** : mouvements (entrées/sorties), promotions, formes d'emploi flexibles (CDD, intérim, heures sup)
2. **L'évolution des rémunérations** : augmentations générales, catégorielles, individuelles

### Les tendances (Peretti) :
- Compétitivité par les **coûts** → augmentation de la part **variable**
- Compétitivité par la **qualité** → **individualisation** croissante
- Impératifs du marché **financier** → augmentation de la part **différée**

## 6. Les 4 qualités d'une bonne politique de rémunération

1. **Équitable** — pas d'iniquités internes
2. **Motivante** — lien entre performance et rétribution
3. **Compétitive** — attirer et retenir les talents
4. **Souple** — adaptable au contexte

## Points à retenir

- Rémunération = 4 composantes : directe + périphériques légaux + avantages en nature + statutaires
- **Intéressement** = facultatif, lié aux résultats ; **Participation** = obligatoire (50+ salariés), formule légale
- Le **mix-rémunération** adapte les composantes aux objectifs (attirer, fidéliser, motiver, impliquer)
- **Masse salariale** = rémunérations brutes + charges patronales
- Bonne politique = **équitable, motivante, compétitive, souple**`, [
    { recto: "Quelles sont les 5 dimensions de la rémunération ?", verso: "1. Économique (57,6% de la VA)\n2. Psychologique (motivation)\n3. Sociologique (statut social)\n4. Politique (rapport de forces)\n5. Éthique/juridique (à travail égal, salaire égal)" },
    { recto: "Quelle est la formule de la réserve spéciale de participation ?", verso: "RSP = ½ × (Bénéfice − 5% Capitaux propres) × Salaires / Valeur ajoutée" },
    { recto: "Quelle différence entre intéressement et participation ?", verso: "Intéressement : facultatif, créé en 1959, prime liée aux résultats/performances.\nParticipation : obligatoire pour 50+ salariés, créée en 1967, formule légale (RSP)." },
    { recto: "Comment fidéliser par la rémunération ?", verso: "Rémunération différée (actionnariat, stock-options), primes d'ancienneté, avantages dont il est difficile de se défaire (mutuelle, logement)." },
    { recto: "Quelles sont les 4 qualités d'une bonne politique de rémunération ?", verso: "Équitable, motivante, compétitive, souple." },
    { recto: "Comment calcule-t-on la masse salariale ?", verso: "Salaire net + charges sociales = Brut.\nBrut + charges patronales (25-42%) = Masse salariale.\nExemple : net 1 550€ → brut 2 000€ → masse salariale 2 500-2 840€." },
    { recto: "Quelles sont les 4 composantes de la rémunération ?", verso: "1. Rémunération directe (salaire fixe + variable + primes)\n2. Périphériques légaux (intéressement, participation, PEE)\n3. Avantages en nature (voiture, logement, chèques déjeuner)\n4. Périphériques statutaires (mutuelle, retraite complémentaire)" }
  ]);
  copyFiche(111, 112);
  console.log('  ✅ Fiche 3/5 : La Rémunération (CH 111→112)');

  // ── FICHE 4 : L'Évaluation des salariés (Cours 4 : CH 113, 114) ──
  insertFiche(113, `# L'Évaluation des salariés

## 1. Introduction

L'évaluation individuelle est une pratique ancienne dont le poids est renforcé par des évolutions **économiques** (flexibilité, concurrence) et **sociales** (libéralisme, individualisme).

## 2. Les objectifs de l'évaluation

L'évaluation répond à des objectifs différents selon les acteurs :

### Pour la Direction :
- Accroître et contrôler la **performance**
- Maintenir un **management de proximité** (lien stratégie/opération)
- Clarifier les objectifs → **adhésion et responsabilisation** des salariés
- Développer les **compétences et capacités d'évolution**
- **Objectiver** le système pour justifier les décisions (rémunération, formation, carrière)

### Pour la DRH :
- Avoir des **retours terrain** pour améliorer les processus RH
- Faire un point sur les **compétences collectives** et l'évolution des métiers
- **Soutenir les managers** dans la mise en œuvre du processus
- **Conseiller les salariés** en orientation professionnelle, maintenir l'équité

### Pour les managers :
- **Échanger** avec les salariés sur le bilan de l'année, l'organisation du travail
- **Apprécier les résultats** de N et fixer les objectifs de N+1
- **Motiver** en donnant de la reconnaissance, en responsabilisant, en aidant à orienter la carrière

### Pour le salarié :
- **S'exprimer** sur sa situation professionnelle, son management souhaité, ses aspirations
- **Être informé** sur la perception de son comportement professionnel et les opportunités d'évolution

## 3. Sur quoi porte l'évaluation ?

L'évaluation porte sur **3 dimensions** :

### La performance (résultats)
- Mesurée à partir des **objectifs fixés** (individuels ou collectifs)
- Des **projets et actions** réalisés
- D'une **comparaison entre salariés** (ranking)

### Les compétences (moyens mis en œuvre)
- **Savoirs et savoir-faire** mobilisés dans le travail
- **Savoir-être** = comportement professionnel
- Répond à la question : **comment** le salarié est-il parvenu aux résultats ?

### Le potentiel (capacité future)
- Ce que la personne est capable de **devenir ou de faire** dans le futur
- Très **difficile à apprécier**

## 4. Les outils de l'évaluation

### 4.1 L'entretien annuel d'évaluation
- Concerne **60% de l'ensemble des salariés** et **86% dans les entreprises de 500+ salariés**
- **Non obligatoire** (sauf si convention collective ou accord d'entreprise)
- Entre le salarié et son **N+1** (avec supervision du N+2)
- Comprend une **auto-évaluation** et une évaluation par le manager

**L'entretien porte sur :**
- Bilan de l'année (performance)
- Évaluation des compétences (points forts et d'amélioration)
- Attentes du salarié et de l'organisation
- Besoins en formation
- Objectifs et plan d'action pour N+1

**Actions découlant :**
- Fixation des **objectifs SMART**
- Déclenchement de processus RH : recrutement, rémunération, formation, gestion de carrière

> L'évaluation est **au cœur de la GRH** : elle alimente tous les autres processus.

### 4.2 L'évaluation à 360°
- Objectif : dépasser la simple appréciation hiérarchique, mettre en avant la **dimension relationnelle**
- Surtout utilisée pour les **cadres supérieurs**
- Adaptée aux organisations en réseau ou par projets
- Le salarié est évalué par son N+1, ses pairs, ses subordonnés, et parfois ses clients

### 4.3 Autres outils
- Entretiens réguliers (check-ins)
- Évaluations par objectifs avec mises à jour trimestrielles

## 5. Les difficultés de l'évaluation

**Critiques des différents acteurs (Trépo et al.) :**

| Acteur | Critique |
|---|---|
| **Directions** | Absence d'effets positifs, voire contre-productifs (démotivation, stratégies individualistes) |
| **Managers** | Complexifie les pratiques, met en porte-à-faux (être à la fois juge et coach) |
| **Évalués** | Écart entre le discours (transparence, objectivité) et le vécu (langue de bois, manque d'équité) |

**Risques de décrédibilisation si :**
- Les formations promises ne sont pas mises en œuvre
- L'évaluateur ne différencie pas ses appréciations (« unité de l'équipe »)
- Les efforts ne sont pas récompensés (contrôle de la masse salariale)
- Les salariés développent les compétences les plus accessibles plutôt que les plus utiles
- Les compétences nouvelles ne sont pas transmises

## Points à retenir

- Évaluation = **3 dimensions** : performance, compétences, potentiel
- L'**entretien annuel** n'est pas obligatoire mais concerne 60% des salariés
- **Objectifs SMART** : Spécifiques, Mesurables, Atteignables, Réalistes, Temporellement définis
- L'évaluation à **360°** dépasse l'appréciation hiérarchique simple
- Attention aux **biais et limites** : subjectivité, juge/coach, promesses non tenues`, [
    { recto: "Sur quelles 3 dimensions porte l'évaluation des salariés ?", verso: "1. Performance (résultats : objectifs fixés, projets réalisés, ranking)\n2. Compétences (moyens : savoirs, savoir-faire, savoir-être)\n3. Potentiel (capacité future, difficile à apprécier)" },
    { recto: "L'entretien annuel d'évaluation est-il obligatoire ?", verso: "Non, sauf si défini par convention collective ou accord d'entreprise. Il concerne 60% des salariés (86% dans les entreprises de 500+ salariés)." },
    { recto: "Que signifie SMART pour les objectifs ?", verso: "Spécifiques, Mesurables, Atteignables, Réalistes, Temporellement définis." },
    { recto: "Qu'est-ce que l'évaluation à 360° ?", verso: "Évaluation par le N+1, les pairs, les subordonnés et parfois les clients. Dépasse l'appréciation hiérarchique simple. Surtout utilisée pour les cadres supérieurs." },
    { recto: "Quelles sont les critiques de l'évaluation selon Trépo ?", verso: "Directions : pas d'effets positifs, voire démotivation.\nManagers : complexifie les pratiques, porte-à-faux juge/coach.\nÉvalués : écart discours/vécu, manque d'équité." },
    { recto: "Quels processus RH sont déclenchés par l'évaluation ?", verso: "Recrutement, rémunération, formation, gestion de carrière. L'évaluation est au cœur de la GRH et alimente tous les autres processus." }
  ]);
  copyFiche(113, 114);
  console.log('  ✅ Fiche 4/5 : L\'Évaluation des salariés (CH 113→114)');

  // ── FICHE 5 : La Gestion des carrières (Cours 5 : CH 120, 121, 122) ──
  insertFiche(120, `# La Gestion des carrières

## 1. Définition et enjeux

### Définition
La gestion des carrières est une **« action finalisée, organisée et animée pour définir la succession des affectations individuelles du personnel »** (Roger, 1991). C'est le point de rencontre entre les intérêts de l'organisation et ceux de l'individu.

### Objectifs
**Pour l'organisation :**
- Gérer les emplois et les compétences
- Développer un brassage culturel et des connaissances
- Stimuler la motivation individuelle
- Favoriser la collaboration entre unités, diffuser les techniques de gestion

**Pour les salariés :**
- Améliorer le rapport entre contributions et rétributions

## 2. Les formes de carrières

### De la carrière traditionnelle aux nouvelles carrières

**Carrière traditionnelle :** relation d'emploi sur le long terme, intégrant une **promotion verticale**. La carrière se déroule le long de filières valorisant l'avancement et la position hiérarchique.

**Nouvelles carrières (à partir des années 90) :** avec la réduction des niveaux hiérarchiques, le travail en équipe/projet, la mobilité horizontale et inter-entreprises :
- **Carrière protéenne** (Hall) : l'individu pilote sa propre carrière selon ses valeurs
- **Carrière sans frontières** (Arthur) : parcours entre plusieurs organisations
- **Carrière nomade** (Cadin) : au gré des opportunités

> Il revient essentiellement à l'individu de construire son parcours. L'entreprise peut l'aider en développant son **employabilité**.

### Les 2 filières principales :
1. **Filière managériale** : responsabilités croissantes, encadrement. *Limite :* tout le monde n'aspire pas au pouvoir et les compétences managériales sont spécifiques
2. **Filière d'expertise** : développement des compétences, projets complexes, référence d'expertise ou de formation

## 3. La politique de mobilité

### 3.1 Quelle mobilité souhaite l'organisation ?

**4 types de mobilité :**
- **Verticale** : changement de niveau hiérarchique (promotion)
- **Horizontale** : changement de fonction ou de métier, sans changement hiérarchique
- **Géographique** : changement de lieu (local, national, international)
- **Inter-entreprises** : changement d'employeur (nouvelles carrières)

Questions clés : quels salariés ? Quelles filières normales ? Quel rythme ? Interne ou externe ?

### 3.2 Quelle mobilité est possible selon le contexte ?

**Contexte interne :** taille, structure organisationnelle, culture, orientations stratégiques, politique RH

**Contexte externe (Livian, 2004) :** environnement économique, système éducatif (importance du diplôme), normes sociales (métiers genrés), rôle des pouvoirs publics (législation, conventions collectives)

### 3.3 Qui est en charge de la gestion des carrières ?

| Acteur | Rôle |
|---|---|
| **Direction RH** | Propose les outils, participe à la politique, gère certains salariés |
| **Spécialistes RH** | Animent la politique |
| **Managers** | Évaluent, orientent |
| **Direction Générale** | Valide les grandes orientations, gère certains cadres |
| **Le salarié** | Met en œuvre ses compétences, négocie son projet, recherche l'info |

## 4. Les outils de gestion des carrières

### Outils pour les besoins de l'entreprise :
- **Organigrammes de remplacement** (plans de succession)
- **Cartes des emplois**, répertoires de métiers, référentiels de compétences
- **Parcours repères**

### Outils pour l'articulation projets individuels/entreprise :
- **Revue de personnel**
- **Entretien professionnel** (obligatoire tous les **2 ans** depuis 2014)
- **Formation**

### Outils pour les projets individuels :
- Formation à la gestion des carrières
- **Bilan de compétences**
- **Conseillers mobilité**

### L'entretien professionnel (≠ entretien annuel d'évaluation !)
- **Obligatoire** pour tous les salariés depuis 2014, tous les **2 ans**
- Porte sur : l'évolution professionnelle (qualification, emploi), le suivi des formations/certifications/progression, la réflexion sur l'avenir professionnel
- Mené par un **responsable RH** plutôt que par le manager

## 5. La gestion des hauts potentiels

### Identifier les hauts potentiels
Les hauts potentiels = cadres ayant atteint (ou susceptibles d'atteindre) un certain niveau de responsabilités.

**Matrice de Ference (1977) :**

| | Performance faible | Performance élevée |
|---|---|---|
| **Potentiel élevé** | Espoirs | ⭐ **Étoiles** |
| **Potentiel faible** | Branches mortes | Piliers |

### Pratiques spécifiques :
- Promotions rapides
- Fidélisation
- Test du niveau de performance
- Test de l'implication

> Exemple : le groupe SEB évalue le potentiel sur 3 critères : leadership, capacité d'innovation, esprit entrepreneurial, avec une notation sur 3 ans (N-2, N-1, N).

## Points à retenir

- Évolution : carrière traditionnelle (verticale) → nouvelles carrières (**protéenne, sans frontières, nomade**)
- **4 types de mobilité** : verticale, horizontale, géographique, inter-entreprises
- **Entretien professionnel** ≠ entretien annuel : obligatoire tous les 2 ans, porté par les RH
- **Matrice de Ference** : Étoiles (potentiel + performance élevés), Piliers, Espoirs, Branches mortes
- La gestion des carrières est une **co-responsabilité** individu/organisation`, [
    { recto: "Qu'est-ce qu'une carrière protéenne (Hall) ?", verso: "L'individu pilote lui-même sa carrière selon ses propres valeurs, et non selon les besoins de l'organisation. Il construit son parcours au gré des opportunités." },
    { recto: "Quels sont les 4 types de mobilité professionnelle ?", verso: "1. Verticale (promotion hiérarchique)\n2. Horizontale (changement de fonction, même niveau)\n3. Géographique (changement de lieu)\n4. Inter-entreprises (changement d'employeur)" },
    { recto: "Quelle différence entre entretien professionnel et entretien annuel ?", verso: "L'entretien professionnel est OBLIGATOIRE tous les 2 ans (depuis 2014), porte sur l'évolution professionnelle, mené par un RH.\nL'entretien annuel est NON obligatoire, porte sur la performance, mené par le N+1." },
    { recto: "Décrivez la matrice de Ference (1977).", verso: "4 cases croisant performance et potentiel :\n- Étoiles : perf élevée + potentiel élevé\n- Piliers : perf élevée + potentiel faible\n- Espoirs : perf faible + potentiel élevé\n- Branches mortes : perf faible + potentiel faible" },
    { recto: "Quelles sont les 2 filières de carrière principales ?", verso: "1. Filière managériale : responsabilités croissantes, encadrement\n2. Filière d'expertise : développement des compétences, projets complexes, référent technique" },
    { recto: "Quels sont les outils de gestion des carrières ?", verso: "Pour l'entreprise : organigrammes de remplacement, référentiels de compétences, parcours repères.\nPour l'articulation : revue de personnel, entretien professionnel, formation.\nPour l'individu : bilan de compétences, conseillers mobilité." }
  ]);
  copyFiche(120, 121);
  copyFiche(120, 122);
  console.log('  ✅ Fiche 5/5 : La Gestion des carrières (CH 120→121,122)');

  console.log('📚 RH — 5 fiches injectées, couvrant 14 chapitres');
}

// ═══════════════════════════════════════════════════════════
// ANALYSE QUANTI — 3 fiches (1 par cours)
// ═══════════════════════════════════════════════════════════

function injectAnalyseQuanti() {
  console.log('\n📊 Analyse Quanti — Injection de 3 fiches...');

  // ── FICHE 1 : Analyses descriptives univariées (Cours 4 : CH 5, 6, 7) ──
  insertFiche(5, `# Analyses descriptives univariées

## 1. Introduction — De la donnée à la décision

L'objectif n'est pas de « faire des statistiques », mais de **comprendre l'histoire que racontent les données**. L'analyse descriptive univariée étudie **une seule variable à la fois** avant de croiser les variables entre elles.

**Exemples d'insights basés sur les données :**
- « Les clients les plus fidèles commandent plus souvent en semaine »
- « Les salariés les plus jeunes se déclarent moins satisfaits »

## 2. Typologie des variables

Avant d'analyser, il faut identifier le **type de données** — c'est ce qui détermine les outils statistiques possibles.

| Type de variable | Définition | Exemples | Outils statistiques |
|---|---|---|---|
| **Qualitative nominale** | Catégories sans ordre | Sexe, secteur, région | Fréquences, pourcentages |
| **Qualitative ordinale** | Catégories avec ordre | Satisfaction (faible/moyen/fort) | Médiane, mode |
| **Quantitative discrète** | Nombres entiers | Nombre de commandes | Moyenne, histogramme |
| **Quantitative continue** | Valeurs réelles | Salaire, montant d'achat | Moyenne, écart-type |

> ⚠️ **Piège classique** : une moyenne sur une variable « genre » n'a aucun sens. Utiliser le mauvais outil = résultats absurdes.

**Exemples en entreprise :**
- Marketing : type de client, fréquence d'achat, note de satisfaction
- RH : ancienneté, service, score de performance
- Finance : chiffre d'affaires, taux de marge, coût moyen

## 3. Les indicateurs de tendance centrale

| Indicateur | Définition | Exemple |
|---|---|---|
| **Moyenne** | Somme des valeurs / nombre d'observations | Salaire moyen : 2 450€ |
| **Médiane** | Valeur centrale (50% au-dessus, 50% en dessous) | Médiane du CA : 120k€ |
| **Mode** | Valeur la plus fréquente | Catégorie la plus vendue : café |

> **La médiane est plus robuste que la moyenne** face aux valeurs extrêmes. Si la médiane < moyenne → quelques hauts salaires tirent la moyenne vers le haut.

## 4. Les indicateurs de dispersion

| Indicateur | Définition | Exemple |
|---|---|---|
| **Étendue** | Max − Min | 18–65 ans |
| **Variance (σ²)** | Moyenne des carrés des écarts à la moyenne | σ² = 4 900 |
| **Écart-type (σ)** | Racine carrée de la variance = dispersion moyenne | σ = 70 |
| **Coefficient de variation (CV)** | Écart-type / Moyenne (en %) = dispersion relative | CV = 15% |

> **Forte dispersion = hétérogénéité** du groupe → à explorer managérialement.

### Exemple concret (Service RH) :
Entreprise de 200 salariés : Salaire moyen = 2 800€, Médiane = 2 600€, Écart-type = 900€
- Salaires dispersés → profils variés
- Médiane < Moyenne → quelques hauts salaires tirent la moyenne
- **Implication RH** : communication sur l'équité salariale

### Exemple marketing :
Enquête satisfaction (500 clients) : Moyenne = 7,2/10, Écart-type = 1,8
- Moyenne correcte mais dispersion → hétérogénéité d'expérience
- **Recommandation** : segmenter la clientèle pour identifier les profils insatisfaits

## 5. Visualisation des données

| Type de graphique | Usage |
|---|---|
| **Histogramme** (densité) | Variables quantitatives |
| **Diagramme en barres** | Variables qualitatives |
| **Boxplot** (boîte à moustaches) | Comparer des groupes |

> Toujours accompagner un graphique d'un **message clair** pour le management.

## 6. Pièges fréquents

- Confondre moyenne et médiane
- Oublier la dispersion (une moyenne seule ne suffit jamais)
- Se baser sur les valeurs extrêmes
- Négliger la taille de l'échantillon
- Un salaire moyen de 4 000€ peut cacher de fortes inégalités

## 7. Cas pratique : CaféEMN

Chaîne de cafés dans 15 villes, 500 clients étudiés (âge, genre, fréquence de visite, satisfaction, montant moyen du ticket).

**Résultats clés :**
- Clientèle jeune (moyenne d'âge 32,7 ans), 54,6% femmes
- Fréquence moyenne : 2,28 visites/semaine → clientèle régulière
- Satisfaction élevée : 7,77/10 (écart-type 0,91)
- Panier moyen : 6,83€ (stable, homogène)
- Clients venant ≥3 fois/semaine = satisfaction plus élevée → **fidélité rime avec satisfaction**

**Recommandations managériales :**
- Ciblage : décor moderne, Wi-Fi, réseaux sociaux (Instagram, TikTok)
- Programme de fidélité (carte de points, boisson offerte)
- Campagne « Redécouvrez CaféEMN » pour les clients inactifs

## Points à retenir

- **Toujours commencer** par une analyse descriptive univariée avant de croiser les variables
- **4 types de variables** : qualitative nominale/ordinale, quantitative discrète/continue
- **Tendance centrale** : moyenne, médiane (plus robuste), mode
- **Dispersion** : écart-type, coefficient de variation — une moyenne sans dispersion est incomplète
- L'objectif final : **donner du sens aux chiffres pour guider l'action managériale**`, [
    { recto: "Quels sont les 4 types de variables statistiques ?", verso: "1. Qualitative nominale (catégories sans ordre : sexe, région)\n2. Qualitative ordinale (catégories ordonnées : satisfaction faible/moyen/fort)\n3. Quantitative discrète (nombres entiers : nb de commandes)\n4. Quantitative continue (valeurs réelles : salaire, montant)" },
    { recto: "Différence entre moyenne et médiane ? Laquelle est plus robuste ?", verso: "Moyenne = somme des valeurs / nombre d'observations. Médiane = valeur centrale (50% au-dessus, 50% en dessous). La médiane est plus robuste face aux valeurs extrêmes." },
    { recto: "Que sont la variance, l'écart-type et le coefficient de variation ?", verso: "Variance (σ²) = moyenne des carrés des écarts à la moyenne.\nÉcart-type (σ) = racine carrée de la variance, mesure la dispersion.\nCoefficient de variation (CV) = σ/moyenne en %, mesure la dispersion relative." },
    { recto: "Quels graphiques utiliser selon le type de variable ?", verso: "Quantitative → histogramme (densité)\nQualitative → diagramme en barres\nComparaison de groupes → boxplot (boîte à moustaches)" },
    { recto: "Pourquoi une moyenne seule ne suffit jamais ?", verso: "Sans la dispersion, on ne sait pas si le groupe est homogène ou hétérogène. Ex : un salaire moyen de 4 000€ peut cacher de fortes inégalités. Il faut toujours regarder l'écart-type et la médiane." },
    { recto: "Dans l'exemple CaféEMN, quel lien entre fidélité et satisfaction ?", verso: "Les clients venant ≥3 fois/semaine ont une satisfaction plus élevée. Fidélité et satisfaction sont positivement corrélées. Recommandation : programme de fidélité." }
  ]);
  copyFiche(5, 6);
  copyFiche(5, 7);
  console.log('  ✅ Fiche 1/3 : Analyses descriptives univariées (CH 5→6,7)');

  // ── FICHE 2 : Relations entre deux variables (Cours 5 : CH 8, 9) ──
  insertFiche(8, `# Relations entre deux variables

## 1. Introduction — Pourquoi analyser une relation ?

Après l'analyse univariée (une variable à la fois), on passe à l'analyse **bivariée** : étudier la **relation entre deux variables** pour prendre des décisions fondées sur les données.

**Exemples :** Les clients satisfaits achètent-ils plus ? L'âge influence-t-il la performance ? Le type de client est-il lié au taux d'abandon ?

## 2. Quel test selon le type de variables ?

| Variables | Type de relation | Test adapté |
|---|---|---|
| **Qualitative × Qualitative** | Association | **Test du Khi-deux** (+ V de Cramér) |
| **Quantitative × Quantitative** | Corrélation | **Corrélation de Pearson** |
| **Qualitative × Quantitative** (2 groupes) | Comparaison | **Test t de Student** |
| **Qualitative × Quantitative** (3+ groupes) | Comparaison | **ANOVA** (voir fiche suivante) |

## 3. Test du Khi-deux (2 variables qualitatives)

### Objectif
Déterminer si deux variables qualitatives ont un **lien structurel** ou si leur co-occurrence est due au **hasard**.

### La démarche en 3 étapes :
1. **Tableau de contingence** : visualiser la répartition des catégories
2. **Visualisation** : diagramme en barres (juxtaposées ou empilées)
3. **Test statistique** : Khi-deux pour confirmer

### Logique du test d'hypothèse (analogie innocent/coupable) :
- **H₀** (hypothèse nulle) : pas d'association (indépendance) → « le suspect est innocent »
- **H₁** (hypothèse alternative) : association entre les variables → « le suspect est coupable »
- On commence toujours par supposer l'innocence (H₀ vraie)
- La **p-value** = probabilité d'observer nos données si H₀ est vraie

> **Si p < 0,05** → association statistiquement significative (on rejette H₀)
> **Si p ≥ 0,05** → pas de preuve suffisante d'association

### Le V de Cramér — force de l'association

Le Khi-deux dit si une association existe, mais pas sa **force**. Le V de Cramér mesure l'intensité sur une échelle de 0 à 1 :

| V de Cramér | Interprétation |
|---|---|
| 0,00 – 0,10 | Association très faible |
| 0,10 – 0,30 | Faible à modérée |
| 0,30 – 0,50 | Modérée à forte |
| > 0,50 | Très forte |

### Conditions de validité du Khi-deux :
- Observations **indépendantes** (un individu = une seule classe)
- Échantillon **suffisamment grand**
- **Effectifs théoriques > 5** dans au moins 80% des cases

## 4. Corrélation de Pearson (2 variables quantitatives)

### Le nuage de points (scatterplot)
Premier outil pour visualiser la relation : observer la **forme**, la **direction** et la **dispersion**.

| Observation | Signification |
|---|---|
| Points montent ensemble | Relation **positive** |
| L'un monte, l'autre descend | Relation **négative** |
| Points dispersés | **Aucune relation** |
| Forme courbe | Relation **non linéaire** |

### Le coefficient r de Pearson
- Mesure la **force et le sens** d'une relation **linéaire**
- Valeurs entre **-1** et **+1**
- L'intensité = **|r|** (valeur absolue)

| |r| | Interprétation |
|---|---|
| 0,00 – 0,20 | Très faible |
| 0,20 – 0,40 | Faible |
| 0,40 – 0,60 | Modérée |
| 0,60 – 0,80 | Forte |
| 0,80 – 1,00 | Très forte |

> ⚠️ **Corrélation ≠ causalité** ! Deux variables corrélées n'impliquent pas que l'une cause l'autre.

### Significativité :
- On calcule aussi la p-value du coefficient r
- **Si p < 0,05** → la corrélation est statistiquement significative
- Un r faible peut être significatif avec un grand échantillon, mais sans intérêt pratique

## 5. Test t de Student (1 qualitative × 1 quantitative, 2 groupes)

### Objectif
Comparer les **moyennes de deux groupes** pour déterminer si la différence est réelle ou due au hasard.

### Démarche :
1. **H₀** : pas de différence (moyenne groupe 1 = moyenne groupe 2)
2. **H₁** : il y a une différence
3. Calculer la **p-value**
4. Si p ≤ 0,05 → différence **statistiquement significative**

### La statistique t :

> t = (μ₁ − μ₂) / √(s₁²/n₁ + s₂²/n₂)

Où μ = moyenne, s = écart-type, n = taille de l'échantillon.

### Exemple CaféEMN :
Question : les hommes dépensent-ils plus que les femmes ?
- Genre (H/F) = qualitative, Montant du ticket = quantitative
- Résultat : p-value > 0,05 → **pas de différence significative** entre les genres

### Interprétation business :
S'il existe une différence significative → ajuster les offres marketing, adapter les prix, comprendre les segments.

## Points à retenir

- **Khi-deux** = 2 qualitatives → association (+ V de Cramér pour la force)
- **Pearson** = 2 quantitatives → corrélation (r entre -1 et +1)
- **Test t** = 1 qualitative (2 groupes) × 1 quantitative → comparaison de moyennes
- Toujours vérifier la **p-value < 0,05** pour conclure
- Corrélation **≠** causalité
- L'analogie **innocent/coupable** aide à comprendre la logique des tests d'hypothèse`, [
    { recto: "Quel test utiliser pour 2 variables qualitatives ?", verso: "Test du Khi-deux pour tester l'association, puis le V de Cramér pour mesurer la force de l'association (échelle 0-1)." },
    { recto: "Que mesure le coefficient r de Pearson ? Comment l'interpréter ?", verso: "Mesure la force et le sens d'une relation LINÉAIRE entre 2 variables quantitatives. Valeurs de -1 à +1. |r| : 0-0.20 très faible, 0.20-0.40 faible, 0.40-0.60 modéré, 0.60-0.80 fort, 0.80-1 très fort." },
    { recto: "Qu'est-ce que la p-value dans un test d'hypothèse ?", verso: "Probabilité d'observer nos données si H₀ est vraie. Si p < 0,05 → on rejette H₀ (résultat significatif). Si p ≥ 0,05 → pas de preuve suffisante pour rejeter H₀." },
    { recto: "Quelles sont les conditions de validité du test du Khi-deux ?", verso: "1. Observations indépendantes\n2. Échantillon suffisamment grand\n3. Effectifs théoriques > 5 dans au moins 80% des cases" },
    { recto: "Quelle est la formule du test t de Student ?", verso: "t = (μ₁ − μ₂) / √(s₁²/n₁ + s₂²/n₂)\nOù μ = moyenne, s = écart-type, n = taille de l'échantillon.\nSi p-value ≤ 0,05 → différence significative." },
    { recto: "Corrélation implique-t-elle causalité ?", verso: "NON. Deux variables corrélées ne signifient pas que l'une cause l'autre. Il peut y avoir une variable cachée, un hasard, ou une relation indirecte." }
  ]);
  copyFiche(8, 9);
  console.log('  ✅ Fiche 2/3 : Relations entre deux variables (CH 8→9)');

  // ── FICHE 3 : ANOVA (Cours 6 : CH 10, 11) ──
  insertFiche(10, `# Analyse de la variance (ANOVA)

## 1. Pourquoi l'ANOVA ?

Le test t compare les moyennes de **2 groupes**. Mais en entreprise, on manipule souvent des variables qualitatives à **3 groupes ou plus** (ex : stratégie A / B / C, service IT / Marketing / Finance / RH).

**Problème** : multiplier les tests t deux à deux → **inflation du risque d'erreur** (plus on fait de tests, plus on risque de trouver une différence par hasard).

**Solution** : l'ANOVA (Analysis of Variance) = **généralisation du test t** pour 3+ groupes.

## 2. Logique statistique de l'ANOVA

### Question centrale :
> La variabilité observée est-elle due **aux groupes** ou au **hasard** ?

### Décomposition de la variance :
- **Variance totale** = Variance expliquée + Variance résiduelle
- **Variance expliquée** (inter-groupes) = différences entre les groupes
- **Variance résiduelle** (intra-groupes) = différences à l'intérieur des groupes

### La statistique F :
> **F = Variance inter-groupes / Variance intra-groupes**

- Plus **F est grand**, plus l'effet du facteur est probable
- Si la variabilité entre groupes est grande par rapport à celle à l'intérieur → il y a bien une différence

## 3. ANOVA à un facteur (One-way ANOVA)

### Quand l'utiliser ?
- Une **variable quantitative** (ex : ventes, satisfaction, performance)
- Une **variable qualitative à ≥ 3 modalités** (ex : politique de prix Bas/Moyen/Premium)

### Démarche du test :
1. **H₀** : toutes les moyennes sont égales
2. **H₁** : au moins une moyenne est différente
3. Calculer la **p-value**
4. Si p ≤ 0,05 → différence **statistiquement significative**

> ⚠️ **L'ANOVA ne dit pas QUELS groupes diffèrent** — seulement qu'il y a une différence quelque part.

### Vérification préalable : test de Levene (homogénéité des variances)
- Si p-value de Levene **> 0,05** → homogénéité OK → lire les résultats du test de **Fisher**
- Si p-value de Levene **≤ 0,05** → pas d'homogénéité → lire les résultats du test de **Welch**

### Test post-hoc de Tukey
Pour savoir **quels groupes** diffèrent, on utilise un test post-hoc (Tukey) qui compare toutes les paires de groupes.

### Exemple : Politique de prix
- Variable quantitative : Ventes mensuelles (€)
- Variable qualitative : Politique de prix (Bas / Moyen / Premium)
- Résultat ANOVA : F significatif → il y a une différence
- Test de Tukey → identifie quelles politiques diffèrent entre elles

## 4. ANOVA à deux facteurs (Two-way ANOVA)

Les décisions business dépendent rarement d'un seul facteur. L'ANOVA à deux facteurs teste **3 questions** :

**Exemple** : satisfaction des clients selon le canal de vente ET le programme de fidélité.

| Question | Ce qu'on teste |
|---|---|
| Le canal influence-t-il la satisfaction ? | **Effet principal** du facteur 1 |
| La fidélité influence-t-elle la satisfaction ? | **Effet principal** du facteur 2 |
| L'effet du canal dépend-il de la fidélité ? | **Effet d'interaction** |

## 5. Exercices types et interprétation

### Exercice 1 : Montant du panier selon le type de client
- Nouveau (32€), Régulier (41€), Fidèle (52€), Premium (68€)
- F = 18,7, p < 0,001 → différence significative
- Tukey : tous les groupes sont significativement différents
- **Conclusion** : le type de client influence fortement le panier moyen. Le segment Premium est le plus stratégique.

### Exercice 2 : Performance selon le service
- IT (82), Finance (78), Ventes (71), Marketing (69), RH (66)
- F = 9,85, p < 0,001 → différence significative
- Tukey : IT ≠ Marketing, RH, Ventes (p < 0,01) ; Finance ≠ RH (p < 0,05)
- **Décisions RH** : enquêter sur les facteurs de performance de l'IT, proposer des formations aux services moins performants

## Points à retenir

- **ANOVA** = comparer les moyennes de **3+ groupes** (généralisation du test t)
- **F = variance inter / variance intra** — plus F est grand, plus l'effet est probable
- L'ANOVA dit qu'il y a une différence mais **pas entre quels groupes** → test post-hoc de **Tukey**
- Vérifier l'**homogénéité des variances** avec le test de Levene
- ANOVA à 2 facteurs : tester les effets principaux ET l'**effet d'interaction**`, [
    { recto: "Pourquoi utiliser l'ANOVA plutôt que plusieurs tests t ?", verso: "Multiplier les tests t augmente le risque d'erreur (trouver une différence par hasard). L'ANOVA teste en une seule fois si au moins une moyenne est différente parmi 3+ groupes." },
    { recto: "Que représente la statistique F en ANOVA ?", verso: "F = Variance inter-groupes / Variance intra-groupes. Plus F est grand, plus les différences entre groupes sont probables. Si p-value ≤ 0,05, la différence est significative." },
    { recto: "L'ANOVA indique-t-elle quels groupes diffèrent ?", verso: "NON. L'ANOVA dit seulement qu'au moins une moyenne est différente. Pour savoir LESQUELS diffèrent, on utilise un test post-hoc de Tukey." },
    { recto: "À quoi sert le test de Levene en ANOVA ?", verso: "Il vérifie l'homogénéité des variances entre les groupes. Si p > 0,05 → variances homogènes → lire Fisher. Si p ≤ 0,05 → variances non homogènes → lire Welch." },
    { recto: "Quelles sont les 3 questions de l'ANOVA à 2 facteurs ?", verso: "1. Effet principal du facteur 1 ? (ex : le canal influence-t-il la satisfaction ?)\n2. Effet principal du facteur 2 ? (ex : la fidélité influence-t-elle ?)\n3. Effet d'interaction ? (ex : l'effet du canal dépend-il de la fidélité ?)" }
  ]);
  copyFiche(10, 11);
  // Also copy to the exam correction chapters (they should see the relevant fiches)
  copyFiche(5, 2);  // Correction ch2 gets descriptive stats fiche
  copyFiche(8, 3);  // Correction ch3 gets correlation fiche
  copyFiche(10, 4); // Correction ch4 gets ANOVA fiche
  console.log('  ✅ Fiche 3/3 : ANOVA (CH 10→11, also copied to exam correction chapters)');

  console.log('📊 Analyse Quanti — 3 fiches injectées, couvrant 10 chapitres');
}

// ═══════════════════════════════════════════════════════════
// DROIT — 4 fiches
// ═══════════════════════════════════════════════════════════

function injectDroit() {
  console.log('\n⚖️ Droit — Injection de 4 fiches...');

  // ── FICHE 1 : La CVIM — Convention de Vienne sur la Vente Internationale de Marchandises ──
  // Covers: Cas Pratiques 1-4 (CH 23,28, 24,29, 25,30, 26,31) + Amazon CGV (CH 12-19)
  insertFiche(23, `# La CVIM — Convention de Vienne (1980)

## 1. Présentation générale

La **Convention des Nations Unies sur les Contrats de Vente Internationale de Marchandises** (CVIM ou Convention de Vienne, 1980) est le texte de référence du commerce international. Elle harmonise les règles applicables aux contrats de vente entre parties établies dans des États différents.

### Conditions d'application (art. 1 §1 a) :
La CVIM s'applique **de plein droit** lorsque :
1. Le contrat porte sur une **vente de marchandises**
2. Les parties ont leur établissement dans **deux États différents**
3. Ces deux États sont **parties à la Convention**

> Les parties peuvent exclure la CVIM par une clause contraire (art. 6). En l'absence de clause, la CVIM prévaut.

### Exclusions :
- Ventes aux consommateurs, ventes aux enchères
- Ventes de valeurs mobilières, navires, électricité
- Contrats de services purs

## 2. Obligations du vendeur

### 2.1 Obligation de conformité (art. 35)
Le vendeur doit livrer des marchandises :
- Conformes en **quantité, qualité et description**
- **Emballées** de manière adéquate
- Propres à l'**usage habituel** des marchandises du même type
- Propres à tout **usage spécial** porté à la connaissance du vendeur

### 2.2 Obligation de livraison
- À la **date convenue** ou dans un **délai raisonnable** (art. 33)
- Au **lieu convenu** (art. 31)

## 3. Obligations de l'acheteur

### 3.1 Examen et dénonciation des défauts
- **Examiner** les marchandises dans un délai **aussi bref que possible** (art. 38)
- **Notifier** le défaut de conformité dans un **délai raisonnable** après sa découverte (art. 39 §1)
- Délai raisonnable : généralement **2 à 4 semaines** selon la jurisprudence
- **Déchéance absolue** : pas de dénonciation possible après **2 ans** à compter de la remise (art. 39 §2)

> ⚠️ **Si la réclamation est tardive, l'acheteur perd TOUS ses recours** (art. 39 §1). C'est le piège le plus fréquent en droit de la vente internationale.

### 3.2 Obligation de paiement (art. 53-59)
- Payer le prix au **lieu et moment** convenus
- Prendre livraison des marchandises

## 4. La violation essentielle du contrat (art. 25)

Une violation est **essentielle** lorsqu'elle cause à l'autre partie un préjudice tel qu'elle la prive **substantiellement** de ce qu'elle était en droit d'attendre du contrat.

### Conséquences :
- Seule la violation essentielle permet la **résolution du contrat** (art. 49 pour l'acheteur, art. 64 pour le vendeur)
- Un simple retard n'est pas toujours une violation essentielle — cela dépend du contexte
- Un **délai additionnel** (Nachfrist) peut être fixé (art. 47) : si non respecté → violation essentielle

## 5. Recours de l'acheteur

| Recours | Article | Condition |
|---|---|---|
| **Réduction proportionnelle du prix** | Art. 50 | Défaut de conformité |
| **Livraison de remplacement** | Art. 46 §2 | Violation essentielle |
| **Réparation** | Art. 46 §3 | Raisonnable |
| **Résolution du contrat** | Art. 49 | Violation essentielle uniquement |
| **Dommages et intérêts** | Art. 74 | Préjudice prévisible |

## 6. Recours du vendeur

| Recours | Article | Condition |
|---|---|---|
| **Exiger le paiement du prix** | Art. 62 | Action en exécution |
| **Résolution du contrat** | Art. 64 | Violation essentielle ou Nachfrist expiré |
| **Dommages et intérêts** | Art. 74 | Perte subie + manque à gagner |
| **Intérêts de retard** | Art. 78 | De plein droit, taux selon droit national |

## 7. Le transfert des risques

### Règle générale :
Les risques sont transférés à l'acheteur **au moment de la livraison** (art. 69).

### Cas selon les Incoterms :
| Incoterm | Transfert des risques | Exemple |
|---|---|---|
| **FOB** (Free On Board) | À la remise au **transporteur** au port d'embarquement | FOB Le Havre : risques transférés au chargement |
| **CIF** (Cost, Insurance, Freight) | À la remise au transporteur au port d'embarquement | CIF Barcelone : vendeur paie assurance + fret, mais risques transférés au chargement |
| **DDP** (Delivered Duty Paid) | À la mise à disposition de l'acheteur au **lieu de destination** | DDP Lyon : vendeur supporte tous les risques jusqu'à Lyon |

> ⚠️ L'Incoterm détermine QUI supporte les risques pendant le transport. En FOB, si les marchandises sont endommagées pendant le transport, c'est l'**acheteur** qui subit la perte.

## 8. Les intérêts de retard (art. 78)

- En cas de non-paiement, le créancier a droit à des **intérêts moratoires**
- La CVIM **ne fixe pas le taux** : il est déterminé par le droit national applicable (souvent le droit du pays du créancier)
- Les intérêts courent à compter de la **date d'exigibilité** du paiement

## 9. Les CGV dans le commerce international

### L'exemple Amazon :
- La commande = une **offre** d'achat par le client
- Le contrat est conclu uniquement à l'**expédition** (e-mail de confirmation d'expédition)
- **Droit de rétractation** : 14 jours pour les consommateurs (directive UE)
- Amazon **exclut expressément** l'application de la CVIM dans ses CGV
- Droit applicable : droit du **Grand-Duché de Luxembourg**

## Points à retenir

- La CVIM s'applique de plein droit aux ventes internationales entre États signataires
- L'acheteur doit notifier les défauts dans un **délai raisonnable** (2-4 semaines) sous peine de perdre tous ses recours
- Seule la **violation essentielle** permet la résolution du contrat
- Le **transfert des risques** dépend de l'Incoterm choisi (FOB, CIF, DDP)
- L'art. 78 prévoit des intérêts de retard mais **sans fixer le taux**`, [
    { recto: "Quelles sont les 3 conditions d'application de la CVIM ?", verso: "1. Vente de marchandises\n2. Parties établies dans deux États différents\n3. Ces deux États sont parties à la Convention\n\nLes parties peuvent l'exclure par clause contraire (art. 6)." },
    { recto: "Quel est le délai pour notifier un défaut de conformité (CVIM) ?", verso: "L'acheteur doit examiner les marchandises dès que possible (art. 38) et notifier le défaut dans un délai raisonnable (art. 39). Jurisprudence : 2 à 4 semaines. Déchéance absolue : 2 ans après la remise." },
    { recto: "Qu'est-ce qu'une violation essentielle au sens de l'art. 25 CVIM ?", verso: "Une violation qui cause un préjudice privant substantiellement l'autre partie de ce qu'elle était en droit d'attendre du contrat. Seule la violation essentielle permet la résolution du contrat." },
    { recto: "Quels sont les recours de l'acheteur selon la CVIM ?", verso: "Art. 50 : réduction du prix\nArt. 46 : remplacement (si violation essentielle) ou réparation\nArt. 49 : résolution (violation essentielle uniquement)\nArt. 74 : dommages et intérêts" },
    { recto: "Comment fonctionne le transfert des risques selon les Incoterms ?", verso: "FOB : risques transférés au chargement (port d'embarquement)\nCIF : idem FOB pour les risques, mais vendeur paie fret + assurance\nDDP : vendeur supporte tous les risques jusqu'au lieu de destination" },
    { recto: "L'art. 78 CVIM fixe-t-il un taux d'intérêt de retard ?", verso: "NON. L'art. 78 prévoit le droit à des intérêts moratoires en cas de non-paiement, mais le taux est déterminé par le droit national applicable (souvent le droit du pays du créancier)." },
    { recto: "Qu'est-ce que le mécanisme de Nachfrist (art. 47 CVIM) ?", verso: "L'acheteur peut fixer un délai additionnel raisonnable pour l'exécution par le vendeur. Si le vendeur ne s'exécute pas dans ce délai, cela constitue une violation essentielle permettant la résolution du contrat." }
  ]);
  // Copy to all CVIM cas pratiques chapters
  copyFiche(23, 28);  // Cas 1 corrigé
  copyFiche(23, 24);  // Cas 2 énoncé
  copyFiche(23, 29);  // Cas 2 corrigé
  copyFiche(23, 25);  // Cas 3 énoncé
  copyFiche(23, 30);  // Cas 3 corrigé
  copyFiche(23, 26);  // Cas 4 énoncé
  copyFiche(23, 31);  // Cas 4 corrigé
  // Copy to Amazon CGV chapters (relevant for CGV / droit applicable)
  copyFiche(23, 12);
  copyFiche(23, 16);  // Droit applicable
  console.log('  ✅ Fiche 1/4 : La CVIM (CH 23→28,24,29,25,30,26,31,12,16)');

  // ── FICHE 2 : L'Agent Commercial ──
  // Covers: Code de Commerce (CH 27), Les Echos (CH 38), Cas LH Wind (CH 22)
  insertFiche(27, `# L'Agent Commercial

## 1. Définition et statut

### Définition légale (art. L134-1 Code de commerce)
L'agent commercial est un **mandataire** qui, en qualité de **profession indépendante**, sans être lié par un contrat de service, est chargé **à titre permanent** de :
- **Négocier** et, le cas échéant, **conclure** des contrats
- De vente, d'achat, de location ou de prestation de services
- **Au nom et pour le compte** de producteurs, industriels, commerçants (= le commettant)

Il peut être une **personne physique ou morale**.

### Origine du statut :
- Développé par l'usage en France, puis codifié par un **décret de 1958**
- Directive européenne **86/653/CEE** du 18 décembre 1986 (harmonisation)
- **Loi du 25 juin 1991** (transposition), codifiée aux articles L.134-1 et suivants du Code de commerce

## 2. Les obligations réciproques

### Le contrat d'agence commerciale :
- Conclu dans l'**intérêt commun** des parties (art. L134-4)
- Régi par une obligation de **loyauté** et d'**information réciproque**
- L'agent doit exécuter son mandat avec la **diligence d'un bon professionnel**
- Le commettant doit **mettre l'agent en mesure d'exécuter** son mandat

### Représentation concurrente :
- L'agent peut accepter la représentation de **nouveaux commettants** sans autorisation
- **Sauf** s'il s'agit d'une société **concurrente** d'un commettant existant → accord requis (art. L134-3)

## 3. La rémunération de l'agent

### La commission (art. L134-5 à L134-9)
- Tout élément de rémunération variant en fonction du nombre ou de la valeur des opérations
- À défaut de stipulation : rémunération conforme aux **usages du secteur**, sinon rémunération **raisonnable**

### Droit à commission :
- **Pendant le contrat** (art. L134-6) : pour toute transaction conclue grâce à son intervention, ou avec un client de son secteur géographique
- **Après la cessation** (art. L134-7) : si la transaction résulte principalement de son activité pendant le contrat et est conclue dans un délai raisonnable

## 4. La cessation du contrat et l'indemnité

### Le préavis (art. L134-11)
Durée minimale selon l'ancienneté :
| Ancienneté | Préavis |
|---|---|
| 1ère année | 1 mois |
| 2ème année | 2 mois |
| 3ème année et + | 3 mois |

### L'indemnité compensatrice (art. L134-12) — point clé
- En cas de cessation du contrat, l'agent a droit à une **indemnité compensatrice** du préjudice subi
- Cette indemnité compense la **perte de clientèle** qui reste acquise au commettant
- Montant fixé par la jurisprudence : **2 ans de commissions** (moyenne des dernières années)

### Exceptions — pas d'indemnité si :
- **Faute grave** de l'agent (art. L134-13)
- Résiliation à l'**initiative de l'agent** (sauf si justifiée par des circonstances imputables au commettant, ou l'âge/maladie de l'agent)

### Le droit de rétention (art. L134-14)
L'agent commercial peut retenir les marchandises ou documents en sa possession pour garantir le paiement de ses commissions.

## 5. La notion de « négociation » — Arrêt CJUE du 4 juin 2020

### Le problème :
La Cour de cassation française avait une interprétation **restrictive** : « négocier » impliquait le droit de **modifier les conditions de vente** (notamment le prix). Si l'intermédiaire ne pouvait pas modifier le prix, il n'était pas agent commercial.

### La décision de la CJUE :
La Cour de justice de l'Union européenne a adopté une position **plus large** : la négociation inclut le fait de **convaincre, prospecter et présenter** les produits au client, même sans pouvoir modifier le prix.

### Conséquences :
- **Reconnaissance plus fréquente** du statut d'agent commercial
- Plus de personnes bénéficient de la **protection** (indemnité de 2 ans de commissions)
- Il n'est plus nécessaire de prouver que l'agent pouvait modifier les conditions de vente

## 6. Le droit applicable — Contrats internationaux

### Choix de la loi applicable :
- Les parties peuvent choisir librement la loi applicable au contrat
- En l'absence de choix : la loi du pays de l'agent commercial s'applique généralement

### Enjeux du choix de loi :
- Le droit **californien** peut ne prévoir **aucun préavis ni indemnité**
- Le droit **français** (et européen) protège fortement l'agent → indemnité de 2 ans
- Le choix de loi peut priver l'agent de toute protection

> Le **Règlement Rome I** (CE 593/2008) permet, dans certains cas, d'appliquer les lois de police du pays de l'agent, même si le contrat désigne une loi étrangère.

## Points à retenir

- Agent commercial = mandataire **indépendant**, agit au nom et pour le compte du commettant
- Obligation de **loyauté** et d'**information réciproque**
- Indemnité de fin de contrat = **2 ans de commissions** (sauf faute grave)
- Depuis l'arrêt **CJUE 2020** : « négocier » ≠ modifier le prix → définition élargie
- Attention au **choix de loi applicable** dans les contrats internationaux`, [
    { recto: "Qu'est-ce qu'un agent commercial selon le Code de commerce ?", verso: "Un mandataire indépendant, chargé à titre permanent de négocier et éventuellement conclure des contrats (vente, achat, location, services) au nom et pour le compte d'un commettant (art. L134-1)." },
    { recto: "À combien s'élève l'indemnité de fin de contrat de l'agent commercial ?", verso: "La jurisprudence fixe l'indemnité compensatrice à 2 ans de commissions (moyenne des dernières années). Elle compense la perte de clientèle restant acquise au commettant (art. L134-12)." },
    { recto: "Quels sont les délais de préavis pour un agent commercial ?", verso: "1ère année : 1 mois\n2ème année : 2 mois\n3ème année et plus : 3 mois\n(art. L134-11 Code de commerce)" },
    { recto: "Qu'a changé l'arrêt CJUE du 4 juin 2020 pour les agents commerciaux ?", verso: "La CJUE a élargi la définition de 'négocier' : il n'est plus nécessaire de pouvoir modifier le prix. Convaincre, prospecter et présenter les produits suffit. Cela élargit le statut protecteur à plus d'intermédiaires." },
    { recto: "Quand l'agent commercial n'a-t-il PAS droit à l'indemnité ?", verso: "1. Faute grave de l'agent\n2. Résiliation à l'initiative de l'agent (sauf si justifiée par le commettant, ou l'âge/maladie de l'agent)" },
    { recto: "Pourquoi le choix de la loi applicable est-il crucial pour un agent commercial ?", verso: "Le droit français/européen garantit une indemnité de 2 ans de commissions. Le droit californien peut ne prévoir aucun préavis ni indemnité. Le Règlement Rome I peut permettre d'appliquer les lois de police du pays de l'agent." }
  ]);
  copyFiche(27, 38);  // Les Echos
  copyFiche(27, 22);  // Cas LH Wind
  console.log('  ✅ Fiche 2/4 : L\'Agent Commercial (CH 27→38,22)');

  // ── FICHE 3 : La Clause d'Arbitrage ──
  // Covers: CH 41
  insertFiche(41, `# La Clause d'Arbitrage en droit international

## 1. Définition

La **clause compromissoire** (ou clause d'arbitrage) est une clause insérée dans un contrat par laquelle les parties s'engagent à soumettre à l'**arbitrage** tout litige qui pourrait naître du contrat, plutôt que de recourir aux tribunaux étatiques.

## 2. Le principe de compétence-compétence

### Règle fondamentale (art. 1448 et 1506 du Code de procédure civile) :
En présence d'une clause compromissoire, le tribunal national doit se déclarer **incompétent**, même si le tribunal arbitral n'est pas encore saisi.

**Exception unique** : le tribunal étatique peut retenir sa compétence si un examen sommaire lui permet de constater que la clause est **nulle ou manifestement inapplicable**.

> La **priorité est donnée à l'arbitre**, qui doit se prononcer lui-même sur sa propre compétence.

## 3. L'extension de la clause d'arbitrage

### Principe (jurisprudence constante) :
Une clause compromissoire dans un contrat international a une **validité et une efficacité propres**. Son application peut être **étendue aux parties directement impliquées** dans l'exécution du contrat, même si elles n'en sont pas signataires.

### Conditions d'extension :
- La situation et les activités du tiers doivent permettre de **présumer qu'il avait connaissance** de l'existence et de la portée de la clause
- Le tiers doit être **directement impliqué** dans l'exécution du contrat

### Application concrète (CA Paris, 24 mai 2022) :
- Un contrat de construction en Iran contenait une clause d'arbitrage
- Des garanties bancaires avaient été émises par une banque non signataire du contrat
- La Cour a jugé que le litige sur les garanties avait un **lien évident** avec le contrat contenant la clause
- La clause d'arbitrage s'appliquait donc au litige, même si la banque n'était pas partie au contrat

## 4. Portée de la clause d'arbitrage

La clause doit s'appliquer à **tous les litiges liés au contrat**, y compris :
- Les conditions de **résiliation** du contrat
- Les **conséquences** découlant de la résiliation
- Les litiges relatifs à l'**exécution des travaux** ou après leur achèvement
- Les litiges survenant **avant ou après** la résiliation, l'abandon ou la violation du contrat

## 5. L'arbitrage vs la justice étatique

| Critère | Arbitrage | Justice étatique |
|---|---|---|
| **Rapidité** | Souvent plus rapide | Procédures longues |
| **Confidentialité** | Confidentiel | Public |
| **Expertise** | Arbitres spécialisés | Juges généralistes |
| **Coût** | Élevé (honoraires des arbitres) | Moins cher |
| **Appel** | Limité (annulation seulement) | Voies de recours classiques |
| **Exécution internationale** | Convention de New York (1958) | Exequatur nécessaire |

## Points à retenir

- La clause compromissoire donne **priorité à l'arbitre** sur les tribunaux étatiques
- L'arbitre statue sur sa propre compétence (**compétence-compétence**)
- La clause peut s'étendre aux **non-signataires** impliqués dans l'exécution du contrat
- La clause couvre **tous les litiges** liés au contrat (résiliation, exécution, conséquences)`, [
    { recto: "Qu'est-ce que le principe de compétence-compétence ?", verso: "En présence d'une clause d'arbitrage, le tribunal étatique doit se déclarer incompétent. C'est l'arbitre lui-même qui statue sur sa propre compétence. Exception : la clause est manifestement nulle ou inapplicable." },
    { recto: "La clause d'arbitrage peut-elle s'étendre aux non-signataires ?", verso: "OUI. Si le tiers est directement impliqué dans l'exécution du contrat et qu'on peut présumer qu'il avait connaissance de la clause, elle lui est opposable même s'il n'a pas signé le contrat." },
    { recto: "Quels litiges sont couverts par une clause compromissoire ?", verso: "TOUS les litiges liés au contrat : exécution, résiliation, conséquences de la résiliation, travaux, et ce avant ou après la résiliation, l'abandon ou la violation du contrat." },
    { recto: "Quels sont les avantages de l'arbitrage par rapport à la justice étatique ?", verso: "Rapidité, confidentialité, expertise des arbitres, exécution internationale facilitée (Convention de New York 1958). Inconvénients : coût élevé, voies de recours limitées." }
  ]);
  console.log('  ✅ Fiche 3/4 : La Clause d\'Arbitrage (CH 41)');

  // ── FICHE 4 : Le Hardship (Imprévision) ──
  // Covers: CH 42 + Cas Pizzerias (CH 20, 21) + Cas West Side (CH 43)
  insertFiche(42, `# Le Hardship (Imprévision contractuelle)

## 1. Définition

Le **hardship** (ou imprévision) est une situation dans laquelle la survenance d'événements **modifie fondamentalement l'équilibre du contrat**, rendant l'exécution excessivement onéreuse pour l'une des parties.

### Codification internationale :
Les **Principes UNIDROIT** (articles 6.2.1 à 6.2.3) codifient le régime du hardship dans les contrats internationaux.

## 2. Les conditions du hardship (art. 6.2.2 UNIDROIT)

Il y a hardship lorsque **tous** les critères suivants sont réunis :

| Condition | Explication |
|---|---|
| **Déséquilibre fondamental** | Le coût d'exécution a augmenté OU la valeur de la prestation reçue a diminué |
| **Postériorité** | Les événements surviennent **après** la conclusion du contrat |
| **Imprévisibilité** | Les événements n'auraient pas pu être **raisonnablement prévus** |
| **Extériorité** | Les événements échappent au **contrôle** de la partie lésée |
| **Non-assumption du risque** | Le risque n'a **pas été assumé** par la partie lésée dans le contrat |

> ⚠️ Le hardship ≠ la force majeure. Le hardship rend l'exécution **excessivement onéreuse** mais pas **impossible**.

## 3. Le principe : respect du contrat (art. 6.2.1)

Même en cas de difficulté, la partie **reste tenue d'exécuter ses obligations**. Le hardship est une exception au principe **pacta sunt servanda** (les conventions doivent être respectées).

## 4. Les effets du hardship (art. 6.2.3)

### Étape 1 : Demande de renégociation
- La partie lésée peut demander une **renégociation**
- La demande doit être faite **sans retard injustifié** et indiquer les motifs
- La demande **ne donne pas le droit de suspendre** l'exécution

### Étape 2 : Recours au tribunal
À défaut d'accord dans un délai raisonnable, le tribunal peut :
- **(a)** **Résilier** le contrat à une date et selon des modalités à déterminer
- **(b)** **Adapter** le contrat en vue de rétablir son équilibre

> En pratique, les tribunaux sont **très réticents** à adapter les contrats. Le hardship ne s'applique que dans des circonstances **très exceptionnelles**.

## 5. Hardship vs Force Majeure

| Critère | Hardship | Force Majeure |
|---|---|---|
| **Effet sur l'exécution** | Excessivement onéreuse | **Impossible** |
| **Conséquence** | Renégociation, adaptation | Exonération de responsabilité |
| **Le contrat continue** | Oui (éventuellement adapté) | Non (suspension ou résiliation) |
| **Contrôle judiciaire** | Le juge peut adapter le contrat | Le juge constate l'impossibilité |

## 6. La force majeure — rappel

### Définition contractuelle classique :
Événements **rigoureusement imprévisibles** tels que : incendies, tremblements de terre, cyclones, pannes de machines...

### Critères :
1. **Extériorité** : échapper au contrôle du débiteur
2. **Imprévisibilité** : ne pouvait pas être raisonnablement prévu
3. **Irrésistibilité** : rend l'exécution impossible (pas simplement plus difficile)

### Application : les grèves constituent-elles un cas de force majeure ?
- Dépend de la **définition contractuelle** de la force majeure
- Les grèves sont généralement **prévisibles** dans certains secteurs → pas toujours qualifiées de force majeure
- Les juges apprécient au cas par cas

## 7. La clause pénale

### Définition :
Clause contractuelle fixant à l'avance le montant des **dommages et intérêts** en cas d'inexécution (ex : pénalités de retard).

### Pouvoir du juge :
Le juge peut **modérer** une clause pénale s'il estime que le montant est **manifestement excessif** ou **dérisoire** (art. 1231-5 Code civil).

## 8. Les traditions juridiques face au hardship

| Tradition | Position |
|---|---|
| **Common law** | Très restrictive : le contrat doit être respecté |
| **Droit français** | Strict mais assoupli par la réforme de 2016 (art. 1195 Code civil) |
| **Droit germanique** | Plus souple : approche objective pour déterminer si une partie est dispensée |

## Points à retenir

- Hardship = déséquilibre fondamental rendant l'exécution **excessivement onéreuse** (≠ impossible)
- **5 conditions** cumulatives : déséquilibre, postériorité, imprévisibilité, extériorité, non-assumption
- Le contrat **reste en vigueur** même en cas de hardship → obligation de renégocier d'abord
- Force majeure = exécution **impossible** ; Hardship = exécution **trop coûteuse**
- Les tribunaux sont **très réticents** à se substituer aux parties contractantes`, [
    { recto: "Quelles sont les 5 conditions du hardship (UNIDROIT) ?", verso: "1. Déséquilibre fondamental du contrat\n2. Événements postérieurs à la conclusion\n3. Événements imprévisibles\n4. Événements hors du contrôle de la partie lésée\n5. Risque non assumé par la partie lésée" },
    { recto: "Quelle différence entre hardship et force majeure ?", verso: "Hardship : exécution excessivement ONÉREUSE → renégociation, adaptation du contrat.\nForce majeure : exécution IMPOSSIBLE → exonération de responsabilité, suspension ou résiliation." },
    { recto: "Quels sont les effets du hardship selon les Principes UNIDROIT ?", verso: "1. Demande de renégociation (sans droit de suspendre l'exécution)\n2. Si échec : le tribunal peut résilier OU adapter le contrat\nMais les tribunaux sont très réticents à adapter les contrats." },
    { recto: "Le juge peut-il réduire une clause pénale ?", verso: "OUI. Le juge peut modérer une clause pénale si le montant est manifestement excessif ou dérisoire (art. 1231-5 Code civil). Il peut aussi l'augmenter si elle est dérisoire." },
    { recto: "Les grèves constituent-elles toujours un cas de force majeure ?", verso: "Non. Cela dépend de la définition contractuelle et de l'appréciation du juge. Les grèves sont souvent prévisibles dans certains secteurs et ne sont pas toujours qualifiées de force majeure." }
  ]);
  copyFiche(42, 20);  // Cas Pizzerias Section 1
  copyFiche(42, 21);  // Cas Pizzerias Section 2
  copyFiche(42, 43);  // Cas West Side Connemara
  console.log('  ✅ Fiche 4/4 : Le Hardship (CH 42→20,21,43)');

  console.log('⚖️ Droit — 4 fiches injectées, couvrant 24 chapitres');
}

// ═══════════════════════════════════════════════════════════
// PILOTAGE DE LA PERFORMANCE — 6 fiches
// ═══════════════════════════════════════════════════════════

function injectPilotage() {
  console.log('\n📈 Pilotage de la Performance — Injection de 6 fiches...');

  // ── FICHE 1 : Masse salariale & Contrôle de gestion sociale ──
  // Covers: Partie 1 (CH 68, 69, 70, 71) + Bilan Social (CH 44-54) + Exercice CdG Sociale (CH 95, 65, 66)
  insertFiche(68, `# Masse salariale & Contrôle de gestion sociale

## 1. Le contrôle de gestion sociale

### Définition (Bernard Martory)
Le contrôle de gestion sociale est une composante du contrôle de gestion. C'est un **système d'aide au pilotage social** ayant pour objectif de contribuer à la gestion des ressources humaines dans leurs **performances et leurs coûts**.

## 2. Les outils du CdG social

### 2.1 Le Bilan Social
- Créé en **1977**, renforcé par la loi NRE 2001 et la loi PACTE 2019
- **Obligatoire** pour les entreprises de **300+ salariés** et les collectivités territoriales
- Présente la situation sociale sur les **3 dernières années**
- **7 thématiques** (familles) et environ **120 indicateurs**

> Le bilan social ≠ le tableau de bord social. Le bilan social est **macro** et **réglementaire**, le TdB social est **opérationnel** et lié à une **stratégie**.

### 2.2 Le Tableau de bord social
- Nombre **limité d'indicateurs** chiffrés pertinents et logiquement reliés
- Adossé à une **stratégie**, des leviers et plans d'action prioritaires
- Outil de pilotage tourné vers l'action

## 3. L'analyse de la masse salariale

### 3.1 Les différents périmètres

| Périmètre | Contenu |
|---|---|
| **Masse salariale** | Somme des rémunérations perçues (CDI + CDD) |
| **Masse salariale chargée** | + charges sociales patronales et parafiscales |
| **Coûts de personnel** | + coûts internes (avantages en nature, primes) + externes (intérim, sous-traitance) |
| **Coût total du travail** | + frais de gestion de la main d'œuvre (recrutement, médecine du travail, indemnités) |

### 3.2 Les sources d'écarts
Des écarts existent entre :
- Les **données de paie** (rythme mensuel)
- Les **données comptables** (règles de prudence, provisions)
- Les **données du budget** (prévisions estimatives)

Points de vigilance : congés payés provisionnés, indemnités de Sécurité Sociale, indemnités de départ, lissage en 1/12ème.

## 4. Les 4 facteurs de variation de la masse salariale

### Facteur 1 : Variations d'activité
- Heures supplémentaires, chômage partiel, temps partiel
- Événements imprévisibles (grèves, incidents)
- On calcule une **masse salariale de référence** (à activité constante)

### Facteur 2 : Variation des effectifs (hors Noria)
- Mesurée par comparaison de l'effectif moyen entre deux années
- **Effet effectif** = variation d'effectif × (1 + augmentation de la rémunération moyenne)
- Méthode multiplicative : (1 + Δrémunération) × (1 + Δeffectifs) = 1 + Δmasse salariale

### Facteur 3 : Augmentations générales et catégorielles

**3 mesures des augmentations :**

| Mesure | Définition | Exemple |
|---|---|---|
| **En niveau** | Variation de salaire entre deux dates | +5% en fin d'année |
| **En masse** | % d'évolution de la masse salariale annuelle | +4% au 01/10 = +1% en masse (4% × 3/12) |
| **Effet report** | Incidence en N+1 des mesures prises en N | (Coût année pleine N+1 − Coût en masse N) / Masse N |

> Une augmentation de **4% au 1er octobre** ne coûte que **1% en masse** sur l'année (car 4% × 3 mois / 12 mois).

### Facteur 4 : Mesures individuelles et structure (GVT)

| Composante | Signification |
|---|---|
| **G** (Glissement) | Performance individuelle, augmentation au mérite |
| **V** (Vieillissement) | Ancienneté, primes d'ancienneté, progression automatique |
| **T** (Technicité) | Amélioration des qualifications, changement de poste |

### L'effet de Noria
- Remplacement de salariés âgés (salaires élevés) par de nouveaux arrivants (salaires bas)
- **Noria négative** = économie sur la masse salariale (cas le plus fréquent)
- **Noria positive** = si forte augmentation de technicité des postes
- Formule : **(SAM entrants − SAM sortants) × Nb de remplaçants × prorata temporis**

## 5. La GEPP (ex-GPEC)

### Définition
La **Gestion des Emplois et des Parcours Professionnels** est une démarche d'anticipation pour ajuster les besoins futurs et les ressources humaines actuelles.

- **Obligatoire** pour les entreprises de **300+ salariés** (accord)
- Remplace la GPEC depuis les ordonnances Macron
- C'est un outil d'aide à la **décision** (pas un simple outil administratif)

### La notion de compétence (MEDEF)
Combinaison de **connaissances, savoir-faire, expériences et comportements** s'exerçant dans un contexte précis.

### Les 4 pratiques de gestion des compétences :
1. **Identifier** les compétences (référentiels, grilles, bilan de compétences)
2. **Gérer** les compétences de manière prévisionnelle (GEPP)
3. **Développer** les compétences (formation, VAE, organisations qualifiantes)
4. **Valoriser et rémunérer** les compétences

## 6. La gestion de crise sociale

### Procédures de règlement des conflits :
| Procédure | Description |
|---|---|
| **Conciliation** | Un tiers organise des entretiens pour harmoniser les points de vue |
| **Médiation** | Un tiers enquête et propose une solution sous forme de recommandation |
| **Arbitrage** | Un arbitre tranche le conflit par une sentence obligatoire |

## Points à retenir

- **Bilan social** = obligatoire (300+ salariés), 7 thématiques, 120 indicateurs, 3 ans
- **4 facteurs** de variation de la masse salariale : activité, effectifs, augmentations générales, mesures individuelles
- **GVT** : Glissement (mérite), Vieillissement (ancienneté), Technicité (qualification)
- **Noria** : économie liée au remplacement de salariés anciens par des jeunes
- Distinguer augmentation **en niveau** (entre 2 dates) et **en masse** (impact annuel)`, [
    { recto: "Quels sont les 4 facteurs de variation de la masse salariale ?", verso: "1. Variations d'activité (heures sup, chômage partiel)\n2. Variation des effectifs (entrées/sorties)\n3. Augmentations générales et catégorielles\n4. Mesures individuelles et structure (GVT)" },
    { recto: "Que signifie GVT dans l'analyse de la masse salariale ?", verso: "G = Glissement (performance individuelle, mérite)\nV = Vieillissement (ancienneté, primes d'ancienneté)\nT = Technicité (amélioration des qualifications, changement de poste)" },
    { recto: "Qu'est-ce que l'effet de Noria ?", verso: "L'effet du remplacement de salariés âgés (salaires élevés) par de nouveaux arrivants (salaires bas). Noria négative = économie (cas fréquent). Formule : (SAM entrants - SAM sortants) × Nb remplaçants × prorata temporis." },
    { recto: "Quelle différence entre augmentation en niveau et en masse ?", verso: "En niveau : variation de salaire entre 2 dates (ex : +4%).\nEn masse : impact sur la masse salariale annuelle (ex : +4% au 01/10 = +1% en masse car 4% × 3/12 mois)." },
    { recto: "Le bilan social est-il obligatoire ? Pour qui ?", verso: "Oui, pour les entreprises et établissements de 300+ salariés. Il présente la situation sociale sur 3 ans avec 7 thématiques et environ 120 indicateurs." },
    { recto: "Qu'est-ce que la GEPP et pour qui est-elle obligatoire ?", verso: "Gestion des Emplois et des Parcours Professionnels (ex-GPEC). Démarche d'anticipation pour ajuster besoins futurs et ressources humaines. Obligatoire pour les entreprises de 300+ salariés (accord)." },
    { recto: "Quels sont les 4 périmètres de la masse salariale ?", verso: "1. Masse salariale : rémunérations CDI+CDD\n2. Masse salariale chargée : + charges patronales\n3. Coûts de personnel : + avantages en nature + intérim\n4. Coût total du travail : + frais de gestion RH" }
  ]);
  copyFiche(68, 69);
  copyFiche(68, 70);
  copyFiche(68, 71);
  copyFiche(68, 44);  // Bilan Social
  copyFiche(68, 95);  // Exercice CdG Sociale
  copyFiche(68, 65);
  copyFiche(68, 66);
  console.log('  ✅ Fiche 1/6 : Masse salariale & CdG sociale (CH 68→69,70,71,44,95,65,66)');

  // ── FICHE 2 : Tableaux de bord, KPI & Reporting ──
  // Covers: Partie 2 (CH 72) + Exercices TdB (CH 92,93, 97,98)
  insertFiche(72, `# Tableaux de bord, KPI & Reporting

## 1. Définitions

### Le Tableau de bord
- Défini **par et pour une entité** (service, fonction) sur un périmètre précis
- Outil de **pilotage tourné vers l'action**
- Comprend des données financières ET d'autres indicateurs (qualité, délai, avancement)

### Le Reporting
- Mis en place au sein d'un **groupe** pour remonter les données à la direction générale
- Principalement **financier**
- Vérifie **a posteriori** si les objectifs délégués sont atteints
- **N'est pas** un support direct à l'action

> Tableaux de bord et reportings cohabitent mais il faut veiller à la **cohérence** des indicateurs.

## 2. Les catégories d'indicateurs (KPI)

| Catégorie | Exemples |
|---|---|
| **Financiers** | Marge, résultat, chiffre d'affaires |
| **Physiques** | Quantités produites, taux de rebut, réclamations |
| **D'objectifs** | Nombre de brevets, nombre de ventes |
| **De moyens** | Budget de formation, investissement en R&D |
| **Rétrospectifs** | Ventes, production passée |
| **Avancés/prospectifs** | Commandes en cours (anticipent la performance future) |

## 3. Les 5 principes de conception d'un tableau de bord

### Principe 1 : Cohérence avec l'organigramme (poupées russes)
- Le découpage des TdB respecte les **lignes hiérarchiques**
- TdB synthétiques pour la DG → TdB détaillés pour les niveaux opérationnels
- Les indicateurs sont **cascadés** du stratégique vers l'opérationnel

### Principe 2 : Rapidité d'élaboration et de transmission
- La **rapidité** doit l'emporter sur la précision
- Le TdB a un rôle d'**alerte** → actions correctives rapides
- Le terme « rapport flash » est courant chez les anglo-saxons

### Principe 3 : Forme et contenu
Un bon TdB contient **4 à 5 zones** :
1. **Zone paramètres économiques** : indicateurs financiers, volumétriques, qualité, délai
2. **Zone résultats** : réalisé par période ou cumulé (YTD)
3. **Zone objectifs** : budget ou forecast mensualisé
4. **Zone écarts** : en valeur absolue ou relative (%)
5. Période et périmètre clairement indiqués

### Principe 4 : Représentation des indicateurs
| Type | Usage |
|---|---|
| **Écarts** | En valeur absolue ou relative (%) |
| **Ratios** | Rapports de grandeurs significatives (ex : CA / Nombre de vendeurs) |
| **Graphiques** | Courbes pour les évolutions, histogrammes pour les comparaisons |
| **Clignotants** | Feux, jauges, météo selon des seuils |
| **Waterfall** | Pour détailler et visualiser les causes d'écart |

### Principe 5 : Indicateurs simples et mesurables
- Suivi des actions, évaluation, diagnostic, veille
- Faire évoluer **régulièrement** les indicateurs (éviter l'habitude et le contournement)

## 4. Les références de comparaison

| Référence | Description |
|---|---|
| **Soi-même** | Comparaison dans le temps |
| **Ses pairs** | Régions similaires, fonctions proches |
| **Les meilleurs** | Top 10, classement |
| **La moyenne** | Au-dessus ou en dessous ? |
| **Source externe** | Benchmark (APQC, concurrents) |

## 5. La méthode OVAR

**Objectifs → Variables d'Action → Responsables**

Partir des **missions** (objectifs) et des **facteurs clés de succès** pour définir les indicateurs. Chaque indicateur a un **porteur unique**, chargé de justifier l'évolution.

## 6. Ce qu'est un TdB vs ce qu'il n'est pas

| ✅ Un TdB, c'est | ❌ Un TdB, ce n'est pas |
|---|---|
| Document synthétique (15 priorités, 30 KPI max) | Une bibliothèque d'indicateurs |
| Principes d'usage partagés et acceptés | Un outil chargé de donner toutes les réponses |
| Un porteur unique par indicateur | Un outil pour des niveaux de management différents |
| Un process de production automatisé | Une simple évaluation du budget |

## Points à retenir

- TdB = outil de **pilotage** (action) ; Reporting = outil de **remontée** (information)
- **5 principes** : cohérence organigramme, rapidité, forme/contenu, représentation, simplicité
- **4 zones** : indicateurs, résultats, objectifs, écarts
- Méthode **OVAR** : Objectifs → Variables d'Action → Responsables
- 30 indicateurs maximum, porteur unique, mise à jour régulière`, [
    { recto: "Quelle différence entre tableau de bord et reporting ?", verso: "Le tableau de bord est défini par/pour une entité, tourné vers l'action et le pilotage.\nLe reporting remonte les données financières à la DG, vérifie a posteriori l'atteinte des objectifs." },
    { recto: "Quelles sont les 4 zones d'un tableau de bord ?", verso: "1. Paramètres économiques (indicateurs)\n2. Résultats (réalisé par période ou YTD)\n3. Objectifs (budget/forecast)\n4. Écarts (valeur absolue ou relative)" },
    { recto: "Qu'est-ce que la méthode OVAR ?", verso: "Objectifs → Variables d'Action → Responsables.\nOn part des missions et facteurs clés de succès pour définir les indicateurs. Chaque indicateur a un porteur unique." },
    { recto: "Combien d'indicateurs maximum dans un bon tableau de bord ?", verso: "15 priorités et 30 indicateurs maximum. Le TdB doit rester synthétique. La rapidité prime sur la précision." },
    { recto: "Quels types de graphiques utiliser dans un TdB ?", verso: "Courbes → évolutions dans le temps\nHistogrammes → comparaisons\nHistogrammes empilés → comparaisons avec décomposition\nWaterfall → détailler les causes d'écart" }
  ]);
  copyFiche(72, 92);
  copyFiche(72, 93);
  copyFiche(72, 97);
  copyFiche(72, 98);
  console.log('  ✅ Fiche 2/6 : Tableaux de bord & KPI (CH 72→92,93,97,98)');

  // ── FICHE 3 : Analyse des écarts & Contrôle budgétaire ──
  // Covers: Exercice écarts (CH 59, 60), CC (CH 61, 62)
  insertFiche(59, `# Analyse des écarts & Contrôle budgétaire

## 1. Le processus budgétaire

### Définitions clés

| Outil | Rôle |
|---|---|
| **Business plan** | Projection pluriannuelle (3-5 ans) |
| **Budget** | Prévision annuelle détaillée par poste/service |
| **Rolling forecast** | Prévision glissante mise à jour périodiquement |
| **Contrôle budgétaire** | Comparaison réalisé vs budget, analyse des écarts |

### Le cycle budgétaire
1. Définition des **objectifs stratégiques** (DG)
2. **Déclinaison** en objectifs opérationnels par centre de responsabilité
3. **Élaboration** du budget (bottom-up et top-down)
4. **Consolidation** et arbitrages
5. **Suivi** mensuel : réalisé vs budget
6. **Actions correctives**

## 2. Les centres de responsabilité

| Type de centre | Responsabilité | Objectif | Exemple |
|---|---|---|---|
| **Centre de coûts** | Coûts | Fabriquer au moindre coût avec qualité et délais | Usine, atelier |
| **Centre de dépenses discrétionnaires** | Dotation budgétaire | Respecter le budget et la qualité de prestation | DG, RH, marketing, finance |
| **Centre de recettes** | CA | Maximiser le chiffre d'affaires | Agence commerciale |
| **Centre de profit** | Marge | Dégager la marge maximale | Usine, pays, ligne de produit |
| **Centre d'investissement** | Rentabilité des capitaux | Meilleure rentabilité + profit (vision long terme) | Filiale autonome |

## 3. L'analyse des écarts

### Principe fondamental
**Écart = Réalisé − Budget** (ou Prévu)

### L'écart sur chiffre d'affaires

**Décomposition en 2 sous-écarts :**

| Écart | Formule | Interprétation |
|---|---|---|
| **Écart sur volume** | (Qté réelle − Qté prévue) × Prix prévu | L'effet « quantité vendue » |
| **Écart sur prix** | (Prix réel − Prix prévu) × Qté réelle | L'effet « politique de prix » |

### L'écart sur coûts de production

**Décomposition en 3 sous-écarts :**

| Écart | Formule | Interprétation |
|---|---|---|
| **Écart sur volume** | (Qté produite réelle − Qté prévue) × Coût standard | Effet activité |
| **Écart sur rendement** | (Qté consommée réelle − Qté standard pour la production réelle) × Coût standard | Effet efficacité |
| **Écart sur coût unitaire** | (Coût réel − Coût standard) × Qté consommée réelle | Effet prix des intrants |

### L'écart sur marge

**Décomposition :**
- **Écart sur volume** : quantités vendues vs prévues
- **Écart sur composition** (mix) : changement dans la répartition des ventes entre produits
- **Écart sur marge unitaire** : marge par produit vs prévision

## 4. Le coût cible (Target Costing)

### Principe
Le coût cible part du **prix de vente** accepté par le marché et en déduit la **marge souhaitée** :

> **Coût cible = Prix de vente − Marge souhaitée**

### Démarche :
1. Identifier le **prix de vente** accepté par le marché
2. Fixer la **marge cible** (rentabilité attendue)
3. Calculer le **coût cible**
4. Comparer avec le **coût estimé** (coût actuel de production)
5. Si coût estimé > coût cible → **réduction des coûts** nécessaire (conception, processus, fournisseurs)

### Origine :
Méthode japonaise (Toyota) visant à intégrer la **contrainte de coût dès la conception** du produit.

## 5. Le seuil de rentabilité

### Formule :
> **Seuil de rentabilité = Charges fixes / Taux de marge sur coûts variables**

Où : Taux de MCV = (CA − Charges variables) / CA

### Interprétation :
- C'est le **CA minimum** pour que l'entreprise ne soit ni en profit ni en perte
- En dessous du seuil → l'entreprise perd de l'argent
- **Point mort** = date à laquelle le seuil est atteint dans l'année

## Points à retenir

- Budget = prévision annuelle ; Rolling forecast = prévision glissante
- **5 types de centres** : coûts, dépenses discrétionnaires, recettes, profit, investissement
- Écart sur CA = **écart volume + écart prix**
- Écart sur coûts = **volume + rendement + coût unitaire**
- **Coût cible** = Prix de vente − Marge souhaitée (méthode japonaise)
- **Seuil de rentabilité** = Charges fixes / Taux de MCV`, [
    { recto: "Comment décompose-t-on l'écart sur chiffre d'affaires ?", verso: "Écart sur volume : (Qté réelle - Qté prévue) × Prix prévu\nÉcart sur prix : (Prix réel - Prix prévu) × Qté réelle\nÉcart total = Écart volume + Écart prix" },
    { recto: "Qu'est-ce que le coût cible (Target Costing) ?", verso: "Coût cible = Prix de vente (marché) - Marge souhaitée. Méthode japonaise (Toyota) qui intègre la contrainte de coût dès la conception. Si le coût estimé > coût cible, il faut réduire les coûts." },
    { recto: "Quels sont les 5 types de centres de responsabilité ?", verso: "1. Centre de coûts (usine)\n2. Centre de dépenses discrétionnaires (DG, RH)\n3. Centre de recettes (agence commerciale)\n4. Centre de profit (ligne de produit)\n5. Centre d'investissement (filiale)" },
    { recto: "Quelle est la formule du seuil de rentabilité ?", verso: "Seuil de rentabilité = Charges fixes / Taux de MCV\nOù Taux de MCV = (CA - Charges variables) / CA\nC'est le CA minimum pour ne pas perdre d'argent." },
    { recto: "Qu'est-ce qu'un rolling forecast ?", verso: "Une prévision glissante mise à jour périodiquement (souvent trimestriellement), contrairement au budget qui est fixé pour l'année. Permet d'adapter les prévisions à l'évolution réelle de l'activité." }
  ]);
  copyFiche(59, 60);
  copyFiche(59, 61);
  copyFiche(59, 62);
  copyFiche(59, 63);  // Corrigé Coûts Cibles
  copyFiche(59, 64);
  copyFiche(59, 88);  // Cas JIBI seuil rentabilité
  copyFiche(59, 90);
  copyFiche(59, 91);  // Cas STAGNET coût cible
  copyFiche(59, 96);  // Exercice simplifié coût cible
  console.log('  ✅ Fiche 3/6 : Analyse des écarts & Contrôle budgétaire (CH 59→60,61,62,63,64,88,90,91,96)');

  // ── FICHE 4 : Lean Management & Gestion du périmètre ──
  // Covers: Partie 4 (CH 75, 76) + Exercice Mudas (CH 102, 103)
  insertFiche(75, `# Lean Management & Gestion du périmètre

## 1. Les évolutions organisationnelles

### 1.1 Décentralisation accrue
- Plus de responsabilités aux managers (**empowerment**)
- Création de structures adaptées à l'international (filiales autonomes, divisions)
- Équilibre nécessaire entre **délégation et contrôle**

### 1.2 Réduction des niveaux hiérarchiques
- Le **lean management** (management « maigre ») supprime les échelons non essentiels
- Passage de 5-6 niveaux à 3 dans certaines usines
- Conséquence : carrières plus lentes, distance managériale plus grande

### 1.3 Plus grande polyvalence
- « Déspécialisation » des postes → une personne fait plusieurs tâches différentes
- Gain en **autonomie** mais demande de reconnaissance

## 2. Le Lean Management

### Définition
Système d'organisation initié dans les usines japonaises de **Toyota** au début des années 1950 (TPS = Toyota Production System, puis « Toyotisme »).

> Le Lean = « production au plus juste » ou « faire plus avec moins ». Plus de **qualité**, moins de **ressources, temps et coûts**.

### Objectif
Éliminer les **gaspillages** (mudas) et augmenter la part de **valeur ajoutée** dans les processus.

### Les 7 Mudas (gaspillages) :
1. **Surproduction** : produire plus que nécessaire
2. **Attente** : temps mort, files d'attente
3. **Transport** : déplacements inutiles de matériaux
4. **Surprocessing** : opérations inutiles ou trop complexes
5. **Stocks excédentaires** : matières premières, en-cours, produits finis en excès
6. **Mouvements inutiles** : déplacements inutiles des personnes
7. **Défauts** : rebuts, retouches, corrections

### Outils du Lean :
- **Kaizen** : amélioration continue (changement pour le bien)
- **5M** : Main-d'œuvre, Matière, Matériel, Méthodes, Milieu (diagramme d'Ishikawa)
- **5S** : Seiri (trier), Seiton (ranger), Seiso (nettoyer), Seiketsu (standardiser), Shitsuke (respecter)

## 3. Fusions-acquisitions et contrôle de gestion

### 3.1 Définitions
- **Fusion** : les entreprises se regroupent, les actionnaires deviennent copropriétaires
- **Acquisition** : une entreprise acquiert les actifs/actions d'une autre

### 3.2 Les 3 degrés d'intégration
| Degré | Autonomie cible | Contrôle acquéreur | Description |
|---|---|---|---|
| **Préservation** | Forte | Faible | L'acquéreur est un financeur, la cible garde son autonomie |
| **Rationalisation** | Faible | Fort | Activités revues pour minimiser les coûts et exploiter les synergies |
| **Symbiose** | Forte ET interdépendante | Fort | Équilibre entre synergies et préservation de la culture |

### 3.3 Les 3 types de contrôle (Ouchi, 1979-1980)

| Type | Élément déterminant | Description |
|---|---|---|
| **Par le marché** | Le prix | Minimisation des coûts, compétitivité, prix de cession interne |
| **Par la bureaucratie** | La règle | Procédures, normes, budgets, coûts standards |
| **Par le clan** | Les valeurs partagées | Culture commune, croyances, rituels |

> Ouchi : « Le marché est une truite, le clan un saumon (espèces spécifiques), la bureaucratie un poisson-chat (adapté à tous les environnements). »

### 3.4 Contrôle de gestion par culture
| Pays | Approche du CdG |
|---|---|
| **France** | Surveillance, connaissance des départements, calcul du coût des produits |
| **Anglo-saxons** | Délégation, pilotage, analyse des écarts objectifs/résultats |
| **Allemagne** | Compétitivité, respect du budget, analyse financière |

## 4. Les distances dans les M&A internationales

| Distance | Description |
|---|---|
| **Culturelle** | Écart de normes, valeurs, croyances, langue, religion |
| **Administrative** | Histoire commune, monnaie, systèmes institutionnels |
| **Géographique** | Éloignement physique, moyens de communication |
| **Économique** | Pouvoir d'achat, coût des ressources |

## Points à retenir

- **Lean** = éliminer les gaspillages (7 mudas), faire plus avec moins
- **Kaizen** = amélioration continue ; **5M** = diagramme d'Ishikawa
- **3 types de contrôle** (Ouchi) : marché (prix), bureaucratie (règles), clan (valeurs)
- Fusions : préservation / rationalisation / symbiose
- Le CdG doit s'adapter aux **distances** culturelles, administratives, géographiques et économiques`, [
    { recto: "Quels sont les 7 mudas (gaspillages) du Lean Management ?", verso: "1. Surproduction\n2. Attente\n3. Transport inutile\n4. Surprocessing\n5. Stocks excédentaires\n6. Mouvements inutiles\n7. Défauts (rebuts, retouches)" },
    { recto: "Quels sont les 3 types de contrôle selon Ouchi ?", verso: "1. Par le marché : basé sur le prix et la compétitivité\n2. Par la bureaucratie : basé sur les règles, normes et procédures\n3. Par le clan : basé sur les valeurs partagées et la culture commune" },
    { recto: "Quels sont les 3 degrés d'intégration dans les fusions-acquisitions ?", verso: "1. Préservation : forte autonomie, faible contrôle (financeur)\n2. Rationalisation : faible autonomie, synergies maximisées\n3. Symbiose : forte interdépendance + besoin d'autonomie" },
    { recto: "Qu'est-ce que le Kaizen ?", verso: "Amélioration continue (littéralement 'changement pour le bien'). Principe japonais du Lean Management visant à améliorer en permanence les processus par petits pas." },
    { recto: "Comment diffèrent les approches française, anglo-saxonne et allemande du CdG ?", verso: "France : surveillance, calcul du coût des produits.\nAnglo-saxons : délégation, pilotage, analyse des écarts.\nAllemagne : compétitivité, respect du budget, analyse financière." }
  ]);
  copyFiche(75, 76);
  copyFiche(75, 102);  // Exercice Mudas
  copyFiche(75, 103);
  console.log('  ✅ Fiche 4/6 : Lean Management & Gestion du périmètre (CH 75→76,102,103)');

  // ── FICHE 5 : Conduite du changement ──
  // Covers: Partie 5 (CH 77, 78, 79, 80)
  insertFiche(77, `# Conduite du changement

## 1. Les mythes du changement

### Mythe 1 : La « résistance au changement »
- Certains dirigeants accusent la résistance « naturelle » des salariés
- En réalité : il y a des **groupes d'acteurs** ayant chacun des **fins rationnelles** propres
- La sociologie des organisations montre qu'il n'y a pas d'un côté les promoteurs (raison) et de l'autre les résistants

### Mythe 2 : La « table rase »
- On croit parfois que « plus rien ne sera comme avant »
- En réalité : les vraies **révolutions sont rares**
- Les changements réussis **associent innovation et préservation** d'acquis antérieurs
- C'est souvent parce qu'on conçoit le changement comme une rupture totale qu'il suscite des résistances

## 2. Les niveaux de changement

| Niveau | Description | Exemple |
|---|---|---|
| **Niveau 1** | Changement à l'intérieur du système (rétablir une norme) | Améliorer un processus existant |
| **Niveau 2** | Changement du système lui-même (changer la norme) | Réorganisation radicale |

### Les 4 paliers (gradation fine) :
1. **Réglage** : ajustement mineur
2. **Réforme** : modification significative
3. **Rénovation** : transformation importante
4. **Refondation** : changement radical du système

## 3. Les choix tactiques

### Global ou graduel ?
| Global | Graduel |
|---|---|
| Rapide, pas d'incertitude | Expérimentation locale, apprentissage |
| S'impose si forte solidarité entre les parties | Permet de tester et convaincre |
| Tout le monde bascule en même temps | Extension progressive |

### Par le haut (top-down) ou par le bas (bottom-up) ?
- **Top-down** : impulsé par la DG, rapide mais risque de résistances
- **Bottom-up** : innovations du terrain, portées par des individus convaincus
- Les projets complexes **alternent** souvent les deux approches

### Style autoritaire ou participatif ?
| Style | Description | Risque |
|---|---|---|
| **Autoritaire** | Décision unilatérale, rapide | Résistances frontales ou passivité |
| **Persuasion** | Communication forte, conviction | Adhésion superficielle |
| **Négociation** | Compromis entre promoteurs et parties prenantes | Lent et tendu |
| **Participatif** | Expression de tous, projet consensuel | Lent, nécessite fort engagement |

### Le « changement concerté »
Mélange de négociation et participation : les groupes de projet reconçoivent l'organisation avec l'aide d'un intervenant extérieur. C'est la condition d'efficacité largement acceptée.

## 4. Les 3 phases du processus de changement

| Phase | Action | Objectif |
|---|---|---|
| **1. Dégel** (amont) | Faire comprendre la nécessité | Créer le sentiment d'urgence |
| **2. Décisions-clés** | Trancher, arbitrer | Fixer le cap |
| **3. Ancrage** (aval) | Former, accompagner, assimiler | Pérenniser le changement |

## 5. Les 4 leviers du changement

### Levier 1 : Humain
- Emploi et relation de travail (créations/suppressions, contrats)
- Compétences du personnel (formations)
- Climat social et relationnel (leadership, conflictualité)
- Normes et valeurs (culture d'entreprise)
> On ne change pas les mentalités par une décision unique mais par un **accompagnement durable**.

### Levier 2 : Structurel
- Modifier les structures pour faire agir le management
- Moyen de modifier la **répartition du pouvoir**
- Peut générer plus de polyvalence, réactivité, innovation

### Levier 3 : Système de gestion
- Objectifs, contrôle, évaluation, incitations
- Systèmes d'information qui font vivre la stratégie
- Récompenses et sanctions

### Levier 4 : Physique et technique
- Localisation, installations, technologies
- R&D, réorganisation de la production
- Transferts géographiques d'activités

## 6. Le management par les processus — Outils

| Outil | Usage |
|---|---|
| **QQOQCP** | Quoi ? Qui ? Où ? Quand ? Comment ? Pourquoi ? |
| **Brainstorming** | Trouver des idées rapidement en groupe |
| **Diagramme de Pareto** | Identifier les causes principales (80/20) |
| **Diagramme d'Ishikawa** | Causes et effets (5M) |
| **Matrice de décision** | Comparer des solutions sur plusieurs critères |
| **Votes pondérés** | Prioriser les sujets collectivement |

## Points à retenir

- Les résistances ne sont pas « naturelles » : chaque acteur a ses **raisons rationnelles**
- **4 styles** de conduite : autoritaire, persuasion, négociation, participatif
- **3 phases** : dégel → décisions-clés → ancrage
- **4 leviers** : humain, structurel, système de gestion, physique/technique
- Le changement concerté (négociation + participation) est la méthode la plus efficace`, [
    { recto: "Quels sont les 4 styles de conduite du changement ?", verso: "1. Autoritaire : décision unilatérale, rapide\n2. Persuasion : communication forte\n3. Négociation : compromis entre parties\n4. Participatif : expression de tous, consensus\nLe 'changement concerté' combine négociation et participation." },
    { recto: "Quelles sont les 3 phases du processus de changement ?", verso: "1. Dégel (amont) : faire comprendre la nécessité\n2. Décisions-clés : trancher et arbitrer\n3. Ancrage (aval) : former, accompagner, assimiler pour pérenniser" },
    { recto: "Quels sont les 4 leviers du changement ?", verso: "1. Humain (emploi, compétences, climat social, valeurs)\n2. Structurel (répartition du pouvoir, organisation)\n3. Système de gestion (objectifs, contrôle, incitations)\n4. Physique et technique (localisation, technologies)" },
    { recto: "Pourquoi la 'résistance au changement' est-elle un mythe ?", verso: "Il n'y a pas d'un côté les promoteurs rationnels et de l'autre les résistants. La sociologie des organisations montre que chaque acteur a des raisons rationnelles propres. Les résistances naissent souvent d'une conception trop radicale du changement." },
    { recto: "Qu'est-ce que l'outil QQOQCP ?", verso: "Quoi ? Qui ? Où ? Quand ? Comment ? Pourquoi ?\nTechnique de recherche d'informations systématique sur un problème et ses causes. Chaque question peut être soumise au 'Pourquoi ?' supplémentaire." }
  ]);
  copyFiche(77, 78);
  copyFiche(77, 79);
  copyFiche(77, 80);
  console.log('  ✅ Fiche 5/6 : Conduite du changement (CH 77→78,79,80)');

  // ── FICHE 6 : RSE & Performance extra-financière ──
  // Covers: Parties 6-7 (CH 81, 82, 83, 84, 85, 86, 87) + Convention service (CH 99, 100, 101)
  insertFiche(81, `# RSE & Performance extra-financière

## 1. Le contrôle de gestion et la RSE

### Évolution du contrôle de gestion
Le contrôle de gestion intègre désormais la **dimension RSE** (Responsabilité Sociétale des Entreprises) dans le pilotage de la performance. On passe de la **finance verte** à une approche **RSE durable** globale.

### Les 3 piliers de la RSE :
1. **Environnemental** : impact écologique, bilan carbone, gestion des déchets
2. **Social** : conditions de travail, diversité, santé-sécurité
3. **Gouvernance** : éthique, transparence, anti-corruption

## 2. La performance extra-financière

### 2.1 La Taxonomie européenne
Classification des activités économiques selon leur **contribution aux objectifs environnementaux** de l'UE :
- Atténuation du changement climatique
- Adaptation au changement climatique
- Utilisation durable des ressources en eau
- Transition vers l'économie circulaire
- Prévention de la pollution
- Protection de la biodiversité

### Les ratios verts
Les entreprises doivent publier la proportion de leur activité qui est **alignée** avec la taxonomie :
- **Part du CA aligné** (Green Revenue Ratio)
- **Part des CapEx alignés** (Green CapEx Ratio)
- **Part des OpEx alignés** (Green OpEx Ratio)

### 2.2 Le reporting de durabilité (CSRD)

La **Corporate Sustainability Reporting Directive** (CSRD, 2024) remplace la NFRD et élargit considérablement les obligations de reporting.

**Entreprises concernées :**
- Toutes les grandes entreprises (250+ salariés OU 50M€ CA OU 25M€ bilan)
- Les PME cotées (à partir de 2026)

**Normes ESRS** (European Sustainability Reporting Standards) :
- Informations environnementales, sociales et de gouvernance
- **Double matérialité** : impact de l'entreprise sur l'environnement ET impact de l'environnement sur l'entreprise

### 2.3 Le Bilan Carbone
- Mesure des **émissions de gaz à effet de serre** (GES) d'une organisation
- **3 scopes** :
  - **Scope 1** : émissions directes (combustion, procédés)
  - **Scope 2** : émissions indirectes liées à l'énergie (électricité, chaleur)
  - **Scope 3** : autres émissions indirectes (fournisseurs, transports, déchets, utilisation des produits vendus)

> Le Scope 3 représente souvent **70 à 90%** des émissions totales d'une entreprise.

## 3. Les prix de cession interne et management fees

### Prix de cession interne (prix de transfert)
- Prix facturé entre entités d'un **même groupe** pour les biens et services échangés
- Soumis à un **contrôle strict** des administrations fiscales
- Doit respecter le **principe de pleine concurrence** (arm's length principle)

### Management fees (frais de siège)
- Frais facturés par la **holding/société mère** aux filiales pour les services rendus (stratégie, finance, RH, IT, juridique)
- Doivent correspondre à des **prestations réelles** et être justifiés
- Risque fiscal si les fees sont jugés **excessifs** ou sans contrepartie réelle

## 4. La gouvernance d'entreprise et le pilotage stratégique

### La chaîne de valeur du pilotage :
1. **Vision et stratégie** → 2. **Objectifs** → 3. **Plans d'action** → 4. **Budget** → 5. **Exécution** → 6. **Mesure et contrôle**

### Le contrôle de gestion comme interface :
- Traduit les objectifs **stratégiques** en objectifs **opérationnels** évaluables
- Rend possible la **décentralisation** des entreprises
- Interface entre direction générale et terrain

## Points à retenir

- **RSE** = 3 piliers : environnemental, social, gouvernance
- **Taxonomie verte** : classification des activités selon leur contribution environnementale
- **CSRD** (2024) : reporting de durabilité obligatoire, double matérialité, normes ESRS
- **Bilan Carbone** : 3 scopes (le Scope 3 = 70-90% des émissions)
- **Prix de transfert** : entre entités d'un groupe, contrôlés par le fisc, principe de pleine concurrence
- **Management fees** : frais de siège, doivent être justifiés par des prestations réelles`, [
    { recto: "Quels sont les 3 scopes du Bilan Carbone ?", verso: "Scope 1 : émissions directes (combustion, procédés)\nScope 2 : émissions indirectes liées à l'énergie (électricité)\nScope 3 : autres émissions indirectes (fournisseurs, transports, usage des produits)\nLe Scope 3 = 70-90% des émissions totales." },
    { recto: "Qu'est-ce que la CSRD et qui est concerné ?", verso: "Corporate Sustainability Reporting Directive (2024). Reporting de durabilité obligatoire avec normes ESRS et double matérialité. Concerne les grandes entreprises (250+ salariés ou 50M€ CA ou 25M€ bilan) et les PME cotées (2026)." },
    { recto: "Qu'est-ce que la double matérialité ?", verso: "Concept de la CSRD : l'entreprise doit reporter à la fois l'impact de l'entreprise SUR l'environnement/la société, ET l'impact de l'environnement/la société SUR l'entreprise (risques et opportunités)." },
    { recto: "Qu'est-ce qu'un prix de cession interne (prix de transfert) ?", verso: "Prix facturé entre entités d'un même groupe pour les échanges internes. Doit respecter le principe de pleine concurrence (arm's length). Contrôlé strictement par les administrations fiscales." },
    { recto: "Quels sont les 3 ratios verts de la taxonomie européenne ?", verso: "1. Green Revenue Ratio (part du CA aligné)\n2. Green CapEx Ratio (part des investissements alignés)\n3. Green OpEx Ratio (part des dépenses opérationnelles alignées)" }
  ]);
  copyFiche(81, 82);
  copyFiche(81, 83);
  copyFiche(81, 84);
  copyFiche(81, 85);
  copyFiche(81, 86);
  copyFiche(81, 87);
  copyFiche(81, 99);  // Convention de service
  copyFiche(81, 100);
  copyFiche(81, 101);
  console.log('  ✅ Fiche 6/6 : RSE & Performance extra-financière (CH 81→82-87,99-101)');

  console.log('📈 Pilotage de la Performance — 6 fiches injectées, couvrant 54 chapitres');
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

console.log('🚀 INJECTION FICHES V2 — Refonte complète\n');

clearAll();
injectRH();
injectAnalyseQuanti();
injectDroit();
injectPilotage();

// Stats
const totalFiches = db.prepare('SELECT COUNT(*) as c FROM summaries').get();
const uniqueFiches = db.prepare('SELECT COUNT(DISTINCT content) as c FROM summaries').get();
console.log('\n═══════════════════════════════════════════');
console.log('📊 Total entrées DB:', totalFiches.c);
console.log('📊 Fiches uniques:', uniqueFiches.c);
console.log('═══════════════════════════════════════════');

db.close();
