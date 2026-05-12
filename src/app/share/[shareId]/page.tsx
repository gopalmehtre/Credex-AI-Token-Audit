import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { queryOne } from '@/lib/db';
import type { ShareableAudit } from '@/types';
import SharedAuditView from '@/components/Audit/SharedAuditView';

interface Props {
  params: Promise<{ shareId: string }>;
}

async function getSharedAudit(shareId: string): Promise<ShareableAudit | null> {
  try {
    const row = await queryOne<{
      share_id: string;
      tools_input: { tools: Array<{ toolId: string }> };
      audit_result: Record<string, unknown>;
      ai_summary: string | null;
      total_monthly_savings: string;
      total_annual_savings: string;
      use_case: string;
      team_size: number;
      created_at: string;
    }>(
      `SELECT share_id, tools_input, audit_result, ai_summary,
              total_monthly_savings, total_annual_savings,
              use_case, team_size, created_at
       FROM audits WHERE share_id = $1`,
      [shareId]
    );

    if (!row) return null;

    const auditResult = row.audit_result as {
      recommendations: ShareableAudit['recommendations'];
    };

    return {
      shareId: row.share_id,
      tools: row.tools_input.tools.map((t) => t.toolId),
      totalMonthlySavings: parseFloat(row.total_monthly_savings),
      totalAnnualSavings: parseFloat(row.total_annual_savings),
      savingsTier: auditResult.recommendations ? 
        (parseFloat(row.total_monthly_savings) > 500 ? 'high' :
         parseFloat(row.total_monthly_savings) > 100 ? 'medium' :
         parseFloat(row.total_monthly_savings) > 0 ? 'low' : 'optimal') : 'optimal',
      useCase: row.use_case as ShareableAudit['useCase'],
      teamSize: row.team_size,
      recommendations: auditResult.recommendations ?? [],
      aiSummary: row.ai_summary ?? undefined,
      createdAt: row.created_at,
    };
  } catch (err) {
    console.error('Failed to fetch shared audit:', err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareId } = await params;
  const audit = await getSharedAudit(shareId);
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://spendsight.io';

  if (!audit) {
    return { title: 'Audit not found — SpendSight' };
  }

  const savingsText =
    audit.totalMonthlySavings > 0
      ? `$${audit.totalMonthlySavings.toFixed(0)}/mo savings identified`
      : 'AI stack already optimized';

  return {
    title: `AI Spend Audit — ${savingsText} | SpendSight`,
    description: `This team could save $${audit.totalAnnualSavings.toFixed(0)}/year on AI tools. See the full breakdown.`,
    openGraph: {
      title: `AI Spend Audit — ${savingsText}`,
      description: `Team of ${audit.teamSize} · ${audit.useCase} use case · $${audit.totalAnnualSavings.toFixed(0)}/yr potential savings`,
      url: `${APP_URL}/share/${audit.shareId}`,
      type: 'website',
      images: [
        {
          url: `${APP_URL}/api/og?shareId=${audit.shareId}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `AI Spend Audit — ${savingsText}`,
      description: `Team of ${audit.teamSize} · $${audit.totalAnnualSavings.toFixed(0)}/yr potential savings. Get your free audit at SpendSight.`,
      images: [`${APP_URL}/api/og?shareId=${audit.shareId}`],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { shareId } = await params;
  const audit = await getSharedAudit(shareId);

  if (!audit) {
    notFound();
  }

  return <SharedAuditView audit={audit} />;
}
