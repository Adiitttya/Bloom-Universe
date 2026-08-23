# Step 4 — Landing Page Layout

## Tujuan

Membangun kerangka (shell) halaman utama: Navbar, Footer, dan root layout yang digunakan semua halaman public.

---

## Tugas

### 1. `src/components/layout/Navbar.tsx`

Komponen navigasi utama halaman public.

**Elemen**:

- Logo Bloomun (gambar `/public/Bloom.jpg` + teks "Bloom Universe")
- Nav links: sesuaikan dengan section landing page (Home, About, Gallery, dll)
- Tombol join/CTA (arahkan ke Discord)
- Responsive: hamburger menu di mobile
- Sticky di bagian atas saat scroll
- Gaya: rounded, shadow ringan, on-brand

### 2. `src/components/layout/Footer.tsx`

Footer halaman public.

**Elemen**:

- Logo kecil + tagline singkat komunitas
- Link sosial media (icon Lucide)
- Copyright `© {year} Bloom Universe`
- Gaya: sederhana, bersih, on-brand

### 3. `src/app/(main)/layout.tsx`

Layout wrapper untuk semua halaman public.

- Render `<Navbar>` di atas
- Render `<Footer>` di bawah
- `{children}` di tengah
- Tidak ada logika bisnis di sini

### 4. `src/app/(main)/page.tsx`

Halaman utama — untuk saat ini hanya import dan susun section-section dari Step 5.
Di step ini, buat sebagai placeholder kosong dulu (atau render teks "Landing page coming soon").

---

## Catatan

- Navbar dan Footer **hanya** untuk halaman public — admin punya layout sendiri
- Semua link sosmed ambil dari `lib/constants.ts`, bukan hardcode di component
- Animasi subtle pada hover nav links

---

## Output yang Diharapkan

- Buka `localhost:3000` → tampil halaman dengan Navbar di atas dan Footer di bawah
- Navbar responsive, tampil benar di mobile
- Tidak ada error TypeScript atau ESLint
