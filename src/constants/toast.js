import Swal from "sweetalert2";

export function errorToast(err){
    Swal.fire({
        position: 'top-center',
        icon: 'error',
        title: err,
        showConfirmButton: false,
        timer: 1500
      })
}

export function infoToast(err){
    Swal.fire({
        position: 'top-center',
        icon: 'info',
        title: err,
        showConfirmButton: false,
        timer: 1500
      })
}
export function successToast(data,time,next){
  Swal.fire({
    position: 'top-center',
    icon: 'success',
    title: data,
    showConfirmButton: false,
    timer: time || 1500
  }).then(e=>next(e))
}

