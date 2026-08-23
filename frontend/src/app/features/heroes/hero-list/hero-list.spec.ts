import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroList } from './hero-list';
import { of } from 'rxjs';
import { HeroService } from '../../../services/hero.service';
import { MatDialog } from '@angular/material/dialog';

describe('HeroList', () => {
  const dialogRefMock = { afterClosed: () => of(true) };
  const dialogMock = { open: vi.fn().mockReturnValue(dialogRefMock) };

  let component: HeroList;
  let fixture: ComponentFixture<HeroList>;
  let service: HeroService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroList],
      providers: [{ provide: MatDialog, useValue: dialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroList);
    service = TestBed.inject(HeroService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch heroes onInit', () => {
    expect(component.dataSource.data.length).toBeGreaterThan(0);
  });

  it('should render hero rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('should delete when confirmed', () => {
    dialogMock.open.mockReturnValue({ afterClosed: () => of(true) });
    const spy = vi.spyOn(service, 'deleteHero');
    const heroToDelete = component.dataSource.data[0];

    component.onDelete(heroToDelete);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(heroToDelete.id);
  });

  it('should not delete when cancelled', () => {
    dialogMock.open.mockReturnValue({ afterClosed: () => of(false) });
    const spy = vi.spyOn(service, 'deleteHero');
    const heroToDelete = component.dataSource.data[0];

    component.onDelete(heroToDelete);

    expect(spy).not.toHaveBeenCalled();
  });
});
