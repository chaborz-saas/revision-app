/**
 * Générateur de quiz hors-ligne intelligent — sans API IA
 *
 * Analyse le texte d'un cours/chapitre pour générer des questions
 * QCM, Vrai/Faux et Réponse Courte de manière déterministe.
 *
 * Stratégies :
 * - QCM : extrait un fait/définition, le transforme en question,
 *   génère des distracteurs plausibles à partir du même texte
 * - Vrai/Faux : prend une affirmation vraie du texte ou la modifie
 *   (chiffre, nom, logique inversée) pour créer une fausse
 * - Réponse courte : "Quel est...", "Comment s'appelle...", "Citez..."
 */

export interface GeneratedQuestion {
  type: 'qcm' | 'vrai_faux' | 'reponse_courte';
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

// ─── Types internes ───────────────────────────────────────────

interface ExtractedFact {
  subject: string;
  predicate: string;
  fullSentence: string;
  category: 'definition' | 'numeric' | 'property' | 'relation' | 'process' | 'list' | 'general';
}

interface ExtractedDefinition {
  term: string;
  definition: string;
  sentence: string;
}

interface ExtractedNumeric {
  subject: string;
  number: string;
  unit: string;
  sentence: string;
}

interface ExtractedList {
  intro: string;
  items: string[];
  sentence: string;
}

// ─── Point d'entrée principal ─────────────────────────────────

export function generateOfflineQuiz(
  content: string,
  difficulty: string,
  count: number,
  types: string[]
): { questions: GeneratedQuestion[] } {
  if (!content || content.trim().length < 50) {
    return { questions: [] };
  }

  // Normaliser les types
  const allowedTypes = new Set(
    types.length > 0 ? types : ['qcm', 'vrai_faux', 'reponse_courte']
  );

  // Extraire toutes les informations exploitables du texte
  const sentences = extractSentences(content);
  const definitions = extractDefinitions(sentences);
  const numerics = extractNumerics(sentences);
  const facts = extractFacts(sentences);
  const lists = extractLists(content);
  const keyTerms = extractKeyTerms(content);

  // Pools de questions par type
  const qcmPool: GeneratedQuestion[] = [];
  const vraiPool: GeneratedQuestion[] = [];
  const courtePool: GeneratedQuestion[] = [];

  // ── Générer des QCM ──

  if (allowedTypes.has('qcm')) {
    // QCM depuis les définitions
    for (const def of definitions) {
      const distractors = generateDefinitionDistractors(def, definitions, keyTerms);
      if (distractors.length >= 3) {
        const options = shuffle([def.definition, ...distractors.slice(0, 3)]);
        qcmPool.push({
          type: 'qcm',
          question: `Qu'est-ce que ${articleFor(def.term)}${def.term} ?`,
          options,
          correct_answer: def.definition,
          explanation: `${capitalize(def.term)} : ${def.definition}`,
        });
      }
    }

    // QCM depuis les faits numériques
    for (const num of numerics) {
      const distractors = generateNumericDistractors(num.number, num.unit);
      if (distractors.length >= 3) {
        const options = shuffle([
          `${num.number}${num.unit ? ' ' + num.unit : ''}`,
          ...distractors.slice(0, 3),
        ]);
        qcmPool.push({
          type: 'qcm',
          question: `Concernant ${num.subject.toLowerCase()}, quel est le chiffre correct ?`,
          options,
          correct_answer: `${num.number}${num.unit ? ' ' + num.unit : ''}`,
          explanation: num.sentence,
        });
      }
    }

    // QCM depuis les faits généraux (sujet -> prédicat)
    for (const fact of facts) {
      const distractors = generateFactDistractors(fact, facts, keyTerms);
      if (distractors.length >= 3) {
        const options = shuffle([fact.predicate, ...distractors.slice(0, 3)]);
        qcmPool.push({
          type: 'qcm',
          question: buildFactQuestion(fact),
          options,
          correct_answer: fact.predicate,
          explanation: fact.fullSentence,
        });
      }
    }

    // QCM depuis les listes (quel élément appartient/n'appartient pas)
    for (const list of lists) {
      if (list.items.length >= 3) {
        // Question : quel élément fait partie de la liste ?
        const correctItem = list.items[Math.floor(pseudoRandom(list.intro) * list.items.length)];
        const fakeItems = generateListDistractors(list, keyTerms);
        if (fakeItems.length >= 3) {
          const options = shuffle([correctItem, ...fakeItems.slice(0, 3)]);
          qcmPool.push({
            type: 'qcm',
            question: `Parmi les propositions suivantes, laquelle fait partie ${list.intro.toLowerCase()} ?`,
            options,
            correct_answer: correctItem,
            explanation: `Les éléments sont : ${list.items.join(', ')}.`,
          });
        }
      }
    }
  }

  // ── Générer des Vrai/Faux ──

  if (allowedTypes.has('vrai_faux')) {
    // Vrai/Faux depuis les définitions (affirmer ou modifier)
    for (let i = 0; i < definitions.length; i++) {
      const def = definitions[i];
      if (i % 2 === 0) {
        // Affirmation VRAIE
        vraiPool.push({
          type: 'vrai_faux',
          question: `${capitalize(def.term)} ${def.definition.startsWith('est') || def.definition.startsWith('se') ? '' : 'est '}${def.definition}.`,
          options: ['Vrai', 'Faux'],
          correct_answer: 'Vrai',
          explanation: `C'est vrai. ${def.sentence}`,
        });
      } else {
        // Affirmation FAUSSE : on échange avec une autre définition
        const other = definitions[(i + 1) % definitions.length];
        if (other && other.term !== def.term) {
          vraiPool.push({
            type: 'vrai_faux',
            question: `${capitalize(def.term)} ${other.definition.startsWith('est') || other.definition.startsWith('se') ? '' : 'est '}${other.definition}.`,
            options: ['Vrai', 'Faux'],
            correct_answer: 'Faux',
            explanation: `C'est faux. ${capitalize(def.term)} : ${def.definition}. Ce qui est décrit correspond plutôt à ${other.term}.`,
          });
        }
      }
    }

    // Vrai/Faux depuis les faits numériques (modifier le chiffre)
    for (let i = 0; i < numerics.length; i++) {
      const num = numerics[i];
      if (i % 2 === 0) {
        // VRAI
        vraiPool.push({
          type: 'vrai_faux',
          question: num.sentence,
          options: ['Vrai', 'Faux'],
          correct_answer: 'Vrai',
          explanation: `C'est vrai. ${num.sentence}`,
        });
      } else {
        // FAUX : modifier le chiffre
        const fakeNumber = alterNumber(num.number);
        const fakeSentence = num.sentence.replace(num.number, fakeNumber);
        vraiPool.push({
          type: 'vrai_faux',
          question: fakeSentence,
          options: ['Vrai', 'Faux'],
          correct_answer: 'Faux',
          explanation: `C'est faux. Le chiffre correct est ${num.number}${num.unit ? ' ' + num.unit : ''}, pas ${fakeNumber}${num.unit ? ' ' + num.unit : ''}. ${num.sentence}`,
        });
      }
    }

    // Vrai/Faux depuis les faits généraux
    for (let i = 0; i < facts.length; i++) {
      const fact = facts[i];
      if (i % 3 === 0) {
        // VRAI
        vraiPool.push({
          type: 'vrai_faux',
          question: fact.fullSentence,
          options: ['Vrai', 'Faux'],
          correct_answer: 'Vrai',
          explanation: `C'est vrai. ${fact.fullSentence}`,
        });
      } else if (i % 3 === 1 && facts.length > 1) {
        // FAUX : échanger les prédicats de deux faits
        const other = facts[(i + 2) % facts.length];
        if (other && other.subject !== fact.subject) {
          const falseSentence = fact.fullSentence.replace(fact.predicate, other.predicate);
          if (falseSentence !== fact.fullSentence) {
            vraiPool.push({
              type: 'vrai_faux',
              question: falseSentence,
              options: ['Vrai', 'Faux'],
              correct_answer: 'Faux',
              explanation: `C'est faux. En réalité : ${fact.fullSentence}`,
            });
          }
        }
      }
    }
  }

  // ── Générer des Réponses courtes ──

  if (allowedTypes.has('reponse_courte')) {
    // Réponse courte depuis les définitions
    for (const def of definitions) {
      courtePool.push({
        type: 'reponse_courte',
        question: `Définissez ${articleFor(def.term)}${def.term}.`,
        options: [],
        correct_answer: def.definition,
        explanation: def.sentence,
      });

      // Question inversée : qu'est-ce qui correspond à cette définition ?
      if (def.definition.length > 20 && def.definition.length < 150) {
        courtePool.push({
          type: 'reponse_courte',
          question: `Comment appelle-t-on ce qui ${def.definition.toLowerCase()} ?`,
          options: [],
          correct_answer: def.term,
          explanation: def.sentence,
        });
      }
    }

    // Réponse courte depuis les chiffres
    for (const num of numerics) {
      courtePool.push({
        type: 'reponse_courte',
        question: `Quel est le chiffre associé à ${num.subject.toLowerCase()} ?`,
        options: [],
        correct_answer: `${num.number}${num.unit ? ' ' + num.unit : ''}`,
        explanation: num.sentence,
      });
    }

    // Réponse courte depuis les listes
    for (const list of lists) {
      if (list.items.length >= 2 && list.items.length <= 8) {
        courtePool.push({
          type: 'reponse_courte',
          question: `Citez les éléments ${list.intro.toLowerCase()}.`,
          options: [],
          correct_answer: list.items.join(', '),
          explanation: `Les éléments sont : ${list.items.join(', ')}.`,
        });
      }
    }

    // Réponse courte depuis les faits
    for (const fact of facts) {
      if (fact.predicate.length < 100) {
        courtePool.push({
          type: 'reponse_courte',
          question: buildShortAnswerQuestion(fact),
          options: [],
          correct_answer: fact.predicate,
          explanation: fact.fullSentence,
        });
      }
    }
  }

  // ── Assemblage final : respecter le count et la répartition ──

  const allPools: { pool: GeneratedQuestion[]; type: string }[] = [];
  if (allowedTypes.has('qcm')) allPools.push({ pool: qcmPool, type: 'qcm' });
  if (allowedTypes.has('vrai_faux')) allPools.push({ pool: vraiPool, type: 'vrai_faux' });
  if (allowedTypes.has('reponse_courte')) allPools.push({ pool: courtePool, type: 'reponse_courte' });

  if (allPools.length === 0) {
    return { questions: [] };
  }

  // Déduplication globale par question
  const seenQuestions = new Set<string>();
  for (const p of allPools) {
    p.pool = p.pool.filter(q => {
      const key = q.question.toLowerCase().trim();
      if (seenQuestions.has(key)) return false;
      seenQuestions.add(key);
      return true;
    });
  }

  // Répartition proportionnelle entre les types
  const perType = Math.ceil(count / allPools.length);
  let selected: GeneratedQuestion[] = [];

  for (const p of allPools) {
    // Mélanger le pool pour varier les questions
    const shuffled = shuffle(p.pool);
    selected.push(...shuffled.slice(0, perType));
  }

  // Ajuster la difficulté
  selected = adjustDifficulty(selected, difficulty);

  // Mélanger le résultat final et limiter au count
  selected = shuffle(selected).slice(0, count);

  // Si on n'a pas assez de questions, générer des questions de remplissage
  if (selected.length < count) {
    const fillerQuestions = generateFillerQuestions(sentences, keyTerms, allowedTypes, count - selected.length, seenQuestions);
    selected.push(...fillerQuestions);
  }

  return { questions: selected };
}

// ─── Extraction de phrases ────────────────────────────────────

function extractSentences(content: string): string[] {
  // Nettoyer le texte
  const cleaned = content
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/---+/g, ' ')
    .replace(/#{1,6}\s*/g, '');

  // Découper en phrases
  const raw = cleaned.split(/(?<=[.!?])\s+/);
  return raw
    .map(s => s.trim())
    .filter(s => s.length >= 20 && s.length <= 500)
    .filter(s => !/^(http|www\.|<|{|}|\[)/.test(s));
}

// ─── Extraction de définitions ────────────────────────────────

function extractDefinitions(sentences: string[]): ExtractedDefinition[] {
  const defs: ExtractedDefinition[] = [];
  const seen = new Set<string>();

  for (const s of sentences) {
    // Motif : "X est Y" / "X désigne Y" / "X correspond à Y"
    const patterns = [
      /^(?:L[ea']?\s*|Un[e]?\s+|Les?\s+|La\s+|Le\s+)?(.{3,60}?)\s+(?:est|désigne|correspond à|se définit comme|représente|consiste en|signifie)\s+(.{15,250})/i,
      /^(?:On\s+(?:appelle|définit|nomme))\s+(.{3,60}?)\s+(.{15,250})/i,
      /^(?:Définition)\s*[:：]\s*(.{3,60}?)\s*[-–—:]\s*(.{15,250})/i,
    ];

    for (const p of patterns) {
      const m = s.match(p);
      if (m && m[1] && m[2]) {
        const term = cleanTerm(m[1]);
        const definition = m[2].replace(/[.!?]+$/, '').trim();
        const key = term.toLowerCase();
        if (term.length >= 3 && term.length <= 60 && definition.length >= 10 && !seen.has(key)) {
          seen.add(key);
          defs.push({ term, definition, sentence: s });
        }
        break;
      }
    }
  }

  return defs;
}

// ─── Extraction de faits numériques ───────────────────────────

function extractNumerics(sentences: string[]): ExtractedNumeric[] {
  const nums: ExtractedNumeric[] = [];
  const seen = new Set<string>();

  for (const s of sentences) {
    // Chercher des phrases contenant des chiffres significatifs
    const m = s.match(/(.{5,80}?)\s+(?:est de|s'élève à|représente|atteint|vaut|compte|comprend|contient|dure|mesure|pèse)\s+(\d[\d\s,.]*\d?)\s*([\w%€$£°]+)?/i);
    if (m && m[1] && m[2]) {
      const subject = cleanTerm(m[1]);
      const number = m[2].trim();
      const unit = m[3] ? m[3].trim() : '';
      const key = `${subject.toLowerCase()}:${number}`;
      if (!seen.has(key) && number.length >= 1 && number.length <= 20) {
        seen.add(key);
        nums.push({ subject, number, unit, sentence: s });
      }
    }

    // Motif secondaire : "X% de Y"
    const m2 = s.match(/(\d[\d,.]*)\s*(%)\s+(?:des?|du|de la)\s+(.{5,60})/i);
    if (m2 && m2[1] && m2[3]) {
      const number = m2[1].trim();
      const subject = cleanTerm(m2[3]);
      const key = `${subject.toLowerCase()}:${number}%`;
      if (!seen.has(key)) {
        seen.add(key);
        nums.push({ subject, number: number + '%', unit: '', sentence: s });
      }
    }
  }

  return nums;
}

// ─── Extraction de faits généraux ─────────────────────────────

function extractFacts(sentences: string[]): ExtractedFact[] {
  const facts: ExtractedFact[] = [];
  const seen = new Set<string>();

  for (const s of sentences) {
    // Motif : "Sujet verbe Prédicat"
    const patterns = [
      { regex: /^(.{5,80}?)\s+(permet(?:\s+de)?|sert à|a pour (?:but|objectif|rôle|fonction) de?)\s+(.{10,200})/i, cat: 'property' as const },
      { regex: /^(.{5,80}?)\s+(se compose de|comprend|inclut|regroupe|comporte|contient)\s+(.{10,200})/i, cat: 'relation' as const },
      { regex: /^(.{5,80}?)\s+(est (?:caractérisé|défini|composé|constitué|formé|divisé|classé) (?:par|en|de))\s+(.{10,200})/i, cat: 'property' as const },
      { regex: /^(.{5,80}?)\s+(joue un rôle (?:dans|de|important|clé|essentiel|central|majeur))\s*(.{0,200})/i, cat: 'relation' as const },
      { regex: /^(.{5,80}?)\s+(entraîne|provoque|cause|génère|produit|implique|nécessite)\s+(.{10,200})/i, cat: 'process' as const },
    ];

    for (const { regex, cat } of patterns) {
      const m = s.match(regex);
      if (m && m[1] && m[3]) {
        const subject = cleanTerm(m[1]);
        const predicate = (m[2] + ' ' + m[3]).replace(/[.!?]+$/, '').trim();
        const key = subject.toLowerCase();
        if (!seen.has(key) && subject.length >= 3 && predicate.length >= 10) {
          seen.add(key);
          facts.push({
            subject,
            predicate,
            fullSentence: s,
            category: cat,
          });
        }
        break;
      }
    }
  }

  return facts;
}

// ─── Extraction de listes ─────────────────────────────────────

function extractLists(content: string): ExtractedList[] {
  const lists: ExtractedList[] = [];
  const lines = content.split('\n');

  let currentIntro = '';
  let currentItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Détecter un intro de liste (phrase suivie d'éléments à puces)
    const introMatch = line.match(/^(.{10,120})\s*[:：]\s*$/);
    if (introMatch) {
      // Sauvegarder la liste précédente
      if (currentIntro && currentItems.length >= 2) {
        lists.push({ intro: currentIntro, items: [...currentItems], sentence: `${currentIntro} : ${currentItems.join(', ')}` });
      }
      currentIntro = introMatch[1].trim();
      currentItems = [];
      continue;
    }

    // Détecter des éléments de liste
    const itemMatch = line.match(/^(?:[-–—•*]\s+|\d+[.)]\s+|[a-z][.)]\s+)(.{3,150})/);
    if (itemMatch && currentIntro) {
      currentItems.push(itemMatch[1].replace(/[;,.]$/, '').trim());
    } else if (line.length > 0 && !itemMatch && currentItems.length >= 2) {
      // Fin de liste
      if (currentIntro) {
        lists.push({ intro: currentIntro, items: [...currentItems], sentence: `${currentIntro} : ${currentItems.join(', ')}` });
      }
      currentIntro = '';
      currentItems = [];
    }
  }

  // Dernière liste
  if (currentIntro && currentItems.length >= 2) {
    lists.push({ intro: currentIntro, items: [...currentItems], sentence: `${currentIntro} : ${currentItems.join(', ')}` });
  }

  return lists;
}

// ─── Extraction de termes clés ────────────────────────────────

function extractKeyTerms(content: string): string[] {
  const wordFreq = new Map<string, number>();

  // Mots en gras (Markdown)
  const boldMatches = content.match(/\*\*(.{2,40}?)\*\*/g) || [];
  for (const b of boldMatches) {
    const term = b.replace(/\*\*/g, '').trim();
    if (term.length >= 2) {
      wordFreq.set(term, (wordFreq.get(term) || 0) + 5);
    }
  }

  // Mots capitalisés récurrents (noms propres, concepts)
  const capWords = content.match(/[A-ZÀ-Ü][a-zà-ü]{3,}/g) || [];
  const stopWords = new Set([
    'dans', 'avec', 'pour', 'cette', 'tout', 'plus', 'mais', 'sont', 'être',
    'fait', 'aussi', 'comme', 'leur', 'entre', 'même', 'peut', 'très', 'elle',
    'nous', 'vous', 'elles', 'autres', 'avant', 'après', 'depuis', 'encore',
    'selon', 'sans', 'sous', 'chez', 'vers', 'donc', 'alors', 'quand', 'bien',
    'cela', 'ceci', 'dont', 'sera', 'avoir', 'faire', 'dire', 'aller', 'voir',
    'tous', 'toute', 'toutes', 'chaque', 'notre', 'votre', 'leurs', 'aucun',
    'ainsi', 'quelque', 'pendant', 'exemple', 'cependant', 'toutefois',
    'notamment', 'certains', 'certaines', 'plusieurs', 'premier', 'première',
    'dernier', 'dernière',
  ]);

  for (const w of capWords) {
    if (!stopWords.has(w.toLowerCase())) {
      wordFreq.set(w, (wordFreq.get(w) || 0) + 1);
    }
  }

  return Array.from(wordFreq.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word);
}

// ─── Génération de distracteurs ───────────────────────────────

function generateDefinitionDistractors(
  target: ExtractedDefinition,
  allDefs: ExtractedDefinition[],
  keyTerms: string[]
): string[] {
  const distractors: string[] = [];

  // Utiliser les définitions d'autres termes comme distracteurs
  for (const def of allDefs) {
    if (def.term.toLowerCase() !== target.term.toLowerCase() && distractors.length < 5) {
      distractors.push(def.definition);
    }
  }

  // Si pas assez, créer des variantes en utilisant des termes clés
  if (distractors.length < 3) {
    const templates = [
      `un processus de ${pickRandom(keyTerms) || 'transformation'} qui modifie les résultats`,
      `une méthode permettant d'analyser ${pickRandom(keyTerms) || 'les données'}`,
      `un ensemble de ${pickRandom(keyTerms) || 'facteurs'} déterminant le résultat`,
      `un concept lié à ${pickRandom(keyTerms) || 'l\'organisation'} des éléments`,
      `une caractéristique propre à ${pickRandom(keyTerms) || 'la structure'}`,
    ];
    for (const t of templates) {
      if (distractors.length < 5 && !distractors.includes(t)) {
        distractors.push(t);
      }
    }
  }

  return distractors;
}

function generateNumericDistractors(correctNumber: string, unit: string): string[] {
  const distractors: string[] = [];
  const num = parseFloat(correctNumber.replace(/[,\s]/g, '.').replace(/%$/, ''));

  if (isNaN(num)) {
    // Si on ne peut pas parser, créer des variantes textuelles
    return [`${correctNumber}0`, `${correctNumber}5`, `${correctNumber}2`];
  }

  const isPercent = correctNumber.includes('%');
  const isInteger = Number.isInteger(num);

  // Générer des alternatives plausibles
  const variations = [
    num * 0.5,
    num * 1.5,
    num * 2,
    num + (isInteger ? Math.max(1, Math.round(num * 0.2)) : num * 0.3),
    num - (isInteger ? Math.max(1, Math.round(num * 0.2)) : num * 0.3),
    num * 0.75,
    num * 1.25,
  ];

  for (const v of variations) {
    if (v !== num && v > 0 && distractors.length < 5) {
      let formatted: string;
      if (isPercent) {
        formatted = `${isInteger ? Math.round(v) : v.toFixed(1)}%`;
      } else if (isInteger) {
        formatted = `${Math.round(v)}${unit ? ' ' + unit : ''}`;
      } else {
        formatted = `${v.toFixed(2)}${unit ? ' ' + unit : ''}`;
      }
      if (!distractors.includes(formatted)) {
        distractors.push(formatted);
      }
    }
  }

  return distractors;
}

function generateFactDistractors(
  target: ExtractedFact,
  allFacts: ExtractedFact[],
  keyTerms: string[]
): string[] {
  const distractors: string[] = [];

  // Utiliser les prédicats d'autres faits
  for (const fact of allFacts) {
    if (fact.subject.toLowerCase() !== target.subject.toLowerCase() && distractors.length < 5) {
      distractors.push(fact.predicate);
    }
  }

  // Compléter avec des termes clés dans des templates
  if (distractors.length < 3) {
    const templates = [
      `est principalement lié à ${pickRandom(keyTerms) || 'un autre concept'}`,
      `n'a pas d'impact direct sur ${pickRandom(keyTerms) || 'les résultats'}`,
      `dépend exclusivement de ${pickRandom(keyTerms) || 'facteurs externes'}`,
      `se limite à ${pickRandom(keyTerms) || 'un cas particulier'}`,
    ];
    for (const t of templates) {
      if (distractors.length < 5) {
        distractors.push(t);
      }
    }
  }

  return distractors;
}

function generateListDistractors(list: ExtractedList, keyTerms: string[]): string[] {
  const distractors: string[] = [];
  const existingLower = new Set(list.items.map(i => i.toLowerCase()));

  // Utiliser des termes clés qui ne sont PAS dans la liste
  for (const term of keyTerms) {
    if (!existingLower.has(term.toLowerCase()) && distractors.length < 5) {
      distractors.push(term);
    }
  }

  // Compléter si nécessaire
  const genericFalse = [
    'Aucune de ces réponses',
    'Tous les éléments ci-dessus',
    'Un concept non abordé dans le cours',
  ];
  for (const g of genericFalse) {
    if (distractors.length < 5) {
      distractors.push(g);
    }
  }

  return distractors;
}

// ─── Construction de questions ────────────────────────────────

function buildFactQuestion(fact: ExtractedFact): string {
  const subject = fact.subject.toLowerCase();
  switch (fact.category) {
    case 'property':
      return `Quelle est la caractéristique principale de ${articleFor(subject)}${subject} ?`;
    case 'relation':
      return `Quel est le rôle de ${articleFor(subject)}${subject} ?`;
    case 'process':
      return `Quelle est la conséquence de ${articleFor(subject)}${subject} ?`;
    default:
      return `Concernant ${articleFor(subject)}${subject}, quelle affirmation est correcte ?`;
  }
}

function buildShortAnswerQuestion(fact: ExtractedFact): string {
  const subject = fact.subject.toLowerCase();
  switch (fact.category) {
    case 'property':
      return `Quelle est la propriété de ${articleFor(subject)}${subject} ?`;
    case 'relation':
      return `Quel est le lien entre ${articleFor(subject)}${subject} et les autres éléments ?`;
    case 'process':
      return `Que provoque ${articleFor(subject)}${subject} ?`;
    default:
      return `Que savez-vous sur ${articleFor(subject)}${subject} ?`;
  }
}

// ─── Questions de remplissage ─────────────────────────────────

function generateFillerQuestions(
  sentences: string[],
  keyTerms: string[],
  allowedTypes: Set<string>,
  needed: number,
  seenQuestions: Set<string>
): GeneratedQuestion[] {
  const fillers: GeneratedQuestion[] = [];

  // Filtrer les phrases substantielles contenant des termes clés
  const goodSentences = sentences.filter(s => {
    const lower = s.toLowerCase();
    return keyTerms.some(t => lower.includes(t.toLowerCase())) && s.length >= 30 && s.length <= 300;
  });

  for (const s of goodSentences) {
    if (fillers.length >= needed) break;

    // Trouver un terme clé dans la phrase
    const foundTerm = keyTerms.find(t => s.toLowerCase().includes(t.toLowerCase()));
    if (!foundTerm) continue;

    if (allowedTypes.has('vrai_faux')) {
      const questionText = s.replace(/[.!?]+$/, '').trim() + '.';
      const key = questionText.toLowerCase();
      if (!seenQuestions.has(key)) {
        seenQuestions.add(key);
        fillers.push({
          type: 'vrai_faux',
          question: questionText,
          options: ['Vrai', 'Faux'],
          correct_answer: 'Vrai',
          explanation: `C'est vrai. ${s}`,
        });
      }
    } else if (allowedTypes.has('reponse_courte')) {
      const q = `Complétez : que pouvez-vous dire sur ${articleFor(foundTerm)}${foundTerm} ?`;
      const key = q.toLowerCase();
      if (!seenQuestions.has(key)) {
        seenQuestions.add(key);
        fillers.push({
          type: 'reponse_courte',
          question: q,
          options: [],
          correct_answer: s.replace(/[.!?]+$/, '').trim(),
          explanation: s,
        });
      }
    } else if (allowedTypes.has('qcm')) {
      const q = `Laquelle de ces affirmations sur ${articleFor(foundTerm)}${foundTerm} est correcte ?`;
      const key = q.toLowerCase();
      if (!seenQuestions.has(key)) {
        seenQuestions.add(key);
        const correctOpt = s.replace(/[.!?]+$/, '').trim();
        const wrongOptions = [
          `${capitalize(foundTerm)} n'a aucun rapport avec ce sujet`,
          `${capitalize(foundTerm)} est un concept obsolète`,
          `${capitalize(foundTerm)} se définit différemment dans ce contexte`,
        ];
        fillers.push({
          type: 'qcm',
          question: q,
          options: shuffle([correctOpt, ...wrongOptions]),
          correct_answer: correctOpt,
          explanation: s,
        });
      }
    }
  }

  return fillers;
}

// ─── Ajustement de la difficulté ──────────────────────────────

function adjustDifficulty(questions: GeneratedQuestion[], difficulty: string): GeneratedQuestion[] {
  switch (difficulty) {
    case 'facile':
      // Pour le mode facile : préférer les Vrai/Faux et les QCM simples
      // Ajouter des indices dans les explications
      return questions.map(q => ({
        ...q,
        explanation: `Indice : ${q.explanation}`,
      }));

    case 'difficile':
      // Pour le mode difficile : reformuler les questions pour être plus exigeant
      return questions.map(q => {
        if (q.type === 'qcm' && q.options.length === 4) {
          // Rendre les options plus proches les unes des autres (plus difficile à distinguer)
          return {
            ...q,
            question: q.question.replace(/^Qu'est-ce que/, 'Précisez exactement ce que désigne'),
          };
        }
        if (q.type === 'reponse_courte') {
          return {
            ...q,
            question: q.question.replace(/^Définissez/, 'Donnez une définition précise de').replace(/^Citez/, 'Énumérez de manière exhaustive'),
          };
        }
        return q;
      });

    default: // moyen
      return questions;
  }
}

// ─── Utilitaires ──────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pseudoRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function cleanTerm(s: string): string {
  return s
    .replace(/^(?:L[ea']?\s*|Un[e]?\s+|Les?\s+|La\s+|Le\s+|Des?\s+|Du\s+)/i, '')
    .replace(/[,:;.!?]+$/, '')
    .trim();
}

function articleFor(term: string): string {
  if (!term) return '';
  const lower = term.toLowerCase();
  const vowels = ['a', 'e', 'i', 'o', 'u', 'é', 'è', 'ê', 'â', 'î', 'ô', 'û', 'à'];
  if (vowels.some(v => lower.startsWith(v))) {
    return "l'";
  }
  return 'le ';
}

function alterNumber(numStr: string): string {
  const isPercent = numStr.includes('%');
  const cleaned = numStr.replace(/%$/, '').replace(/[,\s]/g, '.');
  const num = parseFloat(cleaned);

  if (isNaN(num)) return numStr + '0';

  const alterations = [
    num + Math.max(1, Math.round(num * 0.3)),
    num - Math.max(1, Math.round(num * 0.2)),
    num * 2,
    Math.round(num / 2),
  ];

  // Choisir une altération qui est différente
  const altered = alterations.find(a => a !== num && a > 0) || num + 1;

  if (Number.isInteger(num)) {
    return `${Math.round(altered)}${isPercent ? '%' : ''}`;
  }
  return `${altered.toFixed(2)}${isPercent ? '%' : ''}`;
}

function pickRandom(arr: string[]): string | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}
