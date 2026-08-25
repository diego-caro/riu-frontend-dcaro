import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
})
export class UppercaseDirective implements OnInit {
  private readonly _ngControl = inject(NgControl);
  private readonly _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const control = this._ngControl.control;
    if (!control) {
      return;
    }

    // transform the existing value (edition / patchValue)
    this.toUpperCase(control.value);

    // transform each change (typing or patchValue)
    control.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value: string) => this.toUpperCase(value));
  }

  private toUpperCase(value: string | null): void {
    if (!value) {
      return;
    }

    const upper = value.toUpperCase();
    if (value !== upper) {
      this._ngControl.control?.setValue(upper, { emitEvent: false });
    }
  }
}
