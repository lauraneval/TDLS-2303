// ═══════════════════════════════════════════════════════════
// form.js — Script jQuery untuk halaman Form Input
// Handles: Create (POST) dan Update (PUT) via AJAX
// ═══════════════════════════════════════════════════════════

// Base URL API Backend — ganti saat sudah deploy!
const API_URL = 'http://localhost:3000/api';

$(document).ready(function () {

  // ── CEK MODE: Apakah halaman dibuka dalam mode Edit? ──
  // Jika URL ada parameter ?id=xxx, berarti mode Edit
    const urlParams = new URLSearchParams(globalThis.location.search);
    const editId = urlParams.get('id');

    if (editId) {
    // MODE EDIT: Ubah tampilan form
        $('#formTitle').text('Edit Todo');
        $('#submitBtn').html('<i class="bi bi-save me-2"></i>Update Todo');
        $('#todoId').val(editId);

    // Ambil data todo dari API dan isi ke form
        $.ajax({
        url: API_URL + '/todos/' + editId,
        method: 'GET',
        success: function (response) {
            if (response.success) {
            const todo = response.data;
            // Isi setiap field form dengan data dari API
            $('#title').val(todo.title);
            $('#description').val(todo.description);
            $('#priority').val(todo.priority);
            $('#status').val(todo.status);
            }
        },
        error: function () {
            showAlert('danger', 'Gagal memuat data. Cek koneksi ke server.');
        }
        });
    }


  // ── EVENT: Submit Form ────────────────────────────────
  // Intercept submit event, cegah reload, kirim via AJAX
    $('#todoForm').on('submit', function (e) {
        e.preventDefault();  // Cegah perilaku default (reload halaman)

        // Kumpulkan semua data dari form
        const formData = {
            title:       $('#title').val().trim(),
            description: $('#description').val().trim(),
            priority:    $('#priority').val(),
            status:      $('#status').val()
        };

        const currentId = $('#todoId').val();
        // Tentukan method dan URL berdasarkan mode (Create/Edit)
        const isEdit   = currentId !== '';
        const method   = isEdit ? 'PUT' : 'POST';
        const url      = isEdit
                        ? API_URL + '/todos/' + currentId
                        : API_URL + '/todos';

        // Disable tombol submit saat request berlangsung
        $('#submitBtn').prop('disabled', true).text('Menyimpan...');

        // Kirim request AJAX ke backend
        $.ajax({
        url:         url,
        method:      method,
        contentType: 'application/json',
        data:        JSON.stringify(formData),  // Ubah object jadi string JSON
        success: function (response) {
            if (response.success) {
            const msg = isEdit ? 'Todo berhasil diupdate!' : 'Todo berhasil ditambahkan!';
            showAlert('success', msg);
            // Reset form setelah berhasil
            if (!isEdit) { resetForm(); }
            // Redirect ke halaman data setelah 1.5 detik
            setTimeout(() => { window.location.href = 'data.html'; }, 1500);
            }
        },
        error: function (xhr) {
            const msg = xhr.responseJSON?.message || 'Terjadi kesalahan!';
            showAlert('danger', msg);
        },
        complete: function () {
            // Re-enable tombol setelah request selesai
            $('#submitBtn').prop('disabled', false).html('<i class="bi bi-save me-2"></i>Simpan Todo');
        }
        });
    });

  // ── EVENT: Reset Form ─────────────────────────────────
    $('#resetBtn').on('click', function () {
        resetForm();
    });

});  // end $(document).ready

// ── HELPER FUNCTIONS ──────────────────────────────────────

// Tampilkan alert Bootstrap di atas form
function showAlert(type, message) {
    const alert = `
        <div class='alert alert-${type} alert-dismissible fade show'>
        ${message}
        <button type='button' class='btn-close' data-bs-dismiss='alert'></button>
        </div>`;
    $('#alertContainer').html(alert);
    // Scroll ke atas agar alert terlihat
    $('html, body').animate({ scrollTop: 0 }, 300);
}

// Reset semua field form ke nilai default
function resetForm() {
    $('#todoForm')[0].reset();
    $('#todoId').val('');
    $('#formTitle').text('Tambah Todo Baru');
    $('#submitBtn').html('<i class="bi bi-save me-2"></i>Simpan Todo');
}
