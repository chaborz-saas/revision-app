import {
  getAllCourses,
  getChaptersByCourse,
  getSummaryByChapter,
  getCourse,
  Course,
} from '@/lib/db';

// ============================================================
// smart-chat.ts — Chatbot hors-ligne basé sur la recherche
// dans les cours, chapitres et fiches stockés en SQLite.
// Aucune API IA requise.
// ============================================================

// --- French stop words to ignore during keyword extraction ---
const STOP_WORDS = new Set([
  // articles & déterminants
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'l',
  // pronoms
  'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles',
  'me', 'te', 'se', 'ce', 'ça', 'ceci', 'cela',
  // prépositions & conjonctions
  'à', 'au', 'aux', 'en', 'et', 'ou', 'mais', 'donc', 'car', 'ni',
  'dans', 'sur', 'sous', 'par', 'pour', 'avec', 'sans', 'entre',
  'vers', 'chez', 'depuis', 'pendant', 'après', 'avant',
  // verbes courants
  'est', 'sont', 'être', 'avoir', 'a', 'ai', 'as', 'ont', 'fait',
  'faire', 'peut', 'peux', 'pouvoir', 'dit', 'dire',
  // mots interrogatifs (on les garde comme signal mais pas comme keyword)
  'que', 'qui', 'quoi', 'comment', 'pourquoi', 'où',
  // autres
  'ne', 'pas', 'plus', 'très', 'bien', 'aussi', 'tout', 'tous',
  'cette', 'ces', 'mon', 'ton', 'son', 'ma', 'ta', 'sa',
  'nos', 'vos', 'leurs', 'mes', 'tes', 'ses',
  'si', 'y', 'ci', 'là',
]);

// --- Intent detection patterns ---
interface Intent {
  type: 'definition' | 'explanation' | 'list' | 'example' | 'summary' | 'general';
  keywords: string[];
}

function detectIntent(message: string): Intent {
  const lower = message.toLowerCase().trim();

  // Definition intent: "qu'est-ce que X", "c'est quoi X", "définition de X", "définis X"
  const defPatterns = [
    /qu['\u2019]est[- ]ce que (.+)/i,
    /c['\u2019]est quoi (.+)/i,
    /d[eé]fin(?:ition|is|ir|issez)[- ]*(?:de |du |de la |des |d['\u2019])?(.+)/i,
    /que (?:signifie|veut dire) (.+)/i,
  ];
  for (const pattern of defPatterns) {
    const m = lower.match(pattern);
    if (m) {
      return { type: 'definition', keywords: extractKeywords(m[1]) };
    }
  }

  // Explanation intent: "explique", "comment fonctionne", "comment marche"
  const explainPatterns = [
    /expliqu(?:e|ez|er?)[- ]*(?:moi )?(.+)/i,
    /comment (?:fonctionne|marche|faire|fait[- ]on) (.+)/i,
    /pourquoi (.+)/i,
  ];
  for (const pattern of explainPatterns) {
    const m = lower.match(pattern);
    if (m) {
      return { type: 'explanation', keywords: extractKeywords(m[1]) };
    }
  }

  // List intent: "quels sont", "liste", "énumère", "cite"
  const listPatterns = [
    /quels? (?:sont|est) (.+)/i,
    /list(?:e|er|ez)[- ]*(.+)/i,
    /[eé]num[eè]r(?:e|er|ez)[- ]*(.+)/i,
    /cit(?:e|er|ez)[- ]*(.+)/i,
  ];
  for (const pattern of listPatterns) {
    const m = lower.match(pattern);
    if (m) {
      return { type: 'list', keywords: extractKeywords(m[1]) };
    }
  }

  // Example intent
  const examplePatterns = [
    /(?:donne|donner|donnez)[- ]*(?:moi )?(?:un |des )?exemples? (?:de |d['\u2019])?(.+)/i,
    /exemples? (?:de |d['\u2019])?(.+)/i,
  ];
  for (const pattern of examplePatterns) {
    const m = lower.match(pattern);
    if (m) {
      return { type: 'example', keywords: extractKeywords(m[1]) };
    }
  }

  // Summary intent: "résume", "résumé", "fiche"
  const summaryPatterns = [
    /r[eé]sum(?:e|é|er|ez)[- ]*(.+)/i,
    /fiche[- ]*(?:de |sur |d['\u2019])?(.+)/i,
  ];
  for (const pattern of summaryPatterns) {
    const m = lower.match(pattern);
    if (m) {
      return { type: 'summary', keywords: extractKeywords(m[1]) };
    }
  }

  // General — extract keywords from the whole message
  return { type: 'general', keywords: extractKeywords(lower) };
}

// --- Keyword extraction ---
function extractKeywords(text: string): string[] {
  const cleaned = text
    .toLowerCase()
    .replace(/[?!.,;:()«»"'\u2019\u2018]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned
    .split(' ')
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

// --- Scoring: how well a text matches given keywords ---
function scoreText(text: string, keywords: string[]): number {
  if (!text || keywords.length === 0) return 0;
  const lower = text.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    // Count occurrences
    const regex = new RegExp(escapeRegex(kw), 'gi');
    const matches = lower.match(regex);
    if (matches) {
      score += matches.length;
    }
  }
  return score;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// --- Extract the best passage around a keyword in a text ---
function extractPassage(text: string, keywords: string[], maxLen: number = 600): string {
  if (!text) return '';
  const lower = text.toLowerCase();

  // Find the position of the first keyword match
  let bestPos = -1;
  let bestKw = '';
  for (const kw of keywords) {
    const idx = lower.indexOf(kw.toLowerCase());
    if (idx !== -1 && (bestPos === -1 || idx < bestPos)) {
      bestPos = idx;
      bestKw = kw;
    }
  }

  if (bestPos === -1) {
    // No exact match, return the beginning of text
    return text.slice(0, maxLen) + (text.length > maxLen ? '...' : '');
  }

  // Try to extract a paragraph around the match
  const halfWindow = Math.floor(maxLen / 2);
  let start = Math.max(0, bestPos - halfWindow);
  let end = Math.min(text.length, bestPos + bestKw.length + halfWindow);

  // Snap to sentence boundaries if possible
  const sentenceStart = text.lastIndexOf('.', start);
  if (sentenceStart !== -1 && sentenceStart > start - 100) {
    start = sentenceStart + 1;
  }
  const sentenceEnd = text.indexOf('.', end);
  if (sentenceEnd !== -1 && sentenceEnd < end + 100) {
    end = sentenceEnd + 1;
  }

  let passage = text.slice(start, end).trim();
  if (start > 0) passage = '...' + passage;
  if (end < text.length) passage = passage + '...';

  return passage;
}

// --- Highlight keywords with bold markdown ---
function highlightKeywords(text: string, keywords: string[]): string {
  let result = text;
  for (const kw of keywords) {
    const regex = new RegExp(`(${escapeRegex(kw)})`, 'gi');
    result = result.replace(regex, '**$1**');
  }
  return result;
}

// --- Scored result type ---
interface ScoredResult {
  score: number;
  courseName: string;
  chapterTitle: string;
  passage: string;
  source: 'course' | 'chapter' | 'summary';
}

// --- Search across all available content ---
function searchContent(keywords: string[], courseId?: number): ScoredResult[] {
  const results: ScoredResult[] = [];

  const courses = courseId ? [getCourse(courseId)].filter(Boolean) as Course[] : getAllCourses();

  for (const course of courses) {
    // Score course content
    const courseScore = scoreText(course.title + ' ' + course.content, keywords);
    if (courseScore > 0) {
      results.push({
        score: courseScore,
        courseName: course.title,
        chapterTitle: '',
        passage: extractPassage(course.content, keywords),
        source: 'course',
      });
    }

    // Score chapters
    const chapters = getChaptersByCourse(course.id);
    for (const chapter of chapters) {
      const chScore = scoreText(chapter.title + ' ' + chapter.content, keywords);
      if (chScore > 0) {
        results.push({
          score: chScore,
          courseName: course.title,
          chapterTitle: chapter.title,
          passage: extractPassage(chapter.content, keywords),
          source: 'chapter',
        });
      }

      // Score summaries (fiches)
      for (const sType of ['resume', 'memo'] as const) {
        const summary = getSummaryByChapter(chapter.id, sType);
        if (summary && summary.content) {
          const sScore = scoreText(summary.content, keywords);
          if (sScore > 0) {
            results.push({
              score: sScore + 2, // Bonus: summaries are already pedagogical
              courseName: course.title,
              chapterTitle: chapter.title + ` (fiche ${sType === 'resume' ? 'de revision' : 'memo'})`,
              passage: extractPassage(summary.content, keywords, 800),
              source: 'summary',
            });
          }
        }
      }
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results;
}

// --- Format response depending on intent ---
function formatResponse(intent: Intent, results: ScoredResult[]): string {
  if (results.length === 0) {
    return `Je n'ai pas trouve de contenu pertinent dans tes cours pour cette question.\n\n**Suggestions :**\n- Essaie de reformuler ta question avec d'autres mots-cles\n- Verifie que le cours correspondant a bien ete importe\n- Pose une question plus specifique sur un sujet de ton cours`;
  }

  const keywords = intent.keywords;
  const topResults = results.slice(0, 3); // Max 3 results

  let response = '';

  switch (intent.type) {
    case 'definition': {
      response += `## Definition\n\n`;
      const best = topResults[0];
      response += `D'apres le cours **${best.courseName}**`;
      if (best.chapterTitle) response += ` > ${best.chapterTitle}`;
      response += ` :\n\n`;
      response += `> ${highlightKeywords(best.passage, keywords)}\n\n`;
      if (topResults.length > 1) {
        response += `---\n\n### Voir aussi\n\n`;
        for (const r of topResults.slice(1)) {
          response += `- **${r.courseName}${r.chapterTitle ? ' > ' + r.chapterTitle : ''}** : ${highlightKeywords(r.passage.slice(0, 200), keywords)}...\n`;
        }
      }
      break;
    }

    case 'explanation': {
      response += `## Explication\n\n`;
      for (const r of topResults) {
        response += `### ${r.courseName}${r.chapterTitle ? ' > ' + r.chapterTitle : ''}\n\n`;
        response += `${highlightKeywords(r.passage, keywords)}\n\n`;
      }
      break;
    }

    case 'list': {
      response += `## Elements trouves\n\n`;
      for (const r of topResults) {
        response += `### ${r.courseName}${r.chapterTitle ? ' > ' + r.chapterTitle : ''}\n\n`;
        response += `${highlightKeywords(r.passage, keywords)}\n\n`;
      }
      break;
    }

    case 'example': {
      response += `## Exemples trouves dans tes cours\n\n`;
      for (const r of topResults) {
        response += `**${r.courseName}${r.chapterTitle ? ' > ' + r.chapterTitle : ''}** :\n\n`;
        response += `${highlightKeywords(r.passage, keywords)}\n\n`;
      }
      break;
    }

    case 'summary': {
      response += `## Resume\n\n`;
      // Prefer summary-sourced results
      const summaryResults = results.filter((r) => r.source === 'summary').slice(0, 2);
      const toShow = summaryResults.length > 0 ? summaryResults : topResults;
      for (const r of toShow) {
        response += `### ${r.courseName}${r.chapterTitle ? ' > ' + r.chapterTitle : ''}\n\n`;
        response += `${highlightKeywords(r.passage, keywords)}\n\n`;
      }
      break;
    }

    default: {
      // General
      response += `## Voici ce que j'ai trouve dans tes cours\n\n`;
      for (const r of topResults) {
        response += `### ${r.courseName}${r.chapterTitle ? ' > ' + r.chapterTitle : ''}\n\n`;
        response += `${highlightKeywords(r.passage, keywords)}\n\n`;
      }
      break;
    }
  }

  // Footer
  response += `\n---\n*Reponse generee a partir du contenu de tes cours (mode hors-ligne). Pour des explications plus detaillees, configure une cle API dans les parametres.*`;

  return response;
}

// ============================================================
// Main export
// ============================================================

/**
 * Smart chat engine — searches courses, chapters, and summaries
 * in the SQLite database to answer the user's question without
 * any external AI API.
 *
 * @param userMessage - The user's question / message
 * @param courseId - Optional: restrict search to a specific course
 * @returns A markdown-formatted answer string
 */
export function smartChat(userMessage: string, courseId?: number): string {
  // 1. Detect intent and extract keywords
  const intent = detectIntent(userMessage);

  // 2. If we have no usable keywords, try harder
  if (intent.keywords.length === 0) {
    // Use the full message minus very short words
    const fallbackKeywords = userMessage
      .toLowerCase()
      .replace(/[?!.,;:()«»"'\u2019\u2018]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3);

    if (fallbackKeywords.length === 0) {
      return `Bonjour ! Je suis ton assistant de revision. Pose-moi une question sur tes cours et je chercherai la reponse dans ton contenu.\n\n**Exemples de questions :**\n- Qu'est-ce que [concept] ?\n- Explique-moi [sujet]\n- Resume le chapitre sur [theme]\n- Quels sont les [elements] ?`;
    }

    intent.keywords = fallbackKeywords;
  }

  // 3. Search content
  const results = searchContent(intent.keywords, courseId);

  // 4. Format and return
  return formatResponse(intent, results);
}
