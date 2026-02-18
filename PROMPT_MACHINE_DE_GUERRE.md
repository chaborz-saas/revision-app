# 🔥 MACHINE DE GUERRE — Synthèses & Fiches de Révision

## MISSION CRITIQUE
Créer 1 synthèse HTML + 1 fiche de révision HTML **par chapitre** pour 4 matières. La qualité doit être **identique** aux exemples dans `templates/`. Pas de raccourci, pas de template générique appliqué bêtement — chaque chapitre est traité individuellement.

## CONTRAINTES
- **1 synthèse + 1 fiche PAR CHAPITRE** (pas par matière, pas par fichier)
- Le lien vers le(s) cours original(aux) en bas de chaque page (lien GitHub raw)
- Les templates validés sont dans `templates/EXEMPLE_synthese.html` et `templates/EXEMPLE_fiche.html` → **LIS-LES D'ABORD** et reproduis exactement ce niveau de qualité et ce style CSS
- Chaque agent doit **lire le contenu extrait** (pas résumer à l'aveugle) et produire une synthèse réfléchie

## ÉTAPE PRÉLIMINAIRE (avant de lancer les agents)

```bash
pip install pdfplumber "markitdown[pptx]" openpyxl --break-system-packages -q
```

Puis exécuter l'extraction pour chaque matière :
```bash
python3 scripts_synthese/extract_courses.py "cours/RH" "courses/extracted/RH"
python3 scripts_synthese/extract_courses.py "cours/ANALYSE QUANTI" "courses/extracted/ANALYSE_QUANTI"
python3 scripts_synthese/extract_courses.py "cours/DROIT" "courses/extracted/DROIT"
python3 scripts_synthese/extract_courses.py "cours/Pilotage de la performance" "courses/extracted/PILOTAGE"
```

Les fichiers .txt extraits seront dans `courses/extracted/[MATIERE]/`.

---

## MAPPING EXACT : CHAPITRES → FICHIERS → AGENTS

### 📗 RH — GRH pour Manager (5 agents)

| Agent | Chapitre | Fichier source | Output synthèse | Output fiche |
|-------|----------|---------------|-----------------|--------------|
| RH-1 | Introduction à la GRH | `cour_1.txt` | `public/syntheses/RH/ch1_introduction_grh.html` | `public/fiches/RH/ch1_introduction_grh.html` |
| RH-2 | Le Recrutement | `cour_2.txt` | `public/syntheses/RH/ch2_recrutement.html` | `public/fiches/RH/ch2_recrutement.html` |
| RH-3 | La Rémunération | `cour_3.txt` | `public/syntheses/RH/ch3_remuneration.html` | `public/fiches/RH/ch3_remuneration.html` |
| RH-4 | L'Évaluation des salariés | `cour_4.txt` | `public/syntheses/RH/ch4_evaluation.html` | `public/fiches/RH/ch4_evaluation.html` |
| RH-5 | La Gestion de carrières | `cour_5.txt` | `public/syntheses/RH/ch5_gestion_carrieres.html` | `public/fiches/RH/ch5_gestion_carrieres.html` |

### 📊 ANALYSE QUANTI — Analyse des Données Quantitatives (3 agents)

| Agent | Chapitre | Fichiers sources | Output synthèse | Output fiche |
|-------|----------|-----------------|-----------------|--------------|
| AQ-1 | Analyse descriptive univariée (stats de base) | `Cours_1.txt` + `Correction_Partiel_MQG_2022.txt` (pour les méthodes) | `public/syntheses/ANALYSE_QUANTI/ch1_analyse_descriptive.html` | `public/fiches/ANALYSE_QUANTI/ch1_analyse_descriptive.html` |
| AQ-2 | Relations entre deux variables (bivariée) | `Cours_2.txt` + `Correction_Examen_Track_Anglo__2526__traduit.txt` (exercices 1-2) | `public/syntheses/ANALYSE_QUANTI/ch2_analyse_bivariee.html` | `public/fiches/ANALYSE_QUANTI/ch2_analyse_bivariee.html` |
| AQ-3 | ANOVA et tests statistiques | `Cours_3.txt` + `Correction_Examen_Track_Anglo__2526__traduit.txt` (exercices 3+) | `public/syntheses/ANALYSE_QUANTI/ch3_anova.html` | `public/fiches/ANALYSE_QUANTI/ch3_anova.html` |

### ⚖️ DROIT — Ventes internationales & Contrats (7 agents)

C'est la matière la plus complexe. Les .ppt vides (ancien format) sont à ignorer. Voici le mapping :

| Agent | Chapitre | Fichiers sources | Output synthèse | Output fiche |
|-------|----------|-----------------|-----------------|--------------|
| DR-1 | Les contrats internationaux — Principes généraux | `Presentation_Contrat_international.txt` + `Sur_le_Hardship__1_.txt` + `Sur_la_Clause_darbitrage__1_.txt` | `public/syntheses/DROIT/ch1_contrats_internationaux.html` | `public/fiches/DROIT/ch1_contrats_internationaux.html` |
| DR-2 | La CVIM — Convention de Vienne | `Présentation__de_la_CVIM__1_.txt` + `Introduction_to_the_international_contract_of_sales_fr__1___1_.txt` + les 4 corrigés cas pratiques (`Corrigé_cas_pratique_*`) pour illustrer l'application | `public/syntheses/DROIT/ch2_cvim.html` | `public/fiches/DROIT/ch2_cvim.html` |
| DR-3 | Formation et force obligatoire du contrat | Les fichiers .ppt `Formation_du_contrat__1_.txt` et `Force_obligatoire_du_contrat__1_.txt` SONT VIDES → l'agent doit chercher sur internet les principes de base (formation du contrat en droit international, force obligatoire) ET s'appuyer sur le contenu des cas pratiques pour reconstituer le cours | `public/syntheses/DROIT/ch3_formation_force_obligatoire.html` | `public/fiches/DROIT/ch3_formation_force_obligatoire.html` |
| DR-4 | Droit du contrat de vente | `Droit_du_Contrat_de_vente__1_.txt` EST VIDE → même stratégie que DR-3, s'appuyer sur les cas pratiques CVIM + recherche internet pour les principes du contrat de vente international | `public/syntheses/DROIT/ch4_contrat_vente.html` | `public/fiches/DROIT/ch4_contrat_vente.html` |
| DR-5 | Incoterms et crédit documentaire | `Incoterms_and_Documentary_Credit_Legal_Aspects_fr.txt` (66k chars, très riche) | `public/syntheses/DROIT/ch5_incoterms.html` | `public/fiches/DROIT/ch5_incoterms.html` |
| DR-6 | Transport international maritime | `International_Transport_contracts_Focus_on_maritime_transport_fr__2_.txt` (52k chars) | `public/syntheses/DROIT/ch6_transport_maritime.html` | `public/fiches/DROIT/ch6_transport_maritime.html` |
| DR-7 | L'agent commercial | `Code_de_commerce_Agent_commercial.txt` + `Les_Echos_Agent_commercial__1_.txt` + `Cas_LH_Wind.txt` | `public/syntheses/DROIT/ch7_agent_commercial.html` | `public/fiches/DROIT/ch7_agent_commercial.html` |

**Note DROIT** : Les cas pratiques restants (Pizzerias siciliennes, West Side Connemara, Amazon CGV) sont des études de cas d'application. Ne PAS leur créer de synthèse propre — intégrer les points de droit pertinents dans les chapitres correspondants.

### 📈 PILOTAGE DE LA PERFORMANCE (8 agents)

| Agent | Chapitre | Fichiers sources | Output synthèse | Output fiche |
|-------|----------|-----------------|-----------------|--------------|
| PL-1 | Introduction au pilotage de la performance | `Cours_Pilotage_perf_M1_S1_25-26_-_Cours.txt` (le cours 1, sans numéro) | `public/syntheses/PILOTAGE/ch1_introduction.html` | `public/fiches/PILOTAGE/ch1_introduction.html` |
| PL-2 | La méthode des coûts et seuil de rentabilité | `Cours_Pilotage_perf_M1_S1_25-26_-_Cours_2.txt` + `Etude_de_cas_JIBI_*_Corrigé.txt` | `public/syntheses/PILOTAGE/ch2_couts_seuil_rentabilite.html` | `public/fiches/PILOTAGE/ch2_couts_seuil_rentabilite.html` |
| PL-3 | La méthode du coût cible (target costing) | `Cours_Pilotage_perf_M1_S1_25-26_-_Cours_4.txt` + `Etude_de_cas_STAGNET-*` + `Corrigé_exercice_couts_cibles.txt` + `Exercice_simplifié_COUT_CIBLE_*` | `public/syntheses/PILOTAGE/ch3_cout_cible.html` | `public/fiches/PILOTAGE/ch3_cout_cible.html` |
| PL-4 | L'analyse des écarts | `Cours_Pilotage_perf_M1_S1_25-26_-_Cours_5.txt` + `Cas_SEUROL__calcul_écarts__-_CORRECTION.txt` + `Cas_SEUROL__calcul_écarts__-_ENONCE.txt` | `public/syntheses/PILOTAGE/ch4_analyse_ecarts.html` | `public/fiches/PILOTAGE/ch4_analyse_ecarts.html` |
| PL-5 | Les tableaux de bord | `Cours_Pilotage_perf_M1_S1_25-26_-_Cours_6.txt` + `Exercice_Tableau_de_bord_*` + `Exercice_2_Tableau_de_bord_*` | `public/syntheses/PILOTAGE/ch5_tableaux_bord.html` | `public/fiches/PILOTAGE/ch5_tableaux_bord.html` |
| PL-6 | Le contrôle de gestion sociale & masse salariale | `Cours_Pilotage_perf_M1_S1_25-26_-_Cours_7.txt` + `Corrigé_EXERCICE_MASSE_SALARIALE.txt` + `Exercice_CdG_Sociale_*` + `bilan-social-2023.txt` | `public/syntheses/PILOTAGE/ch6_cdg_sociale.html` | `public/fiches/PILOTAGE/ch6_cdg_sociale.html` |
| PL-7 | Lean management et Mudas | `Mudas_1-_Enoncé.txt` + `Mudas_2-_Corrigé_type.txt` | `public/syntheses/PILOTAGE/ch7_lean_mudas.html` | `public/fiches/PILOTAGE/ch7_lean_mudas.html` |
| PL-8 | Analyse qualitative (méthodologie mémoire) | `Cours_Analyse_qualitative_.txt` | `public/syntheses/PILOTAGE/ch8_analyse_qualitative.html` | `public/fiches/PILOTAGE/ch8_analyse_qualitative.html` |

---

## TOTAL : 23 AGENTS EN PARALLÈLE

- RH : 5 agents
- Analyse Quanti : 3 agents  
- Droit : 7 agents
- Pilotage : 8 agents

Chaque agent produit 2 fichiers (synthèse + fiche) = **46 fichiers HTML au total**.

---

## INSTRUCTIONS POUR CHAQUE AGENT

### 1. Lire les templates d'abord
```
cat templates/EXEMPLE_synthese.html
cat templates/EXEMPLE_fiche.html
```
Ces fichiers sont la RÉFÉRENCE. Reproduire exactement le même CSS, la même structure, le même niveau de qualité et de détail.

### 2. Lire le(s) fichier(s) source(s)
```
cat courses/extracted/[MATIERE]/[fichier].txt
```

### 3. Réfléchir au contenu
Avant d'écrire :
- Identifier les concepts clés, définitions, formules
- Comprendre la structure logique du cours
- Identifier ce qui est du bruit vs du contenu utile
- Pour les cas/corrigés associés : extraire les méthodes et exemples pertinents

### 4. Écrire la synthèse HTML
**Règles :**
- Écrire en **PROSE FLUIDE** avec des paragraphes et des transitions, pas des listes de bullets
- Utiliser les classes CSS : `.definition`, `.formula`, `.important`, `.example`
- Utiliser des `<table>` pour les comparaisons et les tableaux récapitulatifs
- **Couvrir TOUT le contenu pertinent** — la complétude prime
- **NE RIEN INVENTER** — uniquement le contenu des fichiers sources (sauf DR-3 et DR-4 qui doivent chercher sur internet)
- Définir chaque terme technique à sa première apparition
- Le lien vers le(s) cours original(aux) en bas : `https://github.com/chaborz-saas/revision-app/blob/master/cours/[CHEMIN ENCODÉ URL]`

### 5. Écrire la fiche de révision HTML
**Règles :**
- Version **condensée** de la synthèse, 1-3 pages imprimées max
- **Surlignage stratégique** :
  - `<span class="hl-critical">` = 10-15% du texte (ce qui tombe à l'examen)
  - `<span class="hl-important">` = 20-25% (concepts à maîtriser)
  - `<span class="hl-formula">` = toutes les formules
- **Minimum 3-5 questions flash** (`.flash-q` avec `.answer`)
- Tableaux compacts (`.compact-table`), listes condensées (`.condensed-list`)
- Blocs thématiques (`.block-def`, `.block-formula`, `.block-attention`, `.block-astuce`)
- Liens en bas : vers la synthèse + vers le cours original

### 6. Sauvegarder
Chaque agent sauvegarde dans le bon chemin selon le tableau de mapping.

---

## AGENT FINAL : INDEX

Quand les 23 agents ont fini, un dernier agent crée `public/index.html` :
- Page d'accueil avec les 4 matières
- Pour chaque matière : liste des chapitres avec lien vers synthèse et fiche
- Design propre et cohérent avec le reste

---

## RAPPEL QUALITÉ

Regarde `templates/EXEMPLE_synthese.html` et `templates/EXEMPLE_fiche.html`. C'est ÇA le standard. Pas un cran en dessous. Chaque agent doit :
- Lire intégralement le contenu source
- Comprendre le sujet
- Restructurer intelligemment (pas copier-coller le texte brut dans du HTML)
- Produire un document qu'un étudiant peut utiliser pour RÉVISER efficacement

Pour les fichiers > 20k chars, l'agent peut utiliser l'API Sonnet pour pré-structurer le contenu, mais la rédaction finale et la mise en page doivent être faites par l'agent lui-même pour garder le niveau de qualité.

## LANCEMENT
```
/guerre
```

23 agents. Go.
