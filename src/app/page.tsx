'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FileText,
  Brain,
  Target,
  Clock,
  Trophy,
  Sparkles,
} from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import ProgressChart from '@/components/ProgressChart';
import MasteryMap from '@/components/MasteryMap';
import WeakPointsPanel from '@/components/WeakPointsPanel';
import { CardSkeleton } from '@/components/ui/Skeleton';
import Skeleton from '@/components/ui/Skeleton';
import type { DashboardData } from '@/app/api/dashboard/route';

function formatDateFr(): string {
  const now = new Date();
  return now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatRelativeDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "A l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffH < 24) return `Il y a ${diffH}h`;
    if (diffD < 7) return `Il y a ${diffD}j`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  } catch {
    return dateStr;
  }
}

function getScoreColor(percentage: number): string {
  if (percentage >= 80) return '#10b981';
  if (percentage >= 50) return '#f59e0b';
  return '#ef4444';
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <Skeleton className="h-8 w-72 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <Skeleton className="h-4 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
        <CardSkeleton />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/dashboard');
      if (!res.ok) {
        throw new Error('Erreur de chargement');
      }
      const json: DashboardData = await res.json();
      setData(json);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur inconnue'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="p-4 bg-red-500/10 rounded-full">
          <Brain size={32} className="text-red-400" />
        </div>
        <p className="text-zinc-400 text-sm">{error}</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
        >
          Reessayer
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { stats, scoreHistory, masteryData, weakPoints, recentActivity } = data;

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-cyan-400" />
          <h1 className="text-2xl font-bold text-zinc-100">
            Bonjour ! Pret a reviser ?
          </h1>
        </div>
        <p className="text-sm text-zinc-500 capitalize">{formatDateFr()}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<BookOpen size={20} />}
          title="Cours"
          value={stats.courseCount}
          subtitle={`${stats.chapterCount} chapitre${stats.chapterCount > 1 ? 's' : ''}`}
          accentColor="#06b6d4"
          index={0}
        />
        <StatsCard
          icon={<FileText size={20} />}
          title="Fiches"
          value={stats.ficheCount}
          subtitle="Resumes et memos"
          accentColor="#10b981"
          index={1}
        />
        <StatsCard
          icon={<Brain size={20} />}
          title="Quiz"
          value={stats.attemptCount}
          subtitle={`${stats.quizCount} quiz cree${stats.quizCount > 1 ? 's' : ''}`}
          accentColor="#8b5cf6"
          index={2}
        />
        <StatsCard
          icon={<Target size={20} />}
          title="Score moyen"
          value={`${Math.round(stats.avgScore)}%`}
          subtitle="Sur tous les quiz"
          accentColor={getScoreColor(stats.avgScore)}
          index={3}
        />
      </div>

      {/* Chart + Weak Points Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressChart data={scoreHistory} />
        </div>
        <WeakPointsPanel data={weakPoints} />
      </div>

      {/* Mastery Map */}
      <MasteryMap data={masteryData} />

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <Clock size={18} className="text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Derniere activite
            </h3>
            <p className="text-xs text-zinc-500">Tes derniers quiz</p>
          </div>
        </div>

        {recentActivity.length > 0 ? (
          <div className="space-y-2">
            {recentActivity.map((activity, idx) => (
              <motion.div
                key={activity.attemptId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * idx }}
                className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-800 rounded-lg px-4 py-3 hover:border-zinc-700 transition-all duration-200"
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${getScoreColor(activity.percentage)}15`,
                  }}
                >
                  <Trophy
                    size={18}
                    style={{ color: getScoreColor(activity.percentage) }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {activity.quizTitle}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {activity.score}/{activity.total} bonnes reponses
                  </p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p
                    className="text-sm font-bold"
                    style={{ color: getScoreColor(activity.percentage) }}
                  >
                    {activity.percentage}%
                  </p>
                  <p className="text-[10px] text-zinc-600">
                    {formatRelativeDate(activity.date)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-zinc-600 text-sm">
              Passe un quiz pour voir ton activite ici
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
