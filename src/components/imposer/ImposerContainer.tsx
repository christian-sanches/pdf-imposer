'use client';

import { fillBookletBlanks, generateBookletOrder, loadAndExtractPages, saveNewPdf } from '@src/lib/pdf-manager';
import type { Page } from '@src/lib/types';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ExportPreview } from './ExportPreview';
import { FileDropzone } from './FileDropzone';
import { PageGrid } from './PageGrid';
import { Toolbar } from './Toolbar';
import { ThemeToggle } from '@src/components/ThemeToggle';

export function ImposerContainer() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputLayout, setOutputLayout] = useState<'A4' | 'A5'>('A5');
  const [bleed, setBleed] = useState(0);
  const [groupSize, setGroupSize] = useState(4);
  const fileMapRef = useRef<Map<string, File>>(new Map());

  // Memoize the pages for preview and printing to ensure consistency
  const previewPages = useMemo(() => {
    if (outputLayout === 'A5') {
      return generateBookletOrder(pages, groupSize);
    }
    return pages;
  }, [pages, outputLayout, groupSize]);

  const handleFilesDrop = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    try {
      const newPages: Page[] = [];
      
      for (const file of files) {
        const { pages: extractedPages, sourceFile } = await loadAndExtractPages(file);
        // Store the file in our map
        fileMapRef.current.set(sourceFile.id, sourceFile.file);
        newPages.push(...extractedPages);
      }

      setPages((prev) => [...prev, ...newPages]);
    } catch (error) {
      console.error('Erro ao processar arquivos:', error);
      alert('Erro ao processar arquivos. Veja o console para detalhes.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleReorder = useCallback((newOrder: Page[]) => {
    setPages(newOrder);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleAddBlank = useCallback(() => {
    const blankPage: Page = {
      id: crypto.randomUUID(),
      sourceFileId: 'blank',
      pageIndex: -1,
      thumbnailUrl: '',
      type: 'blank',
    };
    setPages((prev) => [...prev, blankPage]);
  }, []);

  const handleAutoImpose = useCallback(() => {
    setPages((prev) => fillBookletBlanks(prev, groupSize));
  }, [groupSize]);

  const handleDownload = useCallback(async () => {
    if (pages.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await saveNewPdf(previewPages, fileMapRef.current, outputLayout, bleed);
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `imposicao-${outputLayout.toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao salvar PDF:', error);
      alert('Falha ao salvar PDF.');
    } finally {
      setIsProcessing(false);
    }
  }, [pages, outputLayout, bleed, previewPages]);

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      <div className="text-center space-y-4 pt-8">
        <div className="flex items-center justify-center gap-4">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            PDF Imposer
          </h1>
          <ThemeToggle />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Organize e reordene páginas de PDF para impressão de livretos.
        </p>
      </div>

      <FileDropzone onDrop={handleFilesDrop} isProcessing={isProcessing} />

      {pages.length > 0 && (
        <div className="space-y-6">
          <Toolbar
            onAddBlank={handleAddBlank}
            onAutoImpose={handleAutoImpose}
            onDownload={handleDownload}
            isDownloading={isProcessing}
            pageCount={pages.length}
            outputLayout={outputLayout}
            onLayoutChange={setOutputLayout}
            bleed={bleed}
            onBleedChange={setBleed}
            groupSize={groupSize}
            onGroupSizeChange={setGroupSize}
          />
          
          <PageGrid
            pages={pages}
            onReorder={handleReorder}
            onRemove={handleRemove}
          />
          
          <ExportPreview pages={previewPages} outputLayout={outputLayout} />
        </div>
      )}
    </div>
  );
}
