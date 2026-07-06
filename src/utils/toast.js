import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

export const toast = {
  success(message) {
    return Toast.fire({ icon: 'success', title: message })
  },
  error(message) {
    return Toast.fire({ icon: 'error', title: message })
  },
  warning(message) {
    return Toast.fire({ icon: 'warning', title: message })
  },
  info(message) {
    return Toast.fire({ icon: 'info', title: message })
  },
}

/**
 * Shows a confirmation dialog.
 * @param {string} title
 * @param {string} text
 * @returns {Promise<boolean>} true if user confirms
 */
export async function confirm(title, text) {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#064f5d',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  })
  return result.isConfirmed
}
