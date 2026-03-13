import { mockCompanies } from './mockCompanies';

/**
 * Job schema:
 * {
 *   id: string,
 *   companyId: string,
 *   companyName: string,
 *   companyLogo: string,
 *   title: string,
 *   location: string,
 *   salaryRange: string,
 *   sponsorship: boolean,
 *   greencardSupport: boolean,
 *   matchScore: number,
 *   postedDate: string,
 *   description: string,
 *   requirements: string[],
 *   matchReasons: string[],
 *   experienceLevel: string,
 *   industry: string
 * }
 */
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

const generateJobs = (): Job[] => {
  const jobs: Job[] = [];
  const roles = ['Software Engineer', 'Backend Engineer', 'Frontend Engineer', 'Full Stack Developer', 'Machine Learning Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'Security Engineer', 'Data Engineer'];
  const levels = ['Intern', 'Entry Level', 'Mid Level', 'Senior', 'Staff', 'Principal'];
  const locations = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Remote', 'Mountain View, CA', 'Menlo Park, CA', 'Redmond, WA'];
  
  for (let i = 1; i <= 35; i++) {
    const company = mockCompanies[Math.floor(Math.random() * mockCompanies.length)];
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

export const mockJobs = generateJobs();
