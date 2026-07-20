# 10 — Route-to-API Mapping

> **Mục đích:** Liệt kê đầy đủ mapping từ Route → API cho từng role, chỉ bao gồm API mà user có thể **chủ động tương tác** (view danh sách, submit form, click button, chuyển tab, pagination...). Bỏ qua các API tự động gọi lúc mount trang.

---

## 1. Auth Pages

### Login Page
| | |
|---|---|
| **Route** | `/login` |
| **Group** | Đăng nhập |
| **API** | `POST /api/v1/auth/login` |

**User action:** Nhập email + password → click "Sign in"

---

### Register Page
| | |
|---|---|
| **Route** | `/register` |
| **Group** | Đăng ký |
| **API** | `POST /api/v1/auth/register` |

**User action:** Nhập firstName, lastName, email, password + confirm → click "Create account"

---

### Forgot Password Page
| | |
|---|---|
| **Route** | `/forgot-password` |
| **Group** | Quên mật khẩu |
| **API** | `POST /api/v1/auth/forgot-password` |

**User action:** Nhập email → click "Send reset link"

---

### Reset Password Page
| | |
|---|---|
| **Route** | `/reset-password?token=...` |
| **Group** | Đặt lại mật khẩu |
| **API** | `POST /api/v1/auth/reset-password` |

**User action:** Nhập new password + confirm → click "Reset password"

---

## 2. Student Pages (`/`)

> ⚠️ **Lưu ý:** HomePage (`/`) không có API nào user có thể tương tác — tất cả đều auto-load.
> ProfilePage (`/profile`) cũng chỉ hiển thị từ AuthContext.

### HackathonsPage — Danh sách sự kiện
| | |
|---|---|
| **Route** | `/hackathons` |
| **Group** | Danh sách hackathons |

| API | User action |
|-----|-------------|
| `GET /api/v1/student/events` | Nhập keyword, chọn filter (Status, FromDate, ToDate), chuyển trang |

---

### EventDetailPage — Chi tiết sự kiện
| | |
|---|---|
| **Route** | `/hackathons/:id` |

| Tab/Button | API | User action |
|---|---|---|
| **Rounds tab** | `GET /api/v1/student/events/{eventId}/rounds` | Click tab "Rounds" |
| **Awards tab** | `GET /api/v1/student/events/{eventId}/awards` | Click tab "Awards" |
| **Assignments tab** | `GET /api/v1/student/assign/events/{eventId}/assigned` | Click tab "Assignments" |
| **Leaderboard tab** | `GET /api/v1/student/events/{eventId}/leaderboard` | Click tab "Leaderboard" |
| **Register button** | `POST /api/v1/student/register-teams` | Chọn team → click "Register" |

---

### StudentTeamsPage — Đội của tôi
| | |
|---|---|
| **Route** | `/teams` |

| API | User action |
|-----|-------------|
| `GET /api/v1/student/teams/my-teams` | Xem danh sách, search, chuyển trang |
| `POST /api/v1/student/teams` | Nhập tên → click "Create Team" |

---

### TeamDetailPage — Quản lý đội
| | |
|---|---|
| **Route** | `/teams/:teamId` |

| API | User action | Quyền |
|-----|-------------|-------|
| `PATCH /api/v1/student/teams/{teamId}` | Đổi tên team | Leader only |
| `POST /api/v1/student/teams/{teamId}/disband` | Giải tán team | Leader only |
| `POST /api/v1/student/teams/{teamId}/leave` | Rời team | Member only |
| `POST /api/v1/student/teams/{teamId}/members/{memberId}/kick` | Đuổi thành viên | Leader only |
| `POST /api/v1/student/teams/{teamId}/change-leader` | Chuyển trưởng nhóm | Leader only |
| `POST /api/v1/student/teams/{teamId}/invitations` | Mời thành viên qua email | Leader only |

| Tab | API | User action |
|-----|-----|-------------|
| **Events tab** | `GET /api/v1/student/teams/{teamId}/events` | Xem sự kiện team tham gia |
| **Registrations tab** | `GET /api/v1/student/teams/{teamId}/register-teams/all` | Xem lịch sử đăng ký |
| **Invitations tab** | `GET /api/v1/student/teams/{teamId}/invitations` | Xem lời mời đã gửi |

---

### TeamRegistrationsPage — Lịch sử đăng ký
| | |
|---|---|
| **Route** | `/teams/:teamId/registrations` |

| API | User action |
|-----|-------------|
| `GET /api/v1/student/teams/{teamId}/register-teams/all` | Xem danh sách, lọc theo status, chuyển trang |

---

### RegisterTeamDetailPage — Chi tiết đăng ký
| | |
|---|---|
| **Route** | `/teams/registrations/:registerTeamId` |

| API | User action |
|-----|-------------|
| `GET /api/v1/student/events/{eventId}/rounds` | Click tab "Rounds" |
| `GET /api/v1/student/register-teams/{registerTeamId}/submissions` | Xem bài đã nộp |
| `GET /api/v1/student/events/{eventId}/awards` | Click tab "Awards" |
| `GET /api/v1/student/register-teams/{registerTeamId}/mentor-notifications` | Click tab "Notifications" |
| `GET /api/v1/student/events/{eventId}/leaderboard` | Click tab "Leaderboard" |
| `GET /api/v1/student/rounds/{roundId}` | Click "View" trên round |
| `GET /api/v1/student/mentor-notifications/{id}` | Click "View" trên mentor notification |
| `POST /api/v1/student/submissions` | Nhập URL + description → click "Submit" (leader only) |
| `GET /api/v1/student/submissions/{submissionId}` | Click "View Submission" |

---

### MyInvitationsPage — Lời mời
| | |
|---|---|
| **Route** | `/invitations` |

| API | User action |
|-----|-------------|
| `GET /api/v1/student/invitations` | Xem danh sách, filter, chuyển trang |
| `GET /api/v1/student/invitations/{invitationId}` | Click "View" (modal) |
| `POST /api/v1/student/invitations/{invitationId}/accept` | Click "Accept" |
| `POST /api/v1/student/invitations/{invitationId}/reject` | Click "Reject" |

---

### MyNotificationsPage — Thông báo
| | |
|---|---|
| **Route** | `/my-notifications` (Student) |

| API | User action |
|-----|-------------|
| `GET /api/v1/student/notifications` | Xem danh sách, filter, chuyển trang |
| `GET /api/v1/student/notifications/{notificationId}` | Click "View" (modal) |
| `POST /api/v1/student/notifications/{notificationId}/read` | Trigger khi mở modal |
| `POST /api/v1/student/notifications/read-all` | Click "Mark all as read" |

---

### MyReportsPage — Báo cáo
| | |
|---|---|
| **Route** | `/reports` |

| API | User action |
|-----|-------------|
| `GET /api/v1/student/reports` | Xem danh sách, search, filter, chuyển trang |
| `POST /api/v1/student/reports` | Nhập title + type + description → click "Submit" |

---

### YearLeaderboardPage — Bảng xếp hạng năm
| | |
|---|---|
| **Route** | `/leaderboard` |

| API | User action |
|-----|-------------|
| `GET /api/v1/student/events/chapter/{year}/leaderboard` | Chọn năm, chuyển trang |

---

### Profile & Profile Edit
| | |
|---|---|
| **Route** | `/profile`, `/profile/edit` |

> ⚠️ **Lưu ý:** Component `ProfileEditForm` được dùng chung cho tất cả roles (Student, Admin `/admin/profile/edit`, Staff `/staff/profile/edit`, Lecturer `/lecture/profile/edit`).

| API | User action |
|-----|-------------|
| `PATCH /api/v1/user/me` | Cập nhật thông tin cá nhân (FormData: firstName, lastName, phoneNumber, bio, address, dateOfBirth, studentId, linkUrl, avatarUrl, avatarFile) |
| `POST /api/v1/auth/change-password` | Đổi mật khẩu (currentPassword, newPassword) |

---

## 3. Admin Pages (`/admin`)

### Dashboard
| | |
|---|---|
| **Route** | `/admin` |
| **Group** | Thống kê |

| API | User action |
|-----|-------------|
| `GET /api/v1/admin/events/count` | Xem tổng số events |
| `GET /api/v1/admin/users/count` | Xem tổng số users |
| `GET /api/v1/admin/teams/count` | Xem tổng số teams |
| `GET /api/v1/admin/events/recent` | Xem events gần đây |
| `GET /api/v1/admin/users/recent` | Xem users gần đây |
| `GET /api/v1/admin/notifications/recent` | Xem notifications gần đây |
| `GET /api/v1/admin/reports/recent` | Xem reports gần đây |

---

### HackathonManagement — Danh sách sự kiện
| | |
|---|---|
| **Route** | `/admin/hackathons` |
| **Group** | CRUD hackathons |

| API | User action |
|-----|-------------|
| `GET /api/v1/admin/events` | Xem danh sách, search, filter, chuyển trang |
| `POST /api/v1/admin/events/{eventId}/delete` | Click "Delete" → xác nhận |
| `POST /api/v1/admin/events/{eventId}/restore` | Click "Restore" |

---

### HackathonCreate — Tạo sự kiện
| | |
|---|---|
| **Route** | `/admin/hackathons/create` |

| API | User action |
|-----|-------------|
| `POST /api/v1/admin/events` | Điền form (name, season, dates, limits...) → click "Create" |

---

### HackathonEdit — Sửa sự kiện
| | |
|---|---|
| **Route** | `/admin/hackathons/:id/edit` |

| API | User action |
|-----|-------------|
| `PATCH /api/v1/admin/events/{eventId}` | Cập nhật thông tin → click "Save" |

---

### HackathonDetail — Chi tiết sự kiện + tabs
| | |
|---|---|
| **Route** | `/admin/hackathons/:id` |
| **Group** | **Rounds** |

| API | User action |
|-----|-------------|
| `GET /api/v1/admin/events/{eventId}/rounds` | Xem danh sách rounds, search, filter |
| `POST /api/v1/admin/events/{eventId}/rounds` | Tạo round mới |
| `PATCH /api/v1/admin/rounds/{roundId}` | Sửa round |
| `POST /api/v1/admin/rounds/{roundId}/delete` | Xoá mềm round |
| `POST /api/v1/admin/rounds/{roundId}/restore` | Khôi phục round |
| `POST /api/v1/admin/rounds/{roundId}/end-round` | Kết thúc round ngay |
| `POST /api/v1/admin/rounds/{roundId}/swap` | Đổi thứ tự round |
| `GET /api/v1/admin/rounds/{roundId}/leaderboard` | Xem bảng xếp hạng round (modal) |

| Group | **Criteria Templates** |
|-------|------------------------|
| `GET /api/v1/admin/rounds/{roundId}/criteria-templates` | Xem danh sách templates |
| `POST /api/v1/admin/rounds/{roundId}/criteria-templates` | Tạo template |
| `PATCH /api/v1/admin/criteria-templates/{templateId}` | Sửa template |
| `POST /api/v1/admin/criteria-templates/{templateId}/delete` | Xoá template |
| `POST /api/v1/admin/criteria-templates/{templateId}/restore` | Khôi phục template |
| `POST /api/v1/admin/criteria-templates/{templateId}/activate` | Kích hoạt template |
| `GET /api/v1/admin/criteria-templates/{templateId}/criteria-items` | Xem criteria items |

| Group | **Tracks** |
|-------|------------|
| `GET /api/v1/admin/events/{eventId}/tracks` | Xem danh sách tracks |
| `POST /api/v1/admin/events/{eventId}/tracks` | Tạo track |
| `PATCH /api/v1/admin/events/{eventId}/tracks/{trackId}` | Sửa track |
| `POST /api/v1/admin/tracks/{trackId}/delete` | Xoá track |
| `POST /api/v1/admin/tracks/{trackId}/restore` | Khôi phục track |

| Group | **Topics** |
|-------|------------|
| `GET /api/v1/admin/tracks/{trackId}/topics` | Xem danh sách topics |
| `POST /api/v1/admin/tracks/{trackId}/topics` | Tạo topic |
| `PATCH /api/v1/admin/topics/{topicId}` | Sửa topic |
| `POST /api/v1/admin/topics/{topicId}/delete` | Xoá topic |
| `POST /api/v1/admin/topics/{topicId}/restore` | Khôi phục topic |

| Group | **Awards** |
|-------|------------|
| `GET /api/v1/admin/events/{eventId}/awards` | Xem danh sách awards |
| `POST /api/v1/admin/events/{eventId}/awards` | Tạo award |
| `PATCH /api/v1/admin/awards/{awardId}` | Sửa award |
| `POST /api/v1/admin/awards/{awardId}/delete` | Xoá award |
| `POST /api/v1/admin/awards/{awardId}/restore` | Khôi phục award |

| Group | **Assignments** |
|-------|-----------------|
| `GET /api/v1/admin/assign/events/{eventId}/assigned` | Xem danh sách người được assign |
| `GET /api/v1/admin/assign/events/{eventId}/lecturers/available` | Xem lecturers có sẵn |
| `GET /api/v1/admin/assign/events/{eventId}/staff/available` | Xem staff có sẵn |
| `POST /api/v1/admin/assign/events/{eventId}/assign/users` | Assign user vào event |
| `POST /api/v1/admin/assign/event-assigns/{assignEventId}/remove` | Remove assignment |
| `POST /api/v1/admin/assign/event-assigns/{assignEventId}/restore` | Restore assignment |
| `PATCH /api/v1/admin/assign/event-assigns/{assignEventId}/event-role` | Đổi role (Judge ↔ Mentor) |
| `POST /api/v1/admin/assign/event-assigns/{assignEventId}/tracks` | Assign track cho user |
| `POST /api/v1/admin/assign/event-assigns/{assignEventId}/tracks/{trackId}/remove` | Remove track khỏi assign |

| Group | **Register Teams** |
|-------|--------------------|
| `GET /api/v1/admin/events/{eventId}/register-teams` | Xem danh sách teams đăng ký |
| `GET /api/v1/admin/events/{eventId}/register-teams/with-scores` | Xem teams kèm điểm |
| `POST /api/v1/admin/register-teams/{registerTeamId}/approve` | Duyệt team |
| `POST /api/v1/admin/register-teams/{registerTeamId}/reject` | Từ chối team |
| `POST /api/v1/admin/register-teams/{registerTeamId}/ban` | Ban team |
| `POST /api/v1/admin/register-teams/{registerTeamId}/unban` | Unban team |
| `POST /api/v1/admin/register-teams/{registerTeamId}/assign-track-topic` | Gán track/topic |
| `POST /api/v1/admin/register-teams/{registerTeamId}/remove-track-topic` | Xoá track/topic |
| `POST /api/v1/admin/register-teams/{registerTeamId}/assign-next-round` | Chuyển sang round kế |
| `POST /api/v1/admin/register-teams/{registerTeamId}/revert-previous-round` | Quay lại round trước |
| `GET /api/v1/admin/register-teams/{registerTeamId}/submissions` | Xem lịch sử nộp bài |

| Group | **Submissions** |
|-------|-----------------|
| `GET /api/v1/admin/events/{eventId}/submissions` | Xem danh sách submissions, filter |
| `GET /api/v1/admin/submissions/{submissionId}` | Xem chi tiết submission |
| `GET /api/v1/admin/submissions/{submissionId}/grader-scores` | Xem điểm từ grader |

| Group | **Leaderboard** |
|-------|-----------------|
| `GET /api/v1/admin/events/{eventId}/leaderboard` | Xem bảng xếp hạng event |
| `GET /api/v1/admin/rounds/{roundId}/leaderboard` | Xem bảng xếp hạng round |

---

### RoundDetail
| | |
|---|---|
| **Route** | `/admin/rounds/:roundId` |
| **API (read)** | `GET /api/v1/admin/rounds/{roundId}` |

---

### CriteriaTemplateCreate
| | |
|---|---|
| **Route** | `/admin/rounds/:roundId/criteria-templates/create` |

| API | User action |
|-----|-------------|
| `POST /api/v1/admin/rounds/{roundId}/criteria-templates` | Tạo template kèm items |

---

### CriteriaTemplateEdit
| | |
|---|---|
| **Route** | `/admin/rounds/:roundId/criteria-templates/:templateId/edit` |

| API | User action |
|-----|-------------|
| `PATCH /api/v1/admin/criteria-templates/{templateId}` | Cập nhật title, description |
| CRUD items (qua CriteriaItemsPanel) | Thêm/sửa/xoá/khôi phục criteria items |

---

### TrackCreate
| | |
|---|---|
| **Route** | `/admin/hackathons/:eventId/tracks/create` |

| API | User action |
|-----|-------------|
| `POST /api/v1/admin/events/{eventId}/tracks` | Tạo track |

---

### TrackEdit
| | |
|---|---|
| **Route** | `/admin/tracks/:trackId/edit` |

| API | User action |
|-----|-------------|
| `PATCH /api/v1/admin/events/{eventId}/tracks/{trackId}` | Cập nhật track |

---

### TopicCreate
| | |
|---|---|
| **Route** | `/admin/tracks/:trackId/topics/create` |

| API | User action |
|-----|-------------|
| `POST /api/v1/admin/tracks/{trackId}/topics` | Tạo topic |

---

### TopicEdit
| | |
|---|---|
| **Route** | `/admin/tracks/:trackId/topics/:topicId/edit` |

| API | User action |
|-----|-------------|
| `PATCH /api/v1/admin/topics/{topicId}` | Cập nhật topic |

---

### AwardCreate
| | |
|---|---|
| **Route** | `/admin/hackathons/:eventId/awards/create` |

| API | User action |
|-----|-------------|
| `POST /api/v1/admin/events/{eventId}/awards` | Tạo award |

---

### AwardEdit
| | |
|---|---|
| **Route** | `/admin/hackathons/:eventId/awards/:awardId/edit` |

| API | User action |
|-----|-------------|
| `PATCH /api/v1/admin/awards/{awardId}` | Cập nhật award |

---

### RegisterTeamDetail
| | |
|---|---|
| **Route** | `/admin/register-teams/:registerTeamId` |

| API | User action |
|-----|-------------|
| `POST /api/v1/admin/register-teams/{registerTeamId}/approve` | Duyệt đăng ký |
| `POST /api/v1/admin/register-teams/{registerTeamId}/reject` | Từ chối (kèm reason) |
| `GET /api/v1/admin/register-teams/{registerTeamId}/submissions` | Xem lịch sử nộp bài |

---

### RegisterTeamEdit
| | |
|---|---|
| **Route** | `/admin/register-teams/:registerTeamId/edit` |

| API | User action |
|-----|-------------|
| `PATCH /api/v1/admin/register-teams/{registerTeamId}` | Cập nhật status, description |

---

### UsersManagement
| | |
|---|---|
| **Route** | `/admin/users` |

| API | User action |
|-----|-------------|
| `GET /api/v1/admin/users` | Xem danh sách, search, filter, chuyển trang |
| `POST /api/v1/admin/users/{userId}/delete` | Xoá mềm user |
| `POST /api/v1/admin/users/{userId}/restore` | Khôi phục user |
| `POST /api/v1/admin/users/{userId}/ban` | Ban user (kèm reason) |
| `POST /api/v1/admin/users/{userId}/unban` | Unban user |

---

### UsersCreate
| | |
|---|---|
| **Route** | `/admin/users/create` |

| API | User action |
|-----|-------------|
| `POST /api/v1/admin/users` | Tạo user mới |

---

### UserDetail
| | |
|---|---|
| **Route** | `/admin/users/:id` |

| Group | API | User action |
|-------|-----|-------------|
| **Personal Info** | `GET /api/v1/admin/users/{userId}` | Xem thông tin cá nhân |
| **Events tab** (Student) | `GET /api/v1/admin/users/{userId}/events` | Xem danh sách sự kiện đã tham gia, search, chuyển trang |
| **Assign Events tab** (Lecturer/Staff) | `GET /api/v1/admin/assign/users/{userId}/assign-events` | Xem danh sách sự kiện được assign, lọc theo role, chuyển trang |

---

### UserEdit
| | |
|---|---|
| **Route** | `/admin/users/:id/edit` |

| API | User action |
|-----|-------------|
| `PATCH /api/v1/admin/users/{userId}` | Cập nhật user (multipart/form-data) |

---

### TeamsManagement
| | |
|---|---|
| **Route** | `/admin/teams` |

| API | User action |
|-----|-------------|
| `GET /api/v1/admin/teams` | Xem danh sách, search, filter |
| `POST /api/v1/admin/teams/{teamId}/delete` | Xoá mềm team |
| `POST /api/v1/admin/teams/{teamId}/restore` | Khôi phục team |
| `POST /api/v1/admin/teams/{teamId}/lock` | Khoá team |
| `POST /api/v1/admin/teams/{teamId}/unlock` | Mở khoá team |

---

### TeamEdit
| | |
|---|---|
| **Route** | `/admin/teams/:id/edit` |

| API | User action |
|-----|-------------|
| `PATCH /api/v1/admin/teams/{teamId}` | Cập nhật tên team |

---

### NotificationsManagement
| | |
|---|---|
| **Route** | `/admin/notifications` |

| API | User action |
|-----|-------------|
| `GET /api/v1/admin/notifications` | Xem danh sách, filter |
| `POST /api/v1/admin/notifications/{id}/delete` | Xoá notification |
| `POST /api/v1/admin/notifications/{id}/restore` | Khôi phục notification |

---

### NotificationsCreate
| | |
|---|---|
| **Route** | `/admin/notifications/create` |

| API | User action |
|-----|-------------|
| `POST /api/v1/admin/notifications` | Tạo và gửi notification |
| `GET /api/v1/admin/users` | Tìm user để chọn target |
| `GET /api/v1/admin/teams` | Tìm team để chọn target |

---

### NotificationEdit
| | |
|---|---|
| **Route** | `/admin/notifications/:id/edit` |

| API | User action |
|-----|-------------|
| `PATCH /api/v1/admin/notifications/{id}` | Cập nhật title, description |

---

### ReportsManagement
| | |
|---|---|
| **Route** | `/admin/reports` |

| API | User action |
|-----|-------------|
| `GET /api/v1/admin/reports` | Xem danh sách, search, filter |
| `PATCH /api/v1/admin/reports/{id}/status` | Resolve/Reject report (kèm reason) |

---

### ReportDetail
| | |
|---|---|
| **Route** | `/admin/reports/:id` |

| API | User action |
|-----|-------------|
| `PATCH /api/v1/admin/reports/{id}/status` | Resolve/Reject report (kèm reason) |
| `GET /api/v1/admin/users/{userId}` | Xem thông tin reporter |

---

### SubmissionDetail
| | |
|---|---|
| **Route** | `/admin/submissions/:submissionId` |
| **Group** | Chỉ đọc |

| API | User action |
|-----|-------------|
| `GET /api/v1/admin/submissions/{submissionId}` | Xem chi tiết submission |
| `GET /api/v1/admin/submissions/{submissionId}/grader-scores` | Xem điểm từ các grader |
| `GET /api/v1/admin/scores/{scoreId}` | Xem chi tiết 1 grading session |
| `GET /api/v1/admin/scores/{scoreId}/items` | Xem điểm từng criteria |

---

### ChapterLeaderboardPage
| | |
|---|---|
| **Route** | `/admin/leaderboard` |

| API | User action |
|-----|-------------|
| `GET /api/v1/admin/events/chapter/{year}/leaderboard` | Chọn năm, chuyển trang |

---

### MyNotifications (Admin cá nhân)
| | |
|---|---|
| **Route** | `/admin/my-notifications` |

| API | User action |
|-----|-------------|
| `GET /api/v1/admin/notifications/my` | Xem danh sách |
| `GET /api/v1/admin/notifications/my/{id}` | Xem chi tiết (modal) |
| `POST /api/v1/admin/notifications/my/{id}/read` | Đánh dấu đã đọc |
| `POST /api/v1/admin/notifications/my/read-all` | Đánh dấu tất cả đã đọc |

---

## 4. Staff Pages (`/staff`)

> **Cấu trúc tương tự Admin** nhưng quyền write bị giới hạn. Dưới đây là các write API duy nhất Staff có.

### Staff write APIs (chủ động)

| Page | API | User action |
|------|-----|-------------|
| CriteriaTemplateCreate | `POST /api/v1/staff/rounds/{roundId}/criteria-templates` | Tạo template |
| CriteriaTemplateEdit | `PATCH /api/v1/staff/criteria-templates/{templateId}` | Sửa template |
| RegisterTeamDetail | `POST /api/v1/staff/register-teams/{id}/approve` | Duyệt team |
| RegisterTeamDetail | `POST /api/v1/staff/register-teams/{id}/reject` | Từ chối team |
| RegisterTeamEdit | `PATCH /api/v1/staff/register-teams/{id}` | Cập nhật đăng ký |
| NotificationsCreate | `POST /api/v1/staff/notifications` | Tạo và gửi notification |
| NotificationEdit | `PATCH /api/v1/staff/notifications/{id}` | Sửa notification |
| ReportsManagement | `PATCH /api/v1/staff/reports/{id}/status` | Resolve/Reject report |
| ReportDetail | `PATCH /api/v1/staff/reports/{id}/status` | Resolve/Reject report |
| MyNotifications | `POST /api/v1/staff/notifications/my/{id}/read` | Đánh dấu đã đọc |
| MyNotifications | `POST /api/v1/staff/notifications/my/read-all` | Đánh dấu tất cả |
| ProfileEdit | `PATCH /api/v1/staff/users/{userId}` | Cập nhật profile |

### Profile (Staff)
| | |
|---|---|
| **Route** | `/staff/profile/edit` |

| API | User action |
|-----|-------------|
| `PATCH /api/v1/user/me` | Cập nhật profile (dùng `ProfileEditForm` shared component) |
| `POST /api/v1/auth/change-password` | Đổi mật khẩu |

### Staff read-only pages

- **Dashboard** `/staff` — thống kê (counts, recent)
- **HackathonManagement** `/staff/hackathons` — danh sách (my-staff)
- **HackathonDetail** `/staff/hackathons/:id` — xem tabs
- **RoundDetail** `/staff/rounds/:roundId`
- **CriteriaTemplatesManagement** `/staff/rounds/:roundId/criteria-templates`
- **CriteriaTemplateDetail** `/staff/rounds/:roundId/criteria-templates/:templateId`
- **TrackDetail** `/staff/tracks/:trackId`
- **TopicsManagement** `/staff/tracks/:trackId/topics`
- **TopicDetail** `/staff/tracks/:trackId/topics/:topicId`
- **AwardDetail** `/staff/awards/:awardId`
- **UsersManagement** `/staff/users`
- **UserDetail** `/staff/users/:id`
- **NotificationDetail** `/staff/notifications/:id`
- **TeamsManagement** `/staff/teams`
- **TeamDetail** `/staff/teams/:id`
- **SubmissionDetail** `/staff/submissions/:submissionId`
- **ChapterLeaderboardPage** `/staff/leaderboard`

---

## 5. Lecturer Pages (`/lecture`)

> Lecturer có 2 vai trò: **Mentor** (hướng dẫn, gửi thông báo) và **Judge** (chấm điểm).

### Judge — Chấm bài

| Page | API | User action |
|------|-----|-------------|
| JudgeRoundSubmissionsPage | `GET /api/v1/judge/rounds/{roundId}/submissions` | Xem danh sách submissions cần chấm, lọc theo track |
| JudgeSubmissionDetailPage | `GET /api/v1/judge/submissions/{submissionId}` | Xem chi tiết submission |
| JudgeSubmissionDetailPage | `GET /api/v1/judge/submissions/{submissionId}/my-score` | Xem điểm hiện tại |
| JudgeSubmissionDetailPage | `POST /api/v1/judge/submissions/{submissionId}/scores` | **Chấm bài (grade)** — nhập điểm từng criteria |
| JudgeSubmissionDetailPage | `PATCH /api/v1/judge/scores/{scoreId}` | **Chấm lại (regrade)** |

### Mentor — Thông báo

| Page | API | User action |
|------|-----|-------------|
| TrackNotificationCreate | `POST /api/v1/mentor/tracks/{trackId}/mentor-notifications` | **Tạo thông báo mentor** |
| TrackNotificationsPage | `GET /api/v1/mentor/tracks/{trackId}/mentor-notifications` | Xem danh sách |
| TrackNotificationsPage | `POST /api/v1/mentor/mentor-notifications/{id}/delete` | **Xoá thông báo** |
| TrackNotificationsPage | `POST /api/v1/mentor/mentor-notifications/{id}/restore` | **Khôi phục thông báo** |

### Personal — Cá nhân

| Page | API | User action |
|------|-----|-------------|
| ProfileEdit | `PATCH /api/v1/user/me` | Cập nhật profile |
| ProfileEdit | `POST /api/v1/auth/change-password` | Đổi mật khẩu |
| ProfileEdit | `PATCH /api/v1/user/me` | Cập nhật profile |
| ProfileEdit | `POST /api/v1/auth/change-password` | Đổi mật khẩu |
| MyNotifications | `POST /api/v1/lecturer/notifications/{id}/read` | Đánh dấu đã đọc |
| MyNotifications | `POST /api/v1/lecturer/notifications/read-all` | Đánh dấu tất cả |

### Lecturer hackathon detail tabs

| | |
|---|---|
| **Route** | `/lecture/hackathons/:id` |

Lecturer HackathonDetail có 7 tabs:

| Tab | Component/API | User action |
|-----|---------------|-------------|
| **Overview** | `LecturerOverviewTab` — hiển thị từ `getLecturerEventDetail` | Read-only |
| **Rounds** | `LecturerRoundsTab` → `GET /lecturer/events/{eventId}/rounds` | Xem danh sách rounds (có thể có round leaderboard modal) |
| **Tracks** | `LecturerTracksTab` → `GET /lecturer/events/{eventId}/my-tracks` | Xem danh sách track được assign |
| **Awards** | `LecturerAwardsTab` → `GET /lecturer/events/{eventId}/awards` | Xem danh sách awards |
| **Assignment** | `LecturerAssignTab` → `GET /lecturer/events/{eventId}/assign` | Xem danh sách người được assign |
| **Register Teams** | `LecturerRegisterTeamsTab` → `GET /lecturer/events/{eventId}/register-teams` | Xem teams đăng ký, filter |
| **Leaderboard** | `LecturerEventLeaderboardTab` → `GET /lecturer/events/{eventId}/leaderboard` | Xem bảng xếp hạng event |

### Lecturer read-only pages

| Page | Route | APIs |
|------|-------|------|
| Dashboard | `/lecture` | `GET /lecturer/events/count`, `/users/count`, `/teams/count`, `/events/recent` |
| HackathonsPage | `/lecture/hackathons` | `GET /lecturer/events/my-lecturer` |
| HackathonDetail | `/lecture/hackathons/:id` | Các tab gọi xem rounds, tracks, awards, register-teams, assign, leaderboard |
| RoundDetail | `/lecture/rounds/:roundId` | `GET /lecturer/rounds/{roundId}` |
| CriteriaTemplatesList | `/lecture/rounds/:roundId/criteria-templates` | `GET /lecturer/rounds/{roundId}/criteria-templates` |
| CriteriaTemplateDetail | `/lecture/rounds/:roundId/criteria-templates/:templateId` | `GET /lecturer/criteria-templates/{templateId}` |
| RegisterTeamDetail | `/lecture/register-teams/:id` | `GET /lecturer/register-teams/{id}` |
| TeamDetail | `/lecture/teams/:teamId` | `GET /lecturer/teams/{teamId}` |
| TrackDetail | `/lecture/tracks/:trackId` | `GET /lecturer/tracks/{trackId}` |
| TopicsList | `/lecture/tracks/:trackId/topics` | `GET /lecturer/tracks/{trackId}/topics` |
| TopicDetail | `/lecture/tracks/:trackId/topics/:topicId` | `GET /lecturer/topics/{topicId}` |
| AwardDetail | `/lecture/awards/:awardId` | `GET /lecturer/awards/{awardId}` |
| ChapterLeaderboardPage | `/lecture/leaderboard` | `GET /lecturer/events/chapter/{year}/leaderboard` |

---

## 6. Thống kê tổng hợp

| Role | Số pages | Write APIs (có tương tác) | Read APIs (có tương tác) | Ghi chú |
|------|----------|--------------------------|--------------------------|---------|
| **Guest/Auth** | 5 | 5 | 1 | Login, register, forgot/reset password |
| **Student** | 13 | 16 | 26 | Tạo team, nộp bài, invitations... |
| **Admin** | 42 | ~44 | ~20 | Full CRUD tất cả modules |
| **Staff** | 30 | 11 | ~19 | Write hạn chế (approve/reject... ) |
| **Lecturer** | 20 | 9 | ~15 | Grade + mentor notifications |
| **Tổng** | **110+** | **~85** | **~81** | |
