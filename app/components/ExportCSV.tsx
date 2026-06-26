'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

type Row = Record<string, string | number | null | undefined>;

interface Props {
  label: string;
  filename: string;
  fetchData: () => Promise<Row[]>;
}

function toCSV(rows: Row[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: string | number | null | undefined) => {
    const s = String(v ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [
    headers.map(escape).join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ];
  return lines.join('\r\n');
}

export default function ExportCSV({ label, filename, fetchData }: Props) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const data = await fetchData();
      const csv = toCSV(data);
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur export CSV', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="btn-ghost text-xs flex items-center gap-1.5 py-1.5 px-3 disabled:opacity-50"
    >
      {loading ? (
        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Download size={12} />
      )}
      {loading ? 'Export…' : label}
    </button>
  );
}
