export { cn } from 'cn';
import type { Link } from '@/types';

export const Links: Link[] = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Maandlijst',
    href: '/maandlijst',
    subLinks: [
      {
        name: 'Alle maandlijsten',
        href: '/maandlijst',
      },
      {
        name: 'Kapoenen',
        href: '/maandlijst/kapoenen',
      },
      {
        name: 'Wouters',
        href: '/maandlijst/wouters',
      },
      {
        name: 'Jonggivers',
        href: '/maandlijst/jonggivers',
      },
      {
        name: 'Givers',
        href: '/maandlijst/givers',
      },
      {
        name: 'Jins',
        href: '/maandlijst/Jins',
      },
    ],
  },
  {
    name: 'Leiding',
    href: '/leiding',
    subLinks: [
      {
        name: 'Kapoenen',
        href: '/leiding/kapoenen',
      },
      {
        name: 'Wouters',
        href: '/leiding/wouters',
      },
      {
        name: 'Jonggivers',
        href: '/leiding/jonggivers',
      },
      {
        name: 'Givers',
        href: '/leiding/givers',
      },
      {
        name: 'Jins',
        href: '/leiding/jins',
      },
    ],
  },
  {
    name: 'Uniform',
    href: '/uniform',
  },
  {
    name: 'Contact',
    href: '/contact',
  },
];
