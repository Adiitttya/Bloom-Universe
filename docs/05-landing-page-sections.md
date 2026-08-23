# Step 5 — Landing Page Sections

## Tujuan

Membangun semua section konten halaman utama Bloom Universe.
Setiap section adalah komponen terpisah di `src/components/sections/`.

---

## Urutan Section di Halaman

```
[Announcement Banner]   ← opsional, muncul di atas navbar
[Navbar]               ← dari Step 4
---
[Hero]
[About]
[Gallery]
[Sub-web Cards]
[Social Links / Join CTA]
---
[Footer]               ← dari Step 4
```

---

## Detail Per Section

### `AnnouncementBanner.tsx`

- Bar tipis di paling atas halaman
- Berisi teks pengumuman singkat
- Ada tombol close (X) untuk menyembunyikan
- Warna accent (kuning)
- **Data**: ambil dari props (nanti akan diisi dari database di Step 8)

### `HeroSection.tsx`

- Section paling besar, kesan pertama
- Elemen: judul besar, subtitle, tombol CTA utama (Join Discord), tombol sekunder
- Visual: bisa ada elemen dekoratif (bubble/blob shapes on-brand)
- **Tidak pakai gambar placeholder** — gunakan elemen CSS/SVG dekoratif
- **Data**: judul, subtitle, CTA label ambil dari props

### `AboutSection.tsx`

- Deskripsi singkat tentang komunitas Bloom Universe
- Bisa ada beberapa "stat" (jumlah member, dll) — placeholder angka dulu
- Gaya: card atau 2-column layout
- **Data**: teks deskripsi, stats dari props

### `GallerySection.tsx`

- Grid foto komunitas
- Layout: masonry atau grid responsive
- Hover effect pada gambar
- **Data**: array gambar dari props (URL + alt text)
- Jika array kosong → tampil placeholder state "Belum ada foto"

### `SubWebCards.tsx`

- Grid kartu yang menunjukkan sub-web yang tersedia (Store, Photobooth, Minecraft, dll)
- Tiap kartu: icon Lucide, judul, deskripsi singkat, link
- Kartu yang belum live → tampil badge "Coming Soon", tidak bisa diklik
- **Data**: array card dari props

### `SocialLinks.tsx` (atau bagian dari Hero/Footer)

- Tombol/icon besar untuk join Discord (CTA utama komunitas)
- Icon sosmed lain: YouTube, Instagram, TikTok, dll
- **Data**: URL sosmed dari `lib/constants.ts`

---

## Catatan

- Setiap section menerima data via **props** — tidak fetch langsung di component
- `page.tsx` yang mengumpulkan data dan meneruskan ke section
- Untuk fase ini data masih **statis dari `constants.ts`** — koneksi ke database di Step 8
- Semua section harus punya **responsive design** (mobile-first)
- Animasi: hanya subtle hover dan scroll-reveal ringan — tidak berlebihan

---

## Output yang Diharapkan

- Halaman `localhost:3000` tampil lengkap dengan semua section
- Tampilan menarik, on-brand, tidak seperti template generik
- Responsive di mobile dan desktop
- Tidak ada error
