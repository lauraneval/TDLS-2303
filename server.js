// ═══════════════════════════════════════════════════════════
// server.js — Backend Node.js untuk Aplikasi To-Do List
// ═══════════════════════════════════════════════════════════

// 1. Import semua library yang dibutuhkan
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const path = require('node:path');
require('dotenv').config();       // Muat variabel dari file .env

// 2. Inisialisasi Express app
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Konfigurasi Middleware
app.use(cors());                  // Izinkan cross-origin request
app.use(express.json());          // Parse request body sebagai JSON
app.use(express.static(          // Sajikan file frontend dari folder public/
  path.join(__dirname, 'public')
));

// 4. Inisialisasi Supabase Client
//    Menggunakan variabel dari file .env — JANGAN hardcode di sini!
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);


// ─────────────────────────────────────────────────────────
// ROUTING API — CRUD Operations
// ─────────────────────────────────────────────────────────

// ── READ: GET /api/todos ──────────────────────────────────
// Mengambil SEMUA data dari tabel todos, diurutkan terbaru dulu
app.get('/api/todos', async (req, res) => {
    try {
        const { data, error } = await supabase
        .from('todos')
        .select('*')                // Ambil semua kolom
        .order('created_at', { ascending: false });  // Urutkan terbaru

        if (error) throw error;       // Lempar error jika ada

        // Kirim data sebagai JSON ke frontend
        res.status(200).json({
        success: true,
        data: data,
        total: data.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// ── READ ONE: GET /api/todos/:id ─────────────────────────
// Mengambil SATU todo berdasarkan ID — digunakan saat Edit
app.get('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;    // Ambil ID dari URL parameter

        const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('id', id)               // Filter WHERE id = :id
        .single();                  // Ambil hanya 1 baris

        if (error) throw error;

        if (!data) {
        return res.status(404).json({ success: false, message: 'Todo tidak ditemukan' });
        }

        res.status(200).json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// ── CREATE: POST /api/todos ──────────────────────────────
// Menambah todo BARU ke database
app.post('/api/todos', async (req, res) => {
    try {
        // Destructure data dari request body
        const { title, description, priority, status } = req.body;

        // Validasi: field title wajib diisi
        if (!title || title.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Field title wajib diisi!'
        });
        }

        // Insert data baru ke Supabase
        const { data, error } = await supabase
        .from('todos')
        .insert([{
            title: title.trim(),
            description: description || null,
            priority: priority || 'medium',
            status: status || 'pending'
        }])
        .select()                   // Return data yang baru diinsert
        .single();

        if (error) throw error;

        res.status(201).json({
        success: true,
        message: 'Todo berhasil ditambahkan!',
        data: data
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// ── UPDATE: PUT /api/todos/:id ───────────────────────────
// Mengupdate todo yang sudah ada berdasarkan ID
app.put('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status } = req.body;

        if (!title || title.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Field title wajib diisi!'
        });
        }

        const { data, error } = await supabase
        .from('todos')
        .update({                   // Data yang akan diupdate
            title: title.trim(),
            description: description || null,
            priority: priority || 'medium',
            status: status || 'pending'
        })
        .eq('id', id)               // WHERE id = :id
        .select()
        .single();

        if (error) throw error;

        res.status(200).json({
        success: true,
        message: 'Todo berhasil diupdate!',
        data: data
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// ── DELETE: DELETE /api/todos/:id ────────────────────────
// Menghapus todo berdasarkan ID
app.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
        .from('todos')
        .delete()                   // Perintah DELETE
        .eq('id', id);              // WHERE id = :id

        if (error) throw error;

        res.status(200).json({
        success: true,
        message: 'Todo berhasil dihapus!'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─────────────────────────────────────────────────────────
// Jalankan Server
// ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
    console.log(`📋 API Todos: http://localhost:${PORT}/api/todos`);
});
