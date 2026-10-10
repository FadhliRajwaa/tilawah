<div align="center">

# Tilawah

**Al-Qur'an digital lengkap — 114 surat, 30 juz, 6 qari, tafsir Kemenag, dan jadwal sholat.**

[**🌐 Buka tilawahsurah.my.id →**](https://www.tilawahsurah.my.id)

Dibuat untuk memudahkan tilawah harian. Mengikuti **Mushaf Standar Indonesia** (Kemenag/LPMQ),
bukan Mushaf Madinah — sama dengan mushaf yang dicetak dan dipakai di masjid serta pesantren Indonesia.

[![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## Fitur

| | Fitur | Keterangan |
|---|---|---|
| 📖 | **114 surat lengkap** | Teks Arab + transliterasi latin + terjemahan Kemenag RI |
| 🗂 | **30 juz** | Mengikuti Mushaf Standar Indonesia, dengan penanda lanjutan surah |
| 🎧 | **Murottal 6 qari** | Abdullah Al-Juhany, Al-Qasim, As-Sudais, Al-Dossari, Al-Afasi, Yasser |
| 🔄 | **Ganti qari real-time** | Ganti saat memutar → otomatis mengulang ayat yang sama dengan qari baru |
| 🎵 | **Waveform per ayat** | Pemutar bergaya pesan suara, tersambung ke pemutar global |
| 📚 | **Tafsir Kemenag** | Modal tafsir per ayat |
| 🕌 | **Jadwal sholat** | 518 kota di Indonesia + hitung mundur + tabel bulanan |
| ✨ | **Asmaul Husna & doa** | 99 nama Allah + 40+ doa harian |
| 🔍 | **Pencarian terjemahan** | Dengan penyorotan kata |
| 🔖 | **Bookmark & riwayat** | Disimpan di perangkat, tanpa akun |
| 🌗 | **Mode terang/gelap** | Kontras lolos WCAG AA di kedua mode |
| 📱 | **Responsif penuh** | Terverifikasi di 320px sampai 1280px |

## Cara pakai

Buka halaman surat, pilih **mode baca** (per ayat atau mushaf kontinu), atur ukuran teks Arab,
lalu tekan putar. Pilih qari dari panel sebelum atau saat memutar — bisa diganti kapan saja.

Untuk membaca bertahap, buka **Juz** dan pilih kelompok juz. Setiap juz bisa ditandai selesai,
dan progresnya muncul di halaman indeks.

## Menjalankan sendiri

```bash
git clone https://github.com/FadhliRajwaa/tilawah.git
cd tilawah
npm install
npm run dev      # http://localhost:3000
```

Build produksi:

```bash
npm run build
npm run start
```

Butuh **Node.js 20+**. Tidak ada database, tidak ada akun, tidak ada environment variable —
semua data diambil dari API publik lalu di-cache oleh Next.js.

## Sumber data

Terima kasih kepada penyedia layanan gratis berikut:

| Sumber | Dipakai untuk | Cache |
|---|---|---|
| [equran.id](https://equran.id) | Teks Arab, terjemahan & tafsir Kemenag, audio 6 qari | 24 jam |
| [Islamic API](https://islamic-api-zhirrr.vercel.app) | Asmaul Husna 99, doa harian | 7 hari |
| [myquran.com](https://api.myquran.com) | Jadwal sholat 518 kota | 1 jam |
| [alquran.cloud](https://alquran.cloud) | Pencarian terjemahan | 24 jam |

**Gambar** — 42 aset dari Wikimedia Commons (lisensi CC BY / CC BY-SA / domain publik).
Atribusi lengkap per gambar ada di halaman [`/kredit`](https://www.tilawahsurah.my.id/kredit).

**Font** — Fraunces (SIL OFL) · Switzer (Fontshare) · LPMQ Isep Misbah (Kemenag RI).

## ⚠️ Catatan pembagian juz

Ada **dua mushaf standar** dengan batas juz yang sedikit berbeda:

| | Mushaf Standar Indonesia | Mushaf Madinah |
|---|---|---|
| Juz 6 | An-Nisa' 148 – **Al-Ma'idah 82** | An-Nisa' 148 – **Al-Ma'idah 81** |
| Juz 7 | **Al-Ma'idah 83** – Al-An'am 110 | **Al-Ma'idah 82** – Al-An'am 110 |

Hampir semua API publik memakai **Mushaf Madinah**. Proyek ini memakai **Mushaf Standar Indonesia**
sesuai acuan Kemenag/LPMQ, karena itulah yang dipakai di Indonesia.

Karena itu batas juz disimpan sebagai tabel statis di [`lib/juz-batas.ts`](lib/juz-batas.ts) —
teks ayatnya tetap diambil dari equran.id lalu diiris sesuai tabel tersebut.
Terverifikasi: **6.236 ayat, 0 celah, 0 duplikat**, juz 1 mulai `1:1`, juz 30 berakhir `114:6`.

## Arsitektur

```
app/
├─ page.tsx                 beranda
├─ surat/                   114 halaman surat (SSG + ISR 24 jam)
├─ juz/                     30 halaman juz  (SSG + ISR 24 jam)
├─ ibadah/                  asmaul husna · doa · jadwal sholat
├─ cari/  bookmark/  kredit/
└─ api/                     5 route handler sebagai proxy ber-cache

components/
├─ quran/                   reader surat & juz, kartu ayat, indeks folder juz
├─ player/                  pemutar global, pemilih qari, waveform per ayat
├─ ui/                      komponen rare-ui (Folder, VoiceNote, Fluid Orb)
└─ orb.tsx  ambient-image.tsx  ornaments.tsx

lib/
├─ api/                     klien equran.id, juz, asmaul husna, doa, sholat, pencarian
├─ store/                   preferensi, bookmark, progres juz (localStorage)
├─ data/credits.ts          atribusi gambar (di-import sebagai modul)
├─ juz-batas.ts             tabel 30 juz Mushaf Standar Indonesia
└─ types.ts
```

**Keputusan penting:**

- **Audio tidak lewat server.** CDN equran.id tidak mengirim header CORS, jadi audio dimuat
  langsung lewat elemen `<audio>`. Konsekuensinya: streaming tidak membebani hosting sama sekali.
- **Satu elemen `<audio>` untuk seluruh aplikasi.** `PlayerProvider` hidup di root layout
  (bukan `template.tsx`, yang di-key ulang tiap navigasi). Posisi pemutaran ditulis ke DOM
  lewat ref — bukan React state — agar tidak memicu re-render 4×/detik.
- **Deep-link `?ayat=N` dibaca di klien.** Kalau dibaca di server, halaman surat jadi dinamis
  dan kehilangan SSG. Ini yang menjaga 114 halaman tetap ter-prerender.
- **Gambar pakai `<picture>` + srcSet manual**, bukan `next/image` — karena dipakai sebagai
  latar bertekstur, bukan elemen tajam. `sizes` diatur agar ponsel mengambil varian kecil.

## Kontribusi

Menemukan **kesalahan teks Al-Qur'an atau terjemahan**? Mohon laporkan — ini konten suci,
akurasi jauh lebih penting daripada fitur apa pun. Sertakan nomor surat dan ayat.

Untuk hal lain, silakan buka issue atau kirim pull request.

## Lisensi

Kode proyek ini terbuka untuk dipelajari dan dipakai.

**Perhatian:** teks Al-Qur'an, terjemahan, dan tafsir berasal dari Kementerian Agama RI;
audio murottal dari CDN equran.id; gambar dari Wikimedia Commons dengan lisensi masing-masing
(lihat `/kredit`). Lisensi kode di repo ini **tidak** berlaku untuk aset-aset tersebut.

<div align="center">

---

**Konten suci — mohon laporkan kekeliruan teks.**

Dibuat untuk memudahkan tilawah harian.

</div>
