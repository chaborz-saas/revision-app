import fs from 'fs';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

const COURS_DIR = path.join(process.cwd(), 'cours');

const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.ppt', '.xlsx', '.xls'];

export interface ParsedPDF {
  title: string;
  filePath: string;
  rawText: string;
  pageCount: number;
  chapters: { title: string; content: string }[];
}

export async function scanCoursFolder(): Promise<string[]> {
  if (!fs.existsSync(COURS_DIR)) {
    fs.mkdirSync(COURS_DIR, { recursive: true });
    return [];
  }
  return scanDir(COURS_DIR);
}

function scanDir(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...scanDir(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

export async function parsePDF(filePath: string): Promise<ParsedPDF> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.docx') {
    return parseDocx(filePath);
  } else if (ext === '.pptx' || ext === '.ppt') {
    return parsePptx(filePath);
  } else if (ext === '.xlsx' || ext === '.xls') {
    return parseXlsx(filePath);
  } else {
    return parsePdfFile(filePath);
  }
}

async function parsePdfFile(filePath: string): Promise<ParsedPDF> {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);

  const rawText = data.text || '';
  const title = extractTitle(filePath, rawText);
  const chapters = extractChapters(rawText);

  return {
    title,
    filePath,
    rawText,
    pageCount: data.numpages || 0,
    chapters: chapters.length > 0 ? chapters : [{ title: 'Contenu complet', content: rawText }],
  };
}

async function parseDocx(filePath: string): Promise<ParsedPDF> {
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  const rawText = result.value || '';
  const title = extractTitle(filePath, rawText);
  const chapters = extractChapters(rawText);

  return {
    title,
    filePath,
    rawText,
    pageCount: Math.ceil(rawText.length / 3000),
    chapters: chapters.length > 0 ? chapters : [{ title: 'Contenu complet', content: rawText }],
  };
}

async function parsePptx(filePath: string): Promise<ParsedPDF> {
  // For PPT/PPTX, try mammoth first (works for some), fallback to raw text extraction
  try {
    const buffer = fs.readFileSync(filePath);
    // Try mammoth (works for docx-like pptx)
    const result = await mammoth.extractRawText({ buffer });
    if (result.value && result.value.trim().length > 50) {
      const rawText = result.value;
      const title = extractTitle(filePath, rawText);
      const chapters = extractChapters(rawText);
      return {
        title,
        filePath,
        rawText,
        pageCount: Math.ceil(rawText.length / 3000),
        chapters: chapters.length > 0 ? chapters : [{ title: 'Contenu complet', content: rawText }],
      };
    }
  } catch {
    // mammoth can't handle this pptx, continue with fallback
  }

  // Fallback: extract what we can from the file name
  const title = extractTitle(filePath, '');
  return {
    title,
    filePath,
    rawText: `Présentation: ${title}. Ce fichier PowerPoint n'a pas pu être entièrement parsé. Consultez le fichier original pour le contenu complet.`,
    pageCount: 0,
    chapters: [{ title: title, content: `Présentation: ${title}` }],
  };
}

async function parseXlsx(filePath: string): Promise<ParsedPDF> {
  const workbook = XLSX.readFile(filePath);
  const sheets: { title: string; content: string }[] = [];
  let fullText = '';

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(sheet, { FS: ' | ', RS: '\n' });
    if (csv.trim().length > 10) {
      sheets.push({ title: sheetName, content: csv });
      fullText += `\n\n--- ${sheetName} ---\n${csv}`;
    }
  }

  const title = extractTitle(filePath, '');
  return {
    title,
    filePath,
    rawText: fullText.trim(),
    pageCount: sheets.length,
    chapters: sheets.length > 0 ? sheets : [{ title: title, content: fullText || 'Fichier Excel vide' }],
  };
}

function extractTitle(filePath: string, rawText: string): string {
  const ext = path.extname(filePath);
  const fileName = path.basename(filePath, ext);
  const cleanName = fileName
    .replace(/[-_]/g, ' ')
    .replace(/\s*\(\d+\)\s*/g, '')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();

  if (rawText) {
    const firstLines = rawText.split('\n').filter(l => l.trim()).slice(0, 5).join(' ').trim();
    if (firstLines.length > 5 && firstLines.length < 100) {
      return firstLines.replace(/\s+/g, ' ').trim();
    }
  }

  return cleanName;
}

function extractChapters(text: string): { title: string; content: string }[] {
  const chapters: { title: string; content: string }[] = [];
  const lines = text.split('\n');

  const chapterPatterns = [
    /^(Chapitre|CHAPITRE|Chapter|CHAPTER)\s+(\d+|[IVXLC]+)\s*[:\-–—.]?\s*(.*)/i,
    /^(\d+)\.\s+([A-Z\À-Ü][\w\s\-'']{3,80})$/,
    /^(Partie|PARTIE|Part|PART)\s+(\d+|[IVXLC]+)\s*[:\-–—.]?\s*(.*)/i,
    /^(Section|SECTION)\s+(\d+\.?\d*)\s*[:\-–—.]?\s*(.*)/i,
    /^([IVXLC]+)\.\s+([A-Z\À-Ü][\w\s\-'']{3,80})$/,
    /^(Module|MODULE|Thème|THÈME|Leçon|LEÇON)\s+(\d+)\s*[:\-–—.]?\s*(.*)/i,
  ];

  const chapterStarts: { index: number; title: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    for (const pattern of chapterPatterns) {
      const match = line.match(pattern);
      if (match) {
        const title = match[3] ? `${match[1]} ${match[2]} - ${match[3]}`.trim() : line.trim();
        chapterStarts.push({ index: i, title });
        break;
      }
    }
  }

  if (chapterStarts.length === 0) {
    const chunkSize = Math.ceil(lines.length / Math.max(1, Math.ceil(lines.length / 200)));
    for (let i = 0; i < lines.length; i += chunkSize) {
      const chunk = lines.slice(i, i + chunkSize);
      const content = chunk.join('\n').trim();
      if (content.length > 50) {
        chapters.push({
          title: `Section ${chapters.length + 1}`,
          content,
        });
      }
    }
    return chapters;
  }

  for (let i = 0; i < chapterStarts.length; i++) {
    const start = chapterStarts[i].index;
    const end = i + 1 < chapterStarts.length ? chapterStarts[i + 1].index : lines.length;
    const content = lines.slice(start, end).join('\n').trim();
    chapters.push({
      title: chapterStarts[i].title,
      content,
    });
  }

  return chapters;
}

export function formatContentToMarkdown(content: string): string {
  let formatted = content;

  formatted = formatted.replace(/^(Chapitre|CHAPITRE|Chapter)\s+(\d+|[IVXLC]+)\s*[:\-–—.]?\s*(.+)$/gm, '# $1 $2 — $3');
  formatted = formatted.replace(/^(\d+)\.\s+([A-Z\À-Ü][\w\s\-'']{3,80})$/gm, '## $1. $2');
  formatted = formatted.replace(/^(\d+\.\d+)\s+(.+)$/gm, '### $1 $2');

  formatted = formatted.replace(/^[•●◦▪▸]\s*(.+)$/gm, '- $1');
  formatted = formatted.replace(/^[-–—]\s+(.+)$/gm, '- $1');

  formatted = formatted.replace(/(Définition|Théorème|Remarque|Exemple|Important|Note|Attention)\s*[:：]/gi, '**$1** :');

  formatted = formatted.replace(/\n{4,}/g, '\n\n\n');

  return formatted;
}
