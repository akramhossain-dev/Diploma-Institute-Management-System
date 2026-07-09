'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from '../shared/navigation/LucideIcon';
import { cn } from '@/lib/utils';
import { adminFileManagerService } from '@/services/admin/file-manager.service';

interface FileUploaderProps {
  onUploadSuccess: (url: string) => void;
  allowedTypes?: string[]; // e.g. ['image/jpeg', 'image/png', 'application/pdf']
  maxSizeMB?: number;
  label?: string;
  className?: string;
}

export function FileUploader({
  onUploadSuccess,
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
  maxSizeMB = 2,
  label = 'Upload document copy (PDF/JPG)',
  className,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateAndUpload = async (file: File) => {
    setErrorMessage(null);
    setFileName(file.name);

    // 1. Validate file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      setErrorMessage(`Invalid file type. Allowed formats: ${allowedTypes.join(', ')}`);
      setFileName(null);
      return;
    }

    // 2. Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage(`File size exceeds limit. Maximum allowed size is ${maxSizeMB}MB.`);
      setFileName(null);
      return;
    }

    // 3. Mock file upload progress
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      // Call real file upload API endpoint
      const uploadedFile = await adminFileManagerService.uploadFile(file);
      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        setUploading(false);
        onUploadSuccess(uploadedFile.url);
      }, 300);
    } catch (err) {
      clearInterval(interval);
      setUploading(false);
      setErrorMessage('Upload failed. Please try again.');
      setFileName(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 min-h-[140px]',
          dragActive ? 'border-primary bg-primary/5 scale-98' : 'border-border hover:bg-muted/30',
          uploading && 'pointer-events-none opacity-80'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={allowedTypes.join(',')}
        />

        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <>
              <LucideIcon name="CloudLightning" className="animate-bounce text-primary" size={28} />
              <span className="text-sm font-semibold">Uploading document copy...</span>
              <div className="w-48 bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : fileName ? (
            <>
              <LucideIcon name="FileCheck" className="text-emerald-500" size={28} />
              <span className="text-sm font-semibold truncate max-w-xs">{fileName}</span>
              <span className="text-xs text-muted-foreground">Upload complete</span>
            </>
          ) : (
            <>
              <LucideIcon name="UploadCloud" className="text-muted-foreground" size={28} />
              <span className="text-sm font-semibold">{label}</span>
              <span className="text-xs text-muted-foreground">
                Drag and drop files here, or click to browse. Max size {maxSizeMB}MB.
              </span>
            </>
          )}
        </div>
      </div>

      {errorMessage && (
        <span className="mt-2 block text-xs text-destructive text-center">{errorMessage}</span>
      )}
    </div>
  );
}
export default FileUploader;
