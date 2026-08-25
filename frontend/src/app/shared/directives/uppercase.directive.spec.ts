import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UppercaseDirective } from './uppercase.directive';

@Component({
  imports: [ReactiveFormsModule, UppercaseDirective],
  template: `<input [formControl]="control" appUppercase />`,
})
class HostComponent {
  control = new FormControl('');
}

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should transform the control value to uppercase on input', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'spiderman';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe('SPIDERMAN');
  });

  it ('should transform a preloaded value to uppercase', () => {
    fixture.componentInstance.control.setValue('batman');
    fixture.detectChanges();
    
    expect(fixture.componentInstance.control.value).toBe('BATMAN');
  })
});
