'use client';

import { motion } from 'framer-motion';
import { Map, Layers } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import { getMasteryColor, getMasteryLabel } from '@/styles/theme';

interface ChapterMastery {
  chapterId: number;
  chapterTitle: string;
  score: number;
  attempts: number;
}

interface CourseMastery {
  courseId: number;
  courseTitle: string;
  courseColor: string;
  chapters: ChapterMastery[];
}

interface MasteryMapProps {
  data: CourseMastery[];
}

export default function MasteryMap({ data }: MasteryMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <Map size={18} className="text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">
            Carte de maitrise
          </h3>
          <p className="text-xs text-zinc-500">
            Progression par chapitre
          </p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="space-y-5">
          {data.map((course, courseIdx) => (
            <motion.div
              key={course.courseId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * courseIdx }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Layers size={14} style={{ color: course.courseColor }} />
                <h4
                  className="text-sm font-semibold"
                  style={{ color: course.courseColor }}
                >
                  {course.courseTitle}
                </h4>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: `${course.courseColor}30` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-1">
                {course.chapters.map((ch) => {
                  const masteryColor = getMasteryColor(ch.score);
                  const masteryLabel = getMasteryLabel(ch.score);

                  return (
                    <div
                      key={ch.chapterId}
                      className="bg-zinc-800/50 border border-zinc-800 rounded-lg px-3 py-2.5 hover:border-zinc-700 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-zinc-300 truncate max-w-[60%]">
                          {ch.chapterTitle}
                        </span>
                        <Badge color={masteryColor} className="text-[10px]">
                          {masteryLabel}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <ProgressBar
                          value={ch.score}
                          color={masteryColor}
                          size="sm"
                          className="flex-1"
                        />
                        <span
                          className="text-xs font-bold min-w-[3ch] text-right"
                          style={{ color: masteryColor }}
                        >
                          {ch.score}%
                        </span>
                      </div>
                      {ch.attempts > 0 && (
                        <p className="text-[10px] text-zinc-600 mt-1">
                          {ch.attempts} tentative{ch.attempts > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <p className="text-zinc-600 text-sm">
            Aucune donnee de maitrise pour le moment
          </p>
        </div>
      )}
    </motion.div>
  );
}
