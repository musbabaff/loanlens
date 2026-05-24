import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
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

    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*, documents(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (appError) {
      console.error('Error fetching application:', appError);
      return NextResponse.json({ error: 'Failed to fetch application' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (err) {
    console.error('GET /api/applications/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    // First fetch documents to delete from storage
    const { data: documents } = await supabase
      .from('documents')
      .select('file_path')
      .eq('application_id', id)
      .eq('user_id', user.id);

    if (documents && documents.length > 0) {
      const filePaths = documents.map(d => d.file_path);
      const { error: storageError } = await supabase.storage
        .from('loan-documents')
        .remove(filePaths);
      
      if (storageError) {
        console.error('Error deleting files from storage:', storageError);
      }
    }

    // DB cascade should handle document rows, but let's delete app explicitly
    const { error: deleteError } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Error deleting application:', deleteError);
      return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
    }
    
    // Log deletion if we want, but cascade might handle it or we can't if we delete app.
    // Actually, audit_logs will cascade delete. If we wanted to keep audit log of deletion,
    // we would need application_id nullable, or a separate global log.

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/applications/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
