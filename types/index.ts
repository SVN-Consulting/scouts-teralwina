export type Link = {
  name: string;
  href: string;
  subLinks?: Link[];
};

export type Tak = 'kapoenen' | 'wouters' | 'jonggivers' | 'givers' | 'jins';
