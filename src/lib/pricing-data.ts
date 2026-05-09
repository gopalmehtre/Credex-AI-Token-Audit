import type { ToolData, ToolId } from '@/types';

export const PRICING_DATA: Record<ToolId, ToolData> = {
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    category: 'AI Code Editor',
    plans: [
      {
        id: 'hobby',
        name: 'Hobby',
        pricePerUserPerMonth: 0,
        bestFor: ['coding'],
        features: ['2000 completions/mo', '50 slow requests'],
      },
      {
        id: 'pro',
        name: 'Pro',
        pricePerUserPerMonth: 20,
        bestFor: ['coding'],
        features: ['Unlimited completions', '500 fast requests', 'unlimited slow'],
      },
      {
        id: 'business',
        name: 'Business',
        pricePerUserPerMonth: 40,
        minSeats: 1,
        bestFor: ['coding'],
        features: ['Everything in Pro', 'SSO', 'Centralized billing', 'Admin dashboard'],
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        pricePerUserPerMonth: 60,
        minSeats: 20,
        bestFor: ['coding'],
        features: ['Custom contracts', 'SLA', 'Dedicated support'],
      },
    ],
    alternatives: ['github_copilot', 'windsurf'],
  },

  github_copilot: {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    category: 'AI Code Assistant',
    plans: [
      {
        id: 'individual',
        name: 'Individual',
        pricePerUserPerMonth: 10,
        bestFor: ['coding'],
        features: ['Code completions', 'Chat', 'Multi-line suggestions'],
      },
      {
        id: 'business',
        name: 'Business',
        pricePerUserPerMonth: 19,
        minSeats: 1,
        bestFor: ['coding'],
        features: ['Policy management', 'Audit logs', 'IP indemnity'],
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        pricePerUserPerMonth: 39,
        minSeats: 1,
        bestFor: ['coding'],
        features: ['Custom models', 'Knowledge bases', 'Fine-tuning'],
      },
    ],
    alternatives: ['cursor', 'windsurf'],
  },

  claude: {
    id: 'claude',
    name: 'Claude (claude.ai)',
    category: 'AI Assistant',
    plans: [
      {
        id: 'free',
        name: 'Free',
        pricePerUserPerMonth: 0,
        bestFor: ['writing', 'research'],
        features: ['Limited messages', 'Claude Haiku'],
      },
      {
        id: 'pro',
        name: 'Pro',
        pricePerUserPerMonth: 20,
        bestFor: ['writing', 'research', 'mixed'],
        features: ['5x more usage', 'Priority access', 'Projects'],
      },
      {
        id: 'max_5x',
        name: 'Max (5x)',
        pricePerUserPerMonth: 100,
        bestFor: ['writing', 'research', 'data', 'mixed'],
        features: ['5x Pro usage', 'All models', 'Extended thinking'],
      },
      {
        id: 'max_20x',
        name: 'Max (20x)',
        pricePerUserPerMonth: 200,
        bestFor: ['writing', 'research', 'data', 'mixed'],
        features: ['20x Pro usage', 'Highest priority'],
      },
      {
        id: 'team',
        name: 'Team',
        pricePerUserPerMonth: 30,
        minSeats: 5,
        bestFor: ['mixed', 'writing', 'research'],
        features: ['Higher limits', 'Collaboration', 'Admin controls'],
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        pricePerUserPerMonth: 60,
        minSeats: 10,
        bestFor: ['mixed'],
        features: ['SSO', 'Audit logs', 'Custom retention', 'SLA'],
      },
    ],
    alternatives: ['chatgpt', 'anthropic_api'],
  },

  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'AI Assistant',
    plans: [
      {
        id: 'free',
        name: 'Free',
        pricePerUserPerMonth: 0,
        bestFor: ['writing', 'research'],
        features: ['GPT-4o limited', 'Basic access'],
      },
      {
        id: 'plus',
        name: 'Plus',
        pricePerUserPerMonth: 20,
        bestFor: ['writing', 'research', 'mixed'],
        features: ['GPT-4o', 'GPT-4o mini', 'DALL-E', 'GPTs'],
      },
      {
        id: 'team',
        name: 'Team',
        pricePerUserPerMonth: 30,
        minSeats: 2,
        bestFor: ['mixed'],
        features: ['Higher limits', 'Workspace', 'Admin tools'],
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        pricePerUserPerMonth: 60,
        minSeats: 150,
        bestFor: ['mixed'],
        features: ['Unlimited GPT-4o', 'SSO', 'Advanced security'],
      },
    ],
    alternatives: ['claude', 'openai_api'],
  },

  anthropic_api: {
    id: 'anthropic_api',
    name: 'Anthropic API',
    category: 'AI API',
    plans: [
      {
        id: 'pay_as_you_go',
        name: 'Pay-as-you-go',
        pricePerUserPerMonth: 0, // token-based; user enters actual spend
        bestFor: ['coding', 'data', 'mixed'],
        features: ['Claude 3.5 Sonnet: $3/$15 per MTok', 'Claude 3 Haiku: $0.25/$1.25 per MTok'],
      },
    ],
    alternatives: ['claude', 'openai_api'],
  },

  openai_api: {
    id: 'openai_api',
    name: 'OpenAI API',
    category: 'AI API',
    plans: [
      {
        id: 'pay_as_you_go',
        name: 'Pay-as-you-go',
        pricePerUserPerMonth: 0, // token-based; user enters actual spend
        bestFor: ['coding', 'data', 'mixed'],
        features: ['GPT-4o: $2.50/$10 per MTok', 'GPT-4o mini: $0.15/$0.60 per MTok'],
      },
    ],
    alternatives: ['anthropic_api', 'chatgpt'],
  },

  gemini: {
    id: 'gemini',
    name: 'Gemini',
    category: 'AI Assistant / API',
    plans: [
      {
        id: 'free',
        name: 'Free',
        pricePerUserPerMonth: 0,
        bestFor: ['writing', 'research'],
        features: ['Gemini 1.5 Flash', 'Limited requests'],
      },
      {
        id: 'advanced',
        name: 'Advanced (Google One AI)',
        pricePerUserPerMonth: 19.99,
        bestFor: ['writing', 'research', 'mixed'],
        features: ['Gemini 1.5 Pro', '2TB storage', 'Workspace integration'],
      },
      {
        id: 'api_pay_as_you_go',
        name: 'API Pay-as-you-go',
        pricePerUserPerMonth: 0, // token-based
        bestFor: ['coding', 'data'],
        features: ['Gemini 1.5 Pro: $3.50/$10.50 per MTok'],
      },
    ],
    alternatives: ['claude', 'chatgpt'],
  },

  windsurf: {
    id: 'windsurf',
    name: 'Windsurf (Codeium)',
    category: 'AI Code Editor',
    plans: [
      {
        id: 'free',
        name: 'Free',
        pricePerUserPerMonth: 0,
        bestFor: ['coding'],
        features: ['Unlimited completions', '10 Flow credits/mo'],
      },
      {
        id: 'pro',
        name: 'Pro',
        pricePerUserPerMonth: 15,
        bestFor: ['coding'],
        features: ['Unlimited completions', '500 Flow credits', 'GPT-4o + Claude access'],
      },
      {
        id: 'teams',
        name: 'Teams',
        pricePerUserPerMonth: 30,
        minSeats: 2,
        bestFor: ['coding'],
        features: ['All Pro features', 'Admin console', 'Team analytics'],
      },
    ],
    alternatives: ['cursor', 'github_copilot'],
  },
};

export function getToolData(toolId: ToolId): ToolData {
  return PRICING_DATA[toolId];
}

export function getPlan(toolId: ToolId, planId: string) {
  return PRICING_DATA[toolId]?.plans.find((p) => p.id === planId);
}

export const ALL_TOOLS = Object.values(PRICING_DATA);

export const TOOL_DISPLAY_ORDER: ToolId[] = [
  'cursor',
  'github_copilot',
  'claude',
  'chatgpt',
  'anthropic_api',
  'openai_api',
  'gemini',
  'windsurf',
];