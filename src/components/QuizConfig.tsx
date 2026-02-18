'use client';

import { useState, useEffect } from 'react';
import { Play, BookOpen, Layers, Zap, Clock, GraduationCap } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Course {
  id: number;
  title: string;
  subject: string;
}

interface Chapter {
  id: number;
  course_id: number;
  title: string;
}

interface QuizConfigProps {
  onSubmit: (config: QuizConfigData) => void;
  loading?: boolean;
  preselectedCourseId?: number;
  preselectedChapterIds?: number[];
}

export interface QuizConfigData {
  courseId: number | null;
  chapterIds: number[];
  difficulty: 'facile' | 'moyen' | 'dur';
  questionCount: number;
  types: string[];
  mode: 'rapide' | 'examen';
}

const DIFFICULTIES = [
  { value: 'facile', label: 'Facile', color: '#10b981' },
  { value: 'moyen', label: 'Moyen', color: '#f59e0b' },
  { value: 'dur', label: 'Dur', color: '#ef4444' },
] as const;

const QUESTION_TYPES = [
  { value: 'qcm', label: 'QCM' },
  { value: 'vrai_faux', label: 'Vrai / Faux' },
  { value: 'reponse_courte', label: 'Reponse courte' },
];

const MODES = [
  { value: 'rapide', label: 'Rapide', icon: Zap, desc: 'Correction instantanee apres chaque question' },
  { value: 'examen', label: 'Examen', icon: Clock, desc: 'Timer, pas de correction, resultat a la fin' },
] as const;

export default function QuizConfig({
  onSubmit,
  loading = false,
  preselectedCourseId,
  preselectedChapterIds,
}: QuizConfigProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [courseId, setCourseId] = useState<number | null>(preselectedCourseId ?? null);
  const [selectedChapters, setSelectedChapters] = useState<number[]>(preselectedChapterIds ?? []);
  const [difficulty, setDifficulty] = useState<'facile' | 'moyen' | 'dur'>('moyen');
  const [questionCount, setQuestionCount] = useState(10);
  const [types, setTypes] = useState<string[]>(['qcm', 'vrai_faux']);
  const [mode, setMode] = useState<'rapide' | 'examen'>('rapide');
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/quiz/generate', { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
        }
      } catch (err) {
        console.error('Erreur chargement cours:', err);
      } finally {
        setLoadingCourses(false);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!courseId) {
      setChapters([]);
      setSelectedChapters([]);
      return;
    }
    async function fetchChapters() {
      try {
        const res = await fetch(`/api/quiz/generate?courseId=${courseId}`);
        if (res.ok) {
          const data = await res.json();
          setChapters(data.chapters || []);
        }
      } catch (err) {
        console.error('Erreur chargement chapitres:', err);
      }
    }
    fetchChapters();
  }, [courseId]);

  function toggleType(type: string) {
    setTypes(prev => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev;
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  }

  function toggleChapter(chapterId: number) {
    setSelectedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  }

  function handleSubmit() {
    onSubmit({
      courseId,
      chapterIds: selectedChapters,
      difficulty,
      questionCount,
      types,
      mode,
    });
  }

  const isValid = courseId !== null && types.length > 0;

  return (
    <div className="space-y-6">
      {/* Matiere */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          <BookOpen size={14} className="inline mr-2" />
          Matiere
        </label>
        {loadingCourses ? (
          <div className="h-10 bg-zinc-800 rounded-lg animate-pulse" />
        ) : (
          <select
            value={courseId ?? ''}
            onChange={(e) => setCourseId(e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
          >
            <option value="">Selectionner un cours</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        )}
      </div>

      {/* Chapitres */}
      {chapters.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            <Layers size={14} className="inline mr-2" />
            Chapitres (optionnel)
          </label>
          <div className="flex flex-wrap gap-2">
            {chapters.map(ch => (
              <button
                key={ch.id}
                onClick={() => toggleChapter(ch.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  selectedChapters.includes(ch.id)
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                    : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {ch.title}
              </button>
            ))}
          </div>
          {selectedChapters.length === 0 && (
            <p className="text-xs text-zinc-500 mt-1">Aucun chapitre selectionne = tout le cours</p>
          )}
        </div>
      )}

      {/* Difficulte */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          <GraduationCap size={14} className="inline mr-2" />
          Difficulte
        </label>
        <div className="flex gap-3">
          {DIFFICULTIES.map(d => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
                difficulty === d.value
                  ? 'text-white shadow-sm'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
              }`}
              style={
                difficulty === d.value
                  ? { borderColor: d.color, backgroundColor: `${d.color}20`, color: d.color }
                  : undefined
              }
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nombre de questions */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Nombre de questions : <span className="text-cyan-400 font-bold">{questionCount}</span>
        </label>
        <input
          type="range"
          min={5}
          max={30}
          step={1}
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>5</span>
          <span>30</span>
        </div>
      </div>

      {/* Types de questions */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Types de questions
        </label>
        <div className="flex gap-3">
          {QUESTION_TYPES.map(qt => (
            <button
              key={qt.value}
              onClick={() => toggleType(qt.value)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-medium border-2 transition-all duration-200 ${
                types.includes(qt.value)
                  ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              {qt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Mode</label>
        <div className="grid grid-cols-2 gap-3">
          {MODES.map(m => {
            const Icon = m.icon;
            return (
              <Card
                key={m.value}
                hover
                onClick={() => setMode(m.value)}
                className={`!p-4 border-2 transition-all duration-200 ${
                  mode === m.value
                    ? '!border-cyan-500 !bg-cyan-500/5'
                    : '!border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} className={mode === m.value ? 'text-cyan-400' : 'text-zinc-500'} />
                  <span className={`text-sm font-semibold ${mode === m.value ? 'text-cyan-300' : 'text-zinc-300'}`}>
                    {m.label}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">{m.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bouton lancer */}
      <Button
        onClick={handleSubmit}
        disabled={!isValid || loading}
        loading={loading}
        icon={<Play size={18} />}
        size="lg"
        className="w-full"
      >
        Lancer le quiz
      </Button>
    </div>
  );
}
