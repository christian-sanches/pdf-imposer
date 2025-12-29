'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Page } from '@src/lib/types';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

interface SortablePageProps {
  page: Page;
  index: number; // Global index
  onRemove: (id: string) => void;
}

export function SortablePage({ page, index, onRemove }: SortablePageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        'relative group aspect-[1/1.4] bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50 ring-4 ring-blue-500 dark:ring-blue-400 scale-110'
      )}
    >
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent drag start
            onRemove(page.id);
          }}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full p-1.5 hover:from-red-600 hover:to-red-700 shadow-lg hover:scale-110 transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="absolute bottom-2 left-2 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-3 py-1.5 rounded-lg font-bold shadow-lg">
        {index + 1}
      </div>

      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        {page.thumbnailUrl ? (
          <img
            src={page.thumbnailUrl}
            alt={`Página ${index + 1}`}
            className="w-full h-full object-contain pointer-events-none"
          />
        ) : (
          <div className="text-gray-400 dark:text-gray-500 font-semibold">
             {page.type === 'blank' ? 'Em Branco' : 'Sem Visualização'}
          </div>
        )}
      </div>
    </div>
  );
}
