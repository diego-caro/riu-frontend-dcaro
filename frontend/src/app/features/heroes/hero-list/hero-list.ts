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
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, startWith, switchMap } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTooltipModule
  ],
  selector: 'app-hero-list',
  styleUrl: './hero-list.scss',
  templateUrl: './hero-list.html',
})
export class HeroList implements OnInit, AfterViewInit {
  private readonly _heroService = inject(HeroService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _dialog = inject(MatDialog);
  private readonly _router = inject(Router);
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

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
        switchMap((term) => this._heroService.searchHeroesByName(term ?? '')),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((heroes) => {
        this.dataSource.data = heroes;
        this._changeDetectorRef.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  onAdd(): void {
    this._router.navigate(['/heroes', 'new']);
  }

  onEdit(hero: Hero): void {
    this._router.navigate(['/heroes', hero.id, 'edit']);
  }

  onDelete(hero: Hero): void {
    this._dialog
      .open(ConfirmDialog, {
        data: { message: `Are you sure you want to delete ${hero.name}?` },
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this._heroService.deleteHero(hero.id)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }
}
