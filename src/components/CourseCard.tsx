'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { Course } from '@/lib/db';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/cours/${course.id}`} className="block">
      <Card hover accentColor={course.color} className="h-full">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${course.color}20` }}
          >
            <BookOpen size={20} style={{ color: course.color }} />
          </div>
          <Badge color={course.color}>{course.subject || 'Cours'}</Badge>
        </div>

        <h3 className="text-base font-semibold text-zinc-100 mb-1 line-clamp-2">
          {course.title}
        </h3>

        <div className="flex items-center gap-3 mt-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {course.chapter_count} chapitre{course.chapter_count > 1 ? 's' : ''}
          </span>
          {course.page_count > 0 && (
            <span>{course.page_count} page{course.page_count > 1 ? 's' : ''}</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
