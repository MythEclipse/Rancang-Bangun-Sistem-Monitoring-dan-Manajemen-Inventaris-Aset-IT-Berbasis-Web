# Skrip Video (Narasi) 🎙️

Durasi target: 3–5 menit

---

0:00–0:15 — Pembukaan
"Halo, selamat datang. Pada video ini saya akan memperkenalkan proyek 'Rancang Bangun Sistem Monitoring dan Manajemen Inventaris Aset IT Berbasis Web'."

0:15–0:35 — Masalah & Tujuan
"Masalah yang ingin diselesaikan adalah kurangnya centralisasi data aset dan proses maintenance yang tidak terdokumentasi. Tujuan kami adalah menyediakan sistem web untuk mencatat, memantau, dan mengelola aset IT dengan lebih efisien."

0:35–1:20 — Teknologi & Arsitektur
"Backend menggunakan Node.js, TypeScript, dan Drizzle ORM. Frontend dibuat dengan React dan Vite, menggunakan TailwindCSS untuk gaya. Sistem dijalankan menggunakan Docker dan docker-compose untuk memudahkan deploy. Otentikasi menggunakan JWT dan terdapat middleware RBAC untuk kontrol akses."

1:20–2:10 — Demo Fitur Utama (arahkan kamera/tangkapan layar)
- "Pertama, login sebagai admin." (tampilkan form login)
- "Di dashboard, tampil ringkasan jumlah aset, permintaan maintenance, dan lokasi." (tampilkan grafik/summary)
- "Masuk ke modul Assets: menambah, mengedit, dan menghapus aset." (tunjukkan form CRUD)
- "Modul Maintenance: membuat permintaan perbaikan dan melihat histori." (tunjukkan alur request)

2:10–2:40 — Struktur Proyek & Penjelasan Kode
"Struktur proyek dibagi menjadi `frontend` dan `backend`. Semua route API ada di `backend/src/routes/`. Skema database dan seed data ada di `backend/drizzle/` dan `backend/src/seed.ts`."

2:40–3:00 — Cara Menjalankan & Penutup
"Untuk menjalankan, salin environment yang diperlukan dan jalankan `docker-compose up --build`. Untuk detail lebih lanjut, lihat file README dan dokumentasi di folder `docs/`.
Terima kasih telah menonton. Jika ada pertanyaan atau ingin demo fitur tambahan, hubungi kami." 

---

Catatan untuk pembaca skrip:
- Bacakan dengan nada jelas dan tempo stabil
- Beri jeda sebentar sebelum dan setelah demo visual
- Sesuaikan durasi tiap bagian sesuai kebutuhan video akhir
