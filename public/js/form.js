const API_URL = 'http://localhost:3000/api';

$(document).ready(function () {
    const urlParams = new URLSearchParams(globalThis.location.search);
    const editId = urlParams.get('id');

    if (editId) {
        $('#formTitle').text('Edit Todo');
        $('#submitBtn').html('<i class="bi bi-save me-2"></i>Update Todo');
        $('#todoId').val(editId);

        $.ajax({
        url: API_URL + '/todos/' + editId,
        method: 'GET',
        success: function (response) {
            if (response.success) {
            const todo = response.data;
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

    $('#todoForm').on('submit', function (e) {
        e.preventDefault(); 

        const formData = {
            title:       $('#title').val().trim(),
            description: $('#description').val().trim(),
            priority:    $('#priority').val(),
            status:      $('#status').val()
        };

        const currentId = $('#todoId').val();
        const isEdit   = currentId !== '';
        const method   = isEdit ? 'PUT' : 'POST';
        const url      = isEdit
                        ? API_URL + '/todos/' + currentId
                        : API_URL + '/todos';

        $('#submitBtn').prop('disabled', true).text('Menyimpan...');
        $.ajax({
        url:         url,
        method:      method,
        contentType: 'application/json',
        data:        JSON.stringify(formData),  
        success: function (response) {
            if (response.success) {
            const msg = isEdit ? 'Todo berhasil diupdate!' : 'Todo berhasil ditambahkan!';
            showAlert('success', msg);
            if (!isEdit) { resetForm(); }
            setTimeout(() => { window.location.href = 'data.html'; }, 1500);
            }
        },
        error: function (xhr) {
            const msg = xhr.responseJSON?.message || 'Terjadi kesalahan!';
            showAlert('danger', msg);
        },
        complete: function () {
            $('#submitBtn').prop('disabled', false).html('<i class="bi bi-save me-2"></i>Simpan Todo');
        }
        });
    });

    $('#resetBtn').on('click', function () {
        resetForm();
    });

});

function showAlert(type, message) {
    const alert = `
        <div class='alert alert-${type} alert-dismissible fade show'>
        ${message}
        <button type='button' class='btn-close' data-bs-dismiss='alert'></button>
        </div>`;
    $('#alertContainer').html(alert);
    $('html, body').animate({ scrollTop: 0 }, 300);
}

function resetForm() {
    $('#todoForm')[0].reset();
    $('#todoId').val('');
    $('#formTitle').text('Tambah Todo Baru');
    $('#submitBtn').html('<i class="bi bi-save me-2"></i>Simpan Todo');
}
