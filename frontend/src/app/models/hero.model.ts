export interface Hero {
  id: string;
  name: string;
  power: string;
  secretIdentity?: string;
  weakness?: string;
  isActive: boolean;
}

export type NewHero = Omit<Hero, 'id'>;
