import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Hero, NewHero } from '../models/hero.model';
import { Injectable } from '@angular/core';

const HEROES_SEED: Hero[] = [
  {
    id: '1',
    name: 'Spider man',
    power: 'Wall-Crawling',
    secretIdentity: 'Peter Parker',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '2',
    name: 'Iron Man',
    power: 'Genius Intellect',
    secretIdentity: 'Tony Stark',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '3',
    name: 'Batman',
    power: 'Intelligence',
    secretIdentity: 'Bruce Wayne',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '4',
    name: 'Superman',
    power: 'Super strength',
    secretIdentity: 'Clark Kent',
    weakness: 'Kryptonite',
    isActive: true,
  },
  {
    id: '5',
    name: 'Captain America',
    power: 'Super Soldier',
    secretIdentity: 'Steve Rogers',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '6',
    name: 'Thor',
    power: 'God of Thunder',
    secretIdentity: 'Thor Odinson',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '7',
    name: 'Hulk',
    power: 'Super Strength',
    secretIdentity: 'Bruce Banner',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '8',
    name: 'Black Widow',
    power: 'Espionage',
    secretIdentity: 'Natasha Romanoff',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '9',
    name: 'Doctor Strange',
    power: 'Magic',
    secretIdentity: 'Stephen Strange',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '10',
    name: 'Black Panther',
    power: 'Enhanced abilities',
    secretIdentity: "T'Challa",
    weakness: 'None',
    isActive: true,
  },
  {
    id: '11',
    name: 'Wonder Woman',
    power: 'Super strength',
    secretIdentity: 'Diana Prince',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '12',
    name: 'Flash',
    power: 'Super speed',
    secretIdentity: 'Barry Allen',
    weakness: 'Cold temperatures',
    isActive: true,
  },
  {
    id: '13',
    name: 'Green Lantern',
    power: 'Power ring',
    secretIdentity: 'Hal Jordan',
    weakness: 'Yellow objects',
    isActive: true,
  },
  {
    id: '14',
    name: 'Aquaman',
    power: 'Underwater breathing',
    secretIdentity: 'Arthur Curry',
    weakness: 'Dehydration',
    isActive: true,
  },
  {
    id: '15',
    name: 'Shazam',
    power: 'Magic',
    secretIdentity: 'Billy Batson',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '16',
    name: 'Doctor Fate',
    power: 'Magic',
    secretIdentity: 'Kent Nelson',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '17',
    name: 'Atom',
    power: 'Size manipulation',
    secretIdentity: 'Ray Palmer',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '18',
    name: 'Hawkeye',
    power: 'Archery',
    secretIdentity: 'Clint Barton',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '19',
    name: 'Scarlet Witch',
    power: 'Reality manipulation',
    secretIdentity: 'Wanda Maximoff',
    weakness: 'None',
    isActive: true,
  },
  {
    id: '20',
    name: 'Vision',
    power: 'Density control',
    secretIdentity: 'Vision',
    weakness: 'None',
    isActive: true,
  },
];

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly heroesStore = new BehaviorSubject<Hero[]>([...HEROES_SEED]);

  getHeroes(): Observable<Hero[]> {
    return this.heroesStore.asObservable();
  }

  getHeroById(id: string): Observable<Hero | undefined> {
    const heroes = this.getHeroes();

    return heroes.pipe(map((heroList) => heroList.find((hero) => hero.id === id)));
  }

  searchHeroesByName(name: string): Observable<Hero[]> {
    const heroes = this.getHeroes();

    return heroes.pipe(
      map((heroList) =>
        heroList.filter((hero) => hero.name.toLowerCase().includes(name.toLowerCase())),
      ),
    );
  }

  addHero(hero: NewHero): Observable<Hero> {
    const currentHeroes = this.heroesStore.value;

    const newHero: Hero = {
      ...hero,
      id: crypto.randomUUID(), // Generate a random ID for the new hero
    };

    this.heroesStore.next([...currentHeroes, newHero]);

    return of(newHero);
  }

  updateHero(updatedHero: Hero): Observable<Hero | undefined> {
    const heroes = this.heroesStore.value;
    const heroExists = heroes.some((hero) => hero.id === updatedHero.id);

    if (!heroExists) {
      return of(undefined);
    }

    this.heroesStore.next(heroes.map((hero) => (hero.id === updatedHero.id ? updatedHero : hero)));

    return of(updatedHero);
  }

  deleteHero(id: string): Observable<boolean> {
    const heroes = this.heroesStore.value;
    const heroExists = heroes.some((hero) => hero.id === id);

    if (!heroExists) {
      return of(false);
    }

    this.heroesStore.next(heroes.filter((hero) => hero.id !== id));

    return of(true);
  }
}
