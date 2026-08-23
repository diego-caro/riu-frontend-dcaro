import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroList } from './hero-list';

describe('HeroList', () => {
  let component: HeroList;
  let fixture: ComponentFixture<HeroList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroList],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroList);
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
});
