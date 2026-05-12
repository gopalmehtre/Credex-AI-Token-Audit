import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { queryOne } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shareId = searchParams.get('shareId');

  let monthlySavings = 0;
  let annualSavings = 0;
  let teamSize = 1;
  let savingsTier = 'optimal';

  if (shareId) {
    try {
      const row = await queryOne<{
        total_monthly_savings: string;
        total_annual_savings: string;
        team_size: number;
      }>(
        'SELECT total_monthly_savings, total_annual_savings, team_size FROM audits WHERE share_id = $1',
        [shareId]
      );
      if (row) {
        monthlySavings = parseFloat(row.total_monthly_savings);
        annualSavings = parseFloat(row.total_annual_savings);
        teamSize = row.team_size;
        savingsTier =
          monthlySavings > 500 ? 'high' :
            monthlySavings > 100 ? 'medium' :
              monthlySavings > 0 ? 'low' : 'optimal';
      }
    } catch {
      // fallback to defaults
    }
  }

  const savingsText = monthlySavings > 0
    ? `$${Math.round(monthlySavings).toLocaleString()}/mo savings found`
    : 'AI stack optimized ✓';

  const annualText = annualSavings > 0
    ? `$${Math.round(annualSavings).toLocaleString()}/year`
    : '';

  const accentColor = savingsTier === 'high' ? '#C8F135' :
    savingsTier === 'medium' ? '#F5A623' :
      savingsTier === 'low' ? '#60a5fa' : '#22C55E';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: '#0A0A0F',
          padding: '64px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(200,241,53,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,241,53,0.04) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            background: `${accentColor}15`,
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              background: '#C8F135',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            📉
          </div>
          <span style={{ color: '#ffffff', fontSize: '22px', fontWeight: 700 }}>SpendSight</span>
          <span style={{ color: '#5c5c78', fontSize: '16px', marginLeft: '4px' }}>by Credex</span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}40`,
              borderRadius: '100px',
              padding: '8px 16px',
              marginBottom: '28px',
              width: 'fit-content',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: accentColor,
              }}
            />
            <span style={{ color: accentColor, fontSize: '14px', fontWeight: 600 }}>
              AI Spend Audit Report
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: accentColor, fontSize: '64px', fontWeight: 900, lineHeight: 1 }}>
              {monthlySavings > 0 ? `$${Math.round(monthlySavings).toLocaleString()}` : '✓'}
            </span>
            {monthlySavings > 0 && (
              <span style={{ color: '#e8e8ed', fontSize: '28px', fontWeight: 400, marginTop: '8px' }}>
                per month in savings identified
              </span>
            )}
            {monthlySavings === 0 && (
              <span style={{ color: '#e8e8ed', fontSize: '28px', fontWeight: 400, marginTop: '8px' }}>
                AI stack is well-optimized
              </span>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: '36px',
            }}
          >
            {annualText && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#7a7a96', fontSize: '13px', marginBottom: '4px' }}>Annual savings</span>
                <span style={{ color: '#e8e8ed', fontSize: '22px', fontWeight: 700 }}>{annualText}</span>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#7a7a96', fontSize: '13px', marginBottom: '4px' }}>Team size</span>
              <span style={{ color: '#e8e8ed', fontSize: '22px', fontWeight: 700 }}>{teamSize} people</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #252534',
            paddingTop: '24px',
          }}
        >
          <span style={{ color: '#5c5c78', fontSize: '14px' }}>spendsight.io</span>
          <span style={{ color: '#5c5c78', fontSize: '14px' }}>Free AI spend audit · No login required</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
