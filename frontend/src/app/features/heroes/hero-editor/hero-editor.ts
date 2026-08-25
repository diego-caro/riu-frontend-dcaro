import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../../services/hero.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { UppercaseDirective } from '../../../shared/directives/uppercase.directive';

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    UppercaseDirective,
  ],
  selector: 'app-hero-editor',
  styleUrl: './hero-editor.scss',
  templateUrl: './hero-editor.html',
})
export class HeroEditor implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _activeRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _heroService = inject(HeroService);

  private _heroId: string | null = null;

  get isEditMode(): boolean {
    return this._heroId !== null;
  }

  heroForm = this._formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    power: ['', [Validators.required, Validators.minLength(5)]],
    secretIdentity: [''],
    weakness: [''],
    isActive: [true],
  });

  ngOnInit(): void {
    this._heroId = this._activeRoute.snapshot.paramMap.get('id');

    if (this.isEditMode) {
      this._heroService.getHeroById(this._heroId!).subscribe((hero) => {
        if (hero) {
          this.heroForm.patchValue(hero);
        } else {
          this._router.navigate(['/heroes']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.heroForm.invalid) {
      return;
    }

    const request$ = this.isEditMode
      ? this._heroService.updateHero({ ...this.heroForm.getRawValue(), id: this._heroId! })
      : this._heroService.addHero(this.heroForm.getRawValue());

    request$.subscribe(() => this._router.navigate(['/heroes']));
  }

  onCancel(): void {
    this._router.navigate(['/heroes']);
  }
}
