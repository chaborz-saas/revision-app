const Database = require('better-sqlite3');
const db = new Database('./data/revision.db');

// All fiches and flashcards for RH chapters
const data = {};

// ============================================================
// CHAPTER 104 - Introduction et définition de la GRH
// ============================================================
data[104] = {
resume: `## Introduction et definition de la GRH

> La GRH ne se limite pas a gerer des salaries : c'est un systeme complet qui cherche a aligner les besoins humains sur la strategie de l'entreprise, tout en respectant les individus.

---

### 1. Qu'est-ce que la GRH ?

La **Gestion des Ressources Humaines** (GRH) designe l'ensemble des pratiques et outils utilises par une organisation pour gerer son **capital humain**. Son but est double :
- **Efficacite** : atteindre les objectifs de l'organisation
- **Efficience** : utiliser au mieux les moyens humains disponibles

Autrement dit, il s'agit de s'assurer que l'entreprise dispose des bonnes personnes, au bon endroit, au bon moment, avec les bonnes competences.

> Certains auteurs preferent parler de "richesses humaines" plutot que de "ressources humaines", pour souligner que chaque personne est unique et porteuse de talents, et non un simple stock a gerer.

---

### 2. Les deux dimensions de la GRH

La GRH s'organise autour de deux grandes dimensions :

**Dimension individuelle** : ce sont les processus qui concernent chaque salarie pris individuellement.
- Le **recrutement** : trouver et embaucher les bons profils
- La **remuneration** : fixer et faire evoluer les salaires
- L'**evaluation** : mesurer la performance et les competences
- La **gestion des carrieres** : accompagner l'evolution professionnelle
- La **formation** : developper les savoirs et savoir-faire
- La **gestion des competences individuelles**

**Dimension collective** : ce sont les processus qui concernent l'ensemble des salaries ou des groupes.
- La **GEPP** (Gestion des Emplois et Parcours Professionnels) : anticiper les besoins futurs en competences
- La **communication interne**
- L'**organisation des conditions de travail**
- Les **relations sociales** (dialogue avec les syndicats, le CSE...)
- La **gestion des effectifs** et des **competences collectives**

---

### 3. Les enjeux fondamentaux de la GRH

La GRH doit repondre a trois grands enjeux :

1. **Choisir, conserver et former** le personnel dont l'entreprise a besoin
2. **Contribuer a une action collective** efficace, efficiente et creative
3. **Integrer les choix individuels** des salaries (aspirations, projets de carriere, equilibre vie pro/perso)

> Exemple concret : une startup tech doit non seulement recruter des developpeurs competents (enjeu 1), mais aussi creer un esprit d'equipe qui favorise l'innovation (enjeu 2), tout en tenant compte du fait que certains developpeurs souhaitent travailler en full remote (enjeu 3).

---

### 4. La GRH : une fonction partagee

La GRH n'est pas l'affaire exclusive du service RH. C'est une **fonction partagee** entre plusieurs acteurs :

- La **Direction des Ressources Humaines (DRH)** : definit la politique RH globale
- Les **managers operationnels** : mettent en oeuvre la GRH au quotidien (recrutement de leurs equipes, evaluation, attribution de primes, propositions de formation)
- La **direction generale** : fixe les orientations strategiques
- Les **salaries eux-memes** : acteurs de leur propre carriere
- Les **representants du personnel** : defendent les interets collectifs
- Les **acteurs externes** : Etat, syndicats, organismes de Securite Sociale, medecine du travail, consultants

> Point cle a retenir : tout manager est partie prenante de la GRH. Il participe au recrutement, attribue des primes, evalue ses collaborateurs et les accompagne dans leur evolution.`,

memo: JSON.stringify([
  {"recto": "Quelle est la definition simple de la GRH ?", "verso": "La GRH est l'ensemble des pratiques et outils qui permettent a une organisation de gerer son capital humain pour atteindre ses objectifs (efficacite) tout en utilisant au mieux ses moyens (efficience)."},
  {"recto": "Quelles sont les deux grandes dimensions de la GRH ?", "verso": "1) La dimension individuelle (recrutement, remuneration, evaluation, gestion des carrieres, formation, competences individuelles) et 2) La dimension collective (GEPP, communication interne, conditions de travail, relations sociales, gestion des effectifs)."},
  {"recto": "Que signifie GEPP et a quoi cela sert-il ?", "verso": "GEPP = Gestion des Emplois et des Parcours Professionnels. C'est un processus collectif qui vise a anticiper les besoins futurs en competences et en emplois dans l'entreprise."},
  {"recto": "Quels sont les 3 enjeux fondamentaux de la GRH ?", "verso": "1) Choisir, conserver et former le personnel necessaire. 2) Contribuer a une action collective efficace et creative. 3) Integrer les choix individuels des salaries (aspirations, equilibre vie pro/perso)."},
  {"recto": "Pourquoi dit-on que la GRH est une 'fonction partagee' ?", "verso": "Parce que la GRH n'est pas l'affaire exclusive du service RH : elle implique aussi les managers operationnels (qui recrutent, evaluent, proposent des formations), la direction generale, les salaries eux-memes et les representants du personnel."},
  {"recto": "Quelle est la difference entre efficacite et efficience en GRH ?", "verso": "L'efficacite consiste a atteindre les objectifs fixes par l'organisation. L'efficience consiste a les atteindre en utilisant le minimum de ressources (moyens humains, financiers, temps)."},
  {"recto": "Quels sont les principaux acteurs internes de la GRH ?", "verso": "La DRH (politique RH globale), les managers operationnels (GRH au quotidien), la direction generale (orientations strategiques), les salaries eux-memes et les representants du personnel (CSE)."},
  {"recto": "Quels sont les acteurs externes qui influencent la GRH ?", "verso": "L'Etat (legislation du travail), les syndicats, les organismes de Securite Sociale, la medecine du travail et les intervenants exterieurs (consultants, cabinets de recrutement)."},
  {"recto": "Quels processus RH le manager operationnel met-il en oeuvre au quotidien ?", "verso": "Le manager participe au recrutement, attribue des augmentations et des primes, evalue la performance de ses collaborateurs, propose des formations et accompagne l'evolution de carriere."},
  {"recto": "Pourquoi certains auteurs preferent-ils parler de 'richesses humaines' plutot que de 'ressources humaines' ?", "verso": "Pour souligner que chaque personne est unique et porteuse de talents. La fonction RH ne doit pas gerer les personnes comme des stocks, mais reconnaitre, developper et mettre en relation ces talents pour construire du collectif."},
  {"recto": "Donnez un exemple concret qui illustre les 3 enjeux de la GRH.", "verso": "Une startup tech doit recruter des developpeurs competents (enjeu 1), creer un esprit d'equipe favorisant l'innovation (enjeu 2), et tenir compte du souhait de certains de travailler en remote (enjeu 3)."},
  {"recto": "Quels elements de la dimension individuelle de la GRH pouvez-vous citer ?", "verso": "Le recrutement, la remuneration, l'evaluation, la gestion des carrieres, la formation et la gestion des competences individuelles."}
])
};

// ============================================================
// CHAPTER 105 - Les acteurs de la GRH
// ============================================================
data[105] = {
resume: `## Les acteurs de la GRH et l'evolution historique de la fonction RH

> Comprendre d'ou vient la GRH et comment ses differents acteurs interagissent est essentiel pour saisir pourquoi cette fonction est aujourd'hui au coeur de la strategie des entreprises.

---

### 1. L'evolution historique de la fonction RH

La fonction RH a profondement evolue au fil du XXe siecle, passant d'une simple administration du personnel a un veritable levier strategique :

| Periode | Courant dominant | Nom de la fonction | Pratiques principales |
|---------|-----------------|-------------------|----------------------|
| 1900-1950 | **Taylorisme / Fordisme** | Administration du personnel | Reglementation, procedures, paie |
| 1950-1970 | **Relations humaines** | Service des relations humaines | Communication, culture, ecoute |
| 1960-1980 | **Courant socio-technique** | Developpement social | Conditions de travail, technologies |
| Apres 1980 | **Management strategique** | GRH | Culture d'entreprise, GPEC, competences |

---

### 2. Les grands courants de pensee

**Le courant des Relations humaines** (1950-1970)
Ce mouvement a mis l'accent sur l'importance de l'**ecoute**, de la **valorisation** et de la **motivation** des salaries. Il accorde un role important aux cadres comme relais de la direction et prone la **delegation** pour associer les salaries aux decisions.

> Exemple : plutot que d'imposer un changement d'organisation, on consulte les equipes pour recueillir leurs avis et les impliquer dans le processus.

**Le courant socio-technique** (1960-1980)
Ce courant critique le precedent et se concentre sur les **conditions de travail**, l'impact des **nouvelles technologies** et la mise en place de **groupes de production autonomes**.

> Exemple : dans une usine, on reorganise le travail pour que chaque equipe gere elle-meme son planning et sa qualite, plutot que tout centraliser.

**Le management strategique des RH** (apres 1980)
L'etre humain est desormais vu comme une **ressource strategique**. L'idee centrale : l'etre humain EST une ressource pour l'entreprise, et il A des ressources (competences, creativite, experience) a mobiliser. L'objectif est de **mobiliser les individus autour du projet de l'organisation**.

---

### 3. Le modele d'Ulrich (1997) : les 4 roles de la fonction RH

Dave **Ulrich** a propose un modele qui identifie 4 roles pour la DRH, organises selon deux axes (processus/personnes et present/futur) :

1. **Expert administratif** : gere les processus RH au quotidien (paie, contrats, conformite legale). Focus sur les processus, oriente vers le present. Approche par les couts.

2. **Champion des salaries** : ecoute les salaries, repond a leurs besoins, maintient leur engagement. Focus sur les personnes, oriente vers le present.

3. **Partenaire strategique** : aligne la politique RH sur la strategie de l'entreprise. Focus sur les processus, oriente vers le futur. Approche par les resultats.

4. **Agent du changement** : accompagne les transformations de l'organisation, aide les equipes a s'adapter. Focus sur les personnes, oriente vers le futur.

> Point cle : une DRH performante doit etre capable de tenir ces 4 roles simultanement. Un DRH qui ne fait que de l'administratif rate sa dimension strategique.

---

### 4. Il n'y a pas de modele universel de GRH

Les politiques RH doivent s'adapter au **contexte interne** (strategie, culture, taille) et au **contexte externe** (marche de l'emploi, legislation, technologies). Ce qui fonctionne dans une grande banque ne marchera pas forcement dans une startup.`,

memo: JSON.stringify([
  {"recto": "Quelles sont les 4 grandes periodes de l'evolution de la fonction RH ?", "verso": "1) 1900-1950 : Administration du personnel (taylorisme). 2) 1950-1970 : Relations humaines (ecoute, motivation). 3) 1960-1980 : Courant socio-technique (conditions de travail). 4) Apres 1980 : Management strategique (GRH, competences, culture d'entreprise)."},
  {"recto": "Quels sont les principes du courant des Relations humaines ?", "verso": "L'ecoute et la valorisation des salaries, la motivation, la fidelite a l'entreprise, l'esprit d'equipe, un role important des cadres comme relais de la direction, et la delegation pour associer les salaries aux decisions."},
  {"recto": "Qu'apporte le courant socio-technique par rapport aux Relations humaines ?", "verso": "Il critique l'approche Relations humaines comme insuffisante et se concentre sur les conditions de travail concretes, les consequences de l'introduction des nouvelles technologies et la mise en place de groupes de production autonomes."},
  {"recto": "Quelle est l'idee centrale du management strategique des RH ?", "verso": "L'etre humain est considere comme une ressource strategique de l'entreprise. Il EST une ressource et il A des ressources (competences, creativite). L'objectif est de mobiliser les individus autour du projet de l'organisation."},
  {"recto": "Quels sont les 4 roles de la DRH selon le modele d'Ulrich (1997) ?", "verso": "1) Expert administratif (processus quotidiens, paie). 2) Champion des salaries (ecoute, engagement). 3) Partenaire strategique (alignement RH/strategie). 4) Agent du changement (accompagnement des transformations)."},
  {"recto": "Quel role d'Ulrich correspond a l'alignement de la politique RH sur la strategie ?", "verso": "Le role de Partenaire strategique. Il est oriente vers le futur et se concentre sur les processus, avec une approche par les resultats."},
  {"recto": "Quel role d'Ulrich est oriente vers les personnes et le present ?", "verso": "Le role de Champion des salaries : il consiste a ecouter les salaries, repondre a leurs besoins et maintenir leur engagement."},
  {"recto": "Pourquoi n'existe-t-il pas de modele universel de GRH ?", "verso": "Parce que les politiques RH doivent s'adapter au contexte interne (strategie, culture d'entreprise, taille) et externe (marche de l'emploi, legislation, technologies). Ce qui fonctionne dans une organisation ne marchera pas forcement dans une autre."},
  {"recto": "Quelle difference entre l'approche descendante et ascendante de la strategie RH ?", "verso": "Approche descendante (top-down) : la strategie de l'entreprise determine la politique RH. Approche ascendante (bottom-up) : les competences et talents des salaries influencent la strategie de l'entreprise."},
  {"recto": "Comment la fonction RH a-t-elle evolue entre le taylorisme et aujourd'hui ?", "verso": "Elle est passee d'une simple administration du personnel (paie, procedures) a une fonction strategique qui gere les competences, la culture d'entreprise et accompagne le changement organisationnel."},
  {"recto": "Qu'est-ce que l'approche par les couts vs l'approche par les resultats dans le modele d'Ulrich ?", "verso": "L'approche par les couts (expert administratif) cherche a optimiser les depenses RH. L'approche par les resultats (partenaire strategique) cherche a maximiser la contribution des RH a la performance globale de l'entreprise."},
  {"recto": "Donnez un exemple concret du role d'Agent du changement.", "verso": "Lors d'une fusion entre deux entreprises, le DRH accompagne les equipes dans la transition : gestion du stress, harmonisation des cultures, communication sur les changements, formation aux nouvelles methodes de travail."}
])
};

// ============================================================
// CHAPTER 106 - Le contexte de la GRH
// ============================================================
data[106] = {
resume: `## Le contexte de la GRH : facteurs internes et externes

> La GRH ne fonctionne pas en vase clos. Elle est profondement influencee par le contexte dans lequel evolue l'organisation, aussi bien en interne qu'en externe.

---

### 1. Le contexte interne

Trois elements internes influencent directement la facon dont la GRH est pratiquee :

#### a) La strategie de l'entreprise

Il existe deux facons d'articuler strategie et GRH :

- **Approche descendante (top-down)** : la strategie est definie d'abord, puis la GRH s'adapte pour la mettre en oeuvre. L'environnement determine la strategie, qui determine la politique RH.
  > Exemple : une entreprise de haute technologie realigne chaque annee son organisation et ses objectifs sur ses priorites strategiques. Les collaborateurs changent d'activite regulierement.

- **Approche ascendante (bottom-up)** : les competences et talents des salaries sont consideres comme un avantage concurrentiel qui influence la strategie.
  > Exemple : une compagnie aerienne considere ses salaries comme sa plus grande force et construit sa strategie autour de cet atout.

#### b) La culture d'entreprise

La **culture d'entreprise** est le noyau de valeurs partagees par tous les membres de l'organisation. Elle joue deux roles :
- **Mobiliser** les energies autour d'objectifs majeurs
- **Canaliser** les comportements autour de principes federateurs

> Exemple concret : chez Google, la culture d'innovation et de liberte (20% du temps pour des projets personnels) influence directement la politique RH : recrutement de profils creatifs, management flexible, espaces de travail ouverts.

#### c) Le role du CSE (Comite Social et Economique)

Le **CSE** est l'instance unique de representation du personnel, creee par les **ordonnances Macron de septembre 2017**. Il remplace les anciennes instances (delegues du personnel, CHSCT, comite d'entreprise).

**Qui est concerne ?** Toutes les entreprises de **11 salaries et plus**.

**Composition** : l'employeur + des delegues du personnel (nombre variable selon la taille).

**Missions du CSE** :
- Presenter les **reclamations individuelles ou collectives** (salaires, reglementation)
- Veiller a la **sante, securite et conditions de travail**
- Saisir l'**inspection du travail** en cas de probleme
- Dans les entreprises de **50+ salaries** : assurer l'expression collective sur la gestion economique, l'organisation du travail, la formation

**Les Delegues Syndicaux (DS)** : dans les entreprises de 50+ salaries, chaque syndicat representatif peut designer des DS qui formulent des propositions et negocient (ex : **negociations periodiques obligatoires**).

---

### 2. Les themes de la negociation obligatoire

Les entreprises doivent negocier sur trois grands themes :

| Theme | Periodicite | Exemples de sujets |
|-------|------------|-------------------|
| **Remunerations, temps de travail, partage de la valeur ajoutee** | Annuelle | Salaires, duree du travail, interessement, participation, egalite salariale H/F |
| **Egalite professionnelle H/F et qualite de vie au travail** | Annuelle | Equilibre vie pro/perso, lutte contre les discriminations, insertion handicap, droit a la deconnexion |
| **GEPP et mixite des metiers** (entreprises de 300+ salaries) | Triennale | Gestion previsionnelle des emplois, mobilite interne, formation, emploi des jeunes et des seniors |

---

### 3. Le contexte externe

Plusieurs facteurs externes impactent la GRH :

- Le **changement economique** : crises, mondialisation, concurrence accrue
- Le **changement technologique** : digitalisation, automatisation, IA
- Le **changement demographique** : vieillissement de la population, gestion des seniors et des jeunes generations
- Les **crises sanitaires** : teletravail, reorganisation, bien-etre au travail
- Le **changement socio-culturel** : RSE, attentes des nouvelles generations, quete de sens au travail

> Exemple : la crise Covid a bouleverse la GRH en accelerant le teletravail, en obligeant a repenser les conditions de travail et en renforçant l'importance du bien-etre au travail.`,

memo: JSON.stringify([
  {"recto": "Quels sont les trois elements du contexte interne qui influencent la GRH ?", "verso": "1) La strategie de l'entreprise (descendante ou ascendante). 2) La culture d'entreprise (valeurs partagees qui mobilisent et canalisent). 3) Le role du CSE (representation du personnel)."},
  {"recto": "Qu'est-ce que le CSE et quand a-t-il ete cree ?", "verso": "Le Comite Social et Economique est l'instance unique de representation du personnel, creee par les ordonnances Macron de septembre 2017. Il remplace les anciennes instances (DP, CHSCT, CE). Il est obligatoire dans les entreprises de 11 salaries et plus."},
  {"recto": "Quelles sont les principales missions du CSE ?", "verso": "Presenter les reclamations individuelles ou collectives, veiller a la sante/securite/conditions de travail, saisir l'inspection du travail. Dans les entreprises de 50+ salaries : assurer l'expression collective sur la gestion economique, l'organisation du travail et la formation."},
  {"recto": "Qu'est-ce qu'un Delegue Syndical (DS) et dans quelles entreprises en trouve-t-on ?", "verso": "Un DS est un representant designe par un syndicat representatif dans les entreprises de 50 salaries et plus. Il formule des propositions, des revendications et negocie (notamment dans le cadre des negociations periodiques obligatoires)."},
  {"recto": "Quels sont les 3 themes de la negociation obligatoire en entreprise ?", "verso": "1) Remunerations, temps de travail et partage de la valeur ajoutee (annuelle). 2) Egalite professionnelle H/F et qualite de vie au travail (annuelle). 3) GEPP et mixite des metiers, pour les entreprises de 300+ salaries (triennale)."},
  {"recto": "Qu'est-ce que la culture d'entreprise et quels sont ses deux roles ?", "verso": "C'est le noyau de valeurs partagees par tous les membres de l'organisation. Ses roles : 1) Mobiliser les energies autour d'objectifs majeurs. 2) Canaliser les comportements autour de principes federateurs."},
  {"recto": "Quels sont les 5 facteurs du contexte externe qui impactent la GRH ?", "verso": "1) Le changement economique (crises, mondialisation). 2) Le changement technologique (digitalisation, IA). 3) Le changement demographique (seniors, jeunes). 4) Les crises sanitaires (teletravail). 5) Le changement socio-culturel (RSE, quete de sens)."},
  {"recto": "Quelle est la difference entre l'approche strategique descendante et ascendante en GRH ?", "verso": "Descendante (top-down) : la strategie determine la politique RH. Ascendante (bottom-up) : les competences des salaries influencent la strategie. En pratique, les deux approches coexistent souvent."},
  {"recto": "Quelles anciennes instances le CSE a-t-il remplacees ?", "verso": "Le CSE a remplace trois instances : les Delegues du Personnel (DP), le Comite d'Hygiene de Securite et des Conditions de Travail (CHSCT) et le Comite d'Entreprise (CE)."},
  {"recto": "Qu'est-ce que le droit a la deconnexion ?", "verso": "C'est le droit pour un salarie de ne pas etre joignable en dehors de ses heures de travail (emails, appels). Il fait partie des sujets de la negociation obligatoire sur la qualite de vie au travail."},
  {"recto": "Comment la crise sanitaire (Covid) a-t-elle impacte la GRH ?", "verso": "Elle a accelere le teletravail, oblige a repenser les conditions de travail et l'organisation, et renforce l'importance du bien-etre au travail et de l'equilibre vie pro/perso."},
  {"recto": "Donnez un exemple d'approche descendante de la strategie RH.", "verso": "Une entreprise de haute technologie qui realigne chaque annee son organisation et les postes de ses collaborateurs sur ses priorites strategiques du moment."}
])
};

// ============================================================
// CHAPTER 116 - Les objectifs et enjeux du recrutement
// ============================================================
data[116] = {
resume: `## Les objectifs et enjeux du recrutement

> Le recrutement est l'un des processus RH les plus visibles et strategiques. Un mauvais recrutement coute cher, un bon recrutement est un investissement pour l'avenir.

---

### 1. Pourquoi recrute-t-on ?

Le recrutement sert trois objectifs principaux :
- **Compenser les departs** : retraites, demissions, licenciements
- **Accompagner les mouvements internes** : mutations, promotions qui liberent des postes
- **Accompagner le developpement de l'organisation** : croissance, nouveaux projets, nouvelles activites

---

### 2. Les enjeux du recrutement pour chaque partie

**Pour les employeurs** :
- Enjeux **financiers** : un recrutement rate coute entre 20 000 et 200 000 euros selon le poste. A l'inverse, recruter le bon profil booste la performance.
- Enjeux **politiques** : le recrutement reflette les choix de l'entreprise (diversite, parite, rajeunissement)
- Enjeux d'**image** : la facon de recruter impacte la **marque employeur**

**Pour les candidats** :
- Ils sont soumis a une **evaluation** et une **selection** qui peuvent etre stressantes
- Les methodes de selection doivent etre justes et transparentes

**Pour la societe** :
- Le recrutement impacte le **marche de l'emploi** dans son ensemble
- Il souleve des enjeux **juridiques** (non-discrimination) et **ethiques** (egalite des chances)

---

### 3. Les grands axes de la politique de recrutement

Chaque entreprise doit construire sa propre politique de recrutement en repondant a ces questions strategiques :
- Recruter en **interne** (mobilite) ou en **externe** ?
- Attirer des **talents nouveaux** ou **developper les competences** des collaborateurs existants ?
- Recourir au **travail temporaire** ou recruter en **CDD/CDI** ?
- Privilegier les **jeunes diplomes** ou des profils **experimentes** (mais plus chers) ?

> Il n'existe pas de modele unique. Chaque entreprise doit construire un ensemble de choix coherents adaptes a son contexte.

---

### 4. La proposition de valeur aux candidats

Pour attirer les meilleurs profils, l'entreprise doit proposer une **proposition de valeur** (Employee Value Proposition) articulee autour de 4 piliers :

| Pilier | Portee | Horizon | Description |
|--------|--------|---------|-------------|
| **Avantages materiels** | Individuelle | Court terme | Salaire, bureau, equipement, flexibilite, transports |
| **Opportunites de developpement** | Individuelle | Long terme | Nouvelles competences, formations, rotations de postes, evolutions |
| **Liens et communaute** | Collective | Court terme | Sentiment d'appartenance, culture stimulante, liens sociaux, franchise |
| **Sens et raison d'etre** | Collective | Long terme | Ambitions de l'entreprise, impact social, reponse au "pourquoi ce travail ?" |

> Exemple concret : une entreprise comme Patagonia attire des talents grace a son sens (protection de l'environnement) et sa communaute (culture d'equipe forte), pas seulement grace aux salaires.`,

memo: JSON.stringify([
  {"recto": "Quels sont les 3 objectifs principaux du recrutement ?", "verso": "1) Compenser les departs (retraites, demissions). 2) Accompagner les mouvements internes (mutations, promotions). 3) Accompagner le developpement de l'organisation (croissance, nouveaux projets)."},
  {"recto": "Quels sont les enjeux du recrutement pour l'employeur ?", "verso": "Des enjeux financiers (un mauvais recrutement coute tres cher), des enjeux politiques (diversite, parite) et des enjeux d'image (marque employeur)."},
  {"recto": "Quels sont les 4 piliers de la proposition de valeur aux candidats ?", "verso": "1) Avantages materiels (salaire, flexibilite). 2) Opportunites de developpement (formation, evolution). 3) Liens et communaute (appartenance, culture). 4) Sens et raison d'etre (impact, mission de l'entreprise)."},
  {"recto": "Quelles grandes questions strategiques se pose-t-on lors de la definition d'une politique de recrutement ?", "verso": "Interne vs externe ? Nouveaux talents vs developpement interne ? Temporaire vs CDD/CDI ? Jeunes diplomes vs profils experimentes ? Il n'y a pas de reponse universelle."},
  {"recto": "Qu'est-ce que la marque employeur et quel est son lien avec le recrutement ?", "verso": "La marque employeur est l'image que l'entreprise renvoie en tant qu'employeur. Un processus de recrutement transparent, respectueux et bien organise renforce la marque employeur et attire de meilleurs candidats."},
  {"recto": "Quel est l'enjeu du recrutement pour la societe dans son ensemble ?", "verso": "Le recrutement impacte le marche de l'emploi et souleve des enjeux juridiques (non-discrimination a l'embauche) et ethiques (egalite des chances pour tous les candidats)."},
  {"recto": "Que signifie 'Opportunites de developpement' dans la proposition de valeur ?", "verso": "C'est la capacite de l'entreprise a aider ses collaborateurs a acquerir de nouvelles competences : nouvelles fonctions, rotation des postes, formations et evolution de carriere."},
  {"recto": "Qu'est-ce que le pilier 'Sens et raison d'etre' dans la proposition de valeur ?", "verso": "Ce sont les ambitions qui justifient l'existence de l'entreprise. C'est sa capacite a repondre a la question 'Pourquoi faire ce travail ?', en lien avec un desir d'ameliorer la societe."},
  {"recto": "Pourquoi dit-on qu'il n'existe pas de modele unique de politique de recrutement ?", "verso": "Parce que chaque entreprise a un contexte different (taille, secteur, culture, budget). Elle doit construire un ensemble de choix specifiques et coherents adaptes a ses objectifs et contraintes."},
  {"recto": "Qu'est-ce qui differencie le pilier 'Liens et communaute' des autres ?", "verso": "C'est un pilier collectif et a court terme : etre apprecie pour ce qu'on est, avoir des liens sociaux forts, evoluer dans une culture stimulante qui favorise la franchise et le sentiment d'appartenance."},
  {"recto": "Quels risques comporte un mauvais recrutement ?", "verso": "Cout financier eleve (entre 20k et 200k euros selon le poste), perte de temps, baisse de moral de l'equipe, possible impact sur la performance collective et necessite de relancer le processus."}
])
};

// ============================================================
// CHAPTER 117 - Le sourcing et les canaux de recrutement
// ============================================================
data[117] = {
resume: `## Le sourcing et les canaux de recrutement

> Avant de selectionner des candidats, il faut d'abord identifier precisement le besoin puis savoir ou et comment chercher les bons profils. C'est la phase de sourcing.

---

### 1. Les 4 grandes etapes du processus de recrutement

Le recrutement suit un processus structure en 4 etapes :
1. **L'identification des besoins** : de quel profil a-t-on besoin ?
2. **La recherche des candidatures (sourcing)** : ou trouver les candidats ?
3. **La selection des candidats** : comment choisir le meilleur ?
4. **L'integration (onboarding)** : comment reussir l'arrivee du nouveau collaborateur ?

---

### 2. L'identification des besoins

**Qui declenche le recrutement ?** En general, c'est le **N+1** (le manager direct) qui formule la demande. Puis les **RH analysent** cette demande pour verifier si le poste est vraiment necessaire et s'il n'existe pas de solutions alternatives (reorganisation, promotion interne, sous-traitance...).

**Le profil du poste** doit preciser :
- L'intitule et le type de poste
- La position dans l'organigramme
- Les missions et responsabilites principales
- La remuneration prevue
- Les perspectives d'evolution

**Le profil du candidat** doit definir :
- La formation (initiale et continue)
- Les experiences professionnelles requises
- Les **competences** : theoriques, techniques et **comportementales** (soft skills)
- Les caracteristiques specifiques : disponibilite, mobilite geographique...

---

### 3. Le sourcing : recruter en interne ou en externe ?

| | Recrutement interne | Recrutement externe |
|-|---------------------|---------------------|
| **Avantages** | Delai plus court, moins de candidatures a traiter, couts moins eleves, opportunite d'evolution pour les salaries, risque plus faible, integration plus facile | Renouvellement des competences, nouvelles experiences, pas de rivalites internes, decision plus neutre basee sur les aptitudes |

---

### 4. Les canaux de recrutement

**Faire ou faire faire ?** L'entreprise recrute-t-elle seule ou fait-elle appel a un **cabinet de recrutement** ? Les prestataires externes sont surtout utilises pour des profils specifiques ou de haut niveau.

**Les canaux internes** :
- Site internet de l'entreprise, Intranet, portails RH
- Information aux services, bourses d'emploi internes, forums

**Les canaux externes** :
- **Recours au marche** : jobboards (APEC, France Travail, HelloWork, Cadremploi), organismes professionnels, ecoles et universites, salons professionnels, candidatures spontanees
- **Recours aux reseaux** : reseaux sociaux (LinkedIn surtout), relations personnelles, **cooptation** (recommandation par un salarie)

---

### 5. Les outils du e-recrutement

Le digital a profondement transforme le recrutement :

- **Jobboards** (Monster, Indeed) : publication d'offres, alertes email, CVtheques
- **Sites et blogs d'entreprise** : forums de discussion, chats avec des collaborateurs en poste, videos metiers
- **Chats recruteurs** : entretiens interactifs en ligne avec les RH
- **Blog RH** : donne la parole aux salaries pour vehiculer la culture d'entreprise
- **Reseaux sociaux** : LinkedIn est devenu incontournable pour le sourcing de profils experimentes

> Selon l'APEC (2023), les canaux les plus utilises par les grandes entreprises pour recruter des cadres sont : l'offre d'emploi (94%), les reseaux sociaux (85%), le reseau de contacts (76%) et l'approche directe (74%).

> La **cooptation** (recommandation par un salarie) represente 52% dans les grandes entreprises. C'est un canal puissant car le salarie engage sa reputation.`,

memo: JSON.stringify([
  {"recto": "Quelles sont les 4 grandes etapes du processus de recrutement ?", "verso": "1) Identification des besoins (profil du poste et du candidat). 2) Recherche des candidatures (sourcing). 3) Selection des candidats. 4) Integration des nouvelles recrues (onboarding)."},
  {"recto": "Qui declenche generalement un recrutement et qui l'analyse ?", "verso": "Le N+1 (manager direct) formule la demande. Les RH l'analysent pour verifier si le poste est necessaire et s'il n'existe pas d'alternatives (reorganisation, promotion interne, sous-traitance)."},
  {"recto": "Que doit contenir le profil du poste ?", "verso": "L'intitule et type de poste, la position dans l'organigramme, les missions et responsabilites principales, la remuneration prevue et les perspectives d'evolution."},
  {"recto": "Que doit contenir le profil du candidat ?", "verso": "La formation (initiale et continue), les experiences professionnelles, les competences (theoriques, techniques, comportementales/soft skills) et les caracteristiques specifiques (disponibilite, mobilite)."},
  {"recto": "Quels sont les avantages du recrutement interne vs externe ?", "verso": "Interne : delai plus court, couts reduits, risque plus faible, motivation des salaries. Externe : nouvelles competences, nouvelles experiences, pas de rivalites internes, decision plus neutre."},
  {"recto": "Qu'est-ce que la cooptation en recrutement ?", "verso": "C'est la recommandation d'un candidat par un salarie de l'entreprise. Le salarie engage sa reputation, ce qui rend souvent les recommandations pertinentes. Cela represente 52% des recrutements de cadres dans les grandes entreprises."},
  {"recto": "Quels sont les principaux canaux externes de recrutement ?", "verso": "Les jobboards (APEC, France Travail, HelloWork), les organismes professionnels, les ecoles/universites, les salons professionnels, les candidatures spontanees, les reseaux sociaux (LinkedIn) et la cooptation."},
  {"recto": "Quand fait-on appel a un cabinet de recrutement externe ?", "verso": "Principalement pour des profils specifiques, rares ou de haut niveau, quand l'entreprise ne dispose pas des reseaux ou de l'expertise necessaire pour trouver ces profils elle-meme."},
  {"recto": "Quels sont les outils du e-recrutement ?", "verso": "Les jobboards (Monster, Indeed), les sites et blogs d'entreprise, les chats recruteurs en ligne, les blogs RH (salaries qui temoignent) et les reseaux sociaux (LinkedIn surtout)."},
  {"recto": "Selon l'APEC (2023), quels sont les 3 canaux les plus utilises par les grandes entreprises ?", "verso": "1) L'offre d'emploi (94%). 2) Les reseaux sociaux (85%). 3) Le reseau de contacts (76%). Suivis de l'approche directe (74%)."},
  {"recto": "Pourquoi le blog RH est-il un outil de recrutement efficace ?", "verso": "Il donne la parole aux salaries qui decrivent leur metier et vehiculent la culture d'entreprise. Cela rend l'entreprise plus attractive et authentique aux yeux des candidats."},
  {"recto": "Qu'est-ce que l'approche directe en recrutement ?", "verso": "C'est le fait d'aller chercher directement des candidats potentiels (souvent sur LinkedIn ou via des cabinets de chasse de tetes) plutot que d'attendre qu'ils postulent a une offre."}
])
};

// ============================================================
// CHAPTER 118 - La sélection des candidats
// ============================================================
data[118] = {
resume: `## La selection des candidats

> Selectionner le bon candidat est un exercice delicat : il faut etre rigoureux et objectif, tout en respectant le cadre legal et en ayant conscience de ses propres biais.

---

### 1. Pourquoi des outils de selection ?

Les outils de selection servent a :
- Fournir une **aide a la decision** pour reduire la subjectivite et les risques d'erreur
- **Justifier objectivement** le choix d'un candidat (ou son rejet)

---

### 2. Le cadre legal de la selection

Le droit du travail encadre strictement les pratiques de selection :

- Les **methodes de recrutement** doivent etre portees a la connaissance du candidat et du CSE
- Les methodes doivent etre **pertinentes** par rapport au poste a pourvoir
- Les **resultats** doivent rester **confidentiels** (seul le candidat peut y acceder)

**L'interdiction de la discrimination a l'embauche** (article L.122-45 du Code du travail) : aucun candidat ne peut etre ecarte en raison de son origine, sexe, orientation sexuelle, opinions politiques, activites syndicales, convictions religieuses, apparence physique, etat de sante, handicap, etc.

---

### 3. Les pratiques de selection en chiffres

D'apres l'APEC (2022), pour les entreprises de 10+ salaries ayant recrute au moins un cadre :

**Verifications realisees** :
- 61% verifient les **references**
- 37% font une **recherche internet** sur le candidat
- 29% verifient le **diplome**

**Evolution des pratiques** :
- La lettre de motivation est en recul : 69% en 2019 contre 56% en 2022
- La preselection telephonique progresse : 58% en 2019 contre 67% en 2022

---

### 4. Les tests de selection

| Type de test | Objectif | Validite predictive |
|-------------|----------|---------------------|
| **Mises en situation / Simulations** | Evaluer la capacite a effectuer une tache reelle | Elevee |
| **Tests d'aptitudes / QI** | Mesurer des aptitudes particulieres (logique, verbal) | Elevee |
| **Entretiens structures** | Evaluer les competences et la motivation | Assez bonne |
| **References, performances passees** | Verifier le parcours et les realisations | Assez bonne |
| **Tests de personnalite** | Cerner le profil comportemental | Faible |
| **Graphologie, morphopsychologie** | Pseudo-sciences sans fondement | Nulle |

> Point cle : les mises en situation et tests d'aptitudes ont la meilleure validite predictive. En revanche, la graphologie n'a aucune valeur scientifique. C'est un piege classique en examen.

**Utilisation des tests en pratique** (APEC 2022) :
- 26% : mise en situation professionnelle
- 20% : test de personnalite
- 16% : test de langue etrangere
- 14% : test psychotechnique

---

### 5. L'entretien de recrutement

L'entretien comporte deux categories de questions :
- Les questions **motivationnelles** : pourquoi ce poste ? pourquoi cette entreprise ? quels sont vos objectifs de carriere ?
- Les questions relatives aux **competences et savoir-faire** : racontez une situation ou vous avez du gerer un conflit, etc.

---

### 6. Les biais cognitifs en recrutement

**Du cote du recruteur** :
- **Effet de halo** : une premiere impression (positive ou negative) colore toute l'evaluation. Ex : un candidat souriant est percu comme plus competent.
- **Biais de projection** : le recruteur favorise les candidats qui lui ressemblent (meme ecole, memes loisirs).
- **Effet d'inference** : tirer des conclusions hatives a partir d'informations partielles.

**Du cote du candidat** :
- **Desirabilite sociale** : le candidat donne les reponses qu'il pense etre attendues plutot que des reponses sinceres.

---

### 7. La decision d'embauche

La decision d'embauche n'est **rationnelle qu'en apparence**, car :
- La **rationalite des decideurs est limitee** (concept de Herbert Simon : on ne peut pas analyser toutes les informations)
- La decision reflete aussi les **jeux de pouvoir** et les **rapports de force** au sein de l'entreprise (analyse de Crozier et Friedberg)

> Exemple : un manager peut imposer son candidat prefere face au choix du RH, non pas parce que le candidat est meilleur, mais parce que le manager a plus de pouvoir dans l'organisation.`,

memo: JSON.stringify([
  {"recto": "Quels sont les deux objectifs des outils de selection en recrutement ?", "verso": "1) Fournir une aide a la decision pour reduire la subjectivite et les erreurs. 2) Justifier objectivement la selection ou le rejet d'un candidat."},
  {"recto": "Que dit le droit du travail sur les methodes de recrutement ?", "verso": "Les methodes doivent etre portees a la connaissance du candidat et du CSE, elles doivent etre pertinentes par rapport au poste, et les resultats doivent rester confidentiels (accessibles uniquement au candidat)."},
  {"recto": "Quels types de tests ont la meilleure validite predictive en recrutement ?", "verso": "Les mises en situation / simulations (validite elevee) et les tests d'aptitudes / QI (validite elevee). A l'inverse, la graphologie a une validite nulle."},
  {"recto": "Qu'est-ce que l'effet de halo en recrutement ?", "verso": "C'est un biais cognitif ou une premiere impression (positive ou negative) influence toute l'evaluation du candidat. Exemple : un candidat qui fait bonne impression physiquement sera percu comme plus competent."},
  {"recto": "Qu'est-ce que le biais de projection chez le recruteur ?", "verso": "C'est la tendance du recruteur a favoriser les candidats qui lui ressemblent (meme formation, memes centres d'interet, meme milieu social)."},
  {"recto": "Qu'est-ce que la desirabilite sociale du cote du candidat ?", "verso": "C'est la tendance du candidat a donner les reponses qu'il pense etre attendues par le recruteur, plutot que des reponses sinceres et authentiques."},
  {"recto": "Pourquoi la decision d'embauche n'est-elle rationnelle qu'en apparence ?", "verso": "Selon Herbert Simon, la rationalite des decideurs est limitee (on ne peut pas tout analyser). De plus, selon Crozier et Friedberg, la decision reflete les jeux de pouvoir et rapports de force internes."},
  {"recto": "Quelles sont les 2 categories de questions en entretien de recrutement ?", "verso": "1) Les questions motivationnelles (pourquoi ce poste ? quels objectifs ?). 2) Les questions relatives aux competences et savoir-faire (mises en situation, exemples concrets)."},
  {"recto": "Quels sont les criteres de discrimination interdits a l'embauche ?", "verso": "L'origine, le sexe, l'orientation sexuelle, les opinions politiques, les activites syndicales, les convictions religieuses, l'apparence physique, l'etat de sante, le handicap, entre autres (article L.122-45)."},
  {"recto": "Qu'est-ce que l'effet d'inference en recrutement ?", "verso": "C'est le fait de tirer des conclusions hatives a partir d'informations partielles. Exemple : deduire qu'un candidat est desorganise parce qu'il est arrive 2 minutes en retard."},
  {"recto": "Comment a evolue l'utilisation de la lettre de motivation entre 2019 et 2022 ?", "verso": "Elle est en recul : 69% des recruteurs la demandaient en 2019, contre seulement 56% en 2022. La preselection telephonique, elle, a progresse de 58% a 67%."},
  {"recto": "Quelle est la validite predictive des tests de personnalite en recrutement ?", "verso": "Elle est faible. Les tests de personnalite aident a cerner un profil comportemental mais ne predisent que faiblement la reussite dans le poste. Les mises en situation sont bien plus fiables."},
  {"recto": "Qui est Herbert Simon et quel concept a-t-il apporte ?", "verso": "Herbert Simon est un economiste qui a theorise la rationalite limitee : les decideurs ne peuvent pas analyser toutes les informations disponibles et prennent donc des decisions imparfaites, basees sur une information partielle."}
])
};

// ============================================================
// CHAPTER 119 - L'intégration des nouveaux collaborateurs
// ============================================================
data[119] = {
resume: `## L'integration des nouveaux collaborateurs (onboarding)

> Un recrutement ne se termine pas a la signature du contrat. L'integration est une phase critique : 36% des embauches en CDI se soldent par un depart dans les 12 premiers mois.

---

### 1. Les enjeux de l'integration

L'integration est cruciale pour plusieurs raisons :

- **La reussite du recrutement** : un recrutement n'est vraiment reussi que si le nouveau collaborateur reste et s'integre durablement
- **La maitrise du turnover** : 36% des CDI sont rompus dans la premiere annee. Un onboarding rate est souvent la cause de ces departs prematures.
- **Les enjeux financiers** : chaque depart premature represente un cout important (nouveau recrutement, formation perdue, perte de productivite)
- **La transmission de la culture et du savoir-faire** : le nouveau collaborateur doit comprendre les codes, les pratiques et les valeurs de l'entreprise

---

### 2. La courbe de sous-efficacite

Quand un nouveau collaborateur arrive, il traverse une phase de **sous-efficacite** avant d'atteindre sa pleine performance. Cette courbe comporte trois phases :

1. **Adaptation au poste** : le collaborateur decouvre son environnement, ses collegues, ses outils
2. **Maitrise du poste** : il commence a etre autonome et productif
3. **Performance optimale** : il atteint son plein potentiel

> L'objectif de l'onboarding est de raccourcir cette courbe de sous-efficacite au maximum, pour que le collaborateur devienne performant le plus vite possible.

---

### 3. Les 4 leviers du management de l'integration

Pour reussir l'integration, il faut aider les nouvelles recrues sur 4 plans :

**S'informer** : fournir les informations pratiques et operationnelles
- Livret d'integration
- Formations d'accueil
- Stages de decouverte des differents services

**S'integrer socialement** : creer du lien avec les equipes
- Integration dans les equipes existantes
- Acces aux lieux de socialisation (cantine, espaces communs)
- Evenements d'integration

**S'adapter psychologiquement** : accompagner le changement
- Designation d'un **parrain** ou **tuteur** (mentor)
- Soutien des collegues
- Bienveillance face a l'erreur

**Apprendre les comportements requis** : comprendre la culture
- **Feedback regulier du N+1** : le manager donne des retours frequents
- Contact avec les "anciens" qui transmettent les codes implicites

> Exemple concret : chez Salesforce, chaque nouvel employe a un "buddy" (parrain) pendant 90 jours, recoit un parcours de formation structure, et participe a des dejeuners d'equipe hebdomadaires. Resultat : un turnover en premiere annee nettement inferieur a la moyenne du secteur.

---

### 4. Points cles a retenir

- L'integration est un **processus**, pas un evenement ponctuel (le premier jour)
- Le **manager** joue un role essentiel dans l'integration de ses collaborateurs
- Un bon onboarding combine des aspects **informationnels**, **sociaux**, **psychologiques** et **culturels**
- L'investissement dans l'integration est toujours moins couteux qu'un depart premature`,

memo: JSON.stringify([
  {"recto": "Quel pourcentage des embauches en CDI se solde par un depart dans les 12 premiers mois ?", "verso": "36% des embauches en CDI se soldent par un depart dans les 12 premiers mois. C'est pourquoi l'integration (onboarding) est une phase critique du processus de recrutement."},
  {"recto": "Quels sont les 4 enjeux principaux de l'integration ?", "verso": "1) La reussite du recrutement (le nouveau reste et s'integre). 2) La maitrise du turnover. 3) Les enjeux financiers (cout d'un depart premature). 4) La transmission de la culture et du savoir-faire."},
  {"recto": "Qu'est-ce que la courbe de sous-efficacite ?", "verso": "C'est la periode apres l'embauche pendant laquelle le nouveau collaborateur n'est pas encore pleinement performant. Elle passe par 3 phases : adaptation au poste, maitrise du poste, puis performance optimale. L'onboarding vise a raccourcir cette courbe."},
  {"recto": "Quels sont les 4 leviers du management de l'integration ?", "verso": "1) S'informer (livret d'accueil, formations). 2) S'integrer socialement (equipes, evenements). 3) S'adapter psychologiquement (parrain/tuteur). 4) Apprendre les comportements requis (feedback du N+1, contact avec les anciens)."},
  {"recto": "Quel est le role du parrain ou tuteur dans l'integration ?", "verso": "Le parrain (ou tuteur/buddy) accompagne le nouvel arrivant dans son adaptation psychologique : il repond aux questions, rassure, aide a decoder les codes implicites de l'entreprise et facilite l'integration sociale."},
  {"recto": "Pourquoi le feedback du N+1 est-il essentiel pendant l'integration ?", "verso": "Parce qu'il permet au nouveau collaborateur de comprendre les comportements attendus, de corriger rapidement ses erreurs et de savoir s'il est sur la bonne voie. Sans feedback, le collaborateur peut se sentir perdu ou faire des erreurs sans s'en rendre compte."},
  {"recto": "Quels outils concrets peut-on utiliser pour aider un nouveau collaborateur a s'informer ?", "verso": "Un livret d'integration (qui presente l'entreprise, les procedures, les contacts cles), des formations d'accueil et des stages de decouverte des differents services de l'entreprise."},
  {"recto": "Pourquoi l'integration est-elle un processus et non un evenement ponctuel ?", "verso": "Parce qu'un simple pot d'accueil le premier jour ne suffit pas. L'integration s'etale sur plusieurs semaines ou mois et combine des aspects informationnels, sociaux, psychologiques et culturels pour que le collaborateur devienne pleinement operationnel."},
  {"recto": "Quel est le lien entre integration et turnover ?", "verso": "Un mauvais onboarding est l'une des principales causes de depart premature. Investir dans l'integration reduit le turnover et est toujours moins couteux que de relancer un processus de recrutement."},
  {"recto": "Quels sont les couts caches d'un depart premature ?", "verso": "Le cout du nouveau recrutement, la formation perdue (temps et argent investis pour rien), la perte de productivite de l'equipe, la charge supplementaire sur les collegues et l'impact sur le moral de l'equipe."},
  {"recto": "Comment favoriser l'integration sociale d'un nouveau collaborateur ?", "verso": "En l'integrant dans les equipes existantes, en lui donnant acces aux lieux de socialisation (cantine, espaces communs), en organisant des evenements d'integration (dejeuners d'equipe, afterworks)."}
])
};

// ============================================================
// CHAPTER 111 - Les fondamentaux de la rémunération
// ============================================================
data[111] = {
resume: `## Les fondamentaux de la remuneration

> La remuneration est bien plus qu'un simple salaire : c'est un outil strategique qui touche a l'economie, a la psychologie, a la sociologie et a la politique de l'entreprise.

---

### 1. Les 5 dimensions de la remuneration

La remuneration est un sujet multidimensionnel :

- **Economique** : en 2019, la remuneration des salaries representait 57,6% de la valeur ajoutee des entreprises. C'est le premier poste de depenses.
- **Psychologique** : c'est un puissant element de **motivation** (ou de demotivation). Un salarie qui se sent mal paye sera moins engage.
- **Sociologique** : il existe un lien fort entre remuneration et **statut social**. Le salaire positionne l'individu dans la societe.
- **Politique** : la remuneration est au coeur du **rapport de forces** entre la direction et les partenaires sociaux (syndicats).
- **Ethique et juridique** : le principe "a travail egal, salaire egal" est une obligation legale.

---

### 2. Les objectifs d'une politique de remuneration

Une bonne politique de remuneration poursuit 3 objectifs :

**Vis-a-vis de la strategie** : etre en coherence avec les objectifs economiques et les choix strategiques de l'organisation.

**Vis-a-vis du marche de l'emploi** :
- **Attirer** des individus en nombre et en qualite
- Prendre en compte le niveau de remuneration pratique dans le **secteur** et le **bassin d'emploi** (si on paie en dessous du marche, on n'attire personne)

**Vis-a-vis des salaries** :
- **Reguler le turnover** : eviter les departs en proposant une remuneration competitive
- **Motiver** la performance : la remuneration comme outil d'incitation

---

### 3. Les composantes de la remuneration

La remuneration se compose de 4 grandes familles :

#### 3.1 La remuneration directe (court terme)
- **Salaire de qualification (fixe)** : salaire de base + complement individuel. C'est la partie garantie chaque mois.
- **Salaire de performance (variable)** : lie aux resultats individuels et/ou collectifs. Ex : commission sur ventes, bonus annuel.
- **Primes** (fixes et variables) : liees au travail, a la fonction ou a l'emploi (prime de nuit, prime d'anciennete...), independantes des resultats individuels.

#### 3.2 Les peripheriques legaux (moyen terme)
Ce sont des dispositifs qui font varier la remuneration en fonction des **resultats de l'entreprise** :

- **L'interessement** (cree en 1959) : prime proportionnelle aux resultats ou performances de l'entreprise. Facultatif. Concerne tous les salaries.
- **La participation** (creee en 1967) : prime **obligatoire** pour les entreprises de 50+ salaries (pendant 5 ans sans interruption). La part des benefices est calculee par une formule legale.

> Depuis janvier 2025, les entreprises de 11 a 49 salaries ayant realise un benefice net >= 1% du CA pendant 3 ans consecutifs doivent aussi mettre en place un dispositif de partage de la valeur.

- **Le Plan d'Epargne Entreprise (PEE)** : systeme d'epargne collective ou les salaries versent leurs primes d'interessement/participation + versements complementaires. L'entreprise peut ajouter un **abondement**. Sommes bloquees 5 ans.

#### 3.3 Les avantages en nature (court terme)
- **Individuels** : voiture de fonction, logement de fonction, telephone, frais de representation
- **Collectifs** : cheques dejeuner, remises sur produits, aides familiales, bourses d'etudes pour les enfants

#### 3.4 Les peripheriques statutaires
Ce sont les avantages sociaux acquis par les salaries :
- Court terme : mutuelle, assurance automobile
- Moyen terme : compte epargne-temps
- Long terme : complement de retraite, assurance-vie`,

memo: JSON.stringify([
  {"recto": "Quelles sont les 5 dimensions de la remuneration ?", "verso": "1) Economique (57,6% de la valeur ajoutee). 2) Psychologique (motivation/demotivation). 3) Sociologique (lien remuneration-statut social). 4) Politique (rapport de forces direction/syndicats). 5) Ethique et juridique (a travail egal, salaire egal)."},
  {"recto": "Quels sont les 3 objectifs d'une politique de remuneration ?", "verso": "1) Etre en coherence avec la strategie de l'entreprise. 2) Attirer des talents en etant competitif par rapport au marche de l'emploi. 3) Reguler le turnover et motiver la performance des salaries."},
  {"recto": "Quelles sont les 4 grandes composantes de la remuneration ?", "verso": "1) La remuneration directe (salaire fixe + variable + primes). 2) Les peripheriques legaux (interessement, participation, PEE). 3) Les avantages en nature (voiture, cheques dejeuner). 4) Les peripheriques statutaires (mutuelle, retraite complementaire)."},
  {"recto": "Quelle est la difference entre le salaire de qualification et le salaire de performance ?", "verso": "Le salaire de qualification est la partie fixe garantie (salaire de base + complement individuel). Le salaire de performance est la partie variable, liee aux resultats individuels et/ou collectifs (commissions, bonus)."},
  {"recto": "Qu'est-ce que l'interessement et est-il obligatoire ?", "verso": "L'interessement est une prime proportionnelle aux resultats ou performances de l'entreprise, versee a tous les salaries. Il est FACULTATIF (contrairement a la participation). Cree en 1959."},
  {"recto": "Qu'est-ce que la participation et quand est-elle obligatoire ?", "verso": "La participation est une prime calculee sur les benefices de l'entreprise. Elle est OBLIGATOIRE pour les entreprises de 50+ salaries (employes sans interruption pendant 5 ans). Creee en 1967."},
  {"recto": "Qu'est-ce que le PEE (Plan d'Epargne Entreprise) ?", "verso": "C'est un systeme d'epargne collective : les salaries y versent leurs primes d'interessement/participation + des versements complementaires. L'entreprise peut ajouter un abondement. Les sommes sont bloquees pendant 5 ans."},
  {"recto": "Qu'est-ce que l'abondement dans le cadre du PEE ?", "verso": "C'est la contribution supplementaire de l'entreprise qui vient s'ajouter aux versements du salarie dans le PEE. C'est un avantage attractif qui encourage l'epargne salariale."},
  {"recto": "Quelle est la nouveaute depuis janvier 2025 pour les petites entreprises ?", "verso": "Les entreprises de 11 a 49 salaries ayant realise un benefice net >= 1% du CA pendant 3 ans consecutifs doivent mettre en place un dispositif de partage de la valeur (interessement, participation, abondement PEE ou prime de partage)."},
  {"recto": "Donnez des exemples d'avantages en nature individuels et collectifs.", "verso": "Individuels : voiture de fonction, logement de fonction, telephone, frais de representation. Collectifs : cheques dejeuner, remises sur produits, aides familiales, bourses d'etudes pour les enfants."},
  {"recto": "Que sont les peripheriques statutaires et donnez des exemples par horizon.", "verso": "Ce sont les avantages sociaux acquis. Court terme : mutuelle, assurance auto. Moyen terme : compte epargne-temps. Long terme : complement de retraite, assurance-vie, pension d'invalidite."},
  {"recto": "Quelle part de la valeur ajoutee des entreprises la remuneration representait-elle en 2019 ?", "verso": "57,6% de la valeur ajoutee. C'est le premier poste de depenses des entreprises, ce qui montre l'importance economique considerable de la gestion de la remuneration."}
])
};

// ============================================================
// CHAPTER 112 - L'épargne salariale et rémunération collective
// ============================================================
data[112] = {
resume: `## Le mix-remuneration et la gestion de la masse salariale

> Savoir doser les differentes composantes de la remuneration est un art strategique. Il faut equilibrer fixe et variable, individuel et collectif, court et long terme.

---

### 1. Le mix-remuneration : equilibrer les composantes

Le **mix-remuneration** consiste a doser les differentes composantes de la remuneration en fonction des objectifs de l'entreprise. Voici comment adapter le mix selon l'objectif vise :

| Objectif | Levier de remuneration privilegie |
|----------|----------------------------------|
| **Attirer** du personnel qualifie | Remuneration directe elevee (salaire de base + primes) pour etre competitif sur le marche |
| **Fideliser** les salaries | Remuneration differee (actionnariat, stock-options), primes d'anciennete, avantages difficilement quittables (mutuelle, logement) |
| **Motiver** la performance | Elements variables individuels, criteres de performance que le salarie peut influencer |
| **Impliquer** dans le collectif | Composantes variables collectives (interessement, participation), actionnariat salarie |
| **Maintenir un bon climat social** | Eviter les iniquites internes, augmentations generales, eviter l'individualisme excessif |

> Exemple : une force de vente sera motivee par un variable individuel eleve (commissions). En revanche, une equipe de R&D sera plutot motivee par des projets stimulants et une remuneration collective (interessement lie aux brevets deposes).

---

### 2. La masse salariale

#### Definition
La **masse salariale** est la somme totale qu'une organisation consacre a la remuneration de ses salaries sur une periode donnee.

#### Calcul
Le calcul se fait en empilant les couches :

**Remunerations nettes** (ce que recoit le salarie)
+ **Charges sociales** (cotisations salariales : retraite, maladie, chomage)
= **Remunerations brutes** (ce qui figure sur la fiche de paie en haut)

**Remunerations brutes**
+ **Charges patronales** (25% a 42% du brut)
= **Masse salariale** (le cout total pour l'employeur)

> Exemple concret avec un salaire net de 1 550 euros :
> - Salaire net : 1 550 euros
> - + Charges sociales : ~450 euros
> - = Brut : 2 000 euros
> - + Charges patronales (25-42%) : 500 a 840 euros
> - = Masse salariale : 2 500 a 2 840 euros
>
> Conclusion : un salarie qui recoit 1 550 euros net coute entre 2 500 et 2 840 euros a son employeur.

---

### 3. Les facteurs d'evolution de la masse salariale

**L'evolution de l'emploi** :
- Les **mouvements** d'entree et de sortie (embauches, departs)
- Les **promotions internes** (qui entrainent des augmentations)
- L'utilisation de **formes d'emploi flexibles** : heures supplementaires, CDD, interim, travail intermittent

**L'evolution des remunerations** :
- Les **augmentations generales** : tout le monde recoit le meme pourcentage
- Les **augmentations categorielles** : une categorie de salaries est augmentee (ex : les ingenieurs)
- Les **augmentations individuelles** : augmentation au merite, au cas par cas

---

### 4. Les tendances d'evolution des politiques de remuneration

Selon Peretti, trois grandes tendances influencent les politiques de remuneration :

1. **Competitivite par les couts** => augmentation de la **part variable** (pour adapter les couts a la performance)
2. **Competitivite par la qualite** => **individualisation croissante** des remunerations (recompenser les meilleurs)
3. **Imperatifs du marche financier** => augmentation de la **part differee** (stock-options, actionnariat salarie, pour aligner les interets des salaries et des actionnaires)

---

### 5. Les 4 qualites d'une bonne politique de remuneration

Une politique de remuneration reussie est :
- **Equitable** : pas de sentiment d'injustice entre les salaries
- **Motivante** : elle pousse a la performance et a l'engagement
- **Competitive** : elle attire et retient les talents face a la concurrence
- **Souple** : elle peut s'adapter aux evolutions du contexte economique et strategique`,

memo: JSON.stringify([
  {"recto": "Qu'est-ce que le mix-remuneration ?", "verso": "C'est l'art de doser les differentes composantes de la remuneration (fixe, variable, individuel, collectif, court/long terme) en fonction des objectifs de l'entreprise : attirer, fideliser, motiver, impliquer ou maintenir le climat social."},
  {"recto": "Quel levier de remuneration privilegier pour fideliser les salaries ?", "verso": "La remuneration differee (actionnariat, stock-options), les primes d'anciennete et les avantages difficiles a quitter (mutuelle avantageuse, logement de fonction). L'idee est de creer un 'cout de sortie' pour le salarie."},
  {"recto": "Comment calcule-t-on la masse salariale ?", "verso": "Salaire net + charges sociales (salariales) = remuneration brute. Remuneration brute + charges patronales (25-42% du brut) = masse salariale. C'est le cout total pour l'employeur."},
  {"recto": "Combien coute reellement un salarie qui gagne 2 000 euros brut ?", "verso": "Entre 2 500 et 2 840 euros (masse salariale), car il faut ajouter les charges patronales qui representent 25% a 42% du salaire brut."},
  {"recto": "Quels sont les 3 types d'augmentations de remuneration ?", "verso": "1) Augmentation generale (meme pourcentage pour tous). 2) Augmentation categorielle (une categorie de salaries). 3) Augmentation individuelle (au merite, cas par cas)."},
  {"recto": "Quelles sont les 3 tendances d'evolution des politiques de remuneration selon Peretti ?", "verso": "1) Competitivite par les couts => plus de part variable. 2) Competitivite par la qualite => individualisation croissante. 3) Imperatifs du marche financier => plus de remuneration differee (stock-options, actionnariat)."},
  {"recto": "Quelles sont les 4 qualites d'une bonne politique de remuneration ?", "verso": "1) Equitable (pas d'injustice). 2) Motivante (pousse a la performance). 3) Competitive (attire et retient les talents). 4) Souple (s'adapte aux evolutions)."},
  {"recto": "Quel levier de remuneration motive le plus la performance individuelle ?", "verso": "Les elements variables sur base individuelle, a condition que les criteres de performance soient clairs et que le salarie ait le sentiment de pouvoir les influencer directement."},
  {"recto": "Comment favoriser l'implication collective via la remuneration ?", "verso": "En utilisant des composantes variables collectives (interessement, participation) ou l'actionnariat salarie, qui renforcent l'identification a l'entreprise et le sentiment d'appartenance."},
  {"recto": "Quels facteurs font evoluer la masse salariale du cote de l'emploi ?", "verso": "Les mouvements d'entree et de sortie (embauches, departs), les promotions internes et l'utilisation de formes d'emploi flexibles (heures sup, CDD, interim)."},
  {"recto": "Pourquoi les augmentations generales sont-elles importantes pour le climat social ?", "verso": "Elles evitent les iniquites internes et le sentiment d'injustice. Contrairement aux augmentations individuelles, elles ne poussent pas a l'individualisme et a l'opportunisme, ce qui preserve la cohesion d'equipe."},
  {"recto": "Quelle est la difference entre remuneration nette, brute et masse salariale ?", "verso": "Net = ce que recoit le salarie. Brut = net + charges sociales salariales (ce qui figure sur la fiche de paie). Masse salariale = brut + charges patronales (le cout reel pour l'employeur)."}
])
};

// ============================================================
// CHAPTER 113 - L'évaluation de la performance
// ============================================================
data[113] = {
resume: `## L'evaluation de la performance

> L'evaluation est au coeur de la GRH : c'est elle qui alimente les decisions de remuneration, de formation, de promotion et de mobilite. Mais c'est aussi un exercice delicat, source de tensions.

---

### 1. L'evaluation : une pratique ancienne mais renforcee

L'**evaluation individuelle** est une pratique ancienne dont les fondements sont stables, mais dont l'importance s'est accrue sous l'effet :
- Des **evolutions economiques** : besoin de flexibilite et de performance face a la concurrence
- Des **evolutions sociales** : montee du liberalisme et de l'individualisme (on attend de chacun qu'il rende des comptes sur ses resultats)

---

### 2. Les objectifs de l'evaluation selon les acteurs

L'evaluation ne sert pas les memes objectifs pour tout le monde :

**Pour la Direction** :
- **Accroitre et controler la performance**
- Maintenir un **management de proximite** (faire le lien entre strategie et operations)
- Clarifier les objectifs => favoriser l'**adhesion** et la **responsabilisation**
- Developper les competences et les capacites d'evolution
- **Objectiver** le systeme pour justifier les decisions (remuneration, formation, carriere)

**Pour la DRH** :
- Obtenir des **retours du terrain** pour ameliorer les processus RH
- Faire le point sur les **competences collectives** et l'evolution des metiers
- **Soutenir le management** : fournir les outils et accompagner les managers
- **Conseiller les salaries** en orientation professionnelle
- Maintenir un systeme de **reconnaissance equitable**

**Pour les managers** :
- **Echanger** avec les salaries sur le bilan de l'annee
- **Recueillir des informations** sur le terrain (problemes, suggestions)
- Apprecier les **resultats de l'annee N** et fixer les **objectifs N+1**
- **Motiver** en donnant de la reconnaissance et en aidant a orienter la carriere

**Pour le salarie** :
- **S'exprimer** sur sa situation, ses souhaits de management, ses aspirations
- Etre **informe** sur la perception de son travail et sur les opportunites d'evolution

> Point cle : l'evaluation est un moment rare d'echange formalise entre le manager et le salarie. C'est l'occasion de prendre du recul, loin du quotidien operationnel.

---

### 3. La conception du systeme d'evaluation

Concevoir un systeme d'evaluation necessite de prendre en compte le contexte :
- La **culture** (nationale et organisationnelle)
- La **taille** et la **structure** de l'organisation
- Les **choix strategiques**
- Le **systeme de GRH existant**

---

### 4. Les 3 objets de l'evaluation

L'evaluation d'un salarie peut porter sur :

**La performance** : les resultats obtenus
- Mesurable a partir des **objectifs fixes** (individuels ou collectifs)
- Des **projets et actions realises**
- D'une **comparaison entre salaries** (ranking)

> Exemple : un commercial est evalue sur son chiffre d'affaires (performance), mais aussi sur la facon dont il entretient la relation client (competence).

**Les competences** : les moyens mis en oeuvre
- **Savoirs** et **savoir-faire** mobilises dans le travail
- **Savoir-etre** (comportement professionnel)
- Question centrale : **comment** le salarie est-il parvenu aux resultats ?

**Le potentiel** : ce que le salarie est capable de devenir ou de faire dans le futur
- Tres **difficile a apprecier** car il s'agit de predire l'avenir
- Souvent reserve aux cadres a haut potentiel`,

memo: JSON.stringify([
  {"recto": "Quels sont les objectifs de l'evaluation pour la Direction ?", "verso": "Accroitre et controler la performance, maintenir un management de proximite, clarifier les objectifs pour favoriser l'adhesion, developper les competences et objectiver le systeme pour justifier les decisions RH."},
  {"recto": "Quels sont les objectifs de l'evaluation pour la DRH ?", "verso": "Obtenir des retours du terrain, faire le point sur les competences collectives et l'evolution des metiers, soutenir le management operationnel, conseiller les salaries et maintenir un systeme de reconnaissance equitable."},
  {"recto": "Quels sont les objectifs de l'evaluation pour le manager ?", "verso": "Echanger avec les salaries sur le bilan de l'annee, recueillir des infos du terrain, apprecier les resultats N et fixer les objectifs N+1, motiver par la reconnaissance et l'aide a l'orientation de carriere."},
  {"recto": "Quels sont les 3 objets sur lesquels peut porter l'evaluation d'un salarie ?", "verso": "1) La performance (resultats obtenus par rapport aux objectifs). 2) Les competences (savoirs, savoir-faire et savoir-etre mobilises). 3) Le potentiel (ce que le salarie est capable de devenir dans le futur)."},
  {"recto": "Quelle est la difference entre evaluer la performance et evaluer les competences ?", "verso": "La performance porte sur les RESULTATS (le 'quoi' : a-t-il atteint ses objectifs ?). Les competences portent sur les MOYENS mis en oeuvre (le 'comment' : quels savoirs, savoir-faire et savoir-etre a-t-il mobilises pour y parvenir ?)."},
  {"recto": "Pourquoi le potentiel est-il difficile a evaluer ?", "verso": "Parce qu'il s'agit de predire ce que le salarie est capable de devenir ou de faire dans le futur. C'est de la prospective, et c'est donc forcement subjectif et incertain."},
  {"recto": "Comment mesure-t-on la performance d'un salarie ?", "verso": "A partir des objectifs fixes (individuels ou collectifs), des projets et actions realises et/ou d'une comparaison entre salaries (ranking/classement)."},
  {"recto": "Quels elements contextuels faut-il prendre en compte pour concevoir un systeme d'evaluation ?", "verso": "La culture (nationale et organisationnelle), la taille et structure de l'organisation, les choix strategiques et le systeme de GRH deja existant."},
  {"recto": "Quelles evolutions ont renforce l'importance de l'evaluation individuelle ?", "verso": "Les evolutions economiques (besoin de flexibilite et de performance face a la concurrence) et les evolutions sociales (montee du liberalisme et de l'individualisme, demande de rendre des comptes sur ses resultats)."},
  {"recto": "En quoi l'evaluation est-elle 'au coeur de la GRH' ?", "verso": "Parce qu'elle alimente et declenche les decisions dans presque tous les autres processus RH : remuneration (primes, augmentations), formation (besoins identifies), gestion de carriere (promotions, mobilite) et recrutement."},
  {"recto": "Que permet l'evaluation au salarie ?", "verso": "De s'exprimer sur sa situation professionnelle, sur la maniere dont il souhaiterait etre manage, sur ses aspirations professionnelles. Et d'etre informe sur la perception de son travail et les opportunites d'evolution."},
  {"recto": "Qu'est-ce que le savoir-etre en evaluation des competences ?", "verso": "C'est le comportement professionnel du salarie : sa capacite a travailler en equipe, sa communication, son leadership, sa gestion du stress, son attitude face aux difficultes, etc."}
])
};

// ============================================================
// CHAPTER 114 - L'évaluation des compétences
// ============================================================
data[114] = {
resume: `## Les outils de l'evaluation et leurs difficultes

> Disposer de bons outils d'evaluation est necessaire, mais pas suffisant. La qualite de l'evaluation depend surtout de la facon dont les evaluateurs les utilisent et des suites qui y sont donnees.

---

### 1. L'entretien annuel d'evaluation

C'est l'outil d'evaluation le plus repandu :
- Concerne **60% de l'ensemble des salaries** et **86% des salaries** dans les entreprises de 500+ salaries
- **Non obligatoire** legalement (sauf si prevu par convention collective ou accord d'entreprise)
- Se deroule entre le salarie et son **N+1** : chacun prepare une auto-evaluation et une evaluation
- Le **N+2** supervise le processus pour garantir la coherence

**Contenu de l'entretien annuel** :
1. **Bilan de l'annee ecoulee** : evaluation de la performance (objectifs atteints ?)
2. **Evaluation des competences** : points forts et axes d'amelioration (savoirs, savoir-faire, savoir-etre)
3. **Discussion des attentes** : celles du salarie et celles de l'organisation
4. **Besoins en formation** : dans le cadre des missions actuelles et de l'evolution professionnelle
5. **Fixation des objectifs N+1** et plan d'action

> Attention a ne pas confondre l'entretien annuel d'evaluation (focus sur la performance et les competences) avec l'entretien professionnel (focus sur la carriere et l'evolution professionnelle, obligatoire tous les 2 ans).

---

### 2. Les objectifs SMART

A l'issue de l'evaluation, le manager fixe des objectifs pour l'annee suivante. Ces objectifs doivent etre **SMART** :
- **S**pecifique : clairement defini, pas vague
- **M**esurable : on peut verifier s'il est atteint
- **A**tteignable : realiste compte tenu des moyens
- **R**ealiste (ou Relevant) : pertinent par rapport au poste
- **T**emporel : avec une echeance claire

> Exemple : "Augmenter le chiffre d'affaires de la zone Sud de 10% d'ici decembre 2025" est un objectif SMART. "Faire mieux que l'annee derniere" ne l'est pas.

---

### 3. L'evaluation a 360 degres

L'**evaluation a 360 degres** depasse la simple appreciation hierarchique :
- Le salarie est evalue non seulement par son **N+1**, mais aussi par ses **collegues**, ses **subordonnes**, ses **clients internes ou externes**, et par lui-meme (auto-evaluation)
- Objectif : mettre en avant la **dimension relationnelle** du poste
- Surtout utilise pour les **cadres superieurs**
- Particulierement adapte aux organisations en **reseau** ou par **projets**, ou les liens hierarchiques sont moins clairs

---

### 4. Les difficultes de l'evaluation

L'evaluation fait l'objet de nombreuses critiques :

**Du cote des directions** :
- **Absence d'effets positifs** : les resultats sont sous-exploites
- Effets parfois **contre-productifs** : demotivation des moins bien evalues, strategies individualistes

**Du cote des managers** :
- L'outil **complexifie** leurs pratiques quotidiennes
- Ils sont mis en **porte-a-faux** : on leur demande d'etre a la fois **juge** (evaluer objectivement) et **coach** (accompagner et motiver)

**Du cote des evalues** :
- **Ecart entre le discours et le vecu** : on promet transparence et objectivite, mais en pratique les entretiens ressemblent parfois a du "langue de bois"
- Manque d'equite
- Soupcon d'objectifs caches : reduire la masse salariale, justifier des licenciements

---

### 5. Les risques de decredibilisation de l'evaluation

Le processus d'evaluation perd sa credibilite si :
- Les **formations decidees** lors de l'entretien ne sont pas mises en oeuvre
- L'evaluateur ne **differencie pas** ses appreciations (il met tout le monde au meme niveau pour eviter les conflits)
- Les **efforts des salaries** ne sont pas recompenses (controle de la masse salariale)
- Les salaries developpent les competences les plus **faciles** plutot que celles dont l'entreprise a besoin
- Les salaries formes ne **transmettent pas** leurs nouvelles competences

> Point cle pour l'examen : l'evaluation est un processus delicat qui questionne le choix des criteres, la coherence avec les autres composantes de la GRH, et le professionnalisme des evaluateurs.`,

memo: JSON.stringify([
  {"recto": "Quel pourcentage de salaries est concerne par l'entretien annuel d'evaluation ?", "verso": "60% de l'ensemble des salaries, et 86% des salaries dans les entreprises de plus de 500 salaries. L'entretien annuel n'est pas obligatoire legalement, sauf si prevu par convention collective."},
  {"recto": "Quels sont les 5 points abordes lors de l'entretien annuel d'evaluation ?", "verso": "1) Bilan de la performance (objectifs atteints ?). 2) Evaluation des competences (forces/faiblesses). 3) Discussion des attentes mutuelles. 4) Besoins en formation. 5) Fixation des objectifs N+1 et plan d'action."},
  {"recto": "Que signifie l'acronyme SMART pour les objectifs ?", "verso": "S = Specifique, M = Mesurable, A = Atteignable, R = Realiste (ou Relevant), T = Temporel (avec une echeance). Exemple : 'Augmenter le CA de 10% d'ici decembre' est SMART."},
  {"recto": "Qu'est-ce que l'evaluation a 360 degres et pour qui est-elle surtout utilisee ?", "verso": "C'est une evaluation ou le salarie est evalue par son N+1, ses collegues, ses subordonnes, ses clients et par lui-meme. Elle est surtout utilisee pour les cadres superieurs et dans les organisations en reseau ou par projets."},
  {"recto": "Quelle est la difference entre l'entretien annuel d'evaluation et l'entretien professionnel ?", "verso": "L'entretien annuel porte sur la performance et les competences (non obligatoire). L'entretien professionnel porte sur la carriere et l'evolution professionnelle, et il est obligatoire tous les 2 ans pour tous les salaries."},
  {"recto": "Pourquoi les managers sont-ils mis en 'porte-a-faux' par l'evaluation ?", "verso": "Parce qu'on leur demande d'etre a la fois juge (evaluer objectivement, donner des notes) et coach (accompagner, motiver, developper les competences). Ces deux roles peuvent etre contradictoires."},
  {"recto": "Quelles critiques les salaries formulent-ils sur l'evaluation ?", "verso": "L'ecart entre le discours (transparence, objectivite) et le vecu (langue de bois, manque d'equite), et le soupcon d'objectifs caches comme la reduction de la masse salariale ou la justification de licenciements."},
  {"recto": "Quels facteurs decredibilisent le processus d'evaluation ?", "verso": "Les formations decidees non mises en oeuvre, l'evaluateur qui ne differencie pas ses notes, les efforts non recompenses, les salaries qui developpent des competences faciles plutot qu'utiles, et l'absence de transmission des competences acquises."},
  {"recto": "Quel est le role du N+2 dans le processus d'evaluation ?", "verso": "Le N+2 supervise le processus pour garantir la coherence et l'equite des evaluations realisees par les N+1. Il s'assure que les criteres sont appliques de facon homogene."},
  {"recto": "Pourquoi l'evaluation est-elle qualifiee de 'processus delicat et complexe' ?", "verso": "Parce qu'elle questionne le choix des criteres (quoi evaluer ?), la coherence avec les autres composantes de la GRH (remuneration, formation, carriere) et le professionnalisme des evaluateurs (preparation, realisation, suivi des engagements)."},
  {"recto": "Quels processus RH sont declenches par l'evaluation ?", "verso": "Le recrutement (besoin de nouvelles competences), la remuneration (primes, augmentations), la formation (besoins identifies) et la gestion de carriere (promotions, mobilite). L'evaluation est donc au coeur de la GRH."},
  {"recto": "Pourquoi l'evaluation peut-elle etre contre-productive selon les directions ?", "verso": "Les resultats sont parfois sous-exploites (on evalue mais on ne fait rien des resultats), et l'evaluation peut demotiver les moins bien evalues ou pousser a des strategies individualistes (chacun optimise sa note au detriment du collectif)."}
])
};

// ============================================================
// CHAPTER 120 - Définition et enjeux de la gestion de carrières
// ============================================================
data[120] = {
resume: `## Definition et enjeux de la gestion de carrieres

> La gestion des carrieres est le point de rencontre entre les besoins de l'entreprise et les aspirations des individus. Elle a profondement evolue ces dernieres decennies.

---

### 1. Definition de la gestion des carrieres

La **gestion des carrieres** est une action organisee visant a definir la succession des affectations individuelles du personnel. C'est le point de rencontre entre :
- Les **interets de l'organisation** : avoir les bonnes personnes aux bons postes
- Les **interets de l'individu** : evoluer professionnellement, se realiser

---

### 2. Les objectifs de la gestion des carrieres

**Pour l'organisation** :
- **Gerer les emplois et les competences** : anticiper les besoins futurs
- **Developper un brassage culturel** : faire circuler les connaissances entre les services
- **Stimuler la motivation individuelle** : offrir des perspectives d'evolution
- **Favoriser la collaboration** entre les unites et diffuser les bonnes pratiques de gestion

**Pour les salaries** :
- **Ameliorer le rapport contributions/retributions** : etre mieux recompense pour ses efforts et ses competences

---

### 3. L'evolution des formes de carrieres

#### La carriere traditionnelle
C'est une relation d'emploi sur le **long terme**, integrant une **promotion verticale** (monter dans la hierarchie). La carriere se deroule le long de **filieres de progression** valorisant l'avancement, la position hierarchique et l'implication.

> Exemple : un salarie entre chez EDF comme technicien, devient chef d'equipe, puis chef de service, puis directeur regional. Toute sa carriere se fait dans la meme entreprise.

#### Les "nouvelles carrieres" (a partir des annees 90)
Les evolutions organisationnelles (reduction des niveaux hierarchiques, travail en equipe/projets) et les nouvelles formes de mobilite (horizontale, inter-entreprises) ont donne naissance a de nouvelles approches :

- **Carriere proteenne** (Hall) : le salarie prend en main sa propre carriere en fonction de ses valeurs et aspirations
- **Carriere sans frontieres** (Arthur) : la carriere depasse les frontieres d'une seule entreprise
- **Carriere nomade** (Cadin) : l'individu passe d'entreprise en entreprise au gre des opportunites

> Dans ce nouveau modele, c'est a l'individu de construire son parcours. L'entreprise l'aide en developpant son **employabilite** (sa capacite a retrouver un emploi).

---

### 4. Les deux filieres principales

- **La filiere manageriale** : progresser en prenant toujours plus de responsabilites et en encadrant plus de salaries
  - **Limite** : tout le monde ne possede pas les competences d'encadrement, et tout le monde n'aspire pas a plus de pouvoir

- **La filiere d'expertise** : developper ses competences pointues, prendre en charge des projets complexes, devenir referent ou formateur
  - Elle offre une alternative a la promotion hierarchique pour les experts qui ne souhaitent pas devenir managers

> Exemple : un excellent developpeur peut devenir "lead developer" (filiere expertise) sans forcement devenir manager d'equipe (filiere manageriale). Les deux filieres sont complementaires.`,

memo: JSON.stringify([
  {"recto": "Comment definir la gestion des carrieres ?", "verso": "C'est une action organisee visant a definir la succession des affectations individuelles du personnel. Elle est au point de rencontre entre les besoins de l'organisation et les aspirations des individus."},
  {"recto": "Quels sont les objectifs de la gestion des carrieres pour l'organisation ?", "verso": "Gerer les emplois et competences, developper un brassage culturel (circulation des connaissances), stimuler la motivation individuelle et favoriser la collaboration entre les differentes unites."},
  {"recto": "Qu'est-ce qui distingue la carriere traditionnelle des nouvelles carrieres ?", "verso": "La carriere traditionnelle se fait dans une seule entreprise sur le long terme avec une progression verticale (hierarchique). Les nouvelles carrieres sont plus mobiles, horizontales, inter-entreprises, et l'individu gere lui-meme son parcours."},
  {"recto": "Qu'est-ce que la carriere proteenne selon Hall ?", "verso": "C'est une carriere ou l'individu prend en main sa propre evolution professionnelle en fonction de ses valeurs et aspirations personnelles, plutot que de suivre un parcours impose par l'entreprise."},
  {"recto": "Qu'est-ce que la carriere sans frontieres selon Arthur ?", "verso": "C'est une carriere qui depasse les frontieres d'une seule entreprise : l'individu evolue en passant d'une organisation a une autre, en accumulant des experiences variees."},
  {"recto": "Qu'est-ce que la carriere nomade selon Cadin ?", "verso": "C'est une vision de la carriere ou l'individu navigue d'entreprise en entreprise au gre des opportunites, construisant un parcours non lineaire et imprevisible."},
  {"recto": "Qu'est-ce que l'employabilite et pourquoi est-elle importante dans les nouvelles carrieres ?", "verso": "L'employabilite est la capacite d'un individu a trouver ou retrouver un emploi. Dans les nouvelles carrieres, ou l'individu doit construire son propre parcours, l'entreprise l'aide en developpant son employabilite (formations, experiences variees)."},
  {"recto": "Quelles sont les deux filieres principales de carriere ?", "verso": "1) La filiere manageriale : prendre plus de responsabilites et encadrer plus de personnes. 2) La filiere d'expertise : developper ses competences pointues, devenir referent ou formateur sans forcement encadrer."},
  {"recto": "Quelle est la principale limite de la filiere manageriale ?", "verso": "Tout le monde ne possede pas les competences d'encadrement necessaires, et tout le monde n'aspire pas a detenir toujours plus de pouvoir. La filiere d'expertise offre une alternative valorisante."},
  {"recto": "Quels facteurs ont provoque l'evolution vers les 'nouvelles carrieres' a partir des annees 90 ?", "verso": "La reduction des niveaux hierarchiques, le travail en equipe et en mode projet, et le developpement de nouvelles formes de mobilite (horizontale, inter-entreprises) ont rendu la carriere traditionnelle moins viable."},
  {"recto": "Pourquoi parle-t-on de 'co-gestion de parcours' dans les nouvelles carrieres ?", "verso": "Parce que la carriere n'est plus geree uniquement par l'entreprise (comme dans la carriere traditionnelle) mais conjointement par l'individu (qui definit ses aspirations) et l'organisation (qui offre des opportunites et developpe l'employabilite)."}
])
};

// ============================================================
// CHAPTER 121 - Politique de mobilité et parcours professionnels
// ============================================================
data[121] = {
resume: `## Politique de mobilite et parcours professionnels

> La mobilite n'est pas un objectif en soi : c'est un outil au service de la strategie de l'entreprise et du developpement des salaries. Encore faut-il savoir quel type de mobilite est souhaite et possible.

---

### 1. Les differents types de mobilite

Il existe 3 grands types de mobilite :

- **Mobilite verticale** : changement de niveau hierarchique (promotion). Ex : passer de chef d'equipe a directeur de service.
- **Mobilite horizontale** : changement de fonction ou de metier, sans changement hierarchique. Ex : passer du marketing a la communication, au meme niveau.
- **Mobilite geographique** : changement de lieu d'exercice, au niveau local, national ou international. Ex : mutation de Paris a Lyon, ou expatriation a Shanghai.

> Ces trois types peuvent se combiner : on peut etre promu (vertical) dans un autre service (horizontal) a l'etranger (geographique).

---

### 2. Les questions cles d'une politique de mobilite

L'elaboration d'une politique de gestion des carrieres repond a **3 questions majeures** :

#### Question 1 : Quelle mobilite souhaite l'organisation ?
- Quels **salaries** sont concernes par la mobilite ?
- Quelles sont les **filieres normales** de developpement ?
- Quel **rythme** de mobilite est souhaite ?
- Developpe-t-on la mobilite **en interne** ou fait-on appel a des **competences externes** ?

#### Question 2 : Quelle mobilite est possible selon le contexte ?

**Contexte interne** :
- La **taille** de l'entreprise (plus elle est grande, plus la mobilite est possible)
- La **structure organisationnelle** (types de mobilite possibles, niveaux de decision)
- La **culture** de l'organisation (certaines cultures valorisent la stabilite, d'autres la mobilite)
- Les **orientations strategiques**
- La **politique RH** existante

**Contexte externe** :
- L'**environnement economique** et la concurrence
- Le **systeme educatif** (importance du diplome en France par rapport a d'autres pays)
- Les **normes sociales** (certains metiers sont encore perçus comme "masculins" ou "feminins")
- Le role des **pouvoirs publics** et des partenaires sociaux (legislation, dispositifs de formation, conventions collectives)

#### Question 3 : Qui est en charge de la gestion des carrieres ?

C'est un processus **partage** entre plusieurs acteurs :

| Acteur | Role |
|--------|------|
| **La Direction Generale** | Valide les grandes orientations, gere certains cadres dirigeants |
| **La Direction RH** | Propose les outils, participe a la definition de la politique, gere certains salaries |
| **Les specialistes RH** | Animent la politique de mobilite au quotidien |
| **Les managers** | Evaluent et orientent leurs collaborateurs |
| **Le salarie** | Met en oeuvre ses competences, negocie son projet professionnel, recherche l'information |

> Point cle : la gestion des carrieres est un processus partage. Le salarie n'est plus passif (comme dans la carriere traditionnelle) : il est acteur de sa propre carriere.`,

memo: JSON.stringify([
  {"recto": "Quels sont les 3 types de mobilite professionnelle ?", "verso": "1) Mobilite verticale (changement de niveau hierarchique, promotion). 2) Mobilite horizontale (changement de fonction/metier, sans changement hierarchique). 3) Mobilite geographique (changement de lieu : local, national, international)."},
  {"recto": "Quelles sont les 3 questions cles de l'elaboration d'une politique de mobilite ?", "verso": "1) Quelle mobilite souhaite l'organisation ? 2) Quelle mobilite est possible selon le contexte (interne et externe) ? 3) Qui est en charge de la gestion des carrieres ?"},
  {"recto": "Quels elements du contexte interne influencent la mobilite possible ?", "verso": "La taille de l'entreprise, la structure organisationnelle, la culture de l'organisation, les orientations strategiques et la politique RH existante."},
  {"recto": "Quels elements du contexte externe influencent la mobilite ?", "verso": "L'environnement economique et la concurrence, le systeme educatif (importance du diplome), les normes sociales (metiers genrés), le role des pouvoirs publics et des partenaires sociaux."},
  {"recto": "Quels acteurs partagent la gestion des carrieres ?", "verso": "La Direction Generale (orientations), la Direction RH (outils et politique), les specialistes RH (animation), les managers (evaluation et orientation) et le salarie lui-meme (acteur de sa carriere)."},
  {"recto": "Quel est le role du salarie dans la gestion moderne des carrieres ?", "verso": "Le salarie n'est plus passif : il met en oeuvre ses competences, negocie son projet professionnel et recherche activement l'information sur les opportunites d'evolution."},
  {"recto": "Donnez un exemple combinant les 3 types de mobilite.", "verso": "Un chef d'equipe a Paris est promu directeur de service (vertical), dans le departement logistique au lieu du marketing (horizontal), a la filiale de Lyon (geographique)."},
  {"recto": "Pourquoi la taille de l'entreprise influence-t-elle la mobilite ?", "verso": "Plus l'entreprise est grande, plus il y a de postes, de services et de sites differents, ce qui offre davantage de possibilites de mobilite verticale, horizontale et geographique."},
  {"recto": "Comment le systeme educatif francais influence-t-il la gestion des carrieres ?", "verso": "En France, le diplome a une importance considerable dans la carriere. Il peut determiner les filieres accessibles et les niveaux de responsabilite atteignables, plus que dans d'autres pays ou l'experience prime."},
  {"recto": "Quel est le role specifique des managers dans la gestion des carrieres ?", "verso": "Les managers evaluent les competences et le potentiel de leurs collaborateurs et les orientent vers des opportunites d'evolution adaptees a leur profil et aux besoins de l'organisation."},
  {"recto": "Qu'est-ce qu'une norme sociale dans le contexte de la mobilite professionnelle ?", "verso": "C'est une convention implicite de la societe qui influence les carrieres. Par exemple, certains metiers sont encore perçus comme masculins (ingenieur) ou feminins (infirmier), ce qui freine la mobilite vers ces metiers pour le genre sous-represente."}
])
};

// ============================================================
// CHAPTER 122 - Outils de gestion et hauts potentiels
// ============================================================
data[122] = {
resume: `## Outils de gestion des carrieres et hauts potentiels

> La gestion des carrieres ne s'improvise pas : elle s'appuie sur des outils precis et accorde une attention particuliere aux salaries a haut potentiel.

---

### 1. Les outils de la gestion des carrieres

Les outils sont organises selon 3 grandes finalites :

#### a) Repondre aux besoins de l'entreprise
**Priorite** : identifier les competences a developper et encourager certains parcours

**Outils** :
- **Organigrammes de remplacement** : anticiper qui peut remplacer qui en cas de depart
- **Cartes des emplois** et **repertoires de metiers** : cartographier tous les postes et metiers de l'entreprise
- **Referentiels de competences** : lister les competences requises pour chaque poste
- **Parcours reperes** : definir des trajectoires types d'evolution

> Exemple : un referentiel de competences permet de comparer les competences d'un salarie avec celles requises pour un poste cible, et d'identifier les ecarts a combler par la formation.

#### b) Articuler projets individuels et projets d'entreprise
**Priorite** : co-definir des parcours

**Outils** :
- **Revue de personnel** (people review) : reunion ou les managers et les RH passent en revue les salaries pour identifier les potentiels et les besoins
- **Entretien professionnel** : obligatoire pour tous les salaries depuis 2014, tous les 2 ans. Il porte sur l'evolution professionnelle (qualification, emploi), le suivi des formations et la reflexion sur l'avenir professionnel. En general mene par un responsable RH (et non le manager).
- **Formation** : developper les competences pour preparer les evolutions

#### c) Preciser les projets individuels
**Priorite** : permettre aux salaries de mieux se connaitre et faciliter leurs projets

**Outils** :
- **Formation a la gestion des carrieres** : apprendre aux salaries a gerer leur propre parcours
- **Bilan de competences** : evaluation complete des competences, aptitudes et motivations d'un salarie
- **Conseillers mobilite** : professionnels qui accompagnent les salaries dans leur reflexion de carriere

---

### 2. L'entretien professionnel (focus)

A ne pas confondre avec l'entretien annuel d'evaluation :

| | Entretien annuel | Entretien professionnel |
|-|-----------------|------------------------|
| **Obligatoire ?** | Non (sauf convention) | Oui, depuis 2014 |
| **Frequence** | Annuelle | Tous les 2 ans |
| **Objet** | Performance, competences, objectifs | Evolution professionnelle, formation, carriere |
| **Mene par** | Le manager (N+1) | Un responsable RH |

---

### 3. La gestion des hauts potentiels

#### Qui sont les "hauts potentiels" ?
Ce sont :
- Les cadres ayant atteint un **certain niveau de responsabilites**
- Les cadres **susceptibles** d'atteindre ce niveau

#### La matrice de Ference (1977)

C'est un outil qui classe les salaries selon 2 axes : **performance** et **potentiel** :

|  | Potentiel faible | Potentiel eleve |
|--|-----------------|-----------------|
| **Performance elevee** | **Piliers** : tres performants mais peu de potentiel d'evolution. Ils sont essentiels dans leur poste actuel. | **Etoiles** : performants ET a fort potentiel. Ce sont les futurs leaders de l'entreprise. |
| **Performance faible** | **Branches mortes** : ni performants, ni a potentiel. Situation preoccupante. | **Espoirs** : pas encore performants mais a fort potentiel. Ils ont besoin de temps et d'accompagnement. |

#### Les pratiques de gestion des hauts potentiels

Les hauts potentiels beneficient de pratiques specifiques visant a :
- **Proposer des promotions rapides** pour les tester et les faire evoluer
- **Fideliser** ces talents strategiques (pour eviter qu'ils partent a la concurrence)
- **Tester leur niveau de performance** dans differents contextes
- **Tester leur implication** dans l'entreprise

> Certaines entreprises evaluent les hauts potentiels sur 3 criteres : le **leadership**, la **capacite d'innovation** et l'**esprit entrepreneurial**, avec un suivi sur plusieurs annees.

---

### 4. Conclusion : les cles d'une bonne politique de gestion des carrieres

- L'evolution de carriere releve de la **co-responsabilite** entre l'individu et l'organisation
- La qualite depend autant du choix des **bons outils** que de la **circulation de l'information** dans l'organisation
- Sans transparence sur les opportunites disponibles, meme les meilleurs outils seront inefficaces`,

memo: JSON.stringify([
  {"recto": "Quels sont les 3 grands types d'outils de gestion des carrieres selon leur finalite ?", "verso": "1) Repondre aux besoins de l'entreprise (organigrammes de remplacement, referentiels de competences). 2) Articuler projets individuels et entreprise (revue de personnel, entretien professionnel). 3) Preciser les projets individuels (bilan de competences, conseillers mobilite)."},
  {"recto": "Qu'est-ce qu'un organigramme de remplacement ?", "verso": "C'est un outil qui anticipe qui peut remplacer qui en cas de depart. Pour chaque poste cle, on identifie un ou plusieurs successeurs potentiels et on planifie leur preparation."},
  {"recto": "Qu'est-ce qu'un referentiel de competences ?", "verso": "C'est un document qui liste toutes les competences requises pour chaque poste de l'entreprise. Il permet de comparer les competences d'un salarie avec celles requises pour un poste cible et d'identifier les ecarts a combler."},
  {"recto": "Qu'est-ce que la revue de personnel (people review) ?", "verso": "C'est une reunion ou les managers et les RH passent en revue les salaries pour identifier les potentiels, les besoins d'evolution, les risques de depart et les plans de succession."},
  {"recto": "Quelles sont les caracteristiques de l'entretien professionnel ?", "verso": "Obligatoire depuis 2014, tous les 2 ans, mene par un responsable RH. Il porte sur l'evolution professionnelle (qualification, emploi), le suivi des formations et la reflexion sur l'avenir professionnel du salarie."},
  {"recto": "Quels sont les 4 profils de la matrice de Ference (1977) ?", "verso": "1) Etoiles (performance elevee + potentiel eleve = futurs leaders). 2) Piliers (performance elevee + potentiel faible = essentiels dans leur poste). 3) Espoirs (performance faible + potentiel eleve = a accompagner). 4) Branches mortes (performance faible + potentiel faible = situation preoccupante)."},
  {"recto": "Qui sont les 'Etoiles' dans la matrice de Ference ?", "verso": "Ce sont les salaries qui combinent une performance elevee ET un potentiel eleve. Ils representent les futurs leaders de l'entreprise et sont les cibles prioritaires des programmes de hauts potentiels."},
  {"recto": "Qui sont les 'Piliers' dans la matrice de Ference ?", "verso": "Ce sont les salaries tres performants mais avec un potentiel d'evolution limite. Ils sont essentiels dans leur poste actuel et il faut les valoriser sans les pousser vers des fonctions qui ne leur correspondent pas."},
  {"recto": "Quels sont les 4 objectifs des pratiques de gestion des hauts potentiels ?", "verso": "1) Proposer des promotions rapides. 2) Fideliser ces talents strategiques. 3) Tester leur performance dans differents contextes. 4) Tester leur implication dans l'entreprise."},
  {"recto": "Sur quels 3 criteres certaines entreprises evaluent-elles les hauts potentiels ?", "verso": "Le leadership, la capacite d'innovation et l'esprit entrepreneurial, avec un suivi sur plusieurs annees pour voir l'evolution."},
  {"recto": "Qu'est-ce qu'un bilan de competences ?", "verso": "C'est une evaluation complete des competences, aptitudes et motivations d'un salarie. Il permet a l'individu de mieux se connaitre et de definir un projet professionnel realiste. Peut etre finance par le CPF."},
  {"recto": "Pourquoi la circulation de l'information est-elle cruciale pour la gestion des carrieres ?", "verso": "Parce que sans transparence sur les opportunites disponibles (postes ouverts, formations, mobilites possibles), meme les meilleurs outils de gestion des carrieres seront inefficaces. Le salarie ne peut pas etre acteur de sa carriere s'il n'a pas acces a l'information."},
  {"recto": "Qui sont les 'Espoirs' dans la matrice de Ference et comment les gerer ?", "verso": "Ce sont des salaries pas encore performants mais a fort potentiel. Ils ont besoin de temps, d'accompagnement, de formation et de mise en situation pour reveler leur potentiel. Il ne faut pas les juger trop vite."}
])
};

// ============================================================
// INSERT INTO DATABASE
// ============================================================

const updateStmt = db.prepare('UPDATE summaries SET content = ? WHERE chapter_id = ? AND type = ?');
const insertStmt = db.prepare('INSERT INTO summaries (chapter_id, type, content, created_at) VALUES (?, ?, ?, datetime(\"now\"))');
const checkStmt = db.prepare('SELECT id FROM summaries WHERE chapter_id = ? AND type = ?');

let updated = 0;
let inserted = 0;

for (const [chapterId, content] of Object.entries(data)) {
  const id = parseInt(chapterId);

  // Update or insert resume
  const existingResume = checkStmt.get(id, 'resume');
  if (existingResume) {
    updateStmt.run(content.resume, id, 'resume');
    updated++;
  } else {
    insertStmt.run(id, 'resume', content.resume);
    inserted++;
  }

  // Update or insert memo
  const existingMemo = checkStmt.get(id, 'memo');
  if (existingMemo) {
    updateStmt.run(content.memo, id, 'memo');
    updated++;
  } else {
    insertStmt.run(id, 'memo', content.memo);
    inserted++;
  }

  console.log(`Chapter ${id}: done`);
}

console.log(`\nDone! Updated: ${updated}, Inserted: ${inserted}`);
db.close();
