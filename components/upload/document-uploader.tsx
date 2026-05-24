'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadStore } from '@/lib/stores/upload-store';
import { UploadCloud, File as FileIcon, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export interface UploadedFile {
  id: string;
  documentId: string;
  name: string;
  type: string;
  size: number;
}

interface DocumentUploaderProps {
  applicationId?: string;
  onComplete?: (files: UploadedFile[]) => void;
  onFilesChange?: (hasFiles: boolean) => void;
}

export function DocumentUploader({ applicationId, onComplete, onFilesChange }: DocumentUploaderProps) {
  const { uploads, startUpload, updateProgress, completeUpload, failUpload, removeUpload } = useUploadStore();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [fileTypes, setFileTypes] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    // Validate
    const validFiles = acceptedFiles.filter((file) => {
      if (file.type !== 'application/pdf') {
        toast.error(`${file.name} is not a PDF`);
        return false;
      }
      if (file.size > 25 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 25MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setPendingFiles((prev) => {
        const newFiles = [...prev, ...validFiles].slice(0, 10);
        
        // Set default type to 'other'
        const newTypes = { ...fileTypes };
        validFiles.forEach(f => {
          if (!newTypes[f.name]) newTypes[f.name] = 'other';
        });
        setFileTypes(newTypes);

        if (onFilesChange) onFilesChange(newFiles.length > 0);
        return newFiles;
      });
    }
  }, [onFilesChange, fileTypes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 10,
  });

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      if (onFilesChange) onFilesChange(newFiles.length > 0);
      return newFiles;
    });
  };

  const handleTypeChange = (fileName: string, type: string) => {
    setFileTypes(prev => ({ ...prev, [fileName]: type }));
  };

  // Upload logic
  useEffect(() => {
    if (!applicationId || pendingFiles.length === 0 || isUploading) return;

    const uploadFiles = async () => {
      setIsUploading(true);
      const uploaded: UploadedFile[] = [];

      await Promise.all(
        pendingFiles.map(async (file) => {
          const fileId = crypto.randomUUID();
          startUpload(fileId, file);

          try {
            // 1. Get signed URL
            const urlRes = await fetch('/api/documents/upload-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ applicationId, filename: file.name }),
            });

            if (!urlRes.ok) throw new Error('Failed to get upload URL');
            const { url, path, documentId } = await urlRes.json();

            // 2. Upload file via PUT using XMLHttpRequest to track progress
            await new Promise<void>((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.open('PUT', url, true);
              xhr.setRequestHeader('Content-Type', 'application/pdf');

              xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                  const percent = Math.round((e.loaded / e.total) * 100);
                  updateProgress(fileId, percent);
                }
              };

              xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) resolve();
                else reject(new Error('Upload failed'));
              };

              xhr.onerror = () => reject(new Error('Upload failed'));
              xhr.send(file);
            });

            // 3. Create document record via client
            const docType = fileTypes[file.name] || 'other';
            const { error: dbError } = await supabase.from('documents').insert({
              id: documentId,
              application_id: applicationId,
              file_path: path,
              document_type: docType,
              file_size_bytes: file.size,
              original_filename: file.name,
            });

            if (dbError) throw new Error('Failed to create document record');
            
            // Also log audit
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('audit_logs').insert({
                application_id: applicationId,
                user_id: user.id,
                action: 'document_uploaded',
                metadata: { document_id: documentId, original_filename: file.name, document_type: docType }
              });
            }

            completeUpload(fileId, documentId);
            uploaded.push({ id: fileId, documentId, name: file.name, type: docType, size: file.size });

          } catch (err) {
            console.error(err);
            failUpload(fileId, err instanceof Error ? err.message : 'Upload failed');
            toast.error(`Failed to upload ${file.name}`);
          }
        })
      );

      setPendingFiles([]);
      setIsUploading(false);
      if (onComplete && uploaded.length > 0) {
        onComplete(uploaded);
      }
    };

    uploadFiles();
  }, [applicationId, pendingFiles, isUploading, startUpload, updateProgress, completeUpload, failUpload, onComplete, supabase, fileTypes]);

  const allUploads = Object.values(uploads);

  return (
    <div className="space-y-4">
      {pendingFiles.length === 0 && allUploads.length === 0 ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm font-medium">Drag & drop your PDFs here</p>
          <p className="text-xs text-muted-foreground mt-1">or click to browse (Max 25MB, up to 10 files)</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingFiles.map((file, i) => (
            <div key={`pending-${i}`} className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground">
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="truncate text-sm font-medium max-w-[200px]">{file.name}</div>
              </div>
              <div className="flex items-center gap-3">
                {!isUploading && (
                  <select
                    value={fileTypes[file.name] || 'other'}
                    onChange={(e) => handleTypeChange(file.name, e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring max-w-[140px]"
                  >
                    <option value="bank_statement">Bank Statement</option>
                    <option value="tax_return">Tax Return</option>
                    <option value="business_plan">Business Plan</option>
                    <option value="id_document">ID Document</option>
                    <option value="other">Other</option>
                  </select>
                )}
                {!isUploading && (
                  <button
                    type="button"
                    onClick={() => removePendingFile(i)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {allUploads.map((u) => (
            <div key={u.id} className="flex flex-col gap-2 p-3 rounded-lg border bg-card text-card-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="truncate text-sm font-medium">{u.file.name}</div>
                </div>
                {u.status === 'completed' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                {u.status === 'error' && <AlertCircle className="h-4 w-4 text-destructive" />}
                {u.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
              {u.status === 'uploading' && (
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${u.progress}%` }}
                  />
                </div>
              )}
              {u.status === 'error' && (
                <div className="text-xs text-destructive">{u.error}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
