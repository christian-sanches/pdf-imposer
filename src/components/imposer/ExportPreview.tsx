'use client';

import type { Page } from '@src/lib/types';

interface ExportPreviewProps {
  pages: Page[];
  outputLayout: 'A4' | 'A5';
}

export function ExportPreview({ pages, outputLayout }: ExportPreviewProps) {
  if (outputLayout === 'A4') {
     return null; // Or show 1-up preview if desired later
  }

  // A5 Logic: Pairs of pages
  const sheets = [];
  for (let i = 0; i < pages.length; i += 2) {
    sheets.push({
      left: pages[i],
      right: pages[i + 1], // May be undefined
      index: i / 2
    });
  }

  return (
    <div className="space-y-6 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pré-visualização de Saída (Modo A5)</h3>
      <p className="text-base text-gray-600 dark:text-gray-400">
        Cada folha abaixo representa um papel A4 Paisagem com duas páginas A5 lado a lado.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sheets.map((sheet, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Folha {idx + 1}</span>
            <div className="aspect-[1.414/1] bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-lg grid grid-cols-2 overflow-hidden relative hover:shadow-2xl transition-shadow duration-300">
               {/* Left Page (First in pair) */}
               <div className="h-full border-r-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 overflow-hidden">
                 {sheet.left ? (
                   <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
                     {sheet.left.thumbnailUrl ? (
                       <img 
                         src={sheet.left.thumbnailUrl} 
                         alt="" 
                         className="max-w-full max-h-full object-contain shadow-md bg-white dark:bg-gray-700 rounded" 
                       />
                     ) : (
                       <div className="text-gray-400 dark:text-gray-500 text-sm font-semibold">
                         {sheet.left.type === 'blank' ? 'Em Branco' : 'Sem Visualização'}
                       </div>
                     )}
                     <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">Página {sheet.left.pageIndex !== -1 ? sheet.left.pageIndex + 1 : 'Em Branco'}</span>
                   </div>
                 ) : (
                   <span className="text-sm text-gray-300 dark:text-gray-600 font-semibold">Vazio</span>
                 )}
               </div>
               
               {/* Right Page (Second in pair) */}
               <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-3 overflow-hidden">
                 {sheet.right ? (
                    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden">
                      {sheet.right.thumbnailUrl ? (
                        <img 
                          src={sheet.right.thumbnailUrl} 
                          alt="" 
                          className="max-w-full max-h-full object-contain shadow-md bg-white dark:bg-gray-700 rounded" 
                        />
                      ) : (
                        <div className="text-gray-400 dark:text-gray-500 text-sm font-semibold">
                          {sheet.right.type === 'blank' ? 'Em Branco' : 'Sem Visualização'}
                        </div>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">Página {sheet.right.pageIndex !== -1 ? sheet.right.pageIndex + 1 : 'Em Branco'}</span>
                    </div>
                 ) : (
                   <span className="text-sm text-gray-300 dark:text-gray-600 font-semibold">Vazio</span>
                 )}
               </div>

               {/* Fold line indicator */}
               <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gray-400/50 dark:bg-gray-500/50 pointer-events-none"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

