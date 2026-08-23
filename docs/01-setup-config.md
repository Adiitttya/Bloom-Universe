# Step 1 — Setup Config & Packages

## Tujuan

Menyiapkan fondasi project: konfigurasi tooling, install package, dan file environment.

---

## Tugas

### 1. Update `tsconfig.json`

- Ganti `"target"` dari `"ES2017"` ke `"ES2022"`

### 2. Install Packages Baru

Tambahkan ke `dependencies`:

- `lucide-react`
- `clsx`
- `tailwind-merge`
- `next-auth@beta` (versi 5)
- `@prisma/client`

Tambahkan ke `devDependencies`:

- `prisma`
- `prettier`
- `prettier-plugin-tailwindcss`

### 3. Tambah Script ke `package.json`

- `"format"`: jalankan prettier untuk semua file

### 4. Buat `.prettierrc`

Konfigurasi dasar Prettier dengan `prettier-plugin-tailwindcss` aktif.

### 5. Buat `.env.example`

Template semua environment variable yang dibutuhkan project (tanpa nilai).
Lihat daftar env di `docs/planning.md`.

### 6. Update `.gitignore`

Pastikan `.env`, `.env.local`, `.env.production` sudah di-ignore.

---

## Output yang Diharapkan

- `npm install` berjalan tanpa error
- `npm run dev` berjalan tanpa error
- `npm run format` memformat kode dengan benar
- Semua file config ada di root project
