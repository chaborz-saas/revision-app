'use client';

import { useState } from 'react';
import { Check, X, Send, Lightbulb } from 'lucide-react';
import Button from '@/components/ui/Button';

interface QuizQuestionProps {
  question: string;
  type: 'qcm' | 'vrai_faux' | 'reponse_courte';
  options: string[];
  onAnswer: (answer: string) => void;
  showResult: boolean;
  isCorrect: boolean | null;
  explanation: string;
  correctAnswer?: string;
  disabled?: boolean;
}

function generateHints(correctAnswer: string, explanation: string, type: string, options: string[]): string[] {
  const hints: string[] = [];

  if (type === 'qcm' && options.length > 2) {
    // Indice 1: Éliminer une mauvaise réponse
    const wrongOptions = options.filter(o => o.toLowerCase() !== correctAnswer.toLowerCase());
    if (wrongOptions.length > 0) {
      const eliminated = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      hints.push(`❌ Tu peux éliminer : "${eliminated}"`);
    }
    // Indice 2: Première lettre
    hints.push(`🔤 La bonne réponse commence par "${correctAnswer.charAt(0).toUpperCase()}..."`);
    // Indice 3: Nombre de mots
    const wordCount = correctAnswer.split(/\s+/).length;
    hints.push(`📏 La réponse contient ${wordCount} mot${wordCount > 1 ? 's' : ''}`);
  } else if (type === 'vrai_faux') {
    // Pour vrai/faux, l'indice est basé sur l'explication
    if (explanation) {
      const words = explanation.split(/\s+/).slice(0, 8).join(' ');
      hints.push(`💡 Réfléchis : ${words}...`);
    } else {
      hints.push(`💡 Relis bien l'énoncé et cherche des mots absolus comme "toujours", "jamais", "tous"...`);
    }
  } else {
    // Réponse courte
    hints.push(`🔤 La réponse commence par "${correctAnswer.charAt(0).toUpperCase()}..."`);
    const wordCount = correctAnswer.split(/\s+/).length;
    hints.push(`📏 La réponse contient ${wordCount} mot${wordCount > 1 ? 's' : ''}`);
    if (correctAnswer.length > 3) {
      const masked = correctAnswer.charAt(0) + '_'.repeat(correctAnswer.length - 2) + correctAnswer.charAt(correctAnswer.length - 1);
      hints.push(`🧩 Format : ${masked}`);
    }
  }

  // Dernier indice: extrait de l'explication si disponible
  if (explanation && explanation.length > 20) {
    const snippet = explanation.split(/[.!?]/)[0];
    if (snippet && !hints.some(h => h.includes(snippet.substring(0, 15)))) {
      hints.push(`📖 ${snippet.trim().substring(0, 80)}...`);
    }
  }

  return hints;
}

export default function QuizQuestion({
  question,
  type,
  options,
  onAnswer,
  showResult,
  isCorrect,
  explanation,
  correctAnswer,
  disabled = false,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<string>('');
  const [shortAnswer, setShortAnswer] = useState('');
  const [hintLevel, setHintLevel] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(false);

  const hints = correctAnswer ? generateHints(correctAnswer, explanation, type, options) : [];

  function handleShowHint() {
    if (hintLevel < hints.length) {
      setHintLevel(prev => prev + 1);
      setHintsUsed(true);
    }
  }

  function handleOptionClick(option: string) {
    if (disabled || showResult) return;
    setSelected(option);
    onAnswer(option);
  }

  function handleShortAnswerSubmit() {
    if (disabled || showResult || !shortAnswer.trim()) return;
    setSelected(shortAnswer.trim());
    onAnswer(shortAnswer.trim());
  }

  function getOptionStyle(option: string): string {
    const base = 'w-full text-left px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all duration-300';

    if (showResult) {
      const isThisCorrect = option.toLowerCase() === correctAnswer?.toLowerCase();
      const isThisSelected = option === selected;

      if (isThisCorrect) {
        return `${base} border-emerald-500 bg-emerald-500/15 text-emerald-300 animate-fade-in`;
      }
      if (isThisSelected && !isThisCorrect) {
        return `${base} border-red-500 bg-red-500/15 text-red-300 shake`;
      }
      return `${base} border-zinc-700 bg-zinc-800/50 text-zinc-500 opacity-50`;
    }

    if (option === selected) {
      return `${base} border-cyan-500 bg-cyan-500/15 text-cyan-300 shadow-sm shadow-cyan-500/10`;
    }

    return `${base} border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 cursor-pointer`;
  }

  return (
    <div className="animate-fade-in">
      <h3 className="text-lg font-semibold text-zinc-100 mb-6 leading-relaxed">
        {question}
      </h3>

      {/* Bouton Indice */}
      {!showResult && !disabled && correctAnswer && hints.length > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={handleShowHint}
            disabled={hintLevel >= hints.length}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              hintLevel >= hints.length
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50'
            }`}
          >
            <Lightbulb size={14} />
            {hintLevel === 0
              ? 'Indice'
              : hintLevel >= hints.length
              ? 'Plus d\'indices'
              : `Indice suivant (${hintLevel}/${hints.length})`}
          </button>
          {hintsUsed && (
            <span className="text-xs text-zinc-600">
              {hintLevel}/{hints.length} indices utilisés
            </span>
          )}
        </div>
      )}

      {/* Affichage des indices */}
      {hintLevel > 0 && !showResult && (
        <div className="mb-5 space-y-2">
          {hints.slice(0, hintLevel).map((hint, i) => (
            <div
              key={i}
              className="px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/15 text-amber-300/80 text-sm animate-fade-in"
            >
              {hint}
            </div>
          ))}
        </div>
      )}

      {type === 'qcm' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(option)}
              disabled={disabled || showResult}
              className={getOptionStyle(option)}
            >
              <span className="inline-flex items-center gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-700/50 flex items-center justify-center text-xs font-bold text-zinc-400">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{option}</span>
                {showResult && option.toLowerCase() === correctAnswer?.toLowerCase() && (
                  <Check size={18} className="ml-auto text-emerald-400" />
                )}
                {showResult && option === selected && option.toLowerCase() !== correctAnswer?.toLowerCase() && (
                  <X size={18} className="ml-auto text-red-400" />
                )}
              </span>
            </button>
          ))}
        </div>
      )}

      {type === 'vrai_faux' && (
        <div className="grid grid-cols-2 gap-4">
          {['Vrai', 'Faux'].map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              disabled={disabled || showResult}
              className={getOptionStyle(option)}
            >
              <span className="flex items-center justify-center gap-2 py-2">
                {option === 'Vrai' ? (
                  <Check size={20} className={selected === option ? 'text-current' : 'text-zinc-500'} />
                ) : (
                  <X size={20} className={selected === option ? 'text-current' : 'text-zinc-500'} />
                )}
                <span className="text-base font-semibold">{option}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {type === 'reponse_courte' && (
        <div className="space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={shortAnswer}
              onChange={(e) => setShortAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleShortAnswerSubmit();
              }}
              disabled={disabled || showResult}
              placeholder="Tape ta reponse ici..."
              className="flex-1 bg-zinc-800 border-2 border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all disabled:opacity-50"
            />
            <Button
              onClick={handleShortAnswerSubmit}
              disabled={disabled || showResult || !shortAnswer.trim()}
              icon={<Send size={16} />}
              size="lg"
            >
              Valider
            </Button>
          </div>
          {showResult && selected && (
            <div className={`px-4 py-2 rounded-lg text-sm ${
              isCorrect
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-300'
            }`}>
              <span className="font-medium">Ta reponse :</span> {selected}
            </div>
          )}
        </div>
      )}

      {showResult && (
        <div className={`mt-5 p-4 rounded-lg border animate-slide-up ${
          isCorrect
            ? 'bg-emerald-500/5 border-emerald-500/20'
            : 'bg-red-500/5 border-red-500/20'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <>
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check size={14} className="text-emerald-400" />
                </div>
                <span className="text-emerald-400 font-semibold text-sm">Correct</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X size={14} className="text-red-400" />
                </div>
                <span className="text-red-400 font-semibold text-sm">Incorrect</span>
                {correctAnswer && (
                  <span className="text-zinc-400 text-sm ml-2">
                    Reponse correcte : <span className="text-emerald-400 font-medium">{correctAnswer}</span>
                  </span>
                )}
              </>
            )}
          </div>
          {explanation && (
            <p className="text-zinc-400 text-sm leading-relaxed mt-2">{explanation}</p>
          )}
        </div>
      )}

      <style jsx>{`
        .shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
