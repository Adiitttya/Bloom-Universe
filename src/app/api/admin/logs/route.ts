import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { checkIsAdmin } from "@/lib/auth/admin-guard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || !checkIsAdmin(session.user)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [rawAdminLogs, rawMemberLogs] = await Promise.all([
      db.adminLog
        .findMany({
          take: 100,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                username: true,
                displayName: true,
                image: true,
              },
            },
          },
        })
        .catch(() => []),
      db.memberLog
        .findMany({
          take: 100,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                username: true,
                displayName: true,
                image: true,
              },
            },
          },
        })
        .catch(() => []),
    ]);

    // Chronological order: oldest at top, newest at bottom
    const adminLogs = [...rawAdminLogs]
      .slice(0, 100)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    const memberLogs = [...rawMemberLogs]
      .slice(0, 100)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    return NextResponse.json({
      success: true,
      adminLogs,
      memberLogs,
    });
  } catch (error) {
    console.warn("Failed to fetch admin logs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
