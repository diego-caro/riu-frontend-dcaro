import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appUppercase]',
})
export class UppercaseDirective {
  @HostBinding('style.text-transform') readonly textTransform = 'uppercase';
}
