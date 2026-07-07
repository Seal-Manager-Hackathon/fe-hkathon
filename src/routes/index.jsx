import { lazy, Suspense } from 'react'
import RouteFallback from '../components/RouteFallback'

const StudentLayout = lazy(() => import('../layouts/StudentLayout'))

const HomePage = lazy(() => import('../pages/student/home/HomePage'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
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
const TrackCreate = lazy(() => import('../pages/admin/hackathons/tracks/TrackCreate'))
const TrackDetail = lazy(() => import('../pages/admin/hackathons/tracks/TrackDetail'))
const TrackEdit = lazy(() => import('../pages/admin/hackathons/tracks/TrackEdit'))
const TopicsManagement = lazy(() => import('../pages/admin/hackathons/tracks/TopicsManagement'))
const TopicCreate = lazy(() => import('../pages/admin/hackathons/tracks/TopicCreate'))
const TopicDetail = lazy(() => import('../pages/admin/hackathons/tracks/TopicDetail'))
const TopicEdit = lazy(() => import('../pages/admin/hackathons/tracks/TopicEdit'))
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
const MyNotifications = lazy(() => import('../pages/admin/notifications/MyNotifications'))
const AdminProfile = lazy(() => import('../pages/admin/profile/AdminProfile'))
const AdminProfileEdit = lazy(() => import('../pages/admin/profile/AdminProfileEdit'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export const routes = [
  { path: '/', element: <Suspense fallback={<RouteFallback full />}><StudentLayout /></Suspense>, children: [
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
    { path: 'rounds/:roundId/edit', element: <Suspense fallback={<RouteFallback />}><RoundEdit /></Suspense> },
    { path: 'rounds/:roundId/criteria-templates', element: <Suspense fallback={<RouteFallback />}><CriteriaTemplatesManagement /></Suspense> },
    { path: 'rounds/:roundId', element: <Suspense fallback={<RouteFallback />}><RoundDetail /></Suspense> },
    { path: 'my-notifications', element: <Suspense fallback={<RouteFallback />}><MyNotifications /></Suspense> },
    { path: 'profile', children: [
      { index: true, element: <Suspense fallback={<RouteFallback />}><AdminProfile /></Suspense> },
      { path: 'edit', element: <Suspense fallback={<RouteFallback />}><AdminProfileEdit /></Suspense> },
    ]},
  ]},
  { path: '/login', element: <Suspense fallback={<RouteFallback full />}><LoginPage /></Suspense> },
  { path: '/register', element: <Suspense fallback={<RouteFallback full />}><RegisterPage /></Suspense> },
  { path: '/verify-email', element: <Suspense fallback={<RouteFallback full />}><VerifyEmailPage /></Suspense> },
  { path: '*', element: <Suspense fallback={<RouteFallback full />}><NotFoundPage /></Suspense> },
]
