import { NextResponse } from "next/server";
import { fetchDiscordGuildStats } from "@/lib/discord";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET() {
  const stats = await fetchDiscordGuildStats();
  return NextResponse.json(stats);
}
