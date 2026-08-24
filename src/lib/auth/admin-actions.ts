"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "crypto";
import { auth } from "@/lib/auth";
import { checkIsAdmin, ADMIN_COOKIE_NAME } from "@/lib/auth/admin-guard";
import { logAdminActivity } from "@/lib/activity-logger";
import {
  isRateLimited,
  recordFailedAttempt,
  clearRateLimit,
} from "@/lib/auth/rate-limit";

/**
 * Constant-time string comparison to prevent timing attacks
 */
function safeCompareStrings(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a.trim());
    const bufB = Buffer.from(b.trim());
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Verify passcode and set a secure session cookie.
 */
export async function verifyAdminPasscodeAction(passcode: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await auth();

  if (!session?.user || !(await checkIsAdmin(session.user))) {
    return {
      success: false,
      error: "Sesi tidak valid atau Anda bukan Admin.",
    };
  }

  const reqHeaders = await headers();
  const userAgent = reqHeaders.get("user-agent") || undefined;
  const forwardedFor = reqHeaders.get("x-forwarded-for");
  const ipAddress = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : "127.0.0.1";

  // Check rate limit — keyed by Discord user ID (persists across IP changes)
  if (await isRateLimited(session.user.id)) {
    return {
      success: false,
      error:
        "Terlalu banyak percobaan gagal. Akses dikunci sementara selama 10 menit demi keamanan.",
    };
  }

  const adminName = session.user.name || session.user.username || "Admin";
  const expectedCode = process.env.ADMIN_SECURITY_CODE;

  // Refuse to operate if env var is missing — prevents using hardcoded default in production
  if (!expectedCode || expectedCode.length < 6) {
    await logAdminActivity({
      userId: session.user.id,
      action: "ADMIN_LOGIN_FAILED",
      details: `Verifikasi admin gagal: ADMIN_SECURITY_CODE tidak dikonfigurasi di server. Hubungi server administrator.`,
      ipAddress,
      userAgent,
    });
    return {
      success: false,
      error:
        "Konfigurasi keamanan server tidak lengkap. Hubungi administrator.",
    };
  }

  const isMatch = safeCompareStrings(passcode, expectedCode);

  if (!isMatch) {
    const failCount = await recordFailedAttempt(session.user.id);
    // Add exponential artificial delay (500ms * failCount)
    await new Promise((r) => setTimeout(r, Math.min(failCount * 500, 3000)));

    // Log failed passcode attempt
    await logAdminActivity({
      userId: session.user.id,
      action: "ADMIN_LOGIN_FAILED",
      details: `Gagal verifikasi kode keamanan (Percobaan ${failCount}/5): Kode passcode salah dimasukkan oleh @${adminName}`,
      ipAddress,
      userAgent,
    });

    const remaining = Math.max(0, 5 - failCount);
    return {
      success: false,
      error:
        remaining > 0
          ? `Kode keamanan salah. Sisa kesempatan: ${remaining} kali.`
          : "Kode keamanan salah. Akses dikunci sementara selama 10 menit.",
    };
  }

  // Clear failed attempts upon success
  await clearRateLimit(session.user.id);

  // Set HTTP-only secure session cookie (no maxAge = session cookie, dies on browser close)
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "verified", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
  });

  // Log successful passcode verification
  await logAdminActivity({
    userId: session.user.id,
    action: "ADMIN_LOGIN_SUCCESS",
    details: `Berhasil verifikasi kode keamanan admin: @${adminName} membuka dashboard`,
    ipAddress,
    userAgent,
  });

  return { success: true };
}

/**
 * Clear admin passcode verification cookie (Lock Admin Panel)
 */
export async function lockAdminAction(): Promise<{ success: boolean }> {
  const session = await auth();
  if (session?.user) {
    const adminName = session.user.name || session.user.username || "Admin";
    await logAdminActivity({
      userId: session.user.id,
      action: "ADMIN_LOGOUT",
      details: `Admin @${adminName} mengunci dashboard admin`,
    });
  }

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin");
}
