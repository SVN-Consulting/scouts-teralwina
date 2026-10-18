export type Link = {
  name: string;
  href: string;
  isProtected?: boolean;
  subLinks?: Link[];
};

export type Tak = 'kapoenen' | 'wouters' | 'jonggivers' | 'givers' | 'jins';
