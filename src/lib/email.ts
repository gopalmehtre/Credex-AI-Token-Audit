import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.RESEND_FROM_EMAIL ?? 'audit@spendsight.io';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://spendsight.io';

interface AuditEmailParams {
  to: string;
  shareId: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  highValue: boolean;
  companyName?: string;
}

export async function sendAuditConfirmationEmail(params: AuditEmailParams): Promise<boolean> {
  if (!resend) {
    console.warn('Resend not configured — skipping email');
    return false;
  }

  const { to, shareId, totalMonthlySavings, totalAnnualSavings, highValue, companyName } = params;
  const shareUrl = `${APP_URL}/share/${shareId}`;
  const greeting = companyName ? `Hi ${companyName} team,` : 'Hi there,';

  const savingsLine =
    totalMonthlySavings > 0
      ? `Your audit identified <strong>$${totalMonthlySavings.toFixed(0)}/month ($${totalAnnualSavings.toFixed(0)}/year)</strong> in potential AI savings.`
      : `Your AI stack looks well-optimized — no major overspend was identified.`;

  const credexCta = highValue
    ? `<p>Given the scale of your potential savings, a Credex advisor will reach out within 1–2 business days to discuss how discounted AI credits could help you capture even more of that savings.</p>`
    : '';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f7;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#0A0A0F;padding:32px 40px;">
      <h1 style="color:#C8F135;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">SpendSight</h1>
      <p style="color:#a8a8bc;margin:8px 0 0;font-size:14px;">AI Spend Audit</p>
    </div>
    <div style="padding:32px 40px;">
      <p style="color:#14141f;font-size:16px;margin:0 0 16px;">${greeting}</p>
      <p style="color:#363649;font-size:15px;line-height:1.6;margin:0 0 24px;">${savingsLine}</p>
      ${credexCta}
      <a href="${shareUrl}" style="display:inline-block;background:#C8F135;color:#0A0A0F;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:15px;margin-bottom:24px;">View your full audit →</a>
      <p style="color:#7a7a96;font-size:13px;margin:0;">You can share this link with your team. Identifying details are not included in the public view.</p>
    </div>
    <div style="background:#f5f5f7;padding:20px 40px;">
      <p style="color:#a8a8bc;font-size:12px;margin:0;">SpendSight by Credex · <a href="https://credex.rocks" style="color:#a8a8bc;">credex.rocks</a></p>
    </div>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: totalMonthlySavings > 0
        ? `Your AI spend audit — $${totalMonthlySavings.toFixed(0)}/mo in savings identified`
        : 'Your AI spend audit is ready',
      html,
    });

    if (error) {
      console.error('Resend email error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Email send failed:', err);
    return false;
  }
}