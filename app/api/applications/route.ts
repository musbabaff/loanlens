import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const createApplicationSchema = z.object({
  applicant_name: z.string().min(1, 'Applicant name is required'),
  loan_amount: z.number().positive('Loan amount must be positive'),
  loan_purpose: z.string().min(1, 'Loan purpose is required'),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const { applicant_name, loan_amount, loan_purpose } = parsed.data;

    // Create application
    const { data: application, error: appError } = await supabase
      .from('applications')
      .insert({
        user_id: user.id,
        applicant_name,
        loan_amount,
        loan_purpose,
        status: 'pending',
      })
      .select()
      .single();

    if (appError) {
      console.error('Error creating application:', appError);
      return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      application_id: application.id,
      user_id: user.id,
      action: 'application_created',
      metadata: { applicant_name, loan_amount, loan_purpose }
    });

    return NextResponse.json(application);
  } catch (err) {
    console.error('POST /api/applications error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    let query = supabase
      .from('applications')
      .select('*, documents(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('applicant_name', `%${search}%`);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: applications, error: appsError } = await query;

    if (appsError) {
      console.error('Error fetching applications:', appsError);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    // Map documents count properly
    const mapped = applications.map(app => ({
      ...app,
      documents_count: app.documents[0]?.count || 0
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error('GET /api/applications error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
