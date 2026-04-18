import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PaginatedCollection } from '@app/types/collection';
import { NotificationService } from '@core/notification/notification.service';
import {
  Datatable,
  DatatableAction,
  DatatableColumn,
  EMPTY_COLLECTION,
} from '@shared/datatable/datatable';
import { TournamentService } from './tournament.service';
import type { Tournament } from '@app/types';

@Component({
  selector: 'app-tournaments',
  imports: [MatButtonModule, MatIconModule, Datatable],
  templateUrl: './tournaments.html',
  styleUrl: './tournaments.scss',
})
export class Tournaments {
  private router = inject(Router);
  private notification = inject(NotificationService);
  private tournamentService = inject(TournamentService);
  private pageIndex = signal(0);
  private pageSize = signal(10);
  private reload = signal(0);

  tournaments = signal<PaginatedCollection<Tournament>>(EMPTY_COLLECTION);

  tournamentColumns: DatatableColumn<Tournament>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      key: 'startDate',
      header: 'Start Date',
      cell: (ev) => new Date(ev.startDate).toLocaleDateString(),
    },
    { key: 'endDate', header: 'End Date', cell: (ev) => new Date(ev.endDate).toLocaleDateString() },
    {
      key: 'createdAt',
      header: 'Created At',
      cell: (ev) => new Date(ev.createdAt).toLocaleString(),
    },
    {
      key: 'updatedAt',
      header: 'Updated At',
      cell: (ev) => new Date(ev.updatedAt).toLocaleString(),
    },
  ];
  tournamentActions: DatatableAction<Tournament>[] = [
    { label: 'View', icon: 'view', onClick: (ev) => this.router.navigate(['/tournaments', ev.id]) },
    {
      label: 'Edit',
      icon: 'edit',
      onClick: (ev) => this.router.navigate(['/tournaments', ev.id, 'edit']),
    },
    { label: 'Delete', icon: 'delete', onClick: (ev) => this.deleteTournament(ev) },
  ];

  constructor() {
    effect((onCleanup) => {
      this.reload();
      const page = this.pageIndex();
      const size = this.pageSize();

      const sub = this.tournamentService.getMany(page, size).subscribe({
        next: (res) => this.tournaments.set(res),
        error: (err) => this.notification.error(err?.error?.message || err.message),
      });

      onCleanup(() => sub.unsubscribe());
    });
  }

  onPageChange(e: { pageIndex: number; pageSize: number }) {
    this.pageIndex.set(e.pageIndex);
    this.pageSize.set(e.pageSize);
  }

  createTournament() {
    this.router.navigate(['/tournaments', 'new']);
  }

  editTournament(tournament: Tournament) {
    this.router.navigate(['/tournaments', tournament.id, 'edit']);
  }

  deleteTournament(tournament: Tournament) {
    this.tournamentService.delete(tournament.id).subscribe({
      next: () => {
        this.notification.success('Deleted');
        this.pageIndex.set(0);
        this.reload.update((r) => r + 1);
      },
      error: (err) => this.notification.error(err.message),
    });
  }
}
