create table public.extractions (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references public.documents on delete cascade unique,
  application_id uuid references public.applications on delete cascade,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  raw_data jsonb,
  structured_data jsonb,
  confidence_score numeric,
  error_message text,
  tokens_input int,
  tokens_output int,
  cost_usd numeric,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.extractions enable row level security;

create policy "Users see own extractions" on extractions for all using (
  application_id in (select id from applications where user_id = auth.uid())
);

-- Update applications status check
alter table public.applications drop constraint if exists applications_status_check;
alter table public.applications add constraint applications_status_check 
  check (status in ('pending', 'extracting', 'analyzing', 'completed', 'rejected', 'failed'));

-- Enable Realtime on extractions table (run in Supabase dashboard or via API)
-- alter publication supabase_realtime add table extractions;
