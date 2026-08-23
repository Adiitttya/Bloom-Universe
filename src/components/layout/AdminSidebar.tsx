import Link from "next/link";
import {
  LayoutDashboard,
  LayoutTemplate,
  Info,
  Image as ImageIcon,
  Bell,
  Share2,
  Layers,
  LogOut,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const ADMIN_NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Hero Section", href: "/admin/hero", icon: LayoutTemplate },
  { label: "About Section", href: "/admin/about", icon: Info },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Announcements", href: "/admin/announcements", icon: Bell },
  { label: "Social Links", href: "/admin/socials", icon: Share2 },
  { label: "Sub-Webs", href: "/admin/subwebs", icon: Layers },
];

export function AdminSidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col justify-between border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <div className="mb-8 flex items-center gap-2 px-3 py-2">
          <span className="text-xl font-black text-sky-600 dark:text-sky-400">
            {SITE_CONFIG.shortName}
          </span>
          <span className="rounded bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            ADMIN
          </span>
        </div>

        <nav className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-sky-50 hover:text-sky-600 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-sky-400"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          <LogOut className="h-4 w-4" />
          Back to Public Site
        </Link>
      </div>
    </aside>
  );
}
