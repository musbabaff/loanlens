'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

import { DocumentUploader } from '@/components/upload/document-uploader';
import { useUploadStore } from '@/lib/stores/upload-store';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  applicant_name: z.string().min(2, 'Name must be at least 2 characters'),
  loan_amount: z.coerce.number().positive('Amount must be positive'),
  loan_purpose: z.string().min(5, 'Please provide more details'),
});

export default function NewApplicationPage() {
  const router = useRouter();
  const [hasFiles, setHasFiles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppId, setCreatedAppId] = useState<string | undefined>();
  const { clearUploads } = useUploadStore();

  useEffect(() => {
    clearUploads();
  }, [clearUploads]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      applicant_name: '',
      loan_amount: '' as unknown as number,
      loan_purpose: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!hasFiles) {
      toast.error('Please add at least one document');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create application');
      }

      const application = await res.json();
      setCreatedAppId(application.id);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  }

  const handleUploadComplete = () => {
    toast.success('Application created successfully');
    router.push(`/dashboard/applications/${createdAppId}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/applications" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">New Application</h1>
      </div>

      <div className="bg-bg-surface text-text-primary border border-border-subtle rounded-xl p-6 shadow-sm">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none">Applicant Name</label>
              <input
                {...form.register('applicant_name')}
                className="flex h-10 w-full rounded-md border border-border-default bg-bg-surface px-3 py-2 text-sm mt-2 placeholder:text-text-muted"
                placeholder="e.g. Quliyeva Ləman Elçin qızı"
                disabled={isSubmitting}
              />
              {form.formState.errors.applicant_name && (
                <p className="text-[0.8rem] font-medium text-destructive mt-1">
                  {form.formState.errors.applicant_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium leading-none">Loan Amount (AZN)</label>
              <input
                type="number"
                {...form.register('loan_amount')}
                className="flex h-10 w-full rounded-md border border-border-default bg-bg-surface px-3 py-2 text-sm mt-2 placeholder:text-text-muted"
                placeholder="e.g. 30000"
                disabled={isSubmitting}
              />
              {form.formState.errors.loan_amount && (
                <p className="text-[0.8rem] font-medium text-destructive mt-1">
                  {form.formState.errors.loan_amount.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium leading-none">Loan Purpose</label>
              <textarea
                {...form.register('loan_purpose')}
                className="flex min-h-[80px] w-full rounded-md border border-border-default bg-bg-surface px-3 py-2 text-sm mt-2 resize-none placeholder:text-text-muted"
                placeholder="Business expansion..."
                disabled={isSubmitting}
              />
              {form.formState.errors.loan_purpose && (
                <p className="text-[0.8rem] font-medium text-destructive mt-1">
                  {form.formState.errors.loan_purpose.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Documents</h3>
            <p className="text-sm text-muted-foreground">Upload required supporting documents (PDF only).</p>
            <DocumentUploader
              applicationId={createdAppId}
              onComplete={handleUploadComplete}
              onFilesChange={setHasFiles}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !hasFiles || !!createdAppId}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {isSubmitting || createdAppId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {createdAppId ? 'Uploading...' : 'Processing...'}
                </>
              ) : (
                'Create Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
