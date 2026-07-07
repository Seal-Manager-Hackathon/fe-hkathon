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

/**
 * Shows a prompt dialog asking for a reason/input.
 * @param {string} title - dialog title
 * @param {string} inputLabel - label for the input field
 * @param {string} [placeholder] - placeholder text
 * @param {string} [confirmText='Submit'] - confirm button text
 * @returns {Promise<string|null>} the input value, or null if cancelled
 */
export async function promptReason(title, inputLabel, placeholder = '', confirmText = 'Submit') {
  const result = await Swal.fire({
    title,
    input: 'textarea',
    inputLabel,
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonColor: '#064f5d',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    inputValidator: (value) => {
      if (!value || !value.trim()) {
        return 'Please enter a reason.'
      }
      return null
    },
  })
  return result.isConfirmed ? result.value.trim() : null
}
