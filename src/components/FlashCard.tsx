'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';

interface FlashCardItem {
  recto: string;
  verso: string;
}

interface FlashCardProps {
  cards: FlashCardItem[];
  accentColor?: string;
}

export default function FlashCard({ cards, accentColor = '#06b6d4' }: FlashCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-zinc-500">
        Aucune flashcard disponible.
      </div>
    );
  }

  const card = cards[currentIndex];

  function handleFlip() {
    setIsFlipped((prev) => !prev);
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }

  function handleNext() {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handleReset() {
    setIsFlipped(false);
    setCurrentIndex(0);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Compteur */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-400">
          Carte{' '}
          <span className="text-cyan-400 font-semibold">{currentIndex + 1}</span>
          {' / '}
          <span className="text-zinc-300">{cards.length}</span>
        </span>
        <button
          onClick={handleReset}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          title="Revenir au debut"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Barre de progression */}
      <div className="w-full max-w-lg h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / cards.length) * 100}%`,
            backgroundColor: accentColor,
          }}
        />
      </div>

      {/* Carte flip 3D */}
      <div
        className="perspective-1000 w-full max-w-lg cursor-pointer"
        onClick={handleFlip}
      >
        <div
          className={`preserve-3d relative w-full transition-transform duration-500 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{ minHeight: '280px' }}
        >
          {/* Recto */}
          <div className="backface-hidden absolute inset-0 bg-zinc-800 border border-zinc-700 rounded-2xl p-8 flex flex-col items-center justify-center">
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-4">Question</p>
            <p className="text-lg text-zinc-100 text-center leading-relaxed font-medium">
              {card.recto}
            </p>
            <p className="text-xs text-zinc-600 mt-6">Cliquez pour retourner</p>
          </div>

          {/* Verso */}
          <div
            className="backface-hidden rotate-y-180 absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center border"
            style={{
              backgroundColor: `${accentColor}10`,
              borderColor: `${accentColor}30`,
            }}
          >
            <p
              className="text-xs uppercase tracking-wider mb-4"
              style={{ color: accentColor }}
            >
              Reponse
            </p>
            <p className="text-lg text-zinc-100 text-center leading-relaxed">
              {card.verso}
            </p>
            <p className="text-xs text-zinc-600 mt-6">Cliquez pour retourner</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          icon={<ChevronLeft size={16} />}
        >
          Precedente
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          icon={<ChevronRight size={16} />}
        >
          Suivante
        </Button>
      </div>
    </div>
  );
}
