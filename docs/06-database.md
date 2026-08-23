# Step 6 — Database (Neon + Prisma)

## Tujuan

Menyiapkan database PostgreSQL di Neon dan schema Prisma untuk semua data yang dikelola admin.

---

## Yang Perlu Disiapkan (Di Luar Code)

1. Buat akun di [neon.tech](https://neon.tech)
2. Buat project baru → ambil `DATABASE_URL`
3. Isi `DATABASE_URL` di file `.env.local`

---

## Tugas

### 1. Inisialisasi Prisma

- Jalankan `npx prisma init` (jika belum)
- Pastikan `provider` di `schema.prisma` adalah `postgresql`

### 2. Multi-File Schema

Prisma mendukung multi-file schema. Pisahkan schema berdasarkan domain:

```
prisma/
├── schema.prisma           ← file utama (datasource + generator)
├── schema/
│   ├── user.prisma         ← model User (admin)
│   ├── content.prisma      ← model SiteContent (konten dinamis)
│   ├── gallery.prisma      ← model GalleryImage
│   ├── announcement.prisma ← model Announcement
│   └── subweb.prisma       ← model SubWebCard
```

File `schema.prisma` utama hanya berisi konfigurasi datasource dan generator. Semua model di file terpisah.

> Aktifkan fitur multi-file dengan `previewFeatures = ["prismaSchemaFolder"]` di generator.

### 3. Model yang Dibuat

**`user.prisma`** — Data user admin yang pernah login

- ID Discord user
- Username Discord
- Avatar URL
- Role (ADMIN / SUPER_ADMIN)
- Timestamps

**`content.prisma`** — Konten dinamis landing page (key-value)

- Section (hero, about, dll)
- Key (title, subtitle, dll)
- Value (teks konten)
- Siapa yang terakhir update + kapan

**`gallery.prisma`** — Foto gallery komunitas

- URL gambar (dari Uploadthing)
- Alt text
- Urutan tampil
- Timestamps

**`announcement.prisma`** — Pengumuman yang tampil di banner

- Teks pengumuman
- Status aktif/nonaktif
- Tanggal mulai + kedaluwarsa (opsional)

**`subweb.prisma`** — Kartu sub-web di landing page

- Judul, deskripsi, URL, icon name
- Visible/hidden
- Urutan tampil

### 4. Migrate & Seed

- Jalankan `npx prisma migrate dev --name init`
- Buat file `prisma/seed.ts` untuk data awal (konten hero default, kartu sub-web default, dll)
- Tambah script `"db:seed"` ke `package.json`

### 5. Prisma Client (`lib/db.ts`)

- Ekspor singleton Prisma Client
- Handle hot-reload di development (jangan buat koneksi baru tiap HMR)

---

## Output yang Diharapkan

- `npx prisma studio` bisa dibuka dan tabel terlihat
- Seed data awal sudah masuk ke database
- `lib/db.ts` bisa di-import tanpa error
