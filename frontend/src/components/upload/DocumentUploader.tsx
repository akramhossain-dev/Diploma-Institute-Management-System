'use client';

import React from 'react';
import { FileUploader } from './FileUploader';

interface DocumentUploaderProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
  maxSizeMB?: number;
  className?: string;
}

export function DocumentUploader({
  onUploadSuccess,
  label = 'Upload certificate copy (PDF only)',
  maxSizeMB = 5,
  className,
}: DocumentUploaderProps) {
  return (
    <FileUploader
      onUploadSuccess={onUploadSuccess}
      allowedTypes={['application/pdf']}
      maxSizeMB={maxSizeMB}
      label={label}
      className={className}
    />
  );
}
export default DocumentUploader;
