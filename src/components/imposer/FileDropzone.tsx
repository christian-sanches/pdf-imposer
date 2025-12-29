'use client';

import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useCallback } from 'react';
import { clsx } from 'clsx';

interface FileDropzoneProps {
  onDrop: (files: File[]) => void;
  isProcessing?: boolean;
}

export function FileDropzone({ onDrop, isProcessing }: FileDropzoneProps) {
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    disabled: isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-300',
        isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800',
        isProcessing && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-6">
        <div className={clsx(
          "p-6 rounded-full transition-all duration-300",
          isDragActive ? "bg-blue-100 dark:bg-blue-900/30 scale-110" : "bg-gray-100 dark:bg-gray-700"
        )}>
          <Upload className={clsx(
            "w-16 h-16 transition-colors duration-300",
            isDragActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"
          )} />
        </div>
        <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {isDragActive ? (
            <p>Solte os arquivos aqui...</p>
          ) : (
            <p>Arraste e solte arquivos PDF ou imagens aqui, ou clique para selecionar</p>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Suporta PDF, PNG, JPG</p>
      </div>
    </div>
  );
}

