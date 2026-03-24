/**
 * Company data derived from real H-1B employer data (companies.json)
 * Fiscal Year 2026 USCIS H-1B Employer Data Hub
 *
 * Logo source: Google Favicon service (reliable, free, always available)
 * Usage: https://www.google.com/s2/favicons?domain=DOMAIN&sz=128
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

/** Helper: build a Google Favicon URL that always resolves */
const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

export const mockCompanies: Company[] = [
  {
    id: 'c1', name: 'Amazon', logo: favicon('amazon.com'), industry: 'Retail & E-commerce',
    petitions: 1989, approvalRate: 98.4, avgSalary: 168400, trend: 'up',
    topRoles: ['Software Dev Engineer', 'Applied Scientist', 'Data Engineer'],
    locations: ['Arlington, VA', 'Seattle, WA', 'Austin, TX'],
    history: [{ year: 'FY2024', petitions: 1750 }, { year: 'FY2025', petitions: 1880 }, { year: 'FY2026', petitions: 1989 }]
  },
  {
    id: 'c2', name: 'Tata Consultancy Services', logo: favicon('tcs.com'), industry: 'IT Services & Consulting',
    petitions: 1564, approvalRate: 95.3, avgSalary: 105000, trend: 'up',
    topRoles: ['Software Engineer', 'Systems Analyst', 'IT Consultant'],
    locations: ['Rockville, MD', 'Edison, NJ', 'Houston, TX'],
    history: [{ year: 'FY2024', petitions: 1320 }, { year: 'FY2025', petitions: 1450 }, { year: 'FY2026', petitions: 1564 }]
  },
  {
    id: 'c3', name: 'Microsoft', logo: favicon('microsoft.com'), industry: 'Technology',
    petitions: 1214, approvalRate: 96.7, avgSalary: 175000, trend: 'flat',
    topRoles: ['Software Engineer', 'Program Manager', 'Data Scientist'],
    locations: ['Redmond, WA', 'Sunnyvale, CA', 'Atlanta, GA'],
    history: [{ year: 'FY2024', petitions: 1200 }, { year: 'FY2025', petitions: 1210 }, { year: 'FY2026', petitions: 1214 }]
  },
  {
    id: 'c4', name: 'Infosys', logo: favicon('infosys.com'), industry: 'IT Services & Consulting',
    petitions: 1143, approvalRate: 99.4, avgSalary: 100000, trend: 'up',
    topRoles: ['Technology Analyst', 'Software Engineer', 'Consultant'],
    locations: ['Richardson, TX', 'Indianapolis, IN', 'Plano, TX'],
    history: [{ year: 'FY2024', petitions: 980 }, { year: 'FY2025', petitions: 1060 }, { year: 'FY2026', petitions: 1143 }]
  },
  {
    id: 'c5', name: 'Google', logo: favicon('google.com'), industry: 'Technology',
    petitions: 1044, approvalRate: 98.4, avgSalary: 192500, trend: 'down',
    topRoles: ['Software Engineer', 'Data Scientist', 'Product Manager'],
    locations: ['Mountain View, CA', 'New York, NY', 'Seattle, WA'],
    history: [{ year: 'FY2024', petitions: 1560 }, { year: 'FY2025', petitions: 1200 }, { year: 'FY2026', petitions: 1044 }]
  },
  {
    id: 'c6', name: 'Apple', logo: favicon('apple.com'), industry: 'Technology & Manufacturing',
    petitions: 995, approvalRate: 98.7, avgSalary: 185000, trend: 'up',
    topRoles: ['Hardware Engineer', 'Software Engineer', 'Data Scientist'],
    locations: ['Cupertino, CA', 'Austin, TX', 'Seattle, WA'],
    history: [{ year: 'FY2024', petitions: 880 }, { year: 'FY2025', petitions: 940 }, { year: 'FY2026', petitions: 995 }]
  },
  {
    id: 'c7', name: 'Cognizant', logo: favicon('cognizant.com'), industry: 'IT Services & Consulting',
    petitions: 879, approvalRate: 98.6, avgSalary: 108000, trend: 'flat',
    topRoles: ['Associate', 'Programmer Analyst', 'Technology Lead'],
    locations: ['College Station, TX', 'Teaneck, NJ', 'Phoenix, AZ'],
    history: [{ year: 'FY2024', petitions: 860 }, { year: 'FY2025', petitions: 870 }, { year: 'FY2026', petitions: 879 }]
  },
  {
    id: 'c8', name: 'Meta', logo: favicon('meta.com'), industry: 'Technology',
    petitions: 700, approvalRate: 98.7, avgSalary: 185000, trend: 'down',
    topRoles: ['Software Engineer', 'Data Engineer', 'Research Scientist'],
    locations: ['Menlo Park, CA', 'New York, NY', 'Seattle, WA'],
    history: [{ year: 'FY2024', petitions: 1050 }, { year: 'FY2025', petitions: 850 }, { year: 'FY2026', petitions: 700 }]
  },
  {
    id: 'c9', name: 'Tesla', logo: favicon('tesla.com'), industry: 'Technology & Manufacturing',
    petitions: 658, approvalRate: 95.0, avgSalary: 155000, trend: 'up',
    topRoles: ['Autopilot Engineer', 'Mechanical Engineer', 'Software Engineer'],
    locations: ['Austin, TX', 'Palo Alto, CA', 'Fremont, CA'],
    history: [{ year: 'FY2024', petitions: 450 }, { year: 'FY2025', petitions: 560 }, { year: 'FY2026', petitions: 658 }]
  },
  {
    id: 'c10', name: 'Walmart', logo: favicon('walmart.com'), industry: 'Retail & E-commerce',
    petitions: 633, approvalRate: 99.1, avgSalary: 140000, trend: 'up',
    topRoles: ['Software Engineer', 'Data Scientist', 'Product Manager'],
    locations: ['Bentonville, AR', 'Sunnyvale, CA', 'Dallas, TX'],
    history: [{ year: 'FY2024', petitions: 500 }, { year: 'FY2025', petitions: 570 }, { year: 'FY2026', petitions: 633 }]
  },
  {
    id: 'c11', name: 'JPMorgan Chase', logo: favicon('jpmorgan.com'), industry: 'Financial Services',
    petitions: 620, approvalRate: 99.0, avgSalary: 165000, trend: 'up',
    topRoles: ['Software Engineer', 'Quantitative Analyst', 'Data Scientist'],
    locations: ['Chicago, IL', 'New York, NY', 'Plano, TX'],
    history: [{ year: 'FY2024', petitions: 520 }, { year: 'FY2025', petitions: 580 }, { year: 'FY2026', petitions: 620 }]
  },
  {
    id: 'c12', name: 'Capgemini', logo: favicon('capgemini.com'), industry: 'IT Services & Consulting',
    petitions: 471, approvalRate: 96.6, avgSalary: 112000, trend: 'flat',
    topRoles: ['Consultant', 'Software Engineer', 'Systems Analyst'],
    locations: ['Chicago, IL', 'New York, NY', 'Atlanta, GA'],
    history: [{ year: 'FY2024', petitions: 460 }, { year: 'FY2025', petitions: 465 }, { year: 'FY2026', petitions: 471 }]
  },
  {
    id: 'c13', name: 'Accenture', logo: favicon('accenture.com'), industry: 'IT Services & Consulting',
    petitions: 462, approvalRate: 98.3, avgSalary: 125000, trend: 'down',
    topRoles: ['Consultant', 'Software Engineer', 'Technology Architect'],
    locations: ['Chicago, IL', 'New York, NY', 'San Francisco, CA'],
    history: [{ year: 'FY2024', petitions: 550 }, { year: 'FY2025', petitions: 500 }, { year: 'FY2026', petitions: 462 }]
  },
  {
    id: 'c14', name: 'Oracle', logo: favicon('oracle.com'), industry: 'Technology',
    petitions: 440, approvalRate: 98.6, avgSalary: 160000, trend: 'flat',
    topRoles: ['Software Engineer', 'Cloud Engineer', 'Product Manager'],
    locations: ['Austin, TX', 'Redwood City, CA', 'Seattle, WA'],
    history: [{ year: 'FY2024', petitions: 430 }, { year: 'FY2025', petitions: 435 }, { year: 'FY2026', petitions: 440 }]
  },
  {
    id: 'c15', name: 'Deloitte', logo: favicon('deloitte.com'), industry: 'IT Services & Consulting',
    petitions: 418, approvalRate: 99.3, avgSalary: 135000, trend: 'up',
    topRoles: ['Consultant', 'Advisory Analyst', 'Solution Architect'],
    locations: ['Philadelphia, PA', 'New York, NY', 'Chicago, IL'],
    history: [{ year: 'FY2024', petitions: 360 }, { year: 'FY2025', petitions: 390 }, { year: 'FY2026', petitions: 418 }]
  },
  {
    id: 'c16', name: 'HCL Technologies', logo: favicon('hcltech.com'), industry: 'IT Services & Consulting',
    petitions: 412, approvalRate: 99.3, avgSalary: 105000, trend: 'up',
    topRoles: ['Software Engineer', 'Technical Lead', 'Systems Analyst'],
    locations: ['Santa Clara, CA', 'Dallas, TX', 'Reston, VA'],
    history: [{ year: 'FY2024', petitions: 350 }, { year: 'FY2025', petitions: 380 }, { year: 'FY2026', petitions: 412 }]
  },
  {
    id: 'c17', name: 'Fidelity Investments', logo: favicon('fidelity.com'), industry: 'Finance & Insurance',
    petitions: 400, approvalRate: 99.5, avgSalary: 155000, trend: 'up',
    topRoles: ['Software Engineer', 'Data Analyst', 'Cloud Architect'],
    locations: ['Boston, MA', 'Durham, NC', 'Westlake, TX'],
    history: [{ year: 'FY2024', petitions: 330 }, { year: 'FY2025', petitions: 370 }, { year: 'FY2026', petitions: 400 }]
  },
  {
    id: 'c18', name: 'Ernst & Young (EY)', logo: favicon('ey.com'), industry: 'Professional Services',
    petitions: 382, approvalRate: 97.4, avgSalary: 130000, trend: 'flat',
    topRoles: ['Consultant', 'Advisory Analyst', 'Technology Consultant'],
    locations: ['Secaucus, NJ', 'New York, NY', 'Chicago, IL'],
    history: [{ year: 'FY2024', petitions: 375 }, { year: 'FY2025', petitions: 380 }, { year: 'FY2026', petitions: 382 }]
  },
  {
    id: 'c19', name: 'LTIMindtree', logo: favicon('ltimindtree.com'), industry: 'IT Services & Consulting',
    petitions: 370, approvalRate: 99.2, avgSalary: 100000, trend: 'up',
    topRoles: ['Software Engineer', 'Technical Analyst', 'Cloud Consultant'],
    locations: ['Edison, NJ', 'Atlanta, GA', 'Chicago, IL'],
    history: [{ year: 'FY2024', petitions: 290 }, { year: 'FY2025', petitions: 330 }, { year: 'FY2026', petitions: 370 }]
  },
  {
    id: 'c20', name: 'NVIDIA', logo: favicon('nvidia.com'), industry: 'Technology & Manufacturing',
    petitions: 342, approvalRate: 99.7, avgSalary: 210000, trend: 'up',
    topRoles: ['GPU Architect', 'Software Engineer', 'Deep Learning Engineer'],
    locations: ['Santa Clara, CA', 'Austin, TX', 'Redmond, WA'],
    history: [{ year: 'FY2024', petitions: 220 }, { year: 'FY2025', petitions: 280 }, { year: 'FY2026', petitions: 342 }]
  },
  {
    id: 'c21', name: 'Wipro', logo: favicon('wipro.com'), industry: 'IT Services & Consulting',
    petitions: 331, approvalRate: 96.1, avgSalary: 98000, trend: 'down',
    topRoles: ['Software Engineer', 'Technical Lead', 'Systems Analyst'],
    locations: ['East Brunswick, NJ', 'Plano, TX', 'Mountain View, CA'],
    history: [{ year: 'FY2024', petitions: 400 }, { year: 'FY2025', petitions: 360 }, { year: 'FY2026', petitions: 331 }]
  },
  {
    id: 'c22', name: 'Cisco', logo: favicon('cisco.com'), industry: 'Technology & Manufacturing',
    petitions: 326, approvalRate: 97.9, avgSalary: 170000, trend: 'flat',
    topRoles: ['Software Engineer', 'Network Engineer', 'Technical Lead'],
    locations: ['San Jose, CA', 'Richardson, TX', 'Raleigh, NC'],
    history: [{ year: 'FY2024', petitions: 320 }, { year: 'FY2025', petitions: 325 }, { year: 'FY2026', petitions: 326 }]
  },
  {
    id: 'c23', name: 'Citibank', logo: favicon('citigroup.com'), industry: 'Finance & Insurance',
    petitions: 311, approvalRate: 99.0, avgSalary: 160000, trend: 'up',
    topRoles: ['Software Engineer', 'Quantitative Analyst', 'Risk Analyst'],
    locations: ['New York, NY', 'Tampa, FL', 'Irving, TX'],
    history: [{ year: 'FY2024', petitions: 260 }, { year: 'FY2025', petitions: 285 }, { year: 'FY2026', petitions: 311 }]
  },
  {
    id: 'c24', name: 'Amazon Web Services', logo: favicon('aws.amazon.com'), industry: 'Technology',
    petitions: 306, approvalRate: 96.7, avgSalary: 175000, trend: 'up',
    topRoles: ['Cloud Engineer', 'Solutions Architect', 'Software Dev Engineer'],
    locations: ['Arlington, VA', 'Seattle, WA', 'Herndon, VA'],
    history: [{ year: 'FY2024', petitions: 230 }, { year: 'FY2025', petitions: 270 }, { year: 'FY2026', petitions: 306 }]
  },
  {
    id: 'c25', name: 'Salesforce', logo: favicon('salesforce.com'), industry: 'Technology',
    petitions: 301, approvalRate: 95.7, avgSalary: 180000, trend: 'down',
    topRoles: ['Software Engineer', 'Product Manager', 'Solutions Engineer'],
    locations: ['San Francisco, CA', 'Indianapolis, IN', 'Dallas, TX'],
    history: [{ year: 'FY2024', petitions: 380 }, { year: 'FY2025', petitions: 340 }, { year: 'FY2026', petitions: 301 }]
  },
  {
    id: 'c26', name: 'Qualcomm', logo: favicon('qualcomm.com'), industry: 'Technology & Manufacturing',
    petitions: 231, approvalRate: 96.5, avgSalary: 170000, trend: 'flat',
    topRoles: ['Software Engineer', 'Hardware Engineer', 'Systems Engineer'],
    locations: ['San Diego, CA', 'Santa Clara, CA', 'Austin, TX'],
    history: [{ year: 'FY2024', petitions: 225 }, { year: 'FY2025', petitions: 228 }, { year: 'FY2026', petitions: 231 }]
  },
  {
    id: 'c27', name: 'PayPal', logo: favicon('paypal.com'), industry: 'Finance & Insurance',
    petitions: 222, approvalRate: 98.7, avgSalary: 165000, trend: 'flat',
    topRoles: ['Software Engineer', 'Data Scientist', 'Product Manager'],
    locations: ['San Jose, CA', 'Scottsdale, AZ', 'Austin, TX'],
    history: [{ year: 'FY2024', petitions: 218 }, { year: 'FY2025', petitions: 220 }, { year: 'FY2026', petitions: 222 }]
  },
  {
    id: 'c28', name: 'McKinsey & Company', logo: favicon('mckinsey.com'), industry: 'Professional Services',
    petitions: 209, approvalRate: 99.0, avgSalary: 150000, trend: 'flat',
    topRoles: ['Business Analyst', 'Consultant', 'Data Scientist'],
    locations: ['New York, NY', 'Chicago, IL', 'Washington, DC'],
    history: [{ year: 'FY2024', petitions: 200 }, { year: 'FY2025', petitions: 205 }, { year: 'FY2026', petitions: 209 }]
  },
];
