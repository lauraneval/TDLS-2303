// ═══════════════════════════════════════════════════════════
// main.js — Script jQuery untuk halaman Data (data.html)
// Handles: Read (DataTables), Edit redirect, Delete (AJAX)
// ═══════════════════════════════════════════════════════════

const API_URL = 'http://localhost:3000/api';
let dataTable;  // Variabel global untuk menyimpan instance DataTable

$(document).ready(function () {

    // ── INISIALISASI DATATABLES ───────────────────────────
    // DataTables akan fetch data JSON dari API dan merender tabel
    dataTable = $('#todosTable').DataTable({

        // Konfigurasi sumber data: ambil JSON dari API backend
        ajax: {
        url: API_URL + '/todos',
        dataSrc: 'data',   // Data ada di properti 'data' dalam JSON response
        error: function () {
            showAlert('danger', 'Gagal memuat data dari server. Pastikan backend berjalan!');
        }
        },

        // Konfigurasi kolom — mapping dari properti JSON ke kolom tabel
        columns: [
        {
            // Kolom No: urutan nomor baris
            render: (data, type, row, meta) => meta.row + 1
        },
        { data: 'title' },          // Kolom Judul
        {
            data: 'description',      // Kolom Deskripsi
            render: (data) => data ? data : '<em class="text-muted">-</em>'
        },
        {
            data: 'priority',         // Kolom Prioritas dengan badge warna
            render: (data) => {
            const map = {
                low:    '<span class="badge bg-success">Rendah</span>',
                medium: '<span class="badge bg-warning text-dark">Sedang</span>',
                high:   '<span class="badge bg-danger">Tinggi</span>'
            };
            return map[data] || data;
            }
        },
        {
            data: 'status',           // Kolom Status dengan badge warna
            render: (data) => {
            const map = {
                'pending':     '<span class="badge bg-secondary">Pending</span>',
                'in-progress': '<span class="badge bg-primary">In Progress</span>',
                'done':        '<span class="badge bg-success">Done</span>'
            };
            return map[data] || data;
            }
        },
        {
            data: 'created_at',       // Kolom Tanggal — format ke locale Indonesia
            render: (data) => new Date(data).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
            })
        },
        {
            data: 'id',               // Kolom Aksi — tombol Edit dan Delete
            orderable: false,         // Kolom ini tidak bisa di-sort
            className: 'text-center',
            render: (id) => `
            <button class='btn btn-sm btn-warning me-1 btn-edit' data-id='${id}'>
                <i class='bi bi-pencil'></i> Edit
            </button>
            <button class='btn btn-sm btn-danger btn-delete' data-id='${id}'>
                <i class='bi bi-trash'></i> Hapus
            </button>
            `
        }
        ],

        // Konfigurasi tampilan DataTables
        language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/id.json'
        },
        pageLength: 10,
        responsive: true,
    });


    // ── EVENT: Klik Tombol EDIT ───────────────────────────
    // Karena tombol dibuat dinamis oleh DataTables, gunakan event delegation
    $('#todosTable').on('click', '.btn-edit', function () {
        const id = $(this).data('id');
        // Redirect ke halaman form dengan parameter ID
        window.location.href = 'form.html?id=' + id;
    });

    // ── EVENT: Klik Tombol DELETE ─────────────────────────
    $('#todosTable').on('click', '.btn-delete', function () {
        const id = $(this).data('id');
        const row = $(this).closest('tr');

        // Tampilkan dialog konfirmasi menggunakan SweetAlert2
        Swal.fire({
        title: 'Yakin ingin menghapus?',
        text: 'Data yang dihapus tidak bisa dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
        }).then((result) => {
        if (result.isConfirmed) {
            // Kirim DELETE request ke API
            $.ajax({
            url: API_URL + '/todos/' + id,
            method: 'DELETE',
            success: function (response) {
                if (response.success) {
                // Hapus baris dari DataTable tanpa reload halaman
                dataTable.row(row).remove().draw();
                Swal.fire('Terhapus!', response.message, 'success');
                }
            },
            error: function () {
                Swal.fire('Error!', 'Gagal menghapus data.', 'error');
            }
            });
        }
        });
    });

});  // end $(document).ready

// Tampilkan alert Bootstrap
function showAlert(type, message) {
    const alert = `
        <div class='alert alert-${type} alert-dismissible fade show'>
        ${message}
        <button type='button' class='btn-close' data-bs-dismiss='alert'></button>
        </div>`;
    $('#alertContainer').html(alert);
}
