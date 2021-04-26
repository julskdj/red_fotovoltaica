$(document).ready(function() {
    $('#users').DataTable();
} );


function confirmar(id){
    Swal.fire({
        title: 'Esta seguro que desea eliminar??',
        text: "No puede revertir esta opcion",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar Usuario',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          window.location = '/delete/' + id
        }
      })
}