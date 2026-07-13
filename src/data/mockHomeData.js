export const mockNavItems = [
  { key: 'home', label: 'Home', icon: 'Home', to: '/' },
  { key: 'hackathons', label: 'Hackathons', icon: 'Trophy', to: '/hackathons' },
  { key: 'teams', label: 'Teams', icon: 'Users', to: '/teams' },
  { key: 'leaderboard', label: 'Leaderboard', icon: 'Medal', to: '/leaderboard' },
]

export const mockHackathons = [
  {
    id: 'cloud-builders-2026',
    name: 'Cloud Builders Cup 2026',
    status: 'ended',
    thumbnailColor: '#1a3a4a',
    participants: 28,
    teams: 8,
  },
  {
    id: 'seal-spring-2026',
    name: 'SEAL Hackathon 2026 - Spring',
    status: 'active',
    timeLeft: '24 days left',
    thumbnailColor: '#0d6b7a',
    participants: 30,
    teams: 10,
  },
  {
    id: 'cyber-security-2025',
    name: 'Cyber Security Arena 2025',
    status: 'ended',
    thumbnailColor: '#2a1a3a',
    participants: 22,
    teams: 7,
  },
  {
    id: 'ai-hackfest-2025',
    name: 'AI HackFest 2025',
    status: 'ended',
    thumbnailColor: '#3a1a2a',
    participants: 40,
    teams: 12,
  },
  {
    id: 'green-innovators-2024',
    name: 'Green Innovators Cup 2024',
    status: 'ended',
    thumbnailColor: '#1a3a2a',
    participants: 18,
    teams: 5,
  },
]

export const mockRankingTeams = [
  { id: '1', rank: 1, name: 'SEAL Coders Elite', points: 92, events: 1 },
  { id: '2', rank: 2, name: 'Seed Innovators', points: 90, events: 1 },
  { id: '3', rank: 3, name: 'Cloud Deployers', points: 87, events: 1 },
  { id: '4', rank: 4, name: 'Green Coders', points: 82, events: 1 },
  { id: '5', rank: 5, name: 'FPT Data Miners', points: 72, events: 1 },
  { id: '6', rank: 6, name: 'AI Warriors', points: 68, events: 1 },
  { id: '7', rank: 7, name: 'Blockchain Builders', points: 65, events: 1 },
  { id: '8', rank: 8, name: 'Cyber Defenders', points: 61, events: 1 },
  { id: '9', rank: 9, name: 'Data Wizards', points: 58, events: 1 },
  { id: '10', rank: 10, name: 'UI Crafters', points: 54, events: 1 },
]

export const mockPopularHackathons = [
  {
    id: 'pop-seal-spring-2026',
    name: 'SEAL Hackathon 2026 - Spring',
    status: 'active',
    timeLeft: '24 days left',
    thumbnailColor: '#064f5d',
    participants: 30,
    teams: 10,
    label: 'ACTIVE',
  },
  {
    id: 'pop-seal-summer-2026',
    name: 'SEAL Hackathon 2026 - Summer',
    status: 'upcoming',
    timeLeft: '2 months left',
    thumbnailColor: '#1a5276',
    participants: 17,
    teams: 6,
    label: 'FEATURED',
  },
  {
    id: 'pop-seal-2026',
    name: 'SEAL Hackathon 2026',
    status: 'ended',
    thumbnailColor: '#0e6655',
    participants: 15,
    teams: 7,
    label: 'FEATURED',
  },
  {
    id: 'pop-robotics-2027',
    name: 'Robotics Summit 2027',
    status: 'upcoming',
    timeLeft: '11 months left',
    thumbnailColor: '#1b4f72',
    participants: 3,
    teams: 2,
    label: 'FEATURED',
  },
]

export const mockFooterColumns = [
  {
    title: 'SEAL Hackathon',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Help', href: '#' },
    ],
  },
  {
    title: 'Hackathons',
    links: [
      { label: 'Browse hackathons', href: '#' },
      { label: 'Explore projects', href: '#' },
      { label: 'Host a hackathon', href: '#' },
      { label: 'Hackathon guides', href: '#' },
    ],
  },
  {
    title: 'Portfolio',
    links: [
      { label: 'Your projects', href: '#' },
      { label: 'Your hackathons', href: '#' },
      { label: 'Settings', href: '#' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Twitter', href: '#' },
      { label: 'Discord', href: '#' },
      { label: 'Facebook', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
  },
]

export const mockFooterBottomLinks = [
  { label: 'Community guidelines', href: '#' },
  { label: 'Security', href: '#' },
  { label: 'CA notices', href: '#' },
  { label: 'Privacy policy', href: '#' },
  { label: 'Terms of service', href: '#' },
]

export const mockGuestMenu = [
  { icon: 'LogIn', label: 'Sign in', to: '/login' },
  { icon: 'UserPlus', label: 'Sign up', to: '/register' },
]

export const mockUserMenu = [
  { icon: 'User', label: 'Profile', to: '/profile' },
  { icon: 'Settings', label: 'Settings', to: '/settings' },
  { icon: 'LogOut', label: 'Sign out', to: null },
]

export const mockGuestUser = {
  name: 'Guest visitor',
  email: '',
  avatarLetter: 'G',
}

export const mockAuthUser = {
  name: 'Alex Johnson',
  email: 'alex@seal.dev',
  avatarLetter: 'A',
  role: 'Developer',
}
