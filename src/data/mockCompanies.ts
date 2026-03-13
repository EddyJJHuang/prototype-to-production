/**
 * Company schema:
 * {
 *   id: string,
 *   name: string,
 *   logo: string,
 *   industry: string,
 *   petitions: number,
 *   approvalRate: number,
 *   avgSalary: number,
 *   trend: 'up' | 'down' | 'flat',
 *   topRoles: string[],
 *   locations: string[],
 *   history: { year: string; petitions: number }[]
 * }
 */
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

export const mockCompanies: Company[] = [
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
