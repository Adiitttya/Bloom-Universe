"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  LayoutTemplate,
  Info,
  Image as ImageIcon,
  Bell,
  Share2,
  Layers,
  LogOut,
  ExternalLink,
  Menu,
  X,
  UserX,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { UserSession } from "@/lib/types";

const ADMIN_NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Announcements", href: "/admin/announcements", icon: Bell },
  { label: "Hero Section", href: "/admin/hero", icon: LayoutTemplate },
  { label: "About Section", href: "/admin/about", icon: Info },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Sub-Webs", href: "/admin/subwebs", icon: Layers },
  { label: "Social Links", href: "/admin/socials", icon: Share2 },
];

export function AdminSidebar({ user }: { user?: UserSession }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Close drawer on path change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const activeItem =
    pathname === "/admin"
      ? ADMIN_NAV_ITEMS[0]
      : ADMIN_NAV_ITEMS.find(
          (item) => item.href !== "/admin" && pathname.startsWith(item.href)
        ) || ADMIN_NAV_ITEMS[0];
  const ActiveIcon = activeItem.icon;

  const displayName =
    user?.nickname ||
    user?.displayName ||
    user?.name ||
    user?.username ||
    "Admin";

  // Dynamic Discord Role Badge matching the landing page (Gambar 2)
  const renderRoleBadge = () => {
    if (!user) return null;

    if (user.isInGuild) {
      const highestRole = user.highestRole;
      const roleName = highestRole?.name || "Member";
      const roleColor = highestRole?.colorHex || "#10b981";
      const otherCount = user.otherRolesCount || 0;

      return (
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="font-heading inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-black tracking-wide shadow-xs transition-all"
            style={{
              backgroundColor: `${roleColor}1a`,
              color: roleColor,
              borderColor: `${roleColor}40`,
            }}
          >
            {/* Discord Role Custom Icon or Emoji or Colored Dot */}
            {highestRole?.iconUrl ? (
              <span className="relative h-3.5 w-3.5 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={highestRole.iconUrl}
                  alt={roleName}
                  fill
                  className="object-contain"
                />
              </span>
            ) : highestRole?.unicodeEmoji ? (
              <span className="text-xs">{highestRole.unicodeEmoji}</span>
            ) : (
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: roleColor }}
              />
            )}
            <span className="truncate uppercase">{roleName}</span>
          </span>

          {/* Other Roles Counter */}
          {otherCount > 0 && (
            <span
              className="font-heading rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-black text-slate-500"
              title={`${otherCount} other role${otherCount > 1 ? "s" : ""}`}
            >
              +{otherCount}
            </span>
          )}
        </div>
      );
    }

    return (
      <span className="font-heading inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-black text-slate-600">
        <UserX className="h-3 w-3 shrink-0" />
        <span>GUEST</span>
      </span>
    );
  };

  const navContent = (
    <div className="flex h-full [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] flex-col justify-between overflow-y-auto p-4 sm:p-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
      <div>
        {/* Brand Header */}
        <div className="mb-6 flex items-center justify-between border-b-2 border-slate-100 pb-4">
          <Link href="/admin" className="group flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-2xl border-2 border-[#2baee2] shadow-sm transition group-hover:scale-105">
              <Image
                src={SITE_CONFIG.logo}
                alt={SITE_CONFIG.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-base font-black tracking-tight text-[#1e1b4b]">
                {SITE_CONFIG.name}
              </span>
              <span className="font-heading text-[10px] font-bold tracking-wider text-[#2baee2] uppercase">
                Admin Panel
              </span>
            </div>
          </Link>

          {/* Close button on mobile drawer */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation List */}
        <div>
          <p className="font-heading mb-2.5 px-3 text-[11px] font-black tracking-wider text-slate-400 uppercase">
            Menu Navigasi
          </p>

          <nav className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-heading flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold transition-all ${
                    isActive
                      ? "border-2 border-[#2baee2] bg-[#e0f4fc] text-[#1e1b4b] shadow-[0_3px_0_#2baee2]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-[#1e1b4b]"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                      isActive
                        ? "bg-[#2baee2] text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Area: Admin Profile & Actions */}
      <div className="mt-6 space-y-3 border-t-2 border-slate-100 pt-4">
        {/* Admin User Info Card (100% Identical with Landing Page Gambar 2) */}
        {user && (
          <div className="rounded-2xl border-2 border-slate-100 bg-[#f8fbff] p-3.5 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-[#2baee2] shadow-sm">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="font-heading flex h-full w-full items-center justify-center text-xs font-black text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading truncate text-sm font-black text-[#1e1b4b]">
                  {displayName}
                </p>
                <p className="truncate text-[11px] font-bold text-slate-400">
                  @{user.username || "discord"}
                </p>
              </div>
            </div>

            {/* Status Role Badge with Real Discord Colors & Multi-role Count */}
            <div className="mt-2.5 flex items-center">{renderRoleBadge()}</div>
          </div>
        )}

        {/* Public Site Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50"
        >
          <ExternalLink className="h-3.5 w-3.5 text-[#2baee2]" />
          <span>Lihat Web Utama</span>
        </Link>

        {/* Logout Button with Custom Confirmation */}
        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-50 py-2 text-xs font-bold text-red-600 transition hover:bg-red-500 hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Logout Discord</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Bar: Hamburger on LEFT + Active Menu Title in Center */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b-2 border-slate-100 bg-white px-4 shadow-xs lg:hidden">
        {/* Left Side: Hamburger Button + Current Open Page Title */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka navigasi admin"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border-2 border-slate-200 bg-slate-50 text-[#2baee2] shadow-2xs transition hover:bg-[#e0f4fc] active:scale-95"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Current Opened Menu Title & Icon */}
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#2baee2]/30 bg-[#e0f4fc] text-[#2baee2]">
              <ActiveIcon className="h-4 w-4" />
            </div>
            <h1 className="font-heading truncate text-base font-black text-[#1e1b4b]">
              {activeItem.label}
            </h1>
          </div>
        </div>

        {/* Right Side: Quick Shortcut to Public Web */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
        >
          <ExternalLink className="h-3.5 w-3.5 text-[#2baee2]" />
          <span>Web</span>
        </Link>
      </header>

      {/* Mobile Slide-Over Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Mobile Slide-Over Drawer Sheet (Independent Scroll) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 h-full w-72 transform overflow-hidden border-r-2 border-slate-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop Static Left Sidebar (Independent Scroll & Sticky) */}
      <aside className="hidden h-screen w-72 shrink-0 overflow-hidden border-r-2 border-slate-100 bg-white lg:sticky lg:top-0 lg:flex">
        {navContent}
      </aside>

      {/* Playful Custom Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          setIsLoggingOut(true);
          try {
            await signOut({ redirect: false });
            window.location.href = "/";
          } catch (e) {
            console.error("Logout error:", e);
            window.location.href = "/";
          }
        }}
        title="Konfirmasi Logout Admin"
        description="Apakah Anda yakin ingin keluar dari sesi akun Discord dan panel admin Bloom Universe?"
        confirmText="Ya, Logout"
        cancelText="Batal"
        variant="danger"
        loading={isLoggingOut}
      />
    </>
  );
}
