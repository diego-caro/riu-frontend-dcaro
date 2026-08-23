import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'heroes', pathMatch: 'full' },
  {
    path: 'heroes',
    loadComponent: () => import('./features/heroes/hero-list/hero-list').then((m) => m.HeroList),
  },
];
