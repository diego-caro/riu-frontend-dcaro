import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { Hero, NewHero } from '../models/hero.model';
import { firstValueFrom } from 'rxjs';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all heroes', () => {
    service.getHeroes().subscribe((heroes) => {
      expect(heroes.length).toBeGreaterThan(0);
    });
  });

  it('should return a hero by ID', async () => {
    const heroes = await firstValueFrom(service.getHeroes());
    const someHero = heroes[0];

    const hero = await firstValueFrom(service.getHeroById(someHero.id));

    expect(hero).toBeDefined();
    expect(hero?.id).toEqual(someHero.id);
  });

  it('should return undefined for a non-existing hero ID', () => {
    const nonExistingHeroId = '999';
    service.getHeroById(nonExistingHeroId).subscribe((hero) => {
      expect(hero).toBeUndefined();
    });
  });

  it('should search heroes by name', () => {
    const searchName = 'MAN';
    service.searchHeroesByName(searchName).subscribe((heroes) => {
      expect(heroes.length).toBeGreaterThan(0);
    });
  });

  it('should return empty array when no hero matches', () => {
    const searchName = 'joker';
    service.searchHeroesByName(searchName).subscribe((heroes) => {
      expect(heroes.length).toBe(0);
    });
  });

  it('should return all heroes when search name is empty', async () => {
    const allHeroes = await firstValueFrom(service.getHeroes());
    const searchName = '';

    const heroes = await firstValueFrom(service.searchHeroesByName(searchName));
    expect(heroes.length).toBe(allHeroes.length);
  });

  it('should add a new hero', async () => {
    const newHero: NewHero = {
      name: 'New Hero',
      power: 'Invisibility',
      secretIdentity: 'John Doe',
      weakness: 'Kryptonite',
      isActive: true,
    };
    const beforeInsert = await firstValueFrom(service.getHeroes());
    const addedHero = await firstValueFrom(service.addHero(newHero));
    expect(addedHero).toBeDefined();
    expect(addedHero.id).toBeDefined();

    const heroes = await firstValueFrom(service.getHeroes());
    expect(heroes.length).toBe(beforeInsert.length + 1);
  });

  it('should update an existing hero', async () => {
    const heroes = await firstValueFrom(service.getHeroes());
    const someHero = heroes[0];
    const updatedHero: Hero = {
      id: someHero.id,
      name: 'Updated Hero',
      power: 'Super Strength',
      secretIdentity: 'Jane Doe',
      weakness: 'Kryptonite',
      isActive: true,
    };

    const result = await firstValueFrom(service.updateHero(updatedHero));
    expect(result).toBeDefined();

    const hero = await firstValueFrom(service.getHeroById(someHero.id));
    expect(hero?.name).toBe('Updated Hero');
  });

  it('should return undefined when updating a non-existing hero', () => {
    const nonExistingHero: Hero = {
      id: '999',
      name: 'Non-existing Hero',
      power: 'None',
      secretIdentity: 'None',
      weakness: 'None',
      isActive: false,
    };
    service.updateHero(nonExistingHero).subscribe((result) => {
      expect(result).toBeUndefined();
    });
  });

  it('should delete an existing hero', async () => {
    const beforeDeleteHeroes = await firstValueFrom(service.getHeroes());
    const heroToDelete = beforeDeleteHeroes[0];
    const result = await firstValueFrom(service.deleteHero(heroToDelete.id));
    const afterDeleteHeroes = await firstValueFrom(service.getHeroes());

    expect(result).toBeTruthy();
    expect(beforeDeleteHeroes.length - 1).toBe(afterDeleteHeroes.length);
  });

  it('should return false when deleting a non-existing hero', () => {
    const nonExistingHeroId = '999';
    service.deleteHero(nonExistingHeroId).subscribe((result) => {
      expect(result).toBeFalsy();
    });
  });
});
