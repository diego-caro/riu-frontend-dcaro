import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HeroList } from './hero-list';
import { of } from 'rxjs';
import { HeroService } from '../../../services/hero.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

describe('HeroList', () => {
  const dialogRefMock = { afterClosed: () => of(true) };
  const dialogMock = { open: vi.fn().mockReturnValue(dialogRefMock) };
  const routerMock = { navigate: vi.fn() };

  let component: HeroList;
  let fixture: ComponentFixture<HeroList>;
  let service: HeroService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroList],
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        { provide: Router, useValue: routerMock },
      ],
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

  it('should filter heroes by search term', () => {
    vi.useFakeTimers();

    component.searchControl.setValue('man');
    vi.advanceTimersByTime(300);

    vi.useRealTimers();

    const filtered = component.dataSource.data;
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((h) => h.name.toLowerCase().includes('man'))).toBe(true);
  });

  it('should navigate to new hero form on add', () => {
    component.onAdd();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes', 'new']);
  });

  it('should navigate to edit form on edit', () => {
    const hero = component.dataSource.data[0];
    component.onEdit(hero);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes', hero.id, 'edit']);
  });

  it('should navigate when add button is clicked', () => {
    const addBtn: HTMLButtonElement =
      fixture.nativeElement.querySelector('[data-testid="add-btn"]');
    addBtn.click();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/heroes', 'new']);
  });

  it('should have aria-labels on action buttons', () => {
    const editBtn = fixture.nativeElement.querySelector('button[aria-label="Edit hero"]');
    const deleteBtn = fixture.nativeElement.querySelector('button[aria-label="Delete hero"]');

    expect(editBtn).toBeTruthy();
    expect(deleteBtn).toBeTruthy();
  });

  it('should have aria-labels on action buttons', () => {
    const editBtn = fixture.nativeElement.querySelector('button[matTooltip="Edit"]');
    const deleteBtn = fixture.nativeElement.querySelector('button[matTooltip="Delete"]');

    expect(editBtn).toBeTruthy();
    expect(deleteBtn).toBeTruthy();
  });
});
