import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { extractDocument, DocumentType } from '@/lib/ai/extract-document';
import pLimit from 'p-limit';

const concurrencyLimit = pLimit(5); // max 5 parallel Claude calls

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: applicationId } = await params;
  const supabase = await createClient();

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Ownership check
  const { data: application, error: appError } = await supabase
    .from('applications')
    .select('id, user_id')
    .eq('id', applicationId)
    .eq('user_id', user.id)
    .single();

  if (appError || !application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  // Get all documents
  const { data: documents, error: docsError } = await supabase
    .from('documents')
    .select('*')
    .eq('application_id', applicationId);

  if (docsError || !documents || documents.length === 0) {
    return NextResponse.json({ error: 'No documents to extract' }, { status: 400 });
  }

  // Update application status
  await supabase
    .from('applications')
    .update({ status: 'extracting' })
    .eq('id', applicationId);

  // Process all documents in parallel with concurrency limit
  const results = await Promise.allSettled(
    documents.map(doc =>
      concurrencyLimit(async () => {
        const startTime = new Date();
        
        // Create extraction record
        const { data: extraction, error: createError } = await supabase
          .from('extractions')
          .upsert({
            document_id: doc.id,
            application_id: applicationId,
            status: 'processing',
            started_at: startTime.toISOString(),
          }, { onConflict: 'document_id' })
          .select()
          .single();

        if (createError) throw createError;

        try {
          // Download PDF from storage
          const { data: fileData, error: downloadError } = await supabase
            .storage
            .from('loan-documents')
            .download(doc.file_path);

          if (downloadError || !fileData) {
            throw new Error(`Failed to download: ${downloadError?.message}`);
          }

          // Convert to base64
          const arrayBuffer = await fileData.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');

          // Call extraction
          const result = await extractDocument(base64, doc.document_type as DocumentType);

          // Update extraction record
          await supabase
            .from('extractions')
            .update({
              status: 'completed',
              structured_data: result.structured_data as any,
              raw_data: { raw_response: result.raw_response },
              confidence_score: result.confidence,
              tokens_input: result.tokens_input,
              tokens_output: result.tokens_output,
              cost_usd: result.cost_usd,
              completed_at: new Date().toISOString(),
            })
            .eq('id', extraction.id);

          return { documentId: doc.id, success: true };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          await supabase
            .from('extractions')
            .update({
              status: 'failed',
              error_message: errorMessage,
              completed_at: new Date().toISOString(),
            })
            .eq('id', extraction.id);

          return { documentId: doc.id, success: false, error: errorMessage };
        }
      })
    )
  );

  // Update application status
  const allCompleted = results.every(r => r.status === 'fulfilled' && r.value.success);
  await supabase
    .from('applications')
    .update({ status: allCompleted ? 'analyzing' : 'failed' })
    .eq('id', applicationId);

  return NextResponse.json({
    success: true,
    results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: 'rejected' }),
  });
}
