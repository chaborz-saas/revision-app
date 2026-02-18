'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  accentColor?: string;
  index?: number;
}

export default function StatsCard({
  icon,
  title,
  value,
  subtitle,
  accentColor = '#06b6d4',
  index = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 group hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="p-2.5 rounded-lg"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <div style={{ color: accentColor }}>{icon}</div>
        </div>
        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">
          {title}
        </span>
      </div>
      <div className="space-y-1">
        <p
          className="text-3xl font-bold tracking-tight"
          style={{ color: accentColor }}
        >
          {value}
        </p>
        <p className="text-sm text-zinc-500">{subtitle}</p>
      </div>
      <div
        className="mt-3 h-0.5 rounded-full opacity-30"
        style={{ backgroundColor: accentColor }}
      />
    </motion.div>
  );
}
