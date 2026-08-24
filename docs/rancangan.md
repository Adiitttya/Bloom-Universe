di project kali ini saya ingin membuat sebuah website untuk komunitas saya bernama "Blooom Universe" dengan singkatan "Bloomun". web ini adalah web official kedepannya dan semua ada di sini, semisal web utama, web store, web photobooth, web social media (bloom version), dashboard bot, dll.
nah maka dari itu sebelum saya memulai melakukan pengerjaan saya ingin semua versi yang saya pakai, seperti frame work, dll sudah paling optimal. saya juga membutuhkan planning.md untuk membantu agent saya kedepannya agar memahami project saya.
saya ingin project ini rapi, terstruktur, dan mudah di maintenance. penamaan files, folder, variabel, function, dll juga harus konsisten dan profesional. based practice dan aman, tidak ada celah untuk di retas dengan mudah. dan saya tidak ingin hardcode dan juga 1 file berisi ribuan baris code, itu suloit di maintenance, saya ingin kode yang efisien dan mudah dibaca. saya ingin semua memiliki sumber dan bisa di gunakan kapan saja, misal ada file data atau element atau ui, dan di web saya membuuhkan file sumber tersebut, maka tinggal ambil dari sana, atau misalkan root di global.css contohnya, seperti warna, dll. jadi tinggal masuk ke sana. untuk masalah tampilan ui, saya ingin mengikuti gaya gaya playfull, tidak menggunakan emoji namun guanakn icon, jangan terlalu banyak animasi yang mengganggu, jangan terlalu banyak gradasi warna yang berlebihan, intinya jangan terlihat website ai slop. nanti untuk kedepannya semisal saya memiliki beberapa halam web seperti photobooth atau web minecraft server bloomun, dll tinggal url/photobooth atau url/minecraft
saya ingin kedepannya web ini bisa di scale dengan mudah.

oke, sekarang di landingpage urtama web saya ingin menambahkan fitur bahasa, pada navbar saya ingin ada pilihan bahasa seperti en / id, en untuk englis lang, dan id untuk bahasa indonesia. tersingkron, baik web utama, login page, socil anntinya (kecuali admin). jadi semua text akan berubah bahsanya (kecuali text yang memang tidak harus di translate seperti photobooth, dll) untuk translate tidak serta merta translate bahasa, namun tetap di copywrite dengan profesional agar nanti bahasnaya tidak kaku dan aneh.

update translate ini hanya mengedit bagian text, tidak mengubah element dll.

Listed directory web-bloom
Listed directory %28admin%29
Listed directory docs
Listed directory admin
Listed directory prisma
Listed directory schema
Viewed info.md:1-67
Viewed user.prisma:1-113
Viewed subweb.prisma:1-17

Sudah cukup konteks. Sekarang saya buat dokumennya.

Ran command: `New-Item -ItemType File -Path "c:\Users\Aditya\OneDrive\Dokumen\Project\web-bloom\docs\14-multi-feature-ecosystem.md" -Force | Out-Null; Write-Host "Created"`
Edited 14-multi-feature-ecosystem.md

Dokumen sudah dibuat di [`docs/14-multi-feature-ecosystem.md`](file:///c:/Users/Aditya/OneDrive/Dokumen/Project/web-bloom/docs/14-multi-feature-ecosystem.md).

Berikut ringkasan isi dokumen yang dibuat:

| Section                         | Isi                                                                        |
| ------------------------------- | -------------------------------------------------------------------------- |
| **1. Konsep & Visi**            | Penjelasan bahwa Bloomun jadi super app terpadu, tabel roadmap fitur       |
| **2. Arsitektur**               | Feature-Based Modular — prinsip isolasi dan aturan utama                   |
| **3. Struktur Folder**          | Perbandingan before/after, folder `src/features/` baru                     |
| **4. Pola Implementasi**        | Step-by-step template untuk setiap fitur baru (DB → Feature → App → Admin) |
| **5. Konvensi Database**        | Prefix model Prisma per fitur, model shared yang tidak perlu diduplikat    |
| **6. Auth & Role**              | Tidak ada perubahan, cara pakai `guildRoles` jika perlu kontrol lebih      |
| **7. Admin Dashboard**          | Cara memperluas sidebar tanpa mengganggu yang sudah ada                    |
| **8. Env Variables**            | Satu `.env.local`, diberi komentar per fitur                               |
| **9. Urutan Pengerjaan**        | Checklist 7 langkah untuk tiap fitur baru                                  |
| **10–11. Larangan & Checklist** | Hal yang dilarang + checklist final per fitur                              |

Dokumen ini sudah cukup untuk dipegang programmer lain atau AI model yang lebih murah untuk langsung mulai implement fitur baru tanpa perlu tanya-tanya soal arsitektur dasar.
