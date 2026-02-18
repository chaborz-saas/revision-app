'use client';

import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ScorePoint {
  date: string;
  score: number;
  quizTitle: string;
}

interface ProgressChartProps {
  data: ScorePoint[];
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  } catch {
    return dateStr;
  }
}

interface TooltipPayloadItem {
  value: number;
  payload: ScorePoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-sm font-medium text-zinc-100">{item.payload.quizTitle}</p>
      <p className="text-xs text-zinc-400 mt-0.5">
        {formatDate(item.payload.date)}
      </p>
      <p className="text-lg font-bold text-cyan-400 mt-1">{item.value}%</p>
    </div>
  );
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    dateLabel: formatDate(d.date),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-cyan-500/10">
          <TrendingUp size={18} className="text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">
            Progression des scores
          </h3>
          <p className="text-xs text-zinc-500">
            {data.length > 0
              ? `${data.length} quiz pass${data.length > 1 ? 'es' : 'e'}`
              : 'Aucun quiz pour le moment'}
          </p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />
              <XAxis
                dataKey="dateLabel"
                tick={{ fill: '#71717a', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#27272a' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#71717a', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#27272a' }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={{ fill: '#06b6d4', r: 4, strokeWidth: 0 }}
                activeDot={{
                  fill: '#06b6d4',
                  r: 6,
                  stroke: '#06b6d420',
                  strokeWidth: 8,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-zinc-600 text-sm">
            Passe un quiz pour voir ta progression ici
          </p>
        </div>
      )}
    </motion.div>
  );
}
