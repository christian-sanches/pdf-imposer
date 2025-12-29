'use client';

import { FilePlus, BookOpen, Download, LayoutTemplate, Settings2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import { Slider } from '@src/components/ui/slider';

interface ToolbarProps {
  onAddBlank: () => void;
  onAutoImpose: () => void;
  onDownload: () => void;
  isDownloading?: boolean;
  pageCount: number;
  outputLayout: 'A4' | 'A5';
  onLayoutChange: (layout: 'A4' | 'A5') => void;
  bleed: number;
  onBleedChange: (value: number) => void;
  groupSize: number;
  onGroupSizeChange: (value: number) => void;
}

export function Toolbar({
  onAddBlank,
  onAutoImpose,
  onDownload,
  isDownloading,
  pageCount,
  outputLayout,
  onLayoutChange,
  bleed,
  onBleedChange,
  groupSize,
  onGroupSizeChange,
}: ToolbarProps) {
  const [showSettings, setShowSettings] = useState(false);
  
  const { lower, upper, isExact } = useMemo(() => {
    const step = groupSize > 0 ? groupSize : 4;
    const remainder = pageCount % step;
    
    if (pageCount === 0) return { lower: 0, upper: step, isExact: true };
    
    if (remainder === 0) {
      return { lower: pageCount - step, upper: pageCount, isExact: true };
    }
    
    const lower = pageCount - remainder;
    const upper = lower + step;
    return { lower, upper, isExact: false };
  }, [pageCount, groupSize]);

  return (
    <div className="flex flex-wrap items-center gap-4 p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg sticky top-4 z-30 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">PDF Imposer</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{pageCount} Páginas</p>
        </div>
        
        {pageCount > 0 && (
          <div className="flex items-center gap-3 text-sm border-l pl-4 border-gray-300 dark:border-gray-600">
             <span className="text-gray-600 dark:text-gray-400 font-medium tracking-wide">Metas:</span>
             {isExact ? (
               <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-md">
                 {upper} (Perfeito)
               </span>
             ) : (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-md" title="Páginas serão cortadas">
                     {lower} (Excesso)
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold shadow-md flex items-center gap-1.5" title="Páginas em branco necessárias">
                     {upper}
                     <span className="text-white/80 text-xs">({upper - pageCount} faltam)</span>
                  </span>
                </div>
             )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 border-l pl-4 border-gray-300 dark:border-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1.5 w-36">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 font-medium">
                    <span>Sangria</span>
                    <span>{bleed}mm</span>
                </div>
                <Slider 
                    value={bleed} 
                    onValueChange={onBleedChange} 
                    min={0} 
                    max={100} 
                    step={1}
                />
            </div>

            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

            <div className="flex flex-col gap-1.5">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Tamanho do Grupo</span>
                <input
                    type="number"
                    min="0"
                    step="4"
                    value={groupSize}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 0) onGroupSizeChange(val);
                    }}
                    className="w-24 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                    placeholder="Auto"
                />
            </div>

            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

            <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Saída:</span>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700 shadow-sm">
                <button
                    onClick={() => onLayoutChange('A4')}
                    className={clsx(
                        "px-4 py-2 text-sm flex items-center gap-2 transition-all font-medium",
                        outputLayout === 'A4' 
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md" 
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    )}
                >
                    <div className={clsx("w-3 h-4 border-2", outputLayout === 'A4' ? "border-white bg-white/30" : "border-gray-500 dark:border-gray-400 bg-white dark:bg-gray-700")} title="1 Página por Folha"></div>
                    A4
                </button>
                <div className="w-px bg-gray-300 dark:bg-gray-600"></div>
                <button
                    onClick={() => onLayoutChange('A5')}
                    className={clsx(
                        "px-4 py-2 text-sm flex items-center gap-2 transition-all font-medium",
                        outputLayout === 'A5' 
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md" 
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                    )}
                >
                    <div className={clsx("w-4 h-3 border-2 flex", outputLayout === 'A5' ? "border-white bg-white/30" : "border-gray-500 dark:border-gray-400 bg-white dark:bg-gray-700")} title="2 Páginas por Folha">
                        <div className={clsx("w-1/2 h-full border-r-2", outputLayout === 'A5' ? "border-white" : "border-gray-500 dark:border-gray-400")}></div>
                    </div>
                    A5
                </button>
            </div>
            </div>
          </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onAddBlank}
          className="p-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
          title="Adicionar Página em Branco"
        >
          <FilePlus className="w-5 h-5" />
        </button>

        <button
          onClick={onAutoImpose}
          className="p-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
          title="Preencher com páginas em branco até o próximo múltiplo de 4"
        >
          <BookOpen className="w-5 h-5" />
        </button>

        <button
          onClick={onDownload}
          disabled={isDownloading || pageCount === 0}
          className={clsx(
            "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg",
            (isDownloading || pageCount === 0) && "opacity-50 cursor-not-allowed"
          )}
        >
          <Download className="w-5 h-5" />
          Baixar
        </button>
      </div>
    </div>
  );
}
