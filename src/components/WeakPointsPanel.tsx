'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { getMasteryColor } from '@/styles/theme';

interface WeakPoint {
  chapterId: number;
  chapterTitle: string;
  courseTitle: string;
  courseId: number;
  score: number;
}

interface WeakPointsPanelProps {
  data: WeakPoint[];
}

export default function WeakPointsPanel({ data }: WeakPointsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-amber-500/10">
          <AlertTriangle size={18} className="text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">
            Points faibles
          </h3>
          <p className="text-xs text-zinc-500">
            Chapitres a reviser en priorite
          </p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="space-y-2">
          {data.map((wp, idx) => {
            const color = getMasteryColor(wp.score);
            return (
              <motion.div
                key={wp.chapterId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * idx }}
                className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-800 rounded-lg px-3 py-2.5 hover:border-zinc-700 transition-all duration-200 group"
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: `${color}15`,
                    color: color,
                  }}
                >
                  {wp.score}%
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {wp.chapterTitle}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {wp.courseTitle}
                  </p>
                </div>

                <Link
                  href={`/quiz?courseId=${wp.courseId}&chapterId=${wp.chapterId}`}
                  className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors opacity-70 group-hover:opacity-100"
                >
                  Reviser
                  <ArrowRight size={12} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-zinc-600 text-sm">
            Aucun point faible identifie
          </p>
        </div>
      )}
    </motion.div>
  );
}
