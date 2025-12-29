'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import type { Page } from '@src/lib/types';
import { SortablePage } from './SortablePage';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface PageGridProps {
  pages: Page[];
  onReorder: (newOrder: Page[]) => void;
  onRemove: (id: string) => void;
}

export function PageGrid({ pages, onReorder, onRemove }: PageGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex((p) => p.id === active.id);
      const newIndex = pages.findIndex((p) => p.id === over.id);

      onReorder(arrayMove(pages, oldIndex, newIndex));
    }

    setActiveId(null);
  }

  const activePage = pages.find((p) => p.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={pages.map((p) => p.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6 min-h-[200px] border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-inner">
          {pages.map((page, index) => (
            <SortablePage
              key={page.id}
              page={page}
              index={index}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>
      
      {typeof document !== 'undefined' && createPortal(
          <DragOverlay>
            {activePage ? (
                <div className="opacity-80 scale-105">
                     <SortablePage page={activePage} index={pages.indexOf(activePage)} onRemove={() => {}} />
                </div>
            ) : null}
          </DragOverlay>,
          document.body
      )}
    </DndContext>
  );
}
