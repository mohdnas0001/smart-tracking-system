import { KPI, Pillar, DashboardData, AIInsight } from '@/types/srap';

const kpis: KPI[] = [
  {
    id: 'kpi-1',
    name: '3MTT Program Enrollment',
    description: 'Number of citizens enrolled in 3 Million Technical Talents program',
    target: 100000,
    current: 53000,
    unit: 'citizens',
    threshold: {
      excellent: 90,
      good: 70,
      fair: 50,
      poor: 30
    },
    status: 'fair',
    lastUpdated: '2025-09-25',
    evidence: ['LMS enrollment report Q3 2024', 'Regional breakdown data'],
    comments: 'Ongoing registration in northern states. Expected increase in Q4.',
    isLocked: false,
    department: 'DED',
    quarterlyTargets: { Q1: 25000, Q2: 50000, Q3: 75000, Q4: 100000 },
    annualTarget: 100000,
    metricType: '#',
    yearlyTargets: { '2024': 100000, '2025': 120000, '2026': 150000 },
    responsibleDepartment: 'ded',
    dataSource: 'LMS enrollment system',
    reportingFrequency: 'monthly',
    successIndicator: 'Full enrollment capacity reached with balanced regional distribution',
    monthlyData: [
      {
        month: '2024-01',
        value: 8500,
        isApproved: true,
        submittedBy: 'john.doe',
        submittedAt: '2024-01-31T10:00:00Z',
        approvedBy: 'jane.director',
        approvedAt: '2024-02-01T09:00:00Z',
        comments: 'Strong start to the year'
      },
      {
        month: '2024-02', 
        value: 9200,
        isApproved: true,
        submittedBy: 'john.doe',
        submittedAt: '2024-02-29T10:00:00Z',
        approvedBy: 'jane.director',
        approvedAt: '2024-03-01T09:00:00Z'
      },
      {
        month: '2024-03',
        value: 7300,
        isApproved: true,
        submittedBy: 'john.doe',
        submittedAt: '2024-03-31T10:00:00Z',
        approvedBy: 'jane.director',
        approvedAt: '2024-04-01T08:30:00Z'
      },
      {
        month: '2024-09',
        value: 5800,
        isApproved: false,
        submittedBy: 'john.doe',
        submittedAt: '2024-09-30T17:00:00Z',
        comments: 'Pending director approval'
      }
    ]
  },
  {
    id: 'kpi-2',
    name: 'Digital Literacy Rate',
    description: 'Percentage of Nigerian adults with basic digital skills',
    target: 75,
    current: 41,
    unit: '%',
    threshold: {
      excellent: 90,
      good: 70,
      fair: 50,
      poor: 30
    },
    status: 'poor',
    lastUpdated: '2025-09-20',
    evidence: ['NBS digital literacy survey 2024'],
    comments: 'Progress slower than expected. Focus needed on rural areas and female participation.',
    isLocked: false,
    department: 'DLCB',
    metricType: '%',
    yearlyTargets: { '2024': 45, '2025': 55, '2026': 65, '2027': 75 },
    responsibleDepartment: 'dlcb',
    dataSource: 'National Bureau of Statistics digital literacy surveys',
    reportingFrequency: 'quarterly',
    successIndicator: 'Nationwide digital literacy above 75% with balanced gender and regional distribution'
  },
  {
    id: 'kpi-3',
    name: 'Broadband Penetration',
    description: 'Percentage of households with broadband internet access',
    target: 70,
    current: 38,
    unit: '%',
    threshold: {
      excellent: 90,
      good: 70,
      fair: 50,
      poor: 30
    },
    status: 'fair',
    lastUpdated: '2025-09-28',
    evidence: ['NCC infrastructure report', 'Telecom operator data'],
    comments: 'Rural connectivity improving with fiber rollout.',
    isLocked: true,
    department: 'ITIS',
    metricType: '%',
    yearlyTargets: { '2024': 40, '2025': 50, '2026': 60, '2027': 70 },
    responsibleDepartment: 'itis',
    dataSource: 'NCC telecom infrastructure monitoring',
    reportingFrequency: 'monthly',
    successIndicator: 'Universal broadband access across all Nigerian households'
  },
  {
    id: 'kpi-4',
    name: 'Government Digital Services',
    description: 'Number of government services available online',
    target: 200,
    current: 156,
    unit: 'services',
    threshold: {
      excellent: 90,
      good: 70,
      fair: 50,
      poor: 30
    },
    status: 'good',
    lastUpdated: '2025-09-30',
    evidence: ['NITDA digital services audit'],
    comments: 'On track to meet 2025 target.',
    isLocked: false,
    department: 'EGDR',
    metricType: '#',
    yearlyTargets: { '2024': 180, '2025': 200, '2026': 220, '2027': 250 },
    responsibleDepartment: 'egdr',
    dataSource: 'Government services portal analytics',
    reportingFrequency: 'monthly',
    successIndicator: 'All eligible government services digitized and accessible online'
  },
  {
    id: 'kpi-5',
    name: 'Staff Digital Training',
    description: 'Number of government staff trained on digital tools monthly',
    target: 1200,
    current: 856,
    unit: 'staff',
    threshold: {
      excellent: 90,
      good: 70,
      fair: 50,
      poor: 30
    },
    status: 'good',
    lastUpdated: '2025-09-30',
    evidence: ['Training certificates', 'Attendance records'],
    comments: 'Consistent progress across all departments.',
    isLocked: false,
    department: 'HR',
    quarterlyTargets: { Q1: 300, Q2: 600, Q3: 900, Q4: 1200 },
    annualTarget: 1200,
    metricType: '#',
    yearlyTargets: { '2024': 1200, '2025': 1500, '2026': 1800 },
    responsibleDepartment: 'hr',
    dataSource: 'HR training management system',
    reportingFrequency: 'monthly',
    successIndicator: 'All government staff equipped with essential digital skills',
    monthlyData: [
      {
        month: '2024-01',
        value: 98,
        isApproved: true,
        submittedBy: 'hr.admin',
        submittedAt: '2024-01-31T16:00:00Z',
        approvedBy: 'hr.director',
        approvedAt: '2024-02-01T10:00:00Z'
      },
      {
        month: '2024-02',
        value: 105,
        isApproved: true,
        submittedBy: 'hr.admin',
        submittedAt: '2024-02-29T16:00:00Z',
        approvedBy: 'hr.director',
        approvedAt: '2024-03-01T10:00:00Z'
      },
      {
        month: '2024-03',
        value: 97,
        isApproved: true,
        submittedBy: 'hr.admin',
        submittedAt: '2024-03-31T16:00:00Z',
        approvedBy: 'hr.director',
        approvedAt: '2024-04-01T10:00:00Z'
      }
    ]
  },
  {
    id: 'kpi-6',
    name: 'Digital Innovation Index',
    description: 'Nigeria\'s global ranking in digital innovation metrics',
    target: 45,
    current: 78,
    unit: 'rank',
    threshold: {
      excellent: 90,
      good: 70,
      fair: 50,
      poor: 30
    },
    status: 'poor',
    lastUpdated: '2025-08-15',
    evidence: ['World Bank Digital Innovation Index 2024'],
    comments: 'Need significant improvement in innovation ecosystem.',
    isLocked: false,
    department: 'R&D',
    metricType: '#',
    yearlyTargets: { '2024': 70, '2025': 60, '2026': 50, '2027': 45 },
    responsibleDepartment: 'r&d',
    dataSource: 'International innovation ranking reports',
    reportingFrequency: 'quarterly',
    successIndicator: 'Nigeria among top 45 countries in global digital innovation rankings'
  },
  {
    id: 'kpi-7',
    name: 'Cybersecurity Incidents',
    description: 'Number of major cybersecurity incidents reported monthly',
    target: 5,
    current: 12,
    unit: 'incidents',
    threshold: {
      excellent: 90,
      good: 70,
      fair: 50,
      poor: 30
    },
    status: 'poor',
    lastUpdated: '2025-09-30',
    evidence: ['NITDA cybersecurity incident reports'],
    comments: 'Increased threats requiring enhanced monitoring.',
    isLocked: false,
    department: 'CS',
    metricType: '#',
    yearlyTargets: { '2024': 60, '2025': 50, '2026': 40, '2027': 30 },
    responsibleDepartment: 'cs',
    dataSource: 'NITDA cybersecurity monitoring system',
    reportingFrequency: 'monthly',
    successIndicator: 'Minimal cybersecurity incidents with rapid response capabilities'
  },
  {
    id: 'kpi-8',
    name: 'AI Adoption Rate',
    description: 'Percentage of organizations implementing AI solutions',
    target: 15,
    current: 8,
    unit: '%',
    threshold: {
      excellent: 90,
      good: 70,
      fair: 50,
      poor: 30
    },
    status: 'poor',
    lastUpdated: '2025-10-01',
    evidence: ['AI adoption survey Q3 2024'],
    comments: 'Custom KPI created to track emerging technology adoption.',
    isLocked: false,
    department: 'R&D',
    metricType: '%',
    calculationFormula: 'A/B*100 (where A = organizations using AI, B = total surveyed organizations)',
    yearlyTargets: { '2024': 10, '2025': 15, '2026': 25, '2027': 35 },
    responsibleDepartment: 'r&d',
    dataSource: 'National AI adoption survey',
    reportingFrequency: 'quarterly',
    successIndicator: 'Widespread AI adoption across key economic sectors',
    createdBy: 'dg.user',
    createdAt: '2025-09-15T09:00:00Z',
    isCustom: true
  },
  {
    id: 'kpi-9',
    name: 'Digital Payment Transaction Volume',
    description: 'Monthly volume of digital payment transactions (in billions)',
    target: 50,
    current: 32,
    unit: 'billion NGN',
    threshold: {
      excellent: 90,
      good: 70,
      fair: 50,
      poor: 30
    },
    status: 'fair',
    lastUpdated: '2025-10-01',
    evidence: ['CBN payment system statistics'],
    comments: 'Custom KPI to track digital economy growth.',
    isLocked: false,
    department: 'SGF',
    metricType: '$',
    yearlyTargets: { '2024': 40, '2025': 50, '2026': 65, '2027': 80 },
    responsibleDepartment: 'sgf',
    dataSource: 'Central Bank digital payment statistics',
    reportingFrequency: 'monthly',
    successIndicator: 'Digital payments become the primary transaction method',
    createdBy: 'strategy.team',
    createdAt: '2025-09-20T14:30:00Z',
    isCustom: true
  }
];

const pillars: Pillar[] = [
  {
    id: 'pillar-1',
    name: 'Digital Literacy & Skills',
    description: 'Building digital capabilities across Nigerian citizens and government workforce',
    kpis: [kpis[0], kpis[1], kpis[4]], // 3MTT, Digital Literacy, Staff Training
    overallScore: 49,
    status: 'fair',
    objectives: [
      'Achieve 75% digital literacy rate among Nigerian adults',
      'Train 3 million technical talents by 2027',
      'Equip all government staff with digital skills',
      'Establish digital skills certification framework'
    ]
  },
  {
    id: 'pillar-2',
    name: 'Digital Infrastructure',
    description: 'Expanding reliable digital infrastructure nationwide',
    kpis: [kpis[2]], // Broadband Penetration
    overallScore: 54,
    status: 'fair',
    objectives: [
      'Achieve 70% broadband penetration by 2027',
      'Deploy 5G networks in all state capitals',
      'Establish redundant fiber backbone infrastructure',
      'Ensure rural-urban connectivity parity'
    ]
  },
  {
    id: 'pillar-3',
    name: 'Digital Government',
    description: 'Transforming government services through digitalization',
    kpis: [kpis[3]], // Government Digital Services
    overallScore: 78,
    status: 'good',
    objectives: [
      'Digitize all eligible government services',
      'Implement unified citizen identity system',
      'Establish interoperable government systems',
      'Achieve paperless government operations'
    ]
  },
  {
    id: 'pillar-4',
    name: 'Digital Innovation & Entrepreneurship',
    description: 'Fostering digital innovation and startup ecosystem',
    kpis: [kpis[5], kpis[7]], // Digital Innovation Index, AI Adoption Rate
    overallScore: 32,
    status: 'poor',
    objectives: [
      'Establish innovation hubs in all geopolitical zones',
      'Create $1B digital innovation fund',
      'Support 10,000 tech startups by 2027',
      'Achieve top 45 global innovation ranking'
    ]
  },
  {
    id: 'pillar-5',
    name: 'Cybersecurity & Privacy',
    description: 'Ensuring secure and trusted digital environment',
    kpis: [kpis[6]], // Cybersecurity Incidents
    overallScore: 41,
    status: 'poor',
    objectives: [
      'Establish national cybersecurity framework',
      'Create incident response capabilities',
      'Implement data protection regulations',
      'Build cybersecurity workforce capacity'
    ]
  },
  {
    id: 'pillar-6',
    name: 'Digital Economy',
    description: 'Growing Nigeria\'s digital economy contribution to GDP',
    kpis: [kpis[8]], // Digital Payment Transaction Volume
    overallScore: 65,
    status: 'fair',
    objectives: [
      'Achieve 25% digital economy contribution to GDP',
      'Create 5 million digital economy jobs',
      'Establish digital payment infrastructure',
      'Promote e-commerce adoption'
    ]
  },
  {
    id: 'pillar-7',
    name: 'Emerging Technologies',
    description: 'Leveraging AI, IoT, and other emerging technologies',
    kpis: [],
    overallScore: 28,
    status: 'critical',
    objectives: [
      'Develop national AI strategy and framework',
      'Establish IoT infrastructure for smart cities',
      'Create blockchain regulatory framework',
      'Build emerging tech research capabilities'
    ]
  },
  {
    id: 'pillar-8',
    name: 'Digital Inclusion',
    description: 'Ensuring equitable access to digital opportunities',
    kpis: [],
    overallScore: 45,
    status: 'fair',
    objectives: [
      'Bridge rural-urban digital divide',
      'Ensure gender parity in digital access',
      'Support persons with disabilities digital inclusion',
      'Create affordable device access programs'
    ]
  },
  {
    id: 'pillar-9',
    name: 'Smart Cities Initiative',
    description: 'Custom pillar for urban digital transformation projects',
    kpis: [],
    overallScore: 38,
    status: 'poor',
    objectives: [
      'Deploy IoT sensors in major cities',
      'Implement smart traffic management systems',
      'Create digital citizen services portals',
      'Establish public WiFi infrastructure'
    ],
    createdBy: 'dg.user',
    createdAt: '2025-09-10T11:00:00Z',
    isCustom: true,
    order: 9
  }
];

export const mockDashboardData: DashboardData = {
  pillars,
  lastUpdated: '2025-10-02T10:30:00Z',
  nextDeadline: '2025-10-15T23:59:59Z',
  totalKPIs: kpis.length,
  completedKPIs: kpis.filter(kpi => kpi.status === 'excellent' || kpi.status === 'good').length
};

export const aiInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'risk',
    title: '3MTT Program Risk Alert',
    description: 'Current enrollment rate of 53% poses risk to 2025 target achievement. Recommend accelerated recruitment in northern states.',
    severity: 'high',
    pillarId: 'pillar-1',
    kpiId: 'kpi-1'
  },
  {
    id: 'insight-2',
    type: 'recommendation',
    title: 'Digital Literacy Improvement',
    description: 'Focus training programs on rural areas and female participation to accelerate digital literacy growth.',
    severity: 'medium',
    pillarId: 'pillar-1',
    kpiId: 'kpi-2'
  },
  {
    id: 'insight-3',
    type: 'trend',
    title: 'Digital Services Growth',
    description: 'Government digital services showing consistent monthly growth of 8-12 new services.',
    severity: 'low',
    pillarId: 'pillar-3',
    kpiId: 'kpi-4'
  },
  {
    id: 'insight-4',
    type: 'risk',
    title: 'Innovation Ranking Decline',
    description: 'Nigeria\'s innovation ranking has declined. Immediate action needed on innovation ecosystem development.',
    severity: 'high',
    pillarId: 'pillar-4',
    kpiId: 'kpi-6'
  },
  {
    id: 'insight-5',
    type: 'risk',
    title: 'Cybersecurity Threats Increasing',
    description: 'Monthly cybersecurity incidents above target. Enhanced monitoring and response capabilities needed.',
    severity: 'high',
    pillarId: 'pillar-5',
    kpiId: 'kpi-7'
  },
  {
    id: 'insight-6',
    type: 'recommendation',
    title: 'AI Adoption Strategy Needed',
    description: 'Low AI adoption rate indicates need for comprehensive strategy to accelerate technology integration across sectors.',
    severity: 'medium',
    pillarId: 'pillar-4',
    kpiId: 'kpi-8'
  },
  {
    id: 'insight-7',
    type: 'trend',
    title: 'Digital Payments Growth',
    description: 'Steady increase in digital payment volume shows positive trend toward cashless economy.',
    severity: 'low',
    pillarId: 'pillar-6',
    kpiId: 'kpi-9'
  }
];