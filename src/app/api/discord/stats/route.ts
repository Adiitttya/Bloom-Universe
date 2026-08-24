import { NextResponse } from "next/server";
import { fetchDiscordGuildStats } from "@/lib/discord";

// ISR: Cache response at edge for 60 seconds, reducing Discord API calls
export const revalidate = 60;

export async function GET() {
  const stats = await fetchDiscordGuildStats();
  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
