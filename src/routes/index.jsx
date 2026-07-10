import { lazy, Suspense } from 'react'
import RouteFallback from '../components/RouteFallback'

const StudentLayout = lazy(() => import('../layouts/StudentLayout'))

const HomePage = lazy(() => import('../pages/student/home/HomePage'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const HackathonsPage = lazy(() => import('../pages/student/hackathons/HackathonsPage'))
const YearLeaderboardPage = lazy(() => import('../pages/student/leaderboard/YearLeaderboardPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const VerifyEmailPage = lazy(() => import('../pages/auth/VerifyEmailPage'))
const ProfilePage = lazy(() => import('../pages/auth/ProfilePage'))
const ProfileEditPage = lazy(() => import('../pages/auth/ProfileEditPage'))
const AdminLayout = lazy(() => import('../layouts/AdminLayout'))
const AdminDashboard = lazy(() => import('../pages/admin/dashboard/AdminDashboard'))
const HackathonManagement = lazy(() => import('../pages/admin/hackathons/HackathonManagement'))
const HackathonDetail = lazy(() => import('../pages/admin/hackathons/HackathonDetail'))
const HackathonCreate = lazy(() => import('../pages/admin/hackathons/HackathonCreate'))
const HackathonEdit = lazy(() => import('../pages/admin/hackathons/HackathonEdit'))
const RoundCreate = lazy(() => import('../pages/admin/hackathons/rounds/RoundCreate'))
const RoundEdit = lazy(() => import('../pages/admin/hackathons/rounds/RoundEdit'))
const RoundDetail = lazy(() => import('../pages/admin/hackathons/rounds/RoundDetail'))
const CriteriaTemplatesManagement = lazy(() => import('../pages/admin/hackathons/rounds/CriteriaTemplatesManagement'))
const CriteriaTemplateCreate = lazy(() => import('../pages/admin/hackathons/rounds/CriteriaTemplateCreate'))
const CriteriaTemplateDetail = lazy(() => import('../pages/admin/hackathons/rounds/CriteriaTemplateDetail'))
const CriteriaTemplateEdit = lazy(() => import('../pages/admin/hackathons/rounds/CriteriaTemplateEdit'))
const TrackCreate = lazy(() => import('../pages/admin/hackathons/tracks/TrackCreate'))
const TrackDetail = lazy(() => import('../pages/admin/hackathons/tracks/TrackDetail'))
const TrackEdit = lazy(() => import('../pages/admin/hackathons/tracks/TrackEdit'))
const TopicsManagement = lazy(() => import('../pages/admin/hackathons/tracks/TopicsManagement'))
const TopicCreate = lazy(() => import('../pages/admin/hackathons/tracks/TopicCreate'))
const TopicDetail = lazy(() => import('../pages/admin/hackathons/tracks/TopicDetail'))
const TopicEdit = lazy(() => import('../pages/admin/hackathons/tracks/TopicEdit'))
const AwardCreate = lazy(() => import('../pages/admin/hackathons/awards/AwardCreate'))
const AwardEdit = lazy(() => import('../pages/admin/hackathons/awards/AwardEdit'))
const AwardDetail = lazy(() => import('../pages/admin/hackathons/awards/AwardDetail'))
const RegisterTeamDetail = lazy(() => import('../pages/admin/hackathons/register-teams/RegisterTeamDetail'))
const RegisterTeamEdit = lazy(() => import('../pages/admin/hackathons/register-teams/RegisterTeamEdit'))
const UsersManagement = lazy(() => import('../pages/admin/users/UsersManagement'))
const UsersCreate = lazy(() => import('../pages/admin/users/UsersCreate'))
const UserDetail = lazy(() => import('../pages/admin/users/UserDetail'))
const UserEdit = lazy(() => import('../pages/admin/users/UserEdit'))
const NotificationsManagement = lazy(() => import('../pages/admin/notifications/NotificationsManagement'))
const NotificationsCreate = lazy(() => import('../pages/admin/notifications/NotificationsCreate'))
const NotificationDetail = lazy(() => import('../pages/admin/notifications/NotificationDetail'))
const NotificationEdit = lazy(() => import('../pages/admin/notifications/NotificationEdit'))
const TeamsManagement = lazy(() => import('../pages/admin/teams/TeamsManagement'))
const TeamDetail = lazy(() => import('../pages/admin/teams/TeamDetail'))
const TeamEdit = lazy(() => import('../pages/admin/teams/TeamEdit'))
const ReportsManagement = lazy(() => import('../pages/admin/reports/ReportsManagement'))
const ReportDetail = lazy(() => import('../pages/admin/reports/ReportDetail'))
const SubmissionDetail = lazy(() => import('../pages/admin/submissions/SubmissionDetail'))
const MyNotifications = lazy(() => import('../pages/admin/notifications/MyNotifications'))
const AdminProfile = lazy(() => import('../pages/admin/profile/AdminProfile'))
const AdminProfileEdit = lazy(() => import('../pages/admin/profile/AdminProfileEdit'))
const ChapterLeaderboardPage = lazy(() => import('../pages/admin/leaderboard/ChapterLeaderboardPage'))

// Staff Pages
const StaffLayout = lazy(() => import('../layouts/StaffLayout'))
const StaffDashboard = lazy(() => import('../pages/staff/dashboard/AdminDashboard'))
const StaffHackathonManagement = lazy(() => import('../pages/staff/hackathons/HackathonManagement'))
const StaffHackathonDetail = lazy(() => import('../pages/staff/hackathons/HackathonDetail'))
const StaffHackathonCreate = lazy(() => import('../pages/staff/hackathons/HackathonCreate'))
const StaffHackathonEdit = lazy(() => import('../pages/staff/hackathons/HackathonEdit'))
const StaffRoundDetail = lazy(() => import('../pages/staff/hackathons/rounds/RoundDetail'))
const StaffCriteriaTemplatesManagement = lazy(() => import('../pages/staff/hackathons/rounds/CriteriaTemplatesManagement'))
const StaffCriteriaTemplateCreate = lazy(() => import('../pages/staff/hackathons/rounds/CriteriaTemplateCreate'))
const StaffCriteriaTemplateDetail = lazy(() => import('../pages/staff/hackathons/rounds/CriteriaTemplateDetail'))
const StaffCriteriaTemplateEdit = lazy(() => import('../pages/staff/hackathons/rounds/CriteriaTemplateEdit'))
const StaffTrackCreate = lazy(() => import('../pages/staff/hackathons/tracks/TrackCreate'))
const StaffTrackDetail = lazy(() => import('../pages/staff/hackathons/tracks/TrackDetail'))
const StaffTrackEdit = lazy(() => import('../pages/staff/hackathons/tracks/TrackEdit'))
const StaffTopicsManagement = lazy(() => import('../pages/staff/hackathons/tracks/TopicsManagement'))
const StaffTopicCreate = lazy(() => import('../pages/staff/hackathons/tracks/TopicCreate'))
const StaffTopicDetail = lazy(() => import('../pages/staff/hackathons/tracks/TopicDetail'))
const StaffTopicEdit = lazy(() => import('../pages/staff/hackathons/tracks/TopicEdit'))
const StaffAwardCreate = lazy(() => import('../pages/staff/hackathons/awards/AwardCreate'))
const StaffAwardEdit = lazy(() => import('../pages/staff/hackathons/awards/AwardEdit'))
const StaffAwardDetail = lazy(() => import('../pages/staff/hackathons/awards/AwardDetail'))
const StaffRegisterTeamDetail = lazy(() => import('../pages/staff/hackathons/register-teams/RegisterTeamDetail'))
const StaffRegisterTeamEdit = lazy(() => import('../pages/staff/hackathons/register-teams/RegisterTeamEdit'))
const StaffUsersManagement = lazy(() => import('../pages/staff/users/UsersManagement'))
const StaffUserDetail = lazy(() => import('../pages/staff/users/UserDetail'))
const StaffNotificationsManagement = lazy(() => import('../pages/staff/notifications/NotificationsManagement'))
const StaffNotificationsCreate = lazy(() => import('../pages/staff/notifications/NotificationsCreate'))
const StaffNotificationDetail = lazy(() => import('../pages/staff/notifications/NotificationDetail'))
const StaffNotificationEdit = lazy(() => import('../pages/staff/notifications/NotificationEdit'))
const StaffTeamsManagement = lazy(() => import('../pages/staff/teams/TeamsManagement'))
const StaffTeamDetail = lazy(() => import('../pages/staff/teams/TeamDetail'))
const StaffReportsManagement = lazy(() => import('../pages/staff/reports/ReportsManagement'))
const StaffReportDetail = lazy(() => import('../pages/staff/reports/ReportDetail'))
const StaffSubmissionDetail = lazy(() => import('../pages/staff/submissions/SubmissionDetail'))
const StaffMyNotifications = lazy(() => import('../pages/staff/notifications/MyNotifications'))
const StaffChapterLeaderboardPage = lazy(() => import('../pages/staff/leaderboard/ChapterLeaderboardPage'))
const StaffProfile = lazy(() => import('../pages/staff/profile/AdminProfile'))
const StaffProfileEdit = lazy(() => import('../pages/staff/profile/AdminProfileEdit'))

const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export const routes = [
  { path: '/', element: <Suspense fallback={<RouteFallback full />}><StudentLayout /></Suspense>, children: [
    { path: 'hackathons', element: <Suspense fallback={<RouteFallback />}><HackathonsPage /></Suspense> },
    { path: 'leaderboard', element: <Suspense fallback={<RouteFallback />}><YearLeaderboardPage /></Suspense> },


    { index: true, element: <Suspense fallback={<RouteFallback />}><HomePage /></Suspense> },
    { path: 'profile', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
      { path: 'edit', element: <Suspense fallback={<RouteFallback />}><ProfileEditPage /></Suspense> },
    ]},
  ]},
  { path: '/admin', element: <Suspense fallback={<RouteFallback full />}><AdminLayout /></Suspense>, children: [
    { index: true, element: <Suspense fallback={<RouteFallback />}><AdminDashboard /></Suspense> },
    { path: 'hackathons', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><HackathonManagement /></Suspense> },
      { path: 'create', element: <Suspense fallback={<RouteFallback />}><HackathonCreate /></Suspense> },
      { path: ':id/edit', element: <Suspense fallback={<RouteFallback />}><HackathonEdit /></Suspense> },
      { path: ':id', element: <Suspense fallback={<RouteFallback />}><HackathonDetail /></Suspense> },
      { path: ':eventId/rounds/create', element: <Suspense fallback={<RouteFallback />}><RoundCreate /></Suspense> },
      { path: ':eventId/tracks/create', element: <Suspense fallback={<RouteFallback />}><TrackCreate /></Suspense> },
      { path: ':eventId/tracks/:trackId/edit', element: <Suspense fallback={<RouteFallback />}><TrackEdit /></Suspense> },
      { path: ':eventId/tracks/:trackId/topics/create', element: <Suspense fallback={<RouteFallback />}><TopicCreate /></Suspense> },
      { path: ':eventId/tracks/:trackId/topics/:topicId/edit', element: <Suspense fallback={<RouteFallback />}><TopicEdit /></Suspense> },
      { path: ':eventId/tracks/:trackId/topics/:topicId', element: <Suspense fallback={<RouteFallback />}><TopicDetail /></Suspense> },
      { path: ':eventId/tracks/:trackId/topics', element: <Suspense fallback={<RouteFallback />}><TopicsManagement /></Suspense> },
      { path: ':eventId/tracks/:trackId', element: <Suspense fallback={<RouteFallback />}><TrackDetail /></Suspense> },
      { path: ':eventId/awards/create', element: <Suspense fallback={<RouteFallback />}><AwardCreate /></Suspense> },
      { path: ':eventId/awards/:awardId/edit', element: <Suspense fallback={<RouteFallback />}><AwardEdit /></Suspense> },
      { path: ':eventId/awards/:awardId', element: <Suspense fallback={<RouteFallback />}><AwardDetail /></Suspense> },
    ]},
    { path: 'users', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><UsersManagement /></Suspense> },
      { path: 'create', element: <Suspense fallback={<RouteFallback />}><UsersCreate /></Suspense> },
      { path: ':id/edit', element: <Suspense fallback={<RouteFallback />}><UserEdit /></Suspense> },
      { path: ':id', element: <Suspense fallback={<RouteFallback />}><UserDetail /></Suspense> },
    ]},
    { path: 'notifications', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><NotificationsManagement /></Suspense> },
      { path: 'create', element: <Suspense fallback={<RouteFallback />}><NotificationsCreate /></Suspense> },
      { path: ':id/edit', element: <Suspense fallback={<RouteFallback />}><NotificationEdit /></Suspense> },
      { path: ':id', element: <Suspense fallback={<RouteFallback />}><NotificationDetail /></Suspense> },
    ]},
    { path: 'teams', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><TeamsManagement /></Suspense> },
      { path: ':id/edit', element: <Suspense fallback={<RouteFallback />}><TeamEdit /></Suspense> },
      { path: ':id', element: <Suspense fallback={<RouteFallback />}><TeamDetail /></Suspense> },
    ]},
    { path: 'reports', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><ReportsManagement /></Suspense> },
      { path: ':id', element: <Suspense fallback={<RouteFallback />}><ReportDetail /></Suspense> },
    ]},
    { path: 'leaderboard', element: <Suspense fallback={<RouteFallback />}><ChapterLeaderboardPage /></Suspense> },
    { path: 'register-teams/:registerTeamId/edit', element: <Suspense fallback={<RouteFallback />}><RegisterTeamEdit /></Suspense> },
    { path: 'register-teams/:registerTeamId', element: <Suspense fallback={<RouteFallback />}><RegisterTeamDetail /></Suspense> },
    { path: 'submissions/:submissionId', element: <Suspense fallback={<RouteFallback />}><SubmissionDetail /></Suspense> },
    { path: 'rounds/:roundId/edit', element: <Suspense fallback={<RouteFallback />}><RoundEdit /></Suspense> },
    { path: 'rounds/:roundId/criteria-templates/create', element: <Suspense fallback={<RouteFallback />}><CriteriaTemplateCreate /></Suspense> },
    { path: 'rounds/:roundId/criteria-templates/:templateId/edit', element: <Suspense fallback={<RouteFallback />}><CriteriaTemplateEdit /></Suspense> },
    { path: 'rounds/:roundId/criteria-templates/:templateId', element: <Suspense fallback={<RouteFallback />}><CriteriaTemplateDetail /></Suspense> },
    { path: 'rounds/:roundId/criteria-templates', element: <Suspense fallback={<RouteFallback />}><CriteriaTemplatesManagement /></Suspense> },
    { path: 'rounds/:roundId', element: <Suspense fallback={<RouteFallback />}><RoundDetail /></Suspense> },
    { path: 'my-notifications', element: <Suspense fallback={<RouteFallback />}><MyNotifications /></Suspense> },
    { path: 'profile', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><AdminProfile /></Suspense> },
      { path: 'edit', element: <Suspense fallback={<RouteFallback />}><AdminProfileEdit /></Suspense> },
    ]},
  ]},
  { path: '/staff', element: <Suspense fallback={<RouteFallback full />}><StaffLayout /></Suspense>, children: [
    { index: true, element: <Suspense fallback={<RouteFallback />}><StaffDashboard /></Suspense> },
    { path: 'hackathons', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><StaffHackathonManagement /></Suspense> },
      { path: 'create', element: <Suspense fallback={<RouteFallback />}><StaffHackathonCreate /></Suspense> },
      { path: ':id/edit', element: <Suspense fallback={<RouteFallback />}><StaffHackathonEdit /></Suspense> },
      { path: ':id', element: <Suspense fallback={<RouteFallback />}><StaffHackathonDetail /></Suspense> },
      { path: ':eventId/tracks/create', element: <Suspense fallback={<RouteFallback />}><StaffTrackCreate /></Suspense> },
      { path: ':eventId/tracks/:trackId/edit', element: <Suspense fallback={<RouteFallback />}><StaffTrackEdit /></Suspense> },
      { path: ':eventId/tracks/:trackId/topics/create', element: <Suspense fallback={<RouteFallback />}><StaffTopicCreate /></Suspense> },
      { path: ':eventId/tracks/:trackId/topics/:topicId/edit', element: <Suspense fallback={<RouteFallback />}><StaffTopicEdit /></Suspense> },
      { path: ':eventId/tracks/:trackId/topics/:topicId', element: <Suspense fallback={<RouteFallback />}><StaffTopicDetail /></Suspense> },
      { path: ':eventId/tracks/:trackId/topics', element: <Suspense fallback={<RouteFallback />}><StaffTopicsManagement /></Suspense> },
      { path: ':eventId/tracks/:trackId', element: <Suspense fallback={<RouteFallback />}><StaffTrackDetail /></Suspense> },
      { path: ':eventId/awards/create', element: <Suspense fallback={<RouteFallback />}><StaffAwardCreate /></Suspense> },
      { path: ':eventId/awards/:awardId/edit', element: <Suspense fallback={<RouteFallback />}><StaffAwardEdit /></Suspense> },
      { path: ':eventId/awards/:awardId', element: <Suspense fallback={<RouteFallback />}><StaffAwardDetail /></Suspense> },
      { path: ':eventId/rounds/:roundId/criteria-templates/create', element: <Suspense fallback={<RouteFallback />}><StaffCriteriaTemplateCreate /></Suspense> },
      { path: ':eventId/rounds/:roundId/criteria-templates/:templateId/edit', element: <Suspense fallback={<RouteFallback />}><StaffCriteriaTemplateEdit /></Suspense> },
      { path: ':eventId/rounds/:roundId/criteria-templates/:templateId', element: <Suspense fallback={<RouteFallback />}><StaffCriteriaTemplateDetail /></Suspense> },
      { path: ':eventId/rounds/:roundId/criteria-templates', element: <Suspense fallback={<RouteFallback />}><StaffCriteriaTemplatesManagement /></Suspense> },
      { path: ':eventId/rounds/:roundId', element: <Suspense fallback={<RouteFallback />}><StaffRoundDetail /></Suspense> },
    ]},
    { path: 'users', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><StaffUsersManagement /></Suspense> },
      { path: ':id', element: <Suspense fallback={<RouteFallback />}><StaffUserDetail /></Suspense> },
    ]},
    { path: 'notifications', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><StaffNotificationsManagement /></Suspense> },
      { path: 'create', element: <Suspense fallback={<RouteFallback />}><StaffNotificationsCreate /></Suspense> },
      { path: ':id/edit', element: <Suspense fallback={<RouteFallback />}><StaffNotificationEdit /></Suspense> },
      { path: ':id', element: <Suspense fallback={<RouteFallback />}><StaffNotificationDetail /></Suspense> },
    ]},
    { path: 'teams', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><StaffTeamsManagement /></Suspense> },
      { path: ':id', element: <Suspense fallback={<RouteFallback />}><StaffTeamDetail /></Suspense> },
    ]},
    { path: 'reports', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><StaffReportsManagement /></Suspense> },
      { path: ':id', element: <Suspense fallback={<RouteFallback />}><StaffReportDetail /></Suspense> },
    ]},
    { path: 'leaderboard', element: <Suspense fallback={<RouteFallback />}><StaffChapterLeaderboardPage /></Suspense> },
    { path: 'register-teams/:registerTeamId/edit', element: <Suspense fallback={<RouteFallback />}><StaffRegisterTeamEdit /></Suspense> },
    { path: 'register-teams/:registerTeamId', element: <Suspense fallback={<RouteFallback />}><StaffRegisterTeamDetail /></Suspense> },
    { path: 'submissions/:submissionId', element: <Suspense fallback={<RouteFallback />}><StaffSubmissionDetail /></Suspense> },
    { path: 'my-notifications', element: <Suspense fallback={<RouteFallback />}><StaffMyNotifications /></Suspense> },
    { path: 'profile', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><StaffProfile /></Suspense> },
      { path: 'edit', element: <Suspense fallback={<RouteFallback />}><StaffProfileEdit /></Suspense> },
    ]},
  ]},

  { path: '/login', element: <Suspense fallback={<RouteFallback full />}><LoginPage /></Suspense> },
  { path: '/register', element: <Suspense fallback={<RouteFallback full />}><RegisterPage /></Suspense> },
  { path: '/verify-email', element: <Suspense fallback={<RouteFallback full />}><VerifyEmailPage /></Suspense> },
  { path: '*', element: <Suspense fallback={<RouteFallback full />}><NotFoundPage /></Suspense> },
]
