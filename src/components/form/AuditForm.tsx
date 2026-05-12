'use client';
// src/components/form/AuditForm.tsx

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Loader2, ChevronRight } from 'lucide-react';
import type { AuditFormInput, ToolId, ToolInput, UseCase } from '@/types';
import { TOOL_DISPLAY_ORDER, PRICING_DATA } from '@/lib/pricing-data';
import ToolRow from './ToolRow';
import TeamSettings from './TeamSetting';

const DEFAULT_TOOL: ToolInput = {
  toolId: 'cursor',
  plan: 'pro',
  monthlySpend: 20,
  seats: 1,
};

const STORAGE_KEY = 'spendsight_form_state';

function loadSavedState(): AuditFormInput | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state: AuditFormInput) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { }
}

export default function AuditForm() {
  const router = useRouter();

  // Initialize with static defaults so server and client HTML always match
  const [tools, setTools] = useState<ToolInput[]>([{ ...DEFAULT_TOOL }]);
  const [teamSize, setTeamSize] = useState<number>(5);
  const [useCase, setUseCase] = useState<UseCase>('mixed');
  const [submitting, setSubmitting] = useState(false);

  // Hydrate from localStorage AFTER first render (client-only)
  useEffect(() => {
    const saved = loadSavedState();
    if (saved) {
      setTools(saved.tools);
      setTeamSize(saved.teamSize);
      setUseCase(saved.useCase);
    }
  }, []);

  const persistState = useCallback(
    (t: ToolInput[], ts: number, uc: UseCase) => {
      saveState({ tools: t, teamSize: ts, useCase: uc });
    },
    []
  );

  const addTool = () => {
    // Pick a tool not yet added
    const usedIds = new Set(tools.map((t) => t.toolId));
    const nextId = TOOL_DISPLAY_ORDER.find((id) => !usedIds.has(id)) ?? 'cursor';
    const firstPlan = PRICING_DATA[nextId as ToolId]?.plans[0];
    const newTool: ToolInput = {
      toolId: nextId as ToolId,
      plan: firstPlan?.id ?? 'pro',
      monthlySpend: firstPlan?.pricePerUserPerMonth ?? 0,
      seats: 1,
    };
    const updated = [...tools, newTool];
    setTools(updated);
    persistState(updated, teamSize, useCase);
  };

  const removeTool = (index: number) => {
    const updated = tools.filter((_, i) => i !== index);
    setTools(updated);
    persistState(updated, teamSize, useCase);
  };

  const updateTool = (index: number, updated: ToolInput) => {
    const next = tools.map((t, i) => (i === index ? updated : t));
    setTools(next);
    persistState(next, teamSize, useCase);
  };

  const handleSubmit = async () => {
    if (tools.length === 0) {
      toast.error('Add at least one AI tool to audit.');
      return;
    }

    const totalSpend = tools.reduce((s, t) => s + t.monthlySpend, 0);
    if (totalSpend === 0) {
      toast.error('Enter your actual monthly spend for at least one tool.');
      return;
    }

    setSubmitting(true);

    try {
      const payload: AuditFormInput & { honeypot: string } = {
        tools,
        teamSize,
        useCase,
        honeypot: '', // legitimate users leave this empty
      };

      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Audit failed. Please try again.');
      }

      const result = await res.json();

      // Persist to sessionStorage for the results page
      sessionStorage.setItem('auditResult', JSON.stringify(result));
      sessionStorage.setItem('auditInput', JSON.stringify({ tools, teamSize, useCase }));

      router.push('/audit/results');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Team settings */}
      <TeamSettings
        teamSize={teamSize}
        useCase={useCase}
        onTeamSizeChange={(v: number) => {
          setTeamSize(v);
          persistState(tools, v, useCase);
        }}
        onUseCaseChange={(v: UseCase) => {
          setUseCase(v);
          persistState(tools, teamSize, v);
        }}
      />

      {/* Tool rows */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">AI tools you pay for</h2>
          <span className="text-ink-500 text-sm font-mono">{tools.length} tool{tools.length !== 1 ? 's' : ''}</span>
        </div>

        {tools.map((tool, index) => (
          <ToolRow
            key={index}
            tool={tool}
            index={index}
            canRemove={tools.length > 1}
            usedToolIds={tools.map((t) => t.toolId)}
            onChange={(updated) => updateTool(index, updated)}
            onRemove={() => removeTool(index)}
          />
        ))}

        {tools.length < 8 && (
          <button
            type="button"
            onClick={addTool}
            className="w-full border-2 border-dashed border-ink-700 rounded-xl py-4 flex items-center justify-center gap-2
                       text-ink-500 hover:text-lime-300 hover:border-lime-300/40 transition-all duration-200 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Add another tool</span>
          </button>
        )}
      </div>

      {/* Summary bar */}
      <div className="bg-ink-900 border border-ink-800 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-ink-500 text-xs uppercase tracking-wide mb-1">Current monthly spend</p>
          <p className="text-white font-display font-bold text-2xl">
            ${tools.reduce((s, t) => s + (t.monthlySpend || 0), 0).toLocaleString()}
            <span className="text-ink-500 font-body font-normal text-sm">/mo</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary flex items-center gap-2 text-base px-7 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              Run audit
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Honeypot — visually hidden, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none w-0 h-0"
      />
    </div>
  );
}
