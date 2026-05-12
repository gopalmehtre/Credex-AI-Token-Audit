import { query, queryOne } from './db';
import { createHash } from 'crypto';

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_AUDITS_PER_HOUR = 100;
const MAX_LEADS_PER_HOUR = 50;

export function hashIp(ip: string): string {
  return createHash('sha256').update(ip + 'spendsight_salt').digest('hex').slice(0, 16);
}

export async function checkRateLimit(
  ip: string,
  action: 'audit' | 'lead'
): Promise<{ allowed: boolean; remaining: number }> {
  const max = action === 'audit' ? MAX_AUDITS_PER_HOUR : MAX_LEADS_PER_HOUR;
  const key = `${action}:${hashIp(ip)}`;

  try {
    const existing = await queryOne<{ count: number; window_start: Date }>(
      'SELECT count, window_start FROM rate_limits WHERE key = $1',
      [key]
    );

    if (!existing) {
      await query(
        'INSERT INTO rate_limits (key, count, window_start) VALUES ($1, 1, NOW()) ON CONFLICT (key) DO UPDATE SET count = rate_limits.count + 1',
        [key]
      );
      return { allowed: true, remaining: max - 1 };
    }

    const windowAge = Date.now() - new Date(existing.window_start).getTime();

    if (windowAge > WINDOW_MS) {
      // Reset window
      await query(
        'UPDATE rate_limits SET count = 1, window_start = NOW() WHERE key = $1',
        [key]
      );
      return { allowed: true, remaining: max - 1 };
    }

    if (existing.count >= max) {
      return { allowed: false, remaining: 0 };
    }

    await query('UPDATE rate_limits SET count = count + 1 WHERE key = $1', [key]);
    return { allowed: true, remaining: max - existing.count - 1 };
  } catch {
    // DB unavailable — allow request (fail open, log for monitoring)
    console.error('Rate limit DB check failed — allowing request');
    return { allowed: true, remaining: max };
  }
}

// Honeypot validation: form includes hidden field that should remain empty
export function validateHoneypot(honeypotValue: unknown): boolean {
  return honeypotValue === '' || honeypotValue === null || honeypotValue === undefined;
}