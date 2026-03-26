const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const path = require('node:path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(
  path.join(__dirname, 'public')
));

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

app.get('/api/todos', async (req, res) => {
    try {
        const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({
        success: true,
        data: data,
        total: data.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('id', id)
        .single();

        if (error) throw error;

        if (!data) {
        return res.status(404).json({ success: false, message: 'Todo tidak ditemukan' });
        }

        res.status(200).json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/todos', async (req, res) => {
    try {
        const { title, description, priority, status } = req.body;

        if (!title || title.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Field title wajib diisi!'
        });
        }

        const { data, error } = await supabase
        .from('todos')
        .insert([{
            title: title.trim(),
            description: description || null,
            priority: priority || 'medium',
            status: status || 'pending'
        }])
        .select()
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
        .update({
            title: title.trim(),
            description: description || null,
            priority: priority || 'medium',
            status: status || 'pending'
        })
        .eq('id', id)
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

app.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

        if (error) throw error;

        res.status(200).json({
        success: true,
        message: 'Todo berhasil dihapus!'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
    console.log(`📋 API Todos: http://localhost:${PORT}/api/todos`);
});
