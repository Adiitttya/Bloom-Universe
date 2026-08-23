import Link from "next/link";
import { LayoutTemplate, Info, Image as ImageIcon, Bell } from "lucide-react";

export default function AdminOverviewPage() {
  const cards = [
    {
      title: "Hero Section",
      desc: "Manage titles, subtitles, and CTA links",
      href: "/admin/hero",
      icon: LayoutTemplate,
    },
    {
      title: "About Section",
      desc: "Edit community description and live statistics",
      href: "/admin/about",
      icon: Info,
    },
    {
      title: "Gallery Photos",
      desc: "Upload, reorder, and remove community highlights",
      href: "/admin/gallery",
      icon: ImageIcon,
    },
    {
      title: "Announcements",
      desc: "Post top banner news and updates",
      href: "/admin/announcements",
      icon: Bell,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl dark:text-white">
        Dashboard Overview
      </h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Welcome to the Bloom Universe Administration Panel.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-sky-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                {card.title}
              </h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {card.desc}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
