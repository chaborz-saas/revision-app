'use client';

import type { Chapter } from '@/lib/db';

interface ChapterNavProps {
  chapters: Chapter[];
  activeIndex: number;
  onSelect: (index: number) => void;
  accentColor?: string;
}

export default function ChapterNav({ chapters, activeIndex, onSelect, accentColor = '#06b6d4' }: ChapterNavProps) {
  return (
    <nav className="w-full">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">
        Chapitres ({chapters.length})
      </h3>
      <ul className="space-y-0.5">
        {chapters.map((chapter, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={chapter.id}>
              <button
                onClick={() => onSelect(index)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-start gap-2.5 ${
                  isActive
                    ? 'text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
                style={isActive ? { backgroundColor: `${accentColor}15`, color: accentColor } : undefined}
              >
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold mt-0.5 ${
                    isActive ? 'text-white' : 'bg-zinc-800 text-zinc-500'
                  }`}
                  style={isActive ? { backgroundColor: accentColor } : undefined}
                >
                  {index + 1}
                </span>
                <span className="line-clamp-2 leading-snug">{chapter.title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
