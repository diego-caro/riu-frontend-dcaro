import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'heroes', pathMatch: 'full' },
  {
    path: 'heroes',
    loadComponent: () => import('./features/heroes/hero-list/hero-list').then((m) => m.HeroList),
  },
  {
    path: 'heroes/new',
    loadComponent: () =>
      import('./features/heroes/hero-editor/hero-editor').then((m) => m.HeroEditor),
  },
  {
    path: 'heroes/:id/edit',
    loadComponent: () =>
      import('./features/heroes/hero-editor/hero-editor').then((m) => m.HeroEditor),
  },
  { path: '**', redirectTo: 'heroes' },
];
