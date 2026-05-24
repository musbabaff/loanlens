'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { FileBox, Search, Plus } from 'lucide-react';
import Link from 'next/link';

type Application = {
  id: string;
  applicant_name: string;
  loan_amount: number;
  loan_purpose: string;
  status: string;
  created_at: string;
  documents_count: number;
};

const columnHelper = createColumnHelper<Application>();

const columns = [
  columnHelper.accessor('applicant_name', {
    header: 'Applicant',
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor('loan_amount', {
    header: 'Amount',
    cell: (info) => `₼${info.getValue().toLocaleString()}`,
  }),
  columnHelper.accessor('loan_purpose', {
    header: 'Purpose',
    cell: (info) => (
      <span className="truncate max-w-[200px] inline-block" title={info.getValue()}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const val = info.getValue();
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
          val === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
          val === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
          val === 'rejected' ? 'bg-red-500/10 text-red-500' :
          'bg-primary/10 text-primary'
        }`}>
          {val}
        </span>
      );
    },
  }),
  columnHelper.accessor('documents_count', {
    header: 'Docs',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Date',
    cell: (info) => format(new Date(info.getValue()), 'MMM d, yyyy'),
  }),
];

export function ApplicationsTable() {
  const router = useRouter();
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/applications?status=${statusFilter}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [statusFilter]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return <div className="flex justify-center p-10"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (data.length === 0 && !globalFilter && statusFilter === 'all') {
    return (
      <div className="bg-surface border-border/50 border-dashed border-2 rounded-xl h-[400px] flex flex-col items-center justify-center text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <FileBox className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">No applications yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Create your first application to start uploading documents and running AI analysis.
          </p>
        </div>
        <Link
          href="/dashboard/applications/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4"
        >
          Create your first application
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Search applications..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="rounded-md border bg-card text-card-foreground overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="h-10 px-4 text-left align-middle font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => router.push(`/dashboard/applications/${row.original.id}`)}
                  className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-4 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
