# 13 — Persistent Rate Limiter (VULN-002 Fix)

## Latar Belakang

Rate limiter saat ini memakai `Map` in-memory di TypeScript. Di environment serverless (Vercel), setiap request bisa berjalan di instance berbeda sehingga counter tidak shared — rate limit bisa reset kapan saja dan tidak efektif.

**Solusi**: Simpan data rate limit di database Neon PostgreSQL yang sudah ada via Prisma.

---

## Key Design Decision: userId, bukan IP

Karena flow admin sudah melewati Discord OAuth **sebelum** sampai ke input passcode, identitas user sudah diketahui pasti. Gunakan **Discord User ID** (dari session) sebagai key rate limit, bukan IP address.

| Alasan              | Penjelasan                                        |
| ------------------- | ------------------------------------------------- |
| IP bisa di-rotate   | Attacker bisa ganti VPN/proxy untuk reset counter |
| Shared IP           | Kantor/kampus bisa kena false lock                |
| userId lebih akurat | Satu akun = satu counter, tidak bisa dihindari    |

---

## Yang Harus Dilakukan

### 1. Tambah Model Prisma

Tambahkan model baru di file schema Prisma (misalnya `user.prisma`):

```
model AdminRateLimit {
  userId      String    @id   // Discord User ID dari session
  count       Int       @default(0)
  lockedUntil DateTime?
  updatedAt   DateTime
}
```

Jalankan `prisma migrate dev` setelah menambahkan model ini.

---

### 2. Pisahkan Logic ke File Utility

Buat file baru `src/lib/auth/rate-limit.ts` yang berisi tiga fungsi:

- **`isRateLimited(userId)`** — cek apakah user sedang dikunci. Jika lock sudah expired, hapus record sekaligus.
- **`recordFailedAttempt(userId)`** — tambah `count`. Jika sudah mencapai threshold, set `lockedUntil`.
- **`clearRateLimit(userId)`** — hapus record setelah login berhasil.

Konstanta seperti `MAX_ATTEMPTS = 5` dan `LOCK_DURATION_MS = 10 menit` didefinisikan di atas file utility ini, bukan inline.

---

### 3. Update Route Login Admin

Di `src/lib/auth/admin-actions.ts`:

- Hapus `passcodeRateLimitMap` (Map in-memory).
- Hapus fungsi `isRateLimited`, `recordFailedAttempt`, `clearFailedAttempts` yang lama.
- Import dan panggil fungsi dari file utility baru.
- Ganti key dari `ipAddress` menjadi `session.user.id`.

---

### 4. Auto-cleanup

Cleanup terjadi **on-read**: saat `isRateLimited` dipanggil dan lock sudah expired, record langsung dihapus dari DB. Tidak perlu cron job.

---

## Catatan Penting

- **Scope sempit**: Perubahan ini hanya menyentuh `user.prisma`, file utility baru, dan `admin-actions.ts`. Tidak ada perubahan UI.
- **IP address tetap dicatat** di `AdminLog` untuk keperluan audit — hanya key rate limit yang berubah dari IP ke userId.
- **Testing**: Coba gagal login 5 kali dengan akun yang sama → harus terkunci. Ganti IP → tetap terkunci. Login berhasil → counter reset.
