"use client";

import * as React from "react";
import Image from "next/image";
import {
  Clock,
  Shield,
  Activity,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  MousePointerClick,
  Globe,
  ExternalLink,
  Users,
  Settings,
  Radio,
} from "lucide-react";
import { formatWIB } from "@/lib/utils";

export interface LogItem {
  id: string;
  action: string;
  details: string | null;
  targetUrl?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date | string;
  user: {
    username: string | null;
    displayName: string | null;
    image: string | null;
  } | null;
}

interface ActivityLogListProps {
  adminLogs: LogItem[];
  memberLogs: LogItem[];
}

function getLogVisuals(action: string, isMember: boolean) {
  const a = action.toUpperCase();

  if (a.includes("ADMIN_LOGIN_SUCCESS") || a.includes("PASSCODE_SUCCESS")) {
    return {
      icon: ShieldCheck,
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "text-emerald-600",
    };
  }
  if (a.includes("ADMIN_LOGIN_FAILED") || a.includes("PASSCODE_FAILED")) {
    return {
      icon: ShieldAlert,
      badge: "bg-red-50 text-red-700 border-red-200 animate-pulse",
      accent: "text-red-600",
    };
  }
  if (a.includes("MEMBER_LOGIN") || a.includes("USER_LOGIN")) {
    return {
      icon: UserCheck,
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      accent: "text-emerald-600",
    };
  }
  if (a.includes("LOGOUT")) {
    return {
      icon: UserX,
      badge: "bg-slate-100 text-slate-700 border-slate-200",
      accent: "text-slate-500",
    };
  }
  if (a.includes("DELETE")) {
    return {
      icon: ShieldAlert,
      badge: "bg-red-50 text-red-700 border-red-200",
      accent: "text-red-600",
    };
  }
  if (a.includes("CLICK") || a.includes("INTERACTION")) {
    return {
      icon: MousePointerClick,
      badge: "bg-purple-50 text-purple-700 border-purple-200",
      accent: "text-purple-600",
    };
  }
  if (a.includes("PAGE_VIEW") || a.includes("VISIT")) {
    return {
      icon: Globe,
      badge: "bg-sky-50 text-sky-700 border-sky-200",
      accent: "text-sky-600",
    };
  }
  if (!isMember) {
    return {
      icon: Settings,
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      accent: "text-amber-600",
    };
  }
  return {
    icon: Activity,
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    accent: "text-[#2baee2]",
  };
}

export function ActivityLogList({
  adminLogs: initialAdminLogs,
  memberLogs: initialMemberLogs,
}: ActivityLogListProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = React.useState<"ADMIN" | "MEMBER">("ADMIN");
  const [adminLogs, setAdminLogs] = React.useState<LogItem[]>(initialAdminLogs);
  const [memberLogs, setMemberLogs] =
    React.useState<LogItem[]>(initialMemberLogs);

  // Sync if props change
  React.useEffect(() => {
    setAdminLogs(initialAdminLogs);
  }, [initialAdminLogs]);

  React.useEffect(() => {
    setMemberLogs(initialMemberLogs);
  }, [initialMemberLogs]);

  // Real-time automatic polling without page refresh (every 4 seconds, paused when tab is inactive)
  React.useEffect(() => {
    let isMounted = true;

    const fetchLatestLogs = async () => {
      // Pause network requests if the user is in a different browser tab
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "hidden"
      ) {
        return;
      }

      try {
        const res = await fetch("/api/admin/logs", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && data.success) {
          if (Array.isArray(data.adminLogs)) setAdminLogs(data.adminLogs);
          if (Array.isArray(data.memberLogs)) setMemberLogs(data.memberLogs);
        }
      } catch {}
    };

    const interval = setInterval(fetchLatestLogs, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const currentLogs = activeTab === "ADMIN" ? adminLogs : memberLogs;

  // Instant snap to bottom with ZERO scroll animation (no sliding/top-to-bottom animation)
  React.useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [activeTab, currentLogs.length]);

  return (
    <div className="space-y-4">
      {/* 2 Tab Navigation Menu + Realtime Pulse Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("ADMIN")}
            className={`font-heading flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition ${
              activeTab === "ADMIN"
                ? "bg-[#ffc700] text-[#1e1b4b] shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Shield className="h-4 w-4 text-[#b38600]" />
            <span>Aktivitas Admin</span>
            <span className="ml-1 rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-black">
              {adminLogs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("MEMBER")}
            className={`font-heading flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition ${
              activeTab === "MEMBER"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Aktivitas Member</span>
            <span className="ml-1 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-black">
              {memberLogs.length}
            </span>
          </button>
        </div>

        {/* Live Realtime Indicator */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>Realtime Live</span>
        </div>
      </div>

      {/* Log Feed Container */}
      {currentLogs.length === 0 ? (
        <div className="py-12 text-center">
          <Activity className="mx-auto mb-2 h-8 w-8 text-slate-300" />
          <p className="font-heading text-sm font-bold text-slate-400">
            {activeTab === "ADMIN"
              ? "Belum ada catatan aktivitas admin."
              : "Belum ada catatan aktivitas member atau pengunjung."}
          </p>
        </div>
      ) : (
        <div className="relative">
          <div
            ref={containerRef}
            className="max-h-[380px] [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] divide-y divide-slate-100 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 hover:[&::-webkit-scrollbar-thumb]:bg-slate-300"
          >
            {currentLogs.map((log) => {
              const visuals = getLogVisuals(log.action, activeTab === "MEMBER");
              const ActionIcon = visuals.icon;
              const userName =
                log.user?.displayName ||
                log.user?.username ||
                (activeTab === "ADMIN" ? "Admin" : "Pengunjung Web");

              return (
                <div
                  key={log.id}
                  className="group flex flex-col justify-between gap-3 rounded-2xl px-2 py-3.5 transition hover:bg-slate-50/80 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    {/* User Avatar or Action Icon */}
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[#f8fbff] shadow-2xs">
                      {log.user?.image ? (
                        <Image
                          src={log.user.image}
                          alt={userName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <ActionIcon className={`h-4 w-4 ${visuals.accent}`} />
                      )}
                    </div>

                    {/* Details Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-heading text-xs font-black text-[#1e1b4b]">
                          {log.details || log.action}
                        </p>
                        <span
                          className={`font-heading rounded-md border px-1.5 py-0.5 text-[9px] font-black tracking-wider uppercase ${visuals.badge}`}
                        >
                          {log.action.replace(/_/g, " ")}
                        </span>
                      </div>

                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-400">
                        <span>
                          Oleh{" "}
                          <strong className="text-slate-600">
                            {log.user?.username
                              ? `@${log.user.username}`
                              : userName}
                          </strong>
                        </span>

                        {log.targetUrl && (
                          <a
                            href={log.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#2baee2] hover:underline"
                          >
                            <span>Buka Link</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <time dateTime={new Date(log.createdAt).toISOString()}>
                      {formatWIB(log.createdAt, "datetime")}
                    </time>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
