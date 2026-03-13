/**
 * User schema:
 * {
 *   name: string,
 *   email: string,
 *   university: string,
 *   gradYear: string,
 *   visaStatus: string,
 *   avatar: string,
 *   plan: string
 * }
 */
export interface User {
  name: string;
  email: string;
  university: string;
  gradYear: string;
  visaStatus: string;
  avatar: string;
  plan: string;
}

export const mockUser: User = {
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  university: 'Stanford University',
  gradYear: '2024',
  visaStatus: 'F-1 OPT',
  avatar: 'https://i.pravatar.cc/150?u=alex',
  plan: 'Premium Plan'
};
