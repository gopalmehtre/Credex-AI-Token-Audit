export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export type ToolId =
  | 'cursor'
  | 'github_copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf';

export interface ToolInput {
  toolId: ToolId;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
}

export type RecommendationType =
  | 'downgrade_plan'
  | 'switch_tool'
  | 'reduce_seats'
  | 'buy_via_credits'
  | 'already_optimal';

export interface ToolRecommendation {
  toolId: ToolId;
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: RecommendationType;
  recommendedPlan?: string;
  recommendedTool?: string;
  projectedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface AuditResult {
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  totalProjectedSpend: number;
  savingsTier: 'high' | 'medium' | 'low' | 'optimal';
  aiSummary?: string;
  shareId?: string;
  createdAt?: string;
}

export interface PlanData {
  id: string;
  name: string;
  pricePerUserPerMonth: number;
  minSeats?: number;
  maxSeats?: number;
  bestFor: UseCase[];
  features: string[];
}

export interface ToolData {
  id: ToolId;
  name: string;
  category: string;
  plans: PlanData[];
  alternatives: ToolId[];
}

export interface LeadCaptureInput {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
}

export interface ShareableAudit {
  shareId: string;
  tools: string[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsTier: string;
  useCase: UseCase;
  teamSize: number;
  recommendations: Omit<ToolRecommendation, never>[];
  aiSummary?: string;
  createdAt: string;
}