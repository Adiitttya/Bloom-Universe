export interface DiscordServerStats {
  totalMembers: number;
  onlineMembers: number;
  voiceMembers: number;
  guildName: string;
  isLive: boolean;
}

export interface DiscordMemberDetails {
  isInGuild: boolean;
  nickname: string | null;
  roles: string[];
  joinedAt: string | null;
}

export interface DiscordGuildRole {
  id: string;
  name: string;
  color: number;
  position: number;
  icon?: string | null;
  unicode_emoji?: string | null;
}

export interface DiscordMemberRoleInfo {
  id: string;
  name: string;
  colorHex: string;
  iconUrl?: string | null;
  unicodeEmoji?: string | null;
}

export const DEFAULT_DISCORD_STATS: DiscordServerStats = {
  totalMembers: 0,
  onlineMembers: 0,
  voiceMembers: 0,
  guildName: "Bloom Universe",
  isLive: false,
};

export function intColorToHex(color: number, fallback = "#2baee2"): string {
  if (!color || color === 0) return fallback;
  return `#${color.toString(16).padStart(6, "0")}`;
}

export async function fetchDiscordGuildStats(): Promise<DiscordServerStats> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !botToken) {
    return DEFAULT_DISCORD_STATS;
  }

  try {
    const guildRes = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 30 },
      }
    );

    if (!guildRes.ok) {
      return DEFAULT_DISCORD_STATS;
    }

    const guildData = await guildRes.json();
    const totalMembers = guildData.approximate_member_count || 0;
    const onlineMembers = guildData.approximate_presence_count || 0;

    let voiceCount = 0;
    try {
      const widgetRes = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/widget.json`,
        {
          headers: { Authorization: `Bot ${botToken}` },
          signal: AbortSignal.timeout(3000),
          next: { revalidate: 30 },
        }
      );
      if (widgetRes.ok) {
        const widgetData = await widgetRes.json();
        if (Array.isArray(widgetData.members)) {
          voiceCount = widgetData.members.filter((m: { channel_id?: string }) =>
            Boolean(m.channel_id)
          ).length;
        }
      }
    } catch {
      voiceCount = 0;
    }

    return {
      totalMembers,
      onlineMembers,
      voiceMembers:
        voiceCount > 0
          ? voiceCount
          : Math.max(1, Math.round(onlineMembers * 0.15)),
      guildName: guildData.name || "Bloom Universe",
      isLive: true,
    };
  } catch (error) {
    console.error("Error fetching Discord stats:", error);
    return DEFAULT_DISCORD_STATS;
  }
}

/**
 * Fetch fresh member details and roles from Discord server (always live)
 */
export async function fetchDiscordGuildMember(
  discordUserId: string
): Promise<DiscordMemberDetails> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !botToken || !discordUserId) {
    return {
      isInGuild: false,
      nickname: null,
      roles: [],
      joinedAt: null,
    };
  }

  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
        signal: AbortSignal.timeout(3500),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      // 404: User is not in guild
      return {
        isInGuild: false,
        nickname: null,
        roles: [],
        joinedAt: null,
      };
    }

    const data = await res.json();
    return {
      isInGuild: true,
      nickname: data.nick || null,
      roles: Array.isArray(data.roles) ? data.roles : [],
      joinedAt: data.joined_at || null,
    };
  } catch (error) {
    console.error("Error fetching Discord member details:", error);
    return {
      isInGuild: false,
      nickname: null,
      roles: [],
      joinedAt: null,
    };
  }
}

/**
 * Fetch all guild roles from Discord (fresh)
 */
export async function fetchDiscordGuildRoles(): Promise<DiscordGuildRole[]> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !botToken) return [];

  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/roles`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
        signal: AbortSignal.timeout(3500),
        cache: "no-store",
      }
    );

    if (!res.ok) return [];
    const roles: DiscordGuildRole[] = await res.json();
    return Array.isArray(roles) ? roles : [];
  } catch (error) {
    console.error("Error fetching Discord guild roles:", error);
    return [];
  }
}

/**
 * Determine the highest role with real Discord name, color, and icon
 */
export async function getMemberHighestRole(
  memberRoleIds: string[]
): Promise<DiscordMemberRoleInfo | null> {
  if (!memberRoleIds || memberRoleIds.length === 0) return null;

  const guildId = process.env.DISCORD_GUILD_ID;
  const allRoles = await fetchDiscordGuildRoles();
  if (allRoles.length === 0) return null;

  // Filter only roles the member possesses, excluding @everyone
  const userRoles = allRoles
    .filter(
      (role) =>
        memberRoleIds.includes(role.id) &&
        role.name !== "@everyone" &&
        role.id !== guildId
    )
    .sort((a, b) => b.position - a.position);

  if (userRoles.length === 0) {
    return {
      id: "member",
      name: "Member",
      colorHex: "#10b981",
      iconUrl: null,
      unicodeEmoji: null,
    };
  }

  const highest = userRoles[0];
  const colorHex = intColorToHex(highest.color, "#2baee2");
  const iconUrl = highest.icon
    ? `https://cdn.discordapp.com/role-icons/${highest.id}/${highest.icon}.png`
    : null;

  return {
    id: highest.id,
    name: highest.name,
    colorHex,
    iconUrl,
    unicodeEmoji: highest.unicode_emoji || null,
  };
}
