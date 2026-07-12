const ROLE_ID_CONFIG = {
  Lecturer: { label: 'Lecture ID', field: 'lectureId' },
  Staff: { label: 'Staff ID', field: 'staffId' },
  Student: { label: 'Student ID', field: 'studentId' },
}

export function getUserRoleId(user) {
  const config = ROLE_ID_CONFIG[user?.role] || ROLE_ID_CONFIG.Student

  return {
    label: config.label,
    value: user?.[config.field] || '',
  }
}
