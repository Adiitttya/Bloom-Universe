# Step 3 — Design System

## Tujuan

Membangun sistem desain terpusat sebagai "sumber tunggal kebenaran" untuk semua tampilan.
Semua warna, font, spacing, dan komponen UI dasar didefinisikan di sini.

---

## Brand Reference

Lihat logo di `/public/Bloom.jpg` untuk referensi visual.

- **Style**: Playful, bubbly, cartoonish — bukan minimalis, bukan corporate
- **Font heading**: Fredoka (Google Fonts)
- **Font body**: Nunito (Google Fonts)
- **Warna**: Biru langit (primer), Kuning cerah (accent), Ungu lavender (sekunder)

---

## Tugas

### 1. Update `src/app/globals.css`

Definisikan CSS custom properties (design tokens) di `:root`:

- **Warna**: `--color-primary`, `--color-accent`, `--color-secondary`, neutrals, semantic colors (bg, surface, border, text, text-muted)
- **Dark mode**: override token yang sama di `[data-theme="dark"]` atau `@media (prefers-color-scheme: dark)`
- **Tipografi**: font size scale
- **Border radius**: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`
- **Shadow**: `--shadow-sm`, `--shadow-md`, `--shadow-card`
- **Transition**: `--transition-fast`, `--transition-base`
- **Base body style**: font-family, background, color — ambil dari token

### 2. Update `src/app/layout.tsx`

- Load font Fredoka dan Nunito dari `next/font/google`
- Set sebagai CSS variable
- Update metadata: judul "Bloom Universe", deskripsi komunitas
- Set `lang="id"` (bahasa Indonesia)

### 3. Buat Komponen UI Dasar di `src/components/ui/`

Buat file terpisah untuk masing-masing komponen:

| File           | Komponen                               | Deskripsi                                                    |
| -------------- | -------------------------------------- | ------------------------------------------------------------ |
| `Button.tsx`   | `<Button>`                             | Varian: primary, secondary, ghost, outline. Size: sm, md, lg |
| `Card.tsx`     | `<Card>`, `<CardHeader>`, `<CardBody>` | Container dengan shadow dan border-radius                    |
| `Badge.tsx`    | `<Badge>`                              | Label kecil dengan warna varian                              |
| `Input.tsx`    | `<Input>`                              | Text input styled                                            |
| `Textarea.tsx` | `<Textarea>`                           | Textarea styled                                              |
| `Spinner.tsx`  | `<Spinner>`                            | Loading indicator                                            |

**Catatan komponen**:

- Semua komponen harus accept `className` prop untuk override
- Gunakan `cn()` dari `lib/utils.ts` untuk class merging
- Tidak ada inline style — semua pakai Tailwind + design tokens

---

## Output yang Diharapkan

- `globals.css` berisi semua token, dark mode bekerja
- Font Fredoka + Nunito tampil di browser
- Semua komponen UI bisa di-import dan digunakan
- Tampilan terasa "on-brand" — bubbly, rounded, colorful tapi clean
