'use client';

import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

function renderMarkdown(text: string): string {
  let html = text;

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const langLabel = lang ? `<span class="text-xs text-zinc-500 block mb-1">${lang}</span>` : '';
    return `<pre class="bg-zinc-950 border border-zinc-700 rounded-lg p-3 my-2 overflow-x-auto text-sm">${langLabel}<code class="text-cyan-300">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-zinc-800 text-cyan-300 px-1.5 py-0.5 rounded text-sm">$1</code>');

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-zinc-200 mt-3 mb-1">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-zinc-100 mt-4 mb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-zinc-100 mt-4 mb-2">$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="text-cyan-400 font-semibold"><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-cyan-400 font-semibold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="italic text-zinc-300">$1</em>');

  // Unordered lists
  html = html.replace(/^[\t ]*[-*] (.+)$/gm, '<li class="ml-4 list-disc text-zinc-300">$1</li>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\n?)+)/g, '<ul class="my-2 space-y-0.5">$1</ul>');

  // Ordered lists
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-zinc-300" value="$1">$2</li>');

  // Blockquote
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-cyan-500 pl-3 italic text-zinc-400 my-2">$1</blockquote>');

  // Paragraphs: wrap remaining lines that aren't already HTML
  html = html.replace(/^(?!<[a-z])((?!<\/?\w).+)$/gm, (match) => {
    const trimmed = match.trim();
    if (!trimmed) return '';
    return `<p class="text-zinc-300 leading-relaxed mb-1">${trimmed}</p>`;
  });

  // Clean up empty lines
  html = html.replace(/\n{3,}/g, '\n\n');

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-cyan-600/20 text-cyan-400'
            : 'bg-zinc-700 text-zinc-300'
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 ${
          isUser
            ? 'bg-cyan-600/20 border border-cyan-600/30'
            : 'bg-zinc-800 border border-zinc-700'
        }`}
      >
        {isUser ? (
          <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        ) : (
          <div
            className="text-sm leading-relaxed chat-markdown"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}

        {timestamp && (
          <p className={`text-[10px] mt-2 ${isUser ? 'text-cyan-600/60 text-right' : 'text-zinc-600'}`}>
            {formatTime(timestamp)}
          </p>
        )}
      </div>
    </div>
  );
}
