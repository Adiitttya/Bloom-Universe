import { db } from "@/lib/db";

// Rate limit constants
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Check if a user is currently rate-limited.
 * Automatically cleans up expired locks on-read.
 */
export async function isRateLimited(userId: string): Promise<boolean> {
  const record = await db.adminRateLimit.findUnique({ where: { userId } });
  if (!record) return false;

  if (record.lockedUntil && record.lockedUntil > new Date()) {
    return true;
  }

  // Lock expired — clean up
  if (record.lockedUntil && record.lockedUntil <= new Date()) {
    await db.adminRateLimit.delete({ where: { userId } });
  }

  return false;
}

/**
 * Record a failed passcode attempt.
 * Locks the user if MAX_ATTEMPTS is reached.
 * Returns the current attempt count.
 */
export async function recordFailedAttempt(userId: string): Promise<number> {
  const record = await db.adminRateLimit.upsert({
    where: { userId },
    create: { userId, count: 1, updatedAt: new Date() },
    update: { count: { increment: 1 }, updatedAt: new Date() },
  });

  if (record.count >= MAX_ATTEMPTS) {
    await db.adminRateLimit.update({
      where: { userId },
      data: { lockedUntil: new Date(Date.now() + LOCK_DURATION_MS) },
    });
  }

  return record.count;
}

/**
 * Clear rate limit record after a successful login.
 */
export async function clearRateLimit(userId: string): Promise<void> {
  await db.adminRateLimit.deleteMany({ where: { userId } });
}
