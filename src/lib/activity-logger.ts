import { db } from "@/lib/db";
import { getWIBDate } from "@/lib/utils";

export interface LogAdminParams {
  userId?: string | null;
  action: string;
  details?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface LogMemberParams {
  userId?: string | null;
  action: string;
  details?: string | null;
  targetUrl?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function getValidUserId(
  userId?: string | null
): Promise<string | null> {
  if (!userId) return null;
  try {
    const found = await db.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    return found?.id || null;
  } catch {
    return null;
  }
}

/**
 * Centrally and safely records an Admin Activity log to PostgreSQL database.
 */
export async function logAdminActivity(params: LogAdminParams) {
  try {
    const nowWIB = getWIBDate();
    const validUserId = await getValidUserId(params.userId);

    return await db.adminLog.create({
      data: {
        userId: validUserId,
        action: params.action,
        details: params.details || null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent ? params.userAgent.slice(0, 255) : null,
        createdAt: nowWIB,
        updatedAt: nowWIB,
      },
    });
  } catch (error) {
    console.warn("Failed to record admin log:", error);
    return null;
  }
}

/**
 * Centrally and safely records a Member / Visitor Activity log to PostgreSQL database.
 */
export async function logMemberActivity(params: LogMemberParams) {
  try {
    const nowWIB = getWIBDate();
    const validUserId = await getValidUserId(params.userId);

    return await db.memberLog.create({
      data: {
        userId: validUserId,
        action: params.action,
        details: params.details || null,
        targetUrl: params.targetUrl || null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent ? params.userAgent.slice(0, 255) : null,
        createdAt: nowWIB,
        updatedAt: nowWIB,
      },
    });
  } catch (error) {
    console.warn("Failed to record member log:", error);
    return null;
  }
}
