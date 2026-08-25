import { BehaviorSubject, delay, finalize, map, Observable, of, tap } from 'rxjs';
import { Hero, NewHero } from '../models/hero.model';
import { inject, Injectable } from '@angular/core';
import { LoadingService } from './loading.service';

const HEROES_SEED: Hero[] = [
  {
    id: crypto.randomUUID(),
    name: 'Spider man',
    power: 'Wall-Crawling',
    secretIdentity: 'Peter Parker',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Iron Man',
    power: 'Genius Intellect',
    secretIdentity: 'Tony Stark',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Batman',
    power: 'Intelligence',
    secretIdentity: 'Bruce Wayne',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Superman',
    power: 'Super strength',
    secretIdentity: 'Clark Kent',
    weakness: 'Kryptonite',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Captain America',
    power: 'Super Soldier',
    secretIdentity: 'Steve Rogers',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Thor',
    power: 'God of Thunder',
    secretIdentity: 'Thor Odinson',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Hulk',
    power: 'Super Strength',
    secretIdentity: 'Bruce Banner',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Black Widow',
    power: 'Espionage',
    secretIdentity: 'Natasha Romanoff',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Doctor Strange',
    power: 'Magic',
    secretIdentity: 'Stephen Strange',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Black Panther',
    power: 'Enhanced abilities',
    secretIdentity: "T'Challa",
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Wonder Woman',
    power: 'Super strength',
    secretIdentity: 'Diana Prince',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Flash',
    power: 'Super speed',
    secretIdentity: 'Barry Allen',
    weakness: 'Cold temperatures',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Green Lantern',
    power: 'Power ring',
    secretIdentity: 'Hal Jordan',
    weakness: 'Yellow objects',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Aquaman',
    power: 'Underwater breathing',
    secretIdentity: 'Arthur Curry',
    weakness: 'Dehydration',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Shazam',
    power: 'Magic',
    secretIdentity: 'Billy Batson',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Doctor Fate',
    power: 'Magic',
    secretIdentity: 'Kent Nelson',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Atom',
    power: 'Size manipulation',
    secretIdentity: 'Ray Palmer',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Hawkeye',
    power: 'Archery',
    secretIdentity: 'Clint Barton',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Scarlet Witch',
    power: 'Reality manipulation',
    secretIdentity: 'Wanda Maximoff',
    weakness: 'None',
    isActive: true,
  },
  {
    id: crypto.randomUUID(),
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
  private readonly _heroesStore = new BehaviorSubject<Hero[]>([...HEROES_SEED]);
  private readonly _loadingService = inject(LoadingService);

  getHeroes(): Observable<Hero[]> {
    return this._heroesStore.asObservable();
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
    const currentHeroes = this._heroesStore.value;

    const newHero: Hero = {
      ...hero,
      id: crypto.randomUUID(), // Generate a random ID for the new hero
    };

    this._loadingService.show();

    return of(newHero).pipe(
      delay(500),
      tap(() => this._heroesStore.next([...currentHeroes, newHero])),
      finalize(() => this._loadingService.hide()),
    );
  }

  updateHero(updatedHero: Hero): Observable<Hero | undefined> {
    const heroes = this._heroesStore.value;
    const heroExists = heroes.some((hero) => hero.id === updatedHero.id);

    if (!heroExists) {
      return of(undefined);
    }

    this._loadingService.show();

    return of(updatedHero).pipe(
      delay(500),
      tap(() =>
        this._heroesStore.next(
          heroes.map((hero) => (hero.id === updatedHero.id ? updatedHero : hero)),
        ),
      ),
      finalize(() => this._loadingService.hide()),
    );
  }

  deleteHero(id: string): Observable<boolean> {
    const heroes = this._heroesStore.value;
    const heroExists = heroes.some((hero) => hero.id === id);

    if (!heroExists) {
      return of(false);
    }

    this._loadingService.show();

    return of(true).pipe(
      delay(500),
      tap(() => this._heroesStore.next(heroes.filter((hero) => hero.id !== id))),
      finalize(() => this._loadingService.hide()),
    );
  }
}
