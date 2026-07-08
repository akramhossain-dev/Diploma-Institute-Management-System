'use client';

import React from 'react';
import { FileUploader } from './FileUploader';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
  maxSizeMB?: number;
  className?: string;
}

export function ImageUploader({
  onUploadSuccess,
  label = 'Upload avatar photo (JPG/PNG)',
  maxSizeMB = 2,
  className,
}: ImageUploaderProps) {
  return (
    <FileUploader
      onUploadSuccess={onUploadSuccess}
      allowedTypes={['image/jpeg', 'image/png']}
      maxSizeMB={maxSizeMB}
      label={label}
      className={className}
    />
  );
}
export default ImageUploader;
