# Step 10 — Dokumentasi Final

## Tujuan

Memperbarui dokumentasi project agar semua orang (termasuk AI agent) bisa langsung paham konteks dan cara berkontribusi.

---

## Tugas

### 1. Update `README.md`

Isi dengan informasi proyek yang relevan:

- Deskripsi singkat Bloom Universe
- Tech stack yang digunakan
- Cara menjalankan project (setup, env, dev)
- Cara menjalankan database migration
- Link ke `docs/planning.md` untuk konteks lebih dalam

### 2. Update `docs/planning.md`

Pastikan file ini selalu terkini sebagai referensi utama untuk agent/programmer:

- Tandai step mana yang sudah selesai
- Update jika ada perubahan arsitektur

### 3. Update `CLAUDE.md` (atau file agent context)

File ini dibaca oleh AI agent di awal setiap sesi. Isi dengan:

- Ringkasan proyek
- Link ke `docs/planning.md`
- Prinsip coding yang wajib diikuti (tidak hardcode, modular, dll)
- Peringatan hal-hal yang tidak boleh dilakukan

---

## Output yang Diharapkan

- `README.md` bisa dipahami siapapun yang baru join project
- `docs/planning.md` akurat mencerminkan kondisi project terkini
- Agent AI yang baru masuk ke project langsung paham konteks dari file-file docs
