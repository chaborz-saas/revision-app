import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  accentColor?: string;
}

export default function Card({ children, className = '', hover = false, onClick, accentColor }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-zinc-900 border border-zinc-800 rounded-xl p-5 ${
        hover ? 'cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20 hover:border-zinc-700' : ''
      } ${className}`}
      style={accentColor ? { borderTopColor: accentColor, borderTopWidth: '3px' } : undefined}
    >
      {children}
    </div>
  );
}
