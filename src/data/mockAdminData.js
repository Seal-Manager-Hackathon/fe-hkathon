import {
  Trophy, Users, UserCheck, Shield,
  GraduationCap, Briefcase,
  Layers, CheckCircle, XCircle, Clock,
} from 'lucide-react'

export const mockAdminNavItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', to: '/admin' },
  { key: 'hackathons', label: 'Hackathons', icon: 'Trophy', to: '/admin/hackathons' },
  { key: 'users', label: 'Users', icon: 'Users', to: '/admin/users' },
]

export const mockAdminUser = {
  name: 'Admin',
  email: 'admin@seal.dev',
  avatarLetter: 'A',
  role: 'Administrator',
}

export const mockAdminMenu = [
  { icon: 'User', label: 'Profile', to: '/admin/profile' },
  { icon: 'Settings', label: 'Settings', to: '/admin/settings' },
  { icon: 'LogOut', label: 'Sign out', to: null },
]

export const statSections = [
  {
    title: 'Hackathons',
    items: [
      { label: 'Total Hackathons', value: 48, icon: 'Trophy', color: 'bg-[#e3f2fd] text-[#1565c0]' },
      { label: 'Published Hackathons', value: 32, icon: 'CheckCircle', color: 'bg-[#e8f5e9] text-[#2e7d32]' },
      { label: 'Draft Hackathons', value: 9, icon: 'Layers', color: 'bg-[#f5f5f5] text-[#757575]' },
      { label: 'Closed Hackathons', value: 7, icon: 'XCircle', color: 'bg-[#e0f2f1] text-[#00695c]' },
    ],
  },
  {
    title: 'Users',
    items: [
      { label: 'Total Users', value: 1284, icon: 'Users', color: 'bg-[#e3f2fd] text-[#1565c0]' },
      { label: 'Student Users', value: 980, icon: 'GraduationCap', color: 'bg-[#e8f5e9] text-[#2e7d32]' },
      { label: 'Lecturer Users', value: 180, icon: 'UserCheck', color: 'bg-[#f3e5f5] text-[#7b1fa2]' },
      { label: 'Staff Users', value: 80, icon: 'Briefcase', color: 'bg-[#fff3e0] text-[#e65100]' },
      { label: 'Admin Users', value: 44, icon: 'Shield', color: 'bg-[#fce4ec] text-[#c62828]' },
    ],
  },
  {
    title: 'Teams',
    items: [
      { label: 'Total Teams', value: 256, icon: 'Users', color: 'bg-[#e3f2fd] text-[#1565c0]' },
      { label: 'Active Teams', value: 198, icon: 'CheckCircle', color: 'bg-[#e8f5e9] text-[#2e7d32]' },
      { label: 'Disabled Teams', value: 38, icon: 'XCircle', color: 'bg-[#f5f5f5] text-[#757575]' },
      { label: 'Pending Teams', value: 20, icon: 'Clock', color: 'bg-[#fff3e0] text-[#e65100]' },
    ],
  },
]

export const recentHackathons = [
  { name: 'SEAL Hackathon 2026 - Summer', season: 'Summer 2026', date: 'Jul 06, 2026', status: 'Draft', teams: 0, prize: '$50,000' },
  { name: 'Cloud Builders Cup 2026', season: 'Spring 2026', date: 'Jun 15, 2026', status: 'Published', teams: 8, prize: '$30,000' },
  { name: 'Cyber Security Arena 2025', season: 'Fall 2025', date: 'Dec 20, 2025', status: 'Closed', teams: 7, prize: '$25,000' },
  { name: 'AI HackFest 2026', season: 'Fall 2026', date: 'Jun 01, 2026', status: 'Upcoming', teams: 0, prize: '$40,000' },
  { name: 'Green Innovators Cup 2025', season: 'Winter 2025', date: 'Nov 10, 2025', status: 'Closed', teams: 5, prize: '$20,000' },
]

export const recentUsers = [
  { name: 'Alex Johnson', email: 'alex@seal.dev', role: 'Student', status: 'Active', submissions: 12, joined: 'Jan 2026' },
  { name: 'Maria Chen', email: 'maria@dev.io', role: 'Student', status: 'Active', submissions: 9, joined: 'Feb 2026' },
  { name: 'David Kim', email: 'david@code.org', role: 'Lecturer', status: 'Active', submissions: 8, joined: 'Mar 2026' },
  { name: 'Sarah Wilson', email: 'sarah@build.dev', role: 'Student', status: 'Inactive', submissions: 7, joined: 'Jan 2026' },
  { name: 'Tech Corp', email: 'team@techcorp.com', role: 'Staff', status: 'Active', submissions: 6, joined: 'Dec 2025' },
]

export const notifications = [
  { id: 1, title: 'SEAL Hackathon 2026 - Summer is now open', body: 'We are excited to announce that SEAL Hackathon 2026 - Summer edition is now accepting submissions. All students and teams are encouraged to register before the deadline on August 15, 2026.', sentBy: 'Admin', date: '2026-07-06' },
  { id: 2, title: 'New round added: Final Pitch', body: 'The Final Pitch round has been added to Cloud Builders Cup 2026. Participants must submit their presentation slides by July 20, 2026.', sentBy: 'Admin', date: '2026-07-05' },
  { id: 3, title: 'System maintenance scheduled', body: 'The platform will undergo scheduled maintenance on July 12, 2026 from 02:00 AM to 06:00 AM UTC.', sentBy: 'Admin', date: '2026-07-03' },
  { id: 4, title: 'New lecturer accounts created', body: '20 new lecturer accounts have been created for the upcoming semester.', sentBy: 'Admin', date: '2026-07-01' },
]

export const allHackathons = [
  { id: 'seal-summer-2026', name: 'SEAL Hackathon 2026 - Summer', year: '2026', season: 'Summer 2026', status: 'Draft', visibility: 'Private', date: 'Jul 06, 2026', prize: '$50,000', teams: 0, location: 'Ho Chi Minh City', description: 'The flagship summer hackathon by SEAL.' },
  { id: 'cloud-builders-2026', name: 'Cloud Builders Cup 2026', year: '2026', season: 'Spring 2026', status: 'Published', visibility: 'Public', date: 'Jun 15, 2026', prize: '$30,000', teams: 8, location: 'Hanoi', description: 'Build cloud-native solutions.' },
  { id: 'cyber-arena-2025', name: 'Cyber Security Arena 2025', year: '2025', season: 'Fall 2025', status: 'Closed', visibility: 'Public', date: 'Dec 20, 2025', prize: '$25,000', teams: 7, location: 'Da Nang', description: 'CTF and red-team challenges.' },
  { id: 'ai-hackfest-2026', name: 'AI HackFest 2026', year: '2026', season: 'Fall 2026', status: 'Upcoming', visibility: 'Public', date: 'Sep 01, 2026', prize: '$40,000', teams: 0, location: 'Ho Chi Minh City', description: 'AI/ML applications.' },
  { id: 'green-cup-2025', name: 'Green Innovators Cup 2025', year: '2025', season: 'Winter 2025', status: 'Closed', visibility: 'Public', date: 'Nov 10, 2025', prize: '$20,000', teams: 5, location: 'Can Tho', description: 'Sustainable Mekong Delta tech.' },
  { id: 'fintech-rush-2026', name: 'FinTech Rush 2026', year: '2026', season: 'Spring 2026', status: 'Published', visibility: 'Public', date: 'May 20, 2026', prize: '$35,000', teams: 12, location: 'Ho Chi Minh City', description: 'Reinventing financial services.' },
  { id: 'web3-builders-2026', name: 'Web3 Builders Hackathon', year: '2026', season: 'Summer 2026', status: 'Draft', visibility: 'Private', date: 'Aug 01, 2026', prize: '$45,000', teams: 0, location: 'Hanoi', description: 'DeFi and smart contracts.' },
  { id: 'edtech-challenge-2026', name: 'EdTech Challenge 2026', year: '2026', season: 'Winter 2026', status: 'Upcoming', visibility: 'Unlisted', date: 'Dec 01, 2026', prize: '$15,000', teams: 0, location: 'Da Nang', description: 'Transforming education.' },
  { id: 'health-hack-2025', name: 'HealthTech Hack 2025', year: '2025', season: 'Summer 2025', status: 'Closed', visibility: 'Public', date: 'Jul 15, 2025', prize: '$28,000', teams: 9, location: 'Hue', description: 'Digital health innovations.' },
  { id: 'iot-smart-city-2026', name: 'IoT Smart City 2026', year: '2026', season: 'Spring 2026', status: 'Published', visibility: 'Public', date: 'Apr 10, 2026', prize: '$22,000', teams: 6, location: 'Ho Chi Minh City', description: 'Connected urban living.' },
  { id: 'game-jam-2026', name: 'Game Jam Championship 2026', year: '2026', season: 'Fall 2026', status: 'Draft', visibility: 'Unlisted', date: 'Oct 01, 2026', prize: '$12,000', teams: 0, location: 'Hanoi', description: '48-hour game dev.' },
  { id: 'data-thon-2026', name: 'DataThon Analytics 2026', year: '2026', season: 'Summer 2026', status: 'Published', visibility: 'Public', date: 'Jun 30, 2026', prize: '$18,000', teams: 4, location: 'Da Nang', description: 'Data science competition.' },
  { id: 'blockchain-battle-2025', name: 'Blockchain Battle 2025', year: '2025', season: 'Fall 2025', status: 'Closed', visibility: 'Public', date: 'Oct 20, 2025', prize: '$33,000', teams: 11, location: 'Ho Chi Minh City', description: 'NFT and DAO solutions.' },
  { id: 'devops-marathon-2026', name: 'DevOps Marathon 2026', year: '2026', season: 'Winter 2026', status: 'Upcoming', visibility: 'Unlisted', date: 'Nov 15, 2026', prize: '$10,000', teams: 0, location: 'Hanoi', description: 'CI/CD and observability.' },
  { id: 'mobile-first-2026', name: 'Mobile First 2026', year: '2026', season: 'Spring 2026', status: 'Published', visibility: 'Public', date: 'Mar 25, 2026', prize: '$27,000', teams: 7, location: 'Ho Chi Minh City', description: 'Cross-platform mobile.' },
  { id: 'quantum-hack-2026', name: 'Quantum Computing Hack 2026', year: '2026', season: 'Summer 2026', status: 'Upcoming', visibility: 'Private', date: 'Sep 15, 2026', prize: '$60,000', teams: 0, location: 'Hanoi', description: 'Quantum algorithms.' },
  { id: 'vr-innovation-2025', name: 'VR Innovation Challenge 2025', year: '2025', season: 'Spring 2025', status: 'Closed', visibility: 'Public', date: 'Mar 10, 2025', prize: '$18,000', teams: 4, location: 'Ho Chi Minh City', description: 'VR/AR experiences.' },
  { id: 'clean-energy-2025', name: 'Clean Energy Hack 2025', year: '2025', season: 'Summer 2025', status: 'Closed', visibility: 'Public', date: 'Aug 20, 2025', prize: '$22,000', teams: 6, location: 'Da Nang', description: 'Renewable energy tech.' },
  { id: 'agri-tech-2026', name: 'AgriTech Challenge 2026', year: '2026', season: 'Fall 2026', status: 'Draft', visibility: 'Unlisted', date: 'Oct 25, 2026', prize: '$16,000', teams: 0, location: 'Can Tho', description: 'Smart farming solutions.' },
  { id: 'women-in-tech-2026', name: 'Women in Tech Hackathon 2026', year: '2026', season: 'Spring 2026', status: 'Published', visibility: 'Public', date: 'Mar 08, 2026', prize: '$25,000', teams: 10, location: 'Ho Chi Minh City', description: 'Empowering women in tech.' },
  { id: 'open-source-sprint-2025', name: 'Open Source Sprint 2025', year: '2025', season: 'Winter 2025', status: 'Closed', visibility: 'Public', date: 'Jan 15, 2025', prize: '$8,000', teams: 14, location: 'Hanoi', description: 'Contribute to open source.' },
  { id: 'robotics-showdown-2026', name: 'Robotics Showdown 2026', year: '2026', season: 'Summer 2026', status: 'Upcoming', visibility: 'Public', date: 'Aug 20, 2026', prize: '$42,000', teams: 0, location: 'Ho Chi Minh City', description: 'Hardware meets software.' },
  { id: 'sustainability-hack-2024', name: 'Sustainability Hack 2024', year: '2024', season: 'Fall 2024', status: 'Closed', visibility: 'Public', date: 'Oct 05, 2024', prize: '$14,000', teams: 8, location: 'Da Nang', description: 'Eco-friendly solutions.' },
  { id: 'medtech-spring-2024', name: 'MedTech Spring 2024', year: '2024', season: 'Spring 2024', status: 'Closed', visibility: 'Public', date: 'Apr 12, 2024', prize: '$19,000', teams: 9, location: 'Hue', description: 'Healthcare innovations.' },
  { id: 'devrel-summit-2026', name: 'DevRel Summit Hack 2026', year: '2026', season: 'Winter 2026', status: 'Draft', visibility: 'Private', date: 'Dec 18, 2026', prize: '$28,000', teams: 0, location: 'Hanoi', description: 'Developer relations tools.' },
]

export const allUsers = [
  { id: 'usr-001', name: 'Alex Johnson', email: 'alex@seal.dev', role: 'Student', status: 'Active', submissions: 12, joined: 'Jan 15, 2026', avatar: 'A' },
  { id: 'usr-002', name: 'Maria Chen', email: 'maria@dev.io', role: 'Student', status: 'Active', submissions: 9, joined: 'Feb 03, 2026', avatar: 'M' },
  { id: 'usr-003', name: 'David Kim', email: 'david@code.org', role: 'Lecturer', status: 'Active', submissions: 8, joined: 'Mar 12, 2026', avatar: 'D' },
  { id: 'usr-004', name: 'Sarah Wilson', email: 'sarah@build.dev', role: 'Student', status: 'Inactive', submissions: 7, joined: 'Jan 20, 2026', avatar: 'S' },
  { id: 'usr-005', name: 'James Brown', email: 'james@hack.io', role: 'Student', status: 'Active', submissions: 15, joined: 'Dec 05, 2025', avatar: 'J' },
  { id: 'usr-006', name: 'Emily Davis', email: 'emily@devlab.com', role: 'Staff', status: 'Active', submissions: 5, joined: 'May 18, 2026', avatar: 'E' },
  { id: 'usr-007', name: 'Michael Lee', email: 'michael@univ.edu', role: 'Lecturer', status: 'Active', submissions: 20, joined: 'Sep 10, 2025', avatar: 'M' },
  { id: 'usr-008', name: 'Lisa Wang', email: 'lisa@startup.co', role: 'Student', status: 'Active', submissions: 6, joined: 'Apr 22, 2026', avatar: 'L' },
  { id: 'usr-009', name: 'Robert Taylor', email: 'robert@corp.com', role: 'Admin', status: 'Active', submissions: 3, joined: 'Aug 30, 2025', avatar: 'R' },
  { id: 'usr-010', name: 'Anna Martinez', email: 'anna@edu.vn', role: 'Student', status: 'Inactive', submissions: 4, joined: 'Jun 01, 2026', avatar: 'A' },
  { id: 'usr-011', name: 'Thomas Nguyen', email: 'thomas@tech.vn', role: 'Student', status: 'Active', submissions: 18, joined: 'Nov 15, 2025', avatar: 'T' },
  { id: 'usr-012', name: 'Sophie Clark', email: 'sophie@ai-lab.io', role: 'Lecturer', status: 'Active', submissions: 14, joined: 'Oct 08, 2025', avatar: 'S' },
  { id: 'usr-013', name: 'Daniel Park', email: 'daniel@fpt.vn', role: 'Staff', status: 'Active', submissions: 2, joined: 'Jul 25, 2026', avatar: 'D' },
  { id: 'usr-014', name: 'Grace Hopper', email: 'grace@binary.dev', role: 'Student', status: 'Active', submissions: 11, joined: 'Mar 30, 2026', avatar: 'G' },
  { id: 'usr-015', name: 'Kevin Tran', email: 'kevin@codex.com', role: 'Student', status: 'Inactive', submissions: 1, joined: 'Feb 14, 2026', avatar: 'K' },
  { id: 'usr-016', name: 'Rachel Green', email: 'rachel@fashion.tech', role: 'Student', status: 'Active', submissions: 7, joined: 'Jan 08, 2026', avatar: 'R' },
  { id: 'usr-017', name: 'Oscar White', email: 'oscar@data.vn', role: 'Lecturer', status: 'Active', submissions: 16, joined: 'Dec 20, 2025', avatar: 'O' },
  { id: 'usr-018', name: 'Hannah Black', email: 'hannah@secure.net', role: 'Staff', status: 'Inactive', submissions: 0, joined: 'Apr 05, 2026', avatar: 'H' },
  { id: 'usr-019', name: 'Victor Lu', email: 'victor@cloud.io', role: 'Student', status: 'Active', submissions: 13, joined: 'Mar 18, 2026', avatar: 'V' },
  { id: 'usr-020', name: 'Nina Patel', email: 'nina@ml-research.org', role: 'Lecturer', status: 'Active', submissions: 22, joined: 'Sep 25, 2025', avatar: 'N' },
  { id: 'usr-021', name: 'Felix Adams', email: 'felix@gamedev.vn', role: 'Student', status: 'Active', submissions: 8, joined: 'May 10, 2026', avatar: 'F' },
  { id: 'usr-022', name: 'Zoe Carter', email: 'zoe@blockchain.dev', role: 'Student', status: 'Active', submissions: 10, joined: 'Jun 20, 2026', avatar: 'Z' },
  { id: 'usr-023', name: 'Admin Master', email: 'admin@seal.dev', role: 'Admin', status: 'Active', submissions: 5, joined: 'Jan 01, 2025', avatar: 'A' },
  { id: 'usr-024', name: 'Ivy Chen', email: 'ivy@edtech.vn', role: 'Staff', status: 'Active', submissions: 4, joined: 'Aug 12, 2026', avatar: 'I' },
  { id: 'usr-025', name: 'Ben Foster', email: 'ben@iot-lab.com', role: 'Student', status: 'Inactive', submissions: 2, joined: 'Jul 01, 2026', avatar: 'B' },
]

export const visibilityBadge = {
  Public: 'bg-[#e8f5e9] text-[#2e7d32]',
  Private: 'bg-[#fce4ec] text-[#c62828]',
  Unlisted: 'bg-[#fff3e0] text-[#e65100]',
}

export const statusBadge = {
  Published: 'bg-[#e8f5e9] text-[#2e7d32]',
  Draft: 'bg-[#f5f5f5] text-[#757575]',
  Closed: 'bg-[#e0f2f1] text-[#00695c]',
  Upcoming: 'bg-[#fff3e0] text-[#e65100]',
}

export const roleBadge = {
  Student: 'bg-[#e3f2fd] text-[#1565c0]',
  Staff: 'bg-[#fff3e0] text-[#e65100]',
  Lecturer: 'bg-[#f3e5f5] text-[#7b1fa2]',
  Admin: 'bg-[#fce4ec] text-[#c62828]',
}

export const userStatusBadge = {
  Active: 'bg-[#e8f5e9] text-[#2e7d32]',
  Inactive: 'bg-[#f5f5f5] text-[#757575]',
}

export const iconMap = {
  Trophy, Users, UserCheck, Shield,
  GraduationCap, Briefcase,
  Layers, CheckCircle, XCircle, Clock,
}
