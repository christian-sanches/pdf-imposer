// Polyfill for Promise.withResolvers which is missing in some environments but required by pdfjs-dist
// @ts-expect-error - Promise.withResolvers is ES2024 but we're targeting ES2022
if (typeof Promise.withResolvers === 'undefined') {
  // @ts-expect-error - Type definition missing
  Promise.withResolvers = function () {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

import { PDFDocument, PageSizes } from 'pdf-lib';
import type { PDFPageProxy } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';
import { type Page, type SourceFile } from './types';

// Initialize worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export async function loadAndExtractPages(file: File): Promise<{ pages: Page[]; sourceFile: SourceFile }> {
  const fileId = crypto.randomUUID();
  const sourceFile: SourceFile = {
    id: fileId,
    file,
    type: file.type === 'application/pdf' ? 'pdf' : 'image',
  };

  const pages: Page[] = [];

  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    // Use a typed array for pdfjs
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const thumbnail = await renderPageThumbnail(page);
      
      pages.push({
        id: crypto.randomUUID(),
        sourceFileId: fileId,
        pageIndex: i - 1, // 0-based index
        thumbnailUrl: thumbnail,
        type: 'pdf',
        width: page.view.slice(2)[0], // approx width
        height: page.view.slice(2)[1],
      });
    }
  } else if (file.type.startsWith('image/')) {
    // Process single image
    const dataUrl = await fileToDataURL(file);
    pages.push({
      id: crypto.randomUUID(),
      sourceFileId: fileId,
      pageIndex: 0,
      thumbnailUrl: dataUrl, // Use the image itself as thumbnail (or resize if needed)
      type: 'image',
    });
  }

  return { pages, sourceFile };
}

async function renderPageThumbnail(page: PDFPageProxy): Promise<string> {
  const viewport = page.getViewport({ scale: 0.5 }); // Thumbnail scale
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) throw new Error('Canvas context not available');

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: context,
    viewport: viewport,
  }).promise;

  return canvas.toDataURL();
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function fillBookletBlanks(pages: Page[], groupSize = 0): Page[] {
  const totalPages = pages.length;
  const effectiveGroupSize = (groupSize > 0 && groupSize % 4 === 0) ? groupSize : 4;
  
  const remainder = totalPages % effectiveGroupSize;
  const pagesToAdd = remainder === 0 ? 0 : effectiveGroupSize - remainder;
  
  const tempPages = [...pages];
  
  for (let i = 0; i < pagesToAdd; i++) {
    tempPages.push({
      id: crypto.randomUUID(),
      sourceFileId: 'blank',
      pageIndex: -1,
      thumbnailUrl: '',
      type: 'blank',
    });
  }
  return tempPages;
}

export function generateBookletOrder(pages: Page[], groupSize = 0): Page[] {
  // 1. Determine target count and fill blanks
  const tempPages = fillBookletBlanks(pages, groupSize);
  const effectiveGroupSize = (groupSize > 0 && groupSize % 4 === 0) ? groupSize : 4;

  // 2. Split into groups and reorder
  const reorderedPages: Page[] = [];
  const numGroups = tempPages.length / effectiveGroupSize;

  for (let g = 0; g < numGroups; g++) {
    const groupStart = g * effectiveGroupSize;
    const groupPages = tempPages.slice(groupStart, groupStart + effectiveGroupSize);
    const groupLength = groupPages.length;
    const sheets = groupLength / 4;

    for (let i = 0; i < sheets; i++) {
        // Front: Left (Last), Right (First)
        // Sheet 1 Front: Left=8, Right=1
        // p[N-1-2*i], p[2*i]
        reorderedPages.push(groupPages[groupLength - 1 - 2 * i]!);
        reorderedPages.push(groupPages[2 * i]!);

        // Back: Left (First+1), Right (Last-1)
        // Sheet 1 Back: Left=2, Right=7
        // p[2*i+1], p[N-1-(2*i+1)]
        reorderedPages.push(groupPages[2 * i + 1]!);
        reorderedPages.push(groupPages[groupLength - 1 - (2 * i + 1)]!);
    }
  }

  return reorderedPages;
}

export async function saveNewPdf(
    pages: Page[], 
    sourceFiles: Map<string, File>,
    outputLayout: 'A4' | 'A5',
    bleedMm = 0
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  
  // Convert mm to points (1mm = 2.83465 points)
  const bleed = bleedMm * 2.83465;

  if (outputLayout === 'A4') {
    // 1-up, A4 Portrait
    for (const page of pages) {
      if (page.type === 'blank') {
        doc.addPage(PageSizes.A4);
        continue;
      }

      const sourceFile = sourceFiles.get(page.sourceFileId);
      if (!sourceFile) continue;
      
      const newPage = doc.addPage(PageSizes.A4); 
      const { width: pageWidth, height: pageHeight } = newPage.getSize();

      const buffer = await sourceFile.arrayBuffer();
      
      // Available area with bleed subtracted (margin)
      const maxWidth = pageWidth - (bleed * 2);
      const maxHeight = pageHeight - (bleed * 2);

      if (maxWidth <= 0 || maxHeight <= 0) continue; // Bleed too large

      if (page.type === 'image') {
         let imageEmbed;
         if (sourceFile.type === 'image/png') {
            imageEmbed = await doc.embedPng(buffer);
         } else {
            imageEmbed = await doc.embedJpg(buffer);
         }
         const dims = imageEmbed.scale(1);
         
         // Scale to fit within margin
         const scale = Math.min(
            maxWidth / dims.width,
            maxHeight / dims.height
         );
         
         // Center within the area that respects bleed margins
         const scaledWidth = dims.width * scale;
         const scaledHeight = dims.height * scale;
         const x = bleed + (maxWidth - scaledWidth) / 2;
         const y = bleed + (maxHeight - scaledHeight) / 2;
         
         newPage.drawImage(imageEmbed, { x, y, width: scaledWidth, height: scaledHeight });
      } else if (page.type === 'pdf') {
         const srcDoc = await PDFDocument.load(buffer);
         const embeddedPages = await doc.embedPdf(srcDoc, [page.pageIndex]);
         const embeddedPage = embeddedPages[0];
         
         if (!embeddedPage) continue;
         
         const dims = embeddedPage.scale(1);
         
         // Scale to fit within margin
         const scale = Math.min(
            maxWidth / dims.width,
            maxHeight / dims.height
         );
         
         // Center within the area that respects bleed margins
         const scaledWidth = dims.width * scale;
         const scaledHeight = dims.height * scale;
         const x = bleed + (maxWidth - scaledWidth) / 2;
         const y = bleed + (maxHeight - scaledHeight) / 2;
         
         newPage.drawPage(embeddedPage, { x, y, width: scaledWidth, height: scaledHeight });
      }
    }

  } else if (outputLayout === 'A5') {
    // 2-up on A4 Landscape
    for (let i = 0; i < pages.length; i += 2) {
        const p1 = pages[i];
        const p2 = pages[i + 1]; 

        const sheet = doc.addPage([PageSizes.A4[1], PageSizes.A4[0]]); // Landscape
        const { width: sheetWidth, height: sheetHeight } = sheet.getSize();
        const halfWidth = sheetWidth / 2;

        const drawItem = async (p: Page | undefined, offsetX: number, isLeft: boolean) => {
            if (!p || p.type === 'blank') return;
            
            const sourceFile = sourceFiles.get(p.sourceFileId);
            if (!sourceFile) return;

            const buffer = await sourceFile.arrayBuffer();
            
            // Fit into half page with bleed padding
            // For left page: only apply bleed on left, top, bottom (not on center)
            // For right page: only apply bleed on right, top, bottom (not on center)
            const bleedLeft = isLeft ? bleed : 0;
            const bleedRight = isLeft ? 0 : bleed;
            const maxWidth = halfWidth - bleedLeft - bleedRight;
            const maxHeight = sheetHeight - (bleed * 2);
            
            if (maxWidth <= 0 || maxHeight <= 0) return;

            if (p.type === 'image') {
                let imageEmbed;
                if (sourceFile.type === 'image/png') {
                    imageEmbed = await doc.embedPng(buffer);
                } else {
                    imageEmbed = await doc.embedJpg(buffer);
                }
                const dims = imageEmbed.scale(1);
                
                // Scale to fill width completely (pages touch at center), fit height if possible
                const scaleWidth = maxWidth / dims.width;
                const scaleHeight = maxHeight / dims.height;
                const scale = Math.max(scaleWidth, scaleHeight);

                const scaledWidth = dims.width * scale;
                const scaledHeight = dims.height * scale;
                
                // Align to center fold: left page aligns right, right page aligns left
                const x = isLeft 
                    ? offsetX + halfWidth - scaledWidth - bleedRight
                    : offsetX + bleedLeft;
                const y = bleed + (maxHeight - scaledHeight) / 2;

                sheet.drawImage(imageEmbed, { x, y, width: scaledWidth, height: scaledHeight });
            } else if (p.type === 'pdf') {
                const srcDoc = await PDFDocument.load(buffer);
                const embeddedPages = await doc.embedPdf(srcDoc, [p.pageIndex]);
                const embeddedPage = embeddedPages[0];
                
                if (!embeddedPage) return;
                
                const dims = embeddedPage.scale(1);
                
                // Scale to fill width completely (pages touch at center), fit height if possible
                const scaleWidth = maxWidth / dims.width;
                const scaleHeight = maxHeight / dims.height;
                const scale = Math.max(scaleWidth, scaleHeight);

                const scaledWidth = dims.width * scale;
                const scaledHeight = dims.height * scale;
                
                // Align to center fold: left page aligns right, right page aligns left
                const x = isLeft 
                    ? offsetX + halfWidth - scaledWidth - bleedRight
                    : offsetX + bleedLeft;
                const y = bleed + (maxHeight - scaledHeight) / 2;

                sheet.drawPage(embeddedPage, { x, y, width: scaledWidth, height: scaledHeight });
            }
        };

        await drawItem(p1, 0, true); // Left
        await drawItem(p2, halfWidth, false); // Right
    }
  }

  return await doc.save();
}
