# Bloom Universe — Master Planning

## Tentang Proyek

Website official komunitas **Bloom Universe** (Bloomun).
Dibangun dengan Next.js 16 App Router, TypeScript, Tailwind CSS v4.
Satu domain, multi sub-web via route groups (`/store`, `/photobooth`, dll).

**Fase aktif**: Web Utama (landing page) + Admin Dashboard.

---

## Brand Identity

- **Warna primer**: Biru langit `hsl(203, 82%, 55%)`
- **Accent**: Kuning cerah `hsl(45, 100%, 55%)`
- **Sekunder**: Ungu lavender `hsl(270, 60%, 70%)`
- **Font heading**: Fredoka (Google Fonts)
- **Font body**: Nunito (Google Fonts)
- **Style**: Playful, bubbly, cartoonish — komunitas/gaming vibes
- **Icon**: Lucide React — tidak pakai emoji
- **Dark mode**: Didukung

---

## Tech Stack

| Layer     | Teknologi                              |
| --------- | -------------------------------------- |
| Framework | Next.js 16 (App Router)                |
| Language  | TypeScript 5 (strict)                  |
| Styling   | Tailwind CSS v4                        |
| Icon      | Lucide React                           |
| Database  | Neon (serverless PostgreSQL)           |
| ORM       | Prisma (multi-file schema)             |
| Auth      | NextAuth.js v5 — Discord OAuth         |
| Upload    | Uploadthing                            |
| Utility   | clsx, tailwind-merge                   |
| Format    | Prettier + prettier-plugin-tailwindcss |

---

## Prinsip Pengembangan

- **Tidak hardcode** — semua config dari env atau database
- **Modular** — 1 file = 1 tanggung jawab, tidak ada file ribuan baris
- **Konsisten** — penamaan file, folder, variabel, function harus konsisten
- **Aman** — tidak expose secret, semua route admin dilindungi middleware
- **Scalable** — mudah tambah sub-web baru di masa depan
- **Sumber tunggal** — warna, konstanta, tipe → dari 1 file sumber

---

## Arsitektur Routing

```
/                   → Landing page (main web)
/admin              → Admin dashboard (protected)
/admin/...          → Sub-halaman admin
/login              → Login Discord

[Fase berikutnya]
/store              → Web store
/photobooth         → Photobooth
/minecraft          → Info server Minecraft
```

---

## Auth: Discord Role-Based

1. Login via Discord OAuth (NextAuth v5)
2. Setelah login, cek role user di server Discord Bloomun via Discord Bot API
3. Hanya user dengan role tertentu (ADMIN_ROLE_IDS dari env) yang bisa akses `/admin`
4. Jika tidak punya role → tampil halaman **Forbidden** bergaya brand Bloomun
5. Middleware Next.js menjaga semua route `/admin/*`

---

## Daftar Planning Dokumen

Setiap step punya dokumen planning sendiri di folder `docs/`:

| File                               | Isi                                    |
| ---------------------------------- | -------------------------------------- |
| `docs/01-setup-config.md`          | Config, packages, env setup            |
| `docs/02-folder-structure.md`      | Struktur folder dan file               |
| `docs/03-design-system.md`         | Design tokens, font, komponen UI dasar |
| `docs/04-landing-page-layout.md`   | Navbar, Footer, root layout            |
| `docs/05-landing-page-sections.md` | Semua section landing page             |
| `docs/06-database.md`              | Neon + Prisma schema setup             |
| `docs/07-auth.md`                  | NextAuth Discord + middleware          |
| `docs/08-admin-dashboard.md`       | Layout dan halaman admin               |
| `docs/09-uploadthing.md`           | Upload gambar gallery                  |
| `docs/10-docs-final.md`            | README + final docs update             |

---

## Lingkungan Variabel (`.env`)

```env
DATABASE_URL=""
AUTH_SECRET=""
AUTH_DISCORD_ID=""
AUTH_DISCORD_SECRET=""
DISCORD_BOT_TOKEN=""
DISCORD_GUILD_ID=""
DISCORD_ADMIN_ROLE_IDS=""     # comma-separated
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
