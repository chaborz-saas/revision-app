# Révisions M1 — Synthèses & Fiches

Plateforme de révision statique pour le M1 avec **23 synthèses** et **23 fiches de révision** couvrant 4 matières.

## Matières

| Matière | Chapitres |
|---------|-----------|
| RH — GRH pour Manager | 5 chapitres |
| Analyse Quantitative | 3 chapitres |
| Droit — Ventes internationales | 7 chapitres |
| Pilotage de la Performance | 8 chapitres |

## Lancer le site

```bash
# Avec Python (le plus simple)
python3 -m http.server 3000

# Ou avec npx
npx serve .
```

Puis ouvrir http://localhost:3000

## Structure

```
index.html              # Page d'accueil
syntheses/              # 23 synthèses complètes par chapitre
fiches/                 # 23 fiches de révision condensées
cours/                  # Fichiers sources (PDF, PPTX, DOCX)
templates/              # Templates HTML de référence
scripts_synthese/       # Script d'extraction Python
```

## Backup

L'ancien projet SaaS est sauvegardé sur la branche `backup-ancien-saas`.
