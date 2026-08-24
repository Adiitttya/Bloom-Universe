# 14 — Bloom Universe: Multi-Feature Ecosystem Architecture

> **Tujuan Dokumen**: Panduan high-level untuk pengembangan Bloomun menjadi ekosistem web multi-fitur (`bloomun.com/photobooth`, `/social`, `/photobooth`, dll.) dalam **satu project Next.js yang sama**. Dokumen ini ditujukan untuk programmer atau AI model yang akan mengimplementasikan fitur-fitur ini satu per satu.

---

## 1. Konsep & Visi

Bloom Universe (`bloomun.com`) berkembang dari sekadar landing page komunitas Discord menjadi **ekosistem digital terpadu** — satu platform dengan banyak fitur interaktif yang dapat diakses oleh member komunitas.

Setiap fitur hadir di URL `bloomun.com/<nama-fitur>` dan terintegrasi dengan:

- **Satu sistem autentikasi** (Discord OAuth yang sudah ada)
- **Satu database** (PostgreSQL via Prisma yang sudah ada)
- **Satu admin dashboard** terpusat (`bloomun.com/admin`)

Fitur-fitur yang direncanakan (bisa bertambah):

| URL           | Nama Fitur               | Status  |
| ------------- | ------------------------ | ------- |
| `/`           | Web Utama & Landing Page | Live    |
| `/admin`      | Admin Dashboard Terpusat | Live    |
| `/photobooth` | Bloom Photobooth         | Planned |
| `/social`     | Bloom Social Feed        | Planned |
| `/store`      | Bloom Store              | Planned |
| `/minecraft`  | Bloom Games Portal       | Planned |
| `/roblox`     | Bloom Games Portal       | Planned |
| `/bot`        | Bloom Bot Dashboard      | Planned |

---

## 2. Pendekatan Arsitektur: Feature-Based Modular

Semua fitur berada dalam **satu project Next.js** (monolith modular). Tidak ada sub-project terpisah.

### Prinsip Utama

- **Routing** sepenuhnya dikelola oleh Next.js App Router (`src/app/`)
- **Logika & UI** tiap fitur **diisolasi** di dalam `src/features/<nama-fitur>/`
- Folder `src/app/<nama-fitur>/` hanya berisi file routing (`page.tsx`, `layout.tsx`) yang memanggil komponen dari `src/features/`
- Komponen **shared/global** tetap di `src/components/`

### Aturan Isolasi Fitur

Setiap fitur harus bisa dihapus dengan cara menghapus 2 folder saja:
`src/app/<nama-fitur>/` dan `src/features/<nama-fitur>/`
tanpa merusak fitur lain.

---

## 3. Perubahan Struktur Folder

### Kondisi Saat Ini

```
src/
├── app/
│   ├── (admin)/admin/     <- Admin dashboard
│   ├── (main)/            <- Landing page
│   └── api/
├── components/
│   ├── admin/
│   ├── layout/
│   └── ui/
└── lib/
```

### Kondisi Setelah Pengembangan

```
src/
├── app/
│   ├── (admin)/admin/         <- Admin dashboard (EXISTING, diperluas)
│   │   ├── photobooth/        <- [NEW] Manajemen photobooth
│   │   ├── social/            <- [NEW] Manajemen social feed
│   │   └── games/             <- [NEW] Manajemen games
│   ├── (main)/                <- Landing page (EXISTING, tidak berubah)
│   ├── photobooth/            <- [NEW] Halaman publik photobooth
│   ├── social/                <- [NEW] Halaman publik social feed
│   ├── games/                 <- [NEW] Halaman publik games
│   └── api/
│       ├── photobooth/        <- [NEW] API endpoint photobooth
│       ├── social/            <- [NEW] API endpoint social
│       └── games/             <- [NEW] API endpoint games
│
├── features/                  <- [NEW FOLDER] Isolasi logika tiap fitur
│   ├── photobooth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── actions/
│   │   └── types/
│   ├── social/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── actions/
│   │   └── types/
│   └── games/
│       ├── components/
│       ├── hooks/
│       ├── actions/
│       └── types/
│
├── components/                <- Shared global (tidak banyak berubah)
└── lib/                       <- Shared utilities (tidak berubah)
```

---

## 4. Pola Implementasi Per Fitur

Setiap fitur baru mengikuti pola yang sama. Contoh implementasi fitur **Photobooth**:

### 4.1. Buat Schema Database

Buat file baru di `prisma/schema/`:

- `prisma/schema/photobooth.prisma`
- Beri **prefix nama fitur** pada semua model (contoh: `pb` untuk photobooth)
- Relasikan ke model `User` jika perlu (gunakan `userId` -> `User.id`)
- Setelah selesai, jalankan `npx prisma generate` dan `npx prisma db push`

Contoh model yang umum untuk photobooth:

- `pb_frame` — data frame/bingkai foto
- `pb_session` — sesi foto user
- `pb_photo` — hasil foto

### 4.2. Buat Folder Feature

```
src/features/photobooth/
├── components/   <- Semua komponen React khusus photobooth
├── hooks/        <- Custom hooks (state, kamera, filter, dll)
├── actions/      <- Server Actions (create, update, delete data)
└── types/        <- TypeScript types & interfaces
```

### 4.3. Buat Halaman Publik

```
src/app/photobooth/
├── layout.tsx    <- Layout berbeda dari web utama (boleh punya Navbar sendiri)
├── page.tsx      <- Halaman utama /photobooth
└── ...           <- Sub-halaman lain jika ada
```

- `layout.tsx` di sini bisa memiliki desain, warna, dan navigasi yang **berbeda total** dari `(main)/layout.tsx`
- Import komponen dari `src/features/photobooth/components/`

### 4.4. Buat Halaman Admin

```
src/app/(admin)/admin/photobooth/
├── page.tsx      <- Halaman manajemen di admin dashboard
└── actions.ts    <- (Atau pindahkan ke features/photobooth/actions/)
```

- Halaman admin ini langsung terlindungi oleh sistem auth admin yang sudah ada
- Tambahkan menu/link di sidebar admin (`src/components/admin/`)

### 4.5. Tambahkan ke SubWebCard (Landing Page)

Di database (tabel `SubWebCard`), tambahkan entry baru untuk menampilkan card fitur baru di section "Explore Our Digital Ecosystem" pada landing page. Bisa dilakukan via admin panel (menu SubWeb Cards) atau lewat seed script.

---

## 5. Konvensi Database

### Prinsip Penamaan

Untuk menjaga schema tetap rapi saat fitur bertambah, gunakan **prefix 2-3 huruf** per fitur:

| Fitur       | Prefix  | Contoh Model                          |
| ----------- | ------- | ------------------------------------- |
| Photobooth  | `pb`    | `pb_frame`, `pb_session`, `pb_photo`  |
| Social Feed | `soc`   | `soc_post`, `soc_comment`, `soc_like` |
| Minecraft   | `mc`    | `mc_score`, `mc_achievement`          |
| Roblox      | `rblx`  | `rblx_score`, `rblx_achievement`      |
| Store       | `store` | `store_item`, `store_order`           |

### Model Shared (Tidak Perlu Duplikat)

Model-model ini **sudah ada** dan **langsung bisa digunakan** oleh semua fitur:

- **`User`** — Identitas user, relasi ke semua fitur
- **`AdminLog`** — Untuk mencatat aksi admin di fitur baru
- **`MemberLog`** — Untuk mencatat interaksi user di fitur baru

---

## 6. Sistem Auth & Role

### Tidak Ada Perubahan Signifikan

Sistem auth Discord OAuth yang sudah ada cukup untuk semua fitur baru:

- `GUEST` — User belum join server Discord
- `MEMBER` — User member Discord, bisa akses fitur komunitas
- `ADMIN` / `SUPER_ADMIN` — Akses admin dashboard

### Penyesuaian Opsional

Jika sebuah fitur butuh akses kontrol lebih granular (misal: hanya role Discord tertentu yang bisa akses), gunakan field `User.guildRoles` yang sudah ada — ini berisi array role Discord ID user tersebut.

Tidak perlu membuat sistem login baru. Gunakan session yang sudah ada via `auth()` dari NextAuth.

---

## 7. Penyesuaian Admin Dashboard

Admin dashboard di `/admin` menjadi **Central Admin Panel** untuk semua fitur.

### Yang Perlu Diubah

1. **Sidebar Admin** (`src/components/admin/`) — Tambahkan menu navigasi untuk tiap fitur baru
2. **Main Admin Page** (`src/app/(admin)/admin/page.tsx`) — Tambahkan stat cards / overview untuk fitur baru
3. Tidak perlu membuat sistem login admin baru

### Pola Pengelompokan Sidebar

Sidebar admin dikelompokkan per modul:

```
Overview
---------------------
Main Website
  - Hero
  - About / Gallery
  - Announcements
  - Socials
  - SubWeb Cards
---------------------
Photobooth             <- Tambah saat implement photobooth
  - Frames
  - Sessions
---------------------
Social Feed            <- Tambah saat implement social
  - Posts
  - Moderation
---------------------
Games                  <- Tambah saat implement games
  - Leaderboard
---------------------
System
  - Admin Logs
  - Member Logs
```

---

## 8. Environment Variables

Gunakan **satu file `.env.local`** untuk semua fitur. Beri komentar penanda per fitur agar tidak campur aduk:

```env
# EXISTING (Jangan diubah)
DATABASE_URL=...
NEXTAUTH_SECRET=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
UPLOADTHING_TOKEN=...

# PHOTOBOOTH (Tambahkan saat implement jika perlu)
# PHOTOBOOTH_MAX_PHOTOS_PER_SESSION=4

# SOCIAL (Tambahkan saat implement jika perlu)
# SOCIAL_POST_MAX_LENGTH=500
```

Jika tidak ada kebutuhan env khusus untuk sebuah fitur, tidak perlu menambahkan apapun.

---

## 9. Panduan Urutan Pengerjaan Per Fitur Baru

Ikuti urutan ini saat mengimplementasikan fitur baru:

1. Buat schema Prisma → `generate` → `db push`
2. Buat folder `src/features/<fitur>/` dengan struktur standar
3. Buat `src/app/<fitur>/layout.tsx` — desain & navigasi fitur
4. Buat halaman publik di `src/app/<fitur>/`
5. Buat halaman admin di `src/app/(admin)/admin/<fitur>/`
6. Tambahkan menu ke sidebar admin
7. Update `SubWebCard` di database

---

## 10. Hal yang TIDAK Boleh Dilakukan

- Jangan buat `package.json` baru atau project terpisah
- Jangan duplikat komponen dari `src/components/ui/` — gunakan yang ada
- Jangan buat sistem auth/login baru — gunakan NextAuth yang sudah ada
- Jangan letakkan logika fitur langsung di `src/app/` — selalu buat di `src/features/`
- Jangan buat model Prisma tanpa prefix nama fitur

---

## 11. Checklist Per Fitur Baru

- [ ] Schema Prisma dibuat dengan prefix yang benar
- [ ] `prisma generate` & `prisma db push` dijalankan
- [ ] Folder `src/features/<fitur>/` dibuat dengan sub-folder standar
- [ ] Halaman publik `src/app/<fitur>/` memiliki `layout.tsx` sendiri
- [ ] Halaman admin `src/app/(admin)/admin/<fitur>/` dibuat
- [ ] Menu admin di sidebar ditambahkan
- [ ] Entry `SubWebCard` ditambahkan
- [ ] Tidak ada breaking change di fitur yang sudah live

---

## 12. Dokumen Referensi

Sebelum mulai implementasi fitur apapun, baca dokumen berikut:

- `docs/01-setup-config.md` — Setup dan konfigurasi project
- `docs/06-database.md` — Konvensi database & Prisma
- `docs/07-auth.md` — Sistem autentikasi
- `docs/08-admin-dashboard.md` — Struktur admin dashboard
- `docs/info.md` — Konteks brand & tone Bloom Universe
