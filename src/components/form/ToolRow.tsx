'use client';
import { useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import type { ToolId, ToolInput } from '@/types';
import { PRICING_DATA, TOOL_DISPLAY_ORDER } from '@/lib/pricing-data';
import { cn } from '@/lib/utils';

interface Props {
  tool: ToolInput;
  index: number;
  canRemove: boolean;
  usedToolIds: ToolId[];
  onChange: (updated: ToolInput) => void;
  onRemove: () => void;
}

// const TOOL_ICONS: Partial<Record<ToolId, string>> = {
//   cursor: '⌶',
//   github_copilot: '🐙',
//   claude: '◆',
//   chatgpt: '✦',
//   anthropic_api: '◈',
//   openai_api: '⬡',
//   gemini: '✧',
//   windsurf: '〰',
// };

export default function ToolRow({ tool, canRemove, usedToolIds, onChange, onRemove }: Props) {
  const toolData = PRICING_DATA[tool.toolId];
  const isApiTool = tool.toolId === 'anthropic_api' || tool.toolId === 'openai_api';

  // When tool changes, reset plan to first available
  const handleToolChange = (newToolId: ToolId) => {
    const newToolData = PRICING_DATA[newToolId];
    const firstPlan = newToolData?.plans[0];
    onChange({
      toolId: newToolId,
      plan: firstPlan?.id ?? 'pay_as_you_go',
      monthlySpend: firstPlan?.pricePerUserPerMonth ?? 0,
      seats: tool.seats,
    });
  };

  // Auto-update spend when plan changes (for non-API tools)
  const handlePlanChange = (planId: string) => {
    const plan = toolData?.plans.find((p) => p.id === planId);
    const autoSpend = plan ? plan.pricePerUserPerMonth * tool.seats : tool.monthlySpend;
    onChange({
      ...tool,
      plan: planId,
      monthlySpend: isApiTool ? tool.monthlySpend : autoSpend,
    });
  };

  const handleSeatsChange = (seats: number) => {
    const plan = toolData?.plans.find((p) => p.id === tool.plan);
    const autoSpend = plan && !isApiTool ? plan.pricePerUserPerMonth * seats : tool.monthlySpend;
    onChange({ ...tool, seats, monthlySpend: isApiTool ? tool.monthlySpend : autoSpend });
  };

  return (
    <div className={cn(
      'bg-ink-900 border border-ink-800 rounded-xl p-4 transition-all duration-200',
      'hover:border-ink-700'
    )}>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-3 items-center">

        {/* Tool selector */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-500 font-medium uppercase tracking-wide">Tool</label>
          <div className="relative">
            {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">
              {TOOL_ICONS[tool.toolId] ?? '⬡'}
            </span> */}
            <select
              value={tool.toolId}
              onChange={(e) => handleToolChange(e.target.value as ToolId)}
              className="input-base pl-8 appearance-none cursor-pointer"
              aria-label="Select AI tool"
            >
              {TOOL_DISPLAY_ORDER.map((id) => {
                const isUsed = usedToolIds.includes(id) && id !== tool.toolId;
                return (
                  <option key={id} value={id} disabled={isUsed}>
                    {PRICING_DATA[id].name}
                    {isUsed ? ' (already added)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Plan selector */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-500 font-medium uppercase tracking-wide">Plan</label>
          <select
            value={tool.plan}
            onChange={(e) => handlePlanChange(e.target.value)}
            className="input-base appearance-none cursor-pointer"
            aria-label="Select plan"
          >
            {toolData?.plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
                {plan.pricePerUserPerMonth > 0
                  ? ` — $${plan.pricePerUserPerMonth}/user`
                  : plan.id === 'pay_as_you_go' || plan.id.includes('api')
                    ? ' (enter actual spend)'
                    : ' (Free)'}
              </option>
            ))}
          </select>
        </div>

        {/* Seats */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-500 font-medium uppercase tracking-wide">
            {isApiTool ? 'Users' : 'Seats'}
          </label>
          <input
            type="number"
            min={1}
            max={10000}
            value={tool.seats}
            onChange={(e) => handleSeatsChange(Math.max(1, parseInt(e.target.value) || 1))}
            className="input-base w-20 text-center"
            aria-label="Number of seats"
          />
        </div>

        {/* Monthly spend */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-500 font-medium uppercase tracking-wide">
            Monthly spend
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 text-sm">$</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={tool.monthlySpend}
              onChange={(e) => onChange({ ...tool, monthlySpend: parseFloat(e.target.value) || 0 })}
              className="input-base pl-6 w-28"
              placeholder="0"
              aria-label="Monthly spend in USD"
            />
          </div>
          {!isApiTool && tool.seats > 1 && (
            <span className="text-ink-600 text-xs font-mono">
              ${toolData?.plans.find(p => p.id === tool.plan)?.pricePerUserPerMonth ?? 0}/seat × {tool.seats}
            </span>
          )}
          {isApiTool && (
            <span className="text-ink-600 text-xs">Enter your actual bill</span>
          )}
        </div>

        {/* Remove */}
        <div className="flex items-end pb-0.5">
          <button
            type="button"
            onClick={onRemove}
            disabled={!canRemove}
            className={cn(
              'p-2 rounded-lg transition-all duration-150',
              canRemove
                ? 'text-ink-600 hover:text-red-400 hover:bg-red-400/10'
                : 'text-ink-800 cursor-not-allowed'
            )}
            aria-label="Remove tool"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
