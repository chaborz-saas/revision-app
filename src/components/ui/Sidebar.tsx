'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  FileText,
  Brain,
  MessageCircle,
  BarChart3,
  Upload,
  GraduationCap,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: typeof BarChart3;
  badge?: number | null;
}

const STATIC_NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: BarChart3 },
  { href: '/cours', label: 'Mes Cours', icon: BookOpen },
  { href: '/fiches', label: 'Fiches', icon: FileText },
  { href: '/practice', label: 'Practice', icon: GraduationCap },
  { href: '/quiz', label: 'Quiz', icon: Brain },
  { href: '/chat', label: 'Chat IA', icon: MessageCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [dueCount, setDueCount] = useState<number | null>(null);
  const [stats, setStats] = useState<{ ficheCount: number; courseCount: number } | null>(null);

  useEffect(() => {
    fetch('/api/spaced-review')
      .then((res) => res.json())
      .then((data) => setDueCount(data.stats?.dueCount ?? data.dueCount ?? 0))
      .catch(() => setDueCount(null));

    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) {
          setStats({
            ficheCount: data.stats.ficheCount ?? 0,
            courseCount: data.stats.courseCount ?? 0,
          });
        }
      })
      .catch(() => setStats(null));
  }, []);

  const navItems: NavItem[] = STATIC_NAV_ITEMS.map((item) => {
    if (item.href === '/practice') {
      return { ...item, badge: dueCount };
    }
    return item;
  });

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col z-40">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          RevisionApp
        </h1>
        <p className="text-xs text-zinc-500 mt-1">Ta plateforme de revision</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out group ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 shadow-sm shadow-cyan-500/5'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70'
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-cyan-400 rounded-r-full" />
              )}
              <Icon
                size={18}
                className={`transition-transform duration-300 ${
                  isActive ? '' : 'group-hover:scale-110'
                }`}
              />
              <span className="flex-1">{label}</span>
              {badge != null && badge > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold bg-cyan-500/20 text-cyan-300">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Stats footer */}
      {stats && (
        <div className="px-5 py-3 border-t border-zinc-800/60">
          <p className="text-[11px] text-zinc-500 tracking-wide">
            {stats.ficheCount} fiches &bull; {stats.courseCount} cours
          </p>
        </div>
      )}

      <div className="p-4 border-t border-zinc-800">
        <Link
          href="/cours?import=true"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 w-full group"
        >
          <Upload size={18} className="transition-transform duration-300 group-hover:scale-110" />
          Importer des cours
        </Link>
      </div>
    </aside>
  );
}
