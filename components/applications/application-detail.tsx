'use client';

import { useState, useEffect } from 'react';
import { ApplicationWithDocuments } from '@/types/loanlens';
import { format } from 'date-fns';
import { FileBox, Trash2, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PDFViewer } from './pdf-viewer';
import { DocumentUploader } from '../upload/document-uploader';
import { useRouter } from 'next/navigation';
import { ExtractionTab } from '../extraction/extraction-tab';

interface ApplicationDetailProps {
  initialApplication: ApplicationWithDocuments;
}

export function ApplicationDetail({ initialApplication }: ApplicationDetailProps) {
  const router = useRouter();
  const [application, setApplication] = useState(initialApplication);
  const [activeTab, setActiveTab] = useState<'documents' | 'extraction' | 'analysis' | 'memo' | 'audit'>('extraction');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    initialApplication.documents.length > 0 ? initialApplication.documents[0].id : null
  );
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isDeletingApp, setIsDeletingApp] = useState(false);

  // Fetch signed URL when selected document changes
  useEffect(() => {
    if (!selectedDocId) {
      setSignedUrl(null);
      return;
    }

    const fetchUrl = async () => {
      setIsLoadingPdf(true);
      try {
        const res = await fetch(`/api/documents/${selectedDocId}/signed-url`);
        if (!res.ok) throw new Error('Failed to load document');
        const { signedUrl } = await res.json();
        setSignedUrl(signedUrl);
      } catch (err) {
        console.error(err);
        toast.error('Could not load document preview');
        setSignedUrl(null);
      } finally {
        setIsLoadingPdf(false);
      }
    };

    fetchUrl();
  }, [selectedDocId]);

  const handleDeleteDocument = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete document');
      
      const newDocs = application.documents.filter(d => d.id !== id);
      setApplication(prev => ({ ...prev, documents: newDocs }));
      toast.success('Document deleted');
      
      if (selectedDocId === id) {
        setSelectedDocId(newDocs.length > 0 ? newDocs[0].id : null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Could not delete document');
    }
  };

  const handleDeleteApplication = async () => {
    if (!confirm('Are you sure you want to delete this entire application and all its documents? This cannot be undone.')) return;

    setIsDeletingApp(true);
    try {
      const res = await fetch(`/api/applications/${application.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete application');
      
      toast.success('Application deleted');
      router.push('/dashboard/applications');
    } catch (err) {
      console.error(err);
      toast.error('Could not delete application');
      setIsDeletingApp(false);
    }
  };

  const selectedDocument = application.documents.find(d => d.id === selectedDocId);

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{application.applicant_name}</h2>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">₼{application.loan_amount.toLocaleString()}</span>
            <span>•</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
              application.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
              application.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
              application.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
              'bg-primary/10 text-primary'
            }`}>
              {application.status}
            </span>
            <span>•</span>
            <span>Created {format(new Date(application.created_at), 'MMM d, yyyy')}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDeleteApplication}
            disabled={isDeletingApp}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border bg-background hover:bg-destructive hover:text-destructive-foreground hover:border-destructive h-9 px-4 transition-colors"
          >
            {isDeletingApp ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
            Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b shrink-0">
        <div className="flex space-x-6">
          {(['documents', 'extraction', 'analysis', 'memo', 'audit'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        {activeTab === 'documents' && (
          <div className="flex h-full gap-6">
            {/* Left sidebar: File list */}
            <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto pr-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm flex justify-between items-center">
                  Files ({application.documents.length})
                </h3>
                {application.documents.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg text-center">
                    No documents yet
                  </div>
                ) : (
                  <div className="space-y-1">
                    {application.documents.map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDocId(doc.id)}
                        className={`group flex flex-col p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedDocId === doc.id
                            ? 'bg-primary/5 border-primary/50'
                            : 'bg-card hover:bg-muted/50 border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className={`h-4 w-4 shrink-0 ${selectedDocId === doc.id ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="text-sm font-medium truncate">{doc.original_filename || 'Unknown file'}</span>
                          </div>
                          <button
                            onClick={(e) => handleDeleteDocument(doc.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                            title="Delete file"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1 pl-6 text-xs text-muted-foreground">
                          <span className="capitalize">{doc.document_type.replace('_', ' ')}</span>
                          <span>•</span>
                          <span>{doc.file_size_bytes ? Math.round(doc.file_size_bytes / 1024) + ' KB' : 'Unknown size'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold text-sm mb-3">Add more documents</h3>
                <DocumentUploader
                  applicationId={application.id}
                  onComplete={(newFiles) => {
                    // Refresh data or append optimistically
                    // For now, we reload the page or fetch
                    router.refresh();
                    setTimeout(() => window.location.reload(), 1000);
                  }}
                />
              </div>
            </div>

            {/* Right side: Preview */}
            <div className="flex-1 rounded-xl border bg-card overflow-hidden">
              {isLoadingPdf ? (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading preview...
                </div>
              ) : signedUrl && selectedDocument ? (
                <PDFViewer url={signedUrl} filename={selectedDocument.original_filename || 'document.pdf'} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <FileBox className="h-12 w-12 opacity-20" />
                  <p>Select a document to preview</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'extraction' && (
          <ExtractionTab application={application} />
        )}

        {activeTab === 'analysis' && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">AI Analysis</h3>
            <p className="text-muted-foreground max-w-md">
              Run AI analysis to extract data and detect risks. Coming in the next module.
            </p>
          </div>
        )}

        {activeTab === 'memo' && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Credit Memo</h3>
            <p className="text-muted-foreground max-w-md">
              Generate a comprehensive credit memo. Coming in later modules.
            </p>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <h3 className="font-semibold text-lg">Audit Log</h3>
            <p className="text-muted-foreground max-w-md">
              Activity history for this application. Coming in later modules.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
