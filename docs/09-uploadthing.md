# Step 9 — Upload Gambar (Uploadthing)

## Tujuan

Mengintegrasikan Uploadthing untuk fitur upload foto gallery di admin dashboard.

---

## Yang Perlu Disiapkan (Di Luar Code)

1. Daftar di [uploadthing.com](https://uploadthing.com)
2. Buat app baru → ambil `UPLOADTHING_SECRET` dan `UPLOADTHING_APP_ID`
3. Isi ke `.env.local`

---

## Tugas

### 1. `lib/uploadthing.ts` — Konfigurasi Router

- Definisikan file router dengan endpoint `galleryImage`
- Batasi: tipe file gambar saja (image/jpeg, image/png, image/webp)
- Batasi ukuran maksimal (misal 4MB per file)
- Hanya user yang login sebagai admin yang boleh upload (cek session di `middleware`)
- Callback `onUploadComplete`: simpan URL gambar ke tabel `GalleryImage` di database

### 2. `app/api/uploadthing/route.ts`

- Handler API untuk Uploadthing
- Ekspor `GET` dan `POST`

### 3. Integrasi ke Halaman Admin Gallery

- Di `app/(admin)/admin/gallery/page.tsx`, tambahkan komponen upload
- Gunakan komponen `UploadButton` atau `UploadDropzone` dari `@uploadthing/react`
- Setelah upload berhasil → refresh daftar gambar (revalidate)
- Tombol hapus gambar: hapus dari database + (opsional) hapus dari Uploadthing storage

---

## Catatan

- URL gambar yang disimpan ke database adalah URL publik dari Uploadthing CDN
- Komponen upload hanya muncul di halaman admin — tidak di halaman public
- Jika upload gagal → tampil pesan error yang jelas

---

## Output yang Diharapkan

- Admin bisa upload gambar dari halaman `/admin/gallery`
- Gambar langsung muncul di section Gallery di halaman utama
- Admin bisa hapus gambar
- Tidak ada gambar yang bisa diupload oleh user non-admin
