# 📚 Folio Toko Buku — Node.js + Vercel

## Struktur Project

```
folio-nodejs/
├── api/
│   └── index.js        ← Express server (API)
├── public/
│   └── index.html      ← Frontend UI
├── lib/
│   └── db.js           ← Koneksi database PostgreSQL
├── package.json
├── vercel.json         ← Konfigurasi deploy Vercel
├── .env.example        ← Template environment variable
└── .gitignore
```

---

## 🚀 PANDUAN DEPLOY KE VERCEL (Step by Step)

### LANGKAH 1 — Buat Database Gratis di Neon.tech

1. Buka https://neon.tech → klik **"Sign Up"** (gratis)
2. Login dengan GitHub
3. Klik **"New Project"** → beri nama `tokobuku`
4. Pilih region terdekat (Singapore)
5. Setelah dibuat, klik **"Connection string"**
6. Pilih format **"Node.js"** → copy string seperti ini:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
7. **Simpan string ini** — akan dipakai di Langkah 3

> ✅ Database PostgreSQL gratis, 0.5 GB storage, tidak perlu kartu kredit

---

### LANGKAH 2 — Upload ke GitHub

1. Buat akun di https://github.com (kalau belum punya)
2. Klik **"New repository"** → nama: `folio-tokobuku`
3. Centang **"Public"** → klik **"Create repository"**
4. Upload semua file project ini:
   - Klik **"uploading an existing file"**
   - Drag & drop semua file dari folder `folio-nodejs/`
   - Klik **"Commit changes"**

> ⚠️ Jangan upload file `.env` (sudah ada di .gitignore)

---

### LANGKAH 3 — Deploy ke Vercel

1. Buka https://vercel.com → klik **"Sign Up"**
2. Login dengan **GitHub** (pilih "Continue with GitHub")
3. Klik **"Add New Project"**
4. Pilih repository `folio-tokobuku` → klik **"Import"**
5. Di bagian **"Environment Variables"**, tambahkan:
   - **Key:** `DATABASE_URL`
   - **Value:** (paste connection string dari Neon.tech)
6. Klik **"Deploy"** → tunggu 1-2 menit

🎉 **Website kamu online!** Vercel memberi URL seperti:
`https://folio-tokobuku.vercel.app`

---

### LANGKAH 4 — Cek Apakah Berhasil

Setelah deploy selesai:
- Buka URL yang diberikan Vercel
- Halaman toko buku muncul dengan 5 data contoh
- Coba tambah, edit, hapus buku

---

## 💻 Menjalankan di Lokal (Opsional)

```bash
# 1. Install dependencies
npm install

# 2. Salin file .env
cp .env.example .env
# Edit .env → isi DATABASE_URL dengan connection string Neon

# 3. Jalankan server
npm run dev

# 4. Buka browser
# http://localhost:3000
```

---

## API Endpoints

| Method | URL              | Fungsi           |
|--------|------------------|------------------|
| GET    | `/api/buku`      | List semua buku  |
| GET    | `/api/buku/:id`  | Detail satu buku |
| POST   | `/api/buku`      | Tambah buku      |
| PUT    | `/api/buku/:id`  | Update buku      |
| DELETE | `/api/buku/:id`  | Hapus buku       |

Query params untuk GET list:
- `?search=judul` — cari berdasarkan judul/penulis
- `?genre=Novel` — filter berdasarkan genre

---

## Stack Teknologi

| Komponen   | Teknologi                    |
|------------|------------------------------|
| Backend    | Node.js + Express            |
| Database   | PostgreSQL (Neon.tech gratis)|
| Frontend   | HTML + CSS + Vanilla JS      |
| Deploy     | Vercel (gratis)              |
| Repo       | GitHub                       |
