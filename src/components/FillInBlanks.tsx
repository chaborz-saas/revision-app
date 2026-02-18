'use client';

import { useState, useMemo } from 'react';
import { Eye, EyeOff, RotateCcw, CheckCircle2, Trophy } from 'lucide-react';
import Button from '@/components/ui/Button';

interface FillInBlanksProps {
  content: string;
  accentColor?: string;
}

interface BlankWord {
  original: string;
  index: number;
  revealed: boolean;
  userGuess: string;
  isCorrect: boolean | null;
}

/**
 * Identifie les mots-clés importants à cacher dans un texte de révision
 * Priorise : termes techniques, chiffres, noms propres, mots en gras
 */
function identifyKeyWords(text: string): Set<number> {
  const words = text.split(/(\s+)/);
  const keyIndices = new Set<number>();
  const totalRealWords = words.filter((w, i) => i % 2 === 0 && w.trim().length > 0).length;
  const targetBlanks = Math.min(Math.max(5, Math.floor(totalRealWords * 0.12)), 25);

  // Score chaque mot pour décider s'il est important
  const scoredWords: { index: number; score: number; word: string }[] = [];

  for (let i = 0; i < words.length; i += 2) {
    const word = words[i];
    if (!word || word.trim().length <= 2) continue;

    const clean = word.replace(/[**_`#•\-—:,;.!?()\[\]{}""'']/g, '').trim();
    if (clean.length <= 2) continue;

    let score = 0;

    // Mots en gras (markdown **mot**) = très important
    if (word.includes('**') || word.includes('__')) score += 10;

    // Mots en majuscules ou commençant par majuscule (concepts, noms propres)
    if (clean === clean.toUpperCase() && clean.length > 2) score += 7;
    else if (/^[A-ZÀ-Ü]/.test(clean) && !/^(Le|La|Les|Un|Une|Des|Du|De|En|Au|Aux|Ce|Cette|Ces|Il|Elle|On|Nous|Vous|Ils|Elles|Qui|Que|Où|Dont|Quand|Comment|Pourquoi|Dans|Avec|Pour|Par|Sur|Sous|Vers|Chez|Selon|Car|Mais|Ou|Et|Donc|Or|Ni|Est|Sont|Fait|Aussi|Comme|Leur|Entre|Même|Tout|Plus|Très|Bien|Aussi|Peut|Doit|Être|Avoir)$/i.test(clean)) score += 5;

    // Chiffres et pourcentages = données clés
    if (/\d/.test(clean)) score += 8;
    if (/%/.test(word)) score += 3;

    // Termes techniques (mots longs, souvent techniques)
    if (clean.length >= 8) score += 3;
    if (clean.length >= 12) score += 2;

    // Mots après ":" ou "=" (souvent des définitions)
    if (i > 0 && /[:=]/.test(words[Math.max(0, i - 1)])) score += 4;

    // Termes juridiques/techniques courants
    if (/^(article|loi|décret|principe|théorème|formule|taux|ratio|coefficient|indice|variable|fonction|méthode|processus|stratégie|obligation|contrat|droit|responsabilité|tribunal|juridiction|compétence|sanction|recours|clause|convention|règlement|directive|norme)/i.test(clean)) score += 6;

    // Termes économiques/quanti
    if (/^(PIB|BFR|ROI|ROE|CA|EBE|EBITDA|VAN|TRI|marge|bénéfice|chiffre|coût|prix|valeur|capital|actif|passif|bilan|résultat|amortissement|provision|trésorerie|solvabilité|rentabilité|liquidité|endettement|croissance|inflation|écart|variance|moyenne|médiane|quartile|régression|corrélation)/i.test(clean)) score += 8;

    // Termes RH
    if (/^(CDI|CDD|GPEC|RSE|CSE|NAO|entretien|recrutement|formation|compétence|rémunération|licenciement|démission|rupture|conventionnelle|période|essai|préavis|indemnité|congé|temps|partiel)/i.test(clean)) score += 7;

    // Éviter les stop words et mots grammaticaux
    if (/^(est|sont|être|avoir|fait|fait|cet|ces|cette|les|des|une|dans|pour|avec|par|sur|sous|qui|que|dont|où|quand|comment|très|bien|plus|moins|tout|tous|aussi|car|mais|donc|or|pas|non|oui|alors|puis|ici|là|sans|entre|après|avant|pendant|depuis|jusqu|contre|selon|malgré|sauf|vers|chez|comme|si|aux|son|leur|nos|vos|mes|tes|ses)$/i.test(clean)) {
      score = 0;
    }

    if (score > 0) {
      scoredWords.push({ index: i, score, word: clean });
    }
  }

  // Trier par score et prendre les N meilleurs
  scoredWords.sort((a, b) => b.score - a.score);

  // S'assurer de ne pas cacher 2 mots consécutifs
  const selected = scoredWords.slice(0, targetBlanks * 2); // prendre plus pour filtrer
  let count = 0;
  let lastIndex = -4;

  for (const sw of selected) {
    if (count >= targetBlanks) break;
    if (sw.index - lastIndex < 4) continue; // min 2 mots visibles entre les trous
    keyIndices.add(sw.index);
    lastIndex = sw.index;
    count++;
  }

  return keyIndices;
}

export default function FillInBlanks({ content, accentColor = '#06b6d4' }: FillInBlanksProps) {
  // Nettoyer le markdown pour le mode à trous (garder le texte lisible)
  const cleanText = useMemo(() => {
    return content
      .replace(/^#+\s+/gm, '') // Supprimer les titres markdown
      .replace(/^>\s*/gm, '') // Supprimer les blockquotes
      .replace(/^---+$/gm, '') // Supprimer les séparateurs
      .replace(/^[-*•]\s*/gm, '• ') // Normaliser les puces
      .replace(/\*\*(.*?)\*\*/g, '$1') // Garder le texte en gras mais noter
      .replace(/`(.*?)`/g, '$1') // Enlever les backticks
      .replace(/\n{3,}/g, '\n\n') // Réduire les lignes vides
      .trim();
  }, [content]);

  const words = useMemo(() => cleanText.split(/(\s+)/), [cleanText]);
  const keyIndices = useMemo(() => identifyKeyWords(content), [content]);

  const [blanks, setBlanks] = useState<Map<number, BlankWord>>(() => {
    const map = new Map<number, BlankWord>();
    keyIndices.forEach(idx => {
      const word = words[idx];
      if (word) {
        const clean = word.replace(/[,;.!?()[\]{}""'']/g, '').trim();
        map.set(idx, {
          original: clean,
          index: idx,
          revealed: false,
          userGuess: '',
          isCorrect: null,
        });
      }
    });
    return map;
  });

  const [showAll, setShowAll] = useState(false);
  const [activeInput, setActiveInput] = useState<number | null>(null);

  const totalBlanks = blanks.size;
  const revealed = Array.from(blanks.values()).filter(b => b.revealed || b.isCorrect === true).length;
  const progress = totalBlanks > 0 ? (revealed / totalBlanks) * 100 : 0;

  function handleGuess(index: number, guess: string) {
    setBlanks(prev => {
      const next = new Map(prev);
      const blank = next.get(index);
      if (!blank) return prev;

      const isCorrect = guess.toLowerCase().trim() === blank.original.toLowerCase().trim();
      next.set(index, { ...blank, userGuess: guess, isCorrect });
      return next;
    });
  }

  function handleReveal(index: number) {
    setBlanks(prev => {
      const next = new Map(prev);
      const blank = next.get(index);
      if (!blank) return prev;
      next.set(index, { ...blank, revealed: true });
      return next;
    });
  }

  function handleRevealAll() {
    setShowAll(true);
    setBlanks(prev => {
      const next = new Map(prev);
      next.forEach((blank, key) => {
        next.set(key, { ...blank, revealed: true });
      });
      return next;
    });
  }

  function handleReset() {
    setShowAll(false);
    setActiveInput(null);
    setBlanks(prev => {
      const next = new Map(prev);
      next.forEach((blank, key) => {
        next.set(key, { ...blank, revealed: false, userGuess: '', isCorrect: null });
      });
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-zinc-300">
            Mode à trous
          </span>
          <span className="text-xs text-zinc-500">
            {revealed}/{totalBlanks} trouvés
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            icon={<RotateCcw size={14} />}
          >
            Recommencer
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRevealAll}
            icon={showAll ? <EyeOff size={14} /> : <Eye size={14} />}
            disabled={showAll}
          >
            {showAll ? 'Tout révélé' : 'Tout révéler'}
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: accentColor }}
        />
      </div>

      {/* Score */}
      {progress === 100 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 animate-fade-in">
          <Trophy size={18} className="text-emerald-400" />
          <span className="text-emerald-300 text-sm font-medium">
            Bravo ! Tu as trouvé tous les mots clés !
          </span>
        </div>
      )}

      {/* Texte à trous */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 leading-relaxed text-sm text-zinc-300">
        {words.map((word, i) => {
          const blank = blanks.get(i);

          if (!blank) {
            return <span key={i}>{word}</span>;
          }

          // Extraire les flags avant le narrowing TypeScript
          const isAnsweredCorrectly = Boolean(blank.isCorrect);
          const isWrongAnswer = blank.isCorrect === false && blank.userGuess.length > 0;

          // Mot révélé ou trouvé
          if (blank.revealed || isAnsweredCorrectly) {
            return (
              <span
                key={i}
                className={`inline-block px-1.5 py-0.5 rounded font-semibold ${
                  isAnsweredCorrectly
                    ? 'bg-emerald-500/15 text-emerald-300 border-b-2 border-emerald-500'
                    : 'bg-amber-500/15 text-amber-300 border-b-2 border-amber-500'
                }`}
              >
                {blank.original}
              </span>
            );
          }

          // Trou actif (avec input)
          if (activeInput === i) {
            return (
              <span key={i} className="inline-flex items-center gap-1">
                <input
                  type="text"
                  autoFocus
                  value={blank.userGuess}
                  onChange={(e) => handleGuess(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isAnsweredCorrectly) {
                      setActiveInput(null);
                    }
                    if (e.key === 'Escape') {
                      setActiveInput(null);
                    }
                  }}
                  onBlur={() => {
                    if (!blank.userGuess) setActiveInput(null);
                  }}
                  className={`inline-block w-24 px-2 py-0.5 rounded text-sm font-medium border-b-2 bg-zinc-800 outline-none transition-colors ${
                    isAnsweredCorrectly
                      ? 'border-emerald-500 text-emerald-300'
                      : isWrongAnswer
                      ? 'border-red-500 text-red-300'
                      : 'border-cyan-500 text-cyan-300'
                  }`}
                  style={{ width: `${Math.max(blank.original.length * 10, 60)}px` }}
                  placeholder="..."
                />
                {isWrongAnswer && (
                  <button
                    onClick={() => handleReveal(i)}
                    className="text-xs text-zinc-500 hover:text-amber-400 transition-colors"
                    title="Voir la réponse"
                  >
                    <Eye size={12} />
                  </button>
                )}
                {isAnsweredCorrectly && (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                )}
              </span>
            );
          }

          // Trou non-actif (cliquable)
          return (
            <button
              key={i}
              onClick={() => setActiveInput(i)}
              className="inline-block px-2 py-0.5 mx-0.5 rounded bg-zinc-800 border-b-2 border-zinc-600 hover:border-cyan-500 text-zinc-500 hover:text-cyan-400 transition-all cursor-pointer min-w-[40px] text-center"
              style={{ minWidth: `${Math.max(blank.original.length * 8, 40)}px` }}
            >
              {'_'.repeat(Math.min(blank.original.length, 8))}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-zinc-600 text-center">
        Clique sur un trou pour deviner le mot. Tape ta réponse et appuie Entrée.
      </p>
    </div>
  );
}
