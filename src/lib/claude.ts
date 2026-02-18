import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const MODEL = 'claude-sonnet-4-20250514';

export async function generateSummary(chapterContent: string, chapterTitle: string, type: 'resume' | 'memo'): Promise<string> {
  const systemPrompt = type === 'resume'
    ? `Tu es un expert pédagogique. Génère une fiche de révision condensée et structurée en Markdown.
Règles :
- Extrais UNIQUEMENT les points essentiels, concepts clés, formules, définitions
- Hiérarchise : fondamental vs complémentaire
- Fais des liens entre concepts quand c'est pertinent
- Ajoute des exemples concrets quand ça aide à comprendre
- Utilise des listes à puces, du gras pour les termes clés, des encadrés
- PAS de copier-coller, fais une vraie analyse critique
- Réponds en français`
    : `Tu es un expert pédagogique. Génère des flashcards au format JSON pour du drilling mémoriel.
Règles :
- Chaque flashcard a un "recto" (question/concept) et un "verso" (réponse/définition)
- Couvre TOUS les concepts importants du chapitre
- Varie les types : définitions, formules, exemples, applications
- 10 à 20 flashcards par chapitre
- Réponds UNIQUEMENT avec un JSON array : [{"recto": "...", "verso": "..."}, ...]
- Réponds en français`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: `Chapitre : "${chapterTitle}"\n\nContenu :\n${chapterContent.slice(0, 12000)}`
    }],
  });

  const block = response.content[0];
  return block.type === 'text' ? block.text : '';
}

export async function generateQuiz(
  content: string,
  difficulty: string,
  count: number,
  types: string[]
): Promise<{ questions: GeneratedQuestion[] }> {
  const typesStr = types.join(', ');
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system: `Tu es un générateur de quiz pédagogique expert. Génère exactement ${count} questions de difficulté "${difficulty}".
Types autorisés : ${typesStr}.
Format JSON strict :
{
  "questions": [
    {
      "type": "qcm" | "vrai_faux" | "reponse_courte",
      "question": "...",
      "options": ["A", "B", "C", "D"] (uniquement pour qcm, 4 choix),
      "correct_answer": "la bonne réponse exacte",
      "explanation": "explication détaillée de pourquoi c'est la bonne réponse"
    }
  ]
}
Pour vrai_faux, options = ["Vrai", "Faux"].
Pour reponse_courte, options = [].
Réponds UNIQUEMENT avec le JSON, rien d'autre. En français.`,
    messages: [{
      role: 'user',
      content: `Génère un quiz basé sur ce contenu :\n\n${content.slice(0, 12000)}`
    }],
  });

  const block = response.content[0];
  const text = block.type === 'text' ? block.text : '{"questions":[]}';
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { questions: [] };
  }
}

export async function correctAnswer(question: string, userAnswer: string, correctAnswer: string): Promise<string> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: 'Tu es un correcteur pédagogique bienveillant. Évalue la réponse de l\'étudiant. Réponds en français.',
    messages: [{
      role: 'user',
      content: `Question : ${question}\nRéponse correcte : ${correctAnswer}\nRéponse de l'étudiant : ${userAnswer}\n\nEst-ce correct ? Explique brièvement.`
    }],
  });
  const block = response.content[0];
  return block.type === 'text' ? block.text : '';
}

export async function chat(
  messages: { role: 'user' | 'assistant'; content: string }[],
  courseContext?: string
): Promise<ReadableStream> {
  const systemPrompt = courseContext
    ? `Tu es un assistant de révision intelligent. Tu as accès au contenu suivant comme contexte prioritaire. Utilise-le pour répondre aux questions de l'étudiant. Si la question est hors-sujet par rapport au cours, réponds quand même mais précise-le.

Contexte du cours :
${courseContext.slice(0, 15000)}

Réponds en français, de manière claire et pédagogique. Utilise du Markdown pour structurer tes réponses.`
    : `Tu es un assistant de révision intelligent. Tu aides les étudiants à comprendre leurs cours, réviser, et préparer leurs examens. Réponds en français, de manière claire et pédagogique. Utilise du Markdown pour structurer tes réponses.`;

  const stream = await client.messages.stream({
    model: MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(new TextEncoder().encode(event.delta.text));
        }
      }
      controller.close();
    },
  });
}

export interface GeneratedQuestion {
  type: 'qcm' | 'vrai_faux' | 'reponse_courte';
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}
