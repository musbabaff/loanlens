'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, ZoomIn, ZoomOut, Download, AlertCircle } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string;
  filename: string;
}

export function PDFViewer({ url, filename }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<boolean>(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setError(false);
  }

  function onDocumentLoadError(err: any) {
    console.error('Failed to load PDF:', err);
    setError(true);
  }

  const zoomIn = () => setScale(s => Math.min(s + 0.25, 2.5));
  const zoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));

  if (error) {
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-muted/30 border rounded-lg p-4">
        <AlertCircle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-sm font-medium mb-4">Could not load PDF viewer</p>
        <p className="text-xs text-muted-foreground mb-4">Falling back to native browser viewer</p>
        <iframe src={url} className="w-full h-[600px] rounded border bg-white" title={filename} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-muted/10">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-card">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate max-w-[200px]">{filename}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={zoomOut} className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={zoomIn} className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </button>
          <div className="w-px h-4 bg-border mx-2" />
          <a
            href={url}
            download={filename}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 hover:bg-muted rounded text-muted-foreground"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 overflow-auto p-4 flex justify-center bg-black/5">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading PDF...
            </div>
          }
          className="pdf-document"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg border bg-white"
          />
        </Document>
      </div>

      {/* Pagination */}
      {numPages && numPages > 1 && (
        <div className="flex items-center justify-center p-2 border-t bg-card gap-4">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(p => p - 1)}
            className="text-sm font-medium disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {pageNumber} of {numPages}
          </span>
          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber(p => p + 1)}
            className="text-sm font-medium disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
