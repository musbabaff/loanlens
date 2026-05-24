import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const uploadSchema = z.object({
  applicationId: z.string().uuid(),
  filename: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = uploadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { applicationId, filename } = parsed.data;

    // Verify application belongs to user
    const { data: app, error: appError } = await supabase
      .from('applications')
      .select('id')
      .eq('id', applicationId)
      .eq('user_id', user.id)
      .single();

    if (appError || !app) {
      return NextResponse.json({ error: 'Application not found or unauthorized' }, { status: 403 });
    }

    const documentId = crypto.randomUUID();
    // Path convention: {user_id}/{application_id}/{document_id}_{original_filename}
    // We sanitize filename to avoid issues with special chars
    const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${user.id}/${applicationId}/${documentId}_${sanitizedName}`;

    // Get signed upload URL
    const { data, error } = await supabase.storage
      .from('loan-documents')
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error('Error creating signed upload URL:', error);
      return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 });
    }

    // Also pre-create the document row so we have it pending (or we could let client create it after upload)
    // Actually, client creating it after successful upload is better so we don't have dangling rows
    // Wait, the Prompt says "On submit: create applications row, upload files... create documents rows".
    
    return NextResponse.json({
      url: data.signedUrl,
      path,
      token: data.token,
      documentId
    });
  } catch (err) {
    console.error('POST /api/documents/upload-url error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
