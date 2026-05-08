const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS buku (
        id SERIAL PRIMARY KEY,
        judul VARCHAR(255) NOT NULL,
        penulis VARCHAR(150) NOT NULL,
        penerbit VARCHAR(150) NOT NULL,
        tahun_terbit INTEGER NOT NULL,
        genre VARCHAR(100) NOT NULL,
        harga NUMERIC(12,2) NOT NULL,
        stok INTEGER NOT NULL DEFAULT 0,
        deskripsi TEXT,
        cover VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Cek apakah sudah ada data
    const { rows } = await client.query('SELECT COUNT(*) FROM buku');
    if (parseInt(rows[0].count) === 0) {
      await client.query(`
        INSERT INTO buku (judul, penulis, penerbit, tahun_terbit, genre, harga, stok, deskripsi) VALUES
        ('Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, 'Novel', 85000, 50, 'Kisah inspiratif tentang sepuluh anak Belitung yang berjuang meraih mimpi meski hidup dalam keterbatasan.'),
        ('Bumi Manusia', 'Pramoedya Ananta Toer', 'Lentera Dipantara', 1980, 'Sejarah', 110000, 30, 'Novel sejarah yang mengisahkan kehidupan Minke, seorang pribumi terpelajar di era kolonial Belanda.'),
        ('Atomic Habits', 'James Clear', 'Gramedia', 2019, 'Self-Help', 130000, 75, 'Panduan revolusioner untuk membangun kebiasaan baik dan menghancurkan kebiasaan buruk.'),
        ('Dilan 1990', 'Pidi Baiq', 'Pastel Books', 2014, 'Romance', 72000, 40, 'Kisah cinta remaja di Bandung tahun 1990 yang melegenda.'),
        ('Filosofi Teras', 'Henry Manampiring', 'Kompas', 2018, 'Filsafat', 98000, 60, 'Penerapan filsafat Stoa dalam kehidupan modern Indonesia.');
      `);
      console.log('✅ Data contoh berhasil dimasukkan');
    }

    console.log('✅ Database siap');
  } finally {
    client.release();
  }
}

module.exports = { pool, initDB };
