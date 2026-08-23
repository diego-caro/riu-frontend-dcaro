import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroEditor } from './hero-editor';

describe('HeroEditor', () => {
  let component: HeroEditor;
  let fixture: ComponentFixture<HeroEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
