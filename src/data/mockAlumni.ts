/**
 * Alumni schema:
 * {
 *   id: string,
 *   name: string,
 *   initials: string,
 *   university: string,
 *   company: string,
 *   role: string,
 *   gradYear: string,
 *   sponsors: boolean
 * }
 */
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

export const mockAlumni: Alumni[] = [
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
