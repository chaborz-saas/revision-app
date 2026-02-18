import { NextRequest } from 'next/server';
import { scanCoursFolder, parsePDF } from '@/lib/pdf-parser';
import { courseExistsByPath, insertCourse, insertChapter } from '@/lib/db';
import { getSubjectColor } from '@/styles/theme';

export const dynamic = 'force-dynamic';

function guessSubject(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();

  const subjectMap: Record<string, string[]> = {
    'Mathematiques': ['mathematique', 'mathématique', 'algebre', 'algèbre', 'géométrie', 'geometrie', 'calcul', 'equation', 'équation', 'fonction', 'theoreme', 'théorème', 'probabilite', 'probabilité', 'statistique', 'derivee', 'dérivée', 'integrale', 'intégrale', 'matrice'],
    'Physique': ['physique', 'mecanique', 'mécanique', 'thermodynamique', 'optique', 'electricite', 'électricité', 'magnetisme', 'magnétisme', 'force', 'energie', 'énergie', 'newton', 'gravitation'],
    'Chimie': ['chimie', 'molecule', 'molécule', 'atome', 'reaction', 'réaction', 'acide', 'base', 'oxydation', 'ion', 'solution', 'concentration', 'ph'],
    'SVT': ['biologie', 'geologie', 'géologie', 'cellule', 'adn', 'genetique', 'génétique', 'evolution', 'évolution', 'ecosysteme', 'écosystème', 'organisme', 'photosynthese', 'photosynthèse'],
    'Histoire': ['histoire', 'guerre', 'revolution', 'révolution', 'empire', 'republique', 'république', 'siecle', 'siècle', 'monarchie', 'democratie', 'démocratie', 'civilisation'],
    'Geographie': ['geographie', 'géographie', 'territoire', 'population', 'urbanisation', 'mondialisation', 'climat', 'environnement', 'amenagement', 'aménagement'],
    'Philosophie': ['philosophie', 'conscience', 'liberte', 'liberté', 'morale', 'ethique', 'éthique', 'raison', 'verite', 'vérité', 'descartes', 'kant', 'platon', 'existentialisme'],
    'Francais': ['francais', 'français', 'litterature', 'littérature', 'grammaire', 'conjugaison', 'orthographe', 'roman', 'poesie', 'poésie', 'theatre', 'théâtre', 'dissertation', 'commentaire'],
    'Anglais': ['anglais', 'english', 'grammar', 'vocabulary', 'tense', 'present', 'past', 'future', 'conditional'],
    'Economie': ['economie', 'économie', 'marche', 'marché', 'entreprise', 'croissance', 'inflation', 'chomage', 'chômage', 'pib', 'monnaie', 'commerce'],
    'Informatique': ['informatique', 'algorithme', 'programmation', 'python', 'javascript', 'base de donnees', 'reseau', 'réseau', 'binaire', 'web'],
    'Droit': ['droit', 'juridique', 'loi', 'constitution', 'contrat', 'penal', 'pénal', 'civil', 'tribunal'],
  };

  for (const [subject, keywords] of Object.entries(subjectMap)) {
    const matches = keywords.filter(kw => text.includes(kw));
    if (matches.length >= 2) return subject;
  }

  for (const [subject, keywords] of Object.entries(subjectMap)) {
    if (keywords.some(kw => text.includes(kw))) return subject;
  }

  return 'Cours';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  const encoder = new TextEncoder();
  let colorIndex = 0;

  try {
    const existingColors = new Set<number>();

    const stream = new ReadableStream({
      async start(controller) {
        function sendEvent(data: Record<string, unknown>) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        }

        try {
          sendEvent({ status: 'scanning', message: 'Scan du dossier cours/...' });

          const pdfFiles = await scanCoursFolder();

          if (pdfFiles.length === 0) {
            sendEvent({
              status: 'empty',
              message: 'Aucun fichier PDF trouve dans le dossier cours/. Place tes PDF dans le dossier cours/ a la racine du projet.',
              total: 0,
              current: 0,
            });
            controller.close();
            return;
          }

          const toImport: string[] = [];
          for (const filePath of pdfFiles) {
            const exists = courseExistsByPath(filePath);
            if (!exists) {
              toImport.push(filePath);
            }
          }

          if (toImport.length === 0) {
            sendEvent({
              status: 'done',
              message: 'Tous les cours sont deja importes.',
              total: pdfFiles.length,
              current: pdfFiles.length,
              imported: 0,
              skipped: pdfFiles.length,
            });
            controller.close();
            return;
          }

          sendEvent({
            status: 'importing',
            message: `${toImport.length} nouveau(x) PDF a importer sur ${pdfFiles.length} trouve(s).`,
            total: toImport.length,
            current: 0,
          });

          let imported = 0;
          const errors: string[] = [];

          for (let i = 0; i < toImport.length; i++) {
            const filePath = toImport[i];
            const fileName = filePath.split(/[\\/]/).pop() || filePath;

            sendEvent({
              status: 'importing',
              message: `Import de ${fileName}...`,
              total: toImport.length,
              current: i,
              currentFile: fileName,
            });

            try {
              const parsed = await parsePDF(filePath);
              const subject = guessSubject(parsed.title, parsed.rawText);

              while (existingColors.has(colorIndex)) {
                colorIndex++;
              }
              const color = getSubjectColor(colorIndex);
              existingColors.add(colorIndex);
              colorIndex++;

              const result = insertCourse({
                title: parsed.title,
                subject,
                content: parsed.rawText,
                chapter_count: parsed.chapters.length,
                page_count: parsed.pageCount,
                color,
                tag: 'Cours',
                file_path: filePath,
              });

              const courseId = Number(result.lastInsertRowid);

              for (let j = 0; j < parsed.chapters.length; j++) {
                const chapter = parsed.chapters[j];
                insertChapter({
                  course_id: courseId,
                  title: chapter.title,
                  content: chapter.content,
                  order_index: j,
                });
              }

              imported++;

              sendEvent({
                status: 'importing',
                message: `${fileName} importe avec succes (${parsed.chapters.length} chapitres).`,
                total: toImport.length,
                current: i + 1,
                currentFile: fileName,
              });
            } catch (err) {
              const errMsg = err instanceof Error ? err.message : 'Erreur inconnue';
              errors.push(`${fileName}: ${errMsg}`);
              sendEvent({
                status: 'error_file',
                message: `Erreur lors de l'import de ${fileName}: ${errMsg}`,
                total: toImport.length,
                current: i + 1,
                currentFile: fileName,
              });
            }
          }

          sendEvent({
            status: 'done',
            message: `Import termine. ${imported} cours importe(s)${errors.length > 0 ? `, ${errors.length} erreur(s)` : ''}.`,
            total: toImport.length,
            current: toImport.length,
            imported,
            errors: errors.length > 0 ? errors : undefined,
            skipped: pdfFiles.length - toImport.length,
          });
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : 'Erreur inconnue';
          sendEvent({
            status: 'error',
            message: `Erreur critique: ${errMsg}`,
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Erreur inconnue';
    return new Response(
      JSON.stringify({ error: errMsg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
