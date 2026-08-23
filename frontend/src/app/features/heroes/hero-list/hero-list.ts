import { AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HeroService } from '../../../services/hero.service';
import { Hero } from '../../../models/hero.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
  selector: 'app-hero-list',
  styleUrl: './hero-list.scss',
  templateUrl: './hero-list.html',
})
export class HeroList implements OnInit, AfterViewInit {
  private readonly heroService = inject(HeroService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);

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
    // Implementation for editing a hero
  }

  onDelete(hero: Hero): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: { message: `Are you sure you want to delete ${hero.name}?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.heroService.deleteHero(hero.id).subscribe();
      }
    });
  }
}
