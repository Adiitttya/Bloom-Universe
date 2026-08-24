import { NextResponse } from "next/server";
import { logMemberActivity } from "@/lib/activity-logger";
import { auth } from "@/lib/auth";

// Allowed actions whitelist
const ALLOWED_ACTIONS = new Set([
  "PAGE_VIEW",
  "INTERACTION_CLICK",
  "CLICK_EXTERNAL_LINK",
  "MEMBER_LOGIN",
  "MEMBER_LOGOUT",
]);

// In-memory sliding rate limiter: IP -> timestamps[]
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 30; // Max 30 requests per minute

  const timestamps = (rateLimitMap.get(ip) || []).filter(
    (t) => now - t < windowMs
  );
  if (timestamps.length >= maxRequests) {
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : "127.0.0.1";

    // 1. IP Rate Limiting Check
    if (!checkRateLimit(ipAddress)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > 2048) {
      return NextResponse.json(
        { success: false, error: "Payload too large." },
        { status: 413 }
      );
    }

    const body = await request.json();
    const { action, details, targetUrl } = body;

    if (!action || typeof action !== "string") {
      return NextResponse.json(
        { success: false, error: "Action is required." },
        { status: 400 }
      );
    }

    const cleanAction = action.trim().toUpperCase();

    // 2. Action Whitelist Validation
    if (!ALLOWED_ACTIONS.has(cleanAction)) {
      return NextResponse.json(
        { success: false, error: "Invalid action." },
        { status: 400 }
      );
    }

    const session = await auth();
    const userId = session?.user?.id || null;
    const userAgent = request.headers.get("user-agent") || undefined;

    await logMemberActivity({
      userId,
      action: cleanAction.slice(0, 60),
      details: details ? String(details).slice(0, 500) : null,
      targetUrl: targetUrl ? String(targetUrl).slice(0, 255) : null,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.warn("Analytics track error:", err);
    return NextResponse.json(
      { success: false, error: "Track failed" },
      { status: 500 }
    );
  }
}
