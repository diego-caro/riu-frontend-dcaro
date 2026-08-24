import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HeroService } from '../../../services/hero.service';
import { Hero } from '../../../models/hero.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@Component({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
  ],
  selector: 'app-hero-list',
  styleUrl: './hero-list.scss',
  templateUrl: './hero-list.html',
})
export class HeroList implements OnInit, AfterViewInit {
  private readonly heroService = inject(HeroService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

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

  searchControl = new FormControl('');

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
        switchMap((term) => this.heroService.searchHeroesByName(term ?? '')),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((heroes) => {
        this.dataSource.data = heroes;
        this.changeDetectorRef.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  onAdd(): void {
    this.router.navigate(['/heroes', 'new']);
  }

  onEdit(hero: Hero): void {
    this.router.navigate(['/heroes', hero.id, 'edit']);
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
