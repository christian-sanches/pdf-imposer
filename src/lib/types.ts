export type PageType = 'pdf' | 'image' | 'blank';

export interface Page {
  id: string;
  sourceFileId: string; // ID of the source file
  pageIndex: number; // 0-based index in the source file
  thumbnailUrl: string;
  type: PageType;
  width?: number;
  height?: number;
}

export interface SourceFile {
  id: string;
  file: File;
  type: 'pdf' | 'image';
}

