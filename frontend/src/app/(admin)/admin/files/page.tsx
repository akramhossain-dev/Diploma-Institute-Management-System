'use client';

import React from 'react';
import { PageContainer } from '@/components/shared/layout/PageContainer';
import { SectionHeader } from '@/components/shared/layout/SectionHeader';
import { useFiles } from '@/hooks/admin/useFiles';
import { TableSkeleton } from '@/components/shared/feedback/Skeletons';
import { ErrorState } from '@/components/shared/feedback/ErrorState';
import { EmptyState } from '@/components/shared/feedback/EmptyState';
import { StatusBadge } from '@/components/shared/feedback/StatusBadge';
import { ActionToolbar } from '@/components/shared/layout/ActionToolbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LucideIcon } from '@/components/shared/navigation/LucideIcon';
import { UploadedFile } from '@/types/admin/file-manager.types';

export default function AdminFilesPage() {
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  
  const {
    files,
    isLoading,
    isError,
    refetch,
    uploadFile,
    isUploading,
    deleteFile,
  } = useFiles({ search, type: typeFilter });

  const [selectedFile, setSelectedFile] = React.useState<UploadedFile | null>(null);
  const [fileToDelete, setFileToDelete] = React.useState<UploadedFile | null>(null);

  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (isLoading && files.length === 0) {
    return (
      <PageContainer>
        <SectionHeader title="Central File Manager" description="Loading file repository..." />
        <TableSkeleton rows={5} />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <SectionHeader title="Central File Manager" description="Centralized system attachments repository." />
        <ErrorState message="Failed to fetch file records. Please check API routing." onRetry={refetch} />
      </PageContainer>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIconName = (mime: string) => {
    if (mime.includes('pdf')) return 'FileText';
    if (mime.includes('image')) return 'Image';
    if (mime.includes('csv') || mime.includes('sheet') || mime.includes('excel')) return 'FileSpreadsheet';
    if (mime.includes('word') || mime.includes('document')) return 'File';
    return 'FileQuestion';
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await uploadFile({ file, moduleRef: 'General Upload' });
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await uploadFile({ file, moduleRef: 'General Upload' });
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Central File Manager"
        description="Inspect, review, download, or remove static attachments, notices archives, student reports, and exam schedules."
      />

      {}
      <Card className="border-2 border-dashed rounded-xl mb-6 shadow-xs overflow-hidden transition-all bg-card/40 backdrop-blur-md">
        <CardContent className="p-6">
          <form
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center py-6 text-center rounded-lg border-2 border-transparent transition-all cursor-pointer ${
              dragActive ? 'bg-primary/5 border-primary/20 animate-pulse' : 'hover:bg-muted/10'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
              disabled={isUploading}
            />
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm">
              {isUploading ? (
                <LucideIcon name="RefreshCw" className="animate-spin" size={24} />
              ) : (
                <LucideIcon name="UploadCloud" size={24} />
              )}
            </div>
            <h3 className="text-sm font-bold text-foreground">
              {isUploading ? 'Uploading Attachment...' : 'Drag & drop a file here, or click to browse'}
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 font-medium max-w-xs">
              Supports CSV template sheets, PDF course guides, DOCX exam routine logs up to 10MB.
            </p>
          </form>
        </CardContent>
      </Card>

      <ActionToolbar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter attachments by name..."
        filterContent={
          <div className="flex gap-1.5 border rounded-lg p-0.5 bg-muted/20">
            {['all', 'pdf', 'image', 'csv', 'document'].map((type) => (
              <Button
                key={type}
                variant={typeFilter === type ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTypeFilter(type)}
                className="text-xs h-8 px-2.5 py-1 font-bold uppercase"
              >
                {type}
              </Button>
            ))}
          </div>
        }
      />

      {files.length === 0 ? (
        <EmptyState
          title="No Files Found"
          description="Your search criteria did not match any stored attachments."
          icon={<LucideIcon name="FileWarning" size={32} />}
        />
      ) : (
        <Card className="border shadow-md rounded-xl overflow-hidden bg-card/80 backdrop-blur-md">
          <Table>
            <TableHeader className="bg-muted/15 border-b">
              <TableRow>
                <TableHead className="text-xs font-bold w-[350px]">File Name</TableHead>
                <TableHead className="text-xs font-bold">Module Reference</TableHead>
                <TableHead className="text-xs font-bold text-right">Size</TableHead>
                <TableHead className="text-xs font-bold">Uploaded By</TableHead>
                <TableHead className="text-xs font-bold">Upload Date</TableHead>
                <TableHead className="text-xs font-bold text-center w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file._id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="font-bold text-xs text-foreground flex items-center gap-2.5 py-4">
                    <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
                      <LucideIcon name={getFileIconName(file.type)} size={16} />
                    </div>
                    <span className="truncate max-w-[280px]">{file.name}</span>
                  </TableCell>
                  <TableCell className="text-xs font-semibold">
                    <StatusBadge status={file.moduleRef || 'General'} />
                  </TableCell>
                  <TableCell className="text-xs font-bold text-right text-muted-foreground">
                    {formatFileSize(file.size)}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-muted-foreground">
                    {file.uploadedBy}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-muted-foreground">
                    {new Date(file.uploadDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedFile(file)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Preview attachment details"
                      >
                        <LucideIcon name="Eye" size={15} />
                      </Button>
                      <a href={file.url} download={file.name}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          title="Download attachment file"
                        >
                          <LucideIcon name="Download" size={15} />
                        </Button>
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFileToDelete(file)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        title="Delete attachment"
                      >
                        <LucideIcon name="Trash2" size={15} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {}
      {selectedFile && (
        <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
          <DialogContent onClose={() => setSelectedFile(null)} className="max-w-lg rounded-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-md">
                <LucideIcon name={getFileIconName(selectedFile.type)} className="text-primary" size={20} />
                File Attachment Info
              </DialogTitle>
              <DialogDescription className="mt-2 text-xs truncate max-w-[420px] font-bold">
                {selectedFile.name}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3.5 border-y my-2 text-xs leading-relaxed">
              <div className="flex justify-between">
                <span className="font-bold text-muted-foreground">Content-Type (Mime):</span>
                <span className="font-semibold text-foreground">{selectedFile.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-muted-foreground">File size (Raw bytes):</span>
                <span className="font-bold text-foreground">{formatFileSize(selectedFile.size)} ({selectedFile.size} bytes)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-muted-foreground">Module Context:</span>
                <span className="font-semibold text-foreground capitalize">{selectedFile.moduleRef || 'General Upload'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-muted-foreground">Uploader Identity:</span>
                <span className="font-semibold text-foreground">{selectedFile.uploadedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-muted-foreground">Upload Timestamp:</span>
                <span className="font-semibold text-foreground">{new Date(selectedFile.uploadDate).toLocaleString()}</span>
              </div>

              {selectedFile.type.includes('image') && (
                <div className="pt-3 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.name}
                    className="max-h-48 object-contain rounded-lg border bg-muted/20"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)}>
                Dismiss
              </Button>
              <a href={selectedFile.url} download={selectedFile.name}>
                <Button size="sm" className="shadow-xs font-semibold">
                  <LucideIcon name="Download" size={14} className="mr-1.5" />
                  Download File
                </Button>
              </a>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {}
      {fileToDelete && (
        <ConfirmDialog
          open={!!fileToDelete}
          onOpenChange={() => setFileToDelete(null)}
          title="Remove File Attachment"
          description={`Are you sure you want to delete "${fileToDelete.name}"? This file will be permanently removed and any linked module reference references may break.`}
          confirmLabel="Remove File"
          variant="destructive"
          onConfirm={async () => {
            await deleteFile(fileToDelete._id);
          }}
        />
      )}
    </PageContainer>
  );
}
