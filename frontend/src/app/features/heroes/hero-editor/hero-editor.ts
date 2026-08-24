import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroService } from '../../../services/hero.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  selector: 'app-hero-editor',
  styleUrl: './hero-editor.scss',
  templateUrl: './hero-editor.html',
})
export class HeroEditor implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly heroService = inject(HeroService);

  private heroId: string | null = null;

  get isEditMode(): boolean {
    return this.heroId !== null;
  }

  // Form definition with validations
  heroForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    power: ['', [Validators.required, Validators.minLength(5)]],
    secretIdentity: [''],
    weakness: [''],
    isActive: [true],
  });

  ngOnInit(): void {
    this.heroId = this.activeRoute.snapshot.paramMap.get('id');

    // if edit, load hero data and set the form
    if (this.isEditMode) {
      this.heroService.getHeroById(this.heroId!).subscribe((hero) => {
        if (hero) {
          this.heroForm.patchValue(hero);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.heroForm.invalid) {
      return;
    }

    const request$ = this.isEditMode
      ? this.heroService.updateHero({ ...this.heroForm.getRawValue(), id: this.heroId! })
      : this.heroService.addHero(this.heroForm.getRawValue());

    request$.subscribe(() => this.router.navigate(['/heroes']));
  }

  onCancel(): void {
    this.router.navigate(['/heroes']);
  }
}
