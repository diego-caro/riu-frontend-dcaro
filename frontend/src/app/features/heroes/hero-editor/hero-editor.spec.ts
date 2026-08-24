import { TestBed } from '@angular/core/testing';
import { HeroEditor } from './hero-editor';
import { HeroService } from '../../../services/hero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

describe('HeroEditor', () => {
  const routerMock = { navigate: vi.fn() };
  let heroService: HeroService;

  function createComponent(heroId: string | null) {
    TestBed.configureTestingModule({
      imports: [HeroEditor],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => heroId } } } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(HeroEditor);
    heroService = TestBed.inject(HeroService);
    fixture.detectChanges();

    return fixture.componentInstance;
  }

  it('should create', () => {
    const component = createComponent(null);
    expect(component).toBeTruthy();
  });

  it('should create a new Hero and navigate', () => {
    const component = createComponent(null);
    const spy = vi.spyOn(heroService, 'addHero');
    component.heroForm.setValue({
      name: 'X',
      power: 'Powerful',
      secretIdentity: '',
      weakness: '',
      isActive: true,
    });
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should not create when form is invalid', () => {
    const component = createComponent(null);
    const spy = vi.spyOn(heroService, 'addHero');
    component.onSubmit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should preload and update in edit mode', async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
      ],
    });
    const heroes = await firstValueFrom(TestBed.inject(HeroService).getHeroes());
    const realId = heroes[0].id;
    TestBed.resetTestingModule();

    const component = createComponent(realId);
    const spy = vi.spyOn(heroService, 'updateHero');
    expect(component.isEditMode).toBe(true);
    expect(component.heroForm.controls.name.value).toBeTruthy();
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('should navigate to list on cancel', () => {
    const component = createComponent(null);
    component.onCancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes']);
  });
});
