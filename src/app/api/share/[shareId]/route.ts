import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { shareId: string } }
) {
  try {
    const row = await queryOne<{
      share_id: string;
      tools_input: Record<string, unknown>;
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
      [params.shareId]
    );

    if (!row) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Strip email/company from public response
    return NextResponse.json({
      shareId: row.share_id,
      auditResult: {
        ...row.audit_result,
        aiSummary: row.ai_summary,
        totalMonthlySavings: parseFloat(row.total_monthly_savings),
        totalAnnualSavings: parseFloat(row.total_annual_savings),
      },
      useCase: row.use_case,
      teamSize: row.team_size,
      createdAt: row.created_at,
      // Expose tool IDs only (not spend amounts) in public view
      tools: (row.tools_input as { tools: Array<{ toolId: string }> }).tools?.map(
        (t) => t.toolId
      ),
    });
  } catch (err) {
    console.error('Share lookup error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
