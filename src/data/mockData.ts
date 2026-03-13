export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  location: string;
  salaryRange: string;
  sponsorship: boolean;
  greencardSupport: boolean;
  matchScore: number;
  postedDate: string;
  description: string;
  requirements: string[];
  matchReasons: string[];
  experienceLevel: string;
  industry: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  petitions: number;
  approvalRate: number;
  avgSalary: number;
  trend: 'up' | 'down' | 'flat';
  topRoles: string[];
  locations: string[];
  history: { year: string; petitions: number }[];
}

export interface Alumni {
  id: string;
  name: string;
  initials: string;
  university: string;
  company: string;
  role: string;
  gradYear: string;
  sponsors: boolean;
}

const companies: Company[] = [
  {
    id: 'c1', name: 'Google', logo: 'https://logo.clearbit.com/google.com', industry: 'Technology',
    petitions: 24512, approvalRate: 99.1, avgSalary: 192500, trend: 'up',
    topRoles: ['Software Engineer', 'Data Scientist', 'Product Manager'], locations: ['Mountain View, CA', 'New York, NY', 'Seattle, WA'],
    history: [{ year: '2023', petitions: 22000 }, { year: '2024', petitions: 23500 }, { year: '2025', petitions: 24512 }]
  },
  {
    id: 'c2', name: 'Meta', logo: 'https://logo.clearbit.com/meta.com', industry: 'Technology',
    petitions: 18340, approvalRate: 97.8, avgSalary: 185000, trend: 'up',
    topRoles: ['Software Engineer', 'Data Engineer', 'Research Scientist'], locations: ['Menlo Park, CA', 'New York, NY', 'Seattle, WA'],
    history: [{ year: '2023', petitions: 15000 }, { year: '2024', petitions: 17000 }, { year: '2025', petitions: 18340 }]
  },
  {
    id: 'c3', name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com', industry: 'Retail & E-commerce',
    petitions: 32100, approvalRate: 98.4, avgSalary: 168400, trend: 'up',
    topRoles: ['Software Dev Engineer', 'Applied Scientist', 'Data Engineer'], locations: ['Seattle, WA', 'Arlington, VA', 'Austin, TX'],
    history: [{ year: '2023', petitions: 30000 }, { year: '2024', petitions: 31000 }, { year: '2025', petitions: 32100 }]
  },
  {
    id: 'c4', name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com', industry: 'Technology',
    petitions: 21400, approvalRate: 99.5, avgSalary: 175000, trend: 'flat',
    topRoles: ['Software Engineer', 'Program Manager', 'Data Scientist'], locations: ['Redmond, WA', 'Sunnyvale, CA', 'Atlanta, GA'],
    history: [{ year: '2023', petitions: 21000 }, { year: '2024', petitions: 21500 }, { year: '2025', petitions: 21400 }]
  },
  {
    id: 'c5', name: 'Stripe', logo: 'https://logo.clearbit.com/stripe.com', industry: 'Finance',
    petitions: 1200, approvalRate: 99.0, avgSalary: 210000, trend: 'up',
    topRoles: ['Software Engineer', 'Data Scientist', 'Product Manager'], locations: ['San Francisco, CA', 'Seattle, WA', 'Remote'],
    history: [{ year: '2023', petitions: 900 }, { year: '2024', petitions: 1050 }, { year: '2025', petitions: 1200 }]
  },
  {
    id: 'c6', name: 'Databricks', logo: 'https://logo.clearbit.com/databricks.com', industry: 'Technology',
    petitions: 850, approvalRate: 98.5, avgSalary: 220000, trend: 'up',
    topRoles: ['Software Engineer', 'Solutions Architect', 'Data Scientist'], locations: ['San Francisco, CA', 'Remote'],
    history: [{ year: '2023', petitions: 600 }, { year: '2024', petitions: 750 }, { year: '2025', petitions: 850 }]
  },
  {
    id: 'c7', name: 'Coinbase', logo: 'https://logo.clearbit.com/coinbase.com', industry: 'Finance',
    petitions: 450, approvalRate: 97.0, avgSalary: 195000, trend: 'down',
    topRoles: ['Software Engineer', 'Security Engineer', 'Data Scientist'], locations: ['Remote'],
    history: [{ year: '2023', petitions: 600 }, { year: '2024', petitions: 500 }, { year: '2025', petitions: 450 }]
  },
  {
    id: 'c8', name: 'Scale AI', logo: 'https://logo.clearbit.com/scale.com', industry: 'Technology',
    petitions: 320, approvalRate: 96.5, avgSalary: 180000, trend: 'up',
    topRoles: ['Machine Learning Engineer', 'Software Engineer', 'Operations'], locations: ['San Francisco, CA', 'Remote'],
    history: [{ year: '2023', petitions: 150 }, { year: '2024', petitions: 250 }, { year: '2025', petitions: 320 }]
  },
  {
    id: 'c9', name: 'Apple', logo: 'https://logo.clearbit.com/apple.com', industry: 'Technology',
    petitions: 15200, approvalRate: 99.2, avgSalary: 185000, trend: 'up',
    topRoles: ['Hardware Engineer', 'Software Engineer', 'Data Scientist'], locations: ['Cupertino, CA', 'Austin, TX', 'Seattle, WA'],
    history: [{ year: '2023', petitions: 14000 }, { year: '2024', petitions: 14500 }, { year: '2025', petitions: 15200 }]
  },
  {
    id: 'c10', name: 'Netflix', logo: 'https://logo.clearbit.com/netflix.com', industry: 'Entertainment',
    petitions: 800, approvalRate: 99.0, avgSalary: 250000, trend: 'flat',
    topRoles: ['Senior Software Engineer', 'Data Scientist', 'UI Engineer'], locations: ['Los Gatos, CA', 'Los Angeles, CA'],
    history: [{ year: '2023', petitions: 750 }, { year: '2024', petitions: 820 }, { year: '2025', petitions: 800 }]
  },
  {
    id: 'c11', name: 'Airbnb', logo: 'https://logo.clearbit.com/airbnb.com', industry: 'Travel',
    petitions: 950, approvalRate: 98.8, avgSalary: 205000, trend: 'up',
    topRoles: ['Software Engineer', 'Data Scientist', 'Product Manager'], locations: ['San Francisco, CA', 'Seattle, WA', 'Remote'],
    history: [{ year: '2023', petitions: 700 }, { year: '2024', petitions: 850 }, { year: '2025', petitions: 950 }]
  },
  {
    id: 'c12', name: 'Uber', logo: 'https://logo.clearbit.com/uber.com', industry: 'Transportation',
    petitions: 2100, approvalRate: 98.5, avgSalary: 185000, trend: 'up',
    topRoles: ['Software Engineer', 'Data Scientist', 'Applied Scientist'], locations: ['San Francisco, CA', 'Seattle, WA', 'New York, NY'],
    history: [{ year: '2023', petitions: 1800 }, { year: '2024', petitions: 1950 }, { year: '2025', petitions: 2100 }]
  },
  {
    id: 'c13', name: 'DoorDash', logo: 'https://logo.clearbit.com/doordash.com', industry: 'Food Delivery',
    petitions: 1100, approvalRate: 98.2, avgSalary: 190000, trend: 'up',
    topRoles: ['Software Engineer', 'Data Scientist', 'Product Manager'], locations: ['San Francisco, CA', 'Seattle, WA', 'New York, NY'],
    history: [{ year: '2023', petitions: 800 }, { year: '2024', petitions: 950 }, { year: '2025', petitions: 1100 }]
  },
  {
    id: 'c14', name: 'Snowflake', logo: 'https://logo.clearbit.com/snowflake.com', industry: 'Technology',
    petitions: 650, approvalRate: 99.1, avgSalary: 215000, trend: 'up',
    topRoles: ['Software Engineer', 'Data Engineer', 'Product Manager'], locations: ['San Mateo, CA', 'Bellevue, WA', 'Remote'],
    history: [{ year: '2023', petitions: 400 }, { year: '2024', petitions: 550 }, { year: '2025', petitions: 650 }]
  },
  {
    id: 'c15', name: 'Palantir', logo: 'https://logo.clearbit.com/palantir.com', industry: 'Technology',
    petitions: 450, approvalRate: 97.5, avgSalary: 175000, trend: 'flat',
    topRoles: ['Forward Deployed Engineer', 'Software Engineer', 'Data Scientist'], locations: ['Denver, CO', 'New York, NY', 'Palo Alto, CA'],
    history: [{ year: '2023', petitions: 420 }, { year: '2024', petitions: 460 }, { year: '2025', petitions: 450 }]
  },
  {
    id: 'c16', name: 'Robinhood', logo: 'https://logo.clearbit.com/robinhood.com', industry: 'Finance',
    petitions: 350, approvalRate: 98.0, avgSalary: 195000, trend: 'down',
    topRoles: ['Software Engineer', 'Data Scientist', 'Security Engineer'], locations: ['Menlo Park, CA', 'Seattle, WA', 'Remote'],
    history: [{ year: '2023', petitions: 500 }, { year: '2024', petitions: 400 }, { year: '2025', petitions: 350 }]
  },
  {
    id: 'c17', name: 'Plaid', logo: 'https://logo.clearbit.com/plaid.com', industry: 'Finance',
    petitions: 250, approvalRate: 98.5, avgSalary: 200000, trend: 'up',
    topRoles: ['Software Engineer', 'Data Scientist', 'Product Manager'], locations: ['San Francisco, CA', 'New York, NY', 'Remote'],
    history: [{ year: '2023', petitions: 150 }, { year: '2024', petitions: 200 }, { year: '2025', petitions: 250 }]
  },
  {
    id: 'c18', name: 'Roku', logo: 'https://logo.clearbit.com/roku.com', industry: 'Entertainment',
    petitions: 400, approvalRate: 98.2, avgSalary: 180000, trend: 'flat',
    topRoles: ['Software Engineer', 'Data Scientist', 'Product Manager'], locations: ['San Jose, CA', 'Austin, TX', 'Remote'],
    history: [{ year: '2023', petitions: 380 }, { year: '2024', petitions: 410 }, { year: '2025', petitions: 400 }]
  },
  {
    id: 'c19', name: 'Zillow', logo: 'https://logo.clearbit.com/zillow.com', industry: 'Real Estate',
    petitions: 300, approvalRate: 98.0, avgSalary: 170000, trend: 'down',
    topRoles: ['Software Engineer', 'Data Scientist', 'Applied Scientist'], locations: ['Seattle, WA', 'San Francisco, CA', 'Remote'],
    history: [{ year: '2023', petitions: 450 }, { year: '2024', petitions: 350 }, { year: '2025', petitions: 300 }]
  },
  {
    id: 'c20', name: 'Instacart', logo: 'https://logo.clearbit.com/instacart.com', industry: 'Food Delivery',
    petitions: 550, approvalRate: 98.4, avgSalary: 195000, trend: 'up',
    topRoles: ['Software Engineer', 'Data Scientist', 'Machine Learning Engineer'], locations: ['San Francisco, CA', 'Remote'],
    history: [{ year: '2023', petitions: 400 }, { year: '2024', petitions: 480 }, { year: '2025', petitions: 550 }]
  }
];

const generateJobs = (): Job[] => {
  const jobs: Job[] = [];
  const roles = ['Software Engineer', 'Backend Engineer', 'Frontend Engineer', 'Full Stack Developer', 'Machine Learning Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'Security Engineer', 'Data Engineer'];
  const levels = ['Intern', 'Entry Level', 'Mid Level', 'Senior', 'Staff', 'Principal'];
  const locations = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Remote', 'Mountain View, CA', 'Menlo Park, CA', 'Redmond, WA'];
  
  for (let i = 1; i <= 35; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const isRemote = Math.random() > 0.7 || location === 'Remote';
    const locString = isRemote && location !== 'Remote' ? `${location} (Remote)` : location;
    const baseSalary = 100000 + Math.floor(Math.random() * 100000);
    const maxSalary = baseSalary + 30000 + Math.floor(Math.random() * 50000);
    const sponsorship = Math.random() > 0.15; // 85% sponsor
    
    jobs.push({
      id: `j${i}`,
      companyId: company.id,
      companyName: company.name,
      companyLogo: company.logo,
      title: `${level === 'Entry Level' || level === 'Intern' ? '' : level} ${role}`.trim(),
      location: locString,
      salaryRange: `$${Math.floor(baseSalary/1000)}k - $${Math.floor(maxSalary/1000)}k`,
      sponsorship: sponsorship,
      greencardSupport: sponsorship && Math.random() > 0.3,
      matchScore: Math.floor(Math.random() * 40) + 60, // 60-99
      postedDate: `${Math.floor(Math.random() * 14) + 1}d ago`,
      description: `${company.name} is looking for a talented ${role} to join our team. You will be responsible for building highly scalable systems and working on cutting-edge technologies. We value diversity and are committed to creating an inclusive environment for all employees.`,
      requirements: [
        `${level === 'Senior' || level === 'Staff' ? '5+' : level === 'Mid Level' ? '3+' : '0-2'} years of experience in software development`,
        `Proficiency in ${['Python, Java, or C++', 'React, TypeScript, and Node.js', 'Go, Rust, or C++', 'SQL, Python, and Spark'][Math.floor(Math.random() * 4)]}`,
        'Experience with large-scale distributed systems',
        "Bachelor's or Master's degree in Computer Science or related field"
      ],
      matchReasons: [
        `Your experience with ${['Python', 'React', 'Distributed Systems', 'Machine Learning'][Math.floor(Math.random() * 4)]} aligns perfectly with the role.`,
        `Your background in ${company.industry} makes you a strong candidate.`,
        `Company history shows frequent H-1B transfers for your profile.`
      ],
      experienceLevel: level,
      industry: company.industry
    });
  }
  
  // Ensure some specific jobs exist for the dashboard/resume match
  jobs[0] = {
    ...jobs[0],
    id: 'j_google_cloud',
    companyId: 'c1',
    companyName: 'Google',
    companyLogo: 'https://logo.clearbit.com/google.com',
    title: 'Senior Software Engineer, Cloud',
    location: 'Mountain View, CA (Remote)',
    salaryRange: '$180k - $260k',
    sponsorship: true,
    greencardSupport: true,
    matchScore: 98,
    postedDate: '2 hours ago',
    experienceLevel: 'Senior',
    industry: 'Technology',
    matchReasons: [
      'Expertise in Go: Your profile shows 5+ years of production experience.',
      'Cloud Infrastructure: Matches your recent projects at Amazon Web Services.',
      'Visa Requirements: Company history shows frequent O-1 transfers for your profile.'
    ]
  };
  
  jobs[1] = {
    ...jobs[1],
    id: 'j_stripe_design',
    companyId: 'c5',
    companyName: 'Stripe',
    companyLogo: 'https://logo.clearbit.com/stripe.com',
    title: 'Staff Product Designer',
    location: 'San Francisco, CA',
    salaryRange: '$160k - $240k',
    sponsorship: true,
    greencardSupport: true,
    matchScore: 92,
    postedDate: '5 hours ago',
    experienceLevel: 'Staff',
    industry: 'Finance'
  };
  
  jobs[2] = {
    ...jobs[2],
    id: 'j_airbnb_data',
    companyId: 'c11',
    companyName: 'Airbnb',
    companyLogo: 'https://logo.clearbit.com/airbnb.com',
    title: 'Data Scientist, Analytics',
    location: 'Seattle, WA',
    salaryRange: '$150k - $210k',
    sponsorship: true,
    greencardSupport: false,
    matchScore: 85,
    postedDate: '1 day ago',
    experienceLevel: 'Mid Level',
    industry: 'Travel'
  };
  
  jobs[3] = {
    ...jobs[3],
    id: 'j_datadog_backend',
    companyId: 'c6', // Using databricks logo for datadog as fallback
    companyName: 'Datadog',
    companyLogo: 'https://logo.clearbit.com/datadog.com',
    title: 'Backend Engineer (Go)',
    location: 'New York, NY',
    salaryRange: '$140k - $200k',
    sponsorship: true,
    greencardSupport: true,
    matchScore: 81,
    postedDate: '2 days ago',
    experienceLevel: 'Mid Level',
    industry: 'Technology'
  };

  return jobs;
};

const alumni: Alumni[] = [
  { id: 'a1', name: 'J. Chen', initials: 'JC', university: 'Carnegie Mellon University', company: 'Google', role: 'Software Engineer', gradYear: '2022', sponsors: true },
  { id: 'a2', name: 'A. Patel', initials: 'AP', university: 'Georgia Tech', company: 'Meta', role: 'Data Scientist', gradYear: '2021', sponsors: true },
  { id: 'a3', name: 'S. Kim', initials: 'SK', university: 'UC Berkeley', company: 'Stripe', role: 'Frontend Engineer', gradYear: '2023', sponsors: true },
  { id: 'a4', name: 'M. Garcia', initials: 'MG', university: 'MIT', company: 'Amazon', role: 'Applied Scientist', gradYear: '2020', sponsors: true },
  { id: 'a5', name: 'R. Sharma', initials: 'RS', university: 'Stanford University', company: 'Databricks', role: 'Backend Engineer', gradYear: '2022', sponsors: true },
  { id: 'a6', name: 'L. Wang', initials: 'LW', university: 'University of Washington', company: 'Microsoft', role: 'Product Manager', gradYear: '2021', sponsors: true },
  { id: 'a7', name: 'D. Nguyen', initials: 'DN', university: 'UT Austin', company: 'Coinbase', role: 'Security Engineer', gradYear: '2023', sponsors: true },
  { id: 'a8', name: 'K. Tanaka', initials: 'KT', university: 'UCLA', company: 'Apple', role: 'Hardware Engineer', gradYear: '2019', sponsors: true },
  { id: 'a9', name: 'P. Singh', initials: 'PS', university: 'UIUC', company: 'Netflix', role: 'Senior Software Engineer', gradYear: '2018', sponsors: true },
  { id: 'a10', name: 'Y. Zhang', initials: 'YZ', university: 'Cornell University', company: 'Airbnb', role: 'Data Engineer', gradYear: '2022', sponsors: true },
  { id: 'a11', name: 'H. Lee', initials: 'HL', university: 'University of Michigan', company: 'Uber', role: 'Machine Learning Engineer', gradYear: '2021', sponsors: true },
  { id: 'a12', name: 'T. Rahman', initials: 'TR', university: 'Purdue University', company: 'DoorDash', role: 'Software Engineer', gradYear: '2023', sponsors: true },
  { id: 'a13', name: 'E. Silva', initials: 'ES', university: 'USC', company: 'Snowflake', role: 'Solutions Architect', gradYear: '2020', sponsors: true },
  { id: 'a14', name: 'V. Kumar', initials: 'VK', university: 'NYU', company: 'Palantir', role: 'Forward Deployed Engineer', gradYear: '2022', sponsors: true },
  { id: 'a15', name: 'C. Wu', initials: 'CW', university: 'Columbia University', company: 'Robinhood', role: 'Software Engineer', gradYear: '2021', sponsors: true },
];

export const mockData = {
  companies,
  jobs: generateJobs(),
  alumni,
  user: {
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    university: 'Stanford University',
    gradYear: '2024',
    visaStatus: 'F-1 OPT',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    plan: 'Premium Plan'
  }
};
