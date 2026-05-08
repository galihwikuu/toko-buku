const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { pool, initDB } = require('../lib/db');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files dari folder public
app.use(express.static(path.join(__dirname, '../public')));

// ── Init DB saat server start ──
initDB().catch(console.error);

// ════════════════════════════════
//  API ROUTES
// ════════════════════════════════

// GET /api/buku — List semua buku (dengan search & filter)
app.get('/api/buku', async (req, res) => {
  try {
    const { search, genre } = req.query;
    let query = 'SELECT * FROM buku WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (judul ILIKE $${params.length} OR penulis ILIKE $${params.length})`;
    }
    if (genre) {
      params.push(genre);
      query += ` AND genre = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const { rows } = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data buku' });
  }
});

// GET /api/buku/:id — Detail satu buku
app.get('/api/buku/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM buku WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Buku tidak ditemukan' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil detail buku' });
  }
});

// POST /api/buku — Tambah buku baru
app.post('/api/buku', async (req, res) => {
  try {
    const { judul, penulis, penerbit, tahun_terbit, genre, harga, stok, deskripsi, cover } = req.body;

    if (!judul || !penulis || !penerbit || !tahun_terbit || !genre || !harga) {
      return res.status(400).json({ error: 'Field wajib belum lengkap' });
    }

    const { rows } = await pool.query(
      `INSERT INTO buku (judul, penulis, penerbit, tahun_terbit, genre, harga, stok, deskripsi, cover)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [judul, penulis, penerbit, tahun_terbit, genre, harga, stok || 0, deskripsi || '', cover || '']
    );

    res.status(201).json({ success: true, data: rows[0], message: 'Buku berhasil ditambahkan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menambahkan buku' });
  }
});

// PUT /api/buku/:id — Update buku
app.put('/api/buku/:id', async (req, res) => {
  try {
    const { judul, penulis, penerbit, tahun_terbit, genre, harga, stok, deskripsi, cover } = req.body;

    const { rows } = await pool.query(
      `UPDATE buku SET
        judul=$1, penulis=$2, penerbit=$3, tahun_terbit=$4,
        genre=$5, harga=$6, stok=$7, deskripsi=$8, cover=$9,
        updated_at=NOW()
       WHERE id=$10 RETURNING *`,
      [judul, penulis, penerbit, tahun_terbit, genre, harga, stok, deskripsi || '', cover || '', req.params.id]
    );

    if (!rows[0]) return res.status(404).json({ error: 'Buku tidak ditemukan' });
    res.json({ success: true, data: rows[0], message: 'Buku berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui buku' });
  }
});

// DELETE /api/buku/:id — Hapus buku
app.delete('/api/buku/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM buku WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Buku tidak ditemukan' });
    res.json({ success: true, message: 'Buku berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus buku' });
  }
});

// Fallback — arahkan ke index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ── Start server (lokal) ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;
