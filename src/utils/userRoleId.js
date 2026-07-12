const ROLE_ID_LABELS = {
  Lecturer: 'Lecture ID',
  Staff: 'Staff ID',
  Student: 'Student ID',
}

export function getUserRoleId(user) {
  return {
    label: ROLE_ID_LABELS[user?.role] || ROLE_ID_LABELS.Student,
    value: user?.studentId || '',
  }
}
