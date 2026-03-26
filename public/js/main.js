const API_URL = 'http://localhost:3000/api';
let dataTable;

$(document).ready(function () {
    dataTable = $('#todosTable').DataTable({
        ajax: {
        url: API_URL + '/todos',
        dataSrc: 'data',
        error: function () {
            showAlert('danger', 'Gagal memuat data dari server. Pastikan backend berjalan!');
        }
        },

        columns: [
        {
            render: (data, type, row, meta) => meta.row + 1
        },
        { data: 'title' },
        {
            data: 'description',
            render: (data) => data ? data : '<em class="text-muted">-</em>'
        },
        {
            data: 'priority',
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
            data: 'status',
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
            data: 'created_at',
            render: (data) => new Date(data).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
            })
        },
        {
            data: 'id',
            orderable: false,
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

        language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/id.json'
        },
        pageLength: 10,
        responsive: true,
    });


    $('#todosTable').on('click', '.btn-edit', function () {
        const id = $(this).data('id');
        window.location.href = 'form.html?id=' + id;
    });

    $('#todosTable').on('click', '.btn-delete', function () {
        const id = $(this).data('id');
        const row = $(this).closest('tr');

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
            $.ajax({
            url: API_URL + '/todos/' + id,
            method: 'DELETE',
            success: function (response) {
                if (response.success) {
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

});

function showAlert(type, message) {
    const alert = `
        <div class='alert alert-${type} alert-dismissible fade show'>
        ${message}
        <button type='button' class='btn-close' data-bs-dismiss='alert'></button>
        </div>`;
    $('#alertContainer').html(alert);
}
