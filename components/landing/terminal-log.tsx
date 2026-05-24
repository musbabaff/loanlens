"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const lines = [
  { type: "command", content: 'loanlens init workflow --target="app_8492_C"', delay: 0 },
  { type: "log", content: "[11:42:01] Spawning agent sub-routines.", delay: 300 },
  { type: "process", label: "agent_tax_1120", status: "[PARSING]", statusColor: "text-[var(--brand-accent)]", delay: 600 },
  { type: "process", label: "agent_bank_ops", status: "[PARSING]", statusColor: "text-[var(--brand-accent)]", delay: 900 },
  { type: "process", label: "agent_kyc", status: "[VERIFIED]", statusColor: "text-[var(--success)]", delay: 1200 },
  { type: "log", content: "[11:42:15] Cross-referencing entities.", delay: 1700 },
  { type: "warning", content: "⚠ Variance detected in self-reported income (+14.2%)", delay: 2200 },
  { type: "log", content: "[11:42:18] Synthesizing credit memo.", delay: 2800 },
  { type: "result", delay: 3500 },
];

export function TerminalLog() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[360px] bg-[var(--bg-surface)] rounded-lg border border-[var(--border-subtle)]"></div>;

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg shadow-2xl overflow-hidden relative" style={{ boxShadow: '0 0 0 1px rgba(0,212,255,0.1), 0 0 24px rgba(0,212,255,0.1)' }}>
      {/* Window Chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="font-mono text-[10px] text-[var(--text-muted)] mx-auto uppercase tracking-widest">
          AGENT_EXECUTION_LOG.SH
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-6 font-mono text-[13px] leading-loose overflow-x-auto min-h-[320px]">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: line.delay / 1000, duration: 0.2 }}
            className="mb-1"
          >
            {line.type === "command" && (
              <div>
                <span className="text-[var(--brand-accent)] mr-2">→</span>
                <span className="text-[var(--brand-accent)]">{line.content?.split(' ')[0]}</span>
                <span className="text-white">{" " + line.content?.split(' ').slice(1).join(' ')}</span>
              </div>
            )}

            {line.type === "log" && (
              <div className="text-[var(--text-muted)]">{line.content}</div>
            )}

            {line.type === "process" && (
              <div className="flex justify-between w-64 ml-4 border-l border-[var(--border-subtle)] pl-4 py-0.5">
                <span className="text-white">{line.label}</span>
                <span className={line.statusColor}>{line.status}</span>
              </div>
            )}

            {line.type === "warning" && (
              <div className="text-[var(--warning)]">{line.content}</div>
            )}

            {line.type === "result" && (
              <div className="mt-4 p-4 border border-[var(--border-subtle)] rounded bg-[var(--bg-base)]">
                <div className="text-[var(--brand-accent)] mb-1 font-semibold">
                  FINAL_RATING: <span className="text-white font-bold">A2_PRIME</span>
                </div>
                <div className="text-[var(--text-secondary)]">confidence_score: <span className="text-white">0.998</span></div>
                <div className="text-[var(--text-secondary)]">processing_time:  <span className="text-white">184s</span></div>
              </div>
            )}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            delay: 4.5,
            duration: 0.8,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="w-2 h-4 bg-[var(--text-muted)] mt-2 inline-block"
        />
      </div>
    </div>
  );
}
