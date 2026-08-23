# Step 7 — Auth (Discord + NextAuth v5)

## Tujuan

Mengimplementasikan login via Discord OAuth dan sistem proteksi route admin berbasis Discord server role.

---

## Yang Perlu Disiapkan (Di Luar Code)

1. Buka [Discord Developer Portal](https://discord.com/developers/applications)
2. Buat aplikasi OAuth baru
3. Ambil `CLIENT_ID` dan `CLIENT_SECRET`
4. Set redirect URI: `http://localhost:3000/api/auth/callback/discord`
5. Aktifkan Bot → ambil `BOT_TOKEN`
6. Invite bot ke server Bloom Universe (cukup permission `View Members`)
7. Ambil `GUILD_ID` server Bloom Universe
8. Ambil `ROLE_ID` role yang boleh akses admin
9. Isi semua ke `.env.local`

---

## Tugas

### 1. `lib/auth.ts` — Konfigurasi NextAuth

- Provider: Discord
- Scope tambahan: `guilds.members.read` (opsional) atau gunakan Bot API
- Callback `signIn`: setelah login, cek apakah user ada di guild Bloomun dan punya role admin
  - Gunakan Discord Bot API: `GET /guilds/{GUILD_ID}/members/{userId}`
  - Jika tidak punya role → kembalikan `false` (login ditolak)
- Callback `session`: tambahkan `isAdmin` dan `discordId` ke session object
- Adapter: Prisma Adapter (simpan sesi dan user ke database)

### 2. `app/api/auth/[...nextauth]/route.ts`

- Handler sederhana — ekspor `GET` dan `POST` dari auth config

### 3. `app/login/page.tsx` — Halaman Login

- Tampilan bergaya Bloomun
- Tombol "Login dengan Discord" (icon Discord + Lucide)
- Bukan halaman admin — siapapun bisa akses URL ini
- Jika sudah login dan punya role → redirect ke `/admin`
- Jika sudah login tapi tidak punya role → tampil pesan "Kamu tidak punya akses"

### 4. Middleware (`middleware.ts` di root `src/`)

- Proteksi semua route `/admin/*`
- Cek session: jika tidak login → redirect ke `/login`
- Cek `isAdmin`: jika login tapi bukan admin → redirect ke `/forbidden`

### 5. `app/forbidden/page.tsx` — Halaman Forbidden Custom

- Tampilan bergaya penuh Bloomun (bukan halaman error generik)
- Pakai warna, font, dan komponen brand
- Elemen: ilustrasi atau ikon besar, teks "Kamu tidak punya akses ke area ini", tombol kembali ke halaman utama
- Kode HTTP: return status 403

---

## Catatan Keamanan

- `BOT_TOKEN` dan `AUTH_SECRET` **tidak boleh** di-expose ke client-side
- Pengecekan role harus terjadi di server (callback `signIn` atau middleware)
- Jangan percaya role yang dikirim dari client

---

## Output yang Diharapkan

- Klik "Login dengan Discord" → redirect ke Discord → balik ke app
- User dengan role admin → masuk ke `/admin`
- User tanpa role admin → diarahkan ke `/forbidden` dengan tampilan branded
- Akses langsung ke `/admin` tanpa login → redirect ke `/login`
- Data user tersimpan di tabel `User` di database
