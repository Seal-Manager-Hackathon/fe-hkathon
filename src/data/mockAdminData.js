import {
  Trophy, Users, UserCheck, Shield,
  GraduationCap, Briefcase,
  Layers, CheckCircle, XCircle, Clock,
  Bell,
} from 'lucide-react'

export const mockAdminNavItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', to: '/admin' },
  { key: 'hackathons', label: 'Hackathons', icon: 'Trophy', to: '/admin/hackathons' },
  { key: 'users', label: 'Users', icon: 'Users', to: '/admin/users' },
  { key: 'notifications', label: 'Notifications', icon: 'Bell', to: '/admin/notifications' },
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

export const hackathonRounds = {
  'cloud-builders-2026': [
    { id: 'r1', name: 'Qualification Round', startDate: 'Jun 15, 2026', endDate: 'Jun 22, 2026', status: 'Completed', teams: 32 },
    { id: 'r2', name: 'Semi-Final', startDate: 'Jun 25, 2026', endDate: 'Jul 02, 2026', status: 'Completed', teams: 16 },
    { id: 'r3', name: 'Final Round', startDate: 'Jul 08, 2026', endDate: 'Jul 10, 2026', status: 'Active', teams: 8 },
  ],
  'fintech-rush-2026': [
    { id: 'r1', name: 'Ideation Phase', startDate: 'May 20, 2026', endDate: 'May 28, 2026', status: 'Completed', teams: 45 },
    { id: 'r2', name: 'Prototype Round', startDate: 'Jun 01, 2026', endDate: 'Jun 10, 2026', status: 'Completed', teams: 20 },
    { id: 'r3', name: 'Final Pitch', startDate: 'Jun 15, 2026', endDate: 'Jun 16, 2026', status: 'Upcoming', teams: 12 },
  ],
  'mobile-first-2026': [
    { id: 'r1', name: 'Design Sprint', startDate: 'Mar 25, 2026', endDate: 'Apr 01, 2026', status: 'Completed', teams: 20 },
    { id: 'r2', name: 'Development Phase', startDate: 'Apr 03, 2026', endDate: 'Apr 17, 2026', status: 'Completed', teams: 14 },
    { id: 'r3', name: 'Final Demo', startDate: 'Apr 20, 2026', endDate: 'Apr 22, 2026', status: 'Completed', teams: 7 },
  ],
  'iot-smart-city-2026': [
    { id: 'r1', name: 'Problem Discovery', startDate: 'Apr 10, 2026', endDate: 'Apr 17, 2026', status: 'Completed', teams: 18 },
    { id: 'r2', name: 'Hackathon Weekend', startDate: 'Apr 20, 2026', endDate: 'Apr 22, 2026', status: 'Active', teams: 12 },
    { id: 'r3', name: 'Public Demo Day', startDate: 'Apr 30, 2026', endDate: 'May 01, 2026', status: 'Upcoming', teams: 6 },
  ],
  'data-thon-2026': [
    { id: 'r1', name: 'Data Exploration', startDate: 'Jun 30, 2026', endDate: 'Jul 06, 2026', status: 'Completed', teams: 12 },
    { id: 'r2', name: 'Model Building', startDate: 'Jul 08, 2026', endDate: 'Jul 20, 2026', status: 'Active', teams: 8 },
    { id: 'r3', name: 'Presentation & Judging', startDate: 'Jul 22, 2026', endDate: 'Jul 24, 2026', status: 'Upcoming', teams: 4 },
  ],
}

export const roundStatusBadge = {
  Completed: 'bg-[#e8f5e9] text-[#2e7d32]',
  Active: 'bg-[#e3f2fd] text-[#1565c0]',
  Upcoming: 'bg-[#fff3e0] text-[#e65100]',
}

export const hackathonTracks = {
  'cloud-builders-2026': [
    {
      id: 't1', name: 'Cloud Infrastructure', topics: [
        { id: 'tp1', name: 'Serverless Architecture', teams: 5 },
        { id: 'tp2', name: 'Kubernetes & Containers', teams: 7 },
        { id: 'tp3', name: 'Multi-Cloud Strategy', teams: 3 },
      ],
    },
    {
      id: 't2', name: 'DevOps & Automation', topics: [
        { id: 'tp4', name: 'CI/CD Pipelines', teams: 6 },
        { id: 'tp5', name: 'Infrastructure as Code', teams: 4 },
      ],
    },
    {
      id: 't3', name: 'Cloud Security', topics: [
        { id: 'tp6', name: 'Zero Trust Architecture', teams: 3 },
        { id: 'tp7', name: 'Cloud Compliance', teams: 4 },
      ],
    },
  ],
  'fintech-rush-2026': [
    {
      id: 't1', name: 'Payments & Transactions', topics: [
        { id: 'tp1', name: 'Real-time Payments', teams: 4 },
        { id: 'tp2', name: 'Cross-border Settlement', teams: 3 },
      ],
    },
    {
      id: 't2', name: 'Blockchain & DeFi', topics: [
        { id: 'tp3', name: 'Smart Contracts', teams: 5 },
        { id: 'tp4', name: 'Tokenization', teams: 3 },
      ],
    },
    {
      id: 't3', name: 'RegTech', topics: [
        { id: 'tp5', name: 'KYC/AML Automation', teams: 2 },
        { id: 'tp6', name: 'Fraud Detection', teams: 3 },
      ],
    },
  ],
  'mobile-first-2026': [
    {
      id: 't1', name: 'iOS Development', topics: [
        { id: 'tp1', name: 'SwiftUI Modern Apps', teams: 3 },
        { id: 'tp2', name: 'ARKit Experiences', teams: 2 },
      ],
    },
    {
      id: 't2', name: 'Android Development', topics: [
        { id: 'tp3', name: 'Jetpack Compose UI', teams: 4 },
        { id: 'tp4', name: 'Kotlin Multiplatform', teams: 3 },
      ],
    },
  ],
  'iot-smart-city-2026': [
    {
      id: 't1', name: 'Smart Infrastructure', topics: [
        { id: 'tp1', name: 'Traffic Management', teams: 4 },
        { id: 'tp2', name: 'Energy Monitoring', teams: 3 },
      ],
    },
    {
      id: 't2', name: 'Public Safety', topics: [
        { id: 'tp3', name: 'Emergency Response', teams: 3 },
        { id: 'tp4', name: 'Air Quality Sensors', teams: 2 },
      ],
    },
  ],
  'data-thon-2026': [
    {
      id: 't1', name: 'Predictive Analytics', topics: [
        { id: 'tp1', name: 'Time Series Forecasting', teams: 3 },
        { id: 'tp2', name: 'Customer Segmentation', teams: 2 },
      ],
    },
    {
      id: 't2', name: 'NLP & Text Mining', topics: [
        { id: 'tp3', name: 'Sentiment Analysis', teams: 2 },
        { id: 'tp4', name: 'Document Classification', teams: 1 },
      ],
    },
  ],
}

export const hackathonTeams = {
  'cloud-builders-2026': [
    { id: 'tm1', name: 'Cloud Ninjas', leader: 'Alex Johnson', members: 4, registered: 'Jun 10, 2026', status: 'Confirmed' },
    { id: 'tm2', name: 'Serverless Heroes', leader: 'Maria Chen', members: 3, registered: 'Jun 11, 2026', status: 'Confirmed' },
    { id: 'tm3', name: 'K8s Warriors', leader: 'Thomas Nguyen', members: 5, registered: 'Jun 12, 2026', status: 'Pending' },
    { id: 'tm4', name: 'DevOps Squad', leader: 'Grace Hopper', members: 4, registered: 'Jun 13, 2026', status: 'Confirmed' },
    { id: 'tm5', name: 'Security Gurus', leader: 'Victor Lu', members: 3, registered: 'Jun 14, 2026', status: 'Rejected' },
    { id: 'tm6', name: 'Cloud Architects', leader: 'Felix Adams', members: 5, registered: 'Jun 14, 2026', status: 'Confirmed' },
    { id: 'tm7', name: 'Infra Masters', leader: 'Zoe Carter', members: 4, registered: 'Jun 15, 2026', status: 'Pending' },
    { id: 'tm8', name: 'Pipeline Pros', leader: 'Rachel Green', members: 3, registered: 'Jun 15, 2026', status: 'Confirmed' },
    { id: 'tm9', name: 'Container Crew', leader: 'Kevin Tran', members: 4, registered: 'Jun 16, 2026', status: 'Confirmed' },
    { id: 'tm10', name: 'Cloud Force', leader: 'James Brown', members: 5, registered: 'Jun 16, 2026', status: 'Pending' },
    { id: 'tm11', name: 'Lambda Legends', leader: 'Anna Martinez', members: 3, registered: 'Jun 17, 2026', status: 'Confirmed' },
    { id: 'tm12', name: 'S3 Savants', leader: 'Lisa Wang', members: 4, registered: 'Jun 17, 2026', status: 'Rejected' },
  ],
  'fintech-rush-2026': [
    { id: 'tm1', name: 'PayTech Innovators', leader: 'Sarah Wilson', members: 4, registered: 'May 15, 2026', status: 'Confirmed' },
    { id: 'tm2', name: 'BlockPay', leader: 'David Kim', members: 5, registered: 'May 16, 2026', status: 'Confirmed' },
    { id: 'tm3', name: 'FinLedger', leader: 'Emily Davis', members: 3, registered: 'May 17, 2026', status: 'Pending' },
    { id: 'tm4', name: 'CryptoFlow', leader: 'Daniel Park', members: 4, registered: 'May 18, 2026', status: 'Confirmed' },
    { id: 'tm5', name: 'RegChain', leader: 'Michael Lee', members: 5, registered: 'May 19, 2026', status: 'Rejected' },
    { id: 'tm6', name: 'SmartTransact', leader: 'Nina Patel', members: 4, registered: 'May 19, 2026', status: 'Confirmed' },
    { id: 'tm7', name: 'DeFi Masters', leader: 'Oscar White', members: 3, registered: 'May 20, 2026', status: 'Confirmed' },
    { id: 'tm8', name: 'TokenX', leader: 'Sophie Clark', members: 4, registered: 'May 20, 2026', status: 'Pending' },
    { id: 'tm9', name: 'PaySync', leader: 'Hannah Black', members: 5, registered: 'May 21, 2026', status: 'Confirmed' },
    { id: 'tm10', name: 'LedgerLab', leader: 'Robert Taylor', members: 4, registered: 'May 21, 2026', status: 'Confirmed' },
    { id: 'tm11', name: 'CoinBridge', leader: 'Ben Foster', members: 3, registered: 'May 22, 2026', status: 'Pending' },
    { id: 'tm12', name: 'FinGuard', leader: 'Ivy Chen', members: 4, registered: 'May 22, 2026', status: 'Confirmed' },
  ],
  'mobile-first-2026': [
    { id: 'tm1', name: 'Swift Squad', leader: 'Lisa Wang', members: 4, registered: 'Mar 20, 2026', status: 'Confirmed' },
    { id: 'tm2', name: 'FlutterFlow', leader: 'James Brown', members: 3, registered: 'Mar 21, 2026', status: 'Confirmed' },
    { id: 'tm3', name: 'React Native Crew', leader: 'Anna Martinez', members: 5, registered: 'Mar 22, 2026', status: 'Pending' },
    { id: 'tm4', name: 'Kotlin Knights', leader: 'Kevin Tran', members: 4, registered: 'Mar 22, 2026', status: 'Confirmed' },
    { id: 'tm5', name: 'Mobile Mavericks', leader: 'Felix Adams', members: 3, registered: 'Mar 23, 2026', status: 'Confirmed' },
    { id: 'tm6', name: 'App Architects', leader: 'Rachel Green', members: 4, registered: 'Mar 24, 2026', status: 'Rejected' },
    { id: 'tm7', name: 'UX Unicorns', leader: 'Nina Patel', members: 3, registered: 'Mar 24, 2026', status: 'Confirmed' },
  ],
  'iot-smart-city-2026': [
    { id: 'tm1', name: 'Sensor Squad', leader: 'Thomas Nguyen', members: 4, registered: 'Apr 08, 2026', status: 'Confirmed' },
    { id: 'tm2', name: 'Grid Guardians', leader: 'Grace Hopper', members: 3, registered: 'Apr 09, 2026', status: 'Confirmed' },
    { id: 'tm3', name: 'Traffic Tamers', leader: 'Victor Lu', members: 5, registered: 'Apr 09, 2026', status: 'Pending' },
    { id: 'tm4', name: 'AirAlert', leader: 'Zoe Carter', members: 3, registered: 'Apr 10, 2026', status: 'Confirmed' },
    { id: 'tm5', name: 'CityLab', leader: 'Daniel Park', members: 4, registered: 'Apr 10, 2026', status: 'Pending' },
    { id: 'tm6', name: 'Smart Streets', leader: 'Ben Foster', members: 3, registered: 'Apr 11, 2026', status: 'Confirmed' },
  ],
  'data-thon-2026': [
    { id: 'tm1', name: 'Data Wizards', leader: 'Alex Johnson', members: 3, registered: 'Jun 28, 2026', status: 'Confirmed' },
    { id: 'tm2', name: 'ML Magicians', leader: 'Sophie Clark', members: 4, registered: 'Jun 29, 2026', status: 'Confirmed' },
    { id: 'tm3', name: 'Stats Stars', leader: 'Oscar White', members: 3, registered: 'Jun 29, 2026', status: 'Pending' },
    { id: 'tm4', name: 'NLP Ninjas', leader: 'Michael Lee', members: 2, registered: 'Jun 30, 2026', status: 'Confirmed' },
  ],
}

export const teamStatusBadge = {
  Confirmed: 'bg-[#e8f5e9] text-[#2e7d32]',
  Pending: 'bg-[#fff3e0] text-[#e65100]',
  Rejected: 'bg-[#fce4ec] text-[#c62828]',
}

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
  Bell,
}

// ---------- Notifications ----------

export const allNotifications = [
  { id: 1, title: 'SEAL Hackathon 2026 - Summer is now open', body: 'We are excited to announce that SEAL Hackathon 2026 - Summer edition is now accepting submissions. All students and teams are encouraged to register before the deadline on August 15, 2026.', type: 'Announcement', audience: 'All Users', sentBy: 'Admin', date: '2026-07-06', status: 'Sent' },
  { id: 2, title: 'New round added: Final Pitch', body: 'The Final Pitch round has been added to Cloud Builders Cup 2026. Participants must submit their presentation slides by July 20, 2026.', type: 'Update', audience: 'Participants', sentBy: 'Admin', date: '2026-07-05', status: 'Sent' },
  { id: 3, title: 'System maintenance scheduled', body: 'The platform will undergo scheduled maintenance on July 12, 2026 from 02:00 AM to 06:00 AM UTC. During this time, all services will be temporarily unavailable.', type: 'Alert', audience: 'All Users', sentBy: 'Admin', date: '2026-07-03', status: 'Sent' },
  { id: 4, title: 'New lecturer accounts created', body: '20 new lecturer accounts have been created for the upcoming semester. Please verify the account list in the Users section.', type: 'Update', audience: 'Staff', sentBy: 'Admin', date: '2026-07-01', status: 'Sent' },
  { id: 5, title: 'Registration deadline extended', body: 'The registration deadline for Cloud Builders Cup 2026 has been extended to July 18, 2026. Spread the word!', type: 'Announcement', audience: 'All Users', sentBy: 'Admin', date: '2026-06-28', status: 'Sent' },
  { id: 6, title: 'Judging criteria updated', body: 'The judging criteria for the upcoming FinTech Rush 2026 has been updated. Please review the new rubric in the hackathon details page.', type: 'Update', audience: 'Participants', sentBy: 'Admin', date: '2026-06-25', status: 'Sent' },
  { id: 7, title: 'Platform upgrade completed', body: 'The platform has been successfully upgraded to version 3.2. New features include improved team management and enhanced dashboard analytics.', type: 'Alert', audience: 'All Users', sentBy: 'Admin', date: '2026-06-20', status: 'Sent' },
  { id: 8, title: 'Upcoming: AI HackFest 2026 early bird', body: 'Early bird registration for AI HackFest 2026 will open on July 15, 2026. Discounted rates available for the first 50 teams.', type: 'Announcement', audience: 'All Users', sentBy: 'Admin', date: '2026-07-10', status: 'Draft' },
  { id: 9, title: 'Team formation guidelines', body: 'Please review the updated team formation guidelines. Teams must have a minimum of 2 and a maximum of 5 members. Cross-disciplinary teams are encouraged.', type: 'Update', audience: 'All Users', sentBy: 'Admin', date: '2026-07-08', status: 'Draft' },
  { id: 10, title: 'Winner announcement: Cyber Security Arena 2025', body: 'Congratulations to Security Gurus for winning Cyber Security Arena 2025! Full results and prize distribution details are now available.', type: 'Announcement', audience: 'All Users', sentBy: 'Admin', date: '2025-12-28', status: 'Sent' },
  { id: 11, title: 'Holiday schedule notice', body: 'The platform support team will operate on reduced hours during the holiday period from December 24-26, 2025.', type: 'Alert', audience: 'All Users', sentBy: 'Admin', date: '2025-12-20', status: 'Sent' },
  { id: 12, title: 'New feature: Team chat released', body: 'We are excited to announce the release of team chat! Teams can now communicate directly within the platform. Check it out in your team dashboard.', type: 'Announcement', audience: 'All Users', sentBy: 'Admin', date: '2025-12-01', status: 'Sent' },
]

export const notificationTypeBadge = {
  Announcement: 'bg-[#e3f2fd] text-[#1565c0]',
  Update: 'bg-[#e8f5e9] text-[#2e7d32]',
  Alert: 'bg-[#fce4ec] text-[#c62828]',
}

export const notificationStatusBadge = {
  Sent: 'bg-[#e8f5e9] text-[#2e7d32]',
  Draft: 'bg-[#f5f5f5] text-[#757575]',
}
