"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, UserX, RotateCw, Shield } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { BloomImage } from "@/components/ui/BloomImage";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useLoginModal } from "@/lib/auth/AuthModalContext";
import { useSession, signOut } from "next-auth/react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/ui/Toast";
import { syncUserRoleAction } from "@/lib/auth/user-actions";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { dict, locale } = useLanguage();
  const { openLoginModal } = useLoginModal();
  const { data: session, update } = useSession();
  const { showToast } = useToast();

  const user = session?.user;

  const handleSyncRoles = async () => {
    setIsSyncing(true);
    try {
      const result = await syncUserRoleAction();
      await update();
      if (result.success) {
        showToast({
          type: "success",
          title: locale === "id" ? "Role Terupdate!" : "Role Updated!",
          message:
            result.message ||
            (locale === "id"
              ? "Status role Discord Anda berhasil diperbarui."
              : "Your Discord roles have been refreshed successfully."),
        });
      } else {
        showToast({
          type: "warning",
          title: locale === "id" ? "Info Sinkronisasi" : "Sync Info",
          message: result.error || "Gagal menyinkronkan status Discord.",
        });
      }
    } catch (err) {
      console.error("Failed to sync roles:", err);
      showToast({
        type: "error",
        title: "Error",
        message: locale === "id" ? "Gagal memuat status Discord." : "Failed to sync Discord status.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: dict.nav.home, href: "/" },
    { label: dict.nav.about, href: "/#about" },
    { label: dict.nav.gallery, href: "/#gallery" },
    { label: dict.nav.ecosystem, href: "/#subwebs" },
  ];

  const displayName =
    user?.nickname ||
    user?.displayName ||
    user?.name ||
    user?.username ||
    "User";

  // Dynamic Real Discord Role Badge Component
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

    // Guest Badge for users not yet joined the Discord server
    return (
      <span className="font-heading inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-black text-slate-600">
        <UserX className="h-3 w-3 shrink-0" />
        <span>
          {locale === "id" ? "GUEST (BELUM JOIN)" : "GUEST (NOT JOINED)"}
        </span>
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full px-3 py-2 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Floating Cartoon Arcade Pill Bar */}
        <div className="flex h-14 items-center justify-between rounded-full border-4 border-white bg-white/95 px-3 shadow-[0_5px_0_rgba(0,0,0,0.08),0_10px_15px_rgba(0,0,0,0.06)] backdrop-blur-md sm:h-16 sm:px-5">
          {/* Brand Mascot & Logo with Lazy Loading Skeleton & Compression */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-[#ffc700] shadow-sm transition group-hover:scale-110 group-hover:rotate-3 sm:h-10 sm:w-10">
              <BloomImage
                src={SITE_CONFIG.logo}
                alt={SITE_CONFIG.name}
                fill
                quality={80}
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-base font-black tracking-tight text-[#1e1b4b] transition group-hover:text-[#2baee2] sm:text-lg">
                {SITE_CONFIG.name}
              </span>
              <span className="font-heading text-[9px] font-bold tracking-wider text-[#ffc700] uppercase sm:text-[10px]">
                {dict.nav.officialPortal}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1.5 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-heading rounded-full px-3.5 py-1.5 text-xs font-bold text-[#1e1b4b] transition hover:bg-[#e0f4fc] hover:text-[#1b8ebc] active:scale-95 sm:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Group (Desktop): Language Toggle + Login / Avatar */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageToggle />

            {user ? (
              /* User Logged In: Clean 3D Avatar with Slate Shadow */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-slate-200 bg-white p-0.5 shadow-[0_3px_0_#cbd5e1] transition-all hover:scale-105 active:translate-y-0.5 sm:h-10 sm:w-10"
                  aria-label="User menu"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-full border border-white/50 bg-[#2baee2] shadow-inner">
                    {user.image ? (
                      <BloomImage
                        src={user.image}
                        alt={displayName}
                        fill
                        quality={80}
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="font-heading flex h-full w-full items-center justify-center text-xs font-black text-white">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="animate-in fade-in zoom-in-95 absolute right-0 mt-2 w-64 rounded-3xl border-4 border-white bg-white p-3 shadow-2xl transition-all duration-200">
                    {/* User Info Header */}
                    <div className="border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-slate-200 bg-[#2baee2] shadow-sm">
                          {user.image ? (
                            <BloomImage
                              src={user.image}
                              alt={displayName}
                              fill
                              quality={80}
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="font-heading flex h-full w-full items-center justify-center text-sm font-black text-white">
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

                      {/* Status Role Badge with Real Discord Colors */}
                      <div className="mt-2.5 flex items-center justify-between gap-1">
                        {renderRoleBadge()}

                        {/* Quick Sync Button */}
                        <button
                          type="button"
                          onClick={handleSyncRoles}
                          disabled={isSyncing}
                          title="Refresh status role Discord"
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#2baee2]"
                        >
                          <RotateCw
                            className={`h-3.5 w-3.5 ${
                              isSyncing ? "animate-spin text-[#2baee2]" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Admin Dashboard shortcut if user is admin */}
                    {user.isAdmin && (
                      <div className="border-b border-slate-100 py-2">
                        <Link
                          href="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="font-heading flex items-center gap-2 rounded-2xl bg-[#e0f4fc] px-3 py-2 text-xs font-black text-[#1b8ebc] transition hover:bg-[#d0effb]"
                        >
                          <Shield className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </div>
                    )}

                    {/* Menu Items: Logout */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setShowLogoutModal(true);
                        }}
                        className="font-heading flex w-full cursor-pointer items-center gap-2 rounded-2xl px-3 py-2 text-xs font-black text-rose-600 transition hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>
                          {locale === "id" ? "Keluar (Logout)" : "Logout"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* User Not Logged In: 3D Login Button */
              <Button
                variant="yellow"
                size="sm"
                onClick={openLoginModal}
                className="px-5 py-2 text-xs font-black tracking-wide sm:text-sm"
              >
                <span>Login</span>
              </Button>
            )}
          </div>

          {/* Mobile Right Controls: Only Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="cursor-pointer rounded-full bg-[#e0f4fc] p-2 text-[#1b8ebc] transition hover:bg-[#cbeeff] active:scale-90"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        <div
          className={`grid overflow-hidden transition-all duration-300 ease-out md:hidden ${
            isOpen
              ? "mt-2.5 grid-rows-[1fr] opacity-100"
              : "pointer-events-none mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 p-1 pb-3">
            <div className="overflow-hidden rounded-[2rem] border-4 border-white bg-white/95 p-5 pb-6 shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-md">
              {/* If user logged in, show consistent user profile card with Real Discord Role */}
              {user && (
                <div className="mb-4 rounded-2xl border-2 border-slate-100 bg-slate-50/80 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-[#2baee2] shadow-sm">
                        {user.image ? (
                          <BloomImage
                            src={user.image}
                            alt={displayName}
                            fill
                            quality={80}
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="font-heading flex h-full w-full items-center justify-center text-sm font-black text-white">
                            {displayName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading truncate text-sm font-black text-[#1e1b4b]">
                          {displayName}
                        </p>
                        <p className="truncate text-xs font-bold text-slate-400">
                          @{user.username || "discord"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleSyncRoles}
                        disabled={isSyncing}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500"
                        title="Sync Role"
                      >
                        <RotateCw
                          className={`h-3.5 w-3.5 ${
                            isSyncing ? "animate-spin text-[#2baee2]" : ""
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          setShowLogoutModal(true);
                        }}
                        className="font-heading shrink-0 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-600 transition hover:bg-rose-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>

                  {/* Consistent Real Discord Role Badge */}
                  <div className="mt-2.5 flex items-center">
                    {renderRoleBadge()}
                  </div>

                  {/* Admin link for mobile */}
                  {user.isAdmin && (
                    <div className="mt-3 border-t border-slate-200 pt-2.5">
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="font-heading flex items-center justify-center gap-2 rounded-xl bg-[#2baee2] py-2 text-xs font-black text-white shadow-sm"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Buka Admin Dashboard</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-heading rounded-2xl px-4 py-2.5 text-sm font-bold text-[#1e1b4b] transition-colors hover:bg-[#e0f4fc] hover:text-[#1b8ebc]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Language Switcher row inside mobile menu */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 px-2 pt-4 pb-1">
                <span className="font-heading text-xs font-bold text-slate-500">
                  Language / Bahasa
                </span>
                <LanguageToggle />
              </div>

              {/* If not logged in, show Login CTA Button */}
              {!user && (
                <div className="mt-3 pt-1">
                  <Button
                    variant="yellow"
                    size="md"
                    onClick={() => {
                      setIsOpen(false);
                      openLoginModal();
                    }}
                    className="w-full py-3 text-xs font-black tracking-wide sm:text-sm"
                  >
                    <span>Login</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
        title={locale === "id" ? "Konfirmasi Keluar Akun" : "Confirm Logout"}
        description={
          locale === "id"
            ? "Apakah Anda yakin ingin keluar dari sesi akun Discord Bloom Universe?"
            : "Are you sure you want to log out from your Bloom Universe Discord session?"
        }
        confirmText={locale === "id" ? "Ya, Keluar" : "Log Out"}
        cancelText={locale === "id" ? "Batal" : "Cancel"}
        variant="danger"
        loading={isLoggingOut}
      />
    </header>
  );
}
