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

  it('should transform the input value to uppercase', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'spiderman';
    input.dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.control.value).toBe('SPIDERMAN');
  });
});
