import { AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HeroService } from '../../../services/hero.service';
import { Hero } from '../../../models/hero.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  selector: 'app-hero-list',
  styleUrl: './hero-list.scss',
  templateUrl: './hero-list.html',
})
export class HeroList implements OnInit, AfterViewInit {
  private readonly heroService = inject(HeroService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly dataSource = new MatTableDataSource<Hero>([]);
  readonly displayedColumns = [
    'name',
    'power',
    'secretIdentity',
    'weakness',
    'isActive',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngOnInit() {
    this.heroService
      .getHeroes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((heroes) => {
        this.dataSource.data = heroes;
      });
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  onEdit(hero: Hero) {
    this.router.navigate(['/heroes/', hero.id, 'edit']);
  }

  onDelete(hero: Hero) {
    // Implementation for deleting a hero
  }
}
