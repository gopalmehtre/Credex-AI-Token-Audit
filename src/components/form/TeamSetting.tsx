'use client';
import type { UseCase } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  teamSize: number;
  useCase: UseCase;
  onTeamSizeChange: (v: number) => void;
  onUseCaseChange: (v: UseCase) => void;
}

const USE_CASES: { id: UseCase; label: string}[] = [
  { id: 'coding', label: 'Coding'},
  { id: 'writing', label: 'Writing' },
  { id: 'data', label: 'Data / Analytics' },
  { id: 'research', label: 'Research' },
  { id: 'mixed', label: 'Mixed' },
];

export default function TeamSettings({ teamSize, useCase, onTeamSizeChange, onUseCaseChange }: Props) {
  return (
    <div className="bg-ink-900 border border-ink-800 rounded-xl p-5 space-y-5">
      <h2 className="font-semibold text-white text-sm uppercase tracking-wide">Team context</h2>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Team size */}
        <div className="flex flex-col gap-2">
          <label htmlFor="team-size" className="text-ink-400 text-sm">
            Total team size
            <span className="text-ink-600 ml-1 text-xs">(people using AI tools)</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="team-size"
              type="number"
              min={1}
              max={100000}
              value={teamSize}
              onChange={(e) => onTeamSizeChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="input-base w-24 text-center"
            />
            <div className="flex gap-1.5">
              {[1, 5, 10, 25, 50].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onTeamSizeChange(n)}
                  className={cn(
                    'text-xs px-2.5 py-1.5 rounded-md transition-all duration-150 font-mono',
                    teamSize === n
                      ? 'bg-lime-300 text-ink-950 font-semibold'
                      : 'bg-ink-800 text-ink-400 hover:bg-ink-700 hover:text-ink-200'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Primary use case */}
        <div className="flex flex-col gap-2">
          <label className="text-ink-400 text-sm">Primary use case</label>
          <div className="flex flex-wrap gap-2">
            {USE_CASES.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onUseCaseChange(id)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-150 font-medium',
                  useCase === id
                    ? 'bg-lime-300/15 border border-lime-300/40 text-lime-300'
                    : 'bg-ink-800 border border-ink-700 text-ink-400 hover:border-ink-600 hover:text-ink-200'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
