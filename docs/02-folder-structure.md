# Step 2 — Folder Structure

## Tujuan

Membuat struktur folder dan file kosong (placeholder) sesuai arsitektur project.
Semua file boleh kosong/minimal dulu — isi diisi di step berikutnya.

---

## Struktur yang Dibuat

```
src/
├── app/
│   ├── (main)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── hero/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── gallery/page.tsx
│   │   │   ├── announcements/page.tsx
│   │   │   ├── socials/page.tsx
│   │   │   └── subwebs/page.tsx
│   │   └── login/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── uploadthing/route.ts
│   ├── globals.css        (sudah ada, akan diupdate di step 3)
│   ├── layout.tsx         (sudah ada, akan diupdate)
│   └── not-found.tsx      (custom 404 bergaya Bloomun)
│
├── components/
│   ├── ui/                (kosong dulu, diisi step 3)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   └── sections/
│       ├── HeroSection.tsx
│       ├── AboutSection.tsx
│       ├── GallerySection.tsx
│       ├── AnnouncementBanner.tsx
│       ├── SubWebCards.tsx
│       └── SocialLinks.tsx
│
├── lib/
│   ├── utils.ts           (cn() helper)
│   ├── constants.ts       (nama brand, kunci sosmed, dll)
│   ├── types.ts           (global TS types/interfaces)
│   ├── auth.ts            (NextAuth config)
│   ├── db.ts              (Prisma client singleton)
│   └── uploadthing.ts     (Uploadthing config)
│
├── hooks/
│   └── useAuth.ts
│
└── prisma/
    ├── schema.prisma      (file utama Prisma)
    └── migrations/        (akan dibuat otomatis oleh Prisma)
```

---

## Catatan Penting

- **`lib/utils.ts`**: Ekspor fungsi `cn()` menggunakan `clsx` + `tailwind-merge`
- **`lib/constants.ts`**: Nama brand, URL, key sosmed — tidak ada nilai hardcode di component
- **`lib/types.ts`**: Tipe global (contoh: `SiteContent`, `GalleryImage`)
- **Tidak ada file ribuan baris** — setiap file punya 1 tanggung jawab

---

## Output yang Diharapkan

- Semua folder dan file placeholder sudah ada
- `lib/utils.ts` sudah mengekspor fungsi `cn()`
- `lib/constants.ts` sudah berisi konstanta nama brand minimal
- Project tetap bisa `npm run dev` tanpa error
