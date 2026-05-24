import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get document path
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('file_path, application_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('loan-documents')
      .remove([document.file_path]);

    if (storageError) {
      console.error('Error removing from storage:', storageError);
      // We'll continue to delete from DB even if storage fails to avoid dangling DB rows
    }

    // Delete from DB
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      application_id: document.application_id,
      user_id: user.id,
      action: 'document_deleted',
      metadata: { document_id: id, file_path: document.file_path }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/documents/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
