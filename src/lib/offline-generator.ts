/**
 * Générateur de fiches de révision v3 — Esthétique et intelligent
 *
 * Objectif : chaque fiche doit ressembler à une vraie fiche de révision
 * comme on en trouve sur internet, avec :
 * - 10-15 notions clés surlignées
 * - Définitions claires
 * - Formules en évidence
 * - Aucun artefact PDF (copyright, pieds de page, etc.)
 */

// =============================================
// CONTENT CLEANING — Suppression artefacts PDF
// =============================================

function deepClean(text: string): string {
  let t = text;

  // Remove copyright / footer / header noise (specific to EM Normandie, CCMP, etc.)
  const junkPatterns = [
    /©\s*Tous droits réservés[^.\n]*/gi,
    /All rights reserved[^.\n]*/gi,
    /EM\s*Normandie\s*Business\s*School[^.\n]*/gi,
    /Indiquez votre nom dans le pied de page[^.\n]*/gi,
    /Copyright\s*CCMP[^.\n]*/gi,
    /Licence d'utilisation accordée[^.\n]*/gi,
    /© CCMP \d{4}[^.\n]*/gi,
    /SPECIMEN/gi,
    /PGE\s*Master\s*\d/gi,
    /^alinéa.*loi\s*du\s*\d+\s*mars\s*\d+[^.\n]*/gim,
    /«Toute représentation ou reproduction[^»]*»/gi,
    /le consentement de l'auteur[^.\n]*/gi,
    /Tous droits réservés[^.\n]*/gi,
    /All rights reserved[^.\n]*/gi,
  ];

  for (const p of junkPatterns) {
    t = t.replace(p, '');
  }

  // Remove page numbers
  t = t.replace(/^\s*\d+\s*$/gm, '');
  t = t.replace(/^\s*Page\s+\d+\s*$/gim, '');

  // Fix PDF word merging: "gestionqui" → "gestion qui"
  t = t.replace(/([a-zàâäéèêëïîôùûüÿç]{3,})([A-ZÀÂÄÉÈÊËÏÎÔÙÛÜŸ])/g, '$1 $2');

  // Remove excessive pipe tables
  t = t.replace(/(\|[^\n]*\|[\s]*\n){5,}/g, '\n[Tableau de données]\n');

  // Clean up whitespace
  t = t.replace(/[ \t]{3,}/g, ' ');
  t = t.replace(/\n{4,}/g, '\n\n');
  t = t.replace(/^\s+$/gm, '');

  return t.trim();
}

// =============================================
// RESUME GENERATOR
// =============================================

export function generateOfflineResume(content: string, title: string): string {
  const clean = deepClean(content);
  if (clean.length < 80) {
    return `# ⚠️ ${sanitizeTitle(title)}\n\n> Contenu insuffisant pour générer une fiche.\n`;
  }

  // Extract all elements
  const defs = findDefinitions(clean);
  const formulas = findFormulas(clean);
  const rules = findRules(clean);
  const concepts = findConcepts(clean);
  const keyItems = findKeyItems(clean);
  const lists = findLists(clean);
  const numbers = findNumbers(clean);
  const examples = findExamples(clean);
  const structure = findStructure(clean);
  const warnings = findWarnings(clean);

  // Build unified notions (deduplicated)
  const allNotions = mergeNotions(defs, concepts, rules, keyItems, formulas);

  // ── BUILD MARKDOWN ──
  let md = '';
  const ficheTitle = sanitizeTitle(title);

  // Header
  md += `# 📝 ${ficheTitle}\n\n`;
  md += `---\n\n`;

  // One-liner summary
  const brief = findBrief(clean);
  if (brief) {
    md += `> 💡 **En bref :** ${brief}\n\n`;
  }

  // ── NOTIONS CLÉS (target: 10-15) ──
  if (allNotions.length > 0) {
    md += `## 🎯 Notions clés à retenir\n\n`;
    for (const n of allNotions.slice(0, 18)) {
      md += `- **${n.term}** — ${n.text}\n`;
    }
    md += `\n`;
  }

  // ── DÉFINITIONS ──
  if (defs.length > 0) {
    md += `## 📖 Définitions\n\n`;
    for (const d of defs.slice(0, 10)) {
      md += `> **${d.term}** : ${d.text}\n\n`;
    }
  }

  // ── FORMULES ──
  if (formulas.length > 0) {
    md += `## 🔢 Formules\n\n`;
    for (const f of formulas.slice(0, 8)) {
      md += `- **${f.term}** = \`${f.text}\`\n`;
    }
    md += `\n`;
  }

  // ── RÈGLES / ARTICLES ──
  if (rules.length > 0) {
    md += `## ⚖️ Règles & Articles\n\n`;
    for (const r of rules.slice(0, 10)) {
      md += `- **${r.term}** : ${r.text}\n`;
    }
    md += `\n`;
  }

  // ── LISTES ──
  if (lists.length > 0) {
    for (const list of lists.slice(0, 3)) {
      md += `## 📋 ${list.title}\n\n`;
      for (let i = 0; i < list.items.length && i < 8; i++) {
        md += `${i + 1}. **${list.items[i]}**\n`;
      }
      md += `\n`;
    }
  }

  // ── CHIFFRES CLÉS ──
  if (numbers.length > 0) {
    md += `## 📊 Chiffres clés\n\n`;
    for (const n of numbers.slice(0, 6)) {
      md += `- **${n.value}** — ${n.context}\n`;
    }
    md += `\n`;
  }

  // ── EXEMPLES ──
  if (examples.length > 0) {
    md += `## 💡 Exemples\n\n`;
    for (const e of examples.slice(0, 4)) {
      md += `> ${e}\n\n`;
    }
  }

  // ── STRUCTURE DU COURS ──
  if (structure.length >= 3) {
    md += `## 🗂️ Plan\n\n`;
    for (const s of structure.slice(0, 10)) {
      md += `- **${s}**\n`;
    }
    md += `\n`;
  }

  // ── POINTS D'ATTENTION ──
  if (warnings.length > 0) {
    md += `## ⚠️ Attention\n\n`;
    for (const w of warnings.slice(0, 4)) {
      md += `- ${w}\n`;
    }
    md += `\n`;
  }

  // ── If too few items, add key sentences ──
  const totalItems = allNotions.length + defs.length + formulas.length + rules.length;
  if (totalItems < 5) {
    md += `## 📝 Points essentiels\n\n`;
    const sentences = getKeyParagraphs(clean);
    for (const s of sentences.slice(0, 12)) {
      md += `- ${s}\n`;
    }
    md += `\n`;
  }

  // ── Footer ──
  md += `---\n\n`;
  const conclusion = findConclusion(clean);
  if (conclusion) {
    md += `> 🧠 **À retenir :** ${conclusion}\n`;
  }

  return md.trim();
}

// =============================================
// FLASHCARD GENERATOR
// =============================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generateOfflineMemo(content: string, title: string): string {
  const clean = deepClean(content);
  if (clean.length < 80) return '[]';

  const cards: { recto: string; verso: string }[] = [];
  const used = new Set<string>();

  function addCard(q: string, a: string) {
    const key = q.toLowerCase().substring(0, 40);
    if (used.has(key) || a.length < 10 || q.length < 10) return;
    used.add(key);
    cards.push({ recto: q, verso: a });
  }

  // 1. From definitions
  for (const d of findDefinitions(clean).slice(0, 5)) {
    addCard(`Définissez **${d.term}**`, d.text);
  }

  // 2. From formulas
  for (const f of findFormulas(clean).slice(0, 4)) {
    addCard(`Donnez la formule de **${f.term}**`, f.text);
  }

  // 3. From concepts
  for (const c of findConcepts(clean).slice(0, 4)) {
    addCard(`Expliquez **${c.term}**`, c.text);
  }

  // 4. From rules
  for (const r of findRules(clean).slice(0, 3)) {
    addCard(`Que dit **${r.term}** ?`, r.text);
  }

  // 5. From lists
  for (const list of findLists(clean).slice(0, 2)) {
    if (list.items.length >= 3) {
      addCard(
        `Citez les ${list.items.length} ${list.title.toLowerCase()}`,
        list.items.map((it, i) => `${i + 1}. ${it}`).join('\n')
      );
    }
  }

  // 6. From key numbers
  for (const n of findNumbers(clean).slice(0, 2)) {
    addCard(`Quel chiffre retenir pour : ${n.context.substring(0, 60)} ?`, n.value);
  }

  // 7. Fill with Q/A from sentences if needed
  if (cards.length < 6) {
    for (const qa of generateQA(clean).slice(0, 10 - cards.length)) {
      addCard(qa.q, qa.a);
    }
  }

  // 8. Last resort: key paragraphs
  if (cards.length < 4) {
    for (const p of getKeyParagraphs(clean).slice(0, 6)) {
      const parts = p.split(/\s*[—–:]\s*/);
      if (parts.length >= 2 && parts[0].length < 50) {
        addCard(`Que signifie **${parts[0]}** ?`, parts.slice(1).join(' — '));
      }
    }
  }

  return JSON.stringify(cards.slice(0, 15));
}

// =============================================
// EXTRACTORS
// =============================================

interface Notion {
  term: string;
  text: string;
}

function findDefinitions(text: string): Notion[] {
  const defs: Notion[] = [];
  const seen = new Set<string>();
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length < 15) continue;

    // Pattern: "▪Term : something"  or "- Term : something"
    let m = line.match(/^[▪•\-]\s*(.{3,45}?)\s*[:：]\s*(.{20,})/);
    if (!m) {
      // Pattern: "Term : c'est / est / désigne / etc."
      m = line.match(/^(.{4,45}?)\s*[:：]\s*(?:c'est|est un[e]?|désigne|signifie|représente|correspond|se définit|consiste|permet de|vise à)\s+(.{15,})/i);
    }
    if (!m) {
      // Pattern: "Définition : ..."
      m = line.match(/^(?:Définition|Def\.?)\s*[:：]\s*(.{4,40}?)\s*[-–—:]\s*(.{15,})/i);
      if (!m) {
        const dm = line.match(/^(?:Définition|Def\.?)\s*[:：.]\s*(.{20,})/i);
        if (dm) {
          const def = sanitize(dm[1], 180);
          if (def.length > 15 && !seen.has('def')) {
            seen.add('def');
            defs.push({ term: 'Définition', text: def });
          }
          continue;
        }
      }
    }

    if (m) {
      const term = sanitize(m[1].replace(/^[▪•\-*]\s*/, ''), 50);
      const def = sanitize(m[2], 180);
      const key = term.toLowerCase();
      if (term.length >= 3 && def.length >= 15 && !seen.has(key) && !isJunk(term)) {
        seen.add(key);
        defs.push({ term, text: def });
      }
    }
  }

  return defs;
}

function findFormulas(text: string): Notion[] {
  const formulas: Notion[] = [];
  const seen = new Set<string>();

  for (const line of text.split('\n')) {
    const t = line.trim();

    // "Name = formula"
    const m = t.match(/^(.{3,45}?)\s*=\s*(.{5,80})$/);
    if (m && /[\d+\-×÷*/()%€]/.test(m[2])) {
      const name = sanitize(m[1].replace(/^[▪•\-]\s*/, ''), 45);
      const formula = m[2].trim();
      if (!seen.has(name.toLowerCase()) && !isJunk(name)) {
        seen.add(name.toLowerCase());
        formulas.push({ term: name, text: formula });
      }
    }

    // "Formule : ..."
    const fm = t.match(/^(?:Formule|FORMULE)\s*[:：.]\s*(.+)/i);
    if (fm) {
      formulas.push({ term: 'Formule', text: sanitize(fm[1], 100) });
    }
  }

  return formulas;
}

function findRules(text: string): Notion[] {
  const rules: Notion[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < text.split('\n').length; i++) {
    const line = text.split('\n')[i].trim();

    // "Article X : ..."
    let m = line.match(/^(Art(?:icle)?\.?\s*\d+[\w\-]*)\s*[-–—:]\s*(.{10,})/i);
    if (!m) m = line.match(/^(L\.?\s*\d+[-\d]*)\s*[-–—:]\s*(.{10,})/i);
    if (!m) m = line.match(/^(Règle|Principe|Théorème|Loi)\s*(?:\d+)?\s*[:：.]\s*(.{10,})/i);

    if (m) {
      const name = sanitize(m[1], 40);
      const content = sanitize(m[2], 180);
      if (!seen.has(name.toLowerCase()) && !isJunk(name)) {
        seen.add(name.toLowerCase());
        rules.push({ term: name, text: content });
      }
    }
  }

  return rules;
}

function findConcepts(text: string): Notion[] {
  const concepts: Notion[] = [];
  const seen = new Set<string>();

  // Sentences: "X est un/une Y"
  for (const sent of splitSentences(text)) {
    const m = sent.match(/^(.{5,50}?)\s+(?:est un[e]?|désigne|représente|constitue|correspond à)\s+(.{15,})/i);
    if (m) {
      const term = sanitize(m[1].replace(/^[▪•\-]\s*/, ''), 50);
      const expl = sanitize(m[2], 180);
      if (!seen.has(term.toLowerCase()) && !isJunk(term) && term.length > 3) {
        seen.add(term.toLowerCase());
        concepts.push({ term, text: expl });
      }
    }
  }

  return concepts;
}

function findKeyItems(text: string): Notion[] {
  const items: Notion[] = [];
  const seen = new Set<string>();

  for (const line of text.split('\n')) {
    const t = line.trim();

    // "1. Term : explanation" or "▪ Term : explanation"
    const m = t.match(/^(?:\d+[.)]\s+|[▪•\-►]\s*)(.{4,45}?)\s*[:：]\s*(.{15,})/);
    if (m) {
      const term = sanitize(m[1], 45);
      const expl = sanitize(m[2], 150);
      if (!seen.has(term.toLowerCase()) && !isJunk(term) && term.length > 3) {
        seen.add(term.toLowerCase());
        items.push({ term, text: expl });
      }
    }
  }

  return items;
}

function findLists(text: string): { title: string; items: string[] }[] {
  const results: { title: string; items: string[] }[] = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect list headers
    const header = line.match(/^(?:Les?\s+)?(?:\d+\s+)?(?:types?|catégories?|formes?|étapes?|phases?|composantes?|critères?|facteurs?|éléments?|avantages?|inconvénients?|objectifs?|fonctions?|outils?|méthodes?|principes?|caractéristiques?|conditions?|rôles?)\s+(?:de|du|des|d'|pour)\s+(.+)/i);

    if (header) {
      const title = sanitize(line, 55);
      const items: string[] = [];

      for (let j = i + 1; j < Math.min(i + 12, lines.length); j++) {
        const item = lines[j].trim();
        const im = item.match(/^(?:[▪•\-►➤]\s*|\d+[.)]\s+)(.{5,})/);
        if (im) {
          items.push(sanitize(im[1], 80));
        } else if (item === '' && items.length > 0) {
          break;
        } else if (item.match(/^[A-ZÉÈÊÀÂ]/) && items.length > 0) {
          break;
        }
      }

      if (items.length >= 3) {
        results.push({ title, items });
      }
    }
  }

  return results;
}

function findNumbers(text: string): { value: string; context: string }[] {
  const nums: { value: string; context: string }[] = [];
  const seen = new Set<string>();

  for (const sent of splitSentences(text)) {
    const m = sent.match(/(\d[\d\s,.]*\s*(?:%|€|euros?|ans?|jours?|mois|heures?|salariés?))/i);
    if (m) {
      const val = m[1].trim();
      if (!seen.has(val) && val.length < 20) {
        seen.add(val);
        nums.push({ value: val, context: sanitize(sent, 100) });
      }
    }
  }

  return nums;
}

function findExamples(text: string): string[] {
  const examples: string[] = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].trim().match(/^(?:Exemple|EXEMPLE|Ex\.?|Par exemple|Illustration)\s*[:：.,]\s*(.+)/i);
    if (m) {
      let ex = m[1].trim();
      // Grab continuation lines
      for (let j = 1; j <= 2 && i + j < lines.length; j++) {
        const next = lines[i + j].trim();
        if (next.length > 10 && !next.match(/^[A-ZÉÈÊ\d#▪•\-]/)) {
          ex += ' ' + next;
        } else break;
      }
      examples.push(sanitize(ex, 220));
      if (examples.length >= 5) break;
    }
  }

  return examples;
}

function findStructure(text: string): string[] {
  const titles: string[] = [];
  const patterns = [
    /^#{1,3}\s+(.{5,60})/,
    /^(\d+\.)\s+([A-ZÀ-Ü].{5,55})$/,
    /^(\d+\.\d+\.?)\s+([A-ZÀ-Ü].{5,55})$/,
    /^([IVXLC]+\.)\s+(.{5,55})$/,
  ];

  for (const line of text.split('\n')) {
    const t = line.trim();
    for (const p of patterns) {
      const m = t.match(p);
      if (m) {
        const title = (m[2] || m[1]).replace(/^#+\s*/, '').trim();
        if (title.length > 4 && !isJunk(title)) {
          titles.push(sanitize(title, 55));
        }
        break;
      }
    }
  }

  // Deduplicate
  return Array.from(new Set(titles));
}

function findWarnings(text: string): string[] {
  const warnings: string[] = [];
  for (const line of text.split('\n')) {
    const m = line.trim().match(/^(?:Attention|ATTENTION|Important|IMPORTANT|N\.?B\.?|Remarque|À noter|À retenir)\s*[:：.!]\s*(.{15,})/i);
    if (m) {
      warnings.push(sanitize(m[1], 180));
    }
  }
  return warnings;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function findBrief(text: string): string | null {
  const sentences = splitSentences(text);

  // Try to find an overview sentence
  for (const s of sentences.slice(0, 20)) {
    if (s.length > 35 && s.length < 180) {
      if (/(?:objectif|but|cours|chapitre|partie|thème|introduction|abord|étudi|présent|apprendre|comprendre|savoir|maîtris)/i.test(s)) {
        return sanitize(s, 180);
      }
    }
  }

  // Fallback: first good sentence that's not junk
  for (const s of sentences.slice(0, 10)) {
    if (s.length > 30 && s.length < 180 && !isJunk(s)) {
      return sanitize(s, 180);
    }
  }

  return null;
}

function findConclusion(text: string): string | null {
  const lines = text.split('\n');

  // Look for explicit conclusion
  for (let i = lines.length - 1; i >= Math.max(0, lines.length - 15); i--) {
    if (/^(?:Conclusion|En résumé|À retenir|Synthèse)/i.test(lines[i].trim())) {
      const next = lines.slice(i + 1, i + 4).map(l => l.trim()).filter(l => l.length > 10 && !isJunk(l)).join(' ');
      if (next.length > 20) return sanitize(next, 180);
    }
  }

  // Last meaningful sentence
  const sentences = splitSentences(text).filter(s => s.length > 25 && s.length < 180 && !isJunk(s));
  return sentences.length > 0 ? sanitize(sentences[sentences.length - 1], 180) : null;
}

function mergeNotions(
  defs: Notion[], concepts: Notion[], rules: Notion[],
  keyItems: Notion[], formulas: Notion[]
): Notion[] {
  const notions: Notion[] = [];
  const seen = new Set<string>();

  const allSources = [defs, concepts, rules, keyItems, formulas];
  for (const source of allSources) {
    for (const item of source) {
      const key = item.term.toLowerCase().substring(0, 30);
      if (!seen.has(key)) {
        seen.add(key);
        notions.push({ term: item.term, text: sanitize(item.text, 120) });
      }
    }
  }

  return notions;
}

function generateQA(text: string): { q: string; a: string }[] {
  const qas: { q: string; a: string }[] = [];

  for (const s of splitSentences(text)) {
    if (s.length < 25 || s.length > 250) continue;

    // "X est/sont/permet Y" → "Qu'est-ce que X?"
    const m = s.match(/^(.{6,45}?)\s+(?:est|sont|désigne|représente|constitue|permet|consiste|vise)\s+(.{15,})/i);
    if (m && !isJunk(m[1])) {
      qas.push({
        q: `Que signifie **${sanitize(m[1], 45)}** ?`,
        a: sanitize(m[2], 180),
      });
    }

    // "Il existe X types de Y"
    const tm = s.match(/(?:il\s+existe|on\s+distingue)\s+(\d+)\s+(?:types?|catégories?|formes?)\s+(?:de|d')\s+(.+)/i);
    if (tm) {
      qas.push({
        q: `Combien de types de **${sanitize(tm[2], 40)}** ?`,
        a: `${tm[1]} types`,
      });
    }

    if (qas.length >= 10) break;
  }

  return qas;
}

function getKeyParagraphs(text: string): string[] {
  return splitSentences(text)
    .filter(s => s.length > 25 && s.length < 220 && !isJunk(s))
    .map(s => sanitize(s, 180))
    .slice(0, 15);
}

// =============================================
// UTILITIES
// =============================================

function splitSentences(text: string): string[] {
  return text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);
}

function sanitizeTitle(title: string): string {
  return title
    .replace(/^(Section|Contenu complet|Chapitre|Feuil\d+)\s*\d*\s*[-–—:]?\s*/i, '')
    .replace(/^SECTION\s*\d+\s*[-–—:]?\s*/i, '')
    .trim() || title;
}

function sanitize(str: string, maxLen: number): string {
  const s = str
    .replace(/\s+/g, ' ')
    .replace(/©[^.]*/, '')
    .replace(/EM\s*Normandie[^.]*/, '')
    .replace(/Tous droits réservés[^.]*/, '')
    .replace(/All rights reserved[^.]*/, '')
    .trim();

  if (s.length <= maxLen) return s;
  return s.substring(0, maxLen - 3).replace(/\s+\S*$/, '') + '...';
}

function isJunk(text: string): boolean {
  const junkWords = [
    'normandie', 'business school', 'copyright', 'ccmp', 'specimen',
    'droits réservés', 'all rights', 'pied de page', 'indiquez votre',
    'licence d\'utilisation', 'reproduction', 'consentement',
  ];
  const lower = text.toLowerCase();
  return junkWords.some(w => lower.includes(w));
}
