import { NextRequest } from 'next/server';
import { getCourse, getChaptersByCourse, insertChatMessage } from '@/lib/db';
import { chat } from '@/lib/claude';
import { smartChat } from '@/lib/smart-chat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, courseId, sessionId } = body as {
      messages: { role: 'user' | 'assistant'; content: string }[];
      courseId?: number;
      sessionId: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'sessionId requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Save the user message to DB
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'user') {
      try {
        insertChatMessage({
          session_id: sessionId,
          role: 'user',
          content: lastMessage.content,
          course_id: courseId ?? null,
        });
      } catch (dbError) {
        console.error('Erreur sauvegarde message user:', dbError);
      }
    }

    // Build course context if courseId provided
    let courseContext: string | undefined;
    if (courseId) {
      try {
        const course = getCourse(courseId);
        if (course) {
          const chapters = getChaptersByCourse(courseId);
          const chaptersContent = chapters
            .map((ch) => `## ${ch.title}\n${ch.content}`)
            .join('\n\n');
          courseContext = `# ${course.title}\nMatiere: ${course.subject}\n\n${course.content}\n\n${chaptersContent}`;
        }
      } catch (ctxError) {
        console.error('Erreur chargement contexte cours:', ctxError);
      }
    }

    // Check if API key has credits before even trying
    const hasApiKey = !!(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.length > 10);
    let useOffline = !hasApiKey;

    if (hasApiKey && !useOffline) {
      try {
        const stream = await chat(messages, courseContext);

        // Use TransformStream to capture full text while streaming to client
        let fullText = '';
        const transformStream = new TransformStream({
          transform(chunk, controller) {
            const text = new TextDecoder().decode(chunk);
            fullText += text;
            controller.enqueue(chunk);
          },
          flush() {
            try {
              if (fullText.trim()) {
                insertChatMessage({
                  session_id: sessionId,
                  role: 'assistant',
                  content: fullText,
                  course_id: courseId ?? null,
                });
              }
            } catch (dbError) {
              console.error('Erreur sauvegarde message assistant:', dbError);
            }
          },
        });

        const responseStream = stream.pipeThrough(transformStream);

        return new Response(responseStream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'Transfer-Encoding': 'chunked',
          },
        });
      } catch (apiError) {
        console.warn('Claude API indisponible, fallback offline:', apiError);
        useOffline = true;
      }
    }

    if (useOffline) {
      // Claude API failed (no credits, no API key, network error, etc.)
      // Fallback to local smartChat engine
      console.warn('Mode hors-ligne activé (pas de clé API ou crédits insuffisants)');

      const userQuestion = lastMessage.role === 'user' ? lastMessage.content : messages.filter((m) => m.role === 'user').pop()?.content ?? '';
      const fallbackResponse = smartChat(userQuestion, courseId);

      // Save assistant message to DB
      try {
        insertChatMessage({
          session_id: sessionId,
          role: 'assistant',
          content: fallbackResponse,
          course_id: courseId ?? null,
        });
      } catch (dbError) {
        console.error('Erreur sauvegarde message assistant (fallback):', dbError);
      }

      // Stream the fallback response the same way (simulate streaming with chunks)
      const encoder = new TextEncoder();
      const fallbackStream = new ReadableStream({
        start(controller) {
          // Send in small chunks to simulate streaming for the frontend
          const words = fallbackResponse.split(' ');
          let i = 0;
          const chunkSize = 3; // Send 3 words at a time

          function pushChunk() {
            if (i >= words.length) {
              controller.close();
              return;
            }
            const chunk = words.slice(i, i + chunkSize).join(' ') + (i + chunkSize < words.length ? ' ' : '');
            controller.enqueue(encoder.encode(chunk));
            i += chunkSize;
            // Use a tiny delay-like pattern by enqueuing all at once
            // (actual delay not possible in ReadableStream start, but
            //  the chunked transfer will create a natural streaming effect)
            pushChunk();
          }

          pushChunk();
        },
      });

      return new Response(fallbackStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Transfer-Encoding': 'chunked',
        },
      });
    }
  } catch (error) {
    console.error('Erreur API chat:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
