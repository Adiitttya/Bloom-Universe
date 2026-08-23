# Step 8 — Admin Dashboard

## Tujuan

Membangun dashboard admin untuk mengelola konten landing page.
Hanya bisa diakses oleh user Discord yang punya role admin di server Bloomun.

---

## Struktur Halaman Admin

```
/admin                   → Overview / ringkasan
/admin/hero              → Kelola teks Hero section
/admin/about             → Kelola teks About section
/admin/gallery           → Kelola foto Gallery
/admin/announcements     → Kelola banner pengumuman
/admin/socials           → Kelola link sosial media
/admin/subwebs           → Kelola kartu sub-web
```

---

## Tugas

### 1. `AdminSidebar.tsx`

- Navigasi ke semua halaman admin
- Tampilkan avatar + username Discord admin yang login
- Tombol logout
- Gaya: sidebar kiri, on-brand tapi lebih bersih/profesional dari halaman public

### 2. `app/(admin)/admin/layout.tsx`

- Render sidebar + area konten utama
- Tidak ada Navbar/Footer publik
- Proteksi sudah dihandle middleware (Step 7)

### 3. `app/(admin)/admin/page.tsx` — Overview

- Ringkasan: jumlah foto gallery, pengumuman aktif, kartu sub-web
- Shortcut ke masing-masing halaman kelola

### 4. Halaman Kelola Per Section

Setiap halaman kelola mengikuti pola yang sama:

- **Fetch** data saat ini dari database (Server Component)
- **Form** untuk mengubah data (Client Component)
- **Server Action** untuk menyimpan perubahan
- **Toast/notifikasi** setelah berhasil/gagal

**`/admin/hero`**

- Field: Judul, Subtitle, Teks CTA utama, URL CTA, Teks CTA sekunder, URL CTA sekunder

**`/admin/about`**

- Field: Teks deskripsi komunitas, statistik (label + angka, bisa multiple)

**`/admin/gallery`**

- Tampil grid foto yang ada
- Tombol hapus per foto
- Upload foto baru (diintegrasikan di Step 9)
- Drag-and-drop reorder urutan (opsional, bisa pakai angka order manual dulu)

**`/admin/announcements`**

- List pengumuman dengan status aktif/nonaktif
- Form tambah pengumuman baru
- Toggle aktif/nonaktif, hapus

**`/admin/socials`**

- Form dengan field per platform (Discord URL, YouTube URL, dll)
- Platform diambil dari `lib/constants.ts` — tidak hardcode di halaman

**`/admin/subwebs`**

- List kartu sub-web dengan toggle visible/hidden
- Edit deskripsi singkat per kartu
- Urutan tampil

---

## Catatan Penting

- Gunakan **Server Actions** Next.js untuk mutasi data — tidak perlu API route terpisah untuk setiap aksi
- Setiap Server Action harus **re-validasi role** (jangan hanya andalkan middleware)
- Form menggunakan komponen `Input`, `Textarea`, `Button` dari `components/ui/`
- Pisahkan Server Component (data fetching) dan Client Component (form interaktif) — jangan campur di 1 file jika panjang

---

## Output yang Diharapkan

- Semua halaman admin bisa diakses dan berfungsi
- Perubahan dari admin langsung terlihat di landing page
- Tampilan admin bersih, fungsional, on-brand
